# -*- coding: utf-8 -*-
"""按 XMUM 产品需求文档模板结构生成开课管理模块 PRD。"""

# 字段表列：序号 | 中文 | 英文 | 类型 | 必填 | 校验 | 备注 | 代码集 | 样例


def f(*cells):
    return list(cells)


def fn(num, cn, en, desc, interaction, notes, drill):
    return (num, cn, en, desc, interaction, notes, drill)


# ─── 共用字段表 ───────────────────────────────────────────────

SECTION_STATUS_FIELDS = [
    f("1", "计划提交状态", "Plan Submit Status", "状态", "是", "draft/submitted/reverted",
      "开课计划层：草稿/已提交/已退回", "是", "submitted"),
    f("2", "任务安排提交状态", "Task Arrangement Status", "状态", "是", "pending/confirmed",
      "任务安排层：历史字段名 teachingConfirmStatus；confirmed 表示任务已提交", "是", "confirmed"),
    f("3", "选课类型", "Enrollment Type", "下拉框", "是", "closed/open",
      "默认不开放选课；开放选课名单由选课应用生成", "是", "closed"),
    f("4", "开课类型", "Offering Type", "枚举", "是", "major/ge/other",
      "专业开课 / 通识选修 / 特殊开课", "是", "major"),
]

MERGE_FIELDS = [
    f("1", "课程号", "Course Code", "只读", "是", "合班双方必须相同", "同课号方可合班", "否", "ACC301"),
    f("2", "学分", "Credits", "只读", "是", "合班双方必须相同", "—", "否", "3"),
    f("3", "计划总学时", "Total Hours", "只读", "是", "合班双方必须相同", "含 L/T/P/O", "否", "42"),
    f("4", "起止周", "Week Range", "只读", "是", "合班双方必须相同", "按开课学期校历", "否", "1-14"),
    f("5", "选课类型", "Enrollment Type", "只读", "是", "合班双方必须相同", "—", "是", "closed"),
    f("6", "专业批次", "Prog. Batch", "多选/穿梭", "是", "至少保留 1 个批次",
      "合入后 lineIds 挂同一教学班；人数/预留累加；清空分组与教师安排", "否", "FIN-2024/09"),
]

GROUPING_FIELDS = [
    f("1", "小组名称", "Group Name", "文本", "是", "同教学班内不重复", "可按行政班批量建组", "否", "Group 1"),
    f("2", "小组人数上限", "Group Capacity", "数字", "是", ">0；提交前总和须覆盖计划人数", "—", "否", "40"),
    f("3", "学时类型", "Hour Type", "下拉框", "是", "L/T/P/O", "理论/辅导/实践/其他", "是", "L"),
    f("4", "投递范围", "Delivery Scope", "下拉框", "是", "section/group",
      "理论常 Section 共上；辅导/实践可按组", "是", "section"),
    f("5", "授课教师", "Lecturer", "选择器", "是", "至少 1 名；多教师须指定 Coordinator",
      "角色：主讲/助教/Support", "否", ""),
    f("6", "Course Coordinator", "Course Coordinator", "选择器", "条件", "多教师时必填", "—", "否", ""),
    f("7", "周次", "Week Range", "文本", "是", "须落在教学班起止周内", "—", "否", "1-14"),
    f("8", "同时多组授课", "Simultaneous Groups", "开关", "否", "—", "开启后学时只计一次", "否", ""),
]

TIME_SETTING_FIELDS = [
    f("1", "学年学期", "Academic Term", "下拉框", "是", "—", "来自校历学期代码集", "是", "2025/09"),
    f("2", "是否开课学期", "Is Offering Term", "开关", "是", "—", "为「是」时方可生成开课任务", "是", "是"),
    f("3", "全校开放开始时间", "School Open From", "日期时间", "条件", "—", "全校默认开课操作窗口", "否", ""),
    f("4", "全校开放结束时间", "School Open To", "日期时间", "条件", "须≥开始时间", "—", "否", ""),
    f("5", "单位开课时间", "Unit Offering Window", "抽屉配置", "否", "有配置则优先于全校",
      "开课单位级覆盖；未配置继承全校", "否", ""),
]

ELECTIVE_COURSE_FIELDS = [
    f("1", "课程号", "Course Code", "文本/选择器", "是", "课库唯一", "来自教务课程库", "否", "MPU3183"),
    f("2", "课程名称", "Course Name", "只读/文本", "是", "—", "—", "否", ""),
    f("3", "通识类别", "GE Category", "下拉框", "是", "—", "校选课分类", "是", ""),
    f("4", "开课单位", "Offering Unit", "下拉框", "是", "—", "—", "是", "AC"),
    f("5", "状态", "Status", "下拉框", "是", "active/suspended", "停复课", "是", "active"),
    f("6", "不可选专业", "Excluded Programmes", "多选", "否", "—", "选课端校验用", "是", ""),
    f("7", "可选学生类型", "Eligible Student Types", "多选", "否", "—", "Chinese/Local/International 等", "是", ""),
    f("8", "可选 Intake/年级", "Eligible Intake", "多选", "否", "—", "评审要求补充；待确认与选课端联调", "是", "Year2"),
]


