---
status: accepted
---

# Manual Tailwind at-rule allowlist in the Stylelint `angular` overlay

Tailwind v4's CSS-first config introduces custom at-rules (`@theme`, `@utility`, `@variant`, `@apply`, `@plugin`, `@source`) that `stylelint-config-standard-scss` doesn't recognize. Rather than depending on a community Tailwind-Stylelint plugin, `packages/stylelint-config`'s `angular` overlay allowlists these at-rules directly via an `at-rule-no-unknown` override. Tailwind v4's CSS-first syntax is new enough that community plugin support is inconsistent, while the actual list of at-rules it introduces is small, documented, and stable — a manual override is one fewer external dependency to track for breakage against future Tailwind releases.

## Consequences

- If Tailwind introduces new at-rules in a future major version, the allowlist in the `angular` overlay needs a manual update rather than picking it up automatically from a plugin bump.
