#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""20260915：客户确认原型全量对齐 — 开课管理 13 升版 + 2 首版 PRD/变更说明（md+docx）。

禁止覆盖已有版本文件夹。真源：可见 UI + tip/alert；未知标未确认。
"""
from __future__ import annotations

import importlib.util
import re
import shutil
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(SCRIPT_DIR))
from prd_folder_paths import menu_dir, version_dir  # noqa: E402

DATE, NOTE_DATE = "20260915", "2026-09-15"
REV_LINE = "> - 2026-09-15 客户确认现行原型为交付基线；对齐截止覆盖 / Co-teaching / 选修缺档等确认后能力"

MENU_PATH = {
    "开课时间设置": "开课管理 → 开课设置 → 开课时间设置",
    "校选课程管理": "开课管理 → 开课设置 → 校选课程管理",
    "特殊课程设置": "开课管理 → 开课设置 → 特殊课程设置",
    "开课计划": "开课管理 → 专业开课 → 开课计划",
    "开课安排": "开课管理 → 专业开课 → 开课安排",
    "开课名单": "开课管理 → 专业开课 → 开课名单",
    "选修开课计划": "开课管理 → 选修开课 → 选修开课计划",
    "选修开课安排": "开课管理 → 选修开课 → 选修开课安排",
    "选修开课名单": "开课管理 → 选修开课 → 选修开课名单",
    "课程班": "开课管理 → 课程班管理 → 课程班",
    "Teaching Load": "开课管理 → 课程班管理 → Teaching Load",
    "授课确认管理": "开课管理 → 课程班管理 → 授课确认管理",
    "授课确认（教师端）": "开课管理 → 课程班管理 → 授课确认（教师端）",
    "授课教师替换": "开课管理 → 课程班管理 → 授课教师替换",
    "排课计划": "开课管理 → 课程班管理 → 排课计划",
}

PROTO = {
    "开课时间设置": "page-course-time-setting",
    "校选课程管理": "page-school-elective-courses",
    "特殊课程设置": "page-special-course-settings",
    "开课计划": "page-course-offering-major",
    "开课安排": "page-course-major-offering-task-style2",
    "开课名单": "page-course-major-offering-roster",
    "选修开课计划": "page-course-ge-offering-quota",
    "选修开课安排": "page-course-offering-ge",
    "选修开课名单": "page-course-ge-offering-roster",
    "课程班": "page-course-offering-manifest",
    "Teaching Load": "page-course-teacher-teaching-load",
    "授课确认管理": "page-course-teacher-confirmation-admin",
    "授课确认（教师端）": "page-teacher-course-confirmation",
    "授课教师替换": "page-course-offering-teacher-replace",
    "排课计划": "page-course-scheduling-plan",
}

# menu -> (old_folder_label, new_vn)  old like 20260909V2
UPGRADES = [
    ("开课时间设置", "20260909V2", 3),
    ("校选课程管理", "20260909V2", 3),
    ("特殊课程设置", "20260909V2", 3),
    ("开课计划", "20260909V2", 3),
    ("开课安排", "20260910V4", 5),
    ("开课名单", "20260909V2", 3),
    # 选修开课三菜单正式链均为 20260915V1 首版（安排不再从 20260904V2 升版）
    ("课程班", "20260909V2", 3),
    ("Teaching Load", "20260909V2", 3),
    ("授课确认管理", "20260910V3", 4),
    ("授课确认（教师端）", "20260909V2", 3),
    ("授课教师替换", "20260909V2", 3),
    ("排课计划", "20260909V2", 3),
]


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


def find_old_md(menu: str, old_label: str) -> Path:
    folder = menu_dir(menu) / f"{menu}{old_label}"
    md = folder / f"{menu}{old_label}.md"
    if not md.exists():
        raise SystemExit(f"找不到上一版：{md}")
    return md


def bump_common(text: str, old_label: str, new_label: str, extra_note: str) -> str:
    text = text.replace(f"**文档版本：** {old_label}", f"**文档版本：** {new_label}")
    text = text.replace(f"| 文档版本 | {old_label} |", f"| 文档版本 | {new_label} |")
    # date lines
    text = re.sub(
        r"\| 创建/发布日期 \| [^\|]+ \|",
        f"| 创建/发布日期 | {NOTE_DATE}（相对 {old_label} {extra_note}） |",
        text,
        count=1,
    )
    if REV_LINE not in text:
        text = text.replace(
            "> **修订记录：**\n",
            f"> **修订记录：**\n{REV_LINE}\n",
            1,
        )
    return text


def write_change_md(
    path: Path,
    menu: str,
    from_ver: str,
    to_ver: str,
    from_file: str,
    to_file: str,
    rows: list[tuple],
    first: bool = False,
) -> None:
    menu_path = MENU_PATH[menu]
    proto = PROTO[menu]
    lines = [
        f"# {menu}——需求调整变更说明",
        "",
        "> 模板：`参考文档/0、模板/需求调整变更说明模板（简版）20260901V3.docx`",
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
        f"| 原型地址 | prototype/index.html → {proto} |",
        f"| 变更日期 | {NOTE_DATE} |",
        "",
        "## 2 本次改了什么（总览）",
        "",
        "按「模块 → 对象 → 变动」填写；一行一事。变更类型只填：新增 / 修改 / 澄清。",
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
        "| 1 | 原型 / 开发 / 测试 | 以本版 PRD「已明确」与客户确认原型为准 | ☑原型 ☑开发 ☑测试 |",
        "",
    ]
    if first:
        lines.insert(
            4,
            "> **说明：** 本菜单无上一有效正式 PRD；本版为首版落档。",
        )
    path.write_text("\n".join(lines), encoding="utf-8")


def patch_time(t: str) -> str:
    old_tree = """```
P01 开课时间设置
├── P01-F01 查询
├── P01-L01 学期开课时间列表（可展开部门覆盖）
├── P01-X01 所属部门时间覆盖
├── P01-M01 新增/修改开课时间
└── P01-M02 新增所属部门覆盖
```"""
    new_tree = """```
P01 开课时间设置
├── P01-F01 查询
├── P01-L01 学期开课时间列表（可展开部门覆盖）
├── P01-X01 所属部门时间覆盖（含学院授课确认截止日行内维护）
├── P01-M01 新增/修改开课时间
├── P01-M02 新增所属部门覆盖
└── P01-D01 授课确认截止（按单位）抽屉（drawer-teacher-confirm-deadline-college；现行入口以展开区为准，独立抽屉入口若未挂侧钮则勿当唯一入口）
```"""
    t = t.replace(old_tree, new_tree)
    if "FD018" not in t:
        t = t.replace(
            "| FD017 | P01-X01（所属部门时间覆盖） | 部门开课截止 | Unit Open To | 日期时间 | 只读 | 否 | — | — | 本模块录入 | 否 |  |",
            "| FD017 | P01-X01（所属部门时间覆盖） | 部门开课截止 | Unit Open To | 日期时间 | 只读 | 否 | — | — | 本模块录入 | 否 |  |\n"
            "| FD018 | P01-X01（所属部门时间覆盖） | 学院授课确认截止日 | Unit Confirmation Deadline | 日期 | 可编辑（行内） | 否 | 空=沿用全校 | BR004 | 本模块录入 | 否 | 不得早于全校默认 |",
        )
    if "| BR004 |" not in t:
        t = t.replace(
            "| BR003 | 备注列 | P01-L01（学期开课时间列表） | 列表备注在现行 HTML 已注释：接口不得强制备注必填。（已明确对照现行 UI） |",
            "| BR003 | 备注列 | P01-L01（学期开课时间列表） | 列表备注在现行 HTML 已注释：接口不得强制备注必填。（已明确对照现行 UI） |\n"
            "| BR004 | 学院授课确认截止 | P01-X01 / P01-D01 | "
            "可为所属部门单独设置授课确认截止日；未设置则沿用全校默认。"
            "**学院截止日不得早于全校默认**（只许延后）。"
            "教师确认信 Notes 按「个人 > 学院 > 全校」解析生效日。（已明确·抽屉 tip / 解析逻辑） |",
        )
    t = t.replace(
        "| UnitOfferingWindow | 部门覆盖窗口 | 学期+部门 |",
        "| UnitOfferingWindow | 部门覆盖窗口（含学院授课确认截止） | 学期+部门 |\n"
        "| TeacherConfirmDeadlineCollege | 学院授课确认截止覆盖 | 学期+所属部门 |",
    )
    return t


def patch_tcc_admin(t: str) -> str:
    old_tree = """```
P01 page-course-teacher-confirmation-admin
├── P01-F01 查询（学期/学院等，以可见控件为准）
├── P01-L01 确认信宽表
├── P01-M01 详情 modal-teacher-course-confirmation-detail
├── P01-M02 操作记录 modal-teacher-course-confirmation-history
└── 行内：发送 / 代确认
```"""
    new_tree = """```
P01 page-course-teacher-confirmation-admin
├── P01-F01 查询（学期/学院/展开更多筛选项，以可见控件为准）
├── P01-L01 确认信宽表
├── P01-M01 详情 modal-teacher-course-confirmation-detail
├── P01-M02 操作记录 modal-teacher-course-confirmation-history
├── P01-M03 个人截止时间设置 modal-teacher-confirm-deadline-personal
│     ├── 查询：姓名/工号/所属部门/所属专业/教师类型（多选 OR）
│     ├── 工具栏：设置 / 初始化（分隔在查询区下方）
│     └── P01-M03-S 设置截止日 modal-teacher-confirm-deadline-personal-set
└── 工具栏：发送授课确认 / 批量代确认 / 个人截止时间设置 / 导出；行内：发送 / 代确认
```"""
    t = t.replace(old_tree, new_tree)
    if "FD028" not in t:
        t = t.replace(
            "| FD027 | P01-L01（确认信宽表） | 所属部门 | Department | 只读 | 只读 | 否 | — | — | 基础数据—组织 | 否 |  |",
            "| FD027 | P01-L01（确认信宽表） | 所属部门 | Department | 只读 | 只读 | 否 | — | — | 基础数据—组织 | 否 |  |\n"
            "| FD028 | P01-L01（确认信宽表） | 所属专业 | Programme | 只读 | 只读 | 否 | — | — | 开课安排 / 执行计划 | 否 |  |",
        )
    if "FD040" not in t:
        insert_form = """
