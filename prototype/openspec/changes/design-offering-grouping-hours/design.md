# 开课管理 · 合分班 / 小组 / 学时分配 方案设计

> 基于旧 XMUM Online 教务系统参考视频（`开课参考视频/正常.mp4`、`合班.mp4`、`分班.mp4`、`合分班.mp4`）与当前原型代码梳理。  
> 角色视角：教务系统资深产品经理 + 领域建模。

---

## 1. 旧系统怎么做（视频还原）

### 1.1 数据粒度与主流程

```
执行计划已锁定
      │
      ▼
生成「专业开课计划」── 1 行 = 1 专业批次 × 1 课程号
      │
      ▼
合分班操作（4 种类型）── 决定生成几个「课程班 / 小组」
      │
      ▼
进入「课程班」模块 ── 维护学生 / 教师 / 地点 / 周次
```

| 层级 | 旧系统叫法 | 含义 |
|------|-----------|------|
| L0 | 开课计划行 | 某专业某批次对某门课的开课需求 |
| L1 | 课程班（合班后） | 实际上课单元，可含多个专业批次 |
| L2 | Group 1/2/3… | 分班后在**同一课程班下**拆出的子组 |

### 1.2 四种合分班类型（`专业开课计划 - 合分班` 页）

下拉 **类型** 四选一：

| 类型 | 旧系统行为 | 容量规则（视频文案） |
|------|-----------|---------------------|
| **正常** | 1 计划行 → 1 课程班，不拆组 | 合分组容量 = 开课计划容量，不用输入 |
| **合班** | 多计划行（多批次）→ 1 课程班 | 课程班容量 = 所选计划行容量之和；须勾选 ≥2 行 |
| **分班** | 1 计划行 → N 个 Group | 各 Group 容量之和 = 计划容量；可勾选「人数平均分配」 |
| **合分班** | 多计划行 → 1 课程班 → 再拆 N 个 Group | 先合（容量相加），再分（子组容量之和 = 合并后总容量） |

**合班前提（视频红字）** — 与当前原型 `isMergeCompatibleSection` 一致，旧系统额外要求容量 > 0：

- 课程 ID（课程号）相同
- 周学时相同（旧系统编辑页有「理论/辅导/实践/其他」分项，列表展示「计划学时」合计 60）
- 起止周相同
- 教学周数相同
- 计划学时相同

### 1.3 计划行上的学时定义（编辑专业开课计划）

在合分班**之前**，每行计划可在编辑页维护：

| 字段 | 示例 (CME111) | 对应新系统 L/T/P/O |
|------|--------------|-------------------|
| 理论学时 | 24 | **L** Lecture |
| 辅导学时 | 24 | **T** Tutorial |
| 实践学时 | 12 | **P** Practical |
| 其他学时 | 0 | **O** Others |
| 起止周 | 1–14 | teachingWeeks = 14 |
| 计划学时（合计） | 60 | L+T+P+O |

**要点**：学时**配额**定义在「专业批次 × 课程」计划行上；合班时要求各行列量一致，合并后仍是一套 L/T/P/O。

### 1.4 合班后 → 课程班列表

合班完成后，专业开课列表 **合分班状态 = 合班**，可点「编辑」再调整。

课程班模块（`设置 → 课程班`）出现**主行 + 子 Group 行**结构：

```
Analytical Chemistry for Engineers          ← 主课程班（合班后）
  ├─ … (Group 1)                            ← 分班/合分班产生
  ├─ … (Group 2)
  └─ … (Group 3)
```

视频中的关键现象：

| 字段 | 主课程班 | Group 1/2/3 |
|------|---------|-------------|
| 计划学时 | 60 | 60（复制） |
| 排课学时 | **80** | **0** |
| 容量 | 25（合班总容量） | 各 6 或 10 |
| 人数 | 23 | 0（待分配） |
| 任课教师 | Wong Ka Lun, Lai Sin Yuan | **空** |

**解读（旧系统隐含规则）**：

