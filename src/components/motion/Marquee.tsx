"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Marquee.module.css";

// Endless strip. Speed and direction react to scrolling.
export function Marquee({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let dir = -1;
    let boost = 0;
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const d = y - lastY;
      lastY = y;
      if (d !== 0) dir = d > 0 ? -1 : 1;
      boost = Math.min(Math.abs(d) * 1.4, 40);
    };
    const tick = (_: number, delta: number) => {
      boost *= 0.93;
      const half = track.scrollWidth / 2;
      x += dir * (0.06 + boost * 0.02) * delta;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      gsap.set(track, { x });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div ref={trackRef} className={styles.track}>
        <div className={styles.set}>{children}</div>
        <div className={styles.set}>{children}</div>
      </div>
    </div>
  );
}
