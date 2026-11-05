# Design

## Context

See proposal.md — Why. Prototype today binds historical「授课确认」to task-arrangement submit via `teachingConfirmStatus` / `taskArrangementSubmittedAt` (`markMajorOfferingTaskArrangementSubmitted`, `withdrawMajorOfferingTaskArrangement`, `revertMajorOfferingTaskArrangementFromRoster`, `revertMajorOfferingSectionFromTask`). Teacher replacement lives under adjustment (`adjustment-teacher-replacement`) and is the documented bypass that changes teachers without clearing confirmation.

## Goals / Non-Goals

**Goals:**
- Publish a single impact matrix: event → confirm state → arrangement data → roster → schedule/manifest
- Name edge cases product often misses when确认 is a生效 gate
- Decide (or park) whether to keep confirm-as-gate + replacement bypass, or redesign gates

**Non-Goals:**
- Rewriting排时间/排教室 UX in this change
- Implementing teacher-replacement UI redesign
- Unifying GE/special flows beyond noting deltas vs major

## Decisions

### D1 — Treat confirm == task-arrangement submitted (current field)

**Choice:** Document and specify against existing field semantics; do not invent a second confirm flag in this change.

**Alt:** Split「任务安排提交」vs「教师本人确认」into two states — better long-term product clarity, larger migration; defer unless product insists.

### D2 — Impact matrix (authoritative for specs)

```
Event                         Confirm        Arrangement data     Roster           Schedule/Manifest
----------------------------  -------------  -------------------  ---------------  ----------------------
任务安排提交                   -> confirmed   keep                may open         生效 allowed
授课教师替换(已确认上生效)     stay confirmed teacher fields only keep             stay 生效; no re-submit
任务安排撤回                   -> pending     KEEP groups/teachers clear alloc     生效 revoked; block if
                                              (slots cleared)                      already scheduled
名单退回任务安排               -> pending     KEEP structure      KEEP students    生效 revoked
任务安排退回计划(未确认才可)   -> pending     CLEAR + split merge KEEP/split by    离开任务列表
                                              groups/teachers     line
撤回/退回后再改再提交          -> confirmed   as edited           per path         再次生效
撤回后仅走教师替换旁路         NOT allowed    n/a                 n/a              MUST normal re-submit
```

### D3 — Priority when paths collide

**Recommended default:** Structural clears (withdraw / roster-revert / plan-revert) win over replacement: if confirm is cleared or clearing is in progress, replacement approval MUST NOT re-assert confirmed without a full submit.

**Alt:** Freeze withdraw while a replacement request is pending approval — reduces race but blocks ops.

### D4 — Implementation approach (after product sign-off)

1. Freeze matrix copy in a short ops note or in-app legend if needed (optional).
2. Audit call sites that set `teachingConfirmStatus` / gate on `isMajorOfferingTaskArrangementSubmitted`.
3. Assert replacement apply path never calls `resetMajorOfferingTaskArrangementToDraft`.
4. Add focused prototype checks for the matrix rows (major first; GE/special note-only unless diverged).

## Risks / Trade-offs

- [Confirm overloaded as submit flag] → Mitigation: D1 + glossary in UI/docs; optional later split.
- [Replacement bypass expands informally] → Mitigation: Spec forbids using replacement to skip re-submit after withdraw.
- [Already-scheduled withdraw] → Mitigation: Keep existing hard block; surface in matrix so ops don't invent soft clears.
- [Merged split on plan revert surprises] → Mitigation: Explicit scenario + remark modal copy already hints; keep in checklist.

## Open Questions

1. Product: keep「确认=生效门禁 + 仅替换旁路」, or remove confirm gate and rely on task-submit alone with narrower locks?
2. GE/special: same matrix as major, or any extra confirm step not modeled in major code?
3. Collision policy: adopt D3 recommended default, or freeze withdraw while replacement pending?