1. **Group 是容量/学生分流容器**，不是独立课程实例；主行承载「对外的课程班身份」。
2. **排课学时集中在主行**，Group 行排课学时为 0 → 排课/scheduling 很可能以**主课程班**为调度单元，Group 仅用于 Tutorial/Lab 分池。
3. **教师显示在主行**；Group 行的教师、学时要在「编辑」子界面配置（视频未完整展示，但原型有「指定教师学时分组」Tab）。

### 1.5 分组与学时（原型与旧系统命名对照）

旧系统「课程班」下再拆 Group；原型 `#modal-offering-grouping` 已实现类似概念：

- 左侧：**分组信息**（添加分组 / 按行政班分组）
- 右侧 Tab：**指定教师学时分组**（非「指定学生名单分组」）
- 每条 `groupAssignment`：组别、学时类型、起止周、学时、教师、角色、**是否合并学时**

**合并学时**（原型 tooltip）：开启后排课不区分授课方式，只按总学时排课。

---

## 2. 旧系统的核心问题（为何需要新方案）

```
┌─────────────────────────────────────────────────────────────┐
│  旧系统：三层名称混用                                        │
│  「课程班」「Group」「合分班状态」都出现在不同菜单              │
│  排课学时只在主行，Group 行为 0 → 分组排课规则不透明           │
│  L/T/P/O 在计划行定义，但投递到 Group/Teacher 的路径未显式建模  │
└─────────────────────────────────────────────────────────────┘
```

1. **学时挂在哪里不清晰**：计划行有 L/T/P/O 分项，课程班有「计划学时/排课学时」，Group 又有「指定教师学时分组」— 缺少统一的「投递」实体。
2. **共上 vs 分组上**：Lecture 通常 Section 共上，Tutorial/Practical 按 Group — 旧系统靠人工经验，系统不校验「L 是否只配 Section 级一条」。
3. **合班与分组顺序**：合分班 = 先合后分，但 Group 与「合进来的批次」的对应关系（哪些批次进 Group1）需靠学生名单二次分配。
4. **教师工作量**：主行显示教师，Group 行为空 → 教师总学时可能 double count 或漏算。

---

## 3. 新系统推荐方案

### 3.1 四层实体模型

```
OfferingLine          Section              Group                 HourDelivery
(计划行)              (教学班)             (教学小组)            (学时投递)
─────────────────────────────────────────────────────────────────────────
专业+批次+课程号  →   合分班产物      →   容量拆分单元     →   谁、哪种学时、
L/T/P/O 配额          含 1..n Line      含 0..m Group         投给谁、哪几周
```

| 实体 | 标识 | 生命周期 |
|------|------|---------|
| **OfferingLine** | `lineId` | 生成计划时创建；合班后仍保留溯源，指向同一 Section |
| **Section** | `sectionId` | 合分班操作的直接产物；对应旧「课程班主行」 |
| **Group** | `groupId` | 可选；`section.groups[]`；分班/合分班时创建 |
| **HourDelivery** | `deliveryId` | 教师学时安排的最小排课单元 |

### 3.2 学时：两层分离

**A. 课程基准配额 `HourBudget`（挂在 Section）**

来自计划行（合班时各 Line 须一致），合并后存 Section：

```yaml
section.hourBudget:
  lecture: 24      # L
  tutorial: 24     # T
  practical: 12    # P
  other: 0         # O
  total: 60
  weekRange: "1-14"
  teachingWeeks: 14
  planWeeklyHours: credits  # 计划周学时（仅供参考）= 学分
```

**B. 学时投递 `HourDelivery`（挂在 Section 或 Group）**

```yaml
hourDelivery:
  id: "hd-001"
  sectionId: "sec-1"
  groupId: null              # null = Section 级共上；有值 = 该 Group 独上
  teacherAssignmentId: "ta-1"
  hourTypes: ["Lecture"]     # 可多选 L/T/P/O
  hours: 24                  # 本次投递学时数
  weekRange: "1-14"
  mergeHours: false          # true = 排课合并，不区分 L/T/P
  deliveryScope: "section"   # section | group （冗余便于查询）
```

**规则**：

| 学时类型 | 默认投递范围 | 说明 |
|---------|-------------|------|
| **L** Lecture | `section` | 全体合班学生一起上 |
| **T** Tutorial | `group` | 按小组拆；每 Group 各配 T 学时 |
| **P** Practical | `group` | 实验/实践按组 |
| **O** Others | `section` 或 `group` | 按校情配置默认 |

