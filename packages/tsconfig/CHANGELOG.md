# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `base.json`: environment-agnostic compiler options — the `strict` family, unused-code checks, `esModuleInterop`, `noFallthroughCasesInSwitch`, `isolatedModules`, `importHelpers`, and more — deliberately omitting `target`/`module`/`moduleResolution`/`lib` so framework overlays can pin their own.
- `angular.json`: overlay extending `base.json` with Angular's `target`/`module`/`moduleResolution`/`lib` values.
- `node.json`: overlay extending `base.json` for plain Node ESM packages authoring their own TypeScript, using `nodenext` module resolution and explicit `.mts` import extensions.
