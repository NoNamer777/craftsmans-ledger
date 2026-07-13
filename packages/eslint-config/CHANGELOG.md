# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `base.mts`: framework-agnostic flat config covering `@eslint/js`'s recommended rules, `typescript-eslint`'s `recommendedTypeChecked` and `stylisticTypeChecked` tiers, and `eslint-config-prettier`. Ignores `dist/`, `coverage/`, and `reports/`; relaxes `no-explicit-any` and `no-non-null-assertion` for `**/*.spec.ts`; disables type-aware rules for plain `.js`/`.mjs`/`.cjs` files.
- `angular.mts`: overlay layering `angular-eslint`'s recommended, template, and template-accessibility configs on top of `base.mts`, with inline-template processing and a `.angular/` ignore.

### Fixed

- `base.mts` no longer runs type-aware rules against a project's own `eslint.config.mts` or `vitest.config.mts`, which can't be type-checked without a self-referential project setup.
- `base.mts` now ignores Playwright's `test-results/` and `playwright-report/` output directories, alongside `dist/`, `coverage/`, and `reports/`.
