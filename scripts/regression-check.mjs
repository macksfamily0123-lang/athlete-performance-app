import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const migration4=fs.existsSync("supabase/migrations/004_admin_full_access.sql");

const checks=[
 ["Coach Home 2.0", athlete.includes("COACH DEVELOPMENT COMMAND CENTER 2.0")],
 ["Coach Home review-next", athlete.includes("WHO SHOULD I REVIEW NEXT?")],
 ["Coach Home goal feedback metric", athlete.includes("GOAL FEEDBACK")],
 ["Coach Home plan review metric", athlete.includes("PLAN REVIEWS")],
 ["Coach Home observations metric", athlete.includes("OBSERVATIONS")],
 ["7-step development review", athlete.includes("7-step development check") && athlete.includes("Next Development Action")],
 ["Roster Command Center preserved", athlete.includes("COACH COMMAND CENTER")],
 ["Roster goal-feedback priority", athlete.includes("goalsNeedFeedback")],
 ["Roster plan-review priority", athlete.includes("planReviewDue")],
 ["Player Simple Mode retained", athlete.includes("playerSimpleDashboard")],
 ["Athlete Development Plan retained", athlete.includes("ATHLETE DEVELOPMENT PLAN")],
 ["Player Progress simplification retained", athlete.includes("See Detailed Progress")],
 ["Player Development simplification retained", athlete.includes("See Full Development Record")],
 ["Coach profile read-only retained", athlete.includes("Coaches cannot edit Player profiles")],
 ["Player-owned goals retained", athlete.includes("Wait for the Player to create the goal")],
 ["Admin full access retained", athlete.includes("ADMIN FULL ACCESS")],
 ["Parent support retained", athlete.includes("How can I support today?")],
 ["Cloud retry retained", athlete.includes("retryPendingCloudSave")],
 ["Coach cloud roster retained", beta.includes("loadCoachRosterStates")],
 ["Coach setup each login retained", athlete.includes('sessionStorage.setItem(roleSetupDismissKey,"1")') && athlete.includes("it returns the next time you sign in")],
 ["Migration 004 retained", migration4],
 ["No practice planner", !athlete.includes("Weekly Coaching Plan") && !athlete.includes("Today's Training Prescription")],
 ["Practice design boundary retained", athlete.includes("Practice design stays with the Coach's preferred planning tools.")],
 ["trainingAge fix retained", athlete.includes("const validAge=Number.isFinite(ageNumber)&&ageNumber>=6&&ageNumber<=99;")],
 ["Analytics brace fix retained", /<CompareTests sport=\{sport\} results=\{rows\}\/>\s*<\/>;\s*\}/.test(athlete)]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} regression checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} regression checks.`);
