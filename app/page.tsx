import Link from "next/link";
import { Hero } from "@/components/Hero";
import { WorkCard } from "@/components/WorkCard";
import { Reveal } from "@/components/Reveal";
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
          <p className="eyebrow">策展陈述 · Statement</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="heading-serif mt-6 max-w-3xl text-balance text-2xl leading-relaxed sm:text-3xl">
            我不急于解释作品。它们更像一些被保存下来的「时刻」——
            你靠近，它们显形；你离开，它们回到沉默。
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper-dim">
            这个空间以作品为中心，弱化界面。无论是一张静照、一段影像、
            一件可在浏览器里操作的生成装置，还是一段需要你主动开启的声音，
            都被平等地陈列在同一片暗色里。
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper-dim/70">
            作品按 5 个母题组织——呼吸 / 红 / 色彩 / 装置 / 档案。
            你可以顺着读，也可以只看图。
          </p>
        </Reveal>
      </section>

      {/* 精选作品 */}
      <section className="container-x pb-28">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">精选 · Selected</p>
              <h2 className="heading-serif mt-3 text-3xl sm:text-4xl">
                近期作品
              </h2>
            </div>
            <Link
              href="/works"
              className="link-underline hidden text-sm text-paper/80 sm:inline"
            >
              查看全部 {total} 件 →
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
              查看全部 {total} 件 →
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
