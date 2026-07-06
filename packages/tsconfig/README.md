# @craftsmans-ledger/tsconfig

Shared, environment-agnostic TypeScript compiler options for Craftsman's Ledger apps.

## Usage

`base.json` deliberately excludes `target`, `module`, `moduleResolution`, and `lib` — those are environment-specific and belong to a framework overlay. See [ADR-0011](../../docs/adr/0011-per-framework-typescript-catalogs.md) for the rationale.

Extend the overlay matching your framework from an app's own `tsconfig.json` (each overlay extends `base.json` internally, so there's no need to extend both):

```json
{
  "extends": "@craftsmans-ledger/tsconfig/angular.json"
}
```

Currently available overlays: `angular.json`, `node.json` (for plain Node ESM packages, e.g. shared tooling packages authoring their own TypeScript). A `nest.json` overlay will land once a NestJS app exists.
