---
status: superseded by ADR-0043
---

# `docker-bake.hcl` moves to top-level `.docker/`, shared across containerized projects

`.docker/web/docker-bake.hcl` moves to `.docker/docker-bake.hcl`, and its `build` target is renamed `web` — matching the project-name-as-key convention already used elsewhere (e.g. `moon run web:build`). A future project (`api`, or a second frontend) adds a sibling `target "api" { ... }` to this same file rather than a second, near-duplicate bake file.

This is a deliberate, single-file exception to [ADR-0028](./0028-top-level-docker-folder-per-app.md), which otherwise keeps every Docker-related file for an app under `.docker/<app>/`. `web`'s `Dockerfile` and `default.conf` stay exactly where ADR-0028 puts them, and so does its E2E environment ([ADR-0039](./0039-web-e2e-environment-ci-only-compose-caddy.md)) — only the bake file moves, because it's fundamentally cross-project build orchestration rather than app-owned config. One top-level bake file listing every project's target is, if anything, more discoverable than N near-identical per-app files — the same discoverability goal ADR-0028 was chasing for container definitions in the first place, just applied to this one file differently.

Verified empirically (`docker buildx bake -f .docker/docker-bake.hcl --call=check web`, run from the repo root, with a negative-control run from `.docker/` itself that failed as expected) that Buildx Bake resolves a target's `context`/`dockerfile` fields relative to the *invoking process's working directory*, not the bake file's own location. Since CI always invokes `docker buildx bake` from the repo root, moving the file required no changes to the `web` target's `context = "."` / `dockerfile = ".docker/web/Dockerfile"` values — only the file's own location, its target name, and the `-f`/`targets:` references in `pull-request.yml`.

No shared "common" target (for the `platforms`/`attest`/cache fields every project's target would otherwise repeat, see [ADR-0035](./0035-docker-bake-multi-platform-provenance-and-labels-for-web.md)) was introduced yet. With a single target in the file, there's nothing real to deduplicate — adding one now would be speculative. Revisit once a second project's target actually exists, and the duplication is real.

## Consequences

- `pull-request.yml`'s `Build and push` step now references `./.docker/docker-bake.hcl` and `targets: web` (was `./.docker/web/docker-bake.hcl` / `targets: build`).
- [ADR-0035](./0035-docker-bake-multi-platform-provenance-and-labels-for-web.md), which documents the `web` target's own build settings, is updated in place for the path/target rename but otherwise unaffected — it's about the target's content, not the file's location.
- A future `api` target added to this file inherits none of `web`'s settings automatically; its author must either copy the relevant fields or introduce the shared base target deferred above.
