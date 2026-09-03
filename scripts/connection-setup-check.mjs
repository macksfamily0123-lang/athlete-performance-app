import fs from "node:fs";

const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const migration=fs.readFileSync("supabase/migrations/008_connection_setup_reliability.sql","utf8");

const checks=[
 ["Parent setup separates create vs connect",beta.includes("Create New Player")&&beta.includes("Connect Existing Player")&&beta.includes("familySetupChooser")],
 ["Parent one-athlete warning",beta.includes("Choose the correct way to add a Player")&&beta.includes("Only use")],
 ["Parent frontend duplicate preflight",beta.includes("already appears in My Players with the same age and sport")],
 ["Parent database duplicate guard",migration.includes("A matching Player is already connected to this Parent account")],
 ["Duplicate guard is scoped to signed-in Parent",migration.includes("pa.parent_user_id=auth.uid()")],
 ["Duplicate guard does not merge athletes",migration.includes("No automatic athlete merge")],
 ["Parent connection status RPC",migration.includes("function public.parent_connection_status()")],
 ["Player connection status RPC",migration.includes("function public.player_connection_status()")],
 ["Coach team connection status RPC",migration.includes("function public.coach_team_connection_status(p_team_id uuid)")],
 ["Connection RPCs are authenticated only",migration.includes("grant execute on function public.parent_connection_status() to authenticated")&&migration.includes("grant execute on function public.player_connection_status() to authenticated")],
 ["Connection status returns relationship counts only",migration.includes("player_login_connected boolean")&&migration.includes("parent_count bigint")&&migration.includes("coach_count bigint")&&migration.includes("team_count bigint")],
 ["Parent Player cards show login status",beta.includes("Player Login Connected")&&beta.includes("Player Login Optional")],
 ["Parent Player cards show Parent status",beta.includes("Parent Connected")],
 ["Parent Player cards show Coach status",beta.includes("Coach Connected")&&beta.includes("Coach Not Connected Yet")],
 ["Player Connections summary",beta.includes("playerConnectionSummary")&&beta.includes("My Connections")],
 ["Player Parent next step",beta.includes("Next: Invite a Parent")],
 ["Player Coach next step",beta.includes("Next: Join a Coach Team")],
 ["Player Parent invite explains existing record",beta.includes("Connect Existing Player—not Create New Player")],
 ["Player team join explains same workspace",beta.includes("Your Coach now sees this same athlete workspace")],
 ["Parent team join explains same workspace",beta.includes("Coach now sees this same athlete workspace")],
 ["Parent-created Player recovery is secondary",beta.includes('className="connectionRecovery"')&&beta.includes("Did a Parent create my Player before I made this login?")],
 ["Coach invite says connect existing Player",beta.includes("The Coach connects to an existing Player")],
 ["Coach roster shows Player login status",beta.includes("Player Login Connected")&&beta.includes("Parent Managed")],
 ["Coach roster shows Parent connection status",beta.includes("Parent Connected")&&beta.includes("No Parent Connected")],
 ["Admin Accounts explains login vs athlete",beta.includes("ACCOUNT ≠ ATHLETE")&&beta.includes("Accounts shows logins, not every Player record")],
 ["Admin Family explains healthy relationships",beta.includes("Healthy does not require every role")],
 ["Admin Family guidance helper",beta.includes("familyConnectionGuidance(row)")],
 ["Admin Family View Athlete",beta.includes("familyViewAthlete")&&beta.includes("View Athlete")],
 ["Connection UI has mobile layout",css.includes(".familySetupChooser")&&css.includes("@media(max-width:650px)")],
 ["Connection chips use project green",css.includes(".connectionBadges span.connected")&&css.includes("var(--forest-light)")],
 ["No blue/purple connection styling",!css.match(/connection[\s\S]{0,120}(#(?:00f|0000ff|800080)|blue|purple)/i)],
 ["Migration 008 reloads schema",migration.includes("notify pgrst,'reload schema'")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){console.error(`\n${failed.length}/${checks.length} connection setup checks failed.`);process.exit(1)}
console.log(`\nPASS: ${checks.length}/${checks.length} connection & account setup checks.`);
