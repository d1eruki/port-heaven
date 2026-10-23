import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { realpathSync } from "node:fs";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";
import { createMediaCache } from "./media-cache.mjs";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const formatsModule = fileURLToPath(
  new URL("../../src/js/utils/image-formats.js", import.meta.url),
);
const imageProfiles = {
  avif: { quality: 55, effort: 4, chromaSubsampling: "4:4:4" },
  webp: { quality: 82, effort: 4, alphaQuality: 100 },
  lossless: { lossless: true, effort: 6, exact: true },
};

const resizeTargets = new Map([
  ["2025-artem-y.webp", { width: 1000 }],
  ["siyay.webp", { width: 1600 }],
]);
const supportedImageExtensions = new Set([".avif", ".jpg", ".jpeg", ".png", ".webp"]);
const supportedVideoExtensions = new Set([".mp4", ".ogg", ".webm"]);
const supportedMediaExtensions = new Set([
  ...supportedImageExtensions,
  ...supportedVideoExtensions,
]);
const priorityDirectoryPattern = /[\\/]priority-[123][\\/]/;
const videoEncodingByExtension = {
  ".mp4": [
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "28",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "96k",
    "-movflags",
    "+faststart",
  ],
  ".webm": [
    "-c:v",
    "libvpx-vp9",
    "-deadline",
    "good",
    "-cpu-used",
    "3",
    "-crf",
    "35",
    "-b:v",
    "0",
    "-c:a",
    "libopus",
    "-b:a",
    "96k",
  ],
  ".ogg": ["-c:v", "libtheora", "-q:v", "5", "-c:a", "libvorbis", "-q:a", "4"],
};

const runFfmpeg = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    const errors = [];

    child.stderr.on("data", (chunk) => errors.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(Buffer.concat(errors).toString("utf8") || `ffmpeg exited with ${code}`));
    });
  });

const isFavicon = (resourcePath) =>
  /^favicon-(?:dark|light)\.png$/.test(path.basename(resourcePath));

const getImageResize = (resourcePath) => {
  if (isFavicon(resourcePath)) {
    return { width: 64, height: 64, fit: "contain", background: "#00000000" };
  }
  return (
    resizeTargets.get(path.basename(resourcePath)) ??
    (priorityDirectoryPattern.test(resourcePath)
      ? { width: 1920, height: 1920, fit: "inside" }
      : undefined)
  );
};

const optimizeImage = async (content, resourcePath, metadata) => {
  // Preserve animated sources, including every frame and its timing.
  if ((metadata.pages ?? 1) > 1) return content;
  const extension = path.extname(resourcePath).toLowerCase();
  const resize = getImageResize(resourcePath);
  let pipeline = sharp(content).rotate();
  if (resize) pipeline = pipeline.resize({ ...resize, withoutEnlargement: true });

  // Existing lossy web formats are reused unless their dimensions need changing.
  const needsResize =
    resize &&
    (metadata.autoOrient.width > resize.width ||
      metadata.autoOrient.height > (resize.height ?? Infinity) ||
      resize.fit === "contain");
  if (!needsResize && [".webp", ".avif", ".jpg", ".jpeg"].includes(extension)) return content;
  if (extension === ".avif") pipeline = pipeline.avif(imageProfiles.avif);
  else if (extension === ".webp") pipeline = pipeline.webp(imageProfiles.webp);
  else if (extension === ".jpg" || extension === ".jpeg")
    pipeline = pipeline.jpeg({ quality: 90, mozjpeg: true });
  else pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });

  const optimized = await pipeline.toBuffer();
  return needsResize || optimized.length < content.length ? optimized : content;
};

const optimizeVideo = async (content, resourcePath) => {
  const extension = path.extname(resourcePath).toLowerCase();
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "port-heaven-media-"));
  const outputPath = path.join(tempDir, `optimized${extension}`);

  try {
    await runFfmpeg([
      "-y",
      "-i",
      resourcePath,
      "-map",
      "0:v:0",
      "-map",
      "0:a:0?",
      "-vf",
      "scale=w=min(1280\\,iw):h=min(1280\\,ih):force_original_aspect_ratio=decrease:force_divisible_by=2",
      ...videoEncodingByExtension[extension],
      outputPath,
    ]);

    const optimizedSize = (await stat(outputPath)).size;
    return optimizedSize < content.length ? await readFile(outputPath) : content;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
};

