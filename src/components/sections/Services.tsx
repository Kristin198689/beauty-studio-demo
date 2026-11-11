import { useTranslations } from "next-intl";
import { Photo } from "../ui/Photo";
import { ServicePreview } from "../motion/ServicePreview";
import { whatsappHref } from "@/config/site";
import styles from "./Services.module.css";

const groups = [
  { id: "lashes", items: ["classic", "volume"] },
  { id: "nails", items: ["manicure", "gel"] },
  { id: "hair", items: ["cut", "colour"] },
] as const;

export function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className={styles.section} data-chapter="paper">
      <h2 className={styles.title} data-split>
        <span>{t("title1")}</span>
        <span>{t.rich("title2", { em: (c) => <em>{c}</em> })}</span>
      </h2>

      <div className={styles.body}>
        <div className={styles.portrait}>
          <Photo slot="servicesPortrait" sizes="(min-width: 56rem) 22vw, 60vw" mask parallax={0.08} />
        </div>
        <div className={styles.table}>
          <p className={styles.label}>{t("label")}</p>
          {groups.map((g) => (
            <ul key={g.id} className={`${styles.group} reveal`}>
              {g.items.map((item) => {
                const name = t(`items.${item}`);
                const href = whatsappHref(name);
                return (
                  <li key={item}>
                    <a
                      href={href}
                      className={styles.row}
                      data-group={g.id}
                      data-cursor="Book"
                      {...(href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <span className={styles.kind}>{t(`groups.${g.id}`)}</span>
                      <span className={styles.name}>{name}</span>
                      <span className={styles.price}>
                        {t("price")} <span aria-hidden="true">→</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
      <ServicePreview>
        <div data-preview="lashes">
          <Photo slot="previewLashes" sizes="18vw" />
        </div>
        <div data-preview="nails">
          <Photo slot="previewNails" sizes="18vw" />
        </div>
        <div data-preview="hair">
          <Photo slot="previewHair" sizes="18vw" />
        </div>
      </ServicePreview>
    </section>
  );
}
