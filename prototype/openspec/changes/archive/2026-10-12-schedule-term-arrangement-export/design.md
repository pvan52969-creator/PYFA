# Design

## Context

See proposal.md - Why. Legacy samples:
- `课程班-*.xlsx`: one row per section; `上课时间地点` is a concatenated string.
- `课程班上课地点-*.xlsx`: one row per meeting; room/teacher metadata split into columns.

Prototype already has `downloadScheduleCsv` / timetable-query exports under `#page-schedule-timetable-query`, but those are perspective-scoped and use different headers. Reuse the CSV download helper; do not invent a new binary xlsx stack for the first try.

## Goals / Non-Goals

**Goals:**

- New page + sidebar entry under 课表查询 group.
- Build two row builders from the same term's schedule tasks / offering sections.
- CSV download with Chinese headers aligned to the legacy templates (subset + empties OK).

**Non-Goals:**

- True `.xlsx` (Office Open XML) parity.
- Filter-scoped twin exports on each 课表查询 tab (phase 2).
- Changing排时间 / 排教室 detail pages.
- Perfect population of every legacy column (负责人、职称、机房软硬件等) when mock data lacks them.

## Decisions

1. **Entry placement**  
   - Sidebar: `课表查询` → `学期安排导出` (`data-page="schedule-term-export"`).  
   - Dedicated light page (term + two export buttons), not buried in a Tab export bar.  
   - Alternative rejected: only a button on 课表查询 header — easier to miss and still couples to the query surface.

2. **File format**  
   - Reuse UTF-8 BOM CSV via existing `downloadScheduleCsv` pattern (or thin wrapper with custom filename `课程班_{学期}.csv` / `课程班上课地点_{学期}.csv`).  
   - Filename and headers in Chinese to match legacy mental model; Excel opens CSV fine for the trial.

3. **Data source**  
   - Term from active offering term options (same source as other schedule pages).  
   - Rows from consolidated schedule tasks for that `termCode` (and linked offering sections for capacity / type / credits when available).  
   - Meeting rows: expand `normalizeTaskTimeSlots(task)` (+ room meta from `SCHEDULE_ROOM_META` when room string matches).

4. **课程班「上课时间地点」汇总格式**  
   - Approximate legacy style: `Monday 10.00am-1.00pm(Room)(Week 1-5),...` using existing weekday/period/week helpers where possible; exact clock mapping may be approximate from period numbers in the prototype.

5. **IDs**  
   - Prototype: stable synthetic IDs from section/task id (numeric hash or stripped id). Not required to match legacy DB ids.

6. **Empty states**  
   - Align with other schedule exports: alert when no rows.

## Risks / Trade-offs

- [Column gaps vs legacy] → Document empties; fill what mock has (code/name/teachers/slots/room).  
- [Period → clock string imperfect] → Accept approximate labels for prototype; refine later if AC requires exact legacy clocks.  
- [CSV vs xlsx] → Users may ask for real xlsx; defer unless trial fails.

## Migration Plan

Prototype-only UI + JS. Rollback by removing nav item/page and export helpers. No persisted data changes.
