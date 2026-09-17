## Purpose

为教务提供跨教师、学生、专业批次与场地的混选空闲时间查询，在指定学期与周次区间内按对象一行汇总空闲节次，支撑找共同空档与调补课安排。

## ADDED Requirements

### Requirement: Sidebar entry under timetable query group

系统 MUST 在排课管理侧栏「课表查询」分组中提供「空闲时间查询」入口，点击后进入独立页面（不得仅作为「课表查询」页内 Tab）。

#### Scenario: Open free time query from sidebar
- **WHEN** 用户点击侧栏「空闲时间查询」
- **THEN** 主区展示空闲时间查询页
- **AND** 页面标题可识别为「空闲时间查询」

### Requirement: Mixed object selection with time and venue filters

查询区 MUST 支持学年学期、周次区间、星期、节次、场地，以及对象混选（教师、学生、专业批次、场地可同时勾选多类、多个）。周次区间 MUST 允许用户选择单周或多周（起止周，起=止即单周）。查询条件布局 MUST 遵守「一行最多 3 个条件，按钮组在第一行右侧」标准。

#### Scenario: Mix teacher and programme batch
- **WHEN** 用户同时选择至少一名教师与至少一个专业批次，并指定周次区间后点击查询
- **THEN** 结果列表同时包含这些教师行与专业批次行

#### Scenario: Single week via equal range
- **WHEN** 用户将周次起、止均设为同一周（如 3～3）并查询
- **THEN** 空闲汇总仅基于该单周计算

#### Scenario: Multi-week range
- **WHEN** 用户将周次设为 3～5 并查询
- **THEN** 空闲汇总覆盖第 3、4、5 周（在已选星期与节次范围内）

#### Scenario: Weekday and period narrow the universe
- **WHEN** 用户仅勾选「星期一」与节次「1-2」后查询
- **THEN** 空闲结果只在该星期与节次宇宙内判定与展示，不得展开未选星期或未选节次

#### Scenario: Venue as object and as filter
- **WHEN** 用户在对象中勾选若干教室，或在场筛选条件中限定场地
- **THEN** 系统按所选范围计算并展示对应空闲（对象行展示所选教室；筛选条件收窄时间/占用判定所用场地范围时行为一致且可理解）

### Requirement: One row per object with free-slot summary

结果 MUST 以列表展示，**一行对应一个已选对象**。每行 MUST 展示对象类型、对象标识（名称/工号学号/批次等）、以及在当前筛选范围内的空闲节次汇总文案。空闲 MUST 定义为：在筛选的周次×星期×节次宇宙中，该对象无已排课（或场地无占用）的节次；连续节次 MUST 合并为区间展示（如 `1-2,5-6`）。

#### Scenario: Row count matches selected objects
- **WHEN** 用户选中 2 名教师、1 个专业批次后查询且均有可计算数据
- **THEN** 列表恰好 3 行（每对象一行）

#### Scenario: Free slots shown as merged ranges
- **WHEN** 某对象在周一第 1、2、5、6 节均空闲且这些节次在筛选范围内
- **THEN** 该行空闲汇总以合并区间形式展示（如含 `1-2` 与 `5-6`），而非四个孤立节次号（若同星期多段则按星期组织可读）

#### Scenario: Fully busy object still listed
- **WHEN** 某已选对象在筛选范围内没有任何空闲节次
- **THEN** 该对象仍占一行
- **AND** 空闲汇总展示明确空态（如「无空闲」），不得从列表中省略该行

#### Scenario: Empty selection
- **WHEN** 用户未选择任何对象即点击查询
- **THEN** 系统提示需选择对象，或不产生误导性全量结果（不得默默列出无关全校对象）

### Requirement: Query reset and export

页面 MUST 提供查询与重置。重置 MUST 恢复筛选与对象选择的默认态并清空或回到未查询提示。页面 MUST 提供按当前查询条件导出列表的能力（原型可用下载/提示演示）。

#### Scenario: Reset clears filters
- **WHEN** 用户点击重置
- **THEN** 周次、星期、节次、场地与对象选择回到默认
- **AND** 列表回到未查询或空提示态

#### Scenario: Export after query
- **WHEN** 用户已查询出至少一行结果并执行导出
- **THEN** 导出内容对应该次查询结果列表（原型可为 CSV/文本下载或等价演示）
