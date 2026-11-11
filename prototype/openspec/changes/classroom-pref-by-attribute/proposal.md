# Proposal

## Why

开课环节「教室偏好」目前不论场地类型一律多选具体教室号。业务上普通教室不应点选教室号，只需设施类 remark；计算机教室/专业教室才选具体偏好教室。规则需在开课分组安排、课程信息（教学任务教室区）、特殊课程设置三处对齐，避免入口行为不一致。

## What Changes

- **按场地类型分叉「教室偏好」交互**（列名仍为「教室偏好」）：
  - **计算机教室 / 专业教室**：保持可多选具体偏好教室（教室号列表）。
  - **普通教室**：禁止选具体教室；改为设施 remark **多选**下拉；可勾选 **Others**，勾选后出现文字录入，**非必填、可为空**。
- **切换场地类型时清空**已选偏好（教室号或 remark / Others 文本一并清空）。
- **只读展示先按中文**：普通教室已选 remark 以中文标签展示（英文源文作数据 value；中文文案见 design）。
- **同步入口**（同批）：
  1. 开课分组工作台 · 安排草稿行（场地类型 + 教室偏好）
  2. 课程信息 / 教学任务编辑 · 学时行教室区（`教室偏好`）
  3. 特殊课程设置 · 课号级四学时教室默认
- 排课计划等只读列表：普通教室偏好按中文标签展示；不改列名。

## Capabilities

### New Capabilities

- `classroom-pref-by-attribute`: 按场地类型分支的教室偏好（普通教室 = remark 多选 + 可选 Others 文本；计算机/专业 = 具体教室多选），以及三入口行为与切换清空规则

### Modified Capabilities

- （无）`openspec/specs/` 下暂无已归档主规格需改写

## Impact

- `app.js`：`CLASSROOM_ATTRIBUTE_OPTIONS` 相关偏好渲染/收集；`buildReferenceClassroomMultiselectHtml` / `renderClassroomHourAttrList`；开课分组草稿 `renderOfferingGroupStatusDraftClassroomPreferenceCell`；特殊课程设置教室默认读写；保存/展示格式化
- `styles.css`：普通教室 remark 下拉、Others 输入行样式（尽量复用 clo-multiselect）
- `index.html`：若特殊课程设置/课程信息区有写死文案可微调（原则上以 JS 渲染为主）
- 数据：普通教室偏好不再存教室号，改为 remark 选项 value + 可选 Others 自由文本；切换属性清空
- 非目标：改排课算法/教室冲突；改场地类型枚举本身；本批不升版正式 PRD docx（可在实现后另开文档任务）；英文界面切换（本批只读/编辑展示中文）
