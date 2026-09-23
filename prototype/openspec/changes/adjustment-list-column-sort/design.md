## Context

See proposal.md — Why.

项目已有统一列表排序基建：`listSortStates`、`renderListSortTh`、`toggleListSort`、`sortListWithState`、`LIST_SORT_REFRESH`。Class Adjustment 教师端部分列表（replacement / addition / makeup / makeup-cancel）已通过 `ADJUSTMENT_TEACHER_SORT_COLUMNS` + `renderAdjustmentTeacherListThead` 接入。

缺口：`adjustment-admin`、`adjustment-approval`、`adjustment-record`、`adjustment-batch`（记录表）、`adjustment-holiday`（管理表 + 记录表）的表头仍为静态 `<th>`，渲染函数未调用 `sortListWithState`。

## Goals / Non-Goals

**Goals:**

- 六个侧栏入口的主列表数据列具备与其它列表一致的点击排序交互
- 复用现有排序基建，按页注册独立 `listKey` 与列规格
- 排序状态在同页筛选/切 Tab 后仍作用于当前结果集（筛选先、排序后）

**Non-Goals:**

- 不改查询条件布局、导出、审批/申请业务流程
- 不给序号 / 勾选 / 操作列加排序
- 不强制给抽屉/弹层内明细预览表加排序
- 不改排时间 / 排教室详情页

## Decisions

### 1. 复用全局排序基建，不另起一套

- **选择**：继续用 `renderListSortTh` + `sortListWithState` + `LIST_SORT_REFRESH`
- **理由**：交互、图标、键盘、样式已统一；教师端已验证路径
- **备选**：各页独立 sort state → 重复代码、交互易漂移 → 否决

### 2. 表头注入方式与教师端对齐

- **选择**：列表 render 时用 JS 重写 `thead tr`（或抽小 helper），再渲染 tbody
- **理由**：静态 HTML 可保留占位；排序态（`is-sorted`、箭头）必须随 state 刷新
- **备选**：HTML 写死带 onclick 的 th → 难同步当前 sort 图标 → 否决

### 3. 申请类列表共享列规格，按页拆 listKey

| listKey | 页面 |
|---|---|
| `adjustmentAdmin` | 调课申请管理 |
| `adjustmentApproval` | 调课申请审批 |
| `adjustmentRecord` | 调课申请记录 |
| `adjustmentBatchRecord` | 批量调课管理 · 记录表 |
| `adjustmentHolidayManage` | 公假日停课 · 管理 |
| `adjustmentHolidayRecord` | 公假日停课 · 记录 |

- 申请管理 / 审批 / 记录列结构相近，可复用或扩展 `ADJUSTMENT_TEACHER_SORT_COLUMNS`（或抽出 `ADJUSTMENT_REQUEST_SORT_COLUMNS`），getter 对齐展示文案（状态中文 label、原因类型 display 等）
- 公假日 / 批量记录列不同，各自独立 `*_SORT_COLUMNS`
- **备选**：所有页共用一个 listKey → Tab/页面切换互相污染 → 否决

### 4. 可排序列判定

- **可排**：状态、阶段、单号、类型、申请人、时间类、节数/影响数、原因类型、事由、操作人、假日名称、Date/Day、教室/课程班等业务字段
- **不可排**：序号、勾选、操作
- 数字列用 `type: 'number'`；日期/时间字符串用 locale compare（与现有一致）

### 5. 默认顺序

- 未点选排序列时保持各页现有默认顺序（不强制改成按提交时间倒序，除非该页本来就有 defaultCompare）
- 教师端已有 `defaultAdjustmentTeacherListCompare` 的保持不变

## Risks / Trade-offs

- [申请类 getter 与展示不一致] → 排序键必须用与单元格相同的 display helper（如 `getAdjustmentStageLabel`、`getAdjustmentReasonTypeDisplay`）
- [序号随排序变化] → 序号按当前可视顺序重编（与其它已排序列表一致），不做「固定原序号」
- [教师端已接入路径被误改] → 任务中单独「核对缺口」；已有 listKey 不重命名除非必要

## Migration Plan

原型静态页无数据迁移。实现后按六个入口各点一列升/降序 + 筛选后再排序做手工验收即可。回滚即还原对应 render / LIST_SORT_REFRESH 改动。

## Open Questions

- 无（「该加的都加」按 Decision 4 的列判定执行；弹层明细表本次不加）
