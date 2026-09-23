import fs from "node:fs";

const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");

const checks=[];
const check=(condition,label)=>checks.push({condition:Boolean(condition),label});

check(pkg.version==="72.3.111","release version is Phase 72.3.109");
check(beta.includes("CLOSED BETA · RC61 · v72.3.111"),"RC56 release ribbon is present");
check(app.includes('className="nativeAdminCommandList rc56AdminLaunchRows"'),"Admin Home uses repaired launch rows");
check(app.includes('className="adminLaunchAction">Open →</strong>'),"Open action is inside the copy column");
check(!app.includes('<div className="nativeAdminCommandList">'),"old edge-aligned Admin list is removed");
check(css.includes("Phase 72.3.106 RC56 — Admin Home launch-row repair"),"RC56 repair styles are installed");
check(css.includes("width:64px!important")&&css.includes("height:64px!important"),"desktop icons are 64px");
check(css.includes("width:36px!important")&&css.includes("height:36px!important"),"icon artwork is enlarged");
check(css.includes("justify-self:start!important"),"Open action is inset from the right border");
check(css.includes("@media(max-width:560px)"),"mobile repair rules are included");
check(app.includes("function ConnectionHomeHub")&&app.includes("function ConnectionHelpModal"),"RC55 account connections remain preserved");
check(app.includes("TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

const failed=checks.filter(x=>!x.condition);
if(failed.length){
 console.error(failed.map(x=>`FAIL: ${x.label}`).join("\n"));
 process.exit(1);
}
console.log(`RC56 Admin launch-row checks passed (${checks.length}/${checks.length}).`);
