---
status: accepted
---

# Use husky and lint-staged for git hooks, not moon's native vcs.hooks

Moonrepo can manage git hooks natively via `vcs.hooks`/`vcs.sync` in `.moon/workspace.yml`, and combined with `--affected --status=staged` and a task's `options.affectedFiles: true`, it can match lint-staged's core behavior of running a linter against only staged files. We chose husky and lint-staged anyway: lint-staged also re-stages fixed files automatically (`git add` after autofix), which moon has no native equivalent for — a moon-only hook would need to chain a manual `git add` step to get the same result. Moon's `--affected`/`--status` filtering still has a job elsewhere, e.g., CI runs via `moon ci`, which need to check everything affected by a whole PR rather than just the staging area.

## Consequences

- `vcs.hooks`/`vcs.sync` in `.moon/workspace.yml` stay unset — husky owns hook installation, not moon.
- Both husky and lint-staged setup (and the actual lint task itself) remain deferred until real projects/tasks exist, same as the rest of moon's task config.
