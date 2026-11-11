import { useTranslations } from "next-intl";
import { Photo } from "../ui/Photo";
import { siteConfig, whatsappHref } from "@/config/site";
import styles from "./Contact.module.css";

export function Contact() {
  const t = useTranslations("contact");
  const nav = useTranslations("nav");
  const wa = whatsappHref();

  return (
    <section id="contact" className={styles.section} data-chapter="paper">
      <h2 className="srOnly">{nav("contact")}</h2>
      <p className={`${styles.text} reveal`}>{t("text")}</p>
      <div className={styles.portrait}>
        <Photo slot="contactPortrait" sizes="170px" />
      </div>
      <div className={styles.links}>
        <p className={styles.question}>{t("question")}</p>
        <a
          href={wa}
          className={styles.link}
          {...(wa.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {t("whatsapp")}
        </a>
        {siteConfig.email ? (
          <a href={`mailto:${siteConfig.email}`} className={styles.link}>
            {siteConfig.email}
          </a>
        ) : null}
        <p className={styles.note}>{t("note")}</p>
      </div>
    </section>
  );
}
