import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { BAKIM_MODU } from "@/lib/bakim";

/**
 * /robots.txt — tüm public içeriği taramaya aç, admin & api'yi hariç tut.
 */
export default function robots(): MetadataRoute.Robots {
  // Bakım modunda tüm site taramaya kapalı.
  if (BAKIM_MODU) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
