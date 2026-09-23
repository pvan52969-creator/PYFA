## 1. Remove adjustment localStorage persistence

- [x] 1.1 Remove or no-op `persistAdjustmentUserRequests` / `restoreAdjustmentUserRequests`, delete all call sites (including `ensureAdjustmentDemo`), and verify `app.js` no longer references `ADJUSTMENT_USER_REQUESTS_KEY` for read/write
- [x] 1.2 On boot, `removeItem` legacy key `pyfa-adjustment-user-requests-v1` once and verify DevTools Application shows the key gone after load

## 2. Remove demo-arrange sessionStorage bridge

- [x] 2.1 Stop writing/reading `SCHEDULE_DEMO_ARRANGE_SESSION_KEY` from `persistTaskSchedule` / `ensureScheduleGlobalDemo` / related helpers; keep same-document in-memory snapshot behavior only; verify no `sessionStorage.setItem` for that key remains
- [x] 2.2 On every full document load (including schedule-detail deep link), clear legacy demo-arrange session key; simplify boot so portal-only clear is not the sole path; verify refresh on detail URL starts from seed arrange state

## 3. Smoke verification (Scheduling Management)

- [x] 3.1 Without refresh: arrange a slot or create an adjustment, navigate to another schedule/adjustment menu, and verify mutations still visible
- [x] 3.2 After creating user adjustment + arranging demo slots, hard-reload and verify both are gone / back to current seed demos only
- [x] 3.3 Open schedule detail via list new-tab / deep link after arranging in another tab and verify the new document shows seed baseline (no cross-document restore)
- [x] 3.4 Spot-check sidebar menus (period/time-setting/rule, time arrange, room arrange, queries, adjustment submenu) after reload look like current Mock init without leftover user ops
