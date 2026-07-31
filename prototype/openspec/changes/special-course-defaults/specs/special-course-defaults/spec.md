## ADDED Requirements

### Requirement: Special course settings entry under course setup

The course-management sidebar under **开课设置** SHALL provide a **特殊课程设置** navigation item that opens a dedicated maintenance page.

#### Scenario: Navigate from sidebar

- **WHEN** the user opens the 开课管理 sidebar and expands 开课设置
- **THEN** a **特殊课程设置** item is visible alongside existing setup items
- **AND** activating it shows the special course settings page

### Requirement: Manual add courses from course library

The special course settings page SHALL allow users to add courses into the maintenance list only by selecting them from the academic course library. Courses not added SHALL NOT appear in the list.

#### Scenario: Add selected library courses

- **WHEN** the user opens the add-course picker and confirms one or more library courses not already in the list
- **THEN** those courses are appended to the special course settings list
- **AND** each new row starts with default classroom requirements (all hour types: 普通教室, no preference) and empty default Support colleges

#### Scenario: Skip duplicates

- **WHEN** the user selects a course whose code is already in the list
- **THEN** the system SHALL NOT create a duplicate row for that course code

#### Scenario: Remove from list

- **WHEN** the user removes a course from the special course settings list
- **THEN** the course no longer appears in the list
- **AND** existing offering sections that already copied defaults are NOT automatically cleared

### Requirement: Maintain classroom defaults by hour type

For each course in the special course settings list, the system SHALL allow editing classroom attribute and reference-classroom preferences for the four hour types (理论、辅导、实践、其他), using the same semantics as the major offering edit drawer classroom section.

#### Scenario: Edit and save classroom defaults

- **WHEN** the user edits hour-type classroom attributes and/or reference preferences for a listed course and saves
- **THEN** the saved values become that course code’s classroom defaults
- **AND** the list shows a summary reflecting the non-default classroom settings (or an equivalent indication)

#### Scenario: Default values when unset

- **WHEN** a listed course has never had classroom defaults customized
- **THEN** each hour type defaults to 普通教室 with no reference preference

### Requirement: Maintain default Support colleges

For each course in the special course settings list, the system SHALL allow maintaining one or more default Support colleges (department codes) for that course code.

#### Scenario: Save Support college defaults

- **WHEN** the user selects Support college(s) for a listed course and saves
- **THEN** those colleges become the course code’s default Support units
- **AND** the list shows a Support summary for the row

#### Scenario: Empty Support means no default

- **WHEN** a listed course has no Support colleges configured
- **THEN** applying defaults to an offering SHALL NOT invent Support units for that course

### Requirement: Apply classroom defaults in major offering arrangement

When a major offering section uses a course code that has special course classroom defaults, the system SHALL initialize the section’s classroom fields from those defaults so that `#mos-edit-classroom-section` shows the configured values, without preventing per-section edits in that section.

#### Scenario: New section picks up classroom defaults

- **WHEN** a major offering section is created for a course code that has non-default classroom settings in special course settings
- **THEN** the section’s classroom hour requirements match those defaults
- **AND** opening the major offering edit drawer shows them in the classroom information section

#### Scenario: Classroom section remains editable

- **WHEN** the user opens the major offering edit drawer for a section
- **THEN** classroom attributes and reference preferences remain editable only in `#mos-edit-classroom-section` (as today)
- **AND** saving the drawer persists the section-level override without writing back to special course settings

#### Scenario: Do not overwrite non-default section classroom

- **WHEN** a section already has non-default classroom requirements
- **AND** the user later changes special course settings for the same course code
- **THEN** reopening the edit drawer SHALL NOT replace the section’s existing classroom values with the new course defaults

### Requirement: Apply Support college defaults in major offering arrangement

When a major offering section uses a course code that has default Support colleges and the section has no Support units yet, the system SHALL initialize `supportUnits` from those defaults. Existing Support units on the section SHALL NOT be overwritten by course defaults.

#### Scenario: Empty Support gets course defaults

- **WHEN** a section for a configured course code has empty `supportUnits`
- **AND** special course settings lists one or more Support colleges for that code
- **THEN** the section’s Support colleges are set to those defaults
- **AND** the user can still change them via the existing Support manage flow

#### Scenario: Existing Support not overwritten

- **WHEN** a section already has one or more Support units
- **THEN** applying course defaults SHALL leave those Support units unchanged

### Requirement: Shared lookup by course code

The system SHALL expose a single lookup of special course defaults by course code for reuse by major offering now and other offering types later.

#### Scenario: Lookup hit and miss

- **WHEN** code requests defaults for a course code present in the list
- **THEN** classroom requirements and Support units for that code are returned
- **WHEN** the course code is not in the list
- **THEN** the lookup indicates no special defaults (callers keep system classroom defaults and empty Support)
