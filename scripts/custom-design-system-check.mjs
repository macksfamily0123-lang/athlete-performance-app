import fs from "node:fs";
const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const checks=[
 ["RC24 version",pkg.version==="72.3.92"],
 ["custom icon family exists",app.includes("function PremiumAppIcon")&&app.includes('type PremiumIconName=')],
 ["Home quick actions use SVG icon family",app.includes('<PremiumAppIcon name={action.icon}/>')],
 ["bottom navigation uses SVG icon family",app.includes("customBottomNav")&&app.includes('<PremiumAppIcon name="home"/>')&&app.includes('<PremiumAppIcon name="more"/>')],
 ["role design tokens exist",css.includes("--role-accent")&&css.includes('.app[data-role="Coach"]')&&css.includes('.app[data-role="Parent"]')&&css.includes('.app[data-role="Admin"]')],
 ["editorial hero system exists",css.includes("Signature editorial hero")&&css.includes(".premiumHomeHero.premiumRealisticSportHero::before")],
 ["metrics are unified instrument panel",css.includes("Metrics are one continuous instrument panel")&&css.includes(".premiumMetricStrip button+button")],
 ["quick actions use neutral console tiles",css.includes("neutral equipment-console tiles")&&css.includes("--tile-accent")],
 ["custom bottom nav active indicator exists",css.includes(".simpleBottomNav.customBottomNav button.active::before")],
 ["global cards are restrained",css.includes("less rounded-box repetition")&&css.includes("box-shadow:0 10px 28px rgba(0,0,0,.14)")],
 ["mobile hero is explicitly tuned",css.includes("@media(max-width:700px)")&&css.includes("min-height:430px!important")],
 ["solid Player/Admin focus mark fixes center artifact",app.includes("premiumRoleFocusSolid")&&css.includes(".premiumRoleFocusSolid")],
 ["realistic all-sport assets remain",["baseball","football","ice-hockey","basketball","lacrosse","wrestling","soccer","figure-skating"].every(x=>app.includes(`/commercial-scenes/${x}-player.webp`))],
 ["Junior still uses illustrated sport hero",app.includes("if(juniorMode)return sportHeroAsset(sport)")],
 ["readiness SVG preserved",app.includes("premiumReadinessSvg")&&app.includes("premiumReadinessProgress")]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?"PASS":"FAIL"}: ${name}`);if(!ok)failed++}
if(failed){console.error(`\n${failed} custom design checks failed.`);process.exit(1)}
console.log(`\nPASS: ${checks.length}/${checks.length} custom design-system checks.`);
