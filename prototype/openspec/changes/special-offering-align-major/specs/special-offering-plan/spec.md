## Purpose

特殊开课计划页让教务从课程库手动加课并维护本学期特殊开课计划，交互对齐专业开课计划，但不绑定专业批次、不从执行计划生成。

## ADDED Requirements

### Requirement: Sidebar labels match major offering

「特殊开课」一级分组下的二级菜单 MUST 为「开课计划」「开课安排」「开课名单」。三页 MUST 可从侧栏进入（不得以 hidden 下线）。

#### Scenario: Open special offering plan from sidebar

- **WHEN** 用户在开课管理侧栏点击「特殊开课 → 开课计划」
- **THEN** 系统展示特殊开课计划页
- **AND** 该页可查询、可添加课程

### Requirement: Manual add from course catalog

特殊开课计划 MUST 提供从教务课程库勾选课程并加入本学期计划的入口。系统 MUST NOT 从已提交执行计划生成特殊开课任务。

#### Scenario: Add courses from catalog

- **WHEN** 用户选择开课学期并在课程库勾选一门或多门课确认添加
- **THEN** 系统为每门课创建特殊开课计划行（`offeringType=other`）
- **AND** 新行不绑定上课专业或入学批次

#### Scenario: No generate-from-exec-plan control

- **WHEN** 用户查看特殊开课计划页工具栏
- **THEN** 系统不提供「生成开课任务」
- **AND** 提供手动添加入口

### Requirement: Plan page chrome aligns with major plan

计划页 MUST 具备与专业开课计划同类的查询区、列表与批量操作（查询/重置、勾选、生效、删除）。主添加按钮文案 MUST 反映手动添加，而不是生成。

#### Scenario: Submit selected plans

- **WHEN** 用户勾选未生效的特殊开课计划并点击生效
- **THEN** 系统将选中行标为已生效
- **AND** 已生效计划可进入「开课安排」

#### Scenario: Delete selected draft plans

- **WHEN** 用户勾选允许删除的特殊开课计划并确认删除
- **THEN** 系统从本学期特殊开课计划中移除这些行

### Requirement: No programme batch binding on plan

计划列表与筛选 MUST NOT 展示或依赖上课专业、上课批次。预置人数列 MUST NOT 出现。

#### Scenario: Plan list has no batch columns

- **WHEN** 用户查看特殊开课计划列表
- **THEN** 看不到「上课专业」「上课批次」「预置人数」列
- **AND** 筛选区没有上课专业 / 上课批次条件
