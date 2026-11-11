import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { MarqueeStrip } from "@/components/sections/MarqueeStrip";
import { Pricing } from "@/components/sections/Pricing";
import { Services } from "@/components/sections/Services";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const meta = use(getTranslations({ locale, namespace: "meta" }));
  const svc = use(getTranslations({ locale, namespace: "services.items" }));

  return (
    <main>
      <JsonLd
        locale={locale}
        description={meta("description")}
        services={["classic", "volume", "manicure", "gel", "cut", "colour"].map((k) => svc(k))}
      />
      <Hero />
      <MarqueeStrip />
      <Intro />
      <Services />
      <Gallery />
      <About />
      <Pricing />
      <Faq />
      <Contact />
    </main>
  );
}
