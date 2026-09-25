import fs from "node:fs";
const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const checks=[
 ["RC24 version",pkg.version==="72.3.115"],
 ["RC24 beta ribbon",beta.includes("CLOSED BETA · RC65 · v72.3.115")],
 ["native sports home architecture",app.includes("nativeSportsHome")&&css.includes("Phase 72.3.74 RC24 — Native Sports App Redesign")],
 ["edge-to-edge mobile hero",css.includes("width:calc(100% + 24px)!important")&&css.includes("margin-left:-12px!important")],
 ["hero separates topline and bottom identity",app.includes("nativeHeroTopline")&&app.includes("nativeHeroBottom")],
 ["player has asymmetric primary action",app.includes("nativePrimaryAction")&&css.includes("clip-path:polygon")],
 ["player uses editorial action list",app.includes("nativeActionList")&&app.includes("nativeActionIndex")],
 ["coach uses tactical signal band",app.includes("nativeCoachSignalBand")&&app.includes("nativeCoachActionBar")],
 ["parent uses support timeline",app.includes("nativeParentTimeline")&&app.includes("parentTimelineIcon")],
 ["admin uses operations command list",app.includes("nativeAdminCommandList")&&app.includes("eliteAdminHome")&&app.includes("elitePerformanceBand")],
 ["junior retains distinct simplified architecture",app.includes("nativeJuniorSportsHome")&&app.includes("nativeJuniorTiles")],
 ["old Player dashboard duplicates suppressed",css.includes('.app[data-tab="Home"][data-role="Player"] .playerSimpleDashboard')],
 ["old Parent dashboard duplicates suppressed",css.includes('.app[data-tab="Home"][data-role="Parent"] .parentSnapshotGrid')],
 ["smooth readiness preserved",app.includes("SmoothReadinessRing")&&css.includes(".premiumReadinessProgress")],
 ["all sport realistic imagery preserved",["baseball","football","ice-hockey","basketball","lacrosse","wrestling","soccer","figure-skating"].every(x=>app.includes(`/commercial-scenes/${x}-player.webp`))],
 ["Junior illustrated sport art preserved",app.includes("if(juniorMode)return sportHeroAsset(sport)")],
 ["Player More fix preserved",app.includes('if(group==="More"&&effectiveRole==="Player"){setNavSheet("More");return}')],
 ["migration 009 still present",fs.existsSync("supabase/migrations/009_player_more_cloud_test_athletes.sql")]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?"PASS":"FAIL"}: ${name}`);if(!ok)failed++}
if(failed){console.error(`\n${failed} native sports redesign checks failed.`);process.exit(1)}
console.log(`\nPASS: ${checks.length}/${checks.length} native sports redesign checks.`);
