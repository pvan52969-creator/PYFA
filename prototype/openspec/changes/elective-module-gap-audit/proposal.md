## Why

选修开课侧栏已有计划 / 安排 / 名单三页，但正式 PRD 只覆盖「选修开课安排」的修读范围与可选批次；专业开课刚拍板的口径（撤回/退回、权限按专业等）**不能默认套到选修**。现在盘点未确认项与原型隐患，避免实现或升版时自造规则。

## What Changes

- 落档选修模块（计划、安排、名单）**未确认清单**与**原型隐患**；未拍板项继续标未确认。
- 明确：**禁止**把专业开课 20260909 已拍板口径自动写进选修 PRD / 直接改选修行为。
- 不在本 change 补写选修开课计划、选修开课名单正式 PRD（客户原型未确认完；与既有口径一致）。
- 不在本 change 改选修撤回/退回/权限/选课校验的产品规则（只登记差异与风险）。
- 实现阶段仅允许：文案/死代码等**不涉及业务规则**的清理；规则类改动另开 change，且须用户确认。

## Capabilities

### New Capabilities

- `elective-module-gap-guard`：选修三页未确认边界、与专业开课口径隔离、原型自相矛盾处不得当已确认实现

### Modified Capabilities

- （无）`openspec/specs/` 下暂无已归档主规格

## Impact

- 文档：`参考文档/2、开课管理/03_选修开课/`（现行仅 `选修开课安排20260904V2`）
- 原型页：`page-course-ge-offering-quota`、`page-course-offering-ge`、`page-course-ge-offering-roster`
- 逻辑：`app.js` 中 GE/ME 开课、配额、修读范围、名单退回等；与专业开课共用函数（一键同步共同授课、分组工作台）
- 未完成 OpenSpec（过程债，本 change 不归档）：`ge-quota-by-g-type`、`ge-demand-credit-distribution`、`school-elective-offering-programme`
- 非目标：选课应用、校选课库正文、专业开课已拍板条款回改
