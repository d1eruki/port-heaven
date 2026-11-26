# Port Heaven

Personal portfolio showcasing frontend skills and experiments.

Version `9.36.3`.

## Stack

- Vue 3, Vite, Tailwind CSS v4 and PostCSS
- Vue I18n and Typograf for localization and typography
- GSAP and Vanilla Tilt for animation; VueUse, Reka UI, Number Flow and Fitty for UI utilities
- Iconify for icons; Prettier, ESLint and Playwright for development checks

## Admin content manifest

`node scripts/generate-content-manifest.mjs` generates `content-manifest.json` from the Russian locale, existing project and review data, and the creative gallery images. Paths point to the original images in the repository. Existing edited values are carried forward by field key. CI refreshes the file in the repository after a successful deployment from `master`.

The Vite build applies edited values from the manifest. The publication workflow decodes and re-encodes replacement images to remove embedded metadata before they are committed. It encrypts intermediate artifacts with the GitHub Actions secret `PUBLISH_ARTIFACT_KEY` (32 random bytes, as 64 lowercase hexadecimal characters). The admin publication workflow commits the manifest and replacement images together after the build succeeds, then deploys that same build to GitHub Pages.
