## Why

排课管理面向马来分校，界面日期仍大量使用 `YYYY-MM-DD`（如 Pending Replacement 停课列表的 `2025-10-06`），与已确认的马来展示格式 `04 Jan 2026` 不一致。申请抽屉里部分日期刚改过，列表、详情、其他选择器仍是旧格式，需要整模块统一。

## What Changes

- 排课管理模块（`SCHEDULE_PAGE_IDS` 覆盖的页面、抽屉、弹窗）中，**日历日期**的展示统一为马来格式：`04 Jan 2026`（日两位、英文三字母月份、四位年）。
- 自定义日期选择器（`adj-cal-*` 及同类）同步：已选值按钮、日历标题（`Jan 2026`）、表头星期（Mon–Sun）。
- 含时间的字段：日期改为马来格式，时钟改为 12 时制，例如 `04 Jan 2026 2:30 PM`；内部存储、比较、提交仍用 `YYYY-MM-DD` / `HH:mm` / ISO。
- 申请抽屉里已接上的 `formatAdjustmentDateDisplay` 升为模块共用格式化入口，补齐尚未改到的列表（含教师端 Pending Replacement 停课日期列）。
- **不改**培养方案、开课管理；**不改**周次文案（第 N 周）、星期中文列（周一）除非它出现在日期选择器表头。
- 原生 `<input type="date">` 不强制改外观（浏览器按系统区域设置），筛选结果列仍走马来格式。

## Capabilities

### New Capabilities

- `schedule-date-display`: 排课管理模块日历日期（及日期选择器）统一按马来格式展示

### Modified Capabilities

- （无）`openspec/specs/` 下暂无对应主规格需改写

## Impact

- `app.js`：共用展示函数；调课/排课列表、详情、冲突、公假日、批量调课、课表查询、密度查询、日历组件
- `index.html`：仅当日期选择器按钮文案写死在 HTML 时改展示，不改存储字段
- `styles.css`：马来格式比 `YYYY-MM-DD` 略长，窄列可能需防换行/截断
- 已有 `formatAdjustmentDateDisplay` / `formatAdjustmentCalMonthTitle` 复用并推广，避免各页各写一套
