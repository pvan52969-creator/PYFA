# -*- coding: utf-8 -*-
"""按参考文档结构生成培养方案管理 PRD。"""

from prd_field_data import VERSION_MGMT_FIELD_TABLES as _VERSION_MGMT_FIELD_TABLES
from prd_logic_rules import (
    APPROVAL_VERSION_LOGIC,
    COURSE_FIELD_CROSS_LOGIC,
    COURSE_GROUP_FIELD_TABLES_V22,
    COURSE_GROUP_LOGIC,
    CREDIT_VALIDATION_LOGIC,
    TAB_EDIT_PERMISSION_MATRIX,
    TAB_UNLOCK_LOGIC,
)


def _patch_field_tables(tables):
    """在参考字段表基础上补充 V2.0 增量（四 TAB、课程组、合并课程等）。"""
    out = []
    for title, rows in tables:
        rows = list(rows)
        if "course-credits-summary" in title:
            extra = [
                ["2", "课程数量", "Course Count", "只读", "—", "—",
                 "按二级/三级分类统计已配置课程数；增删课程后同步刷新标签页一课程数", "否", "6"],
                ["3", "已配置学分", "Configured Credits", "只读", "—", "—",
                 "同分类已配课程学分合计", "否", "54"],
                ["4", "学分要求", "Credits Requirement", "只读", "—", "—",
                 "展示最低/最高学分要求", "否", ""],
            ]
            new_rows = [rows[0]] + extra + rows[1:]
            rows = []
            for i, r in enumerate(new_rows, 1):
                r = list(r)
                r[0] = str(i)
                rows.append(r)
        if "TAB2 Step1" in title:
            insert = [
                ["6", "合并课程选择", "Merged Course", "选择器", "否",
                 "须与开课学期、二级分类、学分相同", "仅影响 TAB3/TAB4 展示；点击选择直接打开弹窗，无前置强校验，无候选时列表空态；执行计划只读展示", "否", ""],
                ["7", "授课对象范围", "Teaching Audience", "下拉框", "否", "—",
                 "Chinese / Local / International", "是", "Chinese"],
                ["8", "延迟开课", "Delayed Offering", "开关", "否", "—",
                 "仅专业批次执行计划 TAB2 编辑未开课课程时可见；版本/变更不展示", "否", ""],
            ]
            base = rows[:5] + insert
            tail = []
            for r in rows[5:]:
                r = list(r)
                r[0] = str(int(r[0]) + 3)
                tail.append(r)
            rows = base + tail
        if "选修课学期修读要求矩阵" in title:
            for r in rows:
                if r[0] == "1":
                    r[6] = "学制年数×3 学期（如 4 年制 Y1S1~Y4S3）；执行计划生成时同步旋转"
        if "TAB4 方案进程表" in title:
            for r in rows:
                if r[0] == "5" and r[1] == "空态":
                    r[6] = "无指定学期课程时提示去 TAB2 配置"
        out.append((title, rows))
    out.extend([
        ("复制版本——弹窗", [
            ["1", "复制专业", "Source Programme", "下拉框", "是", "—", "选择待复制方案所属专业", "是", "Finance 金融学"],
            ["2", "复制方案版本", "Source Version", "下拉框", "是", "—", "展示该专业可选方案版本", "是", "2025/09"],
            ["3", "新的专业", "Target Programme", "下拉框", "是", "—", "目标专业可与来源不同", "是", "Accounting 会计学"],
            ["4", "方案版本开始批次", "Target Start Intake", "下拉框", "是", "须符合目标专业批次链", "展示目标专业批次衔接预览", "是", "2025/09"],
        ]),
        ("版本编辑——TAB3 课程组列表（Course Groups）", [
            ["1", "开课学期", "Offering Semester", "只读", "—", "—", "来自 TAB2 选修已指定学期", "是", "Y2S2"],
            ["2", "一级分类", "Classification H1", "只读", "—", "—", "须为选修类", "是", ""],
            ["3", "二级分类", "Classification H2", "只读", "—", "—", "—", "是", ""],
            ["4", "须选课程数", "Pick Count", "只读", "—", "须<组内课程数",
             "列表展示配置值；保存时至少 2 门组内课", "否", "2"],
            ["5", "合计学分要求", "Total Credits Required", "只读", "否", "—", "可选字段", "否", "6"],
            ["6", "组内课程数", "Member Count", "只读", "—", "—", "—", "否", "4"],
            ["7", "必选项", "Mandatory Picks", "只读", "—", "—", "展示必选课程课号", "否", "EGE411"],
            ["8", "备注", "Note", "只读", "否", "—", "TAB4 展示", "否", ""],
            ["9", "操作", "Actions", "按钮", "—", "—",
             "版本/变更：查看+编辑+删除；执行计划/只读：仅查看", "否", ""],
        ]),
        ("执行计划编辑——TAB2 增量字段", [
            ["1", "实际开课学期", "Actual Offering Semester", "只读", "—", "—", "明确年月如 2029/09；仅执行计划展示", "否", "2029/09"],
            ["2", "延迟开课", "Delayed Offering", "开关", "否", "—", "仅编辑未开课课程时可调整", "否", ""],
            ["3", "合并课程选择", "Merged Course", "只读", "—", "—", "与方案版本一致只读展示", "否", ""],
            ["4", "先修课程", "Prerequisites", "选择器", "条件", "—", "执行计划可编辑", "否", ""],
        ]),
    ])
    out.extend(COURSE_GROUP_FIELD_TABLES_V22)
    return out


