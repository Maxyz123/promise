let cache= null;
let dataCacheName = 'storyData-v1';
let cacheName = 'storyPWA-step-8-1';
let filesToCache = [
    '/',
    '/javascripts/app.js',
    '/stylesheets/inline.css',
    '/stylesheets/bootstrap_css/bootstrap.css',
    '/javascripts/bootstrap_js/bootstrap.js',
    '/javascripts/jquery.min.js',
    '/javascripts/database.js',
    '/javascripts/idb/index.js'
];

self.addEventListener('install', function (e){
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cacheX){
            console.log('[ServiceWorker] Caching app shell');
            cache = cacheX;
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e){
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList){
            return Promise.all(keyList.map(function (key){
                if (key !== cacheName && key !== dataCacheName){
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// TODO Remember to add a post here to activate the cache
self.addEventListener('fetch', function (e){
    console.log('[Service Worker] Fetch', e.request.url);
    let dataUrl = '/index';
    if (e.request.url.indexOf(dataUrl) > -1) {
        return fetch(e.request)
            .then( (response) => {
                return response;
            })
            .catch((error) => {
                return error;
            })
    }else {
        e.respondWith(
            caches.match(e.request).then(function (response){
                return response
                    || fetch(e.request)
                        .then(function (response){
                            if (!response.ok ||  response.statusCode>299){
                                console.log("error: " + response.error());
                            }else{
                                cache.add(e.request.url);
                                return response;
                            }
                        })
                        .catch(function (err){
                            console.log("error: " + err);
                        })
            })
        );
    }
});
