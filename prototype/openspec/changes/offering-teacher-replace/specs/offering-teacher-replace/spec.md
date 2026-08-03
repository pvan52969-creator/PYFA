## ADDED Requirements

### Requirement: Sidebar entry under offering manifest group

The course-management sidebar under **开课清单** SHALL provide a **授课教师替换** navigation item that opens a dedicated page for replacing teachers on already-effective offerings.

#### Scenario: Navigate from sidebar

- **WHEN** the user expands 开课清单 in the 开课管理 sidebar
- **THEN** a **授课教师替换** item is visible alongside existing items such as 开课清单 / 教师开课学时统计
- **AND** activating it shows the teacher-replace page

### Requirement: List only effective offerings

The teacher-replace page SHALL list offering sections that are already effective (`submitStatus` submitted and scheduling visible / 已生效). Non-effective sections SHALL NOT appear as replace targets.

#### Scenario: Effective section is listed

- **WHEN** a major offering section is marked effective for the selected term
- **THEN** it appears in the teacher-replace course list with enough identity fields (at least term, course code, course name, offering unit)

#### Scenario: Draft or non-effective section excluded

- **WHEN** a section is still draft or task-submitted but not yet effective
- **THEN** it SHALL NOT appear in the teacher-replace course list

#### Scenario: Filter by course code

- **WHEN** the user filters by course code on the teacher-replace page
- **THEN** only matching effective sections remain visible

### Requirement: Show assignment detail rows for a selected course

After the user selects an effective offering, the system SHALL show that section’s opening-arrangement detail rows equivalent to the style2 assign panel (group/class, hour type, week range, weekly hours, total hours, teachers, simultaneous teaching at minimum).

#### Scenario: Open detail for one effective section

- **WHEN** the user opens an effective section from the teacher-replace list
- **THEN** each `groupAssignments` row for that section is listed
- **AND** the current teachers for each row are visible

#### Scenario: Empty assignments

- **WHEN** an effective section has no assignment rows
- **THEN** the detail area shows an empty state and no replace actions

### Requirement: Whole-row teacher replacement only

The system SHALL allow replacing teachers for exactly one assignment row at a time, and the replacement SHALL apply to the entire row (all weeks covered by that row’s week range). The system SHALL NOT support replacing teachers for only a subset of weeks within a row.

#### Scenario: Replace teachers on one row

- **WHEN** the user chooses 替换教师 on one assignment row, selects the new teacher(s) in the teacher picker, and confirms
- **THEN** that row’s teacher field is updated to the selected teacher(s)
- **AND** that row’s week range, hour type, weekly hours, total hours, and simultaneous-teaching flag remain unchanged
- **AND** other assignment rows on the same section remain unchanged

#### Scenario: No partial-week replace UI

- **WHEN** the user is on the teacher-replace detail for a row
- **THEN** there is no control to pick individual weeks inside the row’s range for teacher replacement
- **AND** the confirm copy states that the whole row is replaced

#### Scenario: Cancel replace

- **WHEN** the user opens the teacher picker or confirm step and cancels
- **THEN** the assignment row teachers remain unchanged

### Requirement: Persist replace audit record

Each successful whole-row teacher replacement SHALL append an audit record that can be reviewed on the teacher-replace page (or an embedded recent-log area).

#### Scenario: Audit after successful replace

- **WHEN** a whole-row teacher replacement succeeds
- **THEN** an audit record is stored with at least: term, section id, course code, row identity (group / hour type / week range), previous teachers, new teachers, and operated-at time
- **AND** the record is visible in the page’s recent replace log

### Requirement: Teacher confirmation state after replace

After a successful teacher replacement on an effective section, the system SHALL invalidate or reset teacher-course-confirmation state for the affected section so that confirmation no longer reflects the old staffing as current.

#### Scenario: New teacher requires confirmation again

- **WHEN** teachers on an assignment row are replaced
- **THEN** confirmation progress for that section no longer treats the previous confirmation as complete for the new staffing
- **AND** the UI indicates that re-issue / re-confirmation may be needed

### Requirement: Effective lock elsewhere unchanged

The grouping workbench and other pre-effect editing entry points SHALL remain read-only for effective sections; teacher changes for those sections SHALL go through the teacher-replace page.

#### Scenario: Grouping workbench still locked

- **WHEN** a section is effective
- **THEN** the immersive grouping / assign UI remains non-editable for teacher assignment as today
- **AND** the dedicated teacher-replace page is the supported place to change that section’s row teachers
