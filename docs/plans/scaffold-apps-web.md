# Scaffold `apps/web` — the main Angular app

## Context

Craftsman's Ledger's `apps/` and `libs/` directories are currently empty; [ADR-0001](../adr/0001-moonrepo-mise-pnpm-for-monorepo-tooling.md) planned for two Angular clients and a NestJS API but deferred actually wiring any of them up. This plan scaffolds the first one — the main web client — as a fully self-contained, moon-orchestrated Angular CLI workspace, and builds out the two shared tooling packages (`eslint-config`, `stylelint-config`) that were left as empty placeholders waiting for exactly this moment.

Every decision below was resolved in a `/grill-with-docs` session and is recorded as [ADR-0012](../adr/0012-self-contained-angular-workspace-per-app.md) through [ADR-0019](../adr/0019-manual-tailwind-at-rule-allowlist.md). This plan is purely about sequencing the implementation — no further design decisions are expected, only CLI-version-specific flag names to confirm at execution time.

**Explicitly out of scope:** domain routes/components (empty shell app only), data-loading/API integration (`data/medieval_dynasty.xlsx` stays unwired), and E2E tests ([ADR-0013](../adr/0013-zoneless-vitest-testing-stack.md) names Playwright as the agreed tool, but building the suite is deferred).

**Delivery:** each phase below ships as its own pull request against `main`, rather than one large PR for the whole app.

## Phase 1 — Scaffold `apps/web` and register it with moon

- Run the Angular CLI (`pnpm dlx @angular/cli@latest new`) targeting `apps/web`: routing enabled, SCSS stylesheets, no SSR/prerendering, default `app` component prefix, unscoped package name `web`. Confirm at execution time whether the installed CLI version can select Vitest as the unit-test runner directly during `ng new` (skips redoing test setup in Phase 6) — use it if offered, otherwise accept the default and replace it in Phase 6.
- Enable zoneless change detection in `apps/web/src/app/app.config.ts` (the stable `provideZonelessChangeDetection` API, or whatever the installed Angular version currently calls it — check its docs, since this API name has moved between "experimental" and stable naming across recent majors).
- Move every `@angular/*` dependency plus `typescript` out of the generated `apps/web/package.json` and into a new `catalog:angular` entry in `pnpm-workspace.yaml` (mirroring the existing `catalog:tooling` shape), using the exact versions `ng new` resolved. Point `apps/web/package.json` at `catalog:angular` for those entries, per [ADR-0012](../adr/0012-self-contained-angular-workspace-per-app.md).
- Add `apps/web/moon.yml` (`layer: "application"`, `stack: "frontend"`, `toolchains: ["node"]`, modeled on `packages/tsconfig/moon.yml`) with `start` (`ng serve`) and `build` (`ng build`) tasks. `test`, `test-ci`, `lint-ts`, `lint-css` are added in their own phases below once the underlying tools exist.
- Verify: `pnpm install`, `pnpm moon run web:build`, `pnpm moon run web:start` (check the dev server actually serves the default Angular CLI landing page in a browser).

## Phase 2 — Tailwind v4 + SCSS

- Add Tailwind v4 (`tailwindcss`, `@tailwindcss/postcss`) as direct devDependencies of `apps/web` (not `catalog:angular` — Tailwind isn't an Angular package, no shared-catalog decision was made for it).
- Wire Tailwind into the Angular build (PostCSS config consumed by `@angular/build`) and add `@import "tailwindcss";` to the app's global stylesheet. Per [ADR-0014](../adr/0014-tailwind-utility-first-styling.md), this is the *only* global SCSS Tailwind needs — component templates use Tailwind utilities directly, SCSS stays reserved for real global concerns.
- Add `prettier-plugin-tailwindcss` to the root `package.json` devDependencies and `.prettierrc.yaml`'s `plugins` list, so class sorting happens through the existing repo-wide Prettier run ([ADR-0005](../adr/0005-root-only-prettier-config.md)/[ADR-0006](../adr/0006-prettier-owns-formatting-boundary.md)).
- Verify: `pnpm moon run root:format` sorts Tailwind classes in a scratch template edit; `pnpm moon run web:build` still succeeds with Tailwind's generated CSS present in the output.

## Phase 3 — `packages/tsconfig` Angular overlay

- Add `packages/tsconfig/angular.json`, extending `base.json` with the `target`/`module`/`moduleResolution`/`lib` settings Angular's installed TypeScript version needs (per [ADR-0011](../adr/0011-per-framework-typescript-catalogs.md), `base.json` deliberately omits these).
- Point `apps/web/tsconfig.json` (and its app/spec variants) at `@craftsmans-ledger/tsconfig/angular.json` instead of Angular CLI's generated inline `compilerOptions`; add `@craftsmans-ledger/tsconfig` as a `workspace:*` dependency of `apps/web`.
- Verify: `pnpm moon run web:build` still succeeds with the swapped-in tsconfig.

## Phase 4 — `packages/eslint-config` (base + angular overlay) and `apps/web` linting

- Flesh out `packages/eslint-config` from its current `.gitkeep` placeholder: `package.json` + `moon.yml` (`layer: "configuration"`, mirroring `packages/tsconfig`), matching README.md.
- `base.js` (ESM flat config): `@eslint/js` recommended, `typescript-eslint`'s `recommendedTypeChecked` + `stylisticTypeChecked`, and `eslint-config-prettier` — exported via the package's `./base` subpath export ([ADR-0017](../adr/0017-typescript-eslint-recommended-type-checked.md)).
- `angular.js`: imports and spreads `base.js` internally ([ADR-0016](../adr/0016-base-overlay-split-for-lint-configs.md)), adds `angular-eslint`'s recommended rules, its template-recommended rules, and its template accessibility rules — exported via `./angular`. Includes an override scoped to `**/*.spec.ts` relaxing `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-non-null-assertion`.
- `apps/web/eslint.config.js` imports `@craftsmans-ledger/eslint-config/angular` and re-exports it, wiring the type-aware rules to the app's tsconfig (e.g. typescript-eslint's `projectService`).
- Add the `lint-ts` task to `apps/web/moon.yml` (`eslint .`).
- Verify: `pnpm moon run web:lint-ts` runs clean against the scaffolded app; deliberately introduce a lint violation to confirm the rule set actually fires, then revert it.

