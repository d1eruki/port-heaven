import { existsSync, globSync, readFileSync, writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { basename, extname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = new URL("../content-manifest.json", import.meta.url);
const locale = JSON.parse(readFileSync(new URL("../src/locales/ru.json", import.meta.url), "utf8"));
const previous = existsSync(output) ? JSON.parse(readFileSync(output, "utf8")).fields : [];
const previousByKey = new Map(previous.map((field) => [field.key, field]));
const fields = [];
const keys = new Set();
const imageExtension = /\.(avif|jpe?g|png|webp)$/i;

const sectionTitles = {
  hero: "Первый экран",
  about: "Обо мне",
  projects: "Проекты",
  designs: "Макеты",
  creatives: "Креативы",
  pricing: "Стоимость",
  reviews: "Отзывы",
  footer: "Подвал",
  shared: "Общие элементы",
};

const labels = {
  action: "Действие",
  alt: "Описание изображения",
  description: "Описание",
  hero: "Имя на первом экране",
  intro: "Вступление",
  logo: "Название в логотипе",
  price: "Цена",
  title: "Заголовок",
  text: "Текст",
};

function humanize(key) {
  const words = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[-_]+/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function add(key, section, group, label, type, sourceValue) {
  if (keys.has(key)) throw new Error(`Duplicate content key: ${key}`);
  keys.add(key);
  const existing = previousByKey.get(key);
  // Preserve repository edits while updating values that still match their source.
  const value =
    existing?.type === type && existing.sourceValue !== existing.value
      ? existing.value
      : sourceValue;
  fields.push({ key, section: sectionTitles[section], group, label, type, value, sourceValue });
}

function collect(value, path, section, group) {
  if (typeof value === "string") {
    add(
      `ru.${path.join(".")}`,
      section,
      group,
      path
        .map((part) => labels[part] ?? humanize(part))
        .slice(-2)
        .join(" / "),
      "text",
      value,
    );
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value))
      collect(child, [...path, key], section, group);
  }
}

for (const [key, value] of Object.entries(locale)) {
  switch (key) {
    case "brand":
    case "heroClicker":
      collect(value, [key], "hero", "Тексты");
      break;
    case "menu":
      for (const [section, copy] of Object.entries(value)) {
        collect(
          copy,
          [key, section],
          sectionTitles[section] ? section : "shared",
          "Тексты раздела",
        );
      }
      break;
    case "projects":
    case "designs":
      for (const [id, entry] of Object.entries(value)) {
        collect(
          entry,
          [key, id],
          key,
          entry.title || (id === "buttons" ? "Кнопки карточек" : humanize(id)),
        );
      }
      break;
    case "pricing":
      for (const [id, entry] of Object.entries(value.plans)) {
        collect(entry, [key, "plans", id], key, entry.title || humanize(id));
      }
      for (const [id, entry] of Object.entries(value)) {
        if (id !== "plans") collect(entry, [key, id], key, "Общие тексты");
      }
      break;
    case "contacts":
      collect(value, [key], "footer", "Контакты");
      break;
    default:
      collect(
        value,
        [key],
        "shared",
        {
          buttons: "Кнопки",
          navigation: "Навигация",
          notices: "Уведомления",
          privacy: "Конфиденциальность",
          seo: "Поисковая выдача",
        }[key] ?? "Настройки отображения",
      );
  }
}

// Resolve the site's image imports to repository paths when loading its data in Node.
const hooks = registerHooks({
  load(url, context, nextLoad) {
    const asset = new URL(url);
    if (asset.protocol !== "file:" || !imageExtension.test(asset.pathname)) {
      return nextLoad(url, context);
    }
    const path = fileURLToPath(asset);
    if (!existsSync(path)) throw new Error(`Missing image: ${path}`);
    const source = relative(root, path).split(sep).join("/");
    return {
      shortCircuit: true,
      format: "module",
      source: `export default ${JSON.stringify({ src: source })};`,
    };
  },
});
const { projects } = await import("../src/js/data/projects.js");
const { createReviews } = await import("../src/js/data/reviews.js");
hooks.deregister();

for (const { titleKey, cover } of projects) {
  if (!cover) continue;
  const [, id] = titleKey.split(".");
  add(
    `image.project.${id}.cover`,
    "projects",
    locale.projects[id].title,
    "Обложка",
    "image",
    cover.src,
  );
}

for (const { src, alt } of createReviews().sort((first, second) =>
  first.src.localeCompare(second.src, "en"),
)) {
  const id = basename(src, extname(src));
  const group = alt.split(":")[0];
  add(`image.review.${id}`, "reviews", group, "Скриншот отзыва", "image", src);
  add(`text.review.${id}.alt`, "reviews", group, "Описание изображения", "text", alt);
}

const creativeSource = readFileSync(
  new URL("../src/js/data/creative-assets.js", import.meta.url),
  "utf8",
);
const creativeAliases = new Map(
  Array.from(
    creativeSource
      .match(/const creativeIdByFilename = \{([\s\S]*?)\};/)?.[1]
      .matchAll(/"([^"]+)":\s*"([^"]+)"/g) ?? [],
    ([, filename, id]) => [filename, id],
  ),
);
for (const path of globSync("src/assets/creatives/priority-[123]/*", { cwd: root }).sort()) {
  if (!imageExtension.test(path)) continue;
  const filename = basename(path, extname(path));
  const id = creativeAliases.get(filename) ?? filename;
  add(`image.creative.${id}`, "creatives", humanize(filename), "Изображение", "image", path);
}

writeFileSync(output, `${JSON.stringify({ schemaVersion: 1, fields }, null, 2)}\n`);
