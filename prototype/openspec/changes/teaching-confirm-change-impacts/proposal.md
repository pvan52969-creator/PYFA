# Proposal

## Why

「授课确认」（原型字段 `teachingConfirmStatus`，现与「任务安排提交」绑定）已成为下游生效（进名单 / 开课清单 / 排课）的前提；唯有「授课教师替换」可在不重走完整确认链的情况下改教师。开课安排的撤回 / 退回及事后变更会把确认态打回或拆班，与教师替换旁路叠在一起后规则难讲清、易漏边。需要先把**影响矩阵**钉死，再决定要不要改门禁或旁路。

## What Changes

- 新增能力规格：按事件分类列出对「授课确认 / 任务安排提交态」及下游可见性的影响（教师替换 vs 开课撤回/退回 vs 退回后再变更）。
- 明确当前原型语义：`teachingConfirmStatus === 'confirmed'` ≈ 任务安排已提交；与历史文案「授课确认」同字段。
- 标出易漏场景（合班拆回、已排课后撤回门禁、名单退回 vs 计划退回、替换审批中途又撤回等），供产品确认取舍。
- **本变更以规则整理与规格落地为主**；是否取消「确认作生效门禁」或扩大教师替换旁路，列为 design 决策，不在本提案默认改代码行为。

## Capabilities

### New Capabilities

- `teaching-confirm-change-impacts`: 授课确认（任务安排提交态）在教师替换、开课撤回/退回及后续变更下的状态与下游影响规则

### Modified Capabilities

- （无）现有 `openspec/specs/` 无对应开课确认能力需改写

## Impact

- 规划产物：`openspec/changes/teaching-confirm-change-impacts/`（proposal / design / specs / tasks）
- 实现阶段可能波及（待 design 拍板后）：`app.js` 中 `markMajorOfferingTaskArrangementSubmitted` / `withdraw*` / `revert*` / `teachingConfirmStatus` 读写；调课「教师替换」审批生效路径；开课清单 / 排课任务可见性门禁
- 不默认改：排时间 / 排教室详情交互、自动排课页
