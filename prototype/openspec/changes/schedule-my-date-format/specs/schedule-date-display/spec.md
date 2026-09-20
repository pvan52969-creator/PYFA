## Purpose

规定排课管理模块中日历日期如何展示给用户，使列表、详情、日期选择器与马来分校习惯一致，同时不改变内部存储与比较用的 ISO 日期。

## ADDED Requirements

### Requirement: Calendar dates display in Malaysian format
排课管理模块中面向用户的日历日期 SHALL 展示为 `DD Mon YYYY`（日两位、英文三字母月份、四位年），例如 `04 Jan 2026`、`06 Oct 2025`。该要求覆盖 `SCHEDULE_PAGE_IDS` 下的列表、详情、抽屉与弹窗中的日历日期列/字段。

#### Scenario: Makeup pending cancel list shows Malaysian date
- **WHEN** 教师打开 Pending Replacement（教师端）待补课停课列表
- **THEN** 停课日期列显示 `06 Oct 2025` 这类格式，而不是 `2025-10-06`

#### Scenario: Apply drawer previous date matches the same format
- **WHEN** 用户在调课/补课申请抽屉查看 Previous 行的日期
- **THEN** 该日期与列表使用同一马来格式

### Requirement: Date pickers use the same format
排课管理模块中的自定义日期选择器 SHALL 用同一马来格式回显已选日期；日历标题 SHALL 为 `Mon YYYY`（如 `Jan 2026`）；星期表头 SHALL 为英文缩写 Mon–Sun。空值按钮文案可以保持「选择日期」等占位，不显示假日期。

#### Scenario: User picks a date in the apply drawer
- **WHEN** 用户在申请抽屉点击「选择日期」并选中 `2026-04-01`
- **THEN** 按钮文案变为 `01 Apr 2026`，日历标题为 `Apr 2026`，表头为 Mon–Sun

### Requirement: Storage remains ISO
系统 MUST 继续以 `YYYY-MM-DD`（或带时间的 ISO）存储、比较、提交日期；展示格式化 MUST 只发生在渲染层。无法解析的空值或非日期文本 MUST 原样或按现有空态（「—」）展示，不得编造日期。

#### Scenario: Submit still uses ISO
- **WHEN** 用户提交调课申请且界面显示 `01 Apr 2026`
- **THEN** 内部状态与提交数据仍为 `2026-04-01`

### Requirement: Datetime fields convert date and clock to 12-hour display
含时钟的展示字段 SHALL 把日期部分改为马来格式，并把时间改为 12 时制 `h:mm AM/PM`，例如 `04 Jan 2026 2:30 PM`。存储与比较仍为 `YYYY-MM-DD HH:mm`。周次（第 N 周）与列表中的中文星期列不在本要求内。

#### Scenario: Submitted-at column
- **WHEN** 调课申请列表展示提交时间且原始值为 `2026-09-20 14:30`
- **THEN** 用户看到 `20 Sep 2026 2:30 PM`

### Requirement: Scope is scheduling module only
本能力 MUST 仅作用于排课管理模块。培养方案、开课管理页面的日期展示不因本能力改变。原生 `<input type="date">` 的浏览器自带外观不在本能力强制范围内；其旁边或结果表中的日期文本仍须符合马来格式。

#### Scenario: Course offering pages unchanged
- **WHEN** 用户进入开课管理任一列表
- **THEN** 该模块日期展示不因本能力改为 `04 Jan 2026`
