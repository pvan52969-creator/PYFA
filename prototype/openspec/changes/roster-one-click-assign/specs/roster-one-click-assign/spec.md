## ADDED Requirements

### Requirement: One-click assign entry on roster toolbar

The offering-grouping student roster toolbar SHALL provide a **一键分配** action for the current section when student roster editing is allowed.

#### Scenario: Button visible in student mode

- **WHEN** the user opens the grouping workspace student panel for an editable section
- **THEN** the toolbar includes a **一键分配** control alongside existing roster actions

#### Scenario: Blocked when roster not editable

- **WHEN** student roster editing is not allowed for the section
- **THEN** the system SHALL prevent one-click assign (disabled control and/or explanatory message)

### Requirement: No-special-group bulk import

When the section has no parallel roster groups (or only a single group treated as the class roster), one-click assign SHALL import all matching students into the class roster in one action, matched by programme and intake against the section’s offering programme-batch scope.

#### Scenario: Import all matching students for ungrouped class

- **WHEN** the section has no parallel groups and the user confirms one-click assign
- **THEN** every eligible student whose programme and intake match the section’s offering batches is added to the class roster in bulk
- **AND** the user is not required to enter each class separately to import

#### Scenario: Confirm shows match count

- **WHEN** the user triggers one-click assign in the no-special-group scenario
- **THEN** the system SHALL show the matched student count before applying

### Requirement: Custom-rule group assignment configuration

When the section has multiple parallel groups with capacity limits, one-click assign SHALL require the user to configure grouping rules before execution: selectable dimensions, per-dimension allocation mode, multi-dimension priority, and whether to order by student ID.

#### Scenario: Configure dimensions and modes

- **WHEN** the user opens one-click assign for a multi-group section
- **THEN** they can select one or more of: nationality type (Local / Chinese / International), programme, intake, gender
- **AND** each selected dimension has a mode of proportional, sequential, or unique-value
- **AND** when multiple dimensions are selected, the user sets a priority order

#### Scenario: Student ID order switch

- **WHEN** the user configures custom-rule assignment
- **THEN** they can set sort-by-student-id to Y or N
- **AND** Y means students are taken in ascending student-ID order within the rule framework
- **AND** N means students are shuffled (not ID-contiguous) within the rule framework

#### Scenario: Require at least one dimension

- **WHEN** the user tries to run custom-rule assign with no dimension selected
- **THEN** the system SHALL block execution and ask for at least one dimension

### Requirement: Proportional allocation mode

Under proportional mode for a dimension, each group’s composition for that dimension SHALL mirror the pool’s overall category shares (equivalently allocating about 1/N of each category to each of N groups), subject to group capacity.

#### Scenario: Equal share of programmes across three groups

- **WHEN** three groups of capacity 60 are filled proportionally by programme from a pool of 100 ACC and 80 FIN
- **THEN** each group targets about one-third of ACC and one-third of FIN (e.g. 33 ACC + 27 FIN = 60) after rounding/calibration

### Requirement: Sequential allocation mode

Under sequential mode, categories of the dimension SHALL fill groups in category order: exhaust or fill the current group before moving to the next category.

#### Scenario: Programme sequential fill

- **WHEN** three groups of capacity 60 are filled sequentially by programme with ACC then FIN
- **THEN** group 1 is filled with ACC first, remaining ACC spill into group 2 before FIN continues, and later groups follow until capacities are met or the pool is exhausted

### Requirement: Unique-value allocation mode

Under unique-value mode, the system SHALL prefer placing a single category of the dimension into a group before mixing, aggregating same-attribute students where capacity allows.

#### Scenario: Programme unique then remainder

- **WHEN** unique-value by programme is applied to three capacity-60 groups with ACC and FIN pools
- **THEN** early groups prefer a single programme up to capacity
- **AND** remaining students that cannot keep uniqueness may fill a later group as mixed remainder, with any still-unplaced students reported as leftover

### Requirement: Multi-dimension priority nesting

When multiple dimensions are configured, the system SHALL apply higher-priority dimensions first across the full pool, then apply lower-priority dimensions inside each higher-priority partition.

#### Scenario: Programme sequential then nationality proportional

- **WHEN** priority is programme-sequential over nationality-proportional
- **THEN** groups first receive their programme mix by sequential rules
- **AND** within each group’s programme subset, nationality types are split proportionally to that subset’s nationality shares

### Requirement: Rounding and capacity calibration

When proportional (or nested) calculations yield fractional headcounts, the system SHALL round to integers and then adjust ±1 across groups so that final group sizes respect configured capacity limits.

#### Scenario: Half-person rounding then calibrate

- **WHEN** a calculated nationality slot is 22.5 and another is 7.5 within a capacity-60 group
- **THEN** values are rounded (e.g. 22 and 8) and the group total is checked against 60, with further ±1 tweaks only if needed to meet capacity constraints

### Requirement: Assignment outcome and leftovers

After one-click assign, the system SHALL persist group membership on the roster and report how many students were assigned versus left unassigned (including skipped manually-added students if applicable).

#### Scenario: Summary after run

- **WHEN** one-click assign completes
- **THEN** the roster reflects new group assignments
- **AND** the user sees a summary including assigned count and leftover/skipped count when non-zero

### Requirement: Do not silently overwrite manual students

One-click assign MUST NOT overwrite roster membership of students marked as manually added without an explicit product path; the default is to skip them.

#### Scenario: Skip manual students

- **WHEN** the pool contains manually added students already on the roster
- **THEN** one-click assign leaves those memberships unchanged and may report them as skipped
