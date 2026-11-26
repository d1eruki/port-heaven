import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";

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

const command = process.argv[2];
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
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const fields = new Map(manifest.fields.map((field) => [field.key, field]));
  const updates = new Map();
  for (const { key, type, value, expected } of bundle.changes) {
    if (
      typeof expected !== "string" ||
      typeof value !== "string" ||
      updates.has(key) ||
      (type !== "text" && type !== "image") ||
      (type === "image" && !/^[a-f0-9-]{36}\.(?:jpg|png|webp)$/.test(value))
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
      await mkdir("src/assets/admin-content", { recursive: true });
      await writeFile(replacement, bytes);
    }
    field.value = replacement;
  }
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
} else {
  throw new Error("Expected apply, succeeded or failed");
}
