# Spec Delta

## Purpose

Defines cascade behavior when a course offering group is cancelled: void its teaching-hour arrangements, block selecting it in new arrangements and related flows, and detach roster students into the unassigned pool.

## ADDED Requirements

### Requirement: Void arrangements belonging to a cancelled group

When a course group is cancelled, the system SHALL permanently remove teaching-hour arrangement rows that target only that group from the section's arrangement list. For arrangement rows that target multiple groups including the cancelled group, the system SHALL remove the cancelled group from that row's group targets; if no active group remains on the row, the system SHALL delete the row. After cancellation, the arrangement details table SHALL NOT show rows (or edit/copy actions) for arrangements that only covered the cancelled group.

#### Scenario: Single-group arrangement removed

- **WHEN** Group2 has one or more teaching-hour arrangement rows that target only Group2
- **AND** the user confirms cancel for Group2
- **THEN** those arrangement rows are deleted from the section
- **AND** the arrangement details table no longer lists them or shows edit/copy actions for them

#### Scenario: Multi-group arrangement strips cancelled group

- **WHEN** an arrangement row targets Group1 and Group2 together
- **AND** the user confirms cancel for Group2 only
- **THEN** the row remains with Group1 as its only group target
- **AND** Group2 is no longer listed on that row

#### Scenario: Multi-group arrangement becomes empty and is deleted

- **WHEN** an arrangement row's only remaining group targets become cancelled
- **THEN** the system deletes that arrangement row

### Requirement: Cancelled groups cannot be selected for new or edited arrangements

The system SHALL prevent selecting a cancelled group as a target when adding or editing a teaching-hour arrangement (including copy-as-new). Cancelled groups MUST either be omitted from the selectable group list or shown disabled and non-selectable.

#### Scenario: Add arrangement cannot pick cancelled group

- **WHEN** Group2 is cancelled
- **AND** the user opens the add-arrangement draft and opens the course-group multiselect
- **THEN** Group2 is not selectable as a target group

#### Scenario: Edit cannot reintroduce cancelled group

- **WHEN** the user edits an arrangement that currently targets only active groups
- **AND** Group2 is cancelled
- **THEN** the user cannot add Group2 to that arrangement's group targets

### Requirement: Related offering flows exclude cancelled groups

The system SHALL exclude cancelled groups from active business targets in related offering flows that consume group arrangements or group capacity, including at least: scheduling-plan eligibility for that group's load, Teaching Load hour counting for that group, and any group-picker used to assign teaching hours or students. Whole-course cancel (all groups cancelled) continues to mark the section cancelled and clear section-level schedule results as today.

#### Scenario: Cancelled group hours leave Teaching Load

- **WHEN** Group2 is cancelled
- **THEN** hours that belonged only to Group2 are no longer counted in related teachers' Teaching Load

#### Scenario: Scheduling plan ignores cancelled-only load

- **WHEN** Group2 is cancelled and other groups of the same course remain active
- **THEN** scheduling-plan intake for that course continues for remaining active groups only
- **AND** cancelled-group-only arrangements do not remain as schedulable targets

### Requirement: Roster cannot assign students into a cancelled group

The system SHALL reject any roster operation that would place a student into a cancelled group (manual assign, move, one-click assign, import/preset assign that targets a specific group).

#### Scenario: Manual move into cancelled group blocked

- **WHEN** Group2 is cancelled
- **AND** the user attempts to move or assign selected students into Group2
- **THEN** the system blocks the operation and does not change those students' group membership to Group2

#### Scenario: One-click assign skips cancelled groups

- **WHEN** Group2 is cancelled
- **AND** the user runs one-click or rule-based assign across groups of the section
- **THEN** no student is newly assigned into Group2

### Requirement: Students already in a cancelled group become unassigned

When a group is cancelled, the system SHALL clear group membership for every roster student who was assigned to that group so they appear as unassigned (no group). Students assigned only to other active groups of the same section MUST keep those other memberships. Students who belonged only to the cancelled group MUST become unassigned.

#### Scenario: Group-only students become unassigned

- **WHEN** students are assigned only to Group2
- **AND** the user confirms cancel for Group2
- **THEN** those students have no group assignment
- **AND** roster views treat them as unassigned

#### Scenario: Multi-group membership drops cancelled group only

- **WHEN** a student is assigned to both Group1 and Group2
- **AND** Group2 is cancelled
- **THEN** the student remains assigned to Group1 only

### Requirement: Cancel confirmation discloses arrangement and roster side effects

The cancel-group confirmation MUST state that the group's teaching-hour arrangements will be voided (removed), that the group cannot be used for new arrangements or roster assignment, and that students currently in the group become unassigned.

#### Scenario: Confirm dialog lists void and unassign effects

- **WHEN** the user initiates cancel for one or more course groups
- **THEN** the confirmation message includes that arrangements for those groups will be removed, the groups cannot be selected afterward, and students in those groups become unassigned
