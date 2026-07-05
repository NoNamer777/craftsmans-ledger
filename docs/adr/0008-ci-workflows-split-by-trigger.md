---
status: accepted
---

# CI workflows are split by trigger, not by concern

`.github/workflows/` splits CI by trigger type rather than by a single `ci.yml` or files split by concern (e.g. `format.yml`/`lint.yml`). `pull-request.yml` (`pull_request` events targeting `main`) owns pre-merge verification — a single `ci` job running `moon ci` with explicit targets (today: `:format-check`; lint/build/typecheck/test targets join it as those tasks come to exist) — and is the required status check for branch protection (see [ADR-0009](./0009-branch-protection-requires-ci-check.md)). A second workflow, `push-main.yml`, re-runs the same `ci` job on push to `main`, and will also become the home for post-merge-only concerns — building/promoting Docker images and cleaning up old tags — once there's a real app to build.

The `ci` job's steps live in a composite action at `.github/actions/ci/`, invoked by both workflows after each does its own `actions/checkout`. Composite actions can't check out the repository themselves — the calling workflow must already have it checked out before the local action path can even be resolved — so `checkout` stays duplicated in both workflow files while everything after it is shared. Toolchain provisioning (pnpm, Node.js, `pnpm install`) is factored further into its own `.github/actions/setup/`, which `.github/actions/ci/` composes — separating "get the environment ready" from "run the checks" so future jobs (e.g., a Docker build/E2E job on `pull-request.yml`) can reuse just the setup step without pulling in `moon ci`.

## Consequences

- Adding a new verification step (lint, test, build) means editing `.github/actions/ci/action.yml` once; both workflows pick it up automatically.
- A reader expecting a conventional single `ci.yml` should not assume the split is an oversight — it anticipates `push-main.yml` growing independent post-merge jobs that have no reason to exist in `pull-request.yml`.
- A composite action (not a reusable `workflow_call` workflow) was chosen specifically so the required-status-check name stays `ci` in both workflows — a reusable workflow would have changed the check's reported name/context.

## Amendment (2026-07-05)

The original text of this ADR reasoned that `push-main.yml` didn't need to re-run `ci`, since branch protection (ADR-0009) already guarantees it passed on the PR — and left the file uncreated on that basis. That reasoning missed a separate justification: re-running `ci` on push to `main` confirms `main` itself is green and deployable/releasable at any point in time, independent of whether the PR-time check still reflects the merged tree (e.g., GitHub's merge process can produce a tree that was never itself tested, if `main` advanced past the PR's base before merging). `push-main.yml` now exists for this reason, sharing `ci`'s steps with `pull-request.yml` via the composite action described above.
