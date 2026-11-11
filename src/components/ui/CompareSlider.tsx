"use client";

import Image from "next/image";
import { useId, useState } from "react";
import styles from "./CompareSlider.module.css";

// Before / after slider. Use ONLY with real client photos, never with generated images.
export function CompareSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
  label,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  label: string;
}) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <div className={styles.box} style={{ "--pos": `${pos}%` } as React.CSSProperties}>
      <Image src={after} alt={afterAlt} fill sizes="(min-width: 56rem) 50vw, 100vw" className={styles.img} />
      <div className={styles.top}>
        <Image src={before} alt={beforeAlt} fill sizes="(min-width: 56rem) 50vw, 100vw" className={styles.img} />
      </div>
      <span className={styles.handle} aria-hidden="true" />
      <label htmlFor={id} className="srOnly">
        {label}
      </label>
      <input
        id={id}
        className={styles.range}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
      />
    </div>
  );
}
