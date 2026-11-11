import { useTranslations } from "next-intl";
import { Photo } from "../ui/Photo";
import { BookLink } from "../ui/BookLink";
import styles from "./Hero.module.css";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className={styles.hero} data-chapter="field">
      <div className={styles.bg} aria-hidden="true">
        <Photo slot="heroBg" sizes="100vw" priority />
      </div>
      <h1 className={styles.title}>
        <span className={styles.line}>{t("line1")}</span>
        <span className={styles.line}>
          {t("line2Start")}
          <span className={styles.slot} aria-hidden="true">
            <Photo slot="heroSlot" sizes="(min-width: 1024px) 30vw, 50vw" priority />
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
