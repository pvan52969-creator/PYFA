# -*- coding: utf-8 -*-
"""从 PRD 字段表与原型 UI 补充数据生成中英字段对照 Excel。"""

from __future__ import annotations

import sys
from datetime import date
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
OUT = ROOT / "参考文档" / "培养方案管理字段中英对照表.xlsx"

if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

from field_i18n_supplement import ENUM_ROWS, UI_FIELD_ROWS
from prd_build import VERSION_MGMT_FIELD_TABLES


def _skip_field(zh: str, en: str) -> bool:
    if not zh or zh.strip() in ("—", "-", ""):
        return True
    if en and en.strip() in ("—", "-"):
        en = ""
    if not en and zh.startswith("TAB2") and "列对齐" in zh:
        return True
    return False


def _rows_from_prd() -> list[tuple]:
    rows = []
    for table_title, table_rows in VERSION_MGMT_FIELD_TABLES:
        module = table_title.split("——")[0] if "——" in table_title else table_title
        location = table_title.split("——", 1)[1] if "——" in table_title else table_title
        for r in table_rows:
            zh, en = r[1], r[2]
            if _skip_field(zh, en):
                continue
            note_parts = []
            if len(r) > 3 and r[3] not in ("—", ""):
                note_parts.append(f"控件：{r[3]}")
            if len(r) > 6 and r[6] not in ("—", ""):
                note_parts.append(r[6])
            rows.append((
                module,
                location,
                "表单/字段",
                zh.strip(),
                en.strip() if en else "",
                "；".join(note_parts),
            ))
    return rows


def _dedupe(rows: list[tuple]) -> list[tuple]:
    seen = set()
    out = []
    for row in rows:
        key = (row[0], row[1], row[3], row[4])  # module, location, zh, en
        if key in seen:
            continue
        seen.add(key)
        out.append(row)
    return out


def _collect_all_field_rows() -> list[tuple]:
    prd = _rows_from_prd()
    ui = list(UI_FIELD_ROWS)
    merged = _dedupe(prd + ui)
    merged.sort(key=lambda r: (r[0], r[1], r[2], r[3]))
    return merged


HEADER_FILL = PatternFill("solid", fgColor="1F4E79")
HEADER_FONT = Font(bold=True, color="FFFFFF", size=11)
TITLE_FONT = Font(bold=True, size=14)
META_FONT = Font(size=10, color="666666")


def _style_header(ws, row: int, ncol: int):
    for c in range(1, ncol + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)


def _auto_width(ws, min_w=10, max_w=48):
    for col in ws.columns:
        letter = get_column_letter(col[0].column)
        length = max(len(str(c.value or "")) for c in col)
        ws.column_dimensions[letter].width = min(max(length + 2, min_w), max_w)


def _write_fields_sheet(wb: Workbook, rows: list[tuple]):
    ws = wb.active
    ws.title = "字段对照表"
    ws.merge_cells("A1:I1")
    ws["A1"] = "厦大马来分校 · 培养方案管理模块 · 字段中英对照表"
    ws["A1"].font = TITLE_FONT
    ws.merge_cells("A2:I2")
    ws["A2"] = (
        f"对应原型：prototype/index.html、app.js  ·  生成日期：{date.today()}  ·  "
        "范围：培养方案管理（不含开课管理模块）  ·  请客户在「客户确认英文」列填写意见"
    )
    ws["A2"].font = META_FONT

    headers = [
        "序号", "所属模块", "页面/位置", "字段类别", "中文", "英文（原型当前）", "备注", "客户确认英文", "确认意见"
    ]
    start = 4
    for i, h in enumerate(headers, 1):
        ws.cell(row=start, column=i, value=h)
    _style_header(ws, start, len(headers))

    for idx, row in enumerate(rows, 1):
        r = start + idx
        ws.cell(row=r, column=1, value=idx)
        for c, val in enumerate(row, 2):
            ws.cell(row=r, column=c, value=val)
        for c in range(1, len(headers) + 1):
            ws.cell(row=r, column=c).alignment = Alignment(vertical="top", wrap_text=True)

    ws.freeze_panes = f"A{start + 1}"
    ws.auto_filter.ref = f"A{start}:I{start + len(rows)}"
    _auto_width(ws)


def _write_enum_sheet(wb: Workbook):
    ws = wb.create_sheet("状态与枚举值")
    headers = ["序号", "类别", "中文", "英文（原型当前）", "备注", "客户确认英文", "确认意见"]
    for i, h in enumerate(headers, 1):
        ws.cell(row=1, column=i, value=h)
    _style_header(ws, 1, len(headers))

    for idx, (cat, zh, en, note) in enumerate(ENUM_ROWS, 1):
        r = idx + 1
        ws.cell(row=r, column=1, value=idx)
        ws.cell(row=r, column=2, value=cat)
        ws.cell(row=r, column=3, value=zh)
        ws.cell(row=r, column=4, value=en)
        ws.cell(row=r, column=5, value=note)
        for c in range(1, len(headers) + 1):
            ws.cell(row=r, column=c).alignment = Alignment(vertical="top", wrap_text=True)

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:G{1 + len(ENUM_ROWS)}"
    _auto_width(ws)


def build():
    rows = _collect_all_field_rows()
    wb = Workbook()
    _write_fields_sheet(wb, rows)
    _write_enum_sheet(wb)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"Generated: {OUT}")
    print(f"  字段对照表：{len(rows)} 条")
    print(f"  状态与枚举值：{len(ENUM_ROWS)} 条")


if __name__ == "__main__":
    build()
