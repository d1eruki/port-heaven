# Repository Instructions

## Required Project Skills

- Use `$repository-workflow` whenever planning or making repository file changes, including instruction and skill changes.
- Use `$vue-engineering` for Vue implementation, review, or diagnosis involving Single-File Components, component boundaries, reactivity, composables, state ownership, or lifecycle behavior.
- Use `$tailwind-engineering` for Tailwind CSS implementation, review, or diagnosis involving utilities, variants, theme tokens, responsive behavior, dynamic classes, or custom CSS.
- Use `$frontend-engineering` only for cross-cutting frontend systems whose ownership spans application state, browser runtime behavior, and styling, including color-system changes. Do not load it for ordinary Vue or Tailwind work covered by the technology-specific skills.
- Use `$frontend-verification` whenever changing repository files, planning or modifying tests, or validating completed work.
- Use `$frontend-maintenance` only when the user explicitly requests a project-currency audit, dependency updates, compatibility review, or research into replacing custom mechanisms with maintained public libraries.
- Keep Port Heaven-specific requirements in this file unless they form a self-contained reusable workflow suitable for the shared skills repository.

## Port Heaven Frontend Conventions

Keep capability causes such as `hw/no-hw` and `motion/reduced-motion` separate, but make effect-dependent components consume the resolved `effects/no-effects` state. Keep behavior under `no-effects` identical whether it comes from reduced motion, manual mode, or capability fallback unless a difference is explicitly required and documented.

Keep one-off anchors, buttons, overlays, notices, and technical DOM targets in their nearest parent such as `App.vue`. Create a component without asking only for a large semantic page section or an established reusable block. If a repeated block appears suitable for extraction, ask the user before introducing the component.

For color-system changes, complete the full audit table required by `$frontend-engineering`, identify contradictions, and derive one target graph before proposing edits. Update the affected graph atomically without stale aliases, synonyms, raw palette utilities, or layer bypasses.

Before adding or changing component-specific custom CSS, list every affected selector, explain why Tailwind cannot express the result, and request explicit approval. Report the changed selectors after implementation. Write interface toggle labels in full and lowercase as the action or alternative state applied after activation.

## Port Heaven Verification Workflow

For UI work, complete the approved implementation before running formatting or tests. Leave the visual review to the user and iterate until they explicitly approve the result. Then run `npm run format` once, followed by `npm run test:integrity` and `npm run test:e2e` once each. If a relevant failure requires file changes, repeat the affected visual-review gate after the fix.

For non-visual work, skip visual review and run only the approved relevant checks once. For instruction-only changes, run formatting and no application tests. Run a production build when build configuration, dependencies, asset processing, or production-only behavior is affected, or once at the end of a larger iteration.

For project-wide dependency audits, use a clean `npm ci` with the declared runtime and normal install settings as the installation acceptance check.
