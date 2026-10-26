# Design

## Context

See proposal.md — Why. Current prototype already marks `group.offeringCancelled` in `cancelOfferingGroupArrangement`, shows group-level「停课」on 课程班, and (recently) suffixes arrangement「生效状态」with「（存在停课组）」plus sidebar tags. It does **not** yet delete `groupAssignments` rows, block pickers, or clear roster membership.

Observed hooks (read-only findings):

- Arrangements live on `sec.groupAssignments`; list UI uses `getOfferingGroupStatusAssignRows` → `filterActiveGroupAssignments`.
- Group pickers use `formatOfferingGroupNameWithCancelHint` but still offer cancelled groups as checkable options.
- Roster membership is `stu.groupNames` / `setStudentGroupNames`; match via `studentMatchesOfferingGroup`.
- Teaching Load / scheduling already skip cancelled section or filter via `isOfferingGroupCancelled` in some paths (`getGroupAssignRowActiveOfferingGroupIds`); arrangement rows themselves still persist.

## Goals / Non-Goals

**Goals:**

- Single cascade entry on group cancel: void arrangements → detach roster → refresh UI / downstream filters.
- Selectable surfaces never treat cancelled groups as valid targets.
- Confirm tip and list behavior match the cascade.

**Non-Goals:**

- Restoring cancelled groups (still irreversible).
- Deleting the group tree node itself (sidebar may keep a read-only「停课」node for orientation).
- Redesigning whole-course cancel beyond ensuring group cascade runs before/within section cancel when all groups are cancelled.
- PRD docx/md version bump (optional follow-up outside apply-critical path).

## Decisions

### 1. Cascade inside `cancelOfferingGroupArrangement` (not only UI filter)

**Choice:** On cancel, mutate data: strip/delete matching `groupAssignments`, clear student group names for that group, then set `offeringCancelled`.

**Why:** Spec requires arrangements to be gone from the table, not merely hidden. Filtering alone would leave edit/copy and export/Teaching Load edge cases.

**Alternative considered:** Soft-void flag on rows (`row.voided`) — rejected; user asked to 作废/删掉, and soft rows still tempt ✎/⧉.

### 2. Multi-group row handling

**Choice:** Remove cancelled `groupId` from `row.groupIds` (and sync legacy `row.groupId`); if no active ids remain, delete the row. If simultaneous flag depended on multi-group, recompute: single remaining group → `simultaneousGroups = false`.

**Why:** Matches「只作废停课组相关安排」without nuking other groups' shared rows.

### 3. Picker / assign gates

**Choice:** Central helper e.g. `isOfferingGroupSelectable(group)` (= exists && !cancelled && !section cancelled). Use in:

- status-assign draft group multiselect (omit or disable)
- any other group multiselects for hour assign / global assign
- `validateOfferingGroupCanAcceptStudents` / move / one-click assign target filters

**Why:** One gate prevents missed surfaces during self-audit.

### 4. Roster unassign

**Choice:** For each student matching the cancelled group via `studentMatchesOfferingGroup`, remove that group's short/full name from `groupNames` via `setStudentGroupNames`; empty list = 未分配.

**Why:** Aligns with existing roster model; no new status enum.

### 5. Related-business audit checklist (implement as tasks)

Must verify and fix if needed:

| Surface | Expected after group cancel |
|---------|-------------------------------|
| 安排详情表 | Rows for that group gone |
| 新增/编辑组下拉 | Not selectable |
| Teaching Load | Hours for that group not counted |
| 排课计划 | No cancelled-only targets |
| 名单调整/一键分配/导入入组 | Cannot target cancelled group |
| 共同授课联动 | Rows removed with arrangements; no orphan link to deleted assignment ids |
| 停课确认 tip | Mentions void + unassign |

### 6. Confirm tip copy

**Choice:** Extend group-cancel confirm hint with three bullets: 删除该组学时安排；不可再选该组安排/入组；组内学生变为未分配。 Keep existing Teaching Load / peer-group / all-groups→section cancel bullets.

## Risks / Trade-offs

- **[Risk] Shared simultaneous rows surprise teachers** → Mitigation: tip + keep remaining groups' row; only strip cancelled id.
- **[Risk] Orphan slot-link / shared-teaching references after row delete** → Mitigation: task to clear links keyed by deleted assignment ids in the same cascade.
- **[Risk] Missed picker surface** → Mitigation: grep audit task for `formatMajorOfferingGroupName` / group checkboxes in assign UIs; gate through helper.
- **[Trade-off] Sidebar still shows cancelled group** → Acceptable for orientation; arrangements/roster no longer reference it. If product later wants hide-from-tree, separate change.

## Migration Plan

- Prototype-only: no persistence migration; in-session data updated on next cancel.
- Already-cancelled groups with leftover arrangements: on apply, either one-time scrub when rendering/loading section or run cascade repair when opening grouping for a section that has `offeringCancelled` groups still referenced by `groupAssignments` / roster. Prefer repair-on-load helper so demo data self-heals.

## Open Questions

- None blocking: multi-group strip vs delete-whole-row decided above; tree node retention decided as keep with tag.
