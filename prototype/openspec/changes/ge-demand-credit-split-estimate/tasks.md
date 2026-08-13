## 1. 拆分算法与演示数据

- [x] 1.1 实现纯函数 `splitGeStandardCreditsToSeatCounts(standardCredits, headcount)`：覆盖固定档 2/3/4/5/7 与 50/50 档 6/8/9/10/11（偶数期望值、奇数规则一）；标准学分 &lt; 2 或无法识别返回 0 人次
- [x] 1.2 用规格验算示例（4/5/6/7/8/9/10/11 的 50 人与 5 人）手测或临时断言核对函数结果
- [x] 1.3 扩展 `ensureGeOfferingDemand`（或并列构建）为演示批次挂 `standardCredits`（以 4～7 为主，不造 &lt; 2）；按文商理汇总 `byStreamCreditSplit`（total / seats2 / seats3），保证各类 total 与现有 `byStream` 一致

## 2. 开课需求卡片 Tab UI

- [x] 2.1 在 `#ge-offering-demand-card` 增加 Tab：`按学院明细` / `GE学分分布预估`；默认学院明细；记住当前 Tab
- [x] 2.2 「按学院明细」继续渲染现有摘要 + 学院表 + 刷新按钮
- [x] 2.3 「GE学分分布预估」渲染文/商/理三列卡片（总人数、2 学分人次、3 学分人次）；刷新与学院明细共用 `refreshGeOfferingDemandPage`
- [x] 2.4 补充必要 CSS（Tab、三列卡片），对齐现有 ge-demand 视觉语言

## 3. 验收

- [x] 3.1 切换两 Tab 正常；刷新后两端文商理人数一致
- [x] 3.2 抽查一档偶数期望与一档奇数规则一与规格示例一致
- [x] 3.3 下段「各学院配额」保存/展示不受影响
