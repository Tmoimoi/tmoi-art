import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const EXHIBITIONS = [
  { year: "2026", title: "像素花园 · 个展", place: "TMOI 线上空间" },
  { year: "2025", title: "回声之境 · 群展", place: "上海 · 数字艺术周" },
  { year: "2024", title: "静默山脉 · 摄影展", place: "青海 · 祁连" },
];

export const metadata = { title: "关于", description: "艺术家 TMOI 的简历与展览经历。" };

export default function AboutPage() {
  return (
    <div className="container-x pb-28 pt-28">
      <Reveal>
        <p className="eyebrow">关于 · About</p>
        <h1 className="heading-serif mt-3 text-4xl sm:text-5xl">TMOI</h1>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="max-w-2xl space-y-5 text-base leading-relaxed text-paper/85">
            <p>
              TMOI 是一位以“安静”为方法的创作者，工作横跨摄影、生成艺术、
              影像与声音装置。比起声嘶力竭的表达，更在意一件作品在沉默中
              如何被观看、被听见。
            </p>
            <p>
              近年来专注于把展厅搬进浏览器：让三维星群、可操作的粒子、
              需要主动开启的声音，成为任何人都能在任何设备上走进的房间。
              技术于我而言不是炫技，而是另一种“留白”的方式。
            </p>
            <p>
              如果某件作品让你多停留了几秒，那便是它存在过的证据。
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4">展览经历 · Exhibitions</p>
            <ul className="space-y-4">
              {EXHIBITIONS.map((e) => (
                <li
                  key={e.title}
                  className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4"
                >
                  <span className="text-sm text-paper/85">{e.title}</span>
                  <span className="text-right text-xs text-paper-dim">
                    {e.year}
                    <br />
                    {e.place}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-16">
          <Link
            href="/contact"
            className="rounded-full bg-accent px-7 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            合作与联系 →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
