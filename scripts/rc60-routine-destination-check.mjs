import fs from "node:fs";

const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");

const checks=[];
const check=(condition,label)=>checks.push({condition:Boolean(condition),label});

check(pkg.version==="72.3.115","release version is Phase 72.3.115");
check(beta.includes("CLOSED BETA · RC65 · v72.3.115"),"RC60 release ribbon is present");
check(app.includes("function PlayerRoutinePriorityBanners"),"Player routine priority banners are installed");
check(app.indexOf('className="routinePriorityBanner daily"')<app.indexOf('className="routinePriorityBanner weekly"'),"Daily Check-In is ordered before Weekly Review");
check(app.includes('!dailyComplete&&<button type="button" className="routinePriorityBanner daily"'),"Daily Check-In banner only appears while incomplete");
check(app.includes('!weeklyComplete&&<button type="button" className="routinePriorityBanner weekly"'),"Weekly Review banner only appears while incomplete");
check(app.includes('onNavigate("Coach","setup-readiness")'),"Daily Check-In actions target the exact form");
check(app.includes('onNavigate("Home","setup-weekly-review")'),"Weekly Review actions target the exact form");
check(app.includes('if(targetId){scrollToDestination(targetId);return}'),"cross-page navigation waits for and scrolls to its destination");
check(app.includes('if(nextTab===tab)')&&app.includes('if(targetId)scrollToDestination(targetId)'),"same-page navigation also reaches its destination");
check(app.includes('onClick={openReadinessFromPrompt}')&&app.includes('onClick={openWeeklyReviewFromPrompt}'),"both incomplete routine popups remain connected");
check(app.indexOf("<PlayerRoutinePriorityBanners")<app.indexOf("<ConnectionHomeHub"),"incomplete routine banners are first on Home");
check(css.includes("Phase 72.3.110 RC60 — Exact destinations + routine priority"),"RC60 routine banner visual layer is installed");
check(css.includes("grid-template-columns:50px minmax(0,1fr)"),"routine banners have phone formatting");
check(app.includes("TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

const failed=checks.filter(item=>!item.condition);
if(failed.length){
 console.error(failed.map(item=>`FAIL: ${item.label}`).join("\n"));
 process.exit(1);
}
console.log(`RC60 routine destination checks passed (${checks.length}/${checks.length}).`);
