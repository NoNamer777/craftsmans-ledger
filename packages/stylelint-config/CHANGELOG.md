# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `base.js`: extends `stylelint-config-standard-scss` and `stylelint-config-clean-order` for property ordering.
- `angular.js`: overlay merging `base.js`'s rules and allowlisting Tailwind v4's CSS-first at-rules (`@theme`, `@utility`, `@variant`, `@apply`, `@plugin`, `@source`) via `scss/at-rule-no-unknown`, since `stylelint-config-recommended-scss` disables the core `at-rule-no-unknown` check entirely rather than parse SCSS-specific at-rules.
