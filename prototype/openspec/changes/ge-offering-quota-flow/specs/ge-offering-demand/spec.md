## ADDED Requirements

### Requirement: GE demand reference by term

系统 MUST 提供「通识选修开课需求」页面，按开课学期展示本学期需修通识选修的参考数据，供 AC 与学院开课前查阅。

#### Scenario: View demand for a term

- **WHEN** 用户选择某一开课学期进入通识选修开课需求页
- **THEN** 系统展示：预计需修 GE 总人数、涉及专业批次列表（或汇总行）、按学院人数、按文/商/理人数

#### Scenario: Prototype uses mock demand

- **WHEN** 原型环境加载需求数据
- **THEN** 系统可使用预置假数据，并在页面提示正式环境将来自执行计划「选修类分类 · 修读要求」矩阵
- **AND** 原型 MUST NOT 强制与执行计划详情实时联动

### Requirement: Cross-stream enrollment rule visibility

系统 MUST 说明学生大类与可选课程大类的交叉规则，避免用户误以为「只为本大类学生开本大类课」。

#### Scenario: Show cross-stream rule

- **WHEN** 用户查看需求页
- **THEN** 系统展示规则说明：文科学生可选商科/理科 GE；商科学生可选文科/理科 GE；理科学生可选文科/商科 GE

### Requirement: Stream mapped from college (interim)

学生侧文/商/理分类 MUST 先按学院映射；映射表可配置，以便后续改为按专业映射。

#### Scenario: Aggregate by college stream

- **WHEN** 系统汇总某学院需求人数
- **THEN** 该学院人数计入其映射的文/商/理大类
