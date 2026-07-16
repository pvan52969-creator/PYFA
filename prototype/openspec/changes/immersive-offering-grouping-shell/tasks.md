## 1. CSS 沉浸壳

- [x] 1.1 在 `styles.css` 增加 `.app.is-offering-grouping-immersive`：隐藏 `.sidebar`，`.main` 全宽（对齐 `portal-mode` 写法，使用独立类名）
- [x] 1.2 视需要微调 `#page-offering-grouping.active` 在沉浸态下的高度/留白，保证内容区仍 flex 撑满

## 2. 进出生命周期

- [x] 2.1 在 `goPage` 中：目标为 `offering-grouping` 时给 `.app` 加 `is-offering-grouping-immersive`，其它页去掉该类
- [x] 2.2 确认 `openOfferingGroupingModal` / `performCloseOfferingGroupingPage` / 保存后回列表均走 `goPage`，无需逐入口补丁；若有绕过 `goPage` 的切页路径则一并补上

## 3. 顶栏与入口验收

- [x] 3.1 确认顶栏仍为「面包屑 + 返回 + 保存/保存名单」，未改极简顶栏
- [x] 3.2 手测：任务安排「安排教师」进入 → 无侧栏；返回/保存离开 → 侧栏恢复
- [x] 3.3 手测：名单管理「管理名单」（至少专业；通识/特殊若有入口）进入 → 同一沉浸壳
