import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";

const paths = ["", "/booking", "/impressum", "/datenschutz"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]),
        ),
      },
    })),
  );
}
