"use client";

import { useEffect } from "react";

/**
 * Bakım süresince PWA service worker'ını ve önbelleğini temizler; böylece ana
 * ekrana eklenmiş uygulamalarda eski sayfalar gösterilmez.
 */
export function BakimTemizle() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((liste) => liste.forEach((r) => r.unregister()))
        .catch(() => {});
    }
    if ("caches" in window) {
      caches
        .keys()
        .then((anahtarlar) => anahtarlar.forEach((a) => caches.delete(a)))
        .catch(() => {});
    }
  }, []);

  return null;
}
