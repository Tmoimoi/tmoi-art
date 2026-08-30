"use client";

import { useSound } from "./SoundProvider";

function SpeakerOn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9v6h4l5 4V5L8 9H4z"
        fill="currentColor"
      />
      <path
        d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpeakerOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path
        d="M16 9l5 5M21 9l-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SoundToggle() {
  const { enabled, toggle, volume, setVolume } = useSound();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? "关闭声音" : "开启声音"}
        title={enabled ? "声音已开启 · 点击关闭" : "声音已关闭 · 点击开启"}
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
          enabled
            ? "border-accent text-accent"
            : "border-black/15 text-paper-dim hover:text-paper"
        }`}
      >
        {enabled ? <SpeakerOn /> : <SpeakerOff />}
      </button>

      {/* 音量条：仅在开启时显示 */}
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        aria-label="音量"
        disabled={!enabled}
        className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-black/20 accent-accent disabled:opacity-30"
      />
    </div>
  );
}
