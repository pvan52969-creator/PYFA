# Tasks

## 1. Mode state and entry modal

- [x] 1.1 Add `scheduleJointObjectMode` (and clear/reset helpers) in `app.js`; verify mode is null until modal confirm and resets when leaving joint page / re-launching from sidebar
- [x] 1.2 Add type-selection modal markup in `index.html` (按课程 / 按教师 / 按入学批次) with cancel/close; verify sidebar「联合排课」click shows modal and cancel does not open the joint page
- [x] 1.3 Wire `launchScheduleJointTab` to open modal first, confirm → set mode → existing detail launch; verify choosing a type opens `#page-schedule-joint` with that mode active

## 2. Filter bar by mode

- [x] 2.1 Rebuild `buildScheduleJointPickerBarHtml` / `ensureScheduleJointPickerBar` to render fields by mode (batch / teacher / course) including mode switcher; verify switching mode updates visible fields and clears prior-mode draft chips
- [x] 2.2 Implement「按课程」filters: 所属学院、所属专业、课程类型、公共选修课类型、本学期课程班多选 + options sources; verify GE type only appears in course mode and section list is term-scoped
- [x] 2.3 Restrict confirm/reset/`confirmScheduleJointQuery` to current-mode drafts only; verify batch confirm cannot apply teachers, teacher confirm cannot apply batches/courses, course confirm cannot apply batch/teacher objects

## 3. Object axis and GE alignment

- [x] 3.1 Branch `getScheduleJointUnionTasks` / object builders so object axis is mode-pure (batch rows / teacher rows / course rows); verify each mode’s confirmed query only shows matching kind rows
- [x] 3.2 Update empty-state and guidance copy for course mode (no “请先选专业批次或教师” when course scope is valid); verify GE-type-only course-mode query can render course rows
- [x] 3.3 Adjust styles for modal + mode switcher + course-mode filter density in `styles.css`; verify layout on joint page does not break timetable chrome

## 4. Integration checks

- [x] 4.1 Manual path: sidebar → modal → each of three modes → select objects → 确定 → grid objects match mode; switch mode in-page → selections cleared; leave page → sidebar again → modal again
- [x] 4.2 Regression: standalone「按入学批次排 / 按教师排 / 按课程排」list pages unchanged; joint demo page still opens if still linked (no forced modal unless already broken)
