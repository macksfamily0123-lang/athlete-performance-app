import fs from 'node:fs';
const css=fs.readFileSync('app/globals.css','utf8');
const app=fs.readFileSync('components/AthleteApp.tsx','utf8');
const checks=[
 ['RC33 photo-framing section exists',css.includes('Phase 72.3.83 RC33 — Sport Photo Framing / Zoom-Out Pass')],
 ['realistic hero uses dark edge fill',css.includes('background-color:#030b09!important')],
 ['desktop landscape images are inset',css.includes('background-size:cover,94% auto!important')],
 ['mobile landscape images use reduced height framing',css.includes('background-size:cover,auto 78%!important')],
 ['small phone landscape images zoom out further',css.includes('background-size:cover,auto 74%!important')],
 ['hockey portrait gets separate framing',css.includes('background-size:cover,auto 96%!important')],
 ['coach wide image gets separate framing',css.includes('background-size:cover,auto 80%!important')],
 ['all realistic sport assets preserved',['baseball','football','ice-hockey','basketball','lacrosse','wrestling','soccer','figure-skating'].every(x=>app.includes(`/commercial-scenes/${x}-player.webp`))],
 ['wide coach asset preserved',app.includes('/commercial-scenes/ice-hockey-coach-role.webp')||app.includes('/commercial-scenes/ice-hockey-coach-wide.webp')],
];
let pass=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(ok)pass++;}
console.log(`\n${pass}/${checks.length} photo-framing checks passed.`);
if(pass!==checks.length)process.exit(1);
