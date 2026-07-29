---
name: port-heaven-verification
description: Apply Port Heaven approval, test-design, visual-review, formatting, test, and build workflow whenever changing repository files, planning or modifying tests, or validating completed work.
---

# Port Heaven Verification

## Reuse Test Infrastructure

Before creating a test helper, fixture, source-file traversal, setup hook, parser, loader, matcher, or assertion utility, search the complete applicable test tree for an equivalent or extendable implementation. Reuse or extract the shared mechanism before adding another copy.

Include every affected test and shared helper in the implementation plan. If duplication is necessary, explain the concrete incompatibility that prevents reuse and wait for approval. Do not accept a new duplicated support mechanism merely because each individual test passes.

## Design Durable Tests

Prefer tests for durable global guarantees and broad failure classes, including viewport containment, usable core controls, correct navigation, persisted critical preferences, and accessible state.

Do not add a test merely because code changed or a one-off bug was fixed. Add one only for a new critical, durable guarantee that is likely to regress and is not already covered. Prefer extending an existing broad test over creating a new test. Before adding or changing a test, state the guarantee it protects in the implementation plan and wait for explicit user approval.

Do not add regression tests for a single CSS class, Tailwind utility, `z-index`, exact font family, exact pixel value, or another implementation detail unless that value is an explicit product contract. Generalize the assertion or leave visual review to the user.

Test behavior through real interactions and observable outcomes. Exercise hover in hover tests, resize the viewport in responsive tests, and verify usability or hit testing rather than computed `z-index` values in layering tests. When editing an existing suite, remove nearby brittle implementation assertions that duplicate broader behavioral coverage.

## Verify Once After the Batch

Batch related edits and run the proportional verification set once after the approved work is complete. Do not repeatedly rerun the same checks after individual edits.

For a UI task:

1. Complete the approved implementation without running formatting or tests.
2. Leave visual review to the user. Use a structured prompt with `Всё нормально` and `Нужны правки` when available; otherwise ask for visual approval and feedback in one concise question.
3. If the user chooses `Нужны правки`, apply the feedback within the approved scope without running formatting or tests, then request visual review again.
4. Stay in visual iteration until the user gives explicit approval. Then run `npm run format` once, followed by `npm run test:integrity` and `npm run test:e2e` once each.
5. If a relevant failure requires file changes, treat the task as incomplete and repeat the visual-review gate after the fix. Report unrelated or pre-existing failures without claiming the suite passed.

For a non-visual task, skip the visual-review prompt and run only the approved relevant checks once after implementation.

For an instruction-only change, run formatting and no application tests.

Run a production build when build configuration, dependencies, asset processing, or production-only behavior is affected, or once at the end of a larger iteration.
