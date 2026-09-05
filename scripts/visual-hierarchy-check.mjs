import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const migration=fs.readFileSync("supabase/migrations/009_player_more_cloud_test_athletes.sql","utf8");

const checks=[
 ["RC19 ribbon", beta.includes("BETA · RC19 · v72.3.69")],
 ["Page guide title scale increased", css.includes(".pageGuide small{")&&css.includes("font-size:clamp(23px,3vw,30px)!important")],
 ["Page guide purpose remains readable", css.includes(".pageGuide b{")&&css.includes("font-size:13px!important")],
 ["Page guide action is compact pill", css.includes(".pageGuide>span{")&&css.includes("border-radius:999px")],
 ["Role orientation accent retained", css.includes('.app[data-role="Admin"] .pageGuide')&&css.includes('.app[data-role="Player"] .pageGuide')],
 ["Hero title uses strong scale", css.includes("font-size:clamp(28px,4vw,38px)!important")],
 ["Card headings increased", css.includes(".sectionHead h2,.card h2")&&css.includes("font-size:clamp(18px,2.1vw,22px)!important")],
 ["Body copy uses readable 13px scale", css.includes(".card p,")&&css.includes("font-size:13px!important")],
 ["Forms use 15px desktop text", css.includes("font-size:15px!important")],
 ["Forms use 16px mobile text", css.includes("@media(max-width:700px)")&&css.includes("font-size:16px!important")],
 ["Primary actions use readable 13px", css.includes(".primary,.featureAction,.sel")&&css.includes("font-size:13px!important")],
 ["Metrics use large numeric scale", css.includes("font-size:clamp(22px,3vw,30px)!important")],
 ["Navigation has stronger active contrast", css.includes(".simpleBottomNav button.active,.mainNav button.active")],
 ["Navigation labels are readable", css.includes(".simpleBottomNav button b,.mainNav .navLabel")&&css.includes("font-size:10px!important")],
 ["Nav sheets use larger feature labels", css.includes(".simpleNavChoices button b")&&css.includes("font-size:15px!important")],
 ["Nested cards visually recede", css.includes(".card .card{")&&css.includes("box-shadow:none!important")],
 ["Advanced tools visually subordinate", css.includes(".advancedTools,.simpleDisclosure")],
 ["Junior page title is larger", css.includes('.app[data-junior="true"] .pageGuide small')&&css.includes("font-size:27px!important")],

 ["Global page help copy shortened", athlete.includes('Home:{title:"Overview",purpose:"What matters now."')],
 ["Player page copy shortened", athlete.includes('Home:{title:"Today",purpose:"Your next important actions."')],
 ["Junior page copy shortened", athlete.includes('Goals:{title:"My Goal",purpose:"One clear goal."')],
 ["Parent page copy shortened", athlete.includes('Home:{title:"Parent Overview",purpose:"What matters this week."')],

 ["Player More gateway fix retained", athlete.includes('if(group==="More"&&effectiveRole==="Player"){setNavSheet("More");return}')],
 ["Cloud test athlete bridge retained", athlete.includes("createAdminTestAthlete")&&beta.includes("admin_create_test_athlete")],
 ["Migration 009 retained", migration.includes("admin_create_test_athlete")],
 ["Persistent Admin Preview retained", athlete.includes('className="adminPreviewBar"')],
 ["Junior All Features fix retained", athlete.includes("juniorFeaturePalette")&&athlete.includes("See All My Features")],
 ["Junior Goal Entry retained", athlete.includes("juniorGoalEntryCard")],
 ["Family diagnostics retained", beta.includes("Family & Account Diagnostics")],
 ["No practice-plan generator", !athlete.includes("Generate Practice Plan")&&!athlete.includes("Practice Plan Generator")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} visual hierarchy checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} visual hierarchy / navigation checks.`);
