import { access, readFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";
import { collectProjectSourceFiles } from "./source-files.mjs";

const assetPathPattern = /assets\/[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=%-]+/g;

const normalizeAssetPath = (assetPath) => assetPath.split(/[?#]/, 1)[0];

test("string asset references point to existing source assets", async () => {
  const sourceFiles = await collectProjectSourceFiles();
  const references = new Map();

  for (const filePath of sourceFiles) {
    const source = await readFile(filePath, "utf8");
    const matches = source.matchAll(assetPathPattern);

    for (const match of matches) {
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
