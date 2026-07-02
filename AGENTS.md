# Repository Instructions

## Approval Before Changes

Before making any file changes, the agent must first explain the intended plan and wait for explicit approval from the user.

The plan must state:

- Which files will be changed.
- Which files, if any, will be deleted.
- What will be changed or removed in each file.
- Why each change is needed.

The agent must not edit, delete, rename, format, generate, or otherwise modify files until the user approves the plan.

If the plan changes during the work, the agent must stop, describe the updated plan, and wait for approval again before continuing.

## Library Behavior

When a library is already used for a task, prefer the library's built-in behavior, documented APIs, and established patterns over custom workarounds.

Do not reimplement, bypass, or patch around baseline library behavior unless the built-in behavior is insufficient for the specific requirement. If a workaround is necessary, explain why the standard library behavior cannot handle the case.

## Dependencies and Accessibility

Whenever new dependencies are added, update the `README` with the relevant setup, usage, or dependency notes.

Always include appropriate accessibility attributes for icons and SVGs, such as `aria-hidden` and `focusable` when they are decorative. Provide `aria-label` for navigation controls and keep image `alt` attributes accurate and up to date.

## Vue Component Creation

Do not create a separate Vue component for an element that is used only once on the page. Keep one-off UI anchors, buttons, overlays, notices, and technical DOM targets inside the nearest parent component, such as `App.vue`.

Create a component without asking only when it is a large semantic page section or an already-established reusable block.

If the same block appears more than once and extracting it into a component seems useful, ask the user whether they want a separate component and wait for their answer before making the extraction.
