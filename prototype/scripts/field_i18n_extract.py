# -*- coding: utf-8 -*-
"""从 index.html / app.js 提取 UI 字段并生成操作路径。"""

from __future__ import annotations

import re
from pathlib import Path

from field_i18n_paths import CATEGORY_AREA, LOCATION_PATHS, MODULE_CURRICULUM, MODULE_OFFERING, PRD_TABLE_PATHS

ROOT = Path(__file__).resolve().parent.parent
INDEX_HTML = ROOT / "index.html"
APP_JS = ROOT / "app.js"

# 已知英文对照（补充 HTML 中无英文的字段）
EN_OVERRIDES: dict[str, str] = {
    "培养方案管理": "Curriculum Management",
    "开课管理": "Course Offering Management",
    "概览": "Overview",
    "方案版本": "Programme Version",
    "方案版本管理": "Programme Version Management",
    "版本审批": "Programme Version Approval",
    "版本查询": "Programme Version Query",
    "方案版本变更": "Programme Version Change",
    "方案版本变更申请": "Change Application",
    "方案版本变更审核": "Change Review",
    "专业批次执行计划": "Programme Intake Execution Plan",
    "数据统计": "Statistics",
    "执行计划统计": "Execution Plan Statistics",
    "开课时间设置": "Offering Time Settings",
    "校选课程管理": "School Elective Course Management",
    "开课类型": "Offering Types",
    "专业开课": "Major Course Offering",
    "通识选修开课": "General Elective Offering",
    "其他开课": "Other Offerings",
    "操作流程图": "Workflow Diagram",
    "入学批次": "Intake",
    "查询": "Search",
    "重置": "Reset",
    "清除过滤": "Clear Filters",
    "新增": "Add",
    "删除": "Delete",
    "保存": "Save",
    "取消": "Cancel",
    "确定": "Confirm",
    "关闭": "Close",
    "提交": "Submit",
    "提交审批": "Submit for Approval",
    "维护范围": "Maintain Eligible Scope",
    "维护可选范围": "Maintain Eligible Scope",
    "生成开课任务": "Generate Offering Tasks",
    "授课确认": "Confirm Teaching",
    "合拆班": "Merge/Split Classes",
    "修改教学任务": "Edit Teaching Task",
    "学生名单": "Student Roster",
    "分组": "Grouping",
    "全部": "All",
    "全部学院": "All Schools",
    "全部专业": "All Programmes",
    "请选择": "Please select",
    "正常": "Active",
    "停课": "Suspended",
    "草稿": "Draft",
    "已提交": "Submitted",
    "待确认": "Pending",
    "已确认": "Confirmed",
    "是": "Yes",
    "否": "No",
    "序号": "No.",
    "操作": "Actions",
    "课程代码": "Course Code",
    "课程名称": "Course Name",
    "课程号": "Course Code",
    "学分": "Credits",
    "总学时": "Total Hours",
    "理论": "Lecture",
    "辅导": "Tutorial",
    "实践": "Practical",
    "其他": "Other",
    "开课单位": "Offering Unit",
    "状态": "Status",
    "可选范围": "Eligible Scope",
    "可选专业": "Eligible Programmes",
    "全部专业": "All Programmes",
    "可选学生类型": "Eligible Student Types",
    "负责人": "Person in Charge",
    "提交状态": "Submission Status",
    "授课确认状态": "Teaching Confirmation Status",
    "课程类别": "Course Category",
    "上课学院": "Teaching School",
    "上课专业": "Teaching Programme",
    "上课批次": "Teaching Batch",
    "起止周": "Week Range",
    "人数": "Headcount",
    "学年学期": "Academic Term",
    "学院": "School",
    "专业": "Programme",
    "是否开课学期": "Is Offering Term",
    "开课时间范围": "Offering Time Range",
    "备注": "Remarks",
    "课程管理单位": "Course Admin Unit",
    "校选课类别": "School Elective Category",
    "选择课程": "Select Course",
    "过滤": "Filter",
    "入学批次": "Intake Batch",
    "教学班": "Section",
    "执行计划": "Execution Plan",
    "生成状态": "Generated Status",
    "引用方案版本": "Referenced Programme Version",
    "是否提交": "Submitted",
    "专业代码": "Programme Code",
    "学院代码": "School Code",
    "专业批次": "Programme Batch",
    "是否调整": "Adjusted",
    "教师安排": "Teacher Assignment",
    "安排教师": "Assign Teachers",
    "自动分组": "Auto Group",
    "合并分组": "Merge Groups",
    "分组重置": "Reset Groups",
    "新增分组": "Add Group",
    "添加学生": "Add Students",
    "调整学生分组": "Adjust Student Grouping",
    "名单移除记录": "Removal Log",
    "所属小组": "Assigned Group",
    "学号": "Student No.",
    "姓名": "Name",
    "国籍": "Nationality",
    "学生类型": "Student Type",
    "课程组": "Course Group",
    "名单来源": "Roster Source",
    "学时类型": "Hour Type",
    "任课教师": "Instructor(s)",
    "授课角色": "Teaching Role",
    "小组": "Group(s)",
    "理论学时": "Lecture Hours",
    "辅导学时": "Tutorial Hours",
    "实践学时": "Practical Hours",
    "其他学时": "Other Hours",
    "分组名称": "Group Name",
    "说明": "Description",
    "指定小组": "Assigned Group(s)",
    "授课教师": "Instructor(s)",
    "添加教师": "Add Teacher",
    "教工号": "Staff ID",
    "教师工号": "Staff ID",
    "教师姓名": "Teacher Name",
    "角色": "Role",
    "是否成绩录入人": "Grade Entry Person",
    "是否计算学时": "Count Teaching Hours",
    "安排老师": "Assign Teachers",
    "新增教师": "Add Teacher",
    "学时安排": "Hour Arrangement",
    "设置起止周": "Set Week Range",
    "场地选择器": "Venue Picker",
    "课程班详情": "Section Details",
    "新增校选课程": "Add School Elective Course",
    "修改分组": "Edit Group",
    "合分班设置": "Merge/Split Settings",
    "学生分组": "Student Grouping",
    "选择组": "Select Group(s)",
    "合并后小组名称": "Merged Group Name",
    "选择小组": "Select Groups",
    "生成": "Generate",
    "全选": "Select All",
    "移除": "Remove",
    "调整分组": "Adjust Grouping",
    "设置": "Configure",
    "选择": "Select",
    "确认删除": "Confirm Delete",
    "确认": "Confirm",
    "确认提交": "Confirm Submit",
    "确认添加": "Confirm Add",
    "确认保存": "Confirm Save",
    "确认复制": "Confirm Copy",
    "确认撤回提交": "Confirm Withdraw",
    "+ 人工开课": "+ Manual Offering",
    "+ 新增版本": "+ New Version",
    "复制版本": "Copy Version",
    "版本导出": "Export Version",
    "+ 新建申请": "+ New Application",
    "+ 生成执行计划": "+ Generate Execution Plan",
    "撤回提交": "Withdraw Submission",
    "返回": "Back",
    "查看": "View",
    "编辑": "Edit",
    "导出 PDF": "Export PDF",
    "打印": "Print",
    "TAB1 课程分类": "TAB1 Course Classification",
    "TAB2 课程设置": "TAB2 Course Configuration",
    "TAB3 课程组": "TAB3 Course Groups",
    "TAB4 方案进程表": "TAB4 Programme Structure",
    "开课学期": "Offering Semester",
    "课号": "Course Code",
    "课名": "Course Name",
    "开始批次": "Start Intake",
    "截止批次": "End Intake",
    "版本": "Version",
    "版本号": "Version Code",
    "授予学位": "Degree Awarded",
    "学制": "Duration",
    "学制（年）": "Duration (years)",
    "培养方案名称": "Programme Name",
    "培养方案版本": "Programme Version",
    "培养方案": "Programme",
    "审批意见": "Review Comment",
    "一级分类": "H1 Classification",
    "二级分类": "H2 Classification",
    "三级分类名称": "L3 Category Name",
    "最低学分": "Credits Min",
    "最高学分": "Credits Max",
    "合计学分要求": "Total Credit Requirement",
    "版本引用情况": "Version References",
    "总学分": "Total Credits",
    "提交人": "Submitted By",
    "提交时间": "Submitted At",
    "全部入学批次": "All Intake Batches",
    "批次": "Batch",
    "指定学期": "Specify Semester",
    "课程分类 H1": "Course Classification H1",
    "课程性质": "Course Nature",
    "课程选择器": "Course Picker",
    "填写审批意见...": "Enter review comment…",
    "批量审批共用意见...": "Shared batch review comment…",
    "必选": "Mandatory",
    "目标培养方案版本": "Target Programme Version",
    "全部状态": "All Statuses",
    "已通过": "Approved",
    "已驳回": "Rejected",
    "进行中": "In Progress",
    "课程分类": "Course Classification",
    "管理单位": "Admin Unit",
    "性别": "Gender",
    "学时": "Hours",
    "适用范围": "Applicable Scope",
    "按专业批次分组": "Group by Programme Batch",
    "按行政班分组": "Group by Admin Class",
    "撤销所有教学小组": "Revoke All Teaching Groups",
    "添加分组": "Add Group",
    "移出课程名单": "Remove from Course Roster",
    "搜索": "Search",
    "请选择 ▾": "Please select",
    "审批状态": "Approval Status",
    "修读类型": "Study Type",
    "所属二级分类": "Parent H2 Category",
    "批次衔接预览": "Batch Chain Preview",
    "上一版本": "Previous Version",
    "新版本": "New Version",
    "进入制定": "Start Editing",
    "复制来源": "Copy Source",
    "复制专业": "Source Programme",
    "复制方案版本": "Source Version",
    "复制目标": "Copy Target",
    "新的专业": "Target Programme",
    "方案版本开始批次": "Target Start Intake",
    "进入修改": "Start Editing",
    "变更影响说明": "Change Impact",
    "目标版本": "Target Version",
    "生效区间": "Effective Intake Range",
    "已生成执行计划": "Existing Execution Plans",
    "自动匹配培养方案版本": "Matched Programme Version",
    "生成并编辑": "Generate and Edit",
    "修改时间": "Modified At",
    "操作人": "Operator",
    "修改内容": "Change Summary",
    "知道了": "OK",
    "不保存并返回": "Leave Without Saving",
    "Heading 1（一级分类）": "Classification H1",
    "Heading 2（二级分类）": "Classification H2",
    "必修须指定学期；选修可手动开关": "Compulsory must specify semester; elective optional toggle",
    "分组信息": "Group Information",
    "课程信息": "Course Information",
    "学时分类": "Hour Classification",
    "合班信息": "Combined Class Info",
    "授课码": "Teaching Code",
    "计划周学时（仅供参考）": "Planned Weekly Hours (reference)",
    "总人数": "Total Students",
    "国际学生人数": "International Students",
    "本地学生人数": "Local Students",
    "中国学生人数": "Chinese Students",
    "场地类型选择": "Venue Type Selection",
    "教室安排": "Classroom Arrangement",
    "选课类型": "Enrollment Type",
    "是否排课": "Scheduled for Timetabling",
    "是否排场地": "Scheduled for Venue",
    "是否考勤": "Attendance Tracking",
    "是否录入成绩": "Grade Entry",
    "是否排考": "Exam Scheduling",
    "待合并专业批次": "Batches Pending Merge",
    "已合并专业批次": "Merged Batches",
    "请输入搜索内容": "Enter search text",
    "合并学时:": "Merge Hours:",
    "选择周次：": "Select weeks:",
    "单周": "Odd Weeks",
    "双周": "Even Weeks",
    "全不选": "None",
    "周次：": "Weeks:",
    "清空": "Clear",
    "移除日期": "Removal Date",
    "学生姓名": "Student Name",
    "角色设置": "Role Settings",
    "教师类型": "Teacher Type",
    "所属部门": "Department",
    "结构学期": "Structural Semester",
    "全部课程组": "All Course Groups",
    "全部批次": "All Batches",
    "全部生成状态": "All Generation Status",
    "已生成": "Generated",
    "未生成": "Not Generated",
    "未提交": "Not Submitted",
    "是否调整": "Adjusted",
    "是否提交": "Submitted",
    "生成状态": "Generation Status",
    "引用方案版本": "Referenced Programme Version",
    "专业批次": "Programme Batch",
    "专业批次开设情况": "Programme Batch Offering Status",
    "培养方案版本管理": "Programme Version Management",
    "培养方案版本审批": "Programme Version Approval",
    "培养方案版本查询": "Programme Version Query",
    "方案版本变更审核": "Programme Version Change Review",
    "专业批次培养方案执行计划": "Batch Programme Execution Plan",
    "新建方案版本变更申请": "New Change Application",
    "新增培养方案版本": "New Programme Version",
    "复制培养方案版本": "Copy Programme Version",
    "删除培养方案版本": "Delete Programme Version",
    "提交变更审批": "Submit Change for Approval",
    "批量提交变更审批": "Batch Submit Change",
    "提交执行计划": "Submit Execution Plan",
    "删除执行计划": "Delete Execution Plan",
    "执行计划修改记录": "Execution Plan Change Log",
    "生成批次执行计划": "Generate Batch Execution Plan",
    "批量新增课程": "Batch Add Courses",
    "新建课程组": "New Course Group",
    "查看课程组": "View Course Group",
    "选择组内课程": "Select Group Courses",
    "合并课程选择": "Merge Course Selection",
    "批量提交审批": "Batch Submit for Approval",
    "返回确认": "Leave Confirmation",
    "删除课程分类": "Delete Course Category",
    "版本引用情况": "Version References",
    "统一设置": "Unified Settings",
    "须选课程数": "Pick Count",
    "备注（TAB4 展示）": "Remarks (TAB4 display)",
    "组内课程": "Group Members",
    "课程选择": "Select Courses",
    "分类与开课": "Classification & Offering",
    "课程信息": "Course Information",
    "合并课程选择": "Merge Course Selection",
    "清除": "Clear",
    "第一步": "Step 1",
    "可多选": "Multi-select",
    "其他信息": "Other Information",
    "课程简介 Synopsis": "Course Synopsis",
    "参考书 References": "References",
    "上一步": "Previous",
    "下一步：CLO →": "Next: CLO →",
    "提交": "Submit",
    "当前节点": "Current Stage",
    "通过": "Approve",
    "驳回": "Reject",
    "需修改": "Update Required",
    "审批日志": "Approval Log",
    "批量新增": "Batch Add",
    "+ 新增课程": "+ Add Course",
    "+ 新建课程组": "+ New Course Group",
    "+ 新增分类": "+ Add Category",
    "选修课学期修读要求": "Elective Semester Requirements",
    "要求": "Requirement",
    "已录入课程数": "Courses Entered",
    "必修合计": "Compulsory Total",
    "选修合计": "Elective Total",
    "毕业总学分": "Total Graduation Credits",
    "关联版本": "Linked Version",
    "版本区间": "Version Range",
    "发布": "Publish",
    "课程列表": "Course List",
    "方案进程表": "Programme Structure",
    "课程分类": "Course Classification",
    "过滤": "Filter",
    "草稿": "Draft",
    "待办": "Pending",
    "历史": "History",
    "正常开课 → 合班 / 分班 / 合分班 → 学生·教师·地点·周次（参考教务系统视频）": "Normal offering workflow (see demo video)",
    "维护校内选修课程主数据，提前配置可选范围（允许选课的专业与学生类型）": "Maintain school elective master data and eligible scope",
    "必修课、专业选修、MPU、大学课等非公共选修课程 · 课程班合分班与学时分组": "Major/MPU/university courses · merge/split and hour grouping",
    "培养方案中 General Elective 分类课程 · 支持合分班": "General Elective courses · merge/split supported",
    "挂科重修、跨专业补修等额外开课需求 · 人工维护": "Retake/cross-programme offerings · manual",
    "跟踪各专业入学批次是否已生成执行计划，便于管理员掌握生成进度": "Track execution plan generation progress by intake",
    "从已提交执行计划的专业批次学期课程中选择生成；合分班请使用操作列；须先授课确认再提交，提交后排课模块可见": "Generate from submitted exec plans; merge/split via actions; confirm teaching before submit",
    "勾选允许选课的专业；选择「全部专业」表示不限制专业。": "Select eligible programmes; All Programmes = no restriction",
    "勾选允许选课的学生类型（Local / Chinese / International）。": "Select eligible student types",
    "从教务课程库中选择尚未纳入校选课程列表的选修课；添加后可继续维护可选范围。": "Pick electives from catalog not yet in school elective list",
    "1名学生在同一课程内只能属于1个小组": "One student can belong to only one group per course",
    "选择要合并的小组，并填写合并后的小组名称。": "Select groups to merge and name the merged group",
    "点击下拉框多选，至少选择两个小组": "Multi-select at least 2 groups",
    "根据当前学生名单自动生成分组，请选择分组方式：": "Auto-generate groups from roster; choose method",
    "为各小组安排理论/辅导/实践/其他学时的任课教师，并指定起止周；理论学时通常面向全体小组合班授课，辅导/实践/其他学时可按小组分别安排，具体学时分摊由后续排课模块处理。": "Assign instructors and weeks per hour type for each group",
    "注意：将剔除任务下教师学时起止周中不在教学任务所设置的起止周范围内的周次": "Weeks outside task range will be trimmed from teacher hours",
    "请按照该格式填写「1-2,4,5-9」": "Use format 1-2,4,5-9",
    "开启合并学时后，排课时不区分授课方式，只按总学时进行课表安排。": "Merged hours: timetable uses total hours only",
    "输入格式：1-7,10,12-14": "Format: 1-7,10,12-14",
    "课程组名称展示为课程名称（小组名称），如 Financial Accounting（A组）": "Display: Course Name (Group Name)",
    "暂无可用小组": "No groups available",
    "暂无匹配记录": "No matching records",
    "暂无记录": "No records",
    "暂无变更申请记录": "No change applications",
    "只读查看已审批通过的培养方案版本": "Read-only approved programme versions",
    "Pending 页勾选待办后可批量 Review": "Select pending items on Pending tab for batch review",
    "勾选版本后可批量提交或导出；复制版本须指定来源专业/方案版本及目标专业/开始批次": "Batch submit/export; copy requires source and target",
    "区间不重合：上一版本截止批次 = 下一版本开始批次的前一批次（如 2025/04 → 2025/09）": "Non-overlapping batch intervals",
    "同一专业多版本按批次链衔接：上一版本截止批次 = 下一版本开始批次的前一批次，区间互不重合": "Batch chain rule for programme versions",
    "当前为查看模式，培养方案内容不可编辑。": "View mode: content read-only",
    "由 TAB1 + TAB2 + TAB3 自动生成 · 只读预览 · 可导出 PDF": "Auto-generated from TAB1–3; read-only; export PDF",
    "加载流程图…": "Loading workflow…",
    "重置": "Reset",
    "清除过滤": "Clear Filters",
    "清除过滤条件": "Clear Filters",
    "课程代码 / 课程名称": "Course Code / Course Name",
    "课程号 / 专业 / 批次": "Course / Programme / Batch",
    "进入 Academic Portal 主菜单": "Academic Portal home",
    "入学批次": "Intake",
    "Bloom's Taxonomy Charts": "Bloom's Taxonomy Charts",
    "执行计划统计": "Execution Plan Statistics",
    "开课管理 · 操作流程": "Course Offering · Workflow",
    "培养方案管理 · 操作流程": "Curriculum Management · Workflow",
    "培养方案管理": "Curriculum Management",
    "开课管理": "Course Offering Management",
}

