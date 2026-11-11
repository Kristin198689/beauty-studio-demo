import { useTranslations } from "next-intl";
import { Quiz } from "../look/Quiz";
import styles from "./Look.module.css";

export function QuizSection() {
  const t = useTranslations("quiz");

  return (
    <section id="quiz" className={styles.section} data-chapter="paper">
      <h2 className={styles.title} data-split>
        <span>{t("title1")}</span>
        <span>{t.rich("title2", { em: (c) => <em>{c}</em> })}</span>
      </h2>
      <p className={styles.lead}>{t("lead")}</p>
      <Quiz />
    </section>
  );
}
