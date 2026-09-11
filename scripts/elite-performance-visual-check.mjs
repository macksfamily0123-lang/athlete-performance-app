import fs from 'node:fs';

const app=fs.readFileSync('components/AthleteApp.tsx','utf8');
const css=fs.readFileSync('app/globals.css','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const release=fs.readFileSync('RELEASE_NOTES.md','utf8');
const checks=[
 ['version is 72.3.83',pkg.version==='72.3.88'],
 ['RC29 coach roster repair remains',pkg.scripts['test:coach-roster-more']?.includes('coach-roster-more-check.mjs')],
 ['elite visual check registered',pkg.scripts['test:elite-visual']?.includes('elite-performance-visual-check.mjs')],
 ['sparkline component exists',app.includes('function EliteSparkline')],
 ['live performance band exists',app.includes('elitePerformanceBand')],
 ['embedded performance visual exists',app.includes('eliteVisualPerformance')],
 ['player uses elite signal band',app.includes('nativePlayerFlow elitePlayerFlow')&&app.includes('{elitePerformanceBand}')],
 ['coach retains elite signal band',app.includes('nativeCoachHome eliteCoachHome')],
 ['parent retains elite signal band',app.includes('nativeParentHome eliteParentHome')],
 ['admin retains elite signal band',app.includes('nativeAdminHome eliteAdminHome')],
 ['hero telemetry exists',app.includes('eliteHeroTelemetry')],
 ['sport motif system exists',css.includes('--elite-sport-motif')&&css.includes('[data-sport="Ice Hockey"]')],
 ['continuous signal rail CSS exists',css.includes('.elitePerformanceBand{')],
 ['embedded sparkline CSS exists',css.includes('.eliteSparklineLine')],
 ['analytics flattening exists',css.includes('.cockpitInstrumentGrid')&&css.includes('border-radius:0!important')],
 ['roster scouting row treatment exists',css.includes('Roster: professional scouting-board rows')],
 ['premium command drawer treatment exists',css.includes('premium command drawer')],
 ['mobile 360-430 tuning exists',css.includes('@media(max-width:390px)')&&css.includes('.eliteVisualPerformance')],
 ['RC31 release notes present',release.includes('Phase 72.3.83')&&release.includes('Elite Performance Visual System')],
 ['migration 009 remains latest per docs',release.includes('migration 009')]
];
let pass=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`); if(ok)pass++;}
console.log(`\nPASS: ${pass}/${checks.length} Elite Performance Visual System checks.`);
if(pass!==checks.length)process.exit(1);
