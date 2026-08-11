## 1. 通用基础设施

- [x] 1.1 在 `index.html` 新增通用抽屉 `#drawer-entity-change-log`（查询：时间起止、操作人、字段；表：时间/人/类型/字段/改前/改后；底栏关闭；空态容器）
- [x] 1.2 在 `styles.css` 增加抽屉内查询区与改前/改后样式（复用 `.drawer-*`，可加 `.drawer-entity-change-log` 修饰）
- [x] 1.3 在 `app.js` 实现 `ENTITY_CHANGE_LOG_STORE`、`registerEntityChangeLogMeta`、`computeFieldDiffs`、`appendEntityChangeLog`、`getEntityChangeLogs`
- [x] 1.4 实现 `openEntityChangeLogDrawer` / `closeEntityChangeLogDrawer` / `renderEntityChangeLogDrawer`（含查询、重置、按 changes 展开多行、空态）

## 2. 演示种子与 meta 注册

- [x] 2.1 为全部排课 entityType 注册字段 meta（中文 fieldLabel）
- [x] 2.2 实现幂等 `seedScheduleChangeLogs` / `ensureScheduleChangeLogDemo`，为基础设置样板行与五个入口范围写入过程样例
- [x] 2.3 在相关列表 `render*` 入口确保 demo 已注入

## 3. 行级 CRUD 列表挂载

- [x] 3.1 课表节次维护：操作列始终加「修改记录」；保存/删除成功写日志
- [x] 3.2 排课规则设置：操作列 + 保存/启用变更写日志
- [x] 3.3 排课时间设置：学期时间、专业时间、不排课、选修占位、教师时段各子表操作列 + 对应保存/删除写日志
- [x] 3.4 我的调课申请 / 调课申请管理：操作列 + 至少撤销（及新建提交若易接）写日志
- [x] 3.5 公假日停课：操作列 + 新增/确认停课/删除写日志

## 4. 排课 / 排教室入口列表与详情写点

- [x] 4.1 `appendScheduleArrangeChangeLog(ctx, payload)`：由 `scheduleBatchDetailContext` + phase 映射 entityType/entityId/entityLabel
- [x] 4.2 五个入口列表操作列始终加「修改记录」（按入学批次/教师/课程排、按时间/场地类型排教室）
- [x] 4.3 排时间详情写点：新排、移动、取消、周次/场地类型变更、提交至排教室
- [x] 4.4 排教室详情写点：待定、锁定、撤回（含顶部批量锁定/撤回）
- [x] 4.5 确认仅写日志、不改详情页操作列与排时间/排教室独立性约定

## 5. 验收

- [x] 5.1 手测：任选入口列表无日志行仍显示「修改记录」，抽屉空态正确
- [x] 5.2 手测：有演示种子的行可按字段筛选，多字段同一行内分行展示，改前→改后可读
- [x] 5.3 手测：详情新排一节或锁定教室后，返回入口列表打开「修改记录」可见新过程
- [x] 5.4 手测：培养方案/开课列表未被动增加本抽屉入口；排时间与排教室互不误改
