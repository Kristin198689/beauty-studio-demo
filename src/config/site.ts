// Single place for client data. Empty values are TODO until a real client is known.
export const siteConfig = {
  name: "Studio",
  // Public site URL. Set NEXT_PUBLIC_SITE_URL in the hosting environment; this is a safe local fallback.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100",
  // International format, digits only, e.g. "491701234567". TODO real number.
  // Page transition: "blink" (eyelids close and open) or "curtain" (dark panel slides over)
  transition: "blink" as "blink" | "curtain",
  // Booking is a REQUEST that the studio confirms. Days listed here cannot be chosen.
  booking: {
    // 0 = Sunday ... 6 = Saturday. TODO real days off, e.g. [0]
    closedWeekdays: [] as number[],
    // Dates that are taken or closed, "YYYY-MM-DD". TODO holidays and vacations
    blockedDates: [] as string[],
    // Earliest day that can be requested, counted from today. 1 = from tomorrow
    minLeadDays: 1,
  },
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
