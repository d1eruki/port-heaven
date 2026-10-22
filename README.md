# Port Heaven

Personal portfolio showcasing frontend skills and experiments.

## Stack

- Vue 3, Vite, Tailwind CSS v4 and PostCSS
- Vue I18n and Typograf for localization and typography
- GSAP and Vanilla Tilt for animation; VueUse, Reka UI, Number Flow and Fitty for UI utilities
- Iconify for icons; Prettier, ESLint and Playwright for development checks

## Getting started

Use Node.js 24.22.1 or a newer Node.js 24 release; `.nvmrc` pins the project version.

```bash
git clone git@github.com:d1eruki/port-heaven.git
cd port-heaven
nvm install
nvm use
npm install
npm start
```

The dev server runs at http://localhost:8080. If you do not use nvm, select a compatible
Node.js version before installing dependencies.

## Commands

- `npm start` — start the dev server with HMR
- `npm run build` — create a production build in `dist`
- `npm run serve:dist` — preview that build at http://127.0.0.1:4173
- `npm run format:check` / `npm run lint` — check formatting and code
- `npm run test:integrity` — check project integrity
- `npm run test:e2e` — test the production build with Playwright

## Assets and developer controls

Import project assets from `src/assets` through Vite. Production builds optimize images
and videos without changing the originals and use content hashes for browser caching.
Developer controls are available only in the local dev server.

The shuffle button saves the layout to `src/js/data/creative-layout.json`.
To publish it for visitors, commit the file and deploy the site.

## Translation

English strings in `src/locales/en.json` are generated from `src/locales/ru.json`.
Add your key to `.env.local`:

```bash
OPENAI_API_KEY=your_api_key
```

Translate missing or stale strings:

```bash
npm run translate:en
```

Use `npm run translate:en:check` to preview changes without calling the API.
The script tracks source hashes in `src/locales/.en.meta.json`. To override the model:

```bash
OPENAI_TRANSLATION_MODEL=gpt-5.4-mini npm run translate:en
```

Typograf processes locale strings at build time; source locale files remain unchanged.

## Deployment and Lighthouse

A push to `master` deploys the site to GitHub Pages after GitHub Actions checks pass.
Lighthouse then audits the pages using phone, tablet and desktop profiles.
The summary is available in GitHub Actions; full reports are saved as `lighthouse-*` artifacts.
Low scores do not roll back the deployment.
