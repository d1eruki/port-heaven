import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";
import { createMediaCache } from "./media-cache.mjs";

const require = createRequire(import.meta.url);

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

const getImageResize = (resourcePath) => {
  if (/^favicon-(?:dark|light)\.png$/.test(path.basename(resourcePath))) {
    return { width: 64, height: 64, fit: "contain", background: "#00000000" };
  }
  return resizeTargets.get(path.basename(resourcePath)) ??
    (priorityDirectoryPattern.test(resourcePath)
      ? { width: 1920, height: 1920, fit: "inside" }
      : undefined);
};

const optimizeImage = async (content, resourcePath, metadata) => {
  // Preserve animated sources, including every frame and its timing.
  if ((metadata.pages ?? 1) > 1) return content;
  const extension = path.extname(resourcePath).toLowerCase();
  const resize = getImageResize(resourcePath);
  let pipeline = sharp(content).rotate();
  if (resize) pipeline = pipeline.resize({ ...resize, withoutEnlargement: true });

  // Existing lossy web formats are reused unless their dimensions need changing.
  const needsResize = resize && (
    metadata.autoOrient.width > resize.width ||
    metadata.autoOrient.height > (resize.height ?? Infinity) ||
    resize.fit === "contain"
  );
  if (!needsResize && [".webp", ".avif", ".jpg", ".jpeg"].includes(extension)) return content;
  if (extension === ".avif") pipeline = pipeline.avif({ quality: 65, effort: 4, chromaSubsampling: "4:4:4" });
  else if (extension === ".webp") pipeline = pipeline.webp({ quality: 85, effort: 5 });
  else if (extension === ".jpg" || extension === ".jpeg") pipeline = pipeline.jpeg({ quality: 90, mozjpeg: true });
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
  const normalizedAssetsRoot = `${path.resolve(assetsRoot)}${path.sep}`;
  let isBuild = false;
  let cache;
  let videoVersion;
  let getFileName;
  let buildBase;
  const emitted = new Map();
  const preparedImages = new Map();

  const prepareImage = (resourcePath) => {
    if (!preparedImages.has(resourcePath)) {
      preparedImages.set(resourcePath, (async () => {
        const content = await readFile(resourcePath);
        const metadata = await sharp(content, { animated: true }).metadata();
        const resize = getImageResize(resourcePath);
        const fallback = isBuild
          ? await cache.get(content, { kind: "fallback", extension: path.extname(resourcePath), resize },
            () => optimizeImage(content, resourcePath, metadata))
          : content;
        const resultMetadata = await sharp(fallback, { animated: true }).metadata();
        const { width, height } = resultMetadata.autoOrient;
        if (!width || !height) throw new Error(`Missing image dimensions: ${resourcePath}`);
        return { content, metadata, fallback, width, height };
      })());
    }
    return preparedImages.get(resourcePath);
  };

  const emitAsset = (context, resourcePath, source, suffix = "") => {
    const extension = path.extname(resourcePath);
    const name = suffix
      ? `${path.basename(resourcePath, extension).replace(/[\s,]/g, "-")}${suffix}`
      : path.basename(resourcePath);
    const reference = context.emitFile({ type: "asset", name, source });
    if (!suffix) emitted.set(resourcePath, reference);
    return `import.meta.ROLLDOWN_FILE_URL_${reference}`;
  };

  return {
    name: "port-heaven-optimize-media",
    enforce: "pre",
    configResolved(config) {
      isBuild = config.command === "build";
      buildBase = config.base ?? "./";
      if (isBuild) {
        cache = createMediaCache({
          directory: path.join(config.root ?? assetsRoot, "node_modules/.cache/port-heaven-media/media"),
          versions: { profile: 2, sharp: sharp.versions },
        });
      }
    },
    buildStart() {
      cache?.start();
      preparedImages.clear();
      emitted.clear();
      getFileName = (reference) => this.getFileName(reference);
    },
    watchChange(id) {
      preparedImages.delete(id.split("?", 1)[0]);
    },
    async load(id) {
      const [resourcePath, query = ""] = id.split("?");
      const extension = path.extname(resourcePath).toLowerCase();
      if (!resourcePath.startsWith(normalizedAssetsRoot) || !supportedMediaExtensions.has(extension)) {
        return null;
      }
      const parameters = new URLSearchParams(query);
      const isImage = supportedImageExtensions.has(extension);
      const responsive = parameters.has("responsive");
      const metadataRequested = parameters.has("metadata");
      if (!isBuild && !responsive && !metadataRequested) return null;
      this.addWatchFile(resourcePath);

      if (metadataRequested || responsive) {
        if (!isImage) return null;
        const image = await prepareImage(resourcePath);
        const dimensions = { width: image.width, height: image.height };
        if (metadataRequested) return `export default ${JSON.stringify(dimensions)};`;
        if (!isBuild) {
          return `import src from ${JSON.stringify(`${resourcePath}?url`)}; export default { src, sources: [], ...${JSON.stringify(dimensions)} };`;
        }
        const src = emitAsset(this, resourcePath, image.fallback);
        const sources = [];
        if ((image.metadata.pages ?? 1) === 1) {
          const widths = [...new Set([320, 640, 960, 1280, image.width].filter((width) => width <= image.width))];
          for (const format of ["avif", "webp"]) {
            const variants = await Promise.all(widths.map(async (width) => {
              const settings = { kind: "responsive", width, format, quality: format === "avif" ? 65 : 85, effort: 4 };
              const source = await cache.get(image.content, settings, () => {
                let pipeline = sharp(image.content).rotate().resize({ width, withoutEnlargement: true });
                pipeline = format === "avif"
                  ? pipeline.avif({ quality: settings.quality, effort: settings.effort, chromaSubsampling: "4:4:4" })
                  : pipeline.webp({ quality: settings.quality, effort: settings.effort });
                return pipeline.toBuffer();
              });
              // A modern format must not cost more than the compatible fallback.
              if (source.length >= image.fallback.length) return null;
              const url = emitAsset(this, resourcePath, source, `-${width}.${format}`);
              return `${url} + ${JSON.stringify(` ${width}w`)}`;
            }));
            const candidates = variants.filter(Boolean);
            if (candidates.length) sources.push(`{ type: "image/${format}", srcset: [${candidates.join(",")}].join(", ") }`);
          }
        }
        return `export default { src: ${src}, sources: [${sources.join(",")}], ...${JSON.stringify(dimensions)} };`;
      }

      if (isImage) {
        const image = await prepareImage(resourcePath);
        return `export default ${emitAsset(this, resourcePath, image.fallback)};`;
      }
      const content = await readFile(resourcePath);
      videoVersion ??= readFile(ffmpegPath).then((binary) => createHash("sha256").update(binary).digest("hex"));
      const optimized = await cache.get(content, {
        kind: "video", extension, codec: videoEncodingByExtension[extension],
        maxDimension: 1280, ffmpeg: require("ffmpeg-static/package.json").version,
        binary: await videoVersion,
      }, () => optimizeVideo(content, resourcePath));
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
            const previousName = previous.startsWith(buildBase) ? previous.slice(buildBase.length) : previous;
            const oldAsset = context.bundle[previousName];
            if (previousName !== target && oldAsset?.type === "asset" && Buffer.from(oldAsset.source).equals(original)) {
              delete context.bundle[previousName];
            }
            return `href=${quote}${buildBase}${target}${quote}`;
          }),
        );
      },
    },
    async buildEnd(error) {
      if (!error && cache) await cache.prune();
    },
  };
};
