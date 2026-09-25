import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const layout=fs.readFileSync("app/layout.tsx","utf8");
const manifest=JSON.parse(fs.readFileSync("public/manifest.webmanifest","utf8"));
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));

const checks=[];
const check=(ok,label)=>{if(!ok)throw new Error(`RC66 check failed: ${label}`);checks.push(label)};

check(pkg.name==="elite-performance-app","package uses the Elite Performance product name");
check(pkg.version==="72.3.116","release version is Phase 72.3.116");
check(beta.includes("CLOSED BETA · RC66 · v72.3.116"),"RC66 release ribbon is present");
check(layout.includes('title:"Elite Performance Beta"')&&layout.includes('applicationName:"Elite Performance"'),"page metadata uses Elite Performance");
check(manifest.name==="Elite Performance Beta"&&manifest.short_name==="Elite Performance","installed app uses Elite Performance");
check(fs.existsSync("public/elite-performance-speed-e.svg")&&fs.existsSync("public/elite-performance-speed-e-logo.svg"),"Elite Performance mark and full logo assets are included");
check(fs.existsSync("public/elite-performance-icon-192.png")&&fs.existsSync("public/elite-performance-icon-512.png")&&fs.existsSync("public/elite-performance-apple-touch-icon.png"),"installed app icons are included");
check(athlete.includes("ELITE <em>PERFORMANCE</em>")&&athlete.includes("HIGH PERFORMANCE ATHLETE DEVELOPMENT"),"header uses the new brand lockup");
check(athlete.includes('src="/elite-performance-speed-e.svg"')&&beta.includes('src="/elite-performance-speed-e.svg"'),"Elite Performance mark appears in the app and authentication screens");
check(!athlete.includes("HOCKEY <em>DEV</em>")&&!athlete.includes(">HD<")&&!beta.includes(">AP<"),"legacy HD and AP letter badges are removed");
check(athlete.includes("Install Elite Performance")&&athlete.includes("Add Elite Performance"),"installation wording uses the new name");
check(css.includes("Phase 72.3.116 RC66 — Elite Performance Speed E refinement")&&css.includes(".elitePerformanceLogo img"),"responsive Elite Performance logo styles are installed");

console.log(`RC66 Elite Performance brand checks passed (${checks.length}/${checks.length}).`);
