import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import wawoff2 from "wawoff2";
import { build } from "vite";
import { createMediaCache } from "../../scripts/vite/media-cache.mjs";
import { optimizeMediaPlugin } from "../../scripts/vite/optimize-media-plugin.mjs";
import { optimizeFontsPlugin } from "../../scripts/vite/optimize-fonts-plugin.mjs";

const hash = (content) => createHash("sha256").update(content).digest("hex");

const createContext = () => {
  const assets = [];
  return {
    assets,
    emitFile(asset) {
      assets.push(asset);
      return String(assets.length - 1);
    },
    addWatchFile() {},
    evaluate(code) {
      const expression = code
        .replace(/^import \{ registerImageFormats \} from .*;\n/gm, "")
        .replace("export default", "return")
        .replace(/import\.meta\.ROLLDOWN_FILE_URL_(\d+)/g, (_, index) =>
          JSON.stringify(assets[Number(index)].name),
        );
      return Function("registerImageFormats", expression)((avif) => avif);
    },
  };
};

const temporaryDirectory = async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "port-heaven-media-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
};

test("media cache invalidates source, settings and versions and removes stale entries", async (t) => {
  const directory = await temporaryDirectory(t);
  let calls = 0;
  const generate = () => Buffer.from(String(++calls));
  const create = (version) => createMediaCache({ directory, versions: { version } });
  const first = create(1);
  await Promise.all([
    first.get(Buffer.from("a"), { width: 10 }, generate),
    first.get(Buffer.from("a"), { width: 10 }, generate),
  ]);
  assert.equal(calls, 1);
  const second = create(1);
  await second.get(Buffer.from("a"), { width: 10 }, generate);
  assert.equal(calls, 1);
  await second.get(Buffer.from("b"), { width: 10 }, generate);
  await second.get(Buffer.from("a"), { width: 20 }, generate);
  assert.equal(calls, 3);
  const third = create(2);
  await third.get(Buffer.from("a"), { width: 10 }, generate);
  assert.equal(calls, 4);
  await third.prune();
  assert.equal((await readdir(directory)).length, 1);
  const [cachedFile] = await readdir(directory);
  await writeFile(path.join(directory, cachedFile), "corrupt");
  await create(2).get(Buffer.from("a"), { width: 10 }, generate);
  assert.equal(calls, 5);
});

test("development reads original images and production emits bounded responsive formats", async (t) => {
  const root = await temporaryDirectory(t);
  const file = path.join(root, "image with space.png");
  const pixels = Buffer.alloc(512 * 256 * 4);
  let seed = 7;
  for (let i = 0; i < pixels.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    pixels[i] = seed >>> 24;
  }
  const original = await sharp(pixels, { raw: { width: 512, height: 256, channels: 4 } })
    .png()
    .toBuffer();
  await writeFile(file, original);
  const dev = optimizeMediaPlugin({ assetsRoot: root });
  dev.configResolved({ root, command: "serve" });
  const context = createContext();
  assert.equal(await dev.load.call(context, `${file}?url`), null);
  const devCode = await dev.load.call(context, `${file}?responsive`);
  assert.ok(devCode.includes(`${file}?url`));
  assert.ok(devCode.includes("sources: []"));
  assert.equal(context.assets.length, 0);
  const prod = optimizeMediaPlugin({ assetsRoot: root });
  prod.configResolved({ root, command: "build" });
  const code = await prod.load.call(context, `${file}?responsive`);
  const image = context.evaluate(code);
  assert.equal(image.width, 512);
  assert.equal(image.height, 256);
  assert.ok(
    image.sources.every((source) =>
      source.srcset.split(", ").every((candidate) => /^[^\s]+ \d+w$/.test(candidate)),
    ),
  );
  assert.ok(image.sources.some((source) => source.type === "image/webp"));
  assert.ok(image.sources.some((source) => source.type === "image/avif"));
  for (const asset of context.assets) {
    const metadata = await sharp(asset.source).metadata();
    assert.ok(metadata.width <= 512 && metadata.height <= 256);
    assert.equal(metadata.hasAlpha, true);
    assert.equal(metadata.width / metadata.height, 2);
  }
  assert.equal(hash(await readFile(file)), hash(original));
  await prod.closeBundle();
});

test("production favicons are small square PNGs without changing their sources", async (t) => {
  const root = await temporaryDirectory(t);
  const file = path.join(root, "favicon-light.png");
  const original = await sharp({
    create: { width: 200, height: 201, channels: 4, background: "transparent" },
  })
    .png()
    .toBuffer();
  await writeFile(file, original);
  const plugin = optimizeMediaPlugin({ assetsRoot: root });
  plugin.configResolved({ root, command: "build" });
  const context = createContext();
  await plugin.load.call(context, file);
  const result = await sharp(context.assets[0].source).metadata();
  assert.deepEqual([result.format, result.width, result.height], ["png", 64, 64]);
  assert.equal(hash(await readFile(file)), hash(original));
});

