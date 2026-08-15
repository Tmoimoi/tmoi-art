"use client";

import { useRef, useState } from "react";

export function VideoPlayer({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={`${title} 视频`}
      >
        <source src={src} type="video/mp4" />
        你的浏览器不支持内嵌视频。
      </video>

      {!playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label="播放视频"
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/50 text-paper backdrop-blur">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 5l12 7-12 7V5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
