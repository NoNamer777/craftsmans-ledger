---
status: accepted
---

# Merge overlapping lint-staged globs into ordered command arrays, instead of a catch-all pattern plus a global concurrency flag

Adding `'*.{ts,js,mjs,cjs,mts,cts}': 'eslint --fix'` and `'*.scss': 'stylelint --fix'` entries to `lint-staged.config.mjs`, alongside the existing catch-all `'*': 'prettier -w'` rule from [ADR-0004](./0004-husky-lint-staged-for-git-hooks.md), left the catch-all unchanged at first: a staged `.ts`/`.scss` file then matched both its type-specific entry and the catch-all, and lint-staged runs each matched glob's command as a sibling task with its own default of `concurrent: true` — meaning both commands spawned against the same file at the same time.

This was verified empirically to be a real, silent data-loss bug, not a theoretical one: two commands writing the same staged file concurrently each read the full file into memory, apply their own fix, and write it back independently. Whichever process finishes last overwrites the other's output — with no error, warning, or conflict marker.

Rather than disabling concurrency globally (e.g. `pnpm lint-staged --concurrent false`), the config itself removes the overlap: the catch-all is rewritten as the negated extglob pattern `'!(*.{ts,js,mjs,cjs,mts,cts,scss})'`, so it only ever matches files that aren't already owned by a type-specific entry, and each type-specific entry becomes an ordered array (`['eslint --fix', 'prettier -w']` / `['stylelint --fix', 'prettier -w']`) so Prettier still runs on those files, just as the second step of the same task instead of a separate sibling task. Verified empirically in a scratch lint-staged install (staged `.ts`/`.scss`/`.json`/`.md` files, `--verbose` output): the three glob groups start concurrently, but since their matched file sets are now disjoint by construction, there is no overlap to race — each type-specific group runs its own commands serially in the declared order, confirmed by `[STARTED]`/`[COMPLETED]` ordering never interleaving within a group. `eslint-config-prettier` already disables the ESLint stylistic rules that would otherwise conflict with Prettier's own formatting output, so running ESLint before Prettier within the same task is safe regardless of which rule set would otherwise "win."

This is more targeted than a global `--concurrent false`: it fixes the race at its source (the overlapping match, not the scheduling), and any lint-staged glob group whose file set doesn't overlap another one keeps running in parallel with the rest — e.g. `*.scss` and `*.{ts,js,mjs,cjs,mts,cts}` never touch the same files and continue to run concurrently with each other.

## Consequences

- Adding a new staged-file check later that overlaps an existing glob (e.g. a dedicated `*.json` formatter) requires adding that extension to the negated catch-all pattern *and* to the new entry's own array if Prettier should still run on it — this isn't automatic the way a global `--concurrent false` would have been, so it has to be re-derived per new entry rather than inherited for free.
- `.husky/pre-commit` stays a plain `pnpm lint-staged` invocation; the fix lives entirely in `lint-staged.config.mjs`.
- This is scoped to the git-hook path only; `moon ci`'s target list and task graph are unaffected, keeping ADR-0004's separation between the git-hook path and the moon-task path intact.
