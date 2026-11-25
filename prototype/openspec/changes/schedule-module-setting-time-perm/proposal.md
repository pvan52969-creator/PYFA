# Proposal

## Why

排课模块设置表目前把「排课表时间 / 自动排课表时间 / 排课表教室 / 调课管理」塞在同一组「锁定资源」里，缺少独立的「时间权限」，也无法表达学期阶段上「时间约束 → 排课开放 → 调课开放」的互斥与联动。教务需要按图示在「排课表时间」左侧增加「时间权限 / 时间设置」，并落实三组勾选之间的联动规则。

## What Changes

- 表头由单组「锁定资源」改为三组：**时间权限**（列：时间设置）、**排课权限**（排课表时间 / 自动排课表时间 / 排课表教室）、**调课权限**（调课管理）。
- Store / 勾选模型新增 `timeSetting`（勾选=禁用，与现列一致）。
- 实现三组互锁（见 Capabilities；语义以图注为准）：
  - **时间权限**：禁用时忽略时间限制、以排课权限为准；开放时优先按时段/教室约束排课，排课权限默认开放（不勾选），调课权限强制禁用。
  - **排课权限**：整组禁用时连同时间权限禁用；组内仍有开放模块时，调课权限不可开放。
  - **调课权限**：禁用时时间/排课仍可配；开放（老师可申请调课）时自动禁用时间权限与排课权限。
- 勾选联动后即时写回 `SCHEDULE_MODULE_SETTING_STORE` 并重绘表格（灰底锁定格样式沿用）。
- 页头/副文案按新分组与联动说明微调；原型演示徽章口径保留「表内联动示意」，侧栏真实拦截仍非本变更必达（与现状一致时可注明）。

## Capabilities

### New Capabilities

- `schedule-module-setting`: 排课模块设置页的学期 × 权限分组勾选、时间权限列，以及时间 / 排课 / 调课三组互锁行为。

### Modified Capabilities

- （无）现有 specs 未覆盖本页行为。

## Impact

- `index.html`：`#page-schedule-module-setting` 双行表头结构与 colspan。
- `app.js`：`SCHEDULE_MODULE_SETTING_KEYS`、`buildDefaultScheduleModuleSetting`、`ensureScheduleModuleSettingStore`、`onScheduleModuleSettingToggle`、`renderScheduleModuleSettingPage` 及新增互锁辅助。
- `styles.css`：分组表头样式（若需区分三组边框/底色）。
- 不改排时间 / 排教室详情交互；不强制本迭代打通侧栏 `isScheduleModuleDisabled` 业务只读（可列为后续）。
