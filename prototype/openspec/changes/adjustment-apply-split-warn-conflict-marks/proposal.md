# Proposal

## Why

调课申请抽屉里，「拆组」会立刻拆开联动组展示，但用户未必知道提交通过后无法再通过调课合并；目标节次下拉里师生冲突与场地冲突目前共用同一个 ⚠，难以一眼区分冲突性质。需要补上拆组不可逆提示，并把场地冲突改成独立标记。

## What Changes

- 点击左侧课节列表「拆组」时，先弹出确认提示：该课堂拆组提交通过后无法通过再次调课合并；确认后才执行拆组，取消则保持原状。
- 「合并组」路径行为不变（含已通过拆开后不可合并的既有拦截）。
- 目标节次下拉选项的冲突标记改为两类：学生冲突与教师冲突继续使用现有 ⚠；场地冲突使用新的独立标记。
- 同一选项最多同时展示 2 个标记（典型为「师生类 ⚠」+「场地新标记」）；学生与教师同时冲突时仍只显示一个 ⚠。
- 不改排时间/排教室课表格着色、冲突检测口径、提交校验规则。

## Capabilities

### New Capabilities

- `adjustment-apply-drawer`: 调课申请抽屉内左侧联动拆组确认与右侧目标节次冲突标记展示约定。

### Modified Capabilities

- （无）主库 `openspec/specs/` 尚无调课申请抽屉能力；本次以新能力落档。

## Impact

- `app.js`：`toggleAdjustmentSlotLinkBundleSplit`（拆组前确认）、`buildAdjustmentPeriodConflictWarnHtml` / `formatAdjustmentPeriodConflictHint`（分类型标记与上限）。
- `styles.css`：新场地冲突标记样式；可恢复/改写此前注释掉的多标记容器样式（`.adj-period-dd-warns`）。
- 范围限于 `#modal-adjustment-apply` 调课申请抽屉；不影响排课详情页冲突色与其它批量调课列表。
