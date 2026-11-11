import { useTranslations } from "next-intl";
import { BookLink } from "../ui/BookLink";
import styles from "./Dividers.module.css";

const em = { em: (c: React.ReactNode) => <em>{c}</em> };

// Big calm statement on paper
export function StatementA() {
  const t = useTranslations("dividers");
  return (
    <section className={styles.statement} data-chapter="paper" aria-label={t("principles.title")}>
      <p className={styles.big} data-split>
        {t.rich("a", em)}
      </p>
    </section>
  );
}

// Three short principles, no cards
export function Principles() {
  const t = useTranslations("dividers.principles");
  const items = t.raw("items") as { t: string; d: string }[];
  return (
    <section className={styles.cols} data-chapter="paper">
      <h2 className={styles.label}>{t("title")}</h2>
      <div className={styles.list}>
        {items.map((it) => (
          <div key={it.t} className={`${styles.item} reveal`}>
            <h3 className={styles.word}>{it.t}</h3>
            <p className={styles.text}>{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Poster line on black
export function StatementB() {
  const t = useTranslations("dividers");
  return (
    <section className={styles.poster} data-chapter="paper">
      <p className={styles.posterText} data-split>
        {t.rich("b", em)}
      </p>
    </section>
  );
}

// How a visit works
export function Process() {
  const t = useTranslations("dividers.process");
  const items = t.raw("items") as { t: string; d: string }[];
  return (
    <section className={styles.cols} data-chapter="paper">
      <h2 className={styles.label}>{t("title")}</h2>
      <div className={styles.list}>
        {items.map((it) => (
          <div key={it.t} className={`${styles.item} reveal`}>
            <h3 className={styles.word}>{it.t}</h3>
            <p className={styles.text}>{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Closing line with a booking link
export function StatementC() {
  const t = useTranslations("dividers.c");
  return (
    <section className={styles.statement} data-chapter="paper">
      <p className={styles.big} data-split>
        {t.rich("text", em)}
      </p>
      <div className={styles.action}>
        <BookLink>{t("cta")}</BookLink>
      </div>
    </section>
  );
}
