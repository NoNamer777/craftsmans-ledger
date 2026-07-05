# @craftsmans-ledger/tsconfig

Shared, environment-agnostic TypeScript compiler options for Craftsman's Ledger apps.

## Usage

Extend `base.json` from an app's own `tsconfig.json`:

```json
{
  "extends": "@craftsmans-ledger/tsconfig/base.json"
}
```

`base.json` deliberately excludes `target`, `module`, `moduleResolution`, and `lib` — those are environment-specific and belong to a framework overlay (e.g. `angular.json`, `nest.json`), which doesn't exist yet since no app has landed. See [ADR-0011](../../docs/adr/0011-per-framework-typescript-catalogs.md) for the rationale.
