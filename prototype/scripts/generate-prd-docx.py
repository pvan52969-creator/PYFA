#!/usr/bin/env python3
"""Generate 培养方案管理 PRD docx with bordered tables matching XMUM template."""

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "参考文档" / "培养方案管理系统产品需求文档.docx"

# A4 横向：可排版宽度约 25.7 cm（页宽 29.7 − 左右边距）
LANDSCAPE_SCALE = 1.55
FIELD_TABLE_COL_WIDTHS = [1.2, 3.1, 3.4, 1.9, 1.1, 3.9, 4.4, 1.9, 2.5]


def scale_widths(widths):
    if isinstance(widths, tuple):
        return tuple(round(w * LANDSCAPE_SCALE, 1) for w in widths)
    return [round(w * LANDSCAPE_SCALE, 1) for w in widths]


def set_document_landscape(doc):
    for sec in doc.sections:
        sec.orientation = WD_ORIENT.LANDSCAPE
        sec.page_width = Cm(29.7)
        sec.page_height = Cm(21)
        sec.left_margin = Cm(2.0)
        sec.right_margin = Cm(2.0)
        sec.top_margin = Cm(2.0)
        sec.bottom_margin = Cm(2.0)

FIELD_HEADERS = [
    "序号", "字段中文名称", "英文名称", "字段类型", "必填",
    "校验规则\n（没有明确规则时先限制字符即可，放宽）",
    "备注（如下拉框取值来源、说明等）", "是否代码集取值", "数据格式样例\n（无特定格式留空）",
]


def set_table_borders(table):
    tbl = table._tbl
    tblPr = tbl.tblPr
    if tblPr is None:
        tblPr = OxmlElement("w:tblPr")
        tbl.insert(0, tblPr)
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), "4")
        el.set(qn("w:space"), "0")
        el.set(qn("w:color"), "000000")
        borders.append(el)
    tblPr.append(borders)


def set_col_widths(table, widths_cm):
    for row in table.rows:
        for i, w in enumerate(widths_cm):
            row.cells[i].width = Cm(w)


def add_para(doc, text, bold=False, size=11):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(size)
    run.font.name = "宋体"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "宋体")
    return p


def add_heading(doc, text, level=1):
    h = doc.add_heading(text, level=level)
    for run in h.runs:
        run.font.name = "黑体"
        run._element.rPr.rFonts.set(qn("w:eastAsia"), "黑体")
    return h


def add_kv_table(doc, rows, col_widths=(5, 18.5)):
    table = doc.add_table(rows=len(rows), cols=2)
    set_table_borders(table)
    set_col_widths(table, col_widths)
    for i, (k, v) in enumerate(rows):
        c0, c1 = table.rows[i].cells
        c0.text = k
        c1.text = v
        for cell in (c0, c1):
            for p in cell.paragraphs:
                for run in p.runs:
                    run.font.size = Pt(10.5)
                    run.font.name = "宋体"
                    run._element.rPr.rFonts.set(qn("w:eastAsia"), "宋体")
        c0.paragraphs[0].runs[0].bold = True
    doc.add_paragraph()
    return table


def add_grid_table(doc, headers, rows, col_widths=None):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    set_table_borders(table)
    hdr = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = h
        for p in hdr[i].paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.bold = True
                run.font.size = Pt(9)
                run.font.name = "宋体"
                run._element.rPr.rFonts.set(qn("w:eastAsia"), "宋体")
    for ri, row in enumerate(rows):
        cells = table.rows[ri + 1].cells
        for ci, val in enumerate(row):
            cells[ci].text = str(val)
            for p in cells[ci].paragraphs:
                for run in p.runs:
                    run.font.size = Pt(9)
                    run.font.name = "宋体"
                    run._element.rPr.rFonts.set(qn("w:eastAsia"), "宋体")
    if col_widths:
        set_col_widths(table, col_widths)
    doc.add_paragraph()
    return table


def add_field_table(doc, title, rows):
    add_para(doc, title, bold=True)
    add_grid_table(doc, FIELD_HEADERS, rows, col_widths=FIELD_TABLE_COL_WIDTHS)


def add_function_item(doc, num, name, en_name, desc, interaction, note, drilldown):
    add_para(doc, f"{num}、功能按钮——{name}（英文名称：{en_name}）", bold=True)
    add_para(doc, "a. 功能说明（描述、业务的事件交互、备注信息等）：")
    add_para(doc, f"· 描述：{desc}")
    add_para(doc, f"· 业务的事件交互：{interaction}")
    add_para(doc, f"· 备注信息（校验规则补充、其他说明等）：{note}")
    add_para(doc, f"b. 下钻页面说明（备注说明）：{drilldown}")
    doc.add_paragraph()


def add_menu_block(doc, section_no, title, status, intro, list_fields, search_fields,
                   flow_rel, flow_pre, flow_out, biz_flow, proto_link,
                   field_tables=None, functions=None):
    add_heading(doc, f"{section_no}{title}（需求确认状态：{status}）", level=4)
    add_para(doc, "菜单介绍", bold=True)
    add_kv_table(doc, [("菜单介绍", ""), ("菜单内容简介", intro)])
    add_para(doc, "页面展示字段信息", bold=True)
    add_kv_table(doc, [("页面展示字段信息", list_fields)])
    add_para(doc, "支持查询检索的字段信息", bold=True)
    add_kv_table(doc, [("支持查询检索的字段信息", search_fields)])
    add_para(doc, "数据前后流转关系（说明、前置条件、下游输出等）", bold=True)
    add_kv_table(doc, [
        ("1）关系说明", flow_rel),
        ("2）前置条件", flow_pre),
        ("3）下游输出", flow_out),
    ])
    add_para(doc, "5、业务流关系（操作流程）", bold=True)
    add_kv_table(doc, [("5、业务流关系（操作流程）", biz_flow)])
    add_para(doc, "6、原型参考链接", bold=True)
    add_kv_table(doc, [("6、原型参考链接", proto_link)])
    if field_tables:
        add_para(doc, "新增—字段信息表", bold=True)
        for ft_title, ft_rows in field_tables:
            add_field_table(doc, ft_title, ft_rows)
    if functions:
        add_para(doc, "（3）菜单功能清单", bold=True)
        for fn in functions:
            add_function_item(doc, *fn)


