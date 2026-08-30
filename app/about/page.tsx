import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getAllWorks } from "@/lib/works";
import { LangText } from "@/components/LangText";

export const metadata = {
  title: "关于",
  description: "Tmoi · 个人陈述、教育、合作与展览。",
};

// 从 works.json 聚合所有合作者
function getAllCollaborators(): string[] {
  const set = new Set<string>();
  for (const w of getAllWorks()) {
    for (const c of w.collaborators ?? []) set.add(c);
  }
  return Array.from(set);
}

export default function AboutPage() {
  const collaborators = getAllCollaborators();
  const works = getAllWorks();
  const collabWorks = works.filter((w) => w.form === "collaboration");

  return (
    <div className="container-x pb-28 pt-28">
      <Reveal>
        <p className="eyebrow">
          <LangText k="about.eyebrow" />
        </p>
        <h1 className="heading-serif mt-3 text-4xl sm:text-5xl">
          <LangText k="about.name" />
        </h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-paper-dim">
          <LangText k="about.enName" />
        </p>
      </Reveal>

      {/* 个人陈述 */}
      <Reveal delay={0.05}>
        <section className="mt-12 max-w-2xl space-y-5 text-base leading-relaxed text-paper/85">
          <LangText
            en="Sensation and emotion are the core of my practice. We perceive the world and relate to others through our senses, and from that arise all kinds of feeling. My interactive installations act like a magnifying glass — amplifying the subtle, easily overlooked sensations of everyday life, and inviting the audience in to feel those shared emotions in their own bodies."
            zh="感官与情绪是我核心的创作命题。人依靠五官感受身边环境、与人相处，从中生出各种感受。我的互动装置就像放大镜，把日常容易被忽略的细微感受放大，让观众走进来，切身体会那些共通的情绪。"
          />
          <LangText
            en="I am used to observing and internalising life for a long time before transforming it into work. 《经纬之线》(Warp & Weft) has iterated from a digital concept into what it is now; with my mentor's guidance I uncovered its cybernetic and early-computer-aesthetics undertones, pushing past an earlier frame that stayed at material and formal experiment alone."
            zh="我习惯长时间观察、内化生活经验，再转化为创作。《经纬之线》从数字概念迭代至今，在导师指点下挖掘出控制论与早期计算机美学的内涵，也突破了过往单纯停留在材质与形式实验上的框架。"
          />
          <LangText
            en="Two years of training in creative media gave me the hands-on ability to realise an installation's conception independently. Yet my creative horizon and systematic research still have limits. Through more attempts, I hope to let the work meet the audience in deeper interaction, and slowly grow into a new-media artist who creates independently."
            zh="两年创意媒体的专业训练，让我具备完整动手实作的能力，可独立实现装置的构思；但创作视野与系统化研究仍有局限。我希望借由更多尝试，让作品与观众产生更多交互，慢慢成为能独立创作的专业新媒体艺术家。"
          />
        </section>
      </Reveal>

      <div className="mt-16 grid gap-16 lg:grid-cols-[1.4fr_1fr]">
        {/* 左：详细资料 */}
        <div className="space-y-12">
          {/* 教育 */}
          <Reveal>
            <section>
              <p className="eyebrow">
                <LangText k="about.education" />
              </p>
              <ul className="mt-4 space-y-3 text-sm text-paper/85">
                <li className="flex items-baseline justify-between border-b border-black/10 pb-3">
                  <span>
                    <LangText
                      en="City University of Hong Kong · School of Creative Media"
                      zh="香港城市大学 · 创意媒体学院"
                    />
                  </span>
                  <span className="text-xs text-paper-dim">CityU HK</span>
                </li>
                <li className="flex items-baseline justify-between border-b border-black/10 pb-3">
                  <span>
                    <LangText en="MFA in Creative Media" zh="创意媒体硕士（MFA）" />
                  </span>
                  <span className="text-xs text-paper-dim">2024 · CityU HK</span>
                </li>
              </ul>
            </section>
          </Reveal>

          {/* 合作者（从 works.json 自动聚合） */}
          {collaborators.length > 0 && (
            <Reveal>
              <section>
                <p className="eyebrow">
                  <LangText k="about.collaborators" />
                </p>
                <ul className="mt-4 space-y-2 text-sm text-paper/85">
                  {collaborators.map((c) => (
                    <li key={c} className="flex items-baseline gap-3">
                      <span className="text-accent">·</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-paper-dim">
                  <LangText k="about.collaboratorNote" />
                </p>
              </section>
            </Reveal>
          )}

          {/* 展览经历（占位） */}
          <Reveal>
            <section>
              <p className="eyebrow">
                <LangText k="about.exhibitions" />
              </p>
              <ul className="mt-4 space-y-4">
                <li className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-4 text-paper-dim italic">
                  <span className="text-sm">
                    <LangText k="about.exhibitionPlaceholder" />
                  </span>
                  <span className="text-right text-xs">2024</span>
                </li>
                <li className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-4 text-paper-dim italic">
                  <span className="text-sm">
                    <LangText k="about.exhibitionPlaceholder" />
                  </span>
                  <span className="text-right text-xs">2025</span>
                </li>
              </ul>
            </section>
          </Reveal>
        </div>

        {/* 右：合作作品卡片 + 联系 */}
        <div className="space-y-12">
          {collabWorks.length > 0 && (
            <Reveal>
              <section>
                <p className="eyebrow">
                  <LangText k="about.cooperationTitle" />
                </p>
                <ul className="mt-4 space-y-4">
                  {collabWorks.map((w) => (
                    <li key={w.slug}>
                      <Link
                        href={`/works/${w.slug}`}
                        className="group block rounded-2xl border border-black/10 p-5 transition-colors hover:border-accent/60"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="heading-serif text-lg group-hover:text-accent">
                            {w.title}
                          </span>
                          <span className="text-xs text-paper-dim">{w.year}</span>
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-widest text-accent">
                          {w.titleEn}
                        </p>
                        <p className="mt-2 line-clamp-2 text-xs text-paper-dim">
                          {(w.collaborators ?? []).join("、")}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          <Reveal>
            <section>
              <p className="eyebrow">
                <LangText k="about.contact" />
              </p>
              <ul className="mt-4 space-y-3 text-sm text-paper/85">
                <li className="flex items-baseline gap-3">
                  <span className="eyebrow min-w-[3rem] text-paper-dim">
                    <LangText k="about.email" />
                  </span>
                  <span className="text-paper-dim italic">[ your@email.com ]</span>
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="eyebrow min-w-[3rem] text-paper-dim">
                    <LangText k="about.location" />
                  </span>
                  <span className="text-paper-dim italic">
                    <LangText en="[ to be added ]" zh="[ 待补充 ]" />
                  </span>
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="eyebrow min-w-[3rem] text-paper-dim">
                    <LangText k="about.social" />
                  </span>
                  <span className="text-paper-dim italic">
                    <LangText en="[ Instagram / personal site, etc. ]" zh="[ Instagram / 个人主页等 ]" />
                  </span>
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="rounded-full bg-accent px-7 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
                >
                  <LangText k="about.contactCta" />
                </Link>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
