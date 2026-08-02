---
name: port-heaven-frontend
description: Apply Port Heaven frontend conventions when implementing, reviewing, or diagnosing work in src/, including Vue components, CSS, Tailwind, themes, color tokens, responsive layouts, accessibility, effects, and localization.
---

# Port Heaven Frontend

## Diagnose Runtime Behavior

When observed behavior contradicts the expected code path, confirm the active runtime source instead of diagnosing from static inspection alone. Treat visually similar CSS, browser, and JavaScript effects as separate hypotheses.

Where practical, verify:

- Active state classes, attributes, media-query results, and feature-detection results.
- Activated conditional branches and dynamic imports.
- The code or stylesheet controlling the relevant DOM property, CSS variable, inline style, or computed style.
- Whether the behavior is owned by a library, the browser, or project code.

For capability-gated effects, trace the path from capability detection through state classes and module initialization to the final computed styles. Keep causes such as `hw/no-hw` and `motion/reduced-motion` separate, but make effect-dependent components consume the resolved `effects/no-effects` state. Keep behavior under `no-effects` identical whether it comes from reduced motion, manual mode, or capability fallback unless a difference is explicitly required and documented.

Clearly distinguish confirmed causes from unverified hypotheses. Confirm the active runtime source before attributing behavior to a fallback. Do not require a regression test unless it satisfies `$port-heaven-verification` and the user approves it.

## Follow Existing Component Patterns

Before styling a new or modified component, inspect nearby components that solve a similar task. Reuse their complete pattern where applicable: Tailwind classes, typography, spacing, buttons, interaction states, theme tokens, and breakpoints. Adapt the pattern to the target content and supported layouts, and leave visual review to the user.

Prefer extending or composing an established pattern over introducing component-specific CSS, arbitrary Tailwind values, or a parallel implementation.

Do not create a separate Vue component for an element used only once. Keep one-off anchors, buttons, overlays, notices, and technical DOM targets in the nearest parent component such as `App.vue`. Create a component without asking only when it is a large semantic page section or an established reusable block. If the same block appears more than once and extraction seems useful, ask whether the user wants a separate component and wait before extracting it.

## Derive Responsive Layouts

Derive responsive behavior from layout topology before asking for breakpoint-specific clarification.

When cards share a horizontal row:

- Keep outer heights equal.
- Align corresponding headings, prices, dividers, lists, and actions.
- Let flexible content areas absorb differences in content length.

When cards stack vertically:

- Size each card by its own content.
- Remove equal-height constraints and unnecessary empty space.
- Preserve consistent external spacing.

Apply this behavior unless an explicit requirement or design reference shows otherwise. Equal outer heights are insufficient when corresponding internal sections remain misaligned.

## Calculate Nested Corners

Calculate an inner radius as `max(0, outer radius - distance between contours)`. When horizontal and vertical insets differ, calculate each radius axis separately. Include padding, gap, and border thickness in the contour distance. Do not give nested surfaces the same radius when the inset is nonzero unless the design explicitly requires it. Use an existing radius token when it exactly matches the result.

## Use Tailwind First

Prefer built-in Tailwind classes, theme tokens, CSS variables, variants, and documented APIs over custom CSS, custom utilities, or hardcoded values. Color-token rules below take precedence over direct palette utilities.

Use canonical utilities when Tailwind covers the requirement, such as `border-l` instead of `border-l-1` and `grid-rows-[auto_1fr_auto]` instead of `[grid-template-rows:auto_1fr_auto]`.

Avoid complex arbitrary `calc()` classes when normal sizing, padding, flex, or grid can resolve available space. Use a complex calculation only when those mechanisms are insufficient, and explain the need in the implementation plan.

Do not duplicate Tailwind defaults for breakpoints, spacing, colors, typography, shadows, radii, transitions, or z-index values. Add custom CSS variables, utilities, or theme tokens only when built-in behavior is insufficient or the value is a deliberate project token. When JavaScript needs Tailwind values, prefer build-time access to Tailwind defaults or existing project theme variables over hardcoded numeric copies.

Implement layout, spacing, sizing, colors, typography, responsive behavior, borders, and shadows in Vue templates with Tailwind utilities by default.

## Maintain the Color System

Treat color changes as changes to one connected system. Before proposing file edits, complete a read-only audit and present one table with these columns:

```text
role | light | dark | semantic token | component token | utility | consumers | states | background
```

Trace every row from palette or Tailwind primitive through semantic and component tokens to every consumer. Check both themes and every default, hover, active, focus, and disabled state that exists. Mark unverified assumptions, and list direct primitives, layer bypasses, mixed terminology, stale aliases, unused tokens, context-dependent values, and colors that fail in their actual background context.

Derive one complete target graph from the audit before requesting approval. Do not rename or edit any part of the color system until the table, contradictions, and target graph are complete. After approval, update the full graph atomically without synonyms, stale aliases, or mixed naming.

Keep dependencies strictly layered:

- Reference palette values and Tailwind color primitives only when defining semantic tokens in the semantic or theme-token layer.
- Name semantic tokens for reusable visual roles, not concrete colors, techniques, page locations, or component names.
- Name component tokens for the element and state they style, and reference only semantic tokens from them.
- Consume semantic tokens for global roles and component tokens for component-specific roles in application CSS and templates.
- Do not bypass an established component token with its underlying semantic token.
- Do not use raw Tailwind palette utilities such as `bg-black`, `text-white`, or `border-neutral-*` in application code.

Use one vocabulary across the chain. Name paired colors as a surface and its content, such as `surface-*` and `text-on-*`. Reserve `muted` for enabled low-priority content and `disabled` for unavailable controls or content. Name component tokens after the styled element, not its parent page or section.

Do not use `currentColor` as a semantic token value unless inheriting the consumer's text color is explicit and verified. Otherwise assign a deterministic semantic value for every theme.

Keep reusable component color states inside that component. Expose a prop, variant, or state when a parent must select them; do not make the parent target private elements or depend on internal markup.

Do not add or extend component-specific CSS selectors when Tailwind utilities, arbitrary utilities, variants, or existing theme tokens can express the result. When modifying a component with avoidable custom CSS, move the affected styling to Tailwind instead of adding declarations.

Before adding or changing component-specific custom CSS, include in the implementation plan:

- Every custom selector to add or change.
- The specific Tailwind capability that is insufficient.
- A request for explicit approval of the exception.

After implementation, report which component-specific custom selectors changed. If Tailwind covers the task, do not change component-specific CSS.

## Preserve Accessibility and Copy Conventions

Add appropriate accessibility attributes to icons and SVGs, including `aria-hidden` and `focusable` for decorative graphics. Give navigation controls an `aria-label`, and keep image `alt` attributes accurate.

Write toggle labels as the action or alternative state applied after activation, not the current state. Write labels in full, without abbreviations or colons, and use lowercase to match the interface style.

Keep equivalent interface copy consistent across locales in capitalization and punctuation unless a language-specific convention requires a difference.

When adding or changing a localization key or variable, update its entry in every available locale in the same change.
