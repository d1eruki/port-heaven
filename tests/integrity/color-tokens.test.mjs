import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";
import { collectProjectSourceFiles } from "./source-files.mjs";

const primitiveReferenceFiles = new Set([
  "src/styles/themes/dark.css",
  "src/styles/themes/light.css",
  "src/styles/tokens/semantic.css",
]);
const rawUtilityPattern =
  /\b(?:bg|border|decoration|fill|outline|ring|shadow|stroke|text)-(?:black|white|neutral-\d+)\b/g;
const primitiveVariablePattern = /var\(--color-(?:black|white|neutral-\d+)\b/g;
const paletteVariablePattern = /var\(--palette-[^)]+\)/g;

const collectMatches = (source, pattern) => Array.from(source.matchAll(pattern), (match) => match[0]);

test("application colors use semantic or component tokens", async () => {
  const sourceFiles = await collectProjectSourceFiles();
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

test("component color tokens reference only semantic tokens", async () => {
  const source = await readFile("src/styles/tokens/components.css", "utf8");
  const componentDefinitions = Array.from(
    source.matchAll(/^\s*(--component-[a-z0-9-]+):\s*([^;]+);/gm),
  );
  const invalidDefinitions = componentDefinitions
    .filter(([, , value]) => !/^var\(--semantic-[a-z0-9-]+\)$/.test(value.trim()))
    .map(([, name, value]) => `${name}: ${value.trim()}`);

  assert.deepEqual(invalidDefinitions, []);
});
