## Context

See proposal.md — Why / What Changes.

原型已有：

- 教学班级级 `sharedTeachingCode`（共同授课弹窗手工绑定；排课侧可忽略组内冲突）
- 分组页 `groupAssignments` 行：周次、周学时、教师、「同时授课」（**本课内**多小组）、场地类型、教室偏好
- 特殊课程「部分合并学时」仅限**本课内**学时类型合并，不能表达跨教学班行绑定

约束：开课侧不强制同教室；排课引擎改造不在本 change；联动必须以共同授课组为前置。

## Goals / Non-Goals

**Goals:**

- 放宽 L1：同课号不同教学班可进同一共同授课组
- 新增 L2 数据与校验：周次 + 周学时一致方可绑定
- 独立联动 UI + 分组表只读「联动」列
- 变更时自动解除并提示；teaching load 同师去重（原型展示）

**Non-Goals:**

- 实现排课「同槽同教室」算法（仅预留消费联动组数据）
- 未设共同授课即可裸绑
- 改「同时授课」本课内语义
- 总学时作为绑定条件

## Decisions

### 1. 两层模型：L1 标记 + L2 联动组

- **L1** `sharedTeachingCode`：组身份与入口范围；冲突豁免仍可按组（既有）
- **L2** `sharedTeachingSlotLinks[]`：行级联动，挂学期 store（与 `COURSE_OFFERING_PLAN_BY_TERM` 同级或挂 store 根）

结构草案：

```
sharedTeachingSlotLink {
  linkId,                 // 展示用序号可派生
  sharedTeachingCode,
  termCode,
  items: [{ sectionId, assignmentId }]
}
```

- 同一 `assignmentId` 最多属于一个 link
- 一组 ≥2 个 items，可跨 section；课号可同可异

**替代方案**：把 linkId 写进每条 `groupAssignment` → 跨课对称更新易漏；选独立数组便于整组解除与列表。

### 2. 绑定校验只比周次、周学时

- 比较规范化后的 `weekRange` 与数值 `weeklyHours`
- 不一致：禁用「建立联动」+ 明确文案（周次不一致 / 周学时不一致）
- 场地类型、教室偏好、教师、总学时：**不参与**绑定校验

### 3. L1 校验调整

- `validateSharedTeachingSetupTeacherRule`：去掉「须不同课号」；改为至少 2 个 **section**（教学班）
- `getSectionSharedTeachingPeerCourseCodes`：同课号不同班仍可展示同伴（展示改为「课号 + 教学班标识」或保留课号列表并允许重复课号语义在列表层用班名区分）——实现时 peer 展示以 section 维度摘要为准，避免只按课号去重导致同号多班看不见

### 4. UI：独立联动页 + 分组表只读

- **联动排课安排**：modal-xl / 抽屉；共同授课组内各 section 安排表对照；多选 →「建立联动」；底部已建组可解除
- **入口**：共同授课弹窗「管理联动安排」；分组页安排表旁「联动排课安排」（无 L1 则隐藏或禁用并说明）
- **分组表「联动」列**：`🔗 #n` + tip（组内各课/班/行摘要）；与「同时授课」列区分

**替代方案**：仅在分组页内嵌跨课操作 → 单课 immersive 难对照；否决。

### 5. 自动解除

监听：保存安排行（周次/周学时变更）、删除行、移除共同授课标记（整组 L2 清空）

- 解除后 toast / banner：「联动组 #n 已自动解除（原因：…）」
- 不静默

### 6. Teaching load

- 同 link 内同一 `staffId`：负荷/确认展示合并为一次（可复用或扩展 Combined 文案为「联动组 #n」）
- 精确计分规则若与现 Combined 冲突，原型优先「同师同 link 去重」

## Risks / Trade-offs

- [assignment 无稳定 id] → 写入/编辑时确保每行有稳定 `id`；迁移旧数据补 id  
- [同课号 peer 展示去重丢失班信息] → peer/联动 tip 必须带教学班或 section 标识  
- [用户以为联动=已排同教室] → 联动页与 tip 文案写明「排课阶段同时间同教室；开课不强制教室」  
- [L1 放宽后误绑同课号] → 仍要求共同教师；联动另有周次周学时门槛  

## Migration Plan

- 存量仅有 L1、无 L2：行为兼容，联动列为空
- 放宽课号规则：仅影响新建/编辑共同授课校验，不自动改历史组
- 回滚：隐藏联动入口与列；忽略 `sharedTeachingSlotLinks` 即可

## Open Questions

- （无）业务规则已由产品确认；排课消费细节留后续 change
