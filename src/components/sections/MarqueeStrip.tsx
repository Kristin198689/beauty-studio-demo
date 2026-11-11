import { useTranslations } from "next-intl";
import { Marquee } from "../motion/Marquee";

export function MarqueeStrip() {
  const t = useTranslations("marquee");
  const em = { em: (c: React.ReactNode) => <em>{c}</em> };

  return (
    <section data-chapter="field" aria-hidden="true">
      <Marquee>
        <span>{t.rich("a", em)}</span>
        <span>—</span>
        <span>{t.rich("b", em)}</span>
        <span>—</span>
        <span>{t.rich("c", em)}</span>
        <span>—</span>
      </Marquee>
    </section>
  );
}
