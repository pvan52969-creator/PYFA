## Context

See proposal.md — Why。标杆与约束：

- 质量标杆：`开课安排20260915V5`（完整界面树、字段矩阵 Add/Edit/View、F、tip→BR、状态机）
- 模板：PRD V3.1 + 变更说明简版 V3
- 真源页：
  - 计划 `page-course-ge-offering-quota`
  - 安排 `page-course-offering-ge`（工具栏在 `renderGeOfferingPlanToolbar`：GE/ME开课、一键复制、导入、生效、删除、导出、师资步共同授课）
  - 名单 `page-course-ge-offering-roster`
- 关键算法真源（须落入 BR，不得只写「见原型」）：
  - GE 学分人次：`splitGeStandardCreditsToSeatCounts` + `getGeOfferingDemandCreditSplitTipText`
  - ME 预计 Quota / 计划课程组quota tip：`getMeOfferingPlanGroupQuotaTipText` 等
- 现行薄版：`…/03_选修开课/**/…20260915V1/`

## Goals / Non-Goals

**Goals:**

- 三菜单各出一份可开发 PRD：每个可见按钮有 F；每个 tip/alert 有 BR；列表/查询/弹窗字段有 FD；未知标 UC
- 安排页工具栏与两步列表列完整落档；计划页需求卡与配额公式完整落档
- 变更说明能追溯「薄版缺什么 → 本版补什么」

**Non-Goals:**

- 不改 `app.js` / `index.html`
- 不把专业开课撤回/退回等口径默认写入选修
- 不在本 change 消化 `elective-module-gap-audit` 的全部产品拍板（仅文档；拍板缺口继续 UC）
- 不重写校选课程管理 / 专业开课 PRD

## Decisions

1. **质量闸门：对齐《开课安排》完整度，禁止再交薄壳**  
   - Checklist（每菜单必过）：界面树含所有弹窗/抽屉 → 主表+查询+工具栏全 FD/F → 扫 tip/alert 成 BR → 数据来源无「原型」字样 → 未确认进 §11。  
   - Alternative：只补按钮名不写规则 → 否决（即本次返工原因）。

2. **默认同文件夹覆盖 `20260915V1`**  
   - Rationale：正式链刚定为 V1，薄版不应作为有效交付物留存；与 `remaining-prd-complete`「完整重写覆盖」例外一致。  
   - Alternative：升 V2 保留薄 V1 → 可改口；默认不采用以免两版并存误导研发。

3. **实施顺序：安排 → 计划 → 名单**  
   - Rationale：用户痛点按钮在安排；计划含学分/Quota 公式；名单依赖前两者口径。  
   - Alternative：三份并行 → 交叉引用易不一致。

4. **选修与专业口径隔离**  
   - 共用组件（分组工作台、一键复制弹窗）写清「选修页入口 + 选修差异」；专业独有规则不抄。  
   - GE开课前置：须先在计划保存课程组quota（原型 title/alert 已明确）→ 计划与安排交叉 BR。

5. **公式类规则写进 BR 正文，附 tip 原文要点**  
   - 例：学分 2/3/4/5/6/7… 人次拆分；ME Quota＝学生数×组数×1.05 等以 tip/代码注释已写明者为准。  
   - 演示造数 vs 正式执行计划来源：历史说明条已注释，BR 写「正式环境数据来源」；演示仅标注不影响接口字段。

## Risks / Trade-offs

- [工作量大 / 再交薄壳] → 每菜单对照 checklist 勾选；安排页先对照 `renderGeOfferingPlanToolbar` + 表头渲染函数逐按钮/列  
- [tip 与代码公式不一致] → 以现行 tip 文案为「已明确」；代码仅辅助理解；冲突标 UC 问产品  
- [与未完成 OpenSpec 冲突] → 以可见原型为准；未落地交互不写已确认  
- [覆盖 V1 无 diff 基线] → 变更说明总览按「相对薄版新增对象」列举，不假装无→V1

## Migration Plan

1. 按顺序重写三菜单 md（覆盖 V1 文件夹内文件名不变或仅替换正文）  
2. 同步变更说明（薄版作废→完整重写）+ docx  
3. 验收：安排页至少含 GE开课/ME开课/一键复制/导入/生效/删除 的 F+BR；计划页含文商理卡与学分 tip BR；抽检无「数据来源=原型」  
4. 回滚：用 git 恢复被覆盖的 V1 文件

## Open Questions

- 版本：默认**覆盖 20260915V1**；若要升 V2 请在 apply 前拍板。  
- 导入是否真导入还是占位：以 `startGeOfferingArrangeImport` 现行行为为准写入；若仅半成品标 UC。
