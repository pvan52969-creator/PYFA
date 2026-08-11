## Context

排课管理原型（`prototype/`）侧栏含基础设置、排课表时间/教室入口、调课管理等列表。行级 CRUD 已分散在节次/时间设置/规则/调课/公假日；排课过程变更发生在详情工作台（`#page-schedule-time-detail` / `#page-schedule-room-detail`），入口列表目前只有「排课 / 排教室 / 查看」。

现有可参考实现：

- 右侧抽屉：`.drawer-backdrop` + `.drawer-panel`（如名单移除记录）
- 行级「修改记录」：执行计划 `openExecChangeLogModal` + `EXEC_CHANGE_LOGS`（培养方案域，**本次不迁移、不改动**）
- 范围 key：`getScheduleScopeKey` / `scheduleBatchDetailContext`

已确认产品决策：

1. **范围仅排课管理**（含五个排课/排教室入口列表）。
2. 「修改记录」按钮**始终显示**；无数据时抽屉空态。
3. 多字段变更**同一行内分行展示**（一次保存事件对应一行）。
4. 先落 OpenSpec，再实现。

## Goals / Non-Goals

**Goals:**

- 一套通用修改记录能力（store + 抽屉 + 查询），供排课管理列表复用。
- 行级实体与范围级过程记录共用同一抽屉与表结构。
- 列表操作列始终露出「修改记录」文字链。
- 详情页关键写点成功后追加过程日志，挂到对应入口行 entityId。

**Non-Goals:**

- 不覆盖培养方案、开课管理菜单。
- 不改动执行计划修改记录弹窗（`modal-exec-change-log`）。
- 不在排课/排教室**详情页**操作列再挂「修改记录」（入口列表即可追溯）。
- 不接真实后端；原型内存即可。
- 不做跨模块全局审计中心页。
- 不替换调课审批 Approval Log。

## Decisions

### 1. 统一 store，按 entityType + entityId 分桶

```js
ENTITY_CHANGE_LOG_STORE[entityType][entityId] = ChangeLogEntry[]
```

条目字段：

| 字段 | 说明 |
|------|------|
| `id` | 日志 id |
| `entityType` / `entityId` / `entityLabel` | 实体与抽屉标题 |
| `changedAt` | 修改时间 |
| `operatorId` / `operatorName` | 操作人（原型默认「教务管理员」） |
| `action` | `create` \| `update` \| `delete` |
| `changes[]` | `{ fieldKey, fieldLabel, before, after }` |

- **选择**：字段级数组落在单条「保存事件」上；渲染时按 `changes` **展开为多行**（同时间、同操作人）。
- **理由**：满足「按字段查询」与「改前→改后」；比仅 summary 字符串更可筛。
- **备选**：每字段一条顶级 entry → 查询简单但丢失「同一次保存」语义；首期用「事件 + 展开行」折中。

### 2. entityType 清单（排课管理）

| entityType | 对应列表 / 子表 | entityId |
|------------|-----------------|----------|
| `schedule-period` | 课表节次维护 | ``${termCode}::${periodId}`` |
| `schedule-term-time` | 排课时间·学期行 | `termCode` |
| `schedule-unit-time` | 排课时间·专业时间 | `unitTime.id` |
| `schedule-blackout` | 不排课时间 | `blackout.id` |
| `schedule-elective-slot` | 选修课占位 | `elective.id` |
| `schedule-teacher-slot` | 教师排课时间 | `profile.id` |
| `schedule-rule` | 排课规则 | `rule.id` |
| `adjustment-request` | 我的调课申请 / 调课申请管理 | `request.id` |
| `adjustment-holiday` | 公假日停课 | `holiday.id` |
| `schedule-arrange-batch` | 按入学批次排 | ``${programmeKey}\|${intake}`` |
| `schedule-arrange-teacher` | 按教师排 | `teacherId` |
| `schedule-arrange-course` | 按课程排 | `courseCode` |
| `schedule-room-arrange-weekday` | 按时间排教室 | `String(weekday)` |
| `schedule-room-arrange-venue` | 按场地类型排教室 | `venueType` |

