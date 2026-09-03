import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const migration=fs.readFileSync("supabase/migrations/005_family_accounts_junior_player.sql","utf8");

const checks=[
 ["Migration 005 exists", fs.existsSync("supabase/migrations/005_family_accounts_junior_player.sql")],
 ["Athlete account-management field", migration.includes("account_management text not null default 'Player'")],
 ["Athlete age field", migration.includes("add column if not exists age smallint")],
 ["Unique Player Access Code", migration.includes("athletes_player_claim_code_unique")],
 ["Parent creates managed athlete", migration.includes("parent_create_managed_athlete")],
 ["Parent-managed athlete links to Parent", migration.includes("insert into public.parent_athletes(parent_user_id,athlete_id)")],
 ["Parent-managed save RPC", migration.includes("parent_save_managed_player_state")],
 ["Managed save preserves formal development", migration.includes("deliberately preserves")&&migration.includes("development (formal Coach Development Plan/Objectives)")],
 ["Managed save only merges Player reflections", migration.includes("incoming_dev ? 'trainingReflections'")],
 ["Managed save does not merge practice observations", !/incoming_dev\s*\?\s*'practiceObservations'/.test(migration)],
 ["Player can claim existing record", migration.includes("player_claim_parent_managed_athlete")],
 ["Claim refuses connected duplicate", migration.includes("already has connected athlete data")],
 ["Claim refuses developed duplicate", migration.includes("already contains development data")],
 ["Signup trigger accepts claim code", migration.includes("player_claim_code")&&migration.includes("requested_claim")],
 ["Privileged Coach/Admin invite precedence", migration.includes("Privileged Coach/Admin invitations always win")],
 ["Claim links same athlete workspace", migration.includes("new_workspace:=claim_target.workspace_id")],
 ["Parent access survives Player claim", !migration.includes("delete from public.parent_athletes where athlete_id=target.id")],
 ["New Parent Player requires age", beta.includes("childAge")&&beta.includes("p_age:age")],
 ["My Players shows management status", beta.includes("Parent Managed")&&beta.includes("Player Login")],
 ["Parent can open managed Player", beta.includes("openManagedPlayer")],
 ["Junior mode label is automatic age 10 and under", beta.includes('<=10?"Open Junior Player"')],
 ["Parent can give Player login later", beta.includes("Give Player Login Later")],
 ["Player signup has optional access code", beta.includes("Player Access Code")&&beta.includes("player_claim_code:signupRole")],
 ["Existing Player can link record", beta.includes("Link Existing Player Record")],
 ["Parent managed save uses restricted RPC", beta.includes('supabase.rpc("parent_save_managed_player_state"')],
 ["Parent managed session presents Player role", beta.includes('access.role==="Parent"&&parentPlayerMode?"Player":access.role')],
 ["Return to Parent workspace exists", beta.includes("returnToParentWorkspace")&&athlete.includes("← Parent View")],
 ["Junior Player mode calculation", athlete.includes("playerAgeNumber>=6&&playerAgeNumber<=10")],
 ["Junior Player has simplified bottom nav", athlete.includes("juniorBottomNav")],
 ["Junior Player has child-friendly labels", athlete.includes('return "How I Feel"')&&athlete.includes('return "My Skills"')],
 ["Junior Player Home has one-step language", athlete.includes("Ready for one small step today?")],
 ["Junior Goals simplified", athlete.includes("What do you want to get better at?")&&athlete.includes("juniorGoalBuilder")],
 ["Junior readiness uses easy choices", athlete.includes("How much energy do you have?")&&athlete.includes("How does your body feel?")],
 ["Junior readiness still saves normal readiness data", athlete.includes("const item:ReadinessLog")&&athlete.includes("Save How I Feel")],
 ["Junior mode hides advanced tools via data attribute", athlete.includes('data-junior={juniorPlayerMode?"true":"false"}')],
 ["Coach team-link workflow retained", beta.includes("Join Coach Team")&&beta.includes("join_team_with_code")],
 ["One athlete model retained", migration.includes("same athlete")||migration.includes("SAME athlete workspace")],
 ["No direct-email fiction added", !beta.includes(">Send Invite Email<")],
 ["Migration grants only intended family RPCs", migration.includes("grant execute on function public.parent_save_managed_player_state")&&migration.includes("grant execute on function public.player_claim_parent_managed_athlete")],
 ["Private claim-code generator not granted", migration.includes("revoke all on function public.new_player_claim_code() from public,anon,authenticated")],
 ["RC14 ribbon", beta.includes("BETA · RC14 · v72.3.63")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} family/junior checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} family/junior checks.`);
