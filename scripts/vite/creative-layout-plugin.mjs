import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const endpoint = "/__creative-layout/shuffle";
const event = "creative-layout:saved";
const readLayout = async (file) => {
  const layout = JSON.parse(await readFile(file, "utf8"));
  if (!Number.isSafeInteger(layout.seed) || layout.seed < 0) {
    throw new Error("Invalid creative layout seed");
  }
  return layout;
};

export const creativeLayoutPlugin = ({ layoutFile }) => {
  const resolvedFile = path.resolve(layoutFile);
  let pendingSave = Promise.resolve();

  return {
    name: "port-heaven-creative-layout",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split("?")[0] !== endpoint) return next();

        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Content-Type", "application/json; charset=utf-8");

        if (request.method !== "POST") {
          response.setHeader("Allow", "POST");
          response.statusCode = 405;
          response.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        // Only the local dev page may change the layout used by the next build.
        if (request.headers.origin !== `http://${request.headers.host}`) {
          response.statusCode = 403;
          response.end(JSON.stringify({ error: "Origin not allowed" }));
          return;
        }

        const save = pendingSave.then(async () => {
          const { seed } = await readLayout(resolvedFile);
          const layout = { seed: seed === Number.MAX_SAFE_INTEGER ? 0 : seed + 1 };
          await writeFile(resolvedFile, `${JSON.stringify(layout, null, 2)}\n`);
          return layout;
        });

        pendingSave = save.catch(() => {});
        save.then(
          (layout) => response.end(JSON.stringify(layout)),
          (error) => {
            server.config.logger.error(`Failed to save creative layout: ${error.message}`);
            response.statusCode = 500;
            response.end(JSON.stringify({ error: "Failed to save creative layout" }));
          },
        );
      });
    },
    async handleHotUpdate(context) {
      if (path.resolve(context.file) !== resolvedFile) return;

      // Updating this data must not remount the page and detach its scroll effects.
      context.modules.forEach((module) => context.server.moduleGraph.invalidateModule(module));
      try {
        context.server.ws.send({ type: "custom", event, data: await readLayout(resolvedFile) });
      } catch (error) {
        context.server.config.logger.error(`Failed to read creative layout: ${error.message}`);
      }
      return [];
    },
  };
};
