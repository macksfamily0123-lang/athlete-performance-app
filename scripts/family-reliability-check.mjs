import fs from "node:fs";

const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const migration=fs.readFileSync("supabase/migrations/007_family_reliability_admin_diagnostics.sql","utf8");

const checks=[
 ["Migration 007 exists", fs.existsSync("supabase/migrations/007_family_reliability_admin_diagnostics.sql")],
 ["Parent Connection Code column added", migration.includes("add column if not exists parent_link_code text")],
 ["Parent Connection Code unique index", migration.includes("athletes_parent_link_code_unique")],
 ["Private Parent code generator", migration.includes("new_parent_link_code")&&migration.includes("revoke all on function public.new_parent_link_code() from public,anon,authenticated")],
 ["Player can rotate Parent Connection Code", migration.includes("player_rotate_parent_link_code")],
 ["Player-code RPC requires Player", migration.includes("current_beta_role()<>'Player'")],
 ["Parent can link existing Player", migration.includes("parent_link_existing_player")],
 ["Parent-link RPC requires Parent", migration.includes("current_beta_role()<>'Parent'")],
 ["Parent linking keeps Player management", migration.includes("account_management='Player'")],
 ["Parent link uses same athlete record", migration.includes("insert into public.parent_athletes(parent_user_id,athlete_id)")],
 ["Parent link expires one-time code", migration.includes("set parent_link_code=null")],
 ["No automatic athlete merge added", !migration.includes("merge athlete")&&!migration.includes("delete from public.athletes")],

 ["Player Connections has Invite Parent", beta.includes("Invite a Parent")],
 ["Player calls parent-link code RPC", beta.includes('supabase.rpc("player_rotate_parent_link_code")')],
 ["Player invite explains same athlete record", beta.includes("same Player record")||beta.includes("same athlete record")],
 ["Parent My Players has Connect Existing Player", beta.includes("Connect Existing Player")],
 ["Parent calls existing-player link RPC", beta.includes('supabase.rpc("parent_link_existing_player"')],
 ["Parent refreshes My Players after link", beta.includes("await loadParentPlayers()")],

 ["Admin Family tab exists", beta.includes('setAdminSection("family")')&&beta.includes("Family & Account Diagnostics")],
 ["Admin family diagnostic RPC exists", migration.includes("admin_family_diagnostics")],
 ["Admin diagnostic RPC requires Admin", migration.includes("current_beta_role()<>'Admin'")],
 ["Diagnostics report Player login", migration.includes("linked_user_id uuid")&&migration.includes("player_email text")],
 ["Diagnostics report Parent count", migration.includes("parent_count bigint")],
 ["Diagnostics report Coach count", migration.includes("coach_count bigint")],
 ["Diagnostics report team count", migration.includes("team_count bigint")],
 ["Diagnostics report workspace state", migration.includes("has_workspace_state boolean")],
 ["Diagnostics report workspace mismatch", migration.includes("Player login points to a different workspace")],
 ["Diagnostics report stale access code", migration.includes("Stale Player Access Code remains after login link")],
 ["Diagnostics flag manual-review workspace duplicates", migration.includes("manual review required")],

 ["Safe Admin repair RPC exists", migration.includes("admin_repair_family_account")],
 ["Repair RPC requires Admin", migration.includes("if public.current_beta_role()<>'Admin'")],
 ["Repair can sync Player workspace", migration.includes("p_action='sync_player_workspace'")],
 ["Repair validates linked user is Player", migration.includes("bu.role<>'Player'")],
 ["Repair can set Parent-managed conservatively", migration.includes("p_action='set_parent_managed'")],
 ["Parent-managed repair requires Parent relation", migration.includes("A linked Parent is required")||migration.includes("No Parent relationship exists")],
 ["Repair can set Player-managed", migration.includes("p_action='set_player_managed'")],
 ["Repair can clear stale Player code", migration.includes("p_action='clear_stale_player_code'")],
 ["Repair can create missing workspace_state", migration.includes("p_action='ensure_workspace_state'")],
 ["Repair does not delete athlete", !migration.includes("delete from public.athletes")],
 ["Repair UI warns no automatic merge", beta.includes("no automatic merge is performed")],

 ["Cloud status supports waiting", athlete.includes('"saved"|"waiting"|"error"')],
 ["Offline saves queue locally", athlete.includes('setCloudStatus("waiting")')&&athlete.includes("pendingCloudSave")],
 ["Offline message says changes queued", athlete.includes("Your changes are safely queued on this device")],
 ["Online retry retained", athlete.includes('window.addEventListener("online",retry)')],
 ["Visible cloud sync notice exists", athlete.includes("cloudSyncNotice")],
 ["Cloud notice has Retry Now", athlete.includes("Retry Now")],
 ["Cloud button shows Saved timestamp", athlete.includes("Saved ${new Date(cloudLastSavedAt)")],
 ["Cloud button shows Saving", athlete.includes('"Saving…"')],
 ["Cloud button shows Waiting", athlete.includes('"Waiting for connection"')],
 ["Cloud button shows Failed", athlete.includes('"Save failed · Retry"')],

 ["Junior Back to Today route exists", athlete.includes("juniorReturnBar")&&athlete.includes('onClick={()=>setTab("Home")}>← Today')],
 ["Junior context bar hidden", css.includes('.app[data-junior="true"] .contextBar{display:none!important}')],
 ["Junior controls have 48px touch target", css.includes('.app[data-junior="true"] button{min-height:48px}')],
 ["Junior inputs avoid mobile zoom", css.includes('font-size:max(16px')],
 ["Junior bottom nav has larger touch target", css.includes(".app[data-junior=\"true\"] .simpleBottomNav button{min-height:58px}")],
 ["Junior Parent View remains available", athlete.includes("parentReturnButton")&&css.includes(":not(.parentReturnButton)")],
 ["Junior advanced header clutter hidden", css.includes(".headerActions .settingsButton")&&css.includes(".headerActions .helpButton")],
 ["Junior goal entry retained", athlete.includes("juniorGoalEntryCard")&&athlete.includes("Save My Goal")],
 ["Junior How Am I Doing fix retained", athlete.includes("juniorProgressButton")],

 ["Parent workout scheduling retained", athlete.includes("parentScheduleWorkoutCard")],
 ["Parent competition result entry retained", athlete.includes("parentCompetitionResultCard")],
 ["Coach Schedule Workout shortcut retained", athlete.includes(">Schedule Workout</button>")],
 ["Coach competition result shortcut retained", athlete.includes(">Add Competition Result</button>")],
 ["Parent managed Player save retained", beta.includes('supabase.rpc("parent_save_managed_player_state"')],
 ["Parent support save retained", beta.includes('supabase.rpc("parent_save_support_data"')],
 ["Player claim Parent-managed athlete retained", beta.includes('supabase.rpc("player_claim_parent_managed_athlete"')],
 ["Coach team linking retained", beta.includes('supabase.rpc("join_team_with_code"')],

 ["Shared Development Focus card exists", athlete.includes("sharedDevelopmentFocusCard")],
 ["Player sees what am I working on", athlete.includes("What am I working on right now?")],
 ["Junior gets simplified shared focus", athlete.includes("juniorSharedFocus")&&athlete.includes("What am I working on?")],
 ["Coach sees what Player needs next", athlete.includes("What does this Player need next?")],
 ["Parent sees how can I help this week", athlete.includes("How can I help this week?")],
 ["Coach card preserves no-practice-planning boundary", athlete.includes("not a practice-plan generator")],
 ["Shared focus is mobile one-column", css.includes(".sharedFocusGrid{grid-template-columns:1fr}")],

 ["RC14 ribbon", beta.includes("BETA · RC14 · v72.3.63")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} family reliability checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} family reliability / beta hardening checks.`);
