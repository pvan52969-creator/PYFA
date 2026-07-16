## Why

「安排教师 / 管理名单」已进入独立页 `#page-offering-grouping`，但仍嵌在带左侧开课导航的 `main` 内，视觉上不像整页接管的工作台。后续分组/教师交互大改前，需先把沉浸整页壳定下来，让进入/离开体验立刻对齐「独立应用页」预期。

## What Changes

- 进入 `#page-offering-grouping` 时启用沉浸壳：隐藏左侧侧栏，`main` 拉满视口宽度。
- 离开该页（返回确认后、保存后回列表等）时退出沉浸壳，恢复侧栏与常规布局。
- **保留**现有顶栏：「面包屑 + 返回 + 保存/保存名单」。
- **同一套壳**覆盖所有进入该页的入口：任务安排「安排教师」、名单管理「管理名单」（专业 / 通识 / 特殊等凡走 `openOfferingGroupingModal` 的路径）。
- 本变更**不改**分组树、教师安排、学生名单等页内业务逻辑与 Tab 结构。

## Capabilities

### New Capabilities

- `offering-grouping-immersive-shell`: 开课分组/名单编辑页的整屏沉浸壳（侧栏隐藏、全宽主区、进出生命周期）

### Modified Capabilities

- （无）现有 `openspec/specs/` 下无对应需求规格需改写

## Impact

- `styles.css`：新增沉浸态布局（可参考现有 `.app.portal-mode` 隐藏侧栏模式）
- `app.js`：`goPage` / `openOfferingGroupingModal` / `performCloseOfferingGroupingPage`（及任何直接切离 `offering-grouping` 的路径）同步沉浸 class
- `index.html`：原则上无需改顶栏结构；若需标记类名可微调 `#page-offering-grouping`
- 入口：专业/通识/特殊任务安排与名单管理中的「安排教师」「管理名单」
