import { useTranslations } from "next-intl";
import { Photo } from "../ui/Photo";
import styles from "./Intro.module.css";

export function Intro() {
  const t = useTranslations("intro");

  return (
    <section className={styles.intro} data-chapter="paper" aria-label={t("a")}>
      <p className={`${styles.text} reveal`}>
        {t("a")}{" "}
        <span className={styles.frame} aria-hidden="true">
          <Photo slot="introA" sizes="80px" mask />
        </span>{" "}
        {t("b")}{" "}
        <span className={styles.frame} aria-hidden="true">
          <Photo slot="introB" sizes="80px" mask />
        </span>{" "}
        {t("c")}
      </p>
    </section>
  );
}
