import Link from "next/link";
import { LangText } from "./LangText";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-black/10 bg-ink-soft">
      <div className="container-x grid gap-10 py-16 md:grid-cols-3">
        <div>
          <div className="heading-serif text-lg tracking-widest2">Tmoi</div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper-dim">
            <LangText k="footer.desc" />
          </p>
        </div>

        <div>
          <div className="eyebrow mb-3">
            <LangText k="footer.nav" />
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="link-underline text-paper/90">
                <LangText k="footer.home" />
              </Link>
            </li>
            <li>
              <Link href="/works" className="link-underline text-paper/90">
                <LangText k="nav.works" />
              </Link>
            </li>
            <li>
              <Link href="/about" className="link-underline text-paper/90">
                <LangText k="nav.about" />
              </Link>
            </li>
            <li>
              <Link href="/contact" className="link-underline text-paper/90">
                <LangText k="nav.contact" />
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-3">
            <LangText k="footer.contact" />
          </div>
          <ul className="space-y-2 text-sm text-paper/90">
            <li>
              <a
                href="mailto:tmoi@tmoi.art"
                className="link-underline"
              >
                tmoi@tmoi.art
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
      <div className="container-x flex flex-col gap-2 border-t border-black/5 py-6 text-xs text-paper-dim sm:flex-row sm:items-center sm:justify-between">
        <span>
          <LangText
            en={`© ${year} Tmoi. All rights reserved.`}
            zh={`© ${year} Tmoi. 保留所有权利。`}
          />
        </span>
        <span>
          <LangText k="footer.built" />
        </span>
      </div>
    </footer>
  );
}