def build():
    doc = Document()
    set_document_landscape(doc)

    add_heading(doc, "厦大马来分校本科教务系统产品需求文档", 0)
    add_para(doc, "文档版本：V1.2")
    add_para(doc, "创建日期：2026 年 6 月 10 日")
    add_para(doc, "修订说明：V1.2 同步原型规则——开课学期/实际学期映射、学分校验、筛选条件、Bloom 统计、执行计划 TAB2 实际开课学期列等")
    add_para(doc, "模块范围：培养方案管理（Curriculum Management）")
    add_para(doc, "对应原型：prototype/index.html、prototype/app.js")
    doc.add_paragraph()

    add_heading(doc, "文档概述", 1)
    add_heading(doc, "1.1 文档目的", 2)
    add_para(doc, "本文档为厦大马来分校教务系统「培养方案管理」模块提供标准化需求输入格式，依据已完成的可交互原型整理功能、字段、业务规则与数据流转，确保后续开发符合业务逻辑与本地化要求，可直接用于需求评审。")
    add_heading(doc, "1.2 开发背景", 2)
    add_kv_table(doc, [
        ("开发模式", "边分析边迭代，分模块生成可交互原型"),
        ("目标用户", "Programme Office、Academic Affairs、Senate 审批人员、培养方案制定人员"),
        ("覆盖范围", "本科生培养方案版本制定、审批、变更、执行计划及数据统计"),
    ], col_widths=scale_widths((3, 13)))
    add_heading(doc, "1.3 文档说明", 2)
    add_para(doc, "本文档依据现有原型逆向整理；已确认需求标记为「已确认」；导出模板等待补充标记为「待确认」。入学批次编码：每年 02→04→09。")

    add_heading(doc, "系统分析", 1)
    add_heading(doc, "2.1 应用目录——培养方案管理", 2)
    add_grid_table(doc,
        ["一级目录", "一级目录英文名称", "二级目录", "二级目录英文名称", "三级目录", "备注说明"],
        [
            ["概览", "Overview", "操作流程图", "Workflow Diagram", "—", "嵌入主业务流程图，支持缩放"],
            ["方案版本", "Programme Version", "方案版本管理", "Programme Version Management", "—", "多版本 CRUD、批量提交/导出"],
            ["方案版本", "Programme Version", "版本审批", "Programme Version Approval", "—", "三级审批待办/进行中/历史"],
            ["方案版本", "Programme Version", "版本查询", "Programme Version Query", "—", "只读查看已通过版本"],
            ["方案版本", "Programme Version", "版本编辑（共用）", "Programme Structure Editing", "TAB1/TAB2/TAB3", "制定/查看/变更/执行计划共用"],
            ["方案版本变更", "Programme Change", "方案版本变更申请", "Change Application", "—", "对已审批版本发起变更"],
            ["方案版本变更", "Programme Change", "方案版本变更审核", "Change Review", "—", "变更三级审批"],
            ["专业批次执行计划", "Programme Intake Execution Plan", "专业批次执行计划", "Programme Intake Execution Plan", "—", "按入学批次独立生成/编辑，不回写版本"],
            ["数据统计", "Statistics", "Bloom's Taxonomy Charts", "Bloom's Taxonomy Charts", "—", "Bloom 分布统计"],
        ],
        col_widths=scale_widths([2.0, 2.5, 2.5, 3.2, 2.0, 4.3]))

    add_heading(doc, "2.2 培养方案管理——系统需求", 2)
    add_heading(doc, "2.2.1 方案版本（英文名称：Programme Version）（需求确认状态：已确认）", 3)
    add_para(doc, "模块介绍：管理各专业不同入学批次的培养方案版本全生命周期，包括版本制定、三级审批、只读查询、版本导出及批次链衔接；是执行计划与方案版本变更的上游数据源。")

    # ── 2.2.1.1 方案版本管理 ──
    add_menu_block(
        doc, "2.2.1.1 ", "方案版本管理（英文名称：Programme Version Management）", "已确认",
        intro="用于管理各专业培养方案版本的创建、编辑、删除、提交审批、批量导出及版本引用查询。同一专业可存在多个按批次链衔接的版本；支持按专业、版本过滤；列表展示审批状态、批次区间、引用情况。",
        list_fields="勾选框、培养方案版本、审批状态、专业代码、学制、版本、开始批次、截止批次、授予学位、版本引用情况、操作。",
        search_fields="专业（Major）、审批状态（draft/pending/approved/rejected）。",
        flow_rel="用户在列表页发起增删改查、提交、导出；新增时校验批次链后创建草稿并进入三 TAB 编辑；提交时校验必修最低学分后写入审批队列；审批通过后 status=approved 并回填上一版本截止批次；导出汇总所选版本方案内容（模板待确认）。",
        flow_pre="已维护专业主数据（代码、学制、学位）；已维护入学批次代码集（02/04/09）；课程库可用于 TAB2 选课。",
        flow_out="已通过版本供专业批次执行计划生成、方案版本变更申请、版本查询、Bloom 统计；引用数关联 EXEC_PLANS。",
        biz_flow="操作流程：进入【方案版本管理】→ 过滤查询 → 新增版本 → TAB1 分类 → TAB2 课程 → TAB3 进程表 → 保存（二次确认后返回列表）→ 提交审批 → 【版本审批】三级流程 → 通过后查询/执行计划/变更。",
        proto_link="prototype/index.html#page-version-list",
        field_tables=[
            ("新增/查看版本——弹窗（新增培养方案版本）", [
                ["1", "专业", "Major", "下拉框", "是", "从专业主数据选择", "选择后自动带出学制、学位", "是", "Finance 金融学"],
                ["2", "学制（年）", "Duration", "只读输入框", "是", "正整数", "随专业自动带出", "否", "4"],
                ["3", "授予学位", "Degree Awarded", "只读输入框", "是", "—", "随专业自动带出", "是", "经济学学士"],
                ["4", "版本号", "Version Code", "只读输入框", "是", "通常与开始批次一致", "随开始批次自动生成", "否", "202509"],
                ["5", "开始批次", "Start Intake", "下拉框", "是", "不得早于当前有效版本下一批次", "展示批次衔接预览", "是", "2025/09"],
                ["6", "培养方案名称", "Programme Name", "只读输入框", "否", "自动生成", "如 Course Structure of Finance (202509 Version)", "否", ""],
            ]),
            ("版本编辑——TAB1（课程分类、英文名：Course Classification）", [
                ["1", "Heading 1（一级分类）", "Classification H1", "下拉框", "是", "预设枚举", "一级不可编辑/删除", "是", "Compulsory Courses"],
                ["2", "Heading 2（二级分类）", "Classification H2", "下拉框", "是", "随 H1 联动", "顶部「+ 新增分类」仅新增二级", "是", "University Core"],
                ["3", "修读类型", "Study Type", "下拉框", "是", "compulsory/elective", "必修/选修", "是", "必修 Compulsory"],
                ["4", "三级分类名称", "Classification H3", "输入框", "条件", "L2 有子级时必填", "二级行点击「+子级」", "否", "Arts"],
                ["5", "最低学分", "Credits Min", "数值框", "是", "非负整数", "必修 L2：min=max", "否", "30"],
                ["6", "最高学分", "Credits Max", "数值框", "是", "≥ min", "选修 L2 可设区间", "否", "45"],
                ["7", "课程数", "Course Count", "数值框", "否", "非负整数", "L3 可编辑", "否", "8"],
            ]),
            ("版本编辑——TAB1 选修课学期修读要求矩阵", [
                ["1", "学期", "Semester", "下拉框", "是", "Y1S1~Y4S3 不可重复", "4 学年×3 学期；执行计划生成时同步旋转", "是", "Y1S1"],
                ["2", "最低学分要求", "Credits Min", "数值框", "是", "非负整数", "—", "否", "3"],
                ["3", "最高学分限制", "Credits Max", "数值框", "是", "≥ min", "—", "否", "6"],
                ["4", "要求课程数", "Course Count", "数值框", "否", "非负整数", "—", "否", "2"],
            ]),
            ("版本编辑——TAB1 学分校验规则（已确认）", [
                ["1", "必修二级（有三级）", "—", "—", "—", "三级最低合计=二级最低=二级最高", "保存/提交时校验", "否", ""],
                ["2", "选修二级（有三级）", "—", "—", "—", "三级最低合计≤二级最低≤二级最高", "保存/提交时校验", "否", ""],
                ["3", "TAB2 必修添加", "—", "—", "—", "二级累计≤最高", "添加时校验", "否", ""],
                ["4", "TAB2 必修提交", "—", "—", "—", "最低≤已配≤最高", "提交版本时校验", "否", ""],
                ["5", "TAB2 选修", "—", "—", "—", "已配≥最低；最高仅限制学生选课", "添加/提交校验", "否", ""],
            ]),
            ("版本编辑——TAB2 Step1（基础信息、英文名：General Information）", [
                ["1", "课号", "Course Code", "选择器", "是", "从课程库选取，不可重复", "课程库选择器", "否", "FIN101"],
                ["2", "课名", "Course Name", "只读", "是", "随课程库带出", "—", "否", ""],
                ["3", "Classification(H1/H2/H3)", "Classification", "下拉框", "是", "须先完成 TAB1", "H3 在 L2 有子级时必填", "是", ""],
                ["4", "学分", "Credit Value", "数值", "是", "正数", "—", "否", "3"],
                ["5", "开课学期", "Offering Semester", "下拉/开关", "条件", "必修强制；选修可开关", "Y1S1~YnS3；版本内为模板学期，不含具体年月", "是", "Y1S1"],
                ["6", "课程性质", "Course Nature", "只读", "是", "compulsory/elective", "根据 H1 分类自动判定；显示必修/选修", "是", "必修"],
                ["7", "授课语种", "Medium of Instruction", "下拉框", "否", "—", "—", "是", "English"],
                ["8", "课程简介", "Synopsis", "文本域", "否", "—", "—", "否", ""],
                ["9", "参考资料", "References", "文本域", "否", "—", "—", "否", ""],
            ]),
            ("版本编辑——TAB2 Step2（课程学习成果、英文名：Course Learning Outcome）", [
                ["1", "目标编号", "CLO", "输入框", "是", "编码唯一 CLO1/CLO2", "—", "否", "CLO1"],
                ["2", "目标内容", "Outcome", "文本域", "是", "最多 100 字符", "—", "否", ""],
                ["3", "布鲁姆分类层级", "Bloom's Taxonomy Level", "下拉框", "是", "C1~C4,A1~A3,P1~P2", "—", "是", "C2"],
                ["4", "教学方法", "Teaching Methods", "下拉多选", "是", "讲座/辅导课等", "—", "是", ""],
                ["5", "评估方法", "Assessment Methods", "下拉多选", "是", "作业/考试等", "—", "是", ""],
            ]),
            ("版本编辑——TAB2 Step3.1（课程内容大纲、英文名：Course Content Outline and Subtopics）", [
                ["1", "课程内容", "Course Content", "文本域", "是", "最多 100 字符", "章节主题", "否", ""],
                ["2", "关联 CLO", "CLO", "下拉多选", "是", "勾选已创建 CLO", "—", "是", ""],
                ["3", "实地学时", "F2F Physical", "数值框", "是", "非负整数", "SLT 拆分", "否", ""],
                ["4", "在线学时", "F2F Online", "数值框", "是", "非负整数", "—", "否", ""],
                ["5", "自主学时", "NF2F", "数值框", "是", "非负整数", "—", "否", ""],
            ]),
            ("版本编辑——TAB2 Step3.2/3.3（过程性/期末评估、Continuous/Final Assessment）", [
                ["1", "评估项", "Assessment Item", "下拉选择", "是", "预设枚举", "过程性/期末", "是", ""],
                ["2", "占比", "Percentage", "数值框", "是", "0~100；合计≤100%", "—", "否", "40"],
                ["3", "实地/在线/自主学时", "SLT", "数值框", "是", "非负整数", "—", "否", ""],
            ]),
            ("版本编辑——TAB2 分类课程学分配置情况（course-credits-summary）", [
                ["1", "层级展示", "—", "只读表格", "—", "与 TAB1 分类树一致", "可展开/收起", "否", ""],
                ["2", "状态", "Status", "只读", "—", "不足/达标", "必修/选修规则不同", "否", ""],
                ["3", "分类筛选", "H1 Filter", "下拉框", "否", "—", "已生效", "是", ""],
                ["4", "课程搜索", "Search", "输入框", "否", "—", "已生效", "否", ""],
                ["5", "移除课程", "Remove", "按钮", "—", "—", "二次确认 modal-delete-confirm", "否", ""],
            ]),
            ("版本编辑——信息条（edit-info-strip，不含毕业总学分）", [
                ["1", "专业", "Major", "只读", "—", "—", "—", "否", "Finance 金融学"],
                ["2", "版本", "Version", "只读", "—", "—", "—", "否", "2025/09"],
                ["3", "开始批次", "Start Intake", "只读", "—", "—", "—", "否", "2025/09"],
                ["4", "截止批次", "End Intake", "只读", "—", "—", "当前有效版本为空", "否", "—"],
                ["5", "学制", "Duration", "只读", "—", "—", "—", "否", "4 年"],
                ["6", "授予学位", "Degree Awarded", "只读", "—", "—", "—", "是", "经济学学士"],
            ]),
        ],
        functions=[
            ("1", "新增版本", "Create Version",
             "为选定专业创建培养方案版本草稿，选择开始批次并预览批次衔接，确认后进入三 TAB 制定视图。",
             "列表页点击「+ 新增版本」→ 弹窗选专业/开始批次 →「进入制定」→ 跳转版本编辑页。",
             "版本号与开始批次通常一致；同专业批次链：上一版本截止=下一版本开始前一批次。",
             "弹窗 modal-new-version；确认后进入 page-version-edit。"),
            ("2", "提交审批", "Submit for Approval",
             "将草稿或已驳回版本提交三级审批；提交前校验各必修分类已配学分≥最低要求。",
             "行内/编辑页/批量勾选「提交审批」→ 确认弹窗 → 写入审批队列，status=pending，不可编辑。",
             "仅 draft/rejected 可提交；批量须所选均为 draft/rejected。",
             "弹窗 modal-submit-version / modal-batch-submit-version。"),
            ("3", "版本导出", "Export Version",
             "勾选版本后批量导出培养方案文档（导出模板待产品方提供）。",
             "勾选≥1 个版本 → 点击「版本导出」→ 按模板生成文件。",
             "原型为占位 alert；不限制审批状态。",
             "无下钻页面（待确认：是否需要选择导出格式）。"),
            ("4", "编辑/查看/删除", "Edit / View / Delete",
             "草稿/已驳回可编辑提交删除；进行中跳转审批；已通过仅查看。",
             "行内操作 → 三 TAB 视图；查看为只读模式；删除确认弹窗。",
             "disabled 版本不可提交。",
             "编辑/查看共用 page-version-edit；删除 modal-delete-version。"),
            ("5", "版本引用情况", "Version References",
             "展示引用该版本的执行计划列表。",
             "点击引用数量 → 弹窗展示 EXEC_PLANS 关联记录。",
             "无引用时显示 0。",
             "弹窗 modal-version-refs。"),
            ("6", "保存", "Save",
             "保存当前三 TAB 编辑内容，需二次确认后返回来源列表。",
             "编辑页点击「保存」→ modal-save-version 确认 → 写入对应 Store → 返回列表。",
             "版本/变更/执行计划按场景区分提示文案；顶栏信息条不含毕业总学分（毕业总学分仅在 TAB1 chips 展示）。",
             "弹窗 modal-save-version；确认后 goPage(versionEditReturnPage)。"),
        ],
    )

    # ── 2.2.1.2 版本审批 ──
    add_menu_block(
        doc, "2.2.1.2 ", "版本审批（英文名称：Programme Version Approval）", "已确认",
        intro="按审批节点统一管理培养方案版本三级审批待办、进行中与历史；支持单条 Review、批量 Review、Approval Log 及只读 View。",
        list_fields="勾选框（Pending 可审项）、培养方案、Status、Stage、专业、开始批次、总学分、提交人、提交时间、操作。",
        search_fields="Tab 分桶：Pending / In Progress / History（Pending 显示 badge）。",
        flow_rel="提交后写入 APPROVAL_QUEUE；Review 更新 stages；末级 Approve → status=approved 并 syncVersionEndBatches；Reject/Update Required → status=rejected。总学分列动态取 VERSION_CONTENT_STORE 分类树一级最低学分合计（同 TAB1「毕业总学分」chip）。",
        flow_pre="版本已提交且 status=pending。",
        flow_out="审批通过 → 版本查询、执行计划、变更申请；日志供 Audit。",
        biz_flow="进入【版本审批】→ Pending 勾选 → Review → 审批意见 → Approve/Reject/Update Required → 逐级至 Senate。",
        proto_link="prototype/index.html#page-approval-list",
        field_tables=[
            ("Review 弹窗——审批决策", [
                ["1", "当前节点", "Current Stage", "只读", "—", "—", "Programme Office 等", "否", ""],
                ["2", "审批意见", "Review Comment", "文本域", "否", "—", "—", "否", ""],
                ["3", "决策", "Decision", "按钮组", "是", "Approve/Reject/Update Required", "—", "是", ""],
            ]),
            ("审批节点配置", [
                ["1", "一级审批", "Programme Office", "—", "—", "—", "Level 1", "否", ""],
                ["2", "二级审批", "Academic Affairs", "—", "—", "—", "Level 2", "否", ""],
                ["3", "三级审批", "Senate", "—", "—", "—", "Level 3 终审", "否", ""],
            ]),
        ],
        functions=[
            ("1", "Review", "Review",
             "审批人对当前节点待办进行审批决策。",
             "Pending 行 Review → 弹窗 → Approve/Reject/Update Required。",
             "View 只读三 TAB；Approval Log 展示记录。",
             "modal-approval-review；View 跳转 page-version-edit 只读。"),
            ("2", "Batch Review", "Batch Review",
             "Pending 页批量 Approve All / Reject All。",
             "勾选多条 → Batch Review → 批量决策。",
             "不含 Update Required 批量。",
             "modal-batch-approval-review。"),
        ],
    )

    # ── 2.2.1.3 版本查询 ──
    add_menu_block(
        doc, "2.2.1.3 ", "版本查询（英文名称：Programme Version Query）", "已确认",
        intro="只读查看已审批通过（approved）的培养方案版本，支持按专业过滤，进入三 TAB 详情但不可编辑。",
        list_fields="培养方案版本、审批状态、专业代码、学制、版本、开始批次、截止批次、授予学位、版本引用情况、操作（查看）。",
        search_fields="专业（Major）；列表固定仅展示 approved 版本。",
        flow_rel="只展示 status=approved；查看进入只读编辑视图。",
        flow_pre="版本已通过审批。",
        flow_out="无写入，纯查询。",
        biz_flow="进入【版本查询】→ 选择专业（可选）→ 自动刷新列表 → 查看 → 只读三 TAB。",
        proto_link="prototype/index.html#page-version-query",
        functions=[
            ("1", "查看", "View",
             "只读模式打开三 TAB，横幅提示不可编辑。",
             "行内「查看」→ page-version-edit 只读。",
             "—", "无下钻弹窗，直接进入编辑页只读模式。"),
        ],
    )

    add_heading(doc, "2.2.2 方案版本变更（英文名称：Programme Change）（需求确认状态：已确认）", 3)
    add_para(doc, "模块介绍：对已审批版本发起内容变更，走三级审批；通过后覆盖原版本内容，已生成执行计划保持独立副本。")

    add_menu_block(
        doc, "2.2.2.1 ", "方案版本变更申请（英文名称：Change Application）", "已确认",
        intro="选择已审批版本作为变更目标，复制内容到变更工作区修改；支持草稿、提交、删除；同一版本仅一个 draft/pending 变更。",
        list_fields="目标培养方案版本、专业、版本、状态、提交人、提交时间、操作。",
        search_fields="专业、状态（draft/pending/approved/rejected）。",
        flow_rel="新建 → 选 approved 版本 → 复制到 CHANGE_CONTENT_STORE → 三 TAB 编辑 → 提交写入变更审批队列。",
        flow_pre="目标 status=approved；无并发 draft/pending 变更。",
        flow_out="通过 → 覆盖 VERSION_CONTENT_STORE；未生成执行计划批次后续引用最新版本。",
        biz_flow="【方案版本变更申请】→ 新建 → 选专业/版本 → 进入修改 → 提交 → 【方案版本变更审核】。",
        proto_link="prototype/index.html#page-change-apply",
        field_tables=[
            ("新建方案版本变更申请——弹窗", [
                ["1", "专业", "Major", "下拉框", "是", "—", "过滤可选版本", "是", "Finance 金融学"],
                ["2", "目标培养方案版本", "Target Programme Version", "下拉框", "是", "须 approved；有进行中变更禁用", "展示影响预览", "是", ""],
            ]),
        ],
        functions=[
            ("1", "新建申请", "Create Application",
             "选已审批版本，复制内容进入变更编辑。",
             "「+ 新建申请」→ modal-new-change-apply →「进入修改」。",
             "影响说明：已生成执行计划不受影响。",
             "modal-new-change-apply → page-version-edit 变更模式。"),
            ("2", "提交变更审批", "Submit Change",
             "草稿提交变更审批，校验同版本提交。",
             "编辑页/列表「提交审批」→ 确认弹窗。",
             "校验必修最低学分。",
             "modal-submit-change。"),
            ("3", "编辑/查看/删除", "Edit / View / Delete",
             "draft/rejected 可编辑删除；pending/approved 仅查看。",
             "行内操作链接。",
             "—", "共用 page-version-edit。"),
        ],
    )

    add_menu_block(
        doc, "2.2.2.2 ", "方案版本变更审核（英文名称：Change Review）", "已确认",
        intro="与版本审批结构一致，数据源 CHANGE_APPLICATIONS；Pending/In Progress/History；单条/批量 Review。",
        list_fields="勾选框、培养方案、Status、Stage、专业、开始批次、总学分、提交人、提交时间、操作。",
        search_fields="Tab：Pending / In Progress / History。",
        flow_rel="变更提交后进入审批队列；Approve 通过后覆盖版本内容；Reject/Update Required 退回。总学分列取 CHANGE_CONTENT_STORE 或目标版本快照的分类树毕业总学分。",
        flow_pre="变更申请 status=pending。",
        flow_out="通过后更新 VERSION_CONTENT_STORE。",
        biz_flow="【方案版本变更审核】→ Pending Review → 三级审批。",
        proto_link="prototype/index.html#page-change-review",
        functions=[
            ("1", "Review", "Review", "单条变更审批。", "Pending Review → 决策。", "—", "modal-change-review。"),
            ("2", "Batch Review", "Batch Review", "批量 Approve/Reject。", "勾选批量 Review。", "—", "modal-batch-change-review。"),
            ("3", "Approval Log", "Approval Log", "查看审批历史。", "行内 Approval Log。", "—", "modal-change-review-log。"),
        ],
    )

    add_heading(doc, "2.2.3 专业批次执行计划（英文名称：Programme Intake Execution Plan）（需求确认状态：已确认）", 3)
    add_para(doc, "模块介绍：按入学批次从已审批方案版本复制生成独立执行计划；各批次单独编辑保存，不回写方案版本管理；方案版本变更审批通过后不影响已生成副本；提交后锁定，已开课不可撤回。生成时按「版本起始批次类型 ↔ 执行入学批次类型」旋转学期槽位，并计算实际开课学年学期。")

    add_menu_block(
        doc, "2.2.3.1 ", "专业批次执行计划（英文名称：Programme Intake Execution Plan）", "已确认",
        intro="管理各专业入学批次执行计划；从 approved 版本自动匹配并深拷贝至 EXEC_CONTENT_STORE；生成时重算开课学期与实际开课学期；各批次数据独立；支持生成、编辑、提交、撤回、删除及批量操作。",
        list_fields="勾选框、专业代码、专业、专业批次、学院（School）、入学批次、总学分、开课状态、是否提交、操作。",
        search_fields="专业、入学批次、开课状态（未开课/已开课）、是否提交（未提交/已提交）。",
        flow_rel="选专业+入学批次 → 自动匹配 approved 版本 → 深拷贝至 EXEC_CONTENT_STORE[planId] → remapExecPlanContent 旋转开课学期并写入 actualSemester → 编辑仅写入当前 planId → 提交 isLocked=true。总学分列取当前批次 EXEC_CONTENT_STORE 分类树毕业总学分。",
        flow_pre="存在覆盖批次的 approved 版本；同专业同入学批次不可重复生成。",
        flow_out="执行计划独立副本；实际开课学期供后续开课模块；版本引用数统计来源。",
        biz_flow="【专业批次执行计划】→ 生成 → 编辑三 TAB → 保存（确认返回）→ 提交 → 开课。",
        proto_link="prototype/index.html#page-exec-list",
        field_tables=[
            ("生成批次执行计划——弹窗", [
                ["1", "专业", "Major", "下拉框", "是", "—", "—", "是", "Finance 金融学"],
                ["2", "入学批次", "Intake Batch", "下拉框", "是", "02/04/09", "仅显示尚未生成且可匹配版本的批次", "是", "2025/02"],
                ["3", "匹配培养方案版本", "Matched Programme Version", "只读", "是", "自动匹配锁定", "入学批次须落在版本生效区间内", "否", "2024/09"],
            ]),
            ("执行计划编辑——TAB2 课程设置（相对版本增加列）", [
                ["1", "课号/课名/分类/学分", "—", "—", "—", "同版本 TAB2", "—", "—", ""],
                ["2", "开课学期", "Offering Semester", "只读/下拉", "条件", "本批次视角 Y1S1~YnS3", "由版本学期按槽位旋转重算", "是", "Y1S1"],
                ["3", "实际开课学期", "Actual Offering Semester", "只读", "—", "—", "明确年月如 2029/09；仅执行计划展示", "否", "2029/09"],
                ["4", "课程性质", "Course Nature", "只读", "—", "必修/选修", "—", "是", "必修"],
            ]),
        ],
        functions=[
            ("1", "生成执行计划", "Generate Plan",
             "从版本复制生成执行计划，自动旋转开课学期并计算实际开课学期。",
             "「+ 生成执行计划」→ 选专业/批次 → 匹配版本 →「生成并编辑」。",
             "版本内 Y1S1 以版本起始批次为第 1 学期；执行计划 Y1S1 以本入学批次为第 1 学期。",
             "modal-gen-exec → page-version-edit 执行计划模式。"),
            ("2", "提交", "Submit", "锁定执行计划。", "批量/行内提交。", "提交后不可编辑。", "modal-exec-lock。"),
            ("3", "撤回", "Withdraw", "未开课前撤回。", "已提交且未开课可撤回。", "—", "modal-exec-unlock。"),
            ("4", "删除", "Delete", "删除未提交计划。", "未提交且未开课。", "已开课须先删开课任务。", "modal-exec-delete。"),
            ("5", "编辑/查看", "Edit / View",
             "进入三 TAB 编辑或只读查看当前批次执行计划副本。",
             "行内「编辑」/「查看」→ page-version-edit 执行计划模式。",
             "TAB2 含「实际开课学期」列；保存不回写方案版本管理。",
             "共用 page-version-edit；横幅 exec-edit-banner。"),
        ],
    )

    add_heading(doc, "2.2.3.2 开课学期与执行计划学期映射规则（需求确认状态：已确认）", 4)
    add_para(doc, "方案版本定义不含具体年月的 Y1S1~YnS3 课程安排模板；执行计划按本批次入学类型旋转槽位，并给出实际开课学年学期（供开课模块使用）。Y 表示培养方案学年（非自然年）。")

    add_para(doc, "表 1  一年三学期类型与入学批次对应关系", bold=True)
    add_grid_table(doc,
        ["入学批次类型", "第 1 学期（S1）", "第 2 学期（S2）", "第 3 学期（S3）", "说明"],
        [
            ["02 入学（短学期起）", "02 短学期", "04 长学期", "09 长学期", "均在同一学年 Y1 内"],
            ["04 入学（长学期起）", "04 长学期", "09 长学期", "02 短学期", "Y1S3 仍为 Y1/02，非 Y2"],
            ["09 入学（长学期起）", "09 长学期", "02 短学期", "04 长学期", "02 可能落在下一自然年"],
        ],
        col_widths=scale_widths([2.8, 2.2, 2.2, 2.2, 5.6]))

    add_para(doc, "表 2  三类学期概念对照", bold=True)
    add_grid_table(doc,
        ["概念", "出现位置", "含义", "示例"],
        [
            ["版本开课学期", "方案版本、方案变更", "相对版本起始批次的 Y1S1~YnS3 模板", "2023/02 版本：Y1S1=Y1/02"],
            ["执行计划开课学期", "专业批次执行计划 TAB2", "相对本入学批次的 Y1S1~YnS3", "2029/09 批次：Y1S1"],
            ["实际开课学期", "仅执行计划 TAB2", "明确开课年月，供开课模块", "2029/09"],
        ],
        col_widths=scale_widths([3.0, 3.5, 5.0, 3.5]))

    add_para(doc, "表 3  生成执行计划时的换算规则", bold=True)
    add_kv_table(doc, [
        ("步骤 1", "保留版本原始开课学期为 versionSemester（如 Y1S3）"),
        ("步骤 2", "按版本起始批次类型与执行入学批次类型，在同一年级内旋转槽位，得到执行计划开课学期"),
        ("步骤 3", "由执行计划开课学期 + 执行入学批次，计算 actualSemester（如 2029/09）"),
        ("步骤 4", "选修课学期修读要求矩阵同步旋转；方案版本与方案变更不展示实际开课学期列"),
        ("批次相同", "版本起始批次 = 执行入学批次时，开课学期一一对应，仅补充实际年月"),
    ], col_widths=scale_widths((2.5, 13.5)))

    add_para(doc, "表 4  换算示例：版本 2023/02 起版 + 批次 2029/09 入学", bold=True)
    add_grid_table(doc,
        ["执行计划开课学期", "实际开课学期", "课程取自版本", "版本学期含义"],
        [
            ["Y1S1", "2029/09", "Y1S3", "Y1/09"],
            ["Y1S2", "2030/02", "Y1S1", "Y1/02"],
            ["Y1S3", "2030/04", "Y1S2", "Y1/04"],
            ["Y2S1", "2030/09", "Y2S3", "Y2/09"],
        ],
        col_widths=scale_widths([3.0, 2.5, 2.5, 2.5]))

    add_para(doc, "表 5  换算示例：版本 2021/09 起版 + 批次 2029/04 入学（第一年）", bold=True)
    add_grid_table(doc,
        ["执行计划开课学期", "实际开课学期", "课程取自版本", "版本学期含义"],
        [
            ["Y1S1", "2029/04", "Y1S3", "Y1/04"],
            ["Y1S2", "2029/09", "Y1S1", "Y1/09"],
            ["Y1S3", "2030/02", "Y1S2", "Y1/02"],
        ],
        col_widths=scale_widths([3.0, 2.5, 2.5, 2.5]))

    add_heading(doc, "2.2.4 数据统计（英文名称：Statistics）（需求确认状态：已确认）", 3)
    add_para(doc, "模块介绍：Bloom's Taxonomy Charts 按已发布执行计划（status=published）统计 CLO 的 Bloom 分布；左侧树为一级专业→二级年份→三级入学批次。（Alignment Charts 已移除）")

    add_menu_block(
        doc, "2.2.4.1 ", "Bloom's Taxonomy Charts（英文名：Bloom's Taxonomy Charts）", "已确认",
        intro="左侧树绑定已发布 EXEC_PLANS；选中叶子节点后展示 Bloom 矩阵（C1~C6/A1~A5/P1~P7）、Summary 折线图、按年分布表；占比分母为各域（C/A/P）自身总数。",
        list_fields="Bloom 矩阵表、Summary 图、按年分布表（Year 列居中）。",
        search_fields="左侧树 Search 过滤专业/年份/批次。",
        flow_rel="读取 EXEC_CONTENT_STORE 中已发布执行计划课程 CLO 的 Bloom 评级聚合展示。",
        flow_pre="存在 status=published 的执行计划且课程含 CLO Bloom 数据。",
        flow_out="Export 导出（待实现）。",
        biz_flow="侧栏进入 → 选树叶子节点 → 查看图表 → Export。",
        proto_link="prototype/index.html#page-stats-bloom",
        functions=[
            ("1", "Export", "Export", "导出图表数据/图片。", "点击 Export。", "原型 alert 占位。", "无下钻页面。"),
        ],
    )

    add_menu_block(
        doc, "2.2.5 ", "操作流程图（英文名称：Workflow Diagram）", "已确认",
        intro="嵌入 docs/pyfa-workflow.html 展示主路径：版本制定与审批 → 执行计划/变更/只读查询。",
        list_fields="流程图节点与连线。",
        search_fields="无。",
        flow_rel="只读展示，无数据写入。",
        flow_pre="无。",
        flow_out="无。",
        biz_flow="概览 → 操作流程图 → 缩放查看。",
        proto_link="prototype/docs/pyfa-workflow.html",
        functions=[
            ("1", "缩放", "Zoom", "50%–180% 缩放流程图。", "工具栏 −/+ / 重置。", "—", "无下钻页面。"),
        ],
    )

    add_heading(doc, "附录 A：核心数据实体", 2)
    add_grid_table(doc, ["实体", "关键字段", "说明"], [
        ["MAJORS", "code, name, nameZh, school, degree, duration", "专业主数据"],
        ["VERSIONS", "id, majorKey, name, version, startBatch, endBatch, status", "draft/pending/approved/rejected"],
        ["VERSION_CONTENT_STORE", "classificationTree, programCourses, electiveSemesterRequirements", "版本方案内容"],
        ["COURSE_CATALOG", "code, name, credits, clos, slt…", "教务课程库"],
        ["PROGRAM_COURSES", "catalogId, h1/h2/h3Id, semester, actualSemester, versionSemester, studyType", "方案/执行计划内课程；actualSemester 仅执行计划"],
        ["EXEC_PLANS", "planCode, majorKey, intakeBatch, versionId, isLocked, isOffering", "专业批次执行计划"],
        ["EXEC_CONTENT_STORE", "classificationTree, programCourses, electiveSemesterRequirements", "各批次执行计划独立副本"],
        ["CHANGE_APPLICATIONS", "versionId, status, stages[], currentStageLevel", "变更申请"],
        ["APPROVAL_QUEUE", "versionId, stages[], cancelled", "版本审批实例"],
    ], col_widths=scale_widths([3.5, 6.5, 6.0]))

    add_heading(doc, "附录 B：数据隔离规则", 2)
    add_grid_table(doc, ["场景", "写入 Store", "是否影响其他数据"], [
        ["编辑方案版本并保存", "VERSION_CONTENT_STORE[versionId]", "不影响已有 EXEC_CONTENT_STORE"],
        ["编辑专业批次执行计划并保存", "EXEC_CONTENT_STORE[planId]", "不回写 VERSION_CONTENT_STORE；不影响其他 planId"],
        ["方案版本变更审批通过", "VERSION_CONTENT_STORE[versionId]", "已生成 EXEC_CONTENT_STORE 副本保持不变"],
        ["新建执行计划（未生成批次）", "新建 EXEC_CONTENT_STORE[planId]", "引用当时最新版本快照"],
    ], col_widths=scale_widths([4.5, 5.5, 5.0]))

    add_heading(doc, "附录 C：总学分取值规则", 2)
    add_kv_table(doc, [
        ("计算规则", "TAB1 分类树各一级分类最低学分之和（calcGraduationTotalCredits），与 chips「毕业总学分」一致"),
        ("版本审批列表", "getApprovalItemTotalCredits ← VERSION_CONTENT_STORE / 版本快照"),
        ("方案版本变更审核列表", "getChangeApplicationTotalCredits ← CHANGE_CONTENT_STORE / 版本快照"),
        ("专业批次执行计划列表", "getExecPlanTotalCredits ← EXEC_CONTENT_STORE[planId]"),
        ("顶栏信息条", "不展示毕业总学分（已移除）"),
    ], col_widths=scale_widths((3.5, 12.5)))

    add_heading(doc, "附录 D：原型占位功能（正式开发需实现）", 2)
    add_grid_table(doc, ["功能", "当前原型行为", "优先级"], [
        ["版本导出", "alert 占位，模板待定", "高"],
        ["TAB3 导出 PDF/打印", "按钮占位", "中"],
        ["统计 Export", "alert 占位", "中"],
        ["用户认证与角色路由", "无", "高"],
    ], col_widths=scale_widths([4.0, 7.0, 2.0]))

    doc.save(OUT)
    print(f"Generated: {OUT}")


if __name__ == "__main__":
    build()
