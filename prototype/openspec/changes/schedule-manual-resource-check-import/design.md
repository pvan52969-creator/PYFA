# Design

## Context

See `proposal.md` Why. Current prototype:

- Time detail already has venue types, multi `preferredRooms`, single `lockedRoom`, and conflict fill via `is-conflict-*` with inset `box-shadow` borders in `styles.css`.
- Time phase clears room conflict paint buckets; room conflict legend items are hidden on time side.
- Auto-schedule time/room job pages (`SCHEDULE_AUTO_STORE`) exist as a separate product path and are out of scope.
- Time and room detail pages must stay independent (`schedule-time-room-independence`).

## Goals / Non-Goals

**Goals:**

- Decouple **resource border states** from **conflict fill** classes so borders are exclusive to classroom resource pressure on time detail.
- Add mock capacity bands + right-click capacity table + pending-card-triggered refresh.
- Wire force-place in the existing placement dialog; tighten lock-one UX for prefs.
- Add「一键导入」on manual time and room detail tool chrome; room import encodes B2B nearest pairing with teacher priority.
- Keep side isolation: time logic in time page/chrome; room import/B2B in room-phase early-return blocks / `#page-schedule-room-detail` CSS.

**Non-Goals:**

- Rewriting teacher/student/soft fill colors (already adjusted).
- Implementing real solver engines; prototype may mock availability and import results with deterministic demo data.
- Changing `#schedule-room-grid-context-menu` item set for lock/revoke unless a separate capacity entry is proven necessary on room side (default: capacity table on time side only).
- Auto job pages, offering preference UI, joint dual-window sync, summary-room campaign UI.

## Decisions

### D1: Separate CSS classes for resource vs conflict

- **Choice:** Introduce resource classes (e.g. `is-room-resource-ok` / `is-room-resource-sellout` / `is-room-resource-over`) applied beside or instead of conflict border shadows. Strip `box-shadow: inset …` from `.is-conflict-teacher|student|soft|…` (and selected overlays that re-apply conflict insets), leaving background fills.
- **Why:** Spec requires borders exclusive to resource; keeping paint primary on conflict kinds avoids breaking teacher/student precedence.
- **Alternative:** Reuse `is-conflict-room` with border-only styling — rejected because time side currently clears room paint and semantics mix「教室占用冲突」with「容量售罄/超排」.

### D2: Capacity model as configurable band seed

- **Choice:** Mock `SCHEDULE_ROOM_CAPACITY_BANDS` (or equivalent) per venue type: ordered intervals with room counts; per weekday/period available = total − seated demands under extreme-first then middle-upward seating.
- **Why:** Matches product「区间可配置」without needing a settings page this change.
- **Alternative:** Derive bands only from live `SCHEDULE_ROOM_META` seat histograms each render — still useful as enrichment, but band labels in the right-click table should stay stable for demo.

### D3: Trigger pipeline on pending card + venue fields

- **Choice:** On pending-task activate and on venue type save, recompute resource overlay for visible grid cells for that task.「不选择教室」still runs the check (type-agnostic or default lecture pool — use ordinary/lecture pool mock unless product later splits).
- **Why:** User confirmed click-left-card starts checking the right timetable.
- **Alternative:** Only after「设置场地类型」— too late per confirmation.

### D4: Force place as dialog flag, not silent override

- **Choice:** Extend existing place/conflict dialog with「强行排入」; set a per-placement flag that skips hard stop for conflict and capacity, then re-render resource borders (likely overbooked).
- **Why:** Matches「安排时出现提示，可强行排入」and keeps auditability in the prototype flow.
- **Alternative:** Context-menu only force — rejected; user chose dialog.

### D5: One-click import entry on manual detail chrome

- **Choice:** Place「一键导入」on time detail and room detail tool/action areas (not sidebar auto pages). Scope = current pending list for the open detail context (batch/teacher/course filter already applied). Time import writes time slots respecting resource bands; room import assigns rooms with B2B ladder.
- **Why:** Same manual capability family; avoids conflating with `schedule-auto-*` jobs.
- **Alternative:** Reuse auto job timer UI — rejected by product confirmation.

### D6: B2B distance using room meta

- **Choice:** Score candidate pairs with ordered keys: same room id → adjacent id/meta neighbor → same floor → same building → other. When optimizing two rooms for linked periods with different types, minimize teacher path first, then student path.
- **Why:** Matches confirmed ladder and teacher-over-student priority; meta already has building/floor-ish fields in room pool.
- **Alternative:** Geographic coordinates — overkill for prototype.

### D7: Lock picker remains single-select

- **Choice:** Keep `lockedRoom` scalar; prefs stay multi. Picker default suggestion: first preferred if free, else similar type room; AC can pick outside prefs. Ordinary type keeps lock field visible.
- **Why:** Aligns with existing data shape and「锁定只取一」.
- **Alternative:** Array of locks — conflicts with「只锁一个」.

## Risks / Trade-offs

- **[Risk] Existing user-tuned border CSS conflicts with stripping insets** → Mitigation: before edit, diff current `.is-conflict-*` rules; only remove border/inset, do not reset fill colors; prefer additive resource classes under `#page-schedule-time-detail`.
- **[Risk] Clone room detail inherits time chrome** → Mitigation: resource overlay and time capacity menu gated to time phase; room import button patched post-clone with `data-sch-phase-tab="room"`.
- **[Risk] Mock seating order differs from production solver** → Mitigation: document extreme-first algorithm in UI helper text; keep deterministic seed for demos.
- **[Risk] Force place weakens conflict teaching demos** → Mitigation: force is explicit secondary action; default path still warns.

## Migration Plan

- Prototype-only: no data migration. Feature-flag unnecessary; ship behind normal page load.
- Rollback: revert change branch; resource classes unused if JS not wired.

## Open Questions

- Exact「隔壁教室」adjacency list source if meta lacks neighbor ids — default to sequential room codes in same floor mock during apply.
- Whether time-side one-click import also paints post-import resource borders immediately — assume yes (same overlay pipeline).
