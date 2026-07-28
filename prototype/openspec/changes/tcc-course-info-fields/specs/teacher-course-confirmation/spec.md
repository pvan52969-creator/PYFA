## MODIFIED Requirements

### Requirement: In-system confirmation content

The system SHALL present confirmation content **within the application** (not via email). Admin list, teacher letter table, and section-manage detail SHALL use the same row field semantics aligned with the Course Information reference, including at least: Course Code, Course Name, Classification, Credits, Teaching Weeks, Combined class, No. of Group, Total Student No., Weekly Teaching Hours, Course Coordinator, Co-teaching Staff.

#### Scenario: Total Student No. uses planned headcount

- **WHEN** the confirmation view renders Total Student No. for a course row
- **THEN** the value SHALL be the section's **计划人数** (planned / estimated headcount **excluding** reserved spots)
- **AND** the UI SHALL NOT show a separate quota / reserved column or footnote for that value

#### Scenario: Teaching Weeks shows week count

- **WHEN** the confirmation view renders Teaching Weeks for a teacher on a course
- **THEN** the value SHALL be the count of distinct teaching weeks for that assignment
- **AND** if the teacher teaches only odd or only even weeks, the value SHALL be the sum of those week indices' count (e.g. seven odd weeks → `7`), not merely a start–end range string

#### Scenario: Weekly Teaching Hours uses averaged rounded hours

- **WHEN** a teacher's weekly hours vary across weeks on the same course (e.g. 3 hours in weeks 1–8 and 2 hours in weeks 9–14 over 14 teaching weeks)
- **THEN** Weekly Teaching Hours SHALL equal the total teaching hours on that course divided by Teaching Weeks, rounded to the nearest integer (e.g. `(24+12)/14 = 2.57` → `3`)

#### Scenario: No. of Group follows Teaching Load Groups rules

- **WHEN** the confirmation view renders No. of Group for a teacher on a course
- **THEN** the value SHALL follow the same Groups rules as Teaching Load: simultaneous multi-group delivery counts as `1`; separate delivery counts by group; mixed week patterns use the max parallel units across weeks

#### Scenario: Combined class for shared teaching mark

- **WHEN** the teacher's course section carries a shared-teaching mark (different course codes linked as shared teaching)
- **THEN** Combined class SHALL display `Y`

#### Scenario: Combined class for same-code simultaneous groups

- **WHEN** the teacher delivers multiple groups of the same course code simultaneously (simultaneous groups)
- **THEN** Combined class SHALL display `Y`

#### Scenario: Combined class default N

- **WHEN** neither a shared-teaching mark nor same-code simultaneous multi-group delivery applies for that teacher–course row
- **THEN** Combined class SHALL display `N`

#### Scenario: Co-teaching Staff excludes self and coordinator

- **WHEN** the confirmation view renders Co-teaching Staff for a teacher on a course code
- **THEN** the value SHALL list all other assigned teachers under the same course code in the term, excluding the row's teacher and the Course Coordinator
- **AND** if none remain, the cell SHALL show `—`

#### Scenario: Confirmation shows offering term

- **WHEN** a teacher or admin opens the confirmation content
- **THEN** the view SHALL show the offering term / academic session for the package

#### Scenario: No email dispatch

- **WHEN** admin issues a confirmation task to a teacher
- **THEN** the system SHALL NOT send email; the teacher SHALL access the task only through in-system pages

## ADDED Requirements

### Requirement: Confirmation tables expose Combined class column

Admin confirmation list, teacher confirmation letter table, and section-manage confirmation table SHALL include a Combined class column (`Y` / `N`) derived per the confirmation content rules.

#### Scenario: Column present on admin and portal tables

- **WHEN** admin or teacher opens the confirmation course table
- **THEN** a Combined class column is visible for each course row