# app.js 中动态表头（HTML 无静态 th）
JS_TABLE_HEADERS: list[tuple[str, str, str, str, str, str]] = [
    ("开课管理", "modal-generate-major-offering-task", "列表列", "上课学院", "Teaching School",
     f"{LOCATION_PATHS['modal-generate-major-offering-task']} → 候选课程列表表头"),
    ("开课管理", "modal-generate-major-offering-task", "列表列", "上课专业", "Teaching Programme",
     f"{LOCATION_PATHS['modal-generate-major-offering-task']} → 候选课程列表表头"),
    ("开课管理", "modal-generate-major-offering-task", "列表列", "上课批次", "Teaching Batch",
     f"{LOCATION_PATHS['modal-generate-major-offering-task']} → 候选课程列表表头"),
    ("开课管理", "modal-generate-major-offering-task", "列表列", "课程号", "Course Code",
     f"{LOCATION_PATHS['modal-generate-major-offering-task']} → 候选课程列表表头"),
    ("开课管理", "modal-generate-major-offering-task", "列表列", "课程名称", "Course Name",
     f"{LOCATION_PATHS['modal-generate-major-offering-task']} → 候选课程列表表头"),
    ("开课管理", "modal-generate-major-offering-task", "列表列", "总学时", "Total Hours",
     f"{LOCATION_PATHS['modal-generate-major-offering-task']} → 候选课程列表表头"),
    ("开课管理", "modal-generate-major-offering-task", "列表列", "课程分类", "Course Classification",
     f"{LOCATION_PATHS['modal-generate-major-offering-task']} → 候选课程列表表头"),
    ("开课管理", "modal-generate-major-offering-task", "列表列", "学分", "Credits",
     f"{LOCATION_PATHS['modal-generate-major-offering-task']} → 候选课程列表表头"),
    ("开课管理", "modal-generate-major-offering-task", "列表列", "开课单位", "Offering Unit",
     f"{LOCATION_PATHS['modal-generate-major-offering-task']} → 候选课程列表表头"),
    ("开课管理", "page-course-offering-major", "列表列", "理论学时", "Lecture Hours",
     f"{LOCATION_PATHS['page-course-offering-major']} → 列表（JS 可扩展列）"),
    ("开课管理", "page-course-offering-major", "列表列", "实践学时", "Practical Hours",
     f"{LOCATION_PATHS['page-course-offering-major']} → 列表（JS 可扩展列）"),
    ("开课管理", "page-course-offering-major", "操作", "合拆班", "Merge/Split",
     f"{LOCATION_PATHS['page-course-offering-major']} → 列表操作列"),
    ("开课管理", "page-course-offering-major", "操作", "修改教学任务", "Edit Teaching Task",
     f"{LOCATION_PATHS['page-course-offering-major']} → 列表操作列"),
    ("开课管理", "page-course-offering-major", "操作", "学生名单", "Student Roster",
     f"{LOCATION_PATHS['page-course-offering-major']} → 列表操作列"),
    ("开课管理", "page-course-offering-major", "操作", "分组", "Grouping",
     f"{LOCATION_PATHS['page-course-offering-major']} → 列表操作列"),
    ("开课管理", "page-course-offering-major", "操作", "详情", "Details",
     f"{LOCATION_PATHS['page-course-offering-major']} → 列表操作列"),
    ("培养方案管理", "page-version-list", "操作", "编辑", "Edit",
     f"{LOCATION_PATHS['page-version-list']} → 列表操作列"),
    ("培养方案管理", "page-version-list", "操作", "查看", "View",
     f"{LOCATION_PATHS['page-version-list']} → 列表操作列"),
    ("培养方案管理", "page-version-list", "操作", "删除", "Delete",
     f"{LOCATION_PATHS['page-version-list']} → 列表操作列"),
    ("培养方案管理", "page-approval-list", "标签页", "待办", "Pending",
     f"{LOCATION_PATHS['page-approval-list']} → Tab 标签"),
    ("培养方案管理", "page-approval-list", "标签页", "进行中", "In Progress",
     f"{LOCATION_PATHS['page-approval-list']} → Tab 标签"),
    ("培养方案管理", "page-approval-list", "标签页", "历史", "History",
     f"{LOCATION_PATHS['page-approval-list']} → Tab 标签"),
    ("培养方案管理", "page-approval-list", "列表列", "Status", "Status",
     f"{LOCATION_PATHS['page-approval-list']} → 列表表头（英文）"),
    ("培养方案管理", "page-approval-list", "列表列", "Stage", "Stage",
     f"{LOCATION_PATHS['page-approval-list']} → 列表表头（英文）"),
]

