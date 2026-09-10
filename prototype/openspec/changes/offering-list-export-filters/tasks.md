## 1. Shared helpers

- [x] 1.1 Add `downloadUtf8Csv`, `matchesFuzzyText`, `matchesNumberRange`, `toggleCourseQueryMore` in `app.js` and query-more CSS in `styles.css`; verify Teaching Load export still downloads CSV
- [x] 1.2 Point Teaching Load `downloadTeacherTeachingLoadCsv` at the shared helper and verify existing export still works

## 2. Major offering plan

- [x] 2.1 Rename 专业 → 上课专业; relabel 课号/课名 to 课程代码/课程班名称; add more filters and preset-count range; add 导出; verify `getFilteredMajorOfferingPlanRows` applies all conditions

## 3. Major arrangement and roster

- [x] 3.1 开课安排：restore 上课专业 in more filters, align remaining headers, add 导出; verify filter+export use filtered full set
- [x] 3.2 开课名单：align filters to headers, 人数 range on imported roster count, add 导出; verify range uses `getMajorOfferingRosterStudentCount`

## 4. Remaining Course Management lists

- [x] 4.1 选修开课计划/安排/名单: expand filters + export; verify query/export on each page
- [x] 4.2 开课时间设置、校选课程管理、特殊课程设置: expand filters + export; verify each list exports filtered rows
- [x] 4.3 课程班、授课确认管理、教师端主表、授课教师替换（含记录）、排课计划: expand filters + export; verify each main table has 导出

## 5. Verify

- [x] 5.1 Browser-check 开课计划 (default/expand, fuzzy, preset range, export) and spot-check 开课安排 + 开课名单
