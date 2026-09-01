#!/usr/bin/env python3
"""扫描 Tmoi 站点所有可见文案，生成一份带编号的清单 HTML。"""

import html
import json
import re
from pathlib import Path

ROOT = Path("/Users/tmoi/WorkBuddy/Tmoi 个人网站")
OUT = ROOT / "文案清单.html"

MOSS = "#4A6B4A"
PAPER = "#1b1813"
INK = "#f6f3ec"


def esc(s):
    if s is None:
        return ""
    return html.escape(str(s), quote=False)


def br(s):
    """把换行渲染成可见标记。"""
    return esc(s).replace("\n", '<span class="nl">⏎</span>')


def cnt(s):
    if s is None:
        return "—"
    if isinstance(s, list):
        return f"{len(s)} 段 / {sum(len(x) for x in s)} 字"
    return f"{len(str(s))} 字"


# ---------------------------------------------------------------- 解析源文件

def parse_i18n():
    src = (ROOT / "lib/i18n.ts").read_text(encoding="utf-8")
    pat = re.compile(
        r'"([a-zA-Z0-9_.]+)":\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)"\s*,\s*zh:\s*"((?:[^"\\]|\\.)*)"\s*,?\s*\},?',
        re.S,
    )
    out = []
    for key, en, zh in pat.findall(src):
        dec = lambda s: s.replace("\\n", "\n").replace("\\'", "'")
        out.append((key, dec(en), dec(zh)))
    return out


def parse_series():
    src = (ROOT / "lib/types.ts").read_text(encoding="utf-8")
    pat = re.compile(
        r'\{\s*id:\s*"(\w+)",\s*name:\s*"([^"]*)",\s*nameEn:\s*"([^"]*)",\s*blurb:\s*"([^"]*)",\s*blurbEn:\s*"([^"]*)"\s*\}'
    )
    return pat.findall(src)


def parse_labels():
    src = (ROOT / "lib/types.ts").read_text(encoding="utf-8")
    out = []

    def block(name):
        m = re.search(name + r":\s*Record<[^>]*>\s*=\s*\{(.*?)\};", src, re.S)
        if not m:
            return {}
        return dict(re.findall(r'(\w+):\s*"([^"]*)"', m.group(1)))

    zh_medium, zh_form = block("MEDIUM_LABELS"), block("FORM_LABELS")

    i18n = (ROOT / "lib/i18n.ts").read_text(encoding="utf-8")

    def en_block(name):
        m = re.search(name + r":\s*Record<string,\s*string>\s*=\s*\{(.*?)\};", i18n, re.S)
        if not m:
            return {}
        return dict(re.findall(r'(\w+):\s*"([^"]*)"', m.group(1)))

    en_medium, en_form = en_block("MEDIUM_LABELS_EN"), en_block("FORM_LABELS_EN")

    zh_name = {"image": "图像", "video": "影像", "interactive": "互动", "sound": "声音"}
    for k in ["image", "video", "interactive", "sound"]:
        out.append((f"medium.{k}", "媒介筛选 chip", zh_medium.get(k, zh_name.get(k, "")), en_medium.get(k, "")))
    for k in ["individual", "collaboration"]:
        out.append((f"form.{k}", "形态筛选 chip", zh_form.get(k, ""), en_form.get(k, "")))
    return out


_wj = json.loads((ROOT / "data/works.json").read_text(encoding="utf-8"))
works = _wj["works"] if isinstance(_wj, dict) else _wj

# ---------------------------------------------------------------- E 组：页面硬编码

