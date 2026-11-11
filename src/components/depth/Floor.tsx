"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pool } from "@/config/pool";
import { PoolImg } from "../ui/PoolImg";
import styles from "./Floor.module.css";

gsap.registerPlugin(ScrollTrigger);

// Photographs lie on a floor that recedes to the horizon and stream toward you as you scroll.
export function Floor() {
  const t = useTranslations("depth");
  const ref = useRef<HTMLElement>(null);
  const tiles = pool.floor;

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      sec.dataset.on = "true";
      const belt = sec.querySelector("[data-belt]");
      const tween = gsap.fromTo(
        belt,
        { yPercent: -52 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: sec.querySelector("[data-pin]"), start: "top top", end: "+=170%", pin: true, scrub: 0.6 },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        delete sec.dataset.on;
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className={styles.section} data-chapter="field" aria-label={t("floor.title1")}>
      <div className={styles.pin} data-pin>
        <h2 className={styles.title} data-split>
          <span>{t("floor.title1")}</span>
          <span>{t.rich("floor.title2", { em: (c) => <em>{c}</em> })}</span>
        </h2>
        <div className={styles.stage}>
          <div className={styles.plane}>
            <div className={styles.belt} data-belt>
              {tiles.map((src, i) => (
                <figure key={src + i} className={styles.tile}>
                  <PoolImg src={src} sizes="(min-width: 56rem) 22vw, 40vw" />
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
