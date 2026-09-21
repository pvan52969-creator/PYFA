## Purpose

规定补课申请如何从所选停课记录继承原因类型、事由与附件：同一原因类型可合并为一张申请，不同原因类型必须分批，并让教师看见冲突。

## ADDED Requirements

### Requirement: Makeup application has a single reason type
一张补课申请 MUST 只携带一种原因类型。系统 MUST 根据所选停课记录（含左侧合并行拆开后的每一条停课）判定原因类型是否一致。原因类型不一致时，系统 MUST NOT 提交该补课申请。

#### Scenario: Same reason type can apply together
- **WHEN** 用户勾选多条已通过停课记录，其原因类型相同，并填写补课设置后提交
- **THEN** 申请提交成功，原因类型与停课一致

#### Scenario: Mixed reason types cannot submit
- **WHEN** 用户勾选的停课记录包含两种及以上原因类型并点击提交
- **THEN** 系统阻止提交，并提示按相同原因类型分批申请补课

### Requirement: Mixed types show a visible conflict
当所选停课原因类型不一致时，补课抽屉右侧 MUST 仍展示原因类型与事由区域，并 MUST 说明存在冲突（不得只显示空白只读框且无解释）。系统 MUST 提示按相同原因类型分批申请。

#### Scenario: Drawer shows conflict instead of empty inherit
- **WHEN** 用户在补课抽屉勾选原因类型不同的停课记录
- **THEN** 右侧可见冲突说明，原因类型不能当作已成功同步的单一类型
- **AND** 提交仍被阻止

#### Scenario: Apply from list with mixed types
- **WHEN** 用户在补课申请页勾选原因类型不同的停课记录并点击 Apply
- **THEN** 打开补课抽屉并进入同样的冲突说明状态
- **AND** 不把原因显示成已成功从某一条停课同步

### Requirement: Same type merges reasons and attachments
当原因类型一致但事由或附件不完全相同时，系统 MUST 将事由去重后一并展示（只读），MUST 将附件按文件名去重后取并集，并 MUST 允许作为一张补课申请提交。系统 MUST NOT 只采用第一条停课的事由/附件而丢弃其余。

#### Scenario: Same type different reason texts
- **WHEN** 用户勾选两条原因类型相同、申请事由不同的停课记录
- **THEN** 右侧事由只读展示包含这两条事由（去重后）
- **AND** 可以提交为一张补课申请

#### Scenario: Same type unions attachments
- **WHEN** 用户勾选两条原因类型相同、附件不同的停课记录
- **THEN** 右侧附件列表包含这些附件的并集（按文件名去重）

### Requirement: Makeup reason stays inherited and read-only
补课申请的原因类型、事由 MUST 继续从停课记录继承，教师 MUST NOT 在补课单上改成其他原因类型或另写一套事由。本要求 MUST NOT 改变调课、停课、加课申请中由申请人自行选择原因类型、填写事由的行为。

#### Scenario: Makeup fields remain locked
- **WHEN** 补课抽屉已成功同步单一原因类型
- **THEN** 原因类型与事由为只读返显，不能改成其他类型

#### Scenario: Reschedule still self-fills reason
- **WHEN** 用户发起调课申请
- **THEN** 仍可自行选择原因类型并填写申请事由
