import { siteConfig } from "@/config/site";

// Structured data for the home page. Only real data: no address, phone, hours or reviews until known.
export function JsonLd({
  locale,
  description,
  services,
}: {
  locale: string;
  description: string;
  services: string[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}`,
    description,
    inLanguage: locale,
    knowsLanguage: ["de", "uk", "en"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: siteConfig.name,
      itemListElement: services.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
