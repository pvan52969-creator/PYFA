## Context

See proposal.md — Why。教师端 Pending Replacement 停课表与补课抽屉共用 `getAdjustmentCancelledSlots()`。当前按 `slotRefs` 展开，但日期常取自 `items[0].from`，且停课提交时 `from` 多用 `adjustmentSlotStruct`（周模板首周），与详情按 item 渲染不一致。`rebindAdjustmentCancelToLiveSlot` 与多层演示种子会加剧「同模板假双行」。

约束：只动补课停课课节池；遵守排时间 / 排教室独立性；不改 `makeup-mixed-reason-apply` 的原因继承。

## Goals / Non-Goals

**Goals:**

- 以「申请 × 课堂」为 Pending 行的真实单位：展示字段对齐该课堂 `from`，Ref. ID 用申请单号。
- 读路径修正为主；必要时修正停课写入的 `items[].from` 与 `slotRefs` 对齐，保证新单不再塌日期。
- 列表与补课抽屉同源规则。
- 收紧导致假重复的 demo/rebind 行为，便于验收。

**Non-Goals:**

- 不改补课原因类型合并 / 冲突展示（另一 change）。
- 不改排时间、排教室详情与共享时间侧右键菜单。
- 不把「已申请/申请中」停课改成灰显可浏览（本版保持不可勾选且不进 Apply 池；若产品要灰显另开需求）。
- 不重做公假日停课确认流程 UI。

## Decisions

### 1. 展开单位：`items` 与 `slotRefs` 按索引对齐

- **选择**：遍历停课申请时以 `items.length` 为主生成行；第 `i` 行展示用 `getAdjustmentItemFrom(r, items[i], i)`（或等价：优先 `items[i].from`）；`val` / 勾选值优先 `slotRefs[i]`（缺失时用稳定回退如 `cancel:{id}#{i}`）。
- **理由**：详情已按 item 渲染；列表必须同源才能消除 07 Apr「消失」。
- **备选**：只按 `slotRefs` 展开并始终 `items[0]` — 已证实错误，否决。

### 2. 日期优先级

- **选择**：`from.date`（该课堂）→ 否则由该课堂 `weeks + weekday` 推算 → 再否则活课表 slot 推算。禁止用别的 item 的 date。
- **写入侧（若现网仍写首周）**：停课提交时，若行状态有具体日期则写入该日期；否则再回退 `adjustmentSlotStruct`。保证新数据自洽。

### 3. 去重键

- **选择**：`no + code + group + date + period(或 periodLabel)`（教师维度已由列表过滤隐含）。
- **备选**：仅 `slotRef` — 无法去掉「不同 ref、同显示」的假重复；仅显示字段无 `no` — 可能误伤不同申请。

### 4. 占用过滤保持现状

- **选择**：`getAdjustmentCancelMakeupStatus.blocked === true`（申请中/已申请）的课节仍不进入可勾选池。
- **理由**：Pending Replacement 的 Apply 目标是「尚未补回」；与已拍板产品「停了再补」一致。灰显浏览留作后续。

### 5. 演示数据

- **选择**：种子/rebind 避免多条未占用停课回绑到同一 `task::slot` 且无区分日期；必要时给 demo cancel 写入互异的 `from.date`。
- **理由**：否则修完读路径后验收仍可能看到假双行。

## Risks / Trade-offs

- [历史脏数据仍无 per-item date] → 写入修复只保新单；读路径对旧单尽量用 item.from，缺失时推算并在 design 验收用种子覆盖典型坏例。
- [items 与 slotRefs 长度不一致] → 以 items 为准补行；多余 ref 忽略或挂到末行策略在实现时单测/手测锁定，避免丢课节。
- [去重过宽误合并] → 键含 date + 申请号；手测「同星期不同日」必须两行。

## Migration Plan

- 纯前端原型：刷新后重跑 `ensureAdjustmentDemo` 即可；无后端迁移。
- 回滚：恢复 `getAdjustmentCancelledSlots` 旧逻辑即可。

## Open Questions

- （已定默认，可不挡实现）「申请中/已申请」是否改为灰显仍可见：本版否，保持隐藏。
- （已定默认）本变更包含停课提交写入 `from.date` 对齐：是，作为防止复发的一部分。
