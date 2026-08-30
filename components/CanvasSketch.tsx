"use client";

import { useEffect, useRef, useState } from "react";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
}

export default function CanvasSketch({
  hint,
  autoPlay = true,
}: {
  hint: string;
  autoPlay?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(autoPlay);

  // 控制器：setup 中填充，playing 变化时启停 RAF
  const ctrl = useRef<{ start: () => void; stop: () => void }>({
    start: () => {},
    stop: () => {},
  });
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const pointer = { x: 0.5, y: 0.5, active: false };
    let particles: P[] = [];

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const max = w < 768 ? 420 : 900;
      if (particles.length === 0) {
        for (let i = 0; i < max; i++) particles.push(spawn());
      }
    };

    function spawn(): P {
      return {
        x: Math.random() * (w || 800),
        y: Math.random() * (h || 500),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        hue: 16 + Math.random() * 24,
      };
    }

    function step() {
      ctx.fillStyle = "rgba(8,8,8,0.18)"; // 拖影
      ctx.fillRect(0, 0, w, h);

      const px = pointer.x * w;
      const py = pointer.y * h;

      for (const p of particles) {
        if (pointer.active) {
          const dx = px - p.x;
          const dy = py - p.y;
          const d2 = dx * dx + dy * dy + 60;
          const f = 28 / d2;
          p.vx += dx * f;
          p.vy += dy * f;
        }
        p.vx = p.vx * 0.94 + (Math.random() - 0.5) * 0.04;
        p.vy = p.vy * 0.94 + (Math.random() - 0.5) * 0.04;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const speed = Math.min(1, Math.hypot(p.vx, p.vy) * 2);
        const r = 1.2 + speed * 2.4;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, ${55 + speed * 20}%, ${
          0.5 + speed * 0.4
        })`;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let raf = 0;
    const loop = () => {
      step();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = (e.clientY - rect.top) / rect.height;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    ctrl.current = {
      start: () => {
        if (!raf) raf = requestAnimationFrame(loop);
      },
      stop: () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      },
    };
    if (playingRef.current) ctrl.current.start();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // 根据 playing 启停
  useEffect(() => {
    if (playing) ctrl.current.start();
    else ctrl.current.stop();
  }, [playing]);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        style={{ background: "#080808" }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <p className="max-w-[80%] text-xs leading-relaxed text-ink/70">
          {hint}
        </p>
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "暂停互动" : "继续互动"}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-ink backdrop-blur transition-colors hover:border-accent hover:text-accent"
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 5l12 7-12 7V5z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
