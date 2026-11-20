# Tasks

## 1. Audit & baseline

- [ ] 1.1 对照 `specs/schedule-place-mode-interaction/spec.md` 手测排时间：左卡排入、空格中心 +、他课已占卡右 +、点已占弹冲突且不切他课；记录与现状差异（截图或条目）
- [ ] 1.2 对照同一规格手测排场地：左卡排入、空闲/待定/锁定 + 位置、与格选是否可同时存在；记录差异

## 2. Time / joint place-mode harden

- [ ] 2.1 确认排时间/联合：place-mode 下已占格均 `is-active-target`，CSS 卡右 + 不被 overflow 裁切；用 CST201→MEC901/MEC903 窄格验收悬停可见 +
- [ ] 2.2 确认 place-mode 点击已占格走完整落点检测（含教室资源售罄/超排），不切左侧选中；学生硬冲突仍不可强排但弹窗说清
- [ ] 2.3 确认左卡 ↔ 格选互斥：`selectScheduleDetailCourse` 清节次；格选调用 `exitScheduleTimePlaceModeForSlotSelection`；联合仅本对象行可排

## 3. Room place-mode align

- [ ] 3.1 排场地进入左卡排入时清格选（与 design「clear-on-enter-place」一致；注释掉/停用 keepSlotSelection 半残路径并说明原因）
- [ ] 3.2 对齐可排格「+」：空闲格心、待定/锁定卡右；验收悬停与点击强排/冲突窗与规格一致
- [ ] 3.3 清选中退出排入态路径保持可用（避免只清 slots 却残留 is-place-mode）

## 4. Integration check

- [ ] 4.1 端到端矩阵：排时间空/本课已占/他课冲突/学时满+售罄；排场地空闲/待定；联合非本行无 +；全部按规格过一遍并勾选通过
