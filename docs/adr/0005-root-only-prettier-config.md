---
status: accepted
---

# Root-only Prettier config, not a `packages/prettier-config` package

Following [ADR-0003](./0003-libs-vs-packages-split.md)'s `packages/*` split, Prettier's config stays at the repo root (`.prettierrc.yaml`) rather than getting its own `packages/prettier-config` workspace package. Unlike `tsconfig`/`eslint-config`/`stylelint-config` — each consumed by name (`workspace:*`, `extends`) from other packages — Prettier's config is only ever read by the `prettier` CLI itself, invoked from the repo root; Prettier already resolves config by walking up from cwd, so a root file is inherently workspace-wide without needing package-name resolution. Nothing will ever `workspace:*`-depend on a `packages/prettier-config` to re-export it.

## Consequences

- A reader who notices `packages/tsconfig`, `packages/eslint-config`, `packages/stylelint-config` but no `packages/prettier-config` should not assume it's an oversight.
