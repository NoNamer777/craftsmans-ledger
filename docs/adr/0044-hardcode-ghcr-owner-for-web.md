---
status: accepted
---

# `web`'s GHCR owner is a hardcoded literal, not derived from `github.repository_owner`

An earlier commit on this branch moved `web`'s image references from a hardcoded `nonamer777` to `github.repository_owner`, specifically to avoid re-hardcoding an owner that could change. We're reversing that: `nonamer777` is now a literal string again, in `apps/web/.docker/docker-bake.hcl` (`WEB_DOCKER_IMAGE`), `pull-request.yml` (`WEB_DOCKER_IMAGE`), and `push-main.yml`/`pull-request-closed.yml` (`WEB_DOCKER_IMAGE`/`WEB_OWNER`/`WEB_PACKAGE`).

The reversal is driven by a real, repeated failure mode the dynamic approach hit in CI: `github.repository_owner` (and the `GITHUB_REPOSITORY_OWNER` env var GitHub Actions derives it from) preserves the account's actual casing (`NoNamer777`), but OCI registry refs must be lowercase. `docker/metadata-action` auto-lowercases the image tags it generates, which masked the problem for the main image push, but nothing else in the pipeline does that automatically: Docker Bake's HCL `cache-from`/`cache-to`, `docker buildx imagetools create` in the `promote` action, and Compose's `${GITHUB_REPOSITORY_OWNER}` interpolation all took the raw, case-preserved value and broke in CI with "repository name ... must be lowercase" — three separate failures, in three different tools, each needing its own workaround (HCL's `lower()`, bash's `${VAR,,}`, and a `$GITHUB_ENV`-based pre-lowering step for Compose, since Compose has no inline lowercasing function at all). A hardcoded literal sidesteps the entire class of bug rather than patching each consumer individually — this repo has exactly one owner today, so there's nothing to derive.

The trade-off: if this repo is ever forked, transferred to an org, or renamed, `nonamer777` needs updating by hand in every file listed above, or images silently keep publishing to the old owner's namespace instead of failing loudly.

`promote`'s `package` input now carries a full ref (`ghcr.io/nonamer777/craftsmans-ledger/web`) rather than a bare package name — its underlying `docker buildx imagetools create` just needs one complete ref per side of the retag. `.github/actions/cleanup/`'s `dataaxiom/ghcr-cleanup-action` has a different input contract (`owner` and `package` as separate fields, confirmed against its own `action.yml`), so `push-main.yml` and `pull-request-closed.yml` carry `WEB_OWNER`/`WEB_PACKAGE` alongside `WEB_DOCKER_IMAGE` specifically for that call — not fully DRY, but passing the wrong shape to either action is worse than one literal repeated twice.

## Consequences

- A fork, org-transfer, or rename of this repo requires updating `nonamer777` in `apps/web/.docker/docker-bake.hcl`, `.github/workflows/pull-request.yml`, `.github/workflows/push-main.yml`, and `.github/workflows/pull-request-closed.yml` — nothing catches a stale value automatically.
- `ghcr-cleanup-action`'s `owner` input was previously `${{ github.repository_owner }}`; that path was case-insensitive in practice (GitHub API lookups, not a raw OCI registry push), so this change isn't fixing a bug there — it's trading a working dynamic value for consistency with the other three, now-hardcoded call sites.
- [ADR-0034](./0034-ghcr-nested-package-path-for-web-image.md), [ADR-0035](./0035-docker-bake-multi-platform-provenance-and-labels-for-web.md), and [ADR-0037](./0037-promote-web-image-via-retag-not-rebuild.md) describe pieces of this same mechanism and are updated in place to match; none of them are superseded, since none of them mandated a dynamic owner as their own core decision — that particular detail is decided here.
