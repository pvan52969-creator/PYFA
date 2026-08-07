#!/usr/bin/env python3
"""高清泳道图：大间距 + 外侧回退廊 + 行间通道，禁止穿步骤列/穿框。"""

from __future__ import annotations

import math
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT_CANDIDATES = [
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/STHeiti Medium.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/Library/Fonts/Arial Unicode.ttf",
    "/System/Library/Fonts/Supplemental/Songti.ttc",
]
SCALE = 2


def _font(size: int):
    logical = max(1, int(size * SCALE))
    for path in FONT_CANDIDATES:
        for index in (0, 1):
            try:
                return ImageFont.truetype(path, size=logical, index=index)
            except Exception:
                continue
    return ImageFont.load_default()


def _wrap(draw, text, font, max_w):
    text = (text or "").strip() or ""
    paragraphs = text.replace("\\n", "\n").split("\n")
    lines = []
    for para in paragraphs:
        if not para:
            continue
        cur = ""
        for ch in para:
            trial = cur + ch
            if draw.textlength(trial, font=font) <= max_w:
                cur = trial
            else:
                if cur:
                    lines.append(cur)
                cur = ch
        if cur:
            lines.append(cur)
    # 避免单独一行只有标点（如 "?"）
    merged = []
    for ln in lines:
        if merged and ln.strip() in "？?。.!！，,、；;：:" and len(ln.strip()) <= 2:
            merged[-1] = merged[-1] + ln.strip()
        else:
            merged.append(ln)
    return merged or [""]


def _text_width(draw, text, font):
    flat = (text or "").replace("\\n", "").replace("\n", "")
    return draw.textlength(flat, font=font) if flat else 0


def _seg_pierces_box(a, b, box, margin=2):
    """线段是否穿过框内部（仅擦边/贴边不算）。"""
    x0, y0, x1, y1 = box[0] + margin, box[1] + margin, box[2] - margin, box[3] - margin
    if x1 <= x0 or y1 <= y0:
        return False
    ax, ay = a
    bx, by = b
    # 采样（含端点内侧）
    steps = max(8, int(math.hypot(bx - ax, by - ay) / (6 * SCALE)))
    for i in range(1, steps):  # 跳过端点，端点常在框边连接
        t = i / steps
        x, y = ax + (bx - ax) * t, ay + (by - ay) * t
        if x0 < x < x1 and y0 < y < y1:
            return True
    return False


def _path_pierces_any(pts, box_map, skip_ids=None):
    """任一中段点落入框内即穿框。源/目标框同样检测（禁止从框心穿出）。"""
    for a, b in zip(pts, pts[1:]):
        for nid, rect in box_map.items():
            if _seg_pierces_box(a, b, rect, margin=6):
                return nid
    return None


def _arrow(draw, tip, direction, fill, size=11):
    size *= SCALE
    dx, dy = direction
    L = math.hypot(dx, dy) or 1
    dx, dy = dx / L, dy / L
    px, py = -dy, dx
    p1 = (tip[0] - dx * size + px * size * 0.42, tip[1] - dy * size + py * size * 0.42)
    p2 = (tip[0] - dx * size - px * size * 0.42, tip[1] - dy * size - py * size * 0.42)
    draw.polygon([tip, p1, p2], fill=fill)


def _label_size(draw, text, font):
    pad = 5 * SCALE
    bb = draw.textbbox((0, 0), text, font=font)
    return bb[2] - bb[0] + 2 * pad, bb[3] - bb[1] + 2 * pad, pad


def _label(draw, xy, text, font, fill_bg, outline):
    if not text:
        return None
    x, y = xy
    tw, th, pad = _label_size(draw, text, font)
    bb = draw.textbbox((0, 0), text, font=font)
    cw, ch = bb[2] - bb[0], bb[3] - bb[1]
    rect = [x - tw / 2, y - th / 2, x + tw / 2, y + th / 2]
    # 不透明底盖住下方线段（允许重合，禁止说明与线/框交织穿插）
    draw.rounded_rectangle(rect, radius=5 * SCALE, fill=fill_bg, outline=None)
    draw.rounded_rectangle(rect, radius=5 * SCALE, outline=outline, width=max(2, SCALE))
    draw.text((x - cw / 2, y - ch / 2), text, fill=outline, font=font)
    return rect


def _rects_overlap(a, b, margin=0):
    return not (
        a[2] + margin < b[0]
        or b[2] + margin < a[0]
        or a[3] + margin < b[1]
        or b[3] + margin < a[1]
    )


