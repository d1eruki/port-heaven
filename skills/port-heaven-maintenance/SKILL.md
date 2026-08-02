---
name: port-heaven-maintenance
description: Audit and modernize Port Heaven dependencies, tooling, and custom mechanisms while preserving a coherent compatible stack. Use only when the user explicitly requests a project-currency audit, dependency updates, compatibility research, or evaluation of maintained public libraries as replacements for custom code.
---

# Port Heaven Maintenance

Treat maintenance as a compatibility problem across one connected system, not as a sequence of isolated package upgrades. Prefer the newest level the whole project can support safely over the newest version of each package independently.

## Establish the Baseline

1. Confirm the repository root and preserve unrelated worktree changes.
2. Read the manifest, lockfile, runtime declarations, build configuration, test configuration, CI or hosting configuration, and dependency documentation relevant to the requested scope.
3. Record the current Node.js and package-manager requirements, lockfile format, framework and bundler versions, browser or deployment constraints, and any pinned packages or documented workarounds.
4. Distinguish direct dependencies, development dependencies, optional dependencies, and important transitive dependencies. Put libraries imported by browser application code and responsible for shipped product behavior in `dependencies`, even when Webpack bundles them at build time. Keep bundlers, compilers, loaders, asset processors, linters, formatters, test tools, and local servers in `devDependencies`. Do not move packages between groups without a runtime or deployment reason.
5. Run the audit read-only until the user approves a file-change plan required by `AGENTS.md`.

## Audit Currency and Maintenance

Use current primary sources because versions, support policies, and compatibility tables change over time.

1. Compare installed, declared, latest stable, and latest compatible versions. Inspect dist-tags instead of assuming `latest` is the intended release line.
2. Read official release notes, migration guides, engine requirements, peer dependency ranges, deprecations, and known breaking changes for every proposed major update.
3. Inspect the connected dependency chain around each update: runtime, package manager, framework, bundler, dev server, plugins, loaders, compilers, linters, test runners, and their shared transitive packages.
4. Check package maintenance status, release recency, security advisories, repository health, license, and replacement or deprecation notices. Treat security findings separately from compatibility findings.
5. Use commands such as `npm outdated`, `npm view`, `npm ls`, and `npm explain` as evidence. Do not treat a single command's output as sufficient compatibility proof.

## Review Every Direct Dependency

When the user requests a project-wide dependency audit, account for every direct dependency in the manifest rather than reporting only outdated packages.

1. Map each package to its actual imports, configuration, scripts, tests, documentation, or generated assets. Mark packages with no confirmed consumer as removal candidates; do not infer that a build-time package is unused because application source does not import it.
2. Record the declared and installed versions, the latest compatible and stable versions, the latest release date, npm deprecation status, repository archive status, and significant unresolved maintenance signals. Inspect important transitive dependencies when a direct package is old, deprecated, or unusually broad.
3. Distinguish an abandoned package from a stable package with infrequent releases. Treat an archived repository, explicit deprecation or replacement notice, unsupported runtime, or long-inactive repository with unresolved compatibility work as stronger evidence than release age alone.
4. For every risky package, compare keeping it, removing it, using a platform or already-installed-library capability, and adopting a maintained replacement. Reject alternatives whose maintenance, compatibility, accessibility, bundle cost, or migration surface is not materially better.
5. Classify every direct dependency as `keep`, `update`, `replace`, `remove`, or `defer`. Report confirmed evidence separately from hypotheses, state why each replacement is worth its migration cost, and give a prioritized batch order without modifying files before approval.

Include these audit totals in the report: direct dependencies reviewed, confirmed consumers, unused candidates, compatible updates, major-version migrations, abandoned packages, maintenance risks, deprecated direct packages, and deprecated transitive packages found in the inspected paths. State explicitly when security advisory checking was not performed or could not be completed.

## Evaluate Custom Mechanisms

1. Map the custom mechanism's contract, lifecycle, consumers, edge cases, fallbacks, tests, and production constraints before suggesting a replacement.
2. Look first for a browser or Node.js built-in, an API in an already-installed library, or an established project pattern. Consider a new public dependency only when those are insufficient.
3. Compare candidate libraries by maintenance, compatibility, API fit, bundle and install cost, tree-shaking, browser and runtime support, accessibility, licensing, security history, migration effort, and ownership of future behavior.
4. Recommend replacement only when it removes meaningful maintenance burden without losing required behavior or creating a larger integration surface. Keep small, stable, project-specific code when a dependency would add more risk than it removes.
5. Report rejected candidates and the concrete mismatch so the same unsuitable option is not reconsidered without changed circumstances.

## Derive a Compatible Target

1. Build a compatibility graph for every coupled upgrade. Identify which packages constrain each other through engines, peer dependencies, compiler APIs, plugin APIs, or lockfile behavior.
2. Select the highest mutually supported target versions. State separately which newer versions exist but remain blocked, why they are blocked, and what future change would unblock them.
3. Group coupled packages into one atomic batch. Do not upgrade a framework, bundler, dev server, compiler, loader, or test adapter independently when its compatibility depends on the rest of the chain.
4. Separate low-risk independent updates from major migrations. Keep each batch independently reviewable, but do not split a connected compatibility change into temporarily invalid states.
5. Define observable acceptance checks before editing: clean installation, dependency-tree validity, formatting, integrity tests, browser tests, production build, and any migration-specific behavior.

## Update Without Hiding Conflicts

1. Modify manifests through the package manager where practical and allow it to regenerate the lockfile. Do not edit resolved lockfile entries by hand.
2. Require a clean `npm ci` using the project's declared runtime and normal install settings as the installation acceptance check.
3. Do not accept `--force`, `--legacy-peer-deps`, broad `overrides`, or ignored engine checks as permanent compatibility fixes. Use them only as explicitly approved diagnostics or temporary migrations with a documented owner, reason, risk, and removal condition.
4. When installation fails, identify the exact conflicting dependency ranges with `npm explain`, `npm ls`, lockfile inspection, and upstream compatibility documentation. Then upgrade, pin, replace, or postpone the connected chain coherently.
5. Do not run automatic forced security upgrades. Evaluate whether an advisory affects production, development only, or an unreachable path, then resolve it through a compatible upstream version or a documented temporary decision.
6. Stop and request a revised approval when resolving a conflict changes the approved files, dependency strategy, runtime target, or product behavior.

## Verify and Report

Follow `$port-heaven-verification` for approval, visual review, test ordering, and build requirements.

1. Verify each approved compatibility batch once after implementation, including a production build whenever dependencies, build configuration, asset processing, or production-only behavior changes.
2. Confirm both declared dependency validity and actual clean installation. A working existing `node_modules` directory is not evidence that the lockfile installs cleanly.
3. Report selected versions, skipped versions and blockers, removed workarounds, remaining temporary workarounds, custom mechanisms retained or replaced, and the evidence supporting each decision.
4. Record any intentionally deferred update with its blocking constraint and a concrete revisit condition. Do not describe the project as fully current when known compatible or blocked updates remain undisclosed.
