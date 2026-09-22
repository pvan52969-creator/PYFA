## Why

`schedule-course-display-format` 已把列名和展示结构改成 Course Code / 课程班名称 / 课程组，但排课专用演示种子的**课名仍像测试标签**（`Teacher Timetable Studio`、`Lunch Break Studio`、`Room Demo · Same Slot A`、`Student Conflict Anchor` 等）。补课 Pending、冲突查询、排时间/排教室卡片里用户一眼看出是假数据。小组短名也有「课名小组1」这类拼接，展示成 `课名（课名小组1）` 更假。需要把排课模块用户可见的课名、课组短名改成接近学校目录的真实英文课名与常规分组短名。

## What Changes

- 排课管理模块（含调课/停课/补课、课表冲突、自动排课、排时间/排教室演示种子）中，**用户可见的课程班名称**改为目录风格英文课名（如 `Financial Accounting`、`Introduction to Finance`、`General Biology`），去掉 `Studio` / `Demo` / `Conflict` / `Pad` / `Anchor` / `Probe` 等演示词。
- **课程组短名**统一为学校习惯短名（`A组` / `Group1` / `Group2`），禁止默认拼成 `课名小组1`；展示仍走现有 `课程班名称（短名）` / 带人数后缀。
- 演示课号可继续用独立 `ABC123`（避免和真开课任务撞唯一性），但**课名必须像真课**；能安全复用目录课（如 `FIN101` / `ACC101`）的优先挂目录名。
- 排时间 / 排教室只改这三项（课号可选保留、课名、课组）的**取值观感**，不改交互、右键菜单、校验、默认态。
- **不改**开课管理、培养方案（含 TAB3）；不强制改教师姓名里的「演示甲/乙」（本次聚焦课名与课组）。

## Capabilities

### New Capabilities

- `schedule-realistic-course-names`: 排课模块演示数据的课程班名称与课程组短名真实化

### Modified Capabilities

- （无）主规格目录暂无对应条目；本能力承接上一 change 的展示格式，只换可见文案取值

## Impact

- `app.js`：冲突查询种子（`CTS101` 等）、CDF/教室待排种子（`RM*` / `RCL*` / `RWP*`）、`buildScheduleDemoGroupAssignments` 默认小组名、调课/补课 Pending 挂钩数据
- 展示层继续用已有 `formatScheduleCourseName` / `formatScheduleCourseGroupLabel`，一般不必再改 formatter
- 排时间、排教室课表卡片与补课 Pending 随种子刷新即可看到真实课名
