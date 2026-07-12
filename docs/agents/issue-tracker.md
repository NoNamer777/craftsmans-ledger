# Issue Tracker

## Tracker Backend

github-issues-projects

## GitHub

- **Repo:** `NoNamer777/craftsmans-ledger`
- **Project:** `#8` — "Craftsman's Ledger" (`PVT_kwHOAtg3yc4BdMA2`)

This is a personal repo (not an org), so Issue Types are not GitHub org-level issue types — they're stored as a Projects `Type` single-select field (`PVTSSF_lAHOAtg3yc4BdMA2zhXvX0U`). For full type definitions, see [issue-types.md](issue-types.md).

## Status field

Board-wide `Status` single-select field (`PVTSSF_lAHOAtg3yc4BdMA2zhXvT1w`) — shared across all Issue Types, since GitHub Projects doesn't support per-type constrained fields. It holds the union of every type's valid statuses; each type only uses a subset (see [issue-types.md](issue-types.md) for which).

| Status      | Option ID  |
|:------------|:-----------|
| Backlog     | `f75ad846` |
| Ready       | `3f5ec8fb` |
| In Progress | `47fc9ee4` |
| In Review   | `22425b8b` |
| Done        | `98236657` |

## Linking conventions

- **Parent/child** (Epic→Story→Task): use the Project's native **Parent issue** field (`PVTF_lAHOAtg3yc4BdMA2zhXvT2I`) / **Sub-issues progress** field (`PVTF_lAHOAtg3yc4BdMA2zhXvT2M`) — i.e. GitHub's real sub-issue linking (`gh issue edit --add-parent` / `addSubIssue` mutation), not a text convention.
- **Blocked by / Blocking**: use the native Issue relation, not text. No Project field exists for this (GitHub doesn't expose it as a Projects column). Set it via GraphQL, since there's no `gh` CLI shortcut:

  ```sh
  gh api graphql -f query='
  mutation {
    addBlockedBy(input: {issueId: "<ISSUE_NODE_ID>", blockingIssueId: "<BLOCKING_ISSUE_NODE_ID>"}) {
      clientMutationId
    }
  }'
  ```

  Get an issue's node ID with `gh issue view <n> --json id`. Use `removeBlockedBy` with the same shape to remove a relation.
- `Closes #<n>` — resolution reference, in PR/commit bodies.
- `Refs #<n>` — related (non-blocking, non-parent) reference.
