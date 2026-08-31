# Repository Instructions

## Repository Identity

Before modifying files, verify that the resolved Git root matches the repository established for the task. Do not edit another checkout, clone, or worktree merely because it became the current working directory. If the paths differ, stop and resolve the intended repository before making changes.

## Required Project Skills

- Use `$frontend-engineering` for frontend implementation, review, or diagnosis involving `src/`, Vue, CSS, Tailwind, themes, color tokens, responsive behavior, accessibility, effects, or localization.
- Use `$frontend-verification` whenever changing repository files, planning or modifying tests, or validating completed work.
- Use `$frontend-maintenance` only when the user explicitly requests a project-currency audit, dependency updates, compatibility review, or research into replacing custom mechanisms with maintained public libraries.
- Reusable skills live in the `skills` submodule. Keep Port Heaven-specific requirements in this file unless they form a self-contained reusable workflow suitable for the shared skills repository.
- When adding a reusable skill, create `${CODEX_HOME:-~/.codex}/skills/<skill-name>` as a symbolic link to its directory in the initialized submodule. Resolve both paths first; never overwrite a non-symlink or a symbolic link targeting a different path, and ask the user how to proceed instead.
- If a required skill is not discoverable, initialize the submodule when permitted and read its `SKILL.md` directly from `skills/` before continuing.

## Change Approval

Before making any file changes, explain the intended plan and wait for explicit user approval.

The plan must state:

- Which files will be changed.
- Which files, if any, will be deleted.
- What will be changed or removed in each file.
- Why each change is needed.

After the plan, briefly explain its material pros and cons in plain language that is easy to understand without programming knowledge. Include only concrete tradeoffs supported by the inspected context; do not invent a con to balance the presentation, and state plainly when there are no material cons. If there are multiple pros or multiple cons, format each group as a numbered list.

Do not edit, delete, rename, format, generate, or otherwise modify files before the user approves the plan. Files may be deleted when they are left empty or become outdated.

If the approved file list changes, a deletion becomes necessary, or the task materially expands during the work, stop, describe the updated plan, and wait for approval again before continuing. Implementation details that stay within the approved files and intent do not require another approval, but explicitly tell the user that the change continues the approved plan before editing.

## Agent Communication

Keep user-facing communication concise by default:

- Limit implementation plans to five short bullets while still covering every required approval detail.
- After inspecting the relevant code and constraints, present one coherent implementation approach. Do not replace it in response to questions unless new evidence or a changed user requirement invalidates it; explain the current approach and its concrete constraints instead.
- Limit routine progress updates to two sentences and send another only when the state materially changes or work exceeds 60 seconds.
- Limit final handoffs to five short lines unless the user asks for detail or additional explanation is necessary to report risk, failure, or a blocker.
- Do not narrate individual tool calls, repeat previously reported results, or list every passing command when a shorter outcome summary is sufficient.
- Clearly label hypotheses as unverified. Do not claim that the interface's visual appearance has been verified; visual review belongs to the user.

## Implementation Principles

Prefer a library's built-in behavior, documented APIs, and established patterns over custom workarounds. Reimplement, bypass, or patch around baseline library behavior only when it is insufficient for the specific requirement, and explain why the standard behavior cannot handle the case.

Before creating a new mechanic, inspect the codebase for an equivalent mechanic, state flow, helper, composable, persistence layer, or established pattern. Reuse an existing implementation when it covers the requirement, or extend it when it is close but incomplete.

Do not duplicate mechanisms such as `localStorage` handling, state synchronization, UI behavior, routing logic, data loading, or persistence abstractions unless the existing approach is insufficient. Reuse or extract equivalent multi-line logic when its copies share the same contract and lifecycle. Do not introduce an abstraction solely to silence duplication warnings for intentionally similar declarative markup or data. If a new mechanism is necessary, explain why the existing one cannot be reused or extended.

Identify the smallest existing property or mechanism that directly controls the requested result, and change that first. Do not restructure the DOM, positioning, layout, components, or state when a local adjustment to the existing mechanism is sufficient. Expand the implementation scope only after confirming that the smaller change cannot satisfy the requirement.

