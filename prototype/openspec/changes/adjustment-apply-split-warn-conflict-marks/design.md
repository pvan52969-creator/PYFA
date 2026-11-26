# Design

## Context

- 拆组入口：`toggleAdjustmentSlotLinkBundleSplit`；当前点「拆组」直接改 `adjustmentSlotPickerLinkSplitKeys` 并重渲染，无确认。已通过拆开后的合并拦截已有 `alert`。
- 节次冲突标记：`buildAdjustmentPeriodConflictWarnHtml` 对探测结果统一输出单个 ⚠；`styles.css` 中曾有 `.adj-period-dd-warns` / `.adj-period-dd-mark`（学/师/场分色字标）已整块注释，产品撤回过「三字标」方案。
- 冲突探测仍走 `probeAdjustmentPeriodConflict` / `checkAdjustmentConflictForVal`（student / teacher / room|roomCapacity），本设计不改口径。

## Goals / Non-Goals

**Goals:**

- 拆组前用确认打断误点，文案钉死「提交通过后无法通过再次调课合并」。
- 节次选项上师生类与场地类视觉分离，且同时最多两个标记。

**Non-Goals:**

- 不改排时间/排教室格子着色、冲突检测逻辑、提交是否拦截。
- 不恢复「学 / 师 / 场」三枚独立字标（师生共用 ⚠）。
- 不引入新确认组件库；原型沿用现有 `confirm` / `alert` 习惯即可。

## Decisions

### 1. 拆组确认用 `openDeleteConfirm`，仅拦截「未拆 → 拆开」

- **选择**：在 `toggleAdjustmentSlotLinkBundleSplit` 判定 `!wasSplit` 时打开通用确认弹窗 `openDeleteConfirm`；确认回调再执行拆组。合并分支与已通过拆开拦截不变。
- **弃用**：`window.confirm`。原因：Cursor 内置浏览器会吞掉原生 confirm，界面无提示且静默当作确认，用户感知为「点了没提示」。
- **文案**：标题「拆组确认」；正文「该课堂拆组提交通过后无法通过再次调课合并。」；确认按钮「继续拆组」。

### 2. 冲突标记：师生合并 ⚠，场地用独立「场」字标

- **选择**：改写 `buildAdjustmentPeriodConflictWarnHtml`：
  - `hasPerson = student || teacher` → 一个 `<span class="adj-period-dd-warn">⚠</span>`
  - `hasVenue = roomCapacity || room` → 一个 `<span class="adj-period-dd-warn is-venue" …>场</span>`（或同等短标）
  - 包在 `.adj-period-dd-warns` 容器内，gap 紧凑；总数自然 ≤ 2
- **备选**：场地用另一 emoji（如 ⌂）— 与现有中文管理端字标习惯略远；实现时可按视觉微调，但不得再与 ⚠ 同形。
- **title/aria-label**：复用并微调 `formatAdjustmentPeriodConflictHint`，整段挂在容器或各标记上均可，须含实际类型名。
- **样式**：启用注释块中的多标记布局思路，但只保留「师生 ⚠」+「场地字标」两态；场地标用与 ⚠ 可区分的色（如蓝底「场」），避免再出现三枚学/师/场。

### 3. 作用面

- 仅调课申请抽屉目标节次下拉（`#modal-adjustment-apply` 内 `adj-period-dd-opt`）。
- 详情/审批表其它冲突展示若未走同一 helper，本变更不强制同步；若共用 helper 则一并受益。

## Risks / Trade-offs

- [重复 confirm 打扰] → 仅「拆组」触发；合并/已禁用按钮不弹。
- [「场」字标被当成旧三字标回潮] → Spec/实现注释写明：师生禁止拆成学/师两标；仅场地独立。
- [浏览器 `confirm` 文案无法富文本] → 可接受；原型一致。

## Migration Plan

- 纯前端原型改动；无数据迁移。回滚：去掉 confirm、恢复单 ⚠ helper 即可。

## Open Questions

- 无。场地标记若产品后续指定其它字形，可只换字符/样式，不改「最多两标、师生共用 ⚠」规则。
