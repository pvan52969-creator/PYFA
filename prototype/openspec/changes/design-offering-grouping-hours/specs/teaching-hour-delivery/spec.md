## ADDED Requirements

### Requirement: Hour budget stored at section level

The system SHALL store L/T/P/O hour budget on the section after merge, copied from compatible offering lines, and SHALL treat plan weekly hours as credits for reference display only.

#### Scenario: Section inherits budget after merge

- **WHEN** two compatible lines with L24/T24/P12/O0 are merged
- **THEN** the resulting section hour budget equals L24/T24/P12/O0 and total 60

### Requirement: Hour delivery entity

The system SHALL model teacher hour arrangements as hour delivery records linked to a teacher assignment, with hour types (Lecture, Tutorial, Practical, Others), hours count, week range, merge-hours flag, and delivery scope (section or group).

#### Scenario: Section-wide lecture delivery

- **WHEN** the user assigns 24 Lecture hours to the primary instructor with section scope
- **THEN** one hour delivery is created with deliveryScope section, groupId null, and hourTypes containing Lecture

#### Scenario: Group-scoped tutorial delivery

- **WHEN** the user assigns Tutorial hours to Group 1 with a tutor
- **THEN** one hour delivery is created with deliveryScope group and groupId referencing Group 1

### Requirement: Delivery scope defaults by hour type

The system SHALL default Lecture and Others to section scope and Tutorial and Practical to group scope when creating new hour deliveries, while allowing explicit override where policy permits.

#### Scenario: New tutorial delivery defaults to group scope

- **WHEN** the user adds a Tutorial hour delivery from the hour arrange dialog
- **THEN** the UI prompts for target group unless section-wide tutorial is explicitly allowed

### Requirement: Hour budget validation on save

The system SHALL validate on save that the sum of hour delivery hours for each hour type at section scope equals the section hour budget for that type, and that the sum of group-scoped deliveries for each group and type does not exceed allocated group share of the section budget.

#### Scenario: Section lecture totals must match budget

- **WHEN** the user saves teacher assignments with section-scoped Lecture deliveries totaling 20 while budget is 24
- **THEN** the system blocks save and reports under-allocation for Lecture

### Requirement: Merge hours affects scheduling granularity

When mergeHours is true on an hour delivery, the system SHALL pass a single combined hour block to scheduling without distinguishing L/T/P types for that delivery.

#### Scenario: Merge hours enabled

- **WHEN** the user enables merge hours on a delivery covering Lecture and Tutorial totaling 48 hours
- **THEN** scheduling receives one 48-hour requirement rather than separate L and T blocks for that delivery
