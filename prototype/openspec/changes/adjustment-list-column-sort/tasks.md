## 1. Shared sort wiring

- [x] 1.1 抽出或扩展申请类列规格（复用 / 对齐 `ADJUSTMENT_TEACHER_SORT_COLUMNS`），为 admin / approval / record 定义 getter，并确认与单元格 display helper 一致（手查字段映射）
- [x] 1.2 在 `LIST_SORT_REFRESH` 注册 `adjustmentAdmin`、`adjustmentApproval`、`adjustmentRecord`、`adjustmentBatchRecord`、`adjustmentHolidayManage`、`adjustmentHolidayRecord`，点击表头后对应 `render*` 会刷新（代码存在且 key 不冲突）

## 2. Application list pages

- [x] 2.1 `renderAdjustmentAdminPage`：动态可排序 thead + `sortListWithState`；手测点「提交时间」「审批状态」升/降序，序号重编
- [x] 2.2 `renderAdjustmentApprovalPage`：同上；手测三个页签下排序互不串到其它 listKey，筛选类型后再排序正确
- [x] 2.3 `renderAdjustmentRecordPage`：同上；勾选列不可排；排序后导出仍按当前筛选结果语义（不因排序破坏导出勾选逻辑）

## 3. Batch and holiday pages

- [x] 3.1 为批量调课记录定义 `ADJUSTMENT_BATCH_RECORD_SORT_COLUMNS`，改造 `renderAdjustmentBatchRecords`；手测「调课类型」「操作时间」排序
- [x] 3.2 为公假日管理表定义列规格并改造 `renderAdjustmentHolidayManagePage`；手测「假日名称」「创建时间」
- [x] 3.3 为公假日记录表定义列规格并改造 `renderAdjustmentHolidayRecordPage`；手测「Date」「补课申请状态」；与管理表 listKey 隔离

## 4. Teacher gap check and verification

- [x] 4.1 核对 Class Adjustment 各主列表（replacement / addition / makeup / makeup-cancel）表头均已可排；缺则补齐，已有不回退
- [x] 4.2 六入口冒烟：每页至少一列升→降、筛选后再排序、操作列/序号不可点；确认未改动排时间/排教室详情
