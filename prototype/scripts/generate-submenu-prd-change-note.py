#!/usr/bin/env python3
"""按「需求调整变更说明模板（简版）」生成二级菜单 PRD 升版变更说明（md + docx）。

禁止覆盖已有变更说明文件；若目标路径已存在则报错退出。
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
BASE = ROOT / "参考文档" / "2、开课管理"
TEMPLATE = (
    ROOT
    / "参考文档"
    / "0、模板"
    / "需求调整变更说明模板（简版）.docx"
)

MENUS = ("开课时间设置", "特殊课程设置", "校选课程管理", "开课计划", "开课安排", "开课名单")

MENU_PARENT = {
    "开课时间设置": "开课设置",
    "特殊课程设置": "开课设置",
    "校选课程管理": "开课设置",
    "开课计划": "专业开课",
    "开课安排": "专业开课",
    "开课名单": "专业开课",
}

MENU_PATH = {
    "开课时间设置": "开课管理 → 开课设置 → 开课时间设置",
    "特殊课程设置": "开课管理 → 开课设置 → 特殊课程设置",
    "校选课程管理": "开课管理 → 开课设置 → 校选课程管理",
    "开课计划": "开课管理 → 专业开课 → 开课计划",
    "开课安排": "开课管理 → 专业开课 → 开课安排",
    "开课名单": "开课管理 → 专业开课 → 开课名单",
}


def menu_dir(menu: str) -> Path:
    return BASE / MENU_PARENT[menu] / menu


def set_cell_text(cell, text: str, bold: bool = False):
    cell.text = ""
    p = cell.paragraphs[0]
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(10.5)
    run.font.name = "宋体"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "宋体")


def find_version_files(menu: str, version: str) -> tuple[Path | None, Path | None, str | None]:
    """返回 (md, docx, date_in_name)。version 如 V1。

    优先在版本文件夹 `<菜单><日期><Vn>/` 内查找；兼容二级菜单根目录平铺旧布局。
    """
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


def write_md(
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
        f"> 模板：`参考文档/0、模板/厦大马来分校本科教务系统——需求调整变更说明模板（简版）.docx`",
        f"> 对照文档：`{menu}{from_date}{from_ver}` → `{menu}{to_date}{to_ver}`",
        "",
        "## 1 版本信息",
        "",
        "| 项目 | 内容 |",
        "|------|------|",
        f"| 需求文档名称 | 厦大马来分校本科教务系统产品需求文档 — {menu} |",
        f"| 上一版 → 本版 | {from_ver} → {to_ver} |",
        f"| 变更日期 | {change_date} |",
        "| 填写人 / 确认人 | |",
        "| 确认状态 | □ 待确认　□ 已确认 |",
        "",
        "## 2 本次改了什么（总览）",
        "",
        "按「模块 → 功能/位置 → 变动」填写；一行一事。变更类型只填：新增 / 修改 / 删除 / 澄清。",
        "",
        "| 序号 | 模块（菜单路径） | 功能 / 位置 | 变更类型 | 调整内容（改了什么） | 状态 |",
        "|------|------------------|-------------|---------|----------------------|------|",
    ]
    if not rows:
        lines.append("| 1 | | | | （待填写：请对照两版 PRD 补全） | 待确认 |")
    else:
        for i, r in enumerate(rows, 1):
            lines.append(
                f"| {i} | {r.get('module', MENU_PATH[menu])} | {r.get('where', '')} | "
                f"{r.get('type', '')} | {r.get('content', '')} | {r.get('status', '待确认')} |"
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


def write_docx_from_template(
    out: Path,
    menu: str,
    from_ver: str,
    to_ver: str,
    change_date: str,
    rows: list[dict],
):
    ensure_not_exists(out)
    if not TEMPLATE.exists():
        raise SystemExit(f"找不到变更说明模板：{TEMPLATE}")
    doc = Document(str(TEMPLATE))
    # table 0: 版本信息
    t0 = doc.tables[0]
    set_cell_text(t0.rows[1].cells[1], f"厦大马来分校本科教务系统产品需求文档 — {menu}")
    set_cell_text(t0.rows[2].cells[1], f"{from_ver} → {to_ver}")
    set_cell_text(t0.rows[3].cells[1], change_date)
    set_cell_text(t0.rows[4].cells[1], "")
    set_cell_text(t0.rows[5].cells[1], "□ 待确认　□ 已确认")

    # table 1: 总览（保留表头，从第 1 数据行起填充；不足则只填已有行）
    t1 = doc.tables[1]
    data_rows = t1.rows[1:]
    fill = rows or [
        {
            "module": MENU_PATH[menu],
            "where": "",
            "type": "",
            "content": "（待填写：请对照两版 PRD 补全）",
            "status": "待确认",
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
            r.get("status", "待确认"),
        ]
        for cell, val in zip(row.cells, vals):
            set_cell_text(cell, val)

    # 标题段
    if doc.paragraphs:
        # 保留模板标题风格，追加文档指向
        pass
    for p in doc.paragraphs:
        if "简版模板" in (p.text or ""):
            p.clear()
            run = p.add_run(f"厦大马来分校本科教务系统——需求调整变更说明（{menu} {from_ver}→{to_ver}）")
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

    from_md, from_docx, from_date = find_version_files(menu, from_ver)
    to_md, to_docx, to_date = find_version_files(menu, to_ver)
    if not from_date:
        raise SystemExit(f"未找到 {menu} 的 {from_ver} 文档，请先确认文件夹内已有该版本。")
    if not to_date:
        # 允许先写变更说明、后补 PRD：用变更日期的紧凑形式占位，并警告
        to_date = args.date.replace("-", "")
        print(
            f"警告：尚未找到 {menu} {to_ver} PRD 文件，变更说明文件名将使用日期 {to_date}；"
            f"请确保随后生成的 PRD 日期与之一致。",
            file=sys.stderr,
        )

    stem = f"{menu}{from_date}{from_ver}→{to_date}{to_ver}变更说明"
    # 变更说明写入新版本文件夹
    ver_dir = menu_dir(menu) / f"{menu}{to_date}{to_ver}"
    ver_dir.mkdir(parents=True, exist_ok=True)
    md_out = ver_dir / f"{stem}.md"
    docx_out = ver_dir / f"{stem}.docx"

    rows: list[dict] = []
    if not args.stub_only and from_md and to_md:
        # 不做自动 diff 猜测业务语义；留空壳由填写人/Agent 对照补全
        print("提示：请对照两版 md/docx 在变更说明中填写「本次改了什么」；本脚本不自动推断业务差异。")

    write_md(md_out, menu, from_ver, to_ver, from_date, to_date, args.date, rows)
    write_docx_from_template(docx_out, menu, from_ver, to_ver, args.date, rows)
    print(f"Wrote: {md_out}")
    print(f"Wrote: {docx_out}")


if __name__ == "__main__":
    main()
