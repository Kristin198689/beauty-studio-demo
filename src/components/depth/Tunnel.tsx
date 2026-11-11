"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pool } from "@/config/pool";
import { PoolImg } from "../ui/PoolImg";
import styles from "./Tunnel.module.css";

gsap.registerPlugin(ScrollTrigger);

const STEP = 760;
const XS = [-22, 20, -15, 23, -24, 17, -18, 22, -20, 15];
const YS = [-8, 10, 6, -9, 8, -6, 10, -8, 5, -5];

// Pinned fly-through: frames hang in a corridor and rush past the camera as you scroll.
export function Tunnel() {
  const t = useTranslations("depth");
  const ref = useRef<HTMLElement>(null);
  const frames = pool.tunnel;

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      sec.dataset.on = "true";
      const els = Array.from(sec.querySelectorAll<HTMLElement>("[data-frame]"));
      const total = frames.length * STEP;
      const render = (p: number) => {
        els.forEach((el, i) => {
          const z = -i * STEP + p * total - 300;
          const fadeIn = Math.min(1, Math.max(0, (z + 2700) / 1200));
          const fadeOut = Math.min(1, Math.max(0, (520 - z) / 240));
          gsap.set(el, { z, opacity: Math.min(fadeIn, fadeOut), rotationY: Number(el.dataset.ry) });
        });
      };
      render(0);
      const st = ScrollTrigger.create({
        trigger: sec.querySelector("[data-pin]"),
        start: "top top",
        end: () => "+=" + Math.round(total * 0.4),
        pin: true,
        onUpdate: (s) => render(s.progress),
      });
      return () => {
        st.kill();
        delete sec.dataset.on;
      };
    });
    return () => mm.revert();
  }, [frames.length]);

  return (
    <section id="inside" ref={ref} className={styles.section} data-chapter="field" aria-label={`${t("tunnel.title1")} ${String(t.raw("tunnel.title2")).replace(/<\/?em>/g, "")}`}>
      <div className={styles.pin} data-pin>
        <h2 className={styles.title} data-split>
          <span>{t("tunnel.title1")}</span>
          <span>{t.rich("tunnel.title2", { em: (c) => <em>{c}</em> })}</span>
        </h2>
        <p className={styles.hint}>{t("scroll")} ↓</p>
        <div className={styles.scene}>
          {frames.map((src, i) => (
            <figure
              key={src + i}
              className={styles.frame}
              data-frame
              data-ry={XS[i % XS.length] < 0 ? 14 : -14}
              style={{ "--x": XS[i % XS.length], "--y": YS[i % YS.length] } as React.CSSProperties}
            >
              <PoolImg src={src} sizes="(min-width: 56rem) 30vw, 56vw" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
