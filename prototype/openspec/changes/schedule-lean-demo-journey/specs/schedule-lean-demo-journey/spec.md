# Spec Delta

## Purpose

Defines a lean schedule-demo seed so reviewers can finish the time-arrange → room-arrange → venue-conflict journey with small lists, while GE electives stay available via teacher, course, and joint entry points only.

## ADDED Requirements

### Requirement: Lean major-batch demo inventory

After demo seed load, the schedule time「按入学批次排」list SHALL expose at most three programme-intake batches that belong to the lean journey seed. Each such batch SHALL include about five schedulable major (non-GE) courses, and each course SHALL have between one and three teaching groups. The lean journey’s distinct teachers across these batches and GE courses SHALL total at most ten.

#### Scenario: Batch list stays small

- **WHEN** the user opens「按入学批次排」after a full page load of the lean seed
- **THEN** the list shows at most three lean-journey batches (may show fewer if filters apply)
- **AND** opening a batch detail does not present GE courses in the course sidebar

#### Scenario: Per-batch course and group scale

- **WHEN** the user opens a lean-journey batch detail for time arrange
- **THEN** about five major courses are available in that batch’s arrange scope
- **AND** each course presents between one and three groups

### Requirement: GE electives stay off batch arrange

GE / public-elective courses SHALL NOT appear in「按入学批次排」list counts or batch detail sidebars. They SHALL remain available through「按教师排」「按课程排」and「联合排课」(including G01–G04 type filter).

#### Scenario: GE absent from batch detail

- **WHEN** the user opens any programme-intake batch time-arrange detail
- **THEN** the left course list contains no GE / public-elective courses

#### Scenario: GE reachable via teacher, course, or joint

- **WHEN** the user opens「按教师排」「按课程排」or「联合排课」with an appropriate teacher, course, or G01–G04 filter
- **THEN** matching GE courses appear and can be scheduled

### Requirement: Lean joint GE catalog

Joint-schedule GE demo inventory SHALL provide exactly three courses for each of G01, G02, G03, and G04. Each GE course SHALL have one or two groups.

#### Scenario: G01 filter shows three courses

- **WHEN** the user confirms a joint query with only G01 selected
- **THEN** at most three matching GE courses populate the joint course list / course object rows for that type

### Requirement: Full journey including venues

The lean seed SHALL allow a reviewer, without adding extra mock catalogues, to: (1) place time for major courses via batch and/or teacher and/or course entry; (2) place time for GE via teacher, course, or joint; (3) assign rooms via「按时间排」and「按场地类型排」; (4) observe at least one venue-related conflict or non-schedule occupancy interaction on the room side.

#### Scenario: Time then room then venue conflict

- **WHEN** the user schedules time for a lean major course and proceeds to room arrange for a weekday or venue type that includes that course’s timed slots
- **THEN** room assignment UI is usable with the lean inventory
- **AND** at least one seeded venue conflict or non-schedule occupancy case remains demonstrable

### Requirement: No list-padding inflation

The lean seed SHALL NOT inject weekday-padding or similar bulk courses whose sole purpose is to fill room-week or arrange lists beyond the journey inventory above. Conflict demos, if kept, SHALL be a thin overlay (few anchor courses) and MUST NOT restore the previous large GE or pad catalogues.

#### Scenario: Room-week list not pad-dominated

- **WHEN** the user opens「按时间排」after lean seed load
- **THEN** weekday rows reflect lean timed courses rather than a large set of RWP-style padding courses
