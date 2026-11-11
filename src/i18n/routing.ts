import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "uk", "en"],
  defaultLocale: "de",
});

export type Locale = (typeof routing.locales)[number];
