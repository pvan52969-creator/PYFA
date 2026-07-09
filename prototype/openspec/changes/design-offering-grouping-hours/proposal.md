## Why

XMUM 旧教务系统（参考视频：正常 / 合班 / 分班 / 合分班）在「专业开课计划 → 课程班 → 分组 → 教师学时」链路中，用**计划行、教学班、小组**三层结构解决跨专业批次合上与容量拆分问题，但 L/T/P/O 学时归属、全组共上 vs 分组独上的规则隐含在多处界面中，新系统需要一套更清晰、可校验、可排课的数据模型。

当前原型已具备合拆班抽屉、分组弹窗、教师学时安排等 UI 雏形，但三层实体关系与学时投递范围（Delivery Scope）尚未统一建模，存在重复字段与语义冲突风险。

## What Changes

- 梳理旧系统合分班 → 课程班 → 小组 → 教师学时的业务链路，形成对照文档（见 `design.md`）
- 定义新系统四层实体模型：**计划行（Offering Line）→ 教学班（Section）→ 教学小组（Group）→ 学时投递（Hour Delivery）**
- 明确 L/T/P/O 四类学时的**课程基准配额**与**投递实例**分离：基准来自培养方案/开课计划，投递挂靠在「教师 + 学时类型 + 投递范围 + 周次」上
- 区分 **Section 级共上**（Lecture 全组一起）与 **Group 级独上**（Tutorial / Practical 按小组）
- 合班前提条件与旧系统对齐并扩展校验（课程号、起止周、教学周数、总学时、L/T/P/O 分项一致）
- 分班/合分班后自动生成 Group 子实体，而非仅在列表复制行
- 教师安排从「仅挂 Section」升级为「Section 级 + Group 级」双模式，合并学时（mergeHours）仅影响排课粒度

## Capabilities

### New Capabilities

- `offering-section-grouping`: 计划行生成、合班/分班/合分班、教学班与教学小组的 CRUD 及容量校验
- `teaching-hour-delivery`: L/T/P/O 学时基准、教师学时投递、共上/分组投递范围、合并学时与排课前置校验

### Modified Capabilities

- （无既有 spec，均为新建）

## Impact

- 专业开课模块：`COURSE_OFFERING_PLAN_STORE` 数据模型（sections / groups / groupAssignments / teacherAssignments）
- 合拆班抽屉、分组弹窗、安排老师/学时安排弹窗的字段与校验逻辑
- 后续排课模块：需消费 Hour Delivery 的 scope（section | group）与 mergeHours 标志
- 参考文档：`docs/course-offering-workflow.html`、原型 `app.js` 中 merge/split/group 相关函数
