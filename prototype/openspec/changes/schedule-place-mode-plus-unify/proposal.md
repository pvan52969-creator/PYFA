# Proposal

## Why

排时间 / 排场地左侧课程卡与课表格的交互约定不统一：产品期望「点左侧卡 = 排入态；移入格子出 +（已占也出，点后提示冲突）；+ 在卡片右方；排入态与格内选中互斥」。现状在排时间侧近期补过一部分，排场地与部分边界仍不一致，测试与讲解易反复踩坑。

## What Changes

- 钉死统一交互契约：左侧选课排入态 vs 课表格选中态互斥；点左侧卡进入排入；悬停可落点格显示「+」。
- 排时间：已占格（本课/他课/冲突着色）排入态悬停在**卡片右方**出「+」；点击整格走落点检测并弹冲突（含学时、教室资源售罄/超排等），不因他课卡误切选中。
- 排场地：对齐同一套「左侧选课 = 排入 + 右侧 +」语义；可排入的待定/锁定/空闲（及产品允许的冲突格）悬停出「+」；与格选互斥口径与排时间对齐（避免半残 is-place-mode）。
- 明确非目标：不改变冲突硬/软可否强排规则本身（学生硬冲突仍不可强排等）；不改选课开放名单主路径。

## Capabilities

### New Capabilities

- `schedule-place-mode-interaction`: 排时间/排场地左侧课程卡排入态、课表格「+」提示与互斥选中的统一交互契约

### Modified Capabilities

- （无）现有 `openspec/specs/` 下无排入态交互规格可改写

## Impact

- `app.js`：`selectScheduleDetailCourse`、`exitScheduleTimePlaceModeForSlotSelection`、`clearScheduleSlotSelectionSyncCourse`、课表 `renderBlocks` / 联合 `renderCell`、`onScheduleGridCellClick` / 排教室点格
- `styles.css`：`is-place-mode` 下空格/已占格「+」位置（格心 vs 卡片右）
- 讲解/测试：排时间与排场地对照手测清单；联合排课对象行仅本行可排
