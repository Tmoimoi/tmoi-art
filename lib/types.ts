// 作品数据模型 —— 所有页面由这里的类型与 data/works.json 驱动

// 媒介筛选维度（文字介绍属于每件作品的基础信息，不参与筛选）
export type Medium = "image" | "video" | "interactive" | "sound";

export const MEDIUM_LABELS: Record<Medium, string> = {
  image: "图像",
  video: "影像",
  interactive: "互动",
  sound: "声音",
};

export const MEDIUM_ORDER: Medium[] = ["image", "video", "interactive", "sound"];

export interface InteractiveConfig {
  // threejs: 基于 Three.js / WebGL 的三维可操作装置
  // canvas: 基于 Canvas2D 的可操作生成艺术
  engine: "threejs" | "canvas";
  // 具体变体，对应 components 中的实现
  variant: string;
  hint: string; // 操作提示
}

export interface AudioConfig {
  src: string;
  loop?: boolean;
  visualizer?: boolean; // 是否展示频谱可视化
  hint?: string;
}

export interface Work {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  year: number;
  // 人类可读的媒介说明，例如“生成艺术 / 声音装置”
  medium: string;
  // 用于列表筛选的媒介维度
  mediums: Medium[];
  size: string;
  location?: string;
  cover: string;
  summary: string; // 一句话简介（卡片/首页用）
  images?: string[]; // 图片画廊
  video?: string; // 视频源
  videoPoster?: string; // 视频封面
  interactive?: InteractiveConfig; // 网页互动
  audio?: AudioConfig; // 声音交互
  description: string[]; // 作品阐述（多段）
  notes?: string; // 创作笔记
}
