# E2E Web

![Playwright](https://img.shields.io/badge/playwright-1.61.1-2EAD33)

Playwright E2E suite that exercises [`web`](../../apps/web) by driving a real browser against it — the *E2E suite*, distinct from the *E2E environment* (`apps/web/.docker/`). See [CONTEXT.md](../../CONTEXT.md) for the canonical terms.

In CI, this runs against the Compose+Caddy E2E environment (`https://localhost:8443`), which must already be healthy before `e2e-ci` starts. Locally, there's no Compose environment — tests run against `web`'s own dev server (`https://localhost.www.craftsmans-ledger.dev:8080`), reusing an already-running instance if `web:start` is already serving.

## Commands

Run these via moon from the repo root, not `playwright` directly — moon owns task orchestration/caching for the whole workspace (see [ADR-0001](../../docs/adr/0001-moonrepo-mise-pnpm-for-monorepo-tooling.md)):

```bash
pnpm moon run e2e-web:e2e         # Playwright UI mode, against a local dev server
pnpm moon run e2e-web:e2e-ci      # Playwright once, headless, HTML report on failure
pnpm moon run e2e-web:lint-ts     # ESLint
pnpm moon run e2e-web:typecheck   # tsc --noEmit
```
