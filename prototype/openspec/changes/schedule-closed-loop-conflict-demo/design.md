# Design

## Context

See proposal.md — Why. After `schedule-lean-demo-journey`, arrange lists are smaller, but conflict peers can still be **orphan**: `queryConflictDemo` courses (e.g. `CQT102`) sit on `mec|202409` with timed slots, while batch detail only shows ≤5 prioritized courses — so the grid looks empty and the dialog still cites a student conflict. Teacher demos use cross-batch `CDX101`; venue demos already lean on `RM301` + `SCHEDULE_ROOM_NON_SCHEDULE_OCCUPANCY`. Detection correctly scans full same-batch inventory for students; the gap is **seed / visibility alignment**, not the mutual-exclusion rule itself.

```
  Broken loop today
  -----------------
  [Place Tue2] --> student conflict cites CQT102
       |
       v
  Batch sidebar / grid: CQT102 not visible (query-only / out of top-5)
       |
       v
  Customer: "这门课凭空出现"


  Target loop
  -----------
  [Place slot] --> conflict cites CODE
       |
       +--> student: CODE in same batch arrange + already timed
       +--> teacher: CODE on that teacher's arrange timetable
       +--> venue: room already assigned or NSO seeded
```

## Goals / Non-Goals

**Goals:**

- Align conflict demo seeds so cited peers are traceable from batch / teacher / room entry points.
- Keep one oral path each for student, teacher, venue within lean caps.
- Prefer fixing data + visibility priority over weakening correct full-library student scans.

**Non-Goals:**

- Redesigning conflict algorithms, GE student-skip rules, or room-only menus.
- Building a second「full conflict catalogue」mode.
- Making every offering-plan course enter the ≤5 batch sidebar (only conflict anchors must).

## Decisions

1. **Closed-loop by seed composition, not by narrowing student scan to sidebar**  
   Keep same-batch full-library student detection (product-correct). Ensure every arrange-time student peer that can fire in the oral script is also in the batch arrange inventory and prioritized into the visible/time-complete set. Alternative: only conflict against sidebar tasks — rejected; hides real same-batch collisions outside the ≤5 cap.

2. **Retire or quarantine query-only courses from arrange-time student peers**  
   Remove `CQS102` / `CQT102` from the primary-batch arrange seed, or keep them only if they never participate in time-arrange student conflict (flag + skip already started) **and** conflict-query page still has a closed path of its own. Prefer removal from mec arrange seed if query page can reuse primary anchors (`CDF201` / teacher cross). Alternative: keep query demos on a non-lean batch — rejected; adds inventory noise.

3. **Student oral path = CDF201 (already timed, same batch) ← CDF203 probe**  
   Keep/strengthen: both codes on primary lean batch, `conflictDemo` priority so they enter batch ≤5 / 已排完. No query-only substitute.

4. **Teacher oral path = same teacher, peer visible under「按教师排」**  
   Prefer a same-teacher timed peer that appears in that teacher's arrange row (e.g. keep `CDX101` cross-batch **if** T3202’s teacher detail shows it; otherwise move the anchor onto a lean-batch course taught by T3202 that stays in teacher scope). Do not cite a course the teacher timetable cannot open.

5. **Venue oral path = RM301 + NSO (or seat/type sample)**  
   Keep existing assigned-room demos; verify room-week / venue-type can open the timed course with room filled. No phantom room ids.

6. **Time / room surface independence**  
   Seed edits stay in shared injectors; do not change room context menus to fix time-side messaging.

## Risks / Trade-offs

- **[Risk] Removing query demos weakens 课表冲突查询页** → Mitigation: point query page at primary anchors or add 1–2 query rows that mirror closed-loop codes.  
- **[Risk] ≤5 menu still drops an anchor** → Mitigation: keep `conflictDemo` prioritization; assert in tasks that CDF201/CDF203 (and teacher peer) remain in scope after seed.  
- **[Trade-off] Slightly fewer exotic conflict kinds (先修/预重修)** → Accept; lean + closed-loop over catalogue breadth.

## Migration Plan

- Prototype-only seed change; full reload → new seed.  
- Rollback: restore previous sample arrays from git.  
- No persistent storage migration (`schedule-ephemeral-mock` unchanged).

## Open Questions

- Whether课表冲突查询页 must keep separate CQS/CQT rows or may reuse arrange anchors — implementer may choose as long as arrange-time student peers stay closed-loop.