CHINESE_RE = re.compile(r"[\u4e00-\u9fff][\u4e00-\u9fffA-Za-z0-9·/（）()、，。：:；\-\+\*'\s]{0,48}[\u4e00-\u9fff]|[\u4e00-\u9fff]{2,8}")

TAG_PATTERNS = [
    ("h1", "弹窗标题"),
    ("h3", "弹窗标题"),
    ("h4", "信息条"),
    ("label", "表单字段"),
    ("dt", "表单字段"),
    ("th", "列表列"),
    ("option", "筛选项"),
    ("button", "按钮"),
    ("a", "按钮"),
    ("span.filter-label", "筛选项"),
    ("p.subtitle", "信息条"),
    ("p.form-hint", "信息条"),
    ("div.nav-group", "导航分组"),
]


def _guess_module(loc_id: str, context: str = "") -> str:
    if loc_id.startswith("page-course") or loc_id.startswith("modal-course-offering") or loc_id.startswith("modal-school") or loc_id.startswith("modal-major") or loc_id.startswith("modal-offering") or loc_id.startswith("modal-group") or loc_id.startswith("drawer-major") or loc_id.startswith("modal-student") or loc_id == "sidebar-nav-course":
        return MODULE_OFFERING
    if "开课" in context and MODULE_OFFERING not in context:
        return MODULE_OFFERING
    return MODULE_CURRICULUM


