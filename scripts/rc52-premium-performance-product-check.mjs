import fs from "node:fs";

const read=path=>fs.readFileSync(path,"utf8");
const check=(ok,message)=>{if(!ok)throw new Error(`FAIL: ${message}`);console.log(`PASS: ${message}`)};
const beta=read("components/BetaGate.tsx");
const athlete=read("components/AthleteApp.tsx");
const css=read("app/globals.css");
const pkg=JSON.parse(read("package.json"));
const rc52=css.slice(css.indexOf("Phase 72.3.102 RC52 — Premium Performance Product System"));

check(Number(pkg.version.split(".").at(-1))>=102,"release includes the Phase 72.3.102 baseline");
check(beta.includes("CLOSED BETA · RC"),"release ribbon is present");
check(rc52.length>5000,"RC52 premium product system is present");
check(rc52.includes("Forest green + metallic silver + graphite only"),"approved palette is documented");
check(rc52.includes("--commercial-blue:#aeb7b3!important")&&rc52.includes("--commercial-violet:#89938e!important")&&rc52.includes("--commercial-amber:#c0c7c4!important"),"legacy role colors are neutralized to silver and graphite");
check(rc52.includes("--sport-orange:#aeb7b3!important")&&rc52.includes("--elite-amber:#c0c7c4!important"),"legacy orange tokens are neutralized");
check(rc52.includes("--radius:2px!important"),"global component geometry uses a restrained radius");
check(rc52.includes('[class*="Card"],[class*="card"]')&&rc52.includes('border-radius:2px!important'),"card and panel families are squared");
check(rc52.includes("background:#174e38!important")&&rc52.includes("border-left:3px solid #87a995!important"),"primary actions use the forest and silver hierarchy");
check(rc52.includes("background:#141b18!important")&&rc52.includes("border:1px solid #3d4843!important"),"secondary actions use graphite and silver");
check(rc52.includes("width:100%!important")&&rc52.includes("border-radius:0!important")&&rc52.includes("border-top:1px solid #4b5550!important"),"navigation is full-width and architectural");
check(rc52.includes(".simpleBottomNav.juniorBottomNav.customBottomNav.viewportBottomNav")&&rc52.includes("bottom:calc(30px + env(safe-area-inset-bottom))!important"),"RC50 Junior navigation clearance remains preserved");
check(athlete.includes("const TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

console.log("RC52 premium performance product checks passed.");
