## 1. 共用三角与折叠样式

- [x] 1.1 在 `styles.css` 增加 `.schedule-query-fold-toggle`（无描边、无背景按钮）与 `.schedule-query-fold-caret` 半三角（收起 `border-top` 朝下，父级 `.is-query-more-open` 时改为 `border-bottom` 朝上），验证控件无边框、无「展开/收起」文案
- [x] 1.2 增加收起规则：`.schedule-query-row:not(.is-query-more-open) .schedule-query-more` 与 `.schedule-room-filter-grid:not(.is-query-more-open) [data-query-more]`（及兼容 `data-density-more`）为 `display: none`；`.schedule-query-more` 展开后 `grid-column: 1 / 4` 且内部三列，验证第二行不排进按钮列下方
- [x] 1.3 三角作为 `.schedule-query-actions` / `.srf-actions` 最后一个子节点时与查询/重置底对齐，验证第一行仍是 3 条件 + 按钮组 + 三角

## 2. 共用脚本

- [x] 2.1 在 `app.js` 实现 `toggleScheduleQueryMore(btn)`：在最近的 `.schedule-query-row` 或 `.schedule-room-filter-grid` 上 toggle `is-query-more-open`，同步 `aria-expanded` 与 `aria-label`（收起「展开筛选」/ 展开「收起筛选」）；验证重复点击可展开再收起
- [x] 2.2 将 `toggleScheduleStudentDensityFilters` 改为调用同一套折叠（或删除后全部走 `toggleScheduleQueryMore`），验证学生密度不再出现带边框「展开」文字按钮
- [x] 2.3 确认收起后隐藏字段值仍参与查询、重置不清空展开状态以外的已填值也不强制收起；验证改隐藏条件后再查询结果仍按全部条件生效

## 3. 列表与查询页静态筛选栏

- [x] 3.1 按入学批次排 / 按教师排 / 按课程排：第 4 个条件起包进 `.schedule-query-more`，按钮组加三角；验证进入页默认只见第一行 3 条件 + 查询/重置 + 三角
- [x] 3.2 课表冲突查询、场地冲突查询：同样折叠；验证超一行条件默认隐藏，点三角后全部可见
- [x] 3.3 自动排课、自动排教室：同样折叠（含 wide 字段仍占一格）；验证执行按钮仍在第一行第 4 列、三角在其右侧、不沉底
- [x] 3.4 排课时间设置中超过 3 条件的 Tab、课表查询「时间课表」等超一行 Tab：加折叠；验证不超过 3 条件的 Tab（如节次维护、多数课表查询 Tab）不出现三角且条件全可见
- [x] 3.5 教室开放时间、调课申请管理、调课申请记录：4～5 条件栏加折叠；验证教师端调课/加课主列表等单行筛选不加三角

## 4. 密度与抽屉

- [x] 4.1 学生课表密度：`ensureScheduleDensityFilterGrids` 输出三角控件，第二行起 `data-query-more`（或兼容 `data-density-more`），默认收起；验证默认只见学期、学号、姓名 + 查询/重置 + 朝下三角
- [x] 4.2 教师课表密度：同样默认收起第二行并用半三角；验证打开教师 Tab 只见第一行三条件 + 查询/重置 + 三角
- [x] 4.3 调课申请抽屉左侧「选择上课节次」：超过一行则默认收起第二行（日期/星期/教室等）并加三角；验证打开抽屉时第二行隐藏、点三角后显示，查询/重置仍在第一行右侧

## 5. 约定与回归

- [x] 5.1 更新 `.cursor/rules/query-filter-list-layout.mdc`：补「第二行及以下默认收起、按钮组右侧无边框半三角、不超过一行不加三角」；验证结构示例含折叠区与三角
- [x] 5.2 手测排除项未改：开课模块筛选、联合排课「筛选与设置」、排时间/排教室详情左侧课程搜索、排教室「展开更多教室」；刷新页面展开状态不持久
