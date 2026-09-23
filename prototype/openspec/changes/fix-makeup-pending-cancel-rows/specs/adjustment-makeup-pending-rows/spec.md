## Purpose

规定教师端补课 Pending Replacement 中「已通过停课课节池」如何按课堂拆行、对齐真实停课日期，以及同申请单号多行展示规则，保证可勾选补回的课节与停课详情一致。

## ADDED Requirements

### Requirement: Only approved cancel sessions enter Pending Replacement
Pending Replacement 停课表 MUST 只展示 `type` 为停课、状态为已通过、且尚未被进行中或已通过补课占用的课节。调课、加课、未通过停课 MUST NOT 进入该表作为可勾选补课来源。

#### Scenario: Approved cancel session appears
- **WHEN** 某停课申请已审批通过，且其中某课堂尚未有进行中或已通过的补课
- **THEN** 该课堂以一行出现在 Pending Replacement 停课表中，可供勾选申请补课

#### Scenario: Non-cancel or blocked session excluded
- **WHEN** 记录为调课/加课，或该停课课堂已有进行中/已通过补课
- **THEN** 该课堂不作为可勾选行出现在 Pending Replacement 停课表中

### Requirement: One cancel application splits into one row per class session
一张停课申请若包含多个停课课堂，审批通过后 MUST 按课堂拆成多行。同一申请单的多行 MUST 共用同一 Ref. ID（申请单号）。每一行 MUST 对应一个待补回课节，不得把多堂课合并成一行。

#### Scenario: Multi-session cancel shows multiple rows with same Ref. ID
- **WHEN** 已通过停课申请 TK00xx 含 2 个及以上停课课堂，且这些课堂尚未被补课占用
- **THEN** Pending Replacement 表出现对应行数
- **AND** 这些行的 Ref. ID 均为该申请单号

#### Scenario: Detail and list session counts match
- **WHEN** 用户打开该停课申请详情看到 N 条原上课课堂
- **THEN** 在未被补课占用的前提下，Pending Replacement 中属于该单号的可勾选行数为 N（或为其中尚未占用的子集，但不得把不同课堂塌成更少的错误日期行）

### Requirement: Each row uses that session's own previous schedule
每行的 Date、Week、Day、Time、Venue MUST 取该课堂自身的原上课信息，并与该申请详情中对应课堂的 Previous 字段一致。系统 MUST NOT 用申请内第一条课堂的日期覆盖其余课堂，也 MUST NOT 在已有具体停课日期时改用周模板首周日期冒充。

#### Scenario: Different sessions keep different dates
- **WHEN** 同一停课申请中课堂 A 原上课日为 06 Apr、课堂 B 为 07 Apr，且均可补课
- **THEN** Pending Replacement 中对应两行分别显示 06 Apr 与 07 Apr（及各自节次）
- **AND** 不得出现两行都显示同一错误日期而另一真实日期从列表消失

#### Scenario: List date matches detail Previous
- **WHEN** 用户对照详情某行 Previous 的 Date / Time 与 Pending Replacement 同申请同行
- **THEN** Date 与 Time（及 Week / Day / Venue 在有值时）一致

### Requirement: Deduplicate only identical sessions
系统 MUST 仅在「同一申请单 + 同一课程组 + 同一日期 + 同一节次」判定为同一课节时去重。不同课堂即使星期/节次模板相同，只要日期或课程组不同，MUST 保留分行。

#### Scenario: True duplicate collapses
- **WHEN** 数据源因回绑或种子错误产生两条完全相同的课节键（同单号、同课程组、同日期、同节次）
- **THEN** Pending Replacement 只保留一行

#### Scenario: Same weekday template different dates stay separate
- **WHEN** 同单号下两堂课星期与节次模板相同但停课日期不同
- **THEN** 仍显示两行，日期各不相同

### Requirement: Makeup picker shares the same session pool
补课申请抽屉中用于勾选的停课记录来源 MUST 与 Pending Replacement 停课表遵循同一套拆行、日期与去重规则，避免列表正确而抽屉仍展示塌缩或错误日期。

#### Scenario: Apply drawer shows same sessions as list
- **WHEN** 教师从 Pending Replacement 勾选若干停课课节并打开补课申请
- **THEN** 抽屉内可选停课记录的课节身份与日期与列表一致
