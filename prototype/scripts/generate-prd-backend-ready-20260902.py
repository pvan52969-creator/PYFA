#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2026-09-02：开课 12 菜单 PRD 后端就绪升版（模板 V3.1）+ 变更说明简版 V3。

升版新文件夹，禁止覆盖。纯文档。规格真源：可见 UI + 已明确规则；演示算法标「演示规则」。
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(SCRIPT_DIR))

from prd_folder_paths import version_dir  # noqa: E402

DATE = "20260902"
DATE_DISP = "2026 年 9 月 2 日"
CHANGE_DATE = "2026-09-02"


def load_batch():
    path = SCRIPT_DIR / "generate-prd-v3-20260901-batch.py"
    spec = importlib.util.spec_from_file_location("prd_batch_v3", path)
    mod = importlib.util.module_from_spec(spec)
    # Prevent main() on import: the batch only runs main under __main__
    spec.loader.exec_module(mod)
    return mod


B = load_batch()
ui, fd, fn, br = B.ui, B.fd, B.fn, B.br


def audit_change(extra: list | None = None):
    rows = [
        {
            "obj_type": "其他",
            "obj_id": "—",
            "where": "后端就绪升版",
            "type": "修改",
            "content": "按可见 UI 补全字段矩阵/状态枚举/逻辑实体/BR 副作用；供 AI 后端依据（禁止猜测未确认项）",
            "status": "已明确",
        }
    ]
    if extra:
        rows.extend(extra)
    return rows


def appendix(m: dict) -> str:
    lines = [
        "",
        "## 12. 状态枚举与转移（后端必读）",
        "",
        "下列枚举以现行原型行为为准；未列出的转移 **禁止自造**。",
        "",
    ]
    for st in m.get("states") or []:
        lines += [f"### {st['name']}", "", f"- 字段/口径：{st['field']}", "- 枚举："]
        for code, label in st["enums"]:
            lines.append(f"  - `{code}` — {label}")
        lines.append("- 转移/说明：")
        for t in st["transitions"]:
            lines.append(f"  - {t}")
        lines.append("")

    lines += [
        "## 13. 逻辑实体（无物理表名）",
        "",
        "| 逻辑实体 | 说明 | 关键键/唯一性（逻辑） |",
        "|----------|------|----------------------|",
    ]
    for e in m.get("entities") or []:
        lines.append(f"| {e[0]} | {e[1]} | {e[2]} |")

    lines += [
        "",
        "## 14. 后端实现约束",
        "",
        "- 规格真源：可见 UI 文案 + 本文档「已明确」条款；标注「演示规则」的不得当成已确认校政。",
        "- 标注「未确认」或 UC 的项：**禁止猜测实现**，需产品确认后再编码。",
        "- 权限矩阵未拍板：禁止自造 RBAC；接口可先按「登录用户可操作本菜单演示数据」占位。",
        "- 不做 OpenAPI 全文；对接字段以逻辑实体与功能清单为准。",
        "",
    ]
    for note in m.get("backend_notes") or []:
        lines.append(f"- {note}")
    lines.append("")
    return "\n".join(lines)


def write_md_enriched(m: dict, out: Path):
    B.DATE = DATE
    B.DATE_DISP = DATE_DISP
    B.CHANGE_DATE = CHANGE_DATE
    B.write_md(m, out)
    text = out.read_text(encoding="utf-8")
    # replace template date banner already uses DATE from B if write_md uses B.DATE - we set before call
    text = text.replace("20260901", DATE).replace("2026 年 9 月 1 日", DATE_DISP).replace("2026-09-01", CHANGE_DATE)
    # fix appendix insert before 附录
    marker = "### 附录：上一有效版"
    if marker in text:
        text = text.replace(marker, appendix(m) + marker)
    else:
        text = text.rstrip() + "\n" + appendix(m)
    out.write_text(text, encoding="utf-8")


def append_appendix_to_docx(m: dict, out: Path):
    """把 md 第 12–14 章同步写入 docx，避免 md/docx 章节不一致。"""
    from docx import Document

    doc = Document(str(out))
    tpl = B.tpl
    tpl.add_heading(doc, "12. 状态枚举与转移（后端必读）", 1)
    tpl.add_para(doc, "下列枚举以现行原型行为为准；未列出的转移禁止自造。")
    for st in m.get("states") or []:
        tpl.add_heading(doc, st["name"], 2)
        tpl.add_para(doc, f"字段/口径：{st['field']}")
        enum_rows = [[code, label] for code, label in st["enums"]]
        if enum_rows:
            tpl.add_grid_table(doc, ["代码", "含义"], enum_rows, [4.0, 16.0])
        tpl.add_para(doc, "转移/说明：")
        for t in st["transitions"]:
            tpl.add_para(doc, f"· {t}")
    tpl.add_heading(doc, "13. 逻辑实体（无物理表名）", 1)
    ent_rows = [list(e) for e in (m.get("entities") or [])]
    if ent_rows:
        tpl.add_grid_table(
            doc,
            ["逻辑实体", "说明", "关键键/唯一性（逻辑）"],
            ent_rows,
            [4.5, 8.0, 8.0],
        )
    else:
        tpl.add_para(doc, "无。")
    tpl.add_heading(doc, "14. 后端实现约束", 1)
    constraints = [
        "规格真源：可见 UI 文案 + 本文档「已明确」条款；标注「演示规则」的不得当成已确认校政。",
        "标注「未确认」或 UC 的项：禁止猜测实现，需产品确认后再编码。",
        "权限矩阵未拍板：禁止自造 RBAC；接口可先按「登录用户可操作本菜单演示数据」占位。",
        "不做 OpenAPI 全文；对接字段以逻辑实体与功能清单为准。",
    ]
    for line in constraints:
        tpl.add_para(doc, f"· {line}")
    for note in m.get("backend_notes") or []:
        tpl.add_para(doc, f"· {note}")
    doc.save(out)


def write_docx(m: dict, out: Path):
    B.DATE = DATE
    B.DATE_DISP = DATE_DISP
    B.CHANGE_DATE = CHANGE_DATE
    B.write_docx_from_md_structure(m, out)
    append_appendix_to_docx(m, out)


def write_change(m: dict, ver_path: Path):
    B.DATE = DATE
    B.CHANGE_DATE = CHANGE_DATE
    return B.write_change_note(m, ver_path)


# ─── MENUS ───────────────────────────────────────────────────────────────

MENUS: list[dict] = []


def add(m: dict):
    MENUS.append(m)


