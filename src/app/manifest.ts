import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * PWA manifesti → /manifest.webmanifest
 * "Ana ekrana ekle" ile uygulama gibi yüklenmesini sağlar.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lua Coffee",
    short_name: "Lua",
    description: site.aciklama,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0b0d",
    theme_color: "#0b0b0d",
    lang: "tr",
    categories: ["food", "lifestyle"],
    icons: [
      { src: "/logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
