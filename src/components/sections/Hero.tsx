import { useTranslations } from "next-intl";
import { heroVideo, images } from "@/config/images";
import { Photo } from "../ui/Photo";
import { BookLink } from "../ui/BookLink";
import { ChromeBlob } from "../motion/ChromeBlob";
import styles from "./Hero.module.css";

export function Hero() {
  const t = useTranslations("hero");
  const g = useTranslations("gallery.words");

  return (
    <section id="top" className={styles.hero} data-chapter="field">
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgDesktop}>
          <Photo slot="heroBgDesktop" sizes="100vw" priority shine={false} />
          {heroVideo ? (
            <video
              className={styles.video}
              src={heroVideo}
              poster={images.heroBgDesktop ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : null}
        </div>
        <div className={styles.bgMobile}>
          <Photo slot="heroBgMobile" sizes="100vw" priority shine={false} />
        </div>
      </div>

      <div className={styles.chrome} aria-hidden="true">
        <ChromeBlob />
      </div>

      <p className={styles.vertical} aria-hidden="true">
        {g("a")} · {g("b")} · {g("c")}
      </p>

      <h1 className={styles.title} data-split data-delay="0.1">
        <span className={styles.line}>{t("line1")}</span>
        <span className={styles.line}>
          {t("line2Start")}
          <span className={styles.slot} aria-hidden="true">
            <Photo slot="heroSlot" sizes="(min-width: 1024px) 30vw, 50vw" mask shine={false} />
          </span>
          {t.rich("line2End", { em: (c) => <em>{c}</em> })}
        </span>
      </h1>

      <div className={styles.foot}>
        <p className={styles.lead}>{t("lead")}</p>
        <BookLink>{t("cta")}</BookLink>
      </div>
    </section>
  );
}