def _guess_en(zh: str) -> str:
    zh = zh.strip()
    if zh in EN_OVERRIDES:
        return EN_OVERRIDES[zh]
    # bilingual like "必修 Compulsory"
    m = re.search(r"([A-Za-z][A-Za-z\s/\-']+)$", zh)
    if m:
        return m.group(1).strip()
    m = re.search(r"^([A-Za-z][A-Za-z\s/\-']+)", zh)
    if m and re.search(r"[\u4e00-\u9fff]", zh):
        return m.group(1).strip()
    return ""


def _clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text or "").strip()
    text = re.sub(r"↕", "", text).strip()
    text = re.sub(r"^[+\-]\s*", lambda m: m.group(0), text)
    return text


def _is_valid_label(text: str) -> bool:
    if not text or len(text) < 2:
        return False
    if not re.search(r"[\u4e00-\u9fff]", text):
        return False
    skip = ("原型占位", "cursor-el", "aria-hidden", "javascript:", "return false")
    if any(s in text for s in skip):
        return False
    if text in ("全选",):
        return False
    return True


def _build_path(base: str, category: str, zh: str) -> str:
    area = CATEGORY_AREA.get(category, category)
    return f"{base} → {area}「{zh}」"


def _split_html_blocks(html: str) -> list[tuple[str, str]]:
    """按 page/modal/drawer/nav 切分 HTML 块。"""
    blocks: list[tuple[str, str]] = []
    pattern = re.compile(
        r'<(?:section[^>]*id="(?P<id>page-[^"]+)"|div[^>]*id="(?P<modal>modal-[^"]+)"|aside[^>]*id="(?P<drawer>drawer-[^"]+)"|nav[^>]*id="(?P<nav>sidebar-nav-[^"]+)")[^>]*>',
        re.I,
    )
    matches = list(pattern.finditer(html))
    for i, m in enumerate(matches):
        loc_id = m.group("id") or m.group("modal") or m.group("drawer") or m.group("nav")
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(html)
        blocks.append((loc_id, html[start:end]))
    return blocks


