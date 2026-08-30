"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
});

const STORAGE_KEY = "tmoi-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 默认英文为主；挂载后再读 localStorage，避免 hydration mismatch
  const [lang, setLangState] = useState<Lang>("en");

  // 初次挂载：恢复用户选择
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "zh") setLangState(saved);
    } catch {
      /* localStorage 不可用时忽略 */
    }
  }, []);

  // 语言变化：写回 localStorage + 更新 <html lang>
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState((p) => (p === "en" ? "zh" : "en"));

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
