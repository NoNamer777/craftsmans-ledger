---
status: accepted
---

# Prettier owns all formatting; ESLint/Stylelint disable overlapping rules

Prettier is the sole source of truth for formatting-related concerns workspace-wide, including import statement ordering (via `prettier-plugin-organize-imports`). When `packages/eslint-config` and `packages/stylelint-config` get real content, each must depend on and extend from `eslint-config-prettier` / `stylelint-config-prettier` last in their extends chain, disabling built-in rules that would otherwise fight Prettier's output — including import-sorting ESLint rules, which must not be added since Prettier's plugin already owns that.

## Consequences

- Anyone adding rules to `packages/eslint-config`/`packages/stylelint-config` later should treat formatting-adjacent rules (indentation, quotes, import order, property order) as already owned by Prettier, not something to re-litigate at the linter layer.
