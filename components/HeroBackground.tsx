"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function DriftField() {
  const ref = useRef<THREE.Points>(null);
  const count = 1400;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    pts.rotation.y += delta * 0.02;
    pts.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#4a6b4a"
        sizeAttenuation
        transparent
        opacity={0.42}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default function HeroBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="absolute inset-0 bg-ink" />;

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <DriftField />
    </Canvas>
  );
}
