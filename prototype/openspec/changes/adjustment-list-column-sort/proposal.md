## Why

调课相关六个侧栏入口（Class Adjustment、调课申请审批、调课申请管理、调课申请记录、批量调课管理、公假日停课）的主列表表头，多数仍是静态不可点；用户需要按列排序才能快速定位记录。项目已有统一的 `renderListSortTh` / `sortListWithState` 机制，教师端部分列表已接入，其余板块应对齐补齐。

## What Changes

- 为上述板块中**主列表**的可比较数据列补上表头排序（↕ / ↑ / ↓），复用现有列表排序基础设施。
- 教师端（Class Adjustment）已接入的列表做缺口核对；未接排序的子表（若仍属主列表）一并补齐。
- 审批 / 管理 / 申请记录 / 批量调课记录 / 公假日停课管理与记录：表头改为可排序，渲染前按当前排序状态排序数据。
- **不排序**列：序号、勾选框、操作列；弹层/抽屉内预览明细表不在本次范围（除非与主列表共用同一渲染路径且改动不可避免）。

## Capabilities

### New Capabilities

- `adjustment-list-column-sort`: 调课管理各主列表表头可排序列的行为约定（哪些列可排、交互与刷新、与现有排序基建对齐）

### Modified Capabilities

- （无；主 specs 目录暂无对应能力）

## Impact

- 主要改动：`app.js`（`LIST_SORT_REFRESH`、各页 `render*`、`*_SORT_COLUMNS`、可选 thead 动态渲染）
- 可能微调：`index.html` 静态 thead（若改为 JS 注入则可保持占位）
- 样式：复用既有 `.th-sortable` / `.th-sort`，原则上不新增视觉体系
- 不影响排时间 / 排教室详情页交互
