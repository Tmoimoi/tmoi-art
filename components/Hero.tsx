"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroBackground = dynamic(() => import("./HeroBackground"), {
  ssr: false,
});

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* 生成式视觉背景 */}
      <HeroBackground />

      {/* 暗化 + 颗粒，保证文字可读 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink" />
      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-[0.06] animate-grain" />

      <div className="container-x relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="eyebrow"
        >
          Tmoi · 个人作品
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.25 }}
          className="heading-serif mt-5 max-w-4xl text-balance text-4xl leading-[1.1] sm:text-6xl lg:text-7xl"
        >
          把注意力，
          <br />
          留給作品本身。
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.5 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-paper/80 sm:text-lg"
        >
          这里收录影像、生成艺术、网页互动与声音装置。
          暗色、克制、有呼吸感——像走进一间没有解说词的展厅。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/works"
            className="rounded-full bg-accent px-7 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            进入作品
          </Link>
          <Link href="/about" className="btn-ghost">
            关于艺术家
          </Link>
        </motion.div>
      </div>

      {/* 滚动提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-widest2 text-paper-dim"
      >
        <span className="flex flex-col items-center gap-2">
          向下滚动
          <span className="block h-8 w-px bg-gradient-to-b from-paper-dim to-transparent" />
        </span>
      </motion.div>
    </section>
  );
}
