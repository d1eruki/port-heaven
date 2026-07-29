import { readdir } from "node:fs/promises";
import path from "node:path";

const sourceRoots = ["src/index.html", "src/js", "src/styles"];
const supportedSourceExtensions = new Set([".css", ".html", ".js", ".vue"]);

const collectSourceFiles = async (entryPath) => {
  const entries = await readdir(entryPath, { withFileTypes: true }).catch(() => null);
  if (!entries) return supportedSourceExtensions.has(path.extname(entryPath)) ? [entryPath] : [];

  const nestedFiles = await Promise.all(
    entries.map((entry) => collectSourceFiles(path.join(entryPath, entry.name))),
  );
  return nestedFiles.flat();
};

export const collectProjectSourceFiles = async () =>
  (await Promise.all(sourceRoots.map(collectSourceFiles))).flat();
