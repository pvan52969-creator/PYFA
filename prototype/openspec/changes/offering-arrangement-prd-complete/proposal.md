## Why

现行《开课安排》PRD（`开课安排20260902V2`）把分组工作台压成 3 个字段，漏掉列表展开「开课任务安排」、授课确认弹窗、分组侧栏/树、安排详情与 tip 业务规则、Teaching Load / 课时详情等整块界面。文档不足以支撑 AI 后端与测试按原型实现；需按可见 UI + tip 文案完整重写。

## What Changes

- **重写**《开课安排》PRD（模板 V3.1）：补全界面树、字段矩阵、功能清单、业务规则（尤其 tip 已写明的规则标「已明确」）。
- **覆盖落档（用户已确认）**：直接覆盖现行 `开课安排20260902V2/`（md + docx + 变更说明）；不新建 V3。
- Word 改动处：字体与正文一致（Times New Roman + 宋体），变更单元格/段落打**黄色高亮**。
- 同步生成脚本中开课安排菜单数据源，避免下次批跑再缩水。
- 可选：更新 `开课管理状态与实体对照` 中开课安排路径指向 V3。

## Capabilities

### New Capabilities

（无 — 文档补全，不改产品行为规格仓。）

### Modified Capabilities

（无 — `skip_specs: true`）

## Impact

- 文档：`参考文档/2、开课管理/02_专业开课/02_开课安排/`
- 脚本：`scripts/generate-prd-backend-ready-20260902.py` 或新建专用于完整版的生成器
- 原型真源：`page-course-major-offering-task-style2`、`page-offering-grouping`、相关 modal（不改代码，只对照）
- 下游读者：产品 / 研发 / 测试 / AI 后端
