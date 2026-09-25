import fs from "node:fs";

const mark=fs.readFileSync("public/elite-performance-speed-e.svg","utf8");
const logo=fs.readFileSync("public/elite-performance-speed-e-logo.svg","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));

const checks=[];
const check=(ok,label)=>{if(!ok)throw new Error(`RC66 check failed: ${label}`);checks.push(label)};

check(pkg.version==="72.3.116","release version is Phase 72.3.116");
check(beta.includes("CLOSED BETA · RC66 · v72.3.116"),"RC66 release ribbon is present");
check(mark.includes("Elite Performance Speed E"),"standalone Speed E mark is installed");
check(mark.includes("forward-leaning metallic silver E"),"Speed E asset includes accessible description");
check(logo.includes("metallic Speed E mark"),"horizontal logo uses the Speed E mark");
check(!mark.toLowerCase().includes("crest")&&!mark.toLowerCase().includes("shield"),"crest and shield treatment are removed");
check(mark.includes("#43e596")&&mark.includes("#063526"),"forest-green motion accents are preserved");
check(mark.includes('id="silver"'),"metallic-silver E treatment is preserved");
check(athlete.includes('src="/elite-performance-speed-e.svg"')&&beta.includes('src="/elite-performance-speed-e.svg"'),"all app placements receive the replacement mark");
check(fs.statSync("public/elite-performance-icon-192.png").size>1000&&fs.statSync("public/elite-performance-icon-512.png").size>1000&&fs.statSync("public/elite-performance-apple-touch-icon.png").size>1000,"installed-app icons were regenerated");

console.log(`RC66 Speed E logo checks passed (${checks.length}/${checks.length}).`);
