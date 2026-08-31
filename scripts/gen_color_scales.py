#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 Tmoi 美术馆配色系统候选方案的色阶数据 + WCAG 对比度。"""
import json, math

def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgb2hex(rgb):
    return "#" + "".join(f"{max(0,min(255,round(c))):02X}" for c in rgb)

def rgb2hsl(rgb):
    r, g, b = (c / 255 for c in rgb)
    mx, mn = max(r, g, b), min(r, g, b)
    l = (mx + mn) / 2
    if mx == mn:
        return (0, 0, l)
    d = mx - mn
    s = d / (2 - mx - mn) if l > 0.5 else d / (mx + mn)
    if mx == r: h = (g - b) / d + (6 if g < b else 0)
    elif mx == g: h = (b - r) / d + 2
    else: h = (r - g) / d + 4
    return (h / 6, s, l)

def hsl2rgb(h, s, l):
    def f(n):
        k = (n + h * 12) % 12
        a = s * min(l, 1 - l)
        return l - a * max(-1, min(k - 3, 9 - k, 1))
    return tuple(round(c * 255) for c in (f(0), f(8), f(4)))

def scale(base, l_curve=None, s_factor=None, h_shift=0.0):
    """以基准色生成 50-900 单调色阶。
    以基准色实际明度 l0 为中心：50-400 逐档提亮，600-900 逐档压暗（强制 < l0），保证严格单调。
    """
    h0, s0, l0 = rgb2hsl(hex2rgb(base))
    if l_curve is None:
        l_curve = {50: .965, 100: .93, 200: .88, 300: .80, 400: .68,
                   500: l0, 600: .30, 700: .24, 800: .18, 900: .12}
    # 强制单调：600-900 必须逐档低于 l0
    floors = {600: l0 - .05, 700: l0 - .12, 800: l0 - .19, 900: l0 - .26}
    l_curve = {k: (min(v, floors.get(k, v)) if k in floors else v) for k, v in l_curve.items()}
    out = {}
    for step, L in l_curve.items():
        s = min(1.0, s0 * s_factor.get(step, 1.0)) if s_factor else s0
        out[step] = rgb2hex(hsl2rgb((h0 + h_shift) % 1.0, s, L))
    out["500"] = base.upper()
    return out

# 4 个主色候选（基准 = 500 档）
ACCENTS = {
    "terracotta": {"label": "陶土红 Terracotta", "hex": "#B3402A",
        "desc": "现状主色。美术馆砖墙、展厅导览，暖而克制，适合影像/装置类作品。"},
    "moss": {"label": "苔藓绿 Moss", "hex": "#4A6B4A",
        "desc": "档案、自然、沉静。适合呼吸/档案系列，书卷气。"},
    "ultramarine": {"label": "群青蓝 Ultramarine", "hex": "#35598F",
        "desc": "现代、理性、明确。适合生成艺术/网页互动，科技感。"},
    "ochre": {"label": "赭石金 Ochre", "hex": "#A97C2F",
        "desc": "纸墨、暖调、在地。像旧印刷物上的印记，温暖耐看。"},
}

# L 曲线（Tailwind 风格 10 档）+ 饱和度微调
L_CURVE = {50: .965, 100: .925, 200: .87, 300: .78, 400: .66, 500: .52,
           600: .42, 700: .33, 800: .24, 900: .155}
S_FACTOR = {50: .38, 100: .55, 200: .72, 300: .88, 400: 1.0, 500: 1.0,
            600: .92, 700: .84, 800: .76, 900: .68}

# 暖灰 neutral（跟暖白底协调）
NEUTRAL = {
    50: "#FAF8F4", 100: "#F2EEE6", 200: "#E5DED2", 300: "#D3CBBC",
    400: "#B3A995", 500: "#93896F", 600: "#756B56", 700: "#58503F",
    800: "#3B362C", 900: "#24211B",
}

