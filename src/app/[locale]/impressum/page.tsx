import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function Page({ params }: PageProps<"/[locale]/impressum">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("legal");

  return (
    <main style={{ padding: "calc(var(--header-h) + 4rem) var(--gutter) 8rem", minHeight: "70svh" }}>
      <h1 style={{ fontSize: "var(--fs-head)" }}>Impressum</h1>
      <p style={{ marginTop: "2rem" }}>{t("todo")}</p>
    </main>
  );
}
