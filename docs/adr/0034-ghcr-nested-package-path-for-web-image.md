---
status: accepted
---

# `web`'s image is published to GHCR at a nested `craftsmans-ledger/web` package path

[ADR-0027](./0027-web-dockerfile-scope-excludes-ci-publishing.md) left the container registry undecided. #95 settles it: GitHub Container Registry (`ghcr.io`), authenticated via the workflow's own `GITHUB_TOKEN` rather than a separately provisioned PAT. This repo is public, so GHCR hosting is free, and — because the publishing workflow lives in this same repository — `GITHUB_TOKEN` is granted admin rights on the package by default, which turns out to matter later for tag deletion too (see [ADR-0038](./0038-tag-cleanup-via-maintained-ghcr-cleanup-action.md)).

The image is published to `ghcr.io/<owner>/craftsmans-ledger/web` — nested under a `craftsmans-ledger` package group — rather than a flat `craftsmans-ledger-web`. This repo will eventually contain a second Angular client and a NestJS API ([ADR-0001](./0001-moonrepo-mise-pnpm-for-monorepo-tooling.md)); the nested form makes every future app's image a sibling sub-path of one package group instead of a separately named flat package.

## Consequences

- A future app's image belongs at `ghcr.io/<owner>/craftsmans-ledger/<app-name>`, not a new flat `craftsmans-ledger-<app-name>` package.
- The local-build tag documented in `apps/web/.docker/Dockerfile`'s header comment (`craftsmans-ledger-web`) intentionally stays a separate, flatter name — it's a throwaway local tag, not the published artifact's identity, so the two naming schemes are allowed to diverge.
