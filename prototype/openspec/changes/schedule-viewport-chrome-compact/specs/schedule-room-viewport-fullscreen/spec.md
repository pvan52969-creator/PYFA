# Spec Delta

## Purpose

Defines an independent timetable-area fullscreen mode for the schedule-room detail page: hide the left course list and room-side top tool chrome so only the room timetable grid remains, without sharing the time-side fullscreen implementation.

## ADDED Requirements

### Requirement: Room detail exposes independent fullscreen entry
On the schedule-room detail page, the system SHALL provide a user-visible control to enter timetable-area fullscreen. This control and its behavior SHALL be owned by the room-detail surface and SHALL NOT require sharing DOM, state, or menu wiring with the schedule-time detail fullscreen implementation.

#### Scenario: Enter fullscreen from room detail
- **WHEN** the user activates the fullscreen entry control on schedule-room detail
- **THEN** the room detail page enters timetable-area fullscreen for that room-detail session

### Requirement: Room fullscreen hides left list and room top chrome
While schedule-room detail is in timetable-area fullscreen, the system SHALL completely hide the left course list and the room-side top tool chrome (including room conflict legend items when shown, view/display options, week selector, room filter panel, and lock/hold action bars when present). The room timetable grid SHALL remain visible and occupy the freed space. The system SHALL NOT show a residual “currently scheduling” summary strip in place of the hidden chrome.

#### Scenario: Only room grid remains on fullscreen
- **WHEN** schedule-room detail is in timetable-area fullscreen
- **THEN** the left course list is not visible
- **AND** the room-side top tool chrome listed above is not visible
- **AND** the room timetable grid remains visible

### Requirement: Room fullscreen provides exit control
While schedule-room detail is in timetable-area fullscreen, the system SHALL keep a visible exit (or expand) control. Activating it SHALL leave fullscreen and restore the left course list and room-side top tool chrome to their pre-fullscreen visibility.

#### Scenario: Exit restores room chrome
- **WHEN** the user activates the exit control while schedule-room detail is in timetable-area fullscreen
- **THEN** the page leaves fullscreen
- **AND** the left course list and room-side top tool chrome are visible again

### Requirement: Room fullscreen stays isolated from time-side surfaces
Implementing or using room timetable-area fullscreen SHALL NOT change schedule-time detail interactions, shared time-side context-menu item sets, or time-side `applyScheduleContextMenuVisibility` behavior. Room-side lock / hold / revoke and room-grid context menu behavior SHALL remain governed by the room surface.

#### Scenario: Time side unchanged when room fullscreen is used
- **WHEN** the user only uses timetable-area fullscreen on schedule-room detail
- **THEN** schedule-time detail chrome, menus, and interactions remain as before this room fullscreen usage

### Requirement: Room fullscreen does not change room assignment rules
Entering or leaving timetable-area fullscreen on schedule-room detail SHALL NOT by itself change room lock/hold state, room assignment results, or conflict detection outcomes.

#### Scenario: Room fullscreen toggle is view-only
- **WHEN** the user toggles timetable-area fullscreen on schedule-room detail without performing a room edit
- **THEN** room assignments and lock/hold states remain unchanged
