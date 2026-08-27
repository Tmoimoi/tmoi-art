import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllWorks, getRelatedWorks, getWorkBySlug } from "@/lib/works";
import { FORM_LABELS, MEDIUM_LABELS, getSeries } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { ImageGallery } from "@/components/ImageGallery";
import { VideoPlayer } from "@/components/VideoPlayer";
import { InteractivePiece } from "@/components/InteractivePiece";
import { SoundInteraction } from "@/components/SoundInteraction";
import { Expandable } from "@/components/Expandable";
import { WorkCard } from "@/components/WorkCard";

export function generateStaticParams() {
  return getAllWorks().map((w) => ({ slug: w.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const work = getWorkBySlug(params.slug);
  if (!work) return { title: "未找到作品" };
  return { title: `${work.title} · ${work.titleEn}`, description: work.summary };
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="text-xs tabular-nums text-accent">{index}</span>
      <span className="eyebrow">{label}</span>
      <span className="h-px flex-1 bg-white/10" />
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
  const idx = works.findIndex((w) => w.slug === work.slug);
  const prev = works[(idx - 1 + works.length) % works.length];
  const next = works[(idx + 1) % works.length];
  const related = getRelatedWorks(work, 3);

  const seriesTags = work.series
    .map((s) => getSeries(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

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
          ← 作品索引
        </Link>

        {/* 头部 */}
        <Reveal>
          <header className="mt-8 border-b border-white/10 pb-10">
            {/* 系列标签 */}
            {seriesTags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {seriesTags.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-widest text-paper-dim"
                  >
                    {s.name} · {s.nameEn}
                  </span>
                ))}
                {work.form === "collaboration" && (
                  <span className="rounded-full border border-accent/40 px-2.5 py-1 text-[10px] uppercase tracking-widest text-accent">
                    {FORM_LABELS.collaboration}
                  </span>
                )}
              </div>
            )}

            <h1 className="heading-serif text-balance text-4xl leading-tight sm:text-6xl">
              {work.title}
            </h1>
            {work.subtitle && (
              <p className="heading-serif mt-2 text-xl text-paper/70">
                {work.subtitle}
              </p>
            )}
            <p className="mt-3 text-sm uppercase tracking-widest text-accent">
              {work.titleEn} · {work.year}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85">
              {work.summary}
            </p>

            {/* 多形态提示 */}
            {work.forms && work.forms.length > 1 && (
              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-paper-dim">
                <span className="eyebrow text-paper-dim">形态</span>
                {work.forms.map((f, i) => (
                  <span key={f} className="flex items-center gap-2">
                    <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-paper">
                      {f}
                    </span>
                    {i < work.forms!.length - 1 && <span className="text-paper-dim/60">·</span>}
                  </span>
                ))}
              </div>
            )}

            {/* 规格表 */}
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 text-sm sm:grid-cols-4">
              <div>
                <dt className="eyebrow">年份</dt>
                <dd className="mt-1">{work.year}</dd>
              </div>
              <div>
                <dt className="eyebrow">媒介</dt>
                <dd className="mt-1">{work.medium}</dd>
              </div>
              <div>
                <dt className="eyebrow">尺寸</dt>
                <dd className="mt-1">{work.size}</dd>
              </div>
              {work.location && (
                <div>
                  <dt className="eyebrow">地点</dt>
                  <dd className="mt-1">{work.location}</dd>
                </div>
              )}
              {work.collaborators && work.collaborators.length > 0 && (
                <div className="col-span-2">
                  <dt className="eyebrow">合作</dt>
                  <dd className="mt-1">{work.collaborators.join("、")}</dd>
                </div>
              )}
              {work.tech && work.tech.length > 0 && (
                <div className="col-span-2">
                  <dt className="eyebrow">技术</dt>
                  <dd className="mt-1">{work.tech.join(" · ")}</dd>
                </div>
              )}
              {work.price && (
                <div>
                  <dt className="eyebrow">市场参考</dt>
                  <dd className="mt-1">{work.price}</dd>
                </div>
              )}
            </dl>
          </header>
        </Reveal>

        {/* 文字阐述 —— 私语调 */}
        <Reveal>
          <section className="py-12">
            <SectionLabel index={step()} label="作品阐述 · Text" />
            <div className="max-w-2xl space-y-5 text-base leading-relaxed text-paper/85">
              {work.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        </Reveal>

        {/* 图像 */}
        {work.images && work.images.length > 0 && (
          <Reveal>
            <section className="py-12">
              <SectionLabel index={step()} label="图像 · Images" />
              <ImageGallery images={work.images} title={work.title} />
            </section>
          </Reveal>
        )}

        {/* 影像 */}
        {work.video && (
          <Reveal>
            <section className="py-12">
              <SectionLabel index={step()} label="影像 · Video" />
              <VideoPlayer
                src={work.video}
                poster={work.videoPoster}
                title={work.title}
              />
            </section>
          </Reveal>
        )}

        {/* 互动 */}
        {work.interactive && (
          <Reveal>
            <section className="py-12">
              <SectionLabel index={step()} label="网页互动 · Interactive" />
              <InteractivePiece config={work.interactive} />
            </section>
          </Reveal>
        )}

        {/* 声音 */}
        {work.audio && (
          <Reveal>
            <section className="py-12">
              <SectionLabel index={step()} label="声音交互 · Sound" />
              <SoundInteraction config={work.audio} />
            </section>
          </Reveal>
        )}

        {/* 创作笔记 —— 折叠，私语的过程记录 */}
        {work.notes && (
          <Reveal>
            <section className="py-12">
              <Expandable label="创作笔记 · Notes">{work.notes}</Expandable>
            </section>
          </Reveal>
        )}

        {/* 相关作品 */}
        {related.length > 0 && (
          <Reveal>
            <section className="py-12">
              <SectionLabel index={step()} label="相关作品 · Related" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <WorkCard key={r.slug} work={r} />
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* 上一件 / 下一件 */}
        <nav className="mt-8 grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-2">
          <Link
            href={`/works/${prev.slug}`}
            className="group rounded-2xl border border-white/10 p-6 transition-colors hover:border-accent/60"
          >
            <span className="eyebrow">上一件</span>
            <div className="heading-serif mt-2 text-xl group-hover:text-accent">
              {prev.title}
            </div>
          </Link>
          <Link
            href={`/works/${next.slug}`}
            className="group rounded-2xl border border-white/10 p-6 text-right transition-colors hover:border-accent/60"
          >
            <span className="eyebrow">下一件</span>
            <div className="heading-serif mt-2 text-xl group-hover:text-accent">
              {next.title}
            </div>
          </Link>
        </nav>
      </div>
    </article>
  );
}
