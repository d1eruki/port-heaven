# Repository Instructions

## Change Approval

Before making any file changes, explain the intended plan and wait for explicit user approval.

The plan must state:

- Which files will be changed.
- Which files, if any, will be deleted.
- What will be changed or removed in each file.
- Why each change is needed.

Do not edit, delete, rename, format, generate, or otherwise modify files before the user approves the plan. Files may be deleted when they are left empty or become outdated.

If the plan changes during the work, stop, describe the updated plan, and wait for approval again before continuing.

## Implementation Principles

Prefer a library's built-in behavior, documented APIs, and established patterns over custom workarounds. Reimplement, bypass, or patch around baseline library behavior only when it is insufficient for the specific requirement, and explain why the standard behavior cannot handle the case.

Before creating a new mechanic, inspect the codebase for an equivalent mechanic, state flow, helper, composable, persistence layer, or established pattern. Reuse an existing implementation when it covers the requirement, or extend it when it is close but incomplete.

Do not duplicate mechanisms such as `localStorage` handling, state synchronization, UI behavior, routing logic, data loading, or persistence abstractions unless the existing approach is insufficient. If a new mechanism is necessary, explain why the existing one cannot be reused or extended.

## Runtime Diagnosis

When observed application behavior contradicts the expected code path, do not diagnose the cause or propose a fix from static inspection alone. Treat visually similar CSS, browser, and JavaScript effects as separate hypotheses until the active runtime source is confirmed.

Where practical, verify:

- The active state classes, attributes, media-query results, and feature-detection result.
- The conditional branch and dynamic imports that were activated.
- The code or stylesheet controlling the relevant DOM property, CSS variable, inline style, or computed style.
- Whether the behavior is owned by a library, the browser, or project code.

For capability-gated effects, trace the full path from capability detection through state classes and module initialization to the final computed styles. Do not assume that a browser setting and a project feature-detection heuristic produce the same result.

Clearly distinguish confirmed causes from unverified hypotheses. Before claiming that a fallback disables an effect, add or run a negative-path test that verifies the effect remains inactive after the triggering interaction, such as scrolling, resizing, or changing media preferences.

## Frontend Conventions

### Tailwind

Prefer built-in Tailwind classes, theme tokens, CSS variables, variants, and documented APIs over custom CSS, custom utilities, or hardcoded values.

Use canonical utilities when Tailwind already covers the requirement. For example, use `border-l` instead of `border-l-1`, and `grid-rows-[auto_1fr_auto]` instead of `[grid-template-rows:auto_1fr_auto]`.

Do not manually duplicate Tailwind defaults for breakpoints, spacing, colors, typography, shadows, radii, transitions, or z-index values. Add custom CSS variables, utilities, or theme tokens only when built-in behavior is insufficient or the value is a deliberate project token. When JavaScript needs Tailwind values, prefer build-time access to Tailwind defaults or existing project theme variables over hardcoded numeric copies.

### Accessibility

Add appropriate accessibility attributes to icons and SVGs, including `aria-hidden` and `focusable` for decorative graphics. Give navigation controls an `aria-label`, and keep image `alt` attributes accurate.

### Vue Components

Do not create a separate Vue component for an element used only once. Keep one-off UI anchors, buttons, overlays, notices, and technical DOM targets in the nearest parent component, such as `App.vue`.

Create a component without asking only when it is a large semantic page section or an established reusable block. If the same block appears more than once and extraction seems useful, ask the user whether they want a separate component and wait for their answer before extracting it.

## Dependencies and Documentation

When adding a dependency, update the `README` with the relevant setup, usage, or dependency notes.

## Verification

After changing code, markup, styles, or documentation, run:

```sh
npm run format
```

When only checking the current state without modifying files, run:

```sh
npm run format:check
```

## Maintaining These Instructions

Add a new instruction only when it captures a recurring, repository-specific requirement that is not already covered by this file or enforced by project tooling.

Before adding it:

- Check whether an existing instruction can be clarified or extended instead.
- Place the instruction in the most relevant existing section.
- Keep it concise, actionable, and limited to one concern.
- Put directory-specific guidance in the closest applicable `AGENTS.md`.
- Avoid duplicating behavior already enforced by formatters, linters, tests, or other project tooling.

If the new instruction changes the scope or intent of an approved plan, stop and request approval for the updated plan before editing files.
