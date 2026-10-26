# Tasks

## 1. Inventory and peer audit

- [x] 1.1 List current arrange-time student/teacher conflict peers (sample codes + slots + whether each appears in batch ≤5 / teacher arrange) and verify the audit notes which peers break closed-loop (e.g. query-only CQT/CQS)
- [x] 1.2 Confirm venue path peers (RM301–303 / NSO) already have real room assignment or occupancy; verify one venue case remains demoable without new catalogues

## 2. Student closed-loop seed

- [x] 2.1 Remove or quarantine query-only courses from primary-batch arrange-time student peer set (drop from mec seed and/or keep `queryConflictDemo` skip); verify placing on former CQT/CQS slots no longer cites those codes as student conflicts
- [x] 2.2 Ensure student oral path CDF201 (timed) ← CDF203 (probe) both stay on primary lean batch and enter batch arrange scope / 已排完 priority; verify batch detail can open CDF201 and see Tue 5–6 already timed

## 3. Teacher closed-loop seed

- [x] 3.1 Align teacher conflict anchor so the cited peer is visible under「按教师排」for the shared teacher (keep or relocate CDX101 / same-teacher lean course); verify teacher detail timetable shows the conflicting weekday/period
- [x] 3.2 Walk probe course place → teacher conflict dialog → open teacher arrange and find the peer; verify dialog course code matches the timetable course

## 4. Venue closed-loop and query page

- [x] 4.1 Keep or lightly adjust room-assigned / NSO demos so venue conflict cites a real assigned room or occupancy; verify room-by-weekday or venue-type can surface the case
- [x] 4.2 Decide query-page rows: reuse arrange anchors or add mirrored query-only rows that do not pollute arrange student peers; verify 课表冲突查询 still has at least one usable conflict hit

## 5. End-to-end acceptance

- [x] 5.1 Hard-reload and run student + teacher + venue oral paths; verify each cited conflict code is traceable from the matching entry point without mid-flow re-seed
- [x] 5.2 Confirm lean caps still hold (≤3 batches, thin overlay, no RWP pad) and ephemeral reload returns to the closed-loop seed
