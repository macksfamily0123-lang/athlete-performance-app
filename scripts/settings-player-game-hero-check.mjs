import fs from "node:fs";

const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const asset="public/commercial-scenes/ice-hockey-player-game-wide.webp";
const checks=[
 ["Player uses wide game hero asset",app.includes("/commercial-scenes/ice-hockey-player-game-wide.webp")],
 ["Parent keeps dedicated role asset",app.includes("/commercial-scenes/ice-hockey-parent.webp")],
 ["Coach keeps dedicated role asset",app.includes("/commercial-scenes/ice-hockey-coach-role.webp")],
 ["Settings trigger explicit button",app.includes('data-settings-trigger="true"')&&app.includes('type="button" className="settingsButton"')],
 ["Settings modal portaled",app.includes("showSettings&&<ViewportPortal><div className=\"settingsOverlay viewportSettingsOverlay\"")],
 ["Settings portal above nav",css.includes(".viewportSettingsOverlay")&&css.includes("z-index:13050!important")],
 ["Settings remains interactive",css.includes(".performanceOS .settingsButton")&&css.includes("pointer-events:auto!important")],
 ["Wide Player hero uses cover",css.includes('[data-role="Player"] .eliteRoleHeroForeground')&&css.includes("object-fit:cover!important")],
 ["Wide Player asset exists",fs.existsSync(asset)&&fs.statSync(asset).size>25000]
];
let passed=0;for(const [name,ok] of checks){console.log(`${ok?"PASS":"FAIL"}: ${name}`);if(ok)passed++;}
console.log(`\n${passed}/${checks.length} RC35 settings/player hero checks passed.`);
if(passed!==checks.length)process.exit(1);
