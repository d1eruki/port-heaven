# Repository Instructions

## Approval Before Changes

Before making any file changes, the agent must first explain the intended plan and wait for explicit approval from the user.

If the user has already given a direct execution command such as "делай", "go", "do it", or an equivalent instruction after a proposed or implied scope, treat that as explicit approval for the current plan. Do not ask for the same approval again unless the plan changes.

The plan must state:

- Which files will be changed.
- Which files, if any, will be deleted.
- What will be changed or removed in each file.
- Why each change is needed.

The agent must not edit, delete, rename, format, generate, or otherwise modify files until the user approves the plan. Files may be deleted when they are left empty or become outdated.

If the plan changes during the work, the agent must stop, describe the updated plan, and wait for approval again before continuing.

## Library Behavior

When a library is already used for a task, prefer the library's built-in behavior, documented APIs, and established patterns over custom workarounds.

Do not reimplement, bypass, or patch around baseline library behavior unless the built-in behavior is insufficient for the specific requirement. If a workaround is necessary, explain why the standard library behavior cannot handle the case.

## Existing Mechanics and Patterns

Before creating a new mechanic, first inspect the codebase to determine whether an equivalent mechanic, state flow, helper, composable, persistence layer, or established pattern already exists.

If an existing mechanic covers the requirement, use it. If it is close but incomplete, extend or adjust the existing implementation instead of creating a parallel one.

Do not duplicate mechanisms such as `localStorage` handling, state synchronization, UI behavior, routing logic, data loading, or persistence abstractions unless the existing approach is insufficient for the specific requirement. If a new mechanism is necessary, explain why the existing one cannot be reused or extended.

## Tailwind Usage

When working with Tailwind, prefer built-in Tailwind classes, theme tokens, CSS variables, variants, and documented APIs over custom CSS, custom utilities, or hardcoded values.

Use Tailwind classes as documented, preferring canonical utility names over arbitrary properties or unusual equivalent forms. For example, use `border-l` instead of `border-l-1` for the default 1px left border, and `grid-rows-[auto_1fr_auto]` instead of `[grid-template-rows:auto_1fr_auto]` when the documented utility covers the case.

Do not manually duplicate Tailwind's default values, especially breakpoints, spacing, colors, typography, shadows, radii, transitions, or z-index values. Use Tailwind's base classes and default theme values where they already express the required behavior.

Add custom CSS variables, custom utilities, or project-specific theme tokens only when Tailwind's built-in behavior is insufficient or the value is a deliberate project token. If JavaScript needs Tailwind values, prefer build-time access to Tailwind defaults or already-declared project theme variables instead of hardcoding numeric copies.

## Formatting

After making code, markup, style, or documentation changes, run Prettier through the project's existing script before handing off the work:

```sh
npm run format
```

If only checking the current state without modifying files, use:

```sh
npm run format:check
```

## Dependencies and Accessibility

Whenever new dependencies are added, update the `README` with the relevant setup, usage, or dependency notes.

Always include appropriate accessibility attributes for icons and SVGs, such as `aria-hidden` and `focusable` when they are decorative. Provide `aria-label` for navigation controls and keep image `alt` attributes accurate and up to date.

## Vue Component Creation

Do not create a separate Vue component for an element that is used only once on the page. Keep one-off UI anchors, buttons, overlays, notices, and technical DOM targets inside the nearest parent component, such as `App.vue`.

Create a component without asking only when it is a large semantic page section or an already-established reusable block.

If the same block appears more than once and extracting it into a component seems useful, ask the user whether they want a separate component and wait for their answer before making the extraction.
