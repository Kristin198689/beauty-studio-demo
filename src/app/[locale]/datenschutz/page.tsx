import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/datenschutz">): Promise<Metadata> {
  const { locale } = await params;
  const m = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/datenschutz", title: "Datenschutz", description: m("description") });
}

export default function Page({ params }: PageProps<"/[locale]/datenschutz">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <LegalPage kind="privacy" title="Datenschutz" />;
}
