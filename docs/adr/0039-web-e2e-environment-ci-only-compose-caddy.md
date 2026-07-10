---
status: accepted
---

# `web`'s E2E environment: a CI-only Compose + Caddy stack, smoke-tested without the E2E suite

`#95` asks for a Compose stack fronted by Caddy to run E2E tests against `web`'s image — the *E2E environment*, distinct from the *E2E suite* (the Playwright specs themselves, `#94`, still deferred; see [CONTEXT.md](../../CONTEXT.md) for the canonical terms). The environment is pure infrastructure: `web`'s image plus a Caddy reverse proxy for HTTPS termination, with no test runner involved. It lives at `.docker/web/`, alongside the existing `Dockerfile`/`default.conf` — unlike `docker-bake.hcl` ([ADR-0041](./0041-shared-docker-bake-file-across-projects.md)), this is genuinely `web`-specific test tooling, not shared build infrastructure, so [ADR-0028](./0028-top-level-docker-folder-per-app.md)'s per-app placement applies unmodified.

The environment is CI-only for now — it isn't wired up for local use. `web`'s local dev HTTPS story (mkcert + hosts-file, [ADR-0029](./0029-local-dev-hostname-convention.md)/[ADR-0030](./0030-web-dev-server-https-only.md)) is unrelated and untouched; Caddy here exists only because CI has no equivalent trusted-local-CA setup. Local reproducibility of the E2E environment is deferred until the E2E suite actually lands and there's a concrete need to run it outside CI.

Caddy terminates TLS via its own automatic internal HTTPS (`tls internal`) rather than reusing mkcert or hand-rolling an `openssl` cert — zero extra tooling, and mkcert's local-machine trust model buys nothing for a CI-only, ephemeral environment. The smoke-test step that verifies the environment boots uses `curl -k`: its job is to confirm Caddy actually terminates TLS and proxies to `web` correctly, not to validate a publicly trusted cert chain.

A new `e2e-web` job (`needs: docker-web`) pulls the just-pushed `pr-<N>` tag from GHCR rather than reusing a local build from the same CI run — this tests the literal artifact that would later be promoted to `next` ([ADR-0037](./0037-promote-web-image-via-retag-not-rebuild.md)'s build-once principle), and a multi-platform `buildx bake --push` result isn't loadable into the local Docker daemon in a runnable form anyway. `docker-web` (build+push, renamed from the previous `docker` job) and `e2e-web` (pull, compose up, smoke-test, teardown) stay as two separate jobs rather than one combined job: separate check runs distinguish "the image failed to build" from "the app/E2E environment is broken" in the PR checks list, and a transient E2E flake can be re-run on its own via GitHub's "re-run failed jobs" without rebuilding and re-pushing the image.

## Consequences

- The smoke-test only proves the environment boots and Caddy proxies correctly — it is not a substitute for `#94`'s actual Playwright suite. "Run E2E tests against this image," as `#95` originally asked, isn't fully satisfied until that suite exists.
- See [ADR-0040](./0040-dynamic-required-checks-via-skip-as-success.md) for how `docker-web`/`e2e-web` interact with `main`'s required status checks.
- Whoever picks up `#94` will need to decide how the E2E suite actually reaches the environment (a fresh Compose service running Playwright inside the same network, or something else) — nothing here decides that.
