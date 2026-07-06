---
status: accepted
---

# Run lint-staged tasks serially, not concurrently, to prevent file-write races

Phase 7 of [`docs/plans/scaffold-apps-web.md`](../plans/scaffold-apps-web.md) extends `lint-staged.config.mjs` with `'*.ts': 'eslint --fix'` and `'*.scss': 'stylelint --fix'` entries alongside the existing catch-all `'*': 'prettier -w'` rule from [ADR-0004](./0004-husky-lint-staged-for-git-hooks.md). A staged `.ts`/`.scss` file matches both its type-specific entry and the catch-all, and lint-staged runs each matched glob's command as a sibling task with its own default of `concurrent: true` — meaning both commands spawn against the same file at the same time.

This was verified empirically to be a real, silent data-loss bug, not a theoretical one: two commands writing the same staged file concurrently each read the full file into memory, apply their own fix, and write it back independently. Whichever process finishes last overwrites the other's output — with no error, warning, or conflict marker. Applied to `prettier -w` and `eslint --fix`/`stylelint --fix` running concurrently, either tool's changes can be silently and non-deterministically dropped on any given commit.

`.husky/pre-commit` invokes `pnpm lint-staged --concurrent false`, so each matched pattern group's task runs to completion before the next starts, eliminating the overlap entirely. `concurrent` is a CLI/JS-API-only option, not a `lint-staged.config.mjs` key — every key in that file is validated as a glob-pattern-to-task mapping, so the flag has to live on the invocation, not the config object (confirmed by actually trying `concurrent: false` in the config file first, which lint-staged rejected with a validation error). The order in which the now-serialized groups run doesn't matter for correctness: `eslint-config-prettier` (added in Phase 4) already disables the ESLint stylistic rules that would otherwise conflict with Prettier's own formatting output, so neither tool undoes the other's work regardless of which runs first.

## Consequences

- `pnpm lint-staged` runs slightly slower per commit (serial instead of parallel) — acceptable, since pre-commit hooks aren't performance-sensitive the way CI is.
- Any future lint-staged entry whose glob overlaps an existing one (e.g. a `*.json` formatter added alongside the catch-all) automatically inherits this race protection — it isn't something to re-derive per new entry.
- This is scoped to the git-hook path only; `moon ci`'s target list and task graph are unaffected, keeping ADR-0004's separation between the git-hook path and the moon-task path intact.
