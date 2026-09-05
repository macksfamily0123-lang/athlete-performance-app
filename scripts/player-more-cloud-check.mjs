import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const migration=fs.readFileSync("supabase/migrations/009_player_more_cloud_test_athletes.sql","utf8");

const checks=[
 ["Player More explicitly opens More sheet", athlete.includes('if(group==="More"&&effectiveRole==="Player"){setNavSheet("More");return}')],
 ["Player More no longer shortcuts directly to Competition", !athlete.includes('if(items.length===1){setTab(items[0]);return}\n  setNavSheet(group);\n };') || athlete.includes('if(group==="More"&&effectiveRole==="Player")')],
 ["More sheet still exposes Search All Features", athlete.includes("Search All Features")],
 ["Junior See All My Features retained", athlete.includes("See All My Features")],
 ["Junior feature palette retained", athlete.includes("juniorFeaturePalette")],

 ["BetaBridge exposes Admin test athlete creator", athlete.includes("createAdminTestAthlete?:")],
 ["Roster receives Admin test athlete creator", athlete.includes("createAdminTestAthlete={betaBridge?.createAdminTestAthlete}")],
 ["Admin add uses cloud creator when available", athlete.includes("if(createAdminTestAthlete)")&&athlete.includes("await createAdminTestAthlete")],
 ["Cloud test athlete copy explains persistence", athlete.includes("persists across Codespaces, browsers, and app updates")],
 ["Cloud test creation success message exists", athlete.includes("Cloud test Player created. It will remain available after refresh, a new Codespace, or another device.")],
 ["Standalone fallback remains local", athlete.includes("Local Player profile created on this device.")],
 ["Roster cloud rows identify persistence", athlete.includes("Cloud athlete · persists across devices")],

 ["BetaGate implements admin_create_test_athlete RPC", beta.includes('supabase.rpc("admin_create_test_athlete"')],
 ["Admin bridge exposes cloud creator", beta.includes('createAdminTestAthlete:access.role==="Admin"?createAdminTestAthlete:undefined')],
 ["Duplicate test athlete error cleaned", beta.includes("That cloud test Player already exists.")],
 ["Admin Test diagnostics label supported", beta.includes('"Admin Test"')],
 ["Admin Test diagnostics guidance exists", beta.includes("Cloud-saved Admin test athlete.")],
 ["Admin Test player login says not required", beta.includes('row.account_management==="Admin Test"?"Not required"')],

 ["Migration 009 adds beta_test column", migration.includes("add column if not exists beta_test boolean not null default false")],
 ["Migration 009 Admin role guard", migration.includes("if public.current_beta_role()<>'Admin'")],
 ["Migration 009 creates cloud workspace", migration.includes("insert into public.beta_workspaces")],
 ["Migration 009 creates athlete", migration.includes("insert into public.athletes")],
 ["Migration 009 creates workspace state", migration.includes("insert into public.workspace_state")],
 ["Migration 009 blocks exact test duplicate", migration.includes("Admin test athlete already exists")],
 ["Migration 009 grants authenticated execution", migration.includes("grant execute on function public.admin_create_test_athlete")],
 ["Diagnostics skip missing Player login for test athlete", migration.includes("not coalesce(a.beta_test,false) and a.account_management='Player'")],
 ["Diagnostics returns Admin Test label", migration.includes("then 'Admin Test' else a.account_management end")],
 ["Migration reloads PostgREST schema", migration.includes("notify pgrst,'reload schema'")],

 ["Persistent Admin Preview retained", athlete.includes('className="adminPreviewBar"')],
 ["Junior Goal Entry retained", athlete.includes("juniorGoalEntryCard")],
 ["Parent connection cleanup retained", beta.includes("Create New Player")&&beta.includes("Connect Existing Player")],
 ["Family diagnostics retained", beta.includes("Family & Account Diagnostics")],
 ["No practice-plan generator", !athlete.includes("Generate Practice Plan")&&!athlete.includes("Practice Plan Generator")],
 ["RC19 ribbon", beta.includes("BETA · RC19 · v72.3.69")],
 ["Cloud create message styled", css.includes(".rosterCloudCreateMessage")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} Player More / cloud athlete checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} Player More / cloud athlete checks.`);
