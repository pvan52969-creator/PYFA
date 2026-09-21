## Purpose

规定排课管理模块中课号、课名、课组如何展示给用户，使列表、卡片与开课侧/学校习惯一致，同时不改变开课数据模型和排课交互。

## ADDED Requirements

### Requirement: Course code uses school shape and Course Code label
排课管理模块中面向用户的课号 SHALL 展示为学校课号形态：三位大写字母加三位数字（例如 `ACC101`），不得使用带连字符的演示桩（例如 `CTQ-TS1`）。对应列表列名 SHALL 为 **Course Code**。无法解析的空值 SHALL 按现有空态（「—」）展示。

#### Scenario: Makeup pending list shows school course code
- **WHEN** 教师打开补课 Pending 停课清单
- **THEN** Course Code 列显示 `ACC101` 这类课号，而不是 `CTQ-TS1`

#### Scenario: Conflict query list uses the same code shape
- **WHEN** 用户打开课表冲突查询列表
- **THEN** 课号列同样为三位字母加三位数字，列名为 Course Code

### Requirement: Course name uses English class title and 课程班名称 label
排课管理模块中面向用户的课名 SHALL 展示为英文课程班名称（例如 `Financial Accounting`、`Introduction to Finance`），不得使用 `Query Demo · …` 这类演示桩。对应列表列名 SHALL 为 **课程班名称**。

#### Scenario: Makeup pending course title matches offering
- **WHEN** 教师打开补课 Pending 停课清单
- **THEN** 课程班名称列为英文课程名，而不是 `Query Demo - Teacher Slot`

### Requirement: Group displays as course title plus short name
排课管理模块中面向用户的课组 SHALL 展示为 `课程班名称（小组短名）`，例如 `Financial Accounting（A组）`。对应列表列名 SHALL 为 **课程组**。需要附人数时 SHALL 写在课程组名之后，例如 `Financial Accounting（A组）（45）`。短名仍可以是 `A组`、`Group1` 等已有分组名，但用户看到的完整课组不得只剩 `教师时段演示组` 这类与课程名无关的桩。

#### Scenario: Makeup pending group matches offering grouping format
- **WHEN** 教师打开补课 Pending 停课清单
- **THEN** 课程组列显示 `Financial Accounting（A组）` 这类格式，而不是单独的 `教师时段演示组`

#### Scenario: Count suffix stays after the group label
- **WHEN** 某列表需要展示课程组人数
- **THEN** 文案为 `Financial Accounting（A组）（45）`，而不是只用短名加人数

### Requirement: Demo seeds use the same visible format
排课模块写入演示课号、课名、课组时，用户可见字段 MUST 符合上述三项格式。内部任务 id、停课单号、演示标记可以不变。

#### Scenario: Teacher slot demo no longer looks like a test stub
- **WHEN** 补课 Pending 因演示种子列出李明的停课行
- **THEN** 该行 Course Code / 课程班名称 / 课程组均为学校形态，而不是 `CTQ-TS1` / `Query Demo` / `教师时段演示组`

### Requirement: Time and room surfaces stay independent except for these labels
排时间详情与排教室详情 SHALL 同步采用同一套课号、课名、课组展示规则。本能力 MUST NOT 改变两侧的交互、右键菜单、校验或默认态。

#### Scenario: Arranging time still works the same
- **WHEN** 用户在排时间详情查看课程卡片上的课号、课名、课组
- **THEN** 三项文案已按学校格式展示，拖排、锁定、提交行为与改前一致

### Requirement: Scope is scheduling module only
本能力 MUST 仅作用于排课管理模块（含调课/停课/补课）。开课管理、培养方案（含方案 TAB3「课程组」）的列名与数据不因本能力改变。

#### Scenario: Offering task page unchanged
- **WHEN** 用户打开专业开课任务安排
- **THEN** 该页仍用开课原有列名与数据，不因本能力改写
