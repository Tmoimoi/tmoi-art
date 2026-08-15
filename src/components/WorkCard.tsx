import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion } from "framer-motion";
import type { Work } from "@/lib/types";
import { MEDIUM_LABELS } from "@/lib/types";

// 作品卡片：列表页静音 hover 预览（若有视频）
export default function WorkCard({ work }: { work: Work }) {
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
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.4 }}>
      <Link
        to={`/works/${work.slug}`}
        className="group block"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-soft">
          <img
            src={work.cover}
            alt={work.title}
            loading="lazy"
            className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          {work.video && (
            <video
              ref={videoRef}
              src={work.video}
              poster={work.cover}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden
            />
          )}
          <div className="absolute left-3 top-3 flex gap-1.5">
            {work.mediums.map((m) => (
              <span
                key={m}
                className="rounded-full bg-ink/60 px-2 py-0.5 text-[10px] tracking-widest2 text-paper backdrop-blur"
              >
                {MEDIUM_LABELS[m]}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-serif text-lg text-paper">
            {work.title}
            <span className="ml-2 text-xs text-paper-dim">{work.year}</span>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-paper-dim">
            {work.summary}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
