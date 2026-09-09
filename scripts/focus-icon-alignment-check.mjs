import fs from "node:fs";
const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const checks=[
 ["RC24 version",pkg.version==="72.3.78"],
 ["shared focus icon component exists",app.includes("function PremiumRoleFocusIcon")],
 ["role focus uses shared component",app.includes("<PremiumRoleFocusIcon role={accountRole} juniorMode={juniorMode}/>")],
 ["Player/Admin use solid trend mark",app.includes("premiumRoleFocusSolid")&&app.includes('fill="currentColor"')],
 ["Coach target remains custom icon",app.includes('name="goal"')],
 ["Parent support remains custom icon",app.includes('name="support"')],
 ["icon wrapper uses true grid centering",css.includes("place-items:center!important")&&css.includes("place-content:center!important")],
 ["SVG has explicit dimensions and no transform",css.includes(".premiumRoleFocusIcon svg")&&css.includes("transform:none!important")],
 ["solid focus mark has no transparent center tile artifact",css.includes(".premiumRoleFocusSolid")&&css.includes("background:var(--role-accent)!important")],
 ["mobile icon sizing remains centered",css.includes(".premiumRoleFocusIcon svg{width:21px;height:21px}")],
 ["custom mobile hero architecture present",css.includes("premiumHomeHero.premiumRealisticSportHero")&&css.includes("grid-template-columns:minmax(0,1fr) 80px!important")],
 ["RC20 readiness ring preserved",app.includes("SmoothReadinessRing")&&css.includes(".premiumReadinessProgress")],
 ["all-sport realistic assets preserved",app.includes('"/commercial-scenes/baseball-player.webp"')&&app.includes('"/commercial-scenes/figure-skating-player.webp"')]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?"PASS":"FAIL"}: ${name}`);if(!ok)failed++}
if(failed){console.error(`\n${failed} RC24 focus-icon checks failed.`);process.exit(1)}
console.log(`\nPASS: ${checks.length}/${checks.length} focus-icon alignment checks.`);
