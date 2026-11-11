// Single place for client data. Empty values are TODO until a real client is known.
export const siteConfig = {
  name: "Studio",
  // Public site URL. Set NEXT_PUBLIC_SITE_URL in the hosting environment; this is a safe local fallback.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100",
  // International format, digits only, e.g. "491701234567". TODO real number.
  // Demo mode: shows "demo project" notes and demo legal pages. Set to false for a real client.
  demo: true,
  // Studio that built the site, credited at the very bottom of the footer
  developer: "Volodina Web Studio",
  developerUrl: "https://volodina-webstudio.de",
  // Impressum of the website that presents this demo (it names the provider)
  portfolioImprintUrl: "https://volodina-webstudio.de/de/impressum",
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
