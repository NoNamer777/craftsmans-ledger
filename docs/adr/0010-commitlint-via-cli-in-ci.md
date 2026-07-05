---
status: accepted
---

# Commit message linting via commitlint's CLI directly in CI

Commit-message linting runs via the `commitlint` CLI itself, invoked directly as a step in `pull-request.yml` — not inside the shared `.github/actions/ci/action.yml` composite action that workflow otherwise uses for everything post-checkout — following [commitlint's official GitHub Actions guide](https://commitlint.js.org/guides/ci-setup.html#github-actions). `pull-request.yml` runs `commitlint --from <base sha> --to <head sha>`, checking every commit in the PR. The workflow already checks out with `fetch-depth: 0` (needed for the PR range) and already installs dependencies via the shared `setup` composite action, so no additional setup steps were needed beyond the one lint step it adds.

`push-main.yml` deliberately does not run commitlint. Branch protection's ruleset requires the `merge` method (not squash/rebase — see the amendment to [ADR-0009](./0009-branch-protection-requires-ci-check.md)) with an empty bypass list, so the only commit that ever reaches `main` via push is the merge commit GitHub generates on merge — every individual PR commit was already linted by `pull-request.yml` before merging. Linting `--last` on push would only ever lint that generated merge commit, which commitlint's `defaultIgnores` setting recognizes (`Merge pull request #N ...`-shaped messages) and skips unconditionally — confirmed by testing one directly through the CLI. A step that can never do anything but pass isn't enforcement, it's a decoy; if the merge-method or bypass-list constraints ever loosen, commit linting on push should be reconsidered then, deliberately, alongside that change.

This is a deliberate exception to [ADR-0008](./0008-ci-workflows-split-by-trigger.md)'s "everything after checkout is shared" rule, not an oversight. That rule pays off when the shared logic is genuinely identical across triggers — `format-check` runs the same way regardless of what fired the workflow. Commit linting doesn't run on both triggers at all, so there's nothing to deduplicate or guard with `if: github.event_name`; keeping the step local to `pull-request.yml` lets it read as an unconditional statement of what that workflow actually does.

This keeps the `@commitlint/cli`/`@commitlint/config-conventional` devDependencies (added to `package.json` via the `tooling` pnpm catalog) as the actual thing enforced in CI — unlike a Docker-based marketplace action, there's no separate bundled version to fall out of sync with. The same install also serves local tooling/editor resolution and the Husky `commit-msg` hook ([ADR-0004](./0004-husky-lint-staged-for-git-hooks.md)); wiring that hook up isn't part of this decision.

The config lives at root-only (`commitlint.config.mjs`), following the same reasoning as [ADR-0005](./0005-root-only-prettier-config.md): it's only ever read by one CLI from the repo root, no `packages/commitlint-config` split needed. It extends `@commitlint/config-conventional` with one override — `subject-case` permits sentence-case (capitalized first letter, lowercase rest) in addition to the default's lower-case-only, since the repo's commit-authoring convention capitalizes subject lines.

## Consequences

- Adding a real build/test/lint task later still goes through `moon ci` as a target owned by `.github/actions/ci/action.yml`; commit-message linting stays outside both `moon ci` and that composite action, since it isn't a moon task (it lints commit messages, not project files) and only runs on one trigger.
- A reader who notices commit linting present in `pull-request.yml` but absent from `push-main.yml`, unlike every other step, should not assume it's an oversight of ADR-0008's dedup rule — see above.
- If the merge-method restriction or the empty bypass list on `main`'s ruleset ever changes (see [ADR-0009](./0009-branch-protection-requires-ci-check.md)), revisit whether `push-main.yml` needs its own commitlint step at that point.
- Bumping the enforced commitlint ruleset means bumping the `catalog:tooling` version in `pnpm-workspace.yaml`, same as any other tooling dependency — no separate action version to track.
- Enforcement now also runs locally: `.husky/commit-msg` invokes `commitlint --edit "$1"` directly (see [ADR-0004](./0004-husky-lint-staged-for-git-hooks.md)), the same ruleset as the PR check above.
