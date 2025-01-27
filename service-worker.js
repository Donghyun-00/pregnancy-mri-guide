const CACHE_NAME = 'pregnancy-mri-cache-v2'; // Increment the cache version for updates
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './MRI_small.png',
  './MRI_big.png',
  './background image.jpeg',
  './mobile_image.jpeg'
];

// Install the service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate the service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log(`Deleting old cache: ${cache}`);
            return caches.delete(cache); // Delete old cache versions
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of the page immediately
});

// Fetch resources with network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Fetch fresh data from the network if not available in the cache
      return (
        response ||
        fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone()); // Update cache with the new data
            return networkResponse;
          });
        })
      );
    })
  );
});