# Craftsman's Ledger

![Node](https://img.shields.io/badge/node-24.18.0-339933?logo=node.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11.9.0-F69220?logo=pnpm&logoColor=white)

A personal companion tool for Medieval Dynasty: track unlocked recipes, find vendors across villages/realms, compare recipe profitability, and look up recipes/items/buildings by tech-tree progression.

## Status

Early development — repository scaffolding in progress.

## Getting Started

This project uses [mise](https://mise.jdx.dev/) to manage the Node.js and pnpm versions, reading them directly from `package.json` instead of a separate `mise.toml`. See [ADR-0001](docs/adr/0001-moonrepo-mise-pnpm-for-monorepo-tooling.md) and [ADR-0002](docs/adr/0002-mise-as-sole-toolchain-version-authority.md) for the rationale.

1. Install [mise](https://mise.jdx.dev/getting-started.html)
2. `mise install` — installs the pinned Node.js and pnpm versions
3. `pnpm install` — installs workspace dependencies

## License

MIT — see [LICENSE](LICENSE).
