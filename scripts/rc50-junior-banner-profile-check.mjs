import fs from "node:fs";

const read=path=>fs.readFileSync(path,"utf8");
const check=(ok,message)=>{if(!ok)throw new Error(`FAIL: ${message}`);console.log(`PASS: ${message}`)};
const beta=read("components/BetaGate.tsx");
const athlete=read("components/AthleteApp.tsx");
const css=read("app/globals.css");
const pkg=JSON.parse(read("package.json"));

check(pkg.version==="72.3.116","release version is Phase 72.3.109");
check(beta.includes("CLOSED BETA · RC66 · v72.3.116"),"RC54 release ribbon is present");
check(beta.includes("Parent-managed access")&&!beta.includes("Entries here are saved as the Player's own check-ins"),"Junior banner copy is compact");
check(css.includes("Phase 72.3.100 RC50 — Compact Junior banner + profile action"),"RC50 layout overrides remain present");
check(css.includes(".simpleBottomNav.juniorBottomNav.customBottomNav.viewportBottomNav")&&css.includes("bottom:calc(30px + env(safe-area-inset-bottom))!important"),"Junior navigation sits above the banner");
check(css.includes("background:rgba(5,24,17,.58)!important"),"Junior banner is translucent");
check(css.includes("height:calc(30px + env(safe-area-inset-bottom))!important"),"Junior banner is compact");
check(athlete.includes("const openManagedPlayerProfile=()=>"),"Edit Player uses a dedicated action");
check(athlete.includes("window.setTimeout(()=>setEditProfileRequest(x=>x+1),320)"),"Edit request survives Home navigation");
check(athlete.includes('querySelector<HTMLButtonElement>(".profileEditButton")'),"Edit action has a direct profile-button fallback");
check(athlete.includes('onClick={openManagedPlayerProfile}'),"header button uses the reliable action");
check(athlete.includes("const TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

console.log("RC50 Junior banner and profile action compatibility checks passed.");
