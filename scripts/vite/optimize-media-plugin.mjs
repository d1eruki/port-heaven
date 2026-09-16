import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

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

const optimizeImage = async (content, resourcePath) => {
  const extension = path.extname(resourcePath).toLowerCase();
  if (!supportedImageExtensions.has(extension)) return content;

  const resize =
    resizeTargets.get(path.basename(resourcePath)) ??
    (priorityDirectoryPattern.test(resourcePath)
      ? { width: 1920, height: 1920, fit: "inside" }
      : undefined);
  let pipeline = sharp(content, { animated: true }).rotate();

  if (resize) pipeline = pipeline.resize({ ...resize, withoutEnlargement: true });

  if (extension === ".avif") {
    pipeline = pipeline.avif({ quality: 55, effort: 6 });
  } else if (extension === ".webp") {
    pipeline = pipeline.webp({ quality: 78, effort: 6, smartSubsample: true });
  } else if (extension === ".jpg" || extension === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
  } else if (extension === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  }

  const optimized = await pipeline.toBuffer();
  return optimized.length < content.length ? optimized : content;
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

  return {
    name: "port-heaven-optimize-media",
    apply: "build",
    enforce: "pre",
    async load(id) {
      const resourcePath = id.split("?", 1)[0];
      const extension = path.extname(resourcePath).toLowerCase();
      if (
        !resourcePath.startsWith(normalizedAssetsRoot) ||
        !supportedMediaExtensions.has(extension)
      ) {
        return null;
      }

      const content = await readFile(resourcePath);
      const optimized =
        supportedVideoExtensions.has(extension)
          ? await optimizeVideo(content, resourcePath)
          : await optimizeImage(content, resourcePath);
      const referenceId = this.emitFile({
        type: "asset",
        name: path.basename(resourcePath),
        source: optimized,
      });

      return `export default import.meta.ROLLDOWN_FILE_URL_${referenceId};`;
    },
  };
};
