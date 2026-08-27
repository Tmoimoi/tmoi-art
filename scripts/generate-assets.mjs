// 占位素材生成脚本（纯 Node，无需依赖）
// - 为每个作品生成艺术感 SVG 封面与画廊图
// - 生成可循环的氛围声 WAV（合成器低频声景，整数周期保证无缝循环）
// - 若系统有 ffmpeg，生成一段占位 MP4 视频；否则跳过并提示
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public", "works");
const works = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src", "data", "works.json"), "utf-8")
);

// ---------- SVG 生成 ----------
function svg(seed, w = 1200, h = 900) {
  const rnd = mulberry(seed);
  const hue = 18 + Math.floor(rnd() * 30); // 橙系
  const blobs = Array.from({ length: 5 + Math.floor(rnd() * 4) }, () => {
    const cx = Math.floor(rnd() * w);
    const cy = Math.floor(rnd() * h);
    const r = 40 + Math.floor(rnd() * 220);
    const o = (0.05 + rnd() * 0.25).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="hsl(${hue},90%,55%)" opacity="${o}"/>`;
  }).join("");
  const lines = Array.from({ length: 6 + Math.floor(rnd() * 6) }, () => {
    const x1 = Math.floor(rnd() * w);
    const y1 = Math.floor(rnd() * h);
    const x2 = Math.floor(rnd() * w);
    const y2 = Math.floor(rnd() * h);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="hsl(40,20%,80%)" stroke-width="1" opacity="0.12"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="g" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="#1a1714"/>
      <stop offset="60%" stop-color="#0e0d0c"/>
      <stop offset="100%" stop-color="#050505"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  ${lines}
  ${blobs}
</svg>`;
}

function mulberry(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- WAV 生成（氛围声景）----------
function makeWav() {
  const SR = 44100;
  const DUR = 8;
  const N = SR * DUR;
  const buf = Buffer.alloc(44 + N * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + N * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(N * 2, 40);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    let s = 0;
    s += 0.5 * Math.sin(2 * Math.PI * 110 * t); // 整数周期 → 无缝循环
    s += 0.3 * Math.sin(2 * Math.PI * 165 * t);
    s += 0.2 * Math.sin(2 * Math.PI * 220 * t);
    const lfo = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.25 * t);
    s *= lfo * 0.22;
    const v = Math.max(-1, Math.min(1, s));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  return buf;
}

// ---------- 执行 ----------
let count = 0;
works.forEach((w, idx) => {
  const dir = path.join(PUBLIC, w.slug);
  fs.mkdirSync(dir, { recursive: true });

  const coverPath = path.join(dir, "cover.svg");
  if (!fs.existsSync(coverPath)) {
    fs.writeFileSync(coverPath, svg(idx * 7 + 1));
    count++;
  }
  (w.images || []).forEach((_, i) => {
    const p = path.join(dir, `${i + 1}.svg`);
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, svg(idx * 13 + i * 5 + 3));
      count++;
    }
  });
  if (w.audio?.src) {
    const ap = path.join(ROOT, "public", w.audio.src);
    if (!fs.existsSync(ap)) {
      fs.mkdirSync(path.dirname(ap), { recursive: true });
      fs.writeFileSync(ap, makeWav());
      count++;
      console.log("  · 生成氛围声:", w.audio.src);
    }
  }
});

// ---------- 视频占位 ----------
let ffmpegOk = false;
try {
  execSync("ffmpeg -version", { stdio: "ignore" });
  ffmpegOk = true;
} catch {
  ffmpegOk = false;
}

works.forEach((w) => {
  if (!w.video) return;
  const vp = path.join(ROOT, "public", w.video);
  if (fs.existsSync(vp)) return;
  if (!ffmpegOk) {
    console.log(
      `  · 跳过视频占位（无 ffmpeg）: ${w.video} —— 用真实视频替换即可`
    );
    return;
  }
  fs.mkdirSync(path.dirname(vp), { recursive: true });
  try {
    execSync(
      `ffmpeg -y -f lavfi -i "testsrc=size=1280x720:rate=25:duration=6" -pix_fmt yuv420p "${vp}"`,
      { stdio: "ignore" }
    );
    console.log("  · 生成占位视频:", w.video);
  } catch (e) {
    console.log("  · 视频生成失败:", w.video);
  }
});

console.log(`\n占位素材生成完成（新增 ${count} 个文件）。ffmpeg 可用: ${ffmpegOk}`);
