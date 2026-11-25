# Tasks

## 1. Data model

- [x] 1.1 Extend `SCHEDULE_MODULE_SETTING_KEYS` with `timeSetting`（label 时间设置, group time）and tag existing keys with schedule/adjustment groups; verify key order matches leaf columns 时间设置 → 三排课 → 调课管理
- [x] 1.2 Update `buildDefaultScheduleModuleSetting` / `ensureScheduleModuleSettingStore` to include and backfill `timeSetting`; verify newest term all-open (含 timeSetting false)、older terms all-disabled (含 timeSetting true)

## 2. Table header UI

- [x] 2.1 Replace `#page-schedule-module-setting` single「锁定资源」header with three groups（时间权限 colspan1 / 排课权限 colspan3 / 调课权限 colspan1）and five leaf headers; verify DOM matches mock left-of「排课表时间」
- [x] 2.2 Update empty-row colspan and summary/subtitle copy if needed; verify empty term list still renders without layout break
- [x] 2.3 Adjust `.schedule-module-setting-table` group header CSS if borders look wrong across three groups; verify visual separation of 时间 / 排课 / 调课

## 3. Cascade logic

- [x] 3.1 Implement `applyScheduleModuleSettingCascade`：【2】禁排课→禁时间；排课开放→不能开调课；【3】开调课→1&2 自动禁用
- [x] 3.2 Wire `onScheduleModuleSettingToggle` through cascade then store write + re-render；排课开放时调课勾选框 `disabled`
- [x] 3.3 On rejected「开放调课」, keep adjustment checked and `alert` 提示

## 4. Acceptance sweep

- [x] 4.1 表头三组 + 表内【2】【3】联动已落地
- [x] 4.2 Confirm 排时间 / 排教室详情 pages untouched；侧栏业务仍不拦截（仅表内联动）
