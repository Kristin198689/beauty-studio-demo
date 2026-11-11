"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pool } from "@/config/pool";
import { PoolImg } from "../ui/PoolImg";
import styles from "./Book.module.css";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number) => Math.min(1, Math.max(0, v));

// Pinned lookbook: every leaf turns in 3D as you scroll, the book slides to follow the open page.
export function Book() {
  const t = useTranslations("depth");
  const ref = useRef<HTMLElement>(null);
  const pages = pool.book;
  const leaves = Math.floor(pages.length / 2);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      sec.dataset.on = "true";
      const els = Array.from(sec.querySelectorAll<HTMLElement>("[data-leaf]"));
      const book = sec.querySelector<HTMLElement>("[data-book]")!;
      const render = (p: number) => {
        const seg = p * leaves;
        els.forEach((lf, i) => {
          const tt = clamp(seg - i);
          const e = tt < 0.5 ? 2 * tt * tt : 1 - Math.pow(-2 * tt + 2, 2) / 2;
          const rot = -180 * e;
          gsap.set(lf, { rotationY: rot, zIndex: rot < -90 ? i + 1 : leaves - i });
        });
        gsap.set(book, { xPercent: -25 * (1 - clamp(seg)) + 25 * clamp(seg - (leaves - 1)) });
      };
      render(0);
      const st = ScrollTrigger.create({
        trigger: sec.querySelector("[data-pin]"),
        start: "top top",
        end: () => "+=" + leaves * 320,
        pin: true,
        onUpdate: (s) => render(s.progress),
      });
      return () => {
        st.kill();
        delete sec.dataset.on;
      };
    });
    return () => mm.revert();
  }, [leaves]);

  return (
    <section id="lookbook" ref={ref} className={styles.section} data-chapter="field" aria-label={t("book.title1")}>
      <div className={styles.pin} data-pin>
        <h2 className={styles.title} data-split>
          <span>{t("book.title1")}</span>
          <span>{t.rich("book.title2", { em: (c) => <em>{c}</em> })}</span>
        </h2>
        <div className={styles.stage}>
          <div className={styles.book} data-book>
            <div className={styles.base} />
            {Array.from({ length: leaves }).map((_, i) => (
              <div key={i} className={styles.leaf} data-leaf>
                <div className={`${styles.face} ${styles.front}`}>
                  <div className={styles.photo}>
                    <PoolImg src={pages[2 * i]} sizes="(min-width: 56rem) 30rem, 45vw" />
                  </div>
                </div>
                <div className={`${styles.face} ${styles.back}`}>
                  <div className={styles.photo}>
                    <PoolImg src={pages[2 * i + 1]} sizes="(min-width: 56rem) 30rem, 45vw" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className={styles.hint}>{t("scroll")} ↓</p>
      </div>
    </section>
  );
}
