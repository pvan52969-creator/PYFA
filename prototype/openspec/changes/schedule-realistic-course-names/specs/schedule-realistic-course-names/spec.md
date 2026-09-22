## Purpose

规定排课管理模块演示数据中课程班名称与课程组短名须像学校真实开课，而不是带 Studio/Demo/Conflict 等测试标签的假课名。

## ADDED Requirements

### Requirement: Demo course titles look like catalog courses
排课管理模块中面向用户的课程班名称 SHALL 使用接近课程目录的英文课名（例如 `Financial Accounting`、`Introduction to Finance`、`General Biology`）。用户可见课名 MUST NOT 包含明显演示标签，例如 `Studio`、`Demo`、`Conflict`、`Anchor`、`Probe`、`Pad`、`Query Demo`。

#### Scenario: Makeup pending shows a believable title
- **WHEN** 教师打开补课 Pending 停课清单
- **THEN** 课程班名称列为真实风格英文课名，而不是 `Teacher Timetable Studio`

#### Scenario: Conflict query list titles are realistic
- **WHEN** 用户打开课表冲突查询列表
- **THEN** 课程班名称列同样为目录风格课名，且页面文案中无 `Studio` / `Demo ·` 一类演示标签课名

### Requirement: Group short names stay short and conventional
排课模块中课程组短名 SHALL 为常规短名（例如 `A组`、`Group1`、`Group2`）。短名 MUST NOT 默认拼成 `课名小组1` 或整段复用课程班名称。用户可见完整课组仍 SHALL 为 `课程班名称（短名）`，需要人数时再附 `（n）`。

#### Scenario: Makeup pending group is course plus short name
- **WHEN** 教师打开补课 Pending 停课清单
- **THEN** 课程组列显示如 `Financial Accounting（A组）`，而不是 `Teacher Timetable Studio（Teacher Timetable Studio小组1）` 或单独的演示桩组名

#### Scenario: Room-side card group uses short name
- **WHEN** 用户在排教室详情查看课程卡片上的课程组
- **THEN** 课程组为 `课程班名称（短名）` 或带人数后缀，短名本身不含整段课名

### Requirement: Demo codes may stay distinct but titles must not look fake
排课演示任务可继续使用独立课号（三位字母 + 三位数字，避免与真实开课任务冲突），但对应课程班名称 MUST 仍满足真实课名要求。内部任务 id、停课单号、演示标记可以不变。

#### Scenario: Li Ming makeup row uses realistic title under CTS101 or successor code
- **WHEN** 补课 Pending 因演示种子列出李明的停课行
- **THEN** 该行课程班名称与课程组均为真实风格，且无 `Teacher Timetable Studio` / `Studio` / `Demo` 字样

### Requirement: Time and room surfaces stay independent except for these values
排时间详情与排教室详情 SHALL 同步采用真实化后的课名与课组短名。本能力 MUST NOT 改变两侧的交互、右键菜单、校验或默认态。

#### Scenario: Arranging time still works the same
- **WHEN** 用户在排时间详情查看课程卡片上的课号、课名、课组
- **THEN** 课名与课组已真实化，拖排、锁定、提交行为与改前一致

### Requirement: Scope is scheduling module only
本能力 MUST 仅作用于排课管理模块（含调课/停课/补课演示数据）。开课管理、培养方案（含方案 TAB3「课程组」）的列名与数据不因本能力改变。

#### Scenario: Offering task page unchanged
- **WHEN** 用户打开专业开课任务安排
- **THEN** 该页仍用开课原有列名与数据，不因本能力改写
