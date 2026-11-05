# Spec Delta

## Purpose

Defines how teaching-confirm / task-arrangement-submit state and downstream visibility MUST react to teacher replacement versus offering withdraw/revert and follow-on edits, so gates and bypasses stay explicit and testable.

## ADDED Requirements

### Requirement: Teaching confirm state is the task-arrangement submit flag

The system SHALL treat `teachingConfirmStatus === 'confirmed'` (with `taskArrangementSubmittedAt` set) as “任务安排已提交 / 授课确认已完成” for major/GE/special offering sections. Downstream gates that historically said “须授课确认” MUST mean this submitted state unless a documented bypass applies.

#### Scenario: Submit task arrangement marks confirmed
- **WHEN** a valid task arrangement is submitted for an offering section
- **THEN** the section MUST have `teachingConfirmStatus` of `confirmed` and a `taskArrangementSubmittedAt` timestamp

#### Scenario: Draft arrangement is not confirmed
- **WHEN** a section has groups/teachers prepared but task arrangement is not submitted
- **THEN** `teachingConfirmStatus` MUST remain `pending` and the section MUST NOT satisfy “已授课确认 / 任务安排已提交” gates

### Requirement: Downstream生效 requires confirmed task arrangement except documented bypasses

The system SHALL require confirmed task arrangement before the section is treated as生效 for roster management entry, offering manifest consumption, and schedule-task consumption, except for the documented teacher-replacement bypass.

#### Scenario: Unconfirmed section blocked from生效 consumers
- **WHEN** a section is plan-submitted but task arrangement is not confirmed
- **THEN**生效 consumers (名单管理入口、开课清单纳入、排课任务可见) MUST NOT treat it as ready

#### Scenario: Confirmed section is visible to生效 consumers
- **WHEN** a section has confirmed task arrangement and no active revoke that cleared confirmation
- **THEN**生效 consumers MUST be allowed to see and operate on it per their own rules

### Requirement: Teacher replacement bypasses re-confirmation

The system SHALL allow an approved 授课教师替换 to update assigned teachers on an already-confirmed section without resetting `teachingConfirmStatus` to `pending` and without requiring a new task-arrangement submit cycle.

#### Scenario: Replacement on confirmed section keeps confirmed
- **WHEN** a teacher-replacement request is approved for a section that is already task-arrangement confirmed
- **THEN** teacher assignment data MUST update to the replacement result AND `teachingConfirmStatus` MUST remain `confirmed`

#### Scenario: Replacement does not unlock full task-arrangement edit
- **WHEN** teacher replacement is the change path used
- **THEN** the system MUST NOT reopen merge/split, grouping structure, or full hour-layout editing as if the arrangement were withdrawn—only the replacement-scoped teacher fields change

### Requirement: Withdraw task arrangement clears confirmation but keeps arrangement draft data

The system SHALL, on 任务安排「撤回」, reset confirmation to pending, clear schedule-linked slot data for that section when allowed, and KEEP merge/groups/teacher arrangement content for re-edit—subject to the already-scheduled block.

#### Scenario: Withdraw resets confirm and keeps teachers
- **WHEN** user withdraws a submitted task arrangement on a section with no generated schedule results
- **THEN** `teachingConfirmStatus` MUST become `pending`, `taskArrangementSubmittedAt` MUST be cleared, AND groups/teacher assignments MUST remain for continued editing

#### Scenario: Withdraw blocked when schedule results exist
- **WHEN** the section already has generated schedule time slots / schedule results
- **THEN** withdraw MUST be refused until those schedule results are revoked

### Requirement: Revert from roster returns arrangement to pending without clearing plan submit

The system SHALL, on 名单管理「退回」to task arrangement, set confirmation pending and clear `taskArrangementSubmittedAt` while KEEPING plan `submitStatus` submitted and retaining student roster rows.

#### Scenario: Roster revert clears confirm only
- **WHEN** user reverts selected confirmed sections from roster management with a remark
- **THEN** each section MUST become task-arrangement pending, MUST stay plan-submitted, AND roster students MUST remain

### Requirement: Revert from task to plan clears confirmation and arrangement structure

The system SHALL, on 任务安排「退回」to offering plan (only when not confirmed / not arrangement-submitted), mark plan as reverted/draft-path, clear confirmation, clear groups/teacher arrangement, and split merged multi-line sections back to one-line-one-section plans.

#### Scenario: Plan revert blocked when arrangement already confirmed
- **WHEN** user attempts plan-level revert on a section whose task arrangement is already confirmed
- **THEN** the system MUST refuse and explain that confirmed arrangement cannot be plan-reverted via this action

#### Scenario: Plan revert on unconfirmed submitted section
- **WHEN** user reverts an plan-submitted but unconfirmed section from task arrangement
- **THEN** confirmation MUST be pending, arrangement structure MUST be cleared, and merged sections MUST split back to single-batch plans

### Requirement: Follow-on edits after withdraw/revert require re-confirmation for生效

The system SHALL require a new task-arrangement submit (re-confirmation) after withdraw or roster-revert before the section again satisfies生效 gates. Teacher replacement alone MUST NOT be used as a substitute for re-submit after those clears.

#### Scenario: Edit after withdraw then生效
- **WHEN** a section was withdrawn to pending, teachers/groups are edited, and the section is submitted again
- **THEN** confirmation MUST become `confirmed` again before生效 consumers accept it

#### Scenario: Teacher replacement cannot skip re-submit after withdraw
- **WHEN** a section is pending because of withdraw/roster-revert
- **THEN** teacher-replacement bypass MUST NOT mark the section confirmed without a normal task-arrangement submit

### Requirement: Impact classification covers edge cases

The system’s rules documentation and behavior SHALL cover at least these edge cases: (1) replacement while a withdraw is also attempted; (2) merged-class split on plan revert; (3) GE/special vs major differences if any; (4) schedule results present; (5) roster-preserved vs arrangement-cleared paths.

#### Scenario: Concurrent-path priority
- **WHEN** both a teacher-replacement approval and a withdraw/revert could apply to the same section in overlapping time
- **THEN** the system MUST apply a single explicit priority (documented in design): withdraw/revert that clears confirmation wins over keeping replacement-confirmed state, OR replacement is refused while withdraw is in flight—product MUST pick one and tests MUST assert it
