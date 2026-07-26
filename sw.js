// v2 : passage en stratégie "réseau d'abord" — corrige le problème où une
// mise à jour de index.html sur GitHub n'était pas prise en compte tant que
// le cache-first servait l'ancienne version.
const CACHE_NAME = "releve-prix-v2";
const CORE_ASSETS = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Réseau d'abord pour l'app shell : toujours essayer de récupérer la version
// la plus récente en ligne, et ne se rabattre sur le cache que si le réseau
// échoue (mode hors-ligne). Le cache est rafraîchi à chaque requête réussie.
// Tout le reste (import local de prix.json / dataset) n'est pas intercepté.
self.addEventListener("fetch", (event) => {
  if(event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isCoreAsset = CORE_ASSETS.some((a) => url.pathname.endsWith(a.replace("./", "")));
  if (!isCoreAsset) return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
