import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

const sourceRoots = ["src/index.html", "src/js", "src/styles"];
const supportedSourceExtensions = new Set([".css", ".html", ".js", ".vue"]);
const assetPathPattern = /assets\/[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=%-]+/g;

const collectSourceFiles = async (entryPath) => {
  const entries = await readdir(entryPath, { withFileTypes: true }).catch(() => null);
  if (!entries) return supportedSourceExtensions.has(path.extname(entryPath)) ? [entryPath] : [];

  const nestedFiles = await Promise.all(
    entries.map((entry) => collectSourceFiles(path.join(entryPath, entry.name))),
  );
  return nestedFiles.flat();
};

const normalizeAssetPath = (assetPath) => assetPath.split(/[?#]/, 1)[0];

test("string asset references point to existing source assets", async () => {
  const sourceFiles = (await Promise.all(sourceRoots.map(collectSourceFiles))).flat();
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
