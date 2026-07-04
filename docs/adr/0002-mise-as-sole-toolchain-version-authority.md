---
status: accepted
---

# Mise as the sole toolchain version authority

Node and pnpm versions are pinned via `engines`/`devEngines` in the root `package.json` (not the legacy `packageManager` field, which pnpm 11 deprecates in favor of `devEngines.packageManager` — the latter also writes resolved version info into `pnpm-lock.yaml`), and mise reads these fields directly with no committed `mise.toml`, per [ADR-0001](./0001-moonrepo-mise-pnpm-for-monorepo-tooling.md). Corepack is deliberately not enabled. When moonrepo's own toolchain config (`.moon/toolchain.yml`) is eventually added, the `node`/`pnpm` blocks will declare `packageManager: pnpm` for moon's dependency-graph awareness but will omit the `version` field — moon only downloads and manages its own copy of a tool via its `proto` toolchain manager when a `version` is set, so omitting it makes moon defer to whatever binary mise has put on `PATH`. Proto (or any other moon-affiliated tool manager) is not to be used.

## Consequences

- A future reader of `.moon/toolchain.yml` seeing no `version` field should not assume it was forgotten — it is deliberate, so moon doesn't run a second, competing toolchain manager alongside mise.
- If moon's caching/reproducibility guarantees ever require its own pinned toolchain (e.g., CI runners without mise installed), this decision will need revisiting.
