## 1. Data & resolution

- [x] 1.1 Add term-scoped store for college overrides and personal extensions (absolute dates + reason for personal); verify demo seed has ≥1 college override later than school default
- [x] 1.2 Implement `resolveTeacherConfirmDeadline(termCode, teacher)` returning `{ date, source }` with precedence personal → college → school (skip programme in v1); verify unit tests or console checks for no-override / college / personal cases
- [x] 1.3 Enforce override date ≥ school-wide deadline on save; verify earlier date is rejected with alert

## 2. Offering time settings UI

- [x] 2.1 Add row action / entry「授课确认截止（按单位）」separate from「单位开课时间」; verify it opens an independent drawer
- [x] 2.2 Implement college override list CRUD (add unit, set date, delete → fall back); verify list refresh and school default shown as reference
- [x] 2.3 Keep school-wide deadline edit on existing add/edit term modal unchanged; verify Notes still work when no overrides

## 3. Teacher letter & admin visibility

- [x] 3.1 Replace Notes deadline formatting to use resolved effective date per current teacher; verify SCBE-overridden teacher shows later date than school default teacher in the same term
- [x] 3.2 Show effective deadline + source tag on teaching confirmation management (row or detail); verify personal source label when extension exists
- [x] 3.3 Add admin「个人延期」for teacher×term (date + required reason), applying to that teacher's whole term package—not a single course task; verify all tasks/letter for that teacher share the same personal date and it beats college override

## 4. Guardrails & docs handoff

- [x] 4.1 Confirm past effective deadline does not disable confirm / disagree / proxy-confirm; verify actions still enabled after deadline in prototype
- [x] 4.2 Leave programme-level override out of v1 UI; verify resolution skips missing programme level without errors
- [x] 4.3 Note PRD升版待办（开课时间设置 / 授课确认管理 / 教师端）in change folder or comment; verify tasks.md marks this as doc follow-up only (no code)
