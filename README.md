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

### SCSS

SCSS is used to author styles with variables, nesting, and mixins.

Packages involved:

- `sass` — SCSS compiler
- `sass-loader` — processes SCSS in Webpack

### PostCSS

PostCSS is used together with Tailwind CSS v4 via @tailwindcss/postcss and postcss-loader.

### Tailwind CSS

Utility-first CSS framework wired through PostCSS.

### Vue 3

Progressive JavaScript framework for building the UI.

Packages involved:

- `vue` — Vue 3 core
- `@vue/compiler-sfc` — compiler for Single File Components
- `vue-loader` — Webpack loader for .vue files

### State & i18n

- `pinia` — state management
- `vue-i18n` — internationalization

### UI Utilities

- `swiper` — touch slider

### Developer Tooling

- `prettier` + `prettier-plugin-tailwindcss` — code formatting
- `npm-check-updates` — dependency checks/updates
- `ngrok` — public tunnel for local dev

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