# 状态色（base + soft，与暖调协调）
STATE = {
    "success": {"base": "#2F6B4A", "soft": "#E2EFE7"},
    "warning": {"base": "#A97C2F", "soft": "#F7EEDC"},
    "error":   {"base": "#B0382E", "soft": "#F8E4E0"},
    "info":    {"base": "#35618F", "soft": "#E2ECF4"},
}

def lum(rgb):
    def c(v):
        v /= 255
        return v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4
    return .2126 * c(rgb[0]) + .7152 * c(rgb[1]) + .0722 * c(rgb[2])

def contrast(a, b):
    la, lb = lum(hex2rgb(a)), lum(hex2rgb(b))
    hi, lo = max(la, lb), min(la, lb)
    return (hi + .05) / (lo + .05)

# 主题核心语义色
THEMES = {
    "light": {
        "background": NEUTRAL[50], "surface": NEUTRAL[100], "surface-raised": "#FFFFFF",
        "text": NEUTRAL[900], "text-secondary": NEUTRAL[600], "text-disabled": NEUTRAL[400],
        "border": NEUTRAL[200], "border-strong": NEUTRAL[300],
        "on-accent": "#FFFFFF", "focus-ring": None,  # focus 用主色 400
    },
    "dark": {
        "background": "#14110D", "surface": "#1E1A14", "surface-raised": "#262119",
        "text": NEUTRAL[50], "text-secondary": "#B3A995", "text-disabled": "#6E6758",
        "border": "#3B362C", "border-strong": "#58503F",
        "on-accent": "#FFFFFF", "focus-ring": None,
    },
}

# 对比度表（正文/标题/次要 对背景与面）
contrast_report = {}
pairs = {
    "light": [("text/background", THEMES["light"]["text"], THEMES["light"]["background"]),
              ("text/surface", THEMES["light"]["text"], THEMES["light"]["surface"]),
              ("text-secondary/background", THEMES["light"]["text-secondary"], THEMES["light"]["background"]),
              ("accent-500/background", ACCENTS["terracotta"]["hex"], THEMES["light"]["background"]),
              ("accent-600/background", None, THEMES["light"]["background"]),
              ("text-on-accent-500", THEMES["light"]["on-accent"], ACCENTS["terracotta"]["hex"])],
    "dark": [("text/background", THEMES["dark"]["text"], THEMES["dark"]["background"]),
             ("text/surface", THEMES["dark"]["text"], THEMES["dark"]["surface"]),
             ("text-secondary/background", THEMES["dark"]["text-secondary"], THEMES["dark"]["background"]),
             ("accent-400/background", None, THEMES["dark"]["background"]),
             ("text-on-accent-500", THEMES["dark"]["on-accent"], ACCENTS["terracotta"]["hex"])],
}
# 补全 accent 深/浅档（terracotta 600 与 400）
acc = scale(ACCENTS["terracotta"]["hex"], L_CURVE, S_FACTOR)
pairs["light"][4] = ("accent-600/background", acc[600], THEMES["light"]["background"])
pairs["dark"][3] = ("accent-400/background", acc[400], THEMES["dark"]["background"])

for theme, ps in pairs.items():
    for name, a, b in ps:
        if a is None or b is None: continue
        contrast_report.setdefault(theme, {})[name] = round(contrast(a, b), 2)

data = {
    "accents": {k: {"label": v["label"], "hex": v["hex"], "desc": v["desc"],
                    "steps": scale(v["hex"], L_CURVE, S_FACTOR)} for k, v in ACCENTS.items()},
    "neutral": NEUTRAL,
    "state": STATE,
    "themes": THEMES,
    "contrast": contrast_report,
    "current": {"background": "#F6F3EC", "text": "#1B1813", "accent": "#B3402A"},
}

with open("/tmp/tmoi_tokens.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=1)
print("OK")
print("terracotta steps:", data["accents"]["terracotta"]["steps"][50], "→", data["accents"]["terracotta"]["steps"][900])
print("contrast light:", contrast_report["light"])
print("contrast dark:", contrast_report["dark"])