VERSION_MGMT_FIELD_TABLES = _patch_field_tables(_VERSION_MGMT_FIELD_TABLES)
from prd_function_data import (
    APPROVAL_FUNCTIONS,
    CHANGE_APPLY_FUNCTIONS,
    CHANGE_REVIEW_FUNCTIONS,
    EXEC_FUNCTIONS,
    STATS_FUNCTIONS,
    STATS_EXEC_FUNCTIONS,
    VERSION_MGMT_FUNCTIONS,
    VERSION_QUERY_FUNCTIONS,
    WORKFLOW_FUNCTIONS,
)


def build_document(add_heading, add_para, add_kv_table, add_grid_table, add_field_table,
                   add_menu_block, scale_widths, VALIDATION_PROMPTS, OUT, Document,
                   set_document_landscape):
    doc = Document()
    set_document_landscape(doc)

    add_heading(doc, "厦大马来分校本科教务系统产品需求文档", 0)
    add_para(doc, "文档版本：V2.2")
    add_para(doc, "创建日期：2026 年 6 月 9 日")
    add_para(doc, "修订说明：V2.2 在 V2.1 基础上补充字段/功能逻辑关系：四标签页编辑权限矩阵、标签页解锁联动、课程组「课程选择」子弹窗与保存校验（≥2 门、须选数<组内数）、TAB2 与课程组学期冲突拦截、执行计划 TAB3 只读；新增附录 I–N 逻辑关系专章")
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
        ("覆盖范围", "本科生培养方案版本制定、四级审批、变更、专业批次执行计划及数据统计（不含开课模块）"),
    ], col_widths=scale_widths((3, 13)))
    add_heading(doc, "1.3 文档说明", 2)
    add_para(doc, "本文档依据现有原型逆向整理；已确认需求标记为「已确认」；导出模板等待补充标记为「待确认」。入学批次编码：每年 02→04→09。专业主数据 25 个、学院 9 个，严格对照 UG 本科学院专业代码对照表。专业（Programme）、入学批次（Intake）等业务英文名称见附录 F。")

    add_heading(doc, "系统分析", 1)
    add_heading(doc, "2.1 应用目录——培养方案管理", 2)
    add_grid_table(doc,
        ["一级目录", "一级目录英文名称", "二级目录", "二级目录英文名称", "三级目录", "备注说明"],
        [
            ["概览", "Overview", "操作流程图", "Workflow Diagram", "—", "嵌入主业务流程图，支持缩放；图例靠左；四 TAB + 四级审批"],
            ["方案版本", "Programme Version", "方案版本管理", "Programme Version Management", "—", "多版本增删改查、复制版本、批量提交/导出"],
            ["方案版本", "Programme Version", "版本审批", "Programme Version Approval", "—", "四级审批；Pending/In Progress/History 三视角"],
            ["方案版本", "Programme Version", "版本查询", "Programme Version Query", "—", "只读查看已通过版本"],
            ["方案版本", "Programme Version", "版本编辑（共用）", "Programme Structure Editing", "TAB1~TAB4", "制定/查看/变更/执行计划共用四标签页"],
            ["方案版本变更", "Programme Change", "方案版本变更申请", "Change Application", "—", "对已审批版本发起变更；支持批量提交/删除"],
            ["方案版本变更", "Programme Change", "方案版本变更审核", "Change Review", "—", "变更四级审批"],
            ["专业批次执行计划", "Programme Intake Execution Plan", "专业批次执行计划", "Programme Intake Execution Plan", "—", "按入学批次独立生成/编辑，不回写版本"],
            ["数据统计", "Statistics", "Bloom's Taxonomy Charts", "Bloom's Taxonomy Charts", "—", "布鲁姆分布；学院→专业→年份→批次"],
            ["数据统计", "Statistics", "执行计划统计", "Execution Plan Statistics", "—", "专业×入学批次生成覆盖率矩阵"],
        ],
        col_widths=scale_widths([2.0, 2.5, 2.5, 3.2, 2.0, 4.3]))

    add_heading(doc, "2.2 培养方案管理——系统需求", 2)
    add_heading(doc, "2.2.1 方案版本（英文名称：Programme Version）（需求确认状态：已确认）", 3)
    add_para(doc, "模块介绍：管理各专业不同入学批次的培养方案版本全生命周期，包括版本制定、四级审批、只读查询、版本复制/导出及批次链衔接；是执行计划与方案版本变更的上游数据源。")
    add_heading(doc, "2.2.1.0 版本编辑四标签页（共用逻辑）（需求确认状态：已确认）", 4)
    add_para(doc, "制定、变更、执行计划、只读查看共用 page-version-edit 四标签页骨架；各入口在 TAB1~TAB4 的增删改权限不同，详见附录 I。标签页解锁顺序：须先完成 TAB1 分类建设方可进入 TAB2/3/4（附录 J）。TAB1 课程数由 TAB2 自动汇总；TAB3 课程组候选来自 TAB2 已录入选修课；TAB4 方案进程表由 TAB1+2+3 自动生成。")
    add_para(doc, "课程组（TAB3）：主弹窗通过「课程选择」按钮打开子弹窗多选组内课；保存须至少 2 门、须选课程数小于组内课程数、不能全部设为必选；已入课程组的课在 TAB2 不可改开课学期（附录 K）。合并课程与延迟开课规则见附录 L；提交审批学分校验见附录 M。")

    add_menu_block(
        doc, "2.2.1.1 ", "方案版本管理（英文名称：Programme Version Management）", "已确认",
        intro="用于管理各专业培养方案版本的创建、编辑、删除、复制、提交审批、批量导出及版本引用查询。同一专业可存在多个按批次链衔接的版本；支持学院→专业级联筛选、列排序与分页；列表展示审批状态、批次区间、引用情况。",
        list_fields="页面展示字段信息：勾选框、培养方案版本、审批状态、专业代码、学院代码、学制、版本、开始入学批次、截止入学批次、授予学位、版本引用情况、操作。\n列对齐：审批状态/专业代码/学院代码/学制/版本/开始入学批次/截止入学批次/授予学位/版本引用情况居中；\n当前有效版本行绿底高亮（审批状态：草稿/审批中/已通过/已驳回）。",
        search_fields="学院代码（级联）、专业代码、审批状态（草稿/审批中/已通过/已驳回）；过滤栏选择后点击「查询」生效；支持列头排序与分页（10~200 条/页，默认 20）。",
        flow_rel="用户在列表页发起增删改查、复制、提交、导出；新增时校验批次链后创建草稿并进入四标签页编辑；提交时校验分类学分结构后写入审批队列；审批通过后状态变为已通过并回填上一版本截止入学批次；复制版本将来源版本完整内容复制到目标专业新草稿。",
        flow_pre="已维护专业主数据（25 专业、9 学院、代码、学制、学位）；已维护入学批次代码集（02/04/09）；课程库可用于标签页二选课。",
        flow_out="已通过版本供专业批次执行计划生成、方案版本变更申请、版本查询、布鲁姆统计；引用数关联执行计划。",
        biz_flow="操作流程：进入【方案版本管理】→ 学院/专业过滤查询 → 新增或复制版本 → 标签页一分类 → 标签页二课程 → 标签页三课程组 → 标签页四进程表 → 保存（二次确认后返回列表）→ 提交审批 → 【版本审批】四级流程 → 通过后查询/执行计划/变更。",
        proto_link="prototype/index.html#page-version-list",
        field_tables=VERSION_MGMT_FIELD_TABLES,
        functions=VERSION_MGMT_FUNCTIONS,
    )

    add_menu_block(
        doc, "2.2.1.2 ", "版本审批（英文名称：Programme Version Approval）", "已确认",
        intro="按审批节点统一管理培养方案版本四级审批：待办（Pending）、进行中（In Progress）与历史（History）；支持学院→专业筛选、单条审批、批量审批、审批日志及只读查看。",
        list_fields="勾选框（待办可审项）、培养方案、Status、Stage、专业代码、学院代码、开始入学批次、总学分、提交人、提交时间、操作。居中：Status、专业代码、学院代码、开始入学批次、总学分。状态：已通过、已驳回、审批中、需修改、已取消。",
        search_fields="学院代码（级联）、专业代码；标签页：待办、进行中、历史；点击「查询」生效。",
        flow_rel="版本提交后进入审批队列；逐级四级审批更新节点记录；Senate 终审通过后版本变为已通过并回填上一版本截止入学批次；驳回或需修改则版本变为已驳回。",
        flow_pre="版本处于审批中状态。",
        flow_out="通过后可供查询、执行计划与变更引用；审批日志供审计。",
        biz_flow="进入【版本审批】→ 待办页勾选 → Review → 填写意见 → 通过/驳回/需修改 → 逐级至 Senate（学术委员会）。",
        proto_link="prototype/index.html#page-approval-list",
        field_tables=[
            ("Review 弹窗——审批决策", [
                ["1", "当前节点", "Current Stage", "只读", "—", "—", "Programme Office 等", "否", ""],
                ["2", "审批意见", "Review Comment", "文本域", "否", "—", "—", "否", ""],
                ["3", "决策", "Decision", "按钮组", "是", "通过/驳回/需修改", "—", "是", ""],
            ]),
            ("审批节点配置", [
                ["1", "一级审批", "HoP（专业负责人）", "—", "—", "—", "Level 1", "否", ""],
                ["2", "二级审批", "HoD/Dean（学院领导）", "—", "—", "—", "Level 2", "否", ""],
                ["3", "三级审批", "Quality Assurance（质量办）", "—", "—", "—", "Level 3", "否", ""],
                ["4", "四级审批", "Senate（学术委员会）", "—", "—", "—", "Level 4 终审", "否", ""],
            ]),
        ],
        functions=APPROVAL_FUNCTIONS,
    )

    add_menu_block(
        doc, "2.2.1.3 ", "版本查询（英文名称：Programme Version Query）", "已确认",
        intro="只读查看已审批通过的培养方案版本；支持学院→专业级联筛选；可进入四标签页详情但不可编辑。",
        list_fields="同方案版本管理列表（无勾选列、无行内提交/删除）；仅展示已通过版本。",
        search_fields="学院代码（级联）、专业代码；列表固定仅展示已通过记录；支持排序与分页。",
        flow_rel="只读展示；查看进入只读四标签页编辑视图。",
        flow_pre="版本已通过审批。",
        flow_out="无数据写入。",
        biz_flow="进入【版本查询】→ 学院/专业过滤（可选）→ 查看 → 只读四标签页。",
        proto_link="prototype/index.html#page-version-query",
        functions=VERSION_QUERY_FUNCTIONS,
    )

    add_heading(doc, "2.2.2 方案版本变更（英文名称：Programme Change）（需求确认状态：已确认）", 3)
    add_para(doc, "模块介绍：对已审批版本发起内容变更，走四级审批；通过后覆盖原版本内容，已生成执行计划保持独立副本。")

    add_menu_block(
        doc, "2.2.2.1 ", "方案版本变更申请（英文名称：Change Application）", "已确认",
        intro="选择已审批通过的版本作为变更目标，复制内容到变更工作区修改；支持草稿、批量提交审批、批量删除；同一版本同时仅允许一条草稿或审批中的变更。",
        list_fields="勾选框、目标培养方案版本、专业代码、学院代码、版本、状态、提交人、提交时间、操作。专业代码/学院代码/版本/状态居中。状态：草稿、审批中、已通过、已驳回；审批中记录可查看审批日志。",
        search_fields="学院代码（级联）、专业代码、审批状态；点击「查询」生效；支持排序与分页。",
        flow_rel="新建并选择目标版本 → 复制内容 → 四标签页编辑 → 批量或单条提交进入变更审批。",
        flow_pre="目标版本已通过；无并发的草稿或审批中变更（同一 versionId 最多一条进行中申请）。",
        flow_out="变更通过后覆盖原版本内容；已生成执行计划不受影响。",
        biz_flow="【变更申请】→ 新建 → 选专业与版本 → 进入修改 → 批量/单条提交 → 【变更审核】四级审批。",
        proto_link="prototype/index.html#page-change-apply",
        field_tables=[
            ("新建方案版本变更申请——弹窗", [
                ["1", "专业", "Programme", "下拉框", "是", "—", "过滤可选版本", "是", "Finance 金融学"],
                ["2", "目标培养方案版本", "Target Programme Version", "下拉框", "是", "须已通过审批；有进行中变更时不可选", "展示影响预览", "是", ""],
            ]),
        ],
        functions=CHANGE_APPLY_FUNCTIONS,
    )

    add_menu_block(
        doc, "2.2.2.2 ", "方案版本变更审核（英文名称：Change Review）", "已确认",
        intro="与版本审批结构一致；数据源为变更申请；支持 Pending/In Progress/History 三视角、学院→专业筛选及单条/批量审批。",
        list_fields="勾选框、培养方案、Status、Stage、专业代码、学院代码、版本、开始入学批次、总学分、提交人、提交时间、操作。居中：Status、专业代码、学院代码、版本、开始入学批次、总学分。",
        search_fields="学院代码（级联）、专业代码；标签页：待办、进行中、历史。",
        flow_rel="变更提交后进入审批；四级节点逐级审批；通过后覆盖原版本内容；驳回或需修改则退回申请人。",
        flow_pre="变更申请处于审批中。",
        flow_out="通过后更新方案版本内容。",
        biz_flow="【变更审核】→ 待办审批 → 四级流程。",
        proto_link="prototype/index.html#page-change-review",
        functions=CHANGE_REVIEW_FUNCTIONS,
    )

    add_heading(doc, "2.2.3 专业批次执行计划（英文名称：Programme Intake Execution Plan）（需求确认状态：已确认）", 3)
    add_para(doc, "模块介绍：按入学批次从已审批方案版本复制生成独立执行计划；各批次单独编辑保存，不回写方案版本管理；方案版本变更审批通过后不影响已生成副本；提交后锁定，已开课不可撤回。生成时按「版本起始批次类型 ↔ 执行入学批次类型」旋转学期槽位，并计算实际开课学年学期。")

    add_menu_block(
        doc, "2.2.3.1 ", "专业批次执行计划（英文名称：Programme Intake Execution Plan）", "已确认",
        intro="管理各专业各入学批次的执行计划；从已通过版本自动匹配并复制内容；生成时重算开课学期与实际开课学期；各批次数据独立，不回写方案版本；支持是否调整追踪与修改日志。",
        list_fields="勾选框、专业代码、专业、专业批次、学院代码、入学批次、总学分、是否提交、是否调整、AC、操作。居中：专业代码、总学分、是否提交（已提交绿底白字）。页内说明条左对齐展示数据隔离规则。",
        search_fields="学院代码（级联）、专业代码、入学批次、是否提交；点击「查询」生效；支持排序与分页。",
        flow_rel="选择专业与入学批次 → 自动匹配已通过版本并复制 → 旋转开课学期并计算实际开课学期 → 四标签页编辑（TAB1 只读、TAB2 限改、TAB3 只读仅查看、TAB4 只读）→ 保存仅影响当前批次 → 提交后锁定。",
        flow_pre="存在可覆盖该批次的已通过版本；同专业同入学批次不可重复生成。",
        flow_out="独立执行计划副本；实际开课学期字段供下游开课模块引用（开课模块不在本文档范围）。",
        biz_flow="【执行计划】→ 生成 → 编辑四标签页 → 保存 → 提交锁定 →（下游开课模块，本文档不含）。",
        proto_link="prototype/index.html#page-exec-list",
        field_tables=[
            ("生成批次执行计划——弹窗", [
                ["1", "专业", "Programme", "下拉框", "是", "—", "—", "是", "Finance 金融学"],
                ["2", "入学批次", "Intake", "下拉框", "是", "02/04/09", "仅显示尚未生成且可匹配版本的入学批次", "是", "2025/02"],
                ["3", "匹配培养方案版本", "Matched Programme Version", "只读", "是", "自动匹配锁定", "入学批次须落在版本生效区间内", "否", "2024/09"],
            ]),
            ("执行计划编辑——标签页二课程设置（相对版本增加列）", [
                ["1", "课号/课名/分类/学分", "—", "—", "—", "同版本标签页二", "—", "—", ""],
                ["2", "开课学期", "Offering Semester", "只读/下拉", "条件", "本批次视角 Y1S1~YnS3", "由版本学期按槽位旋转重算", "是", "Y1S1"],
                ["3", "实际开课学期", "Actual Offering Semester", "只读", "—", "—", "明确年月如 2029/09；仅执行计划展示", "否", "2029/09"],
                ["4", "课程性质", "Course Nature", "只读", "—", "必修/选修", "—", "是", "必修"],
            ]),
        ],
        functions=EXEC_FUNCTIONS,
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
        ("步骤 1", "保留版本内原始结构学期编号（如第一年第三学期）"),
        ("步骤 2", "按版本起始批次类型与执行入学批次类型，在同一年级内旋转学期槽位，得到执行计划开课学期"),
        ("步骤 3", "由执行计划开课学期与执行入学批次，计算实际开课学年学期（如 2029/09）"),
        ("步骤 4", "选修课学期修读要求矩阵同步旋转；方案版本与变更不展示实际开课学期列"),
        ("批次相同", "版本起始批次与执行入学批次相同时，开课学期一一对应，仅补充实际年月"),
    ], col_widths=scale_widths((2.5, 13.5)))
    add_para(doc, "技术备注：版本原始结构学期（versionSemester）；实际开课学年学期（actualSemester）。")

    add_heading(doc, "2.2.4 数据统计（英文名称：Statistics）（需求确认状态：已确认）", 3)
    add_para(doc, "模块介绍：布鲁姆分类统计图按已提交执行计划统计课程学习成果的布鲁姆层级分布；执行计划统计展示专业×入学批次生成覆盖率。")
    add_menu_block(
        doc, "2.2.4.1 ", "Bloom's Taxonomy Charts（英文名：Bloom's Taxonomy Charts）", "已确认",
        intro="左侧树展示已提交执行计划（学院→专业代码→入学年份→批次叶子）；选中叶子节点后展示布鲁姆矩阵、汇总折线图与按年分布表。",
        list_fields="左侧树、布鲁姆矩阵表、Summary by Year 三域表格、汇总图。顶部上下文展示学院/专业/专业批次（非 EP 编号）。",
        search_fields="左侧树搜索过滤学院、专业、年份、入学批次。",
        flow_rel="聚合已提交执行计划中课程学习成果的布鲁姆评级并展示；树默认折叠。",
        flow_pre="存在已提交（isLocked）执行计划且课程含学习成果数据。",
        flow_out="导出功能待实现。",
        biz_flow="进入【Bloom 统计】→ 展开树选择批次叶子 → 查看图表 → 导出。",
        proto_link="prototype/index.html#page-stats-bloom",
        functions=STATS_FUNCTIONS,
    )

    add_menu_block(
        doc, "2.2.4.2 ", "执行计划统计（英文名称：Execution Plan Statistics）", "已确认",
        intro="以矩阵形式展示每个专业在各可用入学批次上是否已生成执行计划、引用方案版本及是否提交，便于管理员掌握生成进度。",
        list_fields="专业代码、学院代码、专业、专业批次、入学批次、生成状态、引用方案版本、是否提交。居中：专业代码、学院代码、入学批次、生成状态、引用方案版本、是否提交。",
        search_fields="学院代码（级联）、专业代码、入学批次、生成状态（已生成/未生成）；点击「查询」生效；支持分页。",
        flow_rel="根据执行计划索引与专业主数据生成覆盖率矩阵；只读统计，无数据写入。",
        flow_pre="已维护专业主数据与入学批次代码集。",
        flow_out="无。",
        biz_flow="进入【执行计划统计】→ 过滤查询 → 查看各专业批次生成与提交情况。",
        proto_link="prototype/index.html#page-stats-exec",
        functions=STATS_EXEC_FUNCTIONS,
    )

    add_menu_block(
        doc, "2.2.5 ", "操作流程图（英文名称：Workflow Diagram）", "已确认",
        intro="嵌入主业务流程图：四标签页版本制定、四级审批、执行计划、方案变更、只读查询与数据统计；图例靠左排列。",
        list_fields="流程图节点与连线；顶部四色图例靠左。",
        search_fields="无。",
        flow_rel="只读展示，无数据写入。",
        flow_pre="无。",
        flow_out="无。",
        biz_flow="概览 → 操作流程图 → 缩放查看。",
        proto_link="prototype/docs/pyfa-workflow.html",
        functions=WORKFLOW_FUNCTIONS,
    )

    # 附录 A–G（与参考文档一致）
    add_heading(doc, "附录 A：核心数据实体", 2)
    add_grid_table(doc, ["实体", "关键字段", "说明"], [
        ["专业主数据（PROGRAMMES）", "code, name, nameZh, schoolCode, degree, duration, acTeacher", "25 专业 · 9 学院；对照 UG 本科学院专业代码对照表"],
        ["培养方案版本（VERSIONS）", "id, programmeKey, name, version, startIntake, endIntake, status", "审批状态：草稿/审批中/已通过/已驳回（draft/pending/approved/rejected）"],
        ["方案版本内容（VERSION_CONTENT_STORE）", "classificationTree, programCourses, electiveSemesterRequirements, courseGroups", "版本方案内容（含课程组）"],
        ["教务课程库（COURSE_CATALOG）", "code, name, credits, clos, slt…", "全校课程主数据"],
        ["专业批次执行计划（EXEC_PLANS）", "planId, programmeKey, intake, versionId, isLocked, isAdjusted…", "各批次执行副本索引"],
        ["执行计划内容（EXEC_CONTENT_STORE）", "同版本内容结构 + actualSemester", "各批次独立副本"],
        ["变更申请（CHANGE_APPLICATIONS）", "id, targetVersionId, status…", "变更及审批状态；同版本最多一条 draft/pending"],
        ["审批队列（APPROVAL_QUEUE）", "versionId, stages[4], decision…", "版本/变更四级审批实例"],
    ], col_widths=scale_widths([4.0, 5.5, 6.5]))

    add_heading(doc, "附录 B：数据隔离规则", 2)
    add_grid_table(doc, ["场景", "写入范围", "是否影响其他数据"], [
        ["编辑方案版本并保存", "方案版本内容存储（VERSION_CONTENT_STORE）", "不影响已有执行计划副本（EXEC_CONTENT_STORE）"],
        ["编辑专业批次执行计划并保存", "执行计划内容存储（EXEC_CONTENT_STORE）", "不回写方案版本内容；不影响其他批次"],
        ["方案版本变更审批通过", "方案版本内容存储（VERSION_CONTENT_STORE）", "已生成执行计划副本保持不变"],
        ["新建执行计划", "新建执行计划内容存储（EXEC_CONTENT_STORE）", "引用生成时版本快照"],
    ], col_widths=scale_widths([4.5, 5.0, 6.5]))

    add_heading(doc, "附录 C：总学分取值规则", 2)
    add_kv_table(doc, [
        ("计算规则", "标签页一分类树各一级分类最低学分之和，与毕业总学分汇总一致；统计函数（calcGraduationTotalCredits）"),
        ("版本审批列表总学分", "取对应版本内容中分类树毕业总学分；函数（getApprovalItemTotalCredits）"),
        ("变更审核列表总学分", "取变更内容或目标版本快照的毕业总学分；函数（getChangeApplicationTotalCredits）"),
        ("执行计划列表总学分", "取当前批次执行计划内容的毕业总学分；函数（getExecPlanTotalCredits）"),
        ("顶栏信息条", "不展示毕业总学分"),
    ], col_widths=scale_widths((3.5, 12.5)))

    add_heading(doc, "附录 D：列表列对齐规范（V2.0）", 2)
    add_grid_table(doc, ["页面", "居中列", "靠左列（其余默认）"], [
        ["方案版本管理 / 版本查询", "审批状态、专业代码、学院代码、学制、版本、开始 Intake、截止 Intake、授予学位、版本引用情况", "培养方案版本、操作"],
        ["版本审批", "Status、专业代码、学院代码、开始 Intake、总学分", "培养方案、Stage、提交人、提交时间、操作"],
        ["变更申请", "专业代码、学院代码、版本、状态", "目标培养方案版本、提交人、提交时间、操作"],
        ["变更审核", "Status、专业代码、学院代码、版本、开始 Intake、总学分", "培养方案、Stage、提交人、提交时间、操作"],
        ["执行计划列表", "专业代码、总学分、是否提交", "专业、专业批次、学院代码、入学批次、是否调整、AC、操作"],
        ["执行计划统计", "专业代码、学院代码、入学批次、生成状态、引用方案版本、是否提交", "专业、专业批次"],
        ["标签页一分类树", "课程性质、课程数", "课程分类、最低/最高学分、操作"],
        ["标签页二配置面板", "课程数量、已配置学分、学分要求、状态", "分类"],
        ["标签页二课程表", "学分、开课学期、课程性质（执行计划加实际开课学期）", "课号、课名、分类列、操作"],
        ["标签页三课程组", "须选课程数、合计学分要求、组内课程数", "开课学期、分类、必选项、备注、操作"],
    ], col_widths=scale_widths([3.5, 6.5, 5.0]))

    add_heading(doc, "附录 E：状态标签与样式（V2.0）", 2)
    add_grid_table(doc, ["场景", "标签", "说明"], [
        ["版本列表", "Draft / In Progress / Approved / Rejected", "方案版本管理、版本查询；底层 draft/pending/approved/rejected"],
        ["变更申请", "Draft / In Progress / Approved / Rejected", "审批中记录显示审批日志；批量提交/删除仅 draft/rejected"],
        ["审批/变更审核 Status", "Approved / Rejected / In Progress / Update Required / Cancelled", "getApprovalOverallStatus / getChangeReviewOverallStatus"],
        ["Status 徽章配色", "Approved 绿底白字；Rejected 红底白字；Cancelled 灰底白字", "审批与变更审核列表"],
        ["执行计划是否提交", "已提交", "绿色底 #16a34a、白字（exec-status-lock-yes）"],
    ], col_widths=scale_widths([4.0, 5.5, 5.5]))

    add_heading(doc, "附录 F：核心术语与底层字段（V2.0）", 2)
    add_grid_table(doc, ["中文", "英文", "底层字段/函数"], [
        ["专业", "Programme（非 Major）", "PROGRAMMES、programmeKey；25 专业代码见 mock-data.js"],
        ["学院", "School / Faculty", "schoolCode、SCHOOL_NAME_MAP；9 学院"],
        ["入学批次", "Intake（非 Batch）", "intake、startIntake、endIntake、INTAKE_TYPES"],
        ["Intake 显示", "—", "formatIntakeDisplay()、formatIntake()、parseIntake()"],
        ["Programme 批次码", "—", "formatProgrammeIntakeCode()；如 FIN-2025/09"],
        ["课程数统计", "—", "countProgramCoursesForNode()、calcNodeCourseCount()"],
        ["课程组", "Course Group", "courseGroups；仅选修；影响 TAB4 展示"],
        ["合并课程", "Merged Course", "mergeWithPcId；影响 TAB3/TAB4 展示"],
    ], col_widths=scale_widths([3.0, 4.5, 8.5]))

    add_heading(doc, "附录 F-1：专业与学院主数据（25 专业 · 9 学院）", 2)
    add_para(doc, "数据来源：参考文档/UG本科学院专业代码对照表.xlsx。学院代码与专业代码为系统级联筛选基准。")
    add_grid_table(doc, ["学院代码", "学院英文名称", "专业数量"], [
        ["SASS", "School of Arts and Social Sciences", "2"],
        ["SEM", "School of Economics and Management", "5"],
        ["SOC", "School of Communication", "3"],
        ["STCM", "School of Traditional Chinese Medicine", "1"],
        ["SCDS", "School of Computing and Data Science", "5"],
        ["CAMS", "China-ASEAN College of Marine Sciences", "2"],
        ["SECE", "School of Energy and Chemical Engineering", "2"],
        ["SEEAI", "School of Artificial Intelligence and Robotics", "3"],
        ["SMP", "School of Mathematics and Physics", "2"],
    ], col_widths=scale_widths([2.5, 8.0, 2.0]))
    add_para(doc, "专业代码（No.1–25）：CHS, ACC, FIN, IBU, JRN, TCM, CST, DMT, SWE, MBT, CME, EGE, EEE, ADT, MAT, MEC, PHY, AIT, ENG, CYS, DSC, ECM, COS, ERA, HMT。")

    add_heading(doc, "附录 G：原型占位功能（正式开发需实现）", 2)
    add_grid_table(doc, ["功能", "当前原型行为", "优先级"], [
        ["版本导出", "轻提示占位，模板待定", "高"],
        ["TAB4 导出 PDF/打印", "按钮占位", "中"],
        ["Bloom / 执行计划统计 Export", "轻提示占位", "中"],
        ["用户认证与角色路由", "无", "高"],
        ["开课模块", "不在培养方案 PRD 范围", "—"],
    ], col_widths=scale_widths([4.0, 7.0, 2.0]))

    add_heading(doc, "附录 I：四标签页编辑权限矩阵（V2.2）", 2)
    add_para(doc, "同一 page-version-edit 页面在不同业务入口下的 TAB1~TAB4 增删改权限对照；执行计划 TAB3 不可维护课程组，仅可查看。")
    add_grid_table(doc, ["入口场景", "TAB1 分类", "TAB2 课程", "TAB3 课程组", "TAB4 进程表"],
                   TAB_EDIT_PERMISSION_MATRIX, col_widths=scale_widths([3.5, 3.5, 4.0, 3.5, 2.5]))

    add_heading(doc, "附录 J：标签页解锁与数据联动（V2.2）", 2)
    add_grid_table(doc, ["联动关系", "规则", "不满足时行为"],
                   TAB_UNLOCK_LOGIC, col_widths=scale_widths([3.0, 6.5, 6.5]))

    add_heading(doc, "附录 K：课程组字段与校验逻辑（V2.2）", 2)
    add_grid_table(doc, ["逻辑项", "规则", "说明/拦截"],
                   COURSE_GROUP_LOGIC, col_widths=scale_widths([2.5, 4.5, 9.0]))

    add_heading(doc, "附录 L：课程设置交叉字段逻辑（V2.2）", 2)
    add_grid_table(doc, ["字段/功能", "规则", "说明"],
                   COURSE_FIELD_CROSS_LOGIC, col_widths=scale_widths([2.8, 4.2, 9.0]))

    add_heading(doc, "附录 M：学分校验逻辑（V2.2）", 2)
    add_para(doc, "以下规则在分类保存、课程添加及版本/变更提交审批时触发；执行计划保存不重复校验版本级结构（TAB1 只读）。")
    add_grid_table(doc, ["场景", "校验规则", "触发时机"],
                   CREDIT_VALIDATION_LOGIC, col_widths=scale_widths([2.5, 6.0, 7.5]))

    add_heading(doc, "附录 N：审批与版本链逻辑（V2.2）", 2)
    add_grid_table(doc, ["逻辑项", "规则", "说明"],
                   APPROVAL_VERSION_LOGIC, col_widths=scale_widths([2.8, 5.0, 8.2]))

    add_heading(doc, "附录 H：校验与提示汇总", 2)
    add_para(doc, "正式开发建议统一消息组件；下表为业务文案摘要。")
    add_grid_table(doc, ["来源模块", "触发条件", "提示方式", "提示内容摘要"], VALIDATION_PROMPTS,
                   col_widths=scale_widths([2.0, 4.5, 1.5, 8.0]))

    doc.save(OUT)
    print(f"Generated: {OUT}")
