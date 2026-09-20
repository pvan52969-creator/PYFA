## Context

开课流程图：`docs/course-offering-workflow.html` 的 `.sheet` 被 `renderCourseWorkflowPage` fetch 后挂到 `#course-workflow-doc-mount`，主视觉是 `.diagram-area` + SVG（`foreignObject` 节点、箭头 marker、阶段色）。

排课流程图：`renderScheduleWorkflowPage` 在 JS 里拼五段 `.node` 卡片 + 模块清单 + 阶段说明，没有 SVG。页面壳（viewport / zoom）已经和开课页对齐。共用 `.workflow-doc` 样式已能吃下开课那种 sheet 子节点。

主路径文案已钉在页眉副标题：基础设置 → 时间 → 教室 → 查询 → 调课。侧栏比这五段更密（联合排课、自动排、密度、调课配置等）。

## Goals / Non-Goals

**Goals:**

- 排课操作流程图主视觉改成开课同款 SVG 图
- 主路径五阶段不变；侧栏多入口以支路挂上
- 数据源独立 HTML，挂载方式对齐开课页

**Non-Goals:**

- 不改开课 / 培养方案流程图
- 不改排时间、排教室详情页
- 节点本次不要求可点击跳转（需要的话另开变更）
- 不强制把排课图纳入 `export-workflow-pdf.mjs`

## Decisions

### 1. 独立 HTML + fetch 挂载，而不是继续内联 JS

- **选择**：新增 `docs/schedule-workflow.html`（结构抄 `docs/course-offering-workflow.html`：header 图例、diagram-area SVG、workflow-phases，可选 footer / modules）。`renderScheduleWorkflowPage` 改为 parse `.sheet` 子节点挂载，失败文案对齐开课页。
- **备选**：只在 `app.js` 里拼 SVG 字符串。难维护，也和开课不一致。
- **备选**：CSS 画五段流程。达不到「参考 diagram-area」的箭头/色块密度。

### 2. 中轴主路径 + 阶段横支出入口

开课图是「中轴 + 三类开课并列」。排课没有三类并列主轨，而是先后阶段，每阶段多个入口。

```
        [课表节次维护]
               │
     [排课时间设置] [排课规则设置]
               │
     ── 排课表时间（绿）──
     入学批次 教师 课程 联合 冲突查询
               │     ⋯ 自动排课规则 / 自动排课（虚线支路）
     ── 排课表教室（橙）──
     按时间排 按场地类型 场地冲突
               │     ⋯ 自动排教室（虚线）
        [课表查询] [课表密度]
               │
        [调课管理集群]
```

- 节点用 `foreignObject` + `.node` / `.node-title` / `.node-sub`，色板对齐开课：蓝准备、绿计划/时间、橙任务/教室、紫名单/查询、青汇总/调课。
- 教师端入口用现侧栏名：New Replacement / Pending Replacement。
- 教室开放时间、原因类型可作为调课配置支路，避免主轴过长。

### 3. 缩放与样式

沿用现有 `SCHEDULE_WORKFLOW_ZOOM` 与 `.workflow-doc .diagram-area svg`。若排课 viewBox 比开课更高，只调本图 `viewBox` / 最小高度，不改开课挂载逻辑。页内 `.header-left` 仍由现有 CSS 隐藏（标题已在 page-header）。

### 4. 时间 / 教室独立性

图上时间阶段与教室阶段分色、分块，文案继续写清「排课起止时间 / 排教室起止时间」。实现时不要为了「一张图好看」去改 `#page-schedule-time-detail` 或 `#page-schedule-room-detail`。

## Risks / Trade-offs

- [节点过多挤成一团] → 主轴只放阶段代表节点，入口用较短 subtitle；自动排、密度用虚线支路且允许换行排。
- [侧栏改名后图落后] → 节点文案以当前 `#sidebar-nav-schedule` 为准，tasks 里列对照表。
- [file:// 打不开 fetch] → 与开课相同，失败提示走本地服务。
- [图不可点，用户以为能跳转] → 本期不做点击；阶段说明保留「对照侧栏」。

## Migration Plan

原型静态页，无数据迁移。回滚即恢复 `renderScheduleWorkflowPage` 内联 HTML 并删除新文档。

## Open Questions

- 节点是否在后续变更做成点击跳转对应 `data-page`（本期明确不做）。
