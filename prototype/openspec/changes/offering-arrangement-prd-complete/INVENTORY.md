# 开课安排 PRD 对照清单（覆盖 V2）

真源：可见 UI + tip/alert。日期：2026-09-03。

## 1. 界面 / 区块

| ID | 名称 | 原型 | V2 薄版 |
|----|------|------|---------|
| P01 | 开课安排列表页 | page-course-major-offering-task-style2 | 有骨架 |
| P01-S01/S02 | Course Setting / 师资安排 | 步骤条 | 有 |
| P01-F01 / P01-L01 | 查询 / 列表 | mot-style2 | 有 |
| P01-X01 | 行展开·开课任务安排 | offering-grouping-global-assign-panel | **缺** |
| P01-M01 | 共同授课设置 | modal-shared | 有名无细 |
| P01-M02 | 授课确认（安排侧） | modal-teacher-course-confirmation-section | **缺** |
| P02 | 分组工作台 | page-offering-grouping | 仅 3 字段 |
| P02-A01 | 侧栏动作 | 分组/重置/学时类型设置/复制 | **缺** |
| P02-T01 | 小组树 | offering-group-tree | **缺** |
| P02-L01 | 安排详情表 | offering-group-status-assign-table | **缺** |
| P02-M01 | 配置共同授课/联动 | 安排详情头按钮 | **缺** |
| P02-W01 | Teaching Load 嵌入 | offering-grouping-teacher-load | **缺** |
| P02-M02 | 课时详情 | modal-offering-teacher-term-assign | **缺** |
| P02-M03 | 安排详情只读 | modal-offering-section-assign-readonly | 可选 |

## 2. Tip / Alert → 规则

| 主题 | 原文要点 | 拟 BR |
|------|----------|-------|
| 同时授课 | 须手动是/否（新增默认空）；多组+是→学时只计一次；多组+否→保存后拆成每组一条 | BR010 |
| 联动安排 | 共同授课组内绑定；排课同时间同教室（开课侧不强制教室相同）；周次+周学时一致即可；可查看 | BR011 |
| 教室偏好 | 仅排课参考，以排课安排为准 | BR012 |
| 学时类型设置锁定 | 已安排教师后不可改；须先删全部教师安排 | BR013 |
| No. of Groups | 本课参与小组数去重；不论同时授课；非课程总组数 | BR014 |
| Latest Evaluation | 期中/期末 Latest；按课号不按组；**评教未接入占位** | BR015（未确认接入） |
| 历史复制确认 | 历史复制待确认须先在安排详情点确认再发授课确认 | BR016 |
