self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // Offline fallback logic could go here, but for now we just pass through
  e.respondWith(fetch(e.request).catch(() => {
    return new Response('Offline mód. Kérjük, csatlakozzon az internethez.', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }));
});
