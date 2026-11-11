"use client";

import styles from "./Footer.module.css";

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      className={styles.topBtn}
      onClick={() => {
        if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0 });
      }}
    >
      {label} ↑
    </button>
  );
}
