## Purpose

在共同授课组内支持同课号不同教学班，并将各班学时安排行绑定为联动组，便于后续排课同时间同教室，且开课界面可识别哪几条安排合在一起。

## ADDED Requirements

### Requirement: Shared teaching may include same course code different sections
系统 MUST 允许将同一开课学期内、至少两个教学班设为共同授课，教学班课号可以相同也可以不同。手工设置共同授课时 MUST 仍要求所选教学班至少有一名相同任课教师。系统 MUST NOT 仅因课号相同而拒绝建立共同授课。

#### Scenario: Same course code two sections can share teaching
- **WHEN** 用户为同一课号的两个不同教学班（同学期、至少一名相同任课教师）确认共同授课
- **THEN** 系统为两班写入同一共同授课标记

#### Scenario: Different course codes still allowed
- **WHEN** 用户为不同课号、满足共同教师条件的教学班确认共同授课
- **THEN** 系统照常写入共同授课标记

#### Scenario: Reject fewer than two sections
- **WHEN** 用户确认时有效教学班不足两个
- **THEN** 系统不得写入共同授课标记并提示原因

### Requirement: Slot links require shared teaching group
学时安排行级联动 MUST 仅能在已有共同授课标记的教学班之间建立。未设置共同授课的教学班 MUST NOT 建立联动。

#### Scenario: Entry hidden or blocked without shared teaching
- **WHEN** 当前教学班无共同授课标记
- **THEN** 「联动排课安排 / 管理联动安排」不可用或明确提示须先设置共同授课

### Requirement: Bind assignment rows when week range and weekly hours match
用户 MUST 能在「联动排课安排」界面中，从共同授课组内各教学班的学时安排行中选择至少两行建立联动组。系统 MUST 仅在所选行的**周次**与**周学时**完全一致时允许绑定。总学时、教师、场地类型、教室偏好 MUST NOT 作为绑定否决条件。

#### Scenario: Successful bind across sections
- **WHEN** 用户在共同授课组内勾选来自不同教学班、周次与周学时均一致的安排行并确认建立联动
- **THEN** 系统创建联动组，并将这些行关联在同一联动组中

#### Scenario: Same course code different sections can bind
- **WHEN** 用户勾选同课号不同教学班的安排行，且周次与周学时一致
- **THEN** 系统允许建立联动组

#### Scenario: Reject mismatched week range
- **WHEN** 所选行周次不一致
- **THEN** 系统禁止绑定并提示周次不一致

#### Scenario: Reject mismatched weekly hours
- **WHEN** 所选行周学时不一致
- **THEN** 系统禁止绑定并提示周学时不一致

### Requirement: Grouping assignment table shows link status
开课分组学时安排表 MUST 为已联动的安排行展示联动标识（含联动组编号），并 MUST 能查看该组内合在一起的其他安排行摘要（课号、教学班/小组、学时类型、周次、周学时等）。未联动行 MUST 显示为空或「—」。联动标识 MUST 与「同时授课」（本课内多小组）区分展示。

#### Scenario: Linked row shows link id and peers
- **WHEN** 某安排行属于联动组 #1，且组内还有另一教学班的安排行
- **THEN** 该行「联动」列显示联动组标识，用户可查看包含对端课号/教学班的摘要

#### Scenario: Unlinked row has empty link cell
- **WHEN** 某安排行不属于任何联动组
- **THEN** 「联动」列不显示有效联动组编号

### Requirement: Dedicated UI to create and clear slot links
系统 MUST 提供独立的「联动排课安排」界面，用于对照共同授课组内各教学班安排、建立联动与解除联动。入口 MUST 至少包括：共同授课设置中的「管理联动安排」，以及分组学时安排区域的「联动排课安排」（在已设共同授课时）。

#### Scenario: Open link manager from shared-teaching modal
- **WHEN** 用户在共同授课已设列表中点击「管理联动安排」
- **THEN** 打开联动排课安排界面，范围为该共同授课组

#### Scenario: Manual clear link group
- **WHEN** 用户在联动界面确认解除某一联动组
- **THEN** 该组内所有安排行不再关联，分组表联动列相应清空

### Requirement: Auto-clear links on conflicting edits with user notice
当联动组内任一条安排行被删除，或其周次或周学时被修改为与组内其他行不一致时，系统 MUST 自动解除该联动组，并 MUST 向用户提示已解除及原因。清除共同授课标记时，MUST 同时清除该标记下的全部联动组并提示（或等价明确反馈）。

#### Scenario: Week change breaks link
- **WHEN** 用户保存某已联动安排行的新周次，导致与组内其他行周次不一致
- **THEN** 系统解除该联动组并提示用户

#### Scenario: Delete assignment clears link
- **WHEN** 用户删除某已联动安排行
- **THEN** 系统解除该联动组并提示用户

#### Scenario: Clear shared teaching clears all slot links
- **WHEN** 用户清除某共同授课标记
- **THEN** 该标记下所有联动组被清除

### Requirement: Teaching load counts same teacher once per link group
对属于同一联动组的安排行，系统在 teaching load / 等价课时展示中 MUST 对同一教师只计一次（因同堂上）。开课侧 MUST NOT 要求联动行教师相同亦可绑定。

#### Scenario: Same teacher on two linked rows counts once
- **WHEN** 联动组内两行安排了同一教师
- **THEN** 该教师 teaching load（或原型等价展示）对该联动组只计一次

#### Scenario: Different teachers may still bind
- **WHEN** 用户绑定教师不同但周次与周学时一致的安排行
- **THEN** 系统允许建立联动组
