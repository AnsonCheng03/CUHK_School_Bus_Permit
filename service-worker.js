const CACHE_PREFIX = 'cu-bus-permit-';
const RELEASE_VERSION = '20260809200000';
const CACHE_NAME = `${CACHE_PREFIX}${RELEASE_VERSION}`;
const APP_SHELL = [
    './',
    './index.html',
    `./bootstrap.js?v=${RELEASE_VERSION}`,
    `./style.css?v=${RELEASE_VERSION}`,
    `./spa.css?v=${RELEASE_VERSION}`,
    `./script.js?v=${RELEASE_VERSION}`,
    './site.webmanifest',
    `./getcard/style.css?v=${RELEASE_VERSION}`,
    './getcard/images/CUHK.png',
    './getcard/images/schbus_d.png',
    './getcard/images/schbus_l.png',
    './bus-app-icon-256.png',
    './app-store-badge.svg',
    './google-play-badge.png',
    './website-qr.png'
];

function scopedUrl(path) {
    return new URL(path, self.registration.scope).href;
}

async function broadcastProgress(completed, total) {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach((client) => client.postMessage({
        type: 'CACHE_PROGRESS',
        version: RELEASE_VERSION,
        completed,
        total
    }));
}

async function refreshAppShell() {
    const cache = await caches.open(CACHE_NAME);
    let completed = 0;
    await Promise.all(APP_SHELL.map(async (path) => {
        const request = new Request(scopedUrl(path), { cache: 'reload' });
        const response = await fetch(request);
        if (!response.ok) throw new Error(`Unable to cache ${path}`);
        await cache.put(request, response);
        completed += 1;
        await broadcastProgress(completed, APP_SHELL.length);
    }));
}

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        await refreshAppShell();
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames
            .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
            .map((name) => caches.delete(name)));
        await self.clients.claim();
    })());
});

async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(new Request(request, { cache: 'no-cache' }));
        if (!response.ok) {
            return await cache.match(request, { ignoreSearch: true }) || response;
        }
        await cache.put(request, response.clone());
        return response;
    } catch {
        const cached = await cache.match(request, { ignoreSearch: true });
        if (cached) return cached;
        return Response.error();
    }
}

async function networkFirstNavigation(request) {
    const cache = await caches.open(CACHE_NAME);
    const fallbackUrl = scopedUrl('./index.html');
    try {
        const response = await fetch(new Request(request, { cache: 'no-cache' }));
        if (!response.ok) return await cache.match(fallbackUrl) || response;
        await cache.put(fallbackUrl, response.clone());
        return response;
    } catch {
        return await cache.match(fallbackUrl) || Response.error();
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(networkFirstNavigation(request));
        return;
    }

    event.respondWith(networkFirst(request));
});
