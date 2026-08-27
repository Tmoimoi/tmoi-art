import { Reveal } from "@/components/Reveal";

export const metadata = {
  title: "联系",
  description: "与 Tmoi 合作、委托或展览邀约。",
};

export default function ContactPage() {
  return (
    <div className="container-x pb-28 pt-28">
      <Reveal>
        <p className="eyebrow">联系 · Contact</p>
        <h1 className="heading-serif mt-3 text-4xl sm:text-5xl">
          让我们聊聊。
        </h1>
        <p className="mt-6 max-w-xl text-paper-dim">
          展览邀约、作品委托、媒体合作或只是想说点什么——
          都欢迎写信给我。声音与作品，最好配一杯茶。
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="mailto:tmoi@tmoi.art"
            className="rounded-2xl border border-white/10 p-6 transition-colors hover:border-accent/60"
          >
            <p className="eyebrow">邮箱</p>
            <p className="heading-serif mt-2 text-lg">tmoi@tmoi.art</p>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 p-6 transition-colors hover:border-accent/60"
          >
            <p className="eyebrow">Instagram</p>
            <p className="heading-serif mt-2 text-lg">@tmoi</p>
          </a>
          <a
            href="https://www.behance.net"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 p-6 transition-colors hover:border-accent/60"
          >
            <p className="eyebrow">Behance</p>
            <p className="heading-serif mt-2 text-lg">Tmoi</p>
          </a>
        </div>
      </Reveal>
    </div>
  );
}
