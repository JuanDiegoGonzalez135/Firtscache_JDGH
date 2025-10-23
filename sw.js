const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const APP_SHELL = [
  './',
  './index.html',
  './calendar.html',
  './form.html',
  './css/style.css',
  './js/app.js',
  './images/offline.png',
  './images/icons/192.png',
  './images/icons/512.png',
  './images/icons/180.png',
];


self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
  );
});


self.addEventListener('activate', event => {
  console.log('[SW] Activando...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map(key => caches.delete(key))
      )
    )
  );
});


self.addEventListener('fetch', event => {
  const req = event.request;
  const url = req.url;

 
  if (url.includes('fullcalendar') || url.includes('select2') || url.includes('jquery')) {
    event.respondWith(
      caches.match(req).then(cacheRes => {
        return cacheRes || fetch(req).then(networkRes => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(req, networkRes.clone());
            return networkRes;
          });
        });
      })
    );
    return;
  }


  event.respondWith(
    caches.match(req).then(cacheRes => {
      if (cacheRes) return cacheRes;

      return fetch(req).then(networkRes => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(req, networkRes.clone());
          return networkRes;
        });
      }).catch(() => caches.match('./images/offline.jpg'));
    })
  );
});
