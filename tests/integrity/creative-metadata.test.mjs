import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { optimizeMediaPlugin } from "../../scripts/vite/optimize-media-plugin.mjs";

const metadataFromModule = (source) => JSON.parse(source.slice("export default ".length, -1));

test("gallery metadata covers square, landscape and portrait assets in development", async (t) => {
  const assetsRoot = await mkdtemp(path.join(os.tmpdir(), "port-heaven-dimensions-"));
  t.after(() => rm(assetsRoot, { recursive: true, force: true }));
  const plugin = optimizeMediaPlugin({ assetsRoot });
  plugin.configResolved({ command: "serve" });
  plugin.buildStart();
  const watched = [];
  const context = { addWatchFile: (file) => watched.push(file) };

  for (const [width, height] of [
    [40, 40],
    [80, 45],
    [30, 60],
  ]) {
    const file = path.join(assetsRoot, `${width}-${height}.png`);
    await sharp({ create: { width, height, channels: 4, background: "transparent" } })
      .png()
      .toFile(file);
    assert.deepEqual(
      metadataFromModule(await plugin.load.call(context, `${file}?metadata&import`)),
      { width, height },
    );
    assert.equal(await plugin.load.call(context, `${file}?url`), null);
  }
  assert.equal(watched.length, 3);
});

test("metadata follows orientation and updates when an image changes", async (t) => {
  const assetsRoot = await mkdtemp(path.join(os.tmpdir(), "port-heaven-orientation-"));
  t.after(() => rm(assetsRoot, { recursive: true, force: true }));
  const file = path.join(assetsRoot, "oriented.jpg");
  await sharp({ create: { width: 80, height: 40, channels: 3, background: "white" } })
    .jpeg()
    .withMetadata({ orientation: 6 })
    .toFile(file);
  const plugin = optimizeMediaPlugin({ assetsRoot });
  plugin.configResolved({ command: "serve" });
  const context = { addWatchFile() {} };
  assert.deepEqual(metadataFromModule(await plugin.load.call(context, `${file}?metadata`)), {
    width: 40,
    height: 80,
  });

  await writeFile(
    file,
    await sharp({ create: { width: 25, height: 50, channels: 3, background: "white" } })
      .jpeg()
      .toBuffer(),
  );
  plugin.watchChange(file);
  assert.deepEqual(metadataFromModule(await plugin.load.call(context, `${file}?metadata`)), {
    width: 25,
    height: 50,
  });
});

test("production dimensions describe the emitted image after resizing", async (t) => {
  const assetsRoot = await mkdtemp(path.join(os.tmpdir(), "port-heaven-production-image-"));
  t.after(() => rm(assetsRoot, { recursive: true, force: true }));
  const file = path.join(assetsRoot, "2025-artem-y.webp");
  await sharp({ create: { width: 1500, height: 2121, channels: 3, background: "white" } })
    .webp({ lossless: true })
    .toFile(file);
  const original = await readFile(file);
  const plugin = optimizeMediaPlugin({ assetsRoot });
  plugin.configResolved({ command: "build" });
  plugin.buildStart();
  let emitted;
  const context = {
    addWatchFile() {},
    emitFile(asset) {
      emitted = asset;
      return "asset-id";
    },
  };
  const dimensions = metadataFromModule(await plugin.load.call(context, `${file}?metadata`));
  await plugin.load.call(context, `${file}?url`);
  const actual = await sharp(emitted.source).metadata();
  assert.deepEqual(dimensions, { width: actual.width, height: actual.height });
  assert.ok(dimensions.width <= 1500);
  assert.deepEqual(await readFile(file), original);
});
