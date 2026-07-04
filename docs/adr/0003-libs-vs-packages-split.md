---
status: accepted
---

# Split shared code between `libs/` and `packages/`

The workspace has two directories that could both sound like "shared code," so the distinction is recorded explicitly: `libs/` holds shared *application* code — business logic, DTOs, Angular UI components — consumed at runtime by the apps in `apps/`. `packages/` holds shared *tooling/config* — `tsconfig`, `eslint-config`, `stylelint-config` — consumed by the build/lint pipeline, not at runtime. Each entry in `packages/` is a real workspace package with its own `package.json`, referenced by the apps via `workspace:*` and consumed by name (e.g. `@craftsmans-ledger/tsconfig/base.json`), not by relative path.

## Consequences

- Adding a new shared package means first deciding which side of the runtime/build-time line it falls on, rather than defaulting to whichever directory looks less full.
- `libs/` is currently empty and created lazily — it exists in the workspace globs, so it's ready the first time application code needs to be shared between `apps/*`.