def build_document(
    add_heading,
    add_para,
    add_kv_table,
    add_grid_table,
    add_field_table,
    add_menu_block,
    scale_widths,
    OUT,
    Document,
    set_document_landscape,
):
    doc = Document()
    set_document_landscape(doc)

    add_heading(doc, "厦大马来分校本科教务系统产品需求文档", 0)
    add_para(doc, "文档版本：V1.0")
    add_para(doc, "创建日期：2026 年 7 月 20 日")
    add_para(
        doc,
        "修订说明：V1.0 依据可交互原型（prototype）与《开课管理与排课管理原型评审0710汇总》整理；"
        "覆盖开课前置条件、专业/通识/特殊三类开课、开课清单与共同授课等。"
        "通识选修与特殊开课导航标注「设计中」，开课清单标注「调整中」；待定事项见附录。",
    )
    add_para(doc, "模块范围：开课管理（Course Offering Management）")
    add_para(doc, "对应原型：prototype/index.html、prototype/app.js、docs/course-offering-workflow.html")
    doc.add_paragraph()

    # ─── 1 文档概述 ───
    add_heading(doc, "文档概述", 1)
    add_heading(doc, "1.1 文档目的", 2)
    add_para(
        doc,
        "本文档为厦大马来分校本科教务系统「开课管理」模块提供标准化需求输入，"
        "依据已完成的可交互原型整理功能、字段、业务规则与数据流转，"
        "明确「计划 → 合班 → 任务安排（分组/教师/Support）→ 名单 → 开课清单 → 排课」主路径，"
        "供需求评审与后续正式开发使用。",
    )
    add_heading(doc, "1.2 开发背景", 2)
    add_kv_table(
        doc,
        [
            ("开发模式", "边分析边迭代，分模块生成可交互原型"),
            (
                "目标用户",
                "Academic Affairs（AC）、Programme Office、学院教务、开课单位协调员、授课教师（只读/确认场景）",
            ),
            (
                "覆盖范围",
                "开课时间与校选课库、专业/通识/特殊开课全链路、合班与分组、Support、名单与变更日志、"
                "开课清单、共同授课、教师开课学时统计；不含排课排课细则（见排课管理模块）",
            ),
        ],
        col_widths=scale_widths((3, 13)),
    )
    add_heading(doc, "1.3 文档说明", 2)
    add_para(
        doc,
        "本文档依据现有原型逆向整理，并对照 2026-07-10 原型评审纪要标注待确认项。"
        "菜单与字段采用「中文（英文名称：…）」格式。"
        "核心实体层级：开课计划行（Offering Line）→ 教学班（Section）→ 小组（Group）→ 学时投递（Hour Delivery / Group Assignment）。"
        "合班（Merge）与分组（Group）职责分离：合班在计划/任务前合并专业批次；分组在任务安排阶段由学院完成。"
        "双层提交：计划提交状态（submitStatus）与任务安排提交状态（teachingConfirmStatus / taskArrangementSubmittedAt）。",
    )

    # ─── 2 系统分析 ───
    add_heading(doc, "系统分析", 1)
    add_heading(doc, "2.1 应用目录——开课管理", 2)
    add_grid_table(
        doc,
        ["一级目录", "一级目录英文名称", "二级目录", "二级目录英文名称", "三级目录", "备注说明"],
        [
            ["开课前置条件管理", "Offering Prerequisites", "操作流程图", "Workflow Diagram", "—", "嵌入三类开课主路径图"],
            ["开课前置条件管理", "Offering Prerequisites", "开课时间设置", "Offering Time Setting", "单位开课时间", "全校默认 + 单位覆盖"],
            ["开课前置条件管理", "Offering Prerequisites", "校选课程管理", "School Elective Courses", "—", "通识候选课库"],
            ["专业开课", "Major Offering", "专业开课计划", "Major Offering Plan", "—", "从执行计划生成任务"],
            ["专业开课", "Major Offering", "专业开课任务安排", "Major Offering Task Arrangement", "样式一/样式二", "合班、Support、安排教师"],
            ["专业开课", "Major Offering", "专业开课学生名单管理", "Major Offering Roster", "—", "任务提交后维护"],
            ["通识选修课开课", "GE Offering", "通识选修计划", "GE Offering Plan", "需求+配额", "设计中；AC 保底组数"],
            ["通识选修课开课", "GE Offering", "通识选修开课", "GE Offering", "计划+安排合表", "设计中；无合班"],
            ["通识选修课开课", "GE Offering", "通识选修课开课名单管理", "GE Offering Roster", "—", "设计中；默认选课应用"],
            ["特殊开课", "Special Offering", "特殊开课计划", "Special Offering Plan", "—", "设计中；手工加课"],
            ["特殊开课", "Special Offering", "特殊开课任务安排", "Special Offering Task", "—", "设计中；无合班"],
            ["特殊开课", "Special Offering", "特殊开课学生名单管理", "Special Offering Roster", "—", "设计中；全手工名单"],
            ["开课清单", "Offering Manifest", "教师开课学时统计", "Teaching Load", "—", "调整中"],
            ["开课清单", "Offering Manifest", "开课清单", "Offering Manifest", "—", "调整中；任务已提交汇总"],
            ["开课清单", "Offering Manifest", "共同授课维护", "Shared Teaching", "—", "排课冲突豁免"],
            ["开课清单", "Offering Manifest", "开课名单变更日志", "Roster Change Log", "—", "进组/出组追溯"],
            ["（工作台）", "Workbench", "分组工作台", "Offering Grouping", "沉浸页", "侧栏隐藏；新窗口打开"],
        ],
        col_widths=scale_widths([2.2, 2.6, 2.8, 3.2, 2.0, 3.7]),
    )

    add_heading(doc, "2.2 开课管理——系统需求", 2)

    # ─── 2.2.1 前置 ───
    add_heading(doc, "2.2.1 开课前置条件管理（英文名称：Offering Prerequisites）（需求确认状态：已确认）", 3)
    add_para(
        doc,
        "模块介绍：为开课业务提供学期窗口、校选课主数据与操作路径说明；"
        "专业开课依赖「是否开课学期=是」及培养方案侧已提交执行计划。",
    )

    add_menu_block(
        doc,
        "2.2.1.1 ",
        "操作流程图（英文名称：Workflow Diagram）",
        "已确认",
        intro="嵌入开课管理主路径流程图，帮助学院理解三类开课与下游排课衔接；支持缩放。",
        list_fields="流程图节点：开课时间设置 → 执行计划/校选课库 → 专业|通识|特殊（计划→任务→名单）→ 开课清单 → 共同授课 → 排课/选课。",
        search_fields="无列表筛选；支持缩放与重置。",
        flow_rel="只读说明页，不产生业务数据。",
        flow_pre="无。",
        flow_out="帮助用户理解后续菜单操作顺序。",
        biz_flow="进入【操作流程图】→ 阅读主路径 → 按图进入对应菜单。",
        proto_link="prototype/index.html → page-course-workflow；docs/course-offering-workflow.html",
        functions=[
            fn("1", "缩放", "Zoom", "放大/缩小/重置流程图显示比例。", "点击工具栏按钮调整视图。", "—", "无下钻。"),
        ],
    )

    add_menu_block(
        doc,
        "2.2.1.2 ",
        "开课时间设置（英文名称：Offering Time Setting）",
        "已确认",
        intro="按学年学期配置是否开课学期及全校开课操作时间窗口；支持按开课单位覆盖单位级时间（优先于全校）。"
        "教学周长度按学期类型固定（如 2 月短学期 6 周，4/9 月学期 17 周，以校历为准）。",
        list_fields="学年学期、是否开课学期、全校开放起止时间、单位开课时间入口、操作。",
        search_fields="学年学期、是否开课学期；查询/重置。",
        flow_rel="配置「是否开课学期=是」后，专业开课计划方可对该学期生成任务；单位时间覆盖全校默认。",
        flow_pre="已维护校历学年学期。",
        flow_out="开课操作窗口、默认起止周；供三类开课列表学期筛选。",
        biz_flow="进入【开课时间设置】→ 新增/修改学期配置 → 按需打开单位开课时间抽屉覆盖 → 保存。",
        proto_link="prototype/index.html → page-course-time-setting",
        field_tables=[("开课时间设置——字段", TIME_SETTING_FIELDS)],
        functions=[
            fn(
                "1",
                "新增",
                "Add",
                "新增一条学年学期开课时间配置。",
                "打开表单/弹窗填写后保存。",
                "同一学年学期不可重复。",
                "弹窗：修改开课时间。",
            ),
            fn(
                "2",
                "修改",
                "Edit",
                "修改是否开课学期与全校开放时间。",
                "行操作打开弹窗。",
                "—",
                "弹窗：修改开课时间。",
            ),
            fn(
                "3",
                "单位开课时间设置",
                "Unit Offering Window",
                "为指定开课单位配置覆盖时间。",
                "打开抽屉维护单位列表与时间。",
                "有单位配置则优先于全校。",
                "抽屉：单位开课时间设置。",
            ),
            fn("4", "删除", "Delete", "删除学期配置。", "勾选或行删除确认。", "已产生开课数据的学期需二次确认。", "无。"),
        ],
    )

    add_menu_block(
        doc,
        "2.2.1.3 ",
        "校选课程管理（英文名称：School Elective Courses）",
        "已确认",
        intro="维护通识选修候选课库：类别、停复课、不可选专业、可选学生类型等；是通识选修开课加课的数据源。"
        "评审要求补充 Intake/年级可选限制，正式开发需与选课端校验联调（待确认）。",
        list_fields="课程号、课程名称、通识类别、开课单位、状态、不可选专业、操作等。",
        search_fields="开课单位、类别、状态、关键词（课号/课名）。",
        flow_rel="维护后的 active 课程可供通识选修开课添加；停课不可新开。",
        flow_pre="教务课程库已存在对应课程。",
        flow_out="通识选修开课候选池。",
        biz_flow="进入【校选课程管理】→ 新增/编辑/停复课 → 配置可选范围 → 供通识开课引用。",
        proto_link="prototype/index.html → page-school-elective-courses",
        field_tables=[("校选课程——字段", ELECTIVE_COURSE_FIELDS)],
        functions=[
            fn("1", "新增", "Add", "从课程库将课程纳入校选池并配置类别与范围。", "打开新增表单保存。", "课号唯一。", "新增表单。"),
            fn("2", "编辑", "Edit", "修改类别、不可选专业、学生类型、状态等。", "行编辑。", "—", "编辑表单。"),
            fn("3", "删除", "Delete", "移出校选池。", "勾选删除确认。", "已开课引用的课程需拦截或提示。", "无。"),
        ],
    )

    # ─── 2.2.2 专业开课 ───
    add_heading(doc, "2.2.2 专业开课（英文名称：Major Offering）（需求确认状态：已确认）", 3)
    add_para(
        doc,
        "模块介绍：从已提交专业批次执行计划生成开课任务，完成教学任务编辑、合班、任务安排（分组/教师/Support）、"
        "名单维护后进入开课清单。唯一约束：同一门课 + 同一专业 + 同一批次仅一条计划行。"
        "生成时禁止自动合班；合班由教务/学院手动完成。",
    )

    add_menu_block(
        doc,
        "2.2.2.1 ",
        "专业开课计划（英文名称：Major Offering Plan）",
        "已确认",
        intro="从已提交执行计划中筛选本学期未开课专业课，生成开课计划行与教学班；支持修改教学任务、合班（未提交时）、"
        "批量提交进入任务安排；已提交后合班须在任务安排页完成。",
        list_fields="勾选框、提交状态、课程号、课程名称、课程分类、选课类型、上课专业、上课批次、新生批次标识、"
        "学分、计划总学时、起止周、开课单位、Support 历史、计划人数/学生数、操作（修改/合班/退回说明等）。",
        search_fields="开课学期、上课学院、上课专业、开课单位、课程号、提交状态；查询/重置。",
        flow_rel="生成候选=已提交执行计划 × 本学期未开课专业课；1 课+1 专业+1 批次 → 1 计划行 + 1 教学班；"
        "提交后 submitStatus=submitted，进入任务安排列表。",
        flow_pre="开课时间设置中该学期为开课学期；对应专业批次执行计划已提交；课程未标记已开课。",
        flow_out="已提交计划进入专业开课任务安排；schedulingVisible 供下游可见性控制。",
        biz_flow="进入【专业开课计划】→ 生成开课任务（筛选/全选）→ 修改教学任务（选课类型、周次、排课相关开关等）→ "
        "必要时合班 → 勾选提交 → 进入【专业开课任务安排】。",
        proto_link="prototype/index.html → page-course-offering-major",
        field_tables=[
            (
                "专业开课计划列表——关键字段",
                [
                    f("1", "提交状态", "Submit Status", "状态", "是", "—", "draft/submitted/reverted", "是", "draft"),
                    f("2", "课程号", "Course Code", "文本", "是", "—", "—", "否", "ACC301"),
                    f("3", "课程名称", "Course Name", "文本", "是", "—", "—", "否", ""),
                    f("4", "选课类型", "Enrollment Type", "下拉", "是", "—", "默认 closed", "是", "closed"),
                    f("5", "上课专业", "Programme", "只读", "是", "—", "合班可多专业", "是", "FIN"),
                    f("6", "上课批次", "Intake", "只读", "是", "—", "合班可多批次", "是", "2024/09"),
                    f("7", "学分", "Credits", "数字", "是", "—", "同课同学期须一致", "否", "3"),
                    f("8", "计划总学时", "Total Hours", "数字", "是", "—", "—", "否", "42"),
                    f("9", "起止周", "Week Range", "文本", "是", "—", "默认取学期教学周，不含考试周", "否", "1-14"),
                    f("10", "开课单位", "Offering Unit", "只读", "是", "—", "—", "是", ""),
                    f("11", "计划人数", "Planned Headcount", "数字", "否", "—",
                      "老生优先预置名单人数；新生读招生计划；合班汇总规则待确认", "否", "96"),
                    f("12", "预留名额", "Reserved Seats", "数字", "否", "≥0", "合班时累加", "否", "0"),
                ],
            ),
            ("修改教学任务——关键字段", [
                f("1", "选课类型", "Enrollment Type", "下拉", "是", "—", "默认不开放选课", "是", "closed"),
                f("2", "起止周", "Week Range", "文本", "是", "落在学期教学周", "—", "否", "1-14"),
                f("3", "是否排课", "Needs Scheduling", "开关", "是", "—", "学时为 0 等场景默认可为否", "否", "是"),
                f("4", "是否排场地", "Needs Venue", "开关", "否", "—", "—", "否", ""),
                f("5", "是否考勤", "Needs Attendance", "开关", "否", "—", "默认倾向否（评审）", "否", ""),
                f("6", "是否成绩", "Needs Grade", "开关", "否", "—", "—", "否", ""),
                f("7", "是否排考", "Needs Exam", "开关", "否", "—", "默认倾向否", "否", ""),
                f("8", "预留名额", "Reserved Seats", "数字", "否", "≥0", "—", "否", "0"),
            ]),
            ("合班——约束字段", MERGE_FIELDS),
            ("状态模型——双层提交", SECTION_STATUS_FIELDS),
        ],
        functions=[
            fn(
                "1",
                "生成开课任务",
                "Generate Offering Tasks",
                "打开候选选择器，按执行计划生成本学期开课计划与教学班。",
                "筛选后勾选或一键全部生成；每条生成独立教学班，禁止自动合班。",
                "仅未开课课程；同学期同专业同批次同课不可重复。",
                "弹窗：生成开课任务选择器。",
            ),
            fn(
                "2",
                "修改",
                "Edit Teaching Task",
                "编辑教学任务属性（选课类型、周次、排课相关开关、预留等）。",
                "行操作打开修改抽屉/弹窗，保存回写教学班。",
                "已提交计划修改范围受限或需先退回（以原型校验为准）。",
                "修改教学任务抽屉。",
            ),
            fn(
                "3",
                "合班",
                "Merge Sections",
                "将同课号且学分/学时/周次/选课类型等一致的多专业批次合并为一条教学班。",
                "打开合班抽屉穿梭合入/拆出批次；确认后合并 lineIds，人数与预留累加，清空分组与教师安排。",
                "已提交计划须在任务安排页合班；教务与学院均应具备合班能力。",
                "合班抽屉。",
            ),
            fn(
                "4",
                "提交",
                "Submit Plan",
                "将勾选的草稿计划提交至任务安排。",
                "批量提交；状态变为 submitted。",
                "须已生成有效教学班。",
                "无。",
            ),
            fn(
                "5",
                "删除",
                "Delete",
                "删除未提交或不需要的计划行/教学班。",
                "勾选删除确认。",
                "已提交项不可直接删除，须先退回。",
                "无。",
            ),
        ],
    )

    add_menu_block(
        doc,
        "2.2.2.2 ",
        "专业开课任务安排（英文名称：Major Offering Task Arrangement）",
        "已确认",
        intro="对已提交开课计划进行合班、申请 Support、安排教师（分组+学时投递+Coordinator），完成后批量提交任务安排；"
        "支持撤回任务安排与退回计划。提供样式一（宽表）与样式二（三步引导：课程班→Support→师资）两种界面，同一数据源。"
        "列表专业批次展示为 Prog. Batch（合班多行）；样式二含课程信息「详情」、操作记录、导入占位。",
        list_fields="勾选框、提交状态、开课学期、课程号、课程名称、选课类型、Prog. Batch、学分、计划总学时、教师数、"
        "Course Coordinator、开课单位、起止周、Support（历史/详情/申请）、操作；"
        "样式二另含开课状态、Classification、小组数、计划总人数、Lecturer、操作记录、课程信息等。",
        search_fields="学年学期、上课学院、上课专业、开课单位、课程号、提交状态（已提交/草稿/回退）。",
        flow_rel="输入为计划已提交教学班；合班合并多批次；安排教师写入 groups/groupAssignments；"
        "提交任务后 teachingConfirmStatus=confirmed 并写入提交时间，进入名单与开课清单；"
        "撤回清空分组/名单分配；退回计划变 reverted 并拆合班。",
        flow_pre="专业开课计划已提交；任务未授课锁定（未确认下游锁定）。",
        flow_out="任务已提交数据进入名单管理与开课清单；供排课消费。",
        biz_flow="进入任务安排 →（可选）合班 → 申请 Support → 安排教师（分组工作台）→ 勾选提交；"
        "需改计划则退回；需改安排则撤回。样式二按步骤聚焦操作，各步均可提交/撤回/退回。",
        proto_link="page-course-major-offering-task；page-course-major-offering-task-style2；page-offering-grouping",
        field_tables=[
            ("任务安排——分组与学时", GROUPING_FIELDS),
            (
                "Support——字段",
                [
                    f("1", "Support 单位", "Support Unit", "多选", "否", "—", "共享给其他学院安排教师", "是", ""),
                    f("2", "Support 历史", "Support History", "只读", "—", "—", "列表展示", "否", ""),
                    f("3", "教师角色 Support", "Teacher Role Support", "角色", "条件", "—",
                      "非开课学院教师进入安排时自动 Support 标记", "是", "Support"),
                ],
            ),
        ],
        functions=[
            fn(
                "1",
                "提交",
                "Submit Task Arrangement",
                "批量提交已完成分组与教师安排的教学班。",
                "校验通过后标记任务已提交。",
                "硬校验倾向：须已分组、容量覆盖计划人数、教师/学时安排完整；软校验项（教分）待确认。",
                "无。",
            ),
            fn(
                "2",
                "撤回",
                "Withdraw Task Arrangement",
                "撤回已提交的任务安排，重置分组与名单分组。",
                "勾选后撤回。",
                "仅任务已提交且未进入不可撤回下游状态时可操作。",
                "无。",
            ),
            fn(
                "3",
                "退回",
                "Revert to Plan",
                "将任务退回开课计划，可填退回说明；合班拆回单批次并清空安排。",
                "勾选后退回确认。",
                "任务未提交或符合退回条件时可操作。",
                "退回说明查看。",
            ),
            fn(
                "4",
                "合班",
                "Merge",
                "在任务安排阶段合并/拆分专业批次。",
                "打开合班抽屉。",
                "同计划页合班规则。",
                "合班抽屉。",
            ),
            fn(
                "5",
                "安排教师",
                "Arrange Teachers",
                "进入分组工作台维护分组、学时类型、教师与 Coordinator。",
                "常以新窗口打开沉浸式分组页。",
                "—",
                "分组工作台（offering-grouping）。",
            ),
            fn(
                "6",
                "申请 Support",
                "Apply Support",
                "将教学班共享给其他学院，便于安排 Support 教师。",
                "Support 列申请弹窗。",
                "首学期可由 AC 经验标记，后续可历史推荐（待确认）。",
                "Support 申请弹窗/详情。",
            ),
            fn(
                "7",
                "详情 / 查看",
                "View Course Info",
                "查看课程班计划与安排只读信息。",
                "样式二「课程信息」列详情；样式一行操作查看。",
                "—",
                "计划修改抽屉只读。",
            ),
            fn(
                "8",
                "操作记录",
                "Change Log",
                "查看课程班变更记录。",
                "打开修改记录新窗口。",
                "—",
                "page-course-section-change-log。",
            ),
            fn(
                "9",
                "导入",
                "Import",
                "批量导入占位（原型未实现）。",
                "点击提示占位。",
                "正式规则待定。",
                "无。",
            ),
        ],
    )

    add_menu_block(
        doc,
        "2.2.2.3 ",
        "专业开课学生名单管理（英文名称：Major Offering Roster）",
        "已确认",
        intro="任务安排提交后，按教学班/小组维护学生名单。不开放选课：预置名单 + 手工添加/调组/移除；"
        "开放选课：名单由选课应用生成，开课侧提示选课应用。支持将任务退回任务安排。"
        "异动与预置名单联动规则倾向下学期生效（待与学籍模块确认）。",
        list_fields="开课学期、课程号、课程名称、专业批次、小组、学生数、选课类型、状态、操作（查看/管理名单）等。",
        search_fields="学期、学院、专业、开课单位、课程号。",
        flow_rel="读取任务已提交教学班；名单变更写入变更日志；退回后回到任务安排可改分组。",
        flow_pre="任务安排已提交。",
        flow_out="稳定名单供排课/考勤等下游；变更日志可审计。",
        biz_flow="进入名单管理 → 管理名单（分组工作台学生名单 Tab）→ 预置分配/添加/调整/移除 → 必要时退回任务。",
        proto_link="page-course-major-offering-roster；offering-grouping 学生名单 Tab",
        field_tables=[
            (
                "名单维护——字段",
                [
                    f("1", "学号", "Student No", "文本", "是", "—", "—", "否", ""),
                    f("2", "姓名", "Name", "文本", "是", "—", "—", "否", ""),
                    f("3", "专业", "Programme", "只读", "是", "—", "—", "是", ""),
                    f("4", "批次", "Intake", "只读", "是", "—", "—", "是", ""),
                    f("5", "小组", "Group", "选择器", "是", "须属于本教学班", "可调组", "否", ""),
                    f("6", "来源", "Source", "只读", "—", "—", "预置/手工/选课应用/异动", "是", "预置"),
                ],
            ),
        ],
        functions=[
            fn("1", "管理名单", "Manage Roster", "打开分组工作台学生名单维护。", "行操作进入。", "开放选课不可手工主维护。", "分组工作台-学生名单。"),
            fn("2", "退回", "Revert Task", "批量退回至任务安排。", "工具栏退回。", "—", "无。"),
            fn("3", "查看", "View", "只读查看教学班信息。", "行操作。", "—", "详情抽屉。"),
        ],
    )

    # ─── 2.2.3 通识 ───
    add_heading(doc, "2.2.3 通识选修课开课（英文名称：GE Offering）（需求确认状态：待确认）", 3)
    add_para(
        doc,
        "模块介绍：基于校选课库与 AC 学院保底组数配额，学院添加开课并安排教师后提交；"
        "无合班（或极少）；名单默认来自选课应用。导航标注「设计中」。",
    )

    add_menu_block(
        doc,
        "2.2.3.1 ",
        "通识选修计划（英文名称：GE Offering Plan）",
        "待确认",
        intro="上段展示本学期需修 GE 的专业批次需求（原型假数据；正式需联动执行计划选修修读要求）；"
        "下段维护各学院保底开课组数配额并保存。",
        list_fields="需求：专业批次、总人数、分学院、分文商理等；配额：学院、保底组数、已开组数/进度。",
        search_fields="开课学期。",
        flow_rel="配额下限约束通识开课提交；需求用于 AC/学院参考。",
        flow_pre="校选课库；开课学期已配置。",
        flow_out="配额规则写入学期配额存储，供通识开课校验。",
        biz_flow="查看需求 → 编辑学院保底组数 → 保存计划。",
        proto_link="page-course-ge-offering-quota",
        field_tables=[
            (
                "学院配额——字段",
                [
                    f("1", "学院", "School", "只读", "是", "—", "—", "是", "AC"),
                    f("2", "保底组数", "Min Group Quota", "数字", "是", "≥0", "提交开课时已开组数须≥下限", "否", "3"),
                    f("3", "已开组数", "Opened Groups", "只读", "—", "—", "由通识开课汇总", "否", "2"),
                ],
            ),
        ],
        functions=[
            fn("1", "刷新需求", "Refresh Demand", "刷新需求演示/联动数据。", "点击刷新。", "正式联执行计划待确认。", "无。"),
            fn("2", "保存计划", "Save Plan", "保存学院保底组数。", "点击保存。", "—", "无。"),
        ],
    )

    add_menu_block(
        doc,
        "2.2.3.2 ",
        "通识选修开课（英文名称：GE Offering）",
        "待确认",
        intro="计划与任务安排合表：从校选课添加开课课程，安排教师与 Support，一次提交；"
        "提交时校验学院已开组数不低于保底；不提供合班。",
        list_fields="提交状态、课程号、课程名称、开课单位、修读范围/Intake、学分、学时、教师、Support、操作等；顶部配额进度。",
        search_fields="学期、开课单位、课程、提交状态。",
        flow_rel="加课生成通识教学班；安排后提交进入名单与清单；退回可回改。",
        flow_pre="校选课 active；配额已配置。",
        flow_out="已提交通识课进入名单（选课应用）与开课清单。",
        biz_flow="添加开课课程 → 安排教师 →（可选）Support → 提交（配额校验）。",
        proto_link="page-course-offering-ge",
        functions=[
            fn("1", "添加开课课程", "Add Course", "从校选池选择课程开设。", "打开加课弹窗，可多 Intake。", "无合班。", "加课弹窗。"),
            fn("2", "安排教师", "Arrange Teachers", "进入分组/教师安排。", "行操作。", "—", "分组工作台。"),
            fn("3", "提交", "Submit", "提交开课与安排。", "批量提交并校验配额。", "已开组数≥保底。", "无。"),
            fn("4", "退回", "Revert", "退回已提交项。", "批量退回。", "—", "无。"),
        ],
    )

    add_menu_block(
        doc,
        "2.2.3.3 ",
        "通识选修课开课名单管理（英文名称：GE Offering Roster）",
        "待确认",
        intro="开放选课场景下名单默认由选课应用生成；开课侧可查看，必要时移除/手工补录（以业务确认范围为准）。"
        "评审倾向：通识名单不在开课模块主维护。",
        list_fields="学期、开课单位、课程号、课程名称、学生数、操作。",
        search_fields="学期、开课单位、课程号。",
        flow_rel="消费选课结果；变更可记日志。",
        flow_pre="通识开课已提交。",
        flow_out="名单供下游。",
        biz_flow="查看名单 → 按需管理（受限）。",
        proto_link="page-course-ge-offering-roster",
        functions=[
            fn("1", "管理名单", "Manage Roster", "查看/有限维护名单。", "行操作。", "主数据来自选课应用。", "名单抽屉/工作台。"),
        ],
    )

    # ─── 2.2.4 特殊 ───
    add_heading(doc, "2.2.4 特殊开课（英文名称：Special Offering）（需求确认状态：待确认）", 3)
    add_para(
        doc,
        "模块介绍：计划外需求（重修、补修等），教务从课程库手工添加，不绑定专业批次执行计划；"
        "设容量后提交，任务安排分组与教师（无合班），名单全手工添加。导航标注「设计中」。",
    )

    add_menu_block(
        doc,
        "2.2.4.1 ",
        "特殊开课计划（英文名称：Special Offering Plan）",
        "待确认",
        intro="手工添加特殊开课课程，维护预计容量与预留后提交。",
        list_fields="提交状态、课程号、课程名称、预计容量、预留、学分、学时、开课单位、操作。",
        search_fields="学期、课程。",
        flow_rel="提交后进入特殊开课任务安排。",
        flow_pre="课程库；开课学期。",
        flow_out="特殊开课任务。",
        biz_flow="添加课程 → 设容量 → 提交。",
        proto_link="page-course-offering-other",
        field_tables=[
            (
                "特殊开课计划——字段",
                [
                    f("1", "课程", "Course", "选择器", "是", "—", "教务课程库", "否", ""),
                    f("2", "预计容量", "Estimated Capacity", "数字", "是", ">0", "—", "否", "40"),
                    f("3", "预留名额", "Reserved Seats", "数字", "否", "≥0", "—", "否", "0"),
                    f("4", "备注", "Remark", "文本", "否", "—", "如挂科重修/跨专业补修", "否", ""),
                ],
            ),
        ],
        functions=[
            fn("1", "添加", "Add", "从课程库添加特殊开课。", "打开添加弹窗。", "不绑定专业批次。", "添加弹窗。"),
            fn("2", "提交", "Submit", "提交计划至任务安排。", "勾选提交。", "—", "无。"),
        ],
    )

    add_menu_block(
        doc,
        "2.2.4.2 ",
        "特殊开课任务安排（英文名称：Special Offering Task Arrangement）",
        "待确认",
        intro="对特殊开课进行分组与教师安排并提交；无合班。",
        list_fields="提交状态、课程号、课程名称、容量、教师、开课单位、操作。",
        search_fields="学期、专业（如有）、开课单位、课程号、提交状态。",
        flow_rel="提交后进入特殊开课名单。",
        flow_pre="特殊开课计划已提交。",
        flow_out="名单管理与开课清单。",
        biz_flow="安排教师 → 提交/退回。",
        proto_link="page-course-special-offering-task",
        functions=[
            fn("1", "安排教师", "Arrange Teachers", "进入分组工作台。", "行操作。", "无合班。", "分组工作台。"),
            fn("2", "提交", "Submit", "提交任务安排。", "批量。", "分组与教师校验。", "无。"),
            fn("3", "退回", "Revert", "退回计划。", "批量。", "—", "无。"),
        ],
    )

    add_menu_block(
        doc,
        "2.2.4.3 ",
        "特殊开课学生名单管理（英文名称：Special Offering Roster）",
        "待确认",
        intro="无预置名单，教务/学院手工添加学生。",
        list_fields="学期、课程、学生数、操作。",
        search_fields="学期、课程。",
        flow_rel="手工名单写入变更日志。",
        flow_pre="特殊任务已提交。",
        flow_out="下游排课/教学。",
        biz_flow="管理名单 → 添加学生。",
        proto_link="page-course-special-offering-roster",
        functions=[
            fn("1", "管理名单", "Manage Roster", "手工添加/移除学生。", "行操作。", "无预置。", "名单维护界面。"),
        ],
    )

    # ─── 2.2.5 清单 ───
    add_heading(doc, "2.2.5 开课清单及相关（英文名称：Offering Manifest）（需求确认状态：待确认）", 3)
    add_para(
        doc,
        "模块介绍：汇总三类已提交任务安排，支撑教师学时统计、共同授课标记与名单变更审计；"
        "是排课与授课确认（预留）的数据源。导航标注「调整中」。授课确认触发方与邮件格式待定。",
    )

    add_menu_block(
        doc,
        "2.2.5.1 ",
        "教师开课学时统计（英文名称：Teaching Load）",
        "待确认",
        intro="按教师汇总开课学时（Teaching Load），支持多学期对比（最多约 6 学期）。",
        list_fields="教师、学期、学时合计、课程明细等。",
        search_fields="学期范围、教师、开课单位等。",
        flow_rel="读取已提交任务安排中的教师学时投递。",
        flow_pre="任务安排已提交。",
        flow_out="供管理查看与 QA 参考；不宜做强教分限制（评审）。",
        biz_flow="选择学期 → 查询统计。",
        proto_link="page-course-teacher-teaching-load",
        functions=[
            fn("1", "查询", "Query", "按条件汇总教师学时。", "筛选后查询。", "—", "无。"),
        ],
    )

    add_menu_block(
        doc,
        "2.2.5.2 ",
        "开课清单（英文名称：Offering Manifest）",
        "待确认",
        intro="汇总本学期专业/通识/特殊「任务安排已提交」的教学班，供确认与排课消费；识别是否排课、共同授课等标记。",
        list_fields="开课类型、课程号、课程名称、专业批次、开课单位、教师、学分、学时、周次、选课类型、状态等。",
        search_fields="学期、开课类型、开课单位、课程。",
        flow_rel="只读汇总；下游排课抓取清单/确认后任务；不排课课程应可过滤。",
        flow_pre="对应类型任务安排已提交。",
        flow_out="排课模块输入；授课确认预留。",
        biz_flow="筛选查看 → 导出/对接排课（正式开发）。",
        proto_link="page-course-offering-manifest",
        functions=[
            fn("1", "查询", "Query", "筛选已提交开课汇总。", "点击查询。", "只读。", "无。"),
        ],
    )

    add_menu_block(
        doc,
        "2.2.5.3 ",
        "共同授课维护（英文名称：Shared Teaching Maintenance）",
        "已确认",
        intro="为不同课程号、内容相近且同一教师授课的课程设置共同授课码，使排课时忽略该教师在这些课程间的时间冲突。"
        "注意：不是「同一分组多门课」；是教师维度多课同时段合上语义。",
        list_fields="学期、开课类型、课程号、课程名称、教师、共同授课码、操作。",
        search_fields="学期、类型、单位、课程。",
        flow_rel="写入共同授课关系供排课冲突检测豁免。",
        flow_pre="相关课程已在开课清单/任务中。",
        flow_out="排课模块冲突规则。",
        biz_flow="查询课程 → 设置共同授课 → 或解除。",
        proto_link="page-course-shared-teaching-maintenance",
        functions=[
            fn("1", "设置共同授课", "Set Shared Teaching", "为所选课程+教师生成/绑定共同授课码。", "勾选设置。", "须同一教师。", "设置弹窗。"),
            fn("2", "解除", "Unlink", "解除共同授课关系。", "行/批量解除。", "—", "无。"),
        ],
    )

    add_menu_block(
        doc,
        "2.2.5.4 ",
        "开课名单变更日志（英文名称：Roster Change Log）",
        "已确认",
        intro="追溯学生进组/出组及来源（预置、手工、选课、异动等），支撑审计。",
        list_fields="时间、操作类型、课程、小组、学号、姓名、操作人、来源说明等。",
        search_fields="学期、课程、学号、操作类型、时间范围。",
        flow_rel="名单维护动作自动记日志。",
        flow_pre="已发生名单变更。",
        flow_out="审计只读。",
        biz_flow="筛选查询变更记录。",
        proto_link="page-course-offering-roster-change-log",
        functions=[
            fn("1", "查询", "Query", "按条件检索变更日志。", "点击查询。", "只读。", "无。"),
        ],
    )

    # ─── 2.2.6 工作台 ───
    add_heading(doc, "2.2.6 分组工作台（英文名称：Offering Grouping Workbench）（需求确认状态：已确认）", 3)
    add_menu_block(
        doc,
        "2.2.6.1 ",
        "分组工作台（英文名称：Offering Grouping）",
        "已确认",
        intro="沉浸式全宽工作台：左侧 Course / Course List / 教师学时；右侧分组树与 Tab（学时详情、教师学时、学生名单）。"
        "由任务安排「安排教师」或名单「管理名单」进入，常新窗口打开；侧栏不展示独立菜单。",
        list_fields="Course List：课号、课名、状态、学分、周次、Prog. Batch、小组数、计划人数、Lecturer、Coordinator 等；"
        "安排子表：学时类型、周次、周学时、计划/实际总学时、教师、同时授课。",
        search_fields="学生名单 Tab：姓名/学号/性别等。",
        flow_rel="写回 section.groups 与 groupAssignments；名单写 roster store。",
        flow_pre="存在对应教学班；按入口控制可编辑范围。",
        flow_out="任务提交校验读取本工作台数据。",
        biz_flow="打开工作台 → 建组/调组 → 配置学时投递与教师 →（名单入口）维护学生 → 返回列表。",
        proto_link="page-offering-grouping",
        field_tables=[("分组与学时投递", GROUPING_FIELDS)],
        functions=[
            fn("1", "新建小组", "Add Group", "创建教学小组。", "工具栏/树操作。", "名称唯一。", "组属性表单。"),
            fn("2", "重置分组", "Reset Groups", "清空并重建默认分组。", "确认后重置。", "谨慎操作。", "无。"),
            fn("3", "安排学时/教师", "Assign Hours/Teachers", "维护学时类型与教师。", "子表编辑。", "多教师须 Coordinator。", "安排表单。"),
            fn("4", "学生名单", "Student Roster Tab", "预置分配、添加、调组、移除。", "名单 Tab 操作。", "按选课类型限制。", "名单面板。"),
        ],
    )

    # ─── 附录 ───
    add_heading(doc, "附录", 1)

    add_heading(doc, "附录 A 主数据与实体关系", 2)
    add_para(
        doc,
        "Offering Line（计划行）：catalogId、programmeKey、intake、execPlanId、sectionId、offeringType。"
        "Section（教学班）：lineIds[]、submitStatus、teachingConfirmStatus、enrollmentType、groups[]、"
        "groupAssignments[]、supportUnits[]、学分学时周次、容量/预留、Coordinator。"
        "Group：名称、容量、学生。"
        "Group Assignment：hourType、deliveryScope、groupIds、teachers[]、weekRange、mergeHours。"
        "按学期存储：COURSE_OFFERING_PLAN_BY_TERM[termCode]。",
    )

    add_heading(doc, "附录 B 状态与选课类型", 2)
    add_grid_table(
        doc,
        ["对象", "字段", "取值", "说明"],
        [
            ["计划", "submitStatus", "draft / submitted / reverted", "计划提交/退回"],
            ["任务", "teachingConfirmStatus", "pending / confirmed", "confirmed=任务安排已提交（字段名历史遗留）"],
            ["任务", "taskArrangementSubmittedAt", "时间戳", "任务提交时间"],
            ["选课", "enrollmentType", "closed / open", "默认 closed；open 名单来自选课应用"],
            ["开课类型", "offeringType", "major / ge / other", "专业/通识/特殊"],
        ],
        col_widths=scale_widths([2.5, 4.0, 4.5, 8.0]),
    )

    add_heading(doc, "附录 C 合班与分组职责", 2)
    add_para(
        doc,
        "合班（Merge）：教务主导、学院可调；同课号且学分/学时/周次/选课类型等一致的多专业批次合成一条教学班；"
        "时机在任务安排完成前；UI 文案统一「合班/拆班」，避免与「分组」混淆。"
        "分组（Group）：学院在任务安排阶段完成；提交前校验容量与教师安排。"
        "自动合班：当前不做，先手动。",
    )

    add_heading(doc, "附录 D 待确认事项", 2)
    add_grid_table(
        doc,
        ["编号", "议题", "状态/倾向"],
        [
            ["1", "合班后计划总人数计算公式（多批次预置汇总）", "待业务定规则"],
            ["2", "学籍异动与预置名单：实时 vs 学期冻结", "倾向下学期生效"],
            ["3", "授课确认：触发方（学院/AC）、邮件模板", "功能预留"],
            ["4", "校选课 Intake 限制维护端", "倾向开课维护+选课校验"],
            ["5", "教分/学时强校验是否启用", "倾向弱校验+人工调整"],
            ["6", "Support：AC 标记 vs 历史自动推荐", "先做标记"],
            ["7", "导入功能业务规则", "原型占位"],
            ["8", "通识/特殊开课细节与权限矩阵", "设计中"],
        ],
        col_widths=scale_widths([1.5, 8.0, 6.0]),
    )

    add_heading(doc, "附录 E 关键校验提示（示例）", 2)
    add_grid_table(
        doc,
        ["场景", "触发条件", "提示类型", "提示文案"],
        [
            ["生成任务", "非开课学期", "轻提示", "当前学期未设置为开课学期，无法生成开课任务。"],
            ["生成任务", "无候选课程", "空态", "暂无符合条件的执行计划课程。"],
            ["合班", "学分/学时/周次不一致", "轻提示", "所选教学班学分、学时或起止周不一致，无法合班。"],
            ["任务提交", "未分组或容量不足", "轻提示", "请完成分组且小组容量须覆盖计划人数。"],
            ["任务提交", "教师/学时未完成", "轻提示", "所选任务尚未满足提交条件，请完善分组与教师/学时安排。"],
            ["通识提交", "低于学院保底组数", "轻提示", "本学院已开组数低于保底配额，无法提交。"],
            ["退回", "确认", "确认弹窗", "退回后合班将拆回单批次并清空安排，是否继续？"],
            ["撤回", "确认", "确认弹窗", "撤回将重置分组与名单分组，是否继续？"],
        ],
        col_widths=scale_widths([2.5, 4.0, 2.0, 8.0]),
    )

    add_heading(doc, "附录 F 原型与参考文档", 2)
    add_para(
        doc,
        "原型入口：Academic Portal → 教学运行 → 开课管理。"
        "流程图：docs/course-offering-workflow.html。"
        "评审纪要：参考文档/2、开课管理&排课管理/开课管理与排课管理原型评审0710汇总.md。"
        "相关 OpenSpec：ge-offering-quota-flow、design-offering-grouping-hours、immersive-offering-grouping-shell。",
    )

    add_heading(doc, "附录 G 业务英文名称对照（节选）", 2)
    add_grid_table(
        doc,
        ["中文", "英文"],
        [
            ["开课管理", "Course Offering Management"],
            ["专业开课计划", "Major Offering Plan"],
            ["专业开课任务安排", "Major Offering Task Arrangement"],
            ["合班", "Merge Sections"],
            ["分组", "Grouping"],
            ["专业批次", "Prog. Batch / Programme Intake"],
            ["选课类型", "Enrollment Type"],
            ["开课清单", "Offering Manifest"],
            ["共同授课", "Shared Teaching"],
            ["开课单位", "Offering Unit"],
            ["学年学期", "Academic Term"],
            ["通识选修", "General Education (GE)"],
            ["特殊开课", "Special / Other Offering"],
            ["Support", "Support"],
            ["Course Coordinator", "Course Coordinator"],
        ],
        col_widths=scale_widths([6, 12]),
    )

    doc.save(OUT)
    return doc
