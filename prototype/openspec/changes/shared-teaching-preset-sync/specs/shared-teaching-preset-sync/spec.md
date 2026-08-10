## Purpose

在特殊课程设置按课号维护共同授课关联课号，并在开课安排用「一键同步共同授课」按当前列表可见数据与师资条件批量绑定或解除共同授课；历史复制不带入上学期共同授课结果。

## ADDED Requirements

### Requirement: Special course settings can associate peer course codes for shared teaching
特殊课程设置 MUST 支持按课号维护共同授课关联课号（仅课号，不预绑具体开课安排/教学班）。未配置关联课号的课号 MUST NOT 被「一键同步共同授课」新建绑定。

#### Scenario: Maintain peer course codes for a course
- **WHEN** 用户在特殊课程设置中为课号 A 保存关联课号 B（及可选更多课号）
- **THEN** 系统持久化该关联，并在列表/详情中可查看 A 的共同授课关联课号

#### Scenario: Course without peer association is not auto-bound
- **WHEN** 课号 C 未配置任何共同授课关联课号
- **THEN** 「一键同步共同授课」不得仅为 C 与其它课新建共同授课绑定

#### Scenario: Preset is course-code level only
- **WHEN** 同一课号在同学期存在多条开课安排
- **THEN** 预置仍只表达课号间关联；具体哪些教学班绑定由同步时按教师条件判定

### Requirement: History copy must not bring shared-teaching bindings
从以往学期复制开课安排（开课安排工具栏「一键复制」或分组工作台「复制」）时，系统 MUST 复制小组、学时、教师、教室等安排内容，MUST NOT 复制或带入源学期的共同授课绑定（教学班 `sharedTeachingCode` 及同伴关系）。

#### Scenario: One-click history copy leaves shared teaching empty
- **WHEN** 用户对目标学期教学班执行历史学期一键复制，且源学期该课已有共同授课绑定
- **THEN** 目标班获得小组/教师等安排后，共同授课状态为未绑定（无共同授课标记）

#### Scenario: Grouping-page history copy leaves shared teaching empty
- **WHEN** 用户在分组工作台对当前课执行「复制」历史安排，且源学期已有共同授课绑定
- **THEN** 复制完成后当前课共同授课为未绑定

### Requirement: One-click sync binds eligible courses using preset peers and teachers
开课安排 Style2 工具栏 MUST 提供「一键同步共同授课」。执行时系统 MUST 依据：当前列表可见教学班全集、已安排任课教师、特殊课程设置中的关联课号，对满足条件的教学班自动绑定共同授课标记。满足条件至少 MUST 包括：两班课号彼此在预置关联中、课号不同、且至少有一名相同任课教师。同步 MUST NOT 依赖用户勾选。

#### Scenario: Sync binds two associated course codes that share a teacher
- **WHEN** 课号 A、B 在特殊课程设置中互相（或成组）关联，当前列表可见的同学期安排中存在至少一名相同任课教师，且用户点击「一键同步共同授课」
- **THEN** 系统将满足条件的对应教学班绑定为共同授课，列表「共同授课状态」为 Y，并可展示彼此课号

#### Scenario: Sync does not bind without common teacher
- **WHEN** 课号 A、B 已关联但当前可见安排中无相同任课教师，且用户点击「一键同步共同授课」
- **THEN** 系统不为 A、B 新建共同授课绑定

### Requirement: One-click sync clears bindings that lost common teachers only
「一键同步共同授课」MUST 解除「当前已无共同教师」的共同授课绑定。教师移除等编辑操作 MUST NOT 自动即时解除共同授课；须通过再次同步刷新。同步 MUST NOT 解除「纯手工绑定且课号不在共同授课预置关联内」的绑定（即使同步时也无共同教师，仍保留该手工绑定，直至用户手工处理）。同步 MUST NOT 仅因「已不在预置关联」而解除仍有共同教师的绑定。

#### Scenario: After removing the only common teacher on a preset-related binding, sync clears the mark
- **WHEN** 两门因预置关联而绑定（或可被同步管理）的共同授课课，因从任一门移除教师导致无共同教师，且用户再次点击「一键同步共同授课」
- **THEN** 系统解除这两门课的共同授课绑定

#### Scenario: Manual binding outside preset is preserved by sync
- **WHEN** 两门课为纯手工共同授课绑定，且其课号不在特殊课程设置共同授课关联内，即使当前已无共同教师，用户点击「一键同步共同授课」
- **THEN** 系统不解除该手工绑定

#### Scenario: Removing teacher alone does not clear the mark
- **WHEN** 用户仅从一门已绑定共同授课的课中移除教师导致无共同教师，且未执行一键同步
- **THEN** 共同授课绑定仍保持，直至用户执行一键同步（且该绑定属于同步可解除范围时才被解除）

### Requirement: Sync scope follows list visibility and permission
「一键同步共同授课」的作用范围 MUST 为当前开课安排列表中用户可见的专业开课教学班全集（不依赖勾选）。学院管理员仅能看到本开课单位数据时，同步 MUST 仅作用于这些可见数据；教务处可见全校数据时，同步 MUST 可作用于全校可见全集。执行后系统 MUST 向用户反馈绑定数量与解除数量（或等价摘要）。

#### Scenario: College admin sync only affects own offering unit rows
- **WHEN** 学院管理员在开课安排列表仅可见本开课单位教学班，并点击「一键同步共同授课」
- **THEN** 同步只处理这些可见教学班，不改动其不可见的其他开课单位数据

#### Scenario: Academic affairs sync uses school-wide visible list
- **WHEN** 教务处用户可见全校开课安排列表，并点击「一键同步共同授课」
- **THEN** 同步处理当前列表可见的全校专业开课教学班全集

#### Scenario: User sees sync result summary
- **WHEN** 一键同步执行完成
- **THEN** 系统展示本次新绑定与解除的数量摘要，并刷新列表共同授课相关列
