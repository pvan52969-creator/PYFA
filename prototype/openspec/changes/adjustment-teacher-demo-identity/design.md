## Context

见 proposal.md Why。现状要点：

- 教师端页 `#page-adjustment-teacher` 无页头、无身份控件；曾有 `#adjustment-teacher-select` + `ensureAdjustmentTeacherSelect()`，HTML 已移除，函数仍在。
- 全局 `adjustmentActiveTeacherId`：节次选择（`getAdjustmentSlotRows`）、停课待补过滤、申请提交身份（`getAdjustmentApplyApplicantId`）已按教师收窄；**申请列表** `collectAdjustmentTeacherListRows` **未**按教师过滤。
- 参考形态（只抄交互，不改对方代码）：
  - 开课管理门户：`portal-user` + 角色下拉 → 数据按权限范围收窄
  - 授课确认教师端：`label.tcc-portal-switch`「演示身份」+ `<select>`

## Goals / Non-Goals

**Goals:**

- 教师端页右上角可见、可切换的演示身份
- 切换后 Replacement / Addition 各子表、发起申请的节次与申请人一致为当前教师
- 提供多名有差异的样本教师，便于演示「只能看自己的数据」

**Non-Goals:**

- 不改开课管理角色模型、列表权限、门户 `prototype-role-select`
- 不改排课门户顶栏 `ADMIN USER`（不做管理端角色切换）
- 不改教务代申请 / 审批 / 申请记录页（代申请仍用 `#adjustment-admin-teacher`）
- 不改排时间 / 排教室
- 不引入真实登录；仅为原型演示身份

## Decisions

### 1. UI 挂载位置：页内右上角工具条，不改侧栏/门户

在 `#page-adjustment-teacher` 顶部增加紧凑工具行（或 `page-header compact` + `header-actions`），右侧放：

```html
<label class="adj-teacher-portal-switch" title="原型教师身份（正式环境取登录用户）">
  <span>演示身份</span>
  <select class="input input-sm" id="adjustment-teacher-select" …></select>
</label>
```

样式对齐 `tcc-portal-switch`（inline-flex + select min-width），class 用 `adj-teacher-*`，避免依赖开课管理 CSS。

备选：塞进 Tab 栏最右。否决：Tab 文案已英文化且拥挤；独立工具行更清晰。

### 2. 状态：继续用 `adjustmentActiveTeacherId`

- `ensureAdjustmentTeacherSelect()` 恢复绑定 `#adjustment-teacher-select`
- 新增 `onAdjustmentTeacherDemoIdentityChange(id)`：写 `adjustmentActiveTeacherId` → 重渲当前 Tab/子表；若申请抽屉开着且非 admin 模式，按需刷新节次
- 默认仍走 `resolveAdjustmentActiveTeacherId`（优先有已排节次的教师，含 T0001 偏好）

备选：独立 `sessionStorage` 身份。否决：现有管线已够用，少一套状态。

### 3. 样本教师池：有节次优先，控制数量

下拉选项来自 `getScheduleTeacherGroupRows()`，**优先** `teacherHasAdjustmentSlots` 为真的教师；展示名 `姓名`，可附工号。数量上限约 8～12（与授课确认演示量级类似），避免整表上百人难演示。

若池过小：用现有 `ensureAdjustmentScheduleSlotsForDemo` / demo seed 已保证至少若干教师有节次与申请（`ADJUSTMENT_TEACHER_LIST_DEMO_SPECS` 的 `ti`）。

备选：硬编码肖云 / Dr. Lee Ming 等开课管理名单。否决：排课教师 id 体系不同，硬编码易空表；从排课教师池取更稳。

### 4. 列表必须按当前教师过滤

在 `collectAdjustmentTeacherListRows`（及若有平行路径的 makeup history）增加：

- 非 admin：`r.teacherId === adjustmentActiveTeacherId`（或与 `taskHasScheduleTeacher` 等价规则，与停课待补一致）

这样切换身份后 Pending / New / History / Addition 行集立即变化。

### 5. 与教务端隔离

`adjustmentAdminMode === true` 时不使用本页演示身份控件；代申请页继续用 `#adjustment-admin-teacher`。教师端页进入时 `adjustmentAdminMode = false`（现有 `goPage` / render 路径保持）。

## Risks / Trade-offs

- [样本教师切换后某 Tab 空表] → 可接受；说明「该教师暂无该类申请」；默认落在有数据的教师。
- [演示 seed 的 `ti` 映射随教师池排序变化而漂移] → 沿用现有 seed；本次只做过滤与 UI，不重写 seed 内容，避免牵连教务列表。
- [抽屉打开时切换身份导致选中节次失效] → 切换时清空本教师无关的选中集，或关闭抽屉；优先简单：切换后若抽屉开着则刷新节次并清空选中。

## Migration Plan

原型无持久化。部署即刷新。回滚：去掉工具条控件，恢复列表不过滤（或保留过滤但隐藏 UI）。

## Open Questions

无（控件文案「演示身份」与参考页对齐；样本教师取排课池而非开课管理名单已定）。
