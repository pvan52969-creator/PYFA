## Context

- 页面 `page-course-ge-offering-quota` 上段为开课需求，下段为「各学院配额」：`GE_OFFERING_QUOTA_BY_TERM[term].colleges[] = { schoolCode, minGroups }`，已开按开课单位统计。
- 通识开课「生效」会调用按学院短差拦截（如 `collectGeOfferingQuotaShortfallsForSections`）。
- 课号 ↔ Field 已有推断：`G01/G1x→arts`、`G02/G2x→business`、`G03/G3x→science`，其余可归 **G04（不限/其它）**；与校选 `geCategory` 同一套关系。
- 干系人：教务统筹（填类型配额）、学院开课（按类型达标开课）。

## Goals / Non-Goals

**Goals:**

- 配额表改为固定四行：G01 / G02 / G03 / G04。
- 列：类型、需开课程班/组数、需开·2学分、需开·3学分、已开、进度。
- 需开由教务手工编辑并保存；需求看板不写回配额。
- 已开按类型（课号前缀或等价 geCategory）统计当前学期通识开课组数；进度按类型达标。
- 提交/生效校验改为按 G 类型；去掉学院维度配额拦截。
- 卡片标题改为「类型配额」；开课页内嵌配额摘要同步按类型。

**Non-Goals:**

- 不从开课需求人次自动计算需开数（无班额换算公式）。
- 不改开课需求拆分算法、选课应用、任务安排/名单。
- 不引入按学院再拆类型的二级配额。

## Decisions

### 1. 数据模型：按学期存 types[]

```text
GE_OFFERING_QUOTA_BY_TERM[termCode] = {
  termCode,
  types: [
    { typeCode: 'G01', minGroups2: number, minGroups3: number },
    ... G02 G03 G04
  ]
  // 无 mockVersion 表示用户已保存，不覆盖
}
```

- **需开课程班/组数** = `minGroups2 + minGroups3`（展示用合计，不单独持久化，避免三字段互相打架）。
- 可编辑字段仅为 需开·2学分、需开·3学分。
- **替代方案**：合计也可编辑、再反拆 2/3 → 拒绝，缺拆分规则。

### 2. 类型解析：统一 helper

- 新增 `resolveGeOfferingTypeCode(courseOrSection)`：
  - 优先课号：`G01*` / `G1\d*` → G01；`G02*` / `G2\d*` → G02；`G03*` / `G3\d*` → G03；否则 **G04**。
  - 若无可靠课号但有 `geCategory`：arts→G01、business→G02、science→G03、unrestricted/其它→G04。
- 已开统计：当前学期 `offeringType==='ge'` 的 section，按类型累加**小组数**（与现「已开课程班/小组数」口径一致：用现有组数统计函数，按类型聚合，不再按开课单位）。
- 「已开」列展示类型合计（不拆 2/3）；进度：`actualTotal >= minGroups2 + minGroups3` 为已达标，否则显示差 N 组。  
  - 已知简化：不强制「2 学分已开 ≥ 需开·2」与「3 学分已开 ≥ 需开·3」分别达标；若产品后续要求分学分达标，再加两列已开或分项进度。

### 3. 校验：按本次生效涉及的类型

- 收集拟生效 sections → 映射为 typeCode 集合 → 对这些类型查短差；存在短差则拦截并提示类型与差额。
- 不校验未涉及的类型。
- **替代方案**：全学期四类型都必须达标才允许任意生效 → 过严，拒绝。

### 4. 迁移与兼容

- `ensureGeOfferingQuota`：若缓存仍是 `colleges` 或缺 `types`，重建默认 `types`（演示可给少量 mock 需开）；用户已保存的新结构（无 mockVersion）不覆盖。
- 删除/停用学院进度与学院短差 API 的调用点；保留旧函数可标废弃，避免其它页面误用。

### 5. UI

- `index.html`：卡片标题「类型配额」；hint 保留「需开为下限；可超额」；表头换列；tbody id 可改为 `ge-offering-quota-type-body`。
- 保存按钮文案可仍为「保存计划」。
- 通识开课页配额摘要表：学院列 → 类型列。

## Risks / Trade-offs

- [已开不拆 2/3] → 教务可能无法从进度列看出学分结构缺口；缓解：进度按总需开，需求卡仍可对照；后续可加分学分已开列。
- [G04 兜底过宽] → 非 G01–G03 前缀课都进 G04；缓解：与「不限/其它」一致，文档写清。
- [旧学院配额本地缓存] → 刷新后被类型结构替换；缓解：原型数据可接受，保存后以 types 为准。

## Migration Plan

1. 上线类型模型与 UI。
2. 切换校验与摘要。
3. 演示数据默认四行 types。
4. 回滚：恢复 colleges 表与学院短差（git revert 本 change 实现）。

## Open Questions

- 「已开」是否后续要拆成已开·2 / 已开·3 并分项达标？（当前按总组数达标，已写入 Decisions 简化）
- G04 展示名是否需要副标「不限」？（实现时可 `G04` + 次要文案）
