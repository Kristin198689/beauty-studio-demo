import { useTranslations } from "next-intl";
import { Photo } from "../ui/Photo";
import { Spotlight } from "../motion/Spotlight";
import styles from "./SpotlightSection.module.css";

export function SpotlightSection() {
  const t = useTranslations("spotlight");

  return (
    <section id="light" className={styles.section} data-chapter="field">
      <div className={styles.copy}>
        <h2 className={styles.title} data-split>
          <span>{t("title1")}</span>
          <span>{t.rich("title2", { em: (c) => <em>{c}</em> })}</span>
        </h2>
        <p className={styles.hint}>{t("hint")}</p>
      </div>
      <div className={styles.frame}>
        <Spotlight>
          <div>
            <Photo slot="walk5" sizes="(min-width: 56rem) 40vw, 100vw" shine={false} />
          </div>
          <div>
            <Photo slot="walk5" sizes="(min-width: 56rem) 40vw, 100vw" shine={false} />
          </div>
        </Spotlight>
      </div>
    </section>
  );
}
