# Craftsman's Ledger

![Node](https://img.shields.io/badge/node-24.18.0-339933?logo=node.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11.9.0-F69220?logo=pnpm&logoColor=white)
![moon](https://img.shields.io/badge/moon-2.3.5-6F53F3?logo=moonrepo&logoColor=white)
[![CI](https://github.com/nonamer777/craftsmans-ledger/actions/workflows/push-main.yml/badge.svg)](https://github.com/nonamer777/craftsmans-ledger/actions/workflows/push-main.yml)

A personal companion tool for Medieval Dynasty: track unlocked recipes, find vendors across villages/realms, compare recipe profitability, and look up recipes/items/buildings by tech-tree progression.

## Status

Early development — repository scaffolding in progress.

## Getting Started

This project uses [mise](https://mise.jdx.dev/) to manage the Node.js and pnpm versions, reading them directly from `package.json` instead of a separate `mise.toml`. See [ADR-0001](docs/adr/0001-moonrepo-mise-pnpm-for-monorepo-tooling.md) and [ADR-0002](docs/adr/0002-mise-as-sole-toolchain-version-authority.md) for the rationale.

1. Install [mise](https://mise.jdx.dev/getting-started.html)
2. `mise install` — installs the pinned Node.js and pnpm versions
3. `pnpm install` — installs workspace dependencies

Task orchestration is handled by [moon](https://moonrepo.dev/) (`pnpm moon <command>`) — see [ADR-0001](docs/adr/0001-moonrepo-mise-pnpm-for-monorepo-tooling.md) for why. Its `.mcp.json` also registers a moon MCP server for Claude Code, letting the assistant query the project/task graph directly (`get_project`, `get_tasks`, `get_changed_files`, etc.) without extra setup.

### Formatting

[Prettier](https://prettier.io/) formats the entire workspace, including import ordering via `prettier-plugin-organize-imports`, configured at the repo root only; see [ADR-0005](docs/adr/0005-root-only-prettier-config.md) and [ADR-0006](docs/adr/0006-prettier-owns-formatting-boundary.md).

- `pnpm moon run root:format`: format the workspace
- `pnpm moon run root:format-check`: check formatting without writing (this is what CI runs)

## Continuous Integration

A `ci` job (formatting today, joined by linting/build/typecheck/tests as those tasks come to exist) runs via GitHub Actions on pull requests targeting `main` (required to pass before merging) and again on every push to `main`, confirming `main` itself stays green and deployable/releasable at any point in time. See [ADR-0007](docs/adr/0007-ci-toolchain-via-setup-node-pnpm-action-setup.md), [ADR-0008](docs/adr/0008-ci-workflows-split-by-trigger.md), and [ADR-0009](docs/adr/0009-branch-protection-requires-ci-check.md) for the toolchain-provisioning, workflow-split, and branch-protection rationale.

## License

MIT — see [LICENSE](LICENSE).
