---
status: accepted
---

# Tailwind v4 utility-first styling, SCSS reserved for global concerns only

`apps/web` applies Tailwind v4 utility classes directly in component templates as the primary styling mechanism. SCSS is reserved for genuinely global concerns only — theme tokens, resets, `@font-face` — and is used sparingly; component stylesheets do not lean on Tailwind's `@apply` to compose utilities into custom classes. Tailwind's own v4 guidance has moved away from `@apply`-heavy component stylesheets in favor of applying utilities directly in markup, and mixing utility-first templates with heavy per-component SCSS would create two competing styling systems fighting over the same components.

## Consequences

- `prettier-plugin-tailwindcss` is added to the root Prettier config to auto-sort utility classes, since classes living in markup make ordering consistency matter more than it would with sparse usage.
