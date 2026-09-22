import fs from "node:fs";

const read=path=>fs.readFileSync(path,"utf8");
const check=(ok,message)=>{if(!ok)throw new Error(`FAIL: ${message}`);console.log(`PASS: ${message}`)};
const beta=read("components/BetaGate.tsx");
const css=read("app/globals.css");
const pkg=JSON.parse(read("package.json"));

check(pkg.version==="72.3.106","release version is Phase 72.3.106");
check(beta.includes("CLOSED BETA · RC56 · v72.3.106"),"RC54 release ribbon is present");
check(beta.includes("const sportPositions:Record<string,string[]>"),"Parent creation has sport-specific position data");
check(beta.includes('Position<select value={childPosition}'),"Position is a dropdown, not a text input");
check(beta.includes('setChildSport(e.target.value);setChildPosition("")'),"changing sport clears an incompatible position");
check(beta.includes("Goaltender")&&beta.includes("Quarterback")&&beta.includes("Goalkeeper")&&beta.includes("Synchronized Skating"),"all supported sports have position choices");
check(css.includes("Phase 72.3.98 RC48 — Readable Parent Player Creation"),"RC48 form layout styles remain present");
check(css.includes("min-height:54px!important")&&css.includes("font-size:16px!important"),"form controls are large and mobile-readable");
check(css.includes("grid-template-columns:repeat(2,minmax(0,1fr))!important"),"desktop form uses readable two-column layout");
check(css.includes(".connectionCreatePanel.parentPlayerCreate{grid-template-columns:1fr!important"),"mobile form becomes one full-width column");
check(beta.includes("guardianAttested")&&beta.includes("parent_create_managed_athlete_private"),"RC47 guardian consent remains intact");
check(beta.includes("const TRACKER_CONNECTIVITY_ENABLED=false")||read("components/AthleteApp.tsx").includes("const TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

console.log("RC54 Parent Player form checks passed.");
