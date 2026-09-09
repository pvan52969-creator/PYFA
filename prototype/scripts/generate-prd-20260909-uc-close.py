#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""20260909 升版：关闭已拍板 UC，写入新版本文件夹 + 变更说明（对照上一有效版，并关闭相对开课0807仍未确认项）。

禁止覆盖已有版本文件夹。选修开课安排本批不生成。
"""
from __future__ import annotations

import importlib.util
import shutil
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(SCRIPT_DIR))
from prd_folder_paths import version_dir  # noqa: E402

DATE, NOTE_DATE = "20260909", "2026-09-09"
RBAC = (
    "开课模块数据权限按专业：操作人有该专业权限即可查看并操作该专业所属数据；"
    "未授权专业不可见。本口径仅约束开课模块。"
)
UC_CLOSED = """## 11. 未确认事项

| 编号 | 事项 | 影响范围 |
|------|------|----------|
| — | 本版无未确认事项（原 UC 已关闭并写入对应 BR） | — |
"""
PERM_ROW = (
    "| 教务/学院/专业管理员 | 按专业授权可见 | 以页面可见按钮为准 |"
    " 已明确：开课模块按专业，有该专业权限即可看该专业数据 |"
)
RBAC_FOOTER = f"- 数据权限：{RBAC}"


def load_docx_helpers():
    spec = importlib.util.spec_from_file_location(
        "gen20260904", SCRIPT_DIR / "generate-20260904-prd-docx-batch.py"
    )
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    spec2 = importlib.util.spec_from_file_location(
        "generate_design_docx", SCRIPT_DIR / "generate-design-docx.py"
    )
    mod2 = importlib.util.module_from_spec(spec2)
    assert spec2.loader
    spec2.loader.exec_module(mod2)
    return mod, mod2.md_to_docx


def bump_header(text: str, old_label: str, new_label: str, extra: str) -> str:
    text = text.replace(f"**文档版本：** {old_label}", f"**文档版本：** {new_label} · {extra}")
    text = text.replace(f"| 文档版本 | {old_label.split('·')[0].strip()} |", f"| 文档版本 | {new_label} |")
    # 校选等写成 20260904V5
    old_ver = old_label.split("·")[0].strip()
    text = text.replace(f"| 文档版本 | {old_ver} |", f"| 文档版本 | {new_label} |")
    text = text.replace(
        f"| 创建/发布日期 | 2026-09-02（2026-09-03 完整重写覆盖） |",
        f"| 创建/发布日期 | 2026-09-09（相对 {old_ver} 关闭已拍板 UC） |",
    )
    text = text.replace(
        f"| 创建/发布日期 | 2026-09-02（2026-09-03 完整重写 / BR001 补全；2026-09-04 步骤条冻结澄清覆盖） |",
        f"| 创建/发布日期 | 2026-09-09（相对 {old_ver} 关闭已拍板 UC） |",
    )
    text = text.replace(
        f"| 创建/发布日期 | 2026-09-02（2026-09-03 完整重写；2026-09-08 保生效与二次确认 tip 覆盖） |",
        f"| 创建/发布日期 | 2026-09-09（相对 {old_ver} 关闭已拍板 UC） |",
    )
    text = text.replace(
        "| 创建/发布日期 | 2026-09-04 |",
        "| 创建/发布日期 | 2026-09-09（相对 20260904V5 关闭已拍板 UC） |",
    )
    return text


def apply_common(text: str) -> str:
    text = text.replace(
        "| 教务/学院/专业管理员（原型角色切换） | 按原型数据权限 | 以页面可见按钮为准 | 未确认 |",
        PERM_ROW,
    )
    text = text.replace("- 权限未拍板：禁止自造 RBAC。", RBAC_FOOTER)
    text = text.replace("- 不做 OpenAPI 全文；权限未拍板禁止自造 RBAC。", f"- 不做 OpenAPI 全文。\n{RBAC_FOOTER}")
    text = text.replace("权限未拍板禁止自造 RBAC。", RBAC)
    return text


def replace_uc_section(text: str) -> str:
    import re

    return re.sub(
        r"## 11\. 未确认事项\n\n\| 编号 \| 事项 \| 影响范围 \|\n\|------\|------\|----------\|\n(?:\|.*\|\n)+",
        UC_CLOSED,
        text,
        count=1,
    )


def write_change_md(path: Path, menu: str, menu_path: str, from_file: str, to_file: str,
                    from_ver: str, to_ver: str, prototype: str, rows: list[tuple],
                    extra_head: str = "") -> None:
    lines = [
        f"# {menu}——需求调整变更说明",
        "",
        "> 模板：`参考文档/0、模板/需求调整变更说明模板（简版）20260901V3.docx`",
        extra_head.rstrip(),
        "",
        "## 1 版本信息",
        "",
        "| 项目 | 内容 |",
        "|------|------|",
        f"| 需求文档名称 | 厦大马来分校本科教务系统产品需求文档 — {menu} |",
        f"| 菜单路径 | {menu_path} |",
        f"| 上一有效版 → 本版 | {from_ver} → {to_ver} |",
        f"| 上一版文件 | {from_file} |",
        f"| 本版文件 | {to_file} |",
        "| 本版 PRD 模板 | V3.1 |",
        f"| 原型地址 | {prototype} |",
        f"| 变更日期 | {NOTE_DATE} |",
        "",
        "## 2 本次改了什么（总览）",
        "",
        "按「模块 → 对象 → 变动」填写；一行一事。变更类型只填：新增 / 修改 / 删除 / 澄清。",
        "",
        "| 序号 | 模块（菜单路径） | 对象类型 | 对象ID | 功能 / 位置（可读名） | 变更类型 | 调整内容（从什么变成什么） | 状态 |",
        "|------|------------------|----------|--------|---------------------|----------|------------------------------|------|",
    ]
    for i, (obj_type, obj_id, where, typ, content) in enumerate(rows, 1):
        lines.append(
            f"| {i} | {menu_path} | {obj_type} | {obj_id} | {where} | {typ} | {content} | 已明确 |"
        )
    lines += [
        "",
        "## 3 前后对照（可选）",
        "",
        "详见上表「调整内容」。涉及开课0807 未确认项的，本版关闭后以现行对象ID 为准；不覆盖开课0807 文件夹内文件。",
        "",
        "## 4 连带影响（可选）",
        "",
        "| 序号 | 影响到哪里 | 影响说明 | 需同步 |",
        "|------|------------|----------|--------|",
        "| 1 | 开课0807 历史稿 | 仅作对比基线，不覆盖开课0807 文件夹 | — |",
        "| 2 | 原型 / 开发 / 测试 | 以本版 PRD「已明确」为准 | ☑原型 ☑开发 ☑测试 |",
        "",
    ]
    path.write_text("\n".join(lines), encoding="utf-8")


# ---------- per-menu patches ----------

def patch_time(t: str) -> str:
    t = t.replace(
        "| BR001 | 默认展示学期 | P01（开课时间设置页面） | 默认可用于开课各页学期初值；是否全局唯一以原型为准。（已明确对照字段） |",
        "| BR001 | 默认展示学期 | P01（开课时间设置页面） | 默认可用于开课各页学期初值。**开课模块内全局唯一**：同一时刻最多一个学期为「是」；新勾选后其余自动为否。不涉及其他模块。（已明确） |",
    )
    return t


def patch_special(t: str) -> str:
    t = t.replace(
        "| BR001 | 删除约束 | P01（特殊课程设置页面） | 已被开课引用能否删除：未确认。 |",
        "| BR001 | 删除约束 | P01（特殊课程设置页面） | 允许移出清单。已生成到开课计划/安排的班上教室、Support 等值不回滚、不随本页再改；删除后以后新建/生成不再带出本课号默认。（已明确） |",
    )
    t = t.replace(
        "| BR002 | 带出覆盖 | P01-D01（编辑特殊课程抽屉） | 开课安排新建或系统默认班自动带出；是否覆盖已改字段：未确认。 |",
        "| BR002 | 带出覆盖 | P01-D01（编辑特殊课程抽屉） | 仅生成前已维护的特殊课程设置会带出到新开课。已经生成的开课数据不随本页后续修改而覆盖。（已明确） |",
    )
    return t


def patch_elective(t: str) -> str:
    t = t.replace(
        "| BR001 | 删除约束 | P01（校选课程管理页面） | 已被开课引用的校选课能否删除：未确认。 |",
        "| BR001 | 删除约束 | P01（校选课程管理页面） | 允许删除（移出校选池）。已生成/已添加的开课结果不改；删除后以后无法再引用该课。（已明确） |",
    )
    return t


def patch_plan(t: str) -> str:
    t = t.replace(
        "| BR002 | 合班一致性 | P01-D02（合拆班抽屉） | 合班须同课号/学分/学时/周次/选课类型；合班后清空相关教学班分组与教师安排。（已明确） |",
        "| BR002 | 合班一致性 | P01-D02（合拆班抽屉） | 合班须同课号/学分/学时/周次/选课类型。合班后计划人数、预留名额、课程名额上限均累加（先叠加）；清空相关教学班分组与教师安排。（已明确） |",
    )
    t = t.replace(
        "| BR004 | 删除约束 | P01（开课计划页面） | 已生效或已被安排引用的计划行是否可删：未确认。 |",
        "| BR004 | 删除约束 | P01（开课计划页面） | 已生效计划行不允许删除。未生效可删。（已明确） |",
    )
    t = t.replace(
        "- - 转移：draft→submitted 生效；submitted→reverted 本页撤回入口已隐藏",
        "- - 转移：draft→submitted 生效；submitted→reverted 由开课安排「退回」（见开课安排 BR003）；本页撤回入口已隐藏。已生效不可删除（BR004）",
    )
    return t


def patch_arrange(t: str) -> str:
    t = t.replace(
        "| 界面说明 | 2 步向导列表；支持勾选生效/撤回/退回等（以可见按钮为准）。 |",
        "| 界面说明 | 2 步向导列表；支持勾选生效/撤回/退回；步骤2 提供一键同步共同授课（以可见按钮为准）。 |",
    )
    t = t.replace(
        "| F010 | P01（开课安排页面） | 撤回/退回 | 按钮 | 勾选后 | 可见且允许 | 回退状态 | 状态更新 | — | BR003 |",
        "| F010 | P01（开课安排页面） | 撤回 | 按钮 | 勾选后 | 安排已生效 | 安排生效→草稿；分组/教师/安排详情保留；名单分组重置 | 状态更新 | 已排课则禁撤 | BR003 |\n"
        "| F034 | P01（开课安排页面） | 退回 | 按钮 | 勾选后 | 安排未生效 | 回退开课计划；分组/教师清空；名单分组清掉 | 计划→回退 | 已生效不可退 | BR003 |\n"
        "| F035 | P01（开课安排页面） | 一键同步共同授课 | 按钮 | 点击 | 步骤2 | 按权限可见专业+当前筛选补绑定；不解绑 | 刷新 | — | BR017 |",
    )
    t = t.replace(
        "| BR002 | 共同授课 | P01-M01（共同授课设置弹窗） | 已生效不可再设共同授课。（已明确） |",
        "| BR002 | 共同授课 | P01-M01（共同授课设置弹窗） | 已生效不可再设共同授课。替换/移除教师不自动解除已有绑定；要拆只能在共同授课设置中手动移除。（已明确） |",
    )
    t = t.replace(
        "| BR003 | 撤回与退回 | P01（开课安排页面） | 撤回/退回差异及备注：未完全确认；入口以可见按钮为准。（未确认） |",
        "| BR003 | 撤回与退回 | P01（开课安排页面） | "
        "**撤回**（仅安排已生效）：安排生效状态→草稿；分组结构、教师安排、安排详情保留；授课确认不变；计划开课状态不变；名单分组结果重置（学生仍在课程名单上，含手动添加进课的人，只清分组归属）。"
        "**退回**（仅安排未生效）：从开课安排回退到开课计划（计划状态→回退）；分组与教师安排清空；名单分组清掉。已生效不可退回。（已明确） |",
    )
    t = t.replace(
        "| BR015 | Latest Evaluation | P02-M02（课时详情弹窗） | 展示期中/期末 Latest（缺侧用 --）；按课号汇总不按组；学生评教模块尚未接入，当前为占位。（未确认接入） |",
        "| BR015 | Latest Evaluation | P02-M02（课时详情弹窗） | 展示期中/期末 Latest（缺侧用 --）；按课号汇总不按组。学生评教模块尚未设计，本字段先占位，不接真接口。（已明确·占位） |",
    )
    insert = (
        "| BR016 | 历史复制后确认 | P01-M02（授课确认弹窗（安排侧）） / P02（分组工作台页面） | 历史安排复制后尚未确认时，须先在安排详情点「确认」后再发送授课确认。（已明确·alert） |\n"
        "| BR017 | 一键同步共同授课 | P01（开课安排页面） | "
        "范围：按操作人权限决定能看到哪些专业的数据，只同步当前筛选下这些可见专业（不读勾选）。"
        "绑定：只给特殊课程里已关联、课号不同、且现在仍有共同任课教师的教学班补上共同授课。"
        "不解绑：换教师或去掉教师，已有共同授课都还在；点同步也不会因为两边已经没有共同教师而解开。"
        "要拆：只能打开共同授课，手动移除。（已明确·hint） |"
    )
    t = t.replace(
        "| BR016 | 历史复制后确认 | P01-M02（授课确认弹窗（安排侧）） / P02（分组工作台页面） | 历史安排复制后尚未确认时，须先在安排详情点「确认」后再发送授课确认。（已明确·alert） |",
        insert,
    )
    t = t.replace(
        "- 转移：draft→submitted（须满足 BR001 **A 硬阻断**项全部通过；欠学时/超学时仅二次确认，不阻断）；submitted→reverted（入口与差异见 BR003，未完全确认）；→cancelled 经课程班等；禁止与 teachingConfirmStatus 合并成单字段。",
        "- 转移：draft→submitted（须满足 BR001 **A 硬阻断**项全部通过；欠学时/超学时仅二次确认，不阻断）；"
        "submitted→draft 经「撤回」（BR003）；未生效经「退回」使计划 submitStatus→reverted（BR003）；"
        "→cancelled 经课程班「设置停课」；禁止与 teachingConfirmStatus 合并成单字段。",
    )
    return t


def patch_roster(t: str) -> str:
    t = t.replace(
        "| BR002 | 退回 | P01（开课名单页面） | 批量退回（可含备注）；退回后名单保留策略：未确认。 |",
        "| BR002 | 名单分组与退回 | P01（开课名单页面） / P02（名单工作台页面） | "
        "开课安排「撤回」后：名单分组结果重置，手动添加进课程的学生仍留在课程名单上，只清分组归属。"
        "开课安排「退回」后：名单分组清掉。本页工具栏退回与开课安排退回同一套（仅未生效可退回计划，见开课安排 BR003）。（已明确） |",
    )
    return t


def patch_class(t: str) -> str:
    t = t.replace("提供停课等统一入口。", "提供「设置停课」（停课/恢复）统一入口。")
    t = t.replace("无独立维护表单；停课为工具栏操作。", "无独立维护表单；「设置停课」为工具栏操作，可选停课或恢复。")
    t = t.replace(
        "| F002 | P01（课程班页面） | 停课 | 按钮 | 勾选后 | 允许停课 | 班级/组停课 | 状态更新 | — | BR001 |",
        "| F002 | P01（课程班页面） | 设置停课 | 按钮 | 勾选后 | 已开出 | 弹窗选择停课或恢复 | 状态在停课/正常间切换 | — | BR001 |",
    )
    t = t.replace(
        "| BR001 | 停课 | P01（课程班页面） | 停课入口与结果状态以原型可见按钮/title 为准。（已明确） |",
        "| BR001 | 设置停课 | P01（课程班页面） | 工具栏为「设置停课」，可选停课或恢复。停课后可再恢复为正常；停课状态与安排侧 cancelled 对齐。排课计划不再纳入已停课班。（已明确） |",
    )
    t = t.replace("- - 含停课 cancelled；与安排侧 cancelled 对齐，禁止另造码",
                  "- - 含停课 cancelled / 正常（非 cancelled）；与安排侧对齐；可经「设置停课」在两态间切换，禁止另造码")
    return t


def patch_load(t: str) -> str:
    t = t.replace(
        "| FD030 | P01-M01（超限阈值弹窗） | 超限阈值 | Threshold | 数字 | 可编辑 | 可编辑 | 只读 | 是 | — | BR002 | 本模块录入 | 否 | 各维度超限标红 |",
        "| FD030 | P01-M01（超限阈值弹窗） | 超限阈值 | Threshold | 数字 | 可编辑 | 可编辑 | 只读 | 否 | 空=不标红 | BR002 | 本模块录入 | 否 | 各维度独立；默认不预填 |",
    )
    t = t.replace(
        "| F004 | P01（Teaching Load页面） | 设置阈值 | 按钮 | 点击 | — | 打开 P01-M01 | 保存 | — | BR002 |",
        "| F004 | P01（Teaching Load页面） | 设置阈值 | 按钮 | 点击 | — | 打开 P01-M01 | 保存 | — | BR002 |\n"
        "| F005 | P01（Teaching Load页面） | 导出 Excel | 按钮 | 点击 | — | 本版占位，不执行导出 | — | 提示占位 | BR003 |",
    )
    t = t.replace(
        "| BR002 | 超限标红 | P01-M01（超限阈值弹窗） | 各维度超限标红。（已明确对照阈值文案） |",
        "| BR002 | 超限标红 | P01-M01（超限阈值弹窗） | 周/学期/学年各维度超限标红。默认不设置、不预填；留空表示不标红。合计与人均不受影响。（已明确） |\n"
        "| BR003 | 导出 Excel | P01（Teaching Load页面） | 须提供导出入口；本版仅按钮占位，导出模板未定，禁止当已交付导出能力。（已明确·占位） |",
    )
    return t


def patch_tcc_admin(t: str) -> str:
    t = t.replace(
        "| BR002 | 代确认 | P01（授课确认管理页面） | pending 可代确认。（已明确对照行内可用性） |",
        "| BR002 | 代确认 | P01（授课确认管理页面） | pending 可代确认。（已明确对照行内可用性） |\n"
        "| BR012 | 批量代确认文案 | P01（授课确认管理页面） | 二次确认暂用现行文案：确定为 N 条课程执行「管理端代确认」吗？将仅标记所选课程为管理端代确认并记录操作人。（已明确·暂用） |",
    )
    return t


def patch_tcc_teacher(t: str) -> str:
    t = t.replace(
        "| FD021 | P01-M02（不同意意见弹窗） | 不同意意见 | Disagree Remark | 多行文本 | 可编辑 | 可编辑 | — | 条件 | — | BR001 | 本模块录入 | 否 | 不同意时是否必填未确认 |",
        "| FD021 | P01-M02（不同意意见弹窗） | 不同意意见 | Disagree Remark | 多行文本 | 可编辑 | 可编辑 | — | 是 | — | BR001 | 本模块录入 | 否 | 不同意必填 |",
    )
    t = t.replace(
        "| BR001 | 不同意意见 | P01-M02（不同意意见弹窗） | 不同意时意见是否必填：未确认。 |",
        "| BR001 | 不同意意见 | P01-M02（不同意意见弹窗） | 授课确认选择不同意时必须填写意见，否则不可提交。（已明确） |",
    )
    return t


def patch_replace(t: str) -> str:
    t = t.replace(
        "另：系统将向被替换教师发送邮件，通知其原有安排的调整或取消。（emailHint；发送通道见 UC002）",
        "另：确认替换后向被替换教师发送邮件，通知其原有安排的调整或取消。真发；学校邮箱；经公司内部消息中心统一发送。（已明确）",
    )
    t = t.replace(
        "| BR003 | 邮件通知 | P01-M01 / P01-M02-C | 确认替换后向被替换教师发邮件告知安排调整或取消。（已明确·emailHint；发送通道未确认） |",
        "| BR003 | 邮件通知 | P01-M01 / P01-M02-C | 确认替换后向被替换教师发邮件告知安排调整或取消。真发；使用学校邮箱；经公司内部消息中心统一发送。（已明确） |",
    )
    t = t.replace(
        "| BR004 | 冲突/共同授课例外 | P01-M01（单行替换教师弹窗） | 冲突与共同授课例外以原型提示为准。（已明确对照既有） |",
        "| BR004 | 冲突/共同授课例外 | P01-M01（单行替换教师弹窗） | 冲突校验以原型提示为准。共同授课：只改当前课号下被操作的学时安排教师，关联课不换人；已有共同授课绑定保留（即使替换后已无共同教师）。单行与一键替换同此口径。要拆只能手动移除共同授课。（已明确） |",
    )
    t = t.replace(
        "前置：开课安排已生效且已有学时安排行。副作用：进出本课教师的授课确认包同步；安排生效态不变；确认进度可回退。共同授课是否同步替换：UC001。排课计划入池以已生效为准（见《排课计划》BR001）。",
        "前置：开课安排已生效且已有学时安排行。副作用：进出本课教师的授课确认包同步；安排生效态不变；确认进度可回退。共同授课绑定不随替换解除，关联课教师不跟着换（BR004）。排课计划入池以已生效为准（见《排课计划》BR001）。",
    )
    return t


def patch_schedule(t: str) -> str:
    t = t.replace("下游排课系统对接字段未确认。", "下游排课系统对接字段见 BR004。")
    t = t.replace(
        "| BR003 | 教室偏好 | P01-L01（学时安排列表） | 仅排课参考展示；具体以排课安排为准。（已明确对照开课安排 tip） |",
        "| BR003 | 教室偏好 | P01-L01（学时安排列表） | 仅排课参考展示；具体以排课安排为准。（已明确对照开课安排 tip） |\n"
        "| BR004 | 外部排课对接字段 | P01（排课计划页面） | 对外至少传：课号、课程班名称、周次、周学时、教师、场地偏好、共同授课/联动标记、学时类型、同时授课等。（已明确） |",
    )
    return t


JOBS = [
    {
        "menu": "开课时间设置",
        "src": ROOT / "参考文档/2、开课管理/01_开课设置/01_开课时间设置/开课时间设置20260902V2/开课时间设置20260902V2.md",
        "old": "20260902V2", "new": "20260909V3",
        "path": "开课管理 → 开课设置 → 开课时间设置",
        "proto": "prototype/index.html → page-course-time-setting",
        "patch": patch_time,
        "0807": "开课0807/开课设置/开课时间设置/开课时间设置20260804V2",
        "rows": [
            ("规则", "BR001 / UC001", "默认展示学期", "澄清",
             "0807 写「全局最多一个是」且列表开关排他；上一版 UC001 未确认「是否全局唯一」→ 本版：开课模块内全局唯一，不涉及其他模块"),
        ],
    },
    {
        "menu": "特殊课程设置",
        "src": ROOT / "参考文档/2、开课管理/01_开课设置/03_特殊课程设置/特殊课程设置20260902V2/特殊课程设置20260902V2.md",
        "old": "20260902V2", "new": "20260909V3",
        "path": "开课管理 → 开课设置 → 特殊课程设置",
        "proto": "prototype/index.html → page-special-course-settings",
        "patch": patch_special,
        "0807": "开课0807/开课设置/特殊课程设置/特殊课程设置20260804V2",
        "rows": [
            ("规则", "BR001 / UC002", "删除约束", "澄清",
             "0807：删除不回滚已落班；上一版 UC002 未确认 → 本版：可删清单项；已生成开课不回滚，以后不能再带出"),
            ("规则", "BR002 / UC001", "带出覆盖", "澄清",
             "0807：新建可带出、已改字段 onlyIfEmpty 不覆盖；上一版 UC001 未确认 → 本版：仅生成前设置会带出，生成后不随本页修改覆盖"),
        ],
    },
    {
        "menu": "校选课程管理",
        "src": ROOT / "参考文档/2、开课管理/01_开课设置/02_校选课程管理/校选课程管理20260904V5/校选课程管理20260904V5.md",
        "old": "20260904V5", "new": "20260909V6",
        "path": "开课管理 → 开课设置 → 校选课程管理",
        "proto": "prototype/index.html → page-school-elective-courses",
        "patch": patch_elective,
        "0807": "开课0807/开课设置/校选课程管理/校选课程管理20260804V1",
        "rows": [
            ("规则", "BR001 / UC001", "删除已引用课", "澄清",
             "0807 删除二次确认且不删课库、原型未拦下游引用；上一版 UC001 未确认 → 本版：可删；已生成开课不改，以后不能再引用"),
            ("其他", "UC002", "数据权限", "澄清",
             "上一版 RBAC 未确认 → 本版开课模块按专业授权"),
        ],
    },
    {
        "menu": "开课计划",
        "src": ROOT / "参考文档/2、开课管理/02_专业开课/01_开课计划/开课计划20260902V2/开课计划20260902V2.md",
        "old": "20260902V2", "new": "20260909V3",
        "path": "开课管理 → 专业开课 → 开课计划",
        "proto": "prototype/index.html → page-course-offering-major",
        "patch": patch_plan,
        "0807": "开课0807/专业开课/开课计划/开课计划20260804V4",
        "rows": [
            ("规则", "BR002 / UC001", "合班人数累加", "澄清",
             "0807 §7.10：计划人数与预留按合入批次分摊后累加；上一版 UC001 未终裁 → 本版先按叠加：计划人数、预留、上限均累加"),
            ("规则", "BR004 / UC002", "删除已生效行", "澄清",
             "0807：仅非已生效可删；上一版 UC002 未确认 → 本版已生效不允许删除"),
            ("其他", "UC003", "数据权限", "澄清", "上一版 RBAC 未确认 → 本版开课模块按专业授权"),
        ],
    },
    {
        "menu": "开课安排",
        "src": ROOT / "参考文档/2、开课管理/02_专业开课/02_开课安排/开课安排20260902V2/开课安排20260902V2.md",
        "old": "20260902V2", "new": "20260909V3",
        "path": "开课管理 → 专业开课 → 开课安排",
        "proto": "prototype/index.html → page-course-major-offering-task-style2",
        "patch": patch_arrange,
        "0807": "开课0807/专业开课/开课安排/开课安排20260804V4",
        "rows": [
            ("规则", "BR003 / UC002 / F010 / F034", "撤回 vs 退回", "修改",
             "0807 §7.2 有完整对照且上一版 UC002 未确认 → 本版：撤回=已生效→草稿、分组/教师/安排详情保留、名单分组重置、授课确认与开课状态不变；退回=仅未生效可退回计划、分组/教师清空、名单分组清掉"),
            ("规则", "BR002 / BR017 / F035", "一键同步共同授课", "修改",
             "相对上一版/0807 未写清同步解绑 → 本版：按专业权限可见范围补绑定；替换/移除教师与同步都不因无共同教师解绑；要拆只能手动移除"),
            ("规则", "BR015 / UC003", "学生评教 / Latest", "澄清",
             "上一版 UC003 未确认接入 → 本版评教模块未设计，字段占位不接真接口"),
            ("其他", "UC004", "数据权限", "澄清", "上一版 RBAC 未确认 → 本版开课模块按专业授权"),
        ],
    },
    {
        "menu": "开课名单",
        "src": ROOT / "参考文档/2、开课管理/02_专业开课/03_开课名单/开课名单20260902V2/开课名单20260902V2.md",
        "old": "20260902V2", "new": "20260909V3",
        "path": "开课管理 → 专业开课 → 开课名单",
        "proto": "prototype/index.html → page-course-major-offering-roster",
        "patch": patch_roster,
        "0807": "开课0807/专业开课/开课名单/开课名单20260804V2",
        "rows": [
            ("规则", "BR002 / UC001", "退回后名单", "修改",
             "0807：名单页退回安排后「已维护名单可保留」；上一版 UC001 未确认 → 本版：撤回只清分组结果、手动加进课的人仍在名单；安排退回则名单分组清掉"),
            ("其他", "UC002", "数据权限", "澄清", "上一版 RBAC 未确认 → 本版开课模块按专业授权"),
        ],
    },
    {
        "menu": "课程班",
        "src": ROOT / "参考文档/2、开课管理/05_课程班管理/01_课程班/课程班20260902V2/课程班20260902V2.md",
        "old": "20260902V2", "new": "20260909V3",
        "path": "开课管理 → 课程班管理 → 课程班",
        "proto": "prototype/index.html → page-course-offering-manifest",
        "patch": patch_class,
        "0807": "",
        "rows": [
            ("功能", "F002 / BR001 / UC001", "设置停课", "修改",
             "上一版 UC001 停课是否可恢复未确认 → 本版按钮改为「设置停课」，可选停课或恢复"),
        ],
    },
    {
        "menu": "Teaching Load",
        "src": ROOT / "参考文档/2、开课管理/05_课程班管理/02_Teaching Load/Teaching Load20260902V2/Teaching Load20260902V2.md",
        "old": "20260902V2", "new": "20260909V3",
        "path": "开课管理 → 课程班管理 → Teaching Load",
        "proto": "prototype/index.html → page-course-teacher-teaching-load",
        "patch": patch_load,
        "0807": "",
        "rows": [
            ("规则", "BR002 / UC002 / FD030", "超限阈值默认值", "澄清",
             "上一版 UC002 未确认 → 本版默认不设置、不预填；留空不标红"),
            ("功能", "F005 / BR003 / UC001", "导出 Excel", "新增",
             "上一版导出模板标非目标 → 本版要支持导出，先出按钮占位，模板未定"),
        ],
    },
    {
        "menu": "授课确认管理",
        "src": ROOT / "参考文档/2、开课管理/05_课程班管理/03_授课确认管理/授课确认管理20260902V2/授课确认管理20260902V2.md",
        "old": "20260902V2", "new": "20260909V3",
        "path": "开课管理 → 课程班管理 → 授课确认管理",
        "proto": "prototype/index.html → page-course-teacher-confirmation-admin",
        "patch": patch_tcc_admin,
        "0807": "",
        "rows": [
            ("功能", "BR012 / UC001", "批量代确认文案", "澄清",
             "上一版 UC001 文案终裁未确认 → 本版暂用现行二次确认文案"),
            ("其他", "UC002", "数据权限", "澄清", "上一版 RBAC 未确认 → 本版开课模块按专业授权"),
        ],
    },
    {
        "menu": "授课确认（教师端）",
        "src": ROOT / "参考文档/2、开课管理/05_课程班管理/04_授课确认（教师端）/授课确认（教师端）20260902V2/授课确认（教师端）20260902V2.md",
        "old": "20260902V2", "new": "20260909V3",
        "path": "开课管理 → 课程班管理 → 授课确认（教师端）",
        "proto": "prototype/index.html → page-teacher-course-confirmation",
        "patch": patch_tcc_teacher,
        "0807": "",
        "rows": [
            ("规则", "BR001 / FD021 / UC001", "不同意意见", "澄清",
             "上一版 UC001 不同意是否必填未确认 → 本版不同意必须填意见"),
        ],
    },
    {
        "menu": "授课教师替换",
        "src": ROOT / "参考文档/2、开课管理/05_课程班管理/05_授课教师替换/授课教师替换20260902V2/授课教师替换20260902V2.md",
        "old": "20260902V2", "new": "20260909V3",
        "path": "开课管理 → 课程班管理 → 授课教师替换",
        "proto": "prototype/index.html → page-course-offering-teacher-replace",
        "patch": patch_replace,
        "0807": "",
        "rows": [
            ("规则", "BR004 / UC001", "共同授课与替换范围", "澄清",
             "上一版 UC001 共同授课是否同步替换未确认 → 本版只换当前课号被操作的学时行；关联课不换人；绑定保留"),
            ("规则", "BR003 / UC002", "邮件通道", "澄清",
             "上一版 UC002 发送通道未确认 → 本版确认替换后真发，学校邮箱，公司消息中心统一发送"),
        ],
    },
    {
        "menu": "排课计划",
        "src": ROOT / "参考文档/2、开课管理/05_课程班管理/06_排课计划/排课计划20260902V2/排课计划20260902V2.md",
        "old": "20260902V2", "new": "20260909V3",
        "path": "开课管理 → 课程班管理 → 排课计划",
        "proto": "prototype/index.html → page-course-scheduling-plan",
        "patch": patch_schedule,
        "0807": "",
        "rows": [
            ("数据流", "BR004 / UC001", "外部排课对接字段", "新增",
             "上一版 UC001 未确认 → 本版字段：课号、课程班名称、周次、周学时、教师、场地偏好、共同授课/联动标记、学时类型、同时授课等"),
        ],
    },
]


def main():
    batch, md_to_docx = load_docx_helpers()
    for job in JOBS:
        src = job["src"]
        if not src.exists():
            raise SystemExit(f"找不到源 PRD：{src}")
        new_ver = job["new"]
        # 20260909V3 → date 20260909, V3
        date_ymd, ver = DATE, "V" + new_ver.split("V", 1)[1]
        out_dir = version_dir(job["menu"], date_ymd, ver)
        if out_dir.exists():
            raise SystemExit(f"拒绝覆盖已有版本文件夹：{out_dir}")
        out_dir.mkdir(parents=True)
        text = src.read_text(encoding="utf-8")
        text = bump_header(text, job["old"], job["new"], "关闭已拍板 UC")
        text = apply_common(text)
        text = job["patch"](text)
        text = replace_uc_section(text)
        prd_md = out_dir / f"{job['menu']}{job['new']}.md"
        prd_md.write_text(text, encoding="utf-8")
        extra = ""
        if job["0807"]:
            extra = f"> **对比基线（开课0807）：** `{job['0807']}`  \n> **正式链上一有效版：** {job['old']}（本版关闭上一版相对 0807 仍标未确认的条目）"
        else:
            extra = f"> **正式链上一有效版：** {job['old']}"
        note_stem = f"{job['menu']}{job['old']}→{job['new']}变更说明"
        note_md = out_dir / f"{note_stem}.md"
        write_change_md(
            note_md,
            job["menu"],
            job["path"],
            f"{job['menu']}{job['old']}.docx",
            f"{job['menu']}{job['new']}.docx",
            job["old"],
            job["new"],
            job["proto"],
            job["rows"],
            extra_head=extra,
        )
        prd_docx = prd_md.with_suffix(".docx")
        md_to_docx(prd_md, prd_docx)
        rows = batch.parse_overview_rows(note_md.read_text(encoding="utf-8"))
        batch.write_change_note_docx(
            note_md,
            note_md.with_suffix(".docx"),
            {
                "name": f"厦大马来分校本科教务系统产品需求文档 — {job['menu']}",
                "path": job["path"],
                "versions": f"{job['old']} → {job['new']}",
                "from_file": f"{job['menu']}{job['old']}.docx",
                "to_file": f"{job['menu']}{job['new']}.docx",
                "prd_template": "V3.1",
                "prototype": job["proto"],
                "date": NOTE_DATE,
            },
            rows,
        )
        print(f"OK {job['menu']} {job['old']} → {job['new']}  rows={len(rows)}")
    print("done", len(JOBS), "menus; skipped 选修开课安排")


if __name__ == "__main__":
    main()
