## 1. 课节池读路径

- [x] 1.1 重写/修正 `getAdjustmentCancelledSlots`：按停课申请 `items` 与 `slotRefs` 索引对齐拆行，日期取该课堂 `from`；验证：同单含 06 Apr 与 07 Apr 两堂时 Pending 表两行日期分别正确
- [x] 1.2 按 `no + code + group + date + period` 去重假重复行；验证：故意注入两条完全相同课节键后列表只留一行，同模板不同日期仍两行
- [x] 1.3 保持 blocked（申请中/已申请补课）不进可勾选池；验证：已有 pending 补课的停课课节不出现在 `#adjustment-teacher-makeup-cancel-body`

## 2. 停课写入对齐

- [x] 2.1 停课提交写入 `items[].from` 时优先用该行具体日期（若有），再回退周模板；验证：新提交多课节停课通过后 Pending 各行 Date 与申请详情 Previous 一致

## 3. 同源与演示

- [x] 3.1 确认补课抽屉停课选择走同一课节池规则；验证：列表可见课节在抽屉勾选时日期/身份一致
- [x] 3.2 收紧 makeup/holiday 种子或 `rebindAdjustmentCancelToLiveSlot`，避免无区分日期的同模板假双行；验证：李明 CTS101 Pending 不再出现两条完全相同的 Date+Time

## 4. 回归

- [x] 4.1 调课/加课申请与审批详情未误改；验证：非补课路径可正常打开详情
- [x] 4.2 排时间、排教室详情未改；验证：侧栏进入两详情交互与改前一致
