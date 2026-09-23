## Context

See proposal.md — Why.

Scheduling Management already keeps most mutable state in memory (`COURSE_OFFERING_PLAN_*`, `SCHEDULE_*_STORE`, `ADJUSTMENT_STORE`, etc.), so a normal refresh re-runs seed helpers and looks “reset”. Two intentional exceptions break the desired demo contract:

1. **`localStorage` `pyfa-adjustment-user-requests-v1`** — `persistAdjustmentUserRequests` / `restoreAdjustmentUserRequests` keep non-`demoOps` requests across reloads; `ensureAdjustmentDemo` always restores them after seeding.
2. **`sessionStorage` `pyfa-schedule-demo-arrange-v1`** — demo course arrange snapshots are written on `persistTaskSchedule` and merged in `ensureScheduleGlobalDemo`. Boot only clears session when **not** opening a schedule-detail deep link (`tryOpenScheduleDetailFromUrl`); refresh on a detail URL or a new tab can therefore restore arranged demo slots.

Constraint: do not change time vs room product-surface independence; this change is data lifecycle only.

## Goals / Non-Goals

**Goals:**

- Every full document load → current-version seed/Mock baseline for all Scheduling Management menus.
- Same document, no reload → in-memory mutations continue to drive the flow.
- Remove schedule/adjustment user-op restore from browser storage.

**Non-Goals:**

- Redesigning seed content or inventing new demo fixtures (baseline = current code).
- Changing Curriculum / Course Offering standalone persistence strategies.
- Adding a “reset demo” button or versioned seed snapshot files.
- Preserving cross-tab continuity of in-progress arrange (explicitly traded away).

## Decisions

### 1. Treat “refresh” as any full document load

**Choice:** Any new document (F5, address-bar reload, new tab, deep-link open) starts from seed. No special case for schedule-detail URL or joint-demo tab.

**Why:** Matches “刷新网页不管做了哪些操作都回到初始化状态”. Cross-tab restore via `sessionStorage` is the main leak.

**Alternative considered:** Keep `sessionStorage` only for “list → open arrange in new tab” and clear only on portal entry. Rejected — still survives refresh on the detail document and conflicts with the stated rule.

### 2. Delete adjustment user-request persistence path

**Choice:** Stop writing/reading `ADJUSTMENT_USER_REQUESTS_KEY`. Leave `ADJUSTMENT_STORE` as memory-only; keep `demoOps` / seed helpers as the only source of list demos after load. On first load after deploy, optionally `removeItem` the old key once so leftover browser data cannot resurrect.

**Why:** This is the only `localStorage` usage in the repo and directly violates ephemeral mock.

**Alternative considered:** Keep storage but clear on boot. Rejected — dead code and invites reintroduction; clearer to remove the API.

### 3. Remove demo-arrange session bridge

**Choice:** Remove `persistScheduleDemoArrangeToSession` / `loadScheduleDemoArrangeFromSession` usage (and clear key on boot for leftover cleanup). `ensureScheduleGlobalDemo` restores only from in-memory snapshot within the same document lifetime (re-seed guards), not from storage.

**Why:** Same-document re-entry to detail already works via memory + `scheduleGlobalDemoSeeded`; storage existed mainly for new-tab / refresh-on-detail.

**Alternative considered:** Clear session on every boot but keep write path. Rejected — useless writes; prefer delete.

### 4. Baseline definition

**Choice:** “当前版本 Mock 初始化状态” = whatever seed functions produce after this change’s code is loaded (no frozen JSON dump in this change).

**Why:** Prototype seed evolves with features; freezing a snapshot file is a separate concern.

## Risks / Trade-offs

- **[Risk] New tab from list no longer shows parent’s just-arranged demo slots** → Mitigation: prefer same-tab navigation for demos; document in tasks/PR notes if UI copy mentions “新页签恢复”.
- **[Risk] Shared `COURSE_OFFERING_PLAN_STORE` means schedule mutations also affect course-offering views in the same document** → Mitigation: out of scope; refresh still resets both via re-seed. Do not add schedule-only storage to isolate them.
- **[Risk] Stale `localStorage`/`sessionStorage` keys in testers’ browsers** → Mitigation: one-shot `removeItem` on boot for the two known keys.

## Migration Plan

1. Ship code that stops persist/restore and clears legacy keys on boot.
2. No data migration; testers hard-refresh once.
3. Rollback: revert the persistence removal (not expected for a prototype).

## Open Questions

None — cross-tab continuity decided as out of scope under Decision 1.
