# 排课详情作用域标题下拉 Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** 把排时间/排教室详情的作用域切换从课表工具栏迁到面包屑末段标题下拉。

**Architecture:** 时间模板改 DOM；教室页 clone 继承；复用 `onScheduleScopeSwitch`；`renderScheduleScopeSwitcher` 负责填选项与 disabled。

**Tech Stack:** 静态 HTML/CSS/JS 原型（`index.html` / `styles.css` / `app.js`）

## Global Constraints

- 删除用注释+原因，不物理删除
- 排时间/排教室一并改；联合排课继续隐藏标题
- 不新建自定义弹出菜单

---

### Task 1: HTML 迁结构

- [x] 面包屑 `#schedule-time-detail-title` 改为含 `#schedule-scope-select` 的标题下拉容器
- [x] 工具栏 `.schedule-scope-switch` 注释隐藏
- [x] `ensureScheduleRoomDetailPage` 增加「标题内含 select」检测以强制旧 clone 重建

### Task 2: JS 渲染

- [x] `renderScheduleDetailPage` 不再 `textContent` 写标题
- [x] `renderScheduleScopeSwitcher`：填选项、选项<2 时 disabled；取消按星期整段隐藏标题切换

### Task 3: CSS

- [x] 标题下拉外观（像面包屑标题 + 小三角）
- [x] 空工具栏不占位（若仍残留）

### Task 4: 验收

- [x] 排时间：标题下拉有选项、工具栏无旧下拉（浏览器核验）
- [ ] 排教室标题可切换；联合排课不变；按星期可切（请本地刷新后再看一眼）
