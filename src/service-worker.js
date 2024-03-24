const CACHE_NAME = 'resto_v1';

const addResourcesToCache = async (resources) => {
	const cache = await caches.open(CACHE_NAME);
	await cache.addAll(resources);
};

const addResponseToCache = async (request, response) => {
	const cache = await caches.open(CACHE_NAME);
	await cache.put(request, response);
};

const cacheFirst = async (request) => {
	const dataFromCache = await caches.match(request);

	if (dataFromCache) {
		return dataFromCache;
	}

	try {
		const responseFromNetwork = await fetch(request.clone());
		addResponseToCache(request, responseFromNetwork.clone());

		return responseFromNetwork;
	} catch {
		return new Response('Network error happened', { status: 408 });
	}
};

const networkFirst = async (request) => {
	try {
		const responseFromNetwork = await fetch(request.clone());
		addResponseToCache(request, responseFromNetwork.clone());

		return responseFromNetwork;
	} catch {
		const dataFromCache = await caches.match(request);

		if (dataFromCache) {
			return dataFromCache;
		}

		return new Response('Network error happened', { status: 408 });
	}
};

self.addEventListener('install', (event) => {
	event.waitUntil(addResourcesToCache(['/', '/index.html', '/styles.css', '/app.js']));
});

self.addEventListener('activate', async () => {
	const cacheNames = await caches.keys();

	await Promise.all(
		cacheNames.map(async (cacheName) => {
			if (cacheName !== CACHE_NAME) {
				await caches.delete(cacheName);
			}
		}),
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	const destination = event.request.destination;

	if (['image', 'font'].includes(destination)) {
		event.respondWith(cacheFirst(event.request));
		return;
	}

	event.respondWith(networkFirst(event.request));
});
