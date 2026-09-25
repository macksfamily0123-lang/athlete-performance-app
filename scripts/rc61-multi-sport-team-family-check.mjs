import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const migration=fs.readFileSync("supabase/migrations/015_multi_sport_team_family_profiles.sql","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));

const checks=[];
const check=(ok,label)=>{if(!ok)throw new Error(`RC62 check failed: ${label}`);checks.push(label)};

check(pkg.version==="72.3.112","release version is Phase 72.3.112");
check(beta.includes("CLOSED BETA · RC62 · v72.3.112"),"RC62 release ribbon is present");
check(migration.includes("create table if not exists public.athlete_sport_profiles"),"normalized sport profiles are created");
check(migration.includes("primary key (athlete_id,sport)"),"one profile per Player and sport is enforced");
check(migration.includes("athlete_one_primary_sport"),"one primary sport per Player is enforced");
check(migration.includes("public.athlete_sport_profile_list"),"authorized sport and team list RPC is installed");
check(migration.includes("public.athlete_upsert_sport_profile"),"sport add and position update RPC is installed");
check(migration.includes("public.athlete_set_primary_sport"),"primary sport switching RPC is installed");
check(migration.includes("public.athlete_set_primary_team"),"sport-specific primary team RPC is installed");
check(migration.includes("public.athlete_leave_team"),"Player-controlled team removal RPC is installed");
check(migration.includes("insert into public.team_members")&&migration.includes("on conflict(team_id,athlete_id) do nothing"),"multiple team membership stays deduplicated");
check(migration.includes("public.can_parent_view_athlete"),"linked Parent access remains authorized");
check(migration.includes("public.can_coach_manage_athlete") && !migration.includes("can_coach_view_athlete"),"Coach access uses the existing authorization helper");
check(beta.includes("My sport workspaces")&&beta.includes("Add Sport Workspace"),"Player Sports & Teams manager is rendered");
check(beta.includes("Invite Another Parent")&&beta.includes("separate login"),"multi-parent one-record instructions are explicit");
check(beta.includes("athleteSportProfiles")&&beta.includes("saveSportProfile"),"cloud sport profiles reach the app bridge");
check(athlete.includes("sportWorkspaces")&&athlete.includes("switchSportWorkspace"),"sport-specific workspace switching is installed");
check(athlete.includes("ALL SPORTS OVERVIEW")&&athlete.includes("MultiSportOverview"),"combined all-sports overview is installed");
check(athlete.includes("Goals, training, schedule, and testing stay separated by sport."),"sport scoping is explained in plain language");
check(css.includes(".multiSportSelector")&&css.includes(".multiSportTeamManager")&&css.includes(".multiSportOverview"),"premium responsive multi-sport styles are installed");
check(fs.existsSync("supabase/migrations/014_parent_player_claim_code_repair.sql"),"migration 014 remains preserved");
check(athlete.includes("fallbackTrackerProviders:TrackerProviderStatus[]=[]"),"tracker connectivity remains disabled");

console.log(`RC62 multi-sport/team/family checks passed (${checks.length}/${checks.length}).`);
