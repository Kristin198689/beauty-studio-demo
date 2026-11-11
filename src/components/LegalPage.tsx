import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import styles from "./LegalPage.module.css";

type Block = { h: string; p: string };

// Legal pages. In demo mode they say plainly that this is a demonstration project.
// For a real client set siteConfig.demo to false and supply the real legal texts.
export function LegalPage({ kind, title }: { kind: "imprint" | "privacy"; title: string }) {
  const t = useTranslations("legal");
  const blocks = siteConfig.demo ? (t.raw(kind) as Block[]) : [];

  return (
    <main className={styles.main} data-chapter="paper">
      <h1 className={styles.title}>{title}</h1>
      {siteConfig.demo ? (
        <div className={styles.body}>
          {blocks.map((b) => (
            <section key={b.h} className={styles.block}>
              <h2 className={styles.h}>{b.h}</h2>
              <p className={styles.p}>{b.p}</p>
            </section>
          ))}
          {siteConfig.portfolioImprintUrl ? (
            <p className={styles.p}>
              <a href={siteConfig.portfolioImprintUrl} rel="noopener noreferrer" target="_blank">
                {siteConfig.developer}, Impressum
              </a>
            </p>
          ) : null}
        </div>
      ) : (
        <p className={styles.p}>{t("todo")}</p>
      )}
    </main>
  );
}