# —— P0: 开课计划 ——
add(
    {
        "cn": "开课计划",
        "en": "Course Offering Plan",
        "parent": "专业开课",
        "parent_en": "Major Offering",
        "path": "开课管理 → 专业开课 → 开课计划",
        "page": "page-course-offering-major",
        "prev": ("20260901", "V7"),
        "ver": "V8",
        "goal": "按学期生成/维护专业开课计划行，支持合班与计划生效，供开课安排取数。",
        "non_goal": "不含师资安排本体；不含名单维护本体；特殊开课入口行为以工具栏为准另见规则。",
        "uis": [
            ui("P01", "—", "开课计划", "页面", "点击菜单", "查询", "page-course-offering-major"),
            ui("P01-F01", "P01", "查询区", "区块", "默认展示", "—", "—"),
            ui("P01-L01", "P01", "计划列表", "区块", "默认展示", "—", "—"),
            ui("P01-M01", "P01", "生成开课任务", "弹窗", "生成开课任务", "新增", "modal-gen"),
            ui("P01-D01", "P01", "修改教学任务", "抽屉", "课程信息", "编辑 / 查看", "drawer-task"),
            ui("P01-D02", "P01", "合拆班", "抽屉", "合班", "编辑", "drawer-merge"),
        ],
        "fields": [
            fd("FD001", "P01-F01", "学年学期", "Academic Term", "下拉框", "可编辑", "可编辑", "可编辑", "是"),
            fd("FD002", "P01-F01", "专业", "Programme", "下拉框", "可编辑", "可编辑", "可编辑", note="筛选上课专业/批次侧"),
            fd("FD003", "P01-F01", "所属专业", "offeringProgramme", "下拉框", "可编辑", "可编辑", "可编辑"),
            fd("FD004", "P01-F01", "课号", "Course Code", "文本", "可编辑", "可编辑", "可编辑"),
            fd("FD005", "P01-F01", "课名", "Course Name", "文本", "可编辑", "可编辑", "可编辑"),
            fd("FD006", "P01-F01", "生效状态", "submitStatus", "下拉框", "可编辑", "可编辑", "可编辑", note="draft/submitted/reverted"),
            fd("FD010", "P01-L01", "开课学期", "Offering Term", "只读", "—", "只读", "只读"),
            fd("FD011", "P01-L01", "生效状态", "submitStatus", "状态", "—", "只读", "只读", note="UI 文案「生效状态」；代码 submitStatus"),
            fd("FD012", "P01-L01", "课程代码", "Course Code", "只读", "—", "只读", "只读"),
            fd("FD013", "P01-L01", "课程班名称", "Section Name", "只读", "—", "只读", "只读"),
            fd("FD014", "P01-L01", "标记", "Plan Kind", "只读", "—", "只读", "只读", note="专业开课/特殊开课等"),
            fd("FD015", "P01-L01", "课程类别", "Category", "只读", "—", "只读", "只读"),
            fd("FD016", "P01-L01", "选课类型", "Enrollment Type", "只读", "—", "只读", "只读", note="与安排侧「选课方式」同一业务语义时禁止建成两套码表（未确认是否同字段）"),
            fd("FD017", "P01-L01", "Prog. Batch", "Programme Batch", "只读", "—", "只读", "只读"),
            fd("FD018", "P01-L01", "存在新生", "Is New Intake", "只读", "—", "只读", "只读"),
            fd("FD019", "P01-L01", "学分", "Credits", "只读", "—", "只读", "只读"),
            fd("FD020", "P01-L01", "总学时", "Total Hours", "只读", "—", "只读", "只读"),
            fd("FD021", "P01-L01", "起止周", "Week Range", "只读", "—", "只读", "只读"),
            fd("FD022", "P01-L01", "所属部门", "Offering Unit", "只读", "—", "只读", "只读"),
            fd("FD023", "P01-L01", "所属专业", "offeringProgramme", "只读", "—", "只读", "只读"),
            fd("FD024", "P01-L01", "预置人数", "Preset Students", "只读", "—", "只读", "只读"),
            fd("FD030", "P01-D01", "选课方式", "Enrollment Mode", "下拉/标签", "可编辑", "条件可编辑", "只读"),
            fd("FD031", "P01-D01", "起止周", "Week Range", "文本", "可编辑", "条件可编辑", "只读"),
            fd("FD032", "P01-D01", "场地类型", "Classroom Attribute", "下拉框", "可编辑", "可编辑", "只读", "否", note="表头「场地类型」；按学时类型分行；默认普通教室"),
            fd("FD033", "P01-D01", "教室偏好", "Classroom Preference", "多选下拉", "可编辑", "可编辑", "只读", "否", note="参考教室可多选；可搜；选项随场地类型过滤（Classroom list）；空=无偏好"),
            fd("FD040", "P01-D02", "合班批次", "Prog. Batch", "多选", "可编辑", "可编辑", "只读", "是"),
        ],
        "funcs": [
            fn("F001", "P01-F01", "查询", "按钮", "点击", "—", "筛选计划列表", "刷新"),
            fn("F002", "P01-F01", "重置", "按钮", "点击", "—", "清空条件", "恢复"),
            fn("F003", "P01", "生成开课任务", "按钮", "点击", "已选学期", "打开生成弹窗；跳过已存在计划行", "生成成功", "—", "BR001"),
            fn("F004", "P01", "一键合班", "按钮", "点击", "勾选未生效草稿", "按一致性规则合班；清空分组与教师", "列表刷新", "—", "BR002"),
            fn("F005", "P01", "生效", "按钮", "勾选后", "草稿可生效", "submitStatus→submitted", "状态更新", "—", "BR003"),
            fn("F006", "P01", "删除", "按钮", "勾选后", "允许删除条件", "删除计划行", "刷新", "—", "BR004"),
            fn("F007", "P01-L01", "合拆班", "行操作", "点击", "—", "打开合拆班", "抽屉打开"),
            fn("F008", "P01-L01", "课程信息", "行操作", "点击", "—", "打开修改教学任务", "抽屉打开"),
        ],
        "rules": [
            br("BR001", "生成跳过已存在", "P01-M01", "同一学期下已存在的课+专业批次计划行跳过；自动合班仅作用于未生效草稿（已明确对照原型）。"),
            br("BR002", "合班一致性", "P01-D02", "合班须同课号/学分/学时/周次/选课类型；合班后清空相关教学班分组与教师安排（已明确）。"),
            br("BR003", "计划生效", "P01-L01", "草稿可生效为 submitted；撤回/回退为 reverted 的入口以现行原型可见按钮为准（部分入口可能隐藏）。"),
            br("BR004", "删除约束", "P01-L01", "已生效或已被安排引用的计划行是否可删：未确认。", "未确认"),
        ],
        "ucs": [
            ("UC001", "合班后总人数/预置人数累加口径终裁", "规则"),
            ("UC002", "选课类型与安排侧选课方式是否同一字段", "字段"),
        ],
        "flow": "选学期 → 生成计划 → 合班/改教学任务 → 计划生效 → 下游开课安排取数。",
        "upstream": "校历学期；课程库；专业批次；校选/特殊课程配置（按来源）",
        "downstream": "开课安排；开课名单预置；课程班汇总",
        "states": [
            {
                "name": "计划生效状态",
                "field": "submitStatus（列表「生效状态」）",
                "enums": [
                    ("draft", "草稿/未生效"),
                    ("submitted", "已生效"),
                    ("reverted", "已回退"),
                ],
                "transitions": [
                    "draft → submitted：生效",
                    "submitted → reverted：回退/撤回（入口以原型可见为准）",
                    "禁止自造第四状态；停课不属于计划行本状态（见安排/课程班）",
                ],
            }
        ],
        "entities": [
            ("OfferingPlanLine", "开课计划行（一课一专业批次一条，含合班后的班）", "学期+课号+专业批次（逻辑唯一；是否含选课类型未确认）"),
            ("MergeRelation", "合班关系", "合入/拆出批次集合"),
        ],
        "backend_notes": [
            "生成接口须幂等：重复生成跳过已存在行。",
            "合班副作用：清空分组与教师——安排侧数据需一并失效或清空（对照原型）。",
        ],
        "changes": audit_change(
            [
                {
                    "obj_type": "字段",
                    "obj_id": "FD011",
                    "where": "生效状态",
                    "type": "澄清",
                    "content": "明确枚举 draft/submitted/reverted；UI 文案为生效状态",
                    "status": "已明确",
                },
                {
                    "obj_type": "字段",
                    "obj_id": "FD010–FD024",
                    "where": "计划列表",
                    "type": "修改",
                    "content": "列表字段对齐现行动态表头（补课程班名称/Prog.Batch/所属部门专业等）",
                    "status": "已明确",
                },
            ]
        ),
    }
)

