# Spec Delta

## MODIFIED Requirements

### Requirement: Non-GE joint object axis unchanged when no GE courses

When the joint schedule is not in「按课程」mode (or is in「按课程」mode but the confirmed result does not include GE teaching tasks as course objects), the object axis SHALL follow the active object-type mode: major-batch rows for「按入学批次」, teacher rows for「按教师」, and non-GE course rows when「按课程」selects non-GE sections. The system SHALL NOT synthesize GE course rows outside「按课程」mode.

#### Scenario: Batch-only query

- **WHEN** the user confirms a joint schedule query in「按入学批次」mode with major batches selected
- **THEN** the object column lists the selected major batches
- **AND** no course-kind object rows are required for those non-GE courses
- **AND**公共选修课类型 is not part of this mode’s filters

#### Scenario: Teacher-only query

- **WHEN** the user confirms a joint schedule query in「按教师」mode with teachers selected
- **THEN** the object column lists the selected teachers
- **AND** no GE course-kind rows are added from public elective type filters (those filters are unavailable in this mode)

### Requirement: Mixed batch and GE object rows

The system SHALL NOT allow a single confirmed joint query to mix major-batch or teacher object rows with GE course object rows. GE course object rows SHALL only appear under「按课程」mode. Selecting major batches together with a public elective type in one query is no longer supported.

#### Scenario: GE plus selected batches

- **WHEN** the user attempts to combine major-batch selection with a public elective type in one joint query
- **THEN** the UI does not offer that combination under a single mode
- **AND** GE course object rows are only obtainable in「按课程」mode
- **AND** major-batch object rows are only obtainable in「按入学批次」mode

#### Scenario: GE only under course mode

- **WHEN** the user is in「按课程」mode, selects a public elective type and/or GE teaching sections, and confirms the query
- **THEN** matching GE courses appear as course object rows
- **AND** the object axis does not also include major-batch or teacher rows from other modes

#### Scenario: Batch mode excludes GE type filter

- **WHEN** the user is in「按入学批次」mode
- **THEN**公共选修课类型 is not available
- **AND** confirming the query does not add GE course object rows via a GE type filter

### Requirement: Empty and guidance copy covers course objects

When the joint page is in「按课程」mode and the only available joint objects would come from course teaching tasks (including GE), the UI SHALL NOT require the user to select a major batch or teacher solely to render the grid. Empty-state or guidance copy SHALL acknowledge that course objects can populate the grid when course-mode scope is set.

#### Scenario: GE-only scope can render grid

- **WHEN** the user confirms a「按课程」query with a GE type and matching GE courses, without selecting major batches or teachers
- **THEN** the timetable grid renders with course object rows for those GE courses
- **AND** the UI does not show an empty state that only says to select major batches or teachers
