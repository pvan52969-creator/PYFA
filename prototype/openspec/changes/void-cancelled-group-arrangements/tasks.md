# Tasks

## 1. Cascade helpers

- [x] 1.1 Add `isOfferingGroupSelectable(sec, group)` (and/or equivalent) that returns false when group or section is cancelled; verify with a quick console/assert on a cancelled vs active group in the prototype session
- [x] 1.2 Implement `voidOfferingGroupAssignments(sec, group)` to strip cancelled group from multi-target rows, delete empty/single-cancelled rows, clear orphan slot-link refs for deleted assignment ids; verify after cancel that `sec.groupAssignments` no longer references the cancelled group id
- [x] 1.3 Implement `unassignRosterStudentsFromOfferingGroup(sec, group)` using `studentMatchesOfferingGroup` + `setStudentGroupNames`; verify students only in that group become empty `groupNames`, multi-group students keep other groups

## 2. Wire cancel entry + tip

- [x] 2.1 Call void + unassign inside `cancelOfferingGroupArrangement` before/while setting `offeringCancelled`; verify one cancel action empties arrangements and unassigns students for that group
- [x] 2.2 Update group-cancel confirm hint to mention arrangement removal, non-selectable group, and roster unassign; verify dialog text when clicking 课程班「停课」
- [x] 2.3 Add repair-on-load (or open-grouping) scrub for sections that already have cancelled groups still referenced by assignments/roster; verify opening Financial Accounting grouping after prior partial cancel cleans leftover rows/students

## 3. Block pickers and roster targets

- [x] 3.1 Status-assign draft group multiselect: omit or disable cancelled groups so they cannot be checked; verify add/edit/copy draft cannot select Group2 when cancelled
- [x] 3.2 Grep other hour-assign / global-assign group pickers and apply the same selectable gate; verify no remaining checkbox/option still submits a cancelled group id
- [x] 3.3 Gate `validateOfferingGroupCanAcceptStudents`, move-group, and one-click/rule assign so cancelled groups are never targets; verify blocked move shows a clear message and one-click never places students into cancelled groups

## 4. Related-business self-audit

- [x] 4.1 Confirm Teaching Load no longer counts cancelled-group hours after cascade (arrangements removed); verify load numbers drop for teachers who only taught that group
- [x] 4.2 Confirm scheduling-plan / shared-teaching paths do not keep cancelled-only assignment targets; verify no orphan linked rows after cancel
- [x] 4.3 Refresh arrangement details UI after cancel: cancelled-only rows gone (no ✎/⧉); verify Group1/Group3 rows remain when only Group2 was cancelled

## 5. Integration check

- [x] 5.1 End-to-end: cancel Group2 on Financial Accounting → 安排详情无 Group2 行 → 新增下拉不可选 Group2 → 名单中原 Group2 学生为未分配 → 生效状态仍为草稿/已生效且带「（存在停课组）」； verify each bullet on a fresh browser refresh