# —— P0: 开课安排 ——
add(
    {
        "cn": "开课安排",
        "en": "Course Offering Arrangement",
        "parent": "专业开课",
        "parent_en": "Major Offering",
        "path": "开课管理 → 专业开课 → 开课安排",
        "page": "page-course-major-offering-task-style2",
        "prev": ("20260901", "V7"),
        "ver": "V8",
        "goal": "在计划生效后完成 Course Setting 与师资安排，并支持安排生效与共同授课。",
        "non_goal": "停课统一入口在课程班；不含排课表操作。",
        "uis": [
            ui("P01", "—", "开课安排", "页面", "点击菜单", "查询", "page-course-major-offering-task-style2"),
            ui("P01-S01", "P01", "步骤1 Course Setting", "步骤", "步骤条", "编辑", "step-1"),
            ui("P01-S02", "P01", "步骤2 师资安排", "步骤", "步骤条", "编辑", "step-2"),
            ui("P01-F01", "P01", "查询区", "区块", "默认展示", "—", "—"),
            ui("P01-L01", "P01", "安排列表", "区块", "默认展示", "—", "—"),
            ui("P02", "P01", "分组工作台", "页面", "安排教师/分组", "编辑", "page-offering-grouping"),
            ui("P01-M01", "P01", "共同授课设置", "弹窗", "共同授课", "编辑", "modal-shared"),
        ],
        "fields": [
            fd("FD001", "P01-F01", "开课学期", "Offering Term", "下拉框", "可编辑", "可编辑", "可编辑", "是"),
            fd("FD002", "P01-F01", "课号", "Course Code", "文本", "可编辑", "可编辑", "可编辑"),
            fd("FD003", "P01-F01", "课名", "Course Name", "文本", "可编辑", "可编辑", "可编辑"),
            fd("FD004", "P01-F01", "生效状态", "taskSubmitStatus", "下拉框", "可编辑", "可编辑", "可编辑"),
            fd("FD005", "P01-F01", "共同授课", "Shared Teaching", "下拉框", "可编辑", "可编辑", "可编辑"),
            fd("FD006", "P01-F01", "授课确认", "Teacher Confirmation", "下拉框", "可编辑", "可编辑", "可编辑"),
            fd("FD010", "P01-L01", "开课学期", "Offering Term", "只读", "—", "只读", "只读"),
            fd("FD011", "P01-L01", "Course Code", "Course Code", "只读", "—", "只读", "只读"),
            fd("FD012", "P01-L01", "课程班名称", "Section Name", "只读", "—", "只读", "只读"),
            fd("FD013", "P01-L01", "标记", "Plan Kind", "只读", "—", "只读", "只读"),
            fd("FD014", "P01-L01", "所属部门", "Offering Unit", "只读", "—", "只读", "只读"),
            fd("FD015", "P01-L01", "所属专业", "offeringProgramme", "只读", "—", "只读", "只读"),
            fd("FD016", "P01-L01", "选课方式", "Enrollment Type", "只读", "—", "只读", "只读"),
            fd("FD017", "P01-L01", "Credits", "Credits", "只读", "—", "只读", "只读"),
            fd("FD018", "P01-L01", "起止周", "Week Range", "只读", "—", "只读", "只读"),
            fd("FD019", "P01-L01", "Prog. Batch", "Programme Batch", "只读", "—", "只读", "只读"),
            fd("FD020", "P01-L01", "小组数", "Group Count", "只读", "—", "只读", "只读"),
            fd("FD021", "P01-L01", "Lecturer", "Lecturer", "只读", "—", "只读", "只读"),
            fd("FD022", "P01-L01", "Coordinator", "Coordinator", "只读", "—", "只读", "只读"),
            fd("FD023", "P01-L01", "共同授课状态", "Shared Teaching Status", "只读", "—", "只读", "只读"),
            fd("FD024", "P01-L01", "共同授课课号", "Shared Teaching Courses", "只读", "—", "只读", "只读"),
            fd("FD025", "P01-L01", "生效状态", "taskSubmitStatus", "状态", "—", "只读", "只读"),
            fd("FD026", "P01-L01", "授课确认", "teachingConfirmStatus", "进度", "—", "只读", "只读"),
            fd("FD030", "P02", "小组名称", "Group Name", "文本", "可编辑", "可编辑", "只读", "是"),
            fd("FD031", "P02", "授课教师", "Lecturer", "选择器", "可编辑", "可编辑", "只读", "是"),
            fd("FD032", "P02", "学时类型", "Hour Type", "下拉框", "可编辑", "可编辑", "只读", "是"),
        ],
        "funcs": [
            fn("F001", "P01-F01", "查询", "按钮", "点击", "—", "筛选", "刷新"),
            fn("F002", "P01-S01", "切换至 Course Setting", "步骤", "点击", "—", "展示合班/Support/课程信息列", "步骤切换"),
            fn("F003", "P01-S02", "切换至师资安排", "步骤", "点击", "—", "展示教师/共同授课/授课确认", "步骤切换"),
            fn("F004", "P01-L01", "安排教师", "行操作", "点击", "—", "进入分组工作台", "打开 P02"),
            fn("F005", "P01-L01", "共同授课", "行操作", "点击", "未生效", "打开共同授课", "弹窗", "—", "BR002"),
            fn("F006", "P01", "生效", "按钮", "勾选后", "安排完整", "taskSubmitStatus→submitted", "状态更新", "提示不完整原因", "BR001"),
            fn("F007", "P01", "撤回/退回", "按钮", "勾选后", "已生效或流程允许", "回退状态", "状态更新", "—", "BR003"),
        ],
        "rules": [
            br("BR001", "安排完整度", "P01", "完整度不足不可生效；完整判定以原型校验提示为准（分组/师资/确认等）。超学时/欠学时是否阻断以原型二次确认为准（演示规则）。", "已明确"),
            br("BR002", "共同授课", "P01-M01", "已生效不可再设共同授课（已明确对照原型）。"),
            br("BR003", "撤回与退回", "P01", "撤回/退回差异及备注字段：未完全确认；以后端禁止猜测，入口以可见按钮为准。", "未确认"),
            br("BR004", "步骤数", "P01", "向导为 2 步：Course Setting、师资安排；原三步已合并（已明确对照原型注释）。", "已明确"),
        ],
        "ucs": [("UC001", "安排「完整」结构化 checklist 终裁", "规则")],
        "flow": "计划已生效 → Course Setting → 师资安排/确认 → 安排生效 → 名单/排课/Teaching Load。",
        "upstream": "开课计划已生效",
        "downstream": "开课名单；授课确认；排课计划；Teaching Load；课程班",
        "states": [
            {
                "name": "安排生效状态",
                "field": "taskSubmitStatus（列表「生效状态」）",
                "enums": [
                    ("draft", "草稿/未生效"),
                    ("submitted", "已生效"),
                    ("reverted", "已回退"),
                    ("cancelled", "停课（班级/组级停课结果）"),
                ],
                "transitions": [
                    "draft → submitted：安排生效（需完整度）",
                    "submitted → reverted：撤回/退回（入口以原型为准）",
                    "→ cancelled：通过课程班停课等入口（本菜单无停课主按钮）",
                    "与 teachingConfirmStatus、taskArrangementSubmittedAt 联动时禁止合并成单一状态字段",
                ],
            }
        ],
        "entities": [
            ("OfferingSection", "教学班/开课任务", "学期+课号+班标识"),
            ("OfferingGroup", "课程组/小组", "隶属 Section"),
            ("HourAssignment", "学时安排行（教师×学时类型×周次）", "隶属 Group/Section"),
            ("SharedTeachingLink", "共同授课关联", "共享码/关联课号集合"),
        ],
        "backend_notes": [
            "PRD 旧版三步作废；实现必须 2 步。",
            "分组工作台为跨菜单共用壳，接口需支持安排师资与名单编辑锁态（锁态细则未确认时禁止自造）。",
        ],
        "changes": audit_change(
            [
                {
                    "obj_type": "界面",
                    "obj_id": "P01-S01",
                    "where": "步骤条",
                    "type": "修改",
                    "content": "三步改为两步：Course Setting / 师资安排",
                    "status": "已明确",
                },
                {
                    "obj_type": "字段",
                    "obj_id": "FD001–FD006",
                    "where": "查询区",
                    "type": "新增",
                    "content": "补齐查询区（原 PRD 误写无查询区）",
                    "status": "已明确",
                },
            ]
        ),
    }
)

# —— P0: 开课名单 ——
add(
    {
        "cn": "开课名单",
        "en": "Offering Roster",
        "parent": "专业开课",
        "parent_en": "Major Offering",
        "path": "开课管理 → 专业开课 → 开课名单",
        "page": "page-course-major-offering-roster",
        "prev": ("20260901", "V4"),
        "ver": "V5",
        "goal": "维护已安排开课任务的学生名单与分组分配，支持退回。",
        "non_goal": "不含学籍主数据维护；选课应用生成名单的接口细节未确认。",
        "uis": [
            ui("P01", "—", "开课名单", "页面", "点击菜单", "查询", "page-course-major-offering-roster"),
            ui("P01-F01", "P01", "查询区", "区块", "默认展示", "—", "—"),
            ui("P01-L01", "P01", "开课任务列表", "区块", "默认展示", "—", "—"),
            ui("P01-D01", "P01", "管理名单", "抽屉/工作台", "管理名单", "编辑", "page-offering-grouping"),
        ],
        "fields": [
            fd("FD001", "P01-F01", "开课学期", "Offering Term", "下拉框", "可编辑", "可编辑", "可编辑", "是"),
            fd("FD002", "P01-F01", "上课专业", "Programme", "下拉框", "可编辑", "可编辑", "可编辑"),
            fd("FD003", "P01-F01", "所属部门", "Offering Unit", "下拉框", "可编辑", "可编辑", "可编辑"),
            fd("FD004", "P01-F01", "课号", "Course Code", "文本", "可编辑", "可编辑", "可编辑"),
            fd("FD005", "P01-F01", "课名", "Course Name", "文本", "可编辑", "可编辑", "可编辑"),
            fd("FD010", "P01-L01", "生效状态", "taskSubmitStatus", "状态", "—", "只读", "只读"),
            fd("FD011", "P01-L01", "名单状态", "Roster Status", "状态", "—", "只读", "只读", note="展示口径对照原型；枚举码未单独文档化处标未确认"),
            fd("FD012", "P01-L01", "分配情况", "Assign Status", "状态", "—", "只读", "只读"),
            fd("FD013", "P01-L01", "开课学期", "Offering Term", "只读", "—", "只读", "只读"),
            fd("FD014", "P01-L01", "课程号", "Course Code", "只读", "—", "只读", "只读"),
            fd("FD015", "P01-L01", "课程班名称", "Section Name", "只读", "—", "只读", "只读"),
            fd("FD016", "P01-L01", "选课方式", "Enrollment Type", "只读", "—", "只读", "只读"),
            fd("FD017", "P01-L01", "所属部门", "Offering Unit", "只读", "—", "只读", "只读"),
            fd("FD018", "P01-L01", "所属专业", "offeringProgramme", "只读", "—", "只读", "只读"),
            fd("FD019", "P01-L01", "名单人数", "Roster Count", "数字", "—", "只读", "只读"),
            fd("FD020", "P01-D01", "学号", "Student ID", "只读", "—", "只读", "只读"),
            fd("FD021", "P01-D01", "课程班/小组", "Section/Group", "文本", "—", "可编辑", "只读"),
            fd("FD022", "P01-D01", "学籍状态", "Student Status", "代码", "—", "只读", "只读", note="可入名单：Active+Normal（BR001）"),
        ],
        "funcs": [
            fn("F001", "P01-F01", "查询", "按钮", "点击", "—", "筛选", "刷新"),
            fn("F002", "P01-L01", "管理名单", "链接", "点击", "—", "进入名单工作台", "打开"),
            fn("F003", "P01", "退回", "按钮", "勾选后", "允许退回", "批量退回（可含备注）", "状态更新", "—", "BR002"),
            fn("F004", "P01-D01", "一键分配", "按钮", "点击", "—", "按规则分配小组", "刷新", "—", "BR003"),
            fn("F005", "P01-D01", "预置名单分配", "按钮", "点击", "—", "预置名单处理", "刷新"),
        ],
        "rules": [
            br("BR001", "可入名单学籍", "P01-D01", "仅 Active + Normal 可入名单（已明确）。"),
            br("BR002", "退回副作用", "P01", "退回时预置/手动生等保留策略：未完全确认；选修选课名单清理以原型提示为准。", "未确认"),
            br("BR003", "一键分配", "P01-D01", "算法细节为演示规则；小组上限合计校验以原型提示为准。", "未确认"),
        ],
        "ucs": [("UC001", "学籍异动生效学期与名单刷新", "规则"), ("UC002", "退回时各类名单保留策略", "规则")],
        "flow": "安排就绪 → 查询任务 → 管理名单/分配 → 退回（如需）。",
        "upstream": "开课安排；学籍；选课应用（选修）",
        "downstream": "课程班名单人数；排课人数",
        "states": [
            {
                "name": "名单相关展示状态",
                "field": "名单状态 / 分配情况（列表列）",
                "enums": [("（见原型展示）", "具体码表未单独冻结处标未确认")],
                "transitions": ["禁止在未确认码表情况下自造状态机；以列表展示值为验收口径"],
            }
        ],
        "entities": [
            ("RosterMembership", "名单成员", "Section/Group + StudentId"),
            ("RosterAssignRun", "分配操作记录", "操作者+时间+规则版本（逻辑）"),
        ],
        "backend_notes": ["管理名单主路径进入分组工作台，勿只实现空抽屉。"],
        "changes": audit_change(
            [
                {
                    "obj_type": "字段",
                    "obj_id": "FD010–FD012",
                    "where": "列表状态列",
                    "type": "新增",
                    "content": "补生效状态/名单状态/分配情况列",
                    "status": "已明确",
                }
            ]
        ),
    }
)


