import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const migration=fs.readFileSync("supabase/migrations/006_parent_support_scheduling_results.sql","utf8");

const checks=[
 ["Junior progress button is explicit primary action", athlete.includes('featureAction juniorProgressButton')],
 ["Junior progress button opens Analytics", athlete.includes('setTab("Analytics");window.setTimeout(()=>window.scrollTo')],
 ["Junior progress button is pointer-enabled", css.includes(".juniorHomeHero .juniorProgressButton")&&css.includes("pointer-events:auto!important")],
 ["Junior progress button uses forest theme", css.includes("background:linear-gradient(180deg,var(--forest-soft),var(--forest-deep))!important")],

 ["Narrow schedule permission exists", athlete.includes('"scheduleWorkout"|"enterCompetitionResult"')],
 ["Parent schedule permission allowed", /Parent:\{[\s\S]*?scheduleWorkout:true/.test(athlete)],
 ["Parent competition-result permission allowed", /Parent:\{[\s\S]*?enterCompetitionResult:true/.test(athlete)],
 ["Parent broad training write still denied", /Parent:\{[\s\S]*?writeTraining:false/.test(athlete)],
 ["Parent broad competition write still denied", /Parent:\{[\s\S]*?writeCompetition:false/.test(athlete)],

 ["Parent Schedule has Schedule Workout card", athlete.includes("parentScheduleWorkoutCard")&&athlete.includes("Schedule a Workout")],
 ["Parent schedule creates Workout", athlete.includes('assignedByRole:"Parent"')],
 ["Parent schedule receives setWorkouts", athlete.includes("function ParentSchedule({sport,workouts,setWorkouts")],
 ["Root passes setWorkouts to Parent Schedule", athlete.includes("<ParentSchedule sport={sport} workouts={workouts} setWorkouts={setWorkouts}")],

 ["Parent Competition has score/result card", athlete.includes("parentCompetitionResultCard")&&athlete.includes("Add Competition Score / Result")],
 ["Parent result is factual score-only entry", athlete.includes('enteredByRole:"Parent",entryKind:"Score"')],
 ["Parent score-only entry has no invented rating", athlete.includes('rating:0,notes:""')],
 ["Root passes setCompetitions to Parent Competition", athlete.includes("<ParentCompetition sport={sport} profile={profile} competitions={competitions} setCompetitions={setCompetitions}")],
 ["Parent history labels score-only entries", athlete.includes('score/result only')],

 ["Coach Home exposes Schedule Workout", athlete.includes('openPlayer(nextPlayer,"Calendar")}>Schedule Workout')],
 ["Coach Home exposes competition result", athlete.includes('openPlayer(nextPlayer,"Competition")}>Add Competition Result')],
 ["Coach already has full training write", /Coach:\{[\s\S]*?writeTraining:true/.test(athlete)],
 ["Coach already has full competition write", /Coach:\{[\s\S]*?writeCompetition:true/.test(athlete)],

 ["Migration 006 exists", fs.existsSync("supabase/migrations/006_parent_support_scheduling_results.sql")],
 ["Migration has restricted Parent support RPC", migration.includes("parent_save_support_data")],
 ["RPC requires Parent role", migration.includes("current_beta_role()<>'Parent'")],
 ["RPC requires linked athlete", migration.includes("can_parent_view_athlete")],
 ["RPC only handles workouts and competitions", migration.includes("p_data ? 'workouts'")&&migration.includes("p_data ? 'competitions'")],
 ["RPC preserves non-Parent workouts", migration.includes("preserved_non_parent_workouts")&&migration.includes("assignedByRole")],
 ["RPC preserves non-Parent competitions", migration.includes("preserved_non_parent_competitions")&&migration.includes("enteredByRole")],
 ["RPC only accepts Parent score entries", migration.includes("entryKind")&&migration.includes("'Score'")],
 ["RPC does not grant unrestricted workspace policy", !migration.includes('create policy "update accessible workspace state"')],
 ["BetaGate uses support RPC in Parent view", beta.includes('supabase.rpc("parent_save_support_data"')],
 ["Managed Junior Player RPC is still retained", beta.includes('supabase.rpc("parent_save_managed_player_state"')],

 ["Score-only results excluded from Player progress ratings", athlete.includes("const ratedComps=comps.filter(c=>c.rating>0)")],
 ["Score-only results excluded from Home performance rating", athlete.includes("ratedHomeCompetitions")],
 ["Score-only results excluded from Analytics rating", athlete.includes("ratedSportComps")],
 ["Score-only results excluded from Reports rating", athlete.includes("ratedReportCompetitions")],
 ["Competition history shows result instead of 0/10", athlete.includes("<span>RESULT</span><small>logged</small>")],

 ["Coach/Parent help mentions scheduling", athlete.includes("How do I schedule a workout?")],
 ["Parent help mentions competition score", athlete.includes("How do I enter a competition score?")],
 ["No practice-plan generator added", !athlete.includes("Generate Practice Plan")&&!athlete.includes("Practice Plan Generator")],
 ["RC14 ribbon", beta.includes("BETA · RC14 · v72.3.63")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} shared-support checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} Junior/shared-support checks.`);
