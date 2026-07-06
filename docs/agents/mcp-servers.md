# MCP Servers

`.mcp.json` at the repo root registers these MCP servers for AI coding assistants (e.g., Claude Code). No extra setup is required beyond `pnpm install`.

## moon

Registered as `moon`, running `pnpm moon mcp`. Lets the assistant query the project/task graph directly (`get_project`, `get_tasks`, `get_changed_files`, etc.) instead of shelling out to `moon` commands.

## angular-cli

Registered as `angular-cli`, running `pnpm ng mcp` from the workspace root. Covers the shared root `angular.json` ([ADR-0020](../adr/0020-root-level-angular-workspace.md)) and every Angular app/lib registered in it. Exposes tools such as `list_projects`, `get_best_practices`, `run_target`, `devserver.start`/`stop`/`wait_for_build`, `search_documentation`, and `onpush_zoneless_migration`; see [angular.dev/ai/mcp](https://angular.dev/ai/mcp) for the full tool list.

**Known issue (Windows):** tools that accept a workspace/file path parameter hang indefinitely (no response, no error) when given a native Windows backslash path, confirmed with `get_best_practices`'s `workspacePath` argument, even though `list_projects` itself returns paths in that backslash form. Forward-slash paths (e.g. `D:/repo/path` instead of `D:\repo\path`) work correctly. Pass forward-slash paths as a workaround on Windows.

Searched `angular/angular-cli` upstream for an existing report or fix; found related-but-distinct Windows/path-handling issues in the MCP server, but nothing matching this exact symptom (silent, indefinite hang with no error/timeout, on a syntactically valid Windows path):

- [#32407](https://github.com/angular/angular-cli/issues/32407) — MCP-invoked `ng` commands (e.g. `modernize`, `build`) fail outright on Windows with `spawn ng ENOENT`; attributed to `spawn` not resolving the executable when the `shell` option is `false`. Different failure modes (explicit error vs. silent hang) but the same underlying theme: the MCP server's process/path handling is fragile on Windows. Open, unresolved, no linked PR as of `@angular/cli@21.1.2`.
- [#32130](https://github.com/angular/angular-cli/issues/32130) — inconsistent MCP tool behavior with a mangled path in the error output (`scandir '/home/user/some_system_drive/V:/XSD'`), suggesting path-resolution bugs elsewhere in the same tool layer. Reported on Linux, not Windows, and errors visibly rather than hanging. Open, unresolved, on Angular CLI 21.0.3.
- [#30855](https://github.com/angular/angular-cli/issues/30855) — MCP couldn't discover `angular.json` in monorepo subfolders (only checked the repo root). Closed, fixed via [#31067](https://github.com/angular/angular-cli/pull/31067). Not our root-level setup, but confirms workspace/path discovery in this server has had bugs before.

No existing issue or fix found for our specific case as of `@angular/cli@22.0.5`. If this becomes a recurring annoyance, file a new issue upstream with a minimal repro (a `get_best_practices` call with a Windows backslash `workspacePath` that never returns) rather than assuming one of the above covers it.
