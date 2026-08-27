// 为 14 件作品生成主题化 SVG 占位封面 + 3 张画廊图
// 风格：暗色策展，呼应各作品母题

import fs from "node:fs";
import path from "node:path";

const ROOT = "/Users/tmoi/WorkBuddy/Tmoi 个人网站/public/works";
fs.mkdirSync(ROOT, { recursive: true });

// 工具
const ensureDir = (slug) => {
  const d = path.join(ROOT, slug);
  fs.mkdirSync(d, { recursive: true });
  return d;
};
const write = (slug, name, body) => {
  fs.writeFileSync(path.join(ROOT, slug, name), body);
};

const wrap = (w, h, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;

// 调色板
const P = {
  ink: "#0a0a0a",
  inkSoft: "#141414",
  paper: "#f5f2ec",
  paperDim: "#a8a39a",
  accent: "#ff5a1f",
  red: "#a02b1f",
  redDeep: "#5a1612",
  redMid: "#c23a2a",
  redLight: "#e87a5a",
  green: "#3a6b4a",
  greenLight: "#8eb89b",
  mint: "#cfe7d6",
  blue: "#1f3a5b",
  blueDeep: "#0c1a30",
  teal: "#2f7a6b",
  amber: "#c08340",
  pink: "#c97b8c",
};

// ---------------- 1. Breathe ----------------
ensureDir("breathe");
{
  const inner = `
    <defs>
      <radialGradient id="bg-breathe" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="${P.mint}"/>
        <stop offset="60%" stop-color="#2a3a2e"/>
        <stop offset="100%" stop-color="${P.ink}"/>
      </radialGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bg-breathe)"/>
    <g opacity="0.5">
      <circle cx="400" cy="300" r="180" fill="none" stroke="${P.paper}" stroke-width="0.5"/>
      <circle cx="400" cy="300" r="120" fill="none" stroke="${P.paper}" stroke-width="0.5"/>
      <circle cx="400" cy="300" r="60" fill="none" stroke="${P.paper}" stroke-width="0.5"/>
    </g>
    <g fill="${P.paper}" opacity="0.7">
      <circle cx="380" cy="280" r="3"/><circle cx="420" cy="290" r="2"/>
      <circle cx="395" cy="320" r="2"/><circle cx="410" cy="260" r="2"/>
      <circle cx="370" cy="310" r="1.5"/><circle cx="430" cy="300" r="2"/>
    </g>
    <text x="40" y="560" fill="${P.paperDim}" font-family="serif" font-size="14" opacity="0.6">Breathe · 2024</text>
  `;
  write("breathe", "cover.svg", wrap(800, 600, inner));
  // 1: 绿调分镜
  write("breathe", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.green}"/><g opacity="0.4" stroke="${P.mint}" fill="none"><circle cx="200" cy="300" r="80"/><circle cx="400" cy="300" r="120"/><circle cx="600" cy="300" r="80"/></g><text x="40" y="560" fill="${P.mint}" font-size="14" opacity="0.5">Breathe · 1</text>`));
  // 2: 手绘
  write("breathe", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.inkSoft}"/><g stroke="${P.paper}" stroke-width="1.5" fill="none" opacity="0.6"><path d="M 100 400 Q 250 200 400 400 T 700 400"/><path d="M 100 300 L 700 300" stroke-dasharray="2 8"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.6">Breathe · 2</text>`));
  // 3: 涡旋
  write("breathe", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g transform="translate(400 300)"><path d="M 0 0 m -150 0 a 150 150 0 1 1 300 0 a 120 120 0 1 1 -240 0 a 90 90 0 1 1 180 0 a 60 60 0 1 1 -120 0" fill="none" stroke="${P.greenLight}" stroke-width="1" opacity="0.5"/></g><text x="40" y="560" fill="${P.greenLight}" font-size="14" opacity="0.6">Breathe · 3</text>`));
}

