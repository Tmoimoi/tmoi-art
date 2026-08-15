"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface SoundContextValue {
  // 全局声音总开关（默认关闭，尊重用户）
  enabled: boolean;
  toggle: () => void;
  setEnabled: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(0.7);

  // 读取本地偏好
  useEffect(() => {
    try {
      if (localStorage.getItem("tmoi-sound") === "on") setEnabled(true);
      const v = localStorage.getItem("tmoi-volume");
      if (v) setVolume(Math.min(1, Math.max(0, parseFloat(v))));
    } catch {
      /* 忽略隐私模式下的读取失败 */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tmoi-sound", enabled ? "on" : "off");
    } catch {
      /* noop */
    }
  }, [enabled]);

  useEffect(() => {
    try {
      localStorage.setItem("tmoi-volume", String(volume));
    } catch {
      /* noop */
    }
  }, [volume]);

  const toggle = () => setEnabled((v) => !v);

  return (
    <SoundContext.Provider
      value={{ enabled, toggle, setEnabled, volume, setVolume }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound 必须在 SoundProvider 内使用");
  return ctx;
}