E = [
    ("app/about/page.tsx", "7-8", "About 页 <title> 与 SEO 描述", "关于",
     "Tmoi · 个人陈述、教育、合作与展览。", "浏览器标签页标题 / 搜索结果摘要", ""),
    ("app/about/page.tsx", "43-44", "个人陈述 · 第 1 段（关于页正文开头）",
     "感官与情绪是我核心的创作命题。人依靠五官感受身边环境、与人相处，从中生出各种感受。我的互动装置就像放大镜，把日常容易被忽略的细微感受放大，让观众走进来，切身体会那些共通的情绪。",
     "Sensation and emotion are the core of my practice. We perceive the world and relate to others through our senses, and from that arise all kinds of feeling. My interactive installations act like a magnifying glass — amplifying the subtle, easily overlooked sensations of everyday life, and inviting the audience in to feel those shared emotions in their own bodies.",
     "关于页正文第一段，两列布局左栏", ""),
    ("app/about/page.tsx", "47-48", "个人陈述 · 第 2 段",
     "我习惯长时间观察、内化生活经验，再转化为创作。《经纬之线》从数字概念迭代至今，在导师指点下挖掘出控制论与早期计算机美学的内涵，也突破了过往单纯停留在材质与形式实验上的框架。",
     "I am used to observing and internalising life for a long time before transforming it into work. 《经纬之线》(Warp & Weft) has iterated from a digital concept into what it is now; with my mentor's guidance I uncovered its cybernetic and early-computer-aesthetics undertones, pushing past an earlier frame that stayed at material and formal experiment alone.",
     "关于页正文第二段", "提到作品《经纬之线》，改名时此处需同步"),
    ("app/about/page.tsx", "51-52", "个人陈述 · 第 3 段",
     "两年创意媒体的专业训练，让我具备完整动手实作的能力，可独立实现装置的构思；但创作视野与系统化研究仍有局限。我希望借由更多尝试，让作品与观众产生更多交互，慢慢成为能独立创作的专业新媒体艺术家。",
     "Two years of training in creative media gave me the hands-on ability to realise an installation's conception independently. Yet my creative horizon and systematic research still have limits. Through more attempts, I hope to let the work meet the audience in deeper interaction, and slowly grow into a new-media artist who creates independently.",
     "关于页正文第三段", ""),
    ("app/about/page.tsx", "70-71", "教育 · 学校名称",
     "香港城市大学 · 创意媒体学院",
     "City University of Hong Kong · School of Creative Media",
     "关于页「教育」列表第 1 行", ""),
    ("app/about/page.tsx", "74", "教育 · 学校简称（右侧小字）", "CityU HK", "CityU HK",
     "关于页「教育」第 1 行右端，中英同文", "硬编码，中英页面都显示"),
    ("app/about/page.tsx", "78", "教育 · 学位名称", "创意媒体硕士（MFA）", "MFA in Creative Media",
     "关于页「教育」列表第 2 行", ""),
    ("app/about/page.tsx", "80", "教育 · 学位年份", "2024 · CityU HK", "2024 · CityU HK",
     "关于页「教育」第 2 行右端", "硬编码"),
    ("app/about/page.tsx", "119", "展览 · 占位条目年份（第 1 条）", "2024", "2024",
     "关于页「展览」第 1 行右端", "占位年份，随展览内容一起替换"),
    ("app/about/page.tsx", "125", "展览 · 占位条目年份（第 2 条）", "2025", "2025",
     "关于页「展览」第 2 行右端", "占位年份"),
    ("app/about/page.tsx", "177", "联系 · 邮箱（占位）", "[ your@email.com ]", "[ your@email.com ]",
     "关于页「联系」区邮箱，斜体占位样式", "硬编码占位，建议改为真实邮箱"),
    ("app/about/page.tsx", "184", "联系 · 所在地（占位）", "[ 待补充 ]", "[ to be added ]",
     "关于页「联系」区所在地", "占位"),
    ("app/about/page.tsx", "192", "联系 · 社交（占位）", "[ Instagram / 个人主页等 ]", "[ Instagram / personal site, etc. ]",
     "关于页「联系」区社交", "占位"),
    ("app/contact/page.tsx", "5-6", "Contact 页 <title> 与 SEO 描述", "联系",
     "与 Tmoi 合作、委托或展览邀约。", "浏览器标签页标题", ""),
    ("app/contact/page.tsx", "27 / 33", "联系卡片 · 邮箱（链接 + 显示）",
     "tmoi@tmoi.art", "tmoi@tmoi.art", "联系页邮箱卡片", "建议改为真实邮箱"),
    ("app/contact/page.tsx", "36 / 44", "联系卡片 · Instagram（链接 + 显示）",
     "@tmoi", "@tmoi", "联系页 Instagram 卡片", "链接 href 目前是 https://instagram.com（通用首页）"),
    ("app/contact/page.tsx", "47 / 55", "联系卡片 · Behance（链接 + 显示）",
     "Tmoi", "Tmoi", "联系页 Behance 卡片", "链接 href 目前是 https://www.behance.net（通用首页）"),
    ("components/Footer.tsx", "10", "页脚 · 站点署名", "Tmoi", "Tmoi",
     "页脚左栏顶部大字", ""),
    ("components/Footer.tsx", "51 / 54", "页脚 · 邮箱（链接 + 显示）", "tmoi@tmoi.art", "tmoi@tmoi.art",
     "页脚右栏「联系」列表第 1 项", ""),
    ("components/Footer.tsx", "59 / 64", "页脚 · Instagram", "Instagram", "Instagram",
     "页脚右栏第 2 项", "链接为通用首页"),
    ("components/Footer.tsx", "68 / 73", "页脚 · Behance", "Behance", "Behance",
     "页脚右栏第 3 项", "链接为通用首页"),
    ("app/layout.tsx", "10-11", "站点 <title> 默认 / 模板", "Tmoi · Online Museum", "Tmoi · Online Museum",
     "浏览器标签页标题（全站默认）", "硬编码，中英同文"),
    ("app/layout.tsx", "13-14", "站点 meta description",
     "Tmoi's online museum — a quiet white-wall space centred on the work itself. Five series: Breath / Red / Color / Installation / Archive.",
     "Tmoi's online museum — a quiet white-wall space centred on the work itself. Five series: Breath / Red / Color / Installation / Archive.",
     "搜索结果 / 分享卡片摘要", "硬编码英文，中文页也显示英文"),
    ("app/layout.tsx", "15", "站点 meta keywords", "art, portfolio, generative art, sound installation, museum, Tmoi",
     "art, portfolio, generative art, sound installation, museum, Tmoi", "SEO 关键词", "硬编码"),
    ("app/layout.tsx", "17-19", "Open Graph 标题 / 描述（分享卡片）",
     "Tmoi · Online Museum",
     "A quiet white-wall online museum centred on the work itself. Five series: Breath / Red / Color / Installation / Archive.",
     "社交平台分享时的卡片", "硬编码英文"),
    ("app/works/[slug]/page.tsx", "26", "作品不存在时的标题", "Work not found", "Work not found",
     "404 兜底，极少出现", "硬编码英文"),
]

# ---------------------------------------------------------------- F 组：无障碍 / 悬停提示

