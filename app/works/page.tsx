"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { WorkCard } from "@/components/WorkCard";
import { MEDIUM_LABELS, MEDIUM_ORDER, type Medium } from "@/lib/types";
import { getAllWorks } from "@/lib/works";

type Filter = Medium | "all";

export default function WorksPage() {
  const works = getAllWorks();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: works.length };
    for (const m of MEDIUM_ORDER) {
      c[m] = works.filter((w) => w.mediums.includes(m)).length;
    }
    return c;
  }, [works]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? works
        : works.filter((w) => w.mediums.includes(filter)),
    [works, filter]
  );

  const chips: { key: Filter; label: string }[] = [
    { key: "all", label: "全部" },
    ...MEDIUM_ORDER.map((m) => ({ key: m, label: MEDIUM_LABELS[m] })),
  ];

  return (
    <div className="container-x pb-28 pt-28">
      <header className="mb-10">
        <p className="eyebrow">作品索引 · Index</p>
        <h1 className="heading-serif mt-3 text-4xl sm:text-5xl">作品</h1>
        <p className="mt-4 max-w-xl text-paper-dim">
          按媒介筛选。每件作品都可能包含文字、图像、影像、网页互动或声音——
          这里按它所“主要属于”的媒介来归类。
        </p>
      </header>

      {/* 筛选 */}
      <div className="mb-10 flex flex-wrap gap-2.5">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilter(c.key)}
            aria-pressed={filter === c.key}
            className={`chip ${filter === c.key ? "chip-active" : ""}`}
          >
            {c.label}
            <span className="ml-1.5 text-[10px] opacity-60">
              {counts[c.key]}
            </span>
          </button>
        ))}
      </div>

      {/* 网格 + 过渡动画 */}
      <motion.div
        layout
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((work) => (
            <motion.div
              key={work.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <WorkCard work={work} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-paper-dim">该媒介下暂无作品。</p>
      )}

      <div className="mt-16">
        <Link href="/" className="link-underline text-sm text-paper/80">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
