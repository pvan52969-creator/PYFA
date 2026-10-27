# Design

## Context

See proposal.md - Why. Existing entry `#page-schedule-term-export` and CSV builders in `app.js` (`buildScheduleTermExportSectionRows`, `formatScheduleTermExportMeetingSummary`, `buildScheduleTermExportMeetingRows`) already approximate legacy clocks/weekday English labels, but:

- Rows come from `getScheduleTermExportTasks` → `consolidateScheduleTasksByCourse` (one task per course key).
- Time-place joins slots with `,` and omits per-line teacher; week text is `Week ${raw}` without discontinuous `&`.
- Group identity lives on offering sections (`sec.groups`, `groupAssignments`) and schedule units (`getScheduleUnitRows` / `joinScheduleUnitKey`), not on the consolidated export path.

Prototype already has week parsers/formatters (`parseWeeksString`, `formatScheduleWeekListCompact`) and period→clock helpers used by the current export.

## Goals / Non-Goals

**Goals:**

- Rebuild课程班 export row source as **课程班 × 组** (fallback: one synthetic group when section has no `groups`).
- Rebuild「上课时间地点」from that group's week-scoped meetings: fold equal (day, time, room, teacher); split on differences; format with `&` week joins and optional teacher suffix.
- Keep CSV + Chinese headers; update page help text only.
- Align上课地点 export's 课程班名称 with the same group label when group-scoped.

**Non-Goals:**

- Preview table on the export page (screenshot of legacy Excel is reference only).
- Changing排时间 / 排教室 UI or `#schedule-grid-context-menu`.
- True `.xlsx` binary export.
- Inventing week-level room/teacher history the mock does not store; only use data already on slots / groupAssignments / task teachers.
- Reworking课表查询 Tab exports.

## Decisions

1. **Row grain = schedule/offering group, not course consolidation**  
   - Stop using `consolidateScheduleTasksByCourse` inside `getScheduleTermExportTasks` for课程班 summary (or bypass it in the section-row builder).  
   - Prefer expanding via section.groups + slots filtered/associated to the group (slot `hourKey` / unit key when present; else all slots when single-group or undivided).  
   - Alternative rejected: one CSV row per distinct time-place pattern — duplicates capacity/credits and diverges from legacy「一组一行、格内多行」.

2. **「分成 2 条」= 时间地点格内多行，不是拆成两行表记录**  
   - Same group → one table row; divergent weeks → newline-separated lines inside「上课时间地点」(CSV 中用 `\n`，Excel 可显示多行).  
   - Matches legacy ledger screenshots (COS109 Group 1).  
   - Alternative considered: duplicate full rows per pattern — rejected to avoid exploding IDs/capacity columns.

3. **Fold key and week label**  
   - Key: `weekday|periodFrom-periodTo|room|teacherName`.  
   - Collect week numbers per key, then format: consecutive → `a-b`; gaps → join segments with `&` → prefix `Week `（例 `Week 1-12&14`）.  
   - Reuse parse helpers; add a small export-only formatter (do not change `formatScheduleWeekListCompact` comma semantics used elsewhere).

4. **Teacher suffix**  
   - Resolve teacher for a pattern from groupAssignment covering those weeks when available; else slot/task teacher; else omit trailing `(Name)`.  
   - When multi-teacher courses have different teachers on different week blocks, each line carries its own name (legacy COS109 style).

5. **Demo coverage**  
   - Ensure at least one mock course/group in the active term has a mid-term divergence (e.g. week 13 different room or teacher) so trial export visibly shows `1-12&14` + second line. Prefer extending existing schedule demo seed over inventing a parallel store.

6. **上课地点 export**  
   - Keep one row per slot/meeting; when building 课程班名称, use the same `formatScheduleCourseGroupLabel(course, groupShortName)` as summary rows. Filter/tag slot by unit group when slot is group-scoped.

## Risks / Trade-offs

- [Mock slots lack per-week teacher/room] → Fold/split only sees what slots encode; if demo never differs by week, AC hard to eyeball → seed one divergent group.  
- [CSV newline in cell] → Some tools show `\n` literally; acceptable for Excel-first legacy parity; document in page help.  
- [Group ↔ slot association ambiguous for old tasks] → Undivided / missing unit key: attach slots to all groups only when simultaneous; otherwise first group or section-level single row — document fallback in code comment.  
- [Row count jump vs previous prototype CSV] → Expected **BREAKING** alignment; no migration of old files.

## Migration Plan

Prototype-only. Rollback by restoring previous builders + help text. No persisted schema change.

## Open Questions

- None blocking implementation; if real data later stores week overrides outside `timeSlots`, revisit fold key source without changing the observable format rules in the spec.
