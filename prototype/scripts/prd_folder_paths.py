# -*- coding: utf-8 -*-
"""开课管理 PRD 目录：一级/二级菜单文件夹序号映射（与侧栏顺序一致）。"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

BASE = Path(__file__).resolve().parent.parent / "参考文档" / "2、开课管理"

# 一级菜单（侧栏顺序；03/04 预留给选修开课、特殊开课）
L1_FOLDER = {
    "开课设置": "01_开课设置",
    "专业开课": "02_专业开课",
    "选修开课": "03_选修开课",
    "特殊开课": "04_特殊开课",
    "课程班管理": "05_课程班管理",
    # 历史脚本仍写「开课清单」时落到课程班管理
    "开课清单": "05_课程班管理",
}

# 二级菜单（各一级下从 01 递增）
L2_FOLDER = {
    # 01_开课设置
    "开课时间设置": "01_开课时间设置",
    "校选课程管理": "02_校选课程管理",
    "特殊课程设置": "03_特殊课程设置",
    # 02_专业开课
    "开课计划": "01_开课计划",
    "开课安排": "02_开课安排",
    "开课名单": "03_开课名单",
    # 05_课程班管理
    "课程班": "01_课程班",
    "Teaching Load": "02_Teaching Load",
    "授课确认管理": "03_授课确认管理",
    "授课确认（教师端）": "04_授课确认（教师端）",
}

MENU_PARENT = {
    "开课时间设置": "开课设置",
    "特殊课程设置": "开课设置",
    "校选课程管理": "开课设置",
    "开课计划": "专业开课",
    "开课安排": "专业开课",
    "开课名单": "专业开课",
    "课程班": "课程班管理",
    "Teaching Load": "课程班管理",
    "授课确认管理": "课程班管理",
    "授课确认（教师端）": "课程班管理",
}


def l1_dir(parent_cn: str) -> Path:
    return BASE / L1_FOLDER[parent_cn]


def menu_dir(menu_cn: str, parent_cn: Optional[str] = None) -> Path:
    parent = parent_cn or MENU_PARENT[menu_cn]
    return l1_dir(parent) / L2_FOLDER[menu_cn]


def version_dir(menu_cn: str, date_ymd: str, version: str, parent_cn: Optional[str] = None) -> Path:
    ver = version if version.startswith("V") else f"V{version}"
    folder = f"{menu_cn}{date_ymd}{ver}"
    return menu_dir(menu_cn, parent_cn) / folder
