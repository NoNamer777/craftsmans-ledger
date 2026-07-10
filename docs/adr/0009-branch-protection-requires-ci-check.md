---
status: accepted
---

# Branch protection on main requires the ci status check

`main` is configured with branch protection (a GitHub ruleset) requiring the `ci` job (from `pull-request.yml`, see [ADR-0008](./0008-ci-workflows-split-by-trigger.md)) and code scanning results (CodeQL) to pass before a PR can merge, with "require branches to be up to date before merging" also enabled so a merge can't land against a stale base. This is a GitHub repository setting, not a file in the repo, so it's invisible to anyone reading the checked-in source — recorded here so the constraint isn't lost. Commit-message linting (commitlint) was deliberately left out of the required checks this session, deferred to a separate future pass rather than silently decided either way.

The ruleset's bypass list is deliberately empty — not even repo admins can merge to `main` without satisfying every rule above. There is no emergency-hotfix escape hatch by design; the intent is that `main` is always deployable, with no exceptions carved out in advance.

The ruleset also restricts **allowed merge methods to "Merge" only** (no squash, no rebase), specifically to preserve the exact commit SHAs created on the PR branch. Squash-merge collapses a PR's commits into one, discarding the atomic, well-typed Conventional Commits the `commit` skill deliberately produces. Rebase-and-merge replays commits onto `main`'s tip, which changes their parent and therefore their SHA even though content/message stay the same. Only a plain merge commit keeps the original commits reachable under their original identity. "Require linear history" stays disabled, since it would forbid merge commits outright, directly conflicting with this choice.

## Consequences

- Renaming the `ci` job requires a corresponding update to `main`'s branch protection settings, not just the workflow file, or PRs become unmergeable (the required check never reports as passing).
- `push-main.yml` (see [ADR-0008](./0008-ci-workflows-split-by-trigger.md)) re-verifies `main` after merge independently of this constraint, since a merge landing here has already passed `ci` on its PR.
- A future contributor proposing "just squash-merge for a cleaner history" should not assume the current setting is an oversight — it's deliberate to preserve commit SHA identity.
- `docker-web` and `e2e-web` were later added as further required checks, gated dynamically rather than unconditionally — see [ADR-0040](./0040-dynamic-required-checks-via-skip-as-success.md).
