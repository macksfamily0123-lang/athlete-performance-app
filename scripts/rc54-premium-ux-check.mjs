import fs from "node:fs";

const read=path=>fs.readFileSync(path,"utf8");
const check=(ok,message)=>{if(!ok)throw new Error(`FAIL: ${message}`);console.log(`PASS: ${message}`)};
const athlete=read("components/AthleteApp.tsx");
const beta=read("components/BetaGate.tsx");
const css=read("app/globals.css");
const pkg=JSON.parse(read("package.json"));
const rc54=css.slice(css.indexOf("Phase 72.3.109 RC59 — Premium UX + Dashboard Correction"));

check(pkg.version==="72.3.110","release version is Phase 72.3.109");
check(beta.includes("CLOSED BETA · RC60 · v72.3.110"),"RC54 release ribbon is present");
check(athlete.includes('aria-label="Athlete performance summary"'),"dashboard exposes one shared performance summary");
check(athlete.includes('label:"READINESS"')&&athlete.includes('label:"GOAL EXECUTION"')&&athlete.includes('label:"PROGRESS"')&&athlete.includes('label:"TRAINING"'),"all four required dashboard tiles are present");
check((athlete.match(/className={`rc54PerformanceTile/g)||[]).length===1,"all four dashboard tiles render through the same component template");
check(athlete.includes('"Improving"')&&athlete.includes('"Steady"')&&athlete.includes('"Needs Attention"'),"data-backed tiles use the three approved statuses");
check(athlete.includes('value:trendPrimary,state:progressState,detail:latestResult?trendTitle:"Add first test result"'),"Progress empty state directs the user to add a first result");
check(athlete.includes('const trendPrimary=latestResult?')&&athlete.includes(':"NO DATA"'),"Progress uses NO DATA when testing is empty");
check(!athlete.includes('"Build signal"'),"Build signal wording is removed");
check(!athlete.includes('PERFORMANCE INTELLIGENCE')&&!athlete.includes('DEVELOPMENT INTELLIGENCE LOOP'),"AI-sounding intelligence labels are removed from the interface");
check(athlete.includes("TODAY'S PLAN")&&athlete.includes("DEVELOPMENT NEXT STEP"),"plain-language action labels replace intelligence wording");
check(rc54.length>9000,"RC54 role-wide premium UX layer is present");
check(rc54.includes("grid-template-columns:repeat(4,minmax(0,1fr))")&&rc54.includes("grid-template-columns:repeat(2,minmax(0,1fr))")&&rc54.includes("grid-template-columns:1fr!important"),"dashboard tiles adapt across desktop, tablet, and phone widths");
check(rc54.includes('[data-signal="testing"]')&&rc54.includes("color:var(--rc54-silver-3)!important"),"Progress blue styling is neutralized");
check(rc54.includes("--rc54-forest-1")&&rc54.includes("--rc54-silver-1")&&rc54.includes("--rc54-graphite-1"),"approved forest, silver, and graphite palette is defined");
check(rc54.includes("border-radius:0!important")&&rc54.includes("Premium panels: square edges"),"premium panels use square geometry");
check(rc54.includes("min-height:44px!important")&&rc54.includes("@media(max-width:430px)"),"touch targets and small-phone layout are included");
check(athlete.includes("const TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled in the client");
check(!fs.existsSync("app/api/trackers")&&!fs.existsSync("lib/serverTracker.ts")&&!fs.existsSync("lib/trackerCatalog.ts"),"tracker endpoints and provider modules remain absent");
for(const id of ["010","011","012","013","014"]){
 check(fs.readdirSync("supabase/migrations").some(name=>name.startsWith(`${id}_`)),`migration ${id} is preserved`);
}
check(fs.existsSync("lib/supabase.ts"),"Supabase integration is preserved");

console.log("RC54 premium UX and dashboard correction checks passed.");
