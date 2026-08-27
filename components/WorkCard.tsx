"use client";

import Link from "next/link";
import { useRef } from "react";
import { FORM_LABELS, MEDIUM_LABELS, getSeries, type Work } from "@/lib/types";

export function WorkCard({ work }: { work: Work }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const onEnter = () => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };
  const onLeave = () => {
    const v = videoRef.current;
    if (v) v.pause();
  };

  const primarySeries = work.series[0] ? getSeries(work.series[0]) : undefined;

  return (
    <Link
      href={`/works/${work.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-ink-soft transition-colors hover:border-accent/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={work.cover}
          alt={work.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {/* 列表页静音 hover 预览（若有视频） */}
        {work.video && (
          <video
            ref={videoRef}
            src={work.video}
            poster={work.cover}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        {/* 系列标签 */}
        {primarySeries && (
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-widest text-paper backdrop-blur">
              {primarySeries.name} · {primarySeries.nameEn}
            </span>
          </div>
        )}
        {/* 合作标记 */}
        {work.form === "collaboration" && (
          <div className="absolute right-4 top-4">
            <span className="rounded-full border border-accent/40 bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-widest text-accent backdrop-blur">
              {FORM_LABELS.collaboration}
            </span>
          </div>
        )}
        {/* 多形态标记（如 Breath 同时是动画+装置） */}
        {work.forms && work.forms.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
            {work.forms.map((f) => (
              <span
                key={f}
                className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-paper/80 backdrop-blur"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="heading-serif text-xl">{work.title}</h3>
          <span className="text-sm text-paper-dim">{work.year}</span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-widest text-accent">
          {work.titleEn}
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-paper-dim">
          {work.summary}
        </p>
        {/* 媒介 chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {work.mediums.map((m) => (
            <span
              key={m}
              className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-paper/70"
            >
              {MEDIUM_LABELS[m]}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
