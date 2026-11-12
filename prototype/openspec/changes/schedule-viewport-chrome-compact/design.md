# Design

## Context

See proposal.md for motivation. Prototype surfaces involved:

- Time detail shell: `#page-schedule-time-detail` (batch / teacher / course share this layout; left `.schedule-detail-sidebar` + stacked top chrome above `#schedule-timetable-grid`).
- Joint: `#page-schedule-joint` / demo clone; already has `toggleScheduleJointChrome` + `is-joint-chrome-collapsed` that folds `[data-joint-fold]` top filters, but does **not** hide the left list or equal “grid-only fullscreen”.
- Room detail: `#page-schedule-room-detail` cloned from time via `ensureScheduleRoomDetailPage`; room-only panels (filters, hold bar) must stay room-scoped. Workspace rule `schedule-time-room-independence` forbids shared-menu / cross-side drive-by edits.

App-level `is-schedule-detail-immersive` hides the **application** sidebar for standalone tabs; it is not a substitute for timetable-area fullscreen inside the detail page.

## Goals / Non-Goals

**Goals:**

- One clear enter/exit for “timetable area fullscreen” on time detail, joint, and (separately) room detail.
- Fullscreen = completely hide left course list + top tool chrome; grid fills the work area; exit control always visible.
- Room implementation isolated (own state, own CSS hooks, clone-safe patches).

**Non-Goals:**

- Compacting top chrome into fewer rows without fullscreen (nice-to-have later; not this change’s success criterion).
- Changing conflict / lock / placement rules or context-menu item sets.
- Browser Fullscreen API / OS-level fullscreen (optional later; default is in-page CSS class fullscreen).
- Restyling the product outside quiet chrome (keep ly admin tokens; no decorative redesign).

## Decisions

### 1. Two independent fullscreen flags

- Time/joint: page class e.g. `is-schedule-tt-fullscreen` on `#page-schedule-time-detail` / joint pages (joint may set the same class name for shared CSS selectors under `.is-schedule-joint`, or a joint-specific class that mirrors hide rules).
- Room: separate class e.g. `is-schedule-room-tt-fullscreen` only on `#page-schedule-room-detail`.
- **Why:** Matches product decision “排教室单独” and independence rule; avoids one toggle accidentally hiding the wrong phase chrome.
- **Alternative considered:** Single shared helper + shared class on both clones — rejected because room clone shares ids and cross-talk is easy.

### 2. Hide via CSS class on page root; mark fold targets if needed

- Prefer page-level CSS: fullscreen class → `.schedule-detail-sidebar { display: none }`, hide known top chrome blocks, make `.schedule-detail-main` / timetable scroll fill height.
- Room: selectors prefixed with `#page-schedule-room-detail.is-schedule-room-tt-fullscreen …`.
- Joint: extend hide set to include left sidebar; keep existing `is-joint-chrome-collapsed` as optional intermediate OR map “fullscreen” to a stronger state that also hides the list. Product requirement is grid-only; design chooses **fullscreen as the strong state**. Partial chrome collapse may remain for filter-only density without claiming to be fullscreen.
- **Alternative:** Physically move DOM nodes — rejected as fragile with clone and many `getElementById` call sites.

### 3. Exit control = floating button on the grid shell

- When fullscreen, show a small fixed/absolute control (e.g. “退出全屏”) on the timetable shell corner; entry control lives in the normal (non-fullscreen) toolbar area so it disappears with chrome and is replaced by the float.
- No summary strip (product: pure grid).
- **Alternative:** Thin top bar with “正在排” — rejected per confirmed scope.

### 4. Joint entry alignment

- Prefer one primary “课表全屏” control on joint that hides list + all foldable top chrome.
- Existing “收起筛选与设置” can stay as a lighter collapse that only folds `[data-joint-fold]` without hiding the list, so power users keep partial density without confusion if labels stay distinct (“收起筛选与设置” vs “课表全屏”).
- **Alternative:** Replace chrome collapse entirely with fullscreen only — possible later; not required if labels are clear.

### 5. State lifetime

- Fullscreen flag is session UI state (in-memory / page class). Leaving the page or switching phase resets to non-fullscreen unless a tiny follow-up wants persistence — default **reset on leave**.
- Entering room detail from time (or vice versa) does not inherit the other side’s fullscreen flag.

### 6. Clone safety for room

- Add room fullscreen controls in `ensureScheduleRoomDetailPage` (or room-only patch after clone), not by editing time template HTML that would auto-appear on room with wrong handlers.
- Time template MAY add time-side entry only; room CSS/JS ignore time-side ids when `scheduleDetailPhase === 'room'`.

## Risks / Trade-offs

- **[Risk] Shared ids after clone** → Mitigation: phase checks + page-id-scoped CSS; room toggle never calls time/joint toggle.
- **[Risk] User trapped in fullscreen** → Mitigation: exit float always rendered when fullscreen class is on; Esc MAY map to exit as progressive enhancement.
- **[Risk] Joint double controls confuse** → Mitigation: distinct copy; fullscreen hides list, collapse does not.
- **[Risk] Vertical space still tight when not fullscreen** → Mitigation: accepted; row-merge compaction is out of scope unless product reopens it.
- **[Trade-off] In-page fullscreen vs browser fullscreen** → In-page is enough for prototype and keeps portal chrome/testability; browser API can wrap later.

## Migration Plan

- Prototype-only UI; no data migration.
- Ship time+joint first or room first independently; neither blocks the other.
- Rollback: remove entry controls and CSS classes; no persisted flag to clear.

## Open Questions

- Whether Esc should exit fullscreen (recommended yes; not spec-blocking).
- Exact placement of the non-fullscreen entry button among existing time toolbar rows (implementation pick; must be visible without adding a new tall band).
