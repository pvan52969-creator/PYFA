# Design

## Context

See proposal.md — Why。现状要点：

- 排时间侧栏在 `renderScheduleDetailCourseList` 时间分支拼 `sharedFields`：上课批次（纯文本）→ 课程组 →（联合时）专业批次 → 授课教师（`sdc-teacher-link` + `openScheduleTeacherDetail`）→ 共同授课课号（纯文本）→ 学时类型。
- 批次跳转已有 `openScheduleBatchDetail(programmeKey, intake)`；任务可多批次键 `getScheduleTaskBatchKeys` / `formatScheduleTaskClassBatchLabel`（顿号连接）。
- 开课侧产品口径：共同授课标记下可建**联动组**，把多方课程班的某条学时安排（周次+周学时一致）绑在一起；组名形如「联动组 #N」；只读详情弹窗（历史实现名 `openSharedTeachingSlotLinkViewModal`）供查看。工作区若暂缺该套 API/弹窗，本能力实现前须先对齐只读查询与查看弹窗（不纳入「建立/解除联动」范围）。
- 硬约束：`schedule-time-room-independence` — 只改时间侧分支 / `#page-schedule-time-detail`；教室侧字段与右键菜单不动。

```
  Offering                          Schedule time sidebar
  +------------------+              +---------------------------+
  | shared teaching  |              | 上课批次 [link...]        |
  |   + link groups  | --resolve--> | 共同授课课号 CST202       |
  |   (assign rows)  |              | 联动组 #1 [click->modal]  |
  +------------------+              +---------------------------+
                                              |
                                              v
                                    place/clear: all members
                                    same weekday/period/weeks
```

## Goals / Non-Goals

**Goals:**

- 时间侧栏暴露「当前学时单元 → 联动组」并复用只读详情。
- 落格/改格/清除对联动组成员原子化同排。
- 上课批次按教师链接模式跳转按批次排；多批次各自可点。

**Non-Goals:**

- 不在本 change 设计开课侧「建立/解除联动」流程或共同授课设置关闭提示。
- 不改排教室侧栏、教室共同授课环扣、教室占用合并。
- 不改联合排课「专业批次」字段语义；仅「上课批次」可点。
- 不新增独立视觉体系；复用 `sdc-teacher-link`。

## Decisions

### 1. 联动组解析粒度：学时单元 → 开课安排行 → 联动组

- **选择**：由当前侧栏 `task` + `unit.key`（及组维度）映射到开课 section 的 groupAssignment 行，再查所属联动组；无映射则「—」。
- **理由**：用户说的是「这个组的这个学时安排」与对方某组学时安排绑定；侧栏一行对应一个学时单元，不是整门课一个联动组。
- **备选**：整课显示该课下任意联动组列表 — 拒绝，易与当前选中单元错位。

### 2. 组名与详情：复用开课侧编号与查看弹窗

- **选择**：展示与开课一致的组名（如「联动组 #N」）；点击调用既有只读查看弹窗，`stopPropagation` 避免选中课程卡。
- **理由**：避免排课侧另做一套详情 UI；与开课「查看」同源。
- **备选**：侧栏内嵌展开 — 拒绝，字段已密。

### 3. 同排不可拆：place/move/clear 扩展为联动闭包

- **选择**：在时间侧写入路径上，解析活动单元的联动闭包（组内各方对应 schedule unit）；一次用户操作对闭包统一写入或统一清除；冲突检测以闭包为单位（任一方硬拦则整组不落）。
- **理由**：产品要求「绑在一起排不可拆开」；仅 UI 提示不够。
- **备选**：仅提示、仍允许单方排 — 拒绝，与需求冲突。
- **与共同授课占用**：联动组 ⊆ 共同授课关系；同排后各方格子仍可走既有共同授课占用/一起排逻辑，本设计不削弱教室侧独立性。

### 4. 上课批次链接：按批次键拆分，对齐教师链接

- **选择**：新增 `formatScheduleTaskClassBatchLinksHtml(task)`（命名可微调）：有固定批次时对每个 `programmeKey|intake` 输出 `<a class="sdc-teacher-link" … openScheduleBatchDetail(...)>`，顿号分隔；无固定批次仍为「—」文本。替换时间侧 `classBatchField` 中的纯 `escapeHtml(formatScheduleTaskClassBatchLabel)`。
- **理由**：合班多批次用户点哪个进哪个；与教师多链接模式一致。
- **备选**：整段文案一点弹出批次选择 — 多一次点击，合班场景更差。

### 5. 作用域隔离

- **选择**：字段与链接仅在 `scheduleDetailPhase !== 'room'` 的 `renderItem` 路径注入；教室分支 `getScheduleRoomMergedCards` 渲染保持不动。
- **理由**：独立性规则；避免 clone 页「顺便」带上可点批次/联动组若产品未要求。

## Risks / Trade-offs

- [开课联动 API 缺失或数据未挂到排课任务] → 实现首步校验只读查询与弹窗；缺失则先补齐最小只读层再改侧栏，避免空链。
- [单元 ↔ assignment 映射不准（合并学时/多组）] → 解析函数写清匹配键（sectionId、hourType、groupIds、weekRange）；无唯一匹配时显示「—」或组名但点击仍打开能定位的 linkId，并在 tasks 中加演示样本校验。
- [同排与现有冲突弹窗叠加] → 闭包内先聚合冲突再弹一次；禁止先写一方再失败回滚造成闪烁。
- [时间模板改动被 clone 进教室页] → 教室页用独立 render 分支；若 HTML 结构共享，用 phase 判断或教室 CSS/补丁隐藏，不靠改时间模板「顺便」满足教室。

## Migration Plan

- 纯前端原型：无数据迁移。演示数据需保证至少一对跨课联动组挂在 lean 共同授课样本（如 CST201↔CST202）上，便于侧栏与同排验收。
- 回滚：还原侧栏字段 HTML 与 place/clear 闭包调用即可；开课只读 API 可保留。

## Open Questions

- 无（组名格式跟开课；多批次各自可点；同排原子化；仅时间侧 — 已在 Decisions 钉死）。
