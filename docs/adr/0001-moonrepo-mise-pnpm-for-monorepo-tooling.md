---
status: accepted
---

# Use moonrepo, mise, and pnpm for monorepo tooling

Craftsman's Ledger is a monorepo containing two Angular web clients (the main web app and a management client) and one NestJS REST API. Nx is the more common choice for combining multiple Angular apps with a NestJS API, but we chose moonrepo for task orchestration/caching, mise for toolchain version management, and pnpm for package management instead. Mise is configured to read tool versions directly from the top-level package manifest, so no separate `mise.toml` is committed. Actual configuration of these tools is deferred to a future session — this ADR records the choice itself, made during git workspace initialization.

## Considered Options

- **Nx** — the conventional choice for an Angular + NestJS monorepo, with first-class generators and well-documented Angular/Nest integration. Rejected in favor of moonrepo's task orchestration/caching model.
- **Plain pnpm workspaces with no task orchestrator** — simpler, but leaves caching and cross-project task graphs unsolved. Rejected in favor of moonrepo.

## Consequences

- Less community documentation and fewer ready-made generators than Nx for the specific Angular/NestJS combination; more manual wiring expected when the monorepo is actually scaffolded.
- Toolchain versioning (via mise) is coupled to the top-level package manifest rather than a dedicated `mise.toml` — adding tools that can't be expressed in the manifest will require revisiting this decision.
