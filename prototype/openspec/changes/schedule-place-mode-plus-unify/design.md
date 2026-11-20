# Design

## Context

See proposal.md — Why. Current prototype already has:

- `scheduleActiveFromCourseList` = left-card place mode
- Time: `exitScheduleTimePlaceModeForSlotSelection` when selecting slots; left select clears slot selection
- Time/joint CSS: place-mode “+” for `is-active-target` (empty center, occupied right)
- Time JS (recent): occupied cells in place mode get `is-active-target`; click no longer switches to occupying course
- Room: place “+” mainly on empty / pending / locked; mutual exclusion when clearing selection also clears place mode, but selecting left card may keep room slot selection (`keepSlotSelection`)

Audit vs product ask (“左侧卡排入；格子有 +；已占也 + 在卡片右方；与格选互斥”):

| 约定 | 排时间 | 排场地 |
|------|--------|--------|
| 左卡 = 排入态 | 基本有 | 有选课上下文，口径略不同 |
| 与格选互斥 | 有（exit / clear） | 半对齐：清选中退排入；选左卡可保留节次高亮 |
| 空格悬停 + | 有（place-mode CSS） | 有（empty target） |
| 已占/冲突格悬停 + 在卡片右 | 近期补齐（他课已占也标 target） | 待定/锁定有右 +；非 pending 的「他课卡」模型不同 |
| 点已占格走落点+冲突、不切他课 | 近期改为整格落点 | 点格走教室冲突/强排路径，需对照验收 |

## Goals / Non-Goals

**Goals:**

- One written contract for left-card place mode across time + room (+ joint row restriction)
- Close remaining gaps so “+ on card-right for occupied placeable cells” and mutual exclusion match the contract
- Keep conflict modal complete (hours + room resource) when placing into painted cells

**Non-Goals:**

- Changing which conflicts are forceable vs hard-block
- Redesigning room pending/locked visual language beyond plus/place consistency
- Auto-scheduling / one-click import behavior

## Decisions

### 1. Single mode flag remains `scheduleActiveFromCourseList`

**Choice:** Keep one boolean for left-card place mode on both phases.  
**Alt:** Separate time/room flags — rejected; increases desync risk.

### 2. Mutual exclusion policy

**Time (adopted):** Left place ↔ grid slot select hard mutex via existing helpers.  
**Room (align):** When entering left-card place mode, clear in-grid slot selection (same as time). When selecting slots for room edit, exit left place mode or document an explicit exception — **adopt clear-on-enter-place** so “无法同时选中” holds for both phases.

### 3. Plus placement

- Empty eligible: center “+”
- Occupied / pending / locked placeable: “+” at card-right gutter (`right` + optional content width reserve)
- Joint: only active object row is placeable; inactive rows no “+”

### 4. Click semantics in place mode

Whole cell places (cards `pointer-events: none` in place mode on time/joint). Do not switch left selection to occupying course on click. To select occupying course: exit place mode first (toggle left card off or select slot without place mode).

### 5. Conflict detection on place

Always use full placement detection (include room resource sellout/over), not paint-only `skipRoomResource` cellConf, when opening the place conflict modal from left-card place clicks.

## Risks / Trade-offs

- [Place mode blocks selecting occupying cards with one click] → Document: cancel left selection first; matches product “整格可排入”
- [Room keepSlotSelection change breaks “选课仍看已选节次高亮”] → Replace with place-mode active-course highlight only; verify room UX once
- [CSS overflow on narrow cells clips right “+”] → Keep cell padding / z-index; hand-test MEC903-width cells

## Migration Plan

1. Lock contract in specs (this change).
2. Align room mutex + remaining plus gaps; regression-check time/joint.
3. Hand-test matrix: empty, own occupied, other occupied, conflict colors, hours-full+sellout, joint inactive row.
4. Rollback: revert place-mode class/CSS and click diversion comments only.

## Open Questions

- Room phase: after aligning mutex, is any “keep selected slots while placing” workflow still required for 锁定教室? Default in this design: **no** — place mode clears slot selection.
