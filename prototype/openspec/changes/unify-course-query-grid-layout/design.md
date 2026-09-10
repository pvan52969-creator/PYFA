## Context

See proposal.md — Why。开课计划 / 选修开课安排 / 选修开课名单已按 `.course-major-query-grid { grid-template-columns: repeat(6, minmax(0, 1fr)) }`，查询操作为 `grid-column: 1 / -1` 靠右。本变更把同一套规则接到用户点名的剩余页。

已知现状：

- 课程班收起 5 项；教师替换、排课计划收起 4 项，第一行右侧空列。
- Teaching Load 与分组页内副本使用不等宽 `grid-template-columns: minmax(...) auto`，查询按钮占用最后一列。
- 授课确认管理是 `display: flex` + 固定 `min-width`，字段宽窄不一。
- 教师端导出在 `tcc-portal-list-toolbar`，授课确认在 `tcc-letter-batch-bar`，分成两行。

## Goals / Non-Goals

**Goals:**

- 上述页面查询区视觉行：满行 6 个等宽；少的只在最后一行。
- Teaching Load / 授课确认管理查询按钮不再挤进字段行。
- 教师端导出与授课确认同一行。

**Non-Goals:**

- 不改筛选语义、默认值、导出列或 CSV 规则。
- 不回头改已铺满 6 列的开课计划 / 选修安排 / 选修名单。
- 不为尚无导出的页面新增导出。

## Decisions

### 1. 用挪字段补满第一行，不改列数

第一行不足 6 个时，从展开区按现有 DOM 顺序取出紧挨着的字段补到收起行。

| 页面 | 收起行补入 |
|---|---|
| 课程班 | 课程组名称 |
| 教师替换 | 开课类型、上课专业 |
| 排课计划 | 课程组、学时类型 |
| 授课确认管理 | Status |

备选：整页改成 5 列。否决，与已落地的 6 列约定不一致。

### 2. Teaching Load 取消特例列宽

删除 `#page-course-teacher-teaching-load .teacher-load-query-grid` 与分组页对应的不等宽 `grid-template-columns`，以及 `.teacher-load-query-grid .course-time-query-actions { grid-column: auto }`。查询/重置走与其它页相同的整行靠右。下拉触发器已是 `width: 100%`，等宽列内可保持。

备选：保留学期列更宽。否决，用户明确要求平均分布宽度。

### 3. 授课确认管理改用同一套栅格 class

`tcc-admin-filters` 改为 6 列 grid（或加上 `course-major-query-grid`），字段用现有 `tcc-admin-field`。展开区 `course-query-more` 用 6 列（或 subgrid），不再 `display: flex` 导致宽窄不一。去掉字段上写死的 `width: 140px` / `min-width: 120px`（改为 `width: 100%`）。

### 4. 教师端导出并入信函批量栏

Pending 有授课确认时：在 `tcc-letter-batch-bar` 内左侧授课确认、右侧导出（`course-list-toolbar-export`）。去掉卡片内单独的 `tcc-portal-list-toolbar`。History 无授课确认按钮时，导出仍放在该行靠右（同一 `tcc-letter-batch-bar`，仅导出），避免又变回单独工具栏。

备选：导出回到学期筛选旁。否决，用户要求与授课确认同一行。

## Risks / Trade-offs

- [收起后第一行字段变多] → 仅挪展开区已有字段，不新增条件；收起仍应用全部已填条件（既有行为）。
- [Teaching Load 学期多选触发器变窄] → 列等宽后触发器 100% 撑满格子；下拉仍 `width: max-content`。
- [styles.css 存在后段重复规则] → 改 Teaching Load / TCC 列定义时两处一起改，避免被覆盖。

## Migration Plan

原型静态页，无数据迁移。实现后按用户点名页做浏览器核对：第一行列数、等宽、教师端导出与授课确认同一行。
