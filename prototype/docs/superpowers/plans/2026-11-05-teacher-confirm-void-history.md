# 授课确认作废进 History Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** 安排变更/教师替换时将旧确认作废进 History；安排详情操作与保存前确认提示；修复草稿行控件溢出。

**Architecture:** 确认段新增 `cancelled`；指纹变化与替换路径调用统一 `cancelTeacherCourseConfirmationForSection`；Portal Pending 只留可确认 pending；安排详情入口包装 `confirmTeacherConfirmVoidIfNeeded`。

**Tech Stack:** 原型 `app.js` / `styles.css`（无独立测试框架，用浏览器联调验收）

**Spec:** `docs/superpowers/specs/2026-11-05-teacher-confirm-void-history-design.md`

## Global Constraints

- 删除逻辑用注释保留，不物理删
- 新方法写清作用注释
- 不改排时间/排教室侧
- 不擅自 git commit

## Files

| File | Responsibility |
|---|---|
| `app.js` | cancelled 状态、作废 API、sync 改 pending→cancelled、替换作废、Portal 过滤、安排详情双确认 |
| `styles.css` | 安排详情草稿周次/学时类型不溢出 |

---

### Task 1: cancelled 状态展示与 Portal 分流

- [x] 1.1 `formatTeacherCourseConfirmationStatusText` / `renderTeacherCourseConfirmationLetterRowStatus` 增加 `cancelled` →「作废」
- [x] 1.2 Portal History 过滤包含 `cancelled`；Pending 仅 `pending`；脏快照不再留在 Pending（改由作废处理）
- [x] 1.3 `recomputeTeacherCourseConfirmationPackageStatus` 兼容 cancelled

### Task 2: 统一作废 + 安排变更触发

- [x] 2.1 新增 `cancelTeacherCourseConfirmationSection(staffId, term, sectionId, { reason })`：置 cancelled、写 history、保留 snapshot
- [x] 2.2 改 `syncTeacherCourseConfirmationPackageRows`：指纹过期时对 confirmed/pending/admin-proxy **作废**而非打成 pending
- [x] 2.3 `syncSectionTeachingConfirmStatusAfterArrangementChange` / 行内保存成功路径确保触发 sync；文案提示作废

### Task 3: 教师替换作废 A

- [x] 3.1 替换后 sync 将被换下教师确认作废（reason: `teacher-replaced`）；alert 文案已更新
- [x] 3.2 原型占位通知（alert「模拟发送 cancel 通知」）

### Task 4: 安排详情双确认

- [x] 4.1 辅助：`sectionHasIssuedOrConfirmedTeacherConfirmation(sec)` + 确认文案常量
- [x] 4.2 包装：✎ / ⧉ / 新增 / 删除 / 配置共同授课 / ✓ 保存

### Task 5: 溢出 CSS

- [x] 5.1 草稿行周次 / 学时类型 `max-width:100%; box-sizing; min-width:0`

### Task 6: 联调验收

- [ ] 6.1 浏览器：脏 pending 应进 History「作废」；Pending 可确认（请本地点验）
- [ ] 6.2 点 ✎ 与 ✓ 各弹确认；取消不改数据（请本地点验）
