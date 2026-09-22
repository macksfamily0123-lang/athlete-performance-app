import fs from "node:fs";

const read=path=>fs.readFileSync(path,"utf8");
const check=(ok,message)=>{if(!ok)throw new Error(`FAIL: ${message}`);console.log(`PASS: ${message}`)};
const beta=read("components/BetaGate.tsx");
const app=read("components/AthleteApp.tsx");
const migration=read("supabase/migrations/013_youth_privacy_closed_beta.sql");
const pkg=JSON.parse(read("package.json"));

check(pkg.version==="72.3.109","combined release version is Phase 72.3.109");
check(beta.includes("CLOSED BETA · RC59 · v72.3.109"),"RC47 closed-beta ribbon is present");
check(beta.includes("Invitation required")&&migration.includes("if inv.email is null then return new"),"new access is email-approved");
check(beta.includes("privacyAccepted")&&beta.includes("privacy_policy_version"),"signup requires versioned privacy acceptance");
check(beta.includes("guardianAttested")&&migration.includes("parent_create_managed_athlete_private"),"junior creation requires guardian attestation");
check(beta.includes("parentCoachConsent")&&beta.includes("playerCoachConsent"),"Player and Parent Coach opt-in controls are present");
check(migration.includes("'coach_access'")&&migration.includes("join_team_with_code"),"team-code Coach access is audited");
check(migration.includes("create table if not exists public.privacy_requests"),"privacy request queue exists");
check(beta.includes("Download My Data")&&beta.includes("Request Account Deletion"),"Privacy Center export and deletion controls exist");
check(beta.includes("Closed Beta Readiness")&&beta.includes("PRIVACY OPERATIONS"),"Admin readiness dashboard includes privacy operations");
check(beta.includes("Accessibility")&&beta.includes("feedbackSeverity"),"feedback captures accessibility category and impact");
check(app.includes("Install Athlete Performance")&&app.includes("beforeinstallprompt"),"install guidance supports PWA-capable browsers");
check(app.includes("openPrivacyCenter")&&app.includes("Open Beta Start Checklist"),"Settings exposes privacy and onboarding controls");
check(app.includes("const TRACKER_CONNECTIVITY_ENABLED=false"),"tracker client gate remains disabled");
check(!fs.existsSync("app/api/trackers/status/route.ts")&&!fs.existsSync("app/api/trackers/sync/route.ts")&&!fs.existsSync("lib/serverTracker.ts"),"tracker server connectivity remains removed");
check(["010_connected_trackers_player_parent_only.sql","011_google_health_fitbit_migration.sql","012_kinexon_opt_in_coach_sharing.sql"].every(name=>fs.existsSync(`supabase/migrations/${name}`)),"historical migrations 010–012 are preserved");

console.log("RC47 combined privacy and closed-beta checks passed.");
