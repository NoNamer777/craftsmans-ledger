---
status: accepted
---

# Branch protection on main requires the ci status check

`main` is configured with branch protection requiring the `ci` job (from `pull-request.yml`, see [ADR-0008](./0008-ci-workflows-split-by-trigger.md)) to pass before a PR can merge. This is a GitHub repository setting, not a file in the repo, so it's invisible to anyone reading the checked-in source — recorded here so the constraint isn't lost. Commit-message linting (commitlint) was deliberately left out of the required checks this session, deferred to a separate future pass rather than silently decided either way.

## Consequences

- Renaming the `ci` job requires a corresponding update to `main`'s branch protection settings, not just the workflow file, or PRs become unmergeable (the required check never reports as passing).
- `push-main.yml`'s absence (per ADR-0008) is safe under this constraint: nothing reaches `main` without `ci` having already run on its PR.
