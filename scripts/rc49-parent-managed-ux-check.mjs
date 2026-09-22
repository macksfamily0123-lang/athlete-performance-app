import fs from "node:fs";

const read=path=>fs.readFileSync(path,"utf8");
const check=(ok,message)=>{if(!ok)throw new Error(`FAIL: ${message}`);console.log(`PASS: ${message}`)};
const beta=read("components/BetaGate.tsx");
const athlete=read("components/AthleteApp.tsx");
const css=read("app/globals.css");
const migration=read("supabase/migrations/014_parent_player_claim_code_repair.sql");
const pkg=JSON.parse(read("package.json"));

check(pkg.version==="72.3.107","release version is Phase 72.3.107");
check(beta.includes("CLOSED BETA · RC57 · v72.3.107"),"RC54 release ribbon is present");
check(athlete.includes('className="headerUtilityButton managedProfileButton"'),"managed Junior view has an Edit Player action");
check(athlete.includes('setEditProfileRequest(x=>x+1)'),"Edit Player opens the profile editor");
check(css.includes(':not(.managedProfileButton):not(.reportProblemButton)'),"Junior mode preserves Edit Player and Report Problem");
check(css.includes("Phase 72.3.99 RC49 — Parent-managed Junior UX repair"),"RC49 layout repair remains present");
check(css.includes('.connectionTeamPanel label select')&&css.includes('min-height:58px!important'),"Coach Connection controls are touch-friendly");
check(migration.includes("gen_random_uuid()")&&!migration.includes("gen_random_bytes"),"claim-code repair avoids unavailable gen_random_bytes");
check(athlete.includes("const TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

console.log("RC54 Parent-managed Junior UX checks passed.");
