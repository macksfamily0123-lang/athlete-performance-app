import fs from "node:fs";

const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");

const checks=[];
const check=(condition,label)=>checks.push({condition:Boolean(condition),label});

check(pkg.version==="72.3.115","release version is Phase 72.3.109");
check(beta.includes("CLOSED BETA · RC65 · v72.3.115"),"RC55 release ribbon is present");
check(app.includes("function ConnectionHomeHub"),"Home connection center is installed");
check(app.includes('title:"Connect Accounts"'),"Connect Accounts is the shared Home action");
check(app.includes("Need help connecting accounts?"),"Connection Help bar is visible on Home");
check(app.includes("function ConnectionHelpModal"),"role-specific walkthrough modal is installed");
for(const role of ["Player","Parent","Coach","Admin"])check(app.includes(`${role}:{intro:`),`${role} walkthrough is included`);
check(app.includes("Parent Connection Code")&&app.includes("Team Invite Code")&&app.includes("Player Access Code"),"all three connection codes are explained");
check(app.includes('if(accountRole==="Parent"){betaBridge?.openParentPlayers?.();return}')&&app.includes('if(accountRole==="Player"){betaBridge?.openPlayerJoinTeam?.();return}')&&app.includes('if(accountRole==="Coach"){betaBridge?.openCoachInvitePlayer?.();return}'),"role actions open the existing secure connection workflows");
check(beta.includes('openBetaAdmin:access.role==="Admin"?()=>{setAdminSection("accounts");setShowAdmin(true)}:undefined'),"Admin connection action opens Account Access");
check(css.includes("Phase 72.3.109 RC59 — Home Connection Center"),"RC55 connection styles are installed");
check(css.includes("@media(max-width:520px)"),"small-screen connection formatting is included");
check(app.includes("TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

const failed=checks.filter(x=>!x.condition);
if(failed.length){
 console.error(failed.map(x=>`FAIL: ${x.label}`).join("\n"));
 process.exit(1);
}
console.log(`RC55 Home connection checks passed (${checks.length}/${checks.length}).`);
