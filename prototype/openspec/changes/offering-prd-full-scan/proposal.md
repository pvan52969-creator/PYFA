## Why

开课管理需求文档同时存在「现行 20260915 链」和「0807 历史链」，读者容易拿过期 PRD / 概要设计当现行口径。全量扫描后需要一份可执行的文档治理提案：标出真源、过期树、未确认项和 OpenSpec 过程债，避免开发按错版本实现。

## What Changes

- 明确开课管理文档**真源**：编号目录 `01_开课设置` / `02_专业开课` / `03_选修开课` / `05_课程班管理` 下各菜单最新版本文件夹（多数为 20260915）。
- 把 `开课0807/` 标为**历史归档**（含 20260807 概要/详细设计）；禁止再当交付基线，除非明确升版对齐现行 PRD。
- 汇总仍须客户拍板的未确认项（选修 UC、ME 借用方案、过程债 OpenSpec），禁止把它们写成已明确。
- 登记文档缺口：无 `04_特殊开课` 独立 PRD；侧栏「特殊开课」已下线；`elective-module-gap-audit` 等 OpenSpec 描述已过期。
- 更新规范目录说明（`03_选修开课` 已存在，不再写成「预留」）。
- **不改**开课管理页面交互与业务逻辑。

## Capabilities

### New Capabilities

- （无）本 change 为文档治理，不引入产品行为。`.openspec.yaml` 已设 `skip_specs: true`。

### Modified Capabilities

- （无）`openspec/specs/` 下暂无已归档主规格。

## Impact

- 文档：`参考文档/2、开课管理/`（编号目录、`开课0807/`、`00_规范与变更说明/`）
- 流程图：`docs/course-offering-workflow.html`（仅核对其是否仍指向 0807 口径）
- OpenSpec 过程债：`elective-module-gap-audit`、`school-elective-offering-programme`、`ge-quota-by-g-type`、`ge-demand-credit-distribution`、`design-offering-grouping-hours`
- 原型侧栏：`#sidebar-nav-course`（对照菜单与文档覆盖，不改导航）
- 非目标：排课管理文档、选课应用、培养方案模块
