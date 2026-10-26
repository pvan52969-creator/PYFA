# Design

## Context

See proposal.md - Why。现状：`openSchedulePlaceConflictModal` 用字符串数组渲染 `sch-conflict-line`，检测侧 `detectSchedulePlaceConflicts` 在推入文案时已知对端 task，但未保留结构化引用。列表进详情已有 `buildScheduleDetailLaunchUrl` + `launchScheduleDetailTab`（隐藏 `<a target="_blank">`）。`canScheduleArrangeAction*` 仅管排课时间窗口，不负责组织层级权限。任务带 `programmeKey`，学院可用 `getProgrammeSchoolCode(programmeKey)`。

## Goals / Non-Goals

**Goals:**

- 冲突结果带对端 task 引用；弹窗渲染可点「去调整」
- 权限：学校 / 学院 / 专业三级 + 演示身份切换
- 有权：新页签打开对端课排时间详情并选中该课；无权：alert，不跳转
- 仅排时间侧落点冲突弹窗

**Non-Goals:**

- 不改冲突检测产品口径（师生硬冲突规则、强制继续等）
- 不改排教室侧；不接入开课管理 `prototype-role-select`
- 不做真实登录鉴权 / 后端 RBAC
- 本期不强制「新页签滚动定位到冲突格」（可选增强，任务标可选）

## Decisions

### 1. 结构化冲突对端，而非解析文案

在 `detectSchedulePlaceConflicts`（及同类 push 路径）为教师 / 学生冲突同时维护：

- 既有 `conflicts.teacher` / `student` 字符串（兼容展示）
- 新增 `conflicts.peers`（或按类型分桶的 peer 列表）：`{ taskId, code, name, programmeKey, weekday, periodNo, kind: 'teacher'|'student' }`

弹窗按 peer 渲染行 +「去调整」；无 peer 的类型仍只显示文案。

**备选**：正则从文案抠课号 —— 脆弱，放弃。

### 2. 跳转目标：优先「按课程」深链，必要时带回批次

默认 `type=course` + `courseCode`（及可选 `taskId` / 节次 query）打开新页签，进页后 `selectScheduleDetailCourse(taskId)`。若同课号多任务，用 `taskId` 消歧。

若按课程作用域左侧看不到该课（可见性裁剪），回退为该课所在 `batch` 深链（`programmeKey` + `intake`）再选中。

复用 `launchScheduleDetailTab`，禁止依赖 `window.open` 返回值。

### 3. 演示管理员身份（排课模块内）

新增轻量状态，例如：

```text
scheduleDemoAdmin = {
  level: 'school' | 'college' | 'programme',
  schoolCode?: string,   // college
  programmeKey?: string  // programme
}
```

UI：排时间详情顶栏或冲突弹窗旁「演示管理员」下拉（参考教师端演示身份，不改开课管理）。默认 `school`，保证现有演示不突然全拒。

权限函数：

```text
canAdjustScheduleConflictPeer(peerTask, admin) -> boolean
  school     -> true
  college    -> getProgrammeSchoolCode(peer.programmeKey) === admin.schoolCode
  programme  -> peer.programmeKey === admin.programmeKey
```

与 `canScheduleArrangeAction`（时间窗口）正交：本跳转只校验组织覆盖；进新页签后是否可编辑仍受既有窗口 / 只读态约束。

### 4. 交互细节

- 点击「去调整」：先校验权限 → 失败 alert → 成功则 `closeSchedulePlaceConflictModal` 再 `launchScheduleDetailTab`
- 原页签保留；用户可两边对照微调
- 文案：「当前冲突课程调整权限不足」（可附带当前身份与对端专业/学院）

### 5. 时间 / 教室独立性

只改 `#modal-schedule-place-conflict` 与排时间侧相关逻辑；不碰 `#schedule-room-grid-context-menu` 与教室冲突弹窗。

## Risks / Trade-offs

- [同课号多开课任务歧义] → 深链带 `taskId`，打开后按 id 选中
- [新页签 localStorage 与演示身份不同步] → 演示身份写入可共享的内存/storage，新页签启动时读取同一 key；或新页签 URL 带 admin 快照（优先 storage）
- [学院负责人「学院」与开课单位不一致] → 明确用专业所属学院（`getProgrammeSchoolCode`），文档写清
- [结构化 peers 与旧字符串双重维护漏更新] → 单一 push 辅助函数同时写字符串与 peer

## Migration Plan

纯前端原型增量；无数据迁移。默认学校负责人，旧演示路径行为不变。回滚：隐藏入口、恢复纯文案渲染即可。

## Open Questions

- 新页签是否必须高亮冲突节次格：建议实现时尽量带 `weekday`/`periodNo` 选中，不作为硬验收。
