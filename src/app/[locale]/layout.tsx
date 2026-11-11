import type { Metadata } from "next";
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
import { siteConfig } from "@/config/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
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
          {children}
          <Footer />
          <FloatingContact />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
