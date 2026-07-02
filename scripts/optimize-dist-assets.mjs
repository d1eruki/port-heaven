import { readdir, rename, stat, unlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const assetsDir = path.join(rootDir, "dist", "assets");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const resizeTargets = new Map([
  ["dist/assets/creatives/postcard.webp", { width: 1000 }],
  ["dist/assets/soma.webp", { width: 1000 }],
  ["dist/assets/creatives/siyay.webp", { width: 1600 }],
]);
const videoTargets = ["dist/assets/creatives/varwin-opening.mp4"];

const formatBytes = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;

const collectImages = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectImages(fullPath);
      if (!entry.isFile()) return [];

      const ext = path.extname(entry.name).toLowerCase();
      return supportedExtensions.has(ext) ? [fullPath] : [];
    }),
  );

  return files.flat();
};

const optimizeImage = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const relativePath = path.relative(rootDir, filePath);
  const resizeTarget = resizeTargets.get(relativePath);
  const before = (await stat(filePath)).size;
  const tempPath = `${filePath}.tmp`;

  let pipeline = sharp(filePath, { animated: true }).rotate();
  if (resizeTarget) {
    pipeline = pipeline.resize({ ...resizeTarget, withoutEnlargement: true });
  }

  if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: 78, effort: 6, smartSubsample: true });
  } else if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  }

  await pipeline.toFile(tempPath);

  const after = (await stat(tempPath)).size;
  if (after >= before) {
    await unlink(tempPath);
    return { filePath, before, after: before, changed: false };
  }

  await rename(tempPath, filePath);
  return { filePath, before, after, changed: true };
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

const optimizeVideo = async (relativePath) => {
  const filePath = path.join(rootDir, relativePath);
  const before = (await stat(filePath)).size;
  const tempPath = `${filePath}.tmp.mp4`;

  await runFfmpeg([
    "-y",
    "-i",
    filePath,
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
    tempPath,
  ]);

  const after = (await stat(tempPath)).size;
  if (after >= before) {
    await unlink(tempPath);
    return { filePath, before, after: before, changed: false };
  }

  await rename(tempPath, filePath);
  return { filePath, before, after, changed: true };
};

const main = async () => {
  const images = await collectImages(assetsDir);
  const imageResults = await Promise.all(images.map((filePath) => optimizeImage(filePath)));
  const videoResults = await Promise.all(videoTargets.map((filePath) => optimizeVideo(filePath)));
  const results = [...imageResults, ...videoResults];
  const changed = results.filter((result) => result.changed);
  const imageChanged = imageResults.filter((result) => result.changed);
  const videoChanged = videoResults.filter((result) => result.changed);
  const saved = changed.reduce((total, result) => total + result.before - result.after, 0);

  changed.forEach((result) => {
    const relativePath = path.relative(rootDir, result.filePath);
    console.log(`${relativePath}: ${formatBytes(result.before)} -> ${formatBytes(result.after)}`);
  });

  console.log(
    `Optimized ${imageChanged.length}/${imageResults.length} image(s) and ${videoChanged.length}/${videoResults.length} video(s), saved ${formatBytes(saved)}.`,
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
