# Repository Instructions

## Change Approval

Before making any file changes, explain the intended plan and wait for explicit user approval.

The plan must state:

- Which files will be changed.
- Which files, if any, will be deleted.
- What will be changed or removed in each file.
- Why each change is needed.

After the plan, briefly explain its pros and cons in plain language that is easy to understand without programming knowledge. If there are multiple pros or multiple cons, format each group as a numbered list.

Do not edit, delete, rename, format, generate, or otherwise modify files before the user approves the plan. Files may be deleted when they are left empty or become outdated.

If the approved file list changes, a deletion becomes necessary, or the task materially expands during the work, stop, describe the updated plan, and wait for approval again before continuing. Implementation details that stay within the approved files and intent do not require another approval.

## Agent Communication

Keep user-facing communication concise by default:

- Limit implementation plans to five short bullets while still covering every required approval detail.
- Limit routine progress updates to two sentences and send another only when the state materially changes or work exceeds 60 seconds.
- Limit final handoffs to five short lines unless the user asks for detail or additional explanation is necessary to report risk, failure, or a blocker.
- Do not narrate individual tool calls, repeat previously reported results, or list every passing command when a shorter outcome summary is sufficient.
- Clearly label hypotheses as unverified. Do not claim that the interface's visual appearance has been verified; visual review belongs to the user.

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

Keep diagnostic causes such as `hw/no-hw` and `motion/reduced-motion` separate, but make effect-dependent components consume the resolved `effects/no-effects` state. Behavior under `no-effects` must remain identical whether it came from reduced motion, manual mode, or a capability fallback, unless a difference is explicitly required and documented.

Clearly distinguish confirmed causes from unverified hypotheses. Confirm the active runtime source before attributing behavior to a fallback; do not require a new regression test unless it satisfies the test-design rules below and the user approves it.

## Frontend Conventions

### Component Patterns

Before styling a new or modified component, inspect nearby components that solve a similar task. Reuse their Tailwind classes, typography, spacing, button styles, interaction states, theme tokens, and breakpoints where applicable.

Inherit the complete project pattern rather than isolated classes. Do not copy a pattern blindly: adapt it to the target component's content and supported layouts, then leave visual review to the user.

Prefer extending or composing an established project pattern over introducing component-specific CSS, arbitrary Tailwind values, or a parallel implementation.

### Responsive Layout Logic

Derive responsive behavior from the layout topology before asking for breakpoint-specific clarification.

When cards are arranged horizontally in a shared row:

- Keep their outer heights equal.
- Align corresponding internal landmarks such as headings, prices, dividers, lists, and actions.
- Let flexible content areas absorb differences in content length.

When cards are stacked vertically:

- Size each card by its own content.
- Remove equal-height constraints and unnecessary empty space.
- Preserve consistent external spacing between cards.

Apply this behavior by default unless an explicit requirement or design reference demonstrates a different layout. Equal outer card heights are not sufficient when corresponding internal sections remain misaligned.

### Tailwind

Prefer built-in Tailwind classes, theme tokens, CSS variables, variants, and documented APIs over custom CSS, custom utilities, or hardcoded values.

Use canonical utilities when Tailwind already covers the requirement. For example, use `border-l` instead of `border-l-1`, and `grid-rows-[auto_1fr_auto]` instead of `[grid-template-rows:auto_1fr_auto]`.

Do not manually duplicate Tailwind defaults for breakpoints, spacing, colors, typography, shadows, radii, transitions, or z-index values. Add custom CSS variables, utilities, or theme tokens only when built-in behavior is insufficient or the value is a deliberate project token. When JavaScript needs Tailwind values, prefer build-time access to Tailwind defaults or existing project theme variables over hardcoded numeric copies.

For Vue templates, implement layout, spacing, sizing, colors, typography, responsive behavior, borders, and shadows with Tailwind utilities by default.

Do not add or extend component-specific CSS selectors when the same result can be expressed with Tailwind utilities, arbitrary utilities, variants, or existing theme tokens. Existing custom CSS is not permission to continue extending it. When modifying a component that already uses avoidable custom CSS, move the affected styling to Tailwind instead of adding more declarations.

Before adding or changing component-specific custom CSS, the implementation plan must:

