"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pool } from "@/config/pool";
import { PoolImg } from "../ui/PoolImg";
import styles from "./Carousel.module.css";

gsap.registerPlugin(ScrollTrigger);

// Pinned 3D cylinder: scrolling rotates it, the cursor tilts it.
export function Carousel() {
  const t = useTranslations("depth");
  const ref = useRef<HTMLElement>(null);
  const panels = pool.carousel;

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      sec.dataset.on = "true";
      const ring = sec.querySelector<HTMLElement>("[data-ring]")!;
      const tilt = sec.querySelector<HTMLElement>("[data-tilt]")!;
      const pin = sec.querySelector<HTMLElement>("[data-pin]")!;
      const first = ring.querySelector<HTMLElement>("[data-panel]")!;
      const n = panels.length;
      const layout = () => {
        const radius = (first.offsetWidth / 2 / Math.tan(Math.PI / n)) * 1.08;
        ring.style.setProperty("--R", `${radius}px`);
        gsap.set(ring, { z: -radius });
      };
      layout();
      window.addEventListener("resize", layout);
      const spin = gsap.to(ring, {
        rotationY: -340,
        ease: "none",
        scrollTrigger: { trigger: pin, start: "top top", end: "+=180%", pin: true, scrub: 0.6 },
      });
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.7, ease: "power3" });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.7, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        const r = pin.getBoundingClientRect();
        rx(-((e.clientY - r.top) / r.height - 0.5) * 16);
        ry(((e.clientX - r.left) / r.width - 0.5) * 12);
      };
      pin.addEventListener("pointermove", onMove);
      return () => {
        window.removeEventListener("resize", layout);
        pin.removeEventListener("pointermove", onMove);
        spin.scrollTrigger?.kill();
        spin.kill();
        delete sec.dataset.on;
      };
    });
    return () => mm.revert();
  }, [panels.length]);

  return (
    <section id="world" ref={ref} className={styles.section} data-chapter="field" aria-label={t("carousel.title1")}>
      <div className={styles.pin} data-pin>
        <h2 className={styles.title} data-split>
          <span>{t("carousel.title1")}</span>
          <span>{t.rich("carousel.title2", { em: (c) => <em>{c}</em> })}</span>
        </h2>
        <div className={styles.scene}>
          <div className={styles.tilt} data-tilt>
            <div className={styles.ring} data-ring style={{ "--n": panels.length } as React.CSSProperties}>
              {panels.map((src, i) => (
                <figure key={src + i} className={styles.panel} data-panel style={{ "--i": i } as React.CSSProperties}>
                  <PoolImg src={src} sizes="(min-width: 56rem) 16rem, 44vw" />
                </figure>
              ))}
            </div>
          </div>
        </div>
        <p className={styles.hint}>{t("scroll")} ↓</p>
      </div>
    </section>
  );
}
