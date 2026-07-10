---
status: accepted
---

# Docker files live under `apps/<app>/.docker/`, superseding top-level `.docker/<app>/`

[ADR-0028](./0028-top-level-docker-folder-per-app.md) put container definitions at top-level `.docker/<app>/` instead of inside each app's own directory, specifically for discoverability as more apps get containerized and to keep app directories free of infra concerns outside their own build/test/lint surface. We're reversing that call: `web`'s `Dockerfile`, `default.conf`, and its E2E environment (`compose.yaml`, `Caddyfile`, see [ADR-0039](./0039-web-e2e-environment-ci-only-compose-caddy.md)) move to `apps/web/.docker/`.

The reversal is driven by [ADR-0036](./0036-moon-affected-gates-docker-jobs.md)'s gating mechanism, not aesthetics. `docker-web`/`e2e-web` only run when `moon query projects --affected --id web` reports `web` as affected, and that check turns out to be **directory-boundary-based**: it only sees files inside a project's own registered root (`apps/*`/`libs/*`/`packages/*` per `.moon/workspace.yml`) or files that propagate through the project dependency graph. Files under top-level `.docker/web/` sit entirely outside any project's boundary and were invisible to it — verified empirically: an uncommitted change to `.docker/docker-bake.hcl` left `moon query projects --affected --id web` returning `"projects": []`. A PR that only touched `web`'s Dockerfile, its E2E compose stack, or the bake file would silently skip both Docker CI jobs.

The fix is not to declare these paths as a task `inputs:` entry (that was tried first, and disproved): a `.docker/web/**` glob added to `web`'s `build` task was correctly parsed into that task's `inputFiles`/`inputGlobs`, but `moon query projects --affected` still didn't attribute changes there to `web` — task `inputs:` govern that task's own cache invalidation, a separate mechanism from project-level affected status. Simply moving the files inside `apps/web/` was the thing that worked: a new, untracked file at `apps/web/.docker/Dockerfile` was immediately picked up, with moon's own debug output (`options.affected.projects.web.files`) attributing it directly — no custom config needed, the same directory-boundary mechanism that already makes `src/**/*` changes affect `web`.

This gives up ADR-0028's discoverability argument — container definitions scatter back across `apps/*` instead of living in one top-level location — in exchange for `docker-web`/`e2e-web` gating being correct for free, without a second, bolted-on path-filter mechanism running alongside the moon-native one ADR-0036 already established.

## Consequences

- A future app's container files go in `apps/<app-name>/.docker/`, not `.docker/<app-name>/`.
- `docker build`/`docker compose` invocations reference `-f apps/<app>/.docker/Dockerfile` (or `compose.yaml`), documented in that app's own README (e.g. [apps/web/README.md](../../apps/web/README.md)).
- No `.moon/workspace.yml` change was needed — `apps/*` already covers `apps/web/.docker/**`, since project ownership there is the whole directory subtree, not just the moon-generated files.
- The shared `docker-bake.hcl` ([ADR-0041](./0041-shared-docker-bake-file-across-projects.md)) had the exact same gap — it was the one remaining Docker-related file living outside any project's directory. See [ADR-0043](./0043-per-app-docker-bake-file.md) for why it moves too, and stops being shared.