F = [
    ("components/ImageGallery.tsx", "49 / 113", "图片 alt 文本", "《{作品名}》 图 {N}", "—",
     "画廊图片替代文字，含模板变量", "界面不可见"),
    ("components/ImageGallery.tsx", "54 / 74 / 79 / 98 / 124", "画廊控制按钮 aria-label",
     "图片放大查看 / 关闭 / 上一张 / 下一 / 放大查看第 N 张图片", "—",
     "灯箱控制按钮的屏幕阅读器标签", "界面不可见；中文为硬编码，英文缺失"),
    ("components/VideoPlayer.tsx", "41 / 51", "视频 aria-label", "{作品名} 视频 / 播放视频", "—",
     "视频容器与播放按钮", "界面不可见；仅中文"),
    ("components/VideoPlayer.tsx", "44", "浏览器不支持视频时的提示",
     "你的浏览器不支持内嵌视频。", "Your browser does not support embedded video.",
     "video 标签兜底内容", "极老旧浏览器才可见"),
    ("components/InteractivePiece.tsx", "11", "互动装置加载中文案", "加载互动装置…", "Loading interactive piece…",
     "互动组件懒加载时显示", ""),
    ("components/InteractivePiece.tsx", "30", "互动装置标题", "互动展品", "Interactive Piece",
     "互动区块的小标题", ""),
    ("components/SoundInteraction.tsx", "120", "声音区块小标题", "声音", "Sound", "声音组件标题", ""),
    ("components/SoundInteraction.tsx", "161-162", "播放状态提示",
     "正在播放 / 已暂停 · 全局声音开关处于关闭状态", "Playing / Paused · Global sound is off",
     "声音组件状态行", ""),
    ("components/SoundInteraction.tsx", "129", "播放按钮 aria-label", "播放声音 / 暂停声音", "—",
     "按钮无障碍标签", "界面不可见"),
    ("components/WebGLScene.tsx / CanvasSketch.tsx", "124 / 171", "暂停按钮 aria-label",
     "继续互动 / 暂停互动", "—", "互动装置暂停按钮", "界面不可见"),
    ("components/SoundToggle.tsx", "45-46", "声音总开关 aria-label 与悬停提示",
     "声音已开启 · 点击关闭 / 声音已关闭 · 点击开启", "—", "导航栏声音图标", "悬停时以 tooltip 显示"),
    ("components/SoundToggle.tsx", "64", "音量条 aria-label", "音量", "—", "音量滑块", "界面不可见"),
    ("components/Nav.tsx", "76", "移动端菜单按钮 aria-label", "菜单", "—", "移动端汉堡按钮", "界面不可见"),
    ("components/LanguageToggle.tsx", "21 / 34", "语言切换按钮文字", "中", "EN",
     "导航栏语言切换：EN / 中", "硬编码，两个按钮各自固定文字"),
]

# ---------------------------------------------------------------- 渲染

def table(rows, head=("编号", "出现位置", "中文", "英文", "字数"), gid="?", ids=None):
    """渲染表格；中文/英文两列（下标 2/3）变成可编辑单元格。

    ids: 每行唯一编号列表；为 None 时取每行第一列。D 组用 "D-01.title" 形式。
    """
    h = "".join(f"<th>{esc(x)}</th>" for x in head)
    if ids is None:
        ids = [r[0] for r in rows]
    body_cells = []
    for row, rid in zip(rows, ids):
        cells = []
        for idx, c in enumerate(row):
            if idx in (2, 3):
                lang = "zh" if idx == 2 else "en"
                cells.append(
                    f'<td class="ed" data-id="{esc(rid)}" data-lang="{lang}">'
                    f'<span class="txt">{c}</span>'
                    f'<button class="eb" type="button" data-id="{esc(rid)}" data-lang="{lang}" '
                    f'title="编辑{"中文" if lang == "zh" else "EN"}文案">✎</button></td>'
                )
            else:
                cells.append(f"<td>{c}</td>")
        body_cells.append("<tr>" + "".join(cells) + "</tr>")
    return f'<table data-gid="{esc(gid)}"><thead><tr>{h}</tr></thead><tbody>{"".join(body_cells)}</tbody></table>'


ui = parse_i18n()
series = parse_series()
labels = parse_labels()

# A 组：按前缀分组
groups = [
    ("nav.", "导航栏"),
    ("hero.", "首屏（美术馆门厅）"),
    ("home.", "首页策展陈述 / 精选"),
    ("works.", "作品索引（楼层导览）"),
    ("work.", "作品详情 + 展签"),
    ("label.", "展签"),
    ("about.", "关于页"),
    ("contact.", "联系页"),
    ("footer.", "页脚"),
]

sections = []
total = 0

# A
rows_a = []
n = 0
for prefix, title in groups:
    items = [(k, en, zh) for k, en, zh in ui if k.startswith(prefix)]
    if not items:
        continue
    for k, en, zh in items:
        n += 1
        rows_a.append((f"A-{n:02d}", f"<code>{esc(k)}</code><div class='ctx'>lib/i18n.ts · UI 字典 · {esc(title)}</div>",
                       br(zh), br(en), f"<span class='len'>中 {cnt(zh)}<br>英 {cnt(en)}</span>"))
total += n
sections.append(("A", "全站 UI 文案（lib/i18n.ts）", n, table(rows_a, gid="A")))

# B
rows_b = []
for i, (sid, name, name_en, blurb, blurb_en) in enumerate(series, 1):
    rows_b.append((f"B-{i:02d}",
                   f"<code>SERIES[{esc(sid)}]</code><div class='ctx'>lib/types.ts · 展厅名与一句话说明<br>用于：楼层导览卡片、展墙分组标题</div>",
                   f"<b>{esc(name)}</b><div class='sub'>{esc(blurb)}</div>",
                   f"<b>{esc(name_en)}</b><div class='sub'>{esc(blurb_en)}</div>",
                   f"<span class='len'>名 {len(name)} 字<br>说明 {len(blurb)} 字</span>"))
total += len(rows_b)
sections.append(("B", "五个系列（展厅）文案（lib/types.ts）", len(rows_b), table(rows_b, gid="B")))

# C
rows_c = []
for i, (k, ctx, zh, en) in enumerate(labels, 1):
    rows_c.append((f"C-{i:02d}", f"<code>{esc(k)}</code><div class='ctx'>lib/types.ts · {esc(ctx)}</div>",
                   esc(zh), esc(en), f"<span class='len'>{len(zh)} / {len(en)} 字</span>"))
total += len(rows_c)
sections.append(("C", "媒介 / 形态筛选标签（lib/types.ts）", len(rows_c), table(rows_c, gid="C")))

