import Image from "next/image";
import { images, type ImageSlot } from "@/config/images";
import styles from "./Photo.module.css";

type Props = {
  slot: ImageSlot;
  alt?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

// Fills its parent (parent sets size / aspect-ratio). Placeholder until the slot has a file.
export function Photo({ slot, alt = "", sizes, className, priority }: Props) {
  const src = images[slot];
  return (
    <span className={`${styles.photo} ${className ?? ""}`} data-slot={slot}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.img}
        />
      ) : null}
    </span>
  );
}
