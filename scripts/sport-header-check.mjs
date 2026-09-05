import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const app=fs.readFileSync(path.join(root,'components','AthleteApp.tsx'),'utf8');
const css=fs.readFileSync(path.join(root,'app','globals.css'),'utf8');
const expected={
  'Baseball':'baseball.svg',
  'Football':'football.svg',
  'Ice Hockey':'ice-hockey.svg',
  'Basketball':'basketball.svg',
  'Lacrosse':'lacrosse.svg',
  'Wrestling':'wrestling.svg',
  'Soccer':'soccer.svg',
  'Figure Skating':'figure-skating.svg'
};
const checks=[];
for(const [sport,file] of Object.entries(expected)){
  const asset=path.join(root,'public','sport-heroes',file);
  checks.push([`${sport} hero mapping`,app.includes(`\"${sport}\":\"/sport-heroes/${file}\"`)]);
  checks.push([`${sport} asset exists`,fs.existsSync(asset) && fs.statSync(asset).size>250]);
}
checks.push(['hero reads current profile sport',app.includes('sportHeroAsset(sport)')]);
checks.push(['hero uses CSS sport image variable',css.includes('var(--sport-hero-image)')]);
checks.push(['hockey header no longer uses detailed player hero',!css.match(/premiumHomeHero[^}]*hockey-commercial-hero\.svg/s)]);
checks.push(['hockey art includes distinct stick and puck shapes',fs.readFileSync(path.join(root,'public','sport-heroes','ice-hockey.svg'),'utf8').includes('<ellipse cx="650"')]);

let failed=0;
for(const [name,ok] of checks){
  console.log(`${ok?'PASS':'FAIL'}: ${name}`);
  if(!ok)failed++;
}
if(failed){
  console.error(`\n${failed} sport-header check(s) failed.`);
  process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} sport-aware header checks.`);
