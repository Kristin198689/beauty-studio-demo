import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { fontAccent, fontMain } from "@/config/fonts";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Companion } from "@/components/motion/Companion";
import { Motion } from "@/components/motion/Motion";
import { FloatingContact } from "@/components/FloatingContact";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SideNav } from "@/components/SideNav";
import { siteConfig } from "@/config/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Colour of the browser bar on phones (the first screen is black)
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "light dark",
};

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: ["/favicon.ico"],
    },
    appleWebApp: { title: siteConfig.name, capable: true, statusBarStyle: "black-translucent" },
    other: { "msapplication-TileColor": "#0a0a0a" },
    ...buildMetadata({ locale, title: t("title"), description: t("description") }),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${fontMain.variable} ${fontAccent.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="js-flag" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js');setTimeout(function(){if(!window.__motionReady)document.documentElement.classList.add('motion-failsafe')},4000)"}
        </Script>
        <NextIntlClientProvider>
          <Motion name={siteConfig.name} />
          <Companion />
          <Header />
          <ScrollProgress />
          <SideNav />
          {children}
          <Footer />
          <FloatingContact />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
