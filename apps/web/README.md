# Web

![Angular](https://img.shields.io/badge/angular-22.0.5-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-6.0.3-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-4.1.9-6E9F18?logo=vitest&logoColor=white)

Main Angular web client for Craftsman's Ledger — track unlocked recipes, find vendors, compare recipe profitability, and browse the tech tree.

## Commands

Run these via moon from the repo root, not `ng` directly — moon owns task orchestration/caching for the whole workspace (see [ADR-0001](../../docs/adr/0001-moonrepo-mise-pnpm-for-monorepo-tooling.md)):

```bash
pnpm moon run web:start   # dev server at http://localhost:4200
pnpm moon run web:build   # production build to dist/web
```

## Notable choices

- Self-contained Angular CLI workspace (its own `angular.json`), not a project inside a shared root workspace — see [ADR-0012](../../docs/adr/0012-self-contained-angular-workspace-per-app.md).
- Zoneless change detection, and Vitest (not Karma/Jasmine) as the test runner — see [ADR-0013](../../docs/adr/0013-zoneless-vitest-testing-stack.md).
- `@angular/*` dependencies and `typescript` are version-pinned via the workspace root's `catalog:angular` pnpm catalog, not directly in this package's `package.json`.

## Status

Shell only — no domain routes or components yet. Styling (Tailwind + SCSS), shared lint configs, and the full Vitest setup land in follow-up phases; see [docs/plans/scaffold-apps-web.md](../../docs/plans/scaffold-apps-web.md).
