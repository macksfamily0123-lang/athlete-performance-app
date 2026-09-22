import fs from "node:fs";

const read=path=>fs.readFileSync(path,"utf8");
const check=(ok,message)=>{if(!ok)throw new Error(`FAIL: ${message}`);console.log(`PASS: ${message}`)};
const athlete=read("components/AthleteApp.tsx");
const beta=read("components/BetaGate.tsx");
const css=read("app/globals.css");
const pkg=JSON.parse(read("package.json"));
const rc55=css.slice(css.indexOf("Phase 72.3.105 RC55 — Admin Command Row Polish"));

check(pkg.version==="72.3.105","release version is Phase 72.3.105");
check(beta.includes("CLOSED BETA · RC55 · v72.3.105"),"RC55 release ribbon is present");
check(athlete.includes('className="nativeAdminCommandCopy"'),"Admin command copy has a dedicated layout wrapper");
check(athlete.includes('className="adminOpenAction"'),"Open action is moved beside the row description");
check(!athlete.includes('<strong>Open</strong>'),"old far-right Open label is removed");
check(rc55.includes("grid-template-columns:72px minmax(0,1fr)"),"desktop command rows reserve a larger icon column");
check(rc55.includes("width:68px!important")&&rc55.includes("height:68px!important"),"desktop icon tiles are visibly larger");
check(rc55.includes("width:34px!important")&&rc55.includes("height:34px!important"),"Admin command SVG icons are enlarged");
check(rc55.includes("linear-gradient(145deg,var(--rc54-forest-2),var(--rc54-graphite-3))"),"icon tiles use the approved forest and graphite treatment");
check(rc55.includes("border-left:4px solid var(--rc54-forest-4)"),"icon tiles receive a high-contrast forest edge");
check(rc55.includes("display:inline-flex!important")&&rc55.includes("margin-top:10px!important"),"Open action sits close to its description");
check(rc55.includes("@media(max-width:650px)")&&rc55.includes("width:60px!important"),"larger icons remain balanced on mobile");
check(athlete.includes("const TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");
for(const id of ["010","011","012","013","014"]){
 check(fs.readdirSync("supabase/migrations").some(name=>name.startsWith(`${id}_`)),`migration ${id} is preserved`);
}

console.log("RC55 Admin command-row polish checks passed.");
