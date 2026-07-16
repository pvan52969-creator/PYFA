## Context

`#page-offering-grouping` 是分组 / 教师安排 / 学生名单维护的统一工作页，经 `openOfferingGroupingModal` → `goPage('offering-grouping')` 进入。页内已有完整顶栏（面包屑、返回、保存/保存名单）与内容区，但布局仍是：

```
┌── sidebar ──┬── main ─────────────────────┐
│ 开课导航     │ page-offering-grouping      │
└─────────────┴─────────────────────────────┘
```

侧栏仍可见，无法形成「整页接管」感。项目已有 `.app.portal-mode` 隐藏侧栏先例，可复用同一思路。

已确认产品决策：

1. **顶栏保留**现有「面包屑 + 返回 + 保存/保存名单」，不改成极简独立应用顶栏。
2. **名单管理「管理名单」**与任务安排「安排教师」共用同一套沉浸壳。

## Goals / Non-Goals

**Goals:**

- 进入 `offering-grouping` 时整屏沉浸：侧栏隐藏，`main` 全宽。
- 离开该页时恢复常规布局（侧栏可见）。
- 所有经 `openOfferingGroupingModal` 的入口（任务安排、名单管理；专业/通识/特殊）行为一致。
- 顶栏结构与现有交互（返回二次确认、保存后回列表）保持不变。

**Non-Goals:**

- 不改分组树、教师安排、学生名单、合分班等页内业务逻辑。
- 不改顶栏文案结构（不做「← 返回 + 课程标题」极简顶栏）。
- 不引入路由框架或把该页移出 `.app` DOM。
- 不做后续「大改」中的教师/分组交互重构（属后续步骤）。

## Decisions

### 1. 用 `.app` class 开关沉浸态，而非搬 DOM

- **选择**：进入时 `document.querySelector('.app').classList.add('is-offering-grouping-immersive')`；离开时 `remove`。
- **理由**：与现有 `portal-mode` 一致，改动面最小；页仍在 `main` 内，无需迁移 `#page-offering-grouping`。
- **备选**：把页面提升为 `body` 下独立 overlay → 改动大、弹层 z-index/焦点管理成本高，本步不必要。

### 2. CSS 对齐 `portal-mode` 模式

```css
.app.is-offering-grouping-immersive .sidebar { display: none; }
.app.is-offering-grouping-immersive .main { width: 100%; }
```

- 必要时微调 `#page-offering-grouping.active` 的 `min-height`（沉浸后可用接近 `100vh`，因侧栏品牌区不再挤占视觉注意力；保持现有 flex 列布局即可）。
- **不复用** `portal-mode` 类名本身，避免与门户入口语义耦合。

### 3. 生命周期挂在 `goPage`，入口统一受益

- **选择**：在 `goPage(id)` 中：
  - `id === 'offering-grouping'` → 加上沉浸 class；
  - 其他 id → 去掉沉浸 class。
- **理由**：`openOfferingGroupingModal`、`performCloseOfferingGroupingPage`、保存后回列表、侧栏误点等凡走 `goPage` 的路径自动正确；名单「管理名单」已走同一 `openOfferingGroupingModal`，无需逐入口打补丁。
- **备选**：仅在 open/close 函数里加减 class → 易漏掉直接 `goPage` 切页的路径。

### 4. 顶栏保持现状

- 面包屑由 `syncOfferingGroupingBreadcrumb` 按 `returnPage` 更新；返回 / 保存按钮逻辑不动。
- 沉浸壳只改变外围布局，不改 header markup。

### 5. 侧栏高亮

- 沉浸时侧栏不可见，但 `syncSidebarNavActive` 可继续按现逻辑维护（离开后高亮正确）。无需为沉浸态单独改导航高亮。

## Risks / Trade-offs

- **[Risk] 用户在沉浸页用浏览器前进/后退或其它非 `goPage` 入口切页，class 残留** → Mitigation：沉浸开关集中在 `goPage`；原型无真正路由，风险低。
- **[Risk] 与 `portal-mode` 同时存在时 class 冲突** → Mitigation：进入开课模块时 `goPage` 已 `remove('portal-mode')`；沉浸 class 独立，互不覆盖样式选择器。
- **[Trade-off] 沉浸后无法从侧栏跳到其它开课页** → 符合「整页工作台」预期；离开只能经「返回」或保存后回列表（及现有确认流）。

## Migration Plan

- 纯前端原型样式/脚本变更，无数据迁移。
- 回滚：去掉 immersive class 与对应 CSS 即可恢复现状。

## Open Questions

- （无）顶栏形态与名单入口范围已确认。
