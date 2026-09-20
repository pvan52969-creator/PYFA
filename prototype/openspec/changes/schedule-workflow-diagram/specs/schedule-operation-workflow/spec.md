## Purpose

让排课管理「操作流程图」以开课流程图同款 SVG 图示展示主路径、阶段色块与侧栏入口，而不是五段纯文字卡片。

## ADDED Requirements

### Requirement: Schedule workflow page shows an SVG diagram
排课管理「操作流程图」页 SHALL 在文档区内展示一块 `diagram-area`，内含 SVG 流程图（色块节点、箭头、阶段图例），视觉结构与开课「操作流程图」同款。SHALL NOT 再以仅有标题+副文案的五段纵向卡片作为主图。

#### Scenario: User opens schedule workflow
- **WHEN** 用户进入排课管理侧栏「操作流程图」
- **THEN** 主图是带节点与连线的流程图，而不是 ①–⑤ 文字卡片堆叠

#### Scenario: Legend matches phases
- **WHEN** 流程图加载完成
- **THEN** 图例至少覆盖主路径五阶段：排课基础设置、排课表时间、排课表教室、课表查询、调课管理

### Requirement: Main path stays five stages
主路径 SHALL 保持：排课基础设置 → 排课表时间 → 排课表教室 → 课表查询 → 调课管理。各阶段节点 SHALL 列出该阶段对应的侧栏入口（至少包含当前侧栏已展示的主要菜单项）。联合排课、自动排课/排教室、场地冲突、课表密度、调课配置类入口若出现在图上，SHALL 作为支路，不得改写主路径顺序。

#### Scenario: Time then room
- **WHEN** 用户阅读主路径
- **THEN** 「排课表时间」在「排课表教室」之前

#### Scenario: Auto-schedule is a branch
- **WHEN** 图上出现自动排课或自动排教室
- **THEN** 它们是对应阶段的支路，不插入主路径成为新的第 2.5 步

### Requirement: Load like course workflow
本页 SHALL 从独立流程图 HTML 加载并挂载到 `#schedule-workflow-doc-mount`。加载失败时 SHALL 显示可理解的失败提示，而不是留下空白或旧五段卡片。缩放控件行为可与现有排课流程图页保持一致。

#### Scenario: Fetch succeeds
- **WHEN** 本地服务可读取流程图 HTML
- **THEN** 挂载后可见 SVG 主图与阶段说明

#### Scenario: Fetch fails
- **WHEN** 流程图 HTML 无法加载
- **THEN** 文档区显示失败说明，提示用本地服务打开后刷新

### Requirement: Time and room product surfaces stay independent
本改动 SHALL 只影响操作流程图页的呈现。SHALL NOT 改变排课表时间详情、排课表教室详情的交互、菜单或校验。

#### Scenario: Scheduling detail pages unchanged
- **WHEN** 用户从侧栏进入按入学批次排或按时间排教室
- **THEN** 详情页行为与改流程图前一致
