# Spec Delta

## Purpose

Defines manual schedule-time classroom resource checking (border-only warning states, capacity table, enrollment banding, single-room lock, force place) and one-click import on manual time/room detail pages, including room-side Back-to-Back nearest-room pairing—without changing offering setup or auto-schedule job pages.

## ADDED Requirements

### Requirement: Time-side classroom resource check borders are exclusive
On the manual schedule-time detail page, classroom resource pressure for the active pending task SHALL be shown only as cell borders (no fill dedicated to resource state). Resource states MUST be: not-overbooked (default empty-cell border), sellout (red dashed border), overbooked (red solid border). Teacher, student, soft/non-schedule, and other non-resource conflicts MUST keep fill colors only and MUST NOT use the resource border styling.

#### Scenario: Resource sellout uses dashed red border without resource fill
- **WHEN** the active pending task has a venue type selected (including「不选择教室」) and a grid cell's applicable classroom pool for that type and enrollment band has zero remaining rooms before placement
- **THEN** the cell shows a red dashed border for sellout and does not apply a resource-state background fill

#### Scenario: Non-resource conflicts lose border styling
- **WHEN** a time-grid cell is painted as teacher, student, or soft conflict
- **THEN** the cell retains the conflict fill color and does not use inset/outline border styling reserved for resource states

#### Scenario: Overbook after force or excess demand uses solid red border
- **WHEN** placing into a cell would make available count negative for the applicable bands, or available is already negative
- **THEN** the cell shows a red solid border for overbooked

### Requirement: Resource check refreshes from pending-task selection
The system SHALL recompute and refresh the right-hand timetable resource borders when the user selects a left-side pending task card, using that task's venue type(s) and enrollment (joint co-teaching uses combined headcount as one seat demand). Selecting venue type ordinary / specialized / computer /「不选择教室」MUST participate in the same check pipeline.

#### Scenario: Click pending card triggers resource overlay
- **WHEN** the user clicks a pending task card on the schedule-time detail left rail
- **THEN** the right timetable updates resource border states for that task's type and enrollment without requiring a separate manual「检查」action

### Requirement: Context menu shows capacity band table for selected slot
On schedule-time detail, the user MUST be able to open a capacity usage view for the selected time slot that lists applicable capacity bands (interval label, seat range, total rooms, available count). Available counts of zero and overbooked (negative) totals MUST be marked in red.

#### Scenario: Right-click capacity table for a period
- **WHEN** the user opens the capacity view for a selected weekday/period while a pending task is active
- **THEN** the system shows applicable bands with total and available counts, and paints zero/negative available numbers in red

### Requirement: Enrollment banding prefers extremes then upward middles
When allocating classroom capacity demand for a slot, the system SHALL place largest and smallest enrollment tasks first within the applicable type pool; after those extremes are seated, middle-enrollment tasks SHALL occupy upward bands so small classes do not consume large rooms first. Co-taught offerings that share one delivery MUST count as a single demand equal to the sum of enrollments.

#### Scenario: Middles wait until extremes are seated
- **WHEN** multiple pending demands compete for the same type and period and both a largest-band and a smallest-band demand exist
- **THEN** the system seats the largest and smallest before assigning middle enrollments into higher bands

### Requirement: Force place from placement dialog
When a placement is blocked by classroom capacity / venue pressure (sellout or overbook), the placement dialog SHALL offer「强行排入」for that same venue/slot path. Choosing it MUST allow the placement to proceed despite capacity overbook, leaving subsequent coordination to operators. The dialog MUST NOT offer「强行排入」when student time conflicts are present (student schedule conflicts cannot be force-placed).

#### Scenario: Force place despite sellout
- **WHEN** the user attempts to place into a sellout or overbooked cell without student time conflict and confirms「强行排入」in the dialog
- **THEN** the slot is written and the cell reflects overbooked/sellout resource border state as applicable after placement

#### Scenario: Student conflict blocks force place
- **WHEN** the placement dialog shows a student time conflict
- **THEN**「强行排入」is hidden or disabled and the user must change period or resolve the peer course

### Requirement: Single locked room from multi preference
For specialized and computer venue types, preferred rooms MAY be multi-select as reference only; the locked room field MUST accept at most one room. The lock MAY be one preferred room or a similar non-preferred room; if there is no preference list, any eligible room MAY be locked. Ordinary classrooms MUST also allow locking a concrete room.

#### Scenario: Multi preference locks only one room
- **WHEN** the user has multiple preferred rooms for a specialized or computer venue setting and saves a lock
- **THEN** exactly one `lockedRoom` value is stored

#### Scenario: Ordinary classroom can lock a room
- **WHEN** the venue type is ordinary classroom and the user selects a concrete room to lock
- **THEN** the system stores that room as the locked room

### Requirement: One-click import only covers current pending tasks
Manual schedule-time and schedule-room detail pages SHALL expose a「一键导入」action that imports only the currently pending tasks in scope (not all tasks in the term). Import MUST consider venue-type classroom resource pressure. This action is distinct from the sidebar auto-schedule time/room job pages and MUST NOT modify those pages' behavior.

#### Scenario: Import skips already placed tasks
- **WHEN** the user runs「一键导入」on the manual time detail with a mix of pending and already-placed tasks
- **THEN** only pending tasks receive imported placements

### Requirement: Room-side one-click import applies Back-to-Back nearest pairing
On manual schedule-room detail, one-click import SHALL apply Back-to-Back rules when consecutive periods of the same course require different venue types or preferences and thus two rooms. Distance priority MUST be: same room, then adjacent room, then same floor, then same building, then other. Teacher Back-to-Back proximity MUST take priority over student Back-to-Back.

#### Scenario: Heterogeneous linked periods pick nearest pair with teacher priority
- **WHEN** two consecutive periods of the same course need different room types/preferences and one-click import assigns rooms
- **THEN** the system assigns two rooms following the distance ladder and optimizes teacher walking distance before student walking distance
