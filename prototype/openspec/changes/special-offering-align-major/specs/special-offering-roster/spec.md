## Purpose

特殊开课名单页在任务安排提交后按开课任务维护学生，无预置名单，学生全部由教务手工添加或移除。

## ADDED Requirements

### Requirement: Roster list aligns with major roster entry

开课名单页 MUST 按已提交任务安排的特殊开课任务列出课程，并提供进入分组页维护名单的入口（对齐专业开课「管理名单」）。

#### Scenario: Open roster after arrangement submitted

- **WHEN** 用户打开特殊开课「开课名单」且本学期有已提交任务安排的特殊开课
- **THEN** 系统按开课任务展示这些课
- **AND** 每行可进入「管理名单」

#### Scenario: Empty when none submitted

- **WHEN** 本学期没有已提交任务安排的特殊开课
- **THEN** 名单列表为空态，说明需先在开课安排完成并提交

### Requirement: No preset roster

特殊开课 MUST NOT 按专业批次预置可修名单，也 MUST NOT 提供依赖批次预置的一键分配。学生只能手工添加或移除。

#### Scenario: Manual add student

- **WHEN** 用户在某特殊开课的管理名单中打开添加学生
- **THEN** 系统提供手工挑选学生并加入指定小组
- **AND** 不自动带入任何专业批次预置名单

#### Scenario: No batch one-click assign

- **WHEN** 用户在特殊开课名单/分组的学生名单视图
- **THEN** 系统不提供按专业批次预置或按批次一键分配的入口

### Requirement: No programme batch on roster list

名单列表与筛选 MUST NOT 包含上课专业、上课批次。

#### Scenario: Roster filters without programme

- **WHEN** 用户查看特殊开课名单页
- **THEN** 筛选与列表均无上课专业 / 上课批次
