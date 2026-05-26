import { site } from "@/lib/site";

/**
 * LocalBusiness / CafeOrCoffeeShop yapılandırılmış verisi (schema.org).
 * Google'ın yerel işletme kartı, harita ve zengin sonuçlar için kullanılır.
 * Tüm bilgiler lib/site.ts'ten beslenir.
 */
export function JsonLd() {
  const { konum, iletisim } = site;

  const veri = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: site.ad,
    description: site.aciklama,
    url: site.url,
    image: `${site.url}/galeri/dis-cephe-2.webp`,
    logo: `${site.url}/logo.png`,
    servesCuisine: "Coffee",
    priceRange: konum.fiyatAraligi,
    address: {
      "@type": "PostalAddress",
      streetAddress: konum.sokakAdresi,
      addressLocality: konum.ilce,
      addressRegion: konum.il,
      postalCode: konum.postaKodu,
      addressCountry: konum.ulke,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: konum.enlem,
      longitude: konum.boylam,
    },
    hasMap: iletisim.haritaLink,
    sameAs: [iletisim.instagram],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "24:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "09:00",
        closes: "01:00",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // schema.org JSON-LD; içerik statik ve güvenli.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(veri) }}
    />
  );
}
