---
status: accepted
---

# `pr-<N>` tag removal uses `dataaxiom/ghcr-cleanup-action`, in a dedicated `closed`-trigger workflow

Removing a `pr-<N>` tag from GHCR isn't a single REST call — it requires listing package versions, matching the one tagged `pr-<N>`, and deleting it by version ID. `actions/delete-package-versions` is GitHub's own org-verified action for this, but its maintainers have stated they're not accepting further contributions, and — more importantly — it's built around retention policies (`min-versions-to-keep`, `num-old-versions-to-delete`), not deleting one specific tag by name; there's a long-open, unresolved issue asking for exactly that ([actions/delete-package-versions#61](https://github.com/actions/delete-package-versions/issues/61)). Using it here would mean either resolving `pr-<N>` to a version ID ourselves first, or a fragile negative-lookahead regex against `ignore-versions` — in both cases defeating the point of reaching for an action instead of a hand-rolled `gh api` script.

`dataaxiom/ghcr-cleanup-action` has a purpose-built `delete-tags` input (comma-separated, glob-style by default — a plain string like `pr-95` matches only that exact tag, not `pr-950` or anything else) that deletes exactly the tag we want in one step. An initial version of this decision picked `jenskeiner/ghcr-container-repository-cleanup-action` instead, on the reasoning that it was "actively maintained" versus the stagnant official action — but `jenskeiner`'s repo is itself a fork of `dataaxiom/ghcr-cleanup-action` ("based on Ghcr Cleanup Action... but with different semantics"), and checking both repos directly shows `dataaxiom` is the more active of the two: pushed within the last two weeks versus `jenskeiner`'s ~5 months, 91 stars versus 0, fewer open issues. Picking the fork over its own upstream failed the exact "actively maintained" test it was chosen for — corrected once that comparison was actually made.

Because `GITHUB_TOKEN` gets admin rights on a package by default when the publishing workflow lives in the same repository (see [ADR-0034](./0034-ghcr-nested-package-path-for-web-image.md)), no additional PAT or secret was needed to grant the cleanup action delete permission — just `permissions: packages: write` on the job.

`dataaxiom/ghcr-cleanup-action` itself is wrapped in a composite action, `.github/actions/cleanup/`, taking explicit `token`/`owner`/`package`/`tags` inputs — the same duplication-avoidance already applied to affected-detection ([ADR-0036](./0036-moon-affected-gates-docker-jobs.md)) and Docker Buildx/GHCR login ([ADR-0035](./0035-docker-bake-multi-platform-provenance-and-labels-for-web.md)). Both call sites below now invoke `./.github/actions/cleanup` with a `tags:` input rather than the action's own `delete-tags` name directly — a deliberate rename, since "tags to remove" reads clearly at the call site without needing to know the underlying action's specific input vocabulary, and insulates callers from a future switch to a different cleanup action requiring only an internal change to this one file.

Tag removal happens in two places, deliberately not unified into one workflow:

- **On merge**: the final step of `push-main.yml`'s `docker-promote` job (see [ADR-0037](./0037-promote-web-image-via-retag-not-rebuild.md)), immediately after the retag succeeds.
- **On close without merge**: a new, dedicated `pull-request-closed.yml` workflow, triggered on `pull_request: types: [closed]` and gated `if: github.event.pull_request.merged == false`.

The closed-without-merge case could have been folded into `pull-request.yml` by adding `closed` to its existing trigger types and gating the new job with an `if:` condition. It's a separate file instead, following [ADR-0008](./0008-ci-workflows-split-by-trigger.md)'s "split by trigger, not by concern" convention: `pull-request.yml`'s trigger types (`opened`/`synchronize`/`reopened`) and its role as the required status check for branch protection ([ADR-0009](./0009-branch-protection-requires-ci-check.md)) stay untouched by an unrelated `closed` event.

## Consequences

- `delete-tags` (exposed as `tags` on the composite action) matches glob-style, not literally-anything-containing — a bare `pr-<N>` with no wildcard characters is already an exact match, so neither call site needs to anchor nor escape anything to avoid accidentally matching a different PR's tag that happens to share a numeric prefix (e.g. `pr-9` vs `pr-95`).
- If GitHub's package-deletion permission model changes (the `about-permissions-for-github-packages` behavior this relies on), tag cleanup could start failing with a permissions error rather than a "package not found" one — worth checking first if either cleanup job starts failing.
