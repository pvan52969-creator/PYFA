#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""选修开课三菜单 20260915V1 → 20260917V3：关闭已拍板 UC，跳号升版。

禁止覆盖已有版本文件夹。不改专业开课 / 课程班已有 V3/V4/V5。
"""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(SCRIPT_DIR))
from prd_folder_paths import menu_dir, version_dir  # noqa: E402

OLD_LABEL = "20260915V1"
NEW_LABEL = "20260917V3"
NOTE_DATE = "2026-09-17"
REV = "> - 2026-09-17 关闭已拍板 UC：需求人数来自已提交执行计划；交叉可选 GE 不入校规；生效状态统一；ME「预计学生数」同一接口；ME 再开一条班"

MENU_PATH = {
    "选修开课计划": "开课管理 → 选修开课 → 选修开课计划",
    "选修开课安排": "开课管理 → 选修开课 → 选修开课安排",
    "选修开课名单": "开课管理 → 选修开课 → 选修开课名单",
}
PROTO = {
    "选修开课计划": "page-course-ge-offering-quota",
    "选修开课安排": "page-course-offering-ge",
    "选修开课名单": "page-course-ge-offering-roster",
}


def must_replace(text: str, old: str, new: str, where: str) -> str:
    if old not in text:
        raise SystemExit(f"{where}: 找不到替换片段:\n{old[:180]}")
    return text.replace(old, new, 1)


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


def bump_shell(text: str) -> str:
    text = text.replace(f"**文档版本：** {OLD_LABEL}（完整版覆盖）", f"**文档版本：** {NEW_LABEL}")
    text = text.replace(f"| 文档版本 | {OLD_LABEL} |", f"| 文档版本 | {NEW_LABEL} |")
    text = must_replace(
        text,
        "| 创建/发布日期 | 2026-09-15（完整版覆盖） |",
        f"| 创建/发布日期 | {NOTE_DATE}（相对 {OLD_LABEL} 关闭已拍板 UC，跳号 V3） |",
        "日期",
    )
    text = must_replace(
        text,
        "> **修订记录：**\n",
        f"> **修订记录：**\n{REV}\n",
        "修订记录",
    )
    return text


def patch_plan(text: str) -> str:
    text = bump_shell(text)
    text = must_replace(
        text,
        "先定学期课程组quota 与类型/专业配额，再在安排页开课。正式环境需求人数宜来自执行计划选修修读要求；现行可为演示数据（刷新 hint 已写明）。",
        "先定学期课程组quota 与类型/专业配额，再在安排页开课。"
        "正式环境从**已提交执行计划**「选修类分类 · 修读要求」汇总本学期要修 GE 的人数，按专业归属文/商/理；"
        "再按各批次标准学分折成 2/3 学分人次（BR001）。人次不是把人数拆成两拨人。"
        "原型需求卡仍可用演示数据（刷新 hint 已写明）。接口字段名以执行计划模块为准，本文不另造。",
        "计划 1.3",
    )
    text = must_replace(
        text,
        "- 选课应用；安排页开课/生效本体\n- 正式环境需求人数接口字段（UC001）\n- HTML 注释中「文/商/理交叉可选」等未上线政策（未确认，禁止当 BR）",
        "- 选课应用；安排页开课/生效本体\n"
        "- 「文/商/理交叉可选 GE」（文科选商理等）不作为校规、不作为 BR（已拍板）",
        "计划 2.3",
    )
    text = must_replace(
        text,
        "| FD010 | P01-GE-C01 | 预计需修 GE 总人数 | Expected GE Headcount | 数字 | 只读 | 否 | — | — | 正式目标：执行计划汇总；现行：演示 mock | 否 | badge「演示数据」 |",
        "| FD010 | P01-GE-C01 | 预计需修 GE 总人数 | Expected GE Headcount | 数字 | 只读 | 否 | — | — | 正式：已提交执行计划按专业汇总本学期要修 GE 人数（BR017）；现行：演示 mock | 否 | badge「演示数据」 |",
        "FD010",
    )
    text = must_replace(
        text,
        "| FD011 | P01-GE-C01 | 文/商/理人数与占比 | Stream Split | 复合 | 只读 | 否 | — | — | 同上 | 否 | 三卡 |",
        "| FD011 | P01-GE-C01 | 文/商/理人数与占比 | Stream Split | 复合 | 只读 | 否 | — | — | 同上；文/商/理挂在专业上 | 否 | 三卡人数 |",
        "FD011",
    )
    text = must_replace(
        text,
        "| FD012 | P01-GE-C01 | 2 学分人次 | Seats 2-Credit | 数字 | 只读 | 否 | — | BR001 | 本模块计算 | 否 | |",
        "| FD012 | P01-GE-C01 | 2 学分人次 | Seats 2-Credit | 数字 | 只读 | 否 | — | BR001 | 本模块计算（标准学分折算） | 否 | 人次≠把人数拆成修 2 分的人 |",
        "FD012",
    )
    text = must_replace(
        text,
        "| FD013 | P01-GE-C01 | 3 学分人次 | Seats 3-Credit | 数字 | 只读 | 否 | — | BR001 | 本模块计算 | 否 | |",
        "| FD013 | P01-GE-C01 | 3 学分人次 | Seats 3-Credit | 数字 | 只读 | 否 | — | BR001 | 本模块计算（标准学分折算） | 否 | 人次≠把人数拆成修 3 分的人 |",
        "FD013",
    )
    text = must_replace(
        text,
        "| FD015 | P01-GE-C01 学院明细 | 预计人数 | Expected Headcount | 数字 | 只读 | 否 | — | — | 正式：执行计划；现行：演示 mock | 否 | |",
        "| FD015 | P01-GE-C01 学院明细 | 预计人数 | Expected Headcount | 数字 | 只读 | 否 | — | — | 正式：已提交执行计划；现行：演示 mock | 否 | |",
        "FD015",
    )
    text = must_replace(
        text,
        "| FD016 | P01-GE-C01 学院明细 | 涉及专业批次 | Programme Batches | 只读 | 只读 | 否 | — | — | 正式：执行计划；现行：演示 mock | 否 | |",
        "| FD016 | P01-GE-C01 学院明细 | 涉及专业批次 | Programme Batches | 只读 | 只读 | 否 | — | — | 正式：已提交执行计划；现行：演示 mock | 否 | |",
        "FD016",
    )
    text = must_replace(
        text,
        "| FD031 | P01-ME-C01 | 人数 | Students | 数字 | 只读 | 否 | — | — | 正式：执行计划；现行：演示 mock | 否 | |",
        "| FD031 | P01-ME-C01 | 人数 | Students | 数字 | 只读 | 否 | — | — | 正式：执行计划预计人数；现行：演示 mock | 否 | 与 FD039 同一接口 |",
        "FD031",
    )
    text = must_replace(
        text,
        "| FD040 | P01-ME-L01 | 计划总Quota | Planned Total Quota | 数字 | 可编辑（经设置） | 否 | — | — | 本模块录入 | 否 | |",
        "| FD039 | P01-ME-L01 | 预计学生数 | Expected Students | 数字 | 只读 | 否 | — | — | 与 FD031 同一接口 | 否 | 表头；不是名单实际人数 |\n"
        "| FD040 | P01-ME-L01 | 计划总Quota | Planned Total Quota | 数字 | 可编辑（经设置） | 否 | — | — | 本模块录入 | 否 | |",
        "FD039",
    )
    text = must_replace(
        text,
        "| FD052 | P01-ME-M01 | 计划总Quota | Planned Total Quota | 数字 | 可编辑 | 是 | 公式预计 | BR011 | 本模块录入 | 否 | formula hint：学生数×组数×1.05 |",
        "| FD052 | P01-ME-M01 | 计划总Quota | Planned Total Quota | 数字 | 可编辑 | 是 | 公式预计 | BR011 | 本模块录入 | 否 | formula hint：预计学生数×组数×1.05 |",
        "FD052",
    )
    text = must_replace(
        text,
        "| BR011 | ME 预计 Quota | P01-ME-C01 / P01-ME-M01 | Quota＝学生数×组数×1.05，四舍五入。（已明确·tip/弹窗 hint） |",
        "| BR011 | ME 预计 Quota | P01-ME-C01 / P01-ME-M01 | Quota＝预计学生数×组数×1.05，四舍五入。（已明确·tip/弹窗 hint） |",
        "BR011",
    )
    text = must_replace(
        text,
        "ME Tab：专业、学生数、合计组数、计划总Quota、计划课程组数、计划课程组quota。以现行导出函数列为准。（已明确） |",
        "ME Tab：专业、预计学生数、合计组数、计划总Quota、计划课程组数、计划课程组quota。以现行导出函数列为准。（已明确） |",
        "BR016",
    )
    text = must_replace(
        text,
        "| BR016 | 导出列 | P01 导出 | GE Tab：类型、校选课类别、需开(2/3/总)、已开、进度、课程组quota。ME Tab：专业、预计学生数、合计组数、计划总Quota、计划课程组数、计划课程组quota。以现行导出函数列为准。（已明确） |",
        "| BR016 | 导出列 | P01 导出 | GE Tab：类型、校选课类别、需开(2/3/总)、已开、进度、课程组quota。ME Tab：专业、预计学生数、合计组数、计划总Quota、计划课程组数、计划课程组quota。以现行导出函数列为准。（已明确） |\n"
        "| BR017 | GE 需求人数来源 | P01-GE-C01 | 正式从已提交执行计划「选修类分类 · 修读要求」汇总本学期要修 GE 的专业批次人数；按专业挂文/商/理后展示三卡人数。"
        "2/3 学分人次按 BR001 由各批次标准学分折算，不是「其中多少人修 2 分、多少人修 3 分」。原型可用演示数据。"
        "接口字段名以执行计划模块为准，本文不另造字段名。（已明确） |",
        "BR017",
    )
    text = must_replace(
        text,
        "- 上游：开课时间设置（学期）、执行计划（正式需求人数，UC001）、校选类别映射",
        "- 上游：开课时间设置（学期）、执行计划（正式需求人数，BR017）、校选类别映射",
        "计划数据流",
    )
    text = must_replace(
        text,
        """## 11. 未确认事项

