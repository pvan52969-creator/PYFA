# Spec Delta

## Purpose

Defines closed-loop rules for schedule conflict demos so every cited student, teacher, or venue conflict maps to real already-arranged data the reviewer can open from the matching arrange entry point.

## ADDED Requirements

### Requirement: Student conflict peers are real same-batch timed courses

When the time-arrange place flow reports a student conflict against another course, that peer course SHALL belong to the same programme-intake as the active course, SHALL already have a timed slot overlapping the attempted placement, and SHALL be reachable from「按入学批次排」for that batch (including as an already-complete course in the batch detail scope). Query-only or otherwise invisible demo courses that are not part of that batch arrange inventory SHALL NOT be cited as student-conflict peers during time arrange.

#### Scenario: Cited student peer is findable in batch arrange

- **WHEN** the reviewer places a lean-batch course onto a slot and the conflict dialog lists a student conflict naming course code X
- **THEN** opening「按入学批次排」for that same programme-intake shows course X in the batch arrange scope
- **AND** course X already has a timed slot on the conflicting weekday/period (visible on the batch timetable or as an already-scheduled unit for that course)

#### Scenario: Query-only demos do not invent student conflicts

- **WHEN** the only overlapping same-batch timed section at a slot is a conflict-query-only demo that is not in the batch arrange inventory
- **THEN** time-arrange placement at that slot does not report a student conflict naming that query-only course

### Requirement: Teacher conflict peers are real on the teacher timetable

When the time-arrange place flow reports a teacher conflict against another course, that peer course SHALL already be timed for the same teacher on the overlapping weekday/period, and SHALL be reachable from「按教师排」for that teacher so the reviewer can see the existing placement.

#### Scenario: Cited teacher peer is findable in teacher arrange

- **WHEN** the reviewer places a course taught by teacher T onto a slot and the conflict dialog lists a teacher conflict naming course code Y
- **THEN** opening「按教师排」for teacher T shows course Y with an already-scheduled slot on that weekday/period

### Requirement: Venue conflicts cite real room occupancy

When the room-arrange path reports a venue-related conflict (another scheduled course in the same room/time, or a non-schedule occupancy such as exam/borrow), the conflicting occupancy SHALL already exist in demo data: either another course with that room assigned on the overlapping slot, or a seeded non-schedule occupancy for that room and time. The reviewer SHALL be able to reproduce the conflict without adding extra mock catalogues mid-flow.

#### Scenario: Room conflict maps to an assigned room or seeded occupancy

- **WHEN** the reviewer assigns or inspects a room on a timed slot and sees a venue conflict or occupancy hit naming a room R at weekday/period P
- **THEN** either another course already has room R on that overlapping slot, or a seeded non-schedule occupancy occupies room R at that time
- **AND** the room-arrange journey (by weekday or venue type) can surface that case without re-seeding data

### Requirement: Closed-loop oral demo paths remain lean-compatible

The closed-loop conflict scripts SHALL remain compatible with the lean demo inventory caps (few batches, thin conflict overlay, no weekday-pad inflation). At least one oral path each for student, teacher, and venue SHALL remain demonstrable after seed load.

#### Scenario: Three conflict kinds stay demoable after load

- **WHEN** the reviewer hard-reloads the lean closed-loop seed
- **THEN** they can complete one student-conflict path, one teacher-conflict path, and one venue-conflict or occupancy path using only seeded data
- **AND** each path satisfies the corresponding peer-traceability requirements above
