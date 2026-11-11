"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { BookLink } from "./ui/BookLink";
import { LangSwitcher } from "./LangSwitcher";
import styles from "./Header.module.css";

type Ink = "paper" | "field";

// Colour by chapter: the header takes the ink of the chapter under it.
export function Header() {
  const t = useTranslations("nav");
  const [ink, setInk] = useState<Ink>("paper");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = 36;
      const chapters = document.querySelectorAll<HTMLElement>("[data-chapter]");
      let next: Ink = "paper";
      chapters.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) {
          next = el.dataset.chapter === "field" ? "field" : "paper";
        }
      });
      setInk(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={styles.header} data-ink={ink}>
      <Link href="/" className={styles.mark}>
        {siteConfig.name}
      </Link>
      <nav className={styles.nav} aria-label="Main">
        <Link href="/#services">{t("services")}</Link>
        <Link href="/#gallery">{t("gallery")}</Link>
        <Link href="/#about">{t("about")}</Link>
        <Link href="/#contact">{t("contact")}</Link>
      </nav>
      <div className={styles.end}>
        <LangSwitcher />
        <BookLink className={styles.book}>{t("book")}</BookLink>
      </div>
    </header>
  );
}
