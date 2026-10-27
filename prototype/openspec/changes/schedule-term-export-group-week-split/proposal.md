# Proposal

## Why

「学期安排导出」的课程班汇总目前按课程任务压成一行，时间地点只是把 `timeSlots` 用逗号拼接，既不按课程班下的各组展开，也不按周次上的时间/地点/教师差异拆分，与原系统总账（一组一行、同组内差异周次拆成多条时间地点）不一致，教务核对中途换教室/换老师时容易漏看。

## What Changes

- **BREAKING（导出行粒度）**：导出「课程班」时，改为按所选学期内每个课程班的各个上课组（组）出数据行；不再用 `consolidateScheduleTasksByCourse` 把多组压成一门课一行。
- 「上课时间地点」改为先查该组各周安排，再按（星期+时间、地点、教师）是否一致折叠：
  - 全学期（如 1–14 周）同一套安排 → 该组仍一行，时间地点一条；
  - 存在差异（如仅第 13 周换地点/时间/教师）→ 同一组仍一行，时间地点拆成多条（单元格内多行），周次用紧凑写法（如 `Week 1-12&14`）。
- 单条时间地点文案对齐原系统风格：  
  `Tuesday 1.00pm-4.00pm(A2#111)(Week 1-12&14)(Safrena Noreen Binti Abd Malek)`  
  （日/时段/教室/周次；该条对应教师可解析时追加括号姓名。）
- 页面说明文案同步为「按组展开、按周次差异拆分时间地点」。
- 「导出上课地点」明细在涉及组归属时与组口径对齐；课表查询各 Tab 的既有导出不变。

## Capabilities

### New Capabilities

- （无）

### Modified Capabilities

- `schedule-term-arrangement-export`: 课程班导出行粒度改为课程班×组；上课时间地点按组周次折叠/拆分，并采用含 `&` 周次与可选教师后缀的原系统文案格式。

## Impact

- 原型：`app.js` 中学期安排导出相关行构建与时间地点格式化（如 `buildScheduleTermExportSectionRows`、`formatScheduleTermExportMeetingSummary` 及组/周次辅助）；`index.html` 中 `#page-schedule-term-export` 说明文案。
- 依赖既有排课任务 / 开课小组 / `normalizeTaskTimeSlots` / 周次解析与学时单元口径；不改排时间、排教室详情交互。
- 已下载过旧版「一门课一行」CSV 的对照习惯会变化（行数增多），属预期对齐原系统。
