import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const SOURCE_LOCALE = "ru";
const TARGET_LOCALE = "en";
const sourcePath = path.join(rootDir, "src", "locales", `${SOURCE_LOCALE}.json`);
const targetPath = path.join(rootDir, "src", "locales", `${TARGET_LOCALE}.json`);
const metaPath = path.join(rootDir, "src", "locales", `.${TARGET_LOCALE}.meta.json`);

const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");

const readJson = async (filePath, fallback = undefined) => {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT" && fallback !== undefined) return fallback;
    throw error;
  }
};

const writeJson = async (filePath, value) => {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

const loadEnvFile = async (filePath) => {
  let content;

  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }

  content.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) return;

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    if (key && !process.env[key]) process.env[key] = value;
  });
};

const hashText = (text) => createHash("sha256").update(text).digest("hex");

const getAtPath = (value, keys) => keys.reduce((current, key) => current?.[key], value);

const setAtPath = (target, keys, value) => {
  let current = target;

  keys.slice(0, -1).forEach((key) => {
    if (!current[key] || typeof current[key] !== "object" || Array.isArray(current[key])) {
      current[key] = {};
    }

    current = current[key];
  });

  current[keys.at(-1)] = value;
};

const collectStrings = (value, prefix = []) => {
  if (typeof value === "string") {
    return [{ key: prefix.join("."), path: prefix, value }];
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) return [];

  return Object.entries(value).flatMap(([key, nestedValue]) =>
    collectStrings(nestedValue, [...prefix, key]),
  );
};

const removeStaleKeys = (target, source) => {
  if (!target || typeof target !== "object" || Array.isArray(target)) return;

  Object.keys(target).forEach((key) => {
    if (!(key in source)) {
      delete target[key];
      return;
    }

    removeStaleKeys(target[key], source[key]);
  });
};

const buildSchema = (keys) => ({
  type: "object",
  additionalProperties: false,
  required: ["translations"],
  properties: {
    translations: {
      type: "object",
      additionalProperties: false,
      required: keys,
      properties: Object.fromEntries(keys.map((key) => [key, { type: "string" }])),
    },
  },
});

const extractOutputText = (response) => {
  if (typeof response.output_text === "string") return response.output_text;

  return response.output
    ?.flatMap((item) => item.content || [])
    .map((content) => content.text)
    .filter(Boolean)
    .join("");
};

const translateBatch = async (items) => {
  const model = process.env.OPENAI_TRANSLATION_MODEL || "gpt-5.4-mini";
  const apiUrl = process.env.OPENAI_API_URL || "https://api.openai.com/v1/responses";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions: [
        "Translate Russian portfolio website UI copy into natural English.",
        "Return JSON only and keep every provided key exactly as-is.",
        "Preserve line breaks, bracket wrappers, product names, brand names, metrics, and URLs.",
        "Prefer concise portfolio/editorial English over literal machine translation.",
        "Do not add commentary, markdown, or missing keys.",
      ].join(" "),
      input: JSON.stringify({
        sourceLocale: SOURCE_LOCALE,
        targetLocale: TARGET_LOCALE,
        strings: Object.fromEntries(items.map((item) => [item.key, item.value])),
      }),
      text: {
        format: {
          type: "json_schema",
          name: "locale_translations",
          strict: true,
          schema: buildSchema(items.map((item) => item.key)),
        },
      },
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    const message = payload?.error?.message || response.statusText;
    throw new Error(`OpenAI API request failed: ${message}`);
  }

  const outputText = extractOutputText(payload);
  if (!outputText) throw new Error("OpenAI API response did not contain output text.");

  const parsed = JSON.parse(outputText);
  return parsed.translations;
};

const main = async () => {
  await loadEnvFile(path.join(rootDir, ".env"));
  await loadEnvFile(path.join(rootDir, ".env.local"));

  const source = await readJson(sourcePath);
  const target = await readJson(targetPath, {});
  const meta = await readJson(metaPath, {
    sourceLocale: SOURCE_LOCALE,
    targetLocale: TARGET_LOCALE,
    hashes: {},
  });
  const sourceItems = collectStrings(source);

  const changedItems = sourceItems.filter((item) => {
    const existingTranslation = getAtPath(target, item.path);
    const sourceHash = hashText(item.value);

    return force || typeof existingTranslation !== "string" || meta.hashes[item.key] !== sourceHash;
  });

  if (!changedItems.length) {
    console.log(`${TARGET_LOCALE}.json is up to date.`);
    return;
  }

  console.log(
    `${dryRun ? "Would translate" : "Translating"} ${changedItems.length} string(s): ${changedItems
      .map((item) => item.key)
      .join(", ")}`,
  );

  if (dryRun) return;
  if (!process.env.OPENAI_API_KEY)
    throw new Error("Set OPENAI_API_KEY before running this script.");

  const translations = await translateBatch(changedItems);

  changedItems.forEach((item) => {
    const translated = translations[item.key];
    if (typeof translated !== "string") {
      throw new Error(`Missing translation for key: ${item.key}`);
    }

    setAtPath(target, item.path, translated);
    meta.hashes[item.key] = hashText(item.value);
  });

  removeStaleKeys(target, source);

  const validKeys = new Set(sourceItems.map((item) => item.key));
  Object.keys(meta.hashes).forEach((key) => {
    if (!validKeys.has(key)) delete meta.hashes[key];
  });

  meta.sourceLocale = SOURCE_LOCALE;
  meta.targetLocale = TARGET_LOCALE;
  meta.model = process.env.OPENAI_TRANSLATION_MODEL || "gpt-5.4-mini";
  meta.updatedAt = new Date().toISOString();

  await writeJson(targetPath, target);
  await writeJson(metaPath, meta);

  console.log(
    `Updated ${path.relative(rootDir, targetPath)} and ${path.relative(rootDir, metaPath)}.`,
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
