import fs from 'node:fs';
import crypto from 'node:crypto';

const app=fs.readFileSync('components/AthleteApp.tsx','utf8');
const css=fs.readFileSync('app/globals.css','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const release=fs.readFileSync('RELEASE_NOTES.md','utf8');
const migration=fs.readFileSync('supabase/migrations/009_player_more_cloud_test_athletes.sql');
const checks=[
 ['version is 72.3.83',pkg.version==='72.3.106'],
 ['RC31 beta ribbon/version references updated',app.includes('72.3.90 RC40')],
 ['new RC31 test registered',pkg.scripts['test:elite-home-goals-recovery']?.includes('elite-home-goals-recovery-check.mjs')],
 ['hero circular pseudo geometry is reset',css.includes('.performanceOS .elitePerformanceHero::before')&&css.includes('border-radius:0!important')&&css.includes('box-shadow:none!important')],
 ['Home Progress signal is explicitly labeled',app.includes('label:"PROGRESS"')&&app.includes('aria-label="Athlete performance summary"')],
 ['visual Progress action contains explicit Progress text',app.includes('<b>VIEW PROGRESS</b><span>Open analytics ↗</span>')],
 ['recovery tips are computed from readiness',(app.includes('const recoveryTips=latestReadiness?[')||app.includes('const recoveryTips=trackerSleepHours!=null?['))&&app.includes('recoveryHeadline')],
 ['Player Home has prominent Recovery Tips destination',app.includes('className="eliteRecoveryHome"')&&app.includes('RECOVERY TIPS')&&app.includes('OPEN RECOVERY →')],
 ['Recovery Home opens readiness/recovery tab',app.includes('className="eliteRecoveryHome" onClick={()=>setTab("Coach")}')],
 ['Goals page has scoped elite wrapper',app.includes('className="eliteGoalsPage"')&&app.includes('data-junior={juniorMode?"true":"false"}')],
 ['Goals page has performance signal rail',app.includes('eliteGoalsSignalRail')&&app.includes('NEAR FINISH')],
 ['non-Junior Goals cards are explicitly square',css.includes('.eliteGoalsPage[data-junior="false"] :is(.card,.goalCard')&&css.includes('border-radius:0!important')],
 ['goal rows use sharp editorial treatment',css.includes('.eliteGoalsPage[data-junior="false"] .goalCard{')&&css.includes('border-left:2px solid rgba(66,238,145,.36)')],
 ['goal progress bars are square',css.includes('.eliteGoalsPage[data-junior="false"] .goalCard .progress i')&&css.includes('border-radius:0!important')],
 ['goal form controls are tightened',css.includes('.eliteGoalsPage[data-junior="false"] :is(input,select,textarea)')&&css.includes('border-radius:2px!important')],
 ['mobile Recovery treatment exists',css.includes('@media(max-width:700px)')&&css.includes('.performanceOS .eliteRecoveryHome')],
 ['RC30 elite visual regression remains registered',pkg.scripts['test:elite-visual']?.includes('elite-performance-visual-check.mjs')],
 ['RC29 coach roster regression remains registered',pkg.scripts['test:coach-roster-more']?.includes('coach-roster-more-check.mjs')],
 ['release notes document RC31',release.includes('Phase 72.3.83 RC33')&&release.includes('Recovery Tips')],
 ['migration 009 hash remains protected',crypto.createHash('sha256').update(migration).digest('hex')==='ea088a53e3ffbb4ecfcab6e42fc9358b26a3c53e984299a436b887e8a008f626']
];
let pass=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(ok)pass++;}
console.log(`\nPASS: ${pass}/${checks.length} RC31 Elite Home / Goals / Recovery checks.`);
if(pass!==checks.length)process.exit(1);
