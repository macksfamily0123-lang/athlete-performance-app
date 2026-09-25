import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const migration=fs.readFileSync("supabase/migrations/016_combat_tennis_volleyball_sports.sql","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const checks=[];
const check=(ok,label)=>{if(!ok)throw new Error(`RC66 check failed: ${label}`);checks.push(label)};

check(pkg.version==="72.3.116","release version is Phase 72.3.116");
check(beta.includes("CLOSED BETA · RC66 · v72.3.116"),"RC66 release ribbon is present");
check(athlete.includes('src="/elite-performance-speed-e.svg"')&&athlete.includes("ELITE <em>PERFORMANCE</em>"),"Elite Performance header and Speed E logo are active");
check(!athlete.includes('className="logo hockeyDevLogo">HD</div><div><strong>HOCKEY'),"old Hockey Dev header is absent");
check(athlete.includes('"Combat Sports"|"Tennis"|"Volleyball"'),"Sport type includes all three new sports");
check(athlete.includes('"Combat Sports":["MMA","Boxing","Kickboxing","Grappling","Karate","Tae Kwon Do","Judo"]'),"Combat Sports includes every requested discipline");
check(beta.includes('"Combat Sports":["MMA","Boxing","Kickboxing","Grappling","Karate","Tae Kwon Do","Judo"]'),"Connections manager includes every combat discipline");
check(athlete.includes('Tennis:["Singles","Doubles","Singles & Doubles"]'),"Tennis formats are available");
check(athlete.includes('Volleyball:["Setter","Outside Hitter","Opposite Hitter","Middle Blocker","Libero","Defensive Specialist","Serving Specialist"]'),"Volleyball positions are available");
check(athlete.includes('sport==="Combat Sports"?"Discipline":sport==="Tennis"?"Format":"Position"'),"Player Profile uses discipline and format labels");
check(beta.includes('sport==="Combat Sports"?"Discipline":sport==="Tennis"?"Format":"Position"'),"Sports manager uses discipline and format labels");
for(const sport of ["Combat Sports","Tennis","Volleyball"]){
  check(athlete.includes(`if(sport===\"${sport}\")`)||athlete.includes(`\"${sport}\":{`),`${sport} has sport-specific logic`);
}
for(const file of ["combat-sports.svg","tennis.svg","volleyball.svg"]){
  const path=`public/sport-heroes/${file}`;
  check(fs.existsSync(path)&&fs.readFileSync(path,"utf8").includes("<svg"),`${file} premium hero exists`);
}
check(migration.includes("athlete_sport_profiles_sport_check"),"migration expands the sport constraint");
check(migration.includes("public.athlete_upsert_sport_profile"),"migration updates sport-profile validation");
check(["'Combat Sports'","'Tennis'","'Volleyball'"].every(value=>migration.includes(value)),"migration supports all new sports");
check(athlete.includes("const TRACKER_CONNECTIVITY_ENABLED=false"),"tracker connectivity remains disabled");

console.log(`RC66 combined Elite Performance brand and expanded-sports checks passed (${checks.length}/${checks.length}).`);
