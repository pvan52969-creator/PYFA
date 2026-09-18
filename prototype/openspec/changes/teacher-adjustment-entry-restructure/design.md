## Context

现状见 proposal.md Why。实现上已有：

- `#page-adjustment-teacher`：调/停/补 三个发起按钮 + 列表（排除 addclass）
- `#page-adjustment-teacher-addclass`：独立加课页
- `openAdjustmentApplyModal(type)`：`makeup` 左侧已是「选择停课记录」（`getAdjustmentCancelledSlots`，仅 `cancel` 且 `approved` 且未被补课占用）
- 公假日页 `#adjustment-holiday-tabs` + `.tab-panel` 可作 Tab 壳参考

教师端审批状态五种（流程中/通过/不通过/驳回/已撤销）保持不变。

## Goals / Non-Goals

**Goals:**

- 教师入口与列表按 Tab/菜单切开，说明文案按 Tab 隔离
- 补课主路径：列表勾选停课课节 → Apply → 已带入节次的补课抽屉
- 复用现有申请抽屉与 `ADJUSTMENT_TYPE_META`，不改类型数据模型

**Non-Goals:**

- 不改排时间 / 排教室
- 不改教务代申请、审批、申请记录、公假日停课的菜单结构
- 不改补课抽屉内「从停课继承原因」等已有规则
- 不做 Public Holiday 免审的审批引擎（说明文案即可；系统免审仍只存在公假日停课批量路径）

## Decisions

### 1. 页面 ID：调课页加 Tab；加课页改为补课页

- `#page-adjustment-teacher` 保留，内嵌 Class Replacement / Class Addition（同公假日 `tab-bar` + `tab-panel.active`）。
- 侧栏 `data-page="adjustment-teacher-addclass"` **改为** `adjustment-teacher-makeup`；页面 id `#page-adjustment-teacher-makeup`。旧加课页 DOM 迁到调课页的 Addition 面板，避免两个菜单抢同一套加课筛选 id。

备选：保留 addclass 的 page id 只改文案。否决：菜单语义与 id 长期相反，后续易改错。

### 2. Tab 状态与列表过滤

`adjustmentTeacherPageTab = 'replacement' | 'addition'`。

| Tab | 列表 `type` | 发起按钮 |
|---|---|---|
| replacement | `reschedule`、`cancel` | 发起调课、发起停课 |
| addition | `addclass` | 发起加课 |

筛选：Replacement 保留学年学期 / 调课类型（仅调课、停课）/ 审批状态；Addition 学年学期 + 审批状态（两条件，无折叠三角）。布局仍遵守一行最多 3 条件。

### 3. 说明板块

Tab 下方、查询卡上方放 `.adj-teacher-intro`（或同等 class）：标题 + 正文 + 附注。文案用 spec 中的英文，写在 HTML 里，随 Tab 显隐，不靠改时间页模板。

### 4. 补课页：停课课节主表 + 我的补课申请

上：当前教师已通过、未被补课占用的停课课节（`getAdjustmentCancelledSlots`），含勾选列。操作栏 **Apply**、**New Replacement**。

- Apply：无勾选 → 提示后 return；有勾选 → `openAdjustmentApplyModal('makeup')` 并预勾选 `adjustmentSelectedSlotVals` / 批次选中集。
- New Replacement：`openAdjustmentApplyModal('reschedule')`（`fromCancel` 为 false 的已排节次）。

下：本教师 `type === 'makeup'` 申请列表（沿用教师状态徽章），避免补课单提交后无处可查。

备选：补课页只做停课勾选、不展示申请。否决：教师无法看补课审批状态。

### 5. 演示数据

教师 demo 里的 makeup 行只出现在补课页下表；addclass 行只出现在 Addition Tab。Replacement 表不再混入这两类。

## Risks / Trade-offs

- [书签/脚本仍指向 `adjustment-teacher-addclass`] → `goPage` 对旧 id 映射到 makeup 页，或保留隐藏 section 转发一次。
- [Apply 预勾选与抽屉左侧再筛会不同步] → 打开后先写入选中集再 `renderAdjustmentSlotPickerRows`。
- [New Replacement 放在补课页可能被理解成补课] → 按钮英文按需求保留，中文可用 title/副文案标明「调课（非停课记录）」。

## Migration Plan

原型无持久化。改 HTML/JS 后刷新即可。回滚即还原两个旧页面与三个发起按钮。

## Open Questions

- 补课页 Apply / New Replacement 是否同时显示中文（如「申请补课」「发起调课」）。实现时按钮主文案按需求用英文，可用 subtitle 补中文，不挡规格。