export const optimizeMediaPlugin = ({ assetsRoot }) => {
  const assetsRootAlias = `${path.resolve(assetsRoot)}${path.sep}`;
  let normalizedAssetsRoot = assetsRootAlias;
  try {
    normalizedAssetsRoot = `${realpathSync(assetsRoot)}${path.sep}`;
  } catch {
    // Projects without an assets directory have no image imports to intercept.
  }
  let isBuild = false;
  let cache;
  let videoVersion;
  let getFileName;
  let buildBase;
  let formatsReference;
  const emitted = new Map();
  const managedReferences = new Set();
  const preparedImages = new Map();

  const prepareImageContent = async (content, resourcePath) => {
    const metadata = await sharp(content, { animated: true }).metadata();
    const resize = getImageResize(resourcePath);
    const keepOriginalFormat = isFavicon(resourcePath) || (metadata.pages ?? 1) > 1;
    const fallback =
      isBuild && keepOriginalFormat
        ? await cache.get(
            content,
            { kind: "fallback", extension: path.extname(resourcePath), resize },
            () => optimizeImage(content, resourcePath, metadata),
          )
        : content;
    let { width, height } = metadata.autoOrient;
    if (isBuild && resize && !keepOriginalFormat) {
      const scale = Math.min(
        1,
        (resize.width ?? width) / width,
        (resize.height ?? height) / height,
      );
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
    } else if (isBuild && keepOriginalFormat) {
      ({ width, height } = (await sharp(fallback, { animated: true }).metadata()).autoOrient);
    }
    if (!width || !height) throw new Error(`Missing image dimensions: ${resourcePath}`);
    return { content, metadata, fallback, width, height };
  };

  const prepareImage = (resourcePath) => {
    if (!preparedImages.has(resourcePath)) {
      preparedImages.set(
        resourcePath,
        readFile(resourcePath).then((content) => prepareImageContent(content, resourcePath)),
      );
    }
    return preparedImages.get(resourcePath);
  };

  const emitAsset = (context, resourcePath, source, suffix = "") => {
    const extension = path.extname(resourcePath);
    const name = suffix
      ? `${path.basename(resourcePath, extension).replace(/[\s,]/g, "-")}${suffix}`
      : path.basename(resourcePath);
    const reference = context.emitFile({ type: "asset", name, source });
    managedReferences.add(reference);
    if (!suffix) emitted.set(resourcePath, reference);
    return `import.meta.ROLLDOWN_FILE_URL_${reference}`;
  };

  const encodeModernImage = (image, width, format, lossless = false) => {
    const options = imageProfiles[lossless ? "lossless" : format];
    const settings = {
      kind: "responsive",
      width,
      format,
      options,
    };
    return cache.get(image.content, settings, () => {
      if (
        format === "webp" &&
        !lossless &&
        image.metadata.format === "webp" &&
        width === image.metadata.autoOrient.width
      )
        return image.content;
      const pipeline = sharp(image.content).rotate().resize({ width, withoutEnlargement: true });
      return (format === "avif" ? pipeline.avif(options) : pipeline.webp(options)).toBuffer();
    });
  };

  const needsFormatPair = (image, resourcePath) =>
    !isFavicon(resourcePath) && (image.metadata.pages ?? 1) === 1;

  const emitFormats = async (context, image, resourcePath, width = image.width) => {
    const entries = await Promise.all(
      ["avif", "webp"].map(async (format) => {
        const content = await encodeModernImage(image, width, format);
        return [format, emitAsset(context, resourcePath, content, `-${width}.${format}`)];
      }),
    );
    return Object.fromEntries(entries);
  };

  return {
    name: "port-heaven-optimize-media",
    enforce: "pre",
    configResolved(config) {
      isBuild = config.command === "build";
      buildBase = config.base ?? "./";
      if (isBuild) {
        cache = createMediaCache({
          directory: path.join(
            config.root ?? assetsRoot,
            "node_modules/.cache/port-heaven-media/media",
          ),
          versions: { profile: 3, sharp: sharp.versions },
        });
      }
    },
    buildStart() {
      cache?.start();
      preparedImages.clear();
      emitted.clear();
      managedReferences.clear();
      getFileName = (reference) => this.getFileName(reference);
      if (isBuild && typeof this.emitFile === "function") {
        formatsReference = this.emitFile({
          type: "chunk",
          id: formatsModule,
          name: "image-formats",
          preserveSignature: "strict",
        });
      }
    },
    watchChange(id) {
      preparedImages.delete(id.split("?", 1)[0]);
    },
    async load(id) {
      const [resourcePath, query = ""] = id.split("?");
      const extension = path.extname(resourcePath).toLowerCase();
      if (
        (!resourcePath.startsWith(normalizedAssetsRoot) &&
          !resourcePath.startsWith(assetsRootAlias)) ||
        !supportedMediaExtensions.has(extension)
      ) {
        return null;
      }
      const parameters = new URLSearchParams(query);
      if (parameters.has("raw")) return null;
      const isImage = supportedImageExtensions.has(extension);
      const responsive = parameters.has("responsive");
      const metadataRequested = parameters.has("metadata");
      const lossless = parameters.has("lossless");
      if (
        lossless &&
        (responsive || metadataRequested || parameters.has("width") || parameters.has("original"))
      ) {
        this.error("Lossless images cannot be resized or combined with original/responsive mode");
      }
      if (!isBuild && !responsive && !metadataRequested) return null;
      this.addWatchFile(resourcePath);
      if (parameters.has("original")) {
        return isBuild
          ? `export default ${emitAsset(this, resourcePath, await readFile(resourcePath))};`
          : null;
      }
      if (lossless && isImage) {
        const content = await readFile(resourcePath);
        const metadata = await sharp(content, { animated: true }).metadata();
        if ((metadata.pages ?? 1) > 1)
          this.error("Lossless mode currently supports still images only");
        const image = { content, metadata };
        const source = await encodeModernImage(image, metadata.autoOrient.width, "webp", true);
        return `export default ${emitAsset(this, resourcePath, source, ".webp")};`;
      }

      if (metadataRequested || responsive) {
        if (!isImage) return null;
        const image = await prepareImage(resourcePath);
        const dimensions = { width: image.width, height: image.height };
        if (metadataRequested) return `export default ${JSON.stringify(dimensions)};`;
        if (!isBuild) {
          return `import src from ${JSON.stringify(`${resourcePath}?url`)}; export default { src, sources: [], ...${JSON.stringify(dimensions)} };`;
        }
        if (!needsFormatPair(image, resourcePath)) {
          return `export default { src: ${emitAsset(this, resourcePath, image.fallback)}, sources: [], ...${JSON.stringify(dimensions)} };`;
        }
        const sources = [];
        const registrations = [];
        let src;
        {
          const widths = [
            ...new Set([320, 640, 960, 1280, image.width].filter((width) => width <= image.width)),
          ];
          const variants = await Promise.all(
            widths.map(async (width) => ({
              width,
              formats: await emitFormats(this, image, resourcePath, width),
            })),
          );
          for (const { width, formats } of variants) {
            registrations.push(`registerImageFormats(${formats.avif}, ${formats.webp});`);
            if (width === image.width) src = formats.webp;
          }
          for (const format of ["avif", "webp"]) {
            const candidates = variants.map(
              ({ width, formats }) => `${formats[format]} + ${JSON.stringify(` ${width}w`)}`,
            );
            sources.push(
              `{ type: "image/${format}", srcset: [${candidates.join(",")}].join(", ") }`,
            );
          }
        }
        return `import { registerImageFormats } from ${JSON.stringify(formatsModule)};
${registrations.join("\n")}
export default { src: ${src}, sources: [${sources.join(",")}], ...${JSON.stringify(dimensions)} };`;
      }

      if (isImage) {
        const image = await prepareImage(resourcePath);
        if (!needsFormatPair(image, resourcePath)) {
          return `export default ${emitAsset(this, resourcePath, image.fallback)};`;
        }
        const formats = await emitFormats(this, image, resourcePath);
        return `import { registerImageFormats } from ${JSON.stringify(formatsModule)};
export default registerImageFormats(${formats.avif}, ${formats.webp});`;
      }
      const content = await readFile(resourcePath);
      videoVersion ??= readFile(ffmpegPath).then((binary) =>
        createHash("sha256").update(binary).digest("hex"),
      );
      const optimized = await cache.get(
        content,
        {
          kind: "video",
          extension,
          codec: videoEncodingByExtension[extension],
          maxDimension: 1280,
          ffmpeg: require("ffmpeg-static/package.json").version,
          binary: await videoVersion,
        },
        () => optimizeVideo(content, resourcePath),
      );
      return `export default ${emitAsset(this, resourcePath, optimized)};`;
    },
    transformIndexHtml: {
      order: "post",
      async handler(html, context) {
        if (!isBuild || !context.bundle) return html;
        const file = path.join(normalizedAssetsRoot, "favicons", "favicon-light.png");
        const reference = emitted.get(file);
        if (!reference) return html;
        const target = getFileName(reference);
        const original = await readFile(file);
        return html.replace(/<link\b(?=[^>]*\brel=["']icon["'])[^>]*>/gi, (tag) =>
          tag.replace(/href=(["'])([^"']+)\1/i, (_, quote, previous) => {
            const previousName = previous.startsWith(buildBase)
              ? previous.slice(buildBase.length)
              : previous;
            const oldAsset = context.bundle[previousName];
            if (
              previousName !== target &&
              oldAsset?.type === "asset" &&
              Buffer.from(oldAsset.source).equals(original)
            ) {
              delete context.bundle[previousName];
            }
            return `href=${quote}${buildBase}${target}${quote}`;
          }),
        );
      },
    },
    generateBundle: {
      order: "post",
      async handler(_options, bundle) {
        if (!isBuild) return;
        const managedNames = new Set(
          [...managedReferences].map((reference) => this.getFileName(reference)),
        );
        const replacements = new Map();
        // Vite emits HTML/CSS URL assets directly, without invoking our load hook.
        for (const [fileName, asset] of Object.entries(bundle)) {
          if (
            asset.type !== "asset" ||
            managedNames.has(fileName) ||
            !supportedImageExtensions.has(path.extname(fileName).toLowerCase())
          )
            continue;
          const resourcePath = asset.originalFileNames?.[0] || asset.names?.[0] || fileName;
          const content = Buffer.from(asset.source);
          const image = await prepareImageContent(content, resourcePath);
          if (!needsFormatPair(image, resourcePath)) continue;
          const pair = {};
          for (const format of ["avif", "webp"]) {
            const source = await encodeModernImage(image, image.width, format);
            const digest = createHash("sha256").update(source).digest("hex").slice(0, 8);
            const newName = `${fileName.slice(0, -path.extname(fileName).length)}.${digest}.${format}`;
            const duplicate = Object.values(bundle).find(
              (entry) =>
                entry.type === "asset" &&
                path.extname(entry.fileName) === `.${format}` &&
                Buffer.from(entry.source).equals(source),
            );
            pair[format] = duplicate?.fileName || newName;
            if (!duplicate) this.emitFile({ type: "asset", fileName: newName, source });
          }
          replacements.set(fileName, pair);
          delete bundle[fileName];
        }
        for (const entry of Object.values(bundle)) {
          if (entry.type !== "chunk" && !/\.(?:css|html|json)$/.test(entry.fileName)) continue;
          let text =
            entry.type === "chunk" ? entry.code : Buffer.from(entry.source).toString("utf8");
          const relative = (file) => {
            const value = path.posix.relative(path.posix.dirname(entry.fileName), file);
            return value.startsWith(".") ? value : `./${value}`;
          };
          const resolveUrl = (url) =>
            url.startsWith(buildBase) && buildBase !== "./"
              ? url.slice(buildBase.length)
              : path.posix.normalize(path.posix.join(path.posix.dirname(entry.fileName), url));
          if (entry.fileName.endsWith(".css")) {
            text = text.replace(/url\(\s*(["']?)([^"'\s)]+)\1\s*\)/g, (original, _quote, url) => {
              const pair = replacements.get(resolveUrl(url));
              return pair
                ? `image-set(url(${JSON.stringify(relative(pair.avif))}) type("image/avif"), url(${JSON.stringify(relative(pair.webp))}) type("image/webp"))`
                : original;
            });
          } else if (entry.fileName.endsWith(".html")) {
            text = text
              .replace(/<img\b[^>]*>/gi, (tag) =>
                tag.replace(/\bsrc=(["'])(.*?)\1/i, (attribute, quote, url) => {
                  const pair = replacements.get(resolveUrl(url));
                  return pair
                    ? `src=${quote}${relative(pair.webp)}${quote} data-image-avif=${quote}${relative(pair.avif)}${quote}`
                    : attribute;
                }),
              )
              .replace(
                /<img\b([^>]*?)\sdata-image-avif=(["'])(.*?)\2([^>]*)>/gi,
                (_tag, before, _quote, avif, after) =>
                  `<picture style="display:contents"><source type="image/avif" srcset="${avif}"><img${before}${after}></picture>`,
              );
            if (replacements.size && formatsReference) {
              const registrations = [...replacements.values()]
                .map(
                  (pair) =>
                    `registerImageFormats(${JSON.stringify(relative(pair.avif))}, ${JSON.stringify(relative(pair.webp))});`,
                )
                .join("\n");
              const script = `<script type="module">import { registerImageFormats } from ${JSON.stringify(relative(this.getFileName(formatsReference)))};\n${registrations}</script>`;
              text = script + "\n" + text;
            }
          }
          // Ordinary URL expressions (e.g. new URL(..., import.meta.url)) keep a URL string.
          for (const [previous, pair] of replacements) {
            const target = entry.type === "chunk" ? pair.avif : pair.webp;
            text = text.replaceAll(previous, target);
            const directory = path.posix.dirname(entry.fileName);
            text = text.replaceAll(
              path.posix.relative(directory, previous),
              path.posix.relative(directory, target),
            );
          }
          if (entry.type === "chunk") entry.code = text;
          else entry.source = text;
        }
      },
    },
    async closeBundle() {
      if (cache) await cache.prune();
    },
  };
};
