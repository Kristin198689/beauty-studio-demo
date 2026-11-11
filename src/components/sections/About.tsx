import { useTranslations } from "next-intl";
import { Photo } from "../ui/Photo";
import styles from "./About.module.css";

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className={styles.section} data-chapter="paper" aria-label={t("lead")}>
      <dl className={styles.facts}>
        <div>
          <dt>{t("factPlace")}</dt>
          <dd>{t("factPlaceValue")}</dd>
        </div>
        <div>
          <dt>{t("factSince")}</dt>
          <dd>{t("factSinceValue")}</dd>
        </div>
        <div>
          <dt>{t("factReach")}</dt>
          <dd>{t("factReachValue")}</dd>
        </div>
      </dl>
      <div className={`${styles.story} reveal`}>
        <p className={styles.p}>
          <span className={styles.portrait} aria-hidden="true">
            <Photo slot="aboutPortrait" sizes="160px" />
          </span>
          <strong>{t("lead")}</strong>
          {t("p1")}
        </p>
        <p className={`${styles.p} ${styles.second}`}>{t("p2")}</p>
      </div>
    </section>
  );
}
