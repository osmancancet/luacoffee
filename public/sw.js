// Lua Coffee — service worker (PWA + çevrimdışı + push bildirimi)
const CACHE = "lua-v2";

// ——— Push bildirimi ———
self.addEventListener("push", (event) => {
  let veri = {};
  try {
    veri = event.data ? event.data.json() : {};
  } catch {
    veri = { baslik: "Lua Coffee", govde: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    self.registration.showNotification(veri.baslik || "Lua Coffee", {
      body: veri.govde || "",
      icon: "/logo.png",
      badge: "/logo.png",
      data: { url: veri.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const hedef = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((liste) => {
      for (const c of liste) {
        if (c.url.includes(hedef) && "focus" in c) return c.focus();
      }
      return self.clients.openWindow(hedef);
    }),
  );
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(["/"]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Dinamik / kişisel uçları (API, admin, auth) önbelleğe alma — her zaman ağdan.
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/auth")
  ) {
    return;
  }

  // Ağ öncelikli, çevrimdışıysa önbellekten.
  event.respondWith(
    fetch(request)
      .then((res) => {
        const kopya = res.clone();
        caches.open(CACHE).then((c) => c.put(request, kopya)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(request).then((r) => r || caches.match("/"))),
  );
});
