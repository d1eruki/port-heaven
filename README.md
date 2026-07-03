# Port Heaven

## Description

Port Heaven is a personal portfolio project to showcase existing frontend skills and experiments.

## Technologies

### Webpack

Webpack is used to bundle, optimize, and process all project assets.

Packages involved:

- `webpack` — the bundler
- `webpack-cli` — command-line interface for Webpack
- `webpack-dev-server` — local dev server with HMR
- `html-webpack-plugin` — generates HTML and injects built assets
- `css-minimizer-webpack-plugin` — minimizes CSS in production
- `mini-css-extract-plugin` — extracts CSS into separate files for production
- `css-loader` — allows importing CSS into JS
- `style-loader` — injects styles into DOM during development

Production JS, CSS, chunks, and imported assets use content hashes in their filenames for safer
browser caching. Project assets are imported through Webpack from `src/assets`; avoid literal
`assets/...` paths for local files so unused assets are not copied into production builds.

### PostCSS

PostCSS is used together with Tailwind CSS v4 via `@tailwindcss/postcss` and `postcss-loader`.

### Tailwind CSS

Utility-first CSS framework wired through PostCSS.

### Vue 3

Progressive JavaScript framework for building the UI.

Packages involved:

- `vue` — Vue 3 core
- `@vue/compiler-sfc` — compiler for Single File Components
- `vue-loader` — Webpack loader for `.vue` files

### i18n

- `vue-i18n` — internationalization

English locale strings are generated from `src/locales/ru.json`.

Create `.env.local`:

```bash
OPENAI_API_KEY=your_api_key
```

Then run:

```bash
npm run translate:en
```

The script updates only missing or stale strings in `src/locales/en.json` and stores source
hashes in `src/locales/.en.meta.json`. Use `npm run translate:en:check` to preview which keys
would be translated without calling the API.

Optional model override:

```bash
OPENAI_TRANSLATION_MODEL=gpt-5.4-mini npm run translate:en
```

### Icons

- `@iconify/tailwind4` — Iconify integration for Tailwind CSS v4
- `@iconify-json/ic` — Iconify icon set (Material Icons)
- `@iconify-json/eva` — Iconify icon set (Eva Icons)

### UI Utilities

- `lenis` — smooth scrolling
- `vanilla-tilt` — tilt/hover 3D effect

### Developer Tooling

- `prettier` + `prettier-plugin-tailwindcss` — code formatting

## Scripts

Available npm scripts:

- `npm start` — start dev server at http://localhost:8080 with HMR
- `npm run build` — production build

## Installation

1. Clone the repository:

```bash
git clone git@github.com:d1eruki/port-heaven.git
cd port-heaven
```

2. Install dependencies:

   Make sure you have Node.js installed: https://nodejs.org/

```bash
npm install
```

## Usage

To run the site locally:

```bash
npm start
```

The app will be available at http://localhost:8080

To create a production build:

```bash
npm run build
```
