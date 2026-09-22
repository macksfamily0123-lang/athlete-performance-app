import fs from "node:fs";
const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const checks=[
 ["RC24 version",pkg.version==="72.3.108"],
 ["role focus is data driven",app.includes("const roleFocus=accountRole===")],
 ["role focus card renders",app.includes("premiumRoleFocusCard")],
 ["coach photo in next review",app.includes("coachNextPlayerIdentity")&&app.includes("photoUrl={nextPlayer.photoUrl}")],
 ["coach roster photos",app.includes('className="coachQueueAvatar"')],
 ["team readiness metric",app.includes("TEAM READINESS")&&app.includes("teamReadiness")],
 ["upcoming session metric",app.includes("UPCOMING")&&app.includes("upcomingSessions")],
 ["small-screen hero height",css.includes("min-height:420px!important")],
 ["small-screen hero reserves image area",css.includes("padding:228px 14px 14px!important")],
 ["small-screen readiness is in grid",css.includes("grid-template-columns:minmax(0,1fr) 82px!important")],
 ["mobile duplicate home heroes hidden",css.includes('.app[data-tab="Home"] .homeHero')],
 ["mobile quick actions use two columns",css.includes("grid-template-columns:repeat(2,minmax(0,1fr))!important")],
 ["390px breakpoint exists",css.includes("@media(max-width:390px)")],
 ["mobile forms use 16px text",css.includes("input,select,textarea{font-size:16px!important}")],
 ["Junior mobile hero remains compact",css.includes(".premiumJuniorHome .premiumHomeHero")&&css.includes("min-height:260px!important")],
 ["bottom nav small-screen polish",css.includes(".simpleBottomNav")&&css.includes("width:calc(100% - 8px)!important")],
 ["RC20 readiness SVG preserved",app.includes("SmoothReadinessRing")&&css.includes(".premiumReadinessProgress")],
 ["all sport realistic asset map preserved",app.includes('"/commercial-scenes/baseball-player.webp"')&&app.includes('"/commercial-scenes/figure-skating-player.webp"')]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?"PASS":"FAIL"}: ${name}`);if(!ok)failed++}
if(failed){console.error(`\n${failed} RC24 checks failed.`);process.exit(1)}
console.log(`\nPASS: ${checks.length}/${checks.length} role-dashboard/mobile checks.`);
