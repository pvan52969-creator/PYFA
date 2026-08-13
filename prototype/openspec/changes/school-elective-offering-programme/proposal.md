## Why

校选课程管理列表仅有「开课单位」，缺少「开课专业」展示；ME 课的修读范围初始化目前按「开课单位下全部专业 + MAT」放开，与业务期望「有开课专业时仅开课专业 + MAT 可修」不一致。需要补齐字段展示，并收紧 ME 默认范围规则。

## What Changes

- 校选课程管理列表在「开课单位」右侧新增 **「开课专业」** 列（GE / ME 均展示）。
- 演示数据为课程维护 **开课专业**（原型阶段）：
  - 课号前三位能对应专业代码时，按此前三位分配；
  - 课号以 `G` 开头（及无法按前三位命中专业）时，随机分配若干专业代码，保证列表可演示。
- **ME** 修读范围「初始化」规则调整：
  - **有开课专业**：可选 = 该开课专业 + MAT；不可选清空（两边只维护可选侧）。
  - **无开课专业**：保持现状 = 开课单位下全部专业 + MAT。
- **GE** 修读范围初始化规则不变（仍按 Arts/Business/Science/不限）；列表仍显示开课专业。
- 修读范围查看/设置相关展示中，ME 需体现上述默认逻辑（初始化与列表字段一致）。

## Capabilities

### New Capabilities

- `school-elective-offering-programme`：校选课程「开课专业」字段、列表展示，以及 ME 默认可修范围（有/无开课专业两套）

### Modified Capabilities

- （无）`openspec/specs/` 下暂无已归档主规格需改写

## Impact

- 页面：`校选课程管理`（`page-school-elective-courses`）列表表头/行、列数
- 数据：校选课程行增加开课专业字段（演示赋值）；可能影响 `normalizeSchoolElectiveCourseRow` / 演示种子
- 修读范围：`buildSchoolElectiveDefaultProgrammeScope`（ME 分支）、初始化提示文案、修读范围查看弹窗（若需展示开课专业）
- 非目标：真实接口字段定义；专业开课「ME开课」入口批次选择器（另 change）；改 GE 大类不可选规则本身
