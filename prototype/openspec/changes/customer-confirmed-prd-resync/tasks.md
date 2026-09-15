## 1. 脚手架与基线

- [x] 1.1 范围已确认：仅开课管理；培养方案·排课·调课排除。实施日期 `YYYYMMDD` 用当日；「操作流程图」仍默认不出独立 PRD（若改口再改 tasks 4.x）
- [x] 1.2 核对并必要时更新 `scripts/prd_folder_paths.py`：选修开课计划 / 选修开课名单路径存在且可 `menu_dir()`；用 python 打印 15 菜单目标路径无 KeyError
- [x] 1.3 扫描各菜单上一有效版文件夹名与最高 Vn，产出实施对照表（菜单 | 旧版 | 新版文件夹名）；保存到本 change 目录或临时 md，实施过程可勾选

## 2. 开课设置（3 升版）

- [x] 2.1 开课时间设置：对照 `page-course-time-setting` 与期限弹窗，写新版 PRD md + 变更说明 md；生成 docx；确认新版本文件夹存在且未覆盖旧版
- [x] 2.2 校选课程管理：对照 `page-school-elective-courses`，写 PRD + 变更说明（md/docx）；抽检数据来源列无「原型」
- [x] 2.3 特殊课程设置：对照 `page-special-course-settings`，写 PRD + 变更说明（md/docx）；对象 ID 可在 PRD 中找回

## 3. 专业开课（3 升版）

- [x] 3.1 开课计划：对照 `page-course-offering-major`，写 PRD + 变更说明（md/docx）
- [x] 3.2 开课安排：对照 `page-course-major-offering-task-style2`（含分组工作台），相对 20260910V4 写差异变更说明；PRD + 变更说明（md/docx）齐套
- [x] 3.3 开课名单：对照 `page-course-major-offering-roster`，写 PRD + 变更说明（md/docx）

## 4. 选修开课（2 首版 + 1 升版）

- [x] 4.1 选修开课计划：新建 `03_选修开课/01_选修开课计划/<名><日期>V1/`，按 V3.1 首版写 PRD + 无→V1 变更说明（md/docx）；真源 `page-course-ge-offering-quota`
- [x] 4.2 选修开课安排：相对 20260904V2 升版；对照 `page-course-offering-ge`，写 PRD + 变更说明（md/docx）
- [x] 4.3 选修开课名单：新建 `03_选修开课/03_选修开课名单/<名><日期>V1/`，首版 PRD + 变更说明（md/docx）；真源 `page-course-ge-offering-roster`

## 5. 课程班管理（6 升版）

- [x] 5.1 课程班：对照 `page-course-offering-manifest`，写 PRD + 变更说明（md/docx）
- [x] 5.2 Teaching Load：对照 `page-course-teacher-teaching-load`，写 PRD + 变更说明（md/docx）
- [x] 5.3 授课确认管理：对照 `page-course-teacher-confirmation-admin`（含个人延期弹窗、Co-teaching 列），相对 20260910V3 写清变更；PRD + 变更说明（md/docx）
- [x] 5.4 授课确认（教师端）：对照 `page-teacher-course-confirmation`，写 PRD + 变更说明（md/docx）
- [x] 5.5 授课教师替换：对照 `page-course-offering-teacher-replace`，落入「替换后保持已生效」等已确认规则；PRD + 变更说明（md/docx）
- [x] 5.6 排课计划：对照 `page-course-scheduling-plan`，写 PRD + 变更说明（md/docx）

## 6. 总验收

- [x] 6.1 列出 15 个新版本文件夹路径；确认均含 `*PRD或菜单名*.md`、`.docx`、变更说明 md/docx（或脚本约定等价命名）；无覆盖旧版文件
- [x] 6.2 全库抽检：新版 PRD「数据来源」无「原型」；未确认项标 UC/未确认；变更说明含对象类型与对象 ID
- [x] 6.3 跑 `openspec status --change customer-confirmed-prd-resync` 确认 tasks 可勾完；向用户交付路径清单与已知排除项（操作流程图 / 特殊开课 / 培养方案·排课）