# D
d_blocks = []
for i, w in enumerate(works, 1):
    fields = [
        ("title / titleEn", "标题", w.get("title", ""), w.get("titleEn", ""), "卡片展签、详情页大标题、浏览器标签页"),
        ("subtitle / subtitleEn", "副标题", w.get("subtitle", ""), w.get("subtitleEn", ""), "详情页标题下方小字（仅部分作品有）"),
        ("summary / summaryEn", "一句话简介", w.get("summary", ""), w.get("summaryEn", ""), "首页 / 列表卡片摘要"),
        ("medium / mediumEn", "媒介说明", w.get("medium", ""), w.get("mediumEn", ""), "展签「媒介」行"),
        ("description[] / descriptionEn[]", "作品阐述（多段）", w.get("description", []), w.get("descriptionEn", []), "详情页「作品阐述」区块"),
        ("notes / notesEn", "创作笔记", w.get("notes", ""), w.get("notesEn", ""), "详情页「创作笔记」折叠区"),
        ("forms[] / formsEn[]", "形态标签", w.get("forms", []), w.get("formsEn", []), "详情页标题下方 chips"),
        ("size", "尺寸", w.get("size", ""), w.get("size", ""), "展签「尺寸」行，中英同文"),
        ("price", "市场参考", w.get("price", ""), w.get("price", ""), "展签「市场参考」行，中英同文"),
        ("location", "地点", w.get("location", ""), w.get("location", ""), "展签「地点」行，中英同文"),
        ("tech[] / techEn[]", "技术栈", w.get("tech", []), w.get("techEn", []), "展签「技术」行"),
        ("interactive.hint", "互动操作提示", (w.get("interactive") or {}).get("hint", ""), (w.get("interactive") or {}).get("hint", ""), "互动装置下方说明牌"),
        ("audio.hint", "声音提示", (w.get("audio") or {}).get("hint", ""), (w.get("audio") or {}).get("hint", ""), "声音组件下方说明牌"),
    ]
    rows = []
    row_ids = []
    for key, label, zh, en, ctx in fields:
        if isinstance(zh, list):
            if not zh and not en:
                continue
            zh_v = "  ⏎  ".join(zh) if zh else "—"
            en_v = "  ⏎  ".join(en) if en else "—"
            zh_d, en_d = zh_v, en_v
        else:
            if not zh and not en:
                continue
            zh_d, en_d = (zh or "—"), (en or "—")
        rows.append(("", f"<code>{esc(key)}</code><div class='ctx'>{esc(ctx)}</div>",
                     br(zh_d), br(en_d),
                     f"<span class='len'>中 {cnt(zh) if zh else '0'}<br>英 {cnt(en) if en else '0'}</span>"))
        row_ids.append(f"D-{i:02d}.{key.split('/')[0].strip().replace('[]', '')}")
    n_fields = len(rows)
    total += n_fields
    body = table(rows, head=("", "字段 / 出现位置", "中文", "英文", "字数"), gid="D", ids=row_ids)
    series_names = "、".join(w.get("series", []))
    d_blocks.append(f"""
<details class="work" {'open' if i <= 2 else ''}>
  <summary><span class="wid">D-{i:02d}</span> <b id="title-{i:02d}">{esc(w.get('title'))}</b>
    <span class="sub" id="titleEn-{i:02d}">{esc(w.get('titleEn'))}</span>
    <span class="meta">slug: <code>{esc(w.get('slug'))}</code> · {w.get('year')} · 系列：{esc(series_names)} · {n_fields} 处文案</span>
  </summary>
  <div class="ctx note">data/works.json → works[{i - 1}]　（字段改名会同时影响卡片、展签、详情页与浏览器标签页标题）</div>
  {body}
</details>""")
sections.append(("D", "作品文案（data/works.json）", len(works), "\n".join(d_blocks)))

# E
rows_e = []
for i, (f, line, ctx, zh, en, where, note) in enumerate(E, 1):
    rows_e.append((f"E-{i:02d}",
                   f"<code>{esc(f.split('/')[-1])}</code> <span class='line'>行 {esc(line)}</span>"
                   f"<div class='ctx'>{esc(ctx)}<br>{esc(where)}"
                   + (f"<br><span class='warn'>{esc(note)}</span>" if note else "") + "</div>",
                   br(zh), br(en), f"<span class='len'>中 {cnt(zh)}<br>英 {cnt(en)}</span>"))
total += len(rows_e)
sections.append(("E", "页面内硬编码文案（组件外挂文字）", len(rows_e), table(rows_e, gid="E")))

# F
rows_f = []
for i, (f, line, ctx, zh, en, where, note) in enumerate(F, 1):
    rows_f.append((f"F-{i:02d}",
                   f"<code>{esc(f)}</code> <span class='line'>行 {esc(line)}</span>"
                   f"<div class='ctx'>{esc(ctx)}<br>{esc(where)}"
                   + (f"<br><span class='warn'>{esc(note)}</span>" if note else "") + "</div>",
                   br(zh), br(en), f"<span class='len'>中 {cnt(zh)}<br>英 {cnt(en)}</span>"))
total += len(rows_f)
sections.append(("F", "无障碍标签 / 悬停提示（多数界面不可见）", len(rows_f), table(rows_f, gid="F")))

