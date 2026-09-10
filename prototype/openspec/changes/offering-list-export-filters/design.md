## Context

See proposal.md for motivation. Course Management list pages already share `course-major-query-grid` / `course-time-query-field` and per-page `getFiltered*` functions. Teaching Load already downloads CSV via `downloadTeacherTeachingLoadCsv`. 开课计划 once had an export button (commented). Course code / name already use `matchesSeparateCourseCodeName` (contains). 开课安排样式二 hid 上课专业 filters in HTML comments.

## Goals / Non-Goals

**Goals:**

- Shared expand/collapse markup, number-range matcher, UTF-8 CSV helper
- Apply to every visible Course Management page-level list
- 开课计划 as the field-mapping template

**Non-Goals:**

- Excel/xls binary export
- Filtering action/entry columns
- Changing grouping workbench inner tables
- PRD version bumps

## Decisions

### 1. Query layout

Reuse existing grid. Wrap extra fields in `.course-query-more` (`hidden` by default). Toggle lives in `.course-time-query-actions` as「展开筛选」/「收起」. Primary row keeps each page’s current high-frequency fields (about 5–6). Collapsing MUST NOT clear values.

**Alternative considered:** second-row accordion card. Rejected: more layout churn; current grid already wraps.

### 2. CSV helper

Extract `downloadUtf8Csv(headers, rows, fileStem)` from Teaching Load. Teaching Load `exportTeacherTeachingLoad` calls it. Filename `{page}_{term}_{yyyy-mm-dd}.csv`. Empty result → `alert('暂无符合条件的数据可导出')`.

Export uses the same filtered array as the table (before `paginateListItems`).

### 3. Filter types

- Enums → `<select>` exact
- Text → `<input>` contains via shared `matchesFuzzyText`
- Headcount → two number inputs; `matchesNumberRange(n, min, max)`
- Credits / hours / week range → select if few distinct values, else fuzzy text. No extra numeric ranges beyond headcount (plan default)

### 4. 开课计划 mapping

- Label 专业 → 上课专业 (`course-major-filter-prog`)
- 课号 / 课名 labels → 课程代码 / 课程班名称 (same IDs)
- More: owner, planKind, category, enrollmentType, programmeBatch, isNewIntake, credits, totalHours, weekRange, offeringUnit, presetStudents min/max
- Filter function: extend `getFilteredMajorOfferingPlanRows`

### 5. Headcount fields by page

- 开课计划: `getMajorOfferingPlanRowPresetCount`
- 开课名单: `getMajorOfferingRosterStudentCount`
- 课程班 / 选修名单: existing roster/capacity columns, same range helper

### 6. 开课安排 style2

Restore 上课专业 (and keep 上课学院 if needed for cascade) in the more section. Add export beside query/reset.

### 7. Teacher replace log table

Page has two tables. Main replace list gets query+export. Log table: add a compact export on its toolbar (no extra filter bar unless headers warrant it).

## Risks / Trade-offs

- [Too many filters per page] → default collapse; primary stays short
- [CSV vs Excel expectation] → prototype matches Teaching Load; document in spec
- [Hidden HTML table headers vs JS-rendered headers] → always follow the runtime visible header
- [Elective unsigned PRD] → prototype still gets the shared UX; no formal PRD bump

## Migration Plan

Ship in prototype only. Teaching Load export path is a compatible extract; rollback is reverting helper call sites.
