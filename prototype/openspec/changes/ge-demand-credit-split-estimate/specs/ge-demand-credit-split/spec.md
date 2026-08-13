## Purpose

在通识选修计划「开课需求」中提供第二维预估：按文/商/理展示本学期 GE 2 学分与 3 学分的预计人次，支撑开课容量与学分结构规划。

## ADDED Requirements

### Requirement: Demand card exposes two tabs
开课需求卡片 MUST 提供两个 Tab：**按学院明细** 与 **GE学分分布预估**。默认展示「按学院明细」（现有学院表与人数摘要行为保持可用）。用户 MUST 可在两 Tab 间切换且不离开本卡片。

#### Scenario: Switch to credit-split estimate tab
- **WHEN** 用户在开课需求卡片选择「GE学分分布预估」
- **THEN** 系统展示学分分布预估视图，并隐藏（或不展示）按学院明细表作为主内容

#### Scenario: Switch back to school detail tab
- **WHEN** 用户再选择「按学院明细」
- **THEN** 系统恢复展示学院明细表及原有按专业大类人数摘要

### Requirement: Credit-split view shows three stream cards
「GE学分分布预估」视图 MUST 以文、商、理三列卡片并排展示。每张卡片 MUST 显示：该类别总人数、2 学分人次、3 学分人次。单位「人次」表示课座次需求，MUST NOT 要求对同一学生去重。

#### Scenario: Stream card contents
- **WHEN** 预估视图渲染完成且该类别有有效批次
- **THEN** 对应卡片同时展示总人数、2 学分人次、3 学分人次三个数值

### Requirement: Headcount matches existing stream totals
预估视图中文、商、理总人数 MUST 分别等于开课需求现有按专业大类汇总的文、商、理人数（同一学期、同一套刷新结果）。「刷新」MUST 同时更新两 Tab 所依赖的需求数据。

#### Scenario: Refresh updates both tabs
- **WHEN** 用户点击开课需求「刷新」
- **THEN** 系统重算需求演示数据；无论当前停在哪个 Tab，两 Tab 再次展示时均反映刷新后结果，且文商理总人数两端一致

### Requirement: Standard credits below 2 are excluded
参与学分分布预估的批次 MUST 使用该批次的标准学分（原型为演示写死值；语义对齐执行计划「最高学分」）。若标准学分低于 2，该批次 MUST 从预估计算中剔除。

#### Scenario: Batch with standard credits 1 excluded
- **WHEN** 某批次标准学分为 1（或 0）
- **THEN** 该批次不计入任何类别的总人数与 2/3 学分人次

### Requirement: Fixed split for standard credits 2, 3, 4, 5, 7
对标准学分 2、3、4、5、7，系统 MUST 按固定拆分计算人次：2 学分人次 = 人数 × 每人 2 学分课门数；3 学分人次 = 人数 × 每人 3 学分课门数。门数映射 MUST 为：2→(1,0)；3→(0,1)；4→(2,0)；5→(1,1)；7→(2,1)。

#### Scenario: Fifty students at standard credits 4
- **WHEN** 某文科批次 50 人且标准学分 4
- **THEN** 贡献 100 人次 2 学分、0 人次 3 学分

#### Scenario: Fifty students at standard credits 5
- **WHEN** 某文科批次 50 人且标准学分 5
- **THEN** 贡献 50 人次 2 学分、50 人次 3 学分

#### Scenario: Fifty students at standard credits 7
- **WHEN** 某文科批次 50 人且标准学分 7
- **THEN** 贡献 100 人次 2 学分、50 人次 3 学分

### Requirement: Fifty-fifty split for standard credits 6, 8, 9, 10, 11
对标准学分 6、8、9、10、11，系统 MUST 采用 50/50 两方案拆分。人数为偶数时 MUST 使用期望值：人次 = 人数 × 每人期望门数。人数为奇数时 MUST 使用规则一：方案 A 人数 = ceil(N/2)，方案 B 人数 = floor(N/2)，再按各方案门数加权求和。

期望值与方案门数 MUST 为：
- 6：期望 (1.5, 1)；A (3,0)；B (0,2)
- 8：期望 (2.5, 1)；A (4,0)；B (1,2)
- 9：期望 (1.5, 2)；A (3,1)；B (0,3)
- 10：期望 (3.5, 1)；A (5,0)；B (2,2)
- 11：期望 (2.5, 2)；A (4,1)；B (1,3)

#### Scenario: Even headcount at standard credits 6
- **WHEN** 某文科批次 50 人且标准学分 6
- **THEN** 贡献 75 人次 2 学分、50 人次 3 学分

#### Scenario: Odd headcount at standard credits 6
- **WHEN** 某文科批次 5 人且标准学分 6
- **THEN** 贡献 9 人次 2 学分、4 人次 3 学分

#### Scenario: Odd headcount at standard credits 8
- **WHEN** 某文科批次 5 人且标准学分 8
- **THEN** 贡献 14 人次 2 学分、4 人次 3 学分

### Requirement: Aggregate by stream across batches
同一文/商/理类别下多个专业批次 MUST 分别按各自标准学分与人数计算后，将总人数、2 学分人次、3 学分人次分别累加，得到该类别卡片数值。

#### Scenario: Two arts batches summed
- **WHEN** 文科批次 A 与批次 B 均有效且已分别算出人次
- **THEN** 文科卡片展示两者人数之和与人次之和

### Requirement: Prototype uses hardcoded credit bands mainly 4–7
原型演示数据 MUST 为批次写死标准学分，并以 4～7 分为主；MUST NOT 在本期要求读取执行计划矩阵真值。规则实现仍 MUST 支持 2～11 档以便特殊情况与验算。

#### Scenario: Demo data uses mid-band credits
- **WHEN** 用户打开通识选修计划开课需求并进入「GE学分分布预估」
- **THEN** 可见基于演示标准学分（主要为 4～7）算出的文商理三卡，且标明或沿用演示数据语境
