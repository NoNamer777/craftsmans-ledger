---
status: accepted
---

# #95 scopes `web`'s Docker CI to image create/promote/remove, deferring the E2E stack

Issue #95 asked for three things: a CI-built, PR-tagged Docker image for `web`; a Compose stack fronted by Caddy to run E2E tests against that image; and promotion/cleanup of the image once a PR merges or closes. Only the image lifecycle (create on PR, promote to `next` on merge, remove `pr-<N>` on merge, or close) is implemented here — the Compose stack, the Caddy reverse proxy, and any wiring to actually run E2E tests are deferred. #94 (`web` E2E testing using Playwright) is still open and unimplemented; building a Compose/Caddy environment to run tests that don't exist yet would be speculative, and the image lifecycle plumbing is independently valuable and independently testable without it. This mirrors [ADR-0027](./0027-web-dockerfile-scope-excludes-ci-publishing.md)'s precedent of shipping infrastructure narrower than an issue's full ask when a dependency (there: a chosen registry; here: an actual E2E suite) doesn't exist yet.

## Consequences

- The Compose stack, Caddy reverse proxy, and E2E test wiring described in #95 remain unimplemented; a follow-up issue is needed once #94 lands.
- The `next` tag this session produces has no consumer yet (nothing pulls or deploys it) — it exists purely as the promoted artifact, ready for whatever future issue wires up its actual use.