### 5.5 个人截止时间设置

| 字段ID | 所属界面ID | 字段名称 | 英文名称 | 类型 | 新增 | 编辑 | 查看 | 必填 | 默认值 | 校验规则 | 数据来源/取值 | 代码集 | 备注 |
|--------|------------|----------|----------|------|------|------|------|------|--------|----------|---------------|--------|------|
| FD040 | P01-M03（个人截止时间设置） | 教师姓名 | Teacher Name | 文本 | — | 可编辑（筛） | — | 否 | — | — | 教师库 | 否 | 查询 |
| FD041 | P01-M03（个人截止时间设置） | 工号 | Staff ID | 文本 | — | 可编辑（筛） | — | 否 | — | — | 教师库 | 否 | 查询 |
| FD042 | P01-M03（个人截止时间设置） | 所属部门 | Department | 下拉框 | — | 可编辑（筛） | — | 否 | 全部 | — | 基础数据—组织 | 否 | 查询 |
| FD043 | P01-M03（个人截止时间设置） | 所属专业 | Programme | 下拉框 | — | 可编辑（筛） | — | 否 | 全部 | — | 基础数据—专业 | 否 | 查询 |
| FD044 | P01-M03（个人截止时间设置） | 教师类型 | Teacher Type | 多选 | — | 可编辑（筛） | — | 否 | 全部 | — | 本界面枚举（教师类型） | 是 | 多选 OR |
| FD045 | P01-M03（个人截止时间设置） | 授课确认截止日期（列表） | Personal Deadline | 日期 | — | 只读 | 只读 | 否 | — | BR014 | 本模块录入 / 解析 | 否 | 展示个人覆盖或回落 |
| FD046 | P01-M03-S（设置截止日） | 授课确认截止日 | Personal Deadline | 日期 | 可编辑 | 可编辑 | — | 是 | — | BR014 | 本模块录入 | 否 | 不得早于全校默认 |

