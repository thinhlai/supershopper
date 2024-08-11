'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "b8a50dcc08284775bcd23c36436509dc",
"version.json": "ca309e1fcccdd65287773c407cdf4dea",
"splash/img/light-2x.png": "59adf70339339f1ed1161f75007d9a3b",
"splash/img/dark-4x.png": "71a278c3ea6bae0fb0bc4fdc824c0af2",
"splash/img/light-3x.png": "f0fdad5466d294d4e270c2948e13752f",
"splash/img/dark-3x.png": "f0fdad5466d294d4e270c2948e13752f",
"splash/img/light-4x.png": "71a278c3ea6bae0fb0bc4fdc824c0af2",
"splash/img/dark-2x.png": "59adf70339339f1ed1161f75007d9a3b",
"splash/img/dark-1x.png": "91c0e4562a4d6f848cb7233cf268c37c",
"splash/img/light-1x.png": "91c0e4562a4d6f848cb7233cf268c37c",
"index.html": "80ecdea7c739403089286be3c9204eec",
"/": "80ecdea7c739403089286be3c9204eec",
"main.dart.js": "f90aa7e54443271acd541f5a321f13d7",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"favicon.png": "cb623cb84756a61f1a93c838b32ca3ac",
"icons/Icon-192.png": "c47947f1197f126c3fa6014763167e86",
"icons/Icon-maskable-192.png": "c47947f1197f126c3fa6014763167e86",
"icons/Icon-maskable-512.png": "5de7f6bc64b5596d844210397f1f498d",
"icons/Icon-512.png": "5de7f6bc64b5596d844210397f1f498d",
"manifest.json": "7bc4fdc7c14de2f40cd7fb8f6a92edad",
"assets/AssetManifest.json": "6ac185939fe66d872e770c70e83081e8",
"assets/NOTICES": "5e20afdde840fe52c3ac32396a1712f1",
"assets/FontManifest.json": "bdeeb5011a548c775afcc639688c4196",
"assets/AssetManifest.bin.json": "d54a159826bf57a7fa3c887856490a6e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "1a564e8e36ef90e2f749e8e47970dc1e",
"assets/fonts/MaterialIcons-Regular.otf": "678553871f0fbeb7fd31b6bb8f5c677d",
"assets/assets/images/appbar_icon.svg": "779069d6be18f2e1aa8dcb3ce7894ee6",
"assets/assets/images/product_image.png": "d5a4586caa83a71e4ef6f0a947d277fa",
"assets/assets/images/ic_launcher_foreground.png": "2988d8cc6c7ae0f459ced19801fa60c1",
"assets/assets/images/footer_icon.svg": "4dcaa789df043de1ff679b7d1e37e28f",
"assets/assets/images/ic_launcher.png": "bdbfae6d08cfc5cf3e12241de53ae0f4",
"assets/assets/images/login_icon.svg": "04cb19f1e9d39e1233820c12f07540b0",
"assets/assets/fonts/HelveticaNeue-Medium.ttf": "0a13c540938b1b7dd3996b02ea568e5f",
"assets/assets/fonts/HelveticaNeue-Italic.ttf": "33baa0a123d13fcda4e6cad9c93ed2ef",
"assets/assets/fonts/HelveticaNeue-Regular.ttf": "ccad04d46768981ff847f22e8a53b5b3",
"assets/assets/fonts/HelveticaNeue-Thin.ttf": "78c28465643a20597ce65eee037a7675",
"assets/assets/fonts/HelveticaNeue-Light.ttf": "0facaae97183b8fede52099930aefd8d",
"assets/assets/fonts/HelveticaNeue-Bold.ttf": "b8edca3e45f1f16bc6e20464bd8f2fff",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
