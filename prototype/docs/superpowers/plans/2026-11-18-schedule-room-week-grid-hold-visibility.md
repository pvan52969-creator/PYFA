# 排教室周次格与锁定操作显隐 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 排教室顶栏默认隐藏周次格与锁定操作；勾选「设置周次」才显示周次格；有选中卡片/已排任务才显示锁定/撤销。

**Architecture:** 教室局部状态 `scheduleRoomShowWeekGrid` + `ensure` 注入勾选 + `syncScheduleRoomWeekGridVisibility` / 扩展 `renderScheduleRoomHoldActions` 统一显隐；不改时间模板条目。

**Tech Stack:** 原型 `app.js` / `styles.css`（vanilla DOM）

## Global Constraints

- 仅 `#page-schedule-room-detail`；遵守 `schedule-time-room-independence`
- 删除用注释+原因；不默认 git commit
- 「设置周次」默认不勾选；有选中判定用 `scheduleSelectedSlotIds.size > 0`

---

### Task 1: 状态 + 勾选 + 显隐同步

**Files:**
- Modify: `app.js`（`scheduleRoomViewWeekday` 附近变量；`renderScheduleRoomHoldActions`；`ensureScheduleRoomDetailPage` 已克隆分支；`syncScheduleViewSettingControls` 或 `renderScheduleDetailPage` 调用点）
- Modify: `styles.css`（教室页 `[hidden]` 压过 `display:inline-flex`）

**Interfaces:**
- Produces: `scheduleRoomShowWeekGrid: boolean`；`ensureScheduleRoomShowWeekGridOpt()`；`onScheduleRoomShowWeekGridChange()`；`syncScheduleRoomWeekGridVisibility()`

- [x] **Step 1:** 增加 `let scheduleRoomShowWeekGrid = false`
- [x] **Step 2:** `ensureScheduleRoomShowWeekGridOpt` 仅在教室页 view-settings 末尾补 `#sch-room-show-week-grid`
- [x] **Step 3:** `syncScheduleRoomWeekGridVisibility` 按勾选/选中同步周次格、hold-actions、周次行
- [x] **Step 4:** `renderScheduleRoomHoldActions` 无选中时 `wrap.hidden = true`；并调用 sync
- [x] **Step 5:** CSS：`#schedule-room-hold-actions[hidden]`、周次格/周次行 hidden 强制 `display:none`
- [ ] **Step 6:** 手测验收表四态 + 排时间无回归

---
