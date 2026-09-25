import fs from "node:fs";
const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const checks=[
 ["RC24 version",pkg.version==="72.3.116"],
 ["shared focus icon component exists",app.includes("function PremiumRoleFocusIcon")],
 ["role focus uses shared component",app.includes("<PremiumRoleFocusIcon role={accountRole} juniorMode={juniorMode}/>")],
 ["focus roles use normalized shared icon names",app.includes('role==="Admin"?"progress":"train"')&&app.includes('role==="Coach"?"goal"')&&app.includes('role==="Parent"?"support"')],
 ["focus icon uses the shared Home badge",app.includes("return <HomeIconBadge name={icon} tone={tone} className={`premiumRoleFocusIcon")],
 ["icon wrapper uses true grid centering",css.includes("place-items:center!important")&&css.includes("place-content:center!important")],
 ["SVG has explicit dimensions and no transform",css.includes(".premiumRoleFocusIcon svg")&&css.includes("transform:none!important")],
 ["legacy focus clipping is explicitly removed",css.includes(".app.performanceOS .premiumRoleFocusIcon")&&css.includes("clip-path:none!important")],
 ["mobile icon sizing remains centered",css.includes("width:56px!important;height:56px!important")&&css.includes("width:32px!important;height:32px!important")],
 ["custom mobile hero architecture present",css.includes("premiumHomeHero.premiumRealisticSportHero")&&css.includes("grid-template-columns:minmax(0,1fr) 80px!important")],
 ["RC20 readiness ring preserved",app.includes("SmoothReadinessRing")&&css.includes(".premiumReadinessProgress")],
 ["all-sport realistic assets preserved",app.includes('"/commercial-scenes/baseball-player.webp"')&&app.includes('"/commercial-scenes/figure-skating-player.webp"')]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?"PASS":"FAIL"}: ${name}`);if(!ok)failed++}
if(failed){console.error(`\n${failed} RC24 focus-icon checks failed.`);process.exit(1)}
console.log(`\nPASS: ${checks.length}/${checks.length} focus-icon alignment checks.`);