- Name every custom selector that will be added or changed.
- Explain which specific Tailwind capability is insufficient.
- Wait for explicit user approval of that exception.

After implementation, report which component-specific custom selectors were added or changed. If Tailwind fully covered the task, do not change component-specific CSS.

### Accessibility

Add appropriate accessibility attributes to icons and SVGs, including `aria-hidden` and `focusable` for decorative graphics. Give navigation controls an `aria-label`, and keep image `alt` attributes accurate.

### Toggle Labels

Keep toggle labels consistent across the project: show the action or alternative state that will be applied after activation, not the current state. Write labels in full, without abbreviations or colons, and use lowercase to match the interface style.

### Vue Components

Do not create a separate Vue component for an element used only once. Keep one-off UI anchors, buttons, overlays, notices, and technical DOM targets in the nearest parent component, such as `App.vue`.

Create a component without asking only when it is a large semantic page section or an established reusable block. If the same block appears more than once and extraction seems useful, ask the user whether they want a separate component and wait for their answer before extracting it.

## Localization

When adding or changing a localization key or variable, update the corresponding entry in every locale available in the project as part of the same change.

## Dependencies and Documentation

When adding a dependency, update the `README` with the relevant setup, usage, or dependency notes.

## Verification

### Test Design

Prefer tests for durable, global guarantees and broad failure classes. Examples include viewport containment, usable core controls, correct navigation, persisted critical preferences, and accessible state.

Do not add a test merely because code changed or a one-off bug was fixed. Add a test only for a new critical, durable guarantee that is likely to regress and is not already covered. Prefer extending an existing broad test over creating a new test. Before adding any test, state the guarantee it protects in the implementation plan and wait for explicit user approval.

Do not add regression tests for a single CSS class, Tailwind utility, `z-index`, exact font family, exact pixel value, or other implementation detail unless that value is an explicit product contract. Do not preserve a one-off visual bug as a dedicated test when a broader invariant covers the same risk. Generalize the assertion or leave visual review to the user.

When an approved test is added or changed, test behavior through real interactions and observable outcomes. A hover test must exercise hover; a responsive test must resize the viewport; a layering test must verify usability or hit testing rather than computed `z-index` values. When editing an existing suite, remove nearby brittle implementation assertions that duplicate broader behavioral coverage.

### Verification Scope

Batch related edits and run the proportional verification set once after the approved work is complete. Do not repeatedly rerun the same checks after individual edits.

For a UI task:

1. Complete the approved implementation without running formatting or tests.
2. Leave visual review to the user. Use a structured prompt with the options `Всё нормально` and `Нужны правки` when available; otherwise ask the user for visual approval and feedback in one concise question.
3. If the user chooses `Нужны правки`, do not run formatting or tests. Apply the feedback within the approved scope and request visual review again.
4. If the user chooses `Всё нормально`, run `npm run format` once, followed by `npm run test:integrity` and `npm run test:e2e` once each.
5. If a relevant test failure requires file changes, treat the task as incomplete and repeat the visual-review gate after the fix. Report unrelated or pre-existing failures without hiding them or claiming that the suite passed.

For a non-visual task, do not use the visual-review prompt. Run only the approved, relevant checks once after implementation. For instruction-only changes, run formatting and no application tests.

Run a production build when build configuration, dependencies, asset processing, or production-only behavior is affected, or once at the end of a larger iteration.

For non-visual and instruction-only changes, run formatting once after completing the approved batch and before handing off that version. For UI tasks, use the visual-review gate above instead:

```sh
npm run format
```

## Maintaining These Instructions

Add a new instruction only when it captures a recurring, repository-specific requirement that is not already covered by this file or enforced by project tooling.

Before adding it:

- Search the complete applicable instruction set for overlapping or contradictory requirements.
- List every potential conflict in the implementation plan and include the necessary resolutions in the approved change; do not update only one side of a contradiction.
- Check whether an existing instruction can be clarified or extended instead.
- Place the instruction in the most relevant existing section.
- Keep it concise, actionable, and limited to one concern.
- Put directory-specific guidance in the closest applicable `AGENTS.md`.
- Avoid duplicating behavior already enforced by formatters, linters, tests, or other project tooling.

If the new instruction changes the scope or intent of an approved plan, stop and request approval for the updated plan before editing files.
