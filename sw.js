
const staticCacheName = 'currency-converter-v1';
const apiCache = 'currency-api-v1';
var allCaches = [
  staticCacheName,
  apiCache
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        './',
        './index.html',
        './js/main.js',
        './js/index.js',
        './css/style.css',
        './css/bootstrap.css'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('currency-') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  apiUrl = 'https://free.currencyconverterapi.com/api/v5/currencies';
    // If there is network available
    if (event.request.url.indexOf(apiUrl) === 0) {
      event.respondWith(
        fetch(event.request).then(response =>
          caches.open(apiCache).then(cache => {
            cache.put(event.request.url, response.clone());
            return response;
          }),
        ),
      );
    }
    else{
      // event.respondWith(
      //   caches.match(event.request).then(function(response) {
      //     return response || fetch(event.request);
      //   })
      // );
      event.respondWith(
        caches
          .match(event.request)
          .then(response => response || fetch(event.request)),
      

      );

    }

  
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});