# G：发现的问题
issues = [
    ("展签「系列」标签不显示",
     "components/WallLabel.tsx 第 88 行引用了 <code>k=\"work.spec.series\"</code>，但 lib/i18n.ts 的 UI 字典里<b>没有这个 key</b>。"
     "LangText 遇到缺失 key 会返回 null，所以展签上「系列」这一行的标签名是空白的，只有右侧的系列名。",
     "补一个 key：<code>\"work.spec.series\": { en: \"Series\", zh: \"系列\" }</code>"),
    ("联系信息与你的真实邮箱不一致",
     "全站在 3 处写着 <code>tmoi@tmoi.art</code>（contact 页、about 页占位、footer）。你常用的邮箱是 <code>tmoi0715@gmail.com</code>。"
     "另外 Instagram / Behance 的链接 href 目前指向 <code>https://instagram.com</code> 和 <code>https://www.behance.net</code> 这两个通用首页，不是你的主页。",
     "替换 E-15 / E-16 / E-17 / E-21 / E-22 / E-23"),
    ("关于页展览条目还是占位符",
     "「展览」区块有 2 条，文字是 <code>[ 展览名称与地点 ]</code>，年份 2024 / 2025 也是占位的。这是全站最显眼的未完成内容。",
     "替换 B 组无关；直接改 app/about/page.tsx 第 117 / 123 行，或改用 i18n key <code>about.exhibitionPlaceholder</code> 的文案"),
    ("英文摘要比中文长 3–4 倍",
     "13 件作品的 <code>summaryEn</code> 普遍在 120–300 字符，而中文 summary 只有 36–80 字（例：breathe 中文 57 字 / 英文 191 字符）。"
     "英文摘要是机翻扩写版，语气也比中文正式。若你追求两种语言等长、同调，这是 D 组里最值得先改的一批。",
     "统一改 D 组的 summary / summaryEn"),
    ("站点 SEO 文案是纯英文",
     "layout.tsx 的 description / keywords / OpenGraph 全是英文，中文页面分享出去仍会显示英文摘要。",
     "E-24 / E-26 / E-27（如需中英分开，需要改代码结构，属功能改动）"),
]
g_html = "".join(
    f'<div class="issue"><h4>G-{i}　{esc(t)}</h4><p>{d}</p><p class="fix">可改编号：{f}</p></div>'
    for i, (t, d, f) in enumerate(issues, 1)
)
sections.append(("G", "顺便发现的问题（不在文案范围内，供你决定）", len(issues), g_html))

nav = "".join(
    f'<a href="#{sid}">{esc(title)} <span class="cnt">{n if isinstance(n, int) else ""}</span></a>'
    for sid, title, n, _ in sections
)

# ---------------------------------------------------------------- 编辑功能（样式 / 面板 / JS）

CSS_EDIT = r"""
  /* ---- 可编辑单元格 ---- */
  td.ed { position:relative; }
  td.ed .eb { position:absolute; top:8px; right:8px; display:none; width:24px; height:24px;
    border:1px solid rgba(74,107,74,.35); border-radius:7px; background:#fff; color:var(--accent);
    cursor:pointer; font-size:12px; line-height:1; padding:0; box-shadow:0 1px 3px rgba(27,24,19,.12); }
  td.ed:hover .eb, .eb:focus-visible { display:block; }
  td.ed.modified { background:#f3f6f0; box-shadow:inset 3px 0 0 var(--accent); }
  td.ed.modified .txt::after { content:"·已改"; color:var(--accent); font-size:10px;
    margin-left:6px; opacity:.75; letter-spacing:.04em; }
  .howto b.tip { color:var(--accent); }
  /* ---- 顶部工具条 ---- */
  .ed-bar { position:sticky; top:0; z-index:40; display:flex; align-items:center; gap:12px;
    background:rgba(246,243,236,.94); backdrop-filter:blur(8px); border-bottom:1px solid rgba(27,24,19,.1);
    padding:10px 18px; margin:0 -24px 28px; }
  .ed-bar .tb-left { font-size:13px; color:#4a453d; }
  .ed-bar .tb-left b { color:var(--accent); font-size:15px; font-variant-numeric:tabular-nums; }
  .ed-bar .tb-right { margin-left:auto; display:flex; gap:8px; }
  .ed-bar button { border:1px solid rgba(27,24,19,.18); background:#fff; color:var(--paper);
    border-radius:8px; padding:6px 12px; font-size:12.5px; cursor:pointer; }
  .ed-bar button:hover { border-color:var(--accent); color:var(--accent); }
  .ed-bar button.primary { background:var(--accent); border-color:var(--accent); color:#fff; }
  /* ---- 底部编辑面板 ---- */
  #editor { position:fixed; left:0; right:0; bottom:0; z-index:50;
    background:#fff; border-top:1px solid rgba(27,24,19,.14); box-shadow:0 -8px 32px rgba(27,24,19,.16); }
  #editor .ed-inner { max-width:880px; margin:0 auto; padding:16px 24px 20px; }
  .ed-head { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
  .ed-id { color:var(--accent); font-weight:600; font-size:13px;
    font-variant-numeric:tabular-nums; background:rgba(74,107,74,.1); padding:3px 10px; border-radius:7px; }
  .ed-ctx { color:#8a847a; font-size:12px; min-width:0; overflow:hidden;
    text-overflow:ellipsis; white-space:nowrap; }
  .ed-langs { margin-left:auto; display:flex; border:1px solid rgba(27,24,19,.18); border-radius:8px;
    overflow:hidden; flex-shrink:0; }
  .ed-langs button { border:none; background:#fff; color:#8a847a; padding:5px 14px; font-size:12.5px;
    cursor:pointer; font-family:inherit; }
  .ed-langs button.active { background:var(--accent); color:#fff; }
  #ed-input { width:100%; min-height:96px; max-height:40vh; border:1px solid rgba(27,24,19,.22);
    border-radius:10px; padding:12px 14px; font-family:inherit; font-size:13.5px; line-height:1.7;
    resize:vertical; color:var(--paper); background:#fdfcf9; outline:none; }
  #ed-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(74,107,74,.14); }
  .ed-foot { display:flex; align-items:center; gap:10px; margin-top:10px; }
  .ed-count { color:#a09a90; font-size:12px; font-variant-numeric:tabular-nums; }
  .ed-msg { color:var(--accent); font-size:12px; }
  .ed-foot button { border:1px solid rgba(27,24,19,.18); background:#fff; color:var(--paper);
    border-radius:8px; padding:7px 16px; font-size:12.5px; cursor:pointer; }
  .ed-foot button:hover { border-color:var(--accent); color:var(--accent); }
  .ed-foot button.primary { background:var(--accent); border-color:var(--accent); color:#fff; }
  .ed-foot button.primary:hover { opacity:.92; }
  .ed-foot .spacer { flex:1; }
  body.editing { padding-bottom:280px; }
"""

