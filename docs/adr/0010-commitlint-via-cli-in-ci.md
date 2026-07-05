---
status: accepted
---

# Commit message linting via commitlint's CLI directly in CI

Commit-message linting runs via the `commitlint` CLI itself, invoked directly as a step in `pull-request.yml` and a step in `push-main.yml` — not inside the shared `.github/actions/ci/action.yml` composite action that both workflows otherwise use for everything post-checkout — following [commitlint's official GitHub Actions guide](https://commitlint.js.org/guides/ci-setup.html#github-actions). `pull-request.yml` runs `commitlint --from <base sha> --to <head sha>`, checking every commit in the PR; `push-main.yml` runs `commitlint --last`, checking only the newly landed commit. Both workflows already check out with `fetch-depth: 0` (needed for the PR range) and already install dependencies via the shared `setup` composite action, so no additional setup steps were needed beyond the one lint step each workflow adds.

This is a deliberate exception to [ADR-0008](./0008-ci-workflows-split-by-trigger.md)'s "everything after checkout is shared" rule, not an oversight. That rule pays off when the shared logic is genuinely identical across triggers — `format-check` runs the same way regardless of what fired the workflow. Commitlint's correct invocation is inherently different per trigger (`--last` vs `--from`/`--to`), so folding it into the composite action would only reconstruct, via an `if: github.event_name` guard, information each workflow file already has for free. There's nothing to deduplicate when the two invocations never do the same thing; keeping the step local to each workflow lets it read as an unconditional statement of what that workflow actually does.

Branch protection's ruleset requires the `merge` method (not squash/rebase — see the amendment to [ADR-0009](./0009-branch-protection-requires-ci-check.md)), so every PR commit lands on `main` individually, and a merge commit is added on top. `commitlint --last` on push therefore lints that merge commit's own message; commitlint's `defaultIgnores` setting recognizes `Merge pull request #N ...`-shaped messages and skips them without any extra configuration, confirmed by testing one directly through the CLI.

This keeps the `@commitlint/cli`/`@commitlint/config-conventional` devDependencies (added to `package.json` via the `tooling` pnpm catalog) as the actual thing enforced in CI — unlike a Docker-based marketplace action, there's no separate bundled version to fall out of sync with. The same install also serves local tooling/editor resolution and the future Husky `commit-msg` hook ([ADR-0004](./0004-husky-lint-staged-for-git-hooks.md) deferred that hook setup; it isn't part of this decision).

The config lives at root-only (`commitlint.config.mjs`), following the same reasoning as [ADR-0005](./0005-root-only-prettier-config.md): it's only ever read by one CLI from the repo root, no `packages/commitlint-config` split needed. It extends `@commitlint/config-conventional` with one override — `subject-case` permits sentence-case (capitalized first letter, lowercase rest) in addition to the default's lower-case-only, since the repo's commit-authoring convention capitalizes subject lines.

## Consequences

- Adding a real build/test/lint task later still goes through `moon ci` as a target owned by `.github/actions/ci/action.yml`; commit-message linting stays outside both `moon ci` and that composite action, since it isn't a moon task (it lints commit messages, not project files) and its behavior isn't shared between triggers.
- A reader who notices the commitlint step duplicated across `pull-request.yml`/`push-main.yml`, unlike every other step, should not assume it's an oversight of ADR-0008's dedup rule — see above.
- Bumping the enforced commitlint ruleset means bumping the `catalog:tooling` version in `pnpm-workspace.yaml`, same as any other tooling dependency — no separate action version to track.
- Enforcement is CI-only for now; no local `commit-msg` hook exists until Husky/lint-staged are set up (ADR-0004).
