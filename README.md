# Craftsman's Ledger

![Node](https://img.shields.io/badge/node-24.18.0-339933?logo=node.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11.9.0-F69220?logo=pnpm&logoColor=white)
![moon](https://img.shields.io/badge/moon-2.3.5-6F53F3?logo=moonrepo&logoColor=white)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-F7B93E?logo=prettier&logoColor=black)](https://prettier.io)
[![CI](https://github.com/nonamer777/craftsmans-ledger/actions/workflows/push-main.yml/badge.svg)](https://github.com/nonamer777/craftsmans-ledger/actions/workflows/push-main.yml)

A personal companion tool for Medieval Dynasty: track unlocked recipes, find vendors across villages/realms, compare recipe profitability, and look up recipes/items/buildings by tech-tree progression.

## Status

Early development: repository scaffolding in progress.

## Project Structure

- `apps/`: deployable applications
- `libs/`: shared *application* code consumed at runtime by `apps/*` (currently empty)
- `packages/`: shared *build/tooling* config, consumed by name (e.g. `@craftsmans-ledger/tsconfig`), not by relative path

See [ADR-0003](docs/adr/0003-libs-vs-packages-split.md) for the full runtime/build-time rationale.

Currently populated apps:

- [`web`](apps/web): the main Angular web client; a project in the shared root `angular.json` workspace ([ADR-0020](docs/adr/0020-root-level-angular-workspace.md)) with zoneless change detection and Vitest as its test runner, see [ADR-0013](docs/adr/0013-zoneless-vitest-testing-stack.md). Currently a shell only: no domain routes/components yet.

Currently populated packages:

- [`@craftsmans-ledger/tsconfig`](packages/tsconfig): shared, environment-agnostic TypeScript compiler options; see [ADR-0011](docs/adr/0011-per-framework-typescript-catalogs.md) for why framework-specific overlays aren't included yet.

## Getting Started

This project uses [mise](https://mise.jdx.dev/) to manage the Node.js and pnpm versions, reading them directly from `package.json` instead of a separate `mise.toml`. See [ADR-0001](docs/adr/0001-moonrepo-mise-pnpm-for-monorepo-tooling.md) and [ADR-0002](docs/adr/0002-mise-as-sole-toolchain-version-authority.md) for the rationale.

1. Install [mise](https://mise.jdx.dev/getting-started.html)
2. `mise install`: installs the pinned Node.js and pnpm versions
3. `pnpm install`: installs workspace dependencies

Task orchestration is handled by [moon](https://moonrepo.dev/) (`pnpm moon <command>`); see [ADR-0001](docs/adr/0001-moonrepo-mise-pnpm-for-monorepo-tooling.md) for why. Its `.mcp.json` also registers a moon MCP server for Claude Code, letting the assistant query the project/task graph directly (`get_project`, `get_tasks`, `get_changed_files`, etc.) without extra setup.

### Formatting

[Prettier](https://prettier.io/) formats the entire workspace, including import ordering via `prettier-plugin-organize-imports`, configured at the repo root only; see [ADR-0005](docs/adr/0005-root-only-prettier-config.md) and [ADR-0006](docs/adr/0006-prettier-owns-formatting-boundary.md).

- `pnpm moon run root:format`: format the workspace
- `pnpm moon run root:format-check`: check formatting without writing (this is what CI runs)

To format on save instead of relying on the commands above:

- **VS Code**: install the [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension, then add to `.vscode/settings.json`:
    ```json
    {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    }
    ```
- **WebStorm**: open Settings → Languages & Frameworks → JavaScript → Prettier, set the Prettier package to `<repo root>/node_modules/prettier`, and enable "On save" (and "On 'Reformat Code' action" if desired).

### Git Hooks

[Husky](https://typicode.github.io/husky/) manages git hooks, installed automatically by the `prepare` script on `pnpm install`; see [ADR-0004](docs/adr/0004-husky-lint-staged-for-git-hooks.md) for why husky/lint-staged were chosen over moon's native `vcs.hooks`.

- `pre-commit` runs [lint-staged](https://github.com/lint-staged/lint-staged) (config in `lint-staged.config.mjs`), which formats staged files with Prettier and re-stages the result.
- `commit-msg` runs commitlint locally against the same rules CI enforces (see below).

### Commit Messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org/), enforced by [commitlint](https://commitlint.js.org/) against `commitlint.config.mjs` at the repo root; locally via the `commit-msg` hook above, and in CI only on pull requests; see [ADR-0010](docs/adr/0010-commitlint-via-cli-in-ci.md) for why CI invokes it directly via the CLI rather than a marketplace action, and why it doesn't also run on push to `main`.

## Continuous Integration

A `ci` job (Prettier formatting today, joined by code linting/build/typecheck/tests as those tasks come to exist) runs via GitHub Actions on pull requests targeting `main` (required to pass before merging) and again on every push to `main`, confirming `main` itself stays green and deployable/releasable at any point in time. Commit messages are linted separately, only on pull requests; see [ADR-0010](docs/adr/0010-commitlint-via-cli-in-ci.md). See [ADR-0007](docs/adr/0007-ci-toolchain-via-setup-node-pnpm-action-setup.md), [ADR-0008](docs/adr/0008-ci-workflows-split-by-trigger.md), [ADR-0009](docs/adr/0009-branch-protection-requires-ci-check.md), and [ADR-0010](docs/adr/0010-commitlint-via-cli-in-ci.md) for the toolchain-provisioning, workflow-split, branch-protection, and commit-linting rationale.

## License

MIT. See [LICENSE](LICENSE).
