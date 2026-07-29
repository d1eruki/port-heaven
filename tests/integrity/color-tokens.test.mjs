import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

const sourceRoots = ["src/index.html", "src/js", "src/styles"];
const supportedSourceExtensions = new Set([".css", ".html", ".js", ".vue"]);
const primitiveReferenceFiles = new Set([
  "src/styles/themes/dark.css",
  "src/styles/themes/light.css",
  "src/styles/tokens/semantic.css",
]);
const rawUtilityPattern =
  /\b(?:bg|border|decoration|fill|outline|ring|shadow|stroke|text)-(?:black|white|neutral-\d+)\b/g;
const primitiveVariablePattern = /var\(--color-(?:black|white|neutral-\d+)\b/g;
const paletteVariablePattern = /var\(--palette-[^)]+\)/g;

const collectSourceFiles = async (entryPath) => {
  const entries = await readdir(entryPath, { withFileTypes: true }).catch(() => null);
  if (!entries) return supportedSourceExtensions.has(path.extname(entryPath)) ? [entryPath] : [];

  const nestedFiles = await Promise.all(
    entries.map((entry) => collectSourceFiles(path.join(entryPath, entry.name))),
  );
  return nestedFiles.flat();
};

const collectMatches = (source, pattern) => Array.from(source.matchAll(pattern), (match) => match[0]);

test("application colors use semantic or component tokens", async () => {
  const sourceFiles = (await Promise.all(sourceRoots.map(collectSourceFiles))).flat();
  const violations = [];

  for (const filePath of sourceFiles) {
    const source = await readFile(filePath, "utf8");
    const rawUtilities = collectMatches(source, rawUtilityPattern);

    if (rawUtilities.length > 0) {
      violations.push(`${filePath}: raw color utilities: ${[...new Set(rawUtilities)].join(", ")}`);
    }

    if (primitiveReferenceFiles.has(filePath)) continue;

    const primitiveVariables = collectMatches(source, primitiveVariablePattern);
    const paletteVariables = collectMatches(source, paletteVariablePattern);
    const directVariables = [...new Set([...primitiveVariables, ...paletteVariables])];

    if (directVariables.length > 0) {
      violations.push(`${filePath}: direct primitive variables: ${directVariables.join(", ")}`);
    }
  }

  assert.deepEqual(violations, []);
});
