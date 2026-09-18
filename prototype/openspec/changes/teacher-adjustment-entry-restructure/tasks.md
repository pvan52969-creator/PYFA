## 1. 侧栏与调课申请页 Tab 壳

- [x] 1.1 侧栏「加课申请（教师端）」改为「补课申请（教师端）」，`data-page` 改为 `adjustment-teacher-makeup`；`goPage('adjustment-teacher-addclass')` 映射到新页。验证侧栏只有调课申请与补课申请两个教师入口
- [x] 1.2 `#page-adjustment-teacher` 增加 Class Replacement / Class Addition Tab（`tab-bar` + `tab-panel`），默认 Replacement；验证切换 Tab 只显示对应面板
- [x] 1.3 每个 Tab 在查询卡上方放独立英文说明板块（文案见 spec）。验证 Replacement 看不到 Addition 说明，反之亦然

## 2. Class Replacement / Class Addition 列表与发起

- [x] 2.1 Replacement：列表仅 `reschedule`/`cancel`；类型筛选去掉补课；按钮仅发起调课、发起停课。验证补课/加课行不出现，无发起补课
- [x] 2.2 将原加课页的查询 + 列表 + 发起加课迁入 Addition 面板（新控件 id 避免与补课页冲突）。验证 Addition 只有加课申请且可发起加课
- [x] 2.3 `renderAdjustmentTeacherPage` 按当前 Tab 渲染；进入页/切 Tab/查询重置走对应函数。验证刷新后默认仍是 Replacement

## 3. 补课申请页

- [x] 3.1 新建 `#page-adjustment-teacher-makeup`：上表为可勾选的已通过未补停课课节（`getAdjustmentCancelledSlots`），操作栏 Apply、New Replacement。验证无停课可选时空态文案
- [x] 3.2 Apply：无勾选提示且不打开抽屉；有勾选则 `openAdjustmentApplyModal('makeup')` 并预勾选对应节次。验证抽屉左侧已是这些停课记录
- [x] 3.3 New Replacement 调用 `openAdjustmentApplyModal('reschedule')`。验证左侧是已排节次而非停课记录
- [x] 3.4 主表下方列出本教师 `makeup` 申请（教师端五种状态）。验证提交补课后该列表出现新单，Replacement Tab 仍无补课行

## 4. 样式与回归

- [x] 4.1 说明板块、补课勾选表样式；筛选仍一行最多 3 条件。验证 Addition 两条件无折叠三角
- [x] 4.2 浏览器手测：调课申请两 Tab 说明与列表、补课勾选 Apply、New Replacement、旧 addclass 路由；确认排时间/排教室、公假日、教务代申请/审批未改入口
