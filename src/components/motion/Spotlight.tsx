"use client";

import { useEffect, useRef } from "react";
import styles from "./Spotlight.module.css";

// A dark photograph lit only by a circle of light that follows the pointer or finger.
// With no input the light drifts on its own. Reduced motion shows the lit photo.
export function Spotlight({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.static = "true";
      return;
    }
    let x = el.clientWidth * 0.5;
    let y = el.clientHeight * 0.38;
    let tx = x;
    let ty = y;
    let lastMove = -10000;
    let visible = true;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      lastMove = performance.now();
    };
    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (time - lastMove > 3200) {
        const k = time * 0.0006;
        tx = w * (0.5 + 0.3 * Math.sin(k));
        ty = h * (0.42 + 0.26 * Math.sin(k * 1.35 + 1));
      }
      x += (tx - x) * 0.1;
      y += (ty - y) * 0.1;
      el.style.setProperty("--x", `${x.toFixed(1)}px`);
      el.style.setProperty("--y", `${y.toFixed(1)}px`);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerdown", onMove, { passive: true });
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(el);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onMove);
    };
  }, []);

  return (
    <div ref={ref} className={styles.stage} data-cursor="Light">
      {children}
    </div>
  );
}
