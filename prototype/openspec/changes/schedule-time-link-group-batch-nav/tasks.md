# Tasks

## 1. Offering link-group read path

- [x] 1.1 确认开课侧联动组只读查询与查看弹窗可用（`getSharedTeachingSlotLinks*` / `openSharedTeachingSlotLinkViewModal` 或等价）；若工作区缺失，补齐最小只读数据层 + 只读详情弹窗（不含建立/解除 UI）。验证：用已知 linkId 能打开详情且组名可解析。
- [x] 1.2 实现「排课学时单元 → 开课安排行 → 联动组」解析（含无匹配返回空）。验证：有联动样本单元解析出组名/linkId；无联动单元返回空。

## 2. Time sidebar fields

- [x] 2.1 在 `renderScheduleDetailCourseList` **时间分支**「共同授课课号」下方增加「联动组」字段；有组名用 `sdc-teacher-link` 风格可点并 `stopPropagation` 打开只读详情，无为「—」。验证：时间侧栏字段顺序正确；点击组名弹详情且不切换选中卡；教室侧栏字段无新增。
- [x] 2.2 实现上课批次多链接 HTML，替换时间侧纯文本批次；点击调用 `openScheduleBatchDetail`；无固定批次仍为「—」。验证：单批次跳转正确；合班多批次各自跳到对应批次；「—」不可点。

## 3. Atomic linked scheduling

- [x] 3.1 在排时间落格/改格路径对联动闭包同写同一星期节次周次；任一方按既有规则不可落则整组不落。验证：排一方则组内各方同格出现；制造单方冲突时无半组结果。
- [x] 3.2 在清除/撤回路径对联动闭包同清。验证：清一方则组内对应安排一并消失。

## 4. Demo data and independence check

- [x] 4.1 保证 lean/演示数据至少一对共同授课课存在可展示的联动组，挂到侧栏可见学时单元。验证：打开含 CST 类共同授课的排时间详情可见「联动组」组名并可打开详情。
- [x] 4.2 自检排教室详情：侧栏无联动组字段、上课批次点击行为与改前一致。验证：仅测教室侧时行为无回归。
