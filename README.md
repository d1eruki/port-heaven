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
- `copy-webpack-plugin` — copies static assets to the build
- `html-webpack-plugin` — generates HTML and injects built assets
- `css-minimizer-webpack-plugin` — minimizes CSS in production
- `mini-css-extract-plugin` — extracts CSS into separate files for production
- `css-loader` — allows importing CSS into JS
- `style-loader` — injects styles into DOM during development


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

### Icons

- `@iconify/tailwind4` — Iconify integration for Tailwind CSS v4
- `@iconify-json/ic` — Iconify icon set (Material Icons)

### UI Utilities

- `lenis` — smooth scrolling
- `vanilla-tilt` — tilt/hover 3D effect

### Developer Tooling

- `prettier` + `prettier-plugin-tailwindcss` — code formatting
- `ngrok` — public tunnel for local dev

## Scripts

Available npm scripts:

- `npm start` — start dev server at http://localhost:8080 with HMR
- `npm run build` — production build
- `npm run tunnel` — open an ngrok tunnel to `localhost:8080`

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

To expose your local server via a public URL (for quick previews):

```bash
npm run tunnel
```
