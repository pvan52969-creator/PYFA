## Purpose

特殊开课安排页按专业开课样式二完成 Course Setting 与师资安排，只处理已生效的特殊开课，且不引入专业批次。

## ADDED Requirements

### Requirement: Style-two two-step arrangement

开课安排页 MUST 提供与专业开课安排相同的两步引导：Course Setting、师资安排。用户 MUST 可在两步之间切换且不离开本页。

#### Scenario: Default first step

- **WHEN** 用户打开特殊开课「开课安排」
- **THEN** 系统展示步骤条，默认停在 Course Setting
- **AND** 列表仅包含本学期已生效的特殊开课（`offeringType=other`）

#### Scenario: Switch to staffing step

- **WHEN** 用户点击步骤「师资安排」
- **THEN** 系统切换到师资安排视图
- **AND** 仍为同一批特殊开课任务，学期筛选不变

### Requirement: Arrangement blocked until plan is effective

未在计划页生效的特殊开课 MUST NOT 出现在开课安排列表。

#### Scenario: Draft plan not listed

- **WHEN** 某特殊开课计划仍为草稿（未生效）
- **THEN** 开课安排列表不包含该课

### Requirement: Teacher arrangement uses grouping page

用户 MUST 能从开课安排进入现有分组/教师安排页完成分组与安排教师，返回后回到特殊开课安排列表。

#### Scenario: Open grouping from arrangement

- **WHEN** 用户在特殊开课安排中点击「安排教师」（或等价入口）
- **THEN** 系统打开分组沉浸页
- **AND** 面包屑返回文案为「开课安排」

### Requirement: No programme batch on arrangement

开课安排的筛选与列表 MUST NOT 包含上课专业、上课批次（或入学批次）。

#### Scenario: No batch filters or columns

- **WHEN** 用户查看特殊开课安排
- **THEN** 筛选区与列表均无上课专业 / 上课批次 / 入学批次
