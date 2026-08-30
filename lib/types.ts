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

// 作品形态：个人 / 合作
export type Form = "individual" | "collaboration";
export const FORM_LABELS: Record<Form, string> = {
  individual: "个人",
  collaboration: "合作",
};
export const FORM_ORDER: Form[] = ["individual", "collaboration"];

// 预定义的系列（用于筛选/分组；作品可属于多个系列）
export type SeriesId =
  | "breath"
  | "red"
  | "color"
  | "installation"
  | "archive";

export interface Series {
  id: SeriesId;
  name: string; // 中文名
  nameEn: string; // 英文名
  blurb?: string; // 一句话系列说明（中文）
  blurbEn?: string; // 英文系列说明
}

export const SERIES: Series[] = [
  { id: "breath", name: "呼吸", nameEn: "Breath", blurb: "关于呼吸、梦境与感知阈限的母题。", blurbEn: "Motifs of breath, dreams and the threshold of perception." },
  { id: "red", name: "红", nameEn: "Red", blurb: "本命年、红色记忆、影像与装置中反复出现的那抹红。", blurbEn: "Zodiac year, red memory — that recurring red across image and installation." },
  { id: "color", name: "色彩", nameEn: "Color", blurb: "从色感到色卡，把色彩当作可被训练、可被生成的事物。", blurbEn: "From colour sense to colour cards: treating colour as something trainable and generative." },
  { id: "installation", name: "装置", nameEn: "Installation", blurb: "在物理空间里邀请身体参与的现场作品。", blurbEn: "Site works that invite the body to participate in physical space." },
  { id: "archive", name: "档案", nameEn: "Archive", blurb: "日常拍摄与材料积累，作为可被回看的草稿本。", blurbEn: "Everyday shooting and material accumulation, kept as a reviewable sketchbook." },
];

export function getSeries(id: SeriesId): Series | undefined {
  return SERIES.find((s) => s.id === id);
}

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
  subtitle?: string; // 中文别名 / 副标题（如「安然片刻」）
  subtitleEn?: string; // 英文副标题
  year: number;
  // 人类可读的媒介说明，例如"生成艺术 / 沉浸式装置"
  medium: string;
  mediumEn?: string; // 英文媒介说明
  // 用于列表筛选的媒介维度
  mediums: Medium[];
  // 同一作品可同时存在的多种形态（如：动画 + 沉浸式装置）
  forms?: string[];
  formsEn?: string[]; // 英文形态说明
  // 所属系列（可多选）
  series: SeriesId[];
  // 个人 / 合作
  form: Form;
  size: string;
  price?: string; // 市场参考价（如适用）
  location?: string;
  cover: string;
  summary: string; // 一句话简介（卡片/首页用）
  summaryEn?: string; // 英文一句话简介
  images?: string[]; // 图片画廊
  video?: string; // 视频源
  videoPoster?: string; // 视频封面
  interactive?: InteractiveConfig; // 网页互动
  audio?: AudioConfig; // 声音交互
  // 合作者（如适用）
  collaborators?: string[];
  // 技术栈（如适用）
  tech?: string[];
  techEn?: string[]; // 英文技术栈
  description: string[]; // 作品阐述（多段 · 私语调）
  descriptionEn?: string[]; // 英文作品阐述
  notes?: string; // 创作笔记 / 过程记录
  notesEn?: string; // 英文创作笔记
  related?: string[]; // 相关作品 slug
}