def _extract_from_block(loc_id: str, chunk: str) -> list[tuple]:
    rows = []
    base = LOCATION_PATHS.get(loc_id, f"界面 ID：{loc_id}")
    module = _guess_module(loc_id, chunk[:200])

    # nav items
    for m in re.finditer(r'class="nav-item"[^>]*data-page="([^"]+)"[^>]*>([^<]+)<', chunk):
        page, zh = m.group(1), _clean_text(m.group(2))
        if _is_valid_label(zh):
            path = f"{base} → 菜单项「{zh}」"
            rows.append((module, loc_id, "导航菜单", zh, _guess_en(zh), path, f"data-page={page}"))

    for m in re.finditer(r'class="nav-group">([^<]+)<', chunk):
        zh = _clean_text(m.group(1))
        if _is_valid_label(zh):
            rows.append((module, loc_id, "导航分组", zh, _guess_en(zh), f"{base} → 分组「{zh}」", ""))

    # h1 / h3 titles
    for tag, cat in (("h1", "弹窗标题"), ("h3", "弹窗标题")):
        for m in re.finditer(rf"<{tag}[^>]*>([^<]+)</{tag}>", chunk, re.I):
            zh = _clean_text(re.sub(r"<[^>]+>", "", m.group(1)))
            if _is_valid_label(zh):
                rows.append((module, loc_id, cat, zh, _guess_en(zh), _build_path(base, cat, zh), ""))

    # tab buttons
    for m in re.finditer(r'class="[^"]*tab-btn[^"]*"[^>]*>([^<]+)<', chunk):
        zh = _clean_text(m.group(1))
        if _is_valid_label(zh):
            rows.append((module, loc_id, "标签页", zh, _guess_en(zh), _build_path(base, "标签页", zh), ""))

    # labels
    for m in re.finditer(r"<label[^>]*(?:for=\"[^\"]+\")?[^>]*>(.*?)</label>", chunk, re.I | re.S):
        raw = re.sub(r"<[^>]+>", "", m.group(1))
        zh = _clean_text(raw)
        if _is_valid_label(zh) and len(zh) <= 40:
            rows.append((module, loc_id, "表单字段", zh, _guess_en(zh), _build_path(base, "表单字段", zh), ""))

    # dt in dl
    for m in re.finditer(r"<dt>([^<]+)</dt>", chunk):
        zh = _clean_text(m.group(1))
        if _is_valid_label(zh):
            rows.append((module, loc_id, "表单字段", zh, _guess_en(zh), _build_path(base, "表单字段", zh), "摘要区 dt"))

    # th
    for m in re.finditer(r"<th[^>]*>(.*?)</th>", chunk, re.I | re.S):
        raw = re.sub(r"<[^>]+>", "", m.group(1))
        zh = _clean_text(raw)
        if _is_valid_label(zh):
            rows.append((module, loc_id, "列表列", zh, _guess_en(zh), _build_path(base, "列表列", zh), ""))

    # option (Chinese)
    for m in re.finditer(r"<option[^>]*>([^<]+)</option>", chunk):
        zh = _clean_text(m.group(1))
        if _is_valid_label(zh):
            rows.append((module, loc_id, "筛选项", zh, _guess_en(zh), _build_path(base, "筛选项", zh), "下拉 option"))

    # buttons with Chinese
    for m in re.finditer(r"<button[^>]*>(.*?)</button>", chunk, re.I | re.S):
        raw = re.sub(r"<[^>]+>", "", m.group(1))
        zh = _clean_text(raw)
        if _is_valid_label(zh) and len(zh) <= 20:
            rows.append((module, loc_id, "按钮", zh, _guess_en(zh), _build_path(base, "按钮", zh), ""))

    # subtitle / hint
    for cls, cat in (("subtitle", "信息条"), ("form-hint", "信息条")):
        for m in re.finditer(rf'class="[^"]*{cls}[^"]*"[^>]*>([^<]+)<', chunk):
            zh = _clean_text(m.group(1))
            if _is_valid_label(zh) and len(zh) <= 120:
                rows.append((module, loc_id, cat, zh, _guess_en(zh), _build_path(base, cat, zh[:30] + ("…" if len(zh) > 30 else "")), ""))

    # filter-label
    for m in re.finditer(r'class="filter-label">([^<]+)<', chunk):
        zh = _clean_text(m.group(1))
        if _is_valid_label(zh):
            rows.append((module, loc_id, "筛选项", zh, _guess_en(zh), _build_path(base, "筛选项", zh), ""))

    # placeholder on inputs
    for m in re.finditer(r'placeholder="([^"]*[\u4e00-\u9fff][^"]*)"', chunk):
        zh = _clean_text(m.group(1))
        if _is_valid_label(zh):
            rows.append((module, loc_id, "筛选项", zh, _guess_en(zh), _build_path(base, "筛选项", zh), "input placeholder"))

    return rows


