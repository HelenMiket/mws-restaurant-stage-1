const runtimeCache = 'restaurant-runtime-cache';
const staticCache = 'restaurant-static-cache-v5';

const staticCachedResources = [
  '/index.html',
  '/',
  '/restaurant.html',
  '/css/styles.css',
  '/css/large-styles.css',
  '/css/medium-styles.css',
  '/css/small-styles.css',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg'
];

self.addEventListener('fetch', function (event) {
  console.log(event.request);
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        console.log("Response from the cache");
        return cachedResponse;
      }

      return caches.open(runtimeCache).then(cache => {
        return fetch(event.request).then(response => {
          // Put a copy of the response in the runtime cache.
          console.log("Put the response of request " + event.request.url + " in runtimeCache");
          return cache.put(event.request, response.clone()).then(() => {
            console.log("Succeeded in putting the response of request " + event.request.url + " in runtimeCache");
            return response;
          }).catch((error) => {
            console.log("Failed in putting the response of request " + event.request.url + " in runtimeCache");
          });
         
          // return response;
        }).catch((error) => {
          console.log("Failed request: " + event.request.url);
          console.log("error: " + error.message | error);
        });
      });
    })
  );
});

// The install handler precache the resources we always need.

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCache)
      .then(cache => cache.addAll(staticCachedResources))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', function (event) {
  const currentCaches = [staticCache, runtimeCache];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => cacheName.startsWith('restaurant-') && !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

