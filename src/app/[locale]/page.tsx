import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { MarqueeStrip } from "@/components/sections/MarqueeStrip";
import { Pricing } from "@/components/sections/Pricing";
import { Services } from "@/components/sections/Services";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main>
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
