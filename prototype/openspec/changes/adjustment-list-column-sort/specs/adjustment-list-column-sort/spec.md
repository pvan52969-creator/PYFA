## Purpose

为调课管理侧栏各主列表提供统一的表头列排序能力，让用户可按业务字段升/降序浏览筛选后的结果，并与全站其它列表排序交互一致。

## ADDED Requirements

### Requirement: Main list headers expose sortable data columns

在 Class Adjustment、调课申请审批、调课申请管理、调课申请记录、批量调课管理、公假日停课的主列表中，系统 SHALL 为可比较的业务数据列表头提供排序控件；序号列、勾选列与操作列 MUST NOT 提供排序。

#### Scenario: Data column shows sort affordance

- **WHEN** 用户打开上述任一板块的主列表
- **THEN** 业务数据列表头呈现可点击排序样式（含未激活时的双向指示）
- **AND** 序号、勾选、操作列表头不可点击排序

#### Scenario: Toggle ascending and descending

- **WHEN** 用户点击某一可排序列表头
- **THEN** 列表按该列升序排列并显示升序指示
- **AND** 再次点击同一列表头时切换为降序并显示降序指示

### Requirement: Sort applies to current filtered result set

系统 SHALL 先应用当前页的筛选（及页签过滤），再按用户选择的列与方向排序后渲染行；切换筛选或页签后 MUST 仍按当前排序状态作用于新的结果集（若该页仍使用同一排序状态键）。

#### Scenario: Filter then sort

- **WHEN** 用户已设置筛选条件且选择了某列排序
- **THEN** 表格仅展示符合筛选的行，且这些行按所选列排序

#### Scenario: Change tab keeps list-local sort where applicable

- **WHEN** 用户在同一页面内切换页签（如审批「待审批 / 已提交 / 全部」或公假日「管理 / 记录」）且各页签使用各自排序状态
- **THEN** 各页签列表按各自已保存的排序状态渲染，互不覆盖

### Requirement: Teacher Class Adjustment lists remain sortable

Class Adjustment（教师端）主列表若已具备排序，系统 SHALL 保持该能力；若某子列表仍缺可排序表头，系统 SHALL 按与其它申请列表相同的规则补齐。

#### Scenario: Existing teacher list still sortable after change

- **WHEN** 用户打开 Class Adjustment 中已支持排序的主列表并点击业务列
- **THEN** 列表仍按该列升/降序重排，行为不回退为静态表头

### Requirement: Row index follows visible order

排序后，序号列 SHALL 按当前可见行从上到下重新编号（从 1 起），不保留排序前的原序号。

#### Scenario: Index renumbers after sort

- **WHEN** 用户对列表排序导致行顺序变化
- **THEN** 第一行序号为 1，后续行依次递增
