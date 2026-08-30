"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { WorkCard } from "@/components/WorkCard";
import { LangText } from "@/components/LangText";
import { useLang } from "@/components/LanguageProvider";
import {
  FORM_LABELS,
  FORM_ORDER,
  MEDIUM_LABELS,
  MEDIUM_ORDER,
  SERIES,
  getSeries,
  type Form,
  type Medium,
  type SeriesId,
} from "@/lib/types";
import { MEDIUM_LABELS_EN, FORM_LABELS_EN, UI } from "@/lib/i18n";
import { getAllWorks } from "@/lib/works";

type MediumFilter = Medium | "all";
type SeriesFilter = SeriesId | "all";
type FormFilter = Form | "all";

export default function WorksPage() {
  const works = getAllWorks();
  const { lang } = useLang();

  const [medium, setMedium] = useState<MediumFilter>("all");
  const [series, setSeries] = useState<SeriesFilter>("all");
  const [form, setForm] = useState<FormFilter>("all");

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

  const groupBySeries = series === "all";

  const grouped = useMemo(() => {
    if (!groupBySeries) {
      const s = getSeries(series);
      if (!s) return [];
      return [
        {
          id: s.id,
          name: s.name,
          nameEn: s.nameEn,
          blurb: s.blurb,
          blurbEn: s.blurbEn,
          works: filtered,
        },
      ];
    }
    return SERIES.map((s) => ({
      id: s.id as SeriesId,
      name: s.name,
      nameEn: s.nameEn,
      blurb: s.blurb,
      blurbEn: s.blurbEn,
      works: filtered.filter((w) => w.series.includes(s.id)),
    })).filter((g) => g.works.length > 0);
  }, [filtered, groupBySeries, series]);

  // 楼层导览：每个系列 = 一个展厅，取首件作预览
  const halls = SERIES.map((s) => {
    const inSeries = works.filter((w) => w.series.includes(s.id));
    return {
      ...s,
      count: inSeries.length,
      cover: inSeries[0]?.cover,
    };
  });

  return (
    <div className="container-x pb-28 pt-28">
      <header className="mb-12">
        <p className="eyebrow">
          <LangText k="works.eyebrow" />
        </p>
        <h1 className="heading-serif mt-3 text-4xl sm:text-5xl">
          <LangText k="works.title" />
        </h1>
        <p className="mt-4 max-w-xl text-paper-dim">
          <LangText k="works.intro" />
        </p>
      </header>

      {/* 楼层导览 */}
      <section className="mb-16">
        <p className="eyebrow mb-4">
          <LangText k="works.floorplan" />
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {halls.map((h) => {
            const active = series === h.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => setSeries(active ? "all" : h.id)}
                aria-pressed={active}
                className={`group flex flex-col overflow-hidden rounded-xl border bg-ink text-left transition-colors ${
                  active
                    ? "border-accent"
                    : "border-black/10 hover:border-accent/50"
                }`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-black">
                  {h.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={h.cover}
                      alt={lang === "en" ? h.nameEn : h.name}
                      className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="heading-serif text-lg">
                      {lang === "en" ? h.nameEn : h.name}
                    </h3>
                  </div>
                  {h.blurb && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-paper-dim">
                      {lang === "en" ? h.blurbEn ?? h.blurb : h.blurb}
                    </p>
                  )}
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-accent">
                    {(UI["works.hallCount"][lang] as string).replace(
                      "{n}",
                      String(h.count)
                    )}
                  </p>
                </div>
              </button>
            );
          })}

          {/* 全部作品 */}
          <button
            type="button"
            onClick={() => setSeries("all")}
            aria-pressed={series === "all"}
            className={`flex min-h-[9rem] flex-col justify-center rounded-xl border p-5 text-left transition-colors ${
              series === "all"
                ? "border-accent bg-accent/5"
                : "border-dashed border-black/20 hover:border-accent/50"
            }`}
          >
            <h3 className="heading-serif text-lg">
              <LangText k="works.allHall" />
            </h3>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-accent">
              {(UI["works.hallCount"][lang] as string).replace(
                "{n}",
                String(works.length)
              )}
            </p>
          </button>
        </div>
      </section>

      {/* 两个筛选轴（媒介 / 形态） */}
      <div className="mb-12 space-y-3">
        <FilterRow
          label={<LangText k="works.filter.medium" />}
          current={medium}
          onChange={setMedium}
          options={[
            { key: "all", label: UI["works.all"][lang], count: works.length },
            ...MEDIUM_ORDER.map((m) => ({
              key: m,
              label: lang === "en" ? MEDIUM_LABELS_EN[m] : MEDIUM_LABELS[m],
              count: works.filter((w) => w.mediums.includes(m)).length,
            })),
          ]}
        />
        <FilterRow
          label={<LangText k="works.filter.form" />}
          current={form}
          onChange={setForm}
          options={[
            { key: "all", label: UI["works.all"][lang], count: works.length },
            ...FORM_ORDER.map((f) => ({
              key: f,
              label: lang === "en" ? FORM_LABELS_EN[f] : FORM_LABELS[f],
              count: works.filter((w) => w.form === f).length,
            })),
          ]}
        />
      </div>

      {/* 展墙：每个系列 = 一面挂满作品的墙 */}
      {grouped.map((g) => (
        <section key={g.id} className="mb-20 scroll-mt-28">
          <div className="mb-8 border-b border-black/10 pb-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="heading-serif text-3xl">
                {lang === "en" ? g.nameEn : g.name}
              </h2>
              <span className="eyebrow">
                {(UI["works.hallCount"][lang] as string).replace(
                  "{n}",
                  String(g.works.length)
                )}
              </span>
            </div>
            {g.blurb && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-paper-dim">
                {lang === "en" ? g.blurbEn ?? g.blurb : g.blurb}
              </p>
            )}
          </div>
          <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
        <p className="mt-16 text-center text-paper-dim">
          <LangText k="works.empty" />
        </p>
      )}

      <div className="mt-16">
        <Link href="/" className="link-underline text-sm text-paper/80">
          ← <LangText k="works.back" />
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
  label: ReactNode;
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