| 编号 | 事项 | 影响范围 |
|------|------|----------|
| UC001 | 正式环境需求人数接口字段（现行可为演示数据） | 需求卡 |
| UC002 | HTML 注释「文/商/理交叉可选 GE」是否仍为校规 | 需求政策（禁止当已明确） |
""",
        """## 11. 未确认事项

| 编号 | 事项 | 影响范围 |
|------|------|----------|
| — | 本版无未确认事项（原 UC001/UC002 已关闭：BR017；交叉可选不入校规） | — |
""",
        "计划 UC",
    )
    return text


def patch_arrange(text: str) -> str:
    text = bump_shell(text)
    text = must_replace(
        text,
        "| FD005 | P01-F01 | 提交状态 | taskSubmitStatus | 下拉 | 可编辑 | 否 | — | — | 本界面枚举（已提交/草稿/回退/停课） | 是 | 表头称「生效状态」；UC001 |",
        "| FD005 | P01-F01 | 生效状态 | taskSubmitStatus | 下拉 | 可编辑 | 否 | — | — | 本界面枚举（已生效/草稿/回退/停课） | 是 | 与 FD032 同一字段；无独立「提交状态」 |",
        "FD005",
    )
    text = must_replace(
        text,
        "| BR003 | ME开课 | P01-M-ME | 从校选选 Pending ME 生成；一门课一条任务。（已明确） |",
        "| BR003 | ME开课 | P01-M-ME | 从校选选 Pending ME 生成；一门课一条任务。"
        "ME 需借用他专业时**再开一条班**（本页另开选修班），不挂靠对方专业已有班。（已明确） |",
        "BR003",
    )
    text = must_replace(
        text,
        """## 11. 未确认事项

