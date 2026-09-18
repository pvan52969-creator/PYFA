## Purpose

让排课管理里超过一行的筛选栏默认只露出第一行三个条件，用无边框半三角展开或收起其余条件，减少占高并统一入口形态。

## ADDED Requirements

### Requirement: Default collapse extra filter rows

排课管理模块中，凡「上查询、下列表」且查询条件超过一行（超过 3 个条件格）的筛选栏，系统 MUST 默认只展示第一行最多 3 个条件以及第一行右侧的查询/重置。第二行及以下条件 MUST 默认隐藏。日期范围等「一组控件」仍算 1 个条件。

#### Scenario: Open a multi-row filter page
- **WHEN** 用户进入条件超过 3 个的排课管理列表或查询页（如课表冲突查询、学生课表密度）
- **THEN** 可见条件仅为第一行最多 3 项加查询/重置
- **AND** 第二行及以下条件不可见

#### Scenario: Single-row filter page has no fold
- **WHEN** 用户进入条件不超过 3 个的页面（如课表节次维护、调课申请教师端主列表）
- **THEN** 筛选栏不出现展开/收起控件
- **AND** 全部条件保持可见

### Requirement: Caret-only toggle with no border

超过一行的筛选栏 MUST 在第一行按钮组（查询/重置）右侧提供展开/收起控件。该控件 MUST 无描边、无「展开」「收起」文案，仅显示半三角图标：收起态三角朝下，展开态三角朝上。控件 MUST 提供可访问名称（如 aria-label「展开筛选」/「收起筛选」）。

#### Scenario: Expand extra filters
- **WHEN** 用户在收起态点击半三角
- **THEN** 第二行及以下条件显示
- **AND** 三角改为朝上
- **AND** 查询/重置仍在第一行右侧，不沉到最后一行

#### Scenario: Collapse extra filters
- **WHEN** 用户在展开态再次点击半三角
- **THEN** 第二行及以下条件隐藏
- **AND** 三角改回朝下
- **AND** 已填写的隐藏条件值仍保留，查询仍按全部条件生效

### Requirement: Same behavior on density and drawer filters

学生课表密度、教师课表密度的筛选栏 MUST 采用同一套默认收起与半三角交互（学生密度现有带边框「展开」文字按钮 MUST 替换为该三角）。调课申请抽屉左侧「选择上课节次」筛选若超过一行，MUST 同样默认收起第二行并用半三角展开。

#### Scenario: Student density default
- **WHEN** 用户打开课表密度查询的学生 Tab
- **THEN** 默认只见学期、学生学号、学生姓名与查询/重置及半三角
- **AND** 不出现带边框的「展开」文字按钮

#### Scenario: Teacher density also folds
- **WHEN** 用户打开课表密度查询的教师 Tab
- **THEN** 默认只见第一行三个条件与查询/重置及半三角
- **AND** 其余条件需点三角后才可见

#### Scenario: Adjustment apply left filters
- **WHEN** 用户打开发起调课/停课等抽屉且左侧筛选超过一行
- **THEN** 默认只见第一行三个条件与查询/重置及半三角
- **AND** 日期范围等第二行条件默认隐藏
