import Image from "next/image";
import { images, type ImageSlot } from "@/config/images";
import styles from "./Photo.module.css";

type Props = {
  slot: ImageSlot;
  alt?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Opens like a curtain when scrolled into view */
  mask?: boolean;
  /** Parallax inside the frame, fraction of height (e.g. 0.08) */
  parallax?: number;
  /** "contain" for transparent cut-outs */
  fit?: "cover" | "contain";
  /** "multiply" melts a white studio background into the page colour */
  blend?: "multiply";
};

// Fills its parent (parent sets size / aspect-ratio). Placeholder until the slot has a file.
export function Photo({
  slot,
  alt = "",
  sizes,
  className,
  priority,
  mask,
  parallax,
  fit = "cover",
  blend,
}: Props) {
  const src = images[slot];
  return (
    <span
      className={`${styles.photo} ${fit === "contain" ? styles.cut : ""} ${className ?? ""}`}
      data-slot={slot}
      data-mask={mask ? "" : undefined}
      style={blend ? { mixBlendMode: blend } : undefined}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={fit === "contain" ? styles.contain : styles.img}
          data-parallax={parallax}
        />
      ) : null}
    </span>
  );
}