def _place_label_clear(draw, pts, text, font, fill_bg, outline, obstacles, placed, canvas):
    """把说明放到线段旁的空白处：不压框、不压其它说明、尽量不压线中点以外区域。"""
    if not text or len(pts) < 2:
        return
    tw, th, _ = _label_size(draw, text, font)
    segs = []
    for a, b in zip(pts, pts[1:]):
        length = math.hypot(b[0] - a[0], b[1] - a[1])
        segs.append((length, a, b))
    segs.sort(key=lambda x: -x[0])

    candidates = []
    for length, a, b in segs:
        # 段太短放不下说明 → 跳过（除非是唯一长段）
        if length < max(tw * 0.45, 36 * SCALE) and length < segs[0][0] * 0.85:
            continue
        dx, dy = b[0] - a[0], b[1] - a[1]
        horiz = abs(dx) >= abs(dy)
        for t in (0.30, 0.45, 0.55, 0.70):
            mx = a[0] + dx * t
            my = a[1] + dy * t
            # 水平线：上下；竖直线：左右。外偏要够大，避免骑框边
            gap = 14 * SCALE + (th / 2 if horiz else tw / 2)
            if horiz:
                offs = [(0, -gap), (0, gap), (0, -gap - 12 * SCALE), (0, gap + 12 * SCALE)]
            else:
                offs = [(gap, 0), (-gap, 0), (gap + 12 * SCALE, 0), (-gap - 12 * SCALE, 0)]
            for ox, oy in offs:
                cx, cy = mx + ox, my + oy
                rect = [cx - tw / 2, cy - th / 2, cx + tw / 2, cy + th / 2]
                # 画布内
                if rect[0] < canvas[0] or rect[1] < canvas[1] or rect[2] > canvas[2] or rect[3] > canvas[3]:
                    continue
                candidates.append((length, abs(ox) + abs(oy), rect, (cx, cy)))

    def ok(rect):
        m = 4 * SCALE
        for obs in obstacles:
            if _rects_overlap(rect, obs, margin=m):
                return False
        for lab in placed:
            if _rects_overlap(rect, lab, margin=m):
                return False
        return True

    # 优先：走廊内长段 + 外偏大（比贴着框的短段更安全）
    def corridor_bonus(rect):
        mx = (rect[0] + rect[2]) / 2
        # 粗略：画布左右 18% 视为廊区
        w = canvas[2] - canvas[0]
        if mx < canvas[0] + w * 0.18 or mx > canvas[2] - w * 0.18:
            return 1e6
        return 0

    candidates.sort(key=lambda c: (-(c[0] + corridor_bonus(c[2])), -c[1]))
    for _, __, rect, center in candidates:
        if ok(rect):
            drawn = _label(draw, center, text, font, fill_bg, outline)
            if drawn:
                placed.append(drawn)
            return

    # 兜底：贴最长段外侧更远一点，仍做一次碰撞检测
    length, a, b = segs[0]
    tw, th, _ = _label_size(draw, text, font)
    for dist in (18 * SCALE, 28 * SCALE, 40 * SCALE):
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        if abs(b[0] - a[0]) >= abs(b[1] - a[1]):
            centers_try = [(mx, my - th / 2 - dist), (mx, my + th / 2 + dist)]
        else:
            centers_try = [(mx + tw / 2 + dist, my), (mx - tw / 2 - dist, my)]
        for center in centers_try:
            rect = [center[0] - tw / 2, center[1] - th / 2, center[0] + tw / 2, center[1] + th / 2]
            if rect[0] < canvas[0] or rect[1] < canvas[1] or rect[2] > canvas[2] or rect[3] > canvas[3]:
                continue
            if ok(rect):
                drawn = _label(draw, center, text, font, fill_bg, outline)
                if drawn:
                    placed.append(drawn)
                return
    # 实在避不开：仍画出来（保证说明不丢）
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
    center = (mx, my - th / 2 - 24 * SCALE)
    drawn = _label(draw, center, text, font, fill_bg, outline)
    if drawn:
        placed.append(drawn)


def _polyline(draw, pts, color, width):
    for a, b in zip(pts, pts[1:]):
        draw.line([a, b], fill=color, width=width)
    if len(pts) >= 2:
        a, b = pts[-2], pts[-1]
        _arrow(draw, b, (b[0] - a[0], b[1] - a[1]), color, size=12)


