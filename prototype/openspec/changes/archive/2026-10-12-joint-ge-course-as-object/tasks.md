# Tasks

## 1. Course object model

- [x] 1.1 在 `app.js` 为联合排课增加 `kind: 'course'` 对象构造（key/label/taskId），并扩展 `buildScheduleJointObjectsFromTasks`：GE 任务产出课行而非批次行；用仅含联合 GE 演示课的任务列表调用后确认返回课行、无 `mec|202409` 批次行
- [x] 1.2 更新 `getScheduleJointRowObjects`：有 G01–G04 时为匹配的 GE 任务附加课行，且不为 GE 任务单独合成空壳批次行；手测仅选 G01 点确定后对象列出现多门「课」行

## 2. Matching and grid

- [x] 2.1 扩展 `scheduleJointTaskMatchesRow` / `filterScheduleTasksByJointRow` / `getScheduleJointTaskTargetRows`：GE 课以课行为归属；存在课行时 GE 不落批次行；点节次排 GE 课落在对应课行并验证错误落点 toast 指向课行标签
- [x] 2.2 更新 `renderScheduleJointTimetableGrid`：课行 kind 文案为「课」、空态在仅 GE 范围可读；手测对象列徽章为「课」且 GE-only 查询不再只提示选专业批次/教师

## 3. Sidebar and regression

- [x] 3.1 联合排课左侧课程列表对 `isScheduleJointGeCourse` 省略「专业批次」字段；手测 GE 卡片不再显示「海洋环境化学 · 2024/09」
- [x] 3.2 回归：未选 GE、仅选专业批次/教师时对象列与改前一致；混合选批次+G01 时批次行与课行并存且专业课/GE 各落正确行；确认未改非联合排时间/排教室详情路径
