import fs from "node:fs";
const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const checks=[
 ["RC31 version",pkg.version==="72.3.112"],
 ["RC31 ribbon",beta.includes("CLOSED BETA · RC62 · v72.3.112")],
 ["More sheet uses SVG-aware nav icon renderer",athlete.includes("function NavMetaIcon")&&athlete.includes('className="simpleNavChoiceIcon"><NavMetaIcon')],
 ["Roster internal icon name is not rendered as visible text in sheet",!athlete.includes('<span>{navMeta[x]?.icon||"•"}</span>')&&!athlete.includes('<span>{navMeta[a.tab]?.icon||"•"}</span>')],
 ["More choice copy can shrink without overlap",css.includes(".simpleNavChoiceCopy{min-width:0;overflow:hidden}")],
 ["Mobile More choices move action below copy",css.includes("grid-column:2;justify-self:start")],
 ["Coach roster has one primary Invite Player action",(athlete.match(/>＋ Invite Player<\/button>/g)||[]).length===1],
 ["Coach roster duplicate invite guide buttons removed",!athlete.includes('className="coachRosterInviteGuideActions"')],
 ["Coach command center duplicate invite button removed",!(/coachCommandCloudStatus[\s\S]{0,450}Invite Player/.test(athlete))],
 ["Coach Invite action has explicit launcher",athlete.includes("const launchCoachInvite=()=>")&&athlete.includes("onClick={launchCoachInvite}")],
 ["Coach Manage Teams action has explicit launcher",athlete.includes("const launchCoachTeams=()=>")&&athlete.includes("onClick={launchCoachTeams}")],
 ["Coach action fallback provides visible status",athlete.includes("coachActionMessage")&&athlete.includes("Team actions are read-only in Coach Preview")],
 ["Beta bridge still exposes real Coach invite action",beta.includes('openCoachInvitePlayer:access.role==="Coach"?()=>{setCoachTeamsMode("invite");setShowTeams(true)}:undefined')],
 ["Beta bridge still exposes real Coach team management",beta.includes('openCoachTeams:access.role==="Coach"?()=>{setCoachTeamsMode("manage");setShowTeams(true)}:undefined')]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?"PASS":"FAIL"}  ${name}`);if(!ok)failed++;}
if(failed){console.error(`\nFAIL: ${failed}/${checks.length} checks failed.`);process.exit(1)}
console.log(`\nPASS: ${checks.length}/${checks.length} More/Roster + Coach action checks.`);
