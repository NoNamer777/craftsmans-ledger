---
status: accepted
---

# `moon query projects --affected` gates both Docker CI jobs, not a path filter

The new `docker-web` job in `pull-request.yml` and `docker-promote` job in `push-main.yml` both need to skip their build/promote work when a PR (or the commit it merges) didn't actually touch `web` — otherwise every PR in the monorepo, including ones only touching a future NestJS API, would build and push a `web` image. Neither job is itself a moon task (the image is built via Bake/`docker build`, not `moon run`), so neither gets moon's dependency-graph-aware affected-detection automatically the way `moon ci`'s targets do.

Both jobs run `pnpm moon query projects --affected --id <project> | jq '.projects | length'` as an explicit gating step rather than a GitHub Actions `paths:` filter on the trigger. A plain path glob (e.g. `apps/web/**`) can't see `web`'s dependency graph — a change to `packages/tsconfig` (which `web` depends on) would silently fail to trigger the build under a glob, but correctly does under moon's affected-detection, since `moon query projects --affected` walks the same project graph moon uses everywhere else. This matches this repo's established preference for a tool's native mechanism over a generic workaround (see [ADR-0007](./0007-ci-toolchain-via-setup-node-pnpm-action-setup.md), [ADR-0025](./0025-moon-docker-scaffold-pattern-for-web-image.md)).

The check itself lives in `.github/actions/affected/` — a composite action taking a `project` input and exposing an `affected` output — rather than being duplicated inline in each workflow. Both `pull-request.yml` and `push-main.yml`'s `ci` jobs invoke it with `project: web` today; a future second frontend app just calls the same action with its own project ID, without copying the `jq`/bash logic a third time.

Empirically verified against the actual `moon` CLI (v2.3.5, this repo): `moon query projects --affected --id web` returns `"projects": []` when `web` isn't affected, and a populated array (containing the full `web` project definition) when it is — a reliable non-empty/empty signal for a bash conditional. Both workflows already checked out with `fetch-depth: 0` before this change, which moon's own CI guidance requires for accurate affected-detection (a shallow clone breaks its merge-base calculation) — no change was needed there.

`push-main.yml`'s `docker-promote` job re-runs the same check (against the merge commit) rather than trusting that the PR-time build necessarily ran: if a merged PR didn't touch `web`, no `pr-<N>` image was ever pushed, so promotion must be skipped rather than attempting to retag a non-existent tag.

In both workflows, the check itself runs as a step inside the existing `ci` job (after `pnpm`/`moon` are already provisioned there) rather than as a step inside the Docker-specific job — `ci` exposes it as a job output (`web-affected`), and the Docker job (`docker` in `pull-request.yml`, `docker-promote` in `push-main.yml`) declares `needs: ci` with a single job-level `if: needs.ci.outputs.web-affected == 'true'`. This replaced an earlier version of both jobs where the same `if: steps.affected.outputs.web == 'true'` condition was repeated on nearly every step. One job-level `if` is easier to read than several copies of the same step-level condition.

Moving the check out also let each Docker job drop steps that existed only to support running `moon` on the host. `pull-request.yml`'s `docker` job dropped its `Setup` step (`pnpm install`) — nothing left in it runs `moon` or needs Node/pnpm, since the whole build happens inside the Dockerfile's own stages. `push-main.yml`'s `docker-promote` job goes further and drops `checkout` entirely: unlike `docker`, it never builds anything locally (`imagetools create` and the cleanup action are both pure registry/API operations), so once `Setup` and the affected-check are gone, nothing in that job touches the local filesystem at all.

## Consequences

- Both Docker jobs now run strictly after `ci` completes rather than in parallel with it, since `needs: ci` is required to read `ci`'s job output. A PR/push that does affect `web` now takes `ci`'s runtime plus the Docker job's runtime end-to-end, rather than `max(ci, docker)` as before.
- The composite action's `affected` output is always a string (`'true'`/`'false'`), not a real boolean — call sites must compare with `== 'true'`, not use it as a truthy value directly, same as any other GitHub Actions output.
- If `moon`'s CI-provider auto-detection (via the `ci_env` crate) ever misidentifies a push-to-`main` event, it falls back to comparing against `vcs.defaultBranch` (`main`) per `.moon/workspace.yml` — which for a direct push *to* `main` would compare `main` against itself and report nothing affected. This hasn't been observed in practice, but is worth knowing if `docker-promote` unexpectedly no-ops after a merge that should have triggered it.
