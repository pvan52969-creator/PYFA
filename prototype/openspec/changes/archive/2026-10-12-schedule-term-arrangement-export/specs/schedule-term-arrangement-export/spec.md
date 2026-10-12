# Spec Delta

## Purpose

Provides a semester-scoped export of arranged course sections and their meeting-place rows so academic staff can download term-wide arrangement ledgers similar to the legacy system exports.

## ADDED Requirements

### Requirement: Dedicated semester arrangement export entry

The system SHALL expose a navigation item「学期安排导出」under the「课表查询」sidebar group that opens a dedicated page for term-wide arrangement export. This entry SHALL NOT replace or alter existing timetable-query tab export actions.

#### Scenario: Open export page from sidebar

- **WHEN** the user opens「学期安排导出」from the schedule module sidebar
- **THEN** the dedicated export page is shown
- **AND** existing「课表查询」and「课表密度查询」entries remain available and unchanged

### Requirement: Term selection before export

The export page SHALL require an academic term selection (学年学期). Export actions SHALL use the selected term as the data scope.

#### Scenario: Export without term blocked

- **WHEN** no academic term is selected
- **AND** the user attempts to export
- **THEN** the system does not download a file
- **AND** the user is informed that a term must be selected

### Requirement: Course-section summary export

The system SHALL allow export of a **课程班** file for the selected term. Each data row SHALL represent one course section (课程班). The file SHALL include at least these columns (Chinese headers): 课程班ID, 学期, 课程代码, 课程名称, 学分, 课程班类型, 课程班名称, 起止周, 课程班容量, 修课人数, 状态, 主讲教师, 任课教师, 上课时间地点. Columns present in the legacy template but unavailable in the prototype MAY be empty.

#### Scenario: Download course-section summary

- **WHEN** the user has selected a term that has arranged sections
- **AND** the user chooses to export「课程班」
- **THEN** a downloadable tabular file is produced with one row per course section in that term
- **AND** the「上课时间地点」column aggregates that section's scheduled meetings into a readable summary

#### Scenario: Empty term for course-section export

- **WHEN** the user has selected a term with no exportable course sections
- **AND** the user chooses to export「课程班」
- **THEN** the system informs the user that there is no data
- **AND** no misleading file of only headers is required (either no download or an explicit empty-state message is acceptable if consistent with other schedule exports)

### Requirement: Meeting-place detail export

The system SHALL allow export of a **课程班上课地点** file for the selected term. Each data row SHALL represent one scheduled meeting (节次/地点). The file SHALL include at least these columns (Chinese headers): ID, 学期, 课程代码, 课程名称, 课程班名称, 课程班容量, 课程班人数, 状态, 任课教师, 星期, 时间, 周次类型, 起止周, 教室类型, 备注, 教室名称. Additional legacy columns (教学楼, 教室号, 座位数, 教室状态, 教师类别, 教师职称, 机房硬件/软件需求, 负责人, 学分, 课程管理单位, 课程班类型) MAY be included when data exists, otherwise empty.

#### Scenario: Download meeting-place details

- **WHEN** the user has selected a term that has scheduled meetings
- **AND** the user chooses to export「课程班上课地点」
- **THEN** a downloadable tabular file is produced with one row per scheduled meeting in that term
- **AND** weekday/time/weeks/room fields reflect that meeting

### Requirement: Existing timetable exports unchanged

Exports on the timetable query tabs (入学批次 / 教师 / 学生 / 课程 / 教室 / 时间课表) and graphic timetable export placeholders SHALL keep their current behavior.

#### Scenario: Timetable query export still works as before

- **WHEN** the user exports from an existing timetable query tab after this change
- **THEN** the previous column set and scoping behavior for that tab remain available