**校验**：

- 同一 `(hourType, scope)` 下，所有 Delivery 的 `hours` 之和 = `hourBudget[type]`（Group 级则 **每 Group** 各配满 T/P，或按「合并学时」特殊处理）
- Section 级 L 只允许 1 条或合并为 1 条（mergeHours=true）
- 每个 Delivery 必须关联 TeacherAssignment

### 3.3 合分班 → Group 生成规则

```
                    ┌──────────────┐
     Line A ────────│              │
     Line B ──合班──▶│   Section    │──分班(N)──▶ Group 1..N
     Line C ────────│              │
                    └──────────────┘
```

| 操作 | 输入 | 输出 |
|------|------|------|
| 正常 | 1 Line | 1 Section，0 Group（或 1 默认 Group = 全班） |
| 合班 | ≥2 Line（兼容校验） | 1 Section，`lineIds=[...]` |
| 分班 | 1 Line，N=3 | 1 Section + 3 Groups，容量和 = 计划容量 |
| 合分班 | ≥2 Line，N=2 | 1 Section（合并容量）+ 2 Groups |

**Group 命名**：`{课程名} (Group {n})` 或 `{行政班简称}` — 与旧系统一致。

**学生归属**：

- 学生名单挂在 **Section**；`student.groupIds[]` 指向 Group
- 合班后按 `lineId` 溯源批次；再划入 Group（按行政班 / 手动）

### 3.4 教师与学时的关系（回答「挂 Group 还是挂 Teacher」）

**结论：学时投递挂在「TeacherAssignment + DeliveryScope」，而非单纯挂 Group 或 Teacher。**

```
Section
  ├── TeacherAssignment (肖云, 主讲, Coordinator?)
  │     └── HourDelivery[]   ← 可以有多条（不同 L/T/P/O、不同 scope）
  ├── TeacherAssignment (Dr. Tan, 助教)
  │     └── HourDelivery[]
  └── Group[]
        └── （Group 不直接挂教师；通过 HourDelivery.groupId 关联）
```

| 场景 | 配置方式 |
|------|---------|
| Lecture 全体合班 | 1 条 Delivery：`scope=section`, `hourTypes=[Lecture]`, 主讲教师 |
| Tutorial 每组不同助教 | 每 Group 1 条 Delivery：`scope=group`, `hourTypes=[Tutorial]`, 各组助教 |
| 同一教师带多个 Group 的 Lab | 多条 Delivery 同 teacher，不同 `groupId` |
| 合并排课 | `mergeHours=true`，排课模块按总学时块处理 |

旧系统「指定教师学时分组」Tab = 新系统的 **HourDelivery 列表**（原型 `groupAssignments` 应重命名/重构为 `hourDeliveries`）。

### 3.5 UI 映射（新系统页面结构）

```
专业开课列表
  ├─ 修改教学任务（Section 基础信息 + HourBudget 只读）
  ├─ 合分班（抽屉：待合并批次 ↔ 已合并批次）
  ├─ 分组（Groups CRUD + 学生归属）
  ├─ 安排老师（TeacherAssignment 列表）
  │     └─ 学时安排（HourDelivery 编辑，选 scope + L/T/P/O + mergeHours）
  └─ 学生名单（按 Group 筛选）
```

### 3.6 与排课模块的接口

排课消费 `HourDelivery` 而非 Section 总行：

| deliveryScope | 排课单元 | 学生集合 |
|--------------|---------|---------|
| `section` | Section 全体 | 所有 lineIds 合班学生 |
| `group` | 单个 Group | 该 Group 下学生 |

`mergeHours=true` → 排课引擎将多条 L/T/P 合并为一个 time block 需求。

---

## 4. 场景走查（CME111 示例）

**初始**：CME 专业，批次 202509 / 202602 / 202604 各一行，均为 CME111，L24/T24/P12，60 学时，容量 10。

**合分班（选 202602+202604，分 2 组）**：

