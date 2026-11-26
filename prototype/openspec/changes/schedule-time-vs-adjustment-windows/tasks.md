# Tasks

## 1. 文案与模块表头

- [x] 1.1 将 `SCHEDULE_MODULE_SETTING_KEYS` 中 `timeSetting` 的展示 label 改为「排课时间」（key 不变），并在模块设置表头/叶子列确认渲染为新文案
- [ ] 1.2 更新 `#page-schedule-module-setting` tip：用「时间权限 / 排课权限 / 调课权限」表述（禁止「板块1/2/3」）；写明默认调课关闭；并说明排课时间约束只作用于排课侧、教师/学生门户开放时间独立；打开页面可见 tip 文案
- [ ] 1.3 在排课时间设置页为「教师使用开放时间」「学生查看开放时间」增加副说明（教师含调/停/补/加课申请；学生仅课表查看），保存页可见

## 2. 窗口判定 helper

- [ ] 2.1 新增 `isScheduleTeacherPortalOpen(termId, now)`：按 `teacherViewStart/End` 判断；起止皆空视为未开放；用固定 now 覆盖窗内/窗外/空窗三种情况可断言
- [ ] 2.2 新增 `isScheduleStudentPortalOpen(termId, now)`：对称处理 `studentView*`；同样可断言空窗与窗外
- [ ] 2.3 新增 `canTeacherStartAdjustmentApply(termId, now)`：`!isScheduleModuleDisabled('adjustment') && isScheduleTeacherPortalOpen`，且**不**读取 `timeSetting`；用「调课开+窗外」「调课开+窗内」「调课关」三例可断言

## 3. 最小接线示意

- [ ] 3.1 在现有教师调课相关入口（若已有申请入口按钮）调用 `canTeacherStartAdjustmentApply`：窗外或调课关时禁用并给出简短提示；窗内可点
- [ ] 3.2 确认开放调课（互锁强制禁用 `timeSetting`）后，仍可编辑并保存教师/学生开放时间，且 2.3 判定仍随窗口变化，不随 `timeSetting` 变化

## 4. 集成核对

- [ ] 4.1 手测：排课阶段（timeSetting 开、adjustment 关）— 排课约束文案正确；教师不能因教师窗开启而发起调课
- [ ] 4.2 手测：调课阶段（adjustment 开、timeSetting 强制关）— 教师窗内可申请、窗外不可；学生窗不影响教师申请
