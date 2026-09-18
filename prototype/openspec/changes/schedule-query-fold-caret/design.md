## Context

See proposal.md — Why。排课管理列表筛选已统一为「一行最多 3 条件、按钮钉在第一行第 4 列」（`.schedule-query-row` / `.schedule-room-filter-grid`）。学生课表密度已用 `data-density-more` + 带边框「展开」文字按钮做局部折叠。开课「专业开课计划」侧 DOM 上有 `course-query-more-toggle` 文字「展开」（本仓库 HTML 尚未落地该按钮），本 change **只借其「第一行按钮组旁弱化展开」位置**，视觉改为无边框半三角，并铺到排课管理所有超一行筛选栏。

现有约束：

- `.cursor/rules/query-filter-list-layout.mdc`：按钮不得沉底、第二行不得排到按钮正下方
- `schedule-time-room-independence`：不得为教室需求改时间详情交互；详情页左侧课程搜索不是本标准查询栏

## Goals / Non-Goals

**Goals:**

- 一套共用三角控件 + 收起态，覆盖排课管理超一行的列表/Tab/密度/调课抽屉左侧筛选。
- 默认收起；隐藏字段值仍参与查询。
- 不超过一行的栏不加三角。

**Non-Goals:**

- 不改开课管理筛选栏实现。
- 不改联合排课「筛选与设置」整块 chrome。
- 不改排时间/排教室详情左侧课程搜索、排教室「展开更多教室」。
- 不持久化展开状态（刷新回默认收起即可）。

## Decisions

### 1. 共用控件，不按页复制文案按钮

- **选择**：`button.schedule-query-fold-toggle`（无 `.btn` 描边）+ `.schedule-query-fold-caret` CSS 半三角（border 三角，收起 `border-top` 朝下，展开 `border-bottom` 朝上）。父级 `.is-query-more-open` 翻转三角与显示更多区。
- **理由**：用户明确不要边框和「展开/收起」字；半三角比 unicode 字符更稳。
- **备选**：沿用 `btn-ghost` + 文案（否决）；▾/▴ 字符（备选，若 CSS 三角在现有按钮行高上不好对齐可退回字符）。

### 2. 更多条件的标记方式

- **选择**：
  - `.schedule-query-row`：第 4 个 `.schedule-query-field` 起包进 `.schedule-query-more`（`grid-column: 1 / 4`，内部三列网格），默认不展示。
  - `.schedule-room-filter-grid`：第一行 3 个 `.srf-item` + `.srf-actions` 之后的项加 `data-query-more`（密度已有 `data-density-more`，实现时合并为同一选择器或同时认两套属性）。
- **理由**：不必改现有「display:contents」字段包装也能让第二行只占前 3 列。
- **备选**：纯 CSS `nth-child` 隐藏（脆弱，actions 插入位置一变就坏）。

### 3. 三角放在查询/重置右侧

```
[条件1] [条件2] [条件3]  [查询] [重置] [▾]
[条件4] [条件5] [条件6]        （展开后；按钮列下方留空）
```

- **选择**：三角是 `.schedule-query-actions` / `.srf-actions` 的最后一个子节点。
- **理由**：对齐开课参考 DOM（展开在查询重置旁），且符合布局标准第 3 条。
- **备选**：单独第 5 列（否决，会破坏三列对仗）。

### 4. 覆盖清单（实现时按页勾选）

超一行、需要折叠的已知栏：

| 区域 | 说明 |
|------|------|
| 按入学批次排 / 按教师排 / 按课程排 | 4～6 条件 |
| 课表冲突查询、场地冲突查询 | 多条件 |
| 自动排课 / 自动排教室 | 含 wide 字段 |
| 排课时间设置部分 Tab、时间课表 Tab | 超过 3 条件的才加 |
| 课表密度学生 + 教师 | 替换现有文字展开 |
| 教室开放时间、调课申请管理、调课申请记录 | 4～5 条件 |
| 调课申请抽屉左侧选择节次 | 第二行日期/星期/教室 |

不超过一行：节次维护、多数课表查询 Tab、调课申请教师端主列表/加课列表等 — **不加三角**。

### 5. 共用脚本

- **选择**：`toggleScheduleQueryMore(btn)`：在最近的 `.schedule-query-row` 或 `.schedule-room-filter-grid` 上 toggle `is-query-more-open`，同步 `aria-expanded` / `aria-label`。密度现有 `toggleScheduleStudentDensityFilters` 改为走同一函数。
- **理由**：少分叉；重置不必强制收起（产品未要求）。

## Risks / Trade-offs

- [收起后用户不知道周次等仍在生效] → 保持当前默认值逻辑，不在收起时清空；三角存在即提示还有条件。
- [密度 `nth-child` 列定位与隐藏项并存] → 用 `display:none` 的项不占网格；展开后继续用现有 3 列规则。
- [详情页误伤] → 任务清单排除详情左侧搜索；只改标准 query card / srf 筛选网格。

## Migration Plan

纯前端原型：改 HTML/CSS/JS 即可。回滚即还原筛选 HTML 与密度 toggle。无需数据迁移。
