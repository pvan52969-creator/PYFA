# Tasks

## 1. 排时间详情 · 课表全屏

- [x] 1.1 在 `#page-schedule-time-detail` 增加进入全屏入口与全屏态退出浮钮（不依赖教室页）；验收：时间详情可见入口，全屏时浮钮可见
- [x] 1.2 在 `app.js` 实现时间侧 fullscreen toggle（page class，如 `is-schedule-tt-fullscreen`），离开详情页时复位；验收：切换 class，返回列表后再进为非全屏
- [x] 1.3 在 `styles.css` 用 `#page-schedule-time-detail.is-schedule-tt-fullscreen` 完全隐藏左栏与顶 chrome，课表区占满；验收：全屏仅见网格+退出控件
- [x] 1.4 手工验收按入学批次 / 按教师 / 按课程三条入口进入同一时间壳：全屏行为一致且不影响落点/冲突；验收：三入口各进退一次无业务副作用

## 2. 联合排课 · 对齐全屏

- [x] 2.1 联合页增加「课表全屏」入口（文案区别于现有「收起筛选与设置」）；验收：两控件文案不同且均可点
- [x] 2.2 联合全屏隐藏左栏 + 顶栏筛选/设置，保留退出；与 `is-joint-chrome-collapsed` 状态关系按 design 处理且不互相卡死；验收：全屏进出后仍可单独收起/展开筛选
- [x] 2.3 联合相关 CSS 限定在联合 page 选择器内，不改时间壳非联合布局；验收：非联合时间详情样式无回归

## 3. 排教室详情 · 独立全屏

- [x] 3.1 在 `ensureScheduleRoomDetailPage`（或 clone 后补丁）为 `#page-schedule-room-detail` 增加独立入口与退出浮钮，不改时间模板「顺带」带出错误 handler；验收：教室页有控件，时间页 DOM/handler 不因教室补丁被改坏
- [x] 3.2 教室侧独立 toggle + class（如 `is-schedule-room-tt-fullscreen`），与时间/联合 flag 互不继承；验收：一侧全屏不影响另一侧
- [x] 3.3 `#page-schedule-room-detail` 限定 CSS：藏左栏与教室顶 chrome（筛选/锁定条等），课表占满；验收：全屏仅见教室网格+退出
- [x] 3.4 验收教室锁定/待定/撤回与教室右键菜单在全屏切换前后行为不变；验收：切换全屏不做教室编辑时状态不变，菜单条目集合未被动过共享时间菜单

## 4. 交叉与收尾

- [x] 4.1 可选：Esc 退出当前页全屏（时间/联合/教室各自监听，互不串台）；验收：全屏时按 Esc 退出，非全屏无副作用
- [x] 4.2 对照 `schedule-time-room-independence` 自检并过一遍时间侧与教室侧冒烟；验收：用户只测时间侧与改前一致（除时间全屏新能力），只测教室侧仅多教室全屏