EDITOR_HTML = r"""
  <div class="ed-bar">
    <span class="tb-left">✎ 已在清单内修改 <b id="chg-n">0</b> 条</span>
    <span class="tb-right">
      <button type="button" id="btn-export">复制修改清单</button>
      <button type="button" id="btn-export-file">下载 .txt</button>
      <button type="button" id="btn-reset-all" class="danger">全部还原</button>
    </span>
  </div>
"""

EDITOR_PANEL = r"""
  <div id="editor" hidden>
    <div class="ed-inner">
      <div class="ed-head">
        <span class="ed-id" id="ed-id">A-00</span>
        <span class="ed-ctx" id="ed-ctx">…</span>
        <div class="ed-langs">
          <button type="button" class="lang-tab active" data-lang="zh">中</button>
          <button type="button" class="lang-tab" data-lang="en">EN</button>
        </div>
      </div>
      <textarea id="ed-input" spellcheck="false" placeholder="在这里自由编辑文案…（多段内容用换行分隔）"></textarea>
      <div class="ed-foot">
        <span class="ed-count" id="ed-count">0 字</span>
        <span class="ed-msg" id="ed-msg"></span>
        <span class="spacer"></span>
        <button type="button" id="ed-restore">恢复原文</button>
        <button type="button" id="ed-cancel">取消</button>
        <button type="button" id="ed-save" class="primary">保存</button>
      </div>
    </div>
  </div>
"""

