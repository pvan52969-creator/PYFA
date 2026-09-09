#!/usr/bin/env python3
"""按「需求调整变更说明模板（简版）」生成二级菜单 PRD 升版变更说明（md + docx）。

默认使用 V3 模板（对齐 PRD 模板 V3 的对象类型/对象ID）。
正文仍为旧 PRD V2 结构升版时，可传 `--template-version v2`。

禁止覆盖已有变更说明文件；若目标路径已存在则报错退出。
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

from docx import Document
from docx.oxml.ns import qn
from docx.shared import Pt

from prd_folder_paths import menu_dir, version_dir

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
TEMPLATE_DIR = ROOT / "参考文档" / "0、模板"

TEMPLATE_BY_VERSION = {
    "v3": TEMPLATE_DIR / "需求调整变更说明模板（简版）20260901V3.docx",
    "v2": TEMPLATE_DIR / "需求调整变更说明模板（简版）20260821V2.docx",
}

# 兼容旧文件名（若仍存在）
TEMPLATE_LEGACY_FALLBACKS = {
    "v2": [
        TEMPLATE_DIR / "需求调整变更说明模板（简版）.docx",
        TEMPLATE_DIR / "厦大马来分校本科教务系统——需求调整变更说明模板（简版）.docx",
    ],
}

MENUS = (
    "开课时间设置",
    "特殊课程设置",
    "校选课程管理",
    "开课计划",
    "开课安排",
    "开课名单",
    "课程班",
    "Teaching Load",
    "授课确认管理",
    "授课确认（教师端）",
    "授课教师替换",
    "排课计划",
)

MENU_PATH = {
    "开课时间设置": "开课管理 → 开课设置 → 开课时间设置",
    "特殊课程设置": "开课管理 → 开课设置 → 特殊课程设置",
    "校选课程管理": "开课管理 → 开课设置 → 校选课程管理",
    "开课计划": "开课管理 → 专业开课 → 开课计划",
    "开课安排": "开课管理 → 专业开课 → 开课安排",
    "开课名单": "开课管理 → 专业开课 → 开课名单",
    "课程班": "开课管理 → 课程班管理 → 课程班",
    "Teaching Load": "开课管理 → 课程班管理 → Teaching Load",
    "授课确认管理": "开课管理 → 课程班管理 → 授课确认管理",
    "授课确认（教师端）": "开课管理 → 课程班管理 → 授课确认（教师端）",
    "授课教师替换": "开课管理 → 课程班管理 → 授课教师替换",
    "排课计划": "开课管理 → 课程班管理 → 排课计划",
}


def resolve_template(template_version: str) -> Path:
    key = template_version.lower().lstrip("v")
    key = f"v{key}" if not key.startswith("v") else key
    if key not in TEMPLATE_BY_VERSION:
        raise SystemExit(f"不支持的模板版本：{template_version}（仅 v2 / v3）")
    path = TEMPLATE_BY_VERSION[key]
    if path.exists():
        return path
    for fb in TEMPLATE_LEGACY_FALLBACKS.get(key, []):
        if fb.exists():
            return fb
    raise SystemExit(f"找不到变更说明模板：{path}")


def set_cell_text(cell, text: str, bold: bool = False):
    cell.text = ""
    p = cell.paragraphs[0]
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(10.5)
    run.font.name = "宋体"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "宋体")


def find_version_files(menu: str, version: str) -> tuple[Path | None, Path | None, str | None]:
    """返回 (md, docx, date_in_name)。version 如 V1。"""
    folder = menu_dir(menu)
    if not folder.is_dir():
        return None, None, None
    dir_pat = re.compile(rf"^{re.escape(menu)}(\d{{8}}){re.escape(version)}$")
    file_pat = re.compile(rf"^{re.escape(menu)}(\d{{8}}){re.escape(version)}\.(md|docx)$")
    found: dict[str, Path] = {}
    ver_date = None

    for p in folder.iterdir():
        if p.is_dir():
            m = dir_pat.match(p.name)
            if not m:
                continue
            ver_date = m.group(1)
            for child in p.iterdir():
                cm = file_pat.match(child.name)
                if cm:
                    found[cm.group(2)] = child
            break

    if not found:
        for p in folder.iterdir():
            if not p.is_file():
                continue
            m = file_pat.match(p.name)
            if not m:
                continue
            ver_date = m.group(1)
            found[m.group(2)] = p

    return found.get("md"), found.get("docx"), ver_date


def ensure_not_exists(path: Path):
    if path.exists():
        raise SystemExit(f"拒绝覆盖已有文件：{path}\n请改文件名或确认版本号。")


def write_md_v3(
    out: Path,
    menu: str,
    from_ver: str,
    to_ver: str,
    from_date: str,
    to_date: str,
    change_date: str,
    prd_template: str,
    prototype: str,
    rows: list[dict],
):
    ensure_not_exists(out)
    tpl_rel = "参考文档/0、模板/需求调整变更说明模板（简版）20260901V3.docx"
    lines = [
        f"# {menu}——需求调整变更说明",
        "",
        f"> 模板：`{tpl_rel}`  ",
        f"> 对照文档：`{menu}{from_date}{from_ver}` → `{menu}{to_date}{to_ver}`",
        "",
        "## 1 版本信息",
        "",
        "| 项目 | 内容 |",
        "|------|------|",
        f"| 需求文档名称 | 厦大马来分校本科教务系统产品需求文档 — {menu} |",
        f"| 菜单路径 | {MENU_PATH[menu]} |",
        f"| 上一有效版 → 本版 | {from_ver} → {to_ver} |",
        f"| 上一版文件 | {menu}{from_date}{from_ver}.docx |",
        f"| 本版文件 | {menu}{to_date}{to_ver}.docx |",
        f"| 本版 PRD 模板 | {prd_template} |",
        f"| 原型地址 | {prototype or '—'} |",
        f"| 变更日期 | {change_date} |",
        "",
        "## 2 本次改了什么（总览）",
        "",
        "按「模块 → 对象 → 变动」填写；一行一事。变更类型只填：新增 / 修改 / 删除 / 澄清。"
        "有 PRD ID 的对象必须填对象ID；纯文案澄清可填 —。",
        "",
        "| 序号 | 模块（菜单路径） | 对象类型 | 对象ID | 功能 / 位置（可读名） | 变更类型 | 调整内容（从什么变成什么） | 状态 |",
        "|------|------------------|----------|--------|---------------------|----------|------------------------------|------|",
    ]
    if not rows:
        lines.append(
            f"| 1 | {MENU_PATH[menu]} | | — | | | （待填写：请对照两版 PRD 补全） | 未确认 |"
        )
    else:
        for i, r in enumerate(rows, 1):
            lines.append(
                f"| {i} | {r.get('module', MENU_PATH[menu])} | {r.get('obj_type', '')} | "
                f"{r.get('obj_id', '—')} | {r.get('where', '')} | {r.get('type', '')} | "
                f"{r.get('content', '')} | {r.get('status', '未确认')} |"
            )
    lines += [
        "",
        "## 3 前后对照（可选，复杂变更再填）",
        "",
        "| 序号（对应上表） | 对象ID | 变更前（上一有效版） | 变更后（本版） |",
        "|------------------|--------|----------------------|----------------|",
        "| | | | |",
        "",
        "## 4 连带影响（可选）",
        "",
        "| 序号 | 影响到哪里 | 影响说明 | 需同步 |",
        "|------|------------|----------|--------|",
        "| | | | □原型 □开发 □测试 |",
        "",
    ]
    out.write_text("\n".join(lines), encoding="utf-8")


def write_md_v2(
    out: Path,
    menu: str,
    from_ver: str,
    to_ver: str,
    from_date: str,
    to_date: str,
    change_date: str,
    rows: list[dict],
):
    ensure_not_exists(out)
    lines = [
        f"# {menu}——需求调整变更说明",
        "",
        f"> 模板：`参考文档/0、模板/需求调整变更说明模板（简版）20260821V2.docx`",
        f"> 对照文档：`{menu}{from_date}{from_ver}` → `{menu}{to_date}{to_ver}`",
        "",
        "## 1 版本信息",
        "",
        "| 项目 | 内容 |",
        "|------|------|",
        f"| 需求文档名称 | 厦大马来分校本科教务系统产品需求文档 — {menu} |",
        f"| 上一版 → 本版 | {from_ver} → {to_ver} |",
        f"| 变更日期 | {change_date} |",
        "",
        "## 2 本次改了什么（总览）",
        "",
        "按「模块 → 功能/位置 → 变动」填写；一行一事。变更类型只填：新增 / 修改 / 删除 / 澄清。",
        "",
        "| 序号 | 模块（菜单路径） | 功能 / 位置 | 变更类型 | 调整内容（改了什么） | 状态 |",
        "|------|------------------|-------------|---------|----------------------|------|",
    ]
    if not rows:
        lines.append("| 1 | | | | （待填写：请对照两版 PRD 补全） | 未确认 |")
    else:
        for i, r in enumerate(rows, 1):
            lines.append(
                f"| {i} | {r.get('module', MENU_PATH[menu])} | {r.get('where', '')} | "
                f"{r.get('type', '')} | {r.get('content', '')} | {r.get('status', '未确认')} |"
            )
    lines += [
        "",
        "## 3 前后对照（可选，复杂变更再填）",
        "",
        "| 序号（对应上表） | 变更前（上一版） | 变更后（本版） |",
        "|------------------|------------------|----------------|",
        "| | | |",
        "",
        "## 4 连带影响（可选）",
        "",
        "| 序号 | 影响到哪里 | 影响说明 | 需同步 |",
        "|------|------------|----------|--------|",
        "| | | | □原型 □开发 □测试 |",
        "",
    ]
    out.write_text("\n".join(lines), encoding="utf-8")


def _fill_kv_by_label(table, labels_to_values: dict[str, str]):
    """按左侧标签填充 kv 表（兼容 V2/V3 行序差异）。"""
    for row in table.rows:
        label = (row.cells[0].text or "").strip().replace("\n", "")
        for key, val in labels_to_values.items():
            if key in label:
                set_cell_text(row.cells[1], val)
                break


def write_docx_from_template(
    out: Path,
    template: Path,
    template_version: str,
    menu: str,
    from_ver: str,
    to_ver: str,
    from_date: str,
    to_date: str,
    change_date: str,
    prd_template: str,
    prototype: str,
    rows: list[dict],
):
    ensure_not_exists(out)
    doc = Document(str(template))
    t0 = doc.tables[0]
    _fill_kv_by_label(
        t0,
        {
            "需求文档名称": f"厦大马来分校本科教务系统产品需求文档 — {menu}",
            "菜单路径": MENU_PATH[menu],
            "上一有效版": f"{from_ver} → {to_ver}",
            "上一版 → 本版": f"{from_ver} → {to_ver}",
            "上一版文件": f"{menu}{from_date}{from_ver}.docx",
            "本版文件": f"{menu}{to_date}{to_ver}.docx",
            "本版 PRD 模板": prd_template,
            "原型地址": prototype or "—",
            "变更日期": change_date,
        },
    )
    # 清空签核栏（若模板仍带）
    for row in t0.rows:
        label = (row.cells[0].text or "").strip()
        if any(x in label for x in ("填写人", "确认人", "确认状态")):
            set_cell_text(row.cells[1], "")

    t1 = doc.tables[1]
    data_rows = t1.rows[1:]
    is_v3 = template_version.lower().endswith("3") or "v3" in template_version.lower()
    if is_v3:
        fill = rows or [
            {
                "module": MENU_PATH[menu],
                "obj_type": "",
                "obj_id": "—",
                "where": "",
                "type": "",
                "content": "（待填写：请对照两版 PRD 补全）",
                "status": "未确认",
            }
        ]
        for i, row in enumerate(data_rows):
            if i >= len(fill):
                for c in row.cells:
                    set_cell_text(c, "")
                continue
            r = fill[i]
            vals = [
                str(i + 1),
                r.get("module", MENU_PATH[menu]),
                r.get("obj_type", ""),
                r.get("obj_id", "—"),
                r.get("where", ""),
                r.get("type", ""),
                r.get("content", ""),
                r.get("status", "未确认"),
            ]
            for cell, val in zip(row.cells, vals):
                set_cell_text(cell, val)
    else:
        fill = rows or [
            {
                "module": MENU_PATH[menu],
                "where": "",
                "type": "",
                "content": "（待填写：请对照两版 PRD 补全）",
                "status": "未确认",
            }
        ]
        for i, row in enumerate(data_rows):
            if i >= len(fill):
                for c in row.cells:
                    set_cell_text(c, "")
                continue
            r = fill[i]
            vals = [
                str(i + 1),
                r.get("module", MENU_PATH[menu]),
                r.get("where", ""),
                r.get("type", ""),
                r.get("content", ""),
                r.get("status", "未确认"),
            ]
            for cell, val in zip(row.cells, vals):
                set_cell_text(cell, val)

    for p in doc.paragraphs:
        if "简版模板" in (p.text or "") or "简版）" in (p.text or ""):
            # 仅替换标题行
            if "厦大马来" in (p.text or "") and "变更说明" in (p.text or ""):
                p.clear()
                run = p.add_run(
                    f"厦大马来分校本科教务系统——需求调整变更说明（{menu} {from_ver}→{to_ver}）"
                )
                run.font.name = "宋体"
                run._element.rPr.rFonts.set(qn("w:eastAsia"), "宋体")
                break

    doc.save(out)


def parse_args():
    ap = argparse.ArgumentParser(description="生成二级菜单 PRD 升版变更说明")
    ap.add_argument("--menu", required=True, choices=MENUS, help="二级菜单名")
    ap.add_argument("--from", dest="from_ver", required=True, help="上一版，如 V1")
    ap.add_argument("--to", dest="to_ver", required=True, help="本版，如 V2")
    ap.add_argument(
        "--date",
        default=date.today().strftime("%Y-%m-%d"),
        help="变更日期 YYYY-MM-DD（默认今天）",
    )
    ap.add_argument(
        "--template-version",
        default="v3",
        choices=("v2", "v3", "V2", "V3"),
        help="变更说明模板版本：v3=对齐 PRD V3（默认）；v2=正文仍为旧 PRD 结构时用",
    )
    ap.add_argument(
        "--prd-template",
        default="",
        help="写入版本信息「本版 PRD 模板」；默认随 --template-version（v3→V3，v2→V2）",
    )
    ap.add_argument(
        "--prototype",
        default="",
        help="原型地址（可选），如 prototype/index.html → page-xxx",
    )
    ap.add_argument(
        "--stub-only",
        action="store_true",
        help="仅生成空壳（总览待填），不尝试推断变更行",
    )
    return ap.parse_args()


def main():
    args = parse_args()
    menu = args.menu
    from_ver = args.from_ver if args.from_ver.startswith("V") else f"V{args.from_ver}"
    to_ver = args.to_ver if args.to_ver.startswith("V") else f"V{args.to_ver}"
    tpl_ver = args.template_version.lower()
    prd_template = args.prd_template or ("V3" if tpl_ver == "v3" else "V2")
    template = resolve_template(tpl_ver)

    from_md, from_docx, from_date = find_version_files(menu, from_ver)
    to_md, to_docx, to_date = find_version_files(menu, to_ver)
    if not from_date:
        raise SystemExit(f"未找到 {menu} 的 {from_ver} 文档，请先确认文件夹内已有该版本。")
    if not to_date:
        to_date = args.date.replace("-", "")
        print(
            f"警告：尚未找到 {menu} {to_ver} PRD 文件，变更说明文件名将使用日期 {to_date}；"
            f"请确保随后生成的 PRD 日期与之一致。",
            file=sys.stderr,
        )

    stem = f"{menu}{from_date}{from_ver}→{to_date}{to_ver}变更说明"
    ver_dir = version_dir(menu, to_date, to_ver)
    ver_dir.mkdir(parents=True, exist_ok=True)
    md_out = ver_dir / f"{stem}.md"
    docx_out = ver_dir / f"{stem}.docx"

    rows: list[dict] = []
    if not args.stub_only and from_md and to_md:
        print("提示：请对照两版 md/docx 在变更说明中填写「本次改了什么」；本脚本不自动推断业务差异。")

    if tpl_ver == "v3":
        write_md_v3(
            md_out,
            menu,
            from_ver,
            to_ver,
            from_date,
            to_date,
            args.date,
            prd_template,
            args.prototype,
            rows,
        )
    else:
        write_md_v2(md_out, menu, from_ver, to_ver, from_date, to_date, args.date, rows)

    write_docx_from_template(
        docx_out,
        template,
        tpl_ver,
        menu,
        from_ver,
        to_ver,
        from_date,
        to_date,
        args.date,
        prd_template,
        args.prototype,
        rows,
    )
    print(f"Wrote: {md_out}")
    print(f"Wrote: {docx_out}")
    print(f"Template: {template.name} ({tpl_ver})")


if __name__ == "__main__":
    main()