// ---------------- 2. Earring Project ----------------
ensureDir("earring-project");
{
  const inner = `
    <rect width="800" height="600" fill="${P.redDeep}"/>
    <rect x="0" y="0" width="800" height="600" fill="url(#g1)"/>
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${P.redDeep}" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="${P.ink}" stop-opacity="0.7"/>
      </linearGradient>
    </defs>
    <!-- 嘴部 -->
    <ellipse cx="400" cy="280" rx="50" ry="20" fill="${P.paper}" opacity="0.6"/>
    <path d="M 360 280 Q 400 295 440 280" fill="none" stroke="${P.redMid}" stroke-width="2"/>
    <!-- 耳环 -->
    <g transform="translate(300 290)">
      <line x1="0" y1="0" x2="0" y2="40" stroke="${P.paper}" stroke-width="0.8"/>
      <polygon points="0,40 -10,60 0,80 10,60" fill="none" stroke="${P.paper}" stroke-width="0.8"/>
    </g>
    <g transform="translate(500 290)">
      <line x1="0" y1="0" x2="0" y2="40" stroke="${P.paper}" stroke-width="0.8"/>
      <polygon points="0,40 -10,60 0,80 10,60" fill="none" stroke="${P.paper}" stroke-width="0.8"/>
    </g>
    <text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.5">24-Year-Old Zodiac Earring Project · 2024</text>
  `;
  write("earring-project", "cover.svg", wrap(800, 600, inner));
  write("earring-project", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.redMid}"/><g fill="${P.paper}" opacity="0.4"><circle cx="300" cy="200" r="40"/><circle cx="500" cy="200" r="40"/><circle cx="400" cy="400" r="40"/></g><text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.5">Earring · 1</text>`));
  write("earring-project", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.red}"/><g stroke="${P.paper}" stroke-width="0.5" fill="none" opacity="0.3"><line x1="0" y1="100" x2="800" y2="100"/><line x1="0" y1="200" x2="800" y2="200"/><line x1="0" y1="300" x2="800" y2="300"/><line x1="0" y1="400" x2="800" y2="400"/><line x1="0" y1="500" x2="800" y2="500"/></g><text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.5">Earring · 2</text>`));
  write("earring-project", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g fill="${P.red}" opacity="0.6"><rect x="100" y="100" width="60" height="60"/><rect x="200" y="150" width="60" height="60"/><rect x="300" y="120" width="60" height="60"/><rect x="400" y="180" width="60" height="60"/><rect x="500" y="130" width="60" height="60"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Earring · 3</text>`));
}

// ---------------- 3. Wanna Say ----------------
ensureDir("wanna-say");
{
  const inner = `
    <rect width="800" height="600" fill="${P.ink}"/>
    <!-- 双通道 -->
    <rect x="60" y="60" width="320" height="480" fill="${P.redDeep}" opacity="0.6"/>
    <rect x="420" y="60" width="320" height="480" fill="${P.redMid}" opacity="0.4"/>
    <!-- 左侧剪影 -->
    <g transform="translate(220 320)" fill="${P.paper}" opacity="0.7">
      <ellipse cx="0" cy="-50" rx="22" ry="28"/>
      <path d="M -30 -20 Q -30 60 0 80 Q 30 60 30 -20 Z"/>
    </g>
    <!-- 右侧多边形 -->
    <g transform="translate(580 300)" fill="none" stroke="${P.paper}" stroke-width="1" opacity="0.6">
      <polygon points="-60,-40 60,-40 90,40 -90,40"/>
      <polygon points="-40,20 40,20 60,80 -60,80"/>
    </g>
    <text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.6">Wanna Say · 2024</text>
  `;
  write("wanna-say", "cover.svg", wrap(800, 600, inner));
  write("wanna-say", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.redDeep}"/><g transform="translate(400 300)" fill="${P.paper}" opacity="0.5"><ellipse cx="-30" cy="-50" rx="22" ry="28"/><ellipse cx="30" cy="-50" rx="22" ry="28"/></g><text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.5">Wanna Say · 1</text>`));
  write("wanna-say", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g stroke="${P.redMid}" stroke-width="0.5" fill="none" opacity="0.6"><line x1="100" y1="100" x2="700" y2="500"/><line x1="700" y1="100" x2="100" y2="500"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Wanna Say · 2</text>`));
  write("wanna-say", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.red}"/><rect x="0" y="0" width="800" height="600" fill="${P.ink}" opacity="0.3"/><g fill="${P.paper}" opacity="0.4"><circle cx="200" cy="300" r="60"/><circle cx="600" cy="300" r="60"/></g><text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.5">Wanna Say · 3</text>`));
}

