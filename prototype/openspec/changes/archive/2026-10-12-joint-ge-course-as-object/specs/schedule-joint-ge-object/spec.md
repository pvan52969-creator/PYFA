# Spec Delta

## Purpose

Defines how joint scheduling treats GE (public elective) courses as course-level timetable objects, so schools can place many GE courses together to inspect conflicts and venues without inventing a fixed major batch.

## ADDED Requirements

### Requirement: GE courses appear as course object rows

When the joint schedule result set includes GE courses, the timetable object axis SHALL include one object row per GE teaching task (course/section grain). The object label SHALL identify the course (at minimum course code and name). The object kind for these rows SHALL be course (or equivalent user-visible label such as「课」), not major batch.

#### Scenario: GE type filter yields course rows

- **WHEN** the user confirms a joint schedule query with a public elective type (G01–G04) selected and matching GE courses exist
- **THEN** the object column lists those GE courses as course rows
- **AND** those GE courses SHALL NOT appear solely as the demo-affiliated major batch row (e.g.「海洋环境化学 · 2024/09」)

#### Scenario: One teaching task one row

- **WHEN** a GE course has multiple groups (合班 or 拆组)
- **THEN** the object axis still shows a single course row for that teaching task
- **AND** scheduled slots for that task occupy cells on that course row

### Requirement: Non-GE joint object axis unchanged when no GE courses

When the joint schedule query does not involve GE courses as scheduling objects, the object axis SHALL continue to use major-batch and/or teacher rows as today.

#### Scenario: Batch-only query

- **WHEN** the user confirms a joint schedule query with major batches selected and no public elective type filter
- **THEN** the object column lists the selected major batches (and teachers if selected)
- **AND** no course-kind object rows are required for non-GE courses

### Requirement: Mixed batch and GE object rows

When a joint schedule query yields both non-GE tasks bound to selected batches/teachers and GE courses, the object axis SHALL include batch and/or teacher rows for the non-GE scope and course rows for the GE teaching tasks. A GE course's slots SHALL match its course object row; a non-GE course's slots SHALL match its batch/teacher rows.

#### Scenario: GE plus selected batches

- **WHEN** the user selects major batches and a GE type, and both major courses and GE courses appear in the result
- **THEN** the object column contains batch rows for the selected batches that still have matching non-GE occupancy or selection semantics as designed
- **AND** GE courses appear as separate course rows
- **AND** placing a GE course on a batch-only row is not treated as the correct home row for that GE course

### Requirement: Sidebar does not imply fixed major batch for GE

In the joint schedule course list, a GE course card SHALL NOT present a fixed major-batch value that implies the course belongs to a single programme intake. The field MAY be omitted for GE courses, or replaced with GE-type/category information that does not claim a single owning batch.

#### Scenario: GE course card in joint sidebar

- **WHEN** the user views a GE course in the joint schedule left course list
- **THEN** the card does not show「专业批次」as a single programme·intake like a major course ownership
- **AND** the course identity remains visible via code/name (and other existing fields)

### Requirement: Empty and guidance copy covers course objects

When the only available joint objects would come from GE courses (no batch/teacher rows), the UI SHALL NOT require the user to select a major batch solely to render the grid. Empty-state or guidance copy SHALL acknowledge that course objects can populate the grid when GE courses are in scope.

#### Scenario: GE-only scope can render grid

- **WHEN** the user confirms a joint query with a GE type and matching GE courses, without selecting major batches or teachers
- **THEN** the timetable grid renders with course object rows for those GE courses
- **AND** the UI does not show an empty state that only says to select major batches or teachers
