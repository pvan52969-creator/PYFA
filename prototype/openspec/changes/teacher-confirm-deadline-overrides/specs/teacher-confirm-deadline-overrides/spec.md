## Purpose

Supports school-default teaching confirmation deadlines with optional college, programme, and per-teacher overrides, and resolves one effective deadline per teacher for confirmation letters and admin views.

## ADDED Requirements

### Requirement: School-default confirmation deadline remains the baseline

The system SHALL continue to maintain one school-wide teaching confirmation deadline date per academic term in Offering Time Settings. When no override applies to a teacher, the effective deadline SHALL be that school-wide date.

#### Scenario: No overrides configured
- **WHEN** a term has a school-wide confirmation deadline and the teacher has no college, programme, or personal override for that term
- **THEN** the teacher confirmation letter Notes SHALL show the school-wide deadline date

### Requirement: College-level deadline override

The system SHALL allow administrators to set an optional confirmation deadline override per offering unit (college / department) for a term. A college override SHALL apply to teachers whose home unit matches that unit. The override date MUST be on or after the school-wide deadline for that term.

#### Scenario: College later than school default
- **WHEN** the school-wide deadline is 15 January 2026 and unit SCBE is overridden to 22 January 2026
- **THEN** a teacher whose home unit is SCBE SHALL see 22 January 2026 in Notes
- **AND** a teacher whose home unit has no override SHALL still see 15 January 2026

#### Scenario: Reject earlier-than-school college override
- **WHEN** an administrator attempts to save a college override earlier than the school-wide deadline
- **THEN** the system SHALL reject the save and keep the previous value

### Requirement: Personal deadline extension as exception

The system SHALL allow an authorized admin to set a personal confirmation deadline for specific teachers and a term. A personal override SHALL apply to that teacher's entire confirmation package for the term (all courses / tasks under that teacher×term letter), not to a single course row. A personal override SHALL take precedence over college and school defaults. The personal date MUST be on or after the school-wide deadline for that term. Reason text is not required.

#### Scenario: Personal override wins over college
- **WHEN** school default is D0, the teacher's college override is D1, and a personal override D2 exists (D2 ≥ D0)
- **THEN** the effective deadline for that teacher SHALL be D2
- **AND** admin views SHALL indicate the source as personal

#### Scenario: Personal date covers all tasks of the teacher in the term
- **WHEN** a personal override is set for teacher T in term S
- **THEN** every confirmation task belonging to teacher T in term S SHALL use D2 as the communicated deadline
- **AND** the teacher confirmation letter Notes for term S SHALL show a single date D2

#### Scenario: Batch set from teacher list modal
- **WHEN** an admin opens personal deferral and selects one or more teachers in scope, then sets a deadline date
- **THEN** each selected teacher SHALL receive that personal deadline for the term
- **AND** the modal list SHALL refresh to show the updated effective deadlines

### Requirement: Effective deadline resolution order

For a given teacher and term, the system SHALL resolve the effective deadline in this order of precedence: personal override, then programme override (when configured), then college override, then school-wide default. Exactly one effective date SHALL be used for that teacher's confirmation letter Notes for the term.

#### Scenario: Precedence chain
- **WHEN** multiple override levels exist for the same teacher and term
- **THEN** the highest-precedence configured level SHALL determine the Notes date
- **AND** lower levels SHALL NOT be shown as the Notes date

### Requirement: Admin visibility of effective deadline and source

The teaching confirmation management experience SHALL show each teacher's effective confirmation deadline for the term and the source level (school / college / programme / personal) so staff can chase or proxy-confirm with correct expectations.

#### Scenario: Admin sees source tag
- **WHEN** an admin opens confirmation management for a term
- **THEN** each teacher row or detail SHALL expose the effective deadline and its source level

### Requirement: Confirmation actions remain allowed after deadline in this phase

Until a separate hard-lock decision is made, the system SHALL NOT block teacher confirm, disagree, or admin proxy-confirm solely because the effective deadline date has passed. The deadline remains a communicated and tracked date.

#### Scenario: Past deadline still confirmable
- **WHEN** today's date is after the teacher's effective confirmation deadline and the confirmation is still pending
- **THEN** the teacher or admin SHALL still be able to complete confirm / disagree / proxy-confirm actions

### Requirement: Programme-level override is optional and deferred-ready

The system MAY support a programme-level override between college and personal in precedence. If programme overrides are not enabled in the first delivery, the resolution order SHALL skip that level without changing school / college / personal behavior.

#### Scenario: No programme layer configured
- **WHEN** programme overrides are not configured for a term
- **THEN** resolution SHALL use personal → college → school only
