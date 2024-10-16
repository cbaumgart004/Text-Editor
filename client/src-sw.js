const { offlineFallback, warmStrategyCache } = require('workbox-recipes')

// Cache first strategy for images, staleWhileRevalidate strategy for other requests
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies')
const { registerRoute } = require('workbox-routing')
const { CacheableResponsePlugin } = require('workbox-cacheable-response')
const { ExpirationPlugin } = require('workbox-expiration')
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute')

precacheAndRoute(self.__WB_MANIFEST)

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
})

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
})

registerRoute(({ request }) => request.mode === 'navigate', pageCache)

// Cache js and CSS files with a StaleWhileRevalidate strategy
registerRoute(
  // Cache JS and CSS files
  ({ request }) =>
    request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache successful responses
      }),
    ],
  })
)
// Cache images with a CacheFirst strategy
registerRoute(
  // Cache image files (e.g., .png, .jpg)
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50, // Only cache 50 images
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      }),
    ],
  })
)
