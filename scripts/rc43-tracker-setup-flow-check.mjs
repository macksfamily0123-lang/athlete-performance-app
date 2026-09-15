import fs from 'node:fs';
const app=fs.readFileSync('components/AthleteApp.tsx','utf8');
const css=fs.readFileSync('app/globals.css','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const checks=[
 ['RC43 version',pkg.version==='72.3.93'],
 ['dedicated tracker setup state',app.includes('showTrackerSetup')&&app.includes('setShowTrackerSetup')],
 ['home and recovery launch dedicated setup',app.includes('const openTrackerCenter=()=>{\n  setShowSettings(false);\n  setShowTrackerSetup(true);')],
 ['settings has obvious setup launcher',app.includes('Open Tracker Setup')&&app.includes('trackerSetupLaunch')],
 ['dedicated setup dialog',app.includes('aria-label="Connected tracker setup"')&&app.includes('Connect workout & sleep data')],
 ['primary Google Health button',app.includes('Connect Google Health →')&&app.includes('RECOMMENDED · FITBIT + PIXEL WATCH')],
 ['provider actions available in setup',app.includes('Connect another tracker')&&app.includes('trackerSetupProviderGrid')],
 ['oauth callback reopens setup',app.includes('tracker==="connected"){setShowTrackerSetup(true)')&&app.includes('tracker==="error"){setShowTrackerSetup(true)')],
 ['parent choose player action',app.includes('Choose Player')&&app.includes('betaBridge.openParentPlayers')],
 ['player setup recovery action',app.includes('Open Player Setup')&&app.includes('setShowGuide(true)')],
 ['settings back path',app.includes('Back to Settings')],
 ['mobile full-screen setup CSS',css.includes('.trackerSetupOverlay')&&css.includes('min-height:100vh')],
 ['no new migration requirement',fs.existsSync('supabase/migrations/011_google_health_fitbit_migration.sql')&&!fs.existsSync('supabase/migrations/012_tracker_setup_flow.sql')],
];
let pass=0;
for(const [name,ok] of checks){if(ok){console.log(`PASS ${name}`);pass++;}else console.error(`FAIL ${name}`)}
if(pass!==checks.length){console.error(`FAIL: ${pass}/${checks.length} RC43 Tracker Setup Flow checks.`);process.exit(1)}
console.log(`PASS: ${pass}/${checks.length} RC43 Tracker Setup Flow checks.`);
