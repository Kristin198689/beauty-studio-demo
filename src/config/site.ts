// Single place for client data. Empty values are TODO until a real client is known.
export const siteConfig = {
  name: "Studio",
  // Public site URL. Set NEXT_PUBLIC_SITE_URL in the hosting environment; this is a safe local fallback.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100",
  // International format, digits only, e.g. "491701234567". TODO real number.
  whatsappNumber: "",
  // International format with +, e.g. "+491701234567". TODO real number.
  phone: "",
  email: "",
  instagram: "",
};

export function whatsappHref(message?: string, fallback = "#contact"): string {
  const digits = siteConfig.whatsappNumber.replace(/\D/g, "");
  if (!digits) return fallback;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
