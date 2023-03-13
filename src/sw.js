const CACHE = 'v1';

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE).then(function (cache) {
			return cache.addAll([
				'/splitto/',
				'/splitto/app.webmanifest',
				'/splitto/app.js',
				'/splitto/style.css',
				'/splitto/index.html',
			]);
		}),
	);
});

self.addEventListener('fetch', function (event) {
	// If a match isn't found in the cache, the response
	// will look like a connection error
	event.respondWith(caches.match(event.request));
});
