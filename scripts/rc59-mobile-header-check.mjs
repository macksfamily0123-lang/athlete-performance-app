import fs from "node:fs";

const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");

const checks=[];
const check=(condition,label)=>checks.push({condition:Boolean(condition),label});

check(pkg.version==="72.3.116","release version is Phase 72.3.109");
check(beta.includes("CLOSED BETA · RC66 · v72.3.116"),"RC59 release ribbon is present");
check(css.includes("Phase 72.3.109 RC59 — Phone header visibility repair"),"RC59 phone header layer is installed");
check(css.includes("grid-template-columns:repeat(3,minmax(0,1fr))!important"),"phone actions use three readable columns");
check(css.includes("grid-template-columns:repeat(2,minmax(0,1fr))!important"),"extra-small phones use two readable columns");
check(css.includes("max-width:none!important")&&css.includes("overflow:visible!important"),"clipped horizontal action scroller is removed");
check(css.includes("min-height:42px!important"),"phone header actions remain touch-safe");
check(css.includes("white-space:normal!important")&&css.includes("text-overflow:clip!important"),"button labels wrap without truncation");
check(css.includes("width:46px!important")&&css.includes("font-size:16px!important"),"HD logo is enlarged for phones");
check(css.includes("clip-path:none!important"),"HD letters are not clipped by the desktop logo shape");
check(css.includes(".adminPreviewBar{")&&css.includes("position:relative!important"),"Admin preview no longer overlaps the phone header");
check(app.includes("notificationButton")&&app.includes("settingsButton")&&app.includes("helpButton"),"all header actions remain available");
check(app.includes("TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

const failed=checks.filter(x=>!x.condition);
if(failed.length){
 console.error(failed.map(x=>`FAIL: ${x.label}`).join("\n"));
 process.exit(1);
}
console.log(`RC59 mobile header checks passed (${checks.length}/${checks.length}).`);
