# Spec Delta

## Purpose

让排教室侧栏在仅看卡片时就能识别同一教师跨课号/跨课组的连堂（Back to back）边界，并随大节次/小节次粒度正确落标。

## ADDED Requirements

### Requirement: Teacher B2B mark eligibility on room sidebar cards

排教室详情左侧合并卡片 MUST 在同时满足以下条件时显示教师 Back to back 标记：同一星期；周次有交集；卡片展示节次区间首尾相接（一方 `periodTo + 1` 等于另一方 `periodFrom`）；两侧卡片**至少有一名共同教师**（不要求教师名单完全一致）；两侧卡片的课号或课程组不一致。同课号且同课程组的相邻卡片 MUST NOT 因本规则显示跨课教师 B2B 标记。本变更 MUST NOT 为学生 B2B 增加侧栏标记。可见短标 MUST 为 **`B2B`**；完整说明可放在 title / aria-label。

#### Scenario: Different courses consecutive same teacher

- **WHEN** 教师 A 的课 `MEC901` 展示为 9:00–11:00，教师 A 的另一门课 `MEC902` 展示为 11:00–12:00，且周次有交集
- **THEN** 两张侧栏卡片均显示 `B2B` 标记

#### Scenario: Shared teacher among multi-teacher courses

- **WHEN** 课甲教师为 A+B，课乙教师为 B+C，展示节次首尾相接且课号或课组不一致、周次有交集
- **THEN** 两侧卡片均显示 `B2B` 标记（因共同教师 B）

#### Scenario: Same course same group not marked

- **WHEN** 同一课号同一课程组在小节次下拆成 9–10 与 10–11 两张卡且教师相同
- **THEN** 这两张卡 MUST NOT 因本规则显示跨课教师 B2B 标记

#### Scenario: Different groups same course marked

- **WHEN** 同一课号下 A 组结束节次与 B 组开始节次首尾相接且至少有一名共同教师
- **THEN** 两侧卡片均显示 `B2B` 标记

### Requirement: Mark respects period grain mode

教师 B2B 标记 MUST 基于当前「节次类型」下的**卡片展示区间**判定，而不是固定按原始联排 slot 整段或固定按单小时。切换大节次 / 小节次后，标记位置 MUST 按新粒度重算。

#### Scenario: Large grain marks whole block at boundary

- **WHEN** 节次类型为「大节次」，教师 A 有一门合并卡 9–11 与另一门卡 11–12 首尾相接且课号或课组不一致
- **THEN** 整张 9–11 大卡与 11–12 卡均显示 B2B 标记

#### Scenario: Small grain marks only abutting hours

- **WHEN** 节次类型为「小节次」，教师 A 的同一门课拆成 9–10、10–11，另一门课为 11–12，且跨课边界满足教师 B2B 条件
- **THEN** 仅 10–11 与 11–12 显示 B2B 标记；9–10 MUST NOT 显示

### Requirement: Continuous B2B chain for same teacher day

同一教师在同一天连续教授多门课号或课组不同的课程时，系统 MUST 对每一对相邻跨课边界的两侧卡片都显示标记，形成连续链，而不是只标链的两端。

#### Scenario: Three-course chain

- **WHEN** 教师 A 依次有卡片区间 P1–P2（课甲）、P3–P3（课乙）、P4–P4（课丙），相邻对均满足教师 B2B 条件
- **THEN** 课甲与课乙边界两侧均标；课乙与课丙边界两侧均标（中间课可同时带前后两个边界的标记语义）

### Requirement: Room-only visual affordance

教师 B2B 标记 MUST 仅出现在排教室详情侧栏卡片上。排时间侧栏与右侧课表格格 MUST NOT 因本变更新增同类标记。标记可见文案 MUST 含 `B2B` 且 MUST 标出伙伴课号（如 `B2B→MEC920`），并 MUST 提供 title / aria-label（含 Back to back）。当两张卡在列表中相邻且互为教师 B2B 上下接时，系统 MUST 在两卡之间展示可见衔接，使人能辨认「是这两张之间」的关系。

#### Scenario: Time phase unchanged

- **WHEN** 用户在排时间详情查看侧栏课程卡
- **THEN** 不出现本变更引入的教师 B2B 侧栏标记

#### Scenario: Timetable cells unchanged

- **WHEN** 用户查看排教室右侧课表
- **THEN** 格子仍按既有 1 小时 1 卡展示，不因本变更合并格子或新增 B2B 格内徽标

#### Scenario: Pair identity visible without tooltip

- **WHEN** MEC914 与 MEC920 构成教师 B2B 且在列表中相邻
- **THEN** MEC914 徽标可见指向 MEC920（或等价伙伴课号），MEC920 徽标可见指向 MEC914，且两卡之间有 B2B 衔接条

### Requirement: Sidebar list clusters B2B chains then orders by time

排教室详情左侧课程列表 MUST 先将教师 B2B 邻接关系形成的连通链（组）排在一起，组内按展示节次时间排序；组与组之间再按各组最早节次等时间键排序。列表 MUST NOT 仅按全局时间排序以致多条并行 B2B 链交叉拆散。列表 MUST NOT 再以「人数多优先」作为主序打散 B2B 组。

#### Scenario: Single B2B pair stays together

- **WHEN** 侧栏存在教师 B2B 的 9–11 卡与 11–12 卡，以及其它更早/更晚的无关卡
- **THEN** 该两张 B2B 卡在列表中相邻

#### Scenario: Parallel B2B chains do not interleave

- **WHEN** 同时存在两对教师 B2B：A(9–10)↔B(10–11) 与 C(9–10)↔D(10–11)
- **THEN** 列表中 A 与 B 紧挨成一组，C 与 D 紧挨成另一组
- **THEN** MUST NOT 出现 A、C、B、D 这种把两条链交叉拆开的顺序

#### Scenario: Headcount no longer breaks B2B apart

- **WHEN** 人数较少的 B2B 链与人数较多的无关卡同时存在
- **THEN** 不得因人数把同一 B2B 链的卡片拆到不相邻位置
