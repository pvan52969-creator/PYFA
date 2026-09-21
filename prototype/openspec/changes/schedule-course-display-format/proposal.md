## Why

排课管理里演示用的课号、课名、课组看起来像测试桩（`CTQ-TS1`、`Query Demo · Teacher Slot`、`教师时段演示组`），列名也不统一（课号 / 课程 / 上课小组）。开课侧已经接近学校习惯：`ACC101`、`Financial Accounting`、`Financial Accounting（A组）`。补课 Pending 等排课列表和学校格式差得远，需要整模块按开课对齐。

## What Changes

- 排课管理模块（含调课/停课/补课列表、课表冲突、自动排课、按教师/课程等入口）中，面向用户的 **课号、课名、课组** 展示对齐开课：
  - 课号：学校课号形态（三位字母 + 三位数字，如 `ACC101`），列名用 **Course Code**
  - 课名：英文课程班名称（如 `Financial Accounting`），列名用 **课程班名称**
  - 课组：`课程班名称（小组短名）`（如 `Financial Accounting（A组）`），列名用 **课程组**
- 排课专用演示数据（冲突查询 `CTQ-*`、调课种子用的假课名/假课组等）改写成同一套学校形态；内部 id 可以保留，**用户看见的 code / name / group 必须改**。
- 展示走共用格式化，避免各页各写一套；带人数的课组在课程组名后再附人数，例如 `Financial Accounting（A组）（45）`。
- 排时间 / 排教室两侧 **同步改这三项的列名与取值**，不改两侧交互、右键菜单、校验、默认态。
- **不改**开课管理、培养方案（含 TAB3 方案「课程组」，那是选修课打包，不是上课小组）。

## Capabilities

### New Capabilities

- `schedule-course-display-format`: 排课管理模块课号、课名、课组的列名与取值格式对齐开课/学校习惯

### Modified Capabilities

- （无）`openspec/specs/` 下暂无对应主规格需改写

## Impact

- `app.js`：`formatScheduleCourseCode`、`formatScheduleGroupNames*`、演示种子（`getScheduleTimeConflictQueryDemoSamples` 等）、调课列表渲染（含补课 Pending）
- `index.html`：排课/调课列表表头「课号 / 课程 / 上课小组」等文案
- `styles.css`：课程组比短名更长，窄列可能需截断/换行
- 排时间、排教室课表卡片若展示这三项，只改文案与取值，不改拖排交互