def extract_html_rows() -> list[tuple]:
    html = INDEX_HTML.read_text(encoding="utf-8")
    rows: list[tuple] = []
    for loc_id, chunk in _split_html_blocks(html):
        rows.extend(_extract_from_block(loc_id, chunk))
    # brand title
    rows.append((MODULE_CURRICULUM, "sidebar-nav-curriculum", "模块名称", "培养方案管理", "Curriculum Management",
                 LOCATION_PATHS["sidebar-nav-curriculum"], "brand-title; 进入模块后显示"))
    return rows


def extract_js_rows() -> list[tuple]:
    return [tuple(r[:6] + (r[5],)) if len(r) == 6 else r for r in JS_TABLE_HEADERS]


def rows_from_prd() -> list[tuple]:
    from prd_build import VERSION_MGMT_FIELD_TABLES

    rows = []
    for table_title, table_rows in VERSION_MGMT_FIELD_TABLES:
        if "——" in table_title:
            module_part, loc_part = table_title.split("——", 1)
        else:
            module_part, loc_part = table_title, table_title
        if "执行计划" in table_title and "版本编辑" not in table_title:
            module = MODULE_CURRICULUM
        elif "复制版本" in table_title:
            module = MODULE_CURRICULUM
        else:
            module = MODULE_CURRICULUM
        base_path = PRD_TABLE_PATHS.get(table_title, f"{LOCATION_PATHS.get('page-version-edit', '')} → {loc_part}")
        for r in table_rows:
            zh, en = (r[1] or "").strip(), (r[2] or "").strip()
            if not zh or zh in ("—", "-") or zh.startswith("TAB2") and "列对齐" in zh:
                continue
            if en in ("—", "-"):
                en = _guess_en(zh) if not en else en
            note_parts = []
            if len(r) > 3 and r[3] not in ("—", ""):
                note_parts.append(f"控件：{r[3]}")
            if len(r) > 6 and r[6] not in ("—", ""):
                note_parts.append(r[6])
            path = _build_path(base_path, "表单字段", zh)
            rows.append((module, loc_part, "表单字段", zh, en, path, "；".join(note_parts)))
    return rows


