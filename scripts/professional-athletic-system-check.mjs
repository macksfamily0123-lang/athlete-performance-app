import fs from 'node:fs';
import crypto from 'node:crypto';

const app=fs.readFileSync('components/AthleteApp.tsx','utf8');
const css=fs.readFileSync('app/globals.css','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const release=fs.readFileSync('RELEASE_NOTES.md','utf8');
const migration=fs.readFileSync('supabase/migrations/009_player_more_cloud_test_athletes.sql');
const coachAsset='public/commercial-scenes/ice-hockey-coach-role.webp';
const checks=[
 ['version is 72.3.83',pkg.version==='72.3.90'],
 ['RC32 app version reference updated',app.includes('72.3.90 RC40')],
 ['RC32 regression command registered',pkg.scripts['test:professional-athletic']?.includes('professional-athletic-system-check.mjs')],
 ['Player Home has dedicated Progress heading',app.includes('className="eliteProgressHeading"')&&app.includes('<span>PROGRESS</span>')],
 ['Player Home Progress action is explicitly labeled',app.includes('<b>VIEW PROGRESS</b>')&&app.includes('aria-label="Open Progress analytics"')],
 ['Player Home Progress keeps analytics navigation',app.includes('className="eliteVisualPerformance eliteProgressHome" onClick={()=>setTab("Analytics")}')],
 ['wide Coach asset exists',fs.existsSync(coachAsset)&&fs.statSync(coachAsset).size>50000],
 ['Hockey Coach uses new wide asset',app.includes('return "/commercial-scenes/ice-hockey-coach-role.webp"')],
 ['Coach hero is full cover',css.includes('.performanceOS[data-role="Coach"] .elitePerformanceHero')&&css.includes('background-size:cover!important')],
 ['Coach mobile crop is explicitly tuned',css.includes('background-position:62% center!important')&&css.includes('background-position:64% center!important')],
 ['front-to-back professional surface reset exists',css.includes('Phase 72.3.82 RC32 — Professional Athletic System')&&css.includes('Front-to-back surface reset')],
 ['non-Junior cards are flattened',css.includes('.performanceOS[data-junior="false"] main .card')&&css.includes('border-radius:0!important;box-shadow:none!important')],
 ['professional section header treatment exists',css.includes('.performanceOS main .sectionHead::before')&&css.includes('var(--role-accent,var(--pro-green))')],
 ['tabs use underline navigation instead of pills',css.includes('Tabs become a restrained performance-nav strip')&&css.includes('border-bottom:2px solid transparent!important')],
 ['form controls use sharp athletic styling',css.includes('.performanceOS main :is(input,select,textarea)')&&css.includes('border-radius:1px!important')],
 ['fixed nav receives professional styling',css.includes('.viewportBottomNav{')&&css.includes('backdrop-filter:blur(18px) saturate(120%)!important')],
 ['Recovery Tips remain on Player Home',app.includes('className="eliteRecoveryHome"')&&app.includes('RECOVERY TIPS')],
 ['RC29 Coach/Roster regression remains registered',pkg.scripts['test:coach-roster-more']?.includes('coach-roster-more-check.mjs')],
 ['always-active nav regression remains registered',pkg.scripts['test:always-active-nav']?.includes('always-active-nav-check.mjs')],
 ['release notes document RC32',release.includes('Phase 72.3.83 RC33')&&release.includes('wide 1600×900 asset')],
 ['migration 009 hash remains protected',crypto.createHash('sha256').update(migration).digest('hex')==='ea088a53e3ffbb4ecfcab6e42fc9358b26a3c53e984299a436b887e8a008f626']
];
let pass=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(ok)pass++;}
console.log(`\nPASS: ${pass}/${checks.length} RC32 Professional Athletic System checks.`);
if(pass!==checks.length)process.exit(1);
