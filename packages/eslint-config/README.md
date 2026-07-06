# @craftsmans-ledger/eslint-config

Shared ESLint flat configs for Craftsman's Ledger apps.

## Usage

`base.mts` holds framework-agnostic rules: `@eslint/js`'s recommended set, `typescript-eslint`'s `recommendedTypeChecked` and `stylisticTypeChecked` tiers ([ADR-0017](../../docs/adr/0017-typescript-eslint-recommended-type-checked.md)), and `eslint-config-prettier`. It also holds conventions that apply regardless of framework: ignores for generated output (`dist/`, `coverage/`, `reports/`), a relaxed `**/*.spec.ts` override for test code, and `typescript-eslint`'s `disableTypeChecked` for plain `.js`/`.mjs`/`.cjs` files that aren't covered by a tsconfig.

Import the overlay matching your framework from an app's own `eslint.config.mts` (each overlay spreads `base.mts` internally, so there's no need to import both), then wire the type-aware rules to your own tsconfig:

```ts
import angular from '@craftsmans-ledger/eslint-config/angular';
import { defineConfig } from 'eslint/config';

export default defineConfig(angular, {
    languageOptions: {
        parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
        },
    },
});
```

Currently available overlays: `angular`. A `nest` overlay will land once a NestJS app exists.
