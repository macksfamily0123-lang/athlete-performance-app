import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const migration=fs.readFileSync("supabase/migrations/007_family_reliability_admin_diagnostics.sql","utf8");

const checks=[
 ["Persistent Admin Preview bar exists", athlete.includes('className="adminPreviewBar"')],
 ["Admin Preview is based on actual Admin role", athlete.includes('{accountRole==="Admin"&&<div className="adminPreviewBar"')],
 ["Preview role dropdown remains Admin/Coach/Player/Parent", athlete.includes('<option>Admin</option><option>Coach</option><option>Player</option><option>Parent</option>')],
 ["Preview role changes adminView", athlete.includes('setAdminView(e.target.value as "Admin"|"Coach"|"Player"|"Parent")')],
 ["Preview switch returns to Home", athlete.includes('setAdminView(e.target.value as "Admin"|"Coach"|"Player"|"Parent");setTab("Home")')],
 ["Persistent bar includes athlete selector", athlete.includes('className="adminPreviewAthlete"')],
 ["Athlete selector changes active athlete", athlete.includes('selectAthleteById(e.target.value);setTab("Home")')],
 ["Return to Admin button exists", athlete.includes('className="adminPreviewReturn"')&&athlete.includes('setAdminView("Admin");setTab("Home")')],
 ["Beta Admin remains accessible from preview bar", athlete.includes('className="adminPreviewBetaAdmin"')&&athlete.includes('onClick={betaBridge.openBetaAdmin}')],
 ["Junior preview is visibly identified", athlete.includes('adminView==="Player"&&juniorPlayerMode?" · Junior":""')],
 ["Normal context no longer duplicates Admin preview picker", !athlete.includes('className="adminViewPicker"')],
 ["Junior CSS explicitly preserves Admin Preview bar", css.includes('.app[data-junior="true"] .adminPreviewBar')&&css.includes('display:flex!important')],
 ["Admin Preview bar is sticky", css.includes('.adminPreviewBar{')&&css.includes('position:sticky')],
 ["Admin Preview mobile layout exists", css.includes('@media(max-width:760px)')&&css.includes('.adminPreviewControls{')&&css.includes('grid-template-columns:1fr 1fr')],
 ["Admin Preview narrow-phone layout exists", css.includes('@media(max-width:480px)')&&css.includes('.adminPreviewControls{grid-template-columns:1fr}')],

 ["Junior context bar can still be hidden", css.includes('.app[data-junior="true"] .contextBar{display:none!important}')],
 ["Junior goal entry retained", athlete.includes("juniorGoalEntryCard")&&athlete.includes("Save My Goal")],
 ["Junior How Am I Doing retained", athlete.includes("juniorProgressButton")],
 ["Junior Back to Today retained", athlete.includes("juniorReturnBar")],
 ["Admin role-preview logic retained", athlete.includes('const effectiveRole:AccountRole=accountRole==="Admin"?(adminView==="Admin"?"Admin":adminView):accountRole;')],

 ["Migration 007 diagnostics query uses qualified alias", migration.includes("select athlete_row.*")&&migration.includes("lower(athlete_row.display_name)")],
 ["Migration 007 no ambiguous lower(display_name)", !migration.includes("order by lower(display_name),created_at")],
 ["Migration 007 family diagnostics retained", migration.includes("admin_family_diagnostics")],
 ["Migration 007 safe repair retained", migration.includes("admin_repair_family_account")],

 ["Parent scheduling retained", athlete.includes("parentScheduleWorkoutCard")],
 ["Parent competition result retained", athlete.includes("parentCompetitionResultCard")],
 ["Shared development communication retained", athlete.includes("What does this Player need next?")&&athlete.includes("How can I help this week?")],
 ["No practice-plan generator", !athlete.includes("Generate Practice Plan")&&!athlete.includes("Practice Plan Generator")],
 ["RC19 ribbon", beta.includes("BETA · RC19 · v72.3.69")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} Admin Preview checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} persistent Admin Preview checks.`);
