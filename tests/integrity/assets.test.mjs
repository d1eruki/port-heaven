import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";
import { collectProjectSourceFiles } from "./source-files.mjs";
import sharp from "sharp";

const assetPathPattern = /assets\/[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=%{}-]+/g;
const globSyntaxPattern = /[{}*]/;

const normalizeAssetPath = (assetPath) => assetPath.split(/[?#]/, 1)[0];

test("string asset references point to existing source assets", async () => {
  const sourceFiles = await collectProjectSourceFiles();
  const references = new Map();

  for (const filePath of sourceFiles) {
    const source = await readFile(filePath, "utf8");
    const matches = source.matchAll(assetPathPattern);

    for (const match of matches) {
      if (globSyntaxPattern.test(match[0])) continue;

      const assetPath = normalizeAssetPath(match[0]);
      if (!references.has(assetPath)) references.set(assetPath, new Set());
      references.get(assetPath).add(filePath);
    }
  }

  const missing = [];

  for (const [assetPath, files] of references) {
    const sourceAssetPath = path.join("src", assetPath);

    try {
      await access(sourceAssetPath);
    } catch {
      missing.push(`${assetPath} referenced from ${Array.from(files).sort().join(", ")}`);
    }
  }

  assert.deepEqual(missing, []);
});

test("creative IDs are unique and every image has usable dimensions", async () => {
  const ids = new Set();
  const supported = /\.(avif|jpe?g|mp4|ogg|png|webm|webp)$/i;
  for (const priority of [1, 2, 3]) {
    const directory = `src/assets/creatives/priority-${priority}`;
    for (const name of await readdir(directory)) {
      if (!supported.test(name)) continue;
      const id = path.basename(name, path.extname(name));
      assert.ok(!ids.has(id), `Duplicate creative ID: ${id}`);
      ids.add(id);
      if (/\.(mp4|ogg|webm)$/i.test(name)) continue;
      const metadata = await sharp(path.join(directory, name), { animated: true }).metadata();
      const { width, height } = metadata.autoOrient;
      assert.ok(width > 0 && height > 0, `Missing image dimensions: ${name}`);
    }
  }
  assert.ok(ids.size > 0, "The creative collection must not be empty");
});
