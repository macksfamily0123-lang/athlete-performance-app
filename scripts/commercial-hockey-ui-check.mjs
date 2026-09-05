import fs from "node:fs";
const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const hero=fs.readFileSync("public/sport-heroes/ice-hockey.svg","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const migration=fs.readFileSync("supabase/migrations/009_player_more_cloud_test_athletes.sql","utf8");
const checks=[
 ["Phase version is 72.3.69",pkg.version==="72.3.69"],
 ["RC19 ribbon",beta.includes("BETA · RC19 · v72.3.69")],
 ["Player Profile has photo field",athlete.includes("photoUrl?:string")],
 ["Mobile photo resize helper",athlete.includes("resizePlayerPhoto")&&athlete.includes('canvas.toDataURL("image/jpeg",.78)')],
 ["Profile photo picker",athlete.includes('type="file" accept="image/*"')&&athlete.includes("Add Player Photo")],
 ["Home avatar uses Player photo",athlete.includes('photoUrl={profile.photoUrl}')],
 ["Roster uses Player photos",athlete.includes('photoUrl={a.photoUrl}')],
 ["Parent My Players loads photos",beta.includes("parentPlayerPhotos")&&beta.includes('from("workspace_state").select("workspace_id,data")')],
 ["Fallback hockey avatar",athlete.includes('aria-hidden="true">🏒')&&beta.includes('aria-hidden="true">🏒')],
 ["Recognizable hockey stick + puck header",hero.includes("<ellipse cx=\"650\"")&&hero.includes("<path d=\"M490 62L330 257")],
 ["Commercial accent palette",css.includes("--commercial-blue:#32a8ff")&&css.includes("--commercial-violet:#a94eff")&&css.includes("--commercial-amber:#ff9e2f")&&css.includes("--commercial-mint:#55efc4")],
 ["Sport-aware header art used",css.includes("var(--sport-hero-image)")&&athlete.includes("sportHeroAsset(sport)")],
 ["Bright Start Today action",athlete.includes("commercialStartToday")&&css.includes(".commercialStartToday")],
 ["Commercial More sheet",css.includes(".simpleNavChoices button:nth-child(4n+4)>span")],
 ["Player More fix retained",athlete.includes('if(group==="More"&&effectiveRole==="Player"){setNavSheet("More");return}')],
 ["Junior mode retained",athlete.includes("juniorPlayerMode")&&athlete.includes("juniorFeaturePalette")],
 ["Cloud test athletes retained",athlete.includes("createAdminTestAthlete")&&migration.includes("admin_create_test_athlete")],
 ["Migration 009 retained",migration.includes("admin_create_test_athlete")&&migration.includes("beta_test")],
 ["No Phase 72.3.65 source marker",!athlete.includes("72.3.65")&&!beta.includes("72.3.65")&&!css.includes("72.3.65")]
];
const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){console.error(`\n${failed.length}/${checks.length} commercial Hockey UI checks failed.`);process.exit(1)}
console.log(`\nPASS: ${checks.length}/${checks.length} Commercial Hockey UI / Player Photo checks.`);
