# 排课门户开放时间拆分 Implementation Plan

> **For agentic workers:** 本会话 inline 执行。Steps 用 checkbox 跟踪。按用户约定：**不自动 git commit**。

**Goal:** 学期开放时间拆成四列；专业不含调/补/加范围；模块增加「调课时间设置」并与排课时间设置分轨。

**Architecture:** 在 `normalizeScheduleTimeConfig` 迁移旧 `teacherView*`/`studentView*`；UI/保存读写新字段并回写旧字段兼容；模块 KEYS 增 `adjustmentTimeSetting`，扩展 cascade。

**Tech Stack:** 原型 `index.html` / `app.js` / 必要时 `styles.css`

## Global Constraints

- Spec: `docs/superpowers/specs/2026-11-26-schedule-portal-windows-split-design.md`
- 不删代码：注释 + 原因；变量/方法加简短注释
- 不改排时间/排教室详情；不自动 commit
- 调/补/加可选范围仅学期级

---

### Task 1: 数据字段 + 迁移

**Files:** Modify `app.js`（`buildDefaultScheduleTimeConfig`、`normalizeScheduleTimeConfig`、`seedScheduleTermTimeDemoWindow`）

- [x] 新增学期字段：`teacherTimetableView*`、`teacherAdjustmentOpen*`、`adjustmentSelectableRange*`、`studentTimetableView*`
- [x] `normalize`：旧→新迁移；`adjustmentSelectableRange` 空则默认同排课起止；旧字段保留
- [x] 专业 unitTimes：迁移 `teacherTimetableView*` / `teacherAdjustmentOpen*` / `studentTimetableView*`（无 selectable range）

### Task 2: 学期主表 + 弹窗

**Files:** Modify `index.html`（表头、modal）；`app.js`（render/save/open/sync/clear）

- [x] 主表 4 列新文案；empty colspan 8→10
- [x] 弹窗四组区间控件 + sync/save/校验文案
- [x] 展开行 colspan 同步

### Task 3: 专业子表

**Files:** Modify `app.js`（subtable thead/body、fieldMap、add/save/validate）

- [x] 列：教师查看课表、教师调课开放、学生查看课表（无调/补/加范围）
- [x] kind 映射到新字段；默认值取学期新字段

### Task 4: 模块设置拆列 + 互锁

**Files:** Modify `index.html`（表头/tip）；`app.js`（KEYS、default、normalize、cascade）

- [x] 表头：排课时间设置；调课权限下增加调课时间设置
- [x] cascade：开放调课管理时强制禁用排课时间设置；调课时间设置可开放
- [x] tip 文案对齐

### Task 5: 手测核对

- [ ] 学期四列回显/保存；专业无调补加范围列；模块两列开关与互锁
