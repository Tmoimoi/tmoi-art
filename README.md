# Tmoi · 个人艺术网站

> 一个以作品为中心的线上策展空间。暗色、克制；呼吸 / 红 / 色彩 / 装置 / 档案 五个系列。

## 当前内容

| 模块 | 状态 |
|---|---|
| 5 系列 × 14 件作品 | ✅ 完整，作品描述、笔记、规格、合作者、技术栈已填 |
| 媒介 / 系列 / 形态 三轴筛选 | ✅ |
| 作品双段叙述（阐述 + 笔记） | ✅ 私语调 |
| 同名不同体（Breath / Wanna Say）合并 + 形态标签 | ✅ |
| 合作作品自动聚合到 About 页 | ✅ |
| 五种媒体（文字 / 图像 / 影像 / 互动 / 声音） | ✅ |
| 全站素材 | ⚠️ **均为 SVG 占位**，真实素材替换见下方 |
| About 页个人陈述 / 展览 / 联系方式 | ⚠️ **占位文本**，等 Tmoi 补全 |

## 启动

```bash
npm install
npm run dev           # http://localhost:3000
npm run build         # 生产构建（沙箱内需 NODE_OPTIONS="" npm run build）
npm run start         # 预览生产构建
```

## 部署

推送 Git → Vercel 导入（自动识别 Next.js）→ Deploy 即可。
`vercel.json` 已配置素材缓存头。

## 如何新增一件作品

最小成本的两步：

### 1. 编辑 `data/works.json`

在数组末尾追加：

```json
{
  "id": "work-015",
  "slug": "my-new-work",
  "title": "新作品",
  "titleEn": "My New Work",
  "year": 2025,
  "medium": "影像 / 互动",
  "mediums": ["video", "interactive"],
  "forms": ["短片", "网页互动"],
  "series": ["breath"],
  "form": "individual",
  "size": "3 分钟",
  "location": "工作室",
  "cover": "/works/my-new-work/cover.jpg",
  "summary": "一句话简介。",
  "images": ["/works/my-new-work/1.jpg"],
  "description": ["阐述段 1", "阐述段 2"],
  "notes": "创作笔记 / 过程记录（可空）",
  "related": ["breathe"]
}
```

字段说明：
- `mediums`：用于列表筛选的媒介维度
- `forms`：同一作品可同时存在的多种形态（同名不同体）
- `series`：可多选，可属于多个系列
- `form`：individual（个人） / collaboration（合作）
- `collaborators` / `tech`：合作者 / 技术栈（合作作品必填，About 页会自动聚合）
- `related`：相关作品 slug 数组（不填则降级为同系列其他作品）

### 2. 放素材到 `public/works/<slug>/`

```
public/works/my-new-work/
  cover.jpg   # 卡片/列表封面（必填）
  1.jpg       # 画廊（可选）
  2.jpg
  clip.mp4    # 视频（可选）
  ambient.wav # 声音（可选）
```

支持的媒体模块对应字段：

| 字段 | 模块 | 控件 |
|---|---|---|
| `images` | 图像画廊 | ImageGallery + Lightbox |
| `video` | 影像 | VideoPlayer（控制条 + 封面）|
| `interactive.engine` | 网页互动 | Three.js / Canvas2D 可操作装置 |
| `audio` | 声音交互 | Howler.js 播放 + 频谱可视化 |

## 替换为真实作品素材

当前所有图片为脚本生成的主题化 SVG 占位（`scripts/generate_covers.mjs`）。要替换为真实素材：

1. 把真实图片/视频/音频放到对应 `public/works/<slug>/`
2. 保持文件名不变（`cover.jpg`, `1.jpg`, `clip.mp4`, `ambient.wav` 等）
3. 或在 `data/works.json` 修改对应路径
4. 推荐导出 **WebP**（图片）/ **H.264 MP4**（视频）/ **MP3 或 WAV**（音频），移动端自动降级

## 5 个系列

定义在 `lib/types.ts` 的 `SERIES` 数组：

| ID | 中文 | 英文 | 一句话 |
|---|---|---|---|
| `breath` | 呼吸 | Breath | 关于呼吸、梦境与感知阈限的母题 |
| `red` | 红 | Red | 本命年、红色记忆、影像与装置中反复出现的那抹红 |
| `color` | 色彩 | Color | 从色感到色卡，把色彩当作可被训练、可被生成的事物 |
| `installation` | 装置 | Installation | 在物理空间里邀请身体参与的现场作品 |
| `archive` | 档案 | Archive | 日常拍摄与材料积累，作为可被回看的草稿本 |

新增系列：在 `SERIES` 数组中追加即可。

## 文件结构

```
app/                    Next.js App Router
  page.tsx              首页（Hero + 精选）
  works/
    page.tsx            作品列表（3 轴筛选 + 系列分组）
    [slug]/page.tsx     作品详情（双段叙述 + 相关作品）
  about/page.tsx        关于（教育 / 合作 / 展览 / 联系）
  contact/page.tsx      联系
  layout.tsx            全局 layout（Nav / Footer / SoundProvider）
components/             组件
  Hero / Nav / Footer / Reveal / WorkCard
  ImageGallery / VideoPlayer / InteractivePiece / SoundInteraction
  SoundProvider / SoundToggle
data/works.json         全部作品数据（驱动所有页面）
lib/
  types.ts              类型定义 + SERIES + 标签
  works.ts              数据访问（getAll / getBySlug / getRelated / getBySeries）
public/works/           素材（每件作品一个文件夹）
scripts/
  generate_covers.mjs   重新生成 14 件作品的 SVG 占位
  extract_pdf.py        提取作品集 PDF 文本
  render_pdf.py         渲染 PDF 页为 PNG
  split_adc.py          切长海报
```

## 待办（按优先级）

1. **About 页补全**：个人陈述（已留 2 段占位）/ 展览经历 / 邮箱 / 社交链接
2. **真实作品素材**：14 件作品的真实图片/视频/音频替换 SVG 占位
3. **首页 Hero 文案**：当前是占位（"把注意力，留給作品本身"），可根据作品调性微调
4. **新增作品**：约还有一半作品（你提到 14 是半套），可按 README「如何新增一件作品」流程继续
