## Purpose

定义教师端调课、停课、加课、补课的菜单入口、页面 Tab、说明文案与发起动作，使补课从停课记录勾选发起，加课并入调课申请页。

## ADDED Requirements

### Requirement: 教师端两个菜单

系统 MUST 在排课管理侧栏为教师提供两个入口：`调课申请（教师端）` 与 `补课申请（教师端）`。系统 MUST NOT 再提供独立的 `加课申请（教师端）` 菜单。

#### Scenario: 侧栏入口

- **WHEN** 用户打开排课管理侧栏
- **THEN** 可见「调课申请（教师端）」和「补课申请（教师端）」
- **AND** 不可见「加课申请（教师端）」

### Requirement: 调课申请页两个 Tab 与说明

`调课申请（教师端）` 页面 MUST 在页头下方提供两个 Tab：**Class Replacement** 与 **Class Addition**。每个 Tab MUST 在查询区上方展示本 Tab 专属说明板块，文案如下。

Class Replacement：

- 标题：Class Replacement
- 正文：Adjust the classes in the scheduled timetable.
- 附注：Public Holiday does not require Management approval; other reasons require approval from School/Department Management or the Academic Affairs Office.

Class Addition：

- 标题：Class Addition
- 正文：Add extra classes to the scheduled timetable.
- 附注：Subject to approval by School/Department Management or the Academic Affairs Office.

系统 MUST NOT 把其中一个 Tab 的说明显示在另一个 Tab。

#### Scenario: 切换 Tab 只换本 Tab 说明与列表

- **WHEN** 用户进入调课申请（教师端）
- **THEN** 默认激活 Class Replacement Tab，并看到该 Tab 说明
- **WHEN** 用户切换到 Class Addition
- **THEN** 说明换成 Class Addition 文案，列表与操作换成加课

### Requirement: Class Replacement 只含调课与停课

Class Replacement Tab 的申请列表 MUST 只包含类型为调课或停课的申请。该 Tab MUST 提供发起调课、发起停课。该 Tab MUST NOT 提供发起补课或发起加课。类型筛选 MUST 只有调课、停课（及全部）。

#### Scenario: Replacement 列表不含补课加课

- **WHEN** 当前教师存在调课、停课、补课、加课申请
- **THEN** Class Replacement 列表只出现调课与停课
- **AND** 操作栏可见发起调课、发起停课，不可见发起补课、发起加课

### Requirement: Class Addition 只含加课

Class Addition Tab 的申请列表 MUST 只包含类型为加课的申请。该 Tab MUST 提供发起加课。该 Tab MUST NOT 提供发起调课、停课或补课。

#### Scenario: Addition 发起加课

- **WHEN** 用户在 Class Addition Tab 点击发起加课
- **THEN** 打开加课申请流程（选择课程/上课小组并填写加课节次）

### Requirement: 补课页从停课记录发起

`补课申请（教师端）` 页面 MUST 列出当前教师**已通过**且尚未被补课占用的停课课节，支持多选。**Apply** MUST 对已勾选停课课节发起补课（对应这些节次）。未勾选时点击 Apply，系统 MUST 提示先勾选停课记录，且 MUST NOT 打开空白补课单。

**New Replacement** MUST 发起与停课记录无关的调课（选择已排节次，而不是停课记录）。

该页 MUST NOT 把加课作为主操作。

#### Scenario: 勾选停课后 Apply 即补课

- **WHEN** 用户在补课申请页勾选一条或多条已通过停课记录并点击 Apply
- **THEN** 打开补课申请，所选停课课节已带入，补课设置对应该几节课

#### Scenario: 未勾选 Apply

- **WHEN** 用户未勾选任何停课记录并点击 Apply
- **THEN** 系统提示需要先勾选停课记录
- **AND** 不打开补课申请

#### Scenario: New Replacement 是调课

- **WHEN** 用户在补课申请页点击 New Replacement
- **THEN** 打开调课申请（从已排课表选节次，不从停课记录选）
