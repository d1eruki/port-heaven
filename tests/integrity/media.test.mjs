import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import wawoff2 from "wawoff2";
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
        .replace("export default", "return")
        .replace(/import\.meta\.ROLLDOWN_FILE_URL_(\d+)/g, (_, index) =>
          JSON.stringify(assets[Number(index)].name),
        );
      return Function(expression)();
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
  await prod.buildEnd();
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
