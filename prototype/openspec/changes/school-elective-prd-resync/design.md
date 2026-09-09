## Context

见 `proposal.md`。用户于 2026-09-02 明确：**覆盖 V3 即可，不升 V4**。

原型真源：`page-school-elective-courses`、`drawer-school-elective-edit`、`drawer-school-elective-offering-edit`、`modal-school-elective-scope-view`、列表表头 `所属专业`。

## Goals / Non-Goals

**Goals:**

- 覆盖重写 `校选课程管理20260901V3`（md+docx+变更说明），字段与原型对齐
- 明确已明确 / 未确认

**Non-Goals:**

- 不新建 V4；不改业务代码
- 不展开通识开课修读范围正文

## Decisions

1. **版本**：覆盖 `20260901V3`（一次性例外）；变更说明文件名仍为 `…20260821V2→20260901V3变更说明`
2. **字段纠偏（已明确）**  
   - 修读范围：`类型`（可选/不可选/不限）+ `专业`（类型=不限时不可选）  
   - 列表/摘要：`所属专业`（非「开课专业」）  
   - 英文列可写 `offeringProgramme`，备注标明界面文案=所属专业
3. **产出**：更新 `scripts/generate-prd-v3-20260901-batch.py` 中校选菜单定义后，`--allow-overwrite --only 校选课程管理`

## Risks / Trade-offs

- [Risk] 覆盖丢失旧 V3 原文 → Mitigation：用户已授权；git 可回滚
- [Risk] 代码遗留「开课专业」注释 → Mitigation：PRD 以可见 UI 为准

## Open Questions

- 「修改开课默认信息」抽屉无「所属专业」编辑项（摘要只读在修读范围抽屉）→ PRD 按实页写只读展示
