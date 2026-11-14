# Spec Delta

## Purpose

排时间详情侧栏展示开课侧联动组并支持查看详情，联动学时同排不可拆；上课批次可跳转按批次排，便于核对合班多批次。

## ADDED Requirements

### Requirement: Time sidebar shows link group under shared-teaching course code

排时间详情（`scheduleDetailPhase` 为时间）左侧课程卡 SHALL 在「共同授课课号」字段正下方展示「联动组」字段。有所属联动组时 MUST 显示组名；无所属联动组时 MUST 显示「—」。排教室详情侧栏 MUST NOT 因本能力新增该字段或改变既有字段顺序。

#### Scenario: Unit belongs to a link group

- **WHEN** 用户打开排时间详情，且当前学时单元对应开课安排行已加入某联动组
- **THEN** 该课程卡在「共同授课课号」下方显示「联动组」及该组组名

#### Scenario: Unit has no link group

- **WHEN** 用户打开排时间详情，且当前学时单元未加入任何联动组
- **THEN** 「联动组」字段显示「—」，且不可点击打开详情

### Requirement: Link group name opens read-only link detail

当「联动组」显示有效组名时，组名 SHALL 可点击；点击 MUST 打开只读联动详情（展示该联动组绑定的各方课号/安排摘要），且 MUST NOT 因点击而切换当前选中的课程卡。无联动组（「—」）时 MUST NOT 表现为可点击链接。

#### Scenario: Click link group name

- **WHEN** 用户在排时间侧栏点击某课程卡上的联动组组名
- **THEN** 系统弹出该联动组的只读详情，且侧栏当前选中课程保持不变

### Requirement: Linked hour units schedule together and cannot be split

对属于同一联动组的学时单元，排时间落格、改格、清除 MUST 将组内各方在同一目标星期/节次/周次上同进同出。系统 MUST NOT 允许仅安排或仅清除联动组中的单方学时而留下另一方仍占用不同（或空缺）时间。若目标格导致任一方无法同排（硬冲突且用户未确认继续等既有规则），MUST 整组不落或整组回退，不得半成功。

#### Scenario: Place one linked unit places peers

- **WHEN** 用户为联动组中一方学时单元排入某星期节次周次，且组内各方均可按既有冲突规则落格
- **THEN** 组内各方均获得同一星期节次周次的安排

#### Scenario: Clear one linked unit clears peers

- **WHEN** 用户清除联动组中一方在某格的安排
- **THEN** 组内各方在该联动占用上的对应安排一并清除

#### Scenario: Partial place is rejected

- **WHEN** 用户尝试只为联动组单方落格，而按规则无法为组内其余方同落
- **THEN** 系统不完成单方落格，并提示需联动同排（或沿用既有冲突提示且不留下半组结果）

### Requirement: Class batch label navigates to batch schedule

排时间详情侧栏「上课批次」字段，在具备固定上课批次时 SHALL 将每个批次文案渲染为可点击链接（交互对齐授课教师链接：阻止冒泡、不切换课程卡选中）。点击某一批次 MUST 进入该专业+入学批次的「按批次排课」时间详情。无固定上课批次（显示「—」）时 MUST NOT 可点击。合班多批次（顿号连接多个批次）时，每个批次 MUST 各自可点。

#### Scenario: Single batch jump

- **WHEN** 课程卡上课批次为单一固定批次（如 MEC-2024/09），用户点击该批次文案
- **THEN** 系统打开该专业与入学批次对应的按批次排课时间详情

#### Scenario: Multi-batch jump

- **WHEN** 课程卡上课批次为合班多批次（顿号连接），用户点击其中某一个批次文案
- **THEN** 系统仅打开被点击批次对应的按批次排课时间详情

#### Scenario: No fixed batch

- **WHEN** 课程卡上课批次为「—」（无固定上课批次）
- **THEN** 批次文案不可点击，行为与改造前一致
