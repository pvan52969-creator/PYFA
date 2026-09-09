## Why

《开课安排》已按「完整 UI 树 + 次级面板字段 + tip/alert→BR」标准重写。其余 11 份 `20260902V2` PRD 多数仍是走查壳：表单仅数个 FD、弹窗/展开/工作台未入树、原型 tip 未落规则。继续用薄版喂 AI 后端会重复开课安排同类漏项。

## What Changes

- 按同一标准**补全**其余菜单 PRD（md + docx + 变更说明）；改动处黄底、字体与模板一致。
- **默认覆盖**各菜单现行 `…20260902V2/`（与开课安排一致）；若你改口升版再调。
- 批跑脚本对已完整菜单 **skip**，禁止缩水覆盖。
- 开课安排已完成 → **本变更不重写开课安排**。

## Capabilities

### New Capabilities

（无 — `skip_specs: true`，文档补全）

### Modified Capabilities

（无）

## Impact

- 文档：`参考文档/2、开课管理/` 下 11 个二级菜单 V2 文件夹  
- 脚本：`scripts/generate-prd-backend-ready-20260902.py` skip 列表扩展  
- 原型：只读对照，不改 `app.js`/`index.html`  
- 读者：产品 / 研发 / 测试 / AI 后端
