## Purpose

从校选课程管理中的 ME 课一键生成专业开课计划任务：按不可选专业与不可选年级学期初始化上课专业批次，多批次合成一条开课任务，并排除 CHS/MAT/PHY 专业。

## ADDED Requirements

### Requirement: Major offering plan exposes ME offering entry
专业开课计划工具栏 MUST 在「一键合班」右侧提供「ME开课」入口；用户点击后 MUST 打开用于选择 ME 课与上课专业批次的弹窗。

#### Scenario: Open ME offering modal from toolbar
- **WHEN** 用户在专业开课计划页点击「ME开课」
- **THEN** 系统打开弹窗，课程候选来自校选课程管理中 `electiveType = ME` 的课程

### Requirement: Course list is ME-only and college-scoped without programme filter on CHS/MAT/PHY colleges
弹窗课程列表 MUST 仅展示校选课程管理中的 ME 课。课挂在学院下而非专业；系统 MUST NOT 因 CHS/MAT/PHY 专业被排除而从课单中过滤掉对应学院挂出的 ME 课。

#### Scenario: ME course under college still listed
- **WHEN** 某 ME 课挂在某学院下，且该学院另有 CHS/MAT/PHY 等专业
- **THEN** 该 ME 课仍可出现在「ME开课」课程列表中（只要它是 ME）

### Requirement: Programme-batch picker excludes CHS, MAT and PHY
专业批次选择器 MUST NOT 展示专业代码为 CHS、MAT、PHY 的专业及其批次。这三专业的 ME 开课 MUST 不在本入口处理（另菜单，本期非目标）。

#### Scenario: CHS/MAT/PHY never appear as selectable programmes
- **WHEN** 用户在「ME开课」弹窗中浏览/搜索可上课专业批次
- **THEN** 列表中不出现 CHS、MAT、PHY 三个专业

### Requirement: Selectable batches initialize from school-elective exclusions
选课范围 MUST 按所选 ME 课在校选课程管理中的不可选专业、不可选年级学期初始化；用户 MUST 可在确认前调整勾选（在规则允许范围内）。

#### Scenario: Excluded programme batches start unchecked or disabled
- **WHEN** 用户选中一门 ME 课，且该课配置了不可选专业集合
- **THEN** 属于不可选专业的批次默认不可作为上课批次（初始化为禁用或未勾选且不可选），其余专业（除 CHS/MAT/PHY）可按规则勾选

#### Scenario: User may adjust within allowed scope before confirm
- **WHEN** 初始化完成后用户调整专业批次勾选并确认
- **THEN** 系统以用户最终勾选结果落库（仍须满足本规格中的排除与年级学期约束）

### Requirement: Excluded year-semester blocks batches whose current term maps to that slot
「不可选年级学期」MUST 解释为：对某个专业批次，若**当前开课学期**对该批次折算得到的结构年级学期码（如 `Y2S1`）落在该课的不可选年级学期集合内，则该批次对本课不可选。

#### Scenario: Batch at Y2S1 cannot take course excluding Y2S1
- **WHEN** 课的不可选年级学期包含 `Y2S1`，且某专业批次在当前开课学期折算为 `Y2S1`
- **THEN** 该专业批次在「ME开课」中默认不可选本课

#### Scenario: Same course selectable for batch not at excluded slot
- **WHEN** 课排除 `Y2S1`，另一专业批次在当前开课学期折算为非排除码（如 `Y1S2`）
- **THEN** 该批次可不被年级学期规则挡掉（仍受不可选专业与 CHS/MAT/PHY 排除约束）

### Requirement: Confirm creates one offering task for multiple batches
确认后系统 MUST 在当前开课学期的专业开课计划中新增教学班（类同生成开课任务）。同一门课勾选多个专业批次时 MUST **合成一条**开课任务（多批次挂同一教学班），不得按批次拆成多条任务。

#### Scenario: Multiple batches become one section
- **WHEN** 用户对一门 ME 课勾选专业批次 A、B 并确认
- **THEN** 专业开课计划仅新增一条对应该课的开课任务，且该任务包含 A、B 两个专业批次

#### Scenario: Single batch still one section
- **WHEN** 用户仅勾选一个专业批次并确认
- **THEN** 仍新增一条开课任务，挂该批次

### Requirement: Confirm requires at least one selectable batch
用户确认前 MUST 至少勾选一个允许的专业批次；否则系统 MUST 阻止提交并提示。

#### Scenario: Confirm without batch is rejected
- **WHEN** 用户未勾选任何专业批次点击确认
- **THEN** 系统不落库，并提示须选择上课专业批次
