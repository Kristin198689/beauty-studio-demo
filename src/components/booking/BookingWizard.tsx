"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig, whatsappHref } from "@/config/site";
import styles from "./BookingWizard.module.css";

const services = ["classic", "volume", "manicure", "gel", "cut", "colour"] as const;
const times = ["morning", "afternoon", "evening", "flexible"] as const;
const STEPS = ["service", "day", "time", "details", "review"] as const;

type Service = (typeof services)[number];
type Time = (typeof times)[number];

function todayIso(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function BookingWizard() {
  const t = useTranslations("booking");
  const s = useTranslations("services");
  const locale = useLocale();
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [day, setDay] = useState("");
  const [time, setTime] = useState<Time | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const current = STEPS[step];

  const validate = (): string => {
    if (current === "service" && !service) return t("errors.service");
    if (current === "day" && (!day || day < todayIso())) return t("errors.day");
    if (current === "time" && !time) return t("errors.time");
    if (current === "details" && name.trim().length < 2) return t("errors.name");
    return "";
  };

  const go = (next: number) => {
    setStep(next);
    setError("");
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const onNext = () => {
    const e = validate();
    if (e) return setError(e);
    go(step + 1);
  };

  const dayLabel = day
    ? new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date(day + "T12:00:00"))
    : "";
  const serviceLabel = service ? s(`items.${service}`) : "";
  const timeLabel = time ? t(`times.${time}`) : "";

  const message = [
    t("message"),
    `${t("labels.service")}: ${serviceLabel}`,
    `${t("labels.day")}: ${dayLabel}`,
    `${t("labels.time")}: ${timeLabel}`,
    `${t("labels.name")}: ${name.trim()}`,
    note.trim(),
  ]
    .filter(Boolean)
    .join("\n");

  const wa = whatsappHref(message, "#");
  const hasNumber = wa.startsWith("http");

  if (done) {
    return (
      <div className={styles.wizard}>
        <div className={styles.thanks} role="status">
          <svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true" className={styles.check}>
            <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="3" />
            <path d="M19 33l9 9 17-19" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className={styles.thanksTitle}>{t("thanksTitle")}</h2>
          <p className={styles.thanksText}>{t("thanksText")}</p>
          <button
            type="button"
            className={styles.back}
            onClick={() => {
              setDone(false);
              setStep(0);
              setService(null);
              setDay("");
              setTime(null);
              setName("");
              setNote("");
            }}
          >
            {t("again")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wizard}>
      <p className={styles.count} aria-live="polite">
        {t("step")} {step + 1} / {STEPS.length}
      </p>
      <div className={styles.bars} aria-hidden="true">
        {STEPS.map((k, i) => (
          <span key={k} data-done={i <= step} />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (current !== "review") onNext();
        }}
        noValidate
      >
        <h2 ref={headingRef} tabIndex={-1} className={styles.q}>
          {t(`steps.${current}`)}
        </h2>

        {current === "service" && (
          <fieldset className={styles.options}>
            <legend className="srOnly">{t("steps.service")}</legend>
            {services.map((k) => (
              <label key={k} className={styles.option}>
                <input
                  type="radio"
                  name="service"
                  value={k}
                  checked={service === k}
                  onChange={() => setService(k)}
                />
                <span>{s(`items.${k}`)}</span>
              </label>
            ))}
          </fieldset>
        )}

        {current === "day" && (
          <div className={styles.field}>
            <label htmlFor="day" className="srOnly">
              {t("steps.day")}
            </label>
            <input
              id="day"
              type="date"
              className={styles.input}
              min={todayIso()}
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>
        )}

        {current === "time" && (
          <fieldset className={styles.options}>
            <legend className="srOnly">{t("steps.time")}</legend>
            {times.map((k) => (
              <label key={k} className={styles.option}>
                <input
                  type="radio"
                  name="time"
                  value={k}
                  checked={time === k}
                  onChange={() => setTime(k)}
                />
                <span>{t(`times.${k}`)}</span>
              </label>
            ))}
          </fieldset>
        )}

        {current === "details" && (
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              {t("fields.name")}
            </label>
            <input
              id="name"
              className={styles.input}
              type="text"
              maxLength={80}
              autoComplete="given-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="note" className={styles.label}>
              {t("fields.note")}
            </label>
            <textarea
              id="note"
              className={styles.input}
              rows={3}
              maxLength={400}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}

        {current === "review" && (
          <dl className={styles.summary}>
            <div>
              <dt>{t("labels.service")}</dt>
              <dd>{serviceLabel}</dd>
            </div>
            <div>
              <dt>{t("labels.day")}</dt>
              <dd>{dayLabel}</dd>
            </div>
            <div>
              <dt>{t("labels.time")}</dt>
              <dd>{timeLabel}</dd>
            </div>
            <div>
              <dt>{t("labels.name")}</dt>
              <dd>{name.trim()}</dd>
            </div>
            {note.trim() ? (
              <div>
                <dt>{t("fields.note")}</dt>
                <dd>{note.trim()}</dd>
              </div>
            ) : null}
          </dl>
        )}

        {error ? (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        ) : null}

        <div className={styles.actions}>
          {step > 0 ? (
            <button type="button" className={styles.back} onClick={() => go(step - 1)}>
              {t("back")}
            </button>
          ) : (
            <span />
          )}
          {current !== "review" ? (
            <button type="submit" className={styles.next}>
              {t("next")}
            </button>
          ) : (
            <a
              className={styles.next}
              href={wa}
              onClick={() => {
                if (hasNumber) setTimeout(() => setDone(true), 400);
              }}
              {...(hasNumber ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {t("send")}
            </a>
          )}
        </div>

        {current === "review" ? (
          <>
            {!hasNumber && !siteConfig.whatsappNumber ? (
              <p className={styles.note}>{t("noNumber")}</p>
            ) : null}
            <p className={styles.note}>{t("privacy")}</p>
          </>
        ) : null}
      </form>
    </div>
  );
}
