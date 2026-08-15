import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, useReducedMotion } from "framer-motion";

// 首页 Hero：Three.js 生成式星群背景 + 标题随滚动淡入
export default function Hero() {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const getW = () => mount.clientWidth;
    const getH = () => mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, getW() / getH(), 0.1, 100);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(getW(), getH());
    mount.appendChild(renderer.domElement);

    const isSmall = getW() < 700;
    const COUNT = isSmall ? 1800 : 3600;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const colorA = new THREE.Color("#f5f2ec");
    const colorB = new THREE.Color("#ff5a1f");

    for (let i = 0; i < COUNT; i++) {
      const r = 6 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random() < 0.16 ? colorB : colorA;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    const clock = new THREE.Clock();
    let raf = 0;
    const renderFrame = () => {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.05 + target.x * 0.3;
      points.rotation.x = target.y * 0.2;
      renderer.render(scene, camera);
    };
    const loop = () => {
      renderFrame();
      raf = requestAnimationFrame(loop);
    };
    if (reduce) renderFrame();
    else loop();

    const onResize = () => {
      camera.aspect = getW() / getH();
      camera.updateProjectionMatrix();
      renderer.setSize(getW(), getH());
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode)
        renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [reduce]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/10 to-ink"
        aria-hidden
      />

      <div className="relative z-10 container-art text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-xs tracking-widest2 text-paper-dim"
        >
          个人艺术空间
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-serif text-6xl font-black tracking-widest2 text-paper sm:text-8xl"
        >
          TMOI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-paper-dim sm:text-base"
        >
          以文字、图像、影像、网页互动与声音，构建一处线上策展空间。
          <br />
          靠近，作品才开始显形。
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-paper-dim"
      >
        <div className="flex flex-col items-center gap-2 text-[10px] tracking-widest2">
          <span>SCROLL</span>
          <span className="h-8 w-px animate-pulse bg-paper-dim/60" />
        </div>
      </motion.div>
    </section>
  );
}
