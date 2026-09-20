## Why

排课「操作流程图」现在只是五段文字卡片，开课同名页已经是带色块、箭头、图例的 SVG 流程图。两边入口一样、体验差一截，排课侧栏模块也看不出先后关系。

## What Changes

- 把 `#page-schedule-workflow` 改成与开课流程图同一套呈现：图例 + `diagram-area` SVG 节点图 + 阶段说明（可保留模块清单作脚注）。
- 主路径仍是：排课基础设置 → 排课表时间 → 排课表教室 → 课表查询 → 调课管理；各阶段下列出对应侧栏入口。
- 联合排课、自动排课/排教室、场地冲突、课表密度、调课配置类入口作为支路节点，不改主路径语义。
- 图源抽到独立 HTML（对齐 `docs/course-offering-workflow.html`），本页 fetch 挂载，不再用 `app.js` 内联五段卡片。
- **不改**排时间 / 排教室详情页交互（遵守时间教室独立性）；**不改**开课流程图。

## Capabilities

### New Capabilities

- `schedule-operation-workflow`: 排课管理「操作流程图」以开课流程图同款 SVG 图示展示主路径与支路入口

### Modified Capabilities

- （无）`openspec/specs/` 下暂无对应主规格

## Impact

- `docs/schedule-workflow.html`（新增）
- `app.js` 的 `renderScheduleWorkflowPage`（改为 fetch 挂载，对齐 `renderCourseWorkflowPage`）
- `#page-schedule-workflow` / `#schedule-workflow-doc-mount`；共用 `.workflow-doc` / `.diagram-area` 样式，必要时只补排课图高度
- 导出脚本若只覆盖培养方案/开课 HTML，本次不强制纳入
