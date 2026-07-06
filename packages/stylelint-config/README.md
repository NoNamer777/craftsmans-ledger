# @craftsmans-ledger/stylelint-config

Shared Stylelint configs for Craftsman's Ledger apps.

## Usage

`base.js` holds framework-agnostic rules: `stylelint-config-standard-scss` and `stylelint-config-clean-order` for property ordering ([ADR-0018](../../docs/adr/0018-stylelint-clean-order-over-recess-order.md)).

`angular.js` extends `base.js` and adds an `at-rule-no-unknown` override allowlisting Tailwind v4's CSS-first at-rules (`@theme`, `@utility`, `@variant`, `@apply`, `@plugin`, `@source`), since `stylelint-config-standard-scss` doesn't recognize them ([ADR-0019](../../docs/adr/0019-manual-tailwind-at-rule-allowlist.md)).

Extend the overlay matching your framework from an app's own Stylelint config (each overlay spreads `base.js` internally, so there's no need to extend both):

```json
{
    "extends": "@craftsmans-ledger/stylelint-config/angular"
}
```

Currently available overlays: `angular`. Unlike `@craftsmans-ledger/eslint-config`, no `nest` overlay is expected here — a NestJS API produces no stylesheets, so there's no NestJS-specific CSS convention to overlay ([ADR-0016](../../docs/adr/0016-base-overlay-split-for-lint-configs.md)).
