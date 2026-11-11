"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pool } from "@/config/pool";
import { PoolImg } from "../ui/PoolImg";
import styles from "./Deck.module.css";

gsap.registerPlugin(ScrollTrigger);

// Pinned deck: the top card is flicked away as you scroll, the rest move up the stack.
export function Deck() {
  const t = useTranslations("depth");
  const ref = useRef<HTMLElement>(null);
  const cards = pool.deck;

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      sec.dataset.on = "true";
      const els = Array.from(sec.querySelectorAll<HTMLElement>("[data-card]"));
      const n = els.length;
      const render = (p: number) => {
        const top = p * (n - 1);
        const vw = window.innerWidth;
        els.forEach((c, j) => {
          const d = j - top;
          if (d <= -1) {
            gsap.set(c, { x: -vw * 1.3, y: 30, rotation: -30, opacity: 0, zIndex: 0 });
          } else if (d < 0) {
            const k = -d;
            gsap.set(c, { x: -k * vw * 1.1, y: k * 30, rotation: -k * 28, opacity: 1, scale: 1, zIndex: n + 1 });
          } else {
            const k = Math.min(d, 4);
            gsap.set(c, {
              x: 0,
              y: k * 16,
              scale: 1 - k * 0.045,
              rotation: ((j % 3) - 1) * 2.2 * Math.min(1, k),
              opacity: 1,
              zIndex: n - j,
            });
          }
        });
      };
      render(0);
      const st = ScrollTrigger.create({
        trigger: sec.querySelector("[data-pin]"),
        start: "top top",
        end: () => "+=" + (n - 1) * 280,
        pin: true,
        onUpdate: (s) => render(s.progress),
      });
      return () => {
        st.kill();
        delete sec.dataset.on;
      };
    });
    return () => mm.revert();
  }, [cards.length]);

  return (
    <section ref={ref} className={styles.section} data-chapter="paper" aria-label={t("deck.title1")}>
      <div className={styles.pin} data-pin>
        <h2 className={styles.title} data-split>
          <span>{t("deck.title1")}</span>
          <span>{t.rich("deck.title2", { em: (c) => <em>{c}</em> })}</span>
        </h2>
        <div className={styles.stack}>
          {cards.map((src, i) => (
            <figure key={src + i} className={styles.card} data-card>
              <PoolImg src={src} sizes="(min-width: 56rem) 24rem, 58vw" />
            </figure>
          ))}
        </div>
        <p className={styles.hint}>{t("scroll")} ↓</p>
      </div>
    </section>
  );
}
