## 1. 脚手架与路径映射

- [x] 1.1 在 `scripts/prd_folder_paths.py` 增加「授课教师替换」「排课计划」的 L2 映射与 `MENU_PARENT`（一级：课程班管理；序号 05、06），并创建空目录 `05_课程班管理/05_授课教师替换`、`05_课程班管理/06_排课计划`；验证 `menu_dir(...)` 可解析且目录存在
- [x] 1.2 更新 `.cursor/rules/prd-versioning-change-notes.mdc` 与 `参考文档/2、开课管理/00_规范与变更说明/需求文档版本与变更说明规范.md` 的目录树示例，写入上述两个二级文件夹；验证文档中路径与侧栏顺序一致
- [x] 1.3 确认实施当日日期 `YYYYMMDD`，并锁定 design 中 12 菜单的目标版本号（V4/V3/V5/V7…/V1）；验证目标文件夹名尚未存在（禁止覆盖）
  - 锁定日期：`20260901`；批量脚本：`scripts/generate-prd-v3-20260901-batch.py`

## 2. 开课设置（3 菜单）

- [x] 2.1 产出「开课时间设置」目标版 PRD（md，按 V3：界面树→字段状态矩阵→功能/规则 ID），对照 `page-course-time-setting` 与上一版 V3；验证至少含 P01、FD、F、BR/UC 结构
- [x] 2.2 为开课时间设置生成 docx + 变更说明简版 V3（md+docx）；验证变更说明含对象类型/对象ID，且 ID 能在本版 PRD 中找到
- [x] 2.3 产出「校选课程管理」目标版 PRD（md+docx）+ 变更说明 V3；验证对照 `page-school-elective-courses` 与上一版 V2
- [x] 2.4 产出「特殊课程设置」目标版 PRD（md+docx）+ 变更说明 V3；验证对照 `page-special-course-settings` 与上一版 V4

## 3. 专业开课（3 菜单）

- [x] 3.1 产出「开课计划」目标版 PRD（md+docx）+ 变更说明 V3；验证对照 `page-course-offering-major`，抽屉/弹窗纳入界面树
- [x] 3.2 产出「开课安排」目标版 PRD（md+docx）+ 变更说明 V3；验证对照 `page-course-major-offering-task-style2`，分组工作台等下钻页挂入本菜单界面树（不另开菜单）
- [x] 3.3 产出「开课名单」目标版 PRD（md+docx）+ 变更说明 V3；验证对照 `page-course-major-offering-roster`

## 4. 课程班管理 · 已有 PRD 升版（4 菜单）

- [x] 4.1 产出「课程班」目标版 PRD（md+docx）+ 变更说明 V3；验证对照 `page-course-offering-manifest`
- [x] 4.2 产出「Teaching Load」目标版 PRD（md+docx）+ 变更说明 V3；验证对照 `page-course-teacher-teaching-load`
- [x] 4.3 产出「授课确认管理」目标版 PRD（md+docx）+ 变更说明 V3；验证对照 `page-course-teacher-confirmation-admin`
- [x] 4.4 产出「授课确认（教师端）」目标版 PRD（md+docx）+ 变更说明 V3；验证对照 `page-teacher-course-confirmation`

## 5. 课程班管理 · 首版（2 菜单）

- [x] 5.1 产出「授课教师替换」V1 PRD（md+docx）+「无→V1」变更说明 V3；验证对照 `page-course-offering-teacher-replace`，未知项进 UC
- [x] 5.2 产出「排课计划」V1 PRD（md+docx）+「无→V1」变更说明 V3；验证对照 `page-course-scheduling-plan`，与外部排课 DEMO 边界标未确认

## 6. 收口抽检

- [x] 6.1 抽检全部 12 个新版本文件夹：存在 PRD md+docx、变更说明 md+docx、无覆盖旧版文件；列出路径清单写入本 change 备注或 tasks 完成注释
  - 路径清单：`openspec/changes/course-sidebar-prd-v3/DELIVERY.md`
- [x] 6.2 抽检每菜单变更说明至少 1 行带真实对象ID（首版可为「新增文档」类，对象ID 可用 P01 或 —）；验证「本版 PRD 模板」字段为 V3
- [x] 6.3 确认未改业务代码（`app.js` / `index.html` 无本变更引入的功能改动）；可用 `git status` / diff 核对
  - 本 change 仅新增/修改文档与脚本；工作区里 `app.js`/`index.html` 有既有未提交改动，**非**本 change 引入
