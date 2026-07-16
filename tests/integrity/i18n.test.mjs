import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

const readJson = async (filePath) => JSON.parse(await readFile(filePath, "utf8"));

const valueType = (value) => {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
};

const compareLocaleShape = (source, target, path = []) => {
  const currentPath = path.join(".") || "<root>";
  const sourceType = valueType(source);
  const targetType = valueType(target);

  assert.equal(targetType, sourceType, `${currentPath}: expected ${sourceType}, got ${targetType}`);

  if (sourceType === "array") {
    assert.equal(
      target.length,
      source.length,
      `${currentPath}: expected array length ${source.length}, got ${target.length}`,
    );

    source.forEach((sourceItem, index) => {
      compareLocaleShape(sourceItem, target[index], [...path, `[${index}]`]);
    });
    return;
  }

  if (sourceType !== "object") return;

  const sourceKeys = Object.keys(source).sort();
  const targetKeys = Object.keys(target).sort();

  assert.deepEqual(targetKeys, sourceKeys, `${currentPath}: locale keys differ`);

  sourceKeys.forEach((key) => {
    compareLocaleShape(source[key], target[key], [...path, key]);
  });
};

test("English locale matches Russian locale shape", async () => {
  const ru = await readJson("src/locales/ru.json");
  const en = await readJson("src/locales/en.json");

  compareLocaleShape(ru, en);
});
