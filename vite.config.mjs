import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { optimizeMediaPlugin } from "./scripts/vite/optimize-media-plugin.mjs";
import { typographLocalesPlugin } from "./scripts/vite/typograph-locales-plugin.mjs";

const require = createRequire(import.meta.url);
const tailwindDefaultTheme = require("tailwindcss/defaultTheme");
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const relativeEntryAssetUrlsPlugin = () => ({
  name: "port-heaven-relative-entry-asset-urls",
  apply: "build",
  transformIndexHtml: {
    order: "post",
    handler: (html) => html.replace(/((?:src|href)=")\.\/(?=(?:script|style)\.)/g, "$1"),
  },
});

export default defineConfig({
  base: "./",
  plugins: [
    typographLocalesPlugin({ localesRoot: path.join(projectRoot, "src/locales") }),
    optimizeMediaPlugin({ assetsRoot: path.join(projectRoot, "src/assets") }),
    relativeEntryAssetUrlsPlugin(),
    vue(),
  ],
  define: {
    __TAILWIND_SCREENS__: JSON.stringify(tailwindDefaultTheme.screens),
    __VUE_OPTIONS_API__: JSON.stringify(false),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
  },
  server: {
    port: 8080,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
  build: {
    assetsInlineLimit: 0,
    outDir: "dist",
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        hashCharacters: "hex",
        entryFileNames: "script.[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: ({ names }) =>
          names.some((name) => name.endsWith(".css"))
            ? "style.[hash][extname]"
            : "assets/[name].[hash][extname]",
      },
    },
  },
});
