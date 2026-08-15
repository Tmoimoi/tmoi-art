// 生成示例占位 SVG 艺术作品（确定性随机，无需任何依赖）。
// 用法：node scripts/generate-svgs.mjs
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "public", "works");

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = {
  echo: { bg: "#0a0a0a", cols: ["#ff5a1f", "#ff7a47", "#f5f2ec"] },
  silent: { bg: "#0c0c0d", cols: ["#34424a", "#6b7b82", "#aab4b8"] },
  tide: { bg: "#0a0d12", cols: ["#1f6f8b", "#3aa6c2", "#bfe9f2"] },
  pixel: { bg: "#080808", cols: ["#ff5a1f", "#ffae6b", "#f5f2ec"] },
};

function defs(id, cols, bg) {
  return `<defs>
    <radialGradient id="g${id}" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="${cols[1]}" stop-opacity="0.20"/>
      <stop offset="55%" stop-color="${bg}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
  </defs>`;
}

function drawEcho(rnd, cols, W, H) {
  const cx = W * 0.5,
    cy = H * 0.45;
  let s = "";
  for (let i = 0; i < 7; i++) {
    const r = (Math.min(W, H) / 2) * (0.18 + i * 0.11);
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${
      cols[i % 2 ? 0 : 2]
    }" stroke-opacity="${0.10 + (7 - i) * 0.02}" stroke-width="1"/>`;
  }
  // 星点
  for (let i = 0; i < 220; i++) {
    const a = rnd() * Math.PI * 2;
    const rr = Math.sqrt(rnd()) * (Math.min(W, H) / 2) * 0.92;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr * 0.92;
    const rad = rnd() * 2.2 + 0.4;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(
      1
    )}" fill="${cols[2]}" fill-opacity="${(rnd() * 0.7 + 0.2).toFixed(2)}"/>`;
  }
  return s;
}

function drawSilent(rnd, cols, W, H) {
  let s = "";
  const layers = 4;
  for (let l = 0; l < layers; l++) {
    const base = H * (0.55 + l * 0.12);
    const amp = H * (0.18 - l * 0.025);
    let d = `M0 ${H} L0 ${base}`;
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const x = (W / steps) * i;
      const y = base - Math.abs(Math.sin(i * 1.3 + l) * amp) - rnd() * amp * 0.4;
      d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
    }
    d += ` L${W} ${H} Z`;
    s += `<path d="${d}" fill="${cols[l % cols.length]}" fill-opacity="${
      0.25 + l * 0.18
    }"/>`;
  }
  // 太阳/月
  s += `<circle cx="${W * 0.72}" cy="${H * 0.28}" r="${H * 0.07}" fill="${
    cols[2]
  }" fill-opacity="0.5"/>`;
  return s;
}

function drawTide(rnd, cols, W, H) {
  let s = "";
  for (let b = 0; b < 9; b++) {
    const y0 = H * (0.2 + b * 0.075);
    let d = `M0 ${y0}`;
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const x = (W / steps) * i;
      const y =
        y0 +
        Math.sin(i * 0.35 + b * 0.6) * 14 +
        Math.sin(i * 0.11 + b) * 8;
      d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
    }
    s += `<path d="${d}" fill="none" stroke="${
      cols[b % cols.length]
    }" stroke-opacity="${(0.18 + b * 0.06).toFixed(2)}" stroke-width="2"/>`;
  }
  return s;
}

function drawPixel(rnd, cols, W, H) {
  let s = "";
  const cols2 = 26,
    rows = Math.round((cols2 * H) / W);
  const cw = W / cols2,
    ch = H / rows;
  const cx = cols2 / 2,
    cy = rows / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols2; c++) {
      const dx = (c - cx) / cx,
        dy = (r - cy) / cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const bloom = Math.max(0, 1 - d * (0.8 + rnd() * 0.4));
      if (bloom <= 0.02) continue;
      const rad = (Math.min(cw, ch) / 2) * (0.3 + bloom * 0.9);
      const col = bloom > 0.66 ? cols[0] : bloom > 0.33 ? cols[1] : cols[2];
      s += `<circle cx="${((c + 0.5) * cw).toFixed(1)}" cy="${(
        (r + 0.5) *
        ch
      ).toFixed(1)}" r="${rad.toFixed(1)}" fill="${col}" fill-opacity="${(
        0.2 +
        bloom * 0.7
      ).toFixed(2)}"/>`;
    }
  }
  return s;
}

const DRAW = {
  echo: drawEcho,
  silent: drawSilent,
  tide: drawTide,
  pixel: drawPixel,
};

function makeSvg(kind, seed, W = 1200, H = 800) {
  const { bg, cols } = PALETTES[kind];
  const rnd = mulberry32(seed);
  const id = `${kind}${seed}`;
  const inner = DRAW[kind](rnd, cols, W, H);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs(id, cols, bg)}
  <rect width="${W}" height="${H}" fill="url(#bg${id})"/>
  <rect width="${W}" height="${H}" fill="url(#g${id})"/>
  ${inner}
</svg>`;
}

// 生成计划：[kind, folder, [seeds]]
const plan = [
  ["echo", "echo-realm", [1, 11, 22, 33]],
  ["silent", "silent-range", [2, 12, 23, 34]],
  ["tide", "tide", [3]],
  ["pixel", "pixel-garden", [4]],
];

for (const [kind, folder, seeds] of plan) {
  const dir = join(root, folder);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  seeds.forEach((seed, i) => {
    const name = i === 0 ? "cover.svg" : `${i}.svg`;
    writeFileSync(join(dir, name), makeSvg(kind, seed));
  });
}

console.log("SVG 占位图已生成。");
