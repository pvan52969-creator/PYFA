#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""将正式链现行版本统一命名为 V2，并删除同菜单下更早版本文件夹。

保留 开课0807、00_* 。不覆盖开课0807 内文件。
"""
from __future__ import annotations

import importlib.util
import re
import shutil
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
BASE = ROOT / "参考文档" / "2、开课管理"

VER_FOLDER = re.compile(r"^(.+)(\d{8})(V\d+)$")

# 现行稿：日期+原版本号 → 目标 V2（日期不变）
CURRENT_TO_V2 = {
    "20260909V3": "20260909V2",
    "20260909V6": "20260909V2",
    "20260904V1": "20260904V2",  # 选修开课安排
}


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


def version_folders(menu_dir: Path) -> list[Path]:
    out = []
    for p in menu_dir.iterdir():
        if p.is_dir() and VER_FOLDER.match(p.name):
            out.append(p)
    return out


def is_current(folder: Path) -> bool:
    m = VER_FOLDER.match(folder.name)
    if not m:
        return False
    return f"{m.group(2)}{m.group(3)}" in CURRENT_TO_V2


def rewrite_text(text: str) -> str:
    # 先长后短，避免误伤
    for old, new in sorted(CURRENT_TO_V2.items(), key=lambda kv: -len(kv[0])):
        text = text.replace(old, new)
    return text


def parse_note_meta(md_text: str) -> dict:
    kv = {}
    for line in md_text.splitlines():
        if not line.startswith("|") or "------" in line:
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) >= 2 and cells[0] and cells[0] != "项目":
            kv[cells[0]] = cells[1]
    return {
        "name": kv.get("需求文档名称", ""),
        "path": kv.get("菜单路径", ""),
        "versions": kv.get("上一有效版 → 本版", ""),
        "from_file": kv.get("对比基线文件") or kv.get("上一版文件", "—"),
        "to_file": kv.get("本版文件", ""),
        "prd_template": kv.get("本版 PRD 模板", "V3.1"),
        "prototype": kv.get("原型地址", "—"),
        "date": kv.get("变更日期", "2026-09-09"),
    }


def main():
    note_mod, md_to_docx = load_docx_helpers()
    l1s = [p for p in BASE.iterdir() if p.is_dir() and p.name[:1].isdigit()]
    deleted, renamed = [], []

    for l1 in sorted(l1s):
        for l2 in sorted(p for p in l1.iterdir() if p.is_dir()):
            folders = version_folders(l2)
            if not folders:
                continue
            currents = [p for p in folders if is_current(p)]
            olds = [p for p in folders if not is_current(p)]
            if not currents:
                print(f"SKIP 无现行稿 {l2.relative_to(BASE)} folders={[p.name for p in folders]}")
                continue
            if len(currents) > 1:
                raise SystemExit(f"同一菜单多个现行稿：{currents}")

            for old in olds:
                shutil.rmtree(old)
                deleted.append(str(old.relative_to(BASE)))
                print(f"DEL  {old.relative_to(BASE)}")

            src = currents[0]
            m = VER_FOLDER.match(src.name)
            assert m
            old_token = f"{m.group(2)}{m.group(3)}"
            new_token = CURRENT_TO_V2[old_token]
            dst = src.parent / f"{m.group(1)}{new_token}"
            if src != dst:
                if dst.exists():
                    raise SystemExit(f"目标已存在：{dst}")
                src.rename(dst)
                renamed.append(f"{src.name} → {dst.name}")
                print(f"MV   {src.relative_to(BASE)} → {dst.name}")
            else:
                dst = src

            # 先改文件名
            for f in list(dst.iterdir()):
                if not f.is_file() or f.name.startswith("."):
                    continue
                new_name = rewrite_text(f.name)
                if new_name != f.name:
                    f.rename(dst / new_name)

            # 改 md 正文
            for md in dst.glob("*.md"):
                text = rewrite_text(md.read_text(encoding="utf-8"))
                md.write_text(text, encoding="utf-8")

            # 丢掉旧 docx，从 md 重生
            for docx in dst.glob("*.docx"):
                docx.unlink()

            for md in sorted(dst.glob("*.md")):
                out = md.with_suffix(".docx")
                if "变更说明" in md.name:
                    meta = parse_note_meta(md.read_text(encoding="utf-8"))
                    rows = note_mod.parse_overview_rows(md.read_text(encoding="utf-8"))
                    note_mod.write_change_note_docx(md, out, meta, rows)
                    print(f"DOCX note {out.relative_to(BASE)} rows={len(rows)}")
                else:
                    md_to_docx(md, out)
                    print(f"DOCX prd  {out.relative_to(BASE)}")

    print("\n--- 删除 ---")
    for x in deleted:
        print(x)
    print("\n--- 重命名 ---")
    for x in renamed:
        print(x)


if __name__ == "__main__":
    main()
