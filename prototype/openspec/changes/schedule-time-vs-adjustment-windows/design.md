# Design

## Context

See proposal.md — Why. Existing pieces:

- `#page-schedule-module-setting`：三组互锁已落地（`timeSetting` / 三个排课键 / `adjustment`）；开放调课强制禁用 `timeSetting`。
- `#page-schedule-time-setting`：学期配置含 `teacherViewStart/End`、`studentViewStart/End`，UI 文案为「教师使用开放时间」「学生查看开放时间」。
- `isScheduleModuleDisabled('timeSetting', term)` 尚未作为门户窗口的前置条件；产品上若误读「时间设置关掉 = 所有时间规则失效」，会把教师调课窗口也一并关掉。

本设计只钉职责切分与最小原型接线，不改互锁主规则。

## Goals / Non-Goals

**Goals:**

- 文档化并在原型文案中固定：`timeSetting` = 排课时间约束；门户开放时间独立。
- 定义调课入口判定：`!disabled(adjustment) && inTeacherWindow`。
- 定义学生课表查看判定：`inStudentWindow`（与调课权限无关）。
- 模块列表头更名/副文案，tip 与排课时间设置页说明对齐。

**Non-Goals:**

- 新增第二列「调课时间设置」或第二套互锁。
- 改 `applyScheduleModuleSettingCascade` 主规则。
- 改排时间 / 排教室详情、教室开放时间（审批用）。
- 完整教师/学生门户页面实现；仅契约 + 必要时最小 toast/禁用示意。

## Decisions

### 1. 三轨模型（推荐方案）

```
+------------------+     +------------------------+     +----------------------+
| timeSetting      |     | teacherView window     |     | studentView window   |
| 排课时间约束      |     | 教师使用开放时间         |     | 学生查看开放时间       |
+--------+---------+     +-----------+------------+     +----------+-----------+
         |                           |                             |
         v                           v                             v
  学期窗/不排课等              调课申请入口                    学生课表查看
  （排课侧）              + 需 adjustment 开放                  （只读查看）
```

**Alternative A — 调课也挂在 timeSetting 上：** 与互锁冲突（开调课必关 timeSetting），拒绝。

**Alternative B — 再加「调课时间设置」模块列：** 与教师窗口重复；仅当需要「管理员一键忽略教师窗口」时再议，本变更不做。

**Alternative C — 调课完全无时间窗、只靠模块开：** 丢失「期中只开两周让教师改」的常见运营手段；拒绝。用已有教师窗口即可。

### 2. 判定函数边界（原型）

建议集中两个只读 helper（命名可落地时微调）：

- `isScheduleTeacherPortalOpen(termId, now)` → teacher window contains now（空窗策略：两端皆空视为「未配置=关闭」或「始终开放」二选一，见 Open Questions；默认 **两端皆空 = 视为未开放**，避免误开）。
- `canTeacherStartAdjustmentApply(termId, moduleKey, now)` → `!isScheduleModuleDisabled('adjustment', …) && isScheduleTeacherPortalOpen(…)`。

`timeSetting` **不**进入上述函数。排课侧约束另走 `!isScheduleModuleDisabled('timeSetting')` 再叠学期窗/黑名单。

### 3. 文案

- 模块设置叶子列：`时间设置` → `排课时间`（store key 仍用 `timeSetting`，避免迁移；语义=仅排课侧，不涉及调课）。
- tip：统一用「时间权限 / 排课权限 / 调课权限」表述（不用「板块1/2/3」）；写明默认调课关闭；并说明排课时间关闭时排课侧规则可忽略，教师/学生门户开放时间仍独立生效。
- 排课时间设置页：教师字段副文案注明「含课表查看与调/停/补/加课申请」；学生字段注明「仅学生课表查看」。

### 4. 与既有互锁的兼容

开放 `adjustment` 时 cascade 仍强制 `timeSetting=true`（禁用）。这与本设计一致：调课阶段本来就不跑排课约束；门户窗口继续用 `teacherView*`。

## Risks / Trade-offs

- [两端皆空语义不清] → 任务里固定一种默认，并在 UI 标明「未配置则关闭」。
- [运营误以为开调课即可申请] → tip + 教师窗口副文案；示意入口在窗外禁用。
- [后续真要「管理员无视教师窗」] → 可加独立 override，不回绑 `timeSetting`。

## Migration Plan

- 文案/key label 变更；store key 不变。
- 无持久化迁移。
- 回滚：恢复列名与 tip；去掉新 helper 调用即可。

## Open Questions

- 教师/学生窗口「起止皆空」：本设计默认按未开放处理；若产品要「空=始终开放」，只需改 helper 一处，不改规格结构。
