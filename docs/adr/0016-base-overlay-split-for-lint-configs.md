---
status: accepted
---

# Base/overlay split for `eslint-config` and `stylelint-config`

`packages/eslint-config` and `packages/stylelint-config` both mirror the base/overlay split [ADR-0011](./0011-per-framework-typescript-catalogs.md) established for `packages/tsconfig`: a framework-agnostic `base` flat config holding general TypeScript/JS/CSS rules, and an `angular` overlay layered on top with Angular- and Tailwind-specific rules, with the overlay extending `base` internally so a consuming app only ever imports the overlay relevant to its framework. A NestJS API is already planned ([ADR-0001](./0001-moonrepo-mise-pnpm-for-monorepo-tooling.md)) and will need its own lint rules that don't include Angular-eslint or Tailwind concerns; shipping a single Angular-only config now would mean redoing this split later for the same reasons ADR-0011 already gave for `tsconfig`.

## Consequences

- A future `nest` overlay for `eslint-config` is expected to follow the same shape: extend `base` internally, add only NestJS-specific rules.

## Amendment (2026-07-06)

The original "Consequences" section claimed a future `nest` overlay would follow for *both* packages. That doesn't hold for `stylelint-config`: it lints CSS/SCSS, and a NestJS API produces no stylesheets at all, so there's no NestJS-specific CSS convention a `nest` overlay could ever hold — `base.js` alone is expected to remain sufficient for `stylelint-config` indefinitely. The base/overlay split itself, and the expectation of a `nest` overlay for `eslint-config`, are unchanged.
