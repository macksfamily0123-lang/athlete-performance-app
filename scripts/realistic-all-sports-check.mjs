import fs from "node:fs";
const src=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));

const sports=[
 ["Baseball","baseball-player.webp"],
 ["Football","football-player.webp"],
 ["Ice Hockey","ice-hockey-player.webp"],
 ["Basketball","basketball-player.webp"],
 ["Lacrosse","lacrosse-player.webp"],
 ["Wrestling","wrestling-player.webp"],
 ["Soccer","soccer-player.webp"],
 ["Figure Skating","figure-skating-player.webp"],
];
const checks=[];
for(const [sport,file] of sports){
 checks.push([`${sport} realistic asset mapping`,src.includes(`"${sport}":"/commercial-scenes/${file}"`)]);
 checks.push([`${sport} image exists`,fs.existsSync(`public/commercial-scenes/${file}`)]);
}
checks.push(["Junior still uses simple sport art",src.includes("if(juniorMode)return sportHeroAsset(sport)")]);
checks.push(["All non-Junior accounts marked realistic",src.includes("const premiumHomeHeroIsRealistic=(_sport:Sport,juniorMode:boolean)=>!juniorMode")]);
checks.push(["Selected sport drives hero",src.includes("realisticSportHeroAsset(sport)")]);
checks.push(["Hockey Coach keeps coach scene",src.includes('accountRole==="Coach"&&sport==="Ice Hockey"')&&src.includes("/commercial-scenes/ice-hockey-coach.webp")]);
checks.push(["RC19 all-sport CSS present",css.includes("Phase 72.3.69 RC19")&&css.includes(".premiumHomeHero.premiumRealisticSportHero")]);
checks.push(["Version is 72.3.69",pkg.version==="72.3.69"]);

let pass=0;
for(const [name,ok] of checks){
 console.log(`${ok?"PASS":"FAIL"}: ${name}`);
 if(ok) pass++;
}
console.log(`\n${pass===checks.length?"PASS":"FAIL"}: ${pass}/${checks.length} realistic all-sports checks.`);
if(pass!==checks.length)process.exit(1);
