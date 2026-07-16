/* global Buffer, module, require */

const { spawn } = require("node:child_process");
const { mkdtemp, readFile, rm, stat } = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const ffmpegPath = require("ffmpeg-static");
const sharp = require("sharp");

const resizeTargets = new Map([
  ["postcard.webp", { width: 1000 }],
  ["soma.webp", { width: 1000 }],
  ["siyay.webp", { width: 1600 }],
]);
const videoTargets = new Set(["varwin-opening.mp4"]);
const supportedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

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

  const resize = resizeTargets.get(path.basename(resourcePath));
  let pipeline = sharp(content, { animated: true }).rotate();

  if (resize) {
    pipeline = pipeline.resize({ ...resize, withoutEnlargement: true });
  }

  if (extension === ".webp") {
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
  if (!videoTargets.has(path.basename(resourcePath))) return content;

  const tempDir = await mkdtemp(path.join(os.tmpdir(), "port-heaven-media-"));
  const outputPath = path.join(tempDir, "optimized.mp4");

  try {
    await runFfmpeg([
      "-y",
      "-i",
      resourcePath,
      "-vf",
      "scale=min(1280\\,iw):-2",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "30",
      "-an",
      "-movflags",
      "+faststart",
      outputPath,
    ]);

    const optimizedSize = (await stat(outputPath)).size;
    return optimizedSize < content.length ? readFile(outputPath) : content;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
};

function optimizeMediaLoader(content) {
  const callback = this.async();
  const extension = path.extname(this.resourcePath).toLowerCase();
  const optimize = extension === ".mp4" ? optimizeVideo : optimizeImage;

  optimize(content, this.resourcePath).then(
    (optimized) => callback(null, optimized),
    (error) => callback(error),
  );
}

optimizeMediaLoader.raw = true;

module.exports = optimizeMediaLoader;
