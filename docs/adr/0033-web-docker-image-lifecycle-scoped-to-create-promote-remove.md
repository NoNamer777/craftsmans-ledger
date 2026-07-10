---
status: accepted
---

# #95 scopes `web`'s Docker CI to image lifecycle + E2E environment, deferring only the E2E suite

Issue #95 asked for three things: a CI-built, PR-tagged Docker image for `web`; a Compose stack fronted by Caddy to run E2E tests against that image (the *E2E environment* — see [CONTEXT.md](../../CONTEXT.md)); and promotion/cleanup of the image once a PR merges or closes. All three are implemented here, including the E2E environment itself ([ADR-0039](./0039-web-e2e-environment-ci-only-compose-caddy.md)), verified by a CI smoke-test rather than left as unverified scaffolding. What's deferred is narrower than originally scoped: only the *E2E suite* — the actual Playwright test specs, #94 — remains outstanding, since #94 is still open and unimplemented; writing those specs is #94's job, not this one's. This still mirrors [ADR-0027](./0027-web-dockerfile-scope-excludes-ci-publishing.md)'s precedent of shipping infrastructure narrower than an issue's full ask when a genuine dependency doesn't exist yet — that dependency has just shrunk from "the whole E2E stack" down to "the test code alone."

## Consequences

- The E2E suite described in #95 (Playwright specs actually exercising `web` through the E2E environment) remains unimplemented; a follow-up issue is needed once #94 lands.
- The `next` tag this session produces still has no consumer (nothing pulls or deploys it) — the E2E environment smoke-tests the pre-merge `pr-<N>` artifact, not `next`.