JS = r"""
<script>
(function () {
  'use strict';
  var KEY = 'tmoi_copy_edits_v1';
  var edits = {};
  try { edits = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { edits = {}; }
  var cur = null; // { id, lang, orig }

  /* ---------- 工具 ---------- */
  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  // 从单元格提取原始文本：nl span -> 换行，div.sub 前加换行
  function rawText(node) {
    if (!node) return '';
    if (node.nodeType === 3) return node.textContent;
    if (node.classList && node.classList.contains('nl')) return '\n';
    var s = '';
    if (node.tagName === 'DIV') s = '\n';
    for (var i = 0; i < node.childNodes.length; i++) s += rawText(node.childNodes[i]);
    return s;
  }
  function cellTxt(td) {
    return rawText(td.querySelector('.txt')).replace(/^\n+|\n+$/g, '');
  }
  // 渲染文本到单元格：B 组（展厅名+一句话）首行加粗，其余 sub；其他纯文本 + nl 标记
  function renderInto(td, text) {
    var gid = td.closest('table').getAttribute('data-gid');
    var esc_ = escHtml(text);
    var html;
    if (gid === 'B') {
      var lines = text.split('\n');
      var name = escHtml(lines[0] || '');
      var rest = lines.slice(1).join('\n');
      html = '<b>' + name + '</b>' +
        (rest ? '<div class="sub">' + escHtml(rest).replace(/\n/g, '<span class="nl">⏎</span>') + '</div>' : '');
    } else {
      html = esc_.replace(/\n/g, '<span class="nl">⏎</span>');
    }
    td.querySelector('.txt').innerHTML = html;
  }
  function tdFor(id, lang) {
    return document.querySelector('td.ed[data-id="' + id + '"][data-lang="' + lang + '"]');
  }
  function idFor(detail) {
    var id = detail.dataset.id || (detail.dataset.id = (detail.getAttribute('data-id') || ''));
    return id;
  }
  function applyEdit(id, lang, text) {
    var td = tdFor(id, lang);
    if (!td) return;
    renderInto(td, text);
    td.classList.add('modified');
    // D 组 title 同步折叠行标题
    if (/^D-\d+\.title$/.test(id)) {
      var n = id.split('.')[0].replace('D-', '');
      var el = document.getElementById('title-' + n + (lang === 'en' ? 'En' : ''));
      if (el) el.textContent = text;
    }
  }
  function unapplyEdit(id, lang, orig) {
    var td = tdFor(id, lang);
    if (!td) return;
    renderInto(td, orig);
    td.classList.remove('modified');
    if (/^D-\d+\.title$/.test(id)) {
      var n = id.split('.')[0].replace('D-', '');
      var el = document.getElementById('title-' + n + (lang === 'en' ? 'En' : ''));
      if (el) el.textContent = orig;
    }
  }
  function count() { return Object.keys(edits).length; }
  function updateCount() {
    var n = count();
    document.getElementById('chg-n').textContent = n;
    document.body.classList.toggle('editing', !!cur);
  }
  function ctxOf(id, lang) {
    var td = tdFor(id, lang);
    if (!td) return '';
    var tds = td.closest('tr').querySelectorAll('td');
    if (tds.length < 2) return '';
    return (tds[1].innerText || '').replace(/\s+/g, ' ').trim();
  }
  function persist() { localStorage.setItem(KEY, JSON.stringify(edits)); }

  /* ---------- 编辑面板 ---------- */
  var panel = document.getElementById('editor');
  var input = document.getElementById('ed-input');
  var msgEl = document.getElementById('ed-msg');

  function showMsg(s, isErr) {
    msgEl.textContent = s;
    msgEl.style.color = isErr ? '#b3402a' : 'var(--accent)';
    clearTimeout(showMsg._t);
    showMsg._t = setTimeout(function () { msgEl.textContent = ''; }, 2600);
  }
  function setLang(lang) {
    cur.lang = lang;
    var tabs = panel.querySelectorAll('.lang-tab');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('active', tabs[i].dataset.lang === lang);
    var td = tdFor(cur.id, lang);
    var key = cur.id + '|' + lang;
    var text = edits[key] ? edits[key].cur : cellTxt(td);
    input.value = text;
    input.focus();
    updateMeta();
  }
  function updateMeta() {
    var v = input.value.replace(/\r\n/g, '\n');
    var len = v.length;
    var gid = cur.id.charAt(0);
    document.getElementById('ed-count').textContent =
      len + ' 字' + (v.split('\n').length > 1 ? ' · ' + v.split('\n').length + ' 段' : '');
    void gid;
  }
  function openEditor(id, lang) {
    var td = tdFor(id, lang);
    if (!td) return;
    cur = { id: id, lang: lang };
    document.getElementById('ed-id').textContent = id;
    document.getElementById('ed-ctx').textContent = ctxOf(id, lang);
    panel.hidden = false;
    if (typeof panel.scrollIntoView === 'function') panel.scrollIntoView({ block: 'end', behavior: 'smooth' });
    setLang(lang);
    updateCount();
  }
  function closeEditor() {
    cur = null;
    panel.hidden = true;
    updateCount();
  }
  function saveEdit() {
    if (!cur) return;
    var text = input.value.replace(/\r\n/g, '\n').replace(/^\n+|\n+$/g, '');
    var key = cur.id + '|' + cur.lang;
    var td = tdFor(cur.id, cur.lang);
    var orig = edits[key] ? edits[key].orig : cellTxt(td);
    edits[key] = { orig: orig, cur: text };
    persist();
    applyEdit(cur.id, cur.lang, text);
    updateCount();
    showMsg('已保存 ✓（刷新后仍保留，可随时在顶部还原）');
  }
  function restoreEdit() {
    if (!cur) return;
    var key = cur.id + '|' + cur.lang;
    if (!edits[key]) { showMsg('这格还没有改动，无需还原', true); return; }
    var orig = edits[key].orig;
    unapplyEdit(cur.id, cur.lang, orig);
    delete edits[key];
    persist();
    input.value = orig;
    updateMeta();
    updateCount();
    showMsg('已恢复原文');
  }

  /* ---------- 事件绑定 ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.eb');
    if (b) { openEditor(b.dataset.id, b.dataset.lang); return; }
    if (e.target.closest('#ed-cancel')) { closeEditor(); return; }
    if (e.target.closest('#ed-save')) { saveEdit(); return; }
    if (e.target.closest('#ed-restore')) { restoreEdit(); return; }
    var tab = e.target.closest('.lang-tab');
    if (tab && cur) { setLang(tab.dataset.lang); return; }
    if (e.target.closest('#btn-reset-all')) {
      if (!count()) { showMsg('当前没有修改', true); return; }
      if (!confirm('确定还原全部 ' + count() + ' 条修改？此操作不可撤销。')) return;
      for (var k in edits) {
        var parts = k.split('|');
        unapplyEdit(parts[0], parts[1], edits[k].orig);
      }
      edits = {};
      persist();
      updateCount();
      showMsg('已全部还原');
    }
    if (e.target.closest('#btn-export') || e.target.closest('#btn-export-file')) {
      var text = buildReport();
      if (e.target.closest('#btn-export-file')) downloadTxt(text);
      else copyText(text);
    }
  });
  input.addEventListener('input', updateMeta);
  document.addEventListener('keydown', function (e) {
    if (!cur) return;
    if (e.key === 'Escape') closeEditor();
    else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveEdit();
  });

  /* ---------- 导出 ---------- */
  function buildReport() {
    var keys = Object.keys(edits).sort();
    if (!keys.length) return '（暂无修改）';
    var lines = ['Tmoi 网站文案修改清单 · ' + new Date().toLocaleString(), '共 ' + keys.length + ' 条'];
    keys.forEach(function (k) {
      var parts = k.split('|');
      var e = edits[k];
      lines.push('');
      lines.push('[' + parts[0] + '] ' + (parts[1] === 'zh' ? '中文' : '英文') +
        ' · ' + ctxOf(parts[0], parts[1]));
      if (e.orig !== e.cur) {
        lines.push('  原文: ' + e.orig);
        lines.push('  新文: ' + e.cur);
      }
    });
    return lines.join('\n');
  }
  function copyText(text) {
    function done(ok, msg) { showMsg(ok ? '已复制到剪贴板 ✓' : msg, !ok); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { done(true); },
        function () { fallbackCopy(text, done); }
      );
    } else { fallbackCopy(text, done); }
  }
  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { done(document.execCommand('copy'), '复制失败，请手动选择'); }
    catch (e) { done(false, '复制失败，请手动选择'); }
    document.body.removeChild(ta);
  }
  function downloadTxt(text) {
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '文案修改清单.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 300);
    showMsg('已下载 文案修改清单.txt');
  }

  /* ---------- 启动：恢复已保存的修改 ---------- */
  for (var k in edits) {
    var p = k.split('|');
    if (p.length === 2) applyEdit(p[0], p[1], edits[k].cur);
  }
  updateCount();
})();
</script>
"""

body = "".join(
    f'<section id="{sid}"><h2>{sid}　{esc(title)}</h2>{content}</section>'
    for sid, title, n, content in sections
)

