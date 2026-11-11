"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Photo } from "../ui/Photo";
import styles from "./Pupil.module.css";

gsap.registerPlugin(ScrollTrigger);

// Pinned zoom: the camera dives into the pupil of a macro eye and comes out in the next scene.
export function Pupil() {
  const t = useTranslations("depth");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      sec.dataset.on = "true";
      const eye = sec.querySelector("[data-eye]");
      const lead = sec.querySelector("[data-lead]");
      const rev = sec.querySelector("[data-reveal]");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec.querySelector("[data-pin]"),
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.6,
        },
      });
      tl.to(lead, { opacity: 0, y: -40, duration: 0.12, ease: "none" }, 0)
        .to(eye, { scale: 26, ease: "power2.in", duration: 1 }, 0)
        .to(eye, { opacity: 0, duration: 0.16, ease: "none" }, 0.84)
        .fromTo(rev, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.2, ease: "none" }, 0.82);
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        delete sec.dataset.on;
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="closer" ref={ref} className={styles.section} data-chapter="field" aria-label={t("pupil.title1")}>
      <div className={styles.pin} data-pin>
        <p className={styles.reveal} data-reveal>
          {t("pupil.reveal")}
        </p>
        <div className={styles.eyeWrap}>
          <figure className={styles.eye} data-eye>
            <Photo slot="walk5" sizes="(min-width: 56rem) 40vw, 80vw" shine={false} />
          </figure>
        </div>
        <h2 className={styles.title} data-lead data-split>
          <span>{t("pupil.title1")}</span>
          <span>{t.rich("pupil.title2", { em: (c) => <em>{c}</em> })}</span>
        </h2>
      </div>
    </section>
  );
}
