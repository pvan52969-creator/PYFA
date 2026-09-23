## Why

排课管理原型需要可演示、可走通流程，但不能把操作结果永久写进浏览器。当前调课用户申请会进 `localStorage`，演示课排课结果会进 `sessionStorage`，刷新后仍可能残留，演示基线被污染。需要统一为：**以当前版本种子数据为 Mock 初态；同页不刷新可继续流程；任意整页加载（含刷新）一律回到初态。**

## What Changes

- 排课管理侧栏全部菜单（基础设置、排时间、排教室、课表查询、调课管理）的可变业务数据，均以**当前代码中的 Mock/种子数据**为唯一初态。
- **BREAKING（原型行为）**：取消调课用户申请的 `localStorage` 持久化与启动恢复；刷新后用户新建/审批改动不再保留。
- **BREAKING（原型行为）**：取消（或在每次整页加载时清空）演示排课 `sessionStorage` 恢复；刷新、深链打开、新页签打开详情页均从种子态起步，不再跨文档恢复已排节次。
- 同页签、不刷新时，内存中的排课/调课流程状态保持可继续（审批链、排时间→排教室等）。
- 不改动培养方案、开课管理等非「排课管理」模块的独立数据策略；若共享开课计划 store，仅保证排课侧「整页加载 = 种子」不依赖跨刷新缓存。

## Capabilities

### New Capabilities

- `schedule-ephemeral-mock`: 排课管理 Mock 数据生命周期——整页加载回到当前版本种子初态，会话内内存可变、不跨刷新持久化。

### Modified Capabilities

- （无）主规格中尚无对应持久化约定；本次以新 capability 落需求。

## Impact

- 主要改动文件：`app.js`（`persistAdjustmentUserRequests` / `restoreAdjustmentUserRequests`、`SCHEDULE_DEMO_ARRANGE_SESSION_KEY` 相关读写与启动清 session 逻辑）。
- 受影响流程：调课申请/审批演示、列表「排课」新开页签、联合排课演示页签、带 URL 的排课详情深链刷新。
- 不影响：排时间 / 排教室产品面独立性规则；查询条件布局标准。