// ---------------- 4. Red World ----------------
ensureDir("red-world");
{
  const inner = `
    <rect width="800" height="600" fill="${P.red}"/>
    <!-- 山与水的红色拼贴 -->
    <path d="M 0 400 L 200 300 L 350 380 L 500 250 L 650 350 L 800 280 L 800 600 L 0 600 Z" fill="${P.redDeep}" opacity="0.7"/>
    <path d="M 0 450 L 150 420 L 300 460 L 450 420 L 600 450 L 750 420 L 800 450 L 800 600 L 0 600 Z" fill="${P.redMid}" opacity="0.5"/>
    <circle cx="650" cy="120" r="30" fill="${P.paper}" opacity="0.4"/>
    <g fill="${P.paper}" opacity="0.2"><circle cx="100" cy="80" r="3"/><circle cx="250" cy="60" r="2"/><circle cx="400" cy="100" r="3"/><circle cx="550" cy="80" r="2"/></g>
    <text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.6">The Red World · 2024</text>
  `;
  write("red-world", "cover.svg", wrap(800, 600, inner));
  write("red-world", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.redDeep}"/><path d="M 0 350 L 200 250 L 400 320 L 600 230 L 800 300 L 800 600 L 0 600 Z" fill="${P.ink}" opacity="0.4"/><text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.5">Red World · 1</text>`));
  write("red-world", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.redMid}"/><g stroke="${P.paper}" stroke-width="0.3" fill="none" opacity="0.3"><line x1="0" y1="100" x2="800" y2="120"/><line x1="0" y1="200" x2="800" y2="220"/><line x1="0" y1="300" x2="800" y2="310"/><line x1="0" y1="400" x2="800" y2="420"/><line x1="0" y1="500" x2="800" y2="510"/></g><text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.5">Red World · 2</text>`));
  write("red-world", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.red}"/><circle cx="400" cy="300" r="100" fill="${P.redDeep}" opacity="0.5"/><text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.5">Red World · 3</text>`));
}

// ---------------- 5. Blood Light ----------------
ensureDir("blood-light");
{
  const inner = `
    <rect width="800" height="600" fill="${P.ink}"/>
    <!-- 红光 -->
    <g opacity="0.5">
      <ellipse cx="200" cy="300" rx="200" ry="60" fill="${P.redMid}"/>
      <ellipse cx="500" cy="280" rx="250" ry="50" fill="${P.redLight}"/>
      <ellipse cx="650" cy="350" rx="150" ry="40" fill="${P.red}"/>
    </g>
    <!-- 剪影 -->
    <g transform="translate(400 300)" fill="${P.ink}" opacity="0.8">
      <ellipse cx="-40" cy="-30" rx="20" ry="25"/>
      <path d="M -70 0 Q -70 80 -40 100 Q -10 80 -10 0 Z"/>
      <ellipse cx="60" cy="-30" rx="20" ry="25"/>
      <path d="M 30 0 Q 30 80 60 100 Q 90 80 90 0 Z"/>
    </g>
    <text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.6">Blood Light · 2024</text>
  `;
  write("blood-light", "cover.svg", wrap(800, 600, inner));
  write("blood-light", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g fill="${P.red}" opacity="0.6"><rect x="200" y="200" width="400" height="200"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Blood Light · 1</text>`));
  write("blood-light", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.redDeep}"/><g stroke="${P.paper}" stroke-width="0.5" fill="none" opacity="0.3"><path d="M 0 300 Q 200 200 400 300 T 800 300"/></g><text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.5">Blood Light · 2</text>`));
  write("blood-light", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g fill="${P.paper}" opacity="0.4"><ellipse cx="400" cy="300" rx="15" ry="30"/><rect x="385" y="300" width="30" height="100"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Blood Light · 3</text>`));
}

