"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SoundToggle } from "./SoundToggle";

const LINKS = [
  { href: "/works", label: "作品", en: "Works" },
  { href: "/about", label: "关于", en: "About" },
  { href: "/contact", label: "联系", en: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 路由切换时收起移动菜单
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-ink/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Link
          href="/"
          className="heading-serif text-lg tracking-widest2 text-paper"
        >
          TMOI
        </Link>

        {/* 桌面端导航 */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`link-underline text-sm ${
                  active ? "text-accent" : "text-paper/90"
                }`}
              >
                {l.label}
                <span className="ml-1 text-[10px] uppercase tracking-widest text-paper-dim">
                  {l.en}
                </span>
              </Link>
            );
          })}
          <SoundToggle />
        </div>

        {/* 移动端：声音开关 + 汉堡 */}
        <div className="flex items-center gap-3 md:hidden">
          <SoundToggle />
          <button
            type="button"
            aria-label="菜单"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`h-px w-5 bg-paper transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-paper transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-px w-5 bg-paper transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* 移动端下拉菜单 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 bg-ink/95 backdrop-blur-md md:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-baseline justify-between py-3 text-base text-paper/90"
                >
                  <span>{l.label}</span>
                  <span className="text-[10px] uppercase tracking-widest text-paper-dim">
                    {l.en}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
