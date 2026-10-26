# Tasks

## 1. Inventory and caps

- [x] 1.1 Document current seed injectors touched by `ensureScheduleGlobalDemo` (conflict / query-conflict / room-pending / weekday-pad / joint GE / room occupancy) in a short comment block or design note update, and verify the list matches what `ensureScheduleGlobalDemo` actually calls
- [x] 1.2 Define lean constants (max batches 3, courses/batch ~5, groups 1–3, teachers ≤10, GE 3 per G01–G04) near the demo seed helpers and verify they are referenced by the trimmed factories (or by comments if arrays are hand-sized)

## 2. Major-batch and teacher lean seed

- [x] 2.1 Rebuild or trim major demo courses so exactly 2–3 programme-intakes carry ~5 non-GE courses each with 1–3 groups, sharing ≤10 teachers; verify「按入学批次排」shows ≤3 lean batches and batch detail sidebar has no GE
- [x] 2.2 Align teacher/course arrange lists with the same inventory; verify「按教师排」teacher count stays within ~10 for lean journey staff and「按课程排」lists the lean major + GE codes without pad courses

## 3. Joint GE lean catalog

- [x] 3.1 Cut `getScheduleJointGeDemoSamples` to 3 courses × G01–G04 with 1–2 groups each; verify joint G01–G04 filters each show at most 3 courses and GE still absent from batch arrange
- [x] 3.2 Re-check GE course object rows / sidebar copy still match `schedule-joint-ge-object` (no fixed major batch ownership); verify GE-only joint query still renders course object rows

## 4. Room path and venue demos

- [x] 4.1 Disable or remove weekday-pad (RWP*) inflation and lower or bypass `SCHEDULE_ROOM_WEEKDAY_TARGET_GROUP_COUNT` fill so room-week density follows lean timed slots; verify「按时间排」is not dominated by pad courses
- [x] 4.2 Keep a thin room-pending / occupancy / room-conflict overlay (at least one demonstrable venue conflict or non-schedule occupancy); verify「按场地类型排」and场地冲突查询 still show a usable conflict case
- [x] 4.3 Trim conflict-time samples to a thin overlay on the primary batch (keep one path each for critical kinds you still want in oral demos); verify page load remains snappy and conflict paint still works for kept anchors

## 5. End-to-end verification

- [x] 5.1 Hard-reload and walk: batch time arrange → teacher/course time arrange → joint GE time arrange → room by weekday → room by venue type → observe venue conflict/occupancy; verify no step requires re-adding mock data
- [x] 5.2 Confirm ephemeral behavior unchanged: same-tab flow keeps in-memory places; full reload returns to lean seed (no stale fat catalogues)
