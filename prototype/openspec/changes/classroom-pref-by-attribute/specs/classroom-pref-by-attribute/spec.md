# Spec Delta

## Purpose

按场地类型分支教室偏好：普通教室仅设施 remark（可多选 + 可选 Others 文本），计算机/专业教室仍多选具体教室；三入口行为一致，切换类型清空偏好。

## ADDED Requirements

### Requirement: Preference mode depends on classroom attribute

When the user edits classroom preference for a hour-type row or assignment draft, the system SHALL choose the preference UI by the selected 场地类型（classroom attribute）. The column / field label SHALL remain **教室偏好**.

#### Scenario: Computer or specialized allows room multi-select

- **WHEN** 场地类型 is 计算机教室 or 专业教室
- **THEN** 教室偏好 SHALL offer multi-select of concrete classrooms filtered to that attribute
- **AND** the user MAY leave preference empty

#### Scenario: Normal forbids concrete rooms

- **WHEN** 场地类型 is 普通教室
- **THEN** 教室偏好 SHALL NOT offer concrete classroom codes to select
- **AND** 教室偏好 SHALL offer a multi-select of facility remark options instead

#### Scenario: Attribute required before preference

- **WHEN** 场地类型 has not been selected (empty)
- **THEN** 教室偏好 SHALL remain disabled or show a prompt to select 场地类型 first
- **AND** SHALL NOT allow selecting rooms or remarks

### Requirement: Normal-classroom remark options

For 普通教室, the 教室偏好 multi-select SHALL include exactly these options (storage values may be English codes; UI labels are Chinese in this change):

1. Desk Set for Computer Class Preferred  
2. Round Table Preferred  
3. Lecture Hall Preferred  
4. Large Whiteboard Required  
5. Smartboard Required  
6. Others  

#### Scenario: Multi-select remarks

- **WHEN** 场地类型 is 普通教室 and the user opens 教室偏好
- **THEN** the dropdown lists the six options above
- **AND** the user MAY select zero or more of options 1–5

#### Scenario: Others optional free text

- **WHEN** the user checks Others
- **THEN** a text input for custom remark SHALL appear
- **AND** the text input SHALL be optional (may remain empty)
- **AND** saving with Others checked and empty text SHALL be allowed

#### Scenario: Uncheck Others clears text

- **WHEN** the user unchecks Others
- **THEN** any previously entered Others text SHALL be cleared from the draft/edit state

### Requirement: Clearing preferences on attribute change

When the user changes 场地类型 on an editable row, the system SHALL clear all preference state for that row before applying the new mode.

#### Scenario: Switch from rooms to remarks

- **WHEN** the user changes 场地类型 from 计算机教室 or 专业教室 to 普通教室
- **THEN** previously selected classroom codes SHALL be cleared
- **AND** 教室偏好 SHALL show the remark multi-select with no selections

#### Scenario: Switch from remarks to rooms

- **WHEN** the user changes 场地类型 from 普通教室 to 计算机教室 or 专业教室
- **THEN** previously selected remark options and Others text SHALL be cleared
- **AND** 教室偏好 SHALL show the classroom multi-select with no selections

#### Scenario: Switch between computer and specialized

- **WHEN** the user changes 场地类型 between 计算机教室 and 专业教室
- **THEN** previously selected classroom codes SHALL be cleared
- **AND** the room list SHALL refresh to the new attribute’s classrooms

### Requirement: Chinese display for normal-classroom preferences

Read-only and chip/display surfaces for 普通教室 preferences SHALL show Chinese labels for the predefined remark options. Others free text SHALL display as entered. Concrete classroom codes (计算机/专业) SHALL continue to display as classroom codes.

#### Scenario: List or saved row shows Chinese remarks

- **WHEN** a saved preference for 普通教室 includes one or more predefined remarks
- **THEN** the display text uses the Chinese labels for those remarks
- **AND** if Others text is non-empty, that text is shown alongside

#### Scenario: Empty preference display

- **WHEN** 普通教室 has no remark selected and no Others text
- **THEN** the display SHALL show an empty / 无偏好 equivalent consistent with existing empty preference wording

### Requirement: Same rules across three offering entry points

The preference-by-attribute rules SHALL apply consistently in:

1. Offering grouping workspace · assignment draft row（安排草稿）  
2. Course / teaching-task classroom information editor（课程信息 · 学时教室区）  
3. Special course settings · course-code classroom defaults（特殊课程设置）

#### Scenario: Grouping draft follows attribute

- **WHEN** the user edits 场地类型 / 教室偏好 on an offering-grouping assignment draft
- **THEN** preference mode, remark options, Others behavior, and clear-on-change rules match this spec

#### Scenario: Course info hour rows follow attribute

- **WHEN** the user edits classroom attribute / preference on a teaching-task classroom hour row
- **THEN** the same rules apply per hour-type row

#### Scenario: Special course defaults follow attribute

- **WHEN** the user edits classroom defaults for a course code in 特殊课程设置
- **THEN** each hour-type row follows the same rules
- **AND** saved defaults retain remark vs room semantics so downstream init does not treat remarks as classroom codes
