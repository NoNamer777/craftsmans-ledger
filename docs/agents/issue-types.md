# Issue Types

`Type` field: `PVTSSF_lAHOAtg3yc4BdMA2zhXvX0U`. `Status` field: `PVTSSF_lAHOAtg3yc4BdMA2zhXvT1w` (see [issue-tracker.md](issue-tracker.md) for the full option-ID table — each type below only uses a subset).

## Epic

**Hierarchy:** can contain Stories. Set via the native Parent issue / Sub-issues progress fields, not this file.

**Issue Type:** Projects `Type` field option `Epic` (option ID: `9d880920`)

**Fields:**

| Field      | Projects field             | Node ID                          | Type          | Values / format      |
| :--------- | :------------------------- | :------------------------------- | :------------ | :------------------- |
| `priority` | `Priority` (single-select) | `PVTSSF_lAHOAtg3yc4BdMA2zhXvX1k` | Single-select | P0 \| P1 \| P2 \| P3 |

**Statuses:** valid subset of the shared `Status` field: `Backlog`, `In Progress`, `Done`.

**Body template:**

```md
## Goal

## Scope

## Out of scope
```

---

## Story

**Hierarchy:** contained by Epic; can contain Tasks.

**Issue Type:** Projects `Type` field option `Story` (option ID: `fcfaf05f`)

**Fields:**

| Field        | Projects field             | Node ID                          | Type          | Values / format                 |
| :----------- | :------------------------- | :------------------------------- | :------------ | :------------------------------ |
| `priority`   | `Priority` (single-select) | `PVTSSF_lAHOAtg3yc4BdMA2zhXvX1k` | Single-select | P0 \| P1 \| P2 \| P3            |
| `estimation` | `Estimation` (number)      | `PVTF_lAHOAtg3yc4BdMA2zhXvX90`   | Number        | Story points: 1, 2, 3, 5, 8, 13 |

**Statuses:** valid subset of the shared `Status` field: `Backlog`, `Ready`, `In Progress`, `In Review`, `Done` (all five).

**Body template:**

```md
## User Story

As a [persona], I want [goal], so that [reason].

## Acceptance criteria

- [ ]
- [ ]
```

---

## Task

**Hierarchy:** contained by Story.

**Issue Type:** Projects `Type` field option `Task` (option ID: `09f165ac`)

**Fields:** none — Task doesn't use priority, severity, or estimation.

**Statuses:** valid subset of the shared `Status` field: `Backlog`, `In Progress`, `In Review`, `Done` (no `Ready`).

**Body template:**

```md
## Description
```

---

## Bug

**Hierarchy:** standalone — not nested under Epic or Story.

**Issue Type:** Projects `Type` field option `Bug` (option ID: `d26bc4d3`)

**Fields:**

| Field      | Projects field             | Node ID                          | Type          | Values / format      |
| :--------- | :------------------------- | :------------------------------- | :------------ | :------------------- |
| `priority` | `Priority` (single-select) | `PVTSSF_lAHOAtg3yc4BdMA2zhXvX1k` | Single-select | P0 \| P1 \| P2 \| P3 |
| `severity` | `Severity` (single-select) | `PVTSSF_lAHOAtg3yc4BdMA2zhXvX3Q` | Single-select | S0 \| S1 \| S2 \| S3 |

**Statuses:** valid subset of the shared `Status` field: `Backlog`, `Ready`, `In Progress`, `In Review`, `Done` (same as Story).

**Body template:**

```md
## Steps to reproduce

## Expected

## Actual

## Environment
```
