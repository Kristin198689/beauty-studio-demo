"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./GalleryWalk.module.css";

gsap.registerPlugin(ScrollTrigger);

// Pinned horizontal "walk" with depth: cards turn and recede at the edges,
// far layers drift slower than near layers. Without motion it is a native scroll strip.
export function GalleryWalk({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      section.dataset.pinned = "true";
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const walk = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      if (barRef.current) {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => "+=" + distance(),
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      // Depth: each card turns toward the centre and recedes at the edges
      track.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
        gsap.set(card, { transformPerspective: 1100 });
        const edge = { rotateY: 22, z: -320, opacity: 0.25, scale: 0.9 };
        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              containerAnimation: walk,
              start: "left 108%",
              end: "right -8%",
              scrub: true,
            },
          })
          .fromTo(card, edge, {
            rotateY: 0,
            z: 0,
            opacity: 1,
            scale: 1,
            ease: "none",
            duration: 0.5,
          })
          .to(card, { ...edge, rotateY: -22, ease: "none", duration: 0.5 });
      });

      // Parallax layers: positive speed = far (slower), negative = near (faster)
      track.querySelectorAll<HTMLElement>("[data-speed]").forEach((layer) => {
        const speed = Number(layer.dataset.speed ?? 0);
        const panel = layer.closest<HTMLElement>("[data-panel]") ?? layer;
        gsap.fromTo(
          layer,
          { x: () => -speed * window.innerWidth * 0.5 },
          {
            x: () => speed * window.innerWidth * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: walk,
              start: "left right",
              end: "right left",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      return () => {
        delete section.dataset.pinned;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={styles.section}
      data-chapter="field"
      aria-label={label}
    >
      <div ref={pinRef} className={styles.pin} tabIndex={0}>
        <div ref={trackRef} className={styles.track}>
          {children}
        </div>
        <div className={styles.progress} aria-hidden="true">
          <span ref={barRef} className={styles.bar} />
        </div>
      </div>
    </section>
  );
}
