"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./ServicePreview.module.css";

// A photo follows the cursor over service rows (pointer devices only).
export function ServicePreview({ children }: { children: React.ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!frame || !fine) return;

    const xTo = gsap.quickTo(frame, "x", { duration: reduce ? 0 : 0.5, ease: "power3" });
    const yTo = gsap.quickTo(frame, "y", { duration: reduce ? 0 : 0.5, ease: "power3" });
    const rows = document.querySelectorAll<HTMLElement>("[data-group]");
    const cleanups: Array<() => void> = [];

    rows.forEach((row) => {
      const enter = () => {
        frame.dataset.active = row.dataset.group ?? "";
      };
      const move = (e: PointerEvent) => {
        xTo(e.clientX + 32);
        yTo(e.clientY - frame.offsetHeight / 2);
      };
      const leave = () => {
        frame.dataset.active = "";
      };
      row.addEventListener("pointerenter", enter);
      row.addEventListener("pointermove", move);
      row.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        row.removeEventListener("pointerenter", enter);
        row.removeEventListener("pointermove", move);
        row.removeEventListener("pointerleave", leave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div ref={frameRef} className={styles.frame} aria-hidden="true">
      {children}
    </div>
  );
}