1. Section 容量 = 20，hourBudget 不变
2. Group1 容量 10，Group2 容量 10
3. HourDelivery 建议模板：
   - D1: L24, section, 主讲 A
   - D2: T24, group=G1, 助教 B
   - D3: T24, group=G2, 助教 C
   - D4: P12, group=G1, 讲师 D
   - D5: P12, group=G2, 讲师 E

**校验**：T 投递 2 条 × 24h = 48 ≠ budget 24 → **应改为每 Group T12** 或 budget 定义为「每组 T12、共 24」— 需在 spec 明确：

> **推荐**：HourBudget 的 T/P 表示 **Section 总量**；Group 级 Delivery 按 Group 数**均分**或**显式分配**子量，总和 = Budget。

---

## 5. 数据模型（JSON 草案）

```json
{
  "section": {
    "id": "sec-1",
    "code": "CME111",
    "lineIds": ["line-202602", "line-202604"],
    "hourBudget": { "lecture": 24, "tutorial": 24, "practical": 12, "other": 0 },
    "groups": [
      { "id": "g1", "name": "Group 1", "capacity": 10, "studentCount": 0 },
      { "id": "g2", "name": "Group 2", "capacity": 10, "studentCount": 0 }
    ],
    "teacherAssignments": [
      {
        "id": "ta-1",
        "staffId": "2001180023",
        "name": "Prof. Lim",
        "role": "主讲",
        "hourDeliveries": [
          { "id": "hd-1", "hourTypes": ["Lecture"], "hours": 24, "scope": "section", "groupId": null, "weekRange": "1-14", "mergeHours": false }
        ]
      }
    ]
  }
}
```

---

## 6. Goals / Non-Goals

**Goals:**

- 统一计划行 / 教学班 / 小组 / 学时投递语义
- 支持多专业批次合班 + 组内拆分 + L/T/P/O 分投递
- 可校验、可对接排课

**Non-Goals（本期）:**

- 自动排课算法
- 通识选修课的选课池合班（可复用 Section 模型，规则另 spec）
- 重修/补修「其他开课」的特殊学时规则

---

## 7. Decisions

| # | 决策 | 理由 | 备选（未选） |
|---|------|------|-------------|
| D1 | 学时「配额」与「投递」分离 | 避免 Group 行复制 60 学时导致 double count | 学时只存 Group（旧系统部分界面） |
| D2 | Delivery 挂 TeacherAssignment | 支持同一 Group 多教师、同一教师多 Group | 学时只挂 Group |
| D3 | Group 为可选子实体 | 正常开课可无 Group；T/P 需要时再建 | 强制每 Section 至少 1 Group |
| D4 | 合班校验含 L/T/P/O 分项 | 防止合班后学时预算冲突 | 仅校验 totalHours |
| D5 | mergeHours 在 Delivery 级 | 与原型一致，仅影响排课粒度 | Section 级全局开关 |

---

## 8. Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| T/P 总量 vs 每组分量语义混淆 | UI 明确「Section 总预算 / 每组分配」两列；保存时校验 |
| 旧数据迁移无 Group | 默认创建 1 个「Whole Class」Group |
| 用户学习成本 | 合分班抽屉保留；分组与学时分步向导 |

---

## 9. Open Questions

1. T/P 的 HourBudget 是 **Section 总量** 还是 **每组定额**？（建议：Section 总量，Group Delivery 求和校验）
2. 合班后不同批次学生是否必须进 Group，还是可暂留「未分组」？
3. 「排课学时 80 vs 计划 60」在旧系统的计算口径是否需在新系统保留为「标准学时/工作量」字段？

---

## 10. 附录：旧系统 vs 新系统对照

| 维度 | 旧 XMUM Online | 新系统建议 |
|------|---------------|-----------|
| 最小计划单位 | 专业开课计划行 | OfferingLine（同） |
| 合班产物 | 课程班主行 | Section |
| 分班产物 | Group 1/2/3 子行 | Group 实体 |
| L/T/P/O 定义处 | 编辑计划行 | Section.hourBudget |
| 教师学时 | 主行教师 + 「指定教师学时分组」 | TeacherAssignment + HourDelivery |
| 共上/分组 | 隐含 | deliveryScope: section / group |
| 排课学时 | 主行 80 / Group 0 | 由 HourDelivery 汇总 |
