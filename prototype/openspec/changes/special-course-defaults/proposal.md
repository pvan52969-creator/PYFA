## Why

同一课号的「学时类型 ↔ 教室属性/偏好」与 Support 学院在多数学期很少变化，但目前每次开课安排都要在教学班上单独维护，重复劳动多、易漏设。需要在开课设置侧提供课号级默认配置，开课安排时默认带出并可按班覆盖。

## What Changes

- 在侧栏「开课设置」下新增 **「特殊课程设置」** 菜单与维护页。
- 支持从**教务课程库**手动将课程加入本维护清单（非全库自动纳入）。
- 对清单内课号维护两类默认：
  1. **教室默认**：四种学时（理论/辅导/实践/其他）各自的教室属性与参考教室偏好（结构对齐现有 `mos-edit-classroom-section`）。
  2. **Support 学院默认**：该课号通常由哪个（或哪些）学院 Support。
- **同批接入下游默认初始化（专业开课安排）**：新建/进入开课安排编辑时，若课号在特殊课程设置中有配置，则：
  - 教室信息默认填入 `#mos-edit-classroom-section`（仍可在此区块编辑覆盖）；
  - Support 学院默认带出（仍可按班通过既有 Support 管理改）。
- 通识选修等其它开课类型：本 change **预留读取课号默认的同一数据源**，UI 默认带出可列为后续任务，不阻塞专业开课落地。

## Capabilities

### New Capabilities

- `special-course-defaults`: 特殊课程设置清单、课号级教室/Support 默认维护，以及专业开课安排按课号默认初始化与可覆盖

### Modified Capabilities

- （无）`openspec/specs/` 下暂无已归档主规格需改写

## Impact

- `index.html`：开课设置导航项；特殊课程设置页；编辑抽屉/弹窗（教室四行 + Support 学院）
- `app.js` / `styles.css`：清单 store、课程库添加选择器、默认读写、专业开课抽屉教室区与 Support 初始化挂钩
- 数据：按课号持久化的默认配置（可 localStorage / 内存 store，与校选课库模式类似）；复用既有 `specialClassroomRequirements` / `supportUnits` 字段语义
- 非目标：替换校选课程管理；改排课冲突算法；强制全库课程必须先配置才能开课；通识/特殊开课全链路 UI 同批改完
