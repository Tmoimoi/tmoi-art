"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Pointer = { x: number; y: number };

function EchoSphere({
  pointer,
  playing,
}: {
  pointer: React.MutableRefObject<Pointer>;
  playing: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  // 桌面端粒子更多，移动端自动降级（性能可控）
  const count = useMemo(() => {
    if (typeof window === "undefined") return 12000;
    return window.innerWidth < 768 ? 6000 : 18000;
  }, []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const R = 2.3;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * golden;
      // 给半径一点起伏，形成“回声涟漪”的层次
      const ripple = R + Math.sin(i * 0.0007) * 0.18;
      arr[i * 3] = Math.cos(theta) * r * ripple;
      arr[i * 3 + 1] = y * ripple;
      arr[i * 3 + 2] = Math.sin(theta) * r * ripple;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    if (playing) {
      pts.rotation.y += delta * 0.06;
    }
    // 指针 / 触摸驱动的整体倾斜（带缓动）
    const targetX = pointer.current.y * 0.6;
    const targetZ = pointer.current.x * 0.6;
    pts.rotation.x += (targetX - pts.rotation.x) * 0.04;
    const mat = pts.material as THREE.PointsMaterial;
    const t = state.clock.elapsedTime;
    mat.size = 0.013 + (playing ? Math.sin(t * 1.4) * 0.004 : 0);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.013}
        color="#ff7a47"
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function WebGLScene({
  hint,
  autoPlay = true,
}: {
  hint: string;
  autoPlay?: boolean;
}) {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const [playing, setPlaying] = useState(autoPlay);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPlaying(false);
    }
  }, []);

  return (
    <div
      className="relative h-full w-full"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        frameloop={playing ? "always" : "never"}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <EchoSphere pointer={pointer} playing={playing} />
        <ambientLight intensity={0.4} />
      </Canvas>

      {/* 操作提示 + 暂停控制（像展品说明牌） */}
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