# —— P0: 授课确认管理 ——
add({
    "cn": "授课确认管理",
    "en": "Teaching Confirmation Admin",
    "parent": "课程班管理",
    "parent_en": "Course Class Management",
    "path": "开课管理 → 课程班管理 → 授课确认管理",
    "page": "page-course-teacher-confirmation-admin",
    "prev": ("20260901", "V2"),
    "ver": "V3",
    "goal": "管理端发送授课确认、跟踪教师确认进度，并支持代确认。",
    "non_goal": "不含教师端确认函交互本体（见教师端菜单）。",
    "uis": [
        ui("P01", "—", "授课确认管理", "页面", "点击菜单", "查询", "page-course-teacher-confirmation-admin"),
        ui("P01-F01", "P01", "查询区", "区块", "默认展示", "—", "—"),
        ui("P01-L01", "P01", "确认列表", "区块", "默认展示", "—", "—"),
        ui("P01-M01", "P01", "发送/代确认", "弹窗", "发送或代确认", "编辑", "modal"),
    ],
    "fields": [
        fd("FD001", "P01-F01", "开课学期", "Offering Term", "下拉框", "可编辑", "可编辑", "可编辑", "是"),
        fd("FD002", "P01-F01", "所属部门", "Department", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD003", "P01-F01", "教师姓名", "Teacher Name", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD004", "P01-F01", "工号", "Staff ID", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD005", "P01-F01", "课号", "Course Code", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD010", "P01-L01", "教师", "Lecturer", "只读", "—", "只读", "只读"),
        fd("FD011", "P01-L01", "确认包状态", "Confirmation Package Status", "状态", "—", "只读", "只读"),
        fd("FD012", "P01-L01", "课号/班摘要", "Course Summary", "只读", "—", "只读", "只读"),
        fd("FD020", "P01-M01", "确认意见", "Remark", "文本", "可编辑", "可编辑", "只读"),
    ],
    "funcs": [
        fn("F001", "P01-F01", "查询", "按钮", "点击", "—", "筛选", "刷新"),
        fn("F002", "P01", "发送确认", "按钮", "点击", "安排允许发送", "生成确认包并通知教师", "状态→待确认", "—", "BR001"),
        fn("F003", "P01", "代确认", "按钮", "点击", "权限允许（未确认）", "管理端确认", "状态→管理端确认", "—", "BR002"),
        fn("F004", "P01-L01", "查看历史", "链接", "点击", "—", "展示事件流", "打开"),
    ],
    "rules": [
        br("BR001", "发送前置", "P01", "发送前置（安排已生效/历史复制待确认等）以原型校验为准；未文档化分支标未确认。", "未确认"),
        br("BR002", "代确认权限", "P01", "代确认角色与数据范围未确认。", "未确认"),
        br("BR003", "状态分列", "P01", "确认包状态与班级 teachingConfirmStatus 必须分列存储，禁止混用单一 Status（已明确）。", "已明确"),
    ],
    "ucs": [("UC001", "代确认/发送权限矩阵", "权限"), ("UC002", "邮件/站内通知通道", "数据流")],
    "flow": "筛选 → 发送 → 教师确认/退回 → 代确认（如需）→ 齐套后下游可用。",
    "upstream": "开课安排师资；开课时间设置确认截止",
    "downstream": "教师端；排课入列；安排授课确认列",
    "states": [{
        "name": "确认包状态（教师×班）",
        "field": "Confirmation Package Status",
        "enums": [
            ("not_sent", "未发送"),
            ("pending", "待确认"),
            ("disagreed", "退回/不同意"),
            ("confirmed", "已确认"),
            ("admin_proxy", "管理端确认"),
        ],
        "transitions": [
            "not_sent → pending：发送",
            "pending → confirmed：教师同意",
            "pending → disagreed：教师不同意",
            "pending/disagreed → admin_proxy：代确认",
            "班级 teachingConfirmStatus（pending/partial/confirmed 等）由确认包聚合，禁止与包状态共用一字段",
        ],
    }],
    "entities": [
        ("ConfirmationPackage", "授课确认包", "教师+教学班+学期"),
        ("ConfirmationEvent", "确认事件", "发送/同意/不同意/代确认时间线"),
    ],
    "backend_notes": ["齐套判定影响排课入列与替换后是否打回草稿。"],
    "changes": audit_change([{
        "obj_type": "规则", "obj_id": "BR003", "where": "状态分列", "type": "新增",
        "content": "明确确认包状态与班级确认状态分列", "status": "已明确",
    }]),
})

