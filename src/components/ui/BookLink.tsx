import { Link } from "@/i18n/navigation";
import styles from "./BookLink.module.css";

// Leads to the step-by-step booking page. WhatsApp is the last step there.
export function BookLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href="/booking"
      className={`${styles.button} ${className ?? ""}`}
      data-magnetic
      data-cursor="Book"
    >
      {children}
    </Link>
  );
}
