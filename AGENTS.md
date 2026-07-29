# Repository Instructions

## Repository Identity

Before modifying files, verify that the resolved Git root matches the repository established for the task. Do not edit another checkout, clone, or worktree merely because it became the current working directory. If the paths differ, stop and resolve the intended repository before making changes.

## Required Project Skills

- Use `$port-heaven-frontend` for frontend implementation, review, or diagnosis involving `src/`, Vue, CSS, Tailwind, themes, color tokens, responsive behavior, accessibility, or localization.
- Use `$port-heaven-verification` whenever changing repository files, planning or modifying tests, or validating completed work.
- If either skill is not discoverable, read its `SKILL.md` directly from `skills/` before continuing.

## Change Approval

Before making any file changes, explain the intended plan and wait for explicit user approval.

The plan must state:

- Which files will be changed.
- Which files, if any, will be deleted.
- What will be changed or removed in each file.
- Why each change is needed.

After the plan, briefly explain its pros and cons in plain language that is easy to understand without programming knowledge. If there are multiple pros or multiple cons, format each group as a numbered list.

Do not edit, delete, rename, format, generate, or otherwise modify files before the user approves the plan. Files may be deleted when they are left empty or become outdated.

If the approved file list changes, a deletion becomes necessary, or the task materially expands during the work, stop, describe the updated plan, and wait for approval again before continuing. Implementation details that stay within the approved files and intent do not require another approval, but explicitly tell the user that the change continues the approved plan before editing.

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

Identify the smallest existing property or mechanism that directly controls the requested result, and change that first. Do not restructure the DOM, positioning, layout, components, or state when a local adjustment to the existing mechanism is sufficient. Expand the implementation scope only after confirming that the smaller change cannot satisfy the requirement.

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
