import { useEffect, useRef } from "react";
import { Howler } from "howler";

// 频谱可视化：接入 Howler 的全局 AudioContext，仅在声音开启且作品启用时绘制
export default function AudioVisualizer({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let analyser: AnalyserNode | null = null;
    let raf = 0;
    const BARS = 32;

    const setup = () => {
      const hc = (Howler as unknown as { ctx?: AudioContext }).ctx;
      const mg = (Howler as unknown as { masterGain?: GainNode }).masterGain;
      if (hc && mg && !analyser) {
        analyser = hc.createAnalyser();
        analyser.fftSize = 128;
        try {
          mg.connect(analyser);
        } catch {
          /* noop */
        }
      }
      if (analyser) {
        const arr = new Uint8Array(analyser.frequencyBinCount);
        const draw = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(arr);
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);
          const bw = w / BARS;
          for (let i = 0; i < BARS; i++) {
            const v = arr[i] / 255;
            const bh = Math.max(2, v * h);
            ctx.fillStyle = i % 2 ? "#ff5a1f" : "#f5f2ec";
            ctx.fillRect(i * bw + 1, h - bh, bw - 2, bh);
          }
          raf = requestAnimationFrame(draw);
        };
        draw();
      } else {
        raf = requestAnimationFrame(setup);
      }
    };
    setup();

    return () => cancelAnimationFrame(raf);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={ref}
      width={320}
      height={64}
      className="h-16 w-full rounded-lg bg-ink-soft"
      aria-hidden
    />
  );
}
