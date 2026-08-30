"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Work } from "@/lib/types";
import { WallLabel } from "./WallLabel";

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

  return (
    <Link
      href={`/works/${work.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group block overflow-hidden rounded-xl border border-black/10 bg-ink transition-colors hover:border-accent/50"
    >
      {/* 画框：作品如挂在墙上，影像/图片置于暗媒井（=画框）中 */}
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
      </div>

      {/* 美术馆展签 */}
      <WallLabel work={work} variant="card" />
    </Link>
  );
}
