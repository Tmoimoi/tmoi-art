import { useState } from "react";
import type { Medium, Work } from "@/lib/types";
import { MEDIUM_LABELS, MEDIUM_ORDER } from "@/lib/types";
import WorkCard from "./WorkCard";
import { Reveal } from "./Reveal";

// 作品列表：可按媒介筛选（图像 / 影像 / 互动 / 声音）
export default function WorksGrid({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState<Medium | "all">("all");
  const filtered =
    filter === "all" ? works : works.filter((w) => w.mediums.includes(filter));
  const tabs: (Medium | "all")[] = ["all", ...MEDIUM_ORDER];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={`rounded-full border px-4 py-1.5 text-xs tracking-widest2 transition-colors ${
              filter === t
                ? "border-accent text-accent"
                : "border-white/15 text-paper-dim hover:text-paper"
            }`}
          >
            {t === "all" ? "全部" : MEDIUM_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w, i) => (
          <Reveal key={w.id} delay={i * 0.05}>
            <WorkCard work={w} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-paper-dim">该类别暂无作品。</p>
      )}
    </div>
  );
}
