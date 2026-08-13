## Purpose

在通识选修计划「开课需求」中，按文/商/理估算本学期 GE 2 学分与 3 学分课座人次，辅助开课规划对齐学分结构供给。

## ADDED Requirements

### Requirement: Demand card exposes two tabs
开课需求卡片 MUST 提供 Tab 切换：`按学院明细` 与 `GE学分分布预估`。默认选中 `按学院明细`。切换 MUST NOT 改变当前开课学期筛选，且「刷新」MUST 同时刷新两 Tab 所依赖的需求数据。

#### Scenario: Switch to credit distribution tab
- **WHEN** 用户在开课需求卡片点击 `GE学分分布预估`
- **THEN** 系统展示学分分布视图，且不离开当前开课学期

#### Scenario: Refresh applies to both views
- **WHEN** 用户点击开课需求「刷新」
- **THEN** 学院明细与学分分布预估均基于同一套刷新后的需求数据重算/重渲染

### Requirement: Credit distribution shows three stream cards
`GE学分分布预估` MUST 以文、商、理三列卡片并排展示。每张卡片 MUST 显示：该类别总人数、2 学分人次、3 学分人次。三张卡片的总人数之和 MUST 等于开课需求摘要中文/商/理人数之和。

#### Scenario: Stream card fields
- **WHEN** 用户查看 `GE学分分布预估`
- **THEN** 可见文、商、理三卡，每卡含总人数、2 学分人次、3 学分人次

#### Scenario: Headcount matches summary streams
- **WHEN** 摘要文/商/理人数分别为 A、B、C
- **THEN** 学分分布三卡总人数分别为 A、B、C（之和 A+B+C）

### Requirement: Standard credits drive seat split per programme batch
系统 MUST 按专业批次取其本学期 GE **标准学分**（对应执行计划/方案矩阵「最高学分」语义；本期原型用假数据写死，主造 4～7）。批次 MUST 先按专业归属归入文/商/理，再按标准学分规则计算 2/3 学分人次并在同类别内累加。标准学分 < 2 的批次 MUST 剔除，不计入该视图人数与人次。

#### Scenario: Batch below 2 credits excluded
- **WHEN** 某批次假数据标准学分小于 2
- **THEN** 该批次不进入文/商/理人数与 2/3 学分人次合计

#### Scenario: Multiple batches accumulate within a stream
- **WHEN** 同一文/商/理下有多个计入批次
- **THEN** 各类别 2/3 学分人次为各批次计算结果之和

### Requirement: Fixed split for standard credits 2, 3, 4, 5, 7
对标准学分 2、3、4、5、7，系统 MUST 按固定拆分计算人次：  
- 2 → 每人 1 门 2 学分、0 门 3 学分  
- 3 → 0 门 2 学分、1 门 3 学分  
- 4 → 2 门 2 学分、0 门 3 学分  
- 5 → 1 门 2 学分、1 门 3 学分  
- 7 → 2 门 2 学分、1 门 3 学分  
2 学分人次 = 人数 × 每人 2 学分课数；3 学分人次 = 人数 × 每人 3 学分课数。

#### Scenario: Fifty students at 5 credits
- **WHEN** 一批次 50 人、标准学分 5
- **THEN** 2 学分人次为 50，3 学分人次为 50

#### Scenario: Fifty students at 4 credits
- **WHEN** 一批次 50 人、标准学分 4
- **THEN** 2 学分人次为 100，3 学分人次为 0

### Requirement: Fifty-fifty split for standard credits 6, 8, 9, 10, 11
对标准学分 6、8、9、10、11，系统 MUST 采用 50/50 拆分：人数为偶数时用期望值；人数为奇数时用规则一（方案 A 人数 = ⌈N/2⌉，方案 B 人数 = ⌊N/2⌋）。方案明细：  
- 6：A=2+2+2（3 门 2 / 0 门 3），B=3+3（0 / 2）；期望 1.5 门 2 + 1 门 3  
- 8：A=2+2+2+2（4 / 0），B=2+3+3（1 / 2）；期望 2.5 门 2 + 1 门 3  
- 9：A=2+2+2+3（3 / 1），B=3+3+3（0 / 3）；期望 1.5 门 2 + 2 门 3  
- 10：A=2+2+2+2+2（5 / 0），B=2+2+3+3（2 / 2）；期望 3.5 门 2 + 1 门 3  
- 11：A=2+2+2+2+3（4 / 1），B=2+3+3+3（1 / 3）；期望 2.5 门 2 + 2 门 3  

#### Scenario: Even headcount at 6 credits
- **WHEN** 一批次 50 人、标准学分 6
- **THEN** 2 学分人次为 75，3 学分人次为 50

#### Scenario: Odd headcount at 6 credits uses rule one
- **WHEN** 一批次 5 人、标准学分 6
- **THEN** 方案 A 3 人、方案 B 2 人，得 2 学分人次 9、3 学分人次 4

#### Scenario: Odd headcount at 8 credits
- **WHEN** 一批次 5 人、标准学分 8
- **THEN** 2 学分人次为 14，3 学分人次为 4
