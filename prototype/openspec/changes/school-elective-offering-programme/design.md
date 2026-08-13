## Context

- 见 `proposal.md` Why / What Changes。
- **已知**：校选列表由 `renderSchoolElectiveCourseTableHeader` / `renderSchoolElectiveCoursePage` 渲染；ME 初始化在 `buildSchoolElectiveDefaultProgrammeScope`；专业主数据为 `PROGRAMME_CATALOG` / `PROGRAMMES`；MAT 键为 `SCHOOL_ELECTIVE_MATH_PROGRAMME_KEY`（`mat`）。
- **假设**：开课专业存专业代码（如 `ECM`），展示用代码即可（列表列宽有限）；演示赋值在 `normalizeSchoolElectiveCourseRow` 或种子构建时一次性写入字段，避免每次渲染抖动。
- **待确认（实现期可微调、不改规格）**：G 开头课随机池是否排除 MPU、是否优先与开课单位同学院专业——默认优先同开课单位下专业，无则全目录。

## Goals / Non-Goals

**Goals:**

- 列表增加「开课专业」列与排序。
- 演示数据按课号前三位 / G 开头规则填充。
- ME 初始化按「有/无开课专业」两套规则分支。
- GE 初始化逻辑不动。

**Non-Goals:**

- 抽屉内单独「开课专业」编辑控件（本 change 以演示自动赋值 + 列表展示为主；若后续要手改可另开）。
- 真实后端接口与持久化策略。
- 专业开课「ME开课」批次选择器改造（`me-offering-from-school-elective`）。

## Decisions

1. **字段名**：行上使用 `offeringProgrammeCode`（专业代码大写，如 `ECM`）；解析/展示函数统一 `resolveSchoolElectiveOfferingProgrammeCode(row)`。
   - 备选：`homeProgramme`——未采用，与「开课单位」对称用 offering*。

2. **演示赋值时机**：在 `normalizeSchoolElectiveCourseRow` 中，若字段为空则按规则回填并写回行，保证刷新稳定。
   - 前三位：取 `code` 去 `*` 后前 3 字符 upper，与 `PROGRAMME_CATALOG[].code` 精确匹配。
   - 否则（含 `G` 开头）：用课号 hash 在候选专业列表中取模；候选优先 `schoolCode === offeringUnit` 的专业，否则全目录。

3. **ME 初始化**：
   - 有 `offeringProgrammeCode`：`eligible = unique([offeringProgrammeKey, mat])`，`excluded = []`。
   - 无：保持现逻辑（开课单位全部专业 + MAT）。

4. **列表 UI**：`renderListSortTh(..., '开课专业', 'offeringProgramme', ...)`；`colspan` +1；样式对齐 `col-offering-unit`（窄列居中 code）。

5. **修读范围查看**：若查看弹窗有「专业」摘要，无需强制新增开课专业字段；初始化提示文案更新即可。列表列是主展示面。

## Risks / Trade-offs

- [课号前缀与专业代码不一致] → 落入 G/未匹配分支随机分配；演示可接受，正式数据以后端为准。
- [已手工维护的 eligible/excluded 被「初始化」覆盖] → 与现网一致：仅点「初始化」时覆盖，不自动改已有范围。
- [开课专业与开课单位学院不一致] → 允许；ME 有开课专业时不再按单位铺开，以开课专业为准。

## Migration Plan

- 纯前端演示：刷新即生效；无持久化迁移。
- 回滚：去掉列与字段回填，ME 初始化恢复仅单位+MAT 分支。