"""
        t = t.replace("## 6–7", insert_form + "## 6–7")
    if "F006" not in t:
        t = t.replace(
            "| F005 | P01-L01（确认信宽表） | History | 链接 | 点击 | — | 打开操作记录 | 弹窗 | — | — |",
            "| F005 | P01-L01（确认信宽表） | History | 链接 | 点击 | — | 打开操作记录 | 弹窗 | — | — |\n"
            "| F006 | P01（授课确认管理页面） | 个人截止时间设置 | 按钮 | 点击 | — | 打开 P01-M03 | 弹窗 | — | BR014/BR015 |\n"
            "| F007 | P01-M03（个人截止时间设置） | 设置 | 按钮 | 勾选教师后 | — | 打开 P01-M03-S 批量写个人截止日 | 刷新列表 | 校验失败提示 | BR014 |\n"
            "| F008 | P01-M03（个人截止时间设置） | 初始化 | 按钮 | 勾选教师后 | — | 清除个人截止日；回落见 BR015 | 刷新 | 未勾选提示 | BR015 |",
        )
    # Co-teaching + personal rules
    t = t.replace(
        "| FD025 | P01-L01（确认信宽表） | Co-teaching Staff | Co-teaching Staff | 只读 | 只读 | 否 | — | — | 开课安排设置 | 否 |  |",
        "| FD025 | P01-L01（确认信宽表） | Co-teaching Staff | Co-teaching Staff | 只读 | 只读 | 否 | — | BR016 | 开课安排设置（同学期同课程班即时计算） | 否 | 每人一行堆叠 |",
    )
    t = t.replace(
        "| FD026 | P01-L01（确认信宽表） | Co-teaching Email | Co-teaching Email | 只读 | 只读 | 否 | — | — | 教师库 | 否 |  |",
        "| FD026 | P01-L01（确认信宽表） | Co-teaching Email | Co-teaching Email | 只读 | 只读 | 否 | — | BR016 | 教师库 | 否 | 与 Staff 同行堆叠 |",
    )
    if "BR014" not in t:
        t = t.replace(
            "| BR013 | Coordinator 随安排更新 | P01-L01（确认信宽表） / 教师端确认信 | 开课安排更改 Course Coordinator 后，本表与教师端确认信的 Coordinator / Coordinator Email 刷新为新值；**不改变**该行确认状态（draft/pending/confirmed/disagreed）。已发送邮件的正文不重写、不补发。详见《开课安排》BR019。（已明确） |",
            "| BR013 | Coordinator 随安排更新 | P01-L01（确认信宽表） / 教师端确认信 | 开课安排更改 Course Coordinator 后，本表与教师端确认信的 Coordinator / Coordinator Email 刷新为新值；**不改变**该行确认状态（draft/pending/confirmed/disagreed）。已发送邮件的正文不重写、不补发。详见《开课安排》BR019。（已明确） |\n"
            "| BR014 | 个人截止覆盖 | P01-M03 / 教师端 Notes | "
            "教师×学期一条个人截止日，覆盖该人本学期全部确认任务。"
            "生效截止日解析：**个人 > 学院 > 全校**。"
            "个人/学院截止日不得早于全校默认（只许延后）。（已明确） |\n"
            "| BR015 | 个人截止初始化 | P01-M03（个人截止时间设置） | "
            "初始化=清除所选教师的个人截止日。"
            "回落后展示：该教师**已设学院截止则按学院，否则按全校**。"
            "二次确认文案须带出回落摘要。（已明确·tip / confirm） |\n"
            "| BR016 | Co-teaching 列 | P01-L01（确认信宽表） | "
            "同一**课程班**内，除本行教师外、出现在该班学时安排上的其他教师；姓名/邮箱每人一行堆叠展示。"
            "列表展示按当前教学班安排**即时计算**，禁止仅依赖过期快照包字段。（已明确） |",
        )
    t = t.replace(
        "| TeacherConfirmRow | 教师×开课任务确认行 | staffId+term+sectionId |",
        "| TeacherConfirmRow | 教师×开课任务确认行 | staffId+term+sectionId |\n"
        "| TeacherConfirmDeadlinePersonal | 个人授课确认截止 | 学期+staffId |",
    )
    return t


def patch_tcc_teacher(t: str) -> str:
    if "BR002" not in t or "生效截止" not in t:
        # insert after first BR row if needed
        if "| BR002 |" not in t:
            t = t.replace(
                "| BR001 | 不同意意见 | P01-M02（不同意意见弹窗） | 授课确认选择不同意时必须填写意见，否则不可提交。（已明确） |",
                "| BR001 | 不同意意见 | P01-M02（不同意意见弹窗） | 授课确认选择不同意时必须填写意见，否则不可提交。（已明确） |\n"
                "| BR002 | Notes 截止日 | P01（确认信函） | "
                "确认信 Notes 中的授课确认截止日期取解析后的**生效日**："
                "**个人 > 学院 > 全校**（见《开课时间设置》BR004、《授课确认管理》BR014）。（已明确） |",
            )
    return t


def patch_replace(t: str) -> str:
    # already has keep-effective; add revision clarity only
    if "BR001" in t and "保持已生效" in t:
        return t
    return t


def patch_coteach_note_only(t: str) -> str:
    return t


CHANGE_ROWS = {
    "开课时间设置": [
        ("界面", "P01-X01 / P01-D01", "学院授课确认截止", "新增",
         "无独立学院截止维护 → 部门展开区可维护学院授课确认截止；规则不得早于全校；Notes 按个人>学院>全校解析"),
        ("字段", "FD018", "学院授课确认截止日", "新增", "展开区新增学院授课确认截止日字段"),
        ("规则", "BR004", "学院授课确认截止", "新增", "新增学院覆盖与解析优先级规则"),
        ("其他", "—", "客户确认基线", "澄清", "客户确认现行原型为本版交付基线"),
    ],
    "校选课程管理": [
        ("其他", "—", "客户确认基线", "澄清", "相对 20260909V2：客户确认现行原型；正文功能对象无新增，作为交付基线再发版"),
    ],
    "特殊课程设置": [
        ("其他", "—", "客户确认基线", "澄清", "相对 20260909V2：客户确认现行原型；正文功能对象无新增，作为交付基线再发版"),
    ],
    "开课计划": [
        ("其他", "—", "客户确认基线", "澄清", "相对 20260909V2：客户确认现行原型；正文功能对象无新增，作为交付基线再发版"),
    ],
    "开课安排": [
        ("其他", "—", "客户确认基线", "澄清", "相对 20260910V4：客户确认现行原型；正文延续，作为交付基线再发版"),
    ],
    "开课名单": [
        ("其他", "—", "客户确认基线", "澄清", "相对 20260909V2：客户确认现行原型；正文功能对象无新增，作为交付基线再发版"),
    ],
    "选修开课安排": [
        ("其他", "—", "客户确认基线", "澄清", "相对 20260904V2：客户确认现行原型；修读范围规格延续；列表全量仍见 UC001/UC002"),
    ],
    "课程班": [
        ("其他", "—", "客户确认基线", "澄清", "相对 20260909V2：客户确认现行原型；正文功能对象无新增，作为交付基线再发版"),
    ],
    "Teaching Load": [
        ("其他", "—", "客户确认基线", "澄清", "相对 20260909V2：客户确认现行原型；正文功能对象无新增，作为交付基线再发版"),
    ],
    "授课确认管理": [
        ("界面", "P01-M03", "个人截止时间设置", "新增", "工具栏新增「个人截止时间设置」弹窗及设置子弹窗"),
        ("功能", "F006/F007/F008", "个人截止设置/初始化", "新增", "支持批量设置个人截止日与初始化清除"),
        ("字段", "FD040–FD046 / FD028", "个人截止筛选项与所属专业列", "新增", "教师类型改为多选 OR；列表补所属专业"),
        ("规则", "BR014/BR015", "个人截止覆盖与初始化回落", "新增", "个人>学院>全校；初始化清除个人后按学院否则全校"),
        ("规则", "BR016 / FD025–026", "Co-teaching 列", "修改", "同课程班其他任课教师堆叠展示；列表即时计算"),
        ("其他", "—", "客户确认基线", "澄清", "客户确认现行原型为本版交付基线"),
    ],
    "授课确认（教师端）": [
        ("规则", "BR002", "Notes 截止日", "新增", "确认信 Notes 取解析后的生效截止日（个人>学院>全校）"),
        ("其他", "—", "客户确认基线", "澄清", "客户确认现行原型为本版交付基线"),
    ],
    "授课教师替换": [
        ("规则", "BR001", "替换后保生效", "澄清", "相对上一版已写明「保持已生效」：本版再确认为客户确认基线，禁止因确认未齐套打回草稿"),
        ("其他", "—", "客户确认基线", "澄清", "客户确认现行原型为本版交付基线"),
    ],
    "排课计划": [
        ("其他", "—", "客户确认基线", "澄清", "相对 20260909V2：客户确认现行原型；入池仍以安排已生效为准"),
    ],
}

PATCHERS = {
    "开课时间设置": patch_time,
    "授课确认管理": patch_tcc_admin,
    "授课确认（教师端）": patch_tcc_teacher,
    "授课教师替换": patch_replace,
}


def elective_plan_md() -> str:
    return f"""# 厦大马来分校本科教务系统产品需求文档 — 选修开课计划

