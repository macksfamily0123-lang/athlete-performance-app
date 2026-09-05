import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const migration=fs.readFileSync("supabase/migrations/009_player_more_cloud_test_athletes.sql","utf8");

const sportAssets=[
 "ice-hockey.svg","baseball.svg","football.svg","basketball.svg",
 "lacrosse.svg","wrestling.svg","soccer.svg","figure-skating.svg"
];

const hockey=fs.readFileSync("public/sport-art/ice-hockey.svg","utf8");

const checks=[
 ["RC16 ribbon",beta.includes("BETA · RC16 · v72.3.65")],
 ["Commercial Sports CSS block",css.includes("Phase 72.3.65 — Commercial Sports UI")],
 ["All eight sport hero graphics exist",sportAssets.every(name=>fs.existsSync(`public/sport-art/${name}`))],
 ["Hockey art clearly contains hockey label",hockey.includes(">HOCKEY<")],
 ["Hockey art contains stick/blade path and puck ellipse",hockey.includes("rotate(-12)")&&hockey.includes('rx="39" ry="13"')],
 ["Sport art wired to Home hero",css.includes('url("/sport-art/ice-hockey.svg")')&&css.includes('url("/sport-art/soccer.svg")')&&css.includes('url("/sport-art/figure-skating.svg")')],

 ["Profile supports photo data",athlete.includes("photoDataUrl?:string")],
 ["Photo crop/resize helper exists",athlete.includes("async function makePlayerPhotoDataUrl(file:File)")],
 ["Photo is compressed to 560px JPEG",athlete.includes('canvas.width=560')&&athlete.includes('toDataURL("image/jpeg",.82)')],
 ["Photo chooser accepts phone images",athlete.includes('type="file" accept="image/*"')],
 ["Photo manager always visible in profile",athlete.includes('className="playerPhotoManager"')],
 ["Add/Change Photo button exists",athlete.includes('profile.photoDataUrl?"Change Photo":"Add Photo"')],
 ["Photo remove action exists",athlete.includes("removePlayerPhoto")],
 ["Home avatar displays Player photo",athlete.includes('profile.photoDataUrl?<img src={profile.photoDataUrl}')],
 ["Photo shortcut from Home avatar",athlete.includes('aria-label={profile.photoDataUrl?"Open Player Profile photo":"Add Player photo"}')],
 ["Cloud snapshot preserves photo",athlete.includes("photoDataUrl:raw?.profile?.photoDataUrl??")],
 ["Local profile restore preserves photo",athlete.includes("photoDataUrl:x?.photoDataUrl??")],

 ["Colorful Player launcher tones",athlete.includes('tone:"mint",label:juniorMode?"How I Feel":"Check In"')&&athlete.includes('tone:"blue",label:juniorMode?"My Training":"Next Training"')&&athlete.includes('tone:"violet",label:juniorMode?"My Skills":"Development"')&&athlete.includes('tone:"amber",label:juniorMode?"How I\'m Doing":"Progress"')],
 ["Colorful launcher CSS",css.includes(".premiumQuickGrid>button.tone-blue")&&css.includes(".premiumQuickGrid>button.tone-violet")&&css.includes(".premiumQuickGrid>button.tone-amber")],
 ["Metric cards have distinct category colors",css.includes(".premiumMetricStrip button:nth-child(1)")&&css.includes(".premiumMetricStrip button:nth-child(2)")&&css.includes(".premiumMetricStrip button:nth-child(3)")],
 ["Prominent Start Today action",athlete.includes('className="commercialPrimaryAction"')&&css.includes(".commercialPrimaryAction{")],
 ["More menu has colored icon wells",css.includes(".simpleNavChoices button:nth-child(4n+1)>span")&&css.includes(".simpleNavChoices button:nth-child(4n+3)>span")],

 ["Graphical Player Progress exists",athlete.includes('className="commercialProgressOverview"')],
 ["Progress ring uses current overall score",athlete.includes('conic-gradient(#75d4a9 0 ${overall}%')],
 ["Five progress bars use live instruments",athlete.includes('instruments.map(item=><div className="commercialProgressBar"')],
 ["Progress signal chart exists",athlete.includes('className="commercialProgressSpark"')&&athlete.includes("<polyline points={progressSignalLine}/>")],
 ["Progress category color CSS exists",css.includes(".commercialProgressBar:nth-child(5)>i>b")],

 ["Premium 72.3.64 UI retained",css.includes("Phase 72.3.64 — Premium Performance / App Store UI")],
 ["72.3.63 hierarchy retained",css.includes("Phase 72.3.63 — Visual Hierarchy & Navigation Cleanup")],
 ["Player More fix retained",athlete.includes('if(group==="More"&&effectiveRole==="Player"){setNavSheet("More");return}')],
 ["Cloud test athlete fix retained",athlete.includes("createAdminTestAthlete")&&beta.includes("admin_create_test_athlete")],
 ["Migration 009 retained",migration.includes("admin_create_test_athlete")],
 ["Admin Preview retained",athlete.includes('className="adminPreviewBar"')],
 ["Junior All Features retained",athlete.includes("juniorFeaturePalette")&&athlete.includes("See All My Features")],
 ["Junior Goal Entry retained",athlete.includes("juniorGoalEntryCard")],
 ["Family diagnostics retained",beta.includes("Family & Account Diagnostics")],
 ["No practice-plan generator",!athlete.includes("Generate Practice Plan")&&!athlete.includes("Practice Plan Generator")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} Commercial Sports UI checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} Commercial Sports UI checks.`);
