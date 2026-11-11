import { useTranslations } from "next-intl";
import { Photo } from "../ui/Photo";
import { BookLink } from "../ui/BookLink";
import { Sliced } from "../ui/Sliced";
import { GalleryWalk } from "../motion/GalleryWalk";
import styles from "./Gallery.module.css";

// Giant word on a far layer: it drifts slower than the photographs, which gives every panel depth.
function Word({
  text,
  speed = 0.5,
  italic,
  long,
}: {
  text: string;
  speed?: number;
  italic?: boolean;
  long?: boolean;
}) {
  return (
    <p
      className={`${styles.word} ${italic ? styles.italic : ""} ${long ? styles.long : ""}`}
      data-speed={speed}
      aria-hidden="true"
    >
      {text}
    </p>
  );
}

export function Gallery() {
  const t = useTranslations("gallery");
  const cap = t.raw("captions") as string[];
  const em = { em: (c: React.ReactNode) => <em>{c}</em> };
  const sizesWide = "(min-width: 56rem) 55vw, 110vw";
  const sizesPortrait = "(min-width: 56rem) 26vw, 64vw";

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
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <Word text={cap[0]} speed={0.5} />
        <figure className={`${styles.card} ${styles.wide}`} data-card data-speed="-0.06">
          <Photo slot="walk1" sizes={sizesWide} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[0]}</figcaption>
        </figure>
      </div>

      {/* portrait + giant word */}
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <Word text={t("words.a")} speed={0.55} />
        <figure className={`${styles.card} ${styles.portrait}`} data-card data-speed="0.12">
          <Photo slot="walk2" sizes="(min-width: 56rem) 30vw, 70vw" parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[1]}</figcaption>
        </figure>
      </div>

      {/* portrait + word nails */}
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <Word text={t("words.b")} speed={0.5} italic />
        <figure className={`${styles.card} ${styles.portrait}`} data-card data-speed="-0.1">
          <Photo slot="walk3" sizes="(min-width: 56rem) 30vw, 70vw" parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[2]}</figcaption>
        </figure>
      </div>

      {/* wide profile */}
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <Word text={cap[3]} speed={0.5} italic />
        <figure className={`${styles.card} ${styles.wide}`} data-card data-speed="0.08">
          <Photo slot="walk4" sizes={sizesWide} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[3]}</figcaption>
        </figure>
      </div>

      {/* one photograph cut into strips */}
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <Word text={cap[12]} speed={0.45} long />
        <figure className={`${styles.card} ${styles.portrait}`} data-card>
          <Sliced alt={cap[12]} />
          <figcaption className={styles.cap}>{cap[12]}</figcaption>
        </figure>
      </div>

      {/* pair of portraits at different depths */}
      <div className={`${styles.panel} ${styles.pair} ${styles.stack}`} data-panel>
        <Word text={cap[4]} speed={0.55} long />
        <figure className={`${styles.card} ${styles.portrait} ${styles.up}`} data-card data-speed="0.2">
          <Photo slot="walk5" sizes={sizesPortrait} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[4]}</figcaption>
        </figure>
        <figure className={`${styles.card} ${styles.portrait} ${styles.down}`} data-card data-speed="-0.2">
          <Photo slot="walk7" sizes={sizesPortrait} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[6]}</figcaption>
        </figure>
      </div>

      {/* wide: hands on satin */}
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <Word text={cap[13]} speed={0.5} italic />
        <figure className={`${styles.card} ${styles.wide}`} data-card data-speed="-0.08">
          <Photo slot="walk13" sizes={sizesWide} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[13]}</figcaption>
        </figure>
      </div>

      {/* wide lashes macro */}
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <Word text={cap[7]} speed={0.55} long />
        <figure className={`${styles.card} ${styles.wide}`} data-card data-speed="0.1">
          <Photo slot="walk10" sizes={sizesWide} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[7]}</figcaption>
        </figure>
      </div>

      {/* lips and profile, two depths */}
      <div className={`${styles.panel} ${styles.pair} ${styles.stack}`} data-panel>
        <Word text={cap[8]} speed={0.5} italic />
        <figure className={`${styles.card} ${styles.portrait} ${styles.down}`} data-card data-speed="0.18">
          <Photo slot="walk8" sizes={sizesPortrait} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[8]}</figcaption>
        </figure>
        <figure className={`${styles.card} ${styles.portrait} ${styles.up}`} data-card data-speed="-0.18">
          <Photo slot="walk9" sizes={sizesPortrait} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[9]}</figcaption>
        </figure>
      </div>

      {/* wide: red lips */}
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <Word text={cap[14]} speed={0.6} />
        <figure className={`${styles.card} ${styles.wide}`} data-card data-speed="0.06">
          <Photo slot="walk14" sizes={sizesWide} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[14]}</figcaption>
        </figure>
      </div>

      {/* wide + word hair */}
      <div className={`${styles.panel} ${styles.stack}`} data-panel>
        <Word text={t("words.c")} speed={0.6} italic />
        <figure className={`${styles.card} ${styles.wide}`} data-card>
          <Photo slot="walk6" sizes={sizesWide} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[5]}</figcaption>
        </figure>
      </div>

      {/* wide eye and a portrait */}
      <div className={`${styles.panel} ${styles.pair} ${styles.stack}`} data-panel>
        <Word text={cap[10]} speed={0.5} long />
        <figure className={`${styles.card} ${styles.wide}`} data-card data-speed="0.1">
          <Photo slot="walk12" sizes={sizesWide} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[10]}</figcaption>
        </figure>
        <figure className={`${styles.card} ${styles.portrait}`} data-card data-speed="-0.12">
          <Photo slot="walk11" sizes={sizesPortrait} parallax={0.06} lens />
          <figcaption className={styles.cap}>{cap[11]}</figcaption>
        </figure>
      </div>

      {/* closing call */}
      <div className={`${styles.panel} ${styles.end}`} data-panel>
        <p className={styles.endText}>{t("cta")}</p>
        <BookLink>{t("cta")}</BookLink>
      </div>
    </GalleryWalk>
  );
}
