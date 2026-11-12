# Proposal

## Why

排课详情（按入学批次 / 按教师 / 按课程）、联合排课与排教室详情的左侧课程列表与上方工具区纵向占高，课表格子偏小。产品要求一键进入「课表区域全屏」：左栏与顶栏一并完全藏起，只留课表与可退出入口，需要时再展开。

## What Changes

- 排时间详情（按入学批次排 / 按教师排 / 按课程排共用壳）：提供一键进入/退出课表全屏；全屏时左侧课程列表与上方工具区（冲突图例、作用域切换、卡片显示项、周次、预重修与教室安排预览等）**完全隐藏**，仅保留课表主体与退出全屏控件。
- 联合排课：对齐同一心智——全屏时同样藏左栏 + 顶栏筛选/设置；在现有「收起筛选与设置」之上扩展为可进入课表区域全屏（或等价的一键全屏入口），避免三套互斥开关造成困惑。
- 排教室详情：**单独实现**同等「课表区域全屏」行为（藏左栏 + 教室侧顶栏工具区），**不**与排时间共用同一套 DOM/组件；禁止为教室需求改时间侧交互，也禁止为时间需求改教室侧菜单与锁定/待定逻辑。
- 全屏态为纯课表视图：不保留「正在排」摘要条；必须提供明显的退出/展开入口（浮钮或等价控件），避免无出口。
- **不改**：排课业务规则、冲突检测语义、右键菜单条目集合、查询列表页筛选折叠约定、应用级侧栏 immersive（独立页签藏应用侧栏）的既有语义（可与全屏并存，但不互相替代）。

## Capabilities

### New Capabilities

- `schedule-time-viewport-fullscreen`：排时间详情与联合排课的课表区域全屏（一键藏左栏 + 顶 chrome，可退出）
- `schedule-room-viewport-fullscreen`：排教室详情独立的课表区域全屏（同等心智，独立实现）

### Modified Capabilities

- （无）现有主规格不覆盖视窗 chrome；联合 GE 对象轴等业务规格不变

## Impact

- `index.html`：时间详情壳增加全屏入口/退出控件标记；教室页 clone 后补丁独立入口（勿靠改时间模板「顺便」满足教室）
- `app.js`：时间侧 / 联合侧全屏状态与 toggle；教室侧独立状态与 toggle；联合现有 `toggleScheduleJointChrome` 与全屏入口的关系需对齐
- `styles.css`：全屏态布局（左栏与顶 chrome `display:none` 或等价，课表区占满）；时间与教室选择器隔离（`#page-schedule-time-detail` / `#page-schedule-joint*` vs `#page-schedule-room-detail`）
- 约束：遵守 `.cursor/rules/schedule-time-room-independence.mdc`
