import { useTranslations } from "next-intl";
import styles from "./Faq.module.css";

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { q: string; a: string }[];

  return (
    <section id="faq" className={styles.section} data-chapter="paper">
      <h2 className={styles.heading}>{t("title")}</h2>
      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.q} className={`${styles.row} reveal`}>
            <h3 className={styles.q}>{item.q}</h3>
            <p className={styles.a}>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
