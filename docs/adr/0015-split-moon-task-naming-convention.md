---
status: accepted
---

# Split moon task naming: `lint-ts`/`lint-css` and `test`/`test-ci`

`apps/web`'s `moon.yml` defines `start`, `build`, `test-ci`, `test`, `lint-ts`, and `lint-css`, rather than single consolidated `lint` and `test` tasks. Linting TypeScript (ESLint) and CSS/SCSS (Stylelint) are different tools with different failure modes, worth targeting independently from the command line and in CI output. Similarly, `test` runs Vitest in interactive watch mode with the browser UI for local development, while `test-ci` runs once, non-interactively, with the `github-actions` reporter added — one task can't serve both without flags layered on top of moon's task definition.

## Consequences

- Future apps in this monorepo (a management client, the NestJS API) are expected to follow the same split for consistency across moon task names.
