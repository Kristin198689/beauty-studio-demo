import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Book } from "@/components/depth/Book";
import { Carousel } from "@/components/depth/Carousel";
import { Deck } from "@/components/depth/Deck";
import { Doors } from "@/components/depth/Doors";
import { Floor } from "@/components/depth/Floor";
import { Pupil } from "@/components/depth/Pupil";
import { Tunnel } from "@/components/depth/Tunnel";
import { Wall } from "@/components/depth/Wall";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { Principles, Process, StatementA, StatementB, StatementC } from "@/components/sections/Dividers";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { SpotlightSection } from "@/components/sections/SpotlightSection";
import { QuizSection } from "@/components/sections/QuizSection";
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
      <Tunnel />
      <StatementA />
      <Gallery />
      <About />
      <Pupil />
      <Principles />
      <Pricing />
      <Deck />
      <QuizSection />
      <Book />
      <Faq />
      <Carousel />
      <StatementB />
      <Wall />
      <Process />
      <SpotlightSection />
      <StatementC />
      <Floor />
      <MarqueeStrip />
      <Doors />
      <Contact />
    </main>
  );
}
