import fs from "node:fs";

const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");

const checks=[];
const check=(condition,label)=>checks.push({condition:Boolean(condition),label});

check(pkg.version==="72.3.108","release version is Phase 72.3.108");
check(beta.includes("CLOSED BETA · RC58 · v72.3.108"),"RC58 release ribbon is present");
check(css.includes("Phase 72.3.108 RC58 — Global content rails and gutters"),"RC58 global gutter layer is installed");
check(css.includes("--rc58-content-max:1280px"),"one maximum reading width is defined");
check(css.includes("--rc58-page-gutter:clamp(18px,2.4vw,28px)"),"responsive desktop page gutter is defined");
check(css.includes("--rc58-panel-gutter:clamp(18px,2vw,24px)"),"responsive panel gutter is defined");
check(css.includes("--rc58-shell-rail:max("),"full-width account bars share the centered reading rail");
check(css.includes(".adminPreviewBar,")&&css.includes(".contextBar.cleanContext,"),"Admin and athlete context bars use the shared rail");
check(css.includes(".sportSelectorBlock,")&&css.includes(".pageGuide,")&&css.includes(".sectionSubnav"),"page guides and navigation use the page rail");
check(css.includes(".hero:not(.premiumHomeHero):not(.elitePerformanceHero)"),"standard page heroes use the panel gutter");
check(css.includes(".app.performanceOS main .sectionHead::before{display:none!important}"),"hidden heading indentation is removed");
check(css.includes('.eliteGoalsPage[data-junior="false"]>.hero'),"Goals hero border-touching copy is corrected");
check(css.includes("--rc58-page-gutter:12px")&&css.includes("--rc58-panel-gutter:14px"),"mobile gutters remain consistent and touch-safe");
check(app.includes("rc56AdminLaunchRows"),"larger Admin icons remain preserved");
check(app.includes("function ConnectionHomeHub")&&app.includes("function ConnectionHelpModal"),"account connection tools remain preserved");
check(app.includes("TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

const failed=checks.filter(x=>!x.condition);
if(failed.length){
 console.error(failed.map(x=>`FAIL: ${x.label}`).join("\n"));
 process.exit(1);
}
console.log(`RC58 global gutter alignment checks passed (${checks.length}/${checks.length}).`);
