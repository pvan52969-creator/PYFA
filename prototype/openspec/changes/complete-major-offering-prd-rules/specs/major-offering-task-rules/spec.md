## Purpose

Defines the missing task-arrangement rules for major offering so developers can implement activation, capacity, and revert/withdraw behavior without relying on undocumented prototype quirks.

## ADDED Requirements

### Requirement: Group capacity hard limits on task submit

Before任务安排生效, the system SHALL validate group capacity totals for each section that has groups:

- 各组人数上限合计 MUST NOT exceed 课程人数上限（计划总人数 + 预留名额）
- 各组人数上限合计 MUST NOT be less than 计划总人数（不足则拦截生效并提示具体原因）

#### Scenario: Capacity total below planned headcount blocks submit

- **WHEN** 教学班计划人数为 96，各组上限合计仅为 80，用户尝试生效任务安排
- **THEN** 系统拒绝生效并提示分组上限合计低于计划人数

#### Scenario: Capacity total above course limit blocks submit

- **WHEN** 各组人数上限合计超过课程人数上限
- **THEN** 系统拒绝生效并提示不可超过课程人数上限

### Requirement: Task activation hour validation matrix

On任务安排生效, the system SHALL apply this matrix (default same as prototype):

| 条件 | 行为 |
|------|------|
| 分组结构错误 / 非法学时投递等致命错误 | 硬拦截，不可生效 |
| 学时投递合计不足计划学时 | 警示，允许确认后仍生效 |
| 学时投递合计超过计划学时 | 二次确认后可生效 |
| 无任课教师，或存在未确认教师 | 硬拦截，不可生效 |

#### Scenario: Under-hour warning still allows activation after confirm

- **WHEN** 分组学时合计低于计划学时但结构合法且教师均已确认
- **THEN** 系统展示不足警示，用户确认后仍可生效

#### Scenario: Missing teacher confirmation blocks activation

- **WHEN** 仍有授课教师未确认（且未代确认）
- **THEN** 系统拒绝生效

### Requirement: Zero-hour sections still need teachers when grouped path requires them

If a section has 学时分类全为 0 but the activation path still requires teacher arrangement completeness, the system SHALL block activation when teachers are missing, and the PRD MUST state this explicitly so zero-hour courses are not assumed exempt.

#### Scenario: Zero-hour without teachers cannot activate

- **WHEN** 学时全为 0 且尚未安排教师的教学班尝试任务生效
- **THEN** 系统拒绝生效并提示尚未安排教师（除非产品另行定义豁免；默认不豁免）

### Requirement: Withdraw vs revert side-effect inventory

The system SHALL document and implement:

| 操作 | 计划状态 | 任务状态 | 合班 | 分组/教师 | 学生名单分组 |
|------|----------|----------|------|-----------|--------------|
| 撤回 | 仍为已生效 | → 草稿 | 保留 | 保留 | 重置 |
| 退回（至计划） | → 回退 | 清空安排 | **保留** | 清空 | 清空安排侧 |
| 名单页退回安排 | 仍为已生效 | → 草稿 | 保留 | 可再改安排 | 名单可保留 |

Withdraw MUST be blocked when the section already has排课结果.

#### Scenario: Withdraw blocked when schedule exists

- **WHEN** 教学班已有排课时段，用户点击撤回
- **THEN** 系统拒绝撤回并提示先撤销排课

#### Scenario: Revert keeps merge structure

- **WHEN** 用户从开课安排退回开课计划
- **THEN** 合班结构保留，分组与教师清空，计划状态为回退

### Requirement: Shared drawer rules with plan layer

开课安排「修改教学任务」SHALL reuse 开课计划 rules for:

- 学时分类与排场地/考勤默认（本 change 一并写入 V4）
- 计划人数三口径、开关默认值、抽屉保存校验、起止周生命周期（本 change 计划能力）

PRD V4 for 开课安排 MUST cross-reference the plan PRD sections rather than duplicating conflicting text, live in its own version folder, and use a **V2→V4** change note.

#### Scenario: Arrangement PRD points to plan headcount modes

- **WHEN** 阅读开课安排 V4 中修改教学任务字段说明
- **THEN** 计划总人数三种口径与开课计划 V4 一致，并含交叉引用

### Requirement: Task PRD V4 documents activation and side effects

The《开课安排》PRD V4 and its **V2→V4** change note SHALL include the group-capacity rules, hour validation matrix, zero-hour teacher rule, and the withdraw/revert inventory that keeps merge on revert (replacing any “合班拆回” wording).

#### Scenario: No auto-split wording remains

- **WHEN** 检索开课安排 V4 中「退回」相关段落
- **THEN** 文案描述为保留合班、手动拆分，不再写自动合班拆回

#### Scenario: Change note compares V2 to V4

- **WHEN** 打开开课安排 V4 文件夹内的变更说明
- **THEN** 文件名与正文均为 V2→V4，且不依赖已删除的 V3
