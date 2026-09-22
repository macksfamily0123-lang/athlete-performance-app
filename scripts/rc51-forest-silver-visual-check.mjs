import fs from "node:fs";

const read=path=>fs.readFileSync(path,"utf8");
const check=(ok,message)=>{if(!ok)throw new Error(`FAIL: ${message}`);console.log(`PASS: ${message}`)};
const beta=read("components/BetaGate.tsx");
const athlete=read("components/AthleteApp.tsx");
const css=read("app/globals.css");
const pkg=JSON.parse(read("package.json"));

check(pkg.version==="72.3.109","release version is Phase 72.3.109");
check(beta.includes("CLOSED BETA · RC59 · v72.3.109"),"RC54 release ribbon is present");
check(css.includes("Phase 72.3.101 RC51 — Forest + Silver visual system"),"RC51 visual system remains present");
check(css.includes("--forest-deep:#03130d")&&css.includes("--forest:#0b3a29"),"dark forest palette is defined");
check(css.includes("--silver:#aeb8b4")&&css.includes("--silver-sheen:"),"metallic silver palette is defined");
check(css.includes("h1,h2,h3,h4,h5,h6,strong,b")&&css.includes("font-weight:800"),"readable bold hierarchy is shared app-wide");
check(css.includes(".card,.stat,.score,.readinessHero,.reportScore,.milestoneHero,.coachHero"),"shared cards receive the new surface system");
check(css.includes("input,select,textarea")&&css.includes("font-weight:650!important"),"form text is high contrast and readable");
check(css.includes(".simpleBottomNav.customBottomNav.viewportBottomNav,.mainNav"),"navigation receives the forest and silver treatment");
check(css.includes(".modal,.settingsCard,.commandPalette,.navSheet"),"overlays and settings receive the visual treatment");
check(css.includes(".parentManagedPlayerBanner")&&css.includes("background:rgba(3,24,16,.64)!important"),"RC50 compact Junior banner is visually integrated");
check(css.includes("@media(prefers-reduced-motion:reduce)"),"reduced-motion behavior remains supported");
check(athlete.includes("const TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

console.log("RC51 forest and metallic-silver compatibility checks passed.");
