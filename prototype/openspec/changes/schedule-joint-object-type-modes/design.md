# Design

## Context

See proposal.md - Why. Today `buildScheduleJointPickerBarHtml` mounts one bar with term + GE type + programme/batch + dept/teacher; `confirmScheduleJointQuery` unions batch and teacher (and GE) into `scheduleBatchDetailContext`. Entry is `launchScheduleJointTab` → detail URL → `openScheduleJointPage` with no mode gate.

Constraints: change joint time-side page only (`#page-schedule-joint`); do not alter standalone「按入学批次排 / 按教师排 / 按课程排」list pages or room-phase detail.

## Goals / Non-Goals

**Goals:**

- Gate sidebar entry with a three-option type modal every time.
- Persist active mode on the joint page with an in-page switcher; clear cross-mode draft/applied state on switch.
- Rebuild filter bar per mode; enforce same-type-only applied context and object axis.
- Wire「按课程」filters: 所属学院、所属专业、课程类型、公共选修课类型、本学期课程班多选.

**Non-Goals:**

- Redesigning conflict algorithms beyond object-row matching already covered by `schedule-joint-ge-object`.
- Forcing the hidden「联合排课（演示版本）」page to the same modal/mode model in this change (may keep demo as-is unless it breaks).
- Backend APIs (prototype-only state).

## Decisions

1. **Mode state**  
   - Add `scheduleJointObjectMode`: `'course' | 'teacher' | 'batch'` (null until modal confirms).  
   - Applied context stores mode; query builders branch on mode and ignore other pickers.  
   - Alternative rejected: keep all pickers visible but disable cross-type — user asked for filter bar change, not grayed mixed UI.

2. **Sidebar vs in-page**  
   - `launchScheduleJointTab` opens modal first; confirm → set mode → open joint detail (existing tab launch URL, extend with mode query param if needed for standalone tab).  
   - Page header/picker area: segmented control or select for mode; `onScheduleJointObjectModeChange` clears programme/batch/dept/teacher/geType/section drafts and applied lists, then rebuilds bar.  
   - Leaving the page clears or keeps mode? Spec: next sidebar click always shows modal — reset `scheduleJointObjectMode` on page deactivate / launch.

3. **Filter bar layouts**  
   - **batch**: term + programme + batch (reuse existing multiselects).  
   - **teacher**: term + dept + teacher.  
   - **course**: term + 所属学院 + 所属专业 + 课程类型 + GE type + 课程班.  
   - Shared: 确定 / 重置 still apply only current-mode drafts.

4. **「按课程」field mapping (prototype)**  
   - **所属学院**: offer-unit / school codes already used as 开课单位 elsewhere (`SCHOOL_CODES` / offering unit). Label in UI as「所属学院」per product wording.  
   - **所属专业**: programme multi-select (same source as current joint「专业」, but used only as a course filter, not as batch object selection).  
   - **课程类型**: same option set as按课程排 (`SCHEDULE_COURSE_TYPE_OPTIONS`: GE/ME/MPU/UC/MC/CC).  
   - **公共选修课类型**: existing G01–G04 multiselect; only mounted in course mode.  
   - **本学期课程班**: new multiselect of offered teaching tasks/sections for the draft term (from schedule tasks / offering sections already used by按课程排). Selecting sections is the primary object picker; academy/programme/type/GE act as narrowing filters for the section list and/or query union.  
   - Assumption recorded: confirming query in course mode with only academy/programme/type/GE (no explicit section chips) MAY auto-include all matching offered sections for the term — same spirit as today’s GE-type-only confirm. If product later requires explicit section pick always, tighten in a follow-up.

5. **Object axis**  
   - batch mode → existing batch objects only.  
   - teacher mode → teacher objects only.  
   - course mode → course-kind rows for in-scope teaching tasks (GE + selected/filtered sections); reuse `kind: 'course'` from `schedule-joint-ge-object`.  
   - Remove / stop calling paths that union batch+teacher+GE in one applied context.

6. **Modal UX**  
   - Three large choice cards/buttons; confirm on choose (single click) or select + 确定 — prefer single click to reduce friction.  
   - Cancel / overlay close = no navigation.

## Risks / Trade-offs

- [Breaking existing mixed batch+teacher demos / muscle memory] → Mitigation: empty-state copy per mode; demo page left alone if still useful for mixed visuals.  
- [Course-mode section list can be large] → Mitigation: filter by academy/programme/type/GE before listing; search inside multiselect (same pattern as teacher picker).  
- [Deep-link / standalone tab without mode] → Mitigation: if URL lacks mode, show modal on land; do not silently default to a mode.

## Migration Plan

- Prototype-only: no data migration. Clear joint draft/applied caches when deploying the mode gate so old mixed applied state cannot render.

## Open Questions

- None blocking implementation;「所属学院」display name vs internal 开课单位 code is labeled above as a mapping assumption.
