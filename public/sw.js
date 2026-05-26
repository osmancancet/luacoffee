// Lua Coffee — basit service worker (PWA / uygulama gibi yükleme + temel çevrimdışı)
const CACHE = "lua-v1";

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
