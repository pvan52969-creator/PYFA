# Design

## Context

See proposal.md — Why. Today three UIs share the same “参考教室多选教室号” path:

- Offering grouping draft: `renderOfferingGroupStatusDraftClassroomPreferenceCell` + `classroomPreferences[]` (room codes)
- Course info / major offering edit: `buildReferenceClassroomMultiselectHtml` + `specialClassroomRequirements[].referenceClassrooms`
- Special course settings: same hour-row renderer / store as course defaults

`CLASSROOM_ATTRIBUTE_OPTIONS` already has `normal` / `computer` / `specialized`. Preference UI does not yet branch on attribute beyond filtering the room pool.

## Goals / Non-Goals

**Goals:**

- One shared preference-mode helper so the three entry points cannot drift
- Stable storage that distinguishes room codes vs remark codes + optional Others text
- Minimal UI change: keep column title 教室偏好; reuse clo-multiselect patterns

**Non-Goals:**

- PRD docx 升版（可另开任务）
- i18n 语言切换 / 英文字面展示
- 排课引擎消费偏好的算法变更
- 改场地类型枚举或教室池数据源

## Decisions

### D1 — Preference mode keyed by attribute

- `normal` → remark multi-select (+ optional Others text)
- `computer` | `specialized` → existing room multi-select filtered by category
- empty attribute → keep “先选场地类型” disabled state

**Alternatives:** Always show both room + remark → rejected (user forbids rooms for 普通教室).

### D2 — Shared option catalog + Chinese labels

Store English stable values; display Chinese labels (user confirmed 先按中文):

| value | labelZh（原型文案，非校方已盖章政策） |
|---|---|
| `desk_set_computer` | 偏好电脑课课桌套装 |
| `round_table` | 偏好圆桌 |
| `lecture_hall` | 偏好讲堂 |
| `large_whiteboard` | 需要大白板 |
| `smartboard` | 需要智能白板 |
| `others` | 其他 |

English source phrases from the requirement stay in comments / `labelEn` for traceability. If product later supplies official Chinese, only the label map changes.

### D3 — Data shape

Per preference slot (assign draft row, or hour-type requirement row):

- Keep `classroomAttribute` as today
- For `computer` / `specialized`: `referenceClassrooms` / `classroomPreferences` = room code strings (unchanged)
- For `normal`:
  - `referenceClassrooms` / `classroomPreferences` = selected remark values **excluding** free text (may include `'others'` when Others checked)
  - Add sibling field `classroomPreferenceOthersText` (string, default `''`) on the same row/draft

Normalize on read: if attribute is `normal` and legacy values look like room codes, treat as empty (demo data cleanup) rather than showing invalid chips.

**Alternatives:** Encode Others text as `others:用户输入` inside the array → rejected (harder to clear/uncheck; fragile). Separate top-level only on section → rejected (hour rows need per-row text).

### D4 — Clear on attribute change

On attribute `onchange` in all three UIs:

1. Set preferences array to `[]`
2. Set Others text to `''`
3. Re-render preference cell for the new mode

Applies also when switching `computer` ↔ `specialized` (room sets differ).

### D5 — Shared render/collect API

Introduce small helpers (names illustrative):

- `getClassroomPreferenceMode(attr)` → `'rooms' | 'remarks' | 'none'`
- `buildClassroomPreferenceEditorHtml({ attr, selected, othersText, ... })`
- `formatClassroomPreferenceDisplay(attr, selected, othersText)` — Chinese for remarks
- Wire:
  - grouping draft preference cell
  - `buildReferenceClassroomMultiselectHtml` / hour-row collect
  - special course settings (same hour-row path)

Collect DOM: room checks vs remark checks + Others input; do not mix.

### D6 — Others UX

- Checkbox/option `others` in the same dropdown
- When checked, show a single-line input under the trigger or at dropdown bottom（实现选更不易被 table overflow 裁切的一种；分组草稿可参考 prior-teacher fixed 浮层若必要）
- Empty text allowed; uncheck clears text

## Risks / Trade-offs

- [Risk] Legacy demo rows store room codes under `normal` → Mitigation: normalize to empty on load when mode is remarks and values are not in remark catalog  
- [Risk] Table-scroll clips remark dropdown / Others input → Mitigation: reuse fixed-position dropdown pattern already used for prior-teacher/group dropdowns if clipping appears  
- [Risk] Chinese labels are prototype-proposed → Mitigation: centralize in one constant map; document as 待产品确认正式译名  
- [Trade-off] Extra field `classroomPreferenceOthersText` vs packing into array → clearer UX and clear-on-uncheck at cost of one more field to persist in three stores

## Migration Plan

1. Ship helpers + three UI call sites in one prototype pass  
2. Existing saved `normal` + room-code prefs: clear/normalize on read (prototype; no backend migration)  
3. Rollback: revert change branch; no server schema in this prototype repo  

## Open Questions

- Official Chinese copy for the five facility remarks（当前用 design 表；不阻塞实现）  
- Whether 排课计划筛选 “教室偏好” 需同时匹配中文标签与英文 value（实现时按中文展示字符串模糊匹配即可，不改规格）
