import fs from "node:fs";

const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const migration=fs.readFileSync("supabase/migrations/008_connection_setup_reliability.sql","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));

const checks=[
 ["Combined version is 72.3.69",pkg.version==="72.3.69"],
 ["RC19 ribbon",beta.includes("BETA · RC19 · v72.3.69")],
 ["Feedback version is 72.3.69",beta.includes('app_version:"72.3.69"')],
 ["Admin health version is RC19",athlete.includes('["App Version","72.3.69 RC19","good"]')],
 ["Connection operations have double-submit lock",beta.includes("runConnectionAction")&&beta.includes("if(connectionAction)return")],
 ["Parent create button disables while busy",beta.includes('disabled={!!connectionAction||!childName.trim()}')],
 ["Parent existing connect disables while busy",beta.includes('disabled={!!connectionAction||!parentConnectionCode.trim()}')],
 ["Player team connect disables while busy",beta.includes('disabled={!!connectionAction||!playerJoinCode.trim()}')],
 ["Parent team connect disables while busy",beta.includes('disabled={!!connectionAction||!parentJoinAthleteId||!parentJoinCode.trim()}')],
 ["Friendly invalid Parent code error",beta.includes("That Parent Connection Code is invalid or expired")],
 ["Friendly invalid Team code error",beta.includes("That Team Invite Code is not valid")],
 ["Friendly migration/schema error",beta.includes("Install the latest migration")],
 ["Friendly network error",beta.includes("Check your internet connection and try again")],
 ["Parent status refreshes after create",beta.includes("await loadParentPlayers()")],
 ["Parent status refreshes after team join",beta.includes("await loadParentConnectionStatuses()")],
 ["Player status refreshes after team join",beta.includes("await loadPlayerConnectionStatus()")],
 ["Coach status refreshes with roster",beta.includes("await loadCoachConnectionStatuses(teamId)")],
 ["Parent modal refreshes when opened",beta.includes('openParentPlayers:access.role==="Parent"?()=>{void loadParentPlayers()')],
 ["Player Connections refreshes when opened",beta.includes('openPlayerJoinTeam:access.role==="Player"?()=>{void loadPlayerConnectionStatus()')],
 ["One canonical athlete message retained",beta.includes("one athlete record")||beta.includes("1 ATHLETE")],
 ["No automatic merge in migration",migration.includes("No automatic athlete merge")],
 ["Parent RPC role-gated",migration.includes("if public.current_beta_role()<>'Parent'")],
 ["Player RPC role-gated",migration.includes("if public.current_beta_role()<>'Player'")],
 ["Coach RPC role-gated",migration.includes("if public.current_beta_role()<>'Coach'")],
 ["Coach team ownership enforced",migration.includes("t.id=p_team_id and t.coach_user_id=auth.uid()")],
 ["No practice plan generator",!athlete.includes("Practice Plan Generator")&&!athlete.includes("Generate Practice Plan")],
 ["Player-owned goal permission preserved",athlete.includes('"createPlayerGoal"')&&athlete.includes('Player:{')],
 ["Coach cannot edit Player profile preserved",athlete.includes('editPlayerProfile:false')],
 ["Parent normal writeTraining false preserved",athlete.includes('writeTraining:false')],
 ["Persistent Admin Preview retained",athlete.includes('className="adminPreviewBar"')],
 ["Junior More fix retained",athlete.includes("See All My Features")&&athlete.includes("juniorFeaturePalette")],
 ["Junior Goal Entry retained",athlete.includes("juniorGoalEntryCard")],
 ["Junior Back to Today retained",athlete.includes("juniorReturnBar")],
 ["Cloud retry retained",athlete.includes("Retry Now")&&athlete.includes("pendingCloudSave")],
 ["Migration contains no service role key",!migration.match(/service_role|eyJ[a-zA-Z0-9_-]{20,}/)],
 ["Release check still includes tests and build",pkg.scripts["release:check"]==="npm test && npm run build"]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){console.error(`\n${failed.length}/${checks.length} combined beta readiness checks failed.`);process.exit(1)}
console.log(`\nPASS: ${checks.length}/${checks.length} combined beta readiness checks.`);
