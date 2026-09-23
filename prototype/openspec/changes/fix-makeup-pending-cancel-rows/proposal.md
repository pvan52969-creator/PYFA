## Why

教师端 Pending Replacement（补课）列表应对齐「已通过停课 → 按课堂拆行、同单一号」的产品规则，但当前拆行后 Date/Day/Time 常塌成周模板首周或首条 item，导致同申请多堂课显示成重复行，详情里能看到的停课课节在列表中对不上或「消失」。

## What Changes

- Pending Replacement 停课表：一张已通过停课申请的每个停课课堂拆成一行；Ref. ID 仍用该申请单号。
- 每行 Date / Week / Day / Time / Venue 取该课堂自己的原上课信息（与详情 Previous 一致），禁止一律套用 `items[0]` 或无日期时仅用周模板首周覆盖真实停课日。
- 真正相同的课节（同申请 + 同课程组 + 同日期 + 同时段）才去重；不同课堂即使星期/节次模板相同也必须分行。
- 仅 `type === 'cancel'` 且已通过、尚未被补课占用（或按确认后的显隐规则）的课节进入该表；调课/加课不进入。
- 同步修正共享数据源时，补课申请抽屉左侧「选择停课记录」与列表一致（避免列表已拆对、抽屉仍错）。
- 不改排时间 / 排教室详情；不改 `makeup-mixed-reason-apply` 的原因类型合并规则。

## Capabilities

### New Capabilities

- `adjustment-makeup-pending-rows`: 补课 Pending 停课课节池的拆行、日期对齐与去重规则。

### Modified Capabilities

- （无主规格；与进行中的 `makeup-mixed-reason-apply` / `adjustment-makeup-reason` 正交，本变更不改原因继承。）

## Impact

- `getAdjustmentCancelledSlots`、教师补课 Pending 表渲染（`#adjustment-teacher-makeup-cancel-body`）、补课抽屉停课选择同源路径。
- 停课提交时 `items[].from` 与 `slotRefs` 对齐（若读路径不足以保证真实停课日，则一并修正写入）。
- 演示种子 / `rebindAdjustmentCancelToLiveSlot` 若制造假重复，需收紧以免验收时仍出现同日同时假双行。
- 不影响排课表时间 / 排课表教室独立产品面。
