import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const app=fs.readFileSync(path.join(root,'components','AthleteApp.tsx'),'utf8');
const css=fs.readFileSync(path.join(root,'app','globals.css'),'utf8');
const realistic={
 'Baseball':'baseball-player.webp',
 'Football':'football-player.webp',
 'Ice Hockey':'ice-hockey-player.webp',
 'Basketball':'basketball-player.webp',
 'Lacrosse':'lacrosse-player.webp',
 'Wrestling':'wrestling-player.webp',
 'Soccer':'soccer-player.webp',
 'Figure Skating':'figure-skating-player.webp'
};
const checks=[];
for(const [sport,file] of Object.entries(realistic)){
 const asset=path.join(root,'public','commercial-scenes',file);
 checks.push([`${sport} realistic image exists`,fs.existsSync(asset)&&fs.statSync(asset).size>8000]);
 checks.push([`${sport} realistic mapping exists`,app.includes(`"${sport}":"/commercial-scenes/${file}"`)]);
}
checks.push(['Junior mode keeps sport-specific illustrated asset',app.includes('if(juniorMode)return sportHeroAsset(sport)')]);
checks.push(['all non-Junior sports are realistic',app.includes('const premiumHomeHeroIsRealistic=(_sport:Sport,juniorMode:boolean)=>!juniorMode')]);
checks.push(['Hockey Coach keeps dedicated coach scene',app.includes('/commercial-scenes/ice-hockey-coach.webp')]);
checks.push(['hero exposes current sport marker',app.includes('data-hero-sport={sport}')]);
checks.push(['hero exposes realistic vs illustrated marker',app.includes('data-hero-style={realisticHero?"realistic":"illustrated"}')]);
checks.push(['RC19 realistic CSS is present',css.includes('Phase 72.3.69 RC19')]);

let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(!ok)failed++;}
if(failed){console.error(`\n${failed} realistic-hero check(s) failed.`);process.exit(1);}
console.log(`\nPASS: ${checks.length}/${checks.length} realistic non-junior all-sport hero checks.`);
