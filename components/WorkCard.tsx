import Link from "next/link";
import { MEDIUM_LABELS, type Work } from "@/lib/types";

export function WorkCard({ work }: { work: Work }) {
  return (
    <Link
      href={`/works/${work.slug}`}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-ink-soft transition-colors hover:border-accent/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={work.cover}
          alt={work.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          {work.mediums.map((m) => (
            <span
              key={m}
              className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-widest text-paper backdrop-blur"
            >
              {MEDIUM_LABELS[m]}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="heading-serif text-xl">{work.title}</h3>
          <span className="text-sm text-paper-dim">{work.year}</span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-widest text-accent">
          {work.titleEn}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-paper-dim">
          {work.summary}
        </p>
      </div>
    </Link>
  );
}
