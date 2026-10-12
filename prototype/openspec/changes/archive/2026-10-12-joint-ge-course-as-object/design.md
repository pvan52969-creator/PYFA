# Design

## Context

See proposal.md - Why. Today joint object rows are only `kind: 'batch' | 'teacher'`. GE demo sections are seeded onto `getScheduleGlobalDemoBatch()` (`mec|202409`), so `buildScheduleJointObjectsFromTasks` / GE filter pruning still surfaces that batch as「海洋环境化学 · 2024/09」. Grid kind badge hardcodes「批次」/「教师」; sidebar always shows「专业批次」in joint context via `formatScheduleJointTaskBatchLabel`.

Constraints: change only joint schedule paths (`isScheduleJointContext` / `#page-schedule-joint` and demo); do not alter non-joint time/room detail object models.

## Goals / Non-Goals

**Goals:**

- Introduce `kind: 'course'` joint object rows for GE teaching tasks (one row per consolidated schedule task / section grain).
- When GE type is applied (or GE courses are the natural object set), prefer course rows over fake owning batches for those GE tasks.
- Keep batch/teacher rows for non-GE joint queries; allow coexistence in mixed results.
- Fix sidebar and empty-state copy so GE-only queries work.

**Non-Goals:**

- Group-level object rows (A组/B组 each a row) — deferred; user chose course grain first.
- Detaching GE seed data from demo batch in offering store (may keep internal keys for other demos); object *presentation* must not claim batch ownership.
- Changing conflict detection rules beyond row matching / place correction for course rows.
- Room-phase joint UI (joint is time-side clone).

## Decisions

1. **Course object identity**  
   - Key: `course:${taskId}` or stable `course:${code}|${catalogId|sectionId}` after `consolidateScheduleTasksByCourse`.  
   - Prefer task id already used in joint union tasks to avoid duplicate rows for the same teaching task.  
   - Label: `code + name` (existing display-name patches apply).  
   - Alternative rejected: one row per group — finer but not the first validation cut.

2. **When to emit course rows**  
   - For each GE task in `getScheduleJointUnionTasks` that matches applied GE type (or all GE in scope when building from tasks under GE filter): push a course object.  
   - Under GE filter: do **not** synthesize batch objects solely from GE tasks' `batchKeys`.  
   - If user also selected batches/teachers: keep those objects for non-GE matching; filter empty batch shells as today, but GE occupancy goes to course rows via `scheduleJointTaskMatchesRow`.

3. **Row matching / place correction**  
   - Extend `scheduleJointTaskMatchesRow`: `kind === 'course'` → match same teaching task id (or same course key).  
   - GE tasks SHOULD NOT match batch rows as their home target when course rows exist (`getScheduleJointTaskTargetRows` prefers course).  
   - `notifyScheduleJointWrongPlaceIfNeeded` continues to toast + correct using target rows.

4. **Grid chrome**  
   - Kind badge: course →「课」(CSS class parallel to `is-teacher`).  
   - Empty mount when `objects.length === 0`: if GE type applied, message mentions 公共选修课 / 课对象; else keep 专业批次或教师.

5. **Sidebar**  
   - In joint context, if `isScheduleJointGeCourse(task)`, omit「专业批次」field (simplest first look). Optional later: show GE type label (G01–G04 / stream).

6. **Demo data**  
   - Keep seeding on `mec|202409` for conflict demos if needed; joint GE samples already `offeringType: 'ge'`. Object builder ignores those batch keys for GE presentation.

## Risks / Trade-offs

- [Mixed query row count grows] → Mitigation: only add course rows for GE tasks in the filtered union; keep existing GE empty-shell pruning for batches.  
- [GE task still has batchKeys → accidental double paint on batch + course] → Mitigation: matching rules: GE → course row only when course objects present; batch filter for GE returns false (or exclude GE from batch occupancy loop).  
- [「一组一行」later] → Same `kind: 'course'` can later split to `kind: 'group'`; first cut stays course grain.

## Migration Plan

Prototype-only: reload page after `app.js` change; no persistence migration. Rollback by reverting object-builder / match / render patches.
