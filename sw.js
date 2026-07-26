// v3 : le service worker ne touche plus jamais à index.html (ni à aucune
// requête de navigation). Il ne fait que mettre en cache manifest.json et
// les icônes, pour l'icône/le splash screen hors-ligne. La page principale
// passe toujours par le réseau normal du navigateur, comme un site sans
// service worker — ça élimine complètement le risque de rester bloqué sur
// une ancienne version.
const CACHE_NAME = "releve-prix-v3";
const STATIC_ASSETS = [
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
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

self.addEventListener("fetch", (event) => {
  if(event.request.method !== "GET") return;
  // Jamais d'interception d'une requête de navigation (la page HTML elle-même) :
  // toujours du réseau direct, jamais de version mise en cache.
  if(event.request.mode === "navigate") return;

  const url = new URL(event.request.url);
  const isStaticAsset = STATIC_ASSETS.some((a) => url.pathname.endsWith(a.replace("./", "")));
  if(!isStaticAsset) return;

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
