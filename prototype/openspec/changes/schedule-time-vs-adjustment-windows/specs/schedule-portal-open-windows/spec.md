# Spec Delta

## Purpose

Defines that teacher and student portal open windows are independent of the schedule-module「时间设置」cascade, and that adjustment apply availability is gated by adjustment permission plus teacher windows—not by scheduling time constraints.

## ADDED Requirements

### Requirement: Module time setting only gates scheduling time constraints

The system SHALL treat the schedule-module「时间设置」（或更名后的「排课时间约束」）as enabling or disabling **scheduling-side** time rules only (term window, blackout/occupied markers, and related schedule-time enforcement). The system SHALL NOT use this module permission as the sole or primary gate for teacher adjustment apply, stop, makeup, or add-course flows.

#### Scenario: Adjustment open while time setting is forced off

- **WHEN** an administrator opens「调课管理」for a schedule module (which forces「时间设置」and「排课权限」off under the existing interlocking rules)
- **THEN** teacher adjustment apply availability is still evaluated from「调课管理」plus「教师使用开放时间」, not from「时间设置」being on

#### Scenario: Time setting off does not blank teacher windows

- **WHEN**「时间设置」is disabled for a schedule module
- **THEN** configured「教师使用开放时间」and「学生查看开放时间」remain editable in排课时间设置 and remain usable for their own gates

### Requirement: Teacher portal window gates adjustment apply

The system SHALL allow a teacher to start调/停/补/加课申请 only when both of the following hold for the relevant schedule module and term context: (1)「调课管理」is open for that module, and (2) the current time falls within「教师使用开放时间」（or the window is explicitly configured as always-open for that term). The system SHALL NOT require「时间设置」to be enabled for those apply actions.

#### Scenario: Within teacher window and adjustment open

- **WHEN**「调课管理」is open and the current time is inside「教师使用开放时间」
- **THEN** the teacher can enter调/停/补/加课申请 flows for that module's courses

#### Scenario: Outside teacher window

- **WHEN**「调课管理」is open but the current time is outside「教师使用开放时间」
- **THEN** the teacher cannot submit new调/停/补/加课申请 and receives a clear closed-window indication

#### Scenario: Adjustment module closed

- **WHEN**「调课管理」is closed for the schedule module
- **THEN** the teacher cannot start调/停/补/加课申请 regardless of「教师使用开放时间」

### Requirement: Student view window is independent of adjustment

The system SHALL use「学生查看开放时间」only to gate student timetable viewing. The system SHALL NOT use the student window to enable or disable teacher adjustment apply, and SHALL NOT use「调课管理」alone to open student timetable viewing.

#### Scenario: Student view closed while adjustment open

- **WHEN**「调课管理」is open and「学生查看开放时间」is outside the current time
- **THEN** students cannot view the timetable under that student-view gate, while teacher adjustment apply still follows the teacher-window rules above

### Requirement: Module table labels clarify scheduling vs portal windows

The schedule-module setting table SHALL label the former ambiguous「时间设置」column so operators understand it as **排课时间约束** (or equivalent wording), and SHALL keep tip or helper text that distinguishes it from「教师使用开放时间」and「学生查看开放时间」on the排课时间设置 page.

#### Scenario: Operator reads module setting headers

- **WHEN** an administrator opens排课模块设置
- **THEN** the time-related module column and tip text describe scheduling constraints, not portal adjustment/view windows
