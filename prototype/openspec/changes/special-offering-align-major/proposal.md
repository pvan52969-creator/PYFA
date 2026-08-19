## Why

特殊开课与专业开课同属「计划 → 安排 → 名单」链路，但侧栏文案、计划入口、安排页形态仍是旧壳（任务安排未用样式二，三页还带 `hidden`）。教务需要同一套操作习惯；特殊开课的课不是从执行计划生成，而是从课程库手动添加，且不绑专业批次、名单无预置。

## What Changes

- 侧栏「特殊开课」二级菜单对齐专业开课：**开课计划 / 开课安排 / 开课名单**；取消三页 `hidden`，模块重新上线。
- **开课计划**：布局与操作对齐专业开课计划页；入口由「生成开课任务」改为从教务课程库**手动添加**；不展示、不绑定上课专业 / 上课批次。
- **开课安排**：改为专业开课样式二（Course Setting / 师资安排）；分组与安排教师复用现有 `#page-offering-grouping`。
- **开课名单**：列表与「管理名单」入口对齐专业开课名单页；**无预置名单**，学生全部手工添加。
- 状态流对齐专业开课用词：计划「生效」后方可进入安排；安排提交后方可维护名单。
- **不搬**专业开课中依赖专业批次的能力：从执行计划生成任务、预置/招生计划人数、按批次筛/列、按批次一键分配名单。

## Capabilities

### New Capabilities

- `special-offering-plan`: 特殊开课计划——课程库手动加课、不绑专业批次、计划页交互对齐专业开课（生效/删除等）
- `special-offering-arrange`: 特殊开课安排——样式二分步（Course Setting / 师资安排），复用分组沉浸页
- `special-offering-roster`: 特殊开课名单——无预置、纯手工加学生，列表入口对齐专业开课名单

### Modified Capabilities

- （无：`openspec/specs/` 尚无已归档主规格。）

## Impact

- 侧栏：`index.html` `#sidebar-nav-course` 特殊开课分组
- 页面：`#page-course-offering-other`、`#page-course-special-offering-task`、`#page-course-special-offering-roster`（去 hidden、改壳与列表）
- 逻辑：`app.js` 现有 `renderOtherOffering*` / `renderCourseSpecialOffering*`；加课弹窗保留课程库勾选
- 分组：`OFFERING_GROUPING_RETURN_LABELS` 文案随菜单改名
- 数据：继续 `offeringType=other`；不写 programmeKey / intake
- 非目标：改专业开课 / 选修开课；从执行计划生成特殊开课；为特殊开课做预置名单；本期不默认搬「按专业批次合班 / Support」（无批次时语义未确认）