> **文档版本：** {DATE}V1
> **上一有效版：** 无（本菜单首版正式落档）
> **模板：** 厦大马来分校本科教务系统PRD模板_V3.1
> **条款口径：** 已明确 / 未确认（不得把 AI 发挥标成已明确）
> **真源：** 可见 UI 文案 + tip/alert；客户已确认现行原型
> **修订记录：**
> - 2026-09-15 创建（客户确认基线首版）

## 0. 文档信息

| 项目 | 内容 |
|------|------|
| 需求文档名称 | 厦大马来分校本科教务系统产品需求文档 — 选修开课计划 |
| 菜单路径 | 开课管理 → 选修开课 → 选修开课计划 |
| 英文名称 | Elective Offering Plan |
| 文档版本 | {DATE}V1 |
| 创建/发布日期 | {NOTE_DATE} |
| 原型地址 | prototype/index.html → page-course-ge-offering-quota |

## 1. 文档概述

### 1.1 文档目的

明确选修开课计划（GE / ME）页可见结构、字段与已写明规则，供产品、研发、测试与 AI 后端统一依据。

### 1.2 填写口径

- 「（已明确）」：原型可见文案或 tip/alert 已写明。
- 「（未确认）」：未讨论或占位；禁止实现时自造。

### 1.3 建设背景

