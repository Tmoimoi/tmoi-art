"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { WorkCard } from "@/components/WorkCard";
import {
  FORM_LABELS,
  FORM_ORDER,
  MEDIUM_LABELS,
  MEDIUM_ORDER,
  SERIES,
  type Form,
  type Medium,
  type SeriesId,
} from "@/lib/types";
import { getAllWorks } from "@/lib/works";

type MediumFilter = Medium | "all";
type SeriesFilter = SeriesId | "all";
type FormFilter = Form | "all";

export default function WorksPage() {
  const works = getAllWorks();

  const [medium, setMedium] = useState<MediumFilter>("all");
  const [series, setSeries] = useState<SeriesFilter>("all");
  const [form, setForm] = useState<FormFilter>("all");

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: works.length };
    for (const x of MEDIUM_ORDER) m[x] = works.filter((w) => w.mediums.includes(x)).length;
    const s: Record<string, number> = { all: works.length };
    for (const x of SERIES) s[x.id] = works.filter((w) => w.series.includes(x.id)).length;
    const f: Record<string, number> = { all: works.length };
    for (const x of FORM_ORDER) f[x] = works.filter((w) => w.form === x).length;
    return { m, s, f };
  }, [works]);

  const filtered = useMemo(
    () =>
      works.filter((w) => {
        if (medium !== "all" && !w.mediums.includes(medium)) return false;
        if (series !== "all" && !w.series.includes(series)) return false;
        if (form !== "all" && w.form !== form) return false;
        return true;
      }),
    [works, medium, series, form]
  );

  // 当用户按了系列筛选时，关闭"按系列分组"
  const groupBySeries = series === "all";

  const grouped = useMemo(() => {
    if (!groupBySeries) {
      return [{ id: "all" as const, name: "作品", nameEn: "Works", blurb: undefined as string | undefined, works: filtered }];
    }
    return SERIES.map((s) => ({
      id: s.id as SeriesId,
      name: s.name,
      nameEn: s.nameEn,
      blurb: s.blurb,
      works: filtered.filter((w) => w.series.includes(s.id)),
    })).filter((g) => g.works.length > 0);
  }, [filtered, groupBySeries]);

  return (
    <div className="container-x pb-28 pt-28">
      <header className="mb-10">
        <p className="eyebrow">作品索引 · Index</p>
        <h1 className="heading-serif mt-3 text-4xl sm:text-5xl">作品</h1>
        <p className="mt-4 max-w-xl text-paper-dim">
          按媒介 / 系列 / 形态三个维度交叉筛选。共 {works.length} 件作品，按 5 个系列组织。
        </p>
      </header>

      {/* 三个筛选轴 */}
      <div className="mb-10 space-y-3">
        <FilterRow
          label="媒介"
          current={medium}
          onChange={setMedium}
          options={[
            { key: "all", label: "全部", count: counts.m.all },
            ...MEDIUM_ORDER.map((m) => ({ key: m, label: MEDIUM_LABELS[m], count: counts.m[m] })),
          ]}
        />
        <FilterRow
          label="系列"
          current={series}
          onChange={setSeries}
          options={[
            { key: "all", label: "全部", count: counts.s.all },
            ...SERIES.map((s) => ({ key: s.id, label: s.name, count: counts.s[s.id] })),
          ]}
        />
        <FilterRow
          label="形态"
          current={form}
          onChange={setForm}
          options={[
            { key: "all", label: "全部", count: counts.f.all },
            ...FORM_ORDER.map((f) => ({ key: f, label: FORM_LABELS[f], count: counts.f[f] })),
          ]}
        />
      </div>

      {/* 网格 / 分组 */}
      {grouped.map((g) => (
        <section key={g.id} className="mb-16">
          {groupBySeries && (
            <div className="mb-6 border-b border-white/10 pb-3">
              <h2 className="heading-serif text-2xl">
                {g.name}{" "}
                <span className="text-sm uppercase tracking-widest text-paper-dim">
                  {g.nameEn}
                </span>
              </h2>
              {g.blurb && (
                <p className="mt-1 text-sm text-paper-dim">{g.blurb}</p>
              )}
            </div>
          )}
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {g.works.map((work) => (
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
        </section>
      ))}

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-paper-dim">该组合下暂无作品。</p>
      )}

      <div className="mt-16">
        <Link href="/" className="link-underline text-sm text-paper/80">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  current,
  onChange,
  options,
}: {
  label: string;
  current: T;
  onChange: (v: T) => void;
  options: { key: T; label: string; count: number }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1 min-w-[3rem]">{label}</span>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          aria-pressed={current === o.key}
          className={`chip ${current === o.key ? "chip-active" : ""}`}
        >
          {o.label}
          <span className="ml-1.5 text-[10px] opacity-60">{o.count}</span>
        </button>
      ))}
    </div>
  );
}
