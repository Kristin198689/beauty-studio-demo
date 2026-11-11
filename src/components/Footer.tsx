import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig, whatsappHref } from "@/config/site";
import { BookLink } from "./ui/BookLink";
import { BackToTop } from "./BackToTop";
import styles from "./Footer.module.css";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const wa = whatsappHref();
  const external = wa.startsWith("http");

  return (
    <footer className={styles.footer} data-chapter="field">
      <div className={styles.top}>
        <div>
          <h2 className={styles.title} data-split>
            <span>{t("invite1")}</span>
            <span>{t.rich("invite2", { em: (c) => <em>{c}</em> })}</span>
          </h2>
          <BookLink className={styles.cta}>{t("cta")}</BookLink>
        </div>
      </div>

      <div className={styles.cols}>
        <nav aria-label={t("navTitle")}>
          <h3 className={styles.h}>{t("navTitle")}</h3>
          <ul className={styles.list}>
            <li>
              <Link href="/#services" data-scramble>{nav("services")}</Link>
            </li>
            <li>
              <Link href="/#gallery" data-scramble>{nav("gallery")}</Link>
            </li>
            <li>
              <Link href="/#about" data-scramble>{nav("about")}</Link>
            </li>
            <li>
              <Link href="/booking" data-scramble>{nav("book")}</Link>
            </li>
          </ul>
        </nav>
        <div>
          <h3 className={styles.h}>{t("contactTitle")}</h3>
          <ul className={styles.list}>
            <li>
              <a
                href={wa}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                WhatsApp
              </a>
            </li>
            {siteConfig.email ? (
              <li>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
            ) : null}
            {siteConfig.instagram ? (
              <li>
                <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer">
                  {t("social")}
                </a>
              </li>
            ) : null}
            <li>{t("address")}</li>
          </ul>
        </div>
        <div>
          <h3 className={styles.h}>{t("hoursTitle")}</h3>
          <ul className={styles.list}>
            <li>{t("hours")}</li>
          </ul>
        </div>
        <div className={styles.legal}>
          <ul className={styles.list}>
            <li>
              <Link href="/impressum" data-scramble>{t("imprint")}</Link>
            </li>
            <li>
              <Link href="/datenschutz" data-scramble>{t("privacy")}</Link>
            </li>
          </ul>
          <BackToTop label={t("top")} />
        </div>
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
