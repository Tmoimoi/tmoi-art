// 程序化生成示例氛围声 WAV（无需任何依赖）。
// 用法：node scripts/generate-audio.mjs
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "public", "works", "echo-realm", "ambient.wav");

const SR = 22050; // 采样率（较低以控制体积）
const DUR = 12; // 秒
const N = SR * DUR;

// 简易一阶低通噪声
let lp = 0;
const data = new Float32Array(N);

// 几个略有失谐的谐波，构成温暖的低频声景
const partials = [
  { f: 110.0, g: 0.5 },
  { f: 110.3, g: 0.35 }, // 轻微拍频
  { f: 164.8, g: 0.22 }, // 大三度
  { f: 220.0, g: 0.18 },
  { f: 277.2, g: 0.12 }, // 五度
];

let max = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  // 缓慢起伏的整体振幅（LFO）
  const lfo = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.05 * t);
  let s = 0;
  for (const p of partials) {
    s += p.g * Math.sin(2 * Math.PI * p.f * t);
  }
  // 低通噪声（海风/空气感）
  const noise = Math.random() * 2 - 1;
  lp += (noise - lp) * 0.02;
  s += 0.06 * lp;
  s *= lfo * 0.5;
  data[i] = s;
  if (Math.abs(s) > max) max = Math.abs(s);
}

// 归一化到 -0.9..0.9
const norm = 0.9 / (max || 1);
for (let i = 0; i < N; i++) data[i] *= norm;

// 写入 16-bit PCM WAV（mono）
const buffer = Buffer.alloc(44 + N * 2);
buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + N * 2, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(1, 22); // channels
buffer.writeUInt32LE(SR, 24);
buffer.writeUInt32LE(SR * 2, 28); // byte rate
buffer.writeUInt16LE(2, 32); // block align
buffer.writeUInt16LE(16, 34); // bits
buffer.write("data", 36);
buffer.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) {
  const v = Math.max(-1, Math.min(1, data[i]));
  buffer.writeInt16LE((v * 32767) | 0, 44 + i * 2);
}

writeFileSync(out, buffer);
console.log(`已生成 ${out}（${(buffer.length / 1024).toFixed(0)} KB）`);
