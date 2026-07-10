---
status: accepted
---

# `docker-web`/`e2e-web` become required checks, gated dynamically via GitHub's skip-as-success semantics

[ADR-0009](./0009-branch-protection-requires-ci-check.md) originally required only `ci` (plus CodeQL) on `main` — the `docker` job (build+push, since renamed `docker-web`) existed but wasn't required. Now that a real `e2e-web` job validates the built image against a live E2E environment ([ADR-0039](./0039-web-e2e-environment-ci-only-compose-caddy.md)), both `docker-web` and `e2e-web` become required checks too: a PR that breaks `web`'s image build or its E2E environment shouldn't be mergeable.

Both jobs are conditional — job-level `if: needs.ci.outputs.web-affected == 'true'` ([ADR-0036](./0036-moon-affected-gates-docker-jobs.md)), so they only run when `web` is actually affected. Verified against GitHub's own documentation: a job skipped via an `if:` condition reports status "Success" for required-status-check purposes, *provided the workflow itself still runs* for that trigger. `pull-request.yml` always runs (ADR-0036 deliberately used a job-level `if:` rather than a trigger-level `paths:` filter, which is what makes this possible at all — a `paths:`-filtered-out workflow leaves its checks permanently "Pending," blocking merge instead of passing). So marking `docker-web`/`e2e-web` required doesn't block PRs that never touch `web`; it only gates the PRs where they actually execute and could fail.

The footgun this design has to avoid: a job skipped because a `needs:` dependency *failed* reports the same generic "skipped" status as a job skipped by its own `if:` condition — GitHub doesn't distinguish the two causes. If only `e2e-web` (the terminal job) were listed as required, a `docker-web` failure would cause `e2e-web` to be skipped as a side effect of its failed dependency, which would then report as Success and let a broken image build merge silently. Both jobs must be explicit required checks for this to be safe — not just the last one in the chain.

This pattern is meant to generalize: a future containerized project (e.g. `api`) gets its own `docker-<project>`/`e2e-<project>` job pair, each added to the required-checks list the same way, each independently gated by that project's own `affected` output.

## Consequences

- Branch protection is a GitHub repository setting, not a file in this repo — this ruleset change has to be applied out-of-band (UI or `gh api`), same issue [ADR-0009](./0009-branch-protection-requires-ci-check.md) already flags for the original `ci` requirement.
- Renaming `docker-web` or `e2e-web` later requires a matching branch-protection update, or PRs become unmergeable — same failure mode ADR-0009 already warns about for `ci`.
- Rejected alternative: a single fan-in "gate" job (`needs: [ci, docker-web, e2e-web]`, `if: always()`, inspecting `needs.*.result`) as the one required check — the commonly recommended pattern for conditional required checks generally. Not needed here, since GitHub's skip-as-success behavior already gives the same guarantee without an extra job to maintain. Revisit if that behavior ever changes, or if a future project's gating logic gets complex enough that per-job required checks stop being tractable.