客户确认后，将「选修开课计划」从侧栏可见页正式落档。GE 含需求汇总与配额表；ME 为独立页签计划表。

## 2. 菜单与功能范围

### 2.1 本版纳入

- 顶部品类页签：GE开课计划 / ME开课计划
- GE：开课需求（学分人次拆分 + 学院明细）+ GE开课配额表 + 保存计划 / 导出
- ME：ME 开课计划表（以可见列为准）及工具栏（以可见按钮为准）

### 2.2 非目标

- 特殊开课（侧栏已注释下线）
- 选课应用内学生名单生成细节（下游）
- 未在原型写明的 AC 审批流（未确认）

## 3. 界面结构

```
P01 page-course-ge-offering-quota
├── P01-T01 GE开课计划 / ME开课计划 页签
├── P01-F01 开课学期
├── P01-GE
│     ├── P01-GE-C01 GE开课需求（可折叠）
│     │     ├── 学分人次拆分看板
│     │     └── 学院明细表（可折叠）
│     └── P01-GE-L01 GE开课配额表 + 保存计划 / 导出
└── P01-ME
      └── P01-ME-L01 ME开课计划表（以可见列为准）
```

## 5. 字段

### 5.1 查询

| 字段ID | 所属界面ID | 字段名称 | 英文名称 | 类型 | 查询区状态 | 必填 | 默认值 | 校验规则 | 数据来源/取值 | 代码集 | 备注 |
|--------|------------|----------|----------|------|------------|------|--------|----------|---------------|--------|------|
| FD001 | P01-F01（查询区） | 开课学期 | Academic Term | 下拉框 | 可编辑 | 是 | 默认展示学期 | — | 查询区及开课时间设置 | 否 |  |

### 5.2 GE 需求 / 配额（可见列）

