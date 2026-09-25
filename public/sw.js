const CACHE="elite-performance-beta-v116";
const CORE=["/","/manifest.webmanifest?v=116","/elite-performance-speed-e.svg","/elite-performance-icon-192.png","/elite-performance-icon-512.png","/elite-performance-apple-touch-icon.png"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE).catch(()=>{})).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 const request=event.request;if(request.method!=="GET")return;
 const url=new URL(request.url);if(url.origin!==self.location.origin||url.pathname.includes("webpack-hmr")||url.pathname==="/sw.js")return;
 if(request.mode==="navigate"){
  event.respondWith(fetch(request,{cache:"no-store"}).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));return response}).catch(()=>caches.match(request).then(hit=>hit||caches.match("/"))));return;
 }
 if(url.pathname.startsWith("/_next/static/")||url.pathname.startsWith("/commercial-scenes/")||url.pathname.startsWith("/sport-")||url.pathname.endsWith(".png")||url.pathname.endsWith(".webp")||url.pathname.endsWith(".svg")){
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));return response})));return;
 }
});
