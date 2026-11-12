# 排课详情：作用域切换迁入面包屑标题下拉

日期：2026-11-12  
状态：已评审待实现

## 背景

排时间 / 排教室详情页中，面包屑末段 `#schedule-time-detail-title` 展示当前对象名（如「海洋环境化学 · 2024/09」），工具栏 `.schedule-scope-switch` 又用「当前批次」等下拉切换同一批对象，信息重复且占课表顶 chrome 空间。

## 目标

将作用域切换做成面包屑末段的**标题样式下拉**（当前对象名 + 小三角），排时间与排教室一并生效；工具栏原下拉注释隐藏。

## 范围

| 纳入 | 不纳入 |
|------|--------|
| `#page-schedule-time-detail` | 联合排课对象切换 / picker |
| `#page-schedule-room-detail`（由时间模板 clone 继承 + 共享渲染） | 多批次页签工作区（另案） |
| 复用现有 `getScheduleScopeSwitchInfo` / `onScheduleScopeSwitch` | 教室锁定 / 待定 / 右键菜单等专属交互 |
| | 新建自定义弹出菜单组件 |

## 结构

时间模板（`index.html` `#page-schedule-time-detail`）改面包屑末段：

- 面包屑末段改为标题下拉容器，**容器根节点保留 `id="schedule-time-detail-title"`**（联合排课隐藏、现有查询仍挂此 id）。
- 容器内挂 `#schedule-scope-select`，`onchange` 仍为 `onScheduleScopeSwitch(this.value)`。
- 不展示「当前批次 / 当前教师 …」标签文案；`#schedule-scope-label` 随工具栏旧块一并注释隐藏。
- 工具栏内 `.schedule-scope-switch`：**注释隐藏**，并注明原因（已迁到面包屑标题下拉），避免空占位。

教室页：继续由 `ensureScheduleRoomDetailPage` clone 时间模板；刷新页面后继承新结构。共享 `renderScheduleScopeSwitcher` 经 `scheduleDetailEl` 按相位操作当前页节点。

## 视觉

- 触发器对齐现面包屑末段字号 / 颜色，像标题可点，不像工具栏 `input-sm`。
- 仅面包屑内标题下拉加专用 class；不改教室侧其它工具栏交互。

## 交互与脚本

1. 选项与现逻辑一致：批次 / 教师 / 课程 / 教室 / 星期 / 场地类型。
2. 触发器文案 = 当前选中项，与 `getScheduleDetailTitle()` 一致。
3. 可切换选项少于 2 个时：仍显示当前标题文案，`#schedule-scope-select` 设 `disabled`。
4. 排教室「按星期」：Day 条保留；**标题下拉可切星期**（不再因与 Day 重复整段隐藏标题切换）。工具栏旧开关继续不出现。
5. `renderScheduleDetailPage` **不再**对 `#schedule-time-detail-title` 写 `textContent`（避免冲掉下拉结构）；标题文案由 `renderScheduleScopeSwitcher` 同步。
6. 联合排课：继续隐藏标题节点，不动 picker；表现与改前一致。

## 主要改动点

- [`index.html`](../../../index.html)：面包屑末段结构；工具栏 scope-switch 注释隐藏。
- [`app.js`](../../../app.js)：`renderScheduleScopeSwitcher`、`renderScheduleDetailPage` 中标题写入；教室按星期隐藏逻辑调整。
- [`styles.css`](../../../styles.css)：面包屑标题下拉样式；必要时隐藏空工具栏。

删除类改动一律**注释 + 原因说明**，不物理删除。

## 验收

1. 排时间详情：面包屑末段为标题下拉；工具栏无「当前批次」下拉。
2. 排教室详情：同样为标题下拉；原工具栏开关不出现。
3. 切换选项后详情切到对应对象，行为与现下拉一致。
4. 联合排课表现与改前一致。
5. 排教室按星期：标题可切星期，Day 条仍在。

## 决策记录

- 外观：标题本身即下拉（方案 A），非「标题旁另挂带标签下拉」。
- 范围：排时间 + 排教室一并改。
- 实现：复用原生 / 现有 select 增强，不新做弹出菜单。
