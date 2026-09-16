import fs from "node:fs";

const read=path=>fs.readFileSync(path,"utf8");
const check=(ok,message)=>{if(!ok)throw new Error(`FAIL: ${message}`);console.log(`PASS: ${message}`)};
const app=read("components/AthleteApp.tsx");
const routes=[
 "app/api/trackers/disconnect/route.ts",
 "app/api/trackers/kinexon/connect/route.ts",
 "app/api/trackers/sharing/route.ts",
 "app/api/trackers/oauth/start/route.ts",
 "app/api/trackers/oauth/callback/[provider]/route.ts",
 "app/api/trackers/status/route.ts",
 "app/api/trackers/sync/route.ts"
];

check(app.includes("const TRACKER_CONNECTIVITY_ENABLED=false"),"client tracker gate is off");
check(app.includes("TRACKER_CONNECTIVITY_ENABLED&&(effectiveRole"),"tracker discovery UI is gated off");
check(app.includes("TRACKER_CONNECTIVITY_ENABLED&&(trackerManageAllowed||trackerCoachView)"),"tracker loading and Coach access are gated off");
check(routes.every(route=>!fs.existsSync(route)),"all tracker API endpoints are removed");
check(!fs.existsSync("lib/serverTracker.ts")&&!fs.existsSync("lib/trackerCatalog.ts"),"provider connection and sync modules are removed");
check(fs.existsSync("supabase/migrations/010_connected_trackers_player_parent_only.sql")&&fs.existsSync("supabase/migrations/011_google_health_fitbit_migration.sql")&&fs.existsSync("supabase/migrations/012_kinexon_opt_in_coach_sharing.sql"),"historical migrations remain available and untouched");

console.log("RC45 tracker-disable safety checks passed.");
