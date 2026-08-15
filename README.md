# TMOI · 个人艺术网站

一个以作品为中心的**暗色策展风**个人艺术网站。基于 Next.js（App Router）构建，
支持图像、影像、网页互动（Three.js / Canvas）与声音交互（Howler.js + Web Audio）五种媒介。

## 技术栈

| 能力 | 选型 |
| --- | --- |
| 框架 | Next.js 14（App Router）+ TypeScript |
| 样式 | Tailwind CSS |
| 动效 | Framer Motion（滚动渐显、页面过渡） |
| 三维互动 | Three.js + @react-three/fiber |
| 2D 互动 | Canvas2D |
| 声音 | Howler.js（Web Audio，含频谱可视化） |
| 部署 | Vercel |

## 本地运行

```bash
npm install
npm run dev      # 开发预览 http://localhost:3000
npm run build    # 生产构建（校验类型与静态生成）
npm run start    # 预览生产构建
```

> 示例素材由脚本生成（见下）。首次 `npm install` 后即可直接 `npm run dev`，
> 占位资源已包含在 `public/works/` 中，无需额外步骤。

### 重新生成占位素材（可选）

```bash
node scripts/generate-svgs.mjs     # 生成 SVG 占位图
node scripts/generate-audio.mjs    # 生成氛围声 WAV
python scripts/generate-video.py   # 生成示例 MP4（需 imageio / imageio-ffmpeg）
```

## 目录结构

```
app/
  layout.tsx            根布局（主题 / 导航 / 声音全局开关）
  page.tsx              首页（Hero + 策展陈述 + 精选）
  works/page.tsx        作品索引（按媒介筛选）
  works/[slug]/page.tsx 作品详情（五模块）
  about / contact       关于 / 联系
components/             导航、声音、画廊、播放器、互动、声景等
lib/types.ts           作品数据模型与媒介定义
lib/works.ts           数据读取
data/works.json        结构化作品数据（驱动全部页面）
public/works/<slug>/   各作品素材（图片 / 视频 / 音频）
scripts/               占位素材生成脚本
```

## 如何新增一件作品

1. 在 `public/works/` 下新建文件夹，例如 `public/works/my-work/`，放入素材
   （图片 `1.svg/...`、视频 `clip.mp4`、音频 `ambient.wav`）。
2. 打开 `data/works.json`，追加一个对象，字段说明：

| 字段 | 含义 |
| --- | --- |
| `slug` | URL 标识，决定 `/works/<slug>` |
| `title` / `titleEn` | 中文标题 / 英文标题 |
| `year` / `medium` / `size` / `location` | 元信息 |
| `mediums` | 用于筛选的媒介数组：`image` / `video` / `interactive` / `sound` |
| `cover` | 列表与详情封面图路径 |
| `summary` | 一句话简介 |
| `images` | 图片画廊数组（可选） |
| `video` / `videoPoster` | 视频源 / 封面（可选） |
| `interactive` | `{ engine: "threejs"|"canvas", variant, hint }`（可选） |
| `audio` | `{ src, loop, visualizer, hint }`（可选） |
| `description` | 作品阐述（字符串数组，多段） |
| `notes` | 创作笔记（可折叠，可选） |

3. 保存后，`npm run dev` 即可看到新作品出现在列表与首页。

## 关于声音与无障碍

- **声音默认关闭**：全局声音开关位于导航栏，默认 `off`；每件作品的声音需用户主动开启，
  尊重浏览器自动播放限制与用户意愿。
- 全局音量可在导航栏调节，并记忆到 `localStorage`。
- 尊重 `prefers-reduced-motion`：互动装置在用户偏好减弱动效时默认暂停。
- 图片均有 `alt`，视频带封面与说明，互动装置附操作提示。

## 部署到 Vercel

1. 推送到 GitHub / GitLab / Bitbucket。
2. 在 [Vercel](https://vercel.com) 导入该仓库，框架预设自动识别为 **Next.js**。
3. 构建命令 `next build`、输出目录由 Vercel 自动处理，无需额外配置
   （`vercel.json` 仅用于静态素材缓存头）。
4. 点击 Deploy 即可获得 `https://<your-project>.vercel.app`，可绑定自定义域名。

## 替换为真实作品

把 `public/works/<slug>/` 下的占位 SVG / MP4 / WAV 换成你的真实文件，
并更新 `data/works.json` 中对应的路径与文案即可。图片建议 ≥2000px 长边，
视频建议 H.264（MP4）并附封面图。
