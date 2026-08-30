// 双语基础设施 —— 英文为主、中文可切换
// lang 默认 "en"（英文为主），用户切换后存入 localStorage。

export type Lang = "en" | "zh";

// 全站 UI 静态文案字典（导航、标题、标签、按钮等）
// 每条都同时有 en / zh，且 zh 本身不再混入英文（中文页 = 纯中文）。
export const UI: Record<string, { en: string; zh: string }> = {
  // 导航
  "nav.works": { en: "Works", zh: "作品" },
  "nav.about": { en: "About", zh: "关于" },
  "nav.contact": { en: "Contact", zh: "联系" },

  // 首屏 Hero（美术馆门厅）
  "hero.eyebrow": { en: "Tmoi · Online Museum", zh: "Tmoi · 线上美术馆" },
  "hero.title": {
    en: "Give your attention\nto the work itself.",
    zh: "把注意力，\n留給作品本身。",
  },
  "hero.sub": {
    en: "A quiet online museum. Moving image, generative art, web interaction and sound installation — each hung on a white wall with its own label. Walk the halls at your own pace.",
    zh: "一座安静的线上美术馆。影像、生成艺术、网页互动与声音装置——每件挂在白墙上，配一张自己的展签。按你自己的节奏，走过展厅。",
  },
  "hero.cta1": { en: "Enter the halls", zh: "进入展厅" },
  "hero.cta2": { en: "About the artist", zh: "关于艺术家" },
  "hero.scroll": { en: "Enter", zh: "进入" },

  // 首页策展陈述
  "home.statement.eyebrow": { en: "Statement", zh: "策展陈述" },
  "home.statement.p1": {
    en: "I am in no hurry to explain the work. They are more like moments preserved — you draw near and they appear; you leave and they return to silence.",
    zh: "我不急于解释作品。它们更像一些被保存下来的「时刻」——你靠近，它们显形；你离开，它们回到沉默。",
  },
  "home.statement.p2": {
    en: "This space centers the work and softens the interface. A still photograph, a moving image, a generative piece you can operate in the browser, or a sound that asks to be switched on — all are placed on equal footing on the same white wall.",
    zh: "这个空间以作品为中心，弱化界面。无论是一张静照、一段影像、一件可在浏览器里操作的生成装置，还是一段需要你主动开启的声音，都被平等地陈列在同一面白墙上。",
  },
  "home.statement.p3": {
    en: "The work is organised around five motifs — Breath / Red / Color / Installation / Archive. You may read it in order, or simply look.",
    zh: "作品按 5 个母题组织——呼吸 / 红 / 色彩 / 装置 / 档案。你可以顺着读，也可以只看图。",
  },
  "home.selected.eyebrow": { en: "Selected", zh: "精选" },
  "home.selected.title": { en: "Recent Work", zh: "近期作品" },
  "home.viewAll": { en: "View all", zh: "查看全部" },

  // 作品索引（线上美术馆 · 楼层导览）
  "works.eyebrow": { en: "Floor Plan", zh: "楼层导览" },
  "works.title": { en: "The Halls", zh: "展厅" },
  "works.intro": {
    en: "Five halls, organised by motif. Step into a hall, or read the whole collection at once.",
    zh: "五个展厅，按母题组织。走进任一展厅，或一次看完全部作品。",
  },
  "works.floorplan": { en: "Choose a hall", zh: "选择展厅" },
  "works.allHall": { en: "All works", zh: "全部作品" },
  "works.hallCount": { en: "{n} works", zh: "{n} 件" },
  "works.filter.medium": { en: "Medium", zh: "媒介" },
  "works.filter.series": { en: "Series", zh: "系列" },
  "works.filter.form": { en: "Form", zh: "形态" },
  "works.all": { en: "All", zh: "全部" },
  "works.empty": { en: "No works under this combination.", zh: "该组合下暂无作品。" },
  "works.back": { en: "Back to Home", zh: "返回首页" },

  // 作品详情
  "work.back": { en: "All works", zh: "作品索引" },
  "work.section.text": { en: "Text", zh: "作品阐述" },
  "work.section.images": { en: "Images", zh: "图像" },
  "work.section.video": { en: "Video", zh: "影像" },
  "work.section.interactive": { en: "Interactive", zh: "网页互动" },
  "work.section.sound": { en: "Sound", zh: "声音交互" },
  "work.section.notes": { en: "Notes", zh: "创作笔记" },
  "work.section.related": { en: "Related", zh: "相关作品" },
  "work.prev": { en: "Previous", zh: "上一件" },
  "work.next": { en: "Next", zh: "下一件" },
  "work.spec.year": { en: "Year", zh: "年份" },
  "work.spec.medium": { en: "Medium", zh: "媒介" },
  "work.spec.size": { en: "Dimensions", zh: "尺寸" },
  "work.spec.location": { en: "Location", zh: "地点" },
  "work.spec.collaborators": { en: "Collaborators", zh: "合作" },
  "work.spec.tech": { en: "Tech", zh: "技术" },
  "work.spec.price": { en: "Reference", zh: "市场参考" },
  "work.form.individual": { en: "Individual", zh: "个人" },
  "work.form.collaboration": { en: "Collaboration", zh: "合作" },
  "work.forms.label": { en: "Forms", zh: "形态" },

  // 展签（Wall Label）
  "label.curator": { en: "Wall label", zh: "作品展签" },

  // About
  "about.eyebrow": { en: "About", zh: "关于" },
  "about.name": { en: "Tmoi", zh: "Tmoi" },
  "about.enName": { en: "Zhang Tingmei Tmoi", zh: "张婷媚" },
  "about.education": { en: "Education", zh: "教育" },
  "about.collaborators": { en: "Collaborators", zh: "合作" },
  "about.exhibitions": { en: "Exhibitions", zh: "展览" },
  "about.contact": { en: "Contact", zh: "联系" },
  "about.email": { en: "Email", zh: "邮箱" },
  "about.location": { en: "Based in", zh: "所在地" },
  "about.social": { en: "Social", zh: "社交" },
  "about.cooperationTitle": { en: "Selected collaboration", zh: "合作作品" },
  "about.contactCta": { en: "Collaborate & Contact", zh: "合作与联系" },
  "about.exhibitionPlaceholder": { en: "[ exhibition name & venue ]", zh: "[ 展览名称与地点 ]" },
  "about.collaboratorNote": {
    en: "From collaborative works; add more here.",
    zh: "以上来自合作作品，可在此补充更多合作经历。",
  },

  // Contact
  "contact.eyebrow": { en: "Contact", zh: "联系" },
  "contact.title": { en: "Let's talk.", zh: "让我们聊聊。" },
  "contact.sub": {
    en: "Exhibition invitations, commissions, press or just a word — write to me. Sound and work, best with a cup of tea.",
    zh: "展览邀约、作品委托、媒体合作或只是想说点什么——都欢迎写信给我。声音与作品，最好配一杯茶。",
  },
  "contact.email": { en: "Email", zh: "邮箱" },
  "contact.instagram": { en: "Instagram", zh: "Instagram" },
  "contact.behance": { en: "Behance", zh: "Behance" },

  // Footer
  "footer.desc": {
    en: "An online museum centered on the work itself. Quiet, restrained; five series — Breath / Red / Color / Installation / Archive.",
    zh: "一个以作品为中心的线上美术馆。安静、克制；呼吸 / 红 / 色彩 / 装置 / 档案 五个系列。",
  },
  "footer.nav": { en: "Navigation", zh: "导航" },
  "footer.contact": { en: "Contact", zh: "联系" },
  "footer.home": { en: "Home", zh: "首页" },
  "footer.rights": { en: "© {y} Tmoi. All rights reserved.", zh: "© {y} Tmoi. 保留所有权利。" },
  "footer.built": { en: "Built with Next.js · Three.js · Howler.js", zh: "以 Next.js · Three.js · Howler.js 构建" },
};

// 媒介 / 形态的英文标签
export const MEDIUM_LABELS_EN: Record<string, string> = {
  image: "Image",
  video: "Video",
  interactive: "Interactive",
  sound: "Sound",
};

export const FORM_LABELS_EN: Record<string, string> = {
  individual: "Individual",
  collaboration: "Collaboration",
};

export const SERIES_NAME_EN: Record<string, string> = {
  breath: "Breath",
  red: "Red",
  color: "Color",
  installation: "Installation",
  archive: "Archive",
};

// 纯函数：根据语言选取文案，缺失时回退到另一语言
export function pick(zh?: string, en?: string, lang: Lang = "en"): string {
  if (lang === "en") return en ?? zh ?? "";
  return zh ?? en ?? "";
}

export function pickArr(zh?: string[], en?: string[], lang: Lang = "en"): string[] {
  if (lang === "en") return en && en.length ? en : zh ?? [];
  return zh && zh.length ? zh : en ?? [];
}
