// Single place for client data. Empty values are TODO until a real client is known.
export const siteConfig = {
  name: "Studio",
  // International format, digits only, e.g. "491701234567". TODO real number.
  whatsappNumber: "",
  email: "",
  instagram: "",
};

export function whatsappHref(message?: string, fallback = "#contact"): string {
  const digits = siteConfig.whatsappNumber.replace(/\D/g, "");
  if (!digits) return fallback;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