// ---------------- 6. Exhibitions of Red ----------------
ensureDir("exhibitions-of-red");
{
  const inner = `
    <rect width="800" height="600" fill="${P.ink}"/>
    <!-- 散点屏阵 -->
    <g fill="${P.red}" opacity="0.8">
      <rect x="100" y="100" width="80" height="50"/>
      <rect x="200" y="100" width="80" height="50"/>
      <rect x="300" y="100" width="80" height="50"/>
      <rect x="400" y="100" width="80" height="50"/>
      <rect x="500" y="100" width="80" height="50"/>
      <rect x="150" y="170" width="80" height="50"/>
      <rect x="250" y="170" width="80" height="50"/>
      <rect x="350" y="170" width="80" height="50"/>
      <rect x="450" y="170" width="80" height="50"/>
      <rect x="200" y="240" width="80" height="50"/>
      <rect x="300" y="240" width="80" height="50"/>
      <rect x="400" y="240" width="80" height="50"/>
    </g>
    <g fill="${P.redMid}" opacity="0.6">
      <rect x="100" y="350" width="60" height="100"/>
      <rect x="200" y="350" width="60" height="100"/>
      <rect x="300" y="350" width="60" height="100"/>
      <rect x="400" y="350" width="60" height="100"/>
      <rect x="500" y="350" width="60" height="100"/>
      <rect x="600" y="350" width="60" height="100"/>
    </g>
    <text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.6">Exhibitions of Red · 2024</text>
  `;
  write("exhibitions-of-red", "cover.svg", wrap(800, 600, inner));
  write("exhibitions-of-red", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><rect x="200" y="150" width="400" height="250" fill="${P.red}" opacity="0.7"/><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Exhibitions · 1</text>`));
  write("exhibitions-of-red", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g fill="${P.redMid}" opacity="0.5"><rect x="100" y="100" width="100" height="80"/><rect x="250" y="200" width="100" height="80"/><rect x="400" y="300" width="100" height="80"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Exhibitions · 2</text>`));
  write("exhibitions-of-red", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.redDeep}"/><g fill="${P.paper}" opacity="0.3"><rect x="150" y="150" width="500" height="300"/></g><text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.5">Exhibitions · 3</text>`));
}

// ---------------- 7. Color Wheel ----------------
ensureDir("color-wheel");
{
  const inner = `
    <rect width="800" height="600" fill="${P.ink}"/>
    <!-- 玻璃薄膜折射：横向彩条 -->
    <g opacity="0.6">
      <rect x="100" y="200" width="600" height="20" fill="#e87a5a"/>
      <rect x="100" y="230" width="600" height="20" fill="#e8b45a"/>
      <rect x="100" y="260" width="600" height="20" fill="#cfe7d6"/>
      <rect x="100" y="290" width="600" height="20" fill="#5a9bb8"/>
      <rect x="100" y="320" width="600" height="20" fill="#a87b8c"/>
      <rect x="100" y="350" width="600" height="20" fill="#8eb89b"/>
    </g>
    <!-- 高光 -->
    <g opacity="0.3">
      <ellipse cx="200" cy="285" rx="80" ry="60" fill="${P.paper}"/>
      <ellipse cx="500" cy="285" rx="60" ry="50" fill="${P.paper}"/>
    </g>
    <text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.6">Color Wheel · 2024</text>
  `;
  write("color-wheel", "cover.svg", wrap(800, 600, inner));
  write("color-wheel", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g opacity="0.5"><rect x="200" y="150" width="100" height="300" fill="#e87a5a"/><rect x="350" y="150" width="100" height="300" fill="#cfe7d6"/><rect x="500" y="150" width="100" height="300" fill="#5a9bb8"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Color Wheel · 1</text>`));
  write("color-wheel", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.inkSoft}"/><g fill="${P.paper}" opacity="0.2"><polygon points="200,200 400,150 600,200 600,400 400,450 200,400"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Color Wheel · 2</text>`));
  write("color-wheel", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g opacity="0.5"><circle cx="300" cy="300" r="80" fill="none" stroke="#e8b45a" stroke-width="40"/><circle cx="500" cy="300" r="80" fill="none" stroke="#5a9bb8" stroke-width="40"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Color Wheel · 3</text>`));
}

// ---------------- 8. Two Trees ----------------
ensureDir("two-trees");
{
  const inner = `
    <rect width="800" height="600" fill="${P.blueDeep}"/>
    <!-- 两棵树状抽象 -->
    <g transform="translate(250 350)" opacity="0.7">
      <rect x="-8" y="0" width="16" height="200" fill="${P.green}"/>
      <rect x="-50" y="-20" width="100" height="30" fill="${P.greenLight}" transform="rotate(-15)"/>
      <rect x="-50" y="-50" width="100" height="20" fill="${P.greenLight}" transform="rotate(-25)"/>
    </g>
    <g transform="translate(550 350)" opacity="0.7">
      <rect x="-8" y="0" width="16" height="200" fill="${P.teal}"/>
      <rect x="-50" y="-20" width="100" height="30" fill="${P.mint}" transform="rotate(15)"/>
      <rect x="-50" y="-50" width="100" height="20" fill="${P.mint}" transform="rotate(25)"/>
    </g>
    <g fill="${P.paper}" opacity="0.3">
      <circle cx="200" cy="200" r="3"/><circle cx="600" cy="200" r="3"/>
      <circle cx="400" cy="150" r="2"/>
    </g>
    <text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.6">Seems Like Two Trees · 2024</text>
  `;
  write("two-trees", "cover.svg", wrap(800, 600, inner));
  write("two-trees", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.blue}"/><g transform="translate(400 350)" opacity="0.6"><rect x="-8" y="0" width="16" height="200" fill="${P.greenLight}"/><rect x="-60" y="-30" width="120" height="25" fill="${P.mint}" transform="rotate(-10)"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Two Trees · 1</text>`));
  write("two-trees", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.blueDeep}"/><g stroke="${P.greenLight}" stroke-width="2" fill="none" opacity="0.5"><path d="M 100 500 L 200 300 L 300 500"/><path d="M 500 500 L 600 300 L 700 500"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Two Trees · 2</text>`));
  write("two-trees", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g fill="${P.mint}" opacity="0.4"><rect x="200" y="200" width="50" height="50" transform="rotate(20 225 225)"/><rect x="550" y="200" width="50" height="50" transform="rotate(-20 575 225)"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Two Trees · 3</text>`));
}

// ---------------- 9. Moi ----------------
ensureDir("moi");
{
  const inner = `
    <rect width="800" height="600" fill="${P.ink}"/>
    <!-- 红蓝重复书写 -->
    <g font-family="serif" font-size="100" font-style="italic" text-anchor="middle">
      <text x="200" y="200" fill="${P.redMid}" opacity="0.8">moi</text>
      <text x="350" y="280" fill="${P.blue}" opacity="0.6">moi</text>
      <text x="500" y="360" fill="${P.red}" opacity="0.7">moi</text>
      <text x="300" y="440" fill="${P.pink}" opacity="0.5">moi</text>
      <text x="550" y="500" fill="${P.redLight}" opacity="0.6">moi</text>
    </g>
    <text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.6">Moi · 2024</text>
  `;
  write("moi", "cover.svg", wrap(800, 600, inner));
  write("moi", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g font-family="serif" font-size="80" font-style="italic"><text x="300" y="300" fill="${P.red}" opacity="0.7">moi</text></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Moi · 1</text>`));
  write("moi", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.inkSoft}"/><g font-family="serif" font-size="120" font-style="italic" text-anchor="middle"><text x="400" y="380" fill="${P.blue}" opacity="0.5">moi</text></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Moi · 2</text>`));
  write("moi", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g font-family="serif" font-size="60" font-style="italic" text-anchor="middle"><text x="200" y="150" fill="${P.red}" opacity="0.5">moi</text><text x="600" y="500" fill="${P.blue}" opacity="0.5">moi</text></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Moi · 3</text>`));
}

// ---------------- 10. Color Cards ----------------
ensureDir("color-cards");
{
  const inner = `
    <rect width="800" height="600" fill="${P.inkSoft}"/>
    <!-- 6x6 色卡矩阵 -->
    ${(() => {
      const palette = ["#e87a5a", "#e8b45a", "#cfe7d6", "#a8d8e8", "#5a9bb8", "#a87b8c", "#8eb89b", "#c97b8c", "#d4a8e8", "#e8d4a8", "#a8e8d4", "#e8a8c4", "#b8a8e8", "#a8c4e8", "#e8c4a8", "#c4e8a8"];
      let cards = "";
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          const x = 200 + j * 70;
          const y = 100 + i * 70;
          cards += `<rect x="${x}" y="${y}" width="60" height="60" fill="${palette[(i*6+j) % palette.length]}" opacity="0.85"/>`;
        }
      }
      return cards;
    })()}
    <text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.6">Color Cards · 2024</text>
  `;
  write("color-cards", "cover.svg", wrap(800, 600, inner));
  write("color-cards", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/>${(()=>{let s="";for(let i=0;i<10;i++){for(let j=0;j<10;j++){const colors=["#e87a5a","#e8b45a","#cfe7d6","#a8d8e8","#a87b8c","#8eb89b","#c97b8c","#d4a8e8"];s+=`<rect x="${100+i*60}" y="${100+j*40}" width="50" height="30" fill="${colors[(i*10+j)%colors.length]}" opacity="0.7"/>`;}}return s;})()}<text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Color Cards · 1</text>`));
  write("color-cards", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.inkSoft}"/><g opacity="0.6"><rect x="200" y="200" width="100" height="200" fill="#e87a5a"/><rect x="350" y="200" width="100" height="200" fill="#5a9bb8"/><rect x="500" y="200" width="100" height="200" fill="#8eb89b"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Color Cards · 2</text>`));
  write("color-cards", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/>${(()=>{let s="";for(let i=0;i<8;i++){for(let j=0;j<8;j++){const colors=["#cfe7d6","#a8d8e8","#e8b45a","#a87b8c","#c97b8c"];s+=`<rect x="${150+i*65}" y="${100+j*50}" width="55" height="40" fill="${colors[(i+j)%colors.length]}" opacity="0.5"/>`;}}return s;})()}<text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Color Cards · 3</text>`));
}

// ---------------- 11. Have a Nice Day ----------------
ensureDir("have-a-nice-day");
{
  const inner = `
    <rect width="800" height="600" fill="${P.ink}"/>
    <!-- 激光/理发椅/眼 -->
    <g transform="translate(400 320)">
      <!-- 椅背 -->
      <rect x="-30" y="-50" width="60" height="120" fill="${P.amber}" opacity="0.5"/>
      <!-- 头枕 -->
      <ellipse cx="0" cy="-80" rx="40" ry="20" fill="${P.amber}" opacity="0.4"/>
      <!-- 眼睑（闭合） -->
      <path d="M -30 -60 Q 0 -40 30 -60" fill="none" stroke="${P.red}" stroke-width="2"/>
      <path d="M -30 -60 Q 0 -80 30 -60" fill="none" stroke="${P.red}" stroke-width="1" opacity="0.5"/>
      <!-- 激光线 -->
      <line x1="-200" y1="-60" x2="0" y2="-60" stroke="${P.accent}" stroke-width="0.8" opacity="0.7"/>
      <line x1="0" y1="-60" x2="200" y2="-60" stroke="${P.accent}" stroke-width="0.8" opacity="0.7"/>
    </g>
    <g fill="${P.paper}" opacity="0.2">
      <circle cx="200" cy="200" r="2"/><circle cx="600" cy="200" r="2"/>
    </g>
    <text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.6">Have a Nice Day · 2024</text>
  `;
  write("have-a-nice-day", "cover.svg", wrap(800, 600, inner));
  write("have-a-nice-day", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g transform="translate(400 300)"><circle r="100" fill="none" stroke="${P.amber}" stroke-width="2" opacity="0.5"/><path d="M -30 0 Q 0 20 30 0" fill="none" stroke="${P.red}" stroke-width="3"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">HND · 1</text>`));
  write("have-a-nice-day", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><line x1="0" y1="300" x2="800" y2="300" stroke="${P.accent}" stroke-width="2" opacity="0.6"/><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">HND · 2</text>`));
  write("have-a-nice-day", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.redDeep}"/><g transform="translate(400 300)" opacity="0.7"><ellipse rx="80" ry="40" fill="${P.paper}"/><ellipse rx="40" ry="20" fill="${P.redMid}"/></g><text x="40" y="560" fill="${P.paper}" font-size="14" opacity="0.5">HND · 3</text>`));
}

