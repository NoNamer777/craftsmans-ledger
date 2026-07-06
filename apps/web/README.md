# Web

![Angular](https://img.shields.io/badge/angular-22.0.5-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-6.0.3-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-4.1.9-6E9F18?logo=vitest&logoColor=white)

Main Angular web client for Craftsman's Ledger — track unlocked recipes, find vendors, compare recipe profitability, and browse the tech tree.

## Commands

Run these via moon from the repo root, not `ng` directly — moon owns task orchestration/caching for the whole workspace (see [ADR-0001](../../docs/adr/0001-moonrepo-mise-pnpm-for-monorepo-tooling.md)):

```bash
pnpm moon run web:start       # dev server at http://localhost:4200
pnpm moon run web:build       # production build to dist/web
pnpm moon run web:test        # Vitest in watch mode
pnpm moon run web:test-ci     # Vitest once, with coverage and an HTML report
pnpm moon run web:lint-ts     # ESLint
pnpm moon run web:lint-css    # Stylelint
pnpm moon run web:typecheck   # tsc --noEmit across the app, spec, and eslint tsconfigs
```

## Notable choices

- A project in the shared root `angular.json` workspace, not a self-contained Angular CLI workspace of its own — see [ADR-0020](../../docs/adr/0020-root-level-angular-workspace.md), superseding [ADR-0012](../../docs/adr/0012-self-contained-angular-workspace-per-app.md).
- Zoneless change detection, and Vitest (not Karma/Jasmine) as the test runner — see [ADR-0013](../../docs/adr/0013-zoneless-vitest-testing-stack.md).
- `@angular/core`, `@angular/platform-browser`, `@angular/router`, and the Angular CLI toolchain (`@angular/build`, `@angular/cli`, `@angular/compiler-cli`) are declared in the workspace root's `package.json` instead of here, so the root `angular.json` resolves a single version. The remaining `@angular/*` packages and `typescript` are still pinned directly in this package's `package.json`, via the workspace root's `catalog:angular` pnpm catalog.

## Status

Shell only — no domain routes or components yet. Styling (Tailwind + SCSS), shared lint configs, and the full Vitest setup have all landed.
