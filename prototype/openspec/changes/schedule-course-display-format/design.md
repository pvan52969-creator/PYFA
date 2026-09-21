## Context

见 `proposal.md` Why。开课已有课号 `ACC101`、课程班名称 `Financial Accounting`、课程组 `formatMajorOfferingGroupName(courseName, groupShortName)` → `Financial Accounting（A组）`。排课列表多数直接吐 `task.code` / `task.name` / `task.groupLabel` 或 `formatScheduleGroupNames`（只拼短名）。冲突查询等演示种子用 `CTQ-TS1`、`Query Demo · Teacher Slot`、`教师时段演示组`，补课 Pending 正好吃到这批数据。

`formatScheduleCourseCode` 已按 `/^([A-Z]{3})(\d{3})$/` 规范化，但 `CTQ-TS1` 不匹配，只能原样大写。

排时间 / 排教室独立性：只动这三项展示，两侧交互隔离。

## Goals / Non-Goals

**Goals:**

- 排课用户可见的课号、课名、课组走同一套格式化入口
- 演示种子的可见字段改成学校形态，冲突/调课演示关系靠内部 id 保持
- 列表列名与开课参考列对齐：Course Code / 课程班名称 / 课程组

**Non-Goals:**

- 不改开课、培养方案页面
- 不把方案 TAB3「选修课程组」和上课小组混成一个实体
- 不改排时间 / 排教室的菜单、拖排、锁定、校验
- 不强制改已有真实开课任务的小组短名（`Group1` 可保留，展示时包进课程班名称）

## Decisions

### 1. 展示层格式化，不改开课 section 模型

- 课号：继续用 `formatScheduleCourseCode`；演示数据改成能匹配 `ABC123` 的 code
- 课名：直接展示开课/任务的英文 `name`（课程班名称）
- 课组：复用开课 `formatMajorOfferingGroupName(courseName, shortName)`，排课侧包一层（例如 `formatScheduleCourseGroupLabel`），带人数时再拼 `（n）`

备选：把 `group.name` 存成完整「课程名（A组）」——否决，开课短名会重复膨胀。

### 2. 列名在排课模块内统一替换

| 现文案 | 改为 |
| 课号 / 课程号 | Course Code |
| 课程 / 课名 / 课程名称（排课列表） | 课程班名称 |
| 上课小组（作为这列的标题） | 课程组 |

筛选 placeholder、卡片字段标签凡展示这三项，一并改。导出 CSV 表头跟列表走。

「上课小组」若出现在操作说明、勾选「课表显示字段」等非这三列场景，本设计默认也改成「课程组」，避免同一模块两套叫法；若实现时发现与排教室卡片人数格式强绑定，只改标题、保留人数后缀规则。

### 3. 演示种子改可见字段，保留内部挂钩

`getScheduleTimeConflictQueryDemoSamples` 等：

- `CTQ-TS1` → 合法课号（如 `CTS101`，三位字母+三位数字，避免和真实 `ACC101` 抢唯一性）
- `Query Demo · Teacher Slot` → 像学校的英文课名（如 `Teacher Timetable Studio` 或复用目录课名）
- `教师时段演示组` → 短名 `A组`，展示为 `课程班名称（A组）`

调课种子里已有 `ACC101` / `Financial Accounting` / `Group1` 的批量明细保持，并把 `Group1` 展示成 `Financial Accounting（Group1）`。补课 Pending 绑李明 `T0001` 的那门课必须一起改，否则列表仍是桩数据。

查找 `CTQ-TS1` 的代码改为新 code，避免演示节次补种失败。

### 4. 排时间 / 排教室只改展示

课表卡片上的课号、课名、课组走同一格式化函数。不改 `#schedule-grid-context-menu` / `#schedule-room-grid-context-menu`、锁定/待定/提交。

## Risks / Trade-offs

- [演示 code 被写死] → 全局搜 `CTQ-`、`Query Demo`、`教师时段演示组` 一并改挂钩
- [课程组变长撑破窄列] → 沿用 ellipsis / `formatOfferingGroupingEllipsisCell`
- [「上课小组」改「课程组」与方案 TAB3 同名] → 规格写明培养方案不改；排课「课程组」= 课程班+小组短名
- [人数后缀变 `Name（A组）（45）`] → 接受与开课「（A组）」叠加；不把人数塞进短名

## Migration Plan

原型无后端迁移。改种子后刷新即可；若 localStorage 里缓存了旧课号的调课申请，以当前任务 code 为准重新绑定，不强制清库。

## Open Questions

- 课表卡片设置里的「上课小组」勾选是否同步改名为「课程组」：实现时按「三项展示统一叫课程组」处理，不另开产品分叉。
