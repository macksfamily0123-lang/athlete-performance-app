import fs from 'node:fs';

const app=fs.readFileSync(new URL('../components/AthleteApp.tsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
const checks=[
 ['Parent has dedicated hockey hero', app.includes('ice-hockey-parent.webp')],
 ['Coach has dedicated hockey hero', app.includes('ice-hockey-coach-role.webp')],
 ['Player has dedicated wide in-game hockey hero', app.includes('ice-hockey-player-game-wide.webp')],
 ['Hero exposes role to CSS', app.includes('data-hero-role={accountRole}')],
 ['Full-image foreground layer exists', app.includes('eliteRoleHeroForeground')],
 ['Backdrop fill layer exists', app.includes('eliteRoleHeroBackdrop')],
 ['Realistic hero no longer relies on CSS background image', css.includes('.rc34RoleHero.premiumRealisticSportHero') && css.includes('background-image:none!important')],
 ['Foreground shows complete image', css.includes('object-fit:contain!important')],
 ['Backdrop fills complete hero', css.includes('object-fit:cover!important')],
 ['Role content remains above imagery', css.includes('.rc34RoleHero .nativeHeroBottom') && css.includes('z-index:3!important')],
 ['Mobile hero keeps full-image renderer', css.includes('@media(max-width:700px)') && css.includes('.eliteRoleHeroForeground{object-fit:contain!important')],
];
let pass=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(ok)pass++;}
console.log(`\n${pass}/${checks.length} role-specific hero checks passed.`);
if(pass!==checks.length)process.exit(1);
