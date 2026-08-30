"use client";

import { useLang } from "./LanguageProvider";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const base =
    "rounded-full px-2.5 py-1 text-[11px] uppercase tracking-widest transition-colors";
  return (
    <div className={`flex items-center gap-1 ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`${base} ${
          lang === "en"
            ? "bg-accent text-ink"
            : "text-paper/60 hover:text-paper"
        }`}
      >
        EN
      </button>
      <span className="text-paper-dim">/</span>
      <button
        type="button"
        onClick={() => setLang("zh")}
        aria-pressed={lang === "zh"}
        className={`${base} ${
          lang === "zh"
            ? "bg-accent text-ink"
            : "text-paper/60 hover:text-paper"
        }`}
      >
        中
      </button>
    </div>
  );
}
