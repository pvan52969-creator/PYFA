## ADDED Requirements

### Requirement: Plan page shows demand and quota progress

通识选修开课计划页 MUST 在列表上方展示本学期需求要点与当前开课单位（学院）的配额进度（已开组数 / 保底下限）。

#### Scenario: College sees quota progress

- **WHEN** 用户打开某学期通识选修开课计划
- **THEN** 系统展示该学院（或当前视角学院）actualGroups 与 minGroups
- **AND** actualGroups ≥ minGroups 时标记为已达标（可超额）

### Requirement: Submit blocked when below minimum groups

学院提交开课计划前，系统 MUST 校验本学院本学期已开（或拟开）组数不少于 AC 分配的 minGroups。

#### Scenario: Block submit under minimum

- **WHEN** 用户提交开课计划且 actualGroups < minGroups
- **THEN** 系统阻止提交
- **AND** 提示尚差的组数

#### Scenario: Allow submit at or above minimum

- **WHEN** 用户提交开课计划且 actualGroups ≥ minGroups
- **THEN** 系统允许按既有计划提交流程继续（进入任务安排）

### Requirement: Courses digest groups freely within count rules

学院可自行决定用几门课消化组数：允许一门课多个组，也允许多门课各一个组；系统只累计组数是否达到下限。

#### Scenario: One course multiple groups

- **WHEN** 学院为一门通识选修计划设置多个组
- **THEN** 各组计入 actualGroups

#### Scenario: Multiple courses one group each

- **WHEN** 学院添加多门课且每门一个组
- **THEN** 各组合计计入 actualGroups

### Requirement: Supply vs roster boundary

通识选修开课模块（计划/任务）MUST 管理供给侧：组数与每组人数上限；学生名单落地由选课应用负责。

#### Scenario: Capacity is group upper bound

- **WHEN** 学院设置某组人数上限
- **THEN** 该上限作为供给容量
- **AND** 系统不在本模块强制按执行计划预置专业批次名单作为主路径（开放选课）

### Requirement: Keep school-elective course add path

学院仍 MUST 能从「校选课程管理」库中选择课程加入本学期开课计划；配额约束叠加在加组/提交上，不取消手工选课。

#### Scenario: Add course from school elective catalog

- **WHEN** 用户从校选课程库添加一门状态正常的 GE 课程到计划
- **THEN** 系统创建开课计划行（既有行为）
- **AND** 该课后续组数计入配额进度
