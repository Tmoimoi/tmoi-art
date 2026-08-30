"use client";

import { useLang } from "./LanguageProvider";
import { UI } from "@/lib/i18n";

interface LangTextProps {
  /** UI 词典 key（见 lib/i18n.ts） */
  k?: string;
  /** 内联英文文案（无 key 时使用） */
  en?: string;
  /** 内联中文文案 */
  zh?: string;
  className?: string;
}

/**
 * 根据当前语言渲染文案。
 * - 传 k：从 UI 词典取对应语言
 * - 传 en/zh：直接取对应语言
 * 文案中的 "\n" 会渲染为换行 <br/>。
 * 可用于 server 或 client 组件内（本身是 client 组件）。
 */
export function LangText({ k, en, zh, className }: LangTextProps) {
  const { lang } = useLang();
  let text: string | undefined;
  if (k) {
    text = UI[k]?.[lang];
  } else {
    text = lang === "en" ? en ?? zh : zh ?? en;
  }
  if (text == null || text === "") return null;
  const parts = text.split("\n");
  return (
    <span className={className}>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </span>
  );
}

interface LangListProps {
  en?: string[];
  zh?: string[];
  className?: string;
}

/** 渲染一组段落（如作品阐述），按语言选取；缺失则回退另一语言。 */
export function LangList({ en, zh, className }: LangListProps) {
  const { lang } = useLang();
  const arr = lang === "en" ? (en && en.length ? en : zh ?? []) : (zh && zh.length ? zh : en ?? []);
  return (
    <>
      {arr.map((p, i) => (
        <p key={i} className={className}>
          {p}
        </p>
      ))}
    </>
  );
}
