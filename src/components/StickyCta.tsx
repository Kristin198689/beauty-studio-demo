"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import styles from "./StickyCta.module.css";

// Mobile only: a booking bar that appears after the first screen.
export function StickyCta() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector("footer");
      const nearFooter = footer
        ? footer.getBoundingClientRect().top < window.innerHeight * 0.6
        : false;
      setShow(window.scrollY > window.innerHeight * 0.8 && !nearFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname === "/booking") return null;

  return (
    <div className={styles.bar} data-show={show} aria-hidden={!show}>
      <Link href="/booking" className={styles.link} tabIndex={show ? 0 : -1}>
        {t("book")}
      </Link>
    </div>
  );
}
