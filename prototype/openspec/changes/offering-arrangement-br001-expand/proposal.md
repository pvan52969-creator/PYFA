## Why

《开课安排》BR001 仍写「完整度不足不可生效；判定以原型校验提示为准」。研发/测试仍要回原型点「生效」才能知道分组、师资、确认分别拦什么。超学时/欠学时也写成「以二次确认为准（演示规则）」，没有写清是**阻断**还是**确认后可过**。

## What Changes

- 覆盖重写开课安排 `20260902V2` 的 **BR001**（及第 12 章「需完整度」一句）：把生效校验拆成**硬阻断 / 二次确认仍可过 / 保存与生效差异**，分点写全，禁止再用「以原型提示为准」代替规则正文。
- 变更说明（简版 V3）记本条从空话改为清单。
- **不改** `app.js` / `index.html`。规则只对照现行生效弹窗与校验函数。
- **非目标**：不发明撤回/退回细则（BR003 仍标未确认）；不批量改其他菜单里零星「以原型为准」（另开变更）。

## Capabilities

### New Capabilities

（无 — `skip_specs: true`，仅 PRD 规则正文）

### Modified Capabilities

（无）

## Impact

- 文档：`参考文档/2、开课管理/02_专业开课/02_开课安排/开课安排20260902V2/`
- 读者：产品 / 研发 / 测试 / AI 后端
- 原型：只读对照 `validateMajorOfferingTaskArrangementSubmit`、`buildMajorOfferingTaskSubmitConfirm`、`validateMajorOfferingTaskTeacherConfirmation`
