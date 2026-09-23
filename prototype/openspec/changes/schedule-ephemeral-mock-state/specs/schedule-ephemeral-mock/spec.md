## Purpose

Defines the lifecycle of Scheduling Management mock data: every full page load restores the current seed baseline, while in-tab mutations remain available until refresh so demo workflows can continue without lasting browser persistence.

## ADDED Requirements

### Requirement: Seed baseline is the only initial state
On every full document load of the prototype, all Scheduling Management menus SHALL present data that matches the current version’s in-code Mock/seed baseline (including demo rows, demo slots, and configuration defaults). User operations from a previous browser visit MUST NOT alter that baseline.

#### Scenario: Fresh load matches seed
- **WHEN** the user opens or fully reloads the Scheduling Management prototype
- **THEN** lists, grids, and demo fixtures under Scheduling Management match the current code seed state

#### Scenario: Prior visit mutations do not leak
- **WHEN** the user previously created or edited schedule/adjustment data and then fully reloads the page
- **THEN** those mutations are absent and only seed/demo data remains

### Requirement: In-session workflow continuity without refresh
Within a single document lifetime (no full reload), the system SHALL keep Scheduling Management mutations in memory so the user can continue multi-step flows (e.g. arrange time → arrange room → submit adjustment → approve).

#### Scenario: Continue after arrange without refresh
- **WHEN** the user arranges slots or submits an adjustment and navigates to another Scheduling Management menu without reloading
- **THEN** the later screen reflects the in-session mutations

### Requirement: No cross-reload persistence for schedule/adjustment ops
Scheduling Management MUST NOT restore user-driven schedule or adjustment changes from `localStorage`, `sessionStorage`, or equivalent browser storage after a full document load. Seeded demo fixtures MAY still be re-injected from code on load.

#### Scenario: Adjustment applications reset on reload
- **WHEN** the user creates a non-demo adjustment request and fully reloads the page
- **THEN** that request does not reappear; only code-seeded demo requests remain

#### Scenario: Demo arrange does not restore across document loads
- **WHEN** the user arranges demo course slots and then fully reloads, or opens Scheduling Management in a new document/tab
- **THEN** demo arrange results start from the seed baseline rather than the previous document’s storage

### Requirement: Scope is Scheduling Management menus only
This capability applies to all menus under the Scheduling Management sidebar (settings, time arrangement, room arrangement, queries, and adjustment management). It does not require changing persistence behavior of Curriculum or Course Offering modules that are outside that sidebar, except where shared in-memory stores are re-seeded as part of the Scheduling Management boot path.

#### Scenario: Adjustment submenu included
- **WHEN** the user uses Class Adjustment, approval, admin apply, holiday, or batch adjustment screens
- **THEN** the same ephemeral mock lifecycle applies as for schedule arrangement screens
