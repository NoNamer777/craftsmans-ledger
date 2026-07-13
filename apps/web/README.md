# Web

![Angular](https://img.shields.io/badge/angular-22.0.5-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-6.0.3-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-4.1.9-6E9F18?logo=vitest&logoColor=white)

Main Angular web client for Craftsman's Ledger — track unlocked recipes, find vendors, compare recipe profitability, and browse the tech tree.

See [CHANGELOG.md](./CHANGELOG.md) for a history of changes.

## Commands

Run these via moon from the repo root, not `ng` directly — moon owns task orchestration/caching for the whole workspace (see [ADR-0001](../../docs/adr/0001-moonrepo-mise-pnpm-for-monorepo-tooling.md)):

```bash
pnpm moon run web:start       # dev server at https://localhost.www.craftsmans-ledger.dev:8080
pnpm moon run web:build       # production build to dist/web
pnpm moon run web:test        # Vitest in watch mode
pnpm moon run web:test-ci     # Vitest once, with coverage and an HTML report
pnpm moon run web:lint-ts     # ESLint
pnpm moon run web:lint-css    # Stylelint
pnpm moon run web:typecheck   # tsc --noEmit across the app, spec, and eslint tsconfigs
```

`web:start` serves over HTTPS only (see [ADR-0030](../../docs/adr/0030-web-dev-server-https-only.md)); first-time setup needs a one-time, per-machine step — see [docs/guides/dev/https-local-dev.md](../../docs/guides/dev/https-local-dev.md).

`web:start` also exposes the dev server to your tailnet, so it's reachable from a phone or another laptop (see [ADR-0031](../../docs/adr/0031-tailscale-serve-for-cross-device-local-dev.md)); see [docs/guides/dev/tailnet-local-dev.md](../../docs/guides/dev/tailnet-local-dev.md), including how to tear it back down with `pnpm moon run root:teardown-tailnet`.

## Docker

`web` is a static build served by nginx once containerized; there's no moon task for this (see [ADR-0027](../../docs/adr/0027-web-dockerfile-scope-excludes-ci-publishing.md)), so build and run it directly from the repo root:

```bash
docker build -f apps/web/.docker/Dockerfile -t craftsmans-ledger-web .
docker run --rm -p 8080:8080 craftsmans-ledger-web   # http://localhost:8080
```

See [ADR-0025](../../docs/adr/0025-moon-docker-scaffold-pattern-for-web-image.md) and [ADR-0026](../../docs/adr/0026-rootless-nginx-runtime-for-web.md) for the image's build pattern and rootless runtime.

### CI image lifecycle

Every PR touching `web` builds and pushes a multi-platform image to `ghcr.io/<owner>/craftsmans-ledger/web` via `apps/web/.docker/docker-bake.hcl` (`docker buildx bake -f apps/web/.docker/docker-bake.hcl build`), tagged `pr-<N>`. Merging retags it to `next`; closing the PR without merging removes the `pr-<N>` tag instead. This only runs when moon's affected-detection says `web` was actually touched. See [ADR-0033](../../docs/adr/0033-web-docker-image-lifecycle-scoped-to-create-promote-remove.md) for the overall scope, [ADR-0035](../../docs/adr/0035-docker-bake-multi-platform-provenance-and-labels-for-web.md)/[ADR-0043](../../docs/adr/0043-per-app-docker-bake-file.md) for the Bake build itself, and [ADR-0036](../../docs/adr/0036-moon-affected-gates-docker-jobs.md) for the affected-detection gating.

### E2E environment

`apps/web/.docker/compose.yaml` pairs the just-built `pr-<N>` image with a Caddy reverse proxy for HTTPS termination. It's CI-only, not wired up for local use, and gated by Compose healthchecks (`docker compose up --wait`) rather than a smoke-test step. See [ADR-0039](../../docs/adr/0039-web-e2e-environment-ci-only-compose-caddy.md).

### E2E suite

[`e2e/web`](../../e2e/web) is the Playwright suite that actually exercises `web` — see its own README for commands. In CI it runs against the E2E environment above (`https://localhost:8443`); locally it runs against `web:start`'s dev server instead, reusing an already-running instance if there is one. See [ADR-0046](../../docs/adr/0046-e2e-suite-reuses-existing-servers.md).

## Notable choices

- A project in the shared root `angular.json` workspace, not a self-contained Angular CLI workspace of its own — see [ADR-0020](../../docs/adr/0020-root-level-angular-workspace.md), superseding [ADR-0012](../../docs/adr/0012-self-contained-angular-workspace-per-app.md).
- Zoneless change detection, and Vitest (not Karma/Jasmine) as the test runner — see [ADR-0013](../../docs/adr/0013-zoneless-vitest-testing-stack.md).
- `@angular/core`, `@angular/platform-browser`, `@angular/router`, and the Angular CLI toolchain (`@angular/build`, `@angular/cli`, `@angular/compiler-cli`) are declared in the workspace root's `package.json` instead of here, so the root `angular.json` resolves a single version. The remaining `@angular/*` packages and `typescript` are still pinned directly in this package's `package.json`, via the workspace root's `catalog:angular` pnpm catalog.

## Status

Shell only — no domain routes or components yet. Styling (Tailwind + SCSS), shared lint configs, the full Vitest setup, and a boot-smoke [E2E suite](../../e2e/web) have all landed.