| 字段ID | 所属界面ID | 字段名称 | 英文名称 | 类型 | 列表展示 | 必填 | 默认值 | 校验规则 | 数据来源/取值 | 代码集 | 备注 |
|--------|------------|----------|----------|------|----------|------|--------|----------|---------------|--------|------|
| FD010 | P01-GE-C01（学院明细） | 学院 | School | 只读 | 只读 | 否 | — | — | 执行计划 | 否 |  |
| FD011 | P01-GE-C01（学院明细） | 预计人数 | Estimated Headcount | 数字 | 只读 | 否 | — | — | 执行计划汇总 | 否 | 可刷新 |
| FD012 | P01-GE-C01（学院明细） | 涉及专业批次 | Programme Batches | 只读 | 只读 | 否 | — | — | 执行计划 | 否 |  |
| FD020 | P01-GE-L01（配额表） | 类型 | GE Type | 只读 | 只读 | 否 | — | — | 本界面枚举（GE 类型） | 是 |  |
| FD021 | P01-GE-L01（配额表） | 校选课类别 | Elective Category | 只读 | 只读 | 否 | — | — | 校选课程管理 | 否 |  |
| FD022 | P01-GE-L01（配额表） | 需开课程组数（2学分） | Min Groups 2cr | 数字 | 可编辑 | 否 | — | BR001 | 本模块录入 | 否 | 保底下限 |
| FD023 | P01-GE-L01（配额表） | 需开课程组数（3学分） | Min Groups 3cr | 数字 | 可编辑 | 否 | — | BR001 | 本模块录入 | 否 | 保底下限 |
| FD024 | P01-GE-L01（配额表） | 每组人数上限 | Cap per Group | 数字 | 可编辑 | 否 | — | — | 本模块录入 | 否 |  |

### 5.3 ME 计划

| 字段ID | 所属界面ID | 字段名称 | 英文名称 | 类型 | 列表展示 | 必填 | 默认值 | 校验规则 | 数据来源/取值 | 代码集 | 备注 |
|--------|------------|----------|----------|------|----------|------|--------|----------|---------------|--------|------|
| FD030 | P01-ME-L01（ME计划表） | （可见列） | — | — | 以现行表头为准 | — | — | — | 校选 / 执行计划 / 本模块录入 | — | 列定义以可见 UI 为准；未单独编号列标 UC001 |

## 6–7

| 功能ID | 所属界面ID | 功能名称 | 操作类型 | 触发方式 | 前置条件 | 处理逻辑 | 成功结果 | 异常处理 | 关联规则 |
|--------|------------|----------|----------|----------|----------|----------|----------|----------|----------|
| F001 | P01-T01 | 切换 GE/ME | 页签 | 点击 | — | 切换面板 | 展示对应面板 | — | — |
| F002 | P01-F01 | 切换学期 | 下拉 | 变更 | — | 刷新需求与配额 | 刷新 | — | — |
| F003 | P01-GE-C01 | 刷新需求 | 按钮 | 点击 | GE 页签 | 按执行计划重算需求 | 刷新看板/明细 | — | — |
| F004 | P01-GE-L01 | 保存计划 | 按钮 | 点击 | GE 页签 | 保存配额 | 提示成功 | 校验失败 | BR001 |
| F005 | P01-GE-L01 | 导出 | 按钮 | 点击 | GE 页签 | 导出当前配额 | 下载 | — | — |

| 规则ID | 规则名称 | 适用范围 | 规则内容 |
|--------|----------|----------|----------|
| BR001 | GE 配额下限 | P01-GE-L01 | 保底组数为下限：学院至少开满，可以开多，不能开少；超额是否需 AC 确认：未确认（UC002）。（已明确·历史说明口径；AC 未确认） |
| BR002 | 需求数据 | P01-GE-C01 | 正式环境依据已提交执行计划详情中选修类修读要求汇总；原型可为演示数据。（已明确·历史说明；现行页已去掉长说明条） |

## 11. 未确认事项

| 编号 | 事项 | 影响范围 |
|------|------|----------|
| UC001 | ME 计划表全部列的字段级 Add/Edit/View 矩阵 | P01-ME-L01 |
| UC002 | GE 超额开组是否需 AC 确认 | BR001 |

## 12–14

- 无复杂开课安排状态机；本页产出配额/计划供选修开课安排引用。
- 数据权限：开课模块按专业授权（本口径仅约束开课模块）。
- 禁止把「原型」写作数据来源列取值。
"""


def elective_roster_md() -> str:
    return f"""# 厦大马来分校本科教务系统产品需求文档 — 选修开课名单

> **文档版本：** {DATE}V1
> **上一有效版：** 无（本菜单首版正式落档）
> **模板：** 厦大马来分校本科教务系统PRD模板_V3.1
> **条款口径：** 已明确 / 未确认
> **真源：** 可见 UI 文案 + tip/alert；客户已确认现行原型
> **修订记录：**
> - 2026-09-15 创建（客户确认基线首版）

## 0. 文档信息

| 项目 | 内容 |
|------|------|
| 需求文档名称 | 厦大马来分校本科教务系统产品需求文档 — 选修开课名单 |
| 菜单路径 | 开课管理 → 选修开课 → 选修开课名单 |
| 英文名称 | Elective Offering Roster |
| 文档版本 | {DATE}V1 |
| 创建/发布日期 | {NOTE_DATE} |
| 原型地址 | prototype/index.html → page-course-ge-offering-roster |

