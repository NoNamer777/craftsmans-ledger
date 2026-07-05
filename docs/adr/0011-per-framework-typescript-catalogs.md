---
status: accepted
---

# Per-framework pnpm catalogs for TypeScript, not a shared tooling pin

Angular and NestJS — the frameworks this monorepo is built around ([ADR-0001](./0001-moonrepo-mise-pnpm-for-monorepo-tooling.md)) — currently support different maximum TypeScript versions: Angular supports TypeScript 6, NestJS doesn't yet. Rather than adding `typescript` to the existing `catalog:tooling` pnpm catalog, which would force every consumer onto one pinned version, each framework gets its own named pnpm catalog (e.g. `catalog:angular`, `catalog:nest`) so its app can pin the TypeScript version that framework actually supports. `packages/tsconfig/base.json` stays limited to environment-agnostic `compilerOptions` (the `strict` family, `esModuleInterop`, `skipLibCheck`, etc.) with no `target`/`module`/`moduleResolution`/`lib`, so the same base can be extended by a future `angular.json` and `nest.json` overlay regardless of which TypeScript version each ends up pinning.

## Considered Options

- **A single shared `typescript` entry in `catalog:tooling`** — rejected, since it would force one version across frameworks with different support ceilings.

## Consequences

- Framework-specific overlays (`angular.json`, `nest.json`) stay deferred until each app actually exists, same as [ADR-0004](./0004-husky-lint-staged-for-git-hooks.md)'s precedent.
- `base.json` alone is intentionally incomplete — it won't compile anything until an overlay supplies `target`/`module`/`moduleResolution`/`lib`.
