# Proposal

## Why

联合排课里 GE（公共选修课）没有固定专业批次，业务上是「以课为对象」统排多门课看冲突、安排地点；当前对象列仍按专业批次行展示（演示数据挂靠「海洋环境化学 · 2024/09」），误导排课员。

## What Changes

- 联合排课在筛选/命中 GE 课时，课表「对象」轴增加 **课（course）** 行：一门 GE 教学任务一行（按课号/section 粒度；组合班或拆组仍占该课对象行上的格）。
- 选了公共选修课类型（G01–G04）且结果集含 GE 课时：对象列以课行为主，不再把 GE 课折叠进演示挂靠的专业批次行。
- 左侧课程列表对 GE 课不再展示误导性的「专业批次」固定值；可改为不展示或展示 GE 类型/类别类信息。
- 未选 GE、仅按专业批次/教师查询时：对象列仍为批次/教师，行为不变。
- 专业课 + GE 混合结果时：批次/教师行与 GE 课行可并存（专业课落批次/教师行，GE 落课行）。

## Capabilities

### New Capabilities

- `schedule-joint-ge-object`: 联合排课中 GE 课以课为对象行的展示与落点匹配规则

### Modified Capabilities

- （无；主 specs 库存为空，本变更新增能力 delta）

## Impact

- 主要改动：`app.js` 中联合排课对象构建（`getScheduleJointRowObjects` / `buildScheduleJointObjectsFromTasks`）、行匹配（`scheduleJointTaskMatchesRow` / `filterScheduleTasksByJointRow`）、网格渲染（`renderScheduleJointTimetableGrid` 对象 kind 文案）、左侧课程卡批次字段、空态文案（「请先选择专业批次或教师」在仅 GE 场景需可读）。
- 范围：`#page-schedule-joint` / 联合排课演示页的时间侧网格与侧栏；**不改**排时间/排教室详情页非联合路径（遵守时间/教室独立性）。
- 首期按「一门 GE 教学任务一行」验证效果；若后续要「一组一行」另开变更。