def draw_swimlane(*, title, lanes, rows, edges, out, kind="business"):
    """edges: [{frm,to,label,style}] style=forward|branch_yes|branch_no|back"""
    n_lanes = len(lanes)
    n_rows = len(rows)
    for r in rows:
        assert len(r) == n_lanes

    # —— 大间距布局：框随文字加宽；走线禁止穿框 ——
    # [pad][步骤列][左廊][泳道…][右廊][pad]
    left_w = 88
    lane_w = 340
    header_h = 56
    title_h = 64
    node_band = 150
    gap_band = 140
    row_h = node_band + gap_band
    pad = 48
    left_corridor = 130
    right_corridor = 200
    legend_h = 44
    bottom = 28
    box_inset_x = 36  # 框可更宽，少换行
    box_h = 78

    L = lambda v: int(v * SCALE)  # noqa: E731
    width = L(pad * 2 + left_w + left_corridor + n_lanes * lane_w + right_corridor)
    height = L(title_h + header_h + n_rows * row_h - gap_band // 2 + bottom + pad + legend_h)

    if kind == "business":
        header_fill, header_line = (254, 243, 199), (180, 83, 9)
        box_fill, box_line = (255, 247, 237), (194, 65, 12)
        decision_fill, decision_line = (245, 243, 255), (91, 33, 182)
    else:
        header_fill, header_line = (224, 242, 254), (3, 105, 161)
        box_fill, box_line = (236, 254, 255), (14, 116, 144)
        decision_fill, decision_line = (238, 242, 255), (67, 56, 202)

    end_fill, end_line = (243, 244, 246), (55, 65, 81)
    note_fill, note_line = (248, 250, 252), (100, 116, 139)
    bg, grid, text_c = (255, 255, 255), (226, 232, 240), (15, 23, 42)
    ok_c, no_c, fwd_c = (21, 128, 61), (185, 28, 28), (30, 41, 59)
    corridor_bg = (248, 250, 252)

    img = Image.new("RGB", (width, height), bg)
    draw = ImageDraw.Draw(img)
    font_title, font_lane = _font(20), _font(15)
    font_box, font_small, font_label = _font(12), _font(12), _font(11)

    tw = draw.textlength(title, font=font_title)
    draw.text(((width - tw) / 2, L(18)), title, fill=text_c, font=font_title)

    top = L(title_h)
    pad_s = L(pad)
    left_cs, left_ws, lane_ws = L(left_corridor), L(left_w), L(lane_w)
    right_cs = L(right_corridor)
    header_hs, row_hs = L(header_h), L(row_h)
    node_bs, gap_bs = L(node_band), L(gap_band)
    box_inset = L(box_inset_x)
    box_hs = L(box_h)

    # 步骤列 → 左廊 → 泳道 → 右廊
    step_left = pad_s
    rail_left = step_left + left_ws
    lanes_left = rail_left + left_cs
    content_right = lanes_left + n_lanes * lane_ws
    body_bottom = top + header_hs + n_rows * row_hs - gap_bs // 2

    # 左廊 / 右廊底色（专供走线）
    draw.rectangle([rail_left, top, lanes_left, body_bottom], fill=corridor_bg, outline=None)
    draw.rectangle([content_right, top, content_right + right_cs, body_bottom], fill=corridor_bg, outline=None)

    # 表头（步骤 + 泳道；左廊表头留空或浅底）
    draw.rectangle(
        [step_left, top, content_right, top + header_hs],
        outline=header_line, width=2 * SCALE, fill=(248, 250, 252),
    )
    draw.rectangle(
        [rail_left, top, lanes_left, top + header_hs],
        fill=corridor_bg, outline=grid, width=SCALE,
    )
    corner = "角色" if kind == "business" else "模块"
    draw.rectangle(
        [step_left, top, rail_left, top + header_hs],
        fill=(241, 245, 249), outline=grid, width=2 * SCALE,
    )
    cw = draw.textlength(corner, font=font_small)
    draw.text(
        (step_left + (left_ws - cw) / 2, top + header_hs / 2 - L(8)),
        corner, fill=(51, 65, 85), font=font_small,
    )

    for j, name in enumerate(lanes):
        x0 = lanes_left + j * lane_ws
        draw.rectangle(
            [x0, top, x0 + lane_ws, top + header_hs],
            fill=header_fill, outline=header_line, width=2 * SCALE,
        )
        lines = _wrap(draw, name, font_lane, lane_ws - L(16))
        th = len(lines) * L(18)
        y = top + (header_hs - th) / 2
        for li, ln in enumerate(lines):
            lw = draw.textlength(ln, font=font_lane)
            draw.text((x0 + (lane_ws - lw) / 2, y + li * L(18)), ln, fill=text_c, font=font_lane)

    centers = {}  # id -> (cx, top_y, bottom_y, left_x, right_x, row, lane)

    for i, row in enumerate(rows):
        y0 = top + header_hs + i * row_hs
        y_node1 = y0 + node_bs

        # 步骤列（禁止走线）
        draw.rectangle(
            [step_left, y0, rail_left, y_node1],
            outline=grid, width=SCALE, fill=(248, 250, 252),
        )
        # 左廊格子
        draw.rectangle(
            [rail_left, y0, lanes_left, y_node1],
            outline=grid, width=SCALE, fill=corridor_bg,
        )
        step = f"步骤{i + 1}"
        sw = draw.textlength(step, font=font_small)
        draw.text(
            (step_left + (left_ws - sw) / 2, y0 + node_bs / 2 - L(8)),
            step, fill=(71, 85, 105), font=font_small,
        )

        # 行间通道浅底
        if i < n_rows - 1:
            draw.rectangle(
                [lanes_left, y_node1, content_right, y0 + row_hs],
                fill=(250, 250, 252), outline=None,
            )

        for j in range(n_lanes):
            x0 = lanes_left + j * lane_ws
            draw.rectangle([x0, y0, x0 + lane_ws, y_node1], outline=grid, width=SCALE)

        for j, cell in enumerate(row):
            if not cell:
                continue
            nid = cell["id"]
            text = cell.get("text", "")
            typ = cell.get("type", "process")
            x0 = lanes_left + j * lane_ws
            cx = x0 + lane_ws / 2
            cy = y0 + node_bs / 2
            max_box_w = lane_ws - L(16)
            tw_need = _text_width(draw, text, font_box)
            # 优先单行：按文字加宽；超宽再换行
            prefer_w = tw_need + L(36)
            box_w = min(max_box_w, max(L(120), prefer_w))
            # 判断框：菱形中部可用宽度约 0.50，需把外框做得更大
            if typ == "decision":
                # 尽量单行容纳全文（含问号）
                d_w = min(lane_ws - L(8), max(box_w + L(48), (tw_need + L(20)) / 0.48))
                d_h = max(box_hs + L(12), L(92), d_w * 0.42)
                # 若仍放不下单行，略增高以容纳 2 行
                if tw_need + L(12) > d_w * 0.52:
                    d_h = max(d_h, L(108))
                bx0, by0 = cx - d_w / 2, cy - d_h / 2
                bx1, by1 = cx + d_w / 2, cy + d_h / 2
            else:
                # 两行时略增高
                inner_w = box_w - L(20)
                tlines_probe = _wrap(draw, text, font_box, int(inner_w))
                bh = box_hs if len(tlines_probe) <= 1 else max(box_hs, L(88))
                bx0, by0 = cx - box_w / 2, cy - bh / 2
                bx1, by1 = cx + box_w / 2, cy + bh / 2

            if typ == "decision":
                diamond = [
                    (cx, by0 + L(2)),
                    (bx1 - L(4), cy),
                    (cx, by1 - L(2)),
                    (bx0 + L(4), cy),
                ]
                draw.polygon(diamond, fill=decision_fill, outline=decision_line)
                draw.line(diamond + [diamond[0]], fill=decision_line, width=3 * SCALE)
                max_tw = int(d_w * 0.52)
                tlines = _wrap(draw, text, font_box, max_tw)
                # 能单行则单行
                if len(tlines) > 1 and tw_need <= max_tw:
                    tlines = [text.replace("\\n", "").replace("\n", "")]
                tlines = tlines[:3]
                th = len(tlines) * L(16)
                ty = cy - th / 2
                for li, ln in enumerate(tlines):
                    lw = draw.textlength(ln, font=font_box)
                    draw.text((cx - lw / 2, ty + li * L(16)), ln, fill=text_c, font=font_box)
            elif typ == "end":
                draw.rounded_rectangle(
                    [bx0, by0, bx1, by1], radius=10 * SCALE,
                    fill=end_fill, outline=end_line, width=3 * SCALE,
                )
                tlines = _wrap(draw, text, font_box, int(box_w - L(20)))
                if len(tlines) > 1 and tw_need <= box_w - L(20):
                    tlines = [text.replace("\\n", "").replace("\n", "")]
                th = len(tlines[:3]) * L(16)
                ty = cy - th / 2
                for li, ln in enumerate(tlines[:3]):
                    lw = draw.textlength(ln, font=font_box)
                    draw.text((cx - lw / 2, ty + li * L(16)), ln, fill=text_c, font=font_box)
            elif typ == "note":
                draw.rounded_rectangle(
                    [bx0, by0, bx1, by1], radius=6 * SCALE,
                    fill=note_fill, outline=note_line, width=2 * SCALE,
                )
                tlines = _wrap(draw, text, font_box, int(box_w - L(20)))
                th = len(tlines[:3]) * L(16)
                ty = cy - th / 2
                for li, ln in enumerate(tlines[:3]):
                    lw = draw.textlength(ln, font=font_box)
                    draw.text((cx - lw / 2, ty + li * L(16)), ln, fill=text_c, font=font_box)
            else:
                draw.rounded_rectangle(
                    [bx0, by0, bx1, by1], radius=8 * SCALE,
                    fill=box_fill, outline=box_line, width=3 * SCALE,
                )
                tlines = _wrap(draw, text, font_box, int(box_w - L(20)))
                if len(tlines) > 1 and tw_need <= box_w - L(20):
                    tlines = [text.replace("\\n", "").replace("\n", "")]
                th = len(tlines[:3]) * L(16)
                ty = cy - th / 2
                for li, ln in enumerate(tlines[:3]):
                    lw = draw.textlength(ln, font=font_box)
                    draw.text((cx - lw / 2, ty + li * L(16)), ln, fill=text_c, font=font_box)

            centers[nid] = (cx, by0, by1, bx0, bx1, i, j)

    # 框障碍（略外扩），说明不得压框；走线不得穿框
    box_obstacles = []
    box_map = {}
    for nid, (cx, by0, by1, bx0, bx1, _i, _j) in centers.items():
        m = L(4)
        rect = [bx0 - m, by0 - m, bx1 + m, by1 + m]
        box_obstacles.append(rect)
        box_map[nid] = [bx0, by0, bx1, by1]

    # —— 通道分配 ——
    h_channel_users = defaultdict(list)
    side_users = []

    norm_edges = []
    for idx, e in enumerate(edges):
        if e["frm"] not in centers or e["to"] not in centers:
            continue
        fr, tr = centers[e["frm"]][5], centers[e["to"]][5]
        fl, tl = centers[e["frm"]][6], centers[e["to"]][6]
        style = e.get("style") or "forward"
        norm_edges.append({**e, "fr": fr, "tr": tr, "fl": fl, "tl": tl, "style": style, "idx": idx})

    for e in norm_edges:
        style, fr, tr, fl, tl = e["style"], e["fr"], e["tr"], e["fl"], e["tl"]
        if style in ("back", "branch_no") and tr <= fr:
            side_users.append(e["idx"])
        elif fl != tl and fr != tr:
            gap_row = fr if tr > fr else min(fr, tr)
            if gap_row >= n_rows - 1:
                gap_row = max(0, n_rows - 2)
            h_channel_users[gap_row].append(e["idx"])

    h_slot = {}
    for gap_row, ids in h_channel_users.items():
        for slot, eid in enumerate(ids):
            h_slot[eid] = slot
    side_slot = {eid: i for i, eid in enumerate(side_users)}

    def gap_y(gap_row, slot, n_slots, *, band="mid"):
        """行间通道 y。band: upper|mid|lower 避免多线叠在同一高度。"""
        base = top + header_hs + gap_row * row_hs + node_bs
        if band == "upper":
            lo, hi = 0.18, 0.34
        elif band == "lower":
            lo, hi = 0.66, 0.82
        else:
            lo, hi = 0.42, 0.58
        if n_slots <= 1:
            return base + gap_bs * ((lo + hi) / 2)
        t = slot / max(n_slots - 1, 1)
        return base + gap_bs * (lo + (hi - lo) * t)

    def left_rail_x(slot=0, n=1):
        base = rail_left + L(24)
        span = left_cs - L(48)
        if n <= 1:
            return base + span * 0.50
        return base + span * (0.28 + 0.50 * slot / max(n - 1, 1))

    def right_rail_x(slot=0, n=1):
        base = content_right + L(36)
        span = right_cs - L(56)
        if n <= 1:
            return base + span * 0.45
        return base + span * (0.22 + 0.55 * slot / max(n - 1, 1))

    def lane_gutter_x(after_lane):
        return lanes_left + (after_lane + 1) * lane_ws

    def lane_clear(lane, r_from, r_to):
        lo, hi = min(r_from, r_to), max(r_from, r_to)
        for r in range(lo + 1, hi):
            if rows[r][lane]:
                return False
        return True

    def vertical_trunk_x(to_id, exclude_frm):
        """同列正上方可直落入 to 的节点 cx，供其它边汇入后重合下行。"""
        _cx, _t, _b, _l, _r, tr0, tl0 = centers[to_id]
        best = None  # (row, cx)
        for e2 in norm_edges:
            if e2["to"] != to_id or e2["frm"] == exclude_frm:
                continue
            if e2["style"] in ("back", "branch_no"):
                continue
            cf = centers[e2["frm"]]
            fr2, fl2 = cf[5], cf[6]
            if fl2 == tl0 and fr2 < tr0 and lane_clear(tl0, fr2, tr0):
                if best is None or fr2 > best[0]:
                    best = (fr2, cf[0])
        return best[1] if best else None

    pending_labels = []  # (pts, label, color, lab_bg)
    canvas_box = [pad_s, top, width - pad_s, body_bottom + L(8)]

    def stroke(pts, label="", color=fwd_c, lw=2 * SCALE, lab_bg=(255, 255, 255)):
        _polyline(draw, pts, color, lw)
        if label:
            pending_labels.append((pts, label, color, lab_bg))

    for e in norm_edges:
        frm, to = e["frm"], e["to"]
        style = e["style"]
        label = (e.get("label") or "").strip()
        c1, c2 = centers[frm], centers[to]
        x1, top1, bot1, left1, right1, fr, fl = c1
        x2, top2, bot2, left2, right2, tr, tl = c2
        cy1 = (top1 + bot1) / 2
        cy2 = (top2 + bot2) / 2

        if style == "branch_yes":
            color, lw = ok_c, 3 * SCALE
            lab_bg = (240, 253, 244)
        elif style in ("branch_no", "back"):
            color, lw = no_c, 3 * SCALE
            lab_bg = (254, 242, 242)
        else:
            color, lw = fwd_c, 2 * SCALE
            lab_bg = (255, 255, 255)

        def emit(pts):
            # 穿框则改道：必须先从左右缘出框，禁止从框心竖直穿出
            if _path_pierces_any(pts, box_map):
                sx_l = left_rail_x(0, 2) if min(fl, tl) == 0 else (
                    lane_gutter_x(min(fl, tl) - 1) + L(14) if min(fl, tl) > 0 else left_rail_x(0, 2)
                )
                sx_r = right_rail_x(0, 1)
                if tr < fr:
                    pts = [(left1, cy1), (sx_l, cy1), (sx_l, cy2), (left2, cy2)]
                    if _path_pierces_any(pts, box_map):
                        gy = gap_y(tr, 0, 1, band="lower") if tr < n_rows - 1 else (cy2 + L(20))
                        pts = [(right1, cy1), (sx_r, cy1), (sx_r, gy), (x2, gy), (x2, bot2)]
                elif tr > fr:
                    gy = gap_y(fr, 0, 1, band="upper") if fr < n_rows - 1 else (bot1 + L(24))
                    pts = [(left1, cy1), (sx_l, cy1), (sx_l, gy), (left2 - L(8), gy), (left2, cy2)]
                    if _path_pierces_any(pts, box_map):
                        pts = [(right1, cy1), (sx_r, cy1), (sx_r, gy), (x2, gy), (x2, top2)]
                else:
                    pts = [(left1, cy1), (sx_l, cy1), (sx_l, cy2), (left2, cy2)]
            stroke(pts, label=label, color=color, lw=lw, lab_bg=lab_bg)

        # ——— 1) 回退：出框走左右缘，禁止框心竖直穿出 ———
        if e["idx"] in side_slot or (style == "back"):
            slot = side_slot.get(e["idx"], 0)
            n_side = max(len(side_users), 1)
            # 1a) 源列净空且目标在右侧：源列上走 → 水平左入
            if tl > fl and tr < fr and lane_clear(fl, tr, fr):
                emit([(x1, top1), (x1, cy2), (left2, cy2)])
                continue
            # 1b) 同列回退：左侧竖缝折返左入
            if tl == fl and tr < fr:
                if fl > 0:
                    sx = lane_gutter_x(fl - 1) + L(14)
                else:
                    sx = left_rail_x(1, 2)
                emit([(left1, cy1), (sx, cy1), (sx, cy2), (left2, cy2)])
                continue
            # 1c) 目标在左：左出 → 左廊 → 左入
            if tr < fr and tl < fl:
                sx = left_rail_x(1 if slot else 0, 2)
                emit([(left1, cy1), (sx, cy1), (sx, cy2), (left2, cy2)])
                continue
            # 1d) 目标在右：右出 → 右廊 → 行间 → 底入
            if tr < fr and tl > fl:
                sx = right_rail_x(slot, n_side)
                gy = gap_y(tr, slot, max(n_side, 1), band="lower")
                emit([(right1, cy1), (sx, cy1), (sx, gy), (x2, gy), (x2, bot2)])
                continue
            if tl < fl:
                sx = left_rail_x(1, 2)
                emit([(left1, cy1), (sx, cy1), (sx, cy2), (left2, cy2)])
                continue
            sx = right_rail_x(slot, n_side)
            emit([(right1, cy1), (sx, cy1), (sx, cy2), (right2, cy2)])
            continue

        # ——— 2) 同泳道向下 ———
        if fl == tl and tr > fr:
            if not lane_clear(fl, fr, tr):
                sx = left_rail_x(0, 2) if fl == 0 else lane_gutter_x(fl - 1) + L(14)
                emit([(left1, cy1), (sx, cy1), (sx, cy2), (left2, cy2)])
            else:
                emit([(x1, bot1), (x2, top2)])
            continue

        # ——— 3) 同泳道向上兜底：左侧竖缝，禁止右廊中线横穿 ———
        if fl == tl and tr < fr:
            sx = left_rail_x(0, 2) if fl == 0 else lane_gutter_x(fl - 1) + L(14)
            emit([(left1, cy1), (sx, cy1), (sx, cy2), (left2, cy2)])
            continue

        # ——— 4) 同行跨泳道：水平直连；说明放在两框竖缝上方 ———
        if fr == tr and fl != tl:
            if tl > fl:
                pts = [(right1, cy1), (left2, cy2)]
            else:
                pts = [(left1, cy1), (right2, cy2)]
            _polyline(draw, pts, color, lw)
            if label:
                pending_labels.append((pts, label, color, lab_bg))
            continue

        # ——— 4b) 汇入同列上方竖干（优先于右邻列折线，避免斜穿/分叉入框）———
        if tr > fr and fl != tl:
            trunk_x = vertical_trunk_x(to, frm)
            if trunk_x is not None and abs(trunk_x - x1) > L(16):
                gy = gap_y(fr, 0, 1, band="mid")
                emit([(x1, bot1), (x1, gy), (trunk_x, gy), (trunk_x, top2)])
                continue

        # ——— 4c) 下一行、右邻列 ———
        if tr == fr + 1 and tl == fl + 1:
            emit([(right1, cy1), (x2, cy1), (x2, top2)])
            continue

        # ——— 5) 跨行跨泳道 ———
        if tr < fr or (tr > fr and not lane_clear(tl, fr, tr)):
            sx = right_rail_x(0, 1)
            emit([(right1, cy1), (sx, cy1), (sx, cy2), (right2, cy2)])
            continue

        gap_row = fr if fr < n_rows - 1 else max(0, n_rows - 2)
        users = h_channel_users.get(gap_row, [e["idx"]])
        slot = h_slot.get(e["idx"], 0)
        gy = gap_y(gap_row, slot, max(len(users), 1), band="upper")
        inset = L(4)

        if tl > fl:
            side_pt, end = left2 - inset, (left2, cy2)
        else:
            side_pt, end = right2 + inset, (right2, cy2)

        if style == "branch_yes" and tl != fl:
            # 下一行跨列：在判断框行高横移后再下入，避免与同行否枝在行间交叉
            if tr == fr + 1:
                start = (right1, cy1) if tl > fl else (left1, cy1)
                emit([start, (x2, cy1), (x2, top2)])
            else:
                gy_yes = gap_y(fr if fr < n_rows - 1 else max(0, n_rows - 2), 0, 1, band="lower")
                emit([(x1, bot1), (x1, gy_yes), (side_pt, gy_yes), (side_pt, cy2), end])
            continue

        if tl < fl and tr > fr:
            emit([(x1, bot1), (x1, cy2), (right2, cy2)])
            continue

        emit([(x1, bot1), (x1, gy), (side_pt, gy), (side_pt, cy2), end])

    # 统一避让放置说明（不压框、不互相压）
    placed_labels = []
    for pts, lab, col, bg in pending_labels:
        _place_label_clear(
            draw, pts, lab, font_label, bg, col,
            box_obstacles, placed_labels, canvas_box,
        )

    # 图例
    ly = height - L(28)
    x = pad_s
    for name, fill, outline in [
        ("处理", box_fill, box_line),
        ("判断", decision_fill, decision_line),
        ("成功/是", (240, 253, 244), ok_c),
        ("失败/回退", (254, 242, 242), no_c),
    ]:
        draw.rounded_rectangle(
            [x, ly - L(10), x + L(18), ly + L(8)],
            radius=3 * SCALE, fill=fill, outline=outline, width=2 * SCALE,
        )
        draw.text((x + L(24), ly - L(8)), name, fill=text_c, font=font_small)
        x += L(130)

    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, format="PNG", optimize=True)
    return out


