## Purpose

Defines query, expand/collapse, column-aligned filters, fuzzy text, headcount range, and CSV export behavior for Course Management page-level lists.

## ADDED Requirements

### Requirement: Page-level lists expose query, reset, and export

开课管理侧栏可见菜单的页级主列表 MUST 在查询区提供「查询」「重置」「导出」。导出 MUST 使用当前筛选后的全部行（不分页），格式为 UTF-8 BOM CSV。无符合条件的数据时 MUST 提示且不下载文件。导出列 MUST 对应该表可见数据列，MUST NOT 包含勾选、操作、纯入口列。

#### Scenario: Export filtered rows

- **WHEN** 用户设置筛选条件后点击「导出」且存在匹配行
- **THEN** 系统下载 CSV，内容为筛选全集而非当前页，文件名含页面名与日期

#### Scenario: Export with empty result

- **WHEN** 当前筛选无匹配行并点击「导出」
- **THEN** 系统提示暂无符合条件的数据可导出，且不下载文件

### Requirement: Filters align with visible data columns

查询栏 MUST 尽量覆盖该表可见数据列。勾选列、操作列、操作记录入口、课程信息入口 MUST NOT 作为筛选字段。字段过多时 MUST 默认只展示高频项，其余放在「展开筛选」中；收起后 MUST 仍应用已填的展开区条件。

#### Scenario: Expand more filters

- **WHEN** 用户点击「展开筛选」
- **THEN** 系统显示其余筛选项，按钮文案变为「收起」

#### Scenario: Collapsed filters still apply

- **WHEN** 用户在展开区填写条件后收起，再点击「查询」
- **THEN** 列表仍按包含展开区在内的全部已填条件过滤

### Requirement: Text is fuzzy and enums are exact

文本输入筛选 MUST 按大小写不敏感的包含匹配。枚举下拉 MUST 按选项值精确匹配。空条件 MUST 视为不限制该列。

#### Scenario: Fuzzy course code

- **WHEN** 用户在课程代码框输入部分字符并查询
- **THEN** 列表只保留课程代码包含该字符串的行

### Requirement: Headcount uses an inclusive range

人数类字段 MUST 提供「从」「到」两个数字输入。只填一端 MUST 视为开区间；两端皆空 MUST 视为不限制。开课计划人数筛 MUST 使用预置人数。开课名单人数筛 MUST 使用实际导入名单人数。

#### Scenario: Preset count range on offering plan

- **WHEN** 用户在开课计划填写预置人数从 20 到 40 并查询
- **THEN** 列表只保留预置人数落在闭区间 [20, 40] 的行

#### Scenario: Imported roster count on offering roster

- **WHEN** 用户在开课名单填写人数从 10 到空并查询
- **THEN** 列表只保留实际导入名单人数大于等于 10 的行

### Requirement: Class programme filter label

开课计划查询区原「专业」标签 MUST 显示为「上课专业」。该条件 MUST 仍按上课专业过滤，MUST NOT 改为所属专业。

#### Scenario: Filter by class programme

- **WHEN** 用户在开课计划选择上课专业为 FIN 并查询
- **THEN** 列表只保留上课专业包含 FIN 的行，所属专业为 ACC、上课专业含 FIN 的合班课仍出现
