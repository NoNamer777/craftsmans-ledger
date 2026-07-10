---
status: accepted
---

# Root-only `markdownlint-cli2` config, not a `packages/markdownlint-config` package

Following [ADR-0005](./0005-root-only-prettier-config.md)'s reasoning for Prettier, `markdownlint-cli2`'s config stays at the repo root (`.markdownlint-cli2.yaml`) rather than getting its own `packages/markdownlint-config` workspace package. The base/overlay split behind [ADR-0016](./0016-base-overlay-split-for-lint-configs.md) exists because `eslint-config`/`stylelint-config` need genuinely different rules per framework (Angular apps vs. plain TS/config packages); Markdown content rules don't vary along that axis — an ADR, a package README, and the root README are all just Markdown, with no per-project overlay to encapsulate. Like Prettier, `markdownlint-cli2` is invoked once, workspace-wide, directly by its own CLI (`pnpm moon run root:lint-md`), so a root config file is inherently workspace-wide without needing package-name resolution.

## Consequences

- A reader who notices `packages/tsconfig`, `packages/eslint-config`, `packages/stylelint-config` but no `packages/markdownlint-config` should not assume it's an oversight.
- If a future project ever needs Markdown rules that genuinely differ from the rest of the workspace, this decision should be revisited the same way ADR-0016 revisited `tsconfig`'s split for `eslint-config`/`stylelint-config`.
