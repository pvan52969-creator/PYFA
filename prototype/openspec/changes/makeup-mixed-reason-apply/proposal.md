## Why

补课申请的原因类型、事由、附件是从勾选的停课记录返显且只读的，但右侧只有**一组**字段。多条停课一起申请时，原因类型或事由一旦不一致，当前要么拦截成空白「无法同步」，要么同类型时只取第一条，教师看不清冲突、审批也无法混装不同附件规则。

## What Changes

- 一张补课申请仍然只对应**一种原因类型**（附件是否必传、是否关联请假记录都绑在类型上，不允许混装）。
- 勾选停课原因类型不一致时：右侧不再空白只读；展示冲突说明（各停课的原因类型），禁止提交，提示按相同原因类型分批申请。
- 原因类型相同、事由/附件/请假记录不同时：合并展示事由（去重罗列），附件取并集；允许作为一张申请提交。
- 补课列表 Apply / 抽屉内改勾选时采用同一套判定，避免列表已混选、进抽屉才发现。
- 不改调课/停课/加课自己填写原因的路径；不改排时间、排教室详情。

## Capabilities

### New Capabilities

- `adjustment-makeup-reason`: 补课申请从停课继承原因时，同类型可合并展示与提交，不同类型必须分批且要把冲突说清楚。

### Modified Capabilities

- （无主规格变更；入口变更见 `teacher-adjustment-entry-restructure`，本能力不改入口。）

## Impact

- 补课申请抽屉 `#modal-adjustment-apply` 在 `adjustmentApplyType === 'makeup'` 时的原因类型 / 事由 / 附件 / 请假记录同步（`getAdjustmentMakeupInheritedReason`、`syncAdjustmentMakeupReasonFromCancel`、提交校验）。
- 补课申请页勾选停课后 Apply 的预检。
- 不影响排课表时间 / 排课表教室详情。
