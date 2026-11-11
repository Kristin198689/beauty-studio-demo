import { useTranslations } from "next-intl";
import { Photo } from "../ui/Photo";
import styles from "./Gallery.module.css";

export function Gallery() {
  const t = useTranslations("gallery");

  return (
    <section id="gallery" className={styles.section} data-chapter="field">
      <h2 className={styles.title}>
        <span>{t("title1")}</span>
        <span>{t.rich("title2", { em: (c) => <em>{c}</em> })}</span>
      </h2>
      <div className={`${styles.print} ${styles.a}`}>
        <Photo slot="galleryA" sizes="(min-width: 56rem) 26vw, 52vw" />
      </div>
      <div className={`${styles.print} ${styles.b}`}>
        <Photo slot="galleryB" sizes="(min-width: 56rem) 26vw, 52vw" />
      </div>
      <div className={`${styles.print} ${styles.c}`}>
        <Photo slot="galleryC" sizes="16vw" />
      </div>
      <p className={styles.text}>{t("text")}</p>
    </section>
  );
}
