import { images } from "@/config/images";
import styles from "./Sliced.module.css";

// One photograph cut into vertical strips. Inside the gallery walk every strip drifts at its own
// speed (data-speed), so the picture falls apart at the edges and assembles in the centre.
export function Sliced({ n = 7, alt }: { n?: number; alt: string }) {
  const src = images.slice;
  if (!src) return null;

  return (
    <div className={styles.box} role="img" aria-label={alt}>
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          className={styles.strip}
          data-speed={((i - (n - 1) / 2) * 0.045).toFixed(3)}
          style={
            {
              backgroundImage: `url(${src})`,
              backgroundSize: `${n * 100}% 100%`,
              backgroundPosition: `${(i / (n - 1)) * 100}% 0`,
              "--dy": `${i % 2 === 0 ? -1.5 : 1.5}%`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
