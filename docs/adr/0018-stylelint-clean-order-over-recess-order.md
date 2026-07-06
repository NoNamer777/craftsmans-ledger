---
status: accepted
---

# `stylelint-config-clean-order` over `stylelint-config-recess-order`

`packages/stylelint-config` uses `stylelint-config-clean-order` for CSS property ordering, rather than `stylelint-config-recess-order`. This is a deliberate preference despite Tailwind's own generated utility CSS following the recess-order convention — the handwritten SCSS this config actually applies to is expected to stay minimal ([ADR-0014](./0014-tailwind-utility-first-styling.md) reserves SCSS for global concerns only), so matching Tailwind's internal ordering convention byte-for-byte matters less than using the ordering scheme preferred for the small amount of SCSS that does get handwritten.

## Consequences

- Property ordering is autofixable via Stylelint's `--fix`, so this choice is inexpensive to revisit if the split between handwritten SCSS and Tailwind output shifts later.
