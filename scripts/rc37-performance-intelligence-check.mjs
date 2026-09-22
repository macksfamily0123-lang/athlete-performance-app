import fs from 'node:fs';
const app=fs.readFileSync('components/AthleteApp.tsx','utf8');
const css=fs.readFileSync('app/globals.css','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const checks=[
 ['version is 72.3.89',pkg.version==='72.3.106'],
 ['performance intelligence surface exists',app.includes('className="performanceIntelligence"')],
 ['performance index calculation exists',app.includes('const intelligenceScore=Math.round')],
 ['readiness can drive recovery-first guidance',app.includes('"Make recovery the priority"')],
 ['training can drive direct training guidance',app.includes('"Ready for today\'s training"')],
 ['performance momentum guidance exists',app.includes('"Keep building on recent progress"')],
 ['performance intelligence links to action tab',app.includes('onClick={()=>setTab(intelligenceTab)}')],
 ['subtle hero motion exists',css.includes('@keyframes rc38HeroIn')],
 ['signal motion exists',css.includes('@keyframes rc38SignalIn')],
 ['sparkline draw animation exists',css.includes('@keyframes rc38LineDraw')],
 ['reduced motion is respected',css.includes('@media(prefers-reduced-motion:reduce)')],
 ['front-to-back flatter surface rule exists',css.includes('Front-to-back visual consistency')],
];
let pass=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(ok)pass++;}
console.log(`\n${pass}/${checks.length} RC37 Performance Intelligence checks passed.`);
if(pass!==checks.length)process.exit(1);
