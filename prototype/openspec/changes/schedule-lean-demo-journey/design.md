# Design

## Context

See proposal.md — Why. Today `ensureScheduleGlobalDemo` stacks many injectors: time-conflict samples, query-conflict samples, cross-batch occupants, room-pending + weekday-pad (RWP*), joint GE (5×4), plus large `SCHEDULE_ROOM_META` / occupancy. Batch detail already excludes GE via `isScheduleBatchScopeExcludedTask`, but seed volume still dominates teacher/course/joint/room lists. Lifecycle remains ephemeral mock (full reload → seed); this change only shrinks and reshapes seed content.

## Goals / Non-Goals

**Goals:**

- One coherent lean seed that covers batch / teacher / course / joint(GE) time arrange and room-by-weekday / room-by-venue-type with a venue conflict path.
- Hard caps aligned with product ask: 2–3 intakes, ~5 courses/intake, 1–3 groups/course, ≤10 teachers, GE 3/type × 1–2 groups.
- Prefer editing existing seed factories over new parallel demo modes.

**Non-Goals:**

- Redesigning arrange UX, conflict algorithms, or GE object-axis rules (`schedule-joint-ge-object`).
- Shrinking培养方案 / 开课管理 non-schedule catalogues beyond what schedule seed depends on.
- Introducing a user-facing「精简演示」toggle (single lean baseline only).

## Decisions

1. **Single lean baseline, not a second seed mode**  
   Replace oversized sample arrays / pad generators in place. Alternative: dual「full / lean」flags — rejected for prototype complexity and divergent QA paths.

2. **Compose three major batches explicitly**  
   Keep MEC 202409 as primary conflict/venue host; add (or keep) two sibling intakes with ~5 major courses each and shared ≤10-teacher pool. Alternative: one batch only — rejected because list「按入学批次排」would look empty for multi-batch demos.

3. **Trim GE catalog to 3×4**  
   Cut `getScheduleJointGeDemoSamples` to three courses per G01–G04; groups 1–2 (mix 拆组/合班). Keep GE off batch keys / batch scope (existing helpers).

4. **Conflict & room demos as thin overlays**  
   Keep a minimal set of conflict anchors (student / teacher / shared-teaching / one room-time or occupancy hit) on the primary batch or known rooms. Remove or gate `ensureScheduleRoomWeekdayPadDemo` / RWP inflation so room-week targets lean timed units instead of synthetic pads. Alternative: delete all conflict demos — rejected;客户仍要场地相关可演示。

5. **Teacher pool reuse**  
   Map major + GE samples onto ≤10 staffIds so「按教师排」stays short while joint GE types still have distinct faces where needed (may share dept teachers across types carefully within the cap).

6. **Time / room surface independence**  
   Seed edits live in shared demo injectors; do not change room-only interaction menus to satisfy time-side needs, or vice versa. Room list density drops as a consequence of fewer timed slots, which is intended.

## Risks / Trade-offs

- **[Risk] Existing screenshots / scripts assume GEA104–105 etc.** → Mitigation: document removed codes in tasks; keep G01–G03 first three codes stable (GEA101–103 …) where possible.  
- **[Risk] Room-week「每星期 10 小组」target logic fights lean seed** → Mitigation: lower `SCHEDULE_ROOM_WEEKDAY_TARGET_GROUP_COUNT` or disable pad fill when lean inventory is the source of truth.  
- **[Risk] Trimming conflict samples breaks oral conflict demos** → Mitigation: keep one scenario per critical kind; verify in tasks checklist.  
- **[Trade-off] Less visual richness vs smoother click-through** — accept per proposal.

## Migration Plan

- Prototype-only: deploy by shipping new seed code; full page reload clears old in-memory / ephemeral state.  
- No data migration. If session leftovers exist from older builds, rely on ephemeral-mock clear-on-load.  
- Rollback: restore previous sample arrays from git.

## Open Questions

- Exact identity of the 2nd/3rd intakes (reuse MBT/ENG already on list vs new codes) — implementer may keep current list programmes if they already appear, as long as counts meet caps.  
- Whether课表冲突查询页专用 CQS/CQT samples stay as 1–2 rows or fold into primary anchors — defer to tasks as long as venue path remains demoable.
