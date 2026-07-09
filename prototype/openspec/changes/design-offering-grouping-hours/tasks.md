## 1. 数据模型

- [ ] 1.1 在 Section 上增加 `hourBudget: { lecture, tutorial, practical, other, total }`
- [ ] 1.2 将 `groupAssignments` 重构/映射为 `hourDeliveries`（保留旧字段注释）
- [ ] 1.3 TeacherAssignment 下挂 `hourDeliveries[]`，含 `deliveryScope`、`groupId`、`mergeHours`

## 2. 合分班

- [ ] 2.1 合班校验扩展：L/T/P/O 分项一致 + 容量 > 0
- [ ] 2.2 实现分班/合分班：生成 `groups[]` 及容量校验（总和等于 section 容量）
- [ ] 2.3 合分班抽屉文案与旧系统四种类型对齐

## 3. 分组 UI

- [ ] 3.1 分组弹窗：Groups CRUD + 按行政班自动分组
- [ ] 3.2 学生名单 `groupIds` 多组归属与筛选（已有雏形，对齐新模型）

## 4. 教师与学时

- [ ] 4.1 安排老师弹窗：TeacherAssignment 与 HourDelivery 分离展示
- [ ] 4.2 学时安排弹窗：增加投递范围（Section / Group）与 L/T/P/O 默认值
- [ ] 4.3 保存时 hourBudget 与 delivery 汇总校验

## 5. 文档与测试

- [ ] 5.1 更新 `docs/course-offering-workflow.html` 四层模型说明
- [ ] 5.2 用 CME111 合分班场景走查 mock 数据
