## ADDED Requirements

### Requirement: Type quota page lists G01–G04

系统 MUST 在通识选修计划页提供「类型配额」卡片，按学期固定列出类型 G01、G02、G03、G04；MUST NOT 再以学院/开课单位作为配额行维度。

#### Scenario: View type quota table

- **WHEN** 用户打开通识选修计划页并已选择开课学期
- **THEN** 系统展示「类型配额」表，且恰好包含 G01、G02、G03、G04 四行
- **AND** 表头包含：类型、需开课程班/组数、需开·2学分、需开·3学分、已开、进度

#### Scenario: Card title

- **WHEN** 用户查看该卡片
- **THEN** 标题为「类型配额」（不再使用「各学院配额」）

### Requirement: Manual min groups by credit band

系统 MUST 允许教务按类型手工维护「需开·2学分」「需开·3学分」非负整数，并持久化到当前学期；「需开课程班/组数」MUST 等于二者之和。

#### Scenario: Save type quota plan

- **WHEN** 教务修改某类型的需开·2学分与需开·3学分并点击保存
- **THEN** 系统保存该学期四类型配额
- **AND** 该类型「需开课程班/组数」显示为需开·2学分 + 需开·3学分

#### Scenario: Demand does not auto-write quota

- **WHEN** 上段开课需求数据变化或用户点击需求刷新
- **THEN** 系统 MUST NOT 自动改写类型配额的需开字段

### Requirement: Actual opened groups counted by type

系统 MUST 按类型统计当前学期已添加通识开课的课程班/小组数作为「已开」。类型归属 MUST 与校选课类别映射一致：G01/G1x→Arts（G01）、G02/G2x→Business（G02）、G03/G3x→Science（G03）、其余→G04。

#### Scenario: Count opened groups for a type

- **WHEN** 当前学期存在课号归属 G01 的通识开课任务且已有小组
- **THEN** G01 行「已开」计入这些小组数
- **AND** 不按开课单位拆行展示

#### Scenario: Progress met or shortfall

- **WHEN** 某类型已开 ≥ 该类型需开课程班/组数
- **THEN** 进度显示已达标（可超额）
- **WHEN** 已开 < 需开课程班/组数
- **THEN** 进度显示差额（差 N 组）

### Requirement: Submit validation uses type quota not college

通识开课安排生效/提交时，系统 MUST 按本次操作涉及开课任务所属类型检查配额；MUST NOT 再按学院/开课单位配额拦截。

#### Scenario: Block submit when involved type shortfalls

- **WHEN** 用户对若干通识开课任务执行生效
- **AND** 这些任务所属类型中至少有一类已开 < 需开课程班/组数
- **THEN** 系统拒绝生效
- **AND** 提示中指明未达标类型及差额

#### Scenario: Allow submit when involved types met

- **WHEN** 用户生效的任务所属类型均已达标（已开 ≥ 需开）
- **THEN** 系统不因类型配额拒绝本次生效
- **AND** 未涉及的类型即使未达标也不阻挡本次生效

#### Scenario: Exceeding type minimum needs no approval

- **WHEN** 某类型已开大于其需开课程班/组数
- **THEN** 系统允许该超额
- **AND** MUST NOT 要求教务二次确认超额
