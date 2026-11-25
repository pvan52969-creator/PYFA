# Proposal

## Why

排教室左侧列表按「大节次 / 小节次」展示卡片时，排课员难以一眼看出：**同一教师、时间首尾相接、但课号或课程组不同**的跨课连堂关系。现有 Back-to-back 能力主要用于一键导入挑教室打分，侧栏卡面没有对应可视标记，排教室时容易忽略「老师刚从上一门课接下一门」的约束与就近诉求。

## What Changes

- 在**排教室详情左侧卡片**上，为满足教师 Back-to-back 条件的卡片显示可视标记（文案口径：**Back to back**）。
- 判定口径（本变更仅教师侧）：
  - 教师相同（与现有教师合并键 / 同教师判定一致）
  - 同一星期、周次有交集、节次时间**首尾相接**（`periodTo + 1 === 对方 periodFrom`）
  - **课号或课程组不一致**（同课同组连堂本身已是一张大节次卡或同课相邻节，不标跨课 B2B）
- 标记随「节次类型」粒度变化：
  - **大节次**：整张大卡（如 9–11）与相邻另一门（如 11–12）两侧都标
  - **小节次**：仅贴接边界两侧小时卡标（如 10–11 与 11–12），同课内部非边界小时不标
- 极端场景：同一教师一天连带多门不同课/组 → 相邻边界两侧卡片形成**连续 B2B 链**，每对相邻跨课边界都标
- **左侧列表排序**：**教师 B2B 连通链优先成组紧挨**，组内按时间；组与组之间再按该组最早节次等时间键排序。避免「只按时间」时多条并行 B2B（如 A9–10↔B10–11 与 C9–10↔D10–11）被排成 A、C、B、D 而拆散。不再以人数多优先打散
- **不改**右侧课表格结构（仍 1 小时 1 格）；**不改**排时间侧；学生 B2B 标记本变更不做

## Capabilities

### New Capabilities

- `schedule-room-teacher-b2b-card-mark`: 排教室侧栏教师 Back-to-back 可视标记，以及按时间序、B2B 成链紧挨的列表排序

### Modified Capabilities

- （无）现有主 specs 未覆盖排教室侧栏 B2B 卡面标记

## Impact

- UI / 逻辑：`#page-schedule-room-detail` 左侧合并卡渲染与排序（`buildScheduleRoomMergedSlotCards` / `sortScheduleRoomMergedCardsPreferSharedTeaching` 等）、节次粒度 `scheduleRoomPeriodGrainMode`
- 可复用现有邻接判定思路（如 `scheduleRoomSlotsAreAdjacentPeriods`、`scheduleTasksShareTeacher`），但标记规则强调「课号/课组不一致」，与一键导入「同课也可作老师就近锚点」略有差异，需在 design 中隔离
- 样式：侧栏课号行或卡缘轻量徽标，避免与 Major Core 类型徽标、共同授课字段混淆
- 范围约束：遵守 `schedule-time-room-independence`，禁止改排时间侧交互
