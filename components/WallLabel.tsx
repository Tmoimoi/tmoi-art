import { getSeries, type Work } from "@/lib/types";
import { LangText } from "./LangText";

// 美术馆展签（Wall Label / Placard）
// 用在两处：卡片下方（variant="card"，紧凑）与作品详情页（variant="placard"，完整）。
// 全部文案走 LangText，故在 server / client 组件里都能用。

export function WallLabel({
  work,
  variant = "card",
}: {
  work: Work;
  variant?: "card" | "placard";
}) {
  const series =
    work.series
      .map((s) => getSeries(s))
      .filter((s): s is NonNullable<typeof s> => Boolean(s)) ?? [];

  if (variant === "card") {
    return (
      <div className="px-5 pb-5 pt-4">
        {/* 展签上方一道细线，像贴签的边 */}
        <div className="mb-3 h-px w-8 bg-accent/70" />
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="heading-serif text-lg leading-snug">
            <LangText en={work.titleEn} zh={work.title} />
          </h3>
          <span className="shrink-0 text-xs tabular-nums text-paper-dim">
            {work.year}
          </span>
        </div>
        <p className="mt-1 text-[11px] uppercase tracking-widest text-accent">
          {work.year}
        </p>
        <p className="mt-2 text-xs text-paper/70">
          <LangText
            en={work.mediumEn ?? work.medium}
            zh={work.medium}
          />
          {series.length > 0 && (
            <>
              <span className="mx-1.5 text-paper-dim/50">·</span>
              <LangText
                en={series.map((s) => s.nameEn).join(" / ")}
                zh={series.map((s) => s.name).join(" / ")}
              />
            </>
          )}
          {work.form === "collaboration" && (
            <>
              <span className="mx-1.5 text-paper-dim/50">·</span>
              <span className="text-accent">
                <LangText k="work.form.collaboration" />
              </span>
            </>
          )}
        </p>
      </div>
    );
  }

  // placard（完整展签）
  return (
    <div className="border-t border-black/15 pt-5">
      <p className="eyebrow mb-3">
        <LangText k="label.curator" />
      </p>
      <p className="heading-serif text-xl">Tmoi</p>
      <p className="heading-serif mt-1 text-lg text-paper/90">
        <LangText en={work.titleEn} zh={work.title} />
      </p>
      <p className="mt-0.5 text-sm text-paper-dim">
        《<LangText en={work.title} zh={work.titleEn} />》
      </p>

      <dl className="mt-5 space-y-2.5 text-sm">
        <LabelRow term={<LangText k="work.spec.year" />} def={String(work.year)} />
        <LabelRow
          term={<LangText k="work.spec.medium" />}
          def={
            <LangText en={work.mediumEn ?? work.medium} zh={work.medium} />
          }
        />
        <LabelRow term={<LangText k="work.spec.size" />} def={work.size} />
        {series.length > 0 && (
          <LabelRow
            term={<LangText k="work.spec.series" />}
            def={
              <LangText
                en={series.map((s) => s.nameEn).join(" / ")}
                zh={series.map((s) => s.name).join(" / ")}
              />
            }
          />
        )}
        {work.location && (
          <LabelRow term={<LangText k="work.spec.location" />} def={work.location} />
        )}
        {work.collaborators && work.collaborators.length > 0 && (
          <LabelRow
            term={<LangText k="work.spec.collaborators" />}
            def={work.collaborators.join("、")}
          />
        )}
        {work.tech && work.tech.length > 0 && (
          <LabelRow
            term={<LangText k="work.spec.tech" />}
            def={
              <LangText
                en={(work.techEn ?? work.tech).join(" · ")}
                zh={work.tech.join(" · ")}
              />
            }
          />
        )}
        {work.price && (
          <LabelRow term={<LangText k="work.spec.price" />} def={work.price} />
        )}
      </dl>
    </div>
  );
}

function LabelRow({ term, def }: { term: React.ReactNode; def: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-16 shrink-0 text-[10px] uppercase tracking-widest text-paper-dim/80">
        {term}
      </dt>
      <dd className="flex-1 text-paper/85">{def}</dd>
    </div>
  );
}
