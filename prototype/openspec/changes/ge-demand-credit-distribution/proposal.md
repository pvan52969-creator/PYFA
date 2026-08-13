## Why

通识选修计划「开课需求」目前只能看文/商/理人数与按学院明细，无法估计本学期需要多少门次的 2 学分 / 3 学分 GE 课座。开课规划需要按执行计划标准学分（最高学分）把人数拆成 2/3 学分人次，才能对齐课程班供给。

## What Changes

- 在「通识选修计划 → 开课需求」卡片内增加 Tab 切换：
  - `按学院明细`：保留现有学院人数表
  - `GE学分分布预估`：文 / 商 / 理三列卡片，展示总人数、2 学分人次、3 学分人次
- 按已确认规则，用**假数据写死**各专业批次本学期 GE 标准学分（主造 4～7 分，可含少量更高档演示算法），按批次拆分后按文/商/理累加
- 标准学分 < 2 的批次**剔除**不计入本视图
- Tab B 文/商/理总人数之和须等于现有三卡文商理人数之和；「刷新」两 Tab 共用

## Capabilities

### New Capabilities

- `ge-demand-credit-distribution`：开课需求第二维——按文商理估算本学期 GE 2/3 学分人次，含学分拆分规则与 Tab 展示

### Modified Capabilities

- （无）本期不改既有「按学院明细」人数口径的正式规格；仅在同一卡片上增加并列视图

## Impact

- 页面：`#page-course-ge-offering-quota` 上段 `#ge-offering-demand-card`
- 逻辑：`app.js` 中 `ensureGeOfferingDemand` / `renderGeOfferingDemand*` 一带
- 样式：`styles.css` 需求摘要与新 Tab / 三卡布局
- 正式环境后续可改为读取执行计划「选修类分类 · 修读要求」最高学分；本期原型明确用假数据
