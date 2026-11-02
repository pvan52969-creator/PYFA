# Spec Delta

## Purpose

Defines the joint-schedule object-type modes: entry modal choice, in-page mode switch, mutually exclusive filters, and same-type-only object selection for course, teacher, and intake-batch modes.

## ADDED Requirements

### Requirement: Sidebar entry opens object-type modal every time

Each time the user activates the sidebar「联合排课」entry, the system SHALL present a modal that requires choosing exactly one object type before entering the joint schedule page. The three choices SHALL be「按课程」「按教师」「按入学批次」.

#### Scenario: Fresh sidebar click shows modal

- **WHEN** the user clicks the sidebar「联合排课」item (including after leaving the joint page and returning)
- **THEN** a type-selection modal appears with the three choices
- **AND** the joint schedule page is not shown until a choice is confirmed

#### Scenario: Cancel keeps user off joint page

- **WHEN** the user dismisses the type-selection modal without confirming a type
- **THEN** the joint schedule page is not opened (or remains inactive)
- **AND** no object-type mode is applied

### Requirement: In-page mode switch without re-opening sidebar modal

After the user has entered the joint schedule page via the sidebar modal, the page SHALL provide a control to switch among「按课程」「按教师」「按入学批次」without requiring a return to the sidebar. Switching mode SHALL clear selections and applied query results that belong to other modes.

#### Scenario: Switch type on page clears prior selections

- **WHEN** the user is on the joint schedule page in one mode with objects selected or a query already applied
- **AND** the user switches to a different object type via the in-page control
- **THEN** selections and applied filters of the previous mode are cleared
- **AND** the filter bar updates to the new mode’s fields

### Requirement: Modes are mutually exclusive for object selection

At any moment the joint schedule page SHALL operate in exactly one object-type mode. The user SHALL NOT be able to select or apply objects from more than one mode in the same query.

#### Scenario: Batch mode cannot pick teachers

- **WHEN** the current mode is「按入学批次」
- **THEN** teacher-unit and teacher pickers are not available
- **AND** confirming query cannot include teacher objects

#### Scenario: Teacher mode cannot pick batches or courses

- **WHEN** the current mode is「按教师」
- **THEN** programme/batch pickers and course/section pickers are not available
- **AND** confirming query cannot include batch or course objects

#### Scenario: Course mode cannot pick batches or teachers

- **WHEN** the current mode is「按课程」
- **THEN** programme-batch and teacher pickers are not available
- **AND** confirming query cannot include batch or teacher objects as joint object rows

### Requirement: Intake-batch mode filter bar

In「按入学批次」mode, the filter bar SHALL include学年学期、专业、专业批次, and SHALL NOT include公共选修课类型 or teacher/course object pickers.

#### Scenario: Batch mode fields

- **WHEN** the joint page is in「按入学批次」mode
- **THEN** the user can select programmes and major batches for the term
- **AND**公共选修课类型 is not shown

### Requirement: Teacher mode filter bar

In「按教师」mode, the filter bar SHALL include学年学期、教师单位、教师, and SHALL NOT include programme/batch or course-section object pickers, nor公共选修课类型.

#### Scenario: Teacher mode fields

- **WHEN** the joint page is in「按教师」mode
- **THEN** the user can select teacher units and teachers for the term
- **AND**专业 / 专业批次 / 课程班 / 公共选修课类型 are not shown

### Requirement: Course mode filter bar

In「按课程」mode, the filter bar SHALL include学年学期、所属学院、所属专业、课程类型、公共选修课类型, and a control to multi-select teaching class sections that are already offered for the selected term. Public elective type (公共选修课类型) SHALL appear only in this mode.

#### Scenario: Course mode fields include GE type and sections

- **WHEN** the joint page is in「按课程」mode
- **THEN** the filter bar shows所属学院、所属专业、课程类型、公共选修课类型 and a本学期课程班 multi-select
- **AND**专业批次 and教师 pickers are not shown

#### Scenario: Direct section pick narrows to offered sections

- **WHEN** the user multi-selects teaching class sections in「按课程」mode and confirms the query
- **THEN** the joint result scope includes those selected sections (subject to term and other course-mode filters still applied)

### Requirement: Object axis matches the active mode

After a confirmed query, the timetable object axis SHALL only contain object rows of the active mode: major-batch rows for「按入学批次」, teacher rows for「按教师」, and course (teaching-task) rows for「按课程」.

#### Scenario: Batch query yields batch rows only

- **WHEN** the user confirms a query in「按入学批次」mode with at least one major batch selected
- **THEN** the object axis lists those major batches
- **AND** does not list teacher or course-kind rows from other modes

#### Scenario: Course query yields course rows

- **WHEN** the user confirms a query in「按课程」mode with matching offered sections and/or public elective type scope
- **THEN** the object axis lists course rows for the in-scope teaching tasks
- **AND** does not list major-batch or teacher rows as the joint object axis for that query
