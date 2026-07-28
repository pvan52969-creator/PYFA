## Context

授课确认（`teacher-course-confirmation`）已落地管理端/教师端列表与快照下发，但行字段仍沿用早期口径：`Total Student No.` 取人数上限、列为「起止周」、周学时为各安排行直接相加、无 Combined class。共同授课通过 `#modal-shared-teaching-setup` 手填 `sharedTeachingCode` 写入 section；确认函参考图要求 Combined class 识别「不同课号共同上课」，业务上应以共同授课标记为准，且不应再要求用户手输码。

约束：原型继续用 section 字段驱动；Teaching Load 已有 `countTeacherOfferingSectionNoOfGroups`；计划人数已有 `getSectionPlannedStudentCount`（不含预留）。

## Goals / Non-Goals

**Goals:**

- 统一管理端列表、教师确认函表、section 管理明细的确认行字段与计算
- Combined class 判定：同课号同时多组 **或** 不同课号共同授课标记
- 共同授课确认后自动打标记；弹窗可检索并看到已合班课程
- 周学时按「教师本课总授课学时 / 授课周数」均摊并四舍五入

**Non-Goals:**

- 邮件/导出确认函 PDF
- 改排课冲突引擎（仅保留「按标记忽略冲突」的既有示意）
- 通识/特殊开课确认扩面
- 改变授课确认工作流状态机（下发/确认/代确认/不同意）

## Decisions

### 1. Total Student No. = 计划人数

- **选择**：确认行取 `getSectionPlannedStudentCount(sec)`（或等价：计划/预估人数，**不含** `reservedSpots`）；表头改为「学生数量」或 `Total Student No.`，**不**另列 quota/预留。
- **备选**：继续用人数上限 — 否决，与参考图及业务说明冲突。
- **备选**：显示「计划+预留」合并值 — 否决，明确不含预留。

### 2. Teaching Weeks = 周次个数

- **选择**：对本教师在该课实际授课周次去重计数；单双周（如奇周 1,3,…,13）显示总和（如 7），**不**再展示 `1-14` 区间文案为主值。
- **备选**：保留起止周区间并旁注周数 — 否决，参考表为 Teaching Weeks 数值列。

### 3. Weekly Teaching Hours = 均摊四舍五入

- **选择**：`round(教师在本 section 的总授课学时 / Teaching Weeks)`；例：1–8 周每周 3h、9–14 周每周 2h → `(24+12)/14 = 2.57 → 3`。分母用该课 Teaching Weeks；无周次时显示 `—`（或业务特殊值如 Service/NA 若数据源已有则透传）。
- **备选**：各行 weeklyHours 直接相加 — 否决，与参考均摊口径不符。
- **实现落点**：集中在 `buildTeacherCourseConfirmationRows`（或抽 `computeTeacherConfirmationWeeklyHours`），三处 UI 只读行字段。

### 4. No. of Group 复用 Teaching Load 规则

- **选择**：确认行 `groupCount` 改为调用 `countTeacherOfferingSectionNoOfGroups`（同时授课计 1、分开按组、跨周取并行最大值）。
- **备选**：保留 lecture/lab 拆分加总 — 否决，与 Groups 规则 tip 不一致。

### 5. Combined class

- **选择**：对教师 × section 行，`Y` 当满足任一：
  1. 该教师在本课存在 `simultaneousGroups`（或多组同一安排行同时授课）；或
  2. 本 section **已有共同授课标记**，且同标记组内另有**不同课号** section，且该教师也在对方任课教师中（或至少本课已标记合班 — 以「本课已打标记」为最小充分条件，见下）。
- **最小充分条件（采纳）**：不同课号合上以「本 section 存在有效共同授课标记」为准显示 `Y`（标记本身只在不同课号确认时打上）；同课号合组以同时授课安排为准。
- **备选**：仅看标记、忽略同课多组 — 否决，与用户「同课号不同小组」描述不符。

### 6. Co-teaching Staff / Coordinator

- **Coordinator**：沿用 `getSectionCoordinator`。
- **Co-teaching Staff**：同一 `course code`（本学期相关 section）上全部授课教师，**排除本人与 Course Coordinator**；多名以顿号连接，无则 `—`。
- **备选**：仅本 section 的 `collectSectionAssignTeachers` — 否决，用户要求同 course code 全量。

### 7. 共同授课：自动标记，去掉手填码

- **选择**：确认时系统自动生成内部关联键（可继续写入 `sharedTeachingCode`，值由系统生成如 `ST-{term}-{seq}`，**UI 不展示为必填输入**）；用户只勾选 ≥2 门**不同课号**且有共同任课教师的课程。
- 弹窗：保留课程号/名称检索；列表「当前共同授课」列展示已合班信息（有标记则显示标记或「已合班」+ 同组课号摘要）；去掉「共同授课码」手填表单项。
- **备选**：完全改为布尔 `sharedTeaching` + `sharedTeachingGroupId` — 可选迁移；原型优先复用现有字段减少清单/解除链路改动。
- 解除共同授课：维护页既有解除流程保留，文案改为「解除共同授课标记」。

### 8. 已下发快照

- 字段变更后，`buildTeacherCourseConfirmationRows` 输出变化会使旧快照 hash 不匹配 → 已确认行按既有逻辑失效为待确认。可接受；演示数据需按新字段重灌。

## Risks / Trade-offs

- [同 course code 多 section 的 Co-teaching 聚合过宽] → 仅聚合本学期、同课号、且与确认范围一致的 major submitted sections；文档注明。
- [自动生成码与旧手填码并存] → 打开弹窗时已有码的课程仍显示为已合班；新确认只走自动生成。
- [周学时四舍五入与 Teaching Load 合计不一致] → 确认函用均摊展示；Load 保持原合计逻辑，必要时在 tip 区分。
- [Combined class 仅「本课有标记」可能在半解除后短暂不准] → 解除须清掉同组所有 section 标记（沿用现解除逻辑）。

## Migration Plan

1. 改共同授课设置 UI 与 `confirmSharedTeachingSetup`（自动写入标记）。
2. 改确认行构建与三处表头/列。
3. 更新演示数据（含合班、变周学时、单双周）。
4. 手测：设置合班 → 确认表 Combined class=Y；均摊周学时；计划人数列。

回滚：恢复手填码 UI 与旧 `getSectionCapacityLimit` / 起止周展示（git revert 本 change）。

## Open Questions

- 表头中英混排：参考图为英文列名；现网多为中文。实现时管理端/教师端统一为「参考图英文列名 + 必要时中文括号」还是「中文主文案」？**默认**：关键列用参考语义中文（学生数量、授课周数、周学时、是否合班），Coordinator / Co-teaching Staff 保持英文专名。
- Service / NA 类非数字周学时：若原型无数据源，首版仅支持数值均摊，特殊文案留后续。
