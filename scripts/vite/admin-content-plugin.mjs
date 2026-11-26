import { readFileSync, statSync } from "node:fs";
import path from "node:path";

export function adminContentPlugin({ root }) {
  const manifestPath = path.join(root, "content-manifest.json");
  const localePath = path.join(root, "src/locales/ru.json");
  const reviewText = Object.create(null);
  const localeFields = new Map();
  const images = new Map();
  const { schemaVersion, fields } = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (schemaVersion !== 1 || !Array.isArray(fields)) {
    throw new Error("Unsupported admin content manifest");
  }
  for (const { key, type, sourceValue, value } of fields) {
    if (value === sourceValue) continue;
    if (typeof key !== "string" || typeof value !== "string" || typeof sourceValue !== "string") {
      throw new Error("Invalid admin content field");
    }
    if (type === "image") {
      const destination = path.resolve(root, value);
      if (
        !/^src\/assets\/admin-content\/[a-f0-9-]{36}\.(?:jpg|png|webp)$/.test(value) ||
        !statSync(destination, { throwIfNoEntry: false })?.isFile()
      ) {
        throw new Error(`Invalid replacement image for ${key}`);
      }
      const original = path.resolve(root, sourceValue);
      if (images.has(original) && images.get(original) !== destination) {
        throw new Error(`Conflicting image replacements for ${sourceValue}`);
      }
      images.set(original, destination);
    } else if (key.startsWith("ru.")) {
      localeFields.set(key.slice(3), value);
    } else {
      const review = /^text\.review\.(review-[0-9]+)\.alt$/.exec(key);
      if (review) reviewText[review[1]] = value;
    }
  }

  function applyLocaleFields(node, prefix = "") {
    for (const [key, value] of Object.entries(node)) {
      const field = prefix + key;
      if (typeof value === "string" && localeFields.has(field)) {
        node[key] = localeFields.get(field);
      } else if (value && typeof value === "object") {
        applyLocaleFields(value, field + ".");
      }
    }
  }

  return {
    name: "port-heaven-admin-content",
    enforce: "pre",
    config: () => ({ define: { __ADMIN_REVIEW_TEXT__: JSON.stringify(reviewText) } }),
    resolveId(id, importer) {
      if (!importer || (!id.startsWith(".") && !id.startsWith("/"))) return null;
      const [file, query] = id.split("?");
      const original = id.startsWith("/src/")
        ? path.join(root, file)
        : path.resolve(path.dirname(importer), file);
      const replacement = images.get(original);
      return replacement ? replacement + (query ? "?" + query : "") : null;
    },
    transform(code, id) {
      if (id.split("?", 1)[0] !== localePath || localeFields.size === 0) return null;
      const messages = JSON.parse(code);
      applyLocaleFields(messages);
      return { code: JSON.stringify(messages), map: null };
    },
  };
}