## 1. 文档概述

### 1.1 文档目的

明确选修开课名单页可见统计区、查询区与任务列表能力边界。

### 1.2 填写口径

同其他 V3.1 菜单：已明确 / 未确认；禁止编造学校政策。

### 1.3 建设背景

选修为开放选课；默认名单由选课应用生成，本页支持查看/维护（以可见操作为准）。

## 2. 菜单与功能范围

### 2.1 本版纳入

- 顶部统计卡：GE开课统计 / ME开课统计
- 查询区：学期、所属部门、课号、课名、开课状态、授课确认等（以可见控件为准）
- 开课任务名单列表及人数/管理名单等行操作（以可见为准）

### 2.2 非目标

- 选课应用内报名算法
- 专业开课名单（见《开课名单》）

## 3. 界面结构

```
P01 page-course-ge-offering-roster
├── P01-C01 开课统计（GE / ME 页签，可折叠）
├── P01-F01 查询区
├── P01-L01 选修开课任务名单列表
└── P01-D01 / P02 名单抽屉或分组工作台（以可见入口为准）
```

## 5. 字段

### 5.1 查询

| 字段ID | 所属界面ID | 字段名称 | 英文名称 | 类型 | 查询区状态 | 必填 | 默认值 | 校验规则 | 数据来源/取值 | 代码集 | 备注 |
|--------|------------|----------|----------|------|------------|------|--------|----------|---------------|--------|------|
| FD001 | P01-F01 | 开课学期 | Academic Term | 下拉框 | 可编辑 | 是 | 默认展示学期 | — | 查询区及开课时间设置 | 否 |  |
| FD002 | P01-F01 | 所属部门 | Offering Unit | 下拉框 | 可编辑 | 否 | 全部 | — | 基础数据—组织 | 否 |  |
| FD003 | P01-F01 | 课号 | Course Code | 文本 | 可编辑 | 否 | — | — | 开课安排 | 否 |  |
| FD004 | P01-F01 | 课名 | Course Name | 文本 | 可编辑 | 否 | — | — | 开课安排 | 否 |  |
| FD005 | P01-F01 | 开课状态 | Offering Status | 下拉框 | 可编辑 | 否 | 全部 | — | 本界面枚举（已齐套/待补齐/缺安排/历史复制待确认） | 是 |  |
| FD006 | P01-F01 | 授课确认 | Teaching Confirm | 下拉框 | 可编辑 | 否 | 全部 | — | 本界面枚举（已确认/未确认/无教师） | 是 |  |

### 5.2 统计 / 列表

| 字段ID | 所属界面ID | 字段名称 | 英文名称 | 类型 | 列表展示 | 必填 | 默认值 | 校验规则 | 数据来源/取值 | 代码集 | 备注 |
|--------|------------|----------|----------|------|----------|------|--------|----------|---------------|--------|------|
| FD010 | P01-C01-ME | 专业 | Programme | 只读 | 只读 | 否 | — | — | 执行计划 | 否 | ME 统计 |
| FD011 | P01-C01-ME | 学生数 | Student Count | 数字 | 只读 | 否 | — | — | 未确认 | 否 | UC001 |
| FD012 | P01-C01-ME | 计划总Quota | Plan Quota | 数字 | 只读 | 否 | — | — | 选修开课计划 | 否 |  |
| FD013 | P01-C01-ME | 计划课程组数 | Plan Groups | 数字 | 只读 | 否 | — | — | 选修开课计划 | 否 |  |
| FD020 | P01-L01 | （任务列表可见列） | — | — | 以现行表头为准 | — | — | — | 开课安排 / 开课名单 / 本模块计算 | — | 完整矩阵 UC002 |

## 6–7

| 功能ID | 所属界面ID | 功能名称 | 操作类型 | 触发方式 | 前置条件 | 处理逻辑 | 成功结果 | 异常处理 | 关联规则 |
|--------|------------|----------|----------|----------|----------|----------|----------|----------|----------|
| F001 | P01-C01 | 切换 GE/ME 统计 | 页签 | 点击 | — | 切换统计面板 | 刷新 | — | — |
| F002 | P01-F01 | 查询 | 按钮 | 点击 | — | 筛选任务 | 刷新列表 | — | — |
| F003 | P01-L01 | 查看/管理名单 | 行操作 | 点击 | 任务存在 | 打开抽屉或工作台 | 展示名单 | — | BR001 |

| 规则ID | 规则名称 | 适用范围 | 规则内容 |
|--------|----------|----------|----------|
| BR001 | 开放选课名单 | P01 | 默认名单由选课应用生成；本页支持移除与手动添加（以可见按钮为准）。无预置专业批次名单。（已明确·历史说明口径） |

## 11. 未确认事项

| 编号 | 事项 | 影响范围 |
|------|------|----------|
| UC001 | ME 统计「学生数」等字段精确数据来源 | P01-C01-ME |
| UC002 | 任务列表完整字段矩阵与操作全集 | P01-L01 |

