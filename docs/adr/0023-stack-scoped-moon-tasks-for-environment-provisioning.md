---
status: accepted
---

# Stack-scoped moon tasks for cross-app environment provisioning

`.moon/tasks/frontend.yml` introduces `inheritedBy: { stack: 'frontend' }` — moon already supports toolchain-scoped shared tasks (`.moon/tasks/node.yml` uses `inheritedBy: { toolchain: 'node' }`), but this is the first task file scoped by `stack` instead. It defines an `install-browsers` task (`playwright install chromium`) that `apps/web`'s `test`/`test-ci` tasks declare as a `deps:` dependency, rather than documenting the one-time Playwright browser install as a manual setup step in a README. Any future frontend app added to this monorepo inherits the same provisioning task automatically by virtue of setting `stack: 'frontend'` in its own `moon.yml`, with no additional wiring required.

## Consequences

- `install-browsers` declares no `outputs`, so its cache-invalidation strategy defaults to "ignored" — it re-runs its own (fast, idempotent) check on every `test`/`test-ci` invocation rather than being skipped via moon's cache.
- A future frontend app needing a different browser set (e.g., Firefox/WebKit instead of Chromium-only) will need to override or extend this shared task rather than assuming Chromium is universal across all frontend apps.