| 编号 | 事项 | 影响范围 |
|------|------|----------|
| UC001 | 筛选「提交状态」与表头「生效状态」文案是否统一 | P01-F01 / P01-L01 |
| UC002 | 选课端对可选批次的最终校验细则 | 下游选课 |
""",
        """## 11. 未确认事项

| 编号 | 事项 | 影响范围 |
|------|------|----------|
| UC002 | 选课端对可选批次的最终校验细则 | 下游选课 |
""",
        "安排 UC",
    )
    return text


def patch_roster(text: str) -> str:
    text = bump_shell(text)
    text = must_replace(
        text,
        "| FD007 | P01-F01 更多 | 生效状态 | taskSubmitStatus | 下拉 | 可编辑 | 否 | 本界面枚举（已提交/草稿/回退/停课） | 是 | |",
        "| FD007 | P01-F01 更多 | 生效状态 | taskSubmitStatus | 下拉 | 可编辑 | 否 | 本界面枚举（已生效/草稿/回退/停课） | 是 | 与安排页同一字段 |",
        "FD007",
    )
    text = must_replace(
        text,
        "| FD031 | P01-C01 ME | 学生数 | 计划/执行计划 | UC001 |",
        "| FD031 | P01-C01 ME | 预计学生数 | 选修开课计划（与计划侧同一接口；正式为执行计划预计人数） | 不是列表 FD054 实际名单人数 |",
        "FD031",
    )
    text = must_replace(
        text,
        """## 11. 未确认事项

