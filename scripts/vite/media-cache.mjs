import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const digest = (content) => createHash("sha256").update(content).digest("hex");

export const createMediaCache = ({ directory, versions }) => {
  const pending = new Map();

  return {
    start() {
      pending.clear();
    },
    async get(content, settings, produce) {
      const key = digest(JSON.stringify({ source: digest(content), settings, versions }));
      if (!pending.has(key)) {
        const job = (async () => {
          const file = path.join(directory, `${key}.json`);
          try {
            const cached = JSON.parse(await readFile(file, "utf8"));
            const result = Buffer.from(cached.content, "base64");
            if (digest(result) === cached.digest) return result;
          } catch {
            // Missing or damaged cache entries are regenerated from the source.
          }

          const result = Buffer.from(await produce());
          await mkdir(directory, { recursive: true });
          const temporary = `${file}.${randomUUID()}.tmp`;
          try {
            await writeFile(temporary, JSON.stringify({
              digest: digest(result),
              content: result.toString("base64"),
            }));
            await rename(temporary, file);
          } finally {
            await rm(temporary, { force: true });
          }
          return result;
        })();
        pending.set(key, job);
        job.catch(() => pending.delete(key));
      }
      return pending.get(key);
    },
    async prune() {
      const files = await readdir(directory).catch(() => []);
      await Promise.all(files.filter((file) =>
        /^[a-f0-9]{64}\.json$/.test(file) && !pending.has(file.slice(0, -5)),
      ).map((file) => rm(path.join(directory, file), { force: true })));
    },
  };
};