# —— P0: 授课确认教师端 ——
add({
    "cn": "授课确认（教师端）",
    "en": "Teaching Confirmation Teacher",
    "parent": "课程班管理",
    "parent_en": "Course Class Management",
    "path": "开课管理 → 课程班管理 → 授课确认（教师端）",
    "page": "page-teacher-course-confirmation",
    "prev": ("20260901", "V2"),
    "ver": "V3",
    "goal": "教师查看待确认安排并同意/不同意。",
    "non_goal": "不含管理端发送。",
    "uis": [
        ui("P01", "—", "授课确认（教师端）", "页面", "点击菜单", "查询", "page-teacher-course-confirmation"),
        ui("P01-T01", "P01", "Pending", "页签", "默认", "编辑", "tab-pending"),
        ui("P01-T02", "P01", "History", "页签", "切换", "查看", "tab-history"),
        ui("P01-F01", "P01", "查询区", "区块", "默认展示", "—", "—"),
        ui("P01-L01", "P01-T01", "待确认列表", "区块", "默认展示", "—", "—"),
    ],
    "fields": [
        fd("FD001", "P01-F01", "开课学期", "Offering Term", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD010", "P01-L01", "课程/安排摘要", "Course Summary", "只读", "—", "只读", "只读"),
        fd("FD011", "P01-L01", "确认截止", "Deadline", "只读", "—", "只读", "只读", note="来自开课时间设置"),
        fd("FD012", "P01-L01", "确认包状态", "Package Status", "状态", "—", "只读", "只读"),
        fd("FD020", "P01-T01", "不同意意见", "Disagree Remark", "文本", "可编辑", "可编辑", "—", "条件", note="不同意时是否必填未确认"),
    ],
    "funcs": [
        fn("F001", "P01-T01", "同意", "按钮", "点击", "待确认且未锁", "确认包→confirmed", "刷新", "—", "BR001"),
        fn("F002", "P01-T01", "不同意", "按钮", "点击", "待确认且未锁", "确认包→disagreed", "刷新", "—", "BR001"),
        fn("F003", "P01-T02", "查看历史", "页签", "切换", "—", "只读历史", "展示"),
    ],
    "rules": [
        br("BR001", "截止锁定", "P01-T01", "截止后教师端是否锁定、管理端可否仍代确认：未确认。", "未确认"),
        br("BR002", "写回", "P01", "同意/不同意后写回确认包与班级 teachingConfirmStatus 聚合（已明确方向）。", "已明确"),
    ],
    "ucs": [("UC001", "截止后锁定与代确认关系", "规则")],
    "flow": "Pending → 同意/不同意 → History。",
    "upstream": "管理端发送；开课时间截止日期",
    "downstream": "管理端列表；排课齐套",
    "states": [{
        "name": "教师端可见确认包状态",
        "field": "同管理端确认包状态子集",
        "enums": [("pending", "待确认"), ("disagreed", "已退回"), ("confirmed", "已确认"), ("admin_proxy", "管理端已确认")],
        "transitions": ["仅教师可操作 pending→confirmed/disagreed；其他只读"],
    }],
    "entities": [("ConfirmationPackage", "同管理端", "教师本人数据范围")],
    "backend_notes": ["演示身份切换不得进入正式权限模型。"],
    "changes": audit_change([{
        "obj_type": "字段", "obj_id": "FD012", "where": "确认包状态", "type": "新增",
        "content": "列表显式确认包状态，避免与班级状态混用", "status": "已明确",
    }]),
})

# —— P0: 授课教师替换 ——
add({
    "cn": "授课教师替换",
    "en": "Teacher Replace",
    "parent": "课程班管理",
    "parent_en": "Course Class Management",
    "path": "开课管理 → 课程班管理 → 授课教师替换",
    "page": "page-course-offering-teacher-replace",
    "prev": ("20260901", "V1"),
    "ver": "V2",
    "goal": "在已安排师资的开课上替换教师，并处理确认与生效副作用。",
    "non_goal": "不含首次排教师（见开课安排）。",
    "uis": [
        ui("P01", "—", "授课教师替换", "页面", "点击菜单", "查询", "page-course-offering-teacher-replace"),
        ui("P01-T01", "P01", "教师替换", "页签", "默认", "编辑", "tab-replace"),
        ui("P01-T02", "P01", "替换记录", "页签", "切换", "查看", "tab-log"),
        ui("P01-F01", "P01-T01", "查询区", "区块", "默认展示", "—", "—"),
        ui("P01-L01", "P01-T01", "课程列表", "区块", "默认展示", "—", "—"),
        ui("P01-M01", "P01-T01", "替换教师", "弹窗", "操作列替换", "编辑", "modal-replace"),
    ],
    "fields": [
        fd("FD001", "P01-F01", "开课学期", "Offering Term", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD002", "P01-F01", "所属专业", "offeringProgramme", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD003", "P01-F01", "课号", "Course Code", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD004", "P01-F01", "课名", "Course Name", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD010", "P01-L01", "课程班名称", "Section Name", "只读", "—", "只读", "只读"),
        fd("FD011", "P01-L01", "任课教师", "Lecturer", "文本", "—", "只读", "只读"),
        fd("FD012", "P01-L01", "开课类型", "Offering Type", "只读", "—", "只读", "只读"),
        fd("FD013", "P01-L01", "生效状态", "taskSubmitStatus", "状态", "—", "只读", "只读"),
        fd("FD020", "P01-M01", "原教师", "From Lecturer", "只读", "只读", "只读", "只读"),
        fd("FD021", "P01-M01", "新教师", "To Lecturer", "选择器", "可编辑", "可编辑", "只读", "是"),
        fd("FD030", "P01-T02", "操作时间", "Operated At", "只读", "—", "—", "只读"),
        fd("FD031", "P01-T02", "原教师", "From", "只读", "—", "—", "只读"),
        fd("FD032", "P01-T02", "新教师", "To", "只读", "—", "—", "只读"),
    ],
    "funcs": [
        fn("F001", "P01-F01", "查询", "按钮", "点击", "—", "筛选", "刷新"),
        fn("F002", "P01-L01", "替换", "行操作", "点击", "允许替换", "打开替换弹窗", "打开", "—", "BR001"),
        fn("F003", "P01", "一键替换", "按钮", "点击", "勾选", "批量替换", "刷新", "—", "BR001"),
        fn("F004", "P01-M01", "确认替换", "按钮", "点击", "新教师已选", "写入教师并触发副作用", "关闭", "冲突提示", "BR001"),
    ],
    "rules": [
        br("BR001", "替换后确认与生效", "P01", "整行/一键替换后若授课确认未齐套：安排生效打回草稿，需重新下发/完成授课确认（已明确对照原型）。", "已明确"),
        br("BR002", "可替换前置", "P01-L01", "仅已安排教师的行可替换；是否仅已生效可替换以原型校验为准。", "已明确"),
        br("BR003", "共同授课联动", "P01", "替换是否联动关联班：未确认。", "未确认"),
        br("BR004", "时间冲突", "P01-M01", "替换时校验时间冲突；共同授课例外以原型提示为准（已明确对照提示文案）。", "已明确"),
    ],
    "ucs": [("UC001", "共同授课关联班是否同步替换", "规则")],
    "flow": "查询 → 替换/一键替换 → 可能打回草稿并重确认 → 记录可查。",
    "upstream": "开课安排师资；授课确认",
    "downstream": "授课确认重发；排课入列条件",
    "states": [{
        "name": "替换副作用对安排状态",
        "field": "taskSubmitStatus",
        "enums": [("submitted→draft", "未齐套时打回草稿")],
        "transitions": ["替换成功且未齐套：submitted → draft，并清空/重置相关确认包为待发送或待确认（细节以原型为准）"],
    }],
    "entities": [
        ("TeacherReplaceLog", "替换记录", "班+原教师+新教师+时间"),
        ("HourAssignment", "被替换的学时安排行", "教师外键更新"),
    ],
    "backend_notes": ["旧 PRD「是否重新确认未确认」已废止，以 BR001 为准。"],
    "changes": audit_change([{
        "obj_type": "规则", "obj_id": "BR001", "where": "替换后打回草稿", "type": "修改",
        "content": "由未确认改为已明确对照原型：未齐套则打回草稿并需重新确认", "status": "已明确",
    }]),
})

# —— P1: 特殊课程 ——
add({
    "cn": "特殊课程设置",
    "en": "Special Course Settings",
    "parent": "开课设置",
    "parent_en": "Offering Settings",
    "path": "开课管理 → 开课设置 → 特殊课程设置",
    "page": "page-special-course-settings",
    "prev": ("20260901", "V5"),
    "ver": "V6",
    "goal": "从课程库纳入特殊课程并维护学时/教室/Support/共同授课默认，供开课带出。",
    "non_goal": "不含开课安排本体。",
    "uis": [
        ui("P01", "—", "特殊课程设置", "页面", "点击菜单", "查询", "page-special-course-settings"),
        ui("P01-F01", "P01", "查询区", "区块", "默认展示", "—", "—"),
        ui("P01-L01", "P01", "特殊课程列表", "区块", "默认展示", "—", "—"),
        ui("P01-M01", "P01", "添加课程", "弹窗", "添加课程", "新增", "modal-add"),
        ui("P01-D01", "P01", "编辑特殊课程", "抽屉", "编辑", "编辑", "drawer-edit"),
    ],
    "fields": [
        fd("FD001", "P01-F01", "所属部门", "Offering Unit", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD002", "P01-F01", "课号", "Course Code", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD003", "P01-F01", "课名", "Course Name", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD010", "P01-L01", "课程代码", "Course Code", "只读", "—", "只读", "只读"),
        fd("FD011", "P01-L01", "课程名称", "Course Name", "只读", "—", "只读", "只读"),
        fd("FD012", "P01-L01", "所属部门", "Offering Unit", "只读", "—", "只读", "只读"),
        fd("FD013", "P01-L01", "所属专业", "offeringProgramme", "只读", "—", "只读", "只读"),
        fd("FD014", "P01-L01", "学时类型设置", "Hours Mode", "只读", "—", "只读", "只读"),
        fd("FD015", "P01-L01", "教室信息", "Classroom", "只读", "—", "只读", "只读"),
        fd("FD016", "P01-L01", "Support历史", "Support History", "只读", "—", "只读", "只读"),
        fd("FD017", "P01-L01", "Support专业", "Support Programmes", "只读", "—", "只读", "只读"),
        fd("FD018", "P01-L01", "共同授课课号", "Shared Teaching Courses", "只读", "—", "只读", "只读"),
        fd("FD020", "P01-D01", "学时模式", "hoursMode", "下拉框", "可编辑", "可编辑", "只读", "是", note="separate/partial/merge（对照原型）"),
        fd("FD021", "P01-D01", "场地类型", "Classroom Attribute", "下拉框", "可编辑", "可编辑", "只读", "否", note="表头「场地类型」；按学时类型分行；默认普通教室；枚举：普通/计算机/专业教室"),
        fd("FD022", "P01-D01", "教室偏好", "Classroom Preference", "多选下拉", "可编辑", "可编辑", "只读", "否", note="参考教室可多选；下拉可搜教室号/软件名；选项随场地类型过滤（Classroom list）；空=无偏好；存教室号数组"),
        fd("FD023", "P01-D01", "Support历史", "Support History", "下拉框", "可编辑", "可编辑", "只读", "是", note="Y/N"),
        fd("FD024", "P01-D01", "Support专业", "Support Programmes", "多选", "可编辑", "可编辑", "只读"),
        fd("FD025", "P01-D01", "共同授课课号", "Shared Teaching Courses", "选择器", "可编辑", "可编辑", "只读"),
        fd("FD030", "P01-M01", "课程", "Course", "选择器", "可编辑", "—", "—", "是"),
    ],
    "funcs": [
        fn("F001", "P01-F01", "查询", "按钮", "点击", "—", "筛选", "刷新"),
        fn("F002", "P01", "添加课程", "按钮", "点击", "—", "从课程库纳入", "刷新"),
        fn("F003", "P01-L01", "编辑", "行操作", "点击", "—", "打开编辑抽屉", "打开"),
        fn("F004", "P01", "删除", "按钮", "勾选后", "允许删除", "移出特殊课程池", "刷新", "—", "BR001"),
        fn("F005", "P01-D01", "保存", "按钮", "点击", "校验通过", "写入默认属性", "关闭"),
    ],
    "rules": [
        br("BR001", "删除约束", "P01", "已被开课引用的特殊课程能否删除：未确认。", "未确认"),
        br("BR002", "带出覆盖", "P01-D01", "开课安排新建或系统默认班自动带出；是否覆盖已改字段：未确认。", "未确认"),
        br("BR003", "教室偏好取值", "P01-D01", "教室偏好为参考教室多选（非必填）；选项来自教室名单且按同行场地类型过滤；切换场地类型后仅保留仍合法的已选项；空表示无偏好。", "已明确"),
    ],
    "ucs": [("UC001", "带出覆盖规则", "数据流")],
    "flow": "查询 → 添加 → 编辑默认属性 → 开课带出。",
    "upstream": "课程库；教室名单（Classroom list）",
    "downstream": "开课计划/安排特殊开课",
    "states": [{
        "name": "学时模式",
        "field": "hoursMode",
        "enums": [("separate", "分列"), ("partial", "部分合并"), ("merge", "合并")],
        "transitions": ["保存时写入；非法值拒绝"],
    }],
    "entities": [
        ("SpecialCourseProfile", "特殊课程配置", "课号唯一"),
        ("SpecialClassroomRequirement", "按学时类型的场地类型+教室偏好", "课号+学时类型；referenceClassrooms[]"),
    ],
    "backend_notes": [
        "禁止再用「默认属性」单行占位。",
        "教室偏好禁止建成自由文本；须为教室号多选（可搜），空=无偏好。",
    ],
    "changes": audit_change([{
        "obj_type": "字段", "obj_id": "FD020–FD025", "where": "编辑抽屉", "type": "修改",
        "content": "拆分学时模式/教室/Support/共同授课字段，取消默认属性占位", "status": "已明确",
    }]),
})

# —— P1: Teaching Load ——
add({
    "cn": "Teaching Load",
    "en": "Teaching Load",
    "parent": "课程班管理",
    "parent_en": "Course Class Management",
    "path": "开课管理 → 课程班管理 → Teaching Load",
    "page": "page-course-teacher-teaching-load",
    "prev": ("20260901", "V2"),
    "ver": "V3",
    "goal": "按周/学期/学年统计教师开课学时并提示超限。",
    "non_goal": "不含排课；导出模板未确认。",
    "uis": [
        ui("P01", "—", "Teaching Load", "页面", "点击菜单", "查询", "page-course-teacher-teaching-load"),
        ui("P01-T01", "P01", "统计维度", "页签", "周/学期/学年", "查询", "dimension-tabs"),
        ui("P01-F01", "P01", "查询区", "区块", "默认展示", "—", "—"),
        ui("P01-L01", "P01", "统计结果", "区块", "默认展示", "—", "—"),
        ui("P01-M01", "P01", "超限阈值", "弹窗", "设置阈值", "编辑", "modal-threshold"),
    ],
    "fields": [
        fd("FD001", "P01-F01", "开课学期", "Offering Term", "多选/下拉", "可编辑", "可编辑", "可编辑", note="最多 6 个学期（对照原型）"),
        fd("FD002", "P01-F01", "所属部门", "Department", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD003", "P01-F01", "教师类型", "Teacher Type", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD004", "P01-F01", "课程类型", "Course Type", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD005", "P01-F01", "工号", "Staff ID", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD006", "P01-F01", "姓名", "Name", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD010", "P01-L01", "教师", "Lecturer", "只读", "—", "只读", "只读"),
        fd("FD011", "P01-L01", "学时合计", "Total Hours", "数字", "—", "只读", "只读"),
        fd("FD012", "P01-L01", "是否超限", "Overloaded", "状态", "—", "只读", "只读"),
        fd("FD020", "P01-M01", "超限阈值", "Threshold", "数字", "可编辑", "可编辑", "只读"),
    ],
    "funcs": [
        fn("F001", "P01-F01", "查询", "按钮", "点击", "—", "重算统计", "刷新"),
        fn("F002", "P01-T01", "切换维度", "页签", "点击", "—", "按周/学期/学年聚合", "刷新"),
        fn("F003", "P01", "设置阈值", "按钮", "点击", "—", "打开阈值", "保存后刷新"),
    ],
    "rules": [
        br("BR001", "学时公式", "P01-L01", "演示规则：周学时×周次；共同授课/同时多组计一次（已明确对照原型注释，非正式校政）。", "已明确"),
        br("BR002", "数据源", "P01", "计入哪些安排状态（已生效/已确认等）：未完全冻结，禁止扩大计入范围。", "未确认"),
        br("BR003", "导出", "P01", "导出模板 UC，未确认。", "未确认"),
    ],
    "ucs": [("UC001", "导出模板", "功能"), ("UC002", "计入数据源终裁", "规则")],
    "flow": "选维度与筛选 → 查询统计 → 看超限。",
    "upstream": "开课安排学时；授课确认（若计入条件依赖）",
    "downstream": "无写下游（只读统计）",
    "states": [{
        "name": "统计维度",
        "field": "Dimension Tab",
        "enums": [("week", "按周"), ("term", "按学期"), ("year", "按学年")],
        "transitions": ["切换即重算"],
    }],
    "entities": [("TeachingLoadRow", "统计结果行", "教师+维度键"), ("LoadThreshold", "超限阈值配置", "维度/类型键")],
    "backend_notes": ["页面标题可为「教师开课学时统计」。"],
    "changes": audit_change([{
        "obj_type": "字段", "obj_id": "FD001–FD012", "where": "筛选与结果", "type": "修改",
        "content": "补齐多维筛选与超限展示，明确学时公式为演示规则", "status": "已明确",
    }]),
})

# —— P2: 开课时间 ——
add({
    "cn": "开课时间设置",
    "en": "Offering Time Setting",
    "parent": "开课设置",
    "parent_en": "Offering Settings",
    "path": "开课管理 → 开课设置 → 开课时间设置",
    "page": "page-course-time-setting",
    "prev": ("20260901", "V4"),
    "ver": "V5",
    "goal": "维护学年学期开课窗口、默认展示学期、授课确认截止及所属部门时间覆盖。",
    "non_goal": "不维护校历本身。",
    "uis": [
        ui("P01", "—", "开课时间设置", "页面", "点击菜单", "查询", "page-course-time-setting"),
        ui("P01-F01", "P01", "查询区", "区块", "默认展示", "—", "—"),
        ui("P01-L01", "P01", "学期配置列表", "区块", "默认展示", "—", "—"),
        ui("P01-M01", "P01", "新增/修改开课时间", "弹窗", "新增/修改", "新增 / 编辑", "modal"),
        ui("P01-D01", "P01", "所属部门开课时间", "展开区", "展开", "编辑", "expand"),
        ui("P01-M02", "P01-D01", "新增所属部门", "弹窗", "新增", "新增", "modal-unit"),
    ],
    "fields": [
        fd("FD001", "P01-F01", "学年学期", "Academic Term", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD002", "P01-F01", "默认展示学期", "Default Display Term", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD010", "P01-L01", "学年学期", "Academic Term", "只读", "—", "只读", "只读"),
        fd("FD011", "P01-L01", "教学周数", "Teaching Weeks", "系统生成", "只读", "只读", "只读"),
        fd("FD012", "P01-L01", "状态", "Window Status", "状态", "—", "只读", "只读", note="开放中/已截止"),
        fd("FD013", "P01-L01", "开课时间范围", "Offering Window", "文本", "—", "只读", "只读"),
        fd("FD014", "P01-L01", "授课确认截止日期", "Confirmation Deadline", "日期", "—", "只读", "只读"),
        fd("FD015", "P01-L01", "默认展示学期", "Default Display Term", "开关", "—", "可编辑", "只读"),
        fd("FD020", "P01-M01", "开课学期", "Academic Term", "下拉框", "可编辑", "禁用", "只读", "是"),
        fd("FD021", "P01-M01", "开课开始", "Open From", "日期时间", "可编辑", "可编辑", "只读", "是"),
        fd("FD022", "P01-M01", "开课截止", "Open To", "日期时间", "可编辑", "可编辑", "只读", "是"),
        fd("FD023", "P01-M01", "授课确认截止日期", "Confirmation Deadline", "日期", "可编辑", "可编辑", "只读"),
        fd("FD024", "P01-M01", "备注", "Remark", "文本", "可编辑", "可编辑", "只读"),
        fd("FD030", "P01-D01", "所属部门", "Offering Unit", "只读", "—", "只读", "只读"),
        fd("FD031", "P01-D01", "开放开始", "Unit Open From", "日期时间", "可编辑", "可编辑", "只读"),
        fd("FD032", "P01-D01", "开放截止", "Unit Open To", "日期时间", "可编辑", "可编辑", "只读"),
    ],
    "funcs": [
        fn("F001", "P01-F01", "查询", "按钮", "点击", "—", "筛选", "刷新"),
        fn("F002", "P01", "新增", "按钮", "点击", "—", "新增学期配置", "保存"),
        fn("F003", "P01-L01", "修改", "行操作", "点击", "—", "修改窗口", "保存"),
        fn("F004", "P01-L01", "删除", "按钮", "勾选后", "—", "删除配置", "刷新", "—", "BR002"),
        fn("F005", "P01-L01", "默认展示开关", "开关", "切换", "—", "唯一默认", "刷新", "—", "BR003"),
        fn("F006", "P01-D01", "保存部门时间", "按钮", "点击", "—", "写入覆盖窗口", "提示"),
    ],
    "rules": [
        br("BR001", "窗口校验", "P01-M01", "开课截止≥开始；部门窗口可超出全校并以部门为准（已明确对照原型提示）。", "已明确"),
        br("BR002", "删除", "P01-L01", "进行中学期是否可删：未确认。", "未确认"),
        br("BR003", "默认唯一", "P01-L01", "默认展示学期全局最多一个是（已明确）。", "已明确"),
    ],
    "ucs": [("UC001", "进行中学期删除策略", "规则")],
    "flow": "配置全校窗口 → 可选部门覆盖 → 设默认学期。",
    "upstream": "校历",
    "downstream": "各开课菜单学期筛选；教师确认截止",
    "states": [{
        "name": "开课窗口状态",
        "field": "Window Status",
        "enums": [("open", "开放中"), ("closed", "已截止")],
        "transitions": ["按当前时间相对开课开始/截止计算；部门覆盖时以部门窗口计算"],
    }],
    "entities": [
        ("TermOfferingWindow", "学期开课窗口", "学年学期唯一"),
        ("UnitOfferingWindow", "所属部门覆盖窗口", "学期+所属部门"),
    ],
    "backend_notes": ["列表状态枚举必须实现 open/closed。"],
    "changes": audit_change([{
        "obj_type": "字段", "obj_id": "FD012", "where": "状态", "type": "澄清",
        "content": "明确开放中/已截止枚举", "status": "已明确",
    }]),
})

# —— P2: 校选（基于已纠偏结构再升版）——
add({
    "cn": "校选课程管理",
    "en": "School Elective Course Management",
    "parent": "开课设置",
    "parent_en": "Offering Settings",
    "path": "开课管理 → 开课设置 → 校选课程管理",
    "page": "page-school-elective-courses",
    "prev": ("20260901", "V3"),
    "ver": "V4",
    "goal": "维护校选课库（GE/ME）、修读范围与开课默认，供选修开课取数。",
    "non_goal": "不含通识开课安排本体。",
    "uis": [
        ui("P01", "—", "校选课程管理", "页面", "点击菜单", "查询", "page-school-elective-courses"),
        ui("P01-T01", "P01", "GE/ME 类型页签", "区块", "默认展示", "—", "—"),
        ui("P01-F01", "P01", "查询区", "区块", "默认展示", "—", "—"),
        ui("P01-L01", "P01", "课程列表", "区块", "默认展示", "—", "—"),
        ui("P01-D01", "P01", "修读范围", "抽屉", "设置", "编辑", "drawer-school-elective-edit"),
        ui("P01-D02", "P01", "修改开课默认信息", "抽屉", "编辑", "编辑", "drawer-offering-edit"),
        ui("P01-M03", "P01", "查看修读范围", "弹窗", "查看", "查看", "modal-scope-view"),
    ],
    "fields": [
        fd("FD001", "P01-F01", "所属部门", "Offering Unit", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD002", "P01-F01", "状态", "Status", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD003", "P01-F01", "课号", "Course Code", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD010", "P01-L01", "课程代码", "Course Code", "只读", "—", "只读", "只读"),
        fd("FD011", "P01-L01", "所属部门", "Offering Unit", "只读", "—", "只读", "只读"),
        fd("FD012", "P01-L01", "所属专业", "offeringProgramme", "只读", "—", "只读", "只读"),
        fd("FD013", "P01-L01", "状态", "Status", "状态", "—", "只读", "只读", note="active=正常 / suspended=停课"),
        fd("FD020", "P01-D01", "修读范围类型", "Programme Scope Mode", "下拉框", "可编辑", "可编辑", "只读", "是", note="可选/不可选/不限"),
        fd("FD021", "P01-D01", "专业", "Programmes", "选择器", "可编辑", "可编辑", "只读", "条件"),
        fd("FD022", "P01-D01", "可选学生类型", "Eligible Student Types", "多选", "可编辑", "可编辑", "只读", "是"),
        fd("FD023", "P01-D01", "不可选年级学期", "Excluded Year-Semester", "多选", "可编辑", "可编辑", "只读"),
        fd("FD024", "P01-D01", "冲突课程", "Conflict Courses", "选择器", "可编辑", "可编辑", "只读"),
        fd("FD025", "P01-D01", "先修课程", "Prerequisite Courses", "选择器", "可编辑", "可编辑", "只读"),
    ],
    "funcs": [
        fn("F001", "P01-F01", "查询", "按钮", "点击", "—", "筛选", "刷新"),
        fn("F002", "P01-L01", "设置修读范围", "链接", "点击", "—", "打开抽屉", "打开"),
        fn("F003", "P01-D01", "保存修读范围", "按钮", "点击", "校验通过", "写入类型+专业等", "关闭", "—", "BR001"),
        fn("F004", "P01", "删除", "按钮", "勾选后", "—", "移出校选池", "刷新", "—", "BR002"),
    ],
    "rules": [
        br("BR001", "类型与专业联动", "P01-D01", "先类型后专业；不限不可选专业；可选与不可选只维护其一（已明确）。", "已明确"),
        br("BR002", "删除", "P01", "下游引用冲突策略未确认。", "未确认"),
        br("BR003", "状态枚举", "P01-L01", "正常=active，停课=suspended（已明确对照原型）。", "已明确"),
    ],
    "ucs": [("UC001", "删除与下游开课引用", "规则")],
    "flow": "GE/ME → 维护范围与默认 → 下游取数。",
    "upstream": "课程库；专业目录",
    "downstream": "选修开课；ME 开课",
    "states": [{
        "name": "校选课状态",
        "field": "Status",
        "enums": [("active", "正常"), ("suspended", "停课")],
        "transitions": ["批量改状态；停课影响下游取数（细节未确认）"],
    }],
    "entities": [
        ("SchoolElectiveCourse", "校选课", "课号+类型(GE/ME)"),
        ("ProgrammeScope", "修读范围", "mode + programmeKeys + studentTypes + years + conflicts + prereqs"),
    ],
    "backend_notes": ["修读范围持久化结构按 ProgrammeScope 逻辑实体拆字段。"],
    "changes": audit_change([{
        "obj_type": "规则", "obj_id": "BR003", "where": "状态枚举", "type": "澄清",
        "content": "明确 active/suspended", "status": "已明确",
    }]),
})

# —— P2: 课程班 ——
add({
    "cn": "课程班",
    "en": "Course Class Manifest",
    "parent": "课程班管理",
    "parent_en": "Course Class Management",
    "path": "开课管理 → 课程班管理 → 课程班",
    "page": "page-course-offering-manifest",
    "prev": ("20260901", "V2"),
    "ver": "V3",
    "goal": "汇总已开出课程班，提供停课等统一入口。",
    "non_goal": "不含开课计划生成。",
    "uis": [
        ui("P01", "—", "课程班", "页面", "点击菜单", "查询", "page-course-offering-manifest"),
        ui("P01-F01", "P01", "查询区", "区块", "默认展示", "—", "—"),
        ui("P01-L01", "P01", "课程班列表", "区块", "默认展示", "—", "—"),
    ],
    "fields": [
        fd("FD001", "P01-F01", "开课学期", "Offering Term", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD002", "P01-F01", "开课模块", "Offering Module", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD003", "P01-F01", "所属专业", "offeringProgramme", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD004", "P01-F01", "课号", "Course Code", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD005", "P01-F01", "课名", "Course Name", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD010", "P01-L01", "开课学期", "Offering Term", "只读", "—", "只读", "只读"),
        fd("FD011", "P01-L01", "开课模块", "Offering Module", "只读", "—", "只读", "只读"),
        fd("FD012", "P01-L01", "课程号", "Course Code", "只读", "—", "只读", "只读"),
        fd("FD013", "P01-L01", "课程班名称", "Section Name", "只读", "—", "只读", "只读"),
        fd("FD014", "P01-L01", "课程组名称", "Group Name", "只读", "—", "只读", "只读"),
        fd("FD015", "P01-L01", "状态", "Row Life Status", "状态", "—", "只读", "只读", note="含是否停课等展示；非计划「生效状态」字段名"),
        fd("FD016", "P01-L01", "所属专业", "offeringProgramme", "只读", "—", "只读", "只读"),
        fd("FD017", "P01-L01", "选课类型", "Enrollment Type", "只读", "—", "只读", "只读"),
        fd("FD018", "P01-L01", "学分", "Credits", "只读", "—", "只读", "只读"),
        fd("FD019", "P01-L01", "总学时", "Total Hours", "只读", "—", "只读", "只读"),
        fd("FD020", "P01-L01", "课程人数上限", "Capacity Limit", "数字", "—", "只读", "只读"),
        fd("FD021", "P01-L01", "当前学生名单人数", "Roster Count", "数字", "—", "只读", "只读"),
    ],
    "funcs": [
        fn("F001", "P01-F01", "查询", "按钮", "点击", "—", "筛选", "刷新"),
        fn("F002", "P01", "停课", "按钮", "勾选后", "已安排教师（含未生效）", "班级/组级停课", "状态更新", "—", "BR001"),
    ],
    "rules": [
        br("BR001", "停课前置", "P01", "已安排教师即可停（含未生效）；可组级停（已明确对照原型 title）。", "已明确"),
        br("BR002", "停课同步", "P01", "同步到各开课模块/排课/Teaching Load 的字段清单：未确认。", "未确认"),
    ],
    "ucs": [("UC001", "停课下游同步清单", "数据流")],
    "flow": "查询汇总 → 停课。",
    "upstream": "各开课模块安排/名单",
    "downstream": "安排 cancelled；排课剔除等（细节未确认）",
    "states": [{
        "name": "课程班行状态",
        "field": "Row Life Status / offeringCancelled",
        "enums": [("active", "未停课"), ("cancelled", "已停课")],
        "transitions": ["停课→cancelled；与安排 taskSubmitStatus=cancelled 对齐"],
    }],
    "entities": [("CourseClassRow", "课程班汇总行", "模块+学期+课号+班")],
    "backend_notes": ["列表不得再出现已下线的修读范围列。"],
    "changes": audit_change([{
        "obj_type": "字段", "obj_id": "FD010–FD021", "where": "列表", "type": "修改",
        "content": "对齐现行列表列；确认无修读范围列", "status": "已明确",
    }]),
})

# —— P2: 排课计划 ——
add({
    "cn": "排课计划",
    "en": "Scheduling Plan",
    "parent": "课程班管理",
    "parent_en": "Course Class Management",
    "path": "开课管理 → 课程班管理 → 排课计划",
    "page": "page-course-scheduling-plan",
    "prev": ("20260901", "V1"),
    "ver": "V2",
    "goal": "汇总授课确认齐套且安排已生效的学时安排，供下游排课消费。",
    "non_goal": "不含排课表操作；外部对接未确认。",
    "uis": [
        ui("P01", "—", "排课计划", "页面", "点击菜单", "查询", "page-course-scheduling-plan"),
        ui("P01-F01", "P01", "查询区", "区块", "默认展示", "—", "—"),
        ui("P01-L01", "P01", "学时安排列表", "区块", "默认展示", "—", "—"),
    ],
    "fields": [
        fd("FD001", "P01-F01", "开课学期", "Offering Term", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD002", "P01-F01", "开课模块", "Offering Module", "下拉框", "可编辑", "可编辑", "可编辑"),
        fd("FD003", "P01-F01", "课号", "Course Code", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD004", "P01-F01", "课程班名称", "Section Name", "文本", "可编辑", "可编辑", "可编辑"),
        fd("FD010", "P01-L01", "开课学期", "Offering Term", "只读", "—", "只读", "只读"),
        fd("FD011", "P01-L01", "开课模块", "Offering Module", "只读", "—", "只读", "只读"),
        fd("FD012", "P01-L01", "课号", "Course Code", "只读", "—", "只读", "只读"),
        fd("FD013", "P01-L01", "课程班名称", "Section Name", "只读", "—", "只读", "只读"),
        fd("FD014", "P01-L01", "课程组", "Group Name", "只读", "—", "只读", "只读"),
        fd("FD015", "P01-L01", "学时类型", "Hour Type", "只读", "—", "只读", "只读"),
        fd("FD016", "P01-L01", "教师", "Lecturer", "只读", "—", "只读", "只读"),
        fd("FD017", "P01-L01", "起止周", "Week Range", "只读", "—", "只读", "只读"),
        fd("FD018", "P01-L01", "周学时", "Weekly Hours", "只读", "—", "只读", "只读"),
        fd("FD019", "P01-L01", "总学时", "Total Hours", "只读", "—", "只读", "只读"),
        fd("FD020", "P01-L01", "同时授课/联动组", "Linked Group", "只读", "—", "只读", "只读"),
        fd("FD021", "P01-L01", "场地类型", "Venue Type", "只读", "—", "只读", "只读"),
        fd("FD022", "P01-L01", "教室偏好", "Classroom Preference", "只读", "—", "只读", "只读"),
    ],
    "funcs": [
        fn("F001", "P01-F01", "查询", "按钮", "点击", "—", "按入列条件筛选", "刷新", "—", "BR001"),
        fn("F002", "P01-F01", "重置", "按钮", "点击", "—", "清空条件", "恢复"),
    ],
    "rules": [
        br("BR001", "入列条件", "P01-L01", "授课确认齐套且任务安排已生效；共同授课须关联班均齐套（已明确对照页面说明）。", "已明确"),
        br("BR002", "外部对接", "P01", "本页默认只读汇总；推送/拉取外部排课未确认。", "未确认"),
    ],
    "ucs": [("UC001", "外部排课接口", "数据流"), ("UC002", "与本仓库排课模块切分", "范围")],
    "flow": "查询已齐套学时安排 → 供下游排课。",
    "upstream": "开课安排生效；授课确认齐套",
    "downstream": "外部/本仓库排课（未确认）",
    "states": [{
        "name": "入列过滤",
        "field": "（查询结果集）",
        "enums": [("eligible", "满足 BR001"), ("hidden", "不满足则不出现")],
        "transitions": ["确认/生效变化后重算入列"],
    }],
    "entities": [("SchedulingPlanRow", "排课计划行", "学时安排行投影")],
    "backend_notes": ["无写 API 直至 UC001 确认。"],
    "changes": audit_change([{
        "obj_type": "字段", "obj_id": "FD010–FD022", "where": "列表", "type": "修改",
        "content": "补齐学期/模块/周学时/场地等列表列", "status": "已明确",
    }]),
})


def main():
    allow = "--allow-overwrite" in sys.argv
    B.DATE = DATE
    B.DATE_DISP = DATE_DISP
    B.CHANGE_DATE = CHANGE_DATE
    B.ALLOW_OVERWRITE = allow
    B.TEMPLATE_LABEL = "V3.1"
    written = []
    assert len(MENUS) == 12, len(MENUS)
    # 完整版已覆盖 V2（开课安排 2026-09-03；其余 11 菜单 remaining-prd-complete 2026-09-03）
    SKIP_BATCH_MENUS = {
        "开课安排",
        "开课计划",
        "开课名单",
        "校选课程管理",
        "特殊课程设置",
        "授课确认管理",
        "授课确认（教师端）",
        "Teaching Load",
        "授课教师替换",
        "课程班",
        "排课计划",
        "开课时间设置",
    }
    for m in MENUS:
        if m["cn"] in SKIP_BATCH_MENUS:
            print(f"skip batch write: {m['cn']}（以手工完整 PRD 为准）")
            continue
        ver_path = version_dir(m["cn"], DATE, m["ver"])
        if ver_path.exists() and not allow:
            raise SystemExit(f"拒绝覆盖已有版本目录：{ver_path}（加 --allow-overwrite 可覆盖）")
        ver_path.mkdir(parents=True, exist_ok=True)
        md = ver_path / f"{m['cn']}{DATE}{m['ver']}.md"
        docx = ver_path / f"{m['cn']}{DATE}{m['ver']}.docx"
        write_md_enriched(m, md)
        write_docx(m, docx)
        write_change(m, ver_path)
        written.append((m["cn"], m["ver"], ver_path))
        print(f"OK {m['cn']} {m['ver']} → {ver_path.relative_to(ROOT)}")
    print(f"\nTotal: {len(written)} overwrite={allow}")


if __name__ == "__main__":
    main()
