const CACHE = 'v3';

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

self.addEventListener('fetch', (event) => {
	event.respondWith(
		(async function () {
			const response = await caches.match(event.request);
			return response || fetch(event.request);
		})(),
	);
});
