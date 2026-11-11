"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pool } from "@/config/pool";
import { PoolImg } from "../ui/PoolImg";
import styles from "./Wall.module.css";

gsap.registerPlugin(ScrollTrigger);

// [left %, top %, width vw]
const BACK = [[4, 8, 12], [22, 58, 12], [40, 4, 11], [62, 60, 12], [80, 6, 12], [90, 50, 10]];
const MID = [[12, 30, 16], [34, 66, 16], [56, 22, 16], [74, 70, 15], [88, 26, 15]];
const FRONT = [[-2, 62, 22], [26, -6, 20], [70, -4, 22], [84, 56, 23]];
const LAYERS = [BACK, MID, FRONT];
const MOVE = [18, 46, 100]; // pointer travel in px per layer
const DRIFT = [30, 80, 170]; // scroll travel in px per layer

// Three depth layers: the cursor shifts them against each other, scrolling drifts them at different speeds.
export function Wall() {
  const t = useTranslations("depth");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      sec.dataset.on = "true";
      const layers = Array.from(sec.querySelectorAll<HTMLElement>("[data-layer]"));
      const inner = Array.from(sec.querySelectorAll<HTMLElement>("[data-pointer]"));
      const drifts = layers.map((l, i) =>
        gsap.fromTo(
          l,
          { y: DRIFT[i] },
          { y: -DRIFT[i], ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true } },
        ),
      );
      const onMove = (e: PointerEvent) => {
        const r = sec.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        inner.forEach((el, i) =>
          gsap.to(el, { x: -nx * MOVE[i], y: -ny * MOVE[i], duration: 0.9, ease: "power3.out", overwrite: true }),
        );
      };
      sec.addEventListener("pointermove", onMove);
      return () => {
        sec.removeEventListener("pointermove", onMove);
        drifts.forEach((d) => {
          d.scrollTrigger?.kill();
          d.kill();
        });
        delete sec.dataset.on;
      };
    });
    return () => mm.revert();
  }, []);

  let k = 0;
  return (
    <section id="move" ref={ref} className={styles.section} data-chapter="field" aria-label={t("wall.title1")}>
      <h2 className={styles.title} data-split>
        <span>{t("wall.title1")}</span>
        <span>{t.rich("wall.title2", { em: (c) => <em>{c}</em> })}</span>
      </h2>
      <p className={styles.hint}>{t("drag")}</p>
      <div className={styles.field}>
        {LAYERS.map((layer, li) => (
          <div key={li} className={styles.layer} data-layer data-depth={li}>
            <div className={styles.pointer} data-pointer>
              {layer.map(([l, tp, w]) => {
                const src = pool.wall[k++ % pool.wall.length];
                return (
                  <figure
                    key={src + l + tp}
                    className={styles.tile}
                    style={{ "--l": `${l}%`, "--t": `${tp}%`, "--w": w } as React.CSSProperties}
                  >
                    <PoolImg src={src} sizes="(min-width: 56rem) 22vw, 40vw" />
                  </figure>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
