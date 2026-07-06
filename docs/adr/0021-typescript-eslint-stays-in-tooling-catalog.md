---
status: accepted
---

# `typescript-eslint` stays in `catalog:tooling`, not `catalog:angular`

[ADR-0011](./0011-per-framework-typescript-catalogs.md) split `typescript` into per-framework pnpm catalogs because each framework has a different maximum supported *compiler* version, a hard, exact-version constraint. `typescript-eslint` looks like it should follow the same split, but it declares a `peerDependencies` *range* on `typescript`, not an exact pin, so a single shared version can plausibly satisfy Angular's and a future NestJS app's TypeScript pins at once. `typescript-eslint`, alongside the framework-agnostic `eslint`, `@eslint/js`, `eslint-config-prettier`, and `jiti`, goes into `catalog:tooling`. Only `angular-eslint` — genuinely Angular-only, no NestJS equivalent — goes into `catalog:angular`.

## Considered Options

- **Mirror ADR-0011 exactly and put `typescript-eslint` in `catalog:angular` pre-emptively** — rejected as forking a dependency before there's evidence it actually needs to fork.

## Consequences

- If a future NestJS app's TypeScript pin turns out to be genuinely incompatible with the shared `typescript-eslint` version, that's the point where it forks into a `catalog:nest`-local override, deferred until that app actually exists, mirroring ADR-0011's own stance.
