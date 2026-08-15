import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-soft">
      <div className="container-x grid gap-10 py-16 md:grid-cols-3">
        <div>
          <div className="heading-serif text-lg tracking-widest2">TMOI</div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper-dim">
            一个以作品为中心的线上策展空间。安静、克制，把注意力留给艺术本身。
          </p>
        </div>

        <div>
          <div className="eyebrow mb-3">导航</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="link-underline text-paper/90">
                首页
              </Link>
            </li>
            <li>
              <Link href="/works" className="link-underline text-paper/90">
                作品
              </Link>
            </li>
            <li>
              <Link href="/about" className="link-underline text-paper/90">
                关于
              </Link>
            </li>
            <li>
              <Link href="/contact" className="link-underline text-paper/90">
                联系
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-3">联系</div>
          <ul className="space-y-2 text-sm text-paper/90">
            <li>
              <a
                href="mailto:studio@tmoi.art"
                className="link-underline"
              >
                studio@tmoi.art
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.behance.net"
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                Behance
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-white/5 py-6 text-xs text-paper-dim sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} TMOI. 保留所有权利。</span>
        <span>以 Next.js · Three.js · Howler.js 构建</span>
      </div>
    </footer>
  );
}
