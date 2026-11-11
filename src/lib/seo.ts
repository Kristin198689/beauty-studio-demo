import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";

const ogLocale: Record<string, string> = { de: "de_DE", uk: "uk_UA", en: "en_GB" };

// Per-page metadata: unique title and description, canonical, hreflang, Open Graph, Twitter.
export function buildMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}${path}`;
  languages["x-default"] = `/${routing.defaultLocale}${path}`;

  // Same picture for Facebook, WhatsApp, Telegram, LinkedIn and X (1200x630, one per language)
  const image = { url: `/og/og-${locale}.jpg`, width: 1200, height: 630, alt: title };

  return {
    title,
    description,
    alternates: { canonical: `/${locale}${path}`, languages },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: `/${locale}${path}`,
      locale: ogLocale[locale] ?? locale,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
