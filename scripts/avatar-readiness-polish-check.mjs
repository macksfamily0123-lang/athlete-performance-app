import fs from 'node:fs';
const app=fs.readFileSync('components/AthleteApp.tsx','utf8');
const css=fs.readFileSync('app/globals.css','utf8');
const checks=[
 ['fallback avatar has no hockey emoji', !app.includes('>🏒<')],
 ['fallback avatar shows initials', app.includes('photoUrl?<img') && app.includes(':<span>{playerInitials(name)}</span>')],
 ['smooth readiness component exists', app.includes('function SmoothReadinessRing')],
 ['readiness uses svg', app.includes('premiumReadinessSvg')],
 ['ring uses rounded line caps', css.includes('stroke-linecap:round')],
 ['conic readiness override removed by final css', css.includes('.premiumReadinessOrb{\n  position:relative!important;') && css.includes('background:#081a16!important;')],
 ['dynamic progress dash exists', app.includes('strokeDasharray={`${progress} ${100-progress}`}')],
 ['junior/non-junior hero logic preserved', app.includes('premiumHomeHeroAsset(sport,accountRole,juniorMode)')],
];
let pass=0;
for(const [name,ok] of checks){ console.log(`${ok?'PASS':'FAIL'}: ${name}`); if(ok) pass++; }
if(pass!==checks.length){process.exit(1)}
console.log(`PASS: ${pass}/${checks.length} avatar/readiness polish checks.`);
