#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成站点 favicon：
  - app/icon.svg       浏览器标签页图标（矢量，任意尺寸清晰）
  - app/apple-icon.png iOS 主屏幕 / 书签图标（180x180，4x 超采样抗锯齿）

造型：苔藓绿圆角方块 + 内侧细描边 + 居中白色无衬线 "M"（Museum）。
SVG 用 stroke 画 M；PNG 用同一组几何参数计算 miter 尖角轮廓多边形，保证两者一致。

用法：scripts/gen_favicon.py
"""
import math
import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_DIR = os.path.join(ROOT, "app")

# ---------- 设计参数（512 坐标系）----------
MOSS = "#4A6B4A"          # accent-400 主色
MOSS_EDGE = "#334533"     # moss-700 内侧描边
EDGE_OPACITY = 0.35
WHITE = "#FFFFFF"

OUTER_RX = 118.0          # 外框圆角
EDGE_INSET = 18.0         # 内侧描边内缩
EDGE_W = 14.0
EDGE_RX = OUTER_RX - EDGE_INSET

# M 的中心线折点（自底左起：上→中谷→上→右下），stroke 半宽 24（线宽 48）
M_HALF = 24.0
M_PTS = [
    (96.0, 355.0),   # A 左下
    (96.0, 143.0),   # B 左上
    (256.0, 289.0),  # C 中谷
    (416.0, 143.0),  # D 右上
    (416.0, 355.0),  # E 右下
]

SS = 4                    # PNG 超采样倍数
PNG_SIZE = 180


def build_svg() -> str:
    d = "M " + " L ".join(f"{x:g} {y:g}" for x, y in M_PTS)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Tmoi 线上美术馆 favicon：苔藓绿圆角方形 + 白色 M（Museum），内侧细描边保证小尺寸边界感 -->
  <rect width="512" height="512" rx="{OUTER_RX:g}" fill="{MOSS}"/>
  <rect x="{EDGE_INSET:g}" y="{EDGE_INSET:g}" width="{512 - 2 * EDGE_INSET:g}" height="{512 - 2 * EDGE_INSET:g}" rx="{EDGE_RX:g}"
        fill="none" stroke="{MOSS_EDGE}" stroke-opacity="{EDGE_OPACITY}" stroke-width="{EDGE_W:g}"/>
  <path d="{d}" fill="none" stroke="{WHITE}" stroke-width="{2 * M_HALF:g}"
        stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10"/>
</svg>
"""


def _unit(ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    L = math.hypot(dx, dy)
    return (dx / L, dy / L)


def _intersect(p1, d1, p2, d2):
    """求两条无限直线 p1 + t*d1 与 p2 + s*d2 的交点。"""
    det = d1[0] * -d2[1] - d1[1] * -d2[0]
    if abs(det) < 1e-9:
        return p1
    rx, ry = p2[0] - p1[0], p2[1] - p1[1]
    t = (rx * -d2[1] - ry * -d2[0]) / det
    return (p1[0] + t * d1[0], p1[1] + t * d1[1])


def _offset_side(pts, dirs, h, side):
    """折线单侧偏移：中间顶点取 miter 交点，两端为 butt 平切。"""
    out = []
    d = dirs[0]
    n = (-d[1] * side, d[0] * side)
    out.append((pts[0][0] + n[0] * h, pts[0][1] + n[1] * h))
    for i in range(len(dirs) - 1):
        d1, d2 = dirs[i], dirs[i + 1]
        n1 = (-d1[1] * side, d1[0] * side)
        n2 = (-d2[1] * side, d2[0] * side)
        p1 = (pts[i][0] + n1[0] * h, pts[i][1] + n1[1] * h)
        p2 = (pts[i + 1][0] + n2[0] * h, pts[i + 1][1] + n2[1] * h)
        out.append(_intersect(p1, d1, p2, d2))
    d = dirs[-1]
    n = (-d[1] * side, d[0] * side)
    out.append((pts[-1][0] + n[0] * h, pts[-1][1] + n[1] * h))
    return out


def offset_outline(pts, h):
    """把折线 pts 描边（半宽 h）转成 miter 尖角的填充多边形。"""
    dirs = [_unit(*pts[i], *pts[i + 1]) for i in range(len(pts) - 1)]
    a = _offset_side(pts, dirs, h, +1)
    b = _offset_side(pts, dirs, h, -1)
    return a + b[::-1]


def build_png(path, size=PNG_SIZE):
    S = size * SS
    k = S / 512.0

    def sc(v):
        return v * k

    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    dr = ImageDraw.Draw(img)

    # 模拟 SVG：不透明 moss 方块 → 半透明描边圆角矩形 → 内缩不透明 moss 方块，
    # 这样描边下方始终是不透明主色，避免在透明背景上发灰。
    dr.rounded_rectangle(
        [0, 0, S - 1, S - 1], radius=sc(OUTER_RX), fill=MOSS
    )
    dr.rounded_rectangle(
        [0, 0, S - 1, S - 1], radius=sc(OUTER_RX), fill=MOSS_EDGE + "59"
    )
    dr.rounded_rectangle(
        [sc(EDGE_INSET + EDGE_W / 2), sc(EDGE_INSET + EDGE_W / 2),
         S - 1 - sc(EDGE_INSET + EDGE_W / 2), S - 1 - sc(EDGE_INSET + EDGE_W / 2)],
        radius=sc(EDGE_RX - EDGE_W / 2), fill=MOSS,
    )

    # 白色 M
    poly = [(sc(x), sc(y)) for x, y in offset_outline(M_PTS, M_HALF)]
    dr.polygon(poly, fill=WHITE)

    img.resize((size, size), Image.LANCZOS).save(path, "PNG")
    return path


def main():
    svg_path = os.path.join(APP_DIR, "icon.svg")
    png_path = os.path.join(APP_DIR, "apple-icon.png")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(build_svg())
    build_png(png_path)
    print("wrote", svg_path)
    print("wrote", png_path, os.path.getsize(png_path), "bytes")


if __name__ == "__main__":
    main()
