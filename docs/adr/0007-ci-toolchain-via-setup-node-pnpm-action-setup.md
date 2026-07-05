---
status: accepted
---

# CI toolchain provisioning via setup-node/pnpm-action-setup, not mise-action

CI (`.github/workflows/pull-request.yml`) provisions Node and pnpm via `actions/setup-node` (`node-version-file: package.json`) and `pnpm/action-setup@v6` (no `version` input), rather than `jdx/mise-action`. Both actions independently read this repo's real toolchain-authority fields — `setup-node` checks `devEngines.runtime`/`engines.node`, and `pnpm/action-setup` checks `devEngines.packageManager` ahead of the legacy `packageManager` field (confirmed directly against its source: `devEngines.packageManager` takes priority, matching pnpm's own `getWantedPackageManager` logic) — so `package.json` remains the sole version authority per [ADR-0002](./0002-mise-as-sole-toolchain-version-authority.md), without mise itself running in CI. We chose these actions over mise-action specifically for `pnpm/action-setup`'s built-in dependency-store caching, which mise-action doesn't provide.

## Considered Options

- **jdx/mise-action** — would run mise itself in CI, keeping toolchain provisioning mechanically identical to local dev. Rejected in favor of the dependency-caching benefit of `setup-node`/`pnpm/action-setup`, since both independently honor the same `package.json` fields mise reads.

## Consequences

- No `packageManager` field was added back to `package.json` — `pnpm/action-setup`'s `devEngines.packageManager` support makes it unnecessary.
- mise itself is not installed or invoked in CI; local dev and CI resolve the same versions from the same fields, but via different tools.
