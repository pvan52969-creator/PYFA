# Tasks

## 1. Shared preference catalog and helpers

- [x] 1.1 Add remark option constants (`value` / `labelEn` / `labelZh`) and helpers `getClassroomPreferenceMode` / normalize / Chinese display formatters in `app.js`; verify in console or temporary call that `normal` → remarks mode and Chinese labels cover all six options
- [x] 1.2 Add shared `buildClassroomPreferenceEditorHtml` + collect/clear helpers supporting rooms vs remarks + optional Others text; verify a unit-style call with sample attr returns room list HTML for `computer` and remark list HTML for `normal`

## 2. Course info and special course settings hour rows

- [x] 2.1 Replace `buildReferenceClassroomMultiselectHtml` / hour-row render path so each 学时行 uses shared preference editor by attribute; verify 课程信息教室区：普通教室下拉为六项 remark、计算机/专业仍为教室号
- [x] 2.2 Update hour-row attribute `onchange` to clear preferences + Others text and re-render; verify switching 普通↔计算机 empties prior selections
- [x] 2.3 Update collect/save for `specialClassroomRequirements` (and special course settings store) to persist remark values + `classroomPreferenceOthersText`; verify save/reopen keeps Others empty-allowed text and does not treat remarks as room codes

## 3. Offering grouping assignment draft

- [x] 3.1 Wire draft 场地类型 / 教室偏好 cells to shared helpers (including clear-on-attribute-change); verify grouping draft：普通教室 remark 多选 + Others 输入非必填，计算机/专业仍选教室
- [x] 3.2 Update draft save → assign row persistence and read-only cell formatters to Chinese remark display; verify saved draft row shows中文标签（及非空 Others 原文）

## 4. Styles and cross-entry smoke

- [x] 4.1 Add minimal CSS for remark chips / Others input (and fixed dropdown if clipped by table-scroll); verify draft and hour-row dropdowns are usable without full-viewport width regression
- [x] 4.2 Smoke the three entry points in one pass（分组草稿、课程信息学时行、特殊课程设置）against spec scenarios: mode split、清空、Others 可空、列名仍为教室偏好；verify no entry still offers room codes under 普通教室