test("ordinary image imports automatically emit AVIF first and WebP fallback with alpha", async (t) => {
  const root = await temporaryDirectory(t);
  const file = path.join(root, "new image.png");
  const width = 128;
  const height = 96;
  const pixels = Buffer.alloc(width * height * 4);
  let seed = 19;
  for (let offset = 0; offset < pixels.length; offset += 4) {
    for (let channel = 0; channel < 3; channel++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      pixels[offset + channel] = seed >>> 24;
    }
    pixels[offset + 3] = offset % 12 === 0 ? 0 : 255;
  }
  const original = await sharp(pixels, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();
  await writeFile(file, original);
  const dev = optimizeMediaPlugin({ assetsRoot: root });
  dev.configResolved({ root, command: "serve" });
  const context = createContext();
  assert.equal(await dev.load.call(context, file), null);
  assert.equal(await dev.load.call(context, `${file}?url`), null);
  const plugin = optimizeMediaPlugin({ assetsRoot: root });
  plugin.configResolved({ root, command: "build" });
  for (const id of [file, `${file}?url`]) {
    const code = await plugin.load.call(context, id);
    const name = context.evaluate(code);
    assert.match(name, /\.avif$/);
    assert.ok(context.assets.some((item) => item.name.endsWith(".webp")));
    const asset = context.assets.find((item) => item.name === name);
    const metadata = await sharp(asset.source).metadata();
    assert.deepEqual([metadata.width, metadata.height, metadata.hasAlpha], [width, height, true]);
    assert.ok(asset.source.length < original.length);
    const alpha = await sharp(asset.source).ensureAlpha().extractChannel(3).raw().toBuffer();
    assert.equal(alpha[0], 0);
    assert.equal(alpha[1], 255);
  }
  assert.equal(hash(await readFile(file)), hash(original));
});

test("new images in JavaScript, HTML and CSS are optimized automatically in the actual build", async (t) => {
  const root = await temporaryDirectory(t);
  const assetsRoot = path.join(root, "src/assets");
  await mkdir(assetsRoot, { recursive: true });
  const original = await readFile("src/assets/hero/hero-eyes-closed.png");
  const sources = new Map();
  for (const [index, name] of ["html", "css", "javascript"].entries()) {
    const source = await sharp(original)
      .modulate({ brightness: 0.8 + index * 0.1 })
      .png()
      .toBuffer();
    sources.set(name, source);
    await writeFile(path.join(assetsRoot, `${name}.png`), source);
  }
  await writeFile(
    path.join(root, "index.html"),
    '<img src="/src/assets/html.png"><link rel="stylesheet" href="/style.css"><script type="module" src="/main.js"></script>',
  );
  await writeFile(
    path.join(root, "style.css"),
    '.image { background: url("./src/assets/css.png"); }',
  );
  await writeFile(
    path.join(root, "main.js"),
    'import image from "./src/assets/javascript.png"; document.body.dataset.image = image;',
  );
  const result = await build({
    root,
    base: "./",
    configFile: false,
    logLevel: "silent",
    plugins: [optimizeMediaPlugin({ assetsRoot })],
    build: { write: false, assetsInlineLimit: 0 },
  });
  const outputs = result.output;
  const names = new Set(outputs.map((entry) => entry.fileName));
  const images = outputs.filter((entry) => /\.(?:avif|webp)$/.test(entry.fileName));
  assert.ok(images.length > 0);
  assert.ok(!outputs.some((entry) => entry.fileName.endsWith(".png")));
  for (const entry of outputs) {
    if (entry.type !== "chunk" && !/\.(?:html|css)$/.test(entry.fileName)) continue;
    const text = entry.type === "chunk" ? entry.code : String(entry.source);
    assert.ok(!text.includes(".png"), `${entry.fileName} still references an unconverted image`);
    const references = text.matchAll(/["'`(]([^"'`()\s]*\.(?:avif|webp))/g);
    let count = 0;
    for (const [, reference] of references) {
      const target = reference.startsWith("/")
        ? reference.slice(1)
        : path.posix.normalize(path.posix.join(path.posix.dirname(entry.fileName), reference));
      assert.ok(names.has(target), `${entry.fileName} references missing ${target}`);
      count++;
    }
    if (entry.type !== "chunk")
      assert.ok(count > 0, `${entry.fileName} must reference an optimized image`);
  }
  for (const [name, source] of sources) {
    assert.deepEqual(await readFile(path.join(assetsRoot, `${name}.png`)), source);
  }
  const html = String(outputs.find((entry) => entry.fileName === "index.html").source);
  assert.match(html, /<picture[^>]*><source type="image\/avif"[^>]*><img[^>]*\.webp/);
  const css = String(outputs.find((entry) => entry.fileName.endsWith(".css")).source);
  assert.match(css, /image-set\(.*type\("image\/avif"\).*type\("image\/webp"\)/);
});

test("lossless mode preserves decoded pixels and original mode preserves bytes", async (t) => {
  const root = await temporaryDirectory(t);
  const file = path.join(root, "texture.png");
  const pixels = Buffer.from([255, 0, 0, 255, 0, 255, 0, 128, 0, 0, 255, 64, 90, 80, 70, 0]);
  const original = await sharp(pixels, { raw: { width: 2, height: 2, channels: 4 } })
    .png()
    .toBuffer();
  await writeFile(file, original);
  const plugin = optimizeMediaPlugin({ assetsRoot: root });
  plugin.configResolved({ root, command: "build" });
  const context = createContext();
  context.error = (message) => {
    throw new Error(message);
  };
  const code = await plugin.load.call(context, `${file}?lossless`);
  assert.match(context.evaluate(code), /\.webp$/);
  assert.equal(context.assets.length, 1);
  const decoded = await sharp(context.assets[0].source).ensureAlpha().raw().toBuffer();
  assert.deepEqual(decoded, pixels);
  await plugin.load.call(context, `${file}?original`);
  assert.deepEqual(context.assets.at(-1).source, original);
  await assert.rejects(
    plugin.load.call(context, `${file}?lossless&responsive`),
    /cannot be resized/,
  );
});

test("automatic conversion preserves animation and supports explicit original imports", async (t) => {
  const root = await temporaryDirectory(t);
  const file = path.join(root, "animation.webp");
  const pixels = Buffer.alloc(8 * 16 * 4);
  pixels.fill(255, 0, pixels.length / 2);
  const original = await sharp(pixels, {
    raw: { width: 8, height: 16, channels: 4, pageHeight: 8 },
  })
    .webp({ lossless: true, delay: [80, 160], loop: 0 })
    .toBuffer();
  await writeFile(file, original);
  const plugin = optimizeMediaPlugin({ assetsRoot: root });
  plugin.configResolved({ root, command: "build" });
  const context = createContext();
  const code = await plugin.load.call(context, file);
  assert.match(context.evaluate(code), /\.webp$/);
  assert.deepEqual(context.assets[0].source, original);
  const metadata = await sharp(context.assets[0].source, { animated: true }).metadata();
  assert.equal(metadata.pages, 2);
  assert.deepEqual(metadata.delay, [80, 160]);

  const still = path.join(root, "exact.png");
  const stillSource = await sharp({
    create: {
      width: 16,
      height: 16,
      channels: 4,
      background: "transparent",
    },
  })
    .png()
    .toBuffer();
  await writeFile(still, stillSource);
  const originalCode = await plugin.load.call(context, `${still}?original`);
  assert.match(context.evaluate(originalCode), /\.png$/);
  assert.deepEqual(context.assets.at(-1).source, stillSource);
  assert.equal(await plugin.load.call(context, `${still}?raw`), null);
});

const fontTable = (font, name) => {
  for (let i = 0; i < font.readUInt16BE(4); i++) {
    const offset = 12 + i * 16;
    if (font.toString("ascii", offset, offset + 4) !== name) continue;
    const start = font.readUInt32BE(offset + 8);
    return font.subarray(start, start + font.readUInt32BE(offset + 12));
  }
  throw new Error(`Missing font table: ${name}`);
};

test("WOFF2 production conversion preserves character mapping and variable axes", async (t) => {
  const root = await temporaryDirectory(t);
  const fontsRoot = path.join(root, "src/assets/fonts");
  const file = path.join(fontsRoot, "Bounded-Variable.ttf");
  const sourceFile = path.resolve("src/assets/fonts/Bounded-Variable.ttf");
  const original = await readFile(sourceFile);
  await mkdir(fontsRoot, { recursive: true });
  await writeFile(file, original);
  const plugin = optimizeFontsPlugin({ fontsRoot });
  assert.equal(plugin.apply, "build");
  plugin.configResolved({ root });
  const css = await readFile("src/styles/fonts.css", "utf8");
  const context = createContext();
  const transformed = (
    await plugin.transform.call(context, css, path.join(root, "src/styles/fonts.css"))
  ).code;
  assert.ok(transformed.includes('format("woff2")'));
  assert.ok(!transformed.includes('format("truetype")'));
  const relative = transformed.match(/url\("([^"\n]+\.woff2)"\)/)[1];
  const compressed = await readFile(path.join(root, relative));
  assert.equal(compressed.toString("ascii", 0, 4), "wOF2");
  assert.ok(compressed.length < original.length);
  const decoded = Buffer.from(await wawoff2.decompress(compressed));
  assert.deepEqual(fontTable(decoded, "cmap"), fontTable(original, "cmap"));
  assert.deepEqual(fontTable(decoded, "fvar"), fontTable(original, "fvar"));
  assert.equal(hash(await readFile(file)), hash(original));
  assert.equal(hash(await readFile(sourceFile)), hash(original));
});
