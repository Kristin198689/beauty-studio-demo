"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { siteConfig, whatsappHref } from "@/config/site";
import styles from "./FloatingContact.module.css";

// Small round contact button: WhatsApp if configured, else phone call, else booking page.
export function FloatingContact() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector("footer");
      const nearFooter = footer
        ? footer.getBoundingClientRect().top < window.innerHeight * 0.7
        : false;
      setShow(window.scrollY > window.innerHeight * 0.6 && !nearFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const wa = whatsappHref(undefined, "");
  const phone = siteConfig.phone.replace(/[^\d+]/g, "");

  const icon = phone && !wa ? (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.65-1.2A9 9 0 1 0 12 3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8.5 10.5h7M8.5 13.5h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );

  const common = {
    className: styles.button,
    "data-show": show,
    "aria-label": t("chat"),
    tabIndex: show ? 0 : -1,
  };

  if (pathname === "/booking") return null;

  if (wa) {
    return (
      <a {...common} href={wa} target="_blank" rel="noopener noreferrer">
        {icon}
      </a>
    );
  }
  if (phone) {
    return (
      <a {...common} href={`tel:${phone}`}>
        {icon}
      </a>
    );
  }
  return (
    <Link {...common} href="/booking">
      {icon}
    </Link>
  );
}
