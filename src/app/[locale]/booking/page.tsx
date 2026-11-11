import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { buildMetadata } from "@/lib/seo";
import { BookingWizard } from "@/components/booking/BookingWizard";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/booking">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const m = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/booking", title: t("book"), description: m("description") });
}

export default function BookingPage({ params }: PageProps<"/[locale]/booking">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("booking");

  return (
    <main className={styles.main} data-chapter="paper">
      <h1 className={styles.title} data-split>
        <span>{t("title1")}</span>
        <span>{t.rich("title2", { em: (c) => <em>{c}</em> })}</span>
      </h1>
      <BookingWizard />
    </main>
  );
}
