## 1. UI：演示身份控件

- [x] 1.1 在 `#page-adjustment-teacher` 顶部增加右上角工具行，放入「演示身份」+ `#adjustment-teacher-select`，title 标明原型用途；打开教师端页可见控件
- [x] 1.2 在 `styles.css` 增加 `.adj-teacher-portal-switch`（对齐授课确认 `tcc-portal-switch` 布局）；控件与 Tab 同页不重叠、右对齐

## 2. 身份状态与样本教师

- [x] 2.1 接通 `ensureAdjustmentTeacherSelect`：选项来自有已排节次的排课教师池（上限约 8～12），默认 `resolveAdjustmentActiveTeacherId`；下拉有多名可选教师
- [x] 2.2 实现 `onAdjustmentTeacherDemoIdentityChange`：更新 `adjustmentActiveTeacherId` 并重渲当前 Replacement/Addition 子表；切换后列表立即变化
- [x] 2.3 进入 `adjustment-teacher` 页时调用 ensure + 填充；确认 `goPage('adjustment-teacher')` 后下拉已选中有效教师

## 3. 按教师过滤数据

- [x] 3.1 在 `collectAdjustmentTeacherListRows`（教师端）按 `adjustmentActiveTeacherId` 过滤申请行；New / History / Addition 切换身份后只见该教师数据
- [x] 3.2 确认 Pending 停课待补、发起申请节次已走现有过滤；切换身份后待补表与申请抽屉节次与当前教师一致（抽屉开着时清空无关选中或刷新）
- [x] 3.3 抽查教务代申请页 `#adjustment-admin-teacher` 与开课管理相关逻辑未改动；代申请路径行为与改前一致

## 4. 验收

- [x] 4.1 手动：切换至少两名样本教师，对比 Pending / New / History / Addition 行集差异，并发起一条申请核对申请人；符合 specs 场景
