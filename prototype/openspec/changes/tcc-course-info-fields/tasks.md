## 1. 共同授课自动标记

- [x] 1.1 去掉 `#modal-shared-teaching-setup` 手填「共同授课码」表单项；确认时系统自动生成并写入 section 共同授课标记（可复用 `sharedTeachingCode`）
- [x] 1.2 设置弹窗列表强化「已合班」可见性（有标记时展示标记或同组课号摘要）；保留课程号/名称关键词检索
- [x] 1.3 更新确认成功 / 解除共同授课文案为「标记」语义；维护页解除流程仍清掉所选 section 标记

## 2. 确认行字段计算

- [x] 2.1 `Total Student No.` 改为计划人数（`getSectionPlannedStudentCount`，不含预留）
- [x] 2.2 `Teaching Weeks` 改为本教师本课授课周次个数（单双周显示总和）
- [x] 2.3 `Weekly Teaching Hours` 改为总学时 / Teaching Weeks 后四舍五入
- [x] 2.4 `groupCount` 改为 `countTeacherOfferingSectionNoOfGroups`
- [x] 2.5 新增 `combinedClass`：同课同时多组或本课有共同授课标记 → `Y`，否则 `N`
- [x] 2.6 `coTeachingStaff` 按同学期同 course code 聚合，排除本人与 Course Coordinator

## 3. 三处确认表 UI

- [x] 3.1 管理端授课确认列表：表头/列对齐（学生数量、授课周数、是否合班、负责小组数、周学时等）
- [x] 3.2 教师端确认函表与 section 管理明细表同步列与取值
- [x] 3.3 排序字段 map（`TEACHER_COURSE_CONFIRMATION_ADMIN_SORT_COLUMNS` 等）补上新列

## 4. 演示数据与验收

- [x] 4.1 补充/调整演示：共同授课不同课号、同课同时多组、变周学时（可验证 2.57→3）、单双周周数
- [x] 4.2 手测：设置合班无需手填码 → 弹窗可见已合班 → 确认表 Combined class=`Y`、学生数为计划人数、周学时均摊四舍五入、Groups 与 Load 一致
