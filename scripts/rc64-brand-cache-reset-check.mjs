import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const layout=fs.readFileSync("app/layout.tsx","utf8");
const sw=fs.readFileSync("public/sw.js","utf8");
const manifest=JSON.parse(fs.readFileSync("public/manifest.webmanifest","utf8"));
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));

const checks=[];
const check=(ok,label)=>{if(!ok)throw new Error(`RC65 check failed: ${label}`);checks.push(label)};

check(pkg.version==="72.3.115","release version is Phase 72.3.115");
check(beta.includes("CLOSED BETA · RC65 · v72.3.115"),"RC65 release ribbon is present");
check(sw.includes('elite-performance-beta-v115'),"offline cache advances to v115");
check(beta.includes('register("/sw.js?v=115",{updateViaCache:"none"})'),"service worker bypasses the browser HTTP cache");
check(beta.includes("registration.update()"),"service worker checks for the new release immediately");
check(sw.includes('fetch(request,{cache:"no-store"})'),"page navigation is network-first without stale HTTP cache");
check(sw.includes('key!==CACHE')&&sw.includes('caches.delete(key)'),"previous app caches are deleted during activation");
check(athlete.includes('/elite-performance-speed-e.svg')&&beta.includes('/elite-performance-speed-e.svg'),"every rendered brand placement uses the new Speed E URL");
check(!athlete.includes('src="/elite-performance-mark.svg"')&&!beta.includes('src="/elite-performance-mark.svg"'),"old cached mark URL is absent from rendered components");
check(layout.includes('manifest:"/manifest.webmanifest?v=115"'),"manifest URL is cache-busted");
check(layout.includes('/elite-performance-speed-e.svg')&&layout.includes('/elite-performance-apple-touch-icon.png'),"page metadata uses uniquely named brand assets");
check(manifest.icons.every(icon=>String(icon.src).startsWith('/elite-performance-icon-')),"installed-app icons use unique Elite Performance filenames");
check(sw.includes('/elite-performance-speed-e.svg')&&sw.includes('/elite-performance-icon-192.png'),"offline core contains only the new brand assets");
check(!sw.includes('/elite-performance-mark.svg')&&!sw.includes('"/icon-192.png"'),"offline core does not retain old logo paths");

console.log(`RC65 brand cache-reset checks passed (${checks.length}/${checks.length}).`);
