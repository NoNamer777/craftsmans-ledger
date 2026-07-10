---
status: accepted
---

# The E2E suite reuses an already-running target instead of owning its own server lifecycle

`e2e/web`'s `e2e`/`e2e-ci` tasks both use Playwright's `webServer` option with `reuseExistingServer: true`: if something is already answering at the target URL, Playwright runs against it as-is; otherwise it starts one itself via `web:start` (`ng serve`) and tears it down after. The same config branch serves both the interactive watch-mode task (`e2e`) and the one-shot CI task (`e2e-ci`) — there's no separate "CI mode" server-lifecycle path, only a `baseURL`/`webServer` branch on `process.env.CI`.

**Local runs** target `web:start`'s dev server directly (`https://localhost.www.craftsmans-ledger.dev:8080`, per [ADR-0029](./0029-local-dev-hostname-convention.md)/[ADR-0030](./0030-web-dev-server-https-only.md)) — there is no Compose/Caddy environment locally, and none is planned as part of this: [ADR-0039](./0039-web-e2e-environment-ci-only-compose-caddy.md)'s "CI-only for now" stays exactly as decided, with local reproducibility still deferred rather than picked up by this suite landing.

**CI runs** target the Compose+Caddy E2E environment (`https://localhost:8443`) and carry no `webServer.command` fallback at all. Readiness is instead guaranteed upstream: `compose.yaml` now declares `healthcheck`s on both `web` (`wget --spider` against `http://127.0.0.1:8080/` — `localhost` doesn't work here, since nginx's bare `listen 8080` only binds the IPv4 wildcard and `localhost` inside the container can resolve to the IPv6 loopback first, verified by reproducing the connection-refused failure directly) and `caddy` (`wget --spider --no-check-certificate` against its self-signed `tls internal` cert), with `caddy`'s `depends_on` upgraded to `condition: service_healthy`. The CI job's `docker compose up -d` gained `--wait`, which blocks and fails that step itself if either service doesn't turn healthy — before `e2e-ci` ever runs. Omitting the fallback in CI is deliberate: a `webServer.command` that could silently start `web:start` there would mean a broken container environment degrades to testing the plain dev server instead of the promoted image, defeating the reason the environment exists. This also replaces the previous ad-hoc `curl --retry-all-errors` smoke-test step, which existed only as a stand-in readiness proof before a real suite existed.

## Consequences

- A future local Compose/Caddy setup (if ADR-0039's deferred local reproducibility is ever picked up) would need `playwright.config.ts`'s local branch revisited — it currently assumes `web:start` unconditionally.
- The CI `web` healthcheck's `127.0.0.1`-over-`localhost` fix is specific to this nginx image's `listen 8080` (no explicit bind address); a different runtime image's health check can't assume the same fix applies without checking its own bind behavior.
- If `docker compose up --wait` times out or a health check never turns healthy, the CI job fails at the "Start E2E environment" step with a compose-level error, not a Playwright error — that's the intended diagnostic split (environment failure vs. suite failure), matching the existing `docker-web`/`e2e-web` job-separation rationale in ADR-0039.
