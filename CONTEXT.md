# Craftsman's Ledger

## Language

### CI / testing infrastructure

**E2E environment**:  
The Docker Compose stack (`web`'s image and a Caddy reverse proxy for HTTPS termination) that boots a running instance of `web` for tests to run against. Pure infrastructure — no test runner or test code involved.  
_Avoid_: E2E stack, E2E setup

**E2E suite**:  
The Playwright test code that exercises `web` by driving a browser against the E2E environment.  
_Avoid_: E2E stack, E2E tests (when precision matters — "E2E tests" is fine in casual conversation, but avoid it when the distinction from E2E environment matters)

### Deployment environments

**Staging environment**:  
A persistent Docker Compose stack, running on the same server as the dev environment, that receives the `next`-tagged image via a Watchtower-triggered redeploy immediately after CI promotes it. The E2E suite runs against it post-deploy, as a check on the deployment itself rather than the app's bits (already proven pre-merge).  
_Avoid_: E2E environment (that's the distinct, CI-only, ephemeral stack used per-PR — see above)

**Dev environment**:  
A persistent Docker Compose stack tracking the `next` tag, redeployed via Watchtower only after the staging environment's E2E run succeeds. Also serves as a manual/human verification environment — not itself a target for automated E2E runs, so it isn't disturbed by test traffic while someone is checking it.

### Changelogs

**Changelog**:  
A per-package `CHANGELOG.md` following Keep a Changelog, listing consumer-relevant changes to that package/app under a single, frozen `Unreleased` section — see [ADR 0048](docs/adr/0048-keep-a-changelog-per-package-unreleased-only.md). Only projects under `apps/`, `packages/`, and `libs/` have one; `e2e/` suites don't.  
_Avoid_: Release notes

**Consumer-relevant change**:  
A change that affects what a consumer of a package or app — the end user for `web`, a dependent workspace package for the tooling configs — experiences or can do. The litmus test for whether something belongs in a `CHANGELOG.md`; internal refactors, tests, and tooling churn with no observable effect don't qualify, regardless of commit type.
