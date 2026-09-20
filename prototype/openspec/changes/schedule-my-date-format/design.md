## Context

See proposal.md — Why。申请抽屉右侧与左侧节次表已用 `formatAdjustmentDateDisplay`（`04 Jan 2026`），日历 `openAdjustmentDatePicker` 已改标题与 Mon–Sun。同一模块内大量列表仍直接输出 `YYYY-MM-DD`，例如 `#adjustment-teacher-makeup-cancel-body` 的停课日期列。

约束：

- 内部比较、筛选、提交继续用 `YYYY-MM-DD`（`getScheduleSlotDateLabel`、`st.date`、`isDateInAdjustmentApplyWindow` 等）
- 模块边界是 `SCHEDULE_PAGE_IDS` + 这些页打开的抽屉/弹窗
- 已有 `formatDateDisplayDdMmYyyy`（`DD/MM/YYYY`）属于开课时间设置，**不要**拿来改排课展示

## Goals / Non-Goals

**Goals:**

- 一个共用展示入口，排课模块所有日历日期走同一格式。
- 自定义 `adj-cal-*` 选择器（申请、教室开放、公假日、批量调课、周历等）标题与星期表头一致。
- 带时间字段：日期转马来格式，时钟转 12 时制。

**Non-Goals:**

- 不改存储 schema，不把 ISO 改成英文月份字符串。
- 不改开课/培养方案格式化函数的默认行为。
- 不替换原生 `<input type="date">` 为自绘控件（浏览器区域设置另议）。
- 不把中文「周一」列改成 Mon（选择器表头除外）。

## Decisions

### 1. 共用展示函数，禁止各页手写月份

- **选择**：把现有 `formatAdjustmentDateDisplay` / `formatAdjustmentCalMonthTitle` 升为排课模块共用（可保留函数名以免大面积改调用，或加薄封装 `formatScheduleDateDisplay` 转调）。多日期用 `、` 分隔时逐段转换。
- **理由**：申请抽屉已验证格式；再写第二套会漂。
- **备选**：`Intl.DateTimeFormat('en-MY')`（否决：日位数、月份缩写在引擎间可能不一致，用户样例是固定 `04 Jan 2026`）。

### 2. 只在渲染时格式化

```
ISO / YYYY-MM-DD  ──render──►  04 Jan 2026
                  ◄─store──   仍为 YYYY-MM-DD
```

- **选择**：`dateLabel`、`st.date`、`h.date` 内存保持 ISO；`escapeHtml(format…(x))` 仅出现在 innerHTML / 按钮文案。
- **理由**：窗口校验、排序、`getAdjustmentDateInfo` 都吃 ISO。
- **备选**：存储展示字符串（否决，比较会坏）。

### 3. 日历组件一并英文化标题与表头

已知仍为 `yyyy年M月` / 一二三… 的入口：

| 函数/位置 | 用途 |
|-----------|------|
| `renderAdjustmentCalendar` | 申请抽屉（已改） |
| `renderScheduleSlotWeekCalendar` | 排课详情周历 |
| 教室开放时间日期选择器 | `openAdjustmentRoomOpenDatePicker` |
| 公假日日期选择器 | `openAdjustmentHolidayDatePicker` |
| 批量调课日期选择器 | `openAdjustmentBatchDatePicker` |

- **选择**：抽一段共用日历头（月份标题 + Mon–Sun），各 `adj-cal-title` 调用它。
- **备选**：只改申请抽屉（否决，用户要求整模块）。

### 4. 带时间的字段

- **选择**：`YYYY-MM-DD HH:mm` → `DD Mon YYYY h:mm AM/PM`（如 `20 Sep 2026 2:30 PM`）。秒数若界面本来没有就不加。节次时段走同一套 12 时制（`formatAdjustmentTime12` / `formatAdjustmentTimeRange12`）。
- **理由**：用户明确要求时间改为 12 时制；只改日期、留下 `14:30` 会两套时钟并存。
- **备选**：时间保持 `HH:mm`（否决，与马来分校习惯及用户覆盖要求不符）。

### 5. 覆盖扫描策略

实现时按表面扫，避免漏页：

1. 调课：Pending Replacement 停课表、申请列表/审批/记录、详情、公假日、批量调课、教室开放时间
2. 查询：课表冲突、场地冲突、课表查询、密度查询、时间课表日期列
3. 选择器：所有 `adj-cal-title`
4. 文案拼接：`formatAdjustmentBatchDateParen`、`formatAdjustmentRoomOpenDateBtn`、公假日 `dates.join`、密度「已选目标」

空值继续「—」或「选择日期」。

## Risks / Trade-offs

- [漏改某列仍显示 ISO] → 任务按页面清单勾选；实现后对 `schedule`/`adjustment` 渲染串做 `YYYY-MM-DD` 展示扫描。
- [列宽不够换行] → 日期列 `white-space: nowrap` 或略增 min-width。
- [误格式化非日期的 `2025-10-06` 出现在课号/单号] → 只对已知日期字段调用，不对整段 HTML 全局 replace。
- [原生 date input 仍是系统格式] → 提案已排除；若验收时被追问，另开 change 换自绘选择器。

## Migration Plan

- 纯展示，无数据迁移。
- 回滚：去掉展示包装即可，存储未变。
