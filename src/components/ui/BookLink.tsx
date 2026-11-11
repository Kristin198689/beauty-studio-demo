import { whatsappHref } from "@/config/site";
import styles from "./BookLink.module.css";

export function BookLink({
  children,
  message,
  className,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  const href = whatsappHref(message);
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={`${styles.button} ${className ?? ""}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
