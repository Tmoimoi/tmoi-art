"use client";

import dynamic from "next/dynamic";
import type { InteractiveConfig } from "@/lib/types";
import { LangText } from "./LangText";

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <span className="text-xs uppercase tracking-widest text-ink/70">
        <LangText en="Loading interactive piece…" zh="加载互动装置…" />
      </span>
    </div>
  );
}

const WebGLScene = dynamic(() => import("./WebGLScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});
const CanvasSketch = dynamic(() => import("./CanvasSketch"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

export function InteractivePiece({ config }: { config: InteractiveConfig }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-black/10 bg-black">
      <span className="absolute left-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-[10px] uppercase tracking-widest text-ink/80 backdrop-blur">
        <LangText en="Interactive Piece" zh="互动展品" />
      </span>
      {config.engine === "threejs" ? (
        <WebGLScene hint={config.hint} />
      ) : (
        <CanvasSketch hint={config.hint} />
      )}
    </div>
  );
}
