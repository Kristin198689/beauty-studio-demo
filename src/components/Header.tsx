"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { BookLink } from "./ui/BookLink";
import { LangSwitcher } from "./LangSwitcher";
import styles from "./Header.module.css";

type Ink = "paper" | "field";

const links = [
  { href: "/#services", key: "services" },
  { href: "/#gallery", key: "gallery" },
  { href: "/#about", key: "about" },
  { href: "/#contact", key: "contact" },
] as const;

// Colour by chapter: the header takes the ink of the chapter under it.
export function Header() {
  const t = useTranslations("nav");
  const [ink, setInk] = useState<Ink>("paper");
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={styles.header} data-ink={open ? "field" : ink}>
        <Link href="/" className={styles.mark} onClick={() => setOpen(false)}>
          {siteConfig.name}
        </Link>
        <nav className={styles.nav} aria-label="Main">
          {links.map((l) => (
            <Link key={l.key} href={l.href}>
              {t(l.key)}
            </Link>
          ))}
        </nav>
        <div className={styles.end}>
          <LangSwitcher />
          <BookLink className={styles.book}>{t("book")}</BookLink>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t("close") : t("menu")}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={styles.menu}
        data-open={open}
        aria-hidden={!open}
        data-lenis-prevent
      >
        <nav aria-label="Mobile">
          <ul className={styles.menuList}>
            {links.map((l) => (
              <li key={l.key}>
                <Link
                  href={l.href}
                  className={styles.menuLink}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/booking"
                className={`${styles.menuLink} ${styles.menuBook}`}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                {t("book")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