def _normalize_module(module: str) -> str:
    if module in (MODULE_CURRICULUM, MODULE_OFFERING):
        return module
    if any(k in module for k in ("开课", "校选", "专业开课", "合拆", "分组")):
        return MODULE_OFFERING
    return MODULE_CURRICULUM


def merge_rows(*sources: list[tuple]) -> list[tuple]:
    """按 (模块, 字段类别, 中文) 去重，优先保留有英文翻译、路径更完整的记录。"""
    bucket: dict[tuple, tuple] = {}
    for rows in sources:
        for row in rows:
            module = _normalize_module(row[0])
            location, category, zh, en, path, note = row[1], row[2], row[3], row[4], row[5], row[6] if len(row) > 6 else ""
            key = (module, category, zh)
            cur = bucket.get(key)
            if not cur:
                bucket[key] = (module, location, category, zh, en, path, note)
                continue
            # 合并：补全英文、路径、备注
            _, loc2, _, _, en2, path2, note2 = cur
            pick_en = en or en2
            pick_path = path2 if len(path2 or "") > len(path or "") else path
            pick_loc = loc2 if len(str(loc2)) > len(str(location)) else location
            parts = [p for p in (note, note2) if p]
            pick_note = "；".join(dict.fromkeys(parts))
            bucket[key] = (module, pick_loc, category, zh, pick_en, pick_path, pick_note)
    out = list(bucket.values())
    out.sort(key=lambda r: (r[0], r[1], r[2], r[3]))
    return out


def collect_all_rows() -> list[tuple]:
    from field_i18n_supplement import UI_FIELD_ROWS

    # 兼容旧 supplement：补全 path 列
    legacy = []
    for row in UI_FIELD_ROWS:
        module, location, category, zh, en, note = row
        loc_key = location
        if location in ("列表", "筛选栏", "标签页", "信息条", "工具栏"):
            loc_key = "page-version-list"  # fallback
        base = LOCATION_PATHS.get(loc_key, f"{module} → {location}")
        path = _build_path(base, category, zh) if location not in LOCATION_PATHS else _build_path(LOCATION_PATHS.get(loc_key, base), category, zh)
        legacy.append((module, location, category, zh, en, path, note))

    html_rows = extract_html_rows()
    js_rows = [(r[0], r[1], r[2], r[3], r[4], r[5], "") for r in JS_TABLE_HEADERS]
    prd_rows = rows_from_prd()
    return merge_rows(prd_rows, legacy, html_rows, js_rows)