## 12–14

- 下游：选课应用、排课。
- 数据权限：开课模块按专业授权。
"""


def run_upgrade(menu: str, old_label: str, new_vn: int, md_to_docx, write_note_docx) -> Path:
    old_md = find_old_md(menu, old_label)
    new_label = f"{DATE}V{new_vn}"
    out_dir = version_dir(menu, DATE, f"V{new_vn}")
    if out_dir.exists():
        raise SystemExit(f"拒绝覆盖已有版本文件夹：{out_dir}")
    out_dir.mkdir(parents=True)
    text = old_md.read_text(encoding="utf-8")
    text = bump_common(text, old_label, new_label, "客户确认对齐")
    patcher = PATCHERS.get(menu)
    if patcher:
        text = patcher(text)
    out_md = out_dir / f"{menu}{new_label}.md"
    out_md.write_text(text, encoding="utf-8")
    out_docx = out_dir / f"{menu}{new_label}.docx"
    md_to_docx(out_md, out_docx)

    note_name = f"{menu}{old_label}→{new_label}变更说明.md"
    note_md = out_dir / note_name
    rows = CHANGE_ROWS[menu]
    write_change_md(
        note_md,
        menu,
        old_label,
        new_label,
        f"{menu}{old_label}.md",
        f"{menu}{new_label}.docx",
        rows,
    )
    write_note_docx(note_md, out_dir / note_name.replace(".md", ".docx"), menu, old_label, new_label)
    print(f"OK upgrade {menu} {old_label} → {new_label}")
    return out_dir


def run_first(menu: str, body: str, md_to_docx, write_note_docx, rows: list[tuple]) -> Path:
    new_label = f"{DATE}V1"
    out_dir = version_dir(menu, DATE, "V1")
    if out_dir.exists():
        raise SystemExit(f"拒绝覆盖已有版本文件夹：{out_dir}")
    out_dir.mkdir(parents=True)
    out_md = out_dir / f"{menu}{new_label}.md"
    out_md.write_text(body, encoding="utf-8")
    out_docx = out_dir / f"{menu}{new_label}.docx"
    md_to_docx(out_md, out_docx)
    note_name = f"{menu}无→{new_label}变更说明.md"
    note_md = out_dir / note_name
    write_change_md(
        note_md,
        menu,
        "无",
        new_label,
        "—",
        f"{menu}{new_label}.docx",
        rows,
        first=True,
    )
    write_note_docx(note_md, out_dir / note_name.replace(".md", ".docx"), menu, "无", new_label)
    print(f"OK first {menu} {new_label}")
    return out_dir


def make_note_docx_writer(gen_mod):
    def write_note_docx(note_md: Path, out_path: Path, menu: str, from_ver: str, to_ver: str):
        meta = {
            "name": f"厦大马来分校本科教务系统产品需求文档 — {menu}",
            "path": MENU_PATH[menu],
            "versions": f"{from_ver} → {to_ver}",
            "from_file": f"{menu}{from_ver}.md" if from_ver != "无" else "—",
            "to_file": f"{menu}{to_ver}.docx",
            "prototype": PROTO[menu],
            "date": NOTE_DATE,
            "prd_template": "V3.1",
        }
        rows = gen_mod.parse_overview_rows(note_md.read_text(encoding="utf-8"))
        gen_mod.write_change_note_docx(note_md, out_path, meta, rows)

    return write_note_docx


def main():
    gen_mod, md_to_docx = load_docx_helpers()
    write_note_docx = make_note_docx_writer(gen_mod)

    for menu, old, vn in UPGRADES:
        run_upgrade(menu, old, vn, md_to_docx, write_note_docx)

    run_first(
        "选修开课计划",
        elective_plan_md(),
        md_to_docx,
        write_note_docx,
        [
            ("界面", "P01", "选修开课计划整页", "新增", "无正式 PRD → 按客户确认原型首版落档 GE/ME 计划页"),
            ("功能", "F001–F005", "页签/保存/导出/刷新", "新增", "落档可见工具栏能力"),
            ("规则", "BR001/BR002", "配额下限与需求口径", "新增", "保底下限已明确；AC 超额确认标 UC002"),
            ("其他", "UC001/UC002", "未确认项", "澄清", "ME 列矩阵与 AC 确认仍未确认"),
        ],
    )
    run_first(
        "选修开课名单",
        elective_roster_md(),
        md_to_docx,
        write_note_docx,
        [
            ("界面", "P01", "选修开课名单整页", "新增", "无正式 PRD → 按客户确认原型首版落档统计+名单"),
            ("字段", "FD001–FD006", "查询区", "新增", "落档可见查询字段"),
            ("规则", "BR001", "开放选课名单", "新增", "默认选课应用生成；本页可维护"),
            ("其他", "UC001/UC002", "未确认项", "澄清", "ME 学生数来源与列表全矩阵未确认"),
        ],
    )
    print("DONE all 15 menus")


if __name__ == "__main__":
    main()
