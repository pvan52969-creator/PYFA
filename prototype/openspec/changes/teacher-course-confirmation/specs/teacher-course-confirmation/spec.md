## ADDED Requirements

### Requirement: Teacher-dimension confirmation package

The system SHALL manage course confirmation by **teacher × offering term**: one confirmation package lists all assigned major-offering teaching rows for that teacher in the term, based on current faculty arrangements.

#### Scenario: Package reflects current assignments

- **WHEN** a teacher is assigned to one or more major offering sections in the current offering term
- **THEN** that teacher's confirmation package for the term includes one row per assigned course/section (or group teaching line as shown in the confirmation table)

#### Scenario: Unassigned teacher has no package rows

- **WHEN** a teacher has no major offering teaching assignments in the term
- **THEN** the system SHALL NOT require confirmation from that teacher for any section activation in that term

### Requirement: In-system confirmation content

The system SHALL present confirmation content **within the application** (not via email). Fields SHALL cover the same teaching-assignment information formerly communicated in the offline confirmation letter, including at least: Course Code, Course Name, Classification, Credits, Teaching Weeks, No. of Lecture Group, No. of Lab/Tutorial/Practical Group, Total Student No., Weekly Teaching Hours, Course Coordinator, Co-teaching Staff.

#### Scenario: Total Student No. uses capacity limit

- **WHEN** the confirmation view renders Total Student No. for a course row
- **THEN** the value SHALL be the section's **课程人数上限** (capacity limit), not planned headcount or current roster size

#### Scenario: Confirmation shows offering term

- **WHEN** a teacher or admin opens the confirmation content
- **THEN** the view SHALL show the offering term / academic session for the package

#### Scenario: No email dispatch

- **WHEN** admin issues a confirmation task to a teacher
- **THEN** the system SHALL NOT send email; the teacher SHALL access the task only through in-system pages

### Requirement: Admin can issue and re-issue confirmation tasks

The system SHALL allow academic admin to issue a confirmation task to a teacher in-system and to re-issue after arrangement changes or disagreement.

#### Scenario: First issue

- **WHEN** admin issues confirmation for a teacher in a term and the package has at least one course row
- **THEN** the package status becomes `pending` and the teacher (or admin on behalf) can act on the confirmation page

#### Scenario: Re-issue after disagreement or arrangement change

- **WHEN** admin re-issues confirmation to a teacher after viewing disagreement feedback and/or adjusting teaching arrangements
- **THEN** the package uses the latest arrangement snapshot, status becomes `pending`, prior confirmation is cleared for that round, and disagreement / proxy-confirmation history remains viewable to admin

### Requirement: Teacher can confirm or disagree with feedback

The system SHALL provide a teacher-facing confirmation page where the teacher can confirm the assignment content or disagree and submit feedback text.

#### Scenario: Confirm by teacher

- **WHEN** a teacher with status `pending` confirms the package in-system
- **THEN** the package status becomes `confirmed` with confirmation method `teacher`

#### Scenario: Disagree with required feedback

- **WHEN** a teacher chooses disagree
- **THEN** the system SHALL require non-empty feedback text before accepting, and status becomes `disagreed`

#### Scenario: Disagree feedback visible to admin

- **WHEN** a package is `disagreed`
- **THEN** admin SHALL be able to view the teacher's feedback on the admin confirmation views

### Requirement: Admin proxy confirmation with special marking

The system SHALL allow academic admin to confirm on behalf of a teacher when the teacher cannot operate the system (e.g. age or device limitations). Proxy confirmations MUST be specially marked and auditable.

#### Scenario: Admin proxy confirm

- **WHEN** admin confirms a `pending` package on behalf of a teacher
- **THEN** the package status becomes `confirmed` with confirmation method `admin-proxy`, and the UI SHALL display a distinct label such as「管理端代确认」

#### Scenario: Proxy confirmation records operator

- **WHEN** admin performs a proxy confirmation
- **THEN** the system SHALL record the admin operator identity and confirmation timestamp

#### Scenario: Proxy confirmation counts toward activation readiness

- **WHEN** a section's assigned teacher is confirmed via admin proxy on the current snapshot
- **THEN** that teacher SHALL count as confirmed for section teacher-confirmation completeness

#### Scenario: Distinguish proxy from teacher self-confirm in lists

- **WHEN** admin views teacher confirmation status in style2 progress or admin confirmation lists
- **THEN** the system SHALL distinguish teacher self-confirmation from admin-proxy confirmation

### Requirement: Disagreement closed loop

After disagreement, activation readiness for affected sections SHALL NOT be restored until admin adjusts arrangements as needed and the teacher (or admin on behalf) confirms a newly issued package.

#### Scenario: Disagreed blocks readiness

- **WHEN** any assigned teacher for a section is `disagreed` or `pending` (not yet confirmed) or has outdated confirmation after arrangement change
- **THEN** that section SHALL NOT be treated as teacher-confirmation-complete

#### Scenario: Confirm after re-issue restores path to activation

- **WHEN** admin has re-issued and the teacher confirms (or admin proxy-confirms) the new package, and all other assigned teachers for the section are confirmed on current snapshots
- **THEN** the section SHALL be treated as teacher-confirmation-complete

### Requirement: Activation gate on major offering task style2

For major offering task arrangement style2, the system SHALL allow「生效」only when selected sections pass existing arrangement completeness checks **and** are teacher-confirmation-complete.

#### Scenario: Block生效 when confirmation incomplete

- **WHEN** admin attempts「生效」on a section whose assigned teachers are not all `confirmed` on the current snapshot
- **THEN** the system SHALL prevent activation and indicate which teachers are pending or disagreed

#### Scenario: Allow生效 when all teachers confirmed

- **WHEN** a section has complete grouping/faculty/hours arrangement and all assigned teachers are confirmed on the current snapshot (including admin-proxy)
- **THEN** admin MAY activate（生效）the section via style2 batch actions

### Requirement: Admin entry points

The system SHALL provide admin entry points to the teacher confirmation management experience from the offering-grouping immersive page and from Teaching Load teacher name navigation.

#### Scenario: New view tab on offering grouping

- **WHEN** admin is on `#page-offering-grouping`
- **THEN** the view tabs SHALL include a tab for授课确认 alongside Course, Course List, and教师授课学时统计

#### Scenario: Jump from Teaching Load teacher name

- **WHEN** admin clicks a teacher name in the Teaching Load / teacher-term assign UI
- **THEN** the system SHALL navigate to the confirmation management view focused on that teacher

### Requirement: Confirmation progress visibility on style2 list

The major offering task style2 list SHALL expose teacher confirmation progress for each course task so admin can see readiness before生效.

#### Scenario: Progress display

- **WHEN** a style2 course row has assigned teachers
- **THEN** the list SHALL show confirmation progress (e.g. confirmed count / total assigned teachers) or an equivalent status indicator, including whether any confirmation was admin-proxy
