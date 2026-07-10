---
status: accepted
---

# `web`'s Dockerfile ships without CI builds or registry publishing

Issue #92 asked only to containerize `web`; no deployment target or container registry has been chosen anywhere in this repo yet. `.docker/web/Dockerfile` and `.docker/web/default.conf` are added for local/manual builds (`docker build -f .docker/web/Dockerfile -t craftsmans-ledger-web .`) only — neither `.github/workflows/pull-request.yml` nor `push-main.yml` build or push the image. Building it in CI now, with nothing to deploy it to yet, it would be scope creep the issue didn't ask for and premature given the registry/target is still undecided.

## Consequences

- CI does not currently catch a broken Dockerfile; a `docker build` failure would only surface when someone builds it locally.
- Wiring CI (build-only, or build-and-push once a registry/target is chosen) is deferred to a follow-up issue.
