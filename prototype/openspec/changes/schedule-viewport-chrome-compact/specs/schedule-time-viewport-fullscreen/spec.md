# Spec Delta

## Purpose

Defines timetable-area fullscreen for schedule-time detail (by intake batch, teacher, or course) and joint scheduling: one control hides the course list and top tool chrome so only the grid remains, with a clear way back.

## ADDED Requirements

### Requirement: Time detail exposes timetable fullscreen entry
On the schedule-time detail page (shared shell for arrange-by-intake-batch, arrange-by-teacher, and arrange-by-course), the system SHALL provide a user-visible control to enter timetable-area fullscreen.

#### Scenario: Enter fullscreen from time detail
- **WHEN** the user activates the fullscreen entry control on schedule-time detail
- **THEN** the page enters timetable-area fullscreen for that time-detail session

### Requirement: Time fullscreen hides left list and top chrome
While schedule-time detail is in timetable-area fullscreen, the system SHALL completely hide the left course list and the top tool chrome (including conflict legend, scope switcher, card display options, week selector, and retake / room-preview tool rows when present). The timetable grid SHALL remain visible and occupy the freed space. The system SHALL NOT show a residual “currently scheduling” summary strip in place of the hidden chrome.

#### Scenario: Only grid remains on time fullscreen
- **WHEN** schedule-time detail is in timetable-area fullscreen
- **THEN** the left course list is not visible
- **AND** the top tool chrome listed above is not visible
- **AND** the timetable grid remains visible

### Requirement: Time fullscreen provides exit control
While schedule-time detail is in timetable-area fullscreen, the system SHALL keep a visible exit (or expand) control. Activating it SHALL leave fullscreen and restore the left course list and top tool chrome to their pre-fullscreen visibility.

#### Scenario: Exit restores time chrome
- **WHEN** the user activates the exit control while schedule-time detail is in timetable-area fullscreen
- **THEN** the page leaves fullscreen
- **AND** the left course list and top tool chrome are visible again

### Requirement: Joint scheduling aligns with timetable fullscreen
On the joint scheduling page, the system SHALL provide timetable-area fullscreen that completely hides the left course list and the joint top filter/settings chrome, leaving the timetable grid and a visible exit control. Existing partial “collapse filters and settings” behavior MAY remain as a non-fullscreen compactness option, but MUST NOT leave the user without a path to full grid-only view or a path back from it.

#### Scenario: Enter and exit joint fullscreen
- **WHEN** the user enters timetable-area fullscreen on the joint scheduling page
- **THEN** the left course list and top filter/settings chrome are not visible
- **AND** the timetable grid remains visible with an exit control
- **WHEN** the user activates the exit control
- **THEN** the left course list and top filter/settings chrome are visible again

### Requirement: Time and joint fullscreen do not change scheduling rules
Entering or leaving timetable-area fullscreen on schedule-time detail or joint scheduling SHALL NOT change conflict detection rules, slot placement rules, context-menu item sets, or persisted schedule data by itself.

#### Scenario: Fullscreen toggle is view-only
- **WHEN** the user toggles timetable-area fullscreen on schedule-time detail or joint scheduling without performing a scheduling edit
- **THEN** scheduled slots and conflict outcomes remain unchanged
