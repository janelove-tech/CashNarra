// CashNarra service worker.
// Caches public brand assets and an offline fallback page only. It never
// caches authenticated or financial responses, and it never applies an
// update on its own: the app asks it to skip waiting at a safe moment.
const CACHE = 'cashnarra-public-v4';
const OFFLINE = '/offline';
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([
    '/brand/cashnarra-symbol.svg', '/brand/cashnarra-logo.svg',
    '/brand/cashnarra-lockup-reversed.svg', '/brand/cashnarra-icon-192.png',
    OFFLINE
  ])));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('cashnarra-public-') && key !== CACHE)
      .map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // A page navigation goes to the network. Only when that fails does the
  // person see the offline page; nothing private is served from cache.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(CACHE);
      return (await cache.match(OFFLINE)) || Response.error();
    }));
    return;
  }
  if (!url.pathname.startsWith('/brand/') || url.search) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(request);
    if (hit) return hit;
    const response = await fetch(request);
    if (response.ok && !response.redirected && response.type !== 'opaque' &&
        !/private|no-store/i.test(response.headers.get('cache-control') || ''))
      await cache.put(request, response.clone());
    return response;
  }));
});