## Phase 5 — `packages/stylelint-config` (base + angular overlay) and `apps/web` style linting

- Flesh out `packages/stylelint-config` the same way: `package.json` + `moon.yml` + README.md.
- `base.js`: `stylelint-config-standard-scss`, `stylelint-config-clean-order` ([ADR-0018](../adr/0018-stylelint-clean-order-over-recess-order.md)), plus disabling of any Stylelint rules that conflict with Prettier's SCSS formatting — exported via `./base`.
- `angular.js`: extends `base.js` internally, adds a manual `at-rule-no-unknown` override allowlisting Tailwind v4's at-rules (`@theme`, `@utility`, `@variant`, `@apply`, `@plugin`, `@source`) per [ADR-0019](../adr/0019-manual-tailwind-at-rule-allowlist.md) — exported via `./angular`.
- `apps/web`'s Stylelint config extends `@craftsmans-ledger/stylelint-config/angular`.
- Add the `lint-css` task to `apps/web/moon.yml` (`stylelint "**/*.scss"`).
- Verify: `pnpm moon run web:lint-css` runs clean against the app's real Tailwind `@import`/`@theme` usage from Phase 2 (this is the real test of the at-rule allowlist), and against any hand-written SCSS.

## Phase 6 — Vitest testing stack

- If Phase 1 didn't already scaffold Vitest, remove the default Karma/Jasmine setup and add `vitest`, `@vitest/browser`, `@vitest/ui`, `@vitest/coverage-v8`, and `playwright` as devDependencies of `apps/web`.
- `apps/web/vitest.config.ts`: browser mode enabled via the Playwright provider restricted to Chromium ([ADR-0013](../adr/0013-zoneless-vitest-testing-stack.md)); coverage always on via the `v8` provider with `html` + `text-summary` reporters; test reporters `html` + `dot` by default, with `github-actions` added when `process.env.CI` is set.
- `test` task in `apps/web/moon.yml` runs Vitest in watch mode with `--ui`; `test-ci` runs a single non-interactive `vitest run` (picking up the CI-conditional `github-actions` reporter from config).
- Note the one-time `playwright install chromium` requirement (needed locally and in CI — CI wiring lands in Phase 7).
- Verify: `pnpm moon run web:test` opens the Vitest UI in watch mode against Chromium; `pnpm moon run web:test-ci` runs once, exits, and produces an `html`+`text-summary` coverage report plus a `dot`-reporter summary in the terminal.

## Phase 7 — Wire linting/testing into git hooks and CI

- Extend `lint-staged.config.mjs` with `*.ts`/`*.scss` entries running `eslint --fix`/`stylelint --fix` respectively, alongside the existing catch-all `"*": "prettier -w"` rule. [ADR-0004](../adr/0004-husky-lint-staged-for-git-hooks.md) explicitly named this as deferred "until real code exists to lint" — that condition is now met.
- Extend `.github/actions/ci/action.yml`'s `pnpm moon ci :format-check` call to `pnpm moon ci :format-check :build :test-ci :lint-ts :lint-css`.
- Add a Playwright Chromium install step to the CI setup (`.github/actions/setup/action.yml` or the `ci` action) so `test-ci`'s browser-mode Vitest run has a browser available.
- Verify: push a throwaway branch (or inspect via `act`/manual reasoning) confirming the composite action's step order provisions Playwright before `moon ci` runs; run `pnpm lint-staged` locally against a staged dummy change to confirm ESLint/Stylelint actually fire.

## Phase 8 — Docs

- Update the root `README.md`'s "Project Structure" section: `apps/` is no longer empty (list `apps/web`), and `eslint-config`/`stylelint-config` join `tsconfig` under "Currently populated packages".
- No further ADRs are expected — 0012 through 0019 already cover every non-obvious call made in this plan.

## Verification (end to end, once all phases have landed)

1. `pnpm install` at the repo root succeeds with the new `catalog:angular` entries resolved.
2. `pnpm moon run web:build`, `web:start`, `web:test`, `web:test-ci`, `web:lint-ts`, `web:lint-css` all succeed individually.
3. `pnpm moon run web:start`, then open the app in a browser and confirm the default Angular landing page renders with Tailwind's base styles applied.
4. `pnpm moon run root:format-check` passes, confirming Tailwind class sorting and the rest of the workspace formatting stay consistent.
5. `pnpm moon ci :format-check :build :test-ci :lint-ts :lint-css` (the same target list CI will run) passes locally before pushing.
