---
status: accepted
---

# Docker files live under top-level `.docker/<app>/`, not co-located with the app

`web`'s container definition (#92) was first added as `apps/web/Dockerfile` and `apps/web/nginx.conf`, alongside the app's other self-owned config (`moon.yml`, `eslint.config.mts`, `.stylelintrc.json`, etc.). It moved to `.docker/web/Dockerfile` and `.docker/web/default.conf` — a deliberate deviation from that co-location convention: as more apps/services in this monorepo need containerizing, `.docker/<name>/` keeps every container definition discoverable from one top-level location instead of scattered across `apps/*`, and keeps app directories free of infra-specific concerns that aren't part of the app's own build/test/lint surface. The Docker build context stays the repo root either way (moon's project-scoped scaffold, [ADR-0025](./0025-moon-docker-scaffold-pattern-for-web-image.md), needs the whole workspace visible regardless of where the Dockerfile itself lives), so this only affects `-f` path and file location, not the build's mechanics.

## Consequences

- A future app's container files go in `.docker/<app-name>/`, not `apps/<app-name>/`.
- `docker build` invocations reference `-f .docker/<app>/Dockerfile`, documented per-app in that app's own README (e.g. `apps/web/README.md`).