// ---------------- 13. Weaving Strings ----------------
ensureDir("weaving-strings");
{
  const inner = `
    <rect width="800" height="600" fill="${P.ink}"/>
    <!-- 经纬网格 -->
    <g stroke="${P.greenLight}" stroke-width="0.3" opacity="0.4">
      ${(()=>{let s="";for(let i=0;i<=20;i++){s+=`<line x1="${100+i*30}" y1="100" x2="${100+i*30}" y2="500"/>`;}return s;})()}
      ${(()=>{let s="";for(let i=0;i<=15;i++){s+=`<line x1="100" y1="${100+i*30}" x2="700" y2="${100+i*30}"/>`;}return s;})()}
    </g>
    <!-- 节点（光纤） -->
    <g fill="${P.mint}" opacity="0.7">
      <circle cx="250" cy="220" r="3"/>
      <circle cx="400" cy="280" r="4"/>
      <circle cx="550" cy="340" r="3"/>
      <circle cx="310" cy="370" r="3"/>
      <circle cx="490" cy="430" r="3"/>
    </g>
    <g fill="${P.accent}" opacity="0.5">
      <circle cx="400" cy="280" r="6"/>
    </g>
    <text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.6">Weaving Strings · 2024</text>
  `;
  write("weaving-strings", "cover.svg", wrap(800, 600, inner));
  write("weaving-strings", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g stroke="${P.mint}" stroke-width="0.3" opacity="0.4">${(()=>{let s="";for(let i=0;i<=15;i++){s+=`<line x1="${100+i*40}" y1="100" x2="${100+i*40}" y2="500"/>`;}return s;})()}</g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Weaving · 1</text>`));
  write("weaving-strings", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.inkSoft}"/><g stroke="${P.greenLight}" stroke-width="1" fill="none" opacity="0.5"><line x1="100" y1="200" x2="700" y2="200"/><line x1="100" y1="300" x2="700" y2="300"/><line x1="100" y1="400" x2="700" y2="400"/></g><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Weaving · 2</text>`));
  write("weaving-strings", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.ink}"/><g fill="${P.mint}" opacity="0.6"><circle cx="300" cy="200" r="3"/><circle cx="500" cy="300" r="3"/><circle cx="400" cy="400" r="3"/></g><line x1="300" y1="200" x2="500" y2="300" stroke="${P.greenLight}" stroke-width="0.5" opacity="0.5"/><line x1="500" y1="300" x2="400" y2="400" stroke="${P.greenLight}" stroke-width="0.5" opacity="0.5"/><text x="40" y="560" fill="${P.paperDim}" font-size="14" opacity="0.5">Weaving · 3</text>`));
}

