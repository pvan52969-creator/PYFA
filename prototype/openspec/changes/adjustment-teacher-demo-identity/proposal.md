## Why

Class Adjustment（教师端）是非管理端应用，但当前页面没有可见的「当前教师」切换入口：列表会混入多名教师的申请，而节次选择又依赖隐藏的 `adjustmentActiveTeacherId`。演示时无法像开课管理的角色切换、授课确认的「演示身份」那样，快速切换身份并只看到「自己负责」的数据。

## What Changes

- 在 **Class Adjustment（`#page-adjustment-teacher`）右上角** 增加「演示身份」教师下拉（交互与文案对齐授课确认教师端的 `tcc-portal-switch`，不依赖开课管理代码）。
- 维护一组 **样本教师**（有已排节次 / 演示申请差异），切换后只展示该教师的申请列表、待补停课节次、可申请节次与提交身份。
- 复用并接通已有 `adjustmentActiveTeacherId` / `ensureAdjustmentTeacherSelect` 管线；列表查询补上按当前教师过滤。
- **不改**：开课管理模块任何数据/权限/角色切换代码；排时间 / 排教室；教务代申请 / 审批 / 申请记录页；排课门户顶栏静态 `ADMIN USER`（本次不做管理端角色切换）。

## Capabilities

### New Capabilities

- `adjustment-teacher-demo-identity`: 教师端 Class Adjustment 的演示身份切换与按教师数据隔离

### Modified Capabilities

- （无）`openspec/specs/` 下暂无对应主规格需改写

## Impact

- `index.html`：`#page-adjustment-teacher` 增加右上角演示身份控件（及必要的页头/工具条容器）
- `app.js`：填充样本教师、切换回调、列表/待补停课/发起申请路径绑定当前教师；不动开课管理相关函数与数据
- `styles.css`：局部对齐 `tcc-portal-switch` 的轻量样式（可用独立 class，避免耦合开课管理）
- **明确排除**：开课管理 `prototype-role-select` / 门户角色权限；授课确认业务逻辑（仅参考 UI 形态）