| 编号 | 事项 | 影响范围 |
|------|------|----------|
| UC001 | ME 统计「学生数」与计划侧是否同一接口 | P01-C01 ME |
""",
        """## 11. 未确认事项

| 编号 | 事项 | 影响范围 |
|------|------|----------|
| — | 本版无未确认事项（原 UC001 已关闭：与计划侧同一接口，表头「预计学生数」） | — |
""",
        "名单 UC",
    )
    return text


def write_change_md(path: Path, menu: str, rows: list[tuple]) -> None:
    menu_path = MENU_PATH[menu]
    proto = PROTO[menu]
    lines = [
        f"# {menu}——需求调整变更说明",
        "",
        "> 模板：`参考文档/0、模板/需求调整变更说明模板（简版）20260901V3.docx`",
        f"> 对照文档：`{menu}{OLD_LABEL}` → `{menu}{NEW_LABEL}`",
        "",
        "## 1 版本信息",
        "",
        "| 项目 | 内容 |",
        "|------|------|",
        f"| 需求文档名称 | 厦大马来分校本科教务系统产品需求文档 — {menu} |",
        f"| 菜单路径 | {menu_path} |",
        f"| 上一有效版 → 本版 | {OLD_LABEL} → {NEW_LABEL} |",
        f"| 上一版文件 | {menu}{OLD_LABEL}.docx |",
        f"| 本版文件 | {menu}{NEW_LABEL}.docx |",
        "| 本版 PRD 模板 | V3.1 |",
        f"| 原型地址 | prototype/index.html → {proto} |",
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
        "详见上表「调整内容」。",
        "",
        "## 4 连带影响（可选）",
        "",
        "| 序号 | 影响到哪里 | 影响说明 | 需同步 |",
        "|------|------------|----------|--------|",
        "| 1 | 原型 / 开发 / 测试 | 以本版已明确条款为准；原型表头/筛选已对齐 | ☑原型 ☑开发 ☑测试 |",
        "",
    ]
    path.write_text("\n".join(lines), encoding="utf-8")


def run_one(menu: str, patcher, rows: list[tuple], md_to_docx, write_note_docx):
    old_md = menu_dir(menu) / f"{menu}{OLD_LABEL}" / f"{menu}{OLD_LABEL}.md"
    if not old_md.exists():
        raise SystemExit(f"找不到上一版：{old_md}")
    out_dir = version_dir(menu, "20260917", "V3")
    if out_dir.exists():
        raise SystemExit(f"拒绝覆盖已有版本文件夹：{out_dir}")
    out_dir.mkdir(parents=True)
    new_md = out_dir / f"{menu}{NEW_LABEL}.md"
    new_md.write_text(patcher(old_md.read_text(encoding="utf-8")), encoding="utf-8")
    md_to_docx(new_md, out_dir / f"{menu}{NEW_LABEL}.docx")
    note_stem = f"{menu}{OLD_LABEL}→{NEW_LABEL}变更说明"
    note_md = out_dir / f"{note_stem}.md"
    write_change_md(note_md, menu, rows)
    write_note_docx(note_md, out_dir / f"{note_stem}.docx", menu)
    print(f"OK {menu} {NEW_LABEL} -> {out_dir}")


def main():
    gen_mod, md_to_docx = load_docx_helpers()

    def write_note_docx(note_md: Path, out_path: Path, menu: str):
        meta = {
            "name": f"厦大马来分校本科教务系统产品需求文档 — {menu}",
            "path": MENU_PATH[menu],
            "versions": f"{OLD_LABEL} → {NEW_LABEL}",
            "from_file": f"{menu}{OLD_LABEL}.docx",
            "to_file": f"{menu}{NEW_LABEL}.docx",
            "prototype": PROTO[menu],
            "date": NOTE_DATE,
            "prd_template": "V3.1",
        }
        rows = gen_mod.parse_overview_rows(note_md.read_text(encoding="utf-8"))
        gen_mod.write_change_note_docx(note_md, out_path, meta, rows)

    run_one(
        "选修开课计划",
        patch_plan,
        [
            ("规则", "BR017", "GE 需求人数来源", "新增", "关闭 UC001：正式从已提交执行计划汇总文/商/理人数；2/3 学分人次按标准学分折算，不是把人数拆成两拨人；原型仍可演示"),
            ("其他", "—", "文/商/理交叉可选 GE", "删除", "关闭 UC002：不作为校规、不入 BR"),
            ("字段", "FD039", "ME 配额表「预计学生数」", "新增", "表头「学生数」→「预计学生数」；与需求卡 FD031 同一接口，不是名单实际人数"),
            ("规则", "BR011 / BR016", "ME Quota 公式与导出", "修改", "文案「学生数」→「预计学生数」"),
        ],
        md_to_docx,
        write_note_docx,
    )
    run_one(
        "选修开课安排",
        patch_arrange,
        [
            ("字段", "FD005", "查询区生效状态", "修改", "筛选「提交状态 / 已提交」→「生效状态 / 已生效」；与列表 FD032 同一字段 taskSubmitStatus"),
            ("其他", "UC001", "提交状态 vs 生效状态", "删除", "关闭：无独立「提交状态」字段"),
            ("规则", "BR003", "ME 开课", "修改", "明确借用他专业时再开一条班，不挂靠对方专业已有班"),
        ],
        md_to_docx,
        write_note_docx,
    )
    run_one(
        "选修开课名单",
        patch_roster,
        [
            ("字段", "FD031", "ME 统计「预计学生数」", "修改", "「学生数」→「预计学生数」；与计划侧同一接口；不是列表「人数」"),
            ("字段", "FD007", "查询区生效状态", "修改", "枚举「已提交」→「已生效」"),
            ("其他", "UC001", "ME 学生数是否同一接口", "删除", "关闭：同一接口"),
        ],
        md_to_docx,
        write_note_docx,
    )


if __name__ == "__main__":
    main()
