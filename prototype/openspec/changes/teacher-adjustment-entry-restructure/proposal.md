## Why

教师端现在把「调 / 停 / 补」塞在同一页、把「加课」拆成另一个菜单，和业务语义相反：补课是对着已停课节次做的独立动作，加课则是课表外加节，应和调课停课放在同一申请入口里用 Tab 区分。需要先把入口改对，避免教师点错类型。

## What Changes

- **调课申请（教师端）**改为同一页两个 Tab，每个 Tab 下方有独立说明板块：
  - **Class Replacement**：对已排课表做调整（调课 + 停课）。说明含：Public Holiday 无需 Management 审批，其他原因需学院/学部或教务审批。
  - **Class Addition**：在已排课表上加课。说明含：须学院/学部或教务审批。
- **补课单独成菜单**（侧栏原「加课申请（教师端）」改为补课入口）。该页主列表是可勾选的**已通过停课记录**；**Apply** = 对勾选节次发起补课；**New Replacement** = 发起与停课记录无关的调课。
- 调课申请页不再提供「发起补课」；加课申请页不再作为独立菜单。
- **BREAKING**（教师入口）：侧栏与列表筛选按新类型拆分，旧「调课申请」里的补课行、旧「加课申请」菜单不再按现结构出现。

## Capabilities

### New Capabilities

- `teacher-adjustment-entry`: 教师端调课/停课/加课/补课的菜单、Tab、说明文案与发起入口

### Modified Capabilities

- （无）`openspec/specs/` 下暂无对应主规格需改写

## Impact

- `index.html`：侧栏 `adjustment-teacher` / `adjustment-teacher-addclass`；`#page-adjustment-teacher` 加 Tab + 说明；补课页替换原加课页骨架
- `app.js`：教师列表按 Tab/菜单过滤类型；补课页渲染停课记录勾选 + Apply / New Replacement；沿用现有 `openAdjustmentApplyModal('makeup'|'reschedule'|'cancel'|'addclass')`
- `styles.css`：Tab 说明板块（不改排时间/排教室）
- **不改**：排时间、排教室、公假日停课、教务代申请/审批/申请记录（类型仍识别，入口不重排）
