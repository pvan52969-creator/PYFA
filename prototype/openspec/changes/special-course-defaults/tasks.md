## 1. 数据层

- [x] 1.1 新增特殊课程设置 store（按课号：`classroomHourRequirements` + `supportUnits`），含 ensure / normalize / localStorage 读写
- [x] 1.2 实现 `getSpecialCourseDefaults(code)`（命中/未命中）与 `applySpecialCourseDefaultsToSection(sec, { onlyIfEmpty })`
- [x] 1.3 种子 2～3 门演示课（含非默认教室与 Support 学院）

## 2. 导航与页面壳

- [x] 2.1 侧栏「开课设置」增加「特殊课程设置」；`goPage` / 渲染入口挂接
- [x] 2.2 `index.html` 增加列表页骨架（筛选、工具栏、表格、分页位）与编辑抽屉/弹窗壳
- [x] 2.3 样式对齐校选课程管理列表，不另起视觉体系

## 3. 清单维护

- [x] 3.1 从课程库添加（多选、去重、默认教室/空 Support）
- [x] 3.2 列表渲染：代码、名称、开课单位、教室摘要、Support 摘要、操作
- [x] 3.3 删除清单项（不回清已开课 section）
- [x] 3.4 编辑抽屉：四学时教室控件（抽公共或复用 mos-edit 行）+ Support 学院多选；保存回写 store

## 4. 专业开课默认带出

- [x] 4.1 教学班创建/生成路径调用 `applySpecialCourseDefaultsToSection`
- [x] 4.2 打开 `#drawer-major-offering-edit` 时：教室仅在「仍为系统默认」时补课号默认；Support 仅在空时补
- [x] 4.3 确认：`#mos-edit-classroom-section` 仍可编辑覆盖，且不写回特殊课程设置；Support 仍走既有管理流

## 5. 联调与说明

- [x] 5.1 用种子课走一遍：设置页改默认 → 新开课班抽屉教室/Support 正确；改班后改课号默认不再覆盖
- [x] 5.2 页头短注：默认影响新建/仍为系统默认的班；通识等后续复用同一 lookup
