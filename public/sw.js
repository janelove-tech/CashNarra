const CACHE = 'cashnarra-public-v2';
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([
    '/brand/cashnarra-symbol.svg', '/brand/cashnarra-icon-192.png'
  ])));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('cashnarra-public-') && key !== CACHE)
      .map(key => caches.delete(key))
  )));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin ||
      !url.pathname.startsWith('/brand/') || url.search) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(event.request);
    if (hit) return hit;
    const response = await fetch(event.request);
    if (response.ok && !response.redirected && response.type !== 'opaque' &&
        !/private|no-store/i.test(response.headers.get('cache-control') || ''))
      await cache.put(event.request, response.clone());
    return response;
  }));
});
