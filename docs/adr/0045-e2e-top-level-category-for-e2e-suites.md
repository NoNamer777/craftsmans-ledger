---
status: accepted
---

# `e2e/` as a new top-level project category, alongside `apps/`, `libs/`, `packages/`

`#94` needed a home for the Playwright *E2E suite* (see [CONTEXT.md](../../CONTEXT.md) for the E2E suite/E2E environment distinction). [ADR-0003](./0003-libs-vs-packages-split.md) had already drawn a two-way line for shared code — `libs/` for shared runtime app code, `packages/` for shared build/lint tooling — and neither fits an E2E suite: it's not shared code at all, it's a standalone, deployable-in-its-own-right test suite that happens to target another project. `apps/e2e-web` was the alternative — reusing the existing `apps/*` glob with zero workspace config changes — but that would stretch `apps/` to mean "top-level project" generally rather than "deployable application" specifically, and more E2E suites (e.g., one for a future API) are expected, making this a repeated pattern rather than a one-off.

`e2e/` is now a first-class category in both `.moon/workspace.yml`'s `projects.globs` and `pnpm-workspace.yaml`'s `packages` list, with `e2e/web/` as its first member (moon project `e2e-web`). Each suite gets its own moon project `id` override — moon's default id-from-folder-name inference would otherwise collide with the app it targets (`e2e/web` and `apps/web` both inferring `web`).

## Consequences

- A future E2E suite for another target follows the same `e2e/<target>/` shape with no further workspace-glob changes needed.
- `apps/`'s meaning stays strictly "deployable application" — it doesn't have to absorb test-suite projects that aren't deployable artifacts themselves.
- Anyone extending the `libs/`/`packages/` split from ADR-0003 should read this as a third, orthogonal category (test suites targeting another project), not a rebuttal of ADR-0003's runtime vs. build time reasoning.
