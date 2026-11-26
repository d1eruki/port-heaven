import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { appendFile, mkdir, readdir, readFile, lstat, writeFile } from "node:fs/promises";
import path from "node:path";

const mediaName = /^[a-f0-9-]{36}\.(jpg|png|webp)$/;

async function sanitizeImages(directory) {
  const { default: sharp } = await import("sharp");
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const matched = mediaName.exec(entry.name);
    if (!entry.isFile() || !matched) throw new Error("Invalid publication image path");
    const file = path.join(directory, entry.name);
    const image = sharp(await readFile(file), { limitInputPixels: 16_000_000, failOn: "warning" });
    const metadata = await image.metadata();
    const format = matched[1] === "jpg" ? "jpeg" : matched[1];
    if (
      metadata.format !== format ||
      !metadata.width ||
      !metadata.height ||
      metadata.width > 4096 ||
      metadata.height > 4096 ||
      (metadata.pages ?? 1) !== 1
    ) {
      throw new Error("Invalid publication image format or dimensions");
    }
    const contents = await image.autoOrient().toFormat(format).toBuffer();
    if (!contents.length || contents.length > 4 * 1024 * 1024) {
      throw new Error("Sanitized publication image exceeds 4 MB");
    }
    await writeFile(file, contents);
  }
}

async function runPublication(command) {
  const { ADMIN_API_URL, PUBLISH_WORKFLOW_SECRET, PUBLICATION_ID, GITHUB_RUN_ID, GITHUB_ENV } =
    process.env;
  if (
    !/^[a-f0-9-]{36}$/.test(PUBLICATION_ID ?? "") ||
    !/^\d+$/.test(GITHUB_RUN_ID ?? "") ||
    !PUBLISH_WORKFLOW_SECRET ||
    !ADMIN_API_URL ||
    !GITHUB_ENV
  ) {
    throw new Error("Admin publication settings are incomplete");
  }
  const api = new URL(ADMIN_API_URL);
  if (
    (api.protocol !== "https:" && !(api.protocol === "http:" && api.hostname === "127.0.0.1")) ||
    api.username ||
    api.password ||
    api.pathname !== "/" ||
    api.search ||
    api.hash
  ) {
    throw new Error("Invalid admin API URL");
  }
  const jobUrl = new URL(`/api/publications/${PUBLICATION_ID}`, api);
  const headers = {
    Authorization: `Bearer ${PUBLISH_WORKFLOW_SECRET}`,
    "X-Publication-Run": GITHUB_RUN_ID,
  };

  async function request(url, options) {
    const response = await fetch(url, {
      ...options,
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Admin API replied with HTTP ${response.status}`);
    return response;
  }

  if (command === "succeeded" || command === "failed") {
    await request(jobUrl, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ status: command, reason: process.env.ADMIN_PUBLICATION_FAILURE }),
    });
  } else if (command === "apply") {
    const bundle = await (await request(jobUrl, { headers })).json();
    if (
      bundle.targetRef !== process.env.GITHUB_REF_NAME ||
      !Array.isArray(bundle.changes) ||
      !bundle.changes.length
    ) {
      throw new Error("Publication does not match the checked-out branch");
    }
    const manifestPath = "content-manifest.json";
    const stage = process.env.PUBLICATION_STAGE_DIR;
    if (stage) await mkdir(stage, { recursive: true });
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    const fields = new Map(manifest.fields.map((field) => [field.key, field]));
    const updates = new Map();
    for (const { key, type, value, expected } of bundle.changes) {
      if (
        typeof expected !== "string" ||
        typeof value !== "string" ||
        updates.has(key) ||
        (type !== "text" && type !== "image") ||
        (type === "image" && !mediaName.test(value))
      ) {
        throw new Error("Invalid admin publication payload");
      }
      const field = fields.get(key);
      const replacement = type === "image" ? `src/assets/admin-content/${value}` : value;
      if (
        !field ||
        field.type !== type ||
        (field.value !== expected && field.value !== replacement)
      ) {
        await appendFile(GITHUB_ENV, "ADMIN_PUBLICATION_FAILURE=conflict\n");
        throw new Error(`Content changed since the draft was saved: ${key}`);
      }
      updates.set(key, { field, type, value, replacement });
    }
    for (const { field, type, value, replacement } of updates.values()) {
      if (type === "image" && field.value !== replacement) {
        const response = await request(new URL(`${jobUrl.pathname}/media/${value}`, api), {
          headers,
        });
        const bytes = Buffer.from(await response.arrayBuffer());
        if (!bytes.length || bytes.length > 4 * 1024 * 1024)
          throw new Error("Invalid replacement image size");
        const directory = stage ? path.join(stage, "assets") : "src/assets/admin-content";
        await mkdir(directory, { recursive: true });
        await writeFile(path.join(directory, value), bytes);
      }
      field.value = replacement;
    }
    await writeFile(
      stage ? path.join(stage, manifestPath) : manifestPath,
      JSON.stringify(manifest, null, 2) + "\n",
    );
  } else {
    throw new Error("Expected apply, succeeded or failed");
  }
}

async function transferArtifact(command, type, input, output) {
  const { PUBLISH_ARTIFACT_KEY, PUBLICATION_ID } = process.env;
  if (
    !/^[a-f0-9]{64}$/.test(PUBLISH_ARTIFACT_KEY ?? "") ||
    !/^[a-f0-9-]{36}$/.test(PUBLICATION_ID ?? "") ||
    !["input", "media", "site"].includes(type)
  ) {
    throw new Error("Publication artifact settings are incomplete");
  }
  const key = Buffer.from(PUBLISH_ARTIFACT_KEY, "hex");
  const encrypt = command === "seal";

  async function transfer(relative) {
    const file = path.join(input, relative + (encrypt ? "" : ".enc"));
    const info = await lstat(file);
    const maxSize = (type === "site" ? 128 : 8) * 1024 * 1024 + 28;
    if (!info.isFile() || info.size > maxSize) throw new Error("Invalid publication artifact size");
    const data = await readFile(file);
    const context = Buffer.from(`ya-admin-artifact-v1:${PUBLICATION_ID}:${type}:${relative}`);
    let result;
    if (encrypt) {
      const nonce = randomBytes(12);
      const cipher = createCipheriv("aes-256-gcm", key, nonce);
      cipher.setAAD(context);
      const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
      result = Buffer.concat([nonce, cipher.getAuthTag(), encrypted]);
    } else {
      if (data.length < 28) throw new Error("Invalid encrypted artifact");
      const decipher = createDecipheriv("aes-256-gcm", key, data.subarray(0, 12));
      decipher.setAuthTag(data.subarray(12, 28));
      decipher.setAAD(context);
      result = Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]);
    }
    const target = path.join(output, relative + (encrypt ? ".enc" : ""));
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, result, { flag: "wx", mode: 0o600 });
  }

  if (type === "site") return transfer("artifact.tar");
  if (type === "input") await transfer("content-manifest.json");
  const directory = path.join(input, "assets");
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (type === "input" && error.code === "ENOENT") return;
    throw error;
  }
  for (const entry of entries) {
    const name = encrypt ? entry.name : entry.name.replace(/\.enc$/, "");
    if (!entry.isFile() || !mediaName.test(name) || (!encrypt && !entry.name.endsWith(".enc"))) {
      throw new Error("Unexpected file in publication artifact");
    }
    await transfer("assets/" + name);
  }
}

const command = process.argv[2];
if (command === "sanitize") await sanitizeImages(process.argv[3]);
else if (command === "seal" || command === "open")
  await transferArtifact(command, process.argv[3], process.argv[4], process.argv[5]);
else await runPublication(command);
