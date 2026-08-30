import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllWorks, getRelatedWorks, getWorkBySlug } from "@/lib/works";
import { getSeries } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { ImageGallery } from "@/components/ImageGallery";
import { VideoPlayer } from "@/components/VideoPlayer";
import { InteractivePiece } from "@/components/InteractivePiece";
import { SoundInteraction } from "@/components/SoundInteraction";
import { Expandable } from "@/components/Expandable";
import { WorkCard } from "@/components/WorkCard";
import { WallLabel } from "@/components/WallLabel";
import { LangText, LangList } from "@/components/LangText";

export function generateStaticParams() {
  return getAllWorks().map((w) => ({ slug: w.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const work = getWorkBySlug(params.slug);
  if (!work) return { title: "Work not found" };
  return { title: `${work.titleEn} · ${work.title}`, description: work.summaryEn ?? work.summary };
}

function SectionLabel({ index, label }: { index: string; label: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="text-xs tabular-nums text-accent">{index}</span>
      <span className="eyebrow">{label}</span>
      <span className="h-px flex-1 bg-black/10" />
    </div>
  );
}

export default function WorkDetail({
  params,
}: {
  params: { slug: string };
}) {
  const work = getWorkBySlug(params.slug);
  if (!work) notFound();

  const works = getAllWorks();
  const related = getRelatedWorks(work, 3);

  const seriesTags = work.series
    .map((s) => getSeries(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  // 主展品：按媒介优先级取第一件作为"上墙"主体
  const media: { type: string; node: React.ReactNode }[] = [];
  if (work.interactive)
    media.push({
      type: "interactive",
      node: <InteractivePiece config={work.interactive} />,
    });
  if (work.video)
    media.push({
      type: "video",
      node: (
        <VideoPlayer
          src={work.video}
          poster={work.videoPoster}
          title={work.title}
        />
      ),
    });
  if (work.audio)
    media.push({ type: "audio", node: <SoundInteraction config={work.audio} /> });
  if (work.images && work.images.length > 0)
    media.push({
      type: "images",
      node: <ImageGallery images={work.images} title={work.title} />,
    });

  const [hero, ...rest] = media.length
    ? media
    : [
        {
          type: "cover",
          node: (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={work.cover}
                alt={work.title}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          ),
        },
      ];

  // 在展厅内行走：同系列相邻作品循环
  const hallWorks = works.filter((w) => w.series.includes(work.series[0]));
  const hi = hallWorks.findIndex((w) => w.slug === work.slug);
  const siblings = hi >= 0 ? hallWorks : works;
  const si = hi >= 0 ? hi : works.findIndex((w) => w.slug === work.slug);
  const prev = siblings[(si - 1 + siblings.length) % siblings.length];
  const next = siblings[(si + 1) % siblings.length];

  let sectionNo = 0;
  const step = () => `0${++sectionNo}`;

  return (
    <article className="pb-28 pt-28">
      <div className="container-x">
        {/* 返回 */}
        <Link
          href="/works"
          className="link-underline text-sm text-paper/80"
        >
          ← <LangText k="work.back" />
        </Link>

        {/* 标题墙 */}
        <Reveal>
          <div className="mx-auto mt-10 max-w-3xl text-center">
            {seriesTags.length > 0 && (
              <div className="mb-4 flex flex-wrap justify-center gap-1.5">
                {seriesTags.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full border border-black/15 px-2.5 py-1 text-[10px] uppercase tracking-widest text-paper-dim"
                  >
                    <LangText en={s.nameEn} zh={s.name} />
                  </span>
                ))}
                {work.form === "collaboration" && (
                  <span className="rounded-full border border-accent/40 px-2.5 py-1 text-[10px] uppercase tracking-widest text-accent">
                    <LangText k="work.form.collaboration" />
                  </span>
                )}
              </div>
            )}

            <h1 className="heading-serif text-balance text-4xl leading-tight sm:text-6xl">
              <LangText en={work.titleEn} zh={work.title} />
            </h1>
            {work.subtitle && (
              <p className="heading-serif mt-2 text-xl text-paper/70">
                <LangText en={work.subtitleEn} zh={work.subtitle} />
              </p>
            )}
            <p className="mt-3 text-sm uppercase tracking-widest text-accent">
              {work.year}
            </p>
            {work.forms && work.forms.length > 1 && (
              <p className="mt-3 text-xs text-paper-dim">
                <LangText k="work.forms.label" />
                <span className="mx-1.5 text-paper-dim/50">·</span>
                <LangText
                  en={(work.formsEn ?? work.forms).join(" / ")}
                  zh={work.forms.join(" / ")}
                />
              </p>
            )}
          </div>
        </Reveal>

        {/* 作品上墙 */}
        <Reveal>
          <div className="mx-auto mt-10 max-w-4xl">{hero.node}</div>
        </Reveal>

        {/* 美术馆展签 */}
        <Reveal>
          <div className="mx-auto mt-8 max-w-md">
            <WallLabel work={work} variant="placard" />
          </div>
        </Reveal>

        {/* 其他视角（若该作品有多种媒介） */}
        {rest.map((m) => (
          <Reveal key={m.type}>
            <section className="py-12">
              <div className="mx-auto max-w-4xl">{m.node}</div>
            </section>
          </Reveal>
        ))}

        {/* 文字阐述 —— 私语调（次要） */}
        {work.description && work.description.length > 0 && (
          <Reveal>
            <section className="py-12">
              <div className="mx-auto max-w-2xl">
                <SectionLabel
                  index={step()}
                  label={<LangText k="work.section.text" />}
                />
                <LangList
                  en={work.descriptionEn}
                  zh={work.description}
                  className="space-y-5 text-base leading-relaxed text-paper/85"
                />
              </div>
            </section>
          </Reveal>
        )}

        {/* 创作笔记 —— 折叠 */}
        {work.notes && (
          <Reveal>
            <section className="py-12">
              <div className="mx-auto max-w-2xl">
                <SectionLabel
                  index={step()}
                  label={<LangText k="work.section.notes" />}
                />
                <Expandable label={<LangText k="work.section.notes" />}>
                  <LangText en={work.notesEn} zh={work.notes} />
                </Expandable>
              </div>
            </section>
          </Reveal>
        )}

        {/* 相关作品 */}
        {related.length > 0 && (
          <Reveal>
            <section className="py-12">
              <div className="mx-auto max-w-5xl">
                <SectionLabel
                  index={step()}
                  label={<LangText k="work.section.related" />}
                />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <WorkCard key={r.slug} work={r} />
                  ))}
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* 上一件 / 下一件 —— 在展厅内行走 */}
        <nav className="mt-8 grid gap-4 border-t border-black/10 pt-10 sm:grid-cols-2">
          <Link
            href={`/works/${prev.slug}`}
            className="group rounded-2xl border border-black/10 p-6 transition-colors hover:border-accent/60"
          >
            <span className="eyebrow">
              <LangText k="work.prev" />
            </span>
            <div className="heading-serif mt-2 text-xl group-hover:text-accent">
              <LangText en={prev.titleEn} zh={prev.title} />
            </div>
          </Link>
          <Link
            href={`/works/${next.slug}`}
            className="group rounded-2xl border border-black/10 p-6 text-right transition-colors hover:border-accent/60"
          >
            <span className="eyebrow">
              <LangText k="work.next" />
            </span>
            <div className="heading-serif mt-2 text-xl group-hover:text-accent">
              <LangText en={next.titleEn} zh={next.title} />
            </div>
          </Link>
        </nav>
      </div>
    </article>
  );
}
