import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const migration=fs.readFileSync("supabase/migrations/009_player_more_cloud_test_athletes.sql","utf8");

const checks=[
 ["Premium home component exists", athlete.includes("function PremiumHomeOverview(")],
 ["Premium home rendered only on Home tab", athlete.includes('{tab==="Home"&&<PremiumHomeOverview')],
 ["Role-aware premium copy exists", athlete.includes('eyebrow:"COACH DEVELOPMENT"')&&athlete.includes('eyebrow:"PARENT SUPPORT"')&&athlete.includes('eyebrow:"BETA OPERATIONS"')],
 ["Player quick actions exist", athlete.includes('label:juniorMode?"How I Feel":"Check In"')&&athlete.includes('label:juniorMode?"My Training":"Next Training"')],
 ["Coach quick actions exist", athlete.includes('{icon:"roster" as PremiumIconName,label:"Roster"')&&athlete.includes('{icon:"readiness" as PremiumIconName,label:"Readiness"')],
 ["Parent quick actions exist", athlete.includes('{icon:"calendar" as PremiumIconName,label:"Schedule"')&&athlete.includes('{icon:"support" as PremiumIconName,label:"Support"')],
 ["Admin quick actions exist", athlete.includes('{icon:"roster" as PremiumIconName,label:"Roster",detail:"Athletes & connections"')],
 ["Home performance instrument rail exists", athlete.includes('elitePerformanceBand')&&athlete.includes('eliteVisualPerformance')],
 ["Readiness orb exists", athlete.includes("function SmoothReadinessRing")&&athlete.includes("premiumReadinessOrb")],
 ["Root exposes tab for UI targeting", athlete.includes("data-tab={tab}")],
 ["Root exposes sport for future art direction", athlete.includes("data-sport={sport}")],

 ["Premium visual system CSS block exists", css.includes("Phase 72.3.64 — Premium Performance / App Store UI")],
 ["Home duplicate page guide hidden", css.includes('.app[data-tab="Home"] .workspaceGuide')&&css.includes('.app[data-tab="Home"] .pageGuide')],
 ["Old Home hero hidden under premium home", css.includes('.app[data-tab="Home"] .homeHero')],
 ["Premium home hero styled", css.includes(".premiumHomeHero{")&&css.includes("border-radius:26px")],
 ["Athlete avatar styled", css.includes(".premiumAthleteAvatar{")],
 ["Readiness orb uses smooth SVG progress", athlete.includes("premiumReadinessSvg")&&css.includes("stroke-linecap:round")],
 ["Metric strip is scan-first", css.includes(".premiumMetricStrip{")&&css.includes("grid-template-columns:repeat(3,1fr)")],
 ["Quick actions are app launchers", css.includes(".premiumQuickGrid>button{")&&css.includes("grid-template-columns:44px minmax(0,1fr) auto")],
 ["Bottom nav is floating dock", css.includes("Floating app-store-style bottom dock")&&css.includes("border-radius:22px!important")],
 ["Navigation sheet is bottom sheet", css.includes("App-style navigation sheets become bottom sheets")&&css.includes("border-radius:26px 26px 0 0!important")],
 ["Commercial card treatment retained", css.includes("Commercial card treatment across app")],
 ["Motion respects reduced-motion preference", css.includes("@media(prefers-reduced-motion:no-preference)")],
 ["Junior Premium Home treatment exists", css.includes(".premiumJuniorHome .premiumHomeHero")],
 ["Mobile premium layout exists", css.includes("@media(max-width:720px)")&&css.includes(".premiumHomeHero")],

 ["72.3.63 visual hierarchy retained", css.includes("Phase 72.3.63 — Visual Hierarchy & Navigation Cleanup")],
 ["Player More gateway fix retained", athlete.includes('if(group==="More"&&effectiveRole==="Player"){setNavSheet("More");return}')],
 ["Cloud test athlete creator retained", athlete.includes("createAdminTestAthlete")&&beta.includes("admin_create_test_athlete")],
 ["Migration 009 retained", migration.includes("admin_create_test_athlete")],
 ["Persistent Admin Preview retained", athlete.includes('className="adminPreviewBar"')],
 ["Junior All Features retained", athlete.includes("juniorFeaturePalette")&&athlete.includes("See All My Features")],
 ["Junior Goal Entry retained", athlete.includes("juniorGoalEntryCard")],
 ["Family diagnostics retained", beta.includes("Family & Account Diagnostics")],
 ["No practice-plan generator", !athlete.includes("Generate Practice Plan")&&!athlete.includes("Practice Plan Generator")],
 ["RC24 ribbon", beta.includes("CLOSED BETA · RC48 · v72.3.98")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} Premium UI checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} Premium Performance UI checks.`);
