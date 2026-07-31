## Context

开课安排编辑抽屉（`#drawer-major-offering-edit`）已有教室信息区块 `#mos-edit-classroom-section`：四种学时 × 教室属性 × 参考教室偏好，落在 section 的 `specialClassroomRequirements` / `classroomHourAttributes` / `classroomHourReferences`。Support 学院落在 section 的 `supportUnits`，经「申请/管理 Support」维护。

校选课程管理（`school-elective-courses`）提供「从课程库挑选进维护清单」的既有交互模式；特殊课程设置应对齐该模式，但字段不同（教室默认 + Support 默认），且**不是**全库强制配置。

用户明确：开课安排里教室默认的可编辑面就是 `mos-edit-classroom-section`；课号级配置负责默认带出，减少每学期重复填写。

## Goals / Non-Goals

**Goals:**

- 「开课设置」下可维护特殊课程清单（手动从课程库添加/删除）
- 清单项可编辑：四学时教室属性与偏好、默认 Support 学院
- 专业开课安排按课号读取默认并写入 section（教室进 `mos-edit-classroom-section` 对应字段；Support 进 `supportUnits`），允许按班覆盖
- 提供统一查询 API（按 course code），供通识等后续开课复用

**Non-Goals:**

- 未入库课号禁止开课
- 改排课冲突/教室分配算法
- 通识选修、特殊开课抽屉 UI 同批改造（只保证数据源可复用）
- 替换校选课程管理或课程库本身

## Decisions

### 1. 菜单与页面命名

- **选择**：侧栏文案 **「特殊课程设置」**；`data-page="special-course-settings"`；页面 id `page-special-course-settings`。
- **备选**：「课号默认配置」— 否决，与用户表述不一致。
- **备选**：挂在「特殊开课」下 — 否决，用户明确挂「开课设置」，且特殊开课侧栏当前已隐藏。

### 2. 数据模型（课号级 store）

- **选择**：内存 + localStorage 清单，键为课程代码（规范化大写），行结构示意：

```js
{
  id, code, name, credits, offeringUnit,
  classroomHourRequirements: [ // 同 normalizeClassroomHourRequirements
    { hourType, attribute, referenceClassrooms }
  ],
  supportUnits: [departmentCode, ...], // 默认 Support 学院，可多选
  updatedAt
}
```

- 复用既有 `normalizeClassroomHourRequirements` / `CLASSROOM_ATTRIBUTE_OPTIONS` / 学院代码列表，避免第二套教室语义。
- **备选**：直接改课程库主数据 — 否决，原型课程库为共享只读源；特殊配置应是可空叠加层。

### 3. 维护 UI

- **选择**：列表页（代码、名称、开课单位、教室摘要、Support 摘要、操作）+「添加课程」（课程库多选）+「编辑」抽屉/弹窗。
- 编辑区：教室四行控件**复用**开课安排教室行渲染逻辑（或抽公共 `renderClassroomHourAttrRows`）；Support 用学院多选（对齐 Support 管理可选学院源）。
- 新建入库时教室默认全「普通教室 / 无偏好」，Support 默认空；用户保存后再成为有效默认。
- **备选**：仅表格行内编辑 — 否决，四学时 + Support 字段过多。

### 4. 下游默认初始化时机（专业开课）

- **选择**：
  1. **生成/创建教学班**时：若课号有配置，将 `classroomHourRequirements` 与 `supportUnits` 拷贝到 section（深拷贝，之后与课号配置解耦）。
  2. **打开修改抽屉**时：若 section 仍为「系统默认教室」（全普通 + 无偏好）且课号有配置，可再应用一次教室默认（避免历史班被静默覆盖）；若 section 已有非默认教室或用户改过，**不**覆盖。
  3. Support：仅当 `supportUnits` 为空且课号有默认时带出；已有值不覆盖。
- 教室可编辑面：**仅** `#mos-edit-classroom-section`（与现网一致）；其它开课安排字段不因本 change 放开。
- **备选**：每次打开抽屉强制同步课号配置 — 否决，会冲掉班级覆盖。
- **备选**：课号配置变更后批量回写已有班 — 否决，本阶段不做；提示「仅影响此后新建/仍为默认的班」。

### 5. 同批范围：菜单页 + 专业开课默认

- **选择**：同一 change 内完成维护页与专业开课默认带出；通识等只暴露 `getSpecialCourseDefaults(code)`，UI 接线列入后续。
- **备选**：仅做页面、下游另开 change — 否决，用户目标就是减少开课重复设置，无默认带出则价值不足。

### 6. 演示数据

- **选择**：种子 2～3 门课（如需计算机教室的实践课 + 明确 Support 学院的课），便于开课安排抽屉对照验证。

## Risks / Trade-offs

- [课号配置变更不回写已覆盖班] → 文案说明「默认仅用于新建或仍为系统默认的班」；必要时后续加「同步到未改班」。
- [与校选清单混淆] → 导航分列「校选课程管理」与「特殊课程设置」；页头说明用途。
- [教室控件双份实现漂移] → 抽公共渲染/读写，开课抽屉与特殊设置共用。
- [Support 学院代码与开课单位不一致] → 选择器排除或弱提示「一般不同于开课单位」，不硬拦。

## Migration Plan

- 无历史课号默认表；上线即空清单 + 演示种子。
- 既有 section 教室/Support 数据不变；仅新逻辑在「空/默认」时填充。
- 回滚：隐藏导航项、停止 `applySpecialCourseDefaultsToSection` 调用即可。

## Open Questions

- Support 默认是否允许多学院？（提案按可多选，与 section `supportUnits` 数组一致；若业务只要单学院可再收窄 UI。）
- 通识开课编辑抽屉是否尽快复用同一默认？（本 change 不阻塞，建议下一小步。）
