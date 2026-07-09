## ADDED Requirements

### Requirement: Offering line represents programme-batch course demand

The system SHALL create one offering line per unique combination of programme, intake batch, and course code when generating a major course offering plan from a submitted execution plan.

#### Scenario: Plan generation creates lines

- **WHEN** the user generates an offering plan for a term from submitted execution plans
- **THEN** each programme-batch course appears as one offering line with credits, L/T/P/O hour budget, week range, and planned capacity

### Requirement: Merge compatibility validation

The system SHALL allow merging offering lines into one section only when all selected lines share the same course code, week range, teaching weeks, total planned hours, and L/T/P/O hour budget breakdown, and each line has capacity greater than zero.

#### Scenario: Compatible lines merge

- **WHEN** the user selects two lines for CME111 with identical 1-14 weeks, 14 teaching weeks, 60 total hours, and matching L24/T24/P12/O0
- **THEN** the system allows merge and sets section capacity to the sum of selected line capacities

#### Scenario: Incompatible lines blocked

- **WHEN** the user selects two lines with different week ranges or hour budgets
- **THEN** the system rejects merge and shows which prerequisite failed

### Requirement: Four merge-split modes

The system SHALL support normal, merge-only, split-only, and merge-then-split modes aligned with the legacy XMUM workflow.

#### Scenario: Normal mode

- **WHEN** the user applies normal mode to one offering line
- **THEN** the system creates one section containing that line with no sub-groups

#### Scenario: Split mode

- **WHEN** the user splits one line into N groups with total group capacity equal to line capacity
- **THEN** the system creates one section and N groups named Group 1..N with configured or evenly distributed capacities

#### Scenario: Merge-then-split mode

- **WHEN** the user merges multiple compatible lines and splits into N groups
- **THEN** the system creates one section containing all merged lines and N groups whose capacity sum equals merged section capacity

### Requirement: Student assignment to groups

The system SHALL maintain student roster at section level and SHALL allow assigning each student to one or more groups within the section after groups are created.

#### Scenario: Filter roster by group

- **WHEN** the user filters the student roster by Group 2
- **THEN** only students assigned to Group 2 are shown
