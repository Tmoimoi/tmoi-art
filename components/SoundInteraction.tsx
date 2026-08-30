"use client";

import { Howl, Howler } from "howler";
import { useEffect, useRef, useState } from "react";
import { useSound } from "./SoundProvider";
import { LangText } from "./LangText";
import type { AudioConfig } from "@/lib/types";

// 共享一个分析仪：把 Howler 主增益接到 AnalyserNode，再回连到输出，
// 这样无需改动单个声音的节点即可拿到频谱数据（页面通常只有一处声音）。
let sharedAnalyser: AnalyserNode | null = null;
function getAnalyser(): AnalyserNode | null {
  if (sharedAnalyser) return sharedAnalyser;
  try {
    const ctx = (Howler as unknown as { ctx?: AudioContext }).ctx;
    const master = (Howler as unknown as { masterGain?: GainNode }).masterGain;
    if (!ctx || !master) return null;
    const an = ctx.createAnalyser();
    an.fftSize = 128;
    master.disconnect();
    master.connect(an);
    an.connect(ctx.destination);
    sharedAnalyser = an;
    return an;
  } catch {
    return null;
  }
}

export function SoundInteraction({ config }: { config: AudioConfig }) {
  const { enabled, volume } = useSound();
  const soundRef = useRef<Howl | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  // 创建声音实例（仅在客户端）
  useEffect(() => {
    const sound = new Howl({
      src: [config.src],
      loop: !!config.loop,
      volume,
      html5: false, // Web Audio 模式，便于频谱分析
      preload: true,
    });
    soundRef.current = sound;
    if (config.visualizer) analyserRef.current = getAnalyser();
    return () => {
      sound.unload();
      soundRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.src]);

  // 全局声音开关：开启则自动播放，关闭则暂停
  useEffect(() => {
    const s = soundRef.current;
    if (!s) return;
    if (enabled && !playingRef.current) {
      s.play();
      setPlaying(true);
    } else if (!enabled && playingRef.current) {
      s.pause();
      setPlaying(false);
    }
  }, [enabled]);

  // 音量同步
  useEffect(() => {
    if (soundRef.current) soundRef.current.volume(volume);
  }, [volume]);

  // 频谱可视化
  useEffect(() => {
    if (!config.visualizer) return;
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext("2d")!;
    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;
    const draw = () => {
      analyser.getByteFrequencyData(data);
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const n = data.length;
      const bw = W / n;
      for (let i = 0; i < n; i++) {
        const v = data[i] / 255;
        const bh = v * H;
        ctx.fillStyle = `hsla(${18 + i * 0.5}, 92%, ${55 + v * 15}%, 0.95)`;
        ctx.fillRect(i * bw, H - bh, bw * 0.7, bh);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [config.visualizer]);

  const toggle = () => {
    const s = soundRef.current;
    if (!s) return;
    if (playingRef.current) {
      s.pause();
      setPlaying(false);
    } else {
      s.play();
      setPlaying(true);
    }
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-ink-soft p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="eyebrow">
            <LangText en="Sound" zh="声音" />
          </div>
          {config.hint && (
            <p className="mt-1 text-xs text-paper-dim">{config.hint}</p>
          )}
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "暂停声音" : "播放声音"}
          aria-pressed={playing}
          className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
            playing
              ? "border-accent text-accent"
              : "border-black/20 text-paper hover:border-accent hover:text-accent"
          }`}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 5l12 7-12 7V5z" />
            </svg>
          )}
        </button>
      </div>

      {config.visualizer && (
        <canvas
          ref={canvasRef}
          width={600}
          height={120}
          aria-hidden
          className="h-[120px] w-full rounded-lg bg-black/40"
        />
      )}

      <p className="mt-3 text-[11px] text-paper-dim">
        {playing ? <LangText en="Playing" zh="正在播放" /> : <LangText en="Paused" zh="已暂停" />}
        {!enabled && <LangText en=" · Global sound is off" zh=" · 全局声音开关处于关闭状态" />}
      </p>
    </div>
  );
}
