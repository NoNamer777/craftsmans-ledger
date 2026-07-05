---
status: accepted
---

# Mise as the sole toolchain version authority

Node and pnpm versions are pinned via `engines`/`devEngines` in the root `package.json` (not the legacy `packageManager` field, which pnpm 11 deprecates in favor of `devEngines.packageManager` — the latter also writes resolved version info into `pnpm-lock.yaml`), and mise reads these fields directly with no committed `mise.toml`, per [ADR-0001](./0001-moonrepo-mise-pnpm-for-monorepo-tooling.md). Corepack is deliberately not enabled. When moonrepo's own toolchain config (`.moon/toolchains.yml`) is eventually added, the `javascript` block will declare `packageManager: pnpm` (for moon's dependency-graph awareness) alongside empty `node: {}` and `pnpm: {}` blocks to opt those toolchains in, but all three will omit the `version` field — moon only downloads and manages its own copy of a tool via its `proto` toolchain manager when a `version` is set, so omitting it makes moon defer to whatever binary mise has put on `PATH`. Proto (or any other moon-affiliated tool manager) is not to be used.

## Consequences

- A future reader of `.moon/toolchains.yml` seeing no `version` field should not assume it was forgotten — it is deliberate, so moon doesn't run a second, competing toolchain manager alongside mise.
- If moon's caching/reproducibility guarantees ever require its own pinned toolchain (e.g., CI runners without mise installed), this decision will need revisiting.

## Amendment (2026-07-04)

The original text of this ADR described `.moon/toolchain.yml` (singular) with `packageManager: pnpm` living under the `node` block — this matched moon v1 semantics but not the installed `@moonrepo/cli@2.3.5`. Verified directly against that binary (`moon --log trace`, `moon toolchain info node|javascript|pnpm`): the file moon actually loads is `.moon/toolchains.yml` (plural), and `packageManager` lives on the `javascript` toolchain block, not `node`. The decision itself — mise as sole authority, `version` deliberately omitted — is unchanged; only the file name and YAML shape above have been corrected to match.
