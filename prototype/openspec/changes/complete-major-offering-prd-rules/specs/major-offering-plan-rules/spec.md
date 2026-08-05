## Purpose

Defines the missing plan-layer business rules for major offering plans so PRD V4 and formal development share the same acceptance criteria as the interactive prototype.

## ADDED Requirements

### Requirement: Planned headcount has three edit modes

The system SHALL treat「计划总人数」according to enrollment type and intake:

- 老生（非新生）且不开放选课：只读，等于预置可修人数。
- 新生且不开放选课：只读，等于招生计划人数。
- 开放选课：可手工编辑；保存时必填且须为大于等于 0 的数字。

#### Scenario: Open enrollment requires editable planned headcount

- **WHEN** 用户在「修改教学任务」中将选课类型设为开放选课并保存
- **THEN** 系统要求计划总人数已填写；保存成功后以手工值为准，并清除仅适用于不开放选课的预置名单依赖（若有）

#### Scenario: Closed enrollment keeps headcount read-only

- **WHEN** 选课类型为不开放选课且教学班为老生批次
- **THEN** 计划总人数只读展示预置可修人数，用户不可在抽屉中改写

### Requirement: Teaching-task switch defaults on create

When a major offering section is created or fields are first filled, the system SHALL apply these defaults if the field has no value:

- 选课类型 = 不开放选课
- 是否排课 = 是
- 是否录入成绩 = 是
- 是否排考 = 是
- 是否排场地 / 是否考勤 = 按学时分类规则（学时全为 0 → 否；否则 → 是；已有值不覆盖）

#### Scenario: Exam scheduling defaults to yes

- **WHEN** 新生成的教学班尚未设置是否排考
- **THEN** 系统将是否排考置为「是」

### Requirement: Edit-drawer save validation

Saving「修改教学任务」SHALL require:

- 起止周非空且周次落在学期教学周内
- 预留名额已填且 ≥ 0
- 开放选课时计划总人数已填且 ≥ 0
- 在计划已生效且任务未生效时，仅允许保存教室类可改项；任务已生效时整抽屉只读不可保存业务变更

#### Scenario: Missing week range blocks save

- **WHEN** 用户清空起止周并确认保存
- **THEN** 系统拒绝保存并提示起止周必填

### Requirement: Week range lifecycle

The system SHALL default起止周 to the term teaching weeks (1–N) on generation. After the user explicitly adjusts week range, the system MUST NOT silently reset it to the term default on subsequent open/save cycles.

#### Scenario: User-adjusted weeks are sticky

- **WHEN** 用户将起止周从默认 1–N 改为自定义周次并保存
- **THEN** 再次打开抽屉仍显示用户保存的周次，不被学期默认覆盖

### Requirement: Merge and one-click merge side effects

After a successful merge (row merge, one-click merge, or generate-and-auto-merge), the system SHALL:

- 累加计划人数与预留名额（按合入批次分摊规则汇总到合班）
- 清空分组、教师安排，以及场地类型 / 教室安排偏好
- 将任务安排状态重置为未生效草稿（若该班已进入安排流程）
- 要求合班双方教学任务开关与学分/总学时/起止周等前提已满足（见 V4 合班前提与学时默认规则）

#### Scenario: Merge clears classroom preferences

- **WHEN** 两个兼容教学班完成合班
- **THEN** 合班结果班的教室安排偏好与场地类型被清空，且分组与教师被清空

### Requirement: Revert to plan keeps combined class

When the user退回开课计划 from 开课安排, the system SHALL:

- 将计划状态置为回退
- 清空分组、教师与任务安排侧数据
- **保留合班结构**（不自动拆回单批次）；用户须在合拆班中手动拆分

#### Scenario: Revert does not auto-split merge

- **WHEN** 用户对已合班教学班执行「退回」开课计划
- **THEN** 计划变为回退且安排数据清空，但专业批次仍保持合班，不自动拆成多个独立班

### Requirement: Plan delete hard rule

The system SHALL allow deleting a plan section only when it is not in「已生效」状态. Already-submitted plans MUST be reverted before delete is allowed.

#### Scenario: Submitted plan cannot be deleted

- **WHEN** 用户勾选已生效计划行并执行删除
- **THEN** 系统拒绝删除并提示须先退回/回退

### Requirement: PRD V4 documents the above against V2

The《开课计划》PRD V4 SHALL live in its own version folder and ship with a **V2→V4** change note (not V3). It SHALL document all requirements in this capability, including field-table remarks for 计划总人数 and 是否排考 that match these defaults and edit modes, plus 学时分类与排场地/考勤默认关系.

#### Scenario: Field sample matches exam default

- **WHEN** 阅读 V4 字段表「是否排考」样例与业务规则
- **THEN** 样例与默认规则均为「是」，且不再出现与退回自动拆班矛盾的状态图文案

#### Scenario: Change note compares V2 to V4

- **WHEN** 打开开课计划 V4 文件夹内的变更说明
- **THEN** 文件名与正文均为 V2→V4，且不依赖已删除的 V3
