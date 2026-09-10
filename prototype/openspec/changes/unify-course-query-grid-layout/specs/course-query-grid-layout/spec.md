## Purpose

约定开课管理列表查询区按 6 列等宽排布：第一行铺满，数量不足只出现在最后一行；教师端「导出」与「授课确认」同一行。

## ADDED Requirements

### Requirement: Query fields fill six equal columns

开课管理列表查询栅格 MUST 使用 6 列等宽。收起态第一行筛选项 MUST 为 6 个（该页筛选项总数不少于 6 时）。展开区 MUST 同样按 6 列排布。任一视觉行的字段数少于 6 时，MUST 只出现在最后一行。查询 / 重置 / 展开 MUST 单独占满一行并靠右，MUST NOT 与筛选项抢同一行格子。筛选项的含义与过滤逻辑 MUST NOT 因挪动可见/展开位置而改变。

#### Scenario: Manifest first row has six fields

- **WHEN** 用户打开课程班列表且筛选区为收起
- **THEN** 第一行显示 6 个等宽筛选项，查询按钮在下一行靠右

#### Scenario: Incomplete row is last only

- **WHEN** 用户展开课程班、教师替换或排课计划的筛选区
- **THEN** 除最后一行外每一行都有 6 个筛选项；若有不足 6 个的行，只出现在最后一行

#### Scenario: Teaching Load equal widths

- **WHEN** 用户打开 Teaching Load 查询区
- **THEN** 六个筛选项等宽排列；查询与重置在下一行靠右，不与字段挤在同一行

#### Scenario: TCC admin equal widths

- **WHEN** 用户打开授课确认管理查询区且为收起
- **THEN** 第一行有 6 个等宽筛选项；搜索、重置、展开在下一行靠右

### Requirement: Teacher portal export shares the confirmation row

授课确认（教师端）在待确认列表展示「授课确认」时，MUST 将「导出」放在同一行：授课确认在左，导出靠右。MUST NOT 在该行上方再单独放一排仅含导出的工具栏。

#### Scenario: Export stays with confirm action

- **WHEN** 教师端 Pending 列表显示授课确认按钮
- **THEN** 导出与授课确认出现在同一行，导出在右侧
