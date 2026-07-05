---
status: accepted
---

# `typescript-eslint`: `recommendedTypeChecked` + `stylisticTypeChecked`, not `strictTypeChecked`

`packages/eslint-config`'s `base` config uses typescript-eslint's `recommendedTypeChecked` and `stylisticTypeChecked` rule sets, rather than the stricter `strictTypeChecked` tier. This is a deliberate choice despite the codebase being greenfield with no lint debt to migrate: `strictTypeChecked` includes rules opinionated enough to produce meaningful false-positive friction (e.g. `no-unnecessary-condition` flagging deliberately defensive checks) on a personal project without a team to absorb that tuning cost, while `recommendedTypeChecked` plus the type-aware stylistic rules already catches the real correctness bugs (unsafe `any` flows, floating promises) that matter most.

## Consequences

- Individual `strict`-tier rules can still be opted into piecemeal later if specific bug patterns show up, without committing to the full tier's friction up front.
