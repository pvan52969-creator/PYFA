# 联合排课 · 对象类型切换挪至面包屑

日期：2026-11-17  
状态：已实现（同页签面包屑切换）

## 背景

正式联合排课页（`#page-schedule-joint`）的对象类型切换条（按入学批次 / 按教师 / 按课程）目前挂在筛选栏顶行 `.schedule-joint-picker-toolbar`。产品希望把它放到面包屑「联合排课」右侧，并在切换类型时于**当前页签**切换显示（清空并重建该模式筛选与课表），不新开页签、不弹类型弹窗。

侧栏入口「联合排课」仍先弹类型选择弹窗，确认后新页签打开——本变更不改该路径。

## 目标

1. 类型切换条挂到 `#schedule-detail-breadcrumb-mid`（文案「联合排课」）右侧。
2. 面包屑相关节点顺序：**联合排课 → 类型切换 → 性能提示**。
3. 点击不同模式：同页签切换显示（复用现有清空/重建逻辑）。
4. 筛选栏不再包含顶栏类型切换。

## 非目标

- 不改排时间 / 排教室详情页交互与模板行为（遵守时间/教室独立性）。
- 不改独立「按入学批次排 / 按教师排 / 按课程排」列表页。
- 不改 `#page-schedule-joint-demo` 演示页混选栏。
- 不改冲突算法、对象上限规则、侧栏弹窗新开页签流程。

## 方案（已选）

面包屑挂载 + 同页切换显示（方案 1）。

备选已否决：

- 同页签模拟整页 `goPage` 重进：改动更大、易闪烁，收益有限。
- 面包屑仅文案、再点开选类型：多一步，不符合三段切换条需求。

## 结构

- 在 `ensureScheduleJointPage` / 联合页确保逻辑中，将 `.schedule-joint-mode-switcher` 插入到 `#schedule-detail-breadcrumb-mid` 之后（仅正式联合页，非 demo）。
- `ensureScheduleJointPerfNotice`：性能提示插在类型切换之后（若无切换条则仍跟 mid）。
- `buildScheduleJointPickerBarHtml`（非 demo）：去掉 `.schedule-joint-picker-toolbar` 及其中的 `buildScheduleJointModeSwitcherHtml()`；只保留筛选行与确定/重置。
- 样式：面包屑行内对齐类型切换与性能提示；必要时缩小 switcher 字号/内边距以适配 `page-header compact` 高度；删除或注释仅服务于「筛选栏顶栏装 switcher」的冗余规则（注释说明原因，不物理删除关键逻辑）。

## 交互

| 操作 | 行为 |
|------|------|
| 点击与当前不同的类型 | `onScheduleJointObjectModeChange`：设 mode → 清空草稿/已选 → 重建筛选栏与课表；更新面包屑 switcher 的 `is-active` |
| 点击当前类型 | 无操作 |
| 侧栏「联合排课」 | 不变：弹窗 → 确认 → 新页签 |

## 实现要点（指导实现，非任务清单）

- 新增或抽一层 `ensureScheduleJointModeSwitcherInBreadcrumb(page)`，避免只在 `innerHTML` 筛选栏时渲染 switcher。
- 重建筛选栏后需同步面包屑 switcher 的 active 态（或整块重挂）。
- 克隆时间详情模板时注意：不要把 switcher 误挂到非联合页；仅 `is-schedule-joint` 且非 demo。

## 验收

1. 联合排课页：面包屑为「… / 联合排课 / [三段切换] / 性能提示 …」。
2. 筛选栏顶部不再出现类型切换条。
3. 切换类型后筛选字段与课表对象轴随模式变化，同页签无新开窗口。
4. 侧栏进入联合排课流程与演示页行为与改前一致。
5. 排时间 / 排教室详情页面包屑与交互无回归。

## 开放问题

无。
