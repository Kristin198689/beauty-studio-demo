import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig, whatsappHref } from "@/config/site";
import { BookLink } from "./ui/BookLink";
import styles from "./Footer.module.css";

export function Footer() {
  const t = useTranslations("footer");
  const wa = whatsappHref();

  return (
    <footer className={styles.footer} data-chapter="field">
      <div className={styles.top}>
        <div className={styles.invite}>
          <h2 className={styles.title}>
            <span>{t("invite1")}</span>
            <span>{t.rich("invite2", { em: (c) => <em>{c}</em> })}</span>
          </h2>
          <BookLink className={styles.cta}>{t("cta")}</BookLink>
        </div>
        <ul className={styles.links}>
          <li>
            <a
              href={wa}
              {...(wa.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              WhatsApp
            </a>
          </li>
          <li>
            <Link href="/impressum">{t("imprint")}</Link>
          </li>
          <li>
            <Link href="/datenschutz">{t("privacy")}</Link>
          </li>
        </ul>
      </div>
      <div className={styles.bottom}>
        <p className={styles.credits}>
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <span>{t("rights")}</span>
        </p>
        <p className={styles.wordmark} aria-hidden="true">
          {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
