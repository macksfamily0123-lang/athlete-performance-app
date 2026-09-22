import fs from "node:fs";

const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");

const checks=[];
const check=(condition,label)=>checks.push({condition:Boolean(condition),label});

check(pkg.version==="72.3.107","release version is Phase 72.3.107");
check(beta.includes("CLOSED BETA · RC57 · v72.3.107"),"RC57 release ribbon is present");
check(css.includes("Phase 72.3.107 RC57 — Player Home safe content gutters"),"RC57 gutter layer is installed");
check(css.includes(".nativePlayerHome .eliteVisualPerformance.eliteProgressHome"),"Progress panel receives a protected gutter");
check(css.includes("padding:20px 24px!important"),"Progress uses 24px desktop side spacing");
check(css.includes(".nativePlayerHome .eliteRecoveryHome"),"Recovery panel receives a protected gutter");
check(css.includes("padding:16px 24px!important"),"Recovery uses 24px desktop side spacing");
check(css.includes(".nativePlayerHome .nativeEditorialSection.eliteActionSection"),"Move Forward section receives a protected gutter");
check(css.includes("padding:30px 24px 4px!important"),"shortcut rows are inset from both desktop borders");
check(css.includes("padding:24px 14px 4px!important"),"phone shortcut rows retain 14px side spacing");
check(app.includes("rc56AdminLaunchRows"),"RC56 larger Admin icons remain preserved");
check(app.includes("function ConnectionHomeHub")&&app.includes("function ConnectionHelpModal"),"RC55 account connections remain preserved");
check(app.includes("TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

const failed=checks.filter(x=>!x.condition);
if(failed.length){
 console.error(failed.map(x=>`FAIL: ${x.label}`).join("\n"));
 process.exit(1);
}
console.log(`RC57 Player Home gutter checks passed (${checks.length}/${checks.length}).`);
