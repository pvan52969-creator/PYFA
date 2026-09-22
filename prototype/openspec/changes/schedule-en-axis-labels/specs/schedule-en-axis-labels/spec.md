## ADDED Requirements

### Requirement: Schedule axis field labels use English terms

Within the schedule management domain (`#sidebar-nav-schedule`, including adjustment pages), the system SHALL use these English labels for the corresponding field captions in tables, filters, forms, detail drawers, and CSV export headers:

- 周次 → Week
- 日期 → Date
- 星期 → Day
- 教室 → Venue

Compound venue captions in the same domain SHALL use: Venue Type, Original Venue, Target Venue, New Venue; bare「上课教室」SHALL use Venue.

The system MUST leave「节次」captions unchanged in this change.

#### Scenario: Makeup cancel table headers

- **WHEN** the user opens Pending Replacement 停课清单
- **THEN** column headers SHALL read Week, Date, Day, 节次, Venue respectively (节次 remains Chinese)

#### Scenario: Conflict query export headers

- **WHEN** the user exports a schedule time or room conflict list from the schedule module
- **THEN** CSV headers for week / date / weekday / room SHALL use Week / Date / Day / Venue, and the period column header SHALL remain 节次

### Requirement: Offering and programme modules stay unchanged

The system MUST NOT change 周次 / 日期 / 星期 / 教室 (or their venue compounds) labels on 开课 or 培养方案 module pages as part of this change.

#### Scenario: Major offering list untouched

- **WHEN** the user opens a 专业开课 or 培养方案 page that still shows Chinese captions such as 起止周 or 教室
- **THEN** those captions remain as before this change

### Requirement: Cell values and week-range semantics unchanged

The system SHALL NOT rewrite cell display values solely for this label change. The distinct field「起止周」SHALL remain「起止周」(not renamed to Week).

#### Scenario: Week number cell stays numeric

- **WHEN** a makeup cancel row shows teaching week
- **THEN** the cell MAY show a bare number (e.g. `1`) and the column header SHALL be Week

### Requirement: Joint weekday header stays blank

On joint schedule grids that previously removed the Chinese「星期」header text, the weekday header cell SHALL remain blank (SHALL NOT insert Day).

#### Scenario: Joint grid corner

- **WHEN** the user views 联合排课 or 联合排课演示 timetable thead
- **THEN** the weekday corner header has no visible Day/星期 text
