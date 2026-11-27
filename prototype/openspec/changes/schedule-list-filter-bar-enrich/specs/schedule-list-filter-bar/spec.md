# Spec Delta

## Purpose

Defines how schedule-module list pages (including Class Adjustment admin lists) that already expose a filter bar MUST present and apply important filter dimensions so staff can locate target rows without relying only on table scan.

## ADDED Requirements

### Requirement: Scope covers sidebar list pages with an existing filter bar

The system SHALL apply this capability to visible schedule-sidebar list pages that already show a filter/query bar. Pages without a filter bar, workflow diagrams, immersive schedule-detail chrome, and intentionally hidden nav entries SHALL NOT be required to gain a new filter bar under this change.

#### Scenario: Visible list with filter bar is in scope
- **WHEN** a user opens a visible sidebar page that already shows a filter bar above a list table
- **THEN** that page is subject to the filter completeness rules in this spec

#### Scenario: Page without filter bar stays out of scope
- **WHEN** a page has no list filter bar (for example module lock checkboxes or workflow diagram)
- **THEN** this capability does not require adding a filter bar

### Requirement: Filter dimensions align with list columns and retrieval habits

For each in-scope page, the filter bar SHALL include the important dimensions for that list type. Empty/「全部」MUST mean no constraint on that dimension. Filters MUST combine with AND semantics unless the page already documents otherwise.

Required dimension sets by page family:

1. **排课入口列表（按入学批次 / 按教师 / 按课程）**
   - Shared: 学年学期（只读展示当前排课学期若页上已如此）、排课状态
   - 按入学批次：学院、专业、入学批次；补 **课号/课程班名称**（模糊）
   - 按教师：教工号、教师姓名、所在单位；补 **教职工类型**
   - 按课程：Course Code、课程班名称、开课单位、课程类型；补 **任课教师工号/姓名**（模糊）

2. **排教室入口列表（按时间 / 按场地类型；隐藏的按课程排若保留页）**
   - 补 **学年学期**（与当前排课学期一致的只读或可选）、**课号/课程班名称**、**教师工号/姓名**；保留已有 Day/场地类型/排教室状态等

3. **冲突查询（课表冲突 / 场地冲突）**
   - Keep existing rich filters; 场地冲突 MUST also allow **学院 / 专业 / 入学批次** when those columns are shown in the result table

4. **自动排课 / 自动排教室任务列表**（侧栏若可见）
   - Keep 学年学期、学院、专业、入学批次、课程、教师；补 **排课/排教室状态**

5. **课表查询 / 课表密度查询**
   - Keep object-type tabs’ existing filters; 密度查询若仅有结果区而无筛选，MAY remain unchanged unless a filter bar already exists

6. **调课管理列表**
   - 教室开放时间：学年学期、场地类型、Venue、楼栋、楼层；补 **是否启用/开放状态**（若列表有对应列或可推导）
   - 调课原因类型：原因类型、是否启用、适用调课类型（已有则保持）
   - Class Adjustment / 调课申请管理 / 审批 / 记录 / 批量调课：学年学期、调课类型、状态；补齐缺口中的 **课号、课程班名称、申请人/教师、日期或周次**（页上尚缺的才补）
   - 公假日停课：假日名称、学年学期、补课申请状态；补 **Date / Day**（若列表有日期列）

#### Scenario: Batch schedule list gains course keyword
- **WHEN** user opens「按入学批次排」and the filter bar is shown
- **THEN** the bar includes 学院、专业、入学批次、排课状态, and a course code/name keyword filter

#### Scenario: Teacher schedule list gains staff type
- **WHEN** user opens「按教师排」
- **THEN** the filter bar includes 教职工类型 in addition to 教工号、姓名、所在单位、排课状态

#### Scenario: Course schedule list gains teacher keyword
- **WHEN** user opens「按课程排」
- **THEN** the filter bar includes a teacher id/name keyword filter in addition to course code, course name, unit, type, and status

#### Scenario: Room-by-day list gains course and teacher filters
- **WHEN** user opens「按时间排」教室列表
- **THEN** the filter bar includes course and teacher keyword filters in addition to Day and 排教室状态

#### Scenario: Room conflict gains programme dimensions when columns exist
- **WHEN** user opens「场地冲突查询」whose result table shows 学院/专业/入学批次
- **THEN** the filter bar provides corresponding 学院、专业、入学批次 controls

### Requirement: Query and reset behavior

Each in-scope filter bar SHALL provide a way to apply filters（查询）and clear them（重置）. Applying filters MUST refresh the visible list to matching rows only. Reset MUST clear user-entered constraints and restore the list to the page’s default unfiltered (or term-default) view.

#### Scenario: Apply filters narrows the list
- **WHEN** the user sets one or more filter values and triggers 查询
- **THEN** only rows matching all active filters remain visible

#### Scenario: Reset restores default list
- **WHEN** the user triggers 重置 after filtering
- **THEN** filter inputs return to empty/全部 (term defaults preserved where the page uses a fixed current term) and the list shows the default set again

### Requirement: Cascading options stay coherent

Where a page already cascades 学院 → 专业 → 入学批次 (or equivalent), newly added filters MUST NOT break that cascade. Dependent selects MUST refresh options when parents change and MUST clear invalid child values.

#### Scenario: Programme options follow school
- **WHEN** the user changes 学院 on a page with school→programme cascade
- **THEN** 专业 options refresh to that school and any previously selected programme outside the new set is cleared

### Requirement: Empty result messaging

When filters yield zero rows, the list area SHALL show an empty state indicating no matches rather than leaving a blank table body without feedback.

#### Scenario: No matches
- **WHEN** applied filters match no rows
- **THEN** the user sees an empty-state message in the list area
