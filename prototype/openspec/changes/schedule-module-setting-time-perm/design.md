# Design

## Context

See proposal.md — Why. Current page `#page-schedule-module-setting` uses one group header「锁定资源」and four keys in `SCHEDULE_MODULE_SETTING_KEYS`. Toggle path is `onScheduleModuleSettingToggle` → `setScheduleModuleDisabled` → re-render; no cascade. `isScheduleModuleDisabled` exists but is not wired to sidebar/nav in this prototype (header badge: 不联动业务只读).

## Goals / Non-Goals

**Goals:**

- Regroup table header into 时间权限 / 排课权限 / 调课权限; add `timeSetting`.
- Centralize cascade in one apply helper so every toggle ends in a consistent row.
- Keep 勾选=禁用 semantics and existing `is-locked` cell styling.

**Non-Goals:**

- Wiring locks into sidebar nav / page readonly this iteration (optional follow-up via existing `isScheduleModuleDisabled`).
- Changing 排时间 / 排教室详情行为.
- Backend persistence (prototype in-memory store only).

## Decisions

### 1. Store shape

Add `timeSetting: boolean` to each term row. Extend `SCHEDULE_MODULE_SETTING_KEYS` with `{ key: 'timeSetting', label: '时间设置', group: 'time' }` and tag existing keys with `group: 'schedule' | 'adjustment'` for header colspan / render order.

**Alternative:** Separate stores per group — rejected; one row per term already matches UI.

### 2. Cascade as pure function

```
applyScheduleModuleSettingCascade(row, changedKey, nextDisabled) -> nextRow
```

Called from `onScheduleModuleSettingToggle` before write. Rules (勾选=禁用):

| Trigger | Effect |
|---------|--------|
| `timeSetting` → open (false) | Force three schedule keys open (false); force `adjustment` disabled (true) |
| `timeSetting` → disabled (true) | No forced change to schedule/adjustment (「忽略时间限制，以排课权限为准」) |
| Any schedule key change → all three schedule disabled | Force `timeSetting` disabled |
| Attempt `adjustment` → open while any schedule key open | Reject: keep `adjustment` disabled |
| `adjustment` → open (and allowed) | Force `timeSetting` + three schedule keys disabled |
| `adjustment` → disabled | No auto-open of time/schedule |

**Alternative:** Disable checkboxes in DOM without rewriting store — rejected; store must stay source of truth for re-render and future nav hooks.

### 3. Header HTML

Replace single `colspan="4"`「锁定资源」with three group `th`s: colspan 1 / 3 / 1. Leaf row order: 时间设置, 排课表时间, 自动排课表时间, 排课表教室, 调课管理. Empty colspan / `renderScheduleEmptyRow` colSpan 6 → 7.

### 4. UX for rejected adjustment open

Prefer: keep checkbox checked and `alert` / inline hint once（「排课权限仍开放时无法开放调课」）. Do not silently noop without feedback.

### 5. Defaults for existing rows

`ensureScheduleModuleSettingStore`: if row missing `timeSetting`, default `timeSetting =` (all three schedule disabled). Newest term stays all-open including `timeSetting: false`; older terms all-disabled including `timeSetting: true`.

### 6. Runtime meaning of「忽略时间限制」

This change only models the flag in the setting table. Consumers that later honor `!isScheduleModuleDisabled('timeSetting', term)` may skip term window / blackout gates; out of scope to implement those gates here.

## Risks / Trade-offs

- [Ambiguous「第2部分」as one unit vs three checkboxes] → Treat schedule as three keys; 「整组禁用」= all three true; 「仍开放」= any false. Document in tasks acceptance.
- [Cascade surprises when bulk-toggling] → Single-key toggles only; no bulk header checkbox in this change.
- [Users expect nav lock] → Keep demo badge; note follow-up if product wants real disable.

## Migration Plan

- In-memory only: extend default builder; backfill missing `timeSetting` on ensure.
- No persistence migration.
- Rollback: revert HTML/KEYS/cascade; old four-column UI returns.

## Open Questions

- None blocking implementation; if product later wants「任一排课列禁用即禁用时间设置」instead of「三列全禁用」, that is a one-line cascade tweak without regrouping the table.
