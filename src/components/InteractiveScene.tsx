import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { InteractiveConfig } from "@/lib/types";

// 网页互动模块：根据 config 渲染 Three.js 三维装置 或 Canvas2D 生成艺术
// 含操作提示、可暂停、移动端降级（粒子数/分辨率上限自动下调）
export default function InteractiveScene({
  config,
}: {
  config: InteractiveConfig;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (config.engine === "threejs" && config.variant === "echo-sphere") {
      return setupEchoSphere(mount, reduce, () => pausedRef.current);
    }
    if (config.engine === "canvas" && config.variant === "particle-garden") {
      return setupParticleGarden(mount, reduce);
    }
    return () => {};
    // 注意：paused 通过闭包读取最新值，见下方 setup 内部处理
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.engine, config.variant]);

  // 用 ref 镜像 paused，避免重建场景
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  return (
    <div className="relative">
      <div
        ref={mountRef}
        className="aspect-square w-full overflow-hidden rounded-xl bg-ink-soft sm:aspect-[4/3]"
        role="img"
        aria-label={config.hint}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/80 to-transparent p-4">
        <p className="max-w-[80%] text-xs text-paper-dim">{config.hint}</p>
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          className="pointer-events-auto rounded-full border border-white/20 px-3 py-1 text-xs text-paper hover:border-accent hover:text-accent"
        >
          {paused ? "继续" : "暂停"}
        </button>
      </div>
    </div>
  );
}

// —— Three.js：回声星群（球面点云，鼠标/触摸扰动，点击暂停）——
function setupEchoSphere(
  mount: HTMLDivElement,
  reduce: boolean,
  isPaused: () => boolean
) {
  const getW = () => mount.clientWidth;
  const getH = () => mount.clientHeight;
  const isSmall = getW() < 640;
  const COUNT = isSmall ? 6000 : 18000;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, getW() / getH(), 0.1, 100);
  camera.position.z = 11;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(getW(), getH());
  mount.appendChild(renderer.domElement);

  // 斐波那契球面分布
  const positions = new Float32Array(COUNT * 3);
  const home = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const colorA = new THREE.Color("#f5f2ec");
  const colorB = new THREE.Color("#ff5a1f");
  const R = 5.2;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    const x = Math.cos(t) * r;
    const z = Math.sin(t) * r;
    home[i * 3] = x * R;
    home[i * 3 + 1] = y * R;
    home[i * 3 + 2] = z * R;
    positions[i * 3] = x * R;
    positions[i * 3 + 1] = y * R;
    positions[i * 3 + 2] = z * R;
    const c = Math.random() < 0.12 ? colorB : colorA;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(positions, 3);
  geo.setAttribute("position", posAttr);
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // 交互：指针扰动
  const pointer = { x: 0, y: 0, active: false };
  const onMove = (e: PointerEvent) => {
    const rect = mount.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    pointer.active = true;
  };
  const onLeave = () => (pointer.active = false);
  const onClick = () => setPausedExternal();
  let pausedExternal = false;
  const setPausedExternal = () => (pausedExternal = !pausedExternal);
  mount.addEventListener("pointermove", onMove);
  mount.addEventListener("pointerleave", onLeave);
  mount.addEventListener("click", onClick);

  const clock = new THREE.Clock();
  let raf = 0;
  const animate = () => {
    const t = clock.getElapsedTime();
    const paused = pausedExternal || isPaused();
    if (!paused) {
      points.rotation.y = t * 0.06;
      points.rotation.x = Math.sin(t * 0.1) * 0.15;
    }
    // 指针靠近时把点向外推
    const arr = posAttr.array as Float32Array;
    const k = pointer.active ? 1 : 0;
    for (let i = 0; i < COUNT; i += 1) {
      const ix = i * 3;
      const hx = home[ix];
      const hy = home[ix + 1];
      const hz = home[ix + 2];
      // 朝指针方向的简单扰动
      const dx = arr[ix] - pointer.x * 6;
      const dy = arr[ix + 1] - -pointer.y * 6;
      const pull = k * 0.04;
      arr[ix] += (hx + dx * 0.6 - arr[ix]) * 0.04 + (dx) * pull * 0.02;
      arr[ix + 1] += (hy + dy * 0.6 - arr[ix + 1]) * 0.04 + (dy) * pull * 0.02;
      arr[ix + 2] += (hz - arr[ix + 2]) * 0.04;
    }
    posAttr.needsUpdate = true;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };
  if (reduce) {
    renderer.render(scene, camera);
  } else {
    raf = requestAnimationFrame(animate);
  }

  const onResize = () => {
    camera.aspect = getW() / getH();
    camera.updateProjectionMatrix();
    renderer.setSize(getW(), getH());
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(raf);
    mount.removeEventListener("pointermove", onMove);
    mount.removeEventListener("pointerleave", onLeave);
    mount.removeEventListener("click", onClick);
    window.removeEventListener("resize", onResize);
    geo.dispose();
    mat.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode)
      renderer.domElement.parentNode.removeChild(renderer.domElement);
  };
}

// —— Canvas2D：像素花园（力导向粒子，指针聚拢绽放）——
function setupParticleGarden(mount: HTMLDivElement, reduce: boolean) {
  const canvas = document.createElement("canvas");
  mount.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let W = 0;
  let H = 0;
  const dpr = Math.min(window.devicePixelRatio, 2);
  const isSmall = mount.clientWidth < 640;
  const COUNT = isSmall ? 500 : 1100;

  type P = { x: number; y: number; vx: number; vy: number; hue: number };
  const ps: P[] = [];

  const resize = () => {
    W = mount.clientWidth;
    H = mount.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  for (let i = 0; i < COUNT; i++) {
    ps.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: 0,
      vy: 0,
      hue: Math.random() < 0.25 ? 18 : 38,
    });
  }

  const pointer = { x: W / 2, y: H / 2, active: false };
  const onMove = (e: PointerEvent) => {
    const rect = mount.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  };
  const onLeave = () => (pointer.active = false);
  mount.addEventListener("pointermove", onMove);
  mount.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", resize);

  let raf = 0;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    // 背景微光
    for (const p of ps) {
      if (pointer.active) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const d2 = dx * dx + dy * dy;
        const f = Math.min(1, 4000 / (d2 + 200));
        p.vx += dx * 0.0006 * f;
        p.vy += dy * 0.0006 * f;
      }
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x += W;
      if (p.x > W) p.x -= W;
      if (p.y < 0) p.y += H;
      if (p.y > H) p.y -= H;

      const speed = Math.hypot(p.vx, p.vy);
      const light = 40 + Math.min(45, speed * 12);
      ctx.beginPath();
      ctx.fillStyle = `hsl(${p.hue}, 90%, ${light}%)`;
      ctx.arc(p.x, p.y, 1.3 + Math.min(2.2, speed * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };
  if (reduce) {
    // 静态一帧
    for (const p of ps) {
      ctx.beginPath();
      ctx.fillStyle = `hsl(${p.hue}, 90%, 50%)`;
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    raf = requestAnimationFrame(draw);
  }

  return () => {
    cancelAnimationFrame(raf);
    mount.removeEventListener("pointermove", onMove);
    mount.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("resize", resize);
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  };
}
