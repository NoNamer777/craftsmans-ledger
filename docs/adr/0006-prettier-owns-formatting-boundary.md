---
status: accepted
---

# Prettier owns all formatting; ESLint/Stylelint disable overlapping rules

Prettier is the sole source of truth for formatting-related concerns workspace-wide, including import statement ordering (via `prettier-plugin-organize-imports`). When `packages/eslint-config` and `packages/stylelint-config` get real content, each must depend on and extend from `eslint-config-prettier` / `stylelint-config-prettier` last in their extends chain, disabling built-in rules that would otherwise fight Prettier's output — including import-sorting ESLint rules, which must not be added since Prettier's plugin already owns that.

## Consequences

- Anyone adding rules to `packages/eslint-config`/`packages/stylelint-config` later should treat formatting-adjacent rules (indentation, quotes, import order, property order) as already owned by Prettier, not something to re-litigate at the linter layer.

## Amendment (2026-07-07)

Markdown (`.md`) is excluded from Prettier's scope entirely — it is not, and will not be, added to `.prettierignore`'s re-include list. Prettier's Markdown printer reflows prose to its configured print width, which would rewrite every ADR's and README's intentionally unwrapped long-paragraph lines (see `docs/adr/0016-base-overlay-split-for-lint-configs.md` for an example of the style) into hard-wrapped text on the first run — a large, low-value diff across all existing Markdown. `markdownlint-cli2` (see [ADR-0032](./0032-root-only-markdownlint-config.md)) owns both linting and fixing for Markdown alone, with `MD013` (line-length) disabled so it doesn't fight the same unwrapped-line style. "Prettier owns all formatting" therefore now reads as "all formatting for the file types Prettier is configured for" — Markdown is a deliberate, narrow exception, not an oversight.
