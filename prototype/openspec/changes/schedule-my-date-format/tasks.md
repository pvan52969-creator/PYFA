## 1. 共用展示入口

- [x] 1.1 确认 `formatAdjustmentDateDisplay` / `formatAdjustmentCalMonthTitle` 为排课模块唯一日历日期展示入口（可加 `formatScheduleDateDisplay` 转调）；空值、`、` 分隔多日期、非法文本行为与现实现一致，并用 `2025-10-06` → `06 Oct 2025`、`04 Jan 2026` 手测
- [x] 1.2 增加日期+时间展示：`YYYY-MM-DD HH:mm` → `DD Mon YYYY h:mm AM/PM`，验证 `2026-09-20 14:30` 显示为 `20 Sep 2026 2:30 PM`，存储仍为原字符串

## 2. 调课列表与详情

- [x] 2.1 改 `renderAdjustmentTeacherMakeupCancelTable` 停课日期列走展示函数；打开 Pending Replacement 待补课表，验证首行日期为 `06 Oct 2025` 而非 `2025-10-06`
- [x] 2.2 教师端调课/加课列表、审批、申请管理、申请记录的日期列与提交时间列走同一套函数；打开各列表验证无裸 `YYYY-MM-DD`
- [x] 2.3 申请详情、审批详情、停课日期字段走展示函数；打开一条详情验证停课/调后日期为马来格式
- [x] 2.4 公假日列表、选课节次表、批量调课预览（`formatAdjustmentBatchDateParen` / `formatAdjustmentBatchDateLabel`）、教室开放时间按钮与摘要走展示函数；打开对应页验证日期文本为 `DD Mon YYYY`

## 3. 查询与课表页

- [x] 3.1 课表冲突查询、场地冲突查询日期列走展示函数；查询后单元格为马来格式
- [x] 3.2 时间课表/课表查询中 `dateLabel` 列走展示函数；打开时间课表验证日期列
- [x] 3.3 课表密度「已选目标」等拼接文案中的 ISO 日期改为展示函数；选一节后验证文案含 `DD Mon YYYY`

## 4. 日期选择器

- [x] 4.1 抽出共用日历头（`Mon YYYY` + Mon–Sun），接到 `renderScheduleSlotWeekCalendar`、教室开放、公假日、批量调课选择器（申请抽屉已接的保持一致）；打开上述选择器验证标题与表头
- [x] 4.2 选择器按钮回显已选值用展示函数，空值仍为「选择日期」；选 `2026-04-01` 后按钮为 `01 Apr 2026`

## 5. 回归

- [x] 5.1 提交一条调课/补课申请，验证内部 `st.date` / 请求数据仍为 `YYYY-MM-DD`，界面为马来格式
- [x] 5.2 抽查开课管理任一日期列未改；原生 `<input type="date">` 未替换为自绘控件
- [x] 5.3 日期列过长时不把表格撑乱（必要时 nowrap / 列宽）；Pending Replacement 与申请抽屉 Previous 行格式一致
