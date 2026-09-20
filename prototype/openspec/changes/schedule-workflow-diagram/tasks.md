## 1. 图源

- [x] 1.1 新增 `docs/schedule-workflow.html`，结构对齐 `docs/course-offering-workflow.html`（`.sheet`、图例、`.diagram-area` SVG、阶段说明）；打开该文件能看到完整 sheet
- [x] 1.2 SVG 主路径为五阶段：基础设置 → 排课表时间 → 排课表教室 → 课表查询 → 调课管理，箭头自上而下；对照侧栏核对节点文案（含 New Replacement / Pending Replacement）
- [x] 1.3 联合排课、自动排课/排教室、场地冲突、课表密度、调课配置用支路（虚线可）；确认它们不插入主路径序号

## 2. 挂载

- [x] 2.1 改 `renderScheduleWorkflowPage`：fetch `docs/schedule-workflow.html`，把 `.sheet` 子节点挂到 `#schedule-workflow-doc-mount`，逻辑对齐 `renderCourseWorkflowPage`
- [x] 2.2 加载失败时显示提示（用本地服务打开后刷新），不再回退五段卡片；断网或错误路径手测一次
- [x] 2.3 缩放按钮仍改 `SCHEDULE_WORKFLOW_ZOOM`；100% / 放大后图不被裁切、页可滚动

## 3. 回归

- [x] 3.1 打开排课「操作流程图」，可见色块节点、箭头、图例与阶段说明，不再是 ①–⑤ 纯卡片
- [x] 3.2 打开开课「操作流程图」，布局与改前一致
- [x] 3.3 从侧栏进按入学批次排、按时间排教室，详情交互与改前一致
