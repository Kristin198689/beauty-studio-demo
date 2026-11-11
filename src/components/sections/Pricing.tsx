import { useTranslations } from "next-intl";
import { BookLink } from "../ui/BookLink";
import styles from "./Pricing.module.css";

export function Pricing() {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className={styles.section} data-chapter="field">
      <h2 className={`${styles.sentence} reveal`}>
        {t("pre")} <span className={styles.price}>{t("price")}</span>
      </h2>
      <div className={styles.foot}>
        <p className={styles.text}>{t("text")}</p>
        <div className={styles.action}>
          <BookLink>{t("cta")}</BookLink>
          <p className={styles.link}>{t("link")}</p>
        </div>
      </div>
    </section>
  );
}
