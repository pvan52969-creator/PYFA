## ADDED Requirements

### Requirement: Auto shared-teaching mark without manual code

The system SHALL allow academic admin to mark two or more sections of **different course codes** in the same offering term as shared teaching **without** requiring the user to type a shared-teaching code. On confirm, the system MUST automatically assign a shared-teaching mark that links the selected sections.

#### Scenario: Confirm assigns mark automatically

- **WHEN** admin selects two or more eligible sections of different course codes that share at least one assigned teacher and confirms in the shared-teaching setup modal
- **THEN** each selected section receives the same system-generated shared-teaching mark
- **AND** the UI SHALL NOT require a manual「共同授课码」input to complete the action

#### Scenario: Reject same course code only

- **WHEN** the selected sections do not include at least two distinct course codes
- **THEN** the system SHALL NOT assign a shared-teaching mark and SHALL inform the user that different course codes are required

#### Scenario: Reject without common teacher

- **WHEN** the selected sections do not share at least one assigned teacher
- **THEN** the system SHALL NOT assign a shared-teaching mark

### Requirement: Setup modal shows existing shared-teaching courses

The shared-teaching setup modal SHALL let admin find courses by course code or course name and SHALL make already-marked shared-teaching courses visible in the list.

#### Scenario: Keyword search by code or name

- **WHEN** admin types a keyword in the shared-teaching setup search field
- **THEN** the table SHALL filter rows whose course code or course name contains the keyword (case-insensitive)

#### Scenario: Existing mark visible in list

- **WHEN** a section already has a shared-teaching mark
- **THEN** the setup modal list SHALL show that it is already in a shared-teaching set (mark and/or peer course summary)
- **AND** admin can distinguish unmarked courses from marked ones without opening another page

### Requirement: Clear shared-teaching mark

The system SHALL allow admin to clear the shared-teaching mark from selected sections so they are no longer treated as shared teaching together.

#### Scenario: Clear mark from selected courses

- **WHEN** admin confirms clearing shared teaching for selected marked sections
- **THEN** those sections SHALL no longer carry that shared-teaching mark
- **AND** scheduling conflict exemption based on that mark SHALL no longer apply (prototype behavior)
