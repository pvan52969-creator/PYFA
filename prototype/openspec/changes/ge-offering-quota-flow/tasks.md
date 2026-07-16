## 1. 主数据与 Mock

- [x] 1.1 增加 `SCHOOL_GE_STREAM_MAP`（学院 → arts/business/science）与文案常量（交叉选课规则）
- [x] 1.2 增加 `GE_OFFERING_DEMAND_MOCK`（按学期：总人数、分学院、分大类、批次摘要）
- [x] 1.3 增加 `GE_OFFERING_QUOTA_BY_TERM`（refGroupSize、categoryTotals、colleges[].minGroups）
- [x] 1.4 GE section/计划行支持 `plannedGroupCount`（计划阶段计组；任务落组后可对齐）

## 2. 导航与页面壳

- [x] 2.1 侧栏「通识选修课开课」增加：通识选修开课需求、通识选修小组配额
- [x] 2.2 `index.html` 增加两页 section 骨架（学期筛选、表格/表单区、说明 hint）
- [x] 2.3 `goPage` / 渲染入口挂接

## 3. 开课需求页

- [x] 3.1 渲染学期需求摘要（总人数、文商理、参考每组人数若已定配额）
- [x] 3.2 渲染学院×人数表与批次摘要（mock）
- [x] 3.3 展示交叉选课规则与「演示数据 / 正式来自执行计划修读要求」说明

## 4. 小组配额页（AC）

- [x] 4.1 编辑 refGroupSize、文/商/理总组数
- [x] 4.2 按学院编辑 minGroups（带 stream 列）
- [x] 4.3 保存写入 `GE_OFFERING_QUOTA_BY_TERM`；可选提示学院下限合计 vs 大类总组数

## 5. 开课计划页改造

- [x] 5.1 顶部增加需求要点 + 配额进度（已开/下限，超额标达标）
- [x] 5.2 列表或编辑支持维护 plannedGroupCount / 组容量（参考 refGroupSize）
- [x] 5.3 提交前校验 actualGroups ≥ minGroups，不达标则阻止并提示差额
- [x] 5.4 保留从校选课库添加课程的既有流程

## 6. 联调与说明

- [x] 6.1 造一套演示数据：某学院差 1 组不可提交、补组后可提交
- [x] 6.2 任务安排/名单页不改边界；确认名单仍走开放选课语义
- [x] 6.3 在需求页或 docs 短注：正式开发联动执行计划「选修类分类 · 修读要求」
