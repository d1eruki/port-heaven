import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import wawoff2 from "wawoff2";
import { createMediaCache } from "./media-cache.mjs";

const require = createRequire(import.meta.url);

export const optimizeFontsPlugin = ({ fontsRoot }) => {
  const root = `${path.resolve(fontsRoot)}${path.sep}`;
  let cache;
  let directory;
  let projectRoot;
  const usedFonts = new Set();

  const convertFont = async (file) => {
    const content = await readFile(file);
    const result = await cache.get(content, { format: "woff2" }, () => wawoff2.compress(content));
    const hash = createHash("sha256").update(result).digest("hex").slice(0, 20);
    const name = `${path.basename(file, ".ttf")}-${hash}.woff2`;
    usedFonts.add(name);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, name), result);
    return `/${path.relative(projectRoot, path.join(directory, name)).split(path.sep).join("/")}`;
  };

  const thisFontPlugin = {
    name: "port-heaven-optimize-fonts",
    apply: "build",
    enforce: "pre",
    configResolved(config) {
      projectRoot = config.root;
      directory = path.join(config.root, "node_modules/.cache/port-heaven-media/fonts");
      cache = createMediaCache({
        directory,
        versions: { profile: 1, wawoff2: require("wawoff2/package.json").version },
      });
    },
    buildStart() {
      usedFonts.clear();
      cache.start();
    },
    transformIndexHtml: {
      order: "pre",
      async handler(html) {
        let code = html;
        for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
          if (!/\brel=["']preload["']/i.test(tag) || !/\bas=["']font["']/i.test(tag)) continue;
          const href = tag.match(/\bhref=(["'])([^"']+\.ttf)\1/i);
          if (!href) continue;
          const file = href[2].startsWith("/")
            ? path.join(projectRoot, href[2])
            : path.resolve(projectRoot, href[2]);
          if (!file.startsWith(root)) continue;
          const relative = await convertFont(file);
          const converted = tag
            .replace(href[0], `href=${href[1]}${relative}${href[1]}`)
            .replace(/\btype=(["'])font\/ttf\1/i, 'type="font/woff2"');
          code = code.replace(tag, converted);
        }
        return code;
      },
    },
    async transform(source, id) {
      const cssFile = id.split("?", 1)[0];
      if (!cssFile.endsWith(".css")) return null;
      // CSS @imports are read inside Vite's CSS pipeline, without a separate
      // module transform. Inline only the font sheet before that pipeline runs.
      const fontImports = /@import\s+["']([^"']*fonts\.css)["']\s*;/g;
      let code = source;
      for (const match of source.matchAll(fontImports)) {
        const importedFile = path.resolve(path.dirname(cssFile), match[1]);
        this.addWatchFile(importedFile);
        const imported = await readFile(importedFile, "utf8");
        const converted = await thisFontPlugin.transform.call(this, imported, importedFile);
        code = `${code.replace(match[0], "")}\n${converted?.code ?? imported}`;
      }
      const pattern = /url\((["']?)([^)"']+\.ttf)\1\)\s+format\((["'])truetype\3\)/g;
      for (const match of code.matchAll(pattern)) {
        const file = match[2].startsWith("/")
          ? path.join(projectRoot, match[2])
          : path.resolve(path.dirname(cssFile), match[2]);
        if (!file.startsWith(root)) continue;
        this.addWatchFile(file);
        const relative = await convertFont(file);
        code = code.replace(match[0], `url(${JSON.stringify(relative)}) format("woff2")`);
      }
      return code === source ? null : { code, map: null };
    },
    async buildEnd(error) {
      if (error) return;
      await cache.prune();
      const files = await readdir(directory).catch(() => []);
      await Promise.all(
        files
          .filter((name) => name.endsWith(".woff2") && !usedFonts.has(name))
          .map((name) => rm(path.join(directory, name), { force: true })),
      );
    },
  };
  return thisFontPlugin;
};
