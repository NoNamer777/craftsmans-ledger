---
status: accepted
---

# Per-app `docker-bake.hcl`, superseding the shared top-level bake file

[ADR-0041](./0041-shared-docker-bake-file-across-projects.md) put every containerized project's Bake target in one shared `.docker/docker-bake.hcl`, keyed by project name, so a future project would just add a sibling `target "api" { ... }` instead of a near-duplicate file. We're reversing that call: `web`'s bake file moves to `apps/web/.docker/docker-bake.hcl`, and each future containerized app gets its own — no shared file.

The reversal follows directly from [ADR-0042](./0042-per-app-docker-folder-inside-app-directory.md): once `web`'s `Dockerfile` and E2E environment moved inside `apps/web/.docker/` specifically so `moon query projects --affected --id web` could see them, the shared bake file would have been the *only* Docker-related file still living outside any project's directory — still invisible to that same affected-detection, for the same directory-boundary reason. A change to `web`'s target block in a shared `.docker/docker-bake.hcl` (a cache setting, a platform list, the SBOM/provenance flags) would still silently fail to mark `web` as affected, leaving `docker-web`/`e2e-web` skipped exactly when they're the jobs that most need to run. Splitting the file per app closes that gap the same way ADR-0042 did for the rest of `web`'s Docker files.

The target itself reverts to the name it had before ADR-0041's rename — `build`, not `web` — since the project is now identified by the file's own location (`apps/web/.docker/docker-bake.hcl`), not by a key inside a shared file. `pull-request.yml`'s `Build and push` step references `./apps/web/.docker/docker-bake.hcl` and `targets: build` accordingly. Buildx Bake still resolves `context`/`dockerfile` relative to the *invoking process's* working directory, not the bake file's own location (verified under ADR-0041 and unaffected by this move), so `context = "."` and `dockerfile = "apps/web/.docker/Dockerfile"` stay repo-root-relative even though the bake file itself now lives inside `apps/web/`.

This gives up the deduplication ADR-0041 was setting up for — the `platforms`/`attest`/`cache-from`/`cache-to` shape is no longer a single edit point, and a future second app repeats it verbatim with its own project name substituted. ADR-0041 had already deferred introducing a shared "common" target for this as speculative with only one real target in the file; that tradeoff is accepted permanently now rather than revisited, since correctness of CI gating matters more than deduplicating a handful of fields, and nothing about a shared base target would have survived the file split anyway.

## Consequences

- A future app's bake file goes at `apps/<app-name>/.docker/docker-bake.hcl`, with a `build` target, not a new entry in a shared top-level file.
- Each app's bake file repeats the `attest`/`cache-from`/`cache-to`/`platforms` shape with its own project name substituted — no shared base target exists to factor it out, and none is planned.
- `docker/metadata-action`'s Bake integration (the empty `docker-metadata-action` target every app's `build` target inherits from) is duplicated per file too — it's a few lines, not worth extracting across files that otherwise share nothing else.
- [ADR-0035](./0035-docker-bake-multi-platform-provenance-and-labels-for-web.md), which documents `web`'s target's own build settings, is updated in place for the path/target-name change but otherwise unaffected — it's about the target's content, not the file's location or sharing status.