HTML = f"""<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tmoi 网站 · 文案清单</title>
<style>
  :root {{ --ink:{INK}; --paper:{PAPER}; --accent:{MOSS}; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:{INK}; color:{PAPER};
    font-family:"Noto Sans SC","PingFang SC",system-ui,-apple-system,sans-serif;
    font-size:14px; line-height:1.6; }}
  .wrap {{ max-width:1240px; margin:0 auto; padding:48px 24px 96px; }}
  h1 {{ font-size:28px; font-weight:600; letter-spacing:-0.01em; margin:0 0 8px; }}
  .lede {{ color:#6f6a60; max-width:760px; margin:0 0 24px; }}
  .howto {{ background:#fff; border:1px solid rgba(27,24,19,.1); border-radius:14px;
    padding:18px 22px; margin:0 0 32px; }}
  .howto code {{ background:rgba(74,107,74,.1); color:#3a573a; padding:1px 6px; border-radius:5px; }}
  nav.anchor {{ display:flex; flex-wrap:wrap; gap:8px; margin:0 0 36px; }}
  nav.anchor a {{ text-decoration:none; color:{PAPER}; background:#fff;
    border:1px solid rgba(27,24,19,.12); border-radius:999px; padding:6px 14px; font-size:13px; }}
  nav.anchor a:hover {{ border-color:{MOSS}; color:{MOSS}; }}
  nav.anchor .cnt {{ color:#9a948a; font-size:11px; margin-left:4px; }}
  section {{ margin:0 0 56px; scroll-margin-top:20px; }}
  h2 {{ font-size:19px; font-weight:600; margin:0 0 16px; padding-bottom:10px;
    border-bottom:1px solid rgba(27,24,19,.12); }}
  h4 {{ margin:0 0 6px; font-size:15px; }}
  table {{ width:100%; border-collapse:collapse; background:#fff;
    border:1px solid rgba(27,24,19,.1); border-radius:12px; overflow:hidden; }}
  th {{ text-align:left; font-size:11px; letter-spacing:.08em; text-transform:uppercase;
    color:#8a847a; font-weight:500; padding:10px 12px; background:#fbfaf7;
    border-bottom:1px solid rgba(27,24,19,.1); }}
  td {{ padding:12px; border-bottom:1px solid rgba(27,24,19,.06); vertical-align:top; }}
  tr:last-child td {{ border-bottom:none; }}
  td:first-child {{ white-space:nowrap; font-variant-numeric:tabular-nums;
    color:{MOSS}; font-weight:600; font-size:12px; width:52px; }}
  td:nth-child(2) {{ width:270px; }}
  td:nth-child(3), td:nth-child(4) {{ width:31%; }}
  td:nth-child(5) {{ width:96px; }}
  code {{ font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:11.5px;
    color:#3a573a; background:rgba(74,107,74,.09); padding:1px 5px; border-radius:4px; }}
  .ctx {{ color:#8a847a; font-size:11.5px; line-height:1.45; margin-top:3px; }}
  .sub {{ color:#6f6a60; font-size:12px; margin-top:3px; }}
  .len {{ color:#a09a90; font-size:11px; font-variant-numeric:tabular-nums; }}
  .line {{ color:#a09a90; font-size:11px; }}
  .warn {{ color:#a4622f; }}
  .nl {{ color:{MOSS}; opacity:.7; font-size:10px; }}
  details.work {{ background:#fff; border:1px solid rgba(27,24,19,.1);
    border-radius:12px; margin:0 0 10px; overflow:hidden; }}
  details.work summary {{ cursor:pointer; padding:14px 16px; font-size:15px;
    display:flex; flex-wrap:wrap; align-items:baseline; gap:8px; }}
  details.work summary:hover {{ background:#fbfaf7; }}
  details.work[open] summary {{ border-bottom:1px solid rgba(27,24,19,.1); }}
  .wid {{ color:{MOSS}; font-weight:600; font-size:12px; font-variant-numeric:tabular-nums; }}
  .meta {{ color:#8a847a; font-size:11.5px; font-weight:400; }}
  details.work table {{ border:none; border-radius:0; }}
  .note {{ padding:10px 16px; background:#fbfaf7; border-bottom:1px solid rgba(27,24,19,.08); }}
  .issue {{ background:#fff; border:1px solid rgba(27,24,19,.1);
    border-left:3px solid #b3402a; border-radius:10px; padding:14px 18px; margin:0 0 12px; }}
  .issue p {{ margin:0 0 6px; color:#4a453d; }}
  .issue .fix {{ color:#8a847a; font-size:12px; margin:0; }}
{CSS_EDIT}
</style>
</head>
<body>
<div class="wrap">
  {EDITOR_HTML}
  <h1>Tmoi 网站 · 界面文案清单</h1>
  <p class="lede">全站所有可修改的文字，按来源分组并编号。<b>清单本体未改动任何代码。</b>
     你只需告诉我「把 A-12 的中文改成……」，我按编号替换，其余一切保持原样。</p>

  <div class="howto">
    <b>怎么用</b><br>
    1. 每条有一个编号（如 <code>A-12</code>、<code>D-07</code>、<code>E-15</code>），指定编号即可，不用描述位置。<br>
    2. 「字数」列是长度参考：替换时保持相近长度，排版不会跑版。<br>
    3. 中英两栏都要给；只给一栏的话，另一栏会保持原样（可能造成中英不一致）。<br>
    4. <span class="nl">⏎</span> 表示原文里有一个换行（如首屏大标题分两行）。<br>
    5. D 组共 {len(works)} 件作品，点标题展开看字段；E / F 组是散落在组件里的固定文字。<br>
    6. <b class="tip">也可以直接在清单里改</b>：鼠标移到中文/英文格子上点 <b class="tip">✎</b>，
       在底部输入框里编辑并保存，清单会立即同步更新；修改会保存在本浏览器（localStorage），
       顶部可「复制修改清单」把编号+新文案发给我落地到代码。
  </div>

  <nav class="anchor">{nav}</nav>
  {body}
</div>
{EDITOR_PANEL}
{JS}
</body>
</html>"""

OUT.write_text(HTML, encoding="utf-8")
print("已生成:", OUT)
print("A 组 UI 文案:", len(ui), "条")
print("B 组系列:", len(series), "个")
print("C 组标签:", len(labels), "个")
print("D 组作品:", len(works), "件")
print("E 组硬编码:", len(E), "处")
print("F 组无障碍:", len(F), "处")
print("G 组问题:", len(issues), "个")
