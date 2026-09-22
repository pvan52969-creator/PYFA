## Context

见 `proposal.md` Why。上一 change `schedule-course-display-format` 已统一列名与 `formatScheduleCourseGroupLabel`，并把桩 code 改成 `CTS101` 等；课名仍是功能标签式英文（`Teacher Timetable Studio`、`Lunch Break Studio`、`Room Demo · Same Slot A`）。部分演示建组默认 `${sec.name}小组1`，经 formatter 后变成「课名（课名小组1）」双重假感。

约束：只动排课模块用户可见课名/课组短名；排时间 vs 排教室独立性不变；开课与培养方案不动。

## Goals / Non-Goals

**Goals:**

- 冲突查询、教室演示、CDF 冲突锚点、补课 Pending 挂钩等种子的 `name` / `groupName` 真实化
- 默认小组短名改为 `A组` / `Group1`…，修掉 `课名小组1` 默认拼接
- 刷新后补课 Pending、冲突列表、排时间/排教室卡片课名观感接近目录课

**Non-Goals:**

- 不改列名（已是 Course Code / 课程班名称 / 课程组）
- 不改 formatter 契约（仍 `课程班名称（短名）（n）`）
- 不强制改教师「演示甲/乙」姓名（可后续另开）
- 不改开课目录本体写死的真实课；不把方案 TAB3 课程组当上课小组

## Decisions

### 1. 优先映射到目录风格课名，课号可保留独立前缀

| 现演示课号 | 建议课程班名称（示例） | 说明 |
| --- | --- | --- |
| `CTS101`（李明补课挂钩） | `Principles of Accounting` 或复用 `Introduction to Finance` | 补课 Pending 主视线；课号可仍 `CTS101` 或改为未占用的 `ACC1xx` 变体，但名必须真 |
| `CQL101` | `University Physics` 一类 | 午休冲突演示 |
| `CQS102` / `CQT102` / `CQP102` 等 CQ* | 金融/会计/海洋目录名各不同门 | 保持一对一，避免冲突场景课名撞车 |
| `CDF*` / `CDX*` | 同理用真实课名 | 保留冲突几何关系 |
| `RM*` / `RCL*` / `RWP*` | `General Biology`、`General Chemistry` 等已有真实名优先；假名项改掉 | `BIO110` 等已真实的可不动 |
| 已是 `FIN101` / `Introduction to Finance` | 保持 | |

备选：全部改成真实 `ACC101`/`FIN101` 复用同课号——否决为主路径，因冲突演示要多门同教师/同时段，撞唯一性成本高。**课号可假、课名必须真。**

### 2. 小组短名只存短名

- `groupName` / `groups[].name` 写入 `A组` 或 `Group1`
- 修 `buildScheduleDemoGroupAssignments` / 注入逻辑里 `${sec.name}小组1` 默认值
- 展示继续 `formatScheduleCourseGroupLabel(courseName, shortName, count)`

### 3. 挂钩代码跟 code，不跟英文名

`ensureAdjustmentLiMingMorningDemoSlots` 等仍按 `t.code === 'CTS101'`（或新 code）查找；改名不改挂钩字段。若顺带换 code，必须同步所有挂钩与全局搜残留。

### 4. 排时间 / 排教室只换种子与默认短名

不改 `#schedule-grid-context-menu` / `#schedule-room-grid-context-menu`、拖排、锁定。

## Risks / Trade-offs

- [多门演示课名撞车导致列表难区分] → 同学院不同目录课名分配；必要时课号差异保留可辨识
- [localStorage 缓存旧停课单仍带旧课名] → 以当前任务 `name` 渲染为准；必要时刷新演示种子覆盖
- [漏改某一批 Room Pad / 联排种子] → 实现时全局搜 `Studio`、`Demo ·`、`Conflict`、`小组1`、`Pad`
- [改默认小组名影响已落库开课分组] → 只改排课演示注入路径，不动开课 Group1 生成逻辑（开课已是 Group1）

## Migration Plan

原型无后端。改种子后硬刷新；若旧调课申请绑旧课名文案，列表应以任务当前 `name`/`groupLabel` 展示。

## Open Questions

- 教师侧「查询演示甲」等姓名是否一并真实化：本 change 默认不做；若演示时仍刺眼可另开小改。