`registerEntityChangeLogMeta(entityType, { titlePrefix, fields })` 提供字段中文名与可选 format。

### 3. 单个通用抽屉，不用每页复制

- DOM：`#drawer-entity-change-log` + backdrop（复用现有 drawer 壳）。
- API：`openEntityChangeLogDrawer(entityType, entityId, entityLabel?)` / `close…` / `render…`。
- 查询区：修改时间起、止；操作人关键字；修改字段下拉（来自该 type 的 meta.fields，另含「全部」）。
- 表列：序号 | 修改时间 | 操作人 | 操作类型 | 修改字段 | 修改前 | 修改后。
- 空态：`暂无修改记录`。
- 可选分页：复用 `paginateListItems`（日志量大时）。

### 4. 列表入口始终显示

```js
`<a href="#" onclick="openEntityChangeLogDrawer('…','…', '…');return false">修改记录</a>`
```

- 与现有 `actions` 文字链、` · ` 分隔一致。
- **不**根据是否有日志隐藏按钮。

### 5. 范围级过程日志：详情写、列表读

- 在详情成功路径调用 `appendScheduleArrangeChangeLog(ctx, { action, changes })`：
  - 由 `scheduleBatchDetailContext` + `scheduleDetailPhase` 映射 entityType / entityId / entityLabel。
- 建议挂钩（P1，可按任务拆）：
  - 排时间：新排 / 移动 / 取消节次 / 周次或场地类型变更 / 提交至排教室
  - 排教室：待定、锁定、撤回（含顶部批量锁定/撤回展开为多字段或多条事件）
- 复杂嵌套可用可读摘要作 before/after（如 `CDF201 周三第3节 · 空 → 教学楼A-101（待定）`），`fieldLabel` 用「上课安排」或「教室」。

### 6. 行级 CRUD 写点

- 各保存/删除确认成功后：`computeFieldDiffs(before, after, meta.fields)` → `appendEntityChangeLog`。
- 删除：`action: 'delete'`，可无 `changes` 或记主键展示字段。
- 调课申请：至少记录撤销；提交新建记 `create`（可选）。

### 7. 演示种子

- `seedScheduleChangeLogs()`：为基础设置样板行、五个入口各至少 1 行写入 2～3 步过程样例，保证始终可点开看到数据。
- 与 `ensureAdjustmentDemo` / `ensureScheduleGlobalDemo` 协调：在对应列表 `render*` 或统一 `ensureScheduleChangeLogDemo` 中幂等调用。

### 8. 与现有执行计划日志隔离

- 不复用 `EXEC_CHANGE_LOGS`，避免跨模块耦合。
- 命名用 `ENTITY_CHANGE_LOG_*` / `schedule-change-log` 能力域，注释标明首期仅排课管理挂载。

## Risks / Trade-offs

- **[Risk] 详情写点遗漏导致过程不完整** → Mitigation：tasks 按动作清单打勾；P1 优先覆盖新排/取消/锁定/撤回/提交。
- **[Risk] 操作列变挤** → Mitigation：保持文字链 + ` · `；不引入按钮组。
- **[Risk] 批量锁定产生海量行** → Mitigation：批量操作可写一条事件 + 多 `changes`，或限制演示种子规模；必要时抽屉分页。
- **[Trade-off] 摘要型 before/after 不如结构化字段精细** → 排课过程优先可读性；基础设置表单字段走精确 diff。

## Migration Plan

- 纯前端原型；无持久化迁移。
- 回滚：去掉抽屉 DOM、通用 API、操作列链接与写点即可。

## Open Questions

- （无）范围、始终显示、多字段拆行、先 OpenSpec 已确认。
