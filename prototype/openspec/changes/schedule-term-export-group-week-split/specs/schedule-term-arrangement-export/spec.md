# Spec Delta

## MODIFIED Requirements

### Requirement: Course-section summary export

The system SHALL allow export of a **课程班** file for the selected term. Each data row SHALL represent one **上课组** within a course section（课程班下的组；无显式分组时该课程班视为一组）. The file SHALL include at least these columns (Chinese headers): 课程班ID, 学期, 课程代码, 课程名称, 学分, 课程班类型, 课程班名称, 起止周, 课程班容量, 修课人数, 状态, 主讲教师, 任课教师, 上课时间地点. Columns present in the legacy template but unavailable in the prototype MAY be empty.

The「课程班名称」SHALL identify the group（例如含 Group / Tutorial / Lecture 等组标识，与原系统总账口径一致）.

The「上课时间地点」column SHALL be built by inspecting that group's scheduled weeks, then folding identical arrangements and splitting on differences:

- Compare arrangements by weekday + clock/period range, room, and teacher for that group.
- If all arranged weeks share one arrangement, emit a single summary line for that group.
- If any week differs in time, room, or teacher, emit multiple summary lines in the same cell (one line per distinct arrangement), with week labels covering only the weeks that share that arrangement.
- Continuous weeks MAY use a hyphen range; discontinuous weeks within the same arrangement SHALL use `&`（例如 `Week 1-12&14`）.
- Each summary line SHALL follow the legacy-style pattern:  
  `Tuesday 1.00pm-4.00pm(A2#111)(Week 1-12&14)(Teacher Name)`  
  Room and week parentheses are required when known; the trailing teacher parentheses SHALL be included when that line's teacher can be resolved.

#### Scenario: Download course-section summary

- **WHEN** the user has selected a term that has arranged sections
- **AND** the user chooses to export「课程班」
- **THEN** a downloadable tabular file is produced with one row per上课组 in that term（无显式分组时每课程班一行）
- **AND** the「上课时间地点」column reflects that group's scheduled meetings after week fold/split

#### Scenario: Download course-section summary by group

- **WHEN** the user has selected a term that has arranged sections with multiple groups
- **AND** the user chooses to export「课程班」
- **THEN** a downloadable tabular file is produced with one row per group in that term
- **AND** each row's「课程班名称」identifies that group
- **AND**「上课时间地点」reflects that group's week arrangements only

#### Scenario: Uniform weeks stay one time-place line

- **WHEN** a group's arranged weeks all share the same weekday, time, room, and teacher
- **AND** the user exports「课程班」
- **THEN** that group's row contains a single「上课时间地点」line covering those weeks（例如 `Week 1-14`）

#### Scenario: Divergent week splits time-place lines

- **WHEN** a group has mostly uniform arrangements but at least one week differs in time, room, or teacher（例如仅第 13 周不同）
- **AND** the user exports「课程班」
- **THEN** that group's row keeps a single table row
- **AND**「上课时间地点」contains at least two lines
- **AND** the majority pattern's week label uses discontinuous compact form when needed（例如 `Week 1-12&14`）
- **AND** the divergent week(s) appear on a separate line with their own time/room/teacher

#### Scenario: Empty term for course-section export

- **WHEN** the user has selected a term with no exportable course-section groups
- **AND** the user chooses to export「课程班」
- **THEN** the system informs the user that there is no data
- **AND** no misleading file of only headers is required (either no download or an explicit empty-state message is acceptable if consistent with other schedule exports)

## ADDED Requirements

### Requirement: Meeting-place rows remain group-aware

The **课程班上课地点** export SHALL continue to emit one row per scheduled meeting, and when a meeting belongs to a specific group the「课程班名称」SHALL use the same group-identifying label as the课程班 summary export for that group. Weekday, time, weeks, room, and teacher fields SHALL reflect that meeting; this change SHALL NOT collapse meetings across groups.

#### Scenario: Meeting export labels match group summary

- **WHEN** the user exports「课程班上课地点」for a term that includes multi-group sections
- **THEN** each meeting row's「课程班名称」matches the group label used on the corresponding课程班 summary row
- **AND** meetings for different groups are not merged into one row
