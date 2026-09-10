## Purpose

约束选修开课三页在未拍板前不得被当成已确认实现，并与专业开课已拍板口径隔离。

## ADDED Requirements

### Requirement: Unconfirmed items stay unconfirmed

选修开课计划、选修开课安排（修读范围以外）、选修开课名单中，尚未由用户/客户拍板的事项 MUST 保持未确认。系统与文档 MUST NOT 把专业开课 20260909 已拍板口径自动写成选修规则。

下列事项在拍板前 MUST 视为未确认：

- 选修开课安排列表 / 查询 / 工具栏完整规格（现行 PRD UC001）
- 教学任务编辑抽屉全量字段与规则（UC002）
- 可选批次在选课端的最终校验细则（UC003）
- 选修模块数据权限（UC004；专业开课「按专业」不得默认套用）
- 选修开课计划、选修开课名单整页正式 PRD
- 选修侧撤回 vs 退回（含是否与专业开课同一套）
- 合班人数叠加是否适用于选修
- GE 配额未达标是否拦截生效（原型注释写「产品确认不做此限制」，文档未落档）
- 名单默认来源（选课应用生成 vs 本模块维护）及退回后名单处理
- 教学周数派生等与选修无直接关系的专业开课未确认项，不因本盘点关闭

#### Scenario: Writer attempts to copy major offering withdraw rules

- **WHEN** 有人要把专业开课「撤回=已生效变草稿且保留分组教师」写进选修开课安排 PRD 或改选修工具栏
- **THEN** 在用户未单独确认选修口径前，MUST NOT 落成已明确条款或改产品行为

#### Scenario: Existing scope PRD remains valid

- **WHEN** 查阅现行 `选修开课安排` 修读范围 / 可选批次条款（FD001–FD012、BR001–BR005）
- **THEN** 这些已明确条款保持有效；本盘点 MUST NOT 把它们改回未确认

### Requirement: Prototype contradictions are hazards not rules

原型上选修安排页无撤回/退回按钮、名单页「退回」作用于已生效任务、JS 另有保留分组教师的退回函数——三处文案与条件互相矛盾。在用户确认选修生命周期前，上述行为 MUST NOT 被文档写成已明确规则；也 MUST NOT 被实现者按专业开课口径擅自改齐。

#### Scenario: Documenting current prototype

- **WHEN** 需要向研发/测试说明选修退回现状
- **THEN** 说明 MUST 写成「原型现状 / 隐患」，状态为未确认，不得写成 BR

### Requirement: No formal plan or roster PRD in this change

本 change MUST NOT 产出选修开课计划、选修开课名单的正式 PRD 正文。侧栏虽有这两页，正式需求仍待客户确认后再另开 change。

#### Scenario: Request to generate plan PRD during this change

- **WHEN** 实现本 change 的任务时被要求「顺便把选修开课计划写成 V2 PRD」
- **THEN** 拒绝在本 change 内生成；须用户明确同意并另开提案
