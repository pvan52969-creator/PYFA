## ADDED Requirements

### Requirement: Always-visible change log entry on schedule list rows

排课管理中纳入范围的菜单列表页，每一行操作列 MUST 始终展示「修改记录」入口，不得因暂无日志而隐藏该入口。

#### Scenario: Entry list shows change log beside arrange action
- **WHEN** 用户打开「按入学批次排」「按教师排」「按课程排」「按时间排」或「按场地类型排」列表
- **THEN** 每行操作列在「排课 / 排教室 / 查看」旁可见「修改记录」
- **AND** 即使该行尚无任何日志，「修改记录」仍可点击

#### Scenario: CRUD list shows change log on every row
- **WHEN** 用户打开课表节次维护、排课时间设置（各含子表行）、排课规则设置、我的调课申请、调课申请管理或公假日停课列表
- **THEN** 每行操作列始终可见「修改记录」

### Requirement: Unified change log drawer with filters

系统 MUST 提供统一的右侧修改记录抽屉。用户点击列表「修改记录」后 MUST 打开该抽屉，并展示对应实体或排课范围的日志。抽屉 MUST 提供按修改时间起止、操作人、修改字段的查询，以及重置。

#### Scenario: Open drawer for a scope row
- **WHEN** 用户在「按入学批次排」某行点击「修改记录」
- **THEN** 右侧抽屉打开
- **AND** 标题能识别该批次范围（如专业名称与入学批次）
- **AND** 可见查询区与日志表

#### Scenario: Filter by field
- **WHEN** 抽屉内选择某一修改字段并查询
- **THEN** 表格仅展示该字段相关的变更行

#### Scenario: Empty state
- **WHEN** 当前实体没有任何修改日志（或筛选后无结果）
- **THEN** 抽屉内展示明确空态文案（如「暂无修改记录」），而非空白无提示

### Requirement: Field-level before and after display

日志展示 MUST 包含修改时间、操作人、操作类型、修改字段、修改前内容、修改后内容。同一次保存若变更多个字段，MUST 仍占表中一行，并在「修改字段 / 修改前 / 修改后」单元格内分行对齐展示；按字段筛选时 MUST 命中包含该字段的整次变更行。

#### Scenario: Multi-field save stays on one row
- **WHEN** 一次保存同时修改了字段 A 与字段 B
- **THEN** 日志表仅出现一行
- **AND** 该行「修改字段」单元格内分行显示 A、B
- **AND** 「修改前」「修改后」单元格内对应分行显示各字段改前→改后

### Requirement: Persist process logs for arrange detail changes

在排时间 / 排教室详情页完成关键变更并成功落库后，系统 MUST 将过程记录追加到当前排课范围对应的修改日志中，以便入口列表「修改记录」可追溯。

#### Scenario: Place time slot writes arrange log
- **WHEN** 用户在排时间详情为某课程成功新排一节课
- **THEN** 对应该入口范围（批次/教师/课程）的修改日志增加至少一条记录
- **AND** 记录能反映安排从无到有的可读变更（字段与改前改后）

#### Scenario: Room lock or revoke writes arrange log
- **WHEN** 用户在排教室详情成功锁定或撤回教室安排
- **THEN** 对应该入口范围（星期/场地类型等）的修改日志增加过程记录
- **AND** 记录能体现教室状态或教室值的改前→改后

#### Scenario: Submit time scope writes arrange log
- **WHEN** 用户将某范围排时间结果成功提交至排教室
- **THEN** 该范围修改日志记录提交状态或等价过程变更

### Requirement: Persist logs for schedule setting and adjustment CRUD

课表节次、排课时间设置各子表、排课规则、调课申请（含撤销）、公假日停课等保存或删除成功后，系统 MUST 追加对应行级修改日志。

#### Scenario: Edit schedule rule writes log
- **WHEN** 用户修改并保存一条排课规则
- **THEN** 该规则行的修改日志包含被改字段的改前→改后

#### Scenario: Delete holiday writes log
- **WHEN** 用户删除一条公假日停课记录
- **THEN** 该记录的修改日志仍可打开（历史保留）
- **AND** 包含删除类操作记录

### Requirement: Scope limited to schedule module

本能力 MUST 仅挂载于排课管理相关列表与排课详情写点；MUST NOT 要求培养方案或开课管理菜单同步改造。

#### Scenario: Curriculum lists unchanged
- **WHEN** 用户打开方案版本管理或开课计划等非排课管理列表
- **THEN** 不因本变更强制新增统一「修改记录」抽屉入口（既有执行计划修改记录等保持原样）