// ---------------- 14. Film Notes ----------------
ensureDir("film-notes");
{
  const inner = `
    <rect width="800" height="600" fill="${P.paperDim}"/>
    <!-- 胶片孔 -->
    <g fill="${P.ink}">
      ${(()=>{let s="";for(let i=0;i<12;i++){s+=`<rect x="${20+i*65}" y="20" width="20" height="20"/><rect x="${20+i*65}" y="560" width="20" height="20"/>`;}return s;})()}
    </g>
    <!-- 三张胶片画面 -->
    <g>
      <rect x="80" y="100" width="180" height="400" fill="${P.inkSoft}"/>
      <text x="170" y="300" text-anchor="middle" fill="${P.paper}" font-size="14" opacity="0.5">Contax Tvs</text>
      <rect x="310" y="100" width="180" height="400" fill="${P.ink}"/>
      <text x="400" y="300" text-anchor="middle" fill="${P.paper}" font-size="14" opacity="0.5">VISTA 200</text>
      <rect x="540" y="100" width="180" height="400" fill="${P.inkSoft}"/>
      <text x="630" y="300" text-anchor="middle" fill="${P.paper}" font-size="14" opacity="0.5">FUJIFILM 200</text>
    </g>
  `;
  write("film-notes", "cover.svg", wrap(800, 600, inner));
  write("film-notes", "1.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.paperDim}"/><g><rect x="100" y="150" width="600" height="300" fill="${P.inkSoft}"/><text x="400" y="310" text-anchor="middle" fill="${P.paper}" font-size="20" opacity="0.4">Frame 01</text></g><text x="40" y="560" fill="${P.ink}" font-size="14" opacity="0.5">Film · 1</text>`));
  write("film-notes", "2.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.paperDim}"/><g><rect x="100" y="150" width="600" height="300" fill="${P.ink}"/><text x="400" y="310" text-anchor="middle" fill="${P.paper}" font-size="20" opacity="0.4">Frame 02</text></g><text x="40" y="560" fill="${P.ink}" font-size="14" opacity="0.5">Film · 2</text>`));
  write("film-notes", "3.svg", wrap(800, 600, `<rect width="800" height="600" fill="${P.paperDim}"/><g><rect x="100" y="150" width="600" height="300" fill="${P.inkSoft}"/><text x="400" y="310" text-anchor="middle" fill="${P.paper}" font-size="20" opacity="0.4">Frame 03</text></g><text x="40" y="560" fill="${P.ink}" font-size="14" opacity="0.5">Film · 3</text>`));
}

console.log("Generated SVG covers for all 14 works.");
console.log("Works:", fs.readdirSync(ROOT).filter(f => fs.statSync(path.join(ROOT, f)).isDirectory()).join(", "));
