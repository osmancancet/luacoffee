import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Arama motorları için site haritası → /sitemap.xml
 * Yeni public sayfa eklerken bu listeye ekleyin (admin/api hariç).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const taban = site.url;
  const simdi = new Date();

  const yollar: { yol: string; oncelik: number; siklik: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { yol: "", oncelik: 1.0, siklik: "weekly" },
    { yol: "/hakkimizda", oncelik: 0.8, siklik: "monthly" },
    { yol: "/menu", oncelik: 0.9, siklik: "monthly" },
    { yol: "/galeri", oncelik: 0.7, siklik: "monthly" },
    { yol: "/yarisma", oncelik: 0.8, siklik: "daily" },
    { yol: "/yarisma/siralama", oncelik: 0.6, siklik: "daily" },
    { yol: "/yarisma/katil", oncelik: 0.6, siklik: "monthly" },
    { yol: "/etkinlikler", oncelik: 0.7, siklik: "weekly" },
    { yol: "/iletisim", oncelik: 0.8, siklik: "monthly" },
  ];

  return yollar.map(({ yol, oncelik, siklik }) => ({
    url: `${taban}${yol}`,
    lastModified: simdi,
    changeFrequency: siklik,
    priority: oncelik,
  }));
}
