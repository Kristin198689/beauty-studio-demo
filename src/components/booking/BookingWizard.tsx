"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig, whatsappHref } from "@/config/site";
import styles from "./BookingWizard.module.css";

const services = ["classic", "volume", "manicure", "gel", "cut", "colour"] as const;
const times = ["morning", "afternoon", "evening", "flexible"] as const;
const STEPS = ["service", "day", "time", "details", "review"] as const;

type Service = (typeof services)[number];
type Time = (typeof times)[number];

function nextDays(locale: string, count = 28) {
  const { closedWeekdays, blockedDates, minLeadDays } = siteConfig.booking;
  const wd = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const mo = new Intl.DateTimeFormat(locale, { month: "short" });
  const out: { iso: string; wd: string; dn: number; mo: string; closed: boolean }[] = [];
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  for (let i = minLeadDays; i < minLeadDays + count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({
      iso,
      wd: wd.format(d),
      dn: d.getDate(),
      mo: mo.format(d),
      closed: closedWeekdays.includes(d.getDay()) || blockedDates.includes(iso),
    });
  }
  return out;
}

function todayIso(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function BookingWizard() {
  const t = useTranslations("booking");
  const s = useTranslations("services");
  const locale = useLocale();
  const params = useSearchParams();
  const preService = params.get("service");
  const initialService = (services as readonly string[]).includes(preService ?? "")
    ? (preService as Service)
    : null;
  const [step, setStep] = useState(initialService ? 1 : 0);
  const [service, setService] = useState<Service | null>(initialService);
  const [day, setDay] = useState("");
  const [backup, setBackup] = useState("");
  const [time, setTime] = useState<Time | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState((params.get("note") ?? "").slice(0, 400));
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const current = STEPS[step];
  const days = nextDays(locale);

  const validate = (): string => {
    if (current === "service" && !service) return t("errors.service");
    if (current === "day" && (!day || day < todayIso() || days.find((d) => d.iso === day)?.closed))
      return t("errors.day");
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

  const fmt = (iso: string) =>
    iso
      ? new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(
          new Date(iso + "T12:00:00"),
        )
      : "";
  const dayLabel = fmt(day);
  const backupLabel = fmt(backup);
  const serviceLabel = service ? s(`items.${service}`) : "";
  const timeLabel = time ? t(`times.${time}`) : "";

  const message = [
    t("message"),
    `${t("labels.service")}: ${serviceLabel}`,
    `${t("labels.day")}: ${dayLabel}`,
    backupLabel ? `${t("labels.backup")}: ${backupLabel}` : "",
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
              setBackup("");
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

      <p className={styles.requestNote} role="note">
        {t("requestNote")}
      </p>

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
          <>
            {[
              { name: "day", legend: t("preferred"), value: day, set: setDay, skip: "" },
              { name: "backup", legend: t("backup"), value: backup, set: setBackup, skip: day },
            ].map((g) => (
              <fieldset key={g.name} className={styles.days} data-lenis-prevent>
                <legend className={styles.dayLegend}>{g.legend}</legend>
                {days.map((d) => {
                  const off = d.closed || d.iso === g.skip;
                  return (
                    <label key={d.iso} className={styles.day} title={d.closed ? t("unavailable") : undefined}>
                      <input
                        type="radio"
                        name={g.name}
                        value={d.iso}
                        disabled={off}
                        checked={g.value === d.iso}
                        onChange={() => g.set(d.iso)}
                      />
                      <span>
                        <small>{d.wd}</small>
                        <b>{d.dn}</b>
                        <small>{d.mo}</small>
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            ))}
            {backup ? (
              <button type="button" className={styles.clear} onClick={() => setBackup("")}>
                ×
              </button>
            ) : null}
          </>
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
            {backupLabel ? (
              <div>
                <dt>{t("labels.backup")}</dt>
                <dd>{backupLabel}</dd>
              </div>
            ) : null}
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
            <p className={styles.reviewNote}>{t("reviewNote")}</p>
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