## Port Heaven Frontend Conventions

Keep capability causes such as `hw/no-hw` and `motion/reduced-motion` separate, but make effect-dependent components consume the resolved `effects/no-effects` state. Keep behavior under `no-effects` identical whether it comes from reduced motion, manual mode, or capability fallback unless a difference is explicitly required and documented.

Keep one-off anchors, buttons, overlays, notices, and technical DOM targets in their nearest parent such as `App.vue`. Create a component without asking only for a large semantic page section or an established reusable block. If a repeated block appears suitable for extraction, ask the user before introducing the component.

For color-system changes, complete the full audit table required by `$frontend-engineering`, identify contradictions, and derive one target graph before proposing edits. Update the affected graph atomically without stale aliases, synonyms, raw palette utilities, or layer bypasses.

Before adding or changing component-specific custom CSS, list every affected selector, explain why Tailwind cannot express the result, and request explicit approval. Report the changed selectors after implementation. Write interface toggle labels in full and lowercase as the action or alternative state applied after activation.

## Cross-Cutting Changes

When replacing a shared mechanism or changing multiple coupled behaviors, first confirm that the smallest direct adjustment is insufficient. Then complete a read-only map of only the affected path before proposing edits: current baseline or reference, target contract, responsible mechanism, inputs and lifecycle, consumers and interactions, invariants, relevant states or environments, and observable acceptance checks.

Give each behavior one responsible mechanism. Do not let old and new implementations control the same outcome simultaneously unless a temporary migration stage is explicitly approved. Plan coherent, independently reviewable batches, but keep a connected system atomic when another project instruction requires it. Treat each approved batch as one verification batch.

Keep product behavior, diagnostics, and tests as distinct plan items. They may change together, but diagnostics or test scaffolding must not alter production behavior, conceal a regression, or substitute for a product fix. Remove temporary instrumentation before handoff.

If the same acceptance check remains broken after two local fixes, or a fix regresses another mapped behavior, stop symptom-level patching. Return to read-only diagnosis, update the behavior map, and request approval again when the responsible mechanism, files, or scope changes.

A batch is complete only when its mapped checks pass, required visual review is accepted, and required automated verification passes. Do not claim the overall change complete until all mapped behaviors and cross-batch interactions satisfy the target contract.

## Port Heaven Verification Workflow

For UI work, complete the approved implementation before running formatting or tests. Leave visual review to the user and iterate until they explicitly approve the result. Then run `npm run format` once, followed by `npm run test:integrity` and `npm run test:e2e` once each. If a relevant failure requires file changes, repeat the affected visual-review gate after the fix.

For non-visual work, skip visual review and run only the approved relevant checks once. For instruction-only changes, run formatting and no application tests. Run a production build when build configuration, dependencies, asset processing, or production-only behavior is affected, or once at the end of a larger iteration.

For project-wide dependency audits, report totals for direct dependencies reviewed, confirmed consumers, unused candidates, compatible updates, major migrations, abandoned packages, maintenance risks, deprecated direct packages, and deprecated transitive packages found in inspected paths. Use a clean `npm ci` with the declared runtime and normal install settings as the installation acceptance check.

## Dependencies and Documentation

When adding a dependency, update the `README` with the relevant setup, usage, or dependency notes.

## Maintaining These Instructions

Add an instruction only when it captures a recurring, repository-specific requirement that is not already covered here, in a project skill, or by project tooling.

Before adding it:

- Search the complete applicable instruction set for overlapping or contradictory requirements.
- List every potential conflict in the implementation plan and include the necessary resolutions in the approved change.
- Check whether an existing instruction can be clarified or extended instead.
- Place general rules here and task-specific workflows in the closest applicable project skill.
- Keep it concise, actionable, and limited to one concern.
- Avoid duplicating behavior already enforced by formatters, linters, tests, or other project tooling.

If the new instruction changes the scope or intent of an approved plan, stop and request approval for the updated plan before editing files.
