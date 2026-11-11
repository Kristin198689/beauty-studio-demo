"use client";

import { Photo } from "../ui/Photo";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Doors.module.css";

gsap.registerPlugin(ScrollTrigger);

// Two doors with one phrase slide apart and reveal a photograph.
export function Doors() {
  const t = useTranslations("depth");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      sec.dataset.on = "true";
      const l = sec.querySelector("[data-l]");
      const r = sec.querySelector("[data-r]");
      const fig = sec.querySelector("[data-fig]");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec.querySelector("[data-pin]"), start: "top top", end: "+=110%", pin: true, scrub: 0.6 },
      });
      tl.fromTo(l, { xPercent: 0 }, { xPercent: -100, ease: "power2.inOut" }, 0)
        .fromTo(r, { xPercent: 0 }, { xPercent: 100, ease: "power2.inOut" }, 0)
        .fromTo(fig, { scale: 1.25 }, { scale: 1, ease: "none" }, 0);
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        delete sec.dataset.on;
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className={styles.section} data-chapter="field" aria-label={`${t("doors.left")} ${String(t.raw("doors.right")).replace(/<\/?em>/g, "")}`}>
      <div className={styles.pin} data-pin>
        <div className={styles.back}>
          <figure className={styles.fig} data-fig>
            <Photo slot="walk13" sizes="100vw" shine={false} />
          </figure>
        </div>
        <div className={`${styles.door} ${styles.left}`} data-l aria-hidden="true">
          <span>{t("doors.left")}</span>
        </div>
        <div className={`${styles.door} ${styles.right}`} data-r aria-hidden="true">
          <span>{t.rich("doors.right", { em: (c) => <em>{c}</em> })}</span>
        </div>
      </div>
    </section>
  );
}
