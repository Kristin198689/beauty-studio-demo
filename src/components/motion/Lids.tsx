"use client";

import type { RefObject } from "react";
import styles from "./Lids.module.css";

// Two eyelids with lashes. They close from top and bottom, then open on the new page.
function lashes(side: "top" | "bot"): string {
  // Quadratic edge from (0,60) via control (50,100) to (100,60) in a 100x100 box
  const out: string[] = [];
  const n = 34;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const x = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * 50 + t * t * 100;
    const y = (1 - t) * (1 - t) * 60 + 2 * (1 - t) * t * 100 + t * t * 60;
    const side_ = (t - 0.5) * 2; // -1 inner ... 1 outer
    const len = (side === "top" ? 11 : 6) * (0.7 + 0.5 * Math.abs(Math.sin(i * 1.7)));
    const dx = side_ * len * 0.55;
    const dy = len;
    const cx = x + dx * 0.2;
    const cy = y + dy * 0.7;
    out.push(`M${x.toFixed(2)},${y.toFixed(2)} Q${cx.toFixed(2)},${cy.toFixed(2)} ${(x + dx).toFixed(2)},${(y + dy).toFixed(2)}`);
  }
  return out.join(" ");
}

export function Lids({
  topRef,
  botRef,
}: {
  topRef: RefObject<HTMLDivElement | null>;
  botRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      <div ref={topRef} className={`${styles.lid} ${styles.top}`} aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
          <path d="M0,0 H100 V60 Q50,100 0,60 Z" className={styles.fill} />
          <path d={lashes("top")} className={styles.lash} />
        </svg>
      </div>
      <div ref={botRef} className={`${styles.lid} ${styles.bot}`} aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
          <path d="M0,100 H100 V40 Q50,0 0,40 Z" className={styles.fill} />
          <path d={lashes("bot")} className={styles.lashBot} />
        </svg>
      </div>
    </>
  );
}
