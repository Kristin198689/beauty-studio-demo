"use client";

import styles from "./Footer.module.css";

// Always ends at the very top, even on a very long page with pinned sections:
// a smooth run first, then a guaranteed jump if anything stopped it early.
export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      className={styles.topBtn}
      onClick={() => {
        const lenis = window.__lenis;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const finish = () => {
          if (window.scrollY > 2) {
            lenis?.scrollTo(0, { immediate: true, force: true });
            window.scrollTo(0, 0);
          }
        };
        if (!lenis || reduce) {
          window.scrollTo(0, 0);
          return;
        }
        lenis.scrollTo(0, {
          duration: 2.4,
          force: true,
          lock: true,
          easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
          onComplete: finish,
        });
        // safety net in case the animation is interrupted
        window.setTimeout(finish, 3200);
      }}
    >
      {label} ↑
    </button>
  );
}
