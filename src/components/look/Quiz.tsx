"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./Quiz.module.css";

type Area = "eyes" | "hands" | "hair";
type Style = "natural" | "bold";
type Freq = "often" | "monthly" | "rarely";

const AREAS: Area[] = ["eyes", "hands", "hair"];
const STYLES: Style[] = ["natural", "bold"];
const FREQS: Freq[] = ["often", "monthly", "rarely"];

// service for each area and style (keys of services.items)
const MAP: Record<Area, Record<Style, string>> = {
  eyes: { natural: "classic", bold: "volume" },
  hands: { natural: "manicure", bold: "gel" },
  hair: { natural: "cut", bold: "colour" },
};

export function Quiz() {
  const t = useTranslations("quiz");
  const s = useTranslations("services");
  const [step, setStep] = useState(0);
  const [area, setArea] = useState<Area | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [freq, setFreq] = useState<Freq | null>(null);

  const done = step === 3 && area && style && freq;
  const service = area && style ? MAP[area][style] : "";

  const pick = (fn: () => void) => {
    fn();
    setStep((v) => v + 1);
  };

  const note = done
    ? `${t("noteLabel")}: ${t(`a1.${area}`)}, ${t(`a2.${style}`)}, ${t(`a3.${freq}`)}`
    : "";

  return (
    <div className={styles.quiz}>
      {!done ? (
        <>
          <p className={styles.count} aria-live="polite">
            {t("question")} {step + 1} {t("of")} 3
          </p>
          <h3 className={styles.q}>{t(`q${step + 1}`)}</h3>
          <div className={styles.options} role="group" aria-label={t(`q${step + 1}`)}>
            {step === 0 &&
              AREAS.map((k) => (
                <button key={k} type="button" className={styles.option} onClick={() => pick(() => setArea(k))}>
                  {t(`a1.${k}`)}
                </button>
              ))}
            {step === 1 &&
              STYLES.map((k) => (
                <button key={k} type="button" className={styles.option} onClick={() => pick(() => setStyle(k))}>
                  {t(`a2.${k}`)}
                </button>
              ))}
            {step === 2 &&
              FREQS.map((k) => (
                <button key={k} type="button" className={styles.option} onClick={() => pick(() => setFreq(k))}>
                  {t(`a3.${k}`)}
                </button>
              ))}
          </div>
        </>
      ) : (
        <div className={styles.result} role="status">
          <p className={styles.count}>{t("result")}</p>
          <h3 className={styles.answer}>{s(`items.${service}`)}</h3>
          <p className={styles.freq}>{t(`freq.${freq}`)}</p>
          <div className={styles.actions}>
            <Link
              href={`/booking?service=${service}&note=${encodeURIComponent(note)}`}
              className={styles.cta}
              data-magnetic
              data-scramble
            >
              {t("cta")}
            </Link>
            <button
              type="button"
              className={styles.restart}
              onClick={() => {
                setStep(0);
                setArea(null);
                setStyle(null);
                setFreq(null);
              }}
            >
              {t("restart")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
