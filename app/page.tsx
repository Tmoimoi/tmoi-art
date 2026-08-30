import Link from "next/link";
import { Hero } from "@/components/Hero";
import { WorkCard } from "@/components/WorkCard";
import { Reveal } from "@/components/Reveal";
import { LangText } from "@/components/LangText";
import { getAllWorks } from "@/lib/works";

// 首页精选：跨系列挑选，让首屏覆盖 5 个系列中的多个
const FEATURED_SLUGS = [
  "breathe",          // 呼吸
  "earring-project",  // 红
  "wanna-say",        // 装置 + 红
  "have-a-nice-day",  // 装置（合作）
  "color-cards",      // 色彩
  "film-notes",       // 档案
];

export default function HomePage() {
  const works = getAllWorks();
  const featured = FEATURED_SLUGS
    .map((slug) => works.find((w) => w.slug === slug))
    .filter((w): w is NonNullable<typeof w> => Boolean(w));
  const total = works.length;

  return (
    <>
      <Hero />

      {/* 策展陈述 —— 私语调 */}
      <section className="container-x py-24 sm:py-32">
        <Reveal>
          <p className="eyebrow">
            <LangText k="home.statement.eyebrow" />
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="heading-serif mt-6 max-w-3xl text-balance text-2xl leading-relaxed sm:text-3xl">
            <LangText k="home.statement.p1" />
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper-dim">
            <LangText k="home.statement.p2" />
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper-dim/70">
            <LangText k="home.statement.p3" />
          </p>
        </Reveal>
      </section>

      {/* 精选作品 */}
      <section className="container-x pb-28">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">
                <LangText k="home.selected.eyebrow" />
              </p>
              <h2 className="heading-serif mt-3 text-3xl sm:text-4xl">
                <LangText k="home.selected.title" />
              </h2>
            </div>
            <Link
              href="/works"
              className="link-underline hidden text-sm text-paper/80 sm:inline"
            >
              <LangText k="home.viewAll" /> {total} →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((work, i) => (
            <Reveal key={work.slug} delay={i * 0.06}>
              <WorkCard work={work} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 sm:hidden">
            <Link href="/works" className="btn-ghost w-full justify-center">
              <LangText k="home.viewAll" /> {total} →
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
