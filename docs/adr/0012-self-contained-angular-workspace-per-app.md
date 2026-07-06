---
status: superseded by ADR-0020
---

# Self-contained Angular CLI workspace per app, not a shared root `angular.json`

`apps/web` is the first Angular app in the monorepo, and Angular CLI supports either a single root-level `angular.json` holding multiple projects, or independent per-app workspaces. Each Angular app (`apps/web` now, a management client later) gets its own `angular.json`, `package.json`, and `tsconfig.json`, generated as a fully self-contained Angular CLI workspace under `apps/<name>`, rather than as a project nested inside one shared root `angular.json`. [ADR-0001](./0001-moonrepo-mise-pnpm-for-monorepo-tooling.md) already rejected Nx specifically to keep moonrepo as the sole task orchestrator; a shared root `angular.json` would reintroduce a second, framework-owned multi-project build graph running alongside moon's, and would break the pattern every other workspace member (`packages/tsconfig`) already follows of being independently addressable.

## Consequences

- All `@angular/*` packages, plus `typescript`, are pinned in a new `catalog:angular` pnpm catalog (extending the per-framework catalog precedent from [ADR-0011](./0011-per-framework-typescript-catalogs.md) beyond just TypeScript) so the Angular clients stay version-aligned without a shared `angular.json` forcing it.
- Each app's `angular.json`/build config is duplicated rather than shared; accepted as the cost of keeping apps independently addressable under moon.
