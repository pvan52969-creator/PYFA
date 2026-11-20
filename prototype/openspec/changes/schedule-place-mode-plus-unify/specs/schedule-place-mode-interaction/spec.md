# Spec Delta

## Purpose

Defines the unified place-mode interaction for schedule time and room detail: left course card selects what to place, the timetable shows a plus affordance on eligible cells (including occupied ones), and place mode is mutually exclusive with in-grid slot selection.

## ADDED Requirements

### Requirement: Left course card enters place mode

Selecting a course unit from the left course list SHALL enter place mode for the current schedule phase (time or room). Place mode means the right-hand timetable is the placement target for that course unit. Selecting a different left card SHALL switch the active place target to that card. Clicking the same active left card again MAY clear place mode (toggle off).

#### Scenario: Select left card for time placement

- **WHEN** the user is on schedule time detail and clicks a left course card
- **THEN** that card becomes the active place target
- **AND** the timetable enters place mode for that course unit

#### Scenario: Select left card for room placement

- **WHEN** the user is on schedule room detail and clicks a left course card
- **THEN** that card becomes the active place target
- **AND** the room timetable enters place mode for that course unit

### Requirement: Place mode and in-grid selection are mutually exclusive

The system SHALL NOT keep left-card place mode and in-grid slot/card selection active at the same time. Entering place mode from the left list SHALL clear in-grid slot selection (time phase). Entering in-grid slot selection SHALL exit left-card place mode (time phase). Room phase SHALL follow the same mutual-exclusion principle: the user cannot simultaneously treat the UI as “placing from left card” and “editing selected slots” without an explicit mode switch.

#### Scenario: Selecting a slot exits place mode on time detail

- **WHEN** place mode is active from a left course card on time detail
- **AND** the user selects an already-scheduled slot in the grid for edit/multi-select
- **THEN** left-card place mode ends
- **AND** the grid shows slot-selection affordances instead of place-mode plus

#### Scenario: Selecting left card clears slot selection on time detail

- **WHEN** one or more scheduled slots are selected on time detail
- **AND** the user clicks a left course card to place
- **THEN** slot selection is cleared
- **AND** place mode becomes active for that course

### Requirement: Hover shows plus on placeable cells including occupied ones

While place mode is active, hovering an eligible placement cell SHALL show a visible “+” affordance. Empty eligible cells SHALL show “+” centered (or equivalent clear empty-cell placement cue). Occupied eligible cells (including cells already filled by another course’s card, conflict-colored cells, and the active course’s own occupied cells) SHALL show “+” to the **right of the card content** (card-right gutter), not only on empty cells. On joint object grids, “+” SHALL appear only on the active object row; inactive object rows MUST NOT show “+” (including occupied shared-teaching fused cells mirrored on peer batch rows).

#### Scenario: Occupied other-course cell shows plus on time detail

- **WHEN** place mode is active for course A on time detail
- **AND** the user hovers a cell occupied by course B (optionally conflict-colored)
- **THEN** a “+” appears at the right of the occupied card area
- **AND** clicking the cell attempts to place course A and surfaces conflicts if any

#### Scenario: Empty eligible cell shows plus

- **WHEN** place mode is active
- **AND** the user hovers an empty eligible cell
- **THEN** a “+” appears indicating the cell can receive placement

#### Scenario: Joint inactive object row never shows plus

- **WHEN** the user has selected or is placing against object row MEC-2024/09 on joint schedule
- **AND** the user hovers the mirrored CST201/CST202 fused cell on inactive row MBT-2024/09
- **THEN** no “+” appears on the inactive row cell
- **AND** “+” remains available only on the active MEC object row’s eligible cells

### Requirement: Clicking occupied placeable cell places with conflict feedback

In place mode, clicking an occupied eligible cell SHALL attempt placement of the active left-card course into that cell. The system SHALL run full placement conflict detection for the intended weeks and SHALL open the conflict modal when conflicts exist. The system MUST NOT silently switch the left selection to the occupying course merely because the cell already has another course’s card. Hard conflicts that product rules forbid forcing (for example student hard conflicts) SHALL still block force-place while still explaining the conflict.

#### Scenario: Place into occupied conflict cell keeps left course

- **WHEN** place mode is active for CST201
- **AND** the user clicks a cell occupied by MEC901 that conflicts for CST201
- **THEN** the conflict modal describes conflicts for placing CST201
- **AND** CST201 remains the active left place target (unless the user explicitly cancels/clears)

#### Scenario: Hours-full cell still reports room resource conflicts

- **WHEN** place mode is active and planned hours are already full
- **AND** the hovered/clicked cell also has venue resource sellout or over-capacity
- **THEN** the conflict modal includes both hours-over and room-resource sellout/over messaging when both apply

### Requirement: Room place-mode plus aligns with time semantics

On room detail, while placing from a left course card, eligible cells (empty in-course-time cells, pending/locked forceable cells, and other cells product marks placeable) SHALL show the same class of “+” affordance: empty → clear placement cue; occupied/pending/locked placeable → plus at the card-right gutter. Clicking SHALL attempt room assignment / force path and show conflicts rather than only selecting the occupying hold without place feedback when the user is in left-card place mode.

#### Scenario: Room pending cell shows right plus in place mode

- **WHEN** place mode is active on room detail
- **AND** the user hovers a pending/locked cell that is eligible for forced placement
- **THEN** a “+” appears at the right of the card/hold content
