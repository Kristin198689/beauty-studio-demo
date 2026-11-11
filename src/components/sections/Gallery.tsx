import { useTranslations } from "next-intl";
import { Photo } from "../ui/Photo";
import { BookLink } from "../ui/BookLink";
import { GalleryWalk } from "../motion/GalleryWalk";
import styles from "./Gallery.module.css";

export function Gallery() {
  const t = useTranslations("gallery");
  const cap = t.raw("captions") as string[];
  const em = { em: (c: React.ReactNode) => <em>{c}</em> };

  return (
    <GalleryWalk id="gallery" label={t("title1")}>
      {/* intro */}
      <div className={`${styles.panel} ${styles.intro}`} data-panel>
        <h2 className={styles.title} data-split>
          <span>{t("title1")}</span>
          <span>{t.rich("title2", em)}</span>
        </h2>
        <p className={styles.hint}>{t("hint")} →</p>
      </div>

      {/* wide 1 */}
      <div className={styles.panel} data-panel>
        <figure className={`${styles.card} ${styles.wide}`} data-card>
          <Photo slot="walk1" sizes="(min-width: 56rem) 55vw, 110vw" parallax={0.06} />
          <figcaption className={styles.cap}>{cap[0]}</figcaption>
        </figure>
      </div>

      {/* portrait + giant word + cut-out */}
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <p className={styles.word} data-speed="0.55" aria-hidden="true">
          {t("words.a")}
        </p>
        <figure className={`${styles.card} ${styles.portrait}`} data-card data-speed="0.12">
          <Photo slot="walk2" sizes="(min-width: 56rem) 30vw, 70vw" parallax={0.06} />
          <figcaption className={styles.cap}>{cap[1]}</figcaption>
        </figure>
        <div className={styles.cut} data-speed="-0.35" aria-hidden="true">
          <Photo slot="cut1" sizes="40vw" fit="contain" />
        </div>
      </div>

      {/* portrait 3 + word nails */}
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <p className={`${styles.word} ${styles.italic}`} data-speed="0.5" aria-hidden="true">
          {t("words.b")}
        </p>
        <figure className={`${styles.card} ${styles.portrait}`} data-card data-speed="-0.1">
          <Photo slot="walk3" sizes="(min-width: 56rem) 30vw, 70vw" parallax={0.06} />
          <figcaption className={styles.cap}>{cap[2]}</figcaption>
        </figure>
        <div className={styles.cut} data-speed="-0.4" aria-hidden="true">
          <Photo slot="cut2" sizes="40vw" fit="contain" />
        </div>
      </div>

      {/* wide 2 */}
      <div className={styles.panel} data-panel>
        <figure className={`${styles.card} ${styles.wide}`} data-card data-speed="0.08">
          <Photo slot="walk4" sizes="(min-width: 56rem) 55vw, 110vw" parallax={0.06} />
          <figcaption className={styles.cap}>{cap[3]}</figcaption>
        </figure>
      </div>

      {/* pair of portraits at different depths */}
      <div className={`${styles.panel} ${styles.pair}`} data-panel>
        <figure className={`${styles.card} ${styles.portrait} ${styles.up}`} data-card data-speed="0.2">
          <Photo slot="walk5" sizes="(min-width: 56rem) 26vw, 64vw" parallax={0.06} />
          <figcaption className={styles.cap}>{cap[4]}</figcaption>
        </figure>
        <figure className={`${styles.card} ${styles.portrait} ${styles.down}`} data-card data-speed="-0.2">
          <Photo slot="walk7" sizes="(min-width: 56rem) 26vw, 64vw" parallax={0.06} />
          <figcaption className={styles.cap}>{cap[6]}</figcaption>
        </figure>
      </div>

      {/* wide 3 + word hair + cut-out */}
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <p className={`${styles.word} ${styles.italic}`} data-speed="0.6" aria-hidden="true">
          {t("words.c")}
        </p>
        <figure className={`${styles.card} ${styles.wide}`} data-card>
          <Photo slot="walk6" sizes="(min-width: 56rem) 55vw, 110vw" parallax={0.06} />
          <figcaption className={styles.cap}>{cap[5]}</figcaption>
        </figure>
        <div className={styles.cut} data-speed="-0.35" aria-hidden="true">
          <Photo slot="cut3" sizes="40vw" fit="contain" />
        </div>
      </div>

      {/* closing call */}
      <div className={`${styles.panel} ${styles.end}`} data-panel>
        <p className={styles.endText}>{t("cta")}</p>
        <BookLink>{t("cta")}</BookLink>
      </div>
    </GalleryWalk>
  );
}
