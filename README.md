# Port Heaven

Personal portfolio showcasing frontend skills and experiments.

Version `9.36.2`.

## Stack

- Vue 3, Vite, Tailwind CSS v4 and PostCSS
- Vue I18n and Typograf for localization and typography
- GSAP and Vanilla Tilt for animation; VueUse, Reka UI, Number Flow and Fitty for UI utilities
- Iconify for icons; Prettier, ESLint and Playwright for development checks

## Admin content manifest

`node scripts/generate-content-manifest.mjs` generates `content-manifest.json` from the Russian locale, existing project and review data, and the creative gallery images. Paths point to the original images in the repository. Existing edited values are carried forward by field key. CI refreshes the file in the repository after a successful deployment from `master`.

The Vite build applies edited values from the manifest. The admin publication workflow commits the manifest and replacement images together after the build succeeds, then deploys that same build to GitHub Pages.
