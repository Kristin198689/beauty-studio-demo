import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/impressum">): Promise<Metadata> {
  const { locale } = await params;
  const m = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/impressum", title: "Impressum", description: m("description") });
}

export default function Page({ params }: PageProps<"/[locale]/impressum">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <LegalPage kind="imprint" title="Impressum" />;
}
