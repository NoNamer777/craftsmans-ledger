---
status: accepted
---

# Keep a Changelog per package, frozen at Unreleased

Every real project under `apps/`, `packages/`, and `libs/` gets a `CHANGELOG.md` following the [Keep a Changelog](https://keepachangelog.com/) format; `e2e/` suites are skipped since they're test code with no consumer to inform. Every package here stays pinned at `0.0.0` and is never published or released via semver — deployment happens through PR-numbered Docker tags promoted to `next` — so there's no version to hang a `## [x.y.z] - date` heading on. Rather than invent a fake version scheme just to satisfy the format, every entry lives under one flat, undated `## [Unreleased]` section indefinitely. An entry only belongs in a package's changelog if it's consumer-relevant: would a consumer of this package/app (the end user for `web`, a dependent workspace package for the tooling configs) need to know about it to understand what changed? Internal refactors, tests, and tooling churn with no observable effect don't qualify, regardless of what commit type produced them. The convention is enforced by PR review, not CI or a git hook — an automated check can't reliably distinguish consumer-relevant changes from internal ones.

## Consequences

- Revisiting real semantic versioning for these packages is explicitly deferred, not rejected. If/when that happens, this convention will need to introduce actual `## [x.y.z]` sections and stop treating `Unreleased` as a catch-all.
- Existing packages (`apps/web`, `packages/eslint-config`, `packages/stylelint-config`, `packages/tsconfig`) were backfilled from git history, collapsed to reflect their current standing behavior rather than a full replay of every change and reversal along the way.