ROLE_LANES = ["教务负责人", "学院负责人", "老师"]


def generate_all(asset_dir: Path):
    asset_dir.mkdir(parents=True, exist_ok=True)
    outs = []

    def add(filename, title, lanes, rows, edges, kind):
        outs.append(draw_swimlane(
            title=title, lanes=lanes, rows=rows, edges=edges,
            out=asset_dir / filename, kind=kind,
        ))

    # —— 开课时间设置（否走左廊绕行，回退走右廊，不交叉）——
    add("开课时间设置-业务流程图.png", "开课时间设置 · 业务流程图", ROLE_LANES, [
        [{"id": "a1", "text": "维护开课学期与时间窗口", "type": "process"}, None, None],
        [{"id": "a2", "text": "是否保存生效？", "type": "decision"}, None, None],
        [{"id": "a3", "text": "供开课计划等读取", "type": "end"}, None, None],
        [{"id": "a4", "text": "继续编辑", "type": "process"}, None, None],
    ], [
        {"frm": "a1", "to": "a2", "label": "", "style": "forward"},
        {"frm": "a2", "to": "a3", "label": "是·保存", "style": "branch_yes"},
        {"frm": "a2", "to": "a4", "label": "否", "style": "forward"},
        {"frm": "a4", "to": "a1", "label": "返回修改", "style": "back"},
    ], "business")

    add("开课时间设置-系统流程图.png", "开课时间设置 · 系统流程图",
        ["开课时间设置", "开课计划", "开课安排"], [
        [{"id": "b1", "text": "配置学期/窗口", "type": "process"}, None, None],
        [{"id": "b2", "text": "保存配置", "type": "process"}, None, None],
        [None, {"id": "b3", "text": "读取默认学期", "type": "process"}, {"id": "b4", "text": "读取窗口约束（若有）", "type": "process"}],
    ], [
        {"frm": "b1", "to": "b2", "label": "", "style": "forward"},
        {"frm": "b2", "to": "b3", "label": "计划引用", "style": "forward"},
        {"frm": "b3", "to": "b4", "label": "安排引用", "style": "forward"},
    ], "system")

    # —— 校选课程管理（是/否同行）——
    add("校选课程管理-业务流程图.png", "校选课程管理 · 业务流程图", ROLE_LANES, [
        [{"id": "c1", "text": "维护校选课程清单", "type": "process"}, None, None],
        [{"id": "c2", "text": "是否纳入本学期？", "type": "decision"}, None, None],
        [
            {"id": "c3", "text": "进入开课计划/安排链路", "type": "end"},
            {"id": "c4", "text": "仅保留清单不纳入", "type": "process"},
            None,
        ],
    ], [
        {"frm": "c1", "to": "c2", "label": "", "style": "forward"},
        {"frm": "c2", "to": "c3", "label": "是", "style": "branch_yes"},
        {"frm": "c2", "to": "c4", "label": "否", "style": "forward"},
    ], "business")

    add("校选课程管理-系统流程图.png", "校选课程管理 · 系统流程图",
        ["校选课程管理", "开课计划", "开课安排"], [
        [{"id": "d1", "text": "校选课程主数据", "type": "process"}, None, None],
        [None, {"id": "d2", "text": "生成/关联开课任务", "type": "process"}, None],
        [None, None, {"id": "d3", "text": "接收并安排", "type": "process"}],
    ], [
        {"frm": "d1", "to": "d2", "label": "纳入学期", "style": "forward"},
        {"frm": "d2", "to": "d3", "label": "计划生效后", "style": "forward"},
    ], "system")

    # —— 特殊课程设置（是/否同行）——
    add("特殊课程设置-业务流程图.png", "特殊课程设置 · 业务流程图", ROLE_LANES, [
        [{"id": "s1", "text": "维护特殊课程规则/默认", "type": "process"}, None, None],
        [{"id": "s2", "text": "是否被计划引用？", "type": "decision"}, None, None],
        [
            {"id": "s3", "text": "计划带入默认值", "type": "end"},
            {"id": "s4", "text": "仅配置不引用", "type": "process"},
            None,
        ],
    ], [
        {"frm": "s1", "to": "s2", "label": "", "style": "forward"},
        {"frm": "s2", "to": "s3", "label": "是", "style": "branch_yes"},
        {"frm": "s2", "to": "s4", "label": "否", "style": "forward"},
    ], "business")

    add("特殊课程设置-系统流程图.png", "特殊课程设置 · 系统流程图",
        ["特殊课程设置", "开课计划", "开课安排"], [
        [{"id": "t1", "text": "教室/Support 等默认", "type": "process"}, None, None],
        [None, {"id": "t2", "text": "生成任务时读取默认", "type": "process"}, None],
        [None, None, {"id": "t3", "text": "安排侧可覆盖", "type": "process"}],
    ], [
        {"frm": "t1", "to": "t2", "label": "读默认", "style": "forward"},
        {"frm": "t2", "to": "t3", "label": "计划生效后", "style": "forward"},
    ], "system")

    # —— 开课计划（失败同行右列；回退右廊顶入，不交叉）——
    add("开课计划-业务流程图.png", "开课计划 · 业务流程图", ROLE_LANES, [
        [{"id": "p1", "text": "从执行计划生成开课任务", "type": "process"}, None, None],
        [
            {"id": "p2", "text": "编辑教学任务 / 合班", "type": "process"},
            {"id": "p3", "text": "按权限参与维护\n（待确认）", "type": "process"},
            None,
        ],
        [{"id": "p4", "text": "计划生效校验\n是否通过？", "type": "decision"}, None, None],
        [
            {"id": "p5", "text": "计划生效 → 进入开课安排", "type": "end"},
            {"id": "p6", "text": "校验失败：回编辑修改", "type": "process"},
            None,
        ],
    ], [
        {"frm": "p1", "to": "p2", "label": "", "style": "forward"},
        {"frm": "p2", "to": "p3", "label": "协同", "style": "forward"},
        {"frm": "p2", "to": "p4", "label": "提交生效", "style": "forward"},
        {"frm": "p4", "to": "p5", "label": "是·成功", "style": "branch_yes"},
        {"frm": "p4", "to": "p6", "label": "否·失败", "style": "forward"},
        {"frm": "p6", "to": "p2", "label": "修改后重试", "style": "back"},
    ], "business")

    add("开课计划-系统流程图.png", "开课计划 · 系统流程图",
        ["开课时间设置", "特殊课程设置", "开课计划", "开课安排"], [
        # 默认学期对准「生成、编辑、合班」正上方，竖线直连；教室默认从左侧汇入
        [None, {"id": "q2", "text": "提供教室/Support默认", "type": "process"}, {"id": "q1", "text": "提供默认学期/窗口", "type": "process"}, None],
        [None, None, {"id": "q3", "text": "生成、编辑、合班", "type": "process"}, None],
        [None, None, {"id": "q4", "text": "计划生效是否通过？", "type": "decision"}, None],
        [None, None, None, {"id": "q5", "text": "接收计划已生效任务", "type": "process"}],
        [None, None, {"id": "q6", "text": "停留草稿并回编辑", "type": "process"}, None],
    ], [
        {"frm": "q1", "to": "q3", "label": "读学期", "style": "forward"},
        {"frm": "q2", "to": "q3", "label": "读默认", "style": "forward"},
        {"frm": "q3", "to": "q4", "label": "生效", "style": "forward"},
        {"frm": "q4", "to": "q5", "label": "是·成功", "style": "branch_yes"},
        {"frm": "q4", "to": "q6", "label": "否·失败", "style": "forward"},
        {"frm": "q6", "to": "q3", "label": "改后重试", "style": "back"},
    ], "system")

    # —— 开课安排（业务：主链路顺序推进；失败回退走左廊；无长距跨步线）——
    add("开课安排-业务流程图.png", "开课安排 · 业务流程图", ROLE_LANES, [
        [
            {"id": "e1", "text": "开课前期设置/合班/Support", "type": "process"},
            {"id": "e2", "text": "参与分组与教师安排", "type": "process"},
            None,
        ],
        [
            None,
            {"id": "e3", "text": "安排教师、维护分组学时", "type": "process"},
            {"id": "e4", "text": "授课确认（教师端/代确认）", "type": "process"},
        ],
        [{"id": "e5", "text": "教务发起生效：校验是否齐套？", "type": "decision"}, None, None],
        [{"id": "e6", "text": "任务生效 → 可进开课名单", "type": "end"}, None, None],
    ], [
        {"frm": "e1", "to": "e2", "label": "分工", "style": "forward"},
        {"frm": "e2", "to": "e3", "label": "", "style": "forward"},
        {"frm": "e3", "to": "e4", "label": "教师确认", "style": "forward"},
        {"frm": "e4", "to": "e5", "label": "确认结果", "style": "forward"},
        {"frm": "e5", "to": "e6", "label": "是·齐套成功", "style": "branch_yes"},
        {"frm": "e5", "to": "e3", "label": "否·回补安排", "style": "back"},
    ], "business")

    # 系统图：失败节点放在「分组工作台」列正下方，回退同列上行，避免横穿
    add("开课安排-系统流程图.png", "开课安排 · 系统流程图",
        ["开课计划", "开课安排", "分组工作台", "授课确认", "开课名单"], [
        [{"id": "f1", "text": "计划已生效任务流入", "type": "process"}, None, None, None, None],
        [
            None,
            {"id": "f2", "text": "三步安排；发起生效", "type": "process"},
            {"id": "f3", "text": "分组·学时·安排教师", "type": "process"},
            {"id": "f4", "text": "确认进度管理", "type": "process"},
            None,
        ],
        [None, {"id": "f5", "text": "生效门槛是否通过？", "type": "decision"}, None, None, None],
        [None, None, {"id": "f7", "text": "拦截生效：停留草稿", "type": "process"}, None, {"id": "f6", "text": "任务已生效后可见可维护", "type": "process"}],
    ], [
        {"frm": "f1", "to": "f2", "label": "进入安排", "style": "forward"},
        {"frm": "f2", "to": "f3", "label": "打开工作台", "style": "forward"},
        {"frm": "f3", "to": "f4", "label": "教师确认", "style": "forward"},
        {"frm": "f4", "to": "f5", "label": "确认状态", "style": "forward"},
        {"frm": "f2", "to": "f5", "label": "点击生效", "style": "forward"},
        {"frm": "f5", "to": "f6", "label": "是·通过生效", "style": "branch_yes"},
        {"frm": "f5", "to": "f7", "label": "否·生效失败", "style": "forward"},
        {"frm": "f7", "to": "f3", "label": "回工作台补齐", "style": "back"},
    ], "system")

    # —— 开课名单 ——
    add("开课名单-业务流程图.png", "开课名单 · 业务流程图", ROLE_LANES, [
        [{"id": "g1", "text": "任务已生效后进入名单", "type": "process"}, None, None],
        [
            {"id": "g2", "text": "一键分配/预置/手工调整", "type": "process"},
            {"id": "g3", "text": "维护本学院小组名单", "type": "process"},
            None,
        ],
        [{"id": "g4", "text": "是否退回安排？", "type": "decision"}, None, None],
        [{"id": "g5", "text": "名单供排课等下游消费", "type": "end"}, None, None],
        [{"id": "g6", "text": "退回安排（名单可保留）", "type": "process"}, None, None],
    ], [
        {"frm": "g1", "to": "g2", "label": "", "style": "forward"},
        {"frm": "g2", "to": "g3", "label": "分工", "style": "forward"},
        {"frm": "g2", "to": "g4", "label": "", "style": "forward"},
        {"frm": "g4", "to": "g5", "label": "否·继续使用", "style": "branch_yes"},
        {"frm": "g4", "to": "g6", "label": "是·退回", "style": "forward"},
        {"frm": "g6", "to": "g1", "label": "再生效后重入", "style": "back"},
    ], "business")

    add("开课名单-系统流程图.png", "开课名单 · 系统流程图",
        ["开课安排", "开课名单", "分组工作台·学生", "选课应用"], [
        [{"id": "h1", "text": "任务是否已生效？", "type": "decision"}, None, None, None],
        [None, {"id": "h2", "text": "任务列表（无独立提交）", "type": "process"}, None, None],
        [
            None, None,
            {"id": "h3", "text": "维护小组学生并保存", "type": "process"},
            {"id": "h4", "text": "开放选课默认名单", "type": "process"},
        ],
        [{"id": "h5", "text": "未生效：不可见该任务", "type": "end"}, None, None, None],
        [None, {"id": "h6", "text": "退回安排", "type": "process"}, None, None],
        [{"id": "h7", "text": "任务回草稿；名单可保留", "type": "process"}, None, None, None],
    ], [
        {"frm": "h1", "to": "h2", "label": "是", "style": "branch_yes"},
        {"frm": "h1", "to": "h5", "label": "否", "style": "forward"},
        {"frm": "h2", "to": "h3", "label": "管理名单", "style": "forward"},
        {"frm": "h4", "to": "h3", "label": "默认写入", "style": "forward"},
        {"frm": "h2", "to": "h6", "label": "退回", "style": "forward"},
        {"frm": "h6", "to": "h7", "label": "", "style": "forward"},
        {"frm": "h7", "to": "h1", "label": "再生效后重入", "style": "back"},
    ], "system")

    return outs


if __name__ == "__main__":
    out_dir = ROOT / "参考文档" / "2、开课管理" / "_设计图资产" / "详细设计泳道图20260807"
    for p in generate_all(out_dir):
        print(p.relative_to(ROOT))
