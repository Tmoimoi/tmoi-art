import Link from "next/link";
import { Hero } from "@/components/Hero";
import { WorkCard } from "@/components/WorkCard";
import { Reveal } from "@/components/Reveal";
import { getFeaturedWorks, getAllWorks } from "@/lib/works";

export default function HomePage() {
  const featured = getFeaturedWorks(3);
  const total = getAllWorks().length;

  return (
    <>
      <Hero />

      {/* 策展陈述 */}
      <section className="container-x py-24 sm:py-32">
        <Reveal>
          <p className="eyebrow">策展陈述 · Statement</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="heading-serif mt-6 max-w-3xl text-balance text-2xl leading-relaxed sm:text-3xl">
            我不急于解释作品。它们更像一些被保存下来的“时刻”——
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
            <Reveal key={work.slug} delay={i * 0.08}>
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
