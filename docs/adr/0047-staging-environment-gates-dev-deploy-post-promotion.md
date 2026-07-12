---
status: accepted
---

# #107 gates `dev`'s redeploy behind a staging E2E run, not a second test of `next`'s bits

Issue #107 asked whether the E2E suite should re-run after promoting `web`'s image to `next`. Since `next` is a byte-for-byte retag of the already-tested `pr-<N>` image ([ADR-0037](./0037-promote-web-image-via-retag-not-rebuild.md)), re-running the suite against the same bits would prove nothing about the app that `pull-request.yml`'s run didn't already prove. What actually needs proving is that *deployment* works: that Watchtower can pull `next` and recreate containers, and that the app functions on real infrastructure (Tailscale networking, the host's config) rather than CI's ephemeral Compose+Caddy stand-in ([ADR-0039](./0039-web-e2e-environment-ci-only-compose-caddy.md)). A new `staging` environment — a second Compose stack on the same server as `dev`, reachable the same way — exists purely to take that hit: `push-main.yml` triggers Watchtower (HTTP API mode, synchronous, reached over Tailscale) to redeploy staging with `next`, then runs the E2E suite against it. Only on success does the same Watchtower trigger fire for `dev`. `dev` itself is deliberately left untouched by automated E2E runs, since it doubles as a manual verification environment — running tests against it directly would risk interference with whatever a human is currently checking there.

The whole chain is fully automatic, matching this repo's existing preference for status-check-driven automation ([ADR-0036](./0036-moon-affected-gates-docker-jobs.md), [ADR-0040](./0040-dynamic-required-checks-via-skip-as-success.md)) over manual approval gates. On staging E2E failure, the pipeline simply stops — the job that redeploys `dev` (`needs: e2e-staging`) never runs, the same `needs:`-implies-success pattern ADR-0037 already relies on for `docker-promote`. `next` itself isn't rolled back or deleted; it's just a pointer, and nothing besides this pipeline reads it, so there's nothing to protect by rolling it back. No notification mechanism exists in this repo today, so none is added — a failed run is visible in the Actions tab like any other CI failure.

Prod's release strategy (a `latest`/semver tag, and how it gets promoted and deployed) is explicitly out of scope here and deferred to a future issue/ADR.

## Consequences

- `staging` and `dev` each need their own Compose stack and Watchtower instance on the server, plus Tailscale reachability from GitHub Actions — none of this exists yet; this ADR records the shape of the pipeline, not that the infrastructure is built.
- Watchtower's HTTP API requires its own auth token to be provisioned (e.g. as a GitHub secret) per environment; the exact secret/token scheme isn't decided by this ADR.
- Because staging and dev share a server, they must not collide on ports/hostnames — worth confirming when the Compose files are actually written.
- If `web` ever gains a stateful dependency (e.g. a database), this decision would need revisiting: today's reasoning assumes a stateless static app with no test-data cleanup concern between staging runs.
