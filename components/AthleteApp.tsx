
"use client";
import {useEffect,useMemo,useState} from "react";

type Sport="Baseball"|"Football"|"Ice Hockey"|"Basketball"|"Lacrosse"|"Wrestling"|"Soccer"|"Figure Skating";
type TestDef={id:string;name:string;category:string;unit:string;lowerBetter:boolean};
type CustomTest=TestDef&{sport:Sport};
type Result={id:number;testId:string;name:string;category:string;unit:string;value:number;date:string;sport:Sport};
type Goal={id:number;title:string;progress:number;type:"Short-term"|"Long-term";category?:string;deadline?:string;target?:string;linkedTestId?:string;status?:"Active"|"Complete"|"Paused";notes?:string};
type Workout={id:number;date:string;name:string;category:string;minutes:number;completed:boolean;sport:Sport;intensity?:"Easy"|"Moderate"|"Hard";rpe?:number;notes?:string;focus?:string};
type Profile={name:string;position:string;team:string;season:string;height:string;weight:string;handedness:"Right"|"Left"};
type DevelopmentItem={id:number,title:string,category:string,target:string,dueDate:string,status:"Not Started"|"In Progress"|"Complete";priority?:"High"|"Medium"|"Low";progress?:number;linkedGoalId?:number;notes?:string};
type ProgramExercise={phase:"Warm-up"|"Main"|"Sport"|"Finisher"|"Cooldown";name:string;sets:string;reps:string;rest:string;notes:string;instructions?:string};
type ProgramSession={id:number;day:string;name:string;category:string;minutes:number;focus:string;completed:boolean;exercises?:ProgramExercise[]};

type TrainingProgram={id:number;created:string;sport:Sport;position:string;focus:string;daysPerWeek:number;sessions:ProgramSession[];equipment?:"Gym Access"|"Body Weight Only"};
type ReadinessLog={id:number;date:string;sleep:number;soreness:number;energy:number;stress:number;notes:string};
type CoachNote={id:number;date:string;title:string;note:string;category:string};
type StatEntry={label:string;value:string};
type CompetitionLog={id:number;date:string;opponent:string;eventType:string;result:string;minutes:string;rating:number;notes:string;sport:Sport;stats:StatEntry[];location?:string;role?:string;keyWin?:string;improveNext?:string;confidence?:number};
type ReportNote={id:number;date:string;title:string;body:string};
type AthleteRecord={id:string;name:string;sport:Sport;position:string;team:string;season:string;height:string;weight:string;handedness:"Right"|"Left"};
type RosterSummary={id:string;name:string;sport:Sport;position:string;team:string;goals:number;workouts:number;tests:number;competitions:number;readiness:number;score:number};
type DailyLoad={date:string;label:string;load:number;workouts:number;events:number};
type QuickAction={id:string;label:string;tab:string;keywords:string[]};
type RecoveryFlag={label:string;value:string;status:"Good"|"Watch"|"Low"};
type PerformanceSignal={label:string;value:string;detail:string;tone:"good"|"watch"|"neutral"};
type SeasonMetric={label:string;value:number;display:string};
type BenchmarkBand={label:string;min?:number;max?:number};
type WeeklyPlanItem={day:string;focus:string;action:string;priority:"High"|"Medium"|"Low"};
type WorkspaceRole="Athlete"|"Coach"|"Parent";
type AccountRole="Player"|"Coach"|"Parent"|"Admin";
type AccountSession={role:AccountRole;displayName:string;athleteId:string;linkedAthleteIds?:string[]};

type ReminderItem={id:string;title:string;detail:string;date:string;kind:"Workout"|"Competition"|"Retest"|"Goal"|"Readiness";priority:"High"|"Normal"};
type DataHealthCheck={label:string;ok:boolean;detail:string};
type TeamSummary={team:string;athletes:number;avgScore:number;ready:number;tests:number;competitions:number};
type ShareSnapshot={athlete:string;sport:Sport;position:string;score:number;goalProgress:number;readiness:number;tests:number;competitions:number;generated:string};
type ActivityItem={id:string;date:string;kind:"Workout"|"Testing"|"Competition"|"Goal";title:string;detail:string};
type ReleaseCheck={label:string;done:boolean;detail:string};







type AthleteSnapshot={profile:Profile;goals:Goal[];workouts:Workout[];results:Result[];development:DevelopmentItem[];program:TrainingProgram|null;readiness:ReadinessLog[];coachNotes:CoachNote[];competitions:CompetitionLog[];reportNotes:ReportNote[]};
type BackupEnvelope={version:string;created:string;activeAthleteId:string;roster:AthleteRecord[];athletes:Record<string,AthleteSnapshot>};
type Achievement={id:string;title:string;description:string;category:string;earned:boolean;progress:number};
type Milestone={id:number;date:string;title:string;detail:string;category:string};
type Recommendation={id:string;title:string;reason:string;action:string;priority:"High"|"Medium"|"Low";category:string};
type WeeklyReview={id:number;weekStart:string;wins:string;challenges:string;focus:string;rating:number};
type TestTarget={id:string;testId:string;sport:Sport;target:string;retestDate:string;notes:string};
type TestProtocol={name:string;setup:string;instructions:string;quality:string};

type SeasonEvent={id:number;date:string;title:string;eventType:"Game"|"Tournament"|"Testing"|"Training Block"|"Recovery"|"Other";priority:"High"|"Normal";notes:string};
type TrainingBlock={id:number;name:string;startDate:string;endDate:string;focus:string;target:string;completed:boolean};







const pageHelp:Record<string,{title:string;purpose:string;primary:string}>={
 Home:{title:"Overview",purpose:"See what matters today and what to do next.",primary:"Review today"},
 Goals:{title:"Goals",purpose:"Set targets and track progress toward them.",primary:"Add or update a goal"},
 Calendar:{title:"Schedule",purpose:"See workouts, competitions, and important dates.",primary:"Plan training"},
 Testing:{title:"Testing",purpose:"Log results, track PRs, and measure improvement.",primary:"Log a test result"},
 Analytics:{title:"Progress",purpose:"Understand trends and overall development.",primary:"Review progress"},
 Coach:{title:"Readiness",purpose:"Check recovery and make better training decisions.",primary:"Complete readiness"},
 Development:{title:"Development",purpose:"Build skills, mental preparation, and training plans.",primary:"Choose a development tool"},
 Competition:{title:"Competition",purpose:"Track games, matches, performance, and learning.",primary:"Review competition"},
 Roster:{title:"Roster",purpose:"Manage athletes and switch who you are viewing.",primary:"Select or edit a player"}
};
const navMeta:Record<string,{icon:string;label:string}>={
 Home:{icon:"⌂",label:"Overview"},
 Goals:{icon:"◉",label:"Goals"},
 Calendar:{icon:"▦",label:"Schedule"},
 Testing:{icon:"⚡",label:"Testing"},
 Analytics:{icon:"⌁",label:"Progress"},
 Coach:{icon:"✦",label:"Readiness"},
 Development:{icon:"◇",label:"Development"},
 Competition:{icon:"◆",label:"Competition"},
 Roster:{icon:"◎",label:"Roster"}
};
const sports:Sport[]=["Baseball","Football","Ice Hockey","Basketball","Lacrosse","Wrestling","Soccer","Figure Skating"];
const categories=["Speed","Agility","Power","Strength","Endurance","Skill","Conditioning","Other"];
const units=["sec","min","mph","km/h","in","ft","lb","kg","reps","yards","meters","points","%","Other"];
const competitionStats:Record<Sport,string[]>={
 Baseball:["At Bats","Hits","Runs","RBI","Walks","Strikeouts","Stolen Bases"],
 Football:["Touches","Yards","Receptions","Tackles","Sacks","Touchdowns","Interceptions"],
 "Ice Hockey":["Goaltender","Left defense","Right defense","Left wing","Right wing","Center"],
 Basketball:["Points","Rebounds","Assists","Steals","Blocks","Turnovers"],
 Lacrosse:["Goals","Assists","Shots","Ground Balls","Caused Turnovers","Faceoff %"],
 Wrestling:["Takedowns","Escapes","Reversals","Near Fall","Penalty Points","Match Points"],
 Soccer:["Goals","Assists","Shots","Shots on Target","Pass %","Tackles","Saves"],
 "Figure Skating":["Program Score","Technical Element Score","Program Components","Jumps Landed","Spins","Step Sequence","Deduction"]
};

const testProtocols:Record<string,TestProtocol>={
 "10-yard sprint":{name:"10-yard sprint",setup:"Flat surface, measured 10-yard lane, consistent start line.",instructions:"Use the same starting stance each time. Sprint through the finish. Record the best valid time.",quality:"Use the same timing method, shoes, surface, and warm-up each session."},
 "20-yard sprint":{name:"20-yard sprint",setup:"Flat measured 20-yard lane with clear start and finish.",instructions:"Use a consistent stance and sprint through the line. Record the best valid time.",quality:"Keep timing method and surface consistent."},
 "40-yard sprint":{name:"40-yard sprint",setup:"Flat measured 40-yard lane.",instructions:"Use the same starting stance and record the best clean attempt.",quality:"Use the same timing system and rest fully between attempts."},
 "5-10-5 shuttle":{name:"5-10-5 shuttle",setup:"Three lines spaced 5 yards apart.",instructions:"Start at the middle line, sprint 5 yards, change direction 10 yards, then finish through the middle.",quality:"Use the same first direction and hand-touch standard every time."},
 "Vertical jump":{name:"Vertical jump",setup:"Use the same jump device or wall-reach method.",instructions:"Use a consistent countermovement and record the best valid jump.",quality:"Keep arm-swing rules and measuring method identical."},
 "Broad jump":{name:"Broad jump",setup:"Flat non-slip surface and tape measure.",instructions:"Two-foot takeoff and landing. Measure from start line to the nearest heel.",quality:"Use the same footwear and landing standard."},
 "Bench press":{name:"Bench press",setup:"Standard bench, barbell, safety spotter.",instructions:"Use the same testing method each time, such as 1RM or fixed-rep load.",quality:"Do not compare different rep schemes as the same test."},
 "Squat":{name:"Squat",setup:"Rack, barbell, safety setup.",instructions:"Use the same squat style, depth standard, and rep scheme each test.",quality:"Keep technique standard consistent before comparing results."},
 "Pull-ups":{name:"Pull-ups",setup:"Stable pull-up bar.",instructions:"Use the same grip and full range-of-motion standard each test.",quality:"Avoid changing grip width or kipping rules between tests."}
};


const positions:Record<Sport,string[]>={
 Soccer:["Goalkeeper","Center Back","Left Back","Right Back","Defensive Midfielder","Central Midfielder","Attacking Midfielder","Left Wing","Right Wing","Striker","Forward"],
 "Figure Skating":["Singles","Pairs","Ice Dance","Synchronized Skating"],
 Baseball:["Pitcher","Catcher","First Base","Second Base","Third Base","Shortstop","Left Field","Center Field","Right Field","Utility"],
 Football:["Quarterback","Running Back","Fullback","Wide Receiver","Tight End","Offensive Line","Defensive Line","Linebacker","Cornerback","Safety","Kicker","Punter","Long Snapper"],
 "Ice Hockey":["Goaltender","Left defense","Right defense","Left wing","Right wing","Center"],
 Basketball:["Point Guard","Shooting Guard","Small Forward","Power Forward","Center"],
 Lacrosse:["Attack","Midfield","Defense","Faceoff Specialist","Goalie"],
 Wrestling:["Wrestler"]
};

const raw:Record<Sport,string[][]>={
 Baseball:[["10-yard sprint","Speed","sec","1"],["20-yard sprint","Speed","sec","1"],["5-10-5 shuttle","Agility","sec","1"],["Vertical jump","Power","in","0"],["Broad jump","Power","in","0"],["Bench press","Strength","lb","0"]],
 Football:[["10-yard sprint","Speed","sec","1"],["40-yard sprint","Speed","sec","1"],["5-10-5 shuttle","Agility","sec","1"],["Vertical jump","Power","in","0"],["Broad jump","Power","in","0"],["Bench press","Strength","lb","0"],["Squat","Strength","lb","0"]],
 "Ice Hockey":[["10-yard sprint","Speed","sec","1"],["20-yard sprint","Speed","sec","1"],["Pro agility shuttle","Agility","sec","1"],["Vertical jump","Power","in","0"],["Broad jump","Power","in","0"],["Squat","Strength","lb","0"]],
 Basketball:[["10-yard sprint","Speed","sec","1"],["Lane agility","Agility","sec","1"],["Vertical jump","Power","in","0"],["Broad jump","Power","in","0"],["Squat","Strength","lb","0"]],
 Lacrosse:[["20-yard sprint","Speed","sec","1"],["Pro agility shuttle","Agility","sec","1"],["Vertical jump","Power","in","0"],["Broad jump","Power","in","0"],["Bench press","Strength","lb","0"]],
 Wrestling:[["20-yard sprint","Speed","sec","1"],["5-10-5 shuttle","Agility","sec","1"],["Vertical jump","Power","in","0"],["Broad jump","Power","in","0"],["Squat","Strength","lb","0"],["Pull-ups","Strength","reps","0"]],
 "Figure Skating":[["Single-leg balance","Skill","sec","0"],["Vertical jump","Power","in","0"],["Broad jump","Power","in","0"],["30-second jump count","Endurance","reps","0"],["Spin rotations","Skill","reps","0"],["Edge control course","Agility","sec","1"]]
};
const definitions=(sport:Sport):TestDef[]=>raw[sport].map((x,i)=>({id:`${sport}-${i}`,name:x[0],category:x[1],unit:x[2],lowerBetter:x[3]==="1"}));
const today=()=>new Date().toISOString().slice(0,10);
const daysAgo=(n:number)=>{const d=new Date();d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)};
const improvement=(first:number,last:number,lower:boolean)=>first===0?0:Math.round((lower?(first-last)/first:(last-first)/first*100)*10)/10;
const pct=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));

export default function AthleteApp(){
 const [sport,setSport]=useState<Sport>("Ice Hockey"),[tab,setTab]=useState("Home");
 const [results,setResults]=useState<Result[]>([]),[custom,setCustom]=useState<CustomTest[]>([]),[goals,setGoals]=useState<Goal[]>([]),[workouts,setWorkouts]=useState<Workout[]>([]),[profile,setProfile]=useState<Profile>({name:"Athlete",position:"",team:"",season:"2026-27",height:"",weight:"",handedness:"Right"});
 const [dev,setDev]=useState<DevelopmentItem[]>([]);
 const [program,setProgram]=useState<TrainingProgram|null>(null);
 const [readiness,setReadiness]=useState<ReadinessLog[]>([]);
 const [coachNotes,setCoachNotes]=useState<CoachNote[]>([]);
 const [competitions,setCompetitions]=useState<CompetitionLog[]>([]);
 const [reportNotes,setReportNotes]=useState<ReportNote[]>([]);
 const [roster,setRoster]=useState<AthleteRecord[]>([]);
 const [activeAthleteId,setActiveAthleteId]=useState("primary");
 const [milestones,setMilestones]=useState<Milestone[]>([]);
 const [seasonEvents,setSeasonEvents]=useState<SeasonEvent[]>([]);
 const [trainingBlocks,setTrainingBlocks]=useState<TrainingBlock[]>([]);
 const [weeklyReviews,setWeeklyReviews]=useState<WeeklyReview[]>([]);
 const [testTargets,setTestTargets]=useState<TestTarget[]>([]);
 const [commandOpen,setCommandOpen]=useState(false);
 const [commandQuery,setCommandQuery]=useState("");
 const [workspaceRole,setWorkspaceRole]=useState<WorkspaceRole>("Athlete");
 const [onboardingDismissed,setOnboardingDismissed]=useState(false);
 const [editProfileRequest,setEditProfileRequest]=useState(0);
 const [accountSession,setAccountSession]=useState<AccountSession|null>(null);
 const [adminView,setAdminView]=useState<"Admin"|"Coach"|"Player"|"Parent">("Admin");
 const [mounted,setMounted]=useState(false);
 useEffect(()=>{for(const [key,setter] of [["results",setResults],["custom",setCustom],["goals",setGoals],["workouts",setWorkouts]] as any[]){try{const v=localStorage.getItem(key);if(v)setter(JSON.parse(v))}catch{}}},[]);
 useEffect(()=>localStorage.setItem("results",JSON.stringify(results)),[results]);
 useEffect(()=>localStorage.setItem("custom",JSON.stringify(custom)),[custom]);
 useEffect(()=>localStorage.setItem("goals",JSON.stringify(goals)),[goals]);
 useEffect(()=>localStorage.setItem("workouts",JSON.stringify(workouts)),[workouts]);
useEffect(()=>{try{const v=localStorage.getItem("profile");if(v){const x=JSON.parse(v);setProfile({name:x?.name??"Athlete",position:x?.position??"",team:x?.team??"",season:x?.season??"2026-27",height:x?.height??"",weight:x?.weight??"",handedness:x?.handedness==="Left"?"Left":"Right"})}}catch{}},[]);
useEffect(()=>localStorage.setItem("profile",JSON.stringify(profile)),[profile]);
useEffect(()=>{try{const v=localStorage.getItem("development");if(v)setDev(JSON.parse(v))}catch{}},[]);
useEffect(()=>localStorage.setItem("development",JSON.stringify(dev)),[dev]);
useEffect(()=>{try{const v=localStorage.getItem("trainingProgram");if(v)setProgram(JSON.parse(v))}catch{}},[]);
useEffect(()=>{if(program)localStorage.setItem("trainingProgram",JSON.stringify(program));else localStorage.removeItem("trainingProgram")},[program]);
 useEffect(()=>{try{const v=localStorage.getItem("readiness");if(v)setReadiness(JSON.parse(v))}catch{}},[]);
 useEffect(()=>localStorage.setItem("readiness",JSON.stringify(readiness)),[readiness]);
 useEffect(()=>{try{const v=localStorage.getItem("coachNotes");if(v)setCoachNotes(JSON.parse(v))}catch{}},[]);
 useEffect(()=>localStorage.setItem("coachNotes",JSON.stringify(coachNotes)),[coachNotes]);
 useEffect(()=>{try{const v=localStorage.getItem("competitions");if(v)setCompetitions(JSON.parse(v))}catch{}},[]);
 useEffect(()=>localStorage.setItem("competitions",JSON.stringify(competitions)),[competitions]);
 useEffect(()=>{try{const v=localStorage.getItem("reportNotes");if(v)setReportNotes(JSON.parse(v))}catch{}},[]);
 useEffect(()=>localStorage.setItem("reportNotes",JSON.stringify(reportNotes)),[reportNotes]);
 useEffect(()=>{try{const v=localStorage.getItem("athleteRoster");if(v)setRoster(JSON.parse(v))}catch{}},[]);
 useEffect(()=>localStorage.setItem("athleteRoster",JSON.stringify(roster)),[roster]);
 useEffect(()=>{try{const v=localStorage.getItem("activeAthleteId");if(v)setActiveAthleteId(v)}catch{}},[]);
 useEffect(()=>localStorage.setItem("activeAthleteId",activeAthleteId),[activeAthleteId]);
 useEffect(()=>{try{const v=localStorage.getItem(`milestones:${activeAthleteId}`);setMilestones(v?JSON.parse(v):[])}catch{setMilestones([])}},[activeAthleteId]);
 useEffect(()=>{try{localStorage.setItem(`milestones:${activeAthleteId}`,JSON.stringify(milestones))}catch{}},[activeAthleteId,milestones]);
 useEffect(()=>{try{const v=localStorage.getItem(`seasonEvents:${activeAthleteId}`);setSeasonEvents(v?JSON.parse(v):[])}catch{setSeasonEvents([])}},[activeAthleteId]);
 useEffect(()=>{try{localStorage.setItem(`seasonEvents:${activeAthleteId}`,JSON.stringify(seasonEvents))}catch{}},[activeAthleteId,seasonEvents]);
 useEffect(()=>{try{const v=localStorage.getItem(`trainingBlocks:${activeAthleteId}`);setTrainingBlocks(v?JSON.parse(v):[])}catch{setTrainingBlocks([])}},[activeAthleteId]);
 useEffect(()=>{try{localStorage.setItem(`trainingBlocks:${activeAthleteId}`,JSON.stringify(trainingBlocks))}catch{}},[activeAthleteId,trainingBlocks]);
 useEffect(()=>{try{const v=localStorage.getItem(`weeklyReviews:${activeAthleteId}`);setWeeklyReviews(v?JSON.parse(v):[])}catch{setWeeklyReviews([])}},[activeAthleteId]);
 useEffect(()=>{try{localStorage.setItem(`weeklyReviews:${activeAthleteId}`,JSON.stringify(weeklyReviews))}catch{}},[activeAthleteId,weeklyReviews]);
 useEffect(()=>{try{const v=localStorage.getItem(`testTargets:${activeAthleteId}`);setTestTargets(v?JSON.parse(v):[])}catch{setTestTargets([])}},[activeAthleteId]);
 useEffect(()=>{try{localStorage.setItem(`testTargets:${activeAthleteId}`,JSON.stringify(testTargets))}catch{}},[activeAthleteId,testTargets]);
 useEffect(()=>{try{const v=localStorage.getItem("workspaceRole") as WorkspaceRole|null;if(v)setWorkspaceRole(v)}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem("workspaceRole",workspaceRole)}catch{}},[workspaceRole]);
 useEffect(()=>{try{setOnboardingDismissed(localStorage.getItem("onboardingDismissed")==="1")}catch{}},[]);
 useEffect(()=>{try{if(onboardingDismissed)localStorage.setItem("onboardingDismissed","1")}catch{}},[onboardingDismissed]);
 useEffect(()=>{try{const raw=localStorage.getItem("accountSession");if(raw){const x=JSON.parse(raw);if(["Player","Coach","Parent","Admin"].includes(x?.role))setAccountSession(x)}}catch{}},[]);
 useEffect(()=>setMounted(true),[]);
 useEffect(()=>{try{localStorage.setItem(`athleteData:${activeAthleteId}`,JSON.stringify({profile,goals,workouts,results,development:dev,program,readiness,coachNotes,competitions,reportNotes}))}catch{}},[activeAthleteId,profile,goals,workouts,results,dev,program,readiness,coachNotes,competitions,reportNotes]);

 
 const storageKey=(id:string)=>`athleteData:${id}`;

 const buildSnapshot=():AthleteSnapshot=>({
   profile:{...profile},goals:[...goals],workouts:[...workouts],results:[...results],development:[...dev],program:program?{...program,sessions:program.sessions.map(x=>({...x}))}:null,readiness:[...readiness],coachNotes:[...coachNotes],competitions:[...competitions],reportNotes:[...reportNotes]
 });

 const saveActiveSnapshot=()=>{
   try{localStorage.setItem(storageKey(activeAthleteId),JSON.stringify(buildSnapshot()))}catch{}
 };

 const loadAthleteSnapshot=(id:string,record?:AthleteRecord)=>{
   try{
     const raw=localStorage.getItem(storageKey(id));
     if(raw){
       const x=JSON.parse(raw);
       setProfile({name:x?.profile?.name??record?.name??"Athlete",position:x?.profile?.position??record?.position??"",team:x?.profile?.team??record?.team??"",season:x?.profile?.season??record?.season??"2026-27",height:x?.profile?.height??record?.height??"",weight:x?.profile?.weight??record?.weight??"",handedness:x?.profile?.handedness==="Left"?"Left":"Right"});
       setGoals(Array.isArray(x?.goals)?x.goals:[]);
       setWorkouts(Array.isArray(x?.workouts)?x.workouts:[]);
       setResults(Array.isArray(x?.results)?x.results:[]);
       setDev(Array.isArray(x?.development)?x.development:[]);
       setProgram(x?.program??null);
       setReadiness(Array.isArray(x?.readiness)?x.readiness:[]);
       setCoachNotes(Array.isArray(x?.coachNotes)?x.coachNotes:[]);
       setCompetitions(Array.isArray(x?.competitions)?x.competitions:[]);
       setReportNotes(Array.isArray(x?.reportNotes)?x.reportNotes:[]);
     }else if(record){
       setProfile({name:record.name,position:record.position,team:record.team,season:record.season,height:record.height,weight:record.weight,handedness:record.handedness});
       setGoals([]);setWorkouts([]);setResults([]);setDev([]);setProgram(null);setReadiness([]);setCoachNotes([]);setCompetitions([]);setReportNotes([]);
     }
     if(record)setSport(record.sport);
   }catch{}
 };

 const switchAthlete=(record:AthleteRecord)=>{
   saveActiveSnapshot();
   setActiveAthleteId(record.id);
   loadAthleteSnapshot(record.id,record);
 };

 const roleToWorkspace=(role:AccountRole):WorkspaceRole=>role==="Player"?"Athlete":role==="Admin"?"Coach":role;
 const completeRoleLogin=(role:AccountRole,displayName:string,linkedAthleteIds?:string[])=>{
   const session:AccountSession={role,displayName:displayName.trim()||role,athleteId:activeAthleteId,linkedAthleteIds:role==="Parent"?(linkedAthleteIds?.length?linkedAthleteIds:[activeAthleteId]):undefined};
   setAccountSession(session);
   setWorkspaceRole(roleToWorkspace(role));
   setTab("Home");
   try{localStorage.setItem("accountSession",JSON.stringify(session))}catch{}
 };
 const signOutRole=()=>{
   setAccountSession(null);
   setTab("Home");
   setCommandOpen(false);
   try{localStorage.removeItem("accountSession")}catch{}
 };
 const accountRole:AccountRole=accountSession?.role||"Player";
 const effectiveRole:AccountRole=accountRole==="Admin"?(adminView==="Admin"?"Admin":adminView):accountRole;
 const allAthletes=useMemo<AthleteRecord[]>(()=>{
  const primary:AthleteRecord={id:"primary",name:profile.name,sport,position:profile.position,team:profile.team,season:profile.season,height:profile.height,weight:profile.weight,handedness:profile.handedness};
  const merged=[primary,...roster.filter(r=>r.id!=="primary")];
  const seen=new Set<string>(); return merged.filter(a=>!seen.has(a.id)&&(seen.add(a.id),true));
 },[profile,sport,roster]);

 const allowedAthletes=useMemo(()=>{
  if(accountRole==="Player")return allAthletes.filter(a=>a.id===accountSession?.athleteId||a.id===activeAthleteId).slice(0,1);
  if(accountRole==="Parent"){
    const linked=accountSession?.linkedAthleteIds?.length?accountSession.linkedAthleteIds:[accountSession?.athleteId||activeAthleteId];
    return allAthletes.filter(a=>linked.includes(a.id));
  }
  return allAthletes;
 },[accountRole,accountSession,allAthletes,activeAthleteId]);

 const selectAthleteById=(id:string)=>{
  const athlete=allAthletes.find(a=>a.id===id);
  if(!athlete)return;
  if(accountRole==="Parent"&&!allowedAthletes.some(a=>a.id===id))return;
  if(accountRole==="Player"&&id!==accountSession?.athleteId)return;
  switchAthlete(athlete);
 };

 const visibleTabs:string[]=accountRole==="Admin"&&adminView==="Admin"?["Home","Goals","Calendar","Testing","Analytics","Coach","Development","Competition","Roster"]:effectiveRole==="Coach"
  ?["Home","Goals","Calendar","Testing","Analytics","Coach","Development","Competition","Roster"]
  :effectiveRole==="Player"
  ?["Home","Goals","Calendar","Testing","Analytics","Coach","Development","Competition"]
  :["Home","Calendar","Analytics","Development","Competition"];
 const roleNavLabel=(x:string)=>accountRole==="Player"&&x==="Coach"?"Readiness":navMeta[x]?.label||x;

 
 const quickActions:QuickAction[]=[
  {id:"home",label:"Go to Home",tab:"Home",keywords:["dashboard","home","summary"]},
  {id:"goals",label:"Open Goals",tab:"Goals",keywords:["goal","target","deadline"]},
  {id:"calendar",label:"Open Calendar",tab:"Calendar",keywords:["workout","schedule","training"]},
  {id:"testing",label:"Open Testing",tab:"Testing",keywords:["test","pr","retest"]},
  {id:"analytics",label:"Open Analytics",tab:"Analytics",keywords:["trend","report","scorecard"]},
  {id:"coach",label:"Open Coach",tab:"Coach",keywords:["readiness","recommendation","recovery"]},
  {id:"development",label:"Open Development",tab:"Development",keywords:["program","milestone","objective"]},
  {id:"competition",label:"Open Competition",tab:"Competition",keywords:["game","match","stats"]},
  {id:"roster",label:"Open Roster",tab:"Roster",keywords:["athlete","backup","data"]}
 ];
 const filteredActions=quickActions.filter(a=>visibleTabs.includes(a.tab)).filter(a=>!commandQuery.trim()||(`${a.label} ${a.keywords.join(" ")}`).toLowerCase().includes(commandQuery.toLowerCase()));
 useEffect(()=>{
  const handler=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setCommandOpen(x=>!x)}if(e.key==="Escape")setCommandOpen(false)};
  window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler)
 },[]);

 if(!mounted)return <div className="app hydrationShell"><header><div className="logo">AP</div><div><strong>Athlete Performance</strong><small>Loading athlete dashboard…</small></div></header><main id="main-content" tabIndex={-1}><div className="hydrationCard"><div className="hydrationPulse"/><div><b>Loading your performance data</b><small>Your saved athlete data will appear in a moment.</small></div></div></main></div>;
 if(!accountSession)return <RoleLogin profile={profile} activeAthleteId={activeAthleteId} roster={roster} onLogin={completeRoleLogin}/>;
 return <div className="app"><a className="skipLink" href="#main-content">Skip to main content</a>
  <header className="appHeader"><div className="brandBlock"><div className="logo">AP</div><div><strong>Athlete Performance</strong><small>Train with purpose.</small></div></div><div className="headerActions"><span className="accountHeaderRole">{accountRole==="Admin"&&adminView!=="Admin"?`Admin · ${adminView}`:accountRole}</span><button className="commandButton" aria-label="Open quick navigation" onClick={()=>setCommandOpen(true)}>Navigate</button></div></header>
  <div className="contextBar cleanContext"><div className="athleteContext"><small>ACTIVE ATHLETE</small><b>{profile.name}</b><span>{sport}{profile.position?` · ${profile.position}`:""}{profile.team?` · ${profile.team}`:""}</span></div><div className="contextControls">{accountRole!=="Player"&&allowedAthletes.length>0&&<label className="athleteSelector"><small>Viewing</small><select value={activeAthleteId} onChange={e=>selectAthleteById(e.target.value)}>{allowedAthletes.map(a=><option value={a.id} key={a.id}>{a.name}{a.team?` · ${a.team}`:""}</option>)}</select></label>}{accountRole==="Admin"&&<label className="adminViewPicker"><small>Preview role</small><select value={adminView} onChange={e=>{setAdminView(e.target.value as "Admin"|"Coach"|"Player"|"Parent");setTab("Home")}}><option>Admin</option><option>Coach</option><option>Player</option><option>Parent</option></select></label>}<div className="sessionIdentity"><small>SIGNED IN</small><b>{accountSession.displayName}</b><span>{accountRole}</span></div><button className="signOutButton" onClick={signOutRole}>Sign out</button></div></div>
  <main>
   <div className="sportSelectorBlock"><div className="sportSelectorHead"><small>SPORT</small><span>Choose a sport</span></div><div className="sports topSportButtons">{sports.map(s=><button className={sport===s?"sel":""} onClick={()=>{setSport(s);setProfile((x:Profile)=>({...x,position:positions[s].includes(x.position)?x.position:""}))}} key={s}>{s}</button>)}</div></div>
   <div className="workspaceGuide"><div><small>{effectiveRole.toUpperCase()} WORKSPACE</small><b>{effectiveRole==="Coach"?"Manage athletes and training decisions":effectiveRole==="Parent"?"Track progress without editing athlete data":effectiveRole==="Player"?"Focus on today’s training and development":"Full access and role testing"}</b></div><span>{roleNavLabel(tab)}</span></div><div className="pageGuide"><div><small>{pageHelp[tab]?.title||tab}</small><b>{pageHelp[tab]?.purpose||""}</b></div><span>{pageHelp[tab]?.primary||""}</span></div>
   {tab==="Home"&&(effectiveRole==="Parent"?<ParentHome profile={profile} sport={sport} goals={goals} workouts={workouts} readiness={readiness} competitions={competitions} dev={dev} program={program}/>:effectiveRole==="Admin"?<><AdminHome profile={profile} sport={sport} roster={roster}/><Home sport={sport} goals={goals} workouts={workouts} results={results} profile={profile} setProfile={setProfile} readiness={readiness} competitions={competitions} dev={dev} program={program} weeklyReviews={weeklyReviews} setWeeklyReviews={setWeeklyReviews} testTargets={testTargets} workspaceRole={roleToWorkspace(effectiveRole)} onboardingDismissed={onboardingDismissed} setOnboardingDismissed={setOnboardingDismissed} setTab={setTab} editProfileRequest={editProfileRequest}/></>:<Home sport={sport} goals={goals} workouts={workouts} results={results} profile={profile} setProfile={setProfile} readiness={readiness} competitions={competitions} dev={dev} program={program} weeklyReviews={weeklyReviews} setWeeklyReviews={setWeeklyReviews} testTargets={testTargets} workspaceRole={roleToWorkspace(effectiveRole)} onboardingDismissed={onboardingDismissed} setOnboardingDismissed={setOnboardingDismissed} setTab={setTab} editProfileRequest={editProfileRequest}/>)} 
   {tab==="Goals"&&<Goals goals={goals} setGoals={setGoals}/>}
   {tab==="Calendar"&&(effectiveRole==="Parent"?<ParentSchedule sport={sport} workouts={workouts} competitions={competitions} seasonEvents={seasonEvents}/>:<Calendar sport={sport} workouts={workouts} setWorkouts={setWorkouts} profile={profile} seasonEvents={seasonEvents} setSeasonEvents={setSeasonEvents} trainingBlocks={trainingBlocks} setTrainingBlocks={setTrainingBlocks} competitions={competitions}/>)} 
   {tab==="Testing"&&<Testing sport={sport} library={[...definitions(sport),...custom.filter(x=>x.sport===sport)]} custom={custom} setCustom={setCustom} results={results} setResults={setResults} testTargets={testTargets} setTestTargets={setTestTargets}/>} 
   {tab==="Analytics"&&(effectiveRole==="Parent"?<ParentProgress sport={sport} profile={profile} goals={goals} workouts={workouts} results={results} readiness={readiness} competitions={competitions}/>:<AnalyticsHub sport={sport} profile={profile} goals={goals} workouts={workouts} results={results} dev={dev} program={program} readiness={readiness} competitions={competitions} reportNotes={reportNotes} setReportNotes={setReportNotes}/>)} 
   {tab==="Coach"&&((effectiveRole==="Coach"||effectiveRole==="Admin")?<CoachHub sport={sport} profile={profile} goals={goals} workouts={workouts} results={results} dev={dev} program={program} readiness={readiness} setReadiness={setReadiness} competitions={competitions} coachNotes={coachNotes} setCoachNotes={setCoachNotes}/>:effectiveRole==="Player"?<Readiness sport={sport} readiness={readiness} setReadiness={setReadiness} coachNotes={coachNotes} setCoachNotes={setCoachNotes} program={program} workouts={workouts} accountRole="Player"/>:null)} 
   
   {tab==="Development"&&(effectiveRole==="Parent"?<ParentDevelopment sport={sport} dev={dev} program={program} milestones={milestones}/>:<DevelopmentHub sport={sport} profile={profile} dev={dev} setDev={setDev} results={results} goals={goals} workouts={workouts} program={program} setProgram={setProgram} readiness={readiness} competitions={competitions} milestones={milestones} setMilestones={setMilestones} setWorkouts={setWorkouts}/>)} 
   
   
   {tab==="Competition"&&(effectiveRole==="Parent"?<ParentCompetition sport={sport} profile={profile} competitions={competitions}/>:<Competition sport={sport} competitions={competitions} setCompetitions={setCompetitions} profile={profile}/>)} 
   
   {tab==="Roster"&&(effectiveRole==="Coach"||effectiveRole==="Admin")&&<><Roster sport={sport} profile={profile} roster={roster} setRoster={setRoster} activeAthleteId={activeAthleteId} switchAthlete={switchAthlete} setTab={setTab} setEditProfileRequest={setEditProfileRequest}/><DataCenter profile={profile} sport={sport} roster={roster} activeAthleteId={activeAthleteId} goals={goals} workouts={workouts} results={results} dev={dev} program={program} readiness={readiness} coachNotes={coachNotes} competitions={competitions} reportNotes={reportNotes} setProfile={setProfile} setGoals={setGoals} setWorkouts={setWorkouts} setResults={setResults} setDev={setDev} setProgram={setProgram} setReadiness={setReadiness} setCoachNotes={setCoachNotes} setCompetitions={setCompetitions} setReportNotes={setReportNotes} setRoster={setRoster} setActiveAthleteId={setActiveAthleteId} setSport={setSport}/></>} 
   
    
  </main>
  {commandOpen&&<div className="commandOverlay" role="dialog" aria-modal="true" aria-label="Quick navigation" onClick={()=>setCommandOpen(false)}><div className="commandPalette" onClick={e=>e.stopPropagation()}><div className="sectionHead"><h2>Go to a section</h2><button aria-label="Close quick navigation" onClick={()=>setCommandOpen(false)}>×</button></div><input autoFocus value={commandQuery} onChange={e=>setCommandQuery(e.target.value)} placeholder="Search Overview, Goals, Testing, Roster…"/><div className="commandResults">{filteredActions.map(a=><button key={a.id} onClick={()=>{setTab(a.tab);setCommandOpen(false);setCommandQuery("")}}><span>{navMeta[a.tab]?.icon||"•"}</span><b>{a.label}</b><small>{a.keywords.join(" · ")}</small></button>)}</div></div></div>}
 <nav className="mainNav">{visibleTabs.map(x=><button aria-current={tab===x?"page":undefined} aria-label={roleNavLabel(x)} className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}><span className="navIcon" aria-hidden="true">{navMeta[x]?.icon||"•"}</span><span className="navLabel">{roleNavLabel(x)}</span></button>)}</nav>
 </div>
}



function RoleLogin({profile,activeAthleteId,roster,onLogin}:{profile:Profile;activeAthleteId:string;roster:AthleteRecord[];onLogin:(role:AccountRole,name:string,linkedAthleteIds?:string[])=>void}){
 const [role,setRole]=useState<AccountRole>("Player");
 const [name,setName]=useState("");
 const [parentLinks,setParentLinks]=useState<string[]>([activeAthleteId]);
 const descriptions:Record<AccountRole,string>={
  Admin:"Full owner/developer access to every feature plus role-preview controls for testing Player, Coach, and Parent experiences.",
  Player:"My training, goals, testing, readiness, development, mental preparation, and competition tools.",
  Coach:"Athlete management, roster tools, program creation, private coach notes, testing oversight, and team analytics.",
  Parent:"A simplified read-only view of schedule, progress, development, readiness, and competition information."
 };
 const loginAthletes:AthleteRecord[]=[{id:"primary",name:profile.name,sport:"Ice Hockey" as Sport,position:profile.position,team:profile.team,season:profile.season,height:profile.height,weight:profile.weight,handedness:profile.handedness},...roster.filter(r=>r.id!=="primary")];
 const toggleParentLink=(id:string)=>setParentLinks(x=>x.includes(id)?x.filter(a=>a!==id):[...x,id]);
 return <div className="roleLoginShell">
  <div className="roleLoginCard">
   <div className="roleLoginBrand"><div className="logo">AP</div><div><small>ATHLETE PERFORMANCE</small><h1>Choose your workspace</h1><p>Each account type gets the tools and information appropriate for that role.</p></div></div>
   <div className="roleChoiceGrid">{(["Player","Coach","Parent","Admin"] as AccountRole[]).map(r=><button key={r} className={"roleChoice "+(role===r?"active":"")} onClick={()=>setRole(r)}><span>{r==="Player"?"◆":r==="Coach"?"✦":r==="Parent"?"◎":"★"}</span><b>{r}</b><small>{descriptions[r]}</small></button>)}</div>
   <div className="roleLoginForm"><label>Your name<input value={name} onChange={e=>setName(e.target.value)} placeholder={role==="Player"?profile.name||"Player name":role==="Coach"?"Coach name":role==="Parent"?"Parent / guardian name":"Admin name"}/></label>
    <div className="linkedAthlete"><small>ACTIVE ATHLETE</small><b>{profile.name}</b><span>{profile.team||"No team saved"} · {profile.position||"Position not set"}</span></div>
    {role==="Parent"&&<div className="parentLinkSetup"><small>LINK CHILDREN</small><p>Select every athlete this parent should be able to view.</p><div className="parentLinkGrid">{loginAthletes.map(a=><label key={a.id} className={parentLinks.includes(a.id)?"linked":""}><input type="checkbox" checked={parentLinks.includes(a.id)} onChange={()=>toggleParentLink(a.id)}/><span><b>{a.name}</b><small>{a.team||"No team"} · {a.position||"Position not set"}</small></span></label>)}</div></div>}
    <button className="featureAction roleContinue" disabled={role==="Parent"&&parentLinks.length===0} onClick={()=>onLogin(role,name|| (role==="Player"?profile.name:role),role==="Parent"?parentLinks:undefined)}>Continue as {role}</button>
   </div>
   <p className="roleSecurityNote">This build separates the app experience and permissions by role on this device. Cloud authentication and server-enforced permissions are the next account-security layer.</p>
  </div>
 </div>;
}


function AdminHome({profile,sport,roster}:{profile:Profile;sport:Sport;roster:AthleteRecord[]}){
 return <><div className="hero adminHero"><small>ADMIN WORKSPACE</small><h1>Owner / Admin Control</h1><p>Full app access with role-preview controls for testing every workspace.</p></div>
 <div className="adminAccessGrid"><div className="card"><small>ACTIVE ATHLETE</small><h2>{profile.name}</h2><p>{sport}{profile.position?" · "+profile.position:""}</p></div><div className="card"><small>ROSTER</small><h2>{Math.max(1,roster.length)} athlete{Math.max(1,roster.length)===1?"":"s"}</h2><p>Full roster and athlete-data access.</p></div><div className="card"><small>ACCESS LEVEL</small><h2>Full</h2><p>Coach, Player, Parent, roster, data, and administration tools.</p></div></div>
 <div className="card adminInfoCard"><h2>Admin Testing</h2><p>Use <b>Test View</b> in the top bar to preview exactly what a Coach, Player, or Parent can see. Return to <b>Admin</b> to restore unrestricted access.</p></div></>;
}

function ParentHome({profile,sport,goals,workouts,readiness,competitions,dev,program}:{profile:Profile;sport:Sport;goals:Goal[];workouts:Workout[];readiness:ReadinessLog[];competitions:CompetitionLog[];dev:DevelopmentItem[];program:TrainingProgram|null}){
 const upcoming=workouts.filter(w=>w.sport===sport&&!w.completed&&w.date>=today()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
 const nextComp=competitions.filter(c=>c.sport===sport&&c.date>=today()).sort((a,b)=>a.date.localeCompare(b.date))[0];
 const activeGoals=goals.filter(g=>(g.status||"Active")!=="Complete");
 const avgGoal=activeGoals.length?Math.round(activeGoals.reduce((a,g)=>a+g.progress,0)/activeGoals.length):0;
 const latest=readiness[0];
 return <><div className="hero"><small>PARENT WORKSPACE</small><h1>{profile.name}</h1><p>{sport}{profile.position?" · "+profile.position:""} · Progress, schedule, and development at a glance.</p></div>
  <div className="parentNotice"><b>Parent view</b><span>This workspace is read-only. Coaching controls, roster tools, and private coach notes are hidden.</span></div>
  <div className="grid three"><div className="stat"><small>Goal Progress</small><b>{avgGoal}%</b></div><div className="stat"><small>Upcoming Workouts</small><b>{upcoming.length}</b></div><div className="stat"><small>Development Priorities</small><b>{dev.filter(d=>d.status!=="Complete").length}</b></div></div>
  <div className="grid twoCards"><div className="card"><h2>Coming Up</h2>{upcoming.length===0?<p>No upcoming workouts.</p>:upcoming.map(w=><div className="dashboardRow" key={w.id}><span className="dashDate">{w.date.slice(5)}</span><div><b>{w.name}</b><small>{w.category} · {w.minutes} min</small></div></div>)}{nextComp&&<div className="dashboardRow"><span className="dashDate">{nextComp.date.slice(5)}</span><div><b>{nextComp.opponent||nextComp.eventType}</b><small>Competition</small></div></div>}</div>
  <div className="card"><h2>Current Status</h2><p><b>Latest readiness:</b> {latest?`${latest.energy}/10 energy · ${latest.sleep}h sleep`:"No readiness entry yet."}</p><p><b>Training program:</b> {program?`${program.focus} · ${program.daysPerWeek} days/week`:"No active program."}</p></div></div>
  <div className="card"><h2>Active Goals</h2>{activeGoals.length===0?<p>No active goals.</p>:activeGoals.slice(0,5).map(g=><div className="parentProgressRow" key={g.id}><div><b>{g.title}</b><small>{g.target||g.category||"Development goal"}</small></div><strong>{g.progress}%</strong></div>)}</div></>;
}

function ParentSchedule({sport,workouts,competitions,seasonEvents}:{sport:Sport;workouts:Workout[];competitions:CompetitionLog[];seasonEvents:SeasonEvent[]}){
 const items=[
  ...workouts.filter(w=>w.sport===sport&&w.date>=today()).map(w=>({id:`w-${w.id}`,date:w.date,title:w.name,detail:`Workout · ${w.minutes} min`})),
  ...competitions.filter(c=>c.sport===sport&&c.date>=today()).map(c=>({id:`c-${c.id}`,date:c.date,title:c.opponent||c.eventType,detail:"Competition"})),
  ...seasonEvents.filter(e=>e.date>=today()).map(e=>({id:`e-${e.id}`,date:e.date,title:e.title,detail:e.eventType}))
 ].sort((a,b)=>a.date.localeCompare(b.date));
 return <><div className="hero"><small>PARENT · SCHEDULE</small><h1>Schedule</h1><p>Upcoming training, competitions, and season events.</p></div><div className="parentNotice"><b>Read-only schedule</b><span>Workout and season planning changes are managed by the athlete or coach.</span></div>
 <div className="card"><h2>Upcoming</h2>{items.length===0?<p>Nothing scheduled yet.</p>:items.slice(0,20).map(x=><div className="parentScheduleRow" key={x.id}><span>{x.date}</span><div><b>{x.title}</b><small>{x.detail}</small></div></div>)}</div></>;
}

function ParentProgress({sport,profile,goals,workouts,results,readiness,competitions}:{sport:Sport;profile:Profile;goals:Goal[];workouts:Workout[];results:Result[];readiness:ReadinessLog[];competitions:CompetitionLog[]}){
 const sportResults=results.filter(r=>r.sport===sport);
 const completeWorkouts=workouts.filter(w=>w.sport===sport&&w.completed).length;
 const goalAvg=goals.length?Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length):0;
 const recentComp=competitions.filter(c=>c.sport===sport).slice(0,5);
 const avgComp=recentComp.length?Math.round(recentComp.reduce((a,c)=>a+c.rating,0)/recentComp.length*10)/10:0;
 return <><div className="hero"><small>PARENT · PROGRESS</small><h1>Progress</h1><p>{profile.name} · A simple view of training and performance development.</p></div>
 <div className="grid three"><div className="stat"><small>Goal Progress</small><b>{goalAvg}%</b></div><div className="stat"><small>Workouts Completed</small><b>{completeWorkouts}</b></div><div className="stat"><small>Tests Logged</small><b>{sportResults.length}</b></div></div>
 <div className="grid twoCards"><div className="card"><h2>Recent Testing</h2>{sportResults.length===0?<p>No testing results yet.</p>:sportResults.slice(0,8).map(r=><div className="parentProgressRow" key={r.id}><div><b>{r.name}</b><small>{r.date}</small></div><strong>{r.value} {r.unit}</strong></div>)}</div>
 <div className="card"><h2>Competition Form</h2><div className="big">{avgComp||"—"}<small>/10 recent avg</small></div><p>{readiness.length?`Readiness entries: ${readiness.length}`:"Readiness tracking has not started yet."}</p></div></div></>;
}

function ParentDevelopment({sport,dev,program,milestones}:{sport:Sport;dev:DevelopmentItem[];program:TrainingProgram|null;milestones:Milestone[]}){
 const open=dev.filter(d=>d.status!=="Complete");
 return <><div className="hero"><small>PARENT · DEVELOPMENT</small><h1>Development</h1><p>{sport} · Current priorities, training plan, and milestones.</p></div>
 <div className="card"><h2>Development Priorities</h2>{open.length===0?<p>No open development priorities.</p>:open.map(d=><div className="parentProgressRow" key={d.id}><div><span className="tag">{d.priority||"Medium"}</span><b>{d.title}</b><small>{d.target||d.category}</small></div><strong>{d.progress||0}%</strong></div>)}</div>
 <div className="grid twoCards"><div className="card"><h2>Training Program</h2>{program?<><p><b>{program.focus}</b> · {program.daysPerWeek} days/week</p><p>{program.sessions.filter(s=>s.completed).length}/{program.sessions.length} sessions complete</p></>:<p>No active program.</p>}</div><div className="card"><h2>Milestones</h2>{milestones.length===0?<p>No milestones recorded.</p>:milestones.slice(0,6).map(m=><div className="parentMilestone" key={m.id}><b>{m.title}</b><small>{m.date} · {m.category}</small></div>)}</div></div></>;
}

function ParentCompetition({sport,profile,competitions}:{sport:Sport;profile:Profile;competitions:CompetitionLog[]}){
 const mine=competitions.filter(c=>c.sport===sport).sort((a,b)=>b.date.localeCompare(a.date));
 return <><div className="hero"><small>PARENT · COMPETITION</small><h1>Competition</h1><p>{profile.name} · Results and performance history.</p></div><div className="parentNotice"><b>Competition history</b><span>Logging and editing competition data is reserved for the athlete and coach.</span></div>
 <div className="card"><h2>Recent Competitions</h2>{mine.length===0?<p>No competitions logged yet.</p>:mine.map(c=><div className="parentCompetitionRow" key={c.id}><div><span className="tag">{c.eventType}</span><b>{c.opponent}</b><small>{c.date}{c.result?" · "+c.result:""}</small></div><strong>{c.rating}<small>/10</small></strong></div>)}</div></>;
}

function AnalyticsHub({sport,profile,goals,workouts,results,dev,program,readiness,competitions,reportNotes,setReportNotes}:{sport:Sport;profile:Profile;goals:Goal[];workouts:Workout[];results:Result[];dev:DevelopmentItem[];program:TrainingProgram|null;readiness:ReadinessLog[];competitions:CompetitionLog[];reportNotes:ReportNote[];setReportNotes:React.Dispatch<React.SetStateAction<ReportNote[]>>}){
 const [showReport,setShowReport]=useState(false);
 return <><Analytics sport={sport} results={results} goals={goals} workouts={workouts} readiness={readiness} competitions={competitions}/>
 <div className="card compactTools"><div className="sectionHead"><div><h2>Performance Report</h2><small>Exports, print, grade, and share tools</small></div><button className="featureAction" onClick={()=>setShowReport(x=>!x)}>{showReport?"Hide Report":"Open Report"}</button></div></div>
 {showReport&&<Reports sport={sport} profile={profile} goals={goals} workouts={workouts} results={results} dev={dev} program={program} readiness={readiness} competitions={competitions} reportNotes={reportNotes} setReportNotes={setReportNotes}/>}</>;
}

function CoachHub({sport,profile,goals,workouts,results,dev,program,readiness,setReadiness,competitions,coachNotes,setCoachNotes}:{sport:Sport;profile:Profile;goals:Goal[];workouts:Workout[];results:Result[];dev:DevelopmentItem[];program:TrainingProgram|null;readiness:ReadinessLog[];setReadiness:React.Dispatch<React.SetStateAction<ReadinessLog[]>>;competitions:CompetitionLog[];coachNotes:CoachNote[];setCoachNotes:React.Dispatch<React.SetStateAction<CoachNote[]>>}){
 const [mode,setMode]=useState<"Readiness"|"Plan">("Readiness");
 return <><div className="simpleSectionNav"><button className={mode==="Readiness"?"active":""} onClick={()=>setMode("Readiness")}>Readiness</button><button className={mode==="Plan"?"active":""} onClick={()=>setMode("Plan")}>Coach Plan</button></div>
 {mode==="Readiness"?<Readiness sport={sport} readiness={readiness} setReadiness={setReadiness} coachNotes={coachNotes} setCoachNotes={setCoachNotes} program={program} workouts={workouts} accountRole="Coach"/>:<SmartCoach sport={sport} profile={profile} goals={goals} workouts={workouts} results={results} dev={dev} program={program} readiness={readiness} competitions={competitions}/>}</>;
}

function DevelopmentHub({sport,profile,dev,setDev,results,goals,workouts,program,setProgram,readiness,competitions,milestones,setMilestones,setWorkouts}:{sport:Sport;profile:Profile;dev:DevelopmentItem[];setDev:React.Dispatch<React.SetStateAction<DevelopmentItem[]>>;results:Result[];goals:Goal[];workouts:Workout[];program:TrainingProgram|null;setProgram:React.Dispatch<React.SetStateAction<TrainingProgram|null>>;readiness:ReadinessLog[];competitions:CompetitionLog[];milestones:Milestone[];setMilestones:React.Dispatch<React.SetStateAction<Milestone[]>>;setWorkouts:any}){
 const [showProgram,setShowProgram]=useState(false);
 const [showMental,setShowMental]=useState(false);
 return <><Development sport={sport} profile={profile} dev={dev} setDev={setDev} results={results} goals={goals} workouts={workouts} program={program} readiness={readiness} competitions={competitions} milestones={milestones} setMilestones={setMilestones}/>
 <div className="card mentalTrainingLauncher"><div className="sectionHead"><div><span className="tag">MENTAL PERFORMANCE</span><h2>Mental Preparation & Rehearsal</h2><small>Breathing, visualization, cue words, and a simple pre-performance routine</small></div><button className="featureAction" onClick={()=>setShowMental(x=>!x)}>{showMental?"Close":"Start"}</button></div></div>
 {showMental&&<MentalTraining sport={sport} profile={profile}/>}
 <div className="card compactTools"><div className="sectionHead"><div><h2>Training Program</h2><small>Weekly program builder and sessions</small></div><button className="featureAction" onClick={()=>setShowProgram(x=>!x)}>{showProgram?"Hide Program":"Open Program"}</button></div></div>
 {showProgram&&<Program sport={sport} profile={profile} dev={dev} results={results} program={program} setProgram={setProgram} setWorkouts={setWorkouts}/>}</>;
}


function MentalTraining({sport,profile}:{sport:Sport;profile:Profile}){
 const [step,setStep]=useState(0);
 const [breathingStep,setBreathingStep]=useState<1|2>(1);
 const [scenario,setScenario]=useState("");
 const [cue,setCue]=useState("");
 const [confidence,setConfidence]=useState("7");
 const steps=["Settle","Breathe","Rehearse","Cue","Ready"];

 const next=()=>setStep(x=>Math.min(steps.length-1,x+1));
 const back=()=>setStep(x=>Math.max(0,x-1));
 const restart=()=>{setStep(0);setBreathingStep(1);setScenario("");setCue("");setConfidence("7")};

 return <div className="mentalTraining">
  <div className="mentalTop">
   <div><small>GUIDED MENTAL PREPARATION</small><h2>{profile.name} · {sport}</h2><p>Use this short routine before practice, testing, or competition.</p></div>
   <span className="mentalStepCount">{step+1}/{steps.length}</span>
  </div>

  <div className="mentalStepBar">{steps.map((x,i)=><div className={(i<step?"done ":"")+(i===step?"active":"")} key={x}><i/><small>{x}</small></div>)}</div>

  {step===0&&<div className="mentalPanel">
   <span className="mentalIcon">◎</span>
   <h2>Settle Your Attention</h2>
   <p>Plant your feet, relax your shoulders, and notice one thing you can see, hear, and feel. The goal is not to eliminate nerves; bring attention back to the next action you can control.</p>
   <div className="mentalChecklist"><span>✓ Relax jaw and shoulders</span><span>✓ Feel both feet on the ground</span><span>✓ Focus on the next controllable action</span></div>
  </div>}

  {step===1&&<div className="mentalPanel">
   <span className="mentalIcon">◌</span>
   <div className="sectionHead"><div><h2>Controlled Breathing</h2><small>Complete both techniques in order</small></div><span className="tag">STEP {breathingStep} OF 2</span></div>

   <div className="breathingSequence">
    <button className={breathingStep===1?"active":"done"} onClick={()=>setBreathingStep(1)}><small>STEP 1</small><b>Reilly Rescue Breathing</b><span>6–10 rounds</span></button>
    <button className={breathingStep===2?"active":""} onClick={()=>setBreathingStep(2)}><small>STEP 2</small><b>Box Breathing</b><span>6–10 rounds</span></button>
   </div>

   {breathingStep===1?<div className="breathingGuide reilly">
    <div><b>1</b><span>Inhale</span><small>Normally through your nose</small></div>
    <div><b>2</b><span>Exhale</span><small>Hum lightly as you breathe out</small></div>
    <div><b>3</b><span>Reset</span><small>Relax shoulders and jaw</small></div>
    <div><b>4</b><span>Repeat</span><small>Complete 6–10 comfortable rounds</small></div>
    <p>Start with Reilly Rescue Breathing. Keep each breath comfortable and controlled. Stop if you feel dizzy or uncomfortable.</p>
    <button className="primary breathingNext" onClick={()=>setBreathingStep(2)}>Complete Step 1 → Box Breathing</button>
   </div>:<div className="breathingGuide box">
    <div><b>1</b><span>Inhale</span><small>4 seconds</small></div>
    <div><b>2</b><span>Hold</span><small>4 seconds</small></div>
    <div><b>3</b><span>Exhale</span><small>4 seconds</small></div>
    <div><b>4</b><span>Hold</span><small>4 seconds</small></div>
    <p>Complete 6–10 comfortable rounds. Shorten the count if any breath hold feels strained.</p>
    <button className="breathingBack" onClick={()=>setBreathingStep(1)}>← Review Reilly Rescue Breathing</button>
   </div>}
  </div>}

  {step===2&&<div className="mentalPanel">
   <span className="mentalIcon">◇</span>
   <h2>Mental Rehearsal</h2>
   <p>Picture one realistic performance moment from your own point of view. Rehearse the response you want rather than trying to imagine a perfect outcome.</p>
   <label>Situation to rehearse<input value={scenario} onChange={e=>setScenario(e.target.value)} placeholder="e.g. First shift, faceoff, at-bat, free throw, opening whistle"/></label>
   <div className="mentalChecklist"><span>1. See the environment clearly.</span><span>2. Feel your body calm and ready.</span><span>3. Rehearse your first correct action.</span><span>4. Rehearse recovering quickly from one mistake.</span></div>
  </div>}

  {step===3&&<div className="mentalPanel">
   <span className="mentalIcon">✦</span>
   <h2>Choose Your Cue</h2>
   <p>Use one short phrase that directs attention toward the behavior you want.</p>
   <div className="cueChoices">{["Quick feet","Next play","Strong and calm","See it early","Attack the space","Compete"].map(x=><button className={cue===x?"active":""} key={x} onClick={()=>setCue(x)}>{x}</button>)}</div>
   <label>Or create your own<input value={cue} onChange={e=>setCue(e.target.value)} placeholder="Short, positive, actionable"/></label>
  </div>}

  {step===4&&<div className="mentalPanel mentalReady">
   <span className="mentalIcon">✓</span>
   <h2>Ready to Perform</h2>
   <div className="mentalSummary"><span><small>BREATHING</small><b>Reilly Rescue → Box</b></span><span><small>SCENARIO</small><b>{scenario||"General performance"}</b></span><span><small>CUE</small><b>{cue||"Next play"}</b></span></div>
   <label>How ready do you feel?<select value={confidence} onChange={e=>setConfidence(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option value={x} key={x}>{x}/10</option>)}</select></label>
   <p className="mentalFinish">Take one final comfortable breath, say your cue once, then shift attention to the first task you can control.</p>
  </div>}

  <div className="mentalActions"><button disabled={step===0} onClick={back}>Back</button>{step<steps.length-1?<button className="primary" onClick={next}>Next: {steps[step+1]}</button>:<button className="primary" onClick={restart}>Run Again</button>}</div>
 </div>;
}

function Home({sport,goals,workouts,results,profile,setProfile,readiness,competitions,dev,program,weeklyReviews,setWeeklyReviews,testTargets,workspaceRole,onboardingDismissed,setOnboardingDismissed,setTab,editProfileRequest}:{sport:Sport;goals:Goal[];workouts:Workout[];results:Result[];profile:Profile;setProfile:any;readiness:ReadinessLog[];competitions:CompetitionLog[];dev:DevelopmentItem[];program:TrainingProgram|null;weeklyReviews:WeeklyReview[];setWeeklyReviews:React.Dispatch<React.SetStateAction<WeeklyReview[]>>;testTargets:TestTarget[];workspaceRole:WorkspaceRole;onboardingDismissed:boolean;setOnboardingDismissed:React.Dispatch<React.SetStateAction<boolean>>;setTab:React.Dispatch<React.SetStateAction<Tab>>;editProfileRequest:number}){
 const gs=goals.length?Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length):0;
 const ws=workouts.filter(x=>x.sport===sport),done=ws.filter(x=>x.completed).length;
 const rs=results.filter(x=>x.sport===sport);
 const baseScore=pct(gs*.4+(ws.length?done/ws.length*30:0)+(rs.length?30:0));

 const todayDate=today();
 const upcoming=ws.filter(w=>!w.completed&&w.date>=todayDate).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
 const sportComps=competitions.filter(c=>c.sport===sport&&c.date>=todayDate).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,2);
 const openDev=dev.filter(d=>d.status!=="Complete").sort((a,b)=>({High:0,Medium:1,Low:2}[a.priority||"Medium"])-({High:0,Medium:1,Low:2}[b.priority||"Medium"])).slice(0,2);

 const recentReadiness=readiness.slice(0,7);
 const avgReadiness=recentReadiness.length?Math.round(recentReadiness.reduce((a,r)=>a+Math.max(0,Math.min(100,Math.round(Math.min(10,r.sleep/8*10)*2.5+(10-Math.min(10,r.soreness))*2.5+Math.min(10,r.energy)*2.5+(10-Math.min(10,r.stress))*2.5))),0)/recentReadiness.length):0;

 const completedThisWeek=ws.filter(w=>w.completed&&new Date(w.date).getTime()>=Date.now()-7*86400000).length;
 const testingThisWeek=rs.filter(r=>new Date(r.date).getTime()>=Date.now()-7*86400000).length;
 const programPct=program?.sessions.length?Math.round(program.sessions.filter(s=>s.completed).length/program.sessions.length*100):0;
 const competitionAvg=competitions.filter(c=>c.sport===sport).length?Math.round(competitions.filter(c=>c.sport===sport).reduce((a,c)=>a+c.rating,0)/competitions.filter(c=>c.sport===sport).length*10):0;
 const score=Math.round((baseScore*.45)+(avgReadiness||70)*.2+(competitionAvg||70)*.15+(program?programPct*.2:70*.2));

 const [wins,setWins]=useState(""),[challenges,setChallenges]=useState(""),[focus,setFocus]=useState(""),[rating,setRating]=useState("8");
 const weekStart=(()=>{const d=new Date();const day=d.getDay();d.setDate(d.getDate()-((day+6)%7));return d.toISOString().slice(0,10)})();
 const currentReview=weeklyReviews.find(r=>r.weekStart===weekStart);

 const saveReview=()=>{
  const item:WeeklyReview={id:currentReview?.id||Date.now(),weekStart,wins:wins.trim(),challenges:challenges.trim(),focus:focus.trim(),rating:Number(rating)||0};
  setWeeklyReviews(x=>[item,...x.filter(r=>r.weekStart!==weekStart)]);
 };

 useEffect(()=>{
  if(currentReview){setWins(currentReview.wins);setChallenges(currentReview.challenges);setFocus(currentReview.focus);setRating(String(currentReview.rating))}
 },[currentReview?.id]);

 const streak=(()=>{
  const dates=[...new Set(ws.filter(w=>w.completed).map(w=>w.date))].sort((a,b)=>b.localeCompare(a));
  if(!dates.length)return 0;
  let count=0;let cursor=new Date(todayDate);
  for(let i=0;i<14;i++){
    const d=cursor.toISOString().slice(0,10);
    if(dates.includes(d)){count++;cursor.setDate(cursor.getDate()-1)}
    else if(i===0){cursor.setDate(cursor.getDate()-1)}
    else break;
  }
  return count;
 })();

 const readinessLabel=avgReadiness>=80?"Ready":avgReadiness>=60?"Moderate":avgReadiness>0?"Recover":"No check-in";
 const nextAction=openDev[0]?.title||upcoming[0]?.name||"Log readiness and keep building.";
 const activeGoals=goals.filter(g=>(g.status||"Active")!=="Complete");
 const nearGoals=activeGoals.filter(g=>g.progress>=70).length;
 const recentResults=rs.filter(r=>new Date(r.date).getTime()>=Date.now()-30*86400000).length;
 const recentComps=competitions.filter(c=>c.sport===sport&&new Date(c.date).getTime()>=Date.now()-30*86400000);
 const avgRecentComp=recentComps.length?Math.round(recentComps.reduce((a,c)=>a+c.rating,0)/recentComps.length*10)/10:0;
 
 const profileChecks=[
  Boolean(profile.name&&profile.name!=="Athlete"),
  Boolean(profile.position),
  Boolean(profile.team),
  Boolean(profile.height),
  Boolean(profile.weight),
  Boolean(profile.handedness)
 ];
 const profileCompletion=Math.round(profileChecks.filter(Boolean).length/profileChecks.length*100);
 const setupSteps=[
  {label:"Complete athlete profile",done:profileCompletion===100,tab:"Home" as Tab,target:"profile"},
  {label:"Create a goal",done:goals.length>0,tab:"Goals" as Tab,target:"goals"},
  {label:"Log a performance test",done:rs.length>0,tab:"Testing" as Tab,target:"testing"},
  {label:"Schedule a workout",done:ws.length>0,tab:"Calendar" as Tab,target:"calendar"},
  {label:"Complete readiness check-in",done:readiness.length>0,tab:"Coach" as Tab,target:"readiness"}
 ];
 const setupPct=Math.round(setupSteps.filter(x=>x.done).length/setupSteps.length*100);
 useEffect(()=>{
  if(editProfileRequest<=0)return;
  window.setTimeout(()=>{
   const el=document.getElementById("setup-profile");
   if(el){el.scrollIntoView({behavior:"smooth",block:"center"});(el as HTMLElement).focus({preventScroll:true});}
  },140);
 },[editProfileRequest]);

 const goToSetupItem=(tab:Tab,target:string)=>{
  setTab(tab);
  window.setTimeout(()=>{
   const el=document.getElementById(`setup-${target}`);
   if(el){el.scrollIntoView({behavior:"smooth",block:"center"});(el as HTMLElement).focus({preventScroll:true});}
  },180);
 };

 const reminderItems:ReminderItem[]=[
  ...ws.filter(w=>!w.completed&&w.date>=todayDate).slice(0,4).map(w=>({id:`w-${w.id}`,title:w.name,detail:`${w.minutes} min · ${w.category}`,date:w.date,kind:"Workout" as const,priority:"Normal" as const})),
  ...competitions.filter(c=>c.sport===sport&&c.date>=todayDate).slice(0,3).map(c=>({id:`c-${c.id}`,title:c.opponent||c.eventType,detail:"Upcoming competition",date:c.date,kind:"Competition" as const,priority:"High" as const})),
  ...testTargets.filter(t=>t.sport===sport&&t.retestDate&&t.retestDate>=todayDate).slice(0,3).map(t=>({id:`t-${t.id}`,title:"Performance retest",detail:t.target?`Target ${t.target}`:"Retest scheduled",date:t.retestDate,kind:"Retest" as const,priority:"Normal" as const})),
  ...goals.filter(g=>(g.status||"Active")!=="Complete"&&g.deadline&&g.deadline>=todayDate).slice(0,3).map(g=>({id:`g-${g.id}`,title:g.title,detail:"Goal deadline",date:g.deadline||todayDate,kind:"Goal" as const,priority:g.progress<50?"High" as const:"Normal" as const}))
 ].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,6);

 const roleMessage=workspaceRole==="Coach"
  ?"Coach view emphasizes priorities, readiness, and athlete development decisions."
  :workspaceRole==="Parent"
  ?"Parent view emphasizes progress, schedule, recovery, and positive development."
  :"Athlete view emphasizes today's actions, progress, and performance feedback.";
 
 const releaseChecks:ReleaseCheck[]=[
  {label:"Profile complete",done:profileCompletion===100,detail:"Name, position, team, height, and weight"},
  {label:"Goal created",done:goals.length>0,detail:"At least one measurable development goal"},
  {label:"Testing baseline",done:rs.length>0,detail:"At least one performance test"},
  {label:"Training history",done:ws.some(w=>w.completed),detail:"At least one completed workout"},
  {label:"Readiness history",done:readiness.length>0,detail:"At least one readiness check-in"},
  {label:"Competition history",done:competitions.some(c=>c.sport===sport),detail:"At least one logged competition"}
 ];
 const releaseReadyPct=Math.round(releaseChecks.filter(x=>x.done).length/releaseChecks.length*100);

 const activityItems:ActivityItem[]=[
  ...ws.filter(w=>w.completed).slice(0,8).map(w=>({id:`w-${w.id}`,date:w.date,kind:"Workout" as const,title:w.name,detail:`${w.minutes} min · ${w.category}`})),
  ...rs.slice(0,8).map(r=>({id:`t-${r.id}`,date:r.date,kind:"Testing" as const,title:r.name,detail:`${r.value} ${r.unit}`})),
  ...competitions.filter(c=>c.sport===sport).slice(0,8).map(c=>({id:`c-${c.id}`,date:c.date,kind:"Competition" as const,title:c.opponent||c.eventType,detail:c.result||`${c.rating}/10`})),
  ...goals.filter(g=>(g.status||"Active")==="Complete").slice(0,5).map(g=>({id:`g-${g.id}`,date:g.deadline||todayDate,kind:"Goal" as const,title:g.title,detail:"Goal completed"}))
 ].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,10);
const roleActions=workspaceRole==="Coach"
  ?[
    {title:"Review readiness",detail:`${avgReadiness||"No"} readiness score`},
    {title:"Set development priority",detail:openDev[0]?.title||"No open objective"},
    {title:"Check competition form",detail:avgRecentComp?`${avgRecentComp}/10 recent rating`:"Log competition data"}
   ]
  :workspaceRole==="Parent"
  ?[
    {title:"Review schedule",detail:`${upcoming.length+sportComps.length} upcoming items`},
    {title:"Celebrate progress",detail:nearGoals?`${nearGoals} goal${nearGoals===1?"":"s"} near completion`:"Keep building consistency"},
    {title:"Support recovery",detail:avgReadiness?`${avgReadiness}/100 readiness`:"Encourage daily check-ins"}
   ]
  :[
    {title:"Today's focus",detail:nextAction},
    {title:"Training status",detail:avgReadiness>=75?"Ready for quality work":"Monitor recovery"},
    {title:"Next milestone",detail:nearGoals?`${nearGoals} goal${nearGoals===1?"":"s"} close`:"Build the next target"}
   ];

const signals:PerformanceSignal[]=[
  {label:"Readiness",value:avgReadiness?`${avgReadiness}/100`:"Need data",detail:avgReadiness>=75?"Recovery supports quality training.":avgReadiness?"Watch recovery before adding load.":"Complete daily check-ins.",tone:avgReadiness>=75?"good":avgReadiness?"watch":"neutral"},
  {label:"Goal Momentum",value:nearGoals?`${nearGoals} close`:`${gs}% avg`,detail:nearGoals?"Goals are approaching completion.":"Keep weekly actions tied to goals.",tone:nearGoals?"good":"neutral"},
  {label:"Testing Activity",value:`${recentResults} / 30d`,detail:recentResults>=2?"Good recent testing coverage.":"Retest key measures to confirm trends.",tone:recentResults>=2?"good":"watch"},
  {label:"Competition Form",value:avgRecentComp?`${avgRecentComp}/10`:"Need data",detail:avgRecentComp>=7?"Recent competition form is strong.":avgRecentComp?"Use game notes to set the next focus.":"Log games to build competition trends.",tone:avgRecentComp>=7?"good":avgRecentComp?"watch":"neutral"}
 ];


 return <><div className="activeAthleteBanner"><small>ACTIVE ATHLETE</small><b>{profile.name}</b><span>{sport}{profile.position?" · "+profile.position:""}</span></div>

 <div className="hero homeHero phase30Hero"><div className="heroCopy"><small>PHASE 66–67 · V1 COMMAND CENTER</small><h1>{profile.name}</h1><p>{sport}{profile.position?" · "+profile.position:""}{profile.team?" · "+profile.team:""} · {profile.season}</p><div className="heroBadges"><span>{score}/100 Performance</span><span>{avgReadiness||"—"} Readiness</span><span>{streak} Day Streak</span></div></div><div className="heroScoreOrb"><strong>{score}</strong><small>PERFORMANCE</small></div></div>

 {!onboardingDismissed&&setupPct<100&&<div className="onboardingCard"><div className="sectionHead"><div><small>PHASE 56 · ONBOARDING</small><h2>Finish Your Setup</h2></div><button aria-label="Dismiss onboarding" onClick={()=>setOnboardingDismissed(true)}>×</button></div><div className="setupMeter"><div className="progress"><i style={{width:`${setupPct}%`}}/></div><b>{setupPct}%</b></div><div className="setupSteps">{setupSteps.map(x=>x.done?<span className="done" key={x.label}>✓ {x.label}</span>:<button type="button" className="setupStepLink" key={x.label} onClick={()=>goToSetupItem(x.tab,x.target)}><span>○ {x.label}</span><b>Open →</b></button>)}</div></div>}

 
 <div className="card profileEditor setupAnchor" id="setup-profile" tabIndex={-1}>
  <div className="sectionHead"><div><small>ATHLETE PROFILE</small><h2>Edit Profile</h2></div><span className="tag">{profileCompletion}% complete</span></div>
  <div className="profileGrid">
   <label>Name<input value={profile.name||""} onChange={e=>setProfile((x:Profile)=>({...x,name:e.target.value}))}/></label>
   <label>Position<select value={positions[sport].includes(profile.position)?profile.position:""} onChange={e=>setProfile((x:Profile)=>({...x,position:e.target.value}))}><option value="">Select position</option>{positions[sport].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
   <label>Team<input value={profile.team||""} onChange={e=>setProfile((x:Profile)=>({...x,team:e.target.value}))}/></label>
   <label>Height<input value={profile.height||""} onChange={e=>setProfile((x:Profile)=>({...x,height:e.target.value}))} placeholder="e.g. 5'10&quot;"/></label>
   <label>Weight<input value={profile.weight||""} onChange={e=>setProfile((x:Profile)=>({...x,weight:e.target.value}))} placeholder="e.g. 165 lb"/></label><label>Handedness<select value={profile.handedness||"Right"} onChange={e=>setProfile((x:Profile)=>({...x,handedness:e.target.value as "Right"|"Left"}))}><option value="Right">Right</option><option value="Left">Left</option></select></label>
  </div>
  <small className="profileHint">Complete all six fields to finish Athlete Profile setup.</small>
 </div>

 <div className="roleBrief"><span className="tag">PHASE 61 · {workspaceRole.toUpperCase()} VIEW</span><p>{roleMessage}</p></div>
 <div className="roleActionGrid">{roleActions.map(x=><div key={x.title}><small>{x.title}</small><b>{x.detail}</b></div>)}</div>

 <div className="commandGrid">
  <div className="commandCard accent"><small>READINESS</small><div className="ring" style={{"--ring":`${avgReadiness||0}%`} as React.CSSProperties}><b>{avgReadiness||"—"}</b></div><span>{readinessLabel}</span></div>
  <div className="commandCard"><small>GOALS</small><b>{gs}%</b><div className="progress"><i style={{width:`${gs}%`}}/></div><span>{goals.length} tracked</span></div>
  <div className="commandCard"><small>PROGRAM</small><b>{program?programPct+"%":"—"}</b><div className="progress"><i style={{width:`${programPct}%`}}/></div><span>{program?"weekly plan":"no active plan"}</span></div>
  <div className="commandCard"><small>NEXT FOCUS</small><b className="focusText">{nextAction}</b><span>{openDev[0]?"development priority":"next action"}</span></div>
 </div>

 <div className="card profileCard"><div className="sectionHead"><h2>Athlete Profile</h2><span className="tag">{sport}</span></div><div className="two"><label>Name<input value={profile.name??""} onChange={e=>setProfile((x:Profile)=>({...x,name:e.target.value}))}/></label><label>Position<select value={positions[sport].includes(profile.position)?profile.position:""} onChange={e=>setProfile((x:Profile)=>({...x,position:e.target.value}))}><option value="">Select position</option>{positions[sport].map(x=><option key={x}>{x}</option>)}</select></label><label>Team<input value={profile.team??""} onChange={e=>setProfile((x:Profile)=>({...x,team:e.target.value}))}/></label><label>Season<input value={profile.season??""} onChange={e=>setProfile((x:Profile)=>({...x,season:e.target.value}))}/></label><label>Height<input value={profile.height??""} onChange={e=>setProfile((x:Profile)=>({...x,height:e.target.value}))} placeholder="e.g. 5'10&quot;"/></label><label>Weight<input inputMode="decimal" value={profile.weight??""} onChange={e=>setProfile((x:Profile)=>({...x,weight:e.target.value}))} placeholder="e.g. 165 lb"/></label><label>Handedness<select value={profile.handedness??"Right"} onChange={e=>setProfile((x:Profile)=>({...x,handedness:e.target.value as "Right"|"Left"}))}><option>Right</option><option>Left</option></select></label></div></div>

 
 <details className="simpleDisclosure advancedTools"><summary><div><b>V1 Readiness</b><small>Setup and release-readiness checklist</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="sectionDivider"><span><i/>V1 Readiness</span></div>
 <div className="card releaseReadiness"><div className="sectionHead"><h2>Version 1.0 Readiness</h2><span className="tag">PHASE 66</span></div><div className="releaseMeter"><strong>{releaseReadyPct}%</strong><div className="progress"><i style={{width:`${releaseReadyPct}%`}}/></div></div><div className="releaseChecks">{releaseChecks.map(x=><div className={x.done?"done":""} key={x.label}><span>{x.done?"✓":"○"}</span><div><b>{x.label}</b><small>{x.detail}</small></div></div>)}</div></div>
 </div></details>
 <details className="simpleDisclosure advancedTools"><summary><div><b>Performance Intelligence</b><small>Readiness, goals, testing, and competition signals</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="sectionDivider"><span><i/>Performance Intelligence</span></div>
 <div className="signalGrid">{signals.map(x=><div className={"signalCard "+x.tone} key={x.label}><small>{x.label}</small><b>{x.value}</b><p>{x.detail}</p></div>)}</div>
 </div></details>
 <div className="sectionDivider"><span><i/>This Week</span></div>
 <div className="grid three">
  <div className="stat"><small>Workouts Done</small><b>{completedThisWeek}</b></div>
  <div className="stat"><small>Tests Logged</small><b>{testingThisWeek}</b></div>
  <div className="stat"><small>Competition Score</small><b>{competitionAvg||"—"}</b></div>
 </div>

 <div className="grid twoCards">
  <div className="card"><div className="sectionHead"><h2>Coming Up</h2><span className="tag">Next 3</span></div>{upcoming.length===0&&sportComps.length===0?<p>No upcoming workouts or competitions.</p>:<>{upcoming.map(w=><div className="dashboardRow" key={w.id}><span className="dashDate">{w.date.slice(5)}</span><div><b>{w.name}</b><small>{w.category} · {w.minutes} min</small></div></div>)}{sportComps.map(c=><div className="dashboardRow" key={c.id}><span className="dashDate">{c.date.slice(5)}</span><div><b>{c.opponent||c.eventType}</b><small>Competition{c.result?" · "+c.result:""}</small></div></div>)}</>}</div>
  <div className="card"><div className="sectionHead"><h2>Development Focus</h2><span className="tag">{openDev.length} priority</span></div>{openDev.length?openDev.map(d=><div className="focusCard" key={d.id}><span className="tag">{d.priority||"Medium"} · {d.category}</span><b>{d.title}</b><small>{d.target||"Keep progressing this objective."}</small></div>):<p>No open development objectives.</p>}</div>
 </div>

 
 <div className="sectionDivider"><span><i/>Reminder Center</span></div>
 <div className="card"><div className="sectionHead"><h2>Upcoming Priorities</h2><span className="tag">PHASE 58</span></div>{reminderItems.length===0?<p>No upcoming reminders. Your schedule is clear.</p>:<div className="reminderList">{reminderItems.map(r=><div className={"reminderRow "+r.priority.toLowerCase()} key={r.id}><span className="reminderDate">{r.date.slice(5)}</span><div><b>{r.title}</b><small>{r.kind} · {r.detail}</small></div><em>{r.priority}</em></div>)}</div>}</div>

 
 <details className="simpleDisclosure advancedTools"><summary><div><b>Recent Activity</b><small>Workout, testing, competition, and goal timeline</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="sectionDivider"><span><i/>Recent Activity</span></div>
 <div className="card"><div className="sectionHead"><h2>Athlete Timeline</h2><span className="tag">PHASE 67</span></div>{activityItems.length===0?<p>Your recent workouts, tests, competitions, and completed goals will appear here.</p>:<div className="activityTimeline">{activityItems.map(a=><div className="activityItem" key={a.id}><span className={"activityDot "+a.kind.toLowerCase()}/><div><b>{a.title}</b><small>{a.kind} · {a.detail}</small></div><time>{a.date}</time></div>)}</div>}</div>

 </div></details>
 <div className="sectionDivider"><span><i/>Weekly Review</span></div>
 <div className="card weeklyReview"><div className="sectionHead"><h2>Weekly Review</h2><span>{weekStart}</span></div><div className="two"><label>Biggest Win<input value={wins} onChange={e=>setWins(e.target.value)} placeholder="What went well?"/></label><label>Main Challenge<input value={challenges} onChange={e=>setChallenges(e.target.value)} placeholder="What held you back?"/></label><label>Next Week Focus<input value={focus} onChange={e=>setFocus(e.target.value)} placeholder="One priority for next week"/></label><label>Week Rating<select value={rating} onChange={e=>setRating(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}/10</option>)}</select></label></div><button className="primary" onClick={saveReview}>{currentReview?"Update Weekly Review":"Save Weekly Review"}</button></div>

 <div className="card"><h2>Recent Weekly Reviews</h2>{weeklyReviews.length===0?<p>No weekly reviews yet.</p>:weeklyReviews.slice(0,5).map(r=><div className="reviewRow" key={r.id}><div className="reviewRating">{r.rating}<small>/10</small></div><div><b>{r.weekStart}</b><small>{r.wins?"Win: "+r.wins:""}{r.focus?" · Next: "+r.focus:""}</small></div></div>)}</div>
 </>;
}

function Goals({goals,setGoals}:{goals:Goal[];setGoals:any}){
 const [title,setTitle]=useState(""),[type,setType]=useState<Goal["type"]>("Short-term"),[category,setCategory]=useState("Performance"),[deadline,setDeadline]=useState(""),[target,setTarget]=useState(""),[notes,setNotes]=useState("");
 const active=goals.filter(g=>(g.status||"Active")!=="Complete"),complete=goals.filter(g=>(g.status||"Active")==="Complete");
 const avg=goals.length?Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length):0;

 const add=()=>{
  if(!title.trim())return;
  setGoals((g:Goal[])=>[{id:Date.now(),title:title.trim(),progress:0,type,category,deadline,target:target.trim(),status:"Active",notes:notes.trim()},...g]);
  setTitle("");setDeadline("");setTarget("");setNotes("");
 };

 const update=(id:number,patch:Partial<Goal>)=>setGoals((x:Goal[])=>x.map(g=>g.id===id?{...g,...patch}:g));
 const remove=(id:number)=>setGoals((x:Goal[])=>x.filter(g=>g.id!==id));

 
 const activeGoalRows=goals.filter(x=>(x.status||"Active")!=="Complete");
 const completedGoalRows=goals.filter(x=>x.progress>=100||(x.status||"")==="Complete");
 const overdueGoals=activeGoalRows.filter(x=>x.deadline&&x.deadline<today());
 const closeGoals=activeGoalRows.filter(x=>x.progress>=70);
 const goalMomentum=goals.length?Math.round(goals.reduce((a,x)=>a+x.progress,0)/goals.length):0;

 const measurableGoals=goals.filter(x=>Boolean(x.target)).length;
 const datedGoals=goals.filter(x=>Boolean(x.deadline)).length;
 const goalQuality=goals.length?Math.round(((measurableGoals/goals.length)*50)+((datedGoals/goals.length)*50)):0;
return <><div className="hero"><small>PHASE 52 · GOAL INTELLIGENCE 2.0</small><h1>Goals</h1><p>Turn outcomes into measurable, time-bound development targets.</p></div>
 <details className="simpleDisclosure advancedTools"><summary><div><b>Goal Insights</b><small>Quality, momentum, completion, and overdue analysis</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="goalQuality"><div><small>GOAL QUALITY</small><b>{goalQuality}%</b><span>measurable + time-bound</span></div><div className="progress"><i style={{width:`${goalQuality}%`}}/></div></div>
 <div className="goalIntelligence">
  <div><small>GOAL MOMENTUM</small><b>{goalMomentum}%</b><span>average progress</span></div>
  <div><small>CLOSE TO DONE</small><b>{closeGoals.length}</b><span>70%+ progress</span></div>
  <div><small>COMPLETED</small><b>{completedGoalRows.length}</b><span>total goals</span></div>
  <div><small>OVERDUE</small><b>{overdueGoals.length}</b><span>needs review</span></div>
 </div>
 

 <div className="grid three">
  <div className="stat"><small>Active Goals</small><b>{active.length}</b></div>
  <div className="stat"><small>Completed</small><b>{complete.length}</b></div>
  <div className="stat"><small>Average Progress</small><b>{avg}%</b></div>
 </div>

 </div></details>
 <div className="card setupAnchor" id="setup-goals" tabIndex={-1}><h2>Create Goal</h2><div className="two">
  <label>Goal name<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Improve 10-yard sprint"/></label>
  <label>Goal type<select value={type} onChange={e=>setType(e.target.value as Goal["type"])}><option>Short-term</option><option>Long-term</option></select></label>
  <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option>Performance</option><option>Training</option><option>Skill</option><option>Strength</option><option>Speed</option><option>Conditioning</option><option>Competition</option><option>Recovery</option><option>Personal</option></select></label>
  <label>Deadline<input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}/></label>
 </div>
 <label>Target / success criteria<input value={target} onChange={e=>setTarget(e.target.value)} placeholder="e.g. Run 10-yard sprint in 1.80 sec"/></label>
 <label>Notes<input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Why this matters or how you will achieve it"/></label>
 <button className="primary" onClick={add}>Add Goal</button></div>

 <div className="card"><h2>Active Goals</h2>{active.length===0?<p>No active goals.</p>:active.map(g=><div className="goalCard" key={g.id}>
  <div className="row"><div><span className="tag">{g.category||"Performance"}</span><h2>{g.title}</h2><small>{g.type}{g.deadline?" · Due "+g.deadline:""}{g.target?" · Target: "+g.target:""}</small></div><strong>{g.progress}%</strong></div>
  <input type="range" min="0" max="100" value={g.progress} onChange={e=>update(g.id,{progress:+e.target.value})}/>
  <div className="progress"><i style={{width:`${g.progress}%`}}/></div>
  {g.notes&&<p>{g.notes}</p>}
  <div className="goalActions"><button onClick={()=>update(g.id,{status:"Paused"})}>Pause</button><button className="primary" onClick={()=>update(g.id,{status:"Complete",progress:100})}>Mark Complete</button><button onClick={()=>remove(g.id)}>Delete</button></div>
 </div>)}</div>

 {goals.some(g=>(g.status||"Active")==="Paused")&&<div className="card"><h2>Paused Goals</h2>{goals.filter(g=>(g.status||"Active")==="Paused").map(g=><div className="goalCard compact" key={g.id}><div><b>{g.title}</b><small>{g.category||"Performance"} · {g.progress}%</small></div><button onClick={()=>update(g.id,{status:"Active"})}>Resume</button></div>)}</div>}

 <details className="simpleDisclosure advancedTools"><summary><div><b>Completed Goals</b><small>Past goal history</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="card"><h2>Completed Goals</h2>{complete.length===0?<p>No completed goals yet.</p>:complete.slice(0,10).map(g=><div className="goalCard compact doneGoal" key={g.id}><div><b>{g.title}</b><small>{g.category||"Performance"}{g.deadline?" · "+g.deadline:""}</small></div><span>✓ Complete</span></div>)}</div></div></details>
 </>;
}

function Calendar({sport,workouts,setWorkouts,profile,seasonEvents,setSeasonEvents,trainingBlocks,setTrainingBlocks,competitions}:{sport:Sport;workouts:Workout[];setWorkouts:any;profile:Profile;seasonEvents:SeasonEvent[];setSeasonEvents:React.Dispatch<React.SetStateAction<SeasonEvent[]>>;trainingBlocks:TrainingBlock[];setTrainingBlocks:React.Dispatch<React.SetStateAction<TrainingBlock[]>>;competitions:CompetitionLog[]}){
 const [date,setDate]=useState(today()),[name,setName]=useState("Sport Workout"),[cat,setCat]=useState("Conditioning"),[minutes,setMinutes]=useState("45"),[intensity,setIntensity]=useState<"Easy"|"Moderate"|"Hard">("Moderate"),[focusNote,setFocusNote]=useState("");
 const [eventDate,setEventDate]=useState(today()),[eventTitle,setEventTitle]=useState(""),[eventType,setEventType]=useState<SeasonEvent["eventType"]>("Game"),[priority,setPriority]=useState<SeasonEvent["priority"]>("Normal"),[eventNotes,setEventNotes]=useState("");
 const [blockName,setBlockName]=useState(""),[startDate,setStartDate]=useState(today()),[endDate,setEndDate]=useState(today()),[focus,setFocus]=useState("Speed"),[target,setTarget]=useState("");

 const rows=workouts.filter(w=>w.sport===sport).sort((a,b)=>a.date.localeCompare(b.date));
 const addWorkout=()=>{
   const item:Workout={id:Date.now(),date,name,category:cat,minutes:+minutes,completed:false,sport,intensity,focus:focusNote.trim()};
   setWorkouts((x:Workout[])=>[item,...x]);
   setFocusNote("");
 };
 const completeWorkout=(id:number,rpe:number,notes:string)=>setWorkouts((x:Workout[])=>x.map(a=>a.id===id?{...a,completed:true,rpe,notes}:a));
 const reopenWorkout=(id:number)=>setWorkouts((x:Workout[])=>x.map(a=>a.id===id?{...a,completed:false}:a));

 const addEvent=()=>{if(!eventTitle.trim())return;setSeasonEvents(x=>[...x,{id:Date.now(),date:eventDate,title:eventTitle.trim(),eventType,priority,notes:eventNotes.trim()}].sort((a,b)=>a.date.localeCompare(b.date)));setEventTitle("");setEventNotes("")};
 const addBlock=()=>{if(!blockName.trim())return;setTrainingBlocks(x=>[...x,{id:Date.now(),name:blockName.trim(),startDate,endDate,focus,target:target.trim(),completed:false}].sort((a,b)=>a.startDate.localeCompare(b.startDate)));setBlockName("");setTarget("")};

 const upcoming=seasonEvents.filter(e=>e.date>=today()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,8);
 const sportComps=competitions.filter(c=>c.sport===sport);
 const nextCompetition=[...upcoming.filter(e=>["Game","Tournament"].includes(e.eventType)).map(e=>({date:e.date,title:e.title})),...sportComps.filter(c=>c.date>=today()).map(c=>({date:c.date,title:c.opponent||c.eventType}))].sort((a,b)=>a.date.localeCompare(b.date))[0];
 const next14=new Date();next14.setDate(next14.getDate()+14);const next14s=next14.toISOString().slice(0,10);
 const plannedWorkouts=workouts.filter(w=>w.sport===sport&&w.date>=today()&&w.date<=next14s).length;
 const highEvents=seasonEvents.filter(e=>e.date>=today()&&e.date<=next14s&&e.priority==="High").length;
 const loadStatus=highEvents>=3||plannedWorkouts>=8?"High":highEvents>=1||plannedWorkouts>=5?"Moderate":"Manageable";
 const weekLoad:DailyLoad[]=Array.from({length:7},(_,i)=>{
   const d=new Date();d.setDate(d.getDate()-6+i);const ds=d.toISOString().slice(0,10);
   const dayWorkouts=rows.filter(w=>w.date===ds&&w.completed);
   const dayLoad=Math.round(dayWorkouts.reduce((a,w)=>a+w.minutes*(w.rpe||({Easy:4,Moderate:6,Hard:8}[w.intensity||"Moderate"])),0));
   const events=seasonEvents.filter(e=>e.date===ds).length+sportComps.filter(c=>c.date===ds).length;
   return {date:ds,label:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()],load:dayLoad,workouts:dayWorkouts.length,events};
 });
 const maxDailyLoad=Math.max(1,...weekLoad.map(d=>d.load));
 const peakLoadDay=weekLoad.slice().sort((a,b)=>b.load-a.load)[0];
 const activeDays=weekLoad.filter(d=>d.workouts>0).length;
 const loadBalance=activeDays>=4?"Balanced":activeDays>=2?"Building":"Low Frequency";
 const recoveryDays=7-activeDays;



 const last7=rows.filter(w=>w.completed&&new Date(w.date).getTime()>=Date.now()-7*86400000);
 const sessionLoad=(w:Workout)=>w.minutes*(w.rpe||({Easy:4,Moderate:6,Hard:8}[w.intensity||"Moderate"]));
 const sevenDayLoad=Math.round(last7.reduce((a,w)=>a+sessionLoad(w),0));
 const avgRpe=last7.filter(w=>w.rpe).length?Math.round(last7.filter(w=>w.rpe).reduce((a,w)=>a+(w.rpe||0),0)/last7.filter(w=>w.rpe).length*10)/10:0;
 const completedMinutes=last7.reduce((a,w)=>a+w.minutes,0);

 return <><div className="hero phase31Hero"><small>PHASE 47 · TRAINING INTELLIGENCE</small><h1>Calendar</h1><p>{profile.name} · {sport} · Schedule, complete, and measure training load in one place.</p></div>

 <div className="grid three">
  <div className="stat"><small>7-Day Load</small><b>{sevenDayLoad}</b><span>AU</span></div>
  <div className="stat"><small>7-Day Minutes</small><b>{completedMinutes}</b></div>
  <div className="stat"><small>Average RPE</small><b>{avgRpe||"—"}</b><span>/10</span></div>
 </div>
 
 <div className="trainingIntel">
  <div><small>ACTIVE DAYS</small><b>{activeDays}</b><span>/7 days</span></div>
  <div><small>RECOVERY DAYS</small><b>{recoveryDays}</b><span>this week</span></div>
  <div><small>LOAD BALANCE</small><b>{loadBalance}</b><span>weekly rhythm</span></div>
  <div><small>PEAK DAY</small><b>{peakLoadDay?.label||"—"}</b><span>{peakLoadDay?.load||0} AU</span></div>
 </div>
 <div className="card"><div className="sectionHead"><h2>7-Day Training Rhythm</h2><span className="tag">load + events</span></div><div className="loadStrip">{weekLoad.map(d=><div className="loadDay" key={d.date}><small>{d.label}</small><div className="loadTrack"><i style={{height:`${Math.max(6,d.load/maxDailyLoad*100)}%`}}/></div><b>{d.load}</b>{d.events>0&&<span>{d.events} event{d.events>1?"s":""}</span>}</div>)}</div></div>

 <div className="card setupAnchor" id="setup-calendar" tabIndex={-1}><h2>Schedule Workout</h2><div className="calendarTop"><button onClick={()=>{const d=new Date(date);d.setDate(d.getDate()-1);setDate(d.toISOString().slice(0,10))}}>‹</button><input type="date" value={date} onChange={e=>setDate(e.target.value)}/><button onClick={()=>{const d=new Date(date);d.setDate(d.getDate()+1);setDate(d.toISOString().slice(0,10))}}>›</button></div>
 <label>Workout name<input value={name} onChange={e=>setName(e.target.value)}/></label>
 <div className="two"><label>Workout category<select value={cat} onChange={e=>setCat(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label>Duration<select value={minutes} onChange={e=>setMinutes(e.target.value)}>{["15","30","45","60","75","90","120"].map(x=><option key={x} value={x}>{x} minutes</option>)}</select></label><label>Target Intensity<select value={intensity} onChange={e=>setIntensity(e.target.value as "Easy"|"Moderate"|"Hard")}><option>Easy</option><option>Moderate</option><option>Hard</option></select></label><label>Session Focus<input value={focusNote} onChange={e=>setFocusNote(e.target.value)} placeholder="e.g. acceleration + edge work"/></label></div>
 <button className="primary" onClick={addWorkout}>Schedule Workout</button></div>

 <div className="card"><h2>Workout Log</h2>{rows.length===0?<p>No workouts yet.</p>:rows.map(w=><WorkoutLogCard key={w.id} workout={w} onComplete={completeWorkout} onReopen={reopenWorkout}/>)}</div>

 <div className="grid three">
  <div className="stat"><small>Upcoming Events</small><b>{upcoming.length}</b></div>
  <div className="stat"><small>14-Day Workouts</small><b>{plannedWorkouts}</b></div>
  <div className="stat"><small>Load Outlook</small><b>{loadStatus}</b></div>
 </div>

 <details className="simpleDisclosure advancedTools"><summary><div><b>Season & Training Insights</b><small>Season events, training blocks, load guidance, and competition planning</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="card"><h2>Season Planning</h2><div className="two">
  <label>Date<input type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)}/></label>
  <label>Event Type<select value={eventType} onChange={e=>setEventType(e.target.value as SeasonEvent["eventType"])}><option>Game</option><option>Tournament</option><option>Testing</option><option>Training Block</option><option>Recovery</option><option>Other</option></select></label>
  <label>Event<input value={eventTitle} onChange={e=>setEventTitle(e.target.value)} placeholder="e.g. Regional tournament"/></label>
  <label>Priority<select value={priority} onChange={e=>setPriority(e.target.value as SeasonEvent["priority"])}><option>Normal</option><option>High</option></select></label>
 </div><label>Notes<input value={eventNotes} onChange={e=>setEventNotes(e.target.value)} placeholder="Travel, taper, testing prep, etc."/></label><button className="primary" onClick={addEvent}>Add Season Event</button></div>

 <div className="card"><h2>Training Block</h2><div className="two">
  <label>Block Name<input value={blockName} onChange={e=>setBlockName(e.target.value)} placeholder="e.g. Preseason Speed Block"/></label>
  <label>Focus<select value={focus} onChange={e=>setFocus(e.target.value)}><option>Speed</option><option>Strength</option><option>Power</option><option>Skill</option><option>Conditioning</option><option>Recovery</option><option>Competition Prep</option></select></label>
  <label>Start Date<input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/></label>
  <label>End Date<input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}/></label>
 </div><label>Block Target<input value={target} onChange={e=>setTarget(e.target.value)} placeholder="e.g. Improve 10-yard sprint by 3%"/></label><button className="primary" onClick={addBlock}>Add Training Block</button></div>

 <div className="grid twoCards">
  <div className="card"><h2>Upcoming Season Events</h2>{upcoming.length===0?<p>No season events scheduled.</p>:upcoming.map(e=><div className="plannerRow" key={e.id}><div><span className="tag">{e.eventType}</span><b>{e.title}</b><small>{e.date}{e.priority==="High"?" · High Priority":""}{e.notes?" · "+e.notes:""}</small></div><button onClick={()=>setSeasonEvents(x=>x.filter(a=>a.id!==e.id))}>Delete</button></div>)}</div>
  <div className="card"><h2>Next Competition</h2>{nextCompetition?<><b>{nextCompetition.title}</b><p>{nextCompetition.date}</p><p>{loadStatus==="High"?"Training load is already high. Consider reducing volume before this event.":loadStatus==="Moderate"?"Maintain quality and watch readiness as the event approaches.":"There is room to build training quality before the event."}</p></>:<p>No upcoming competition found.</p>}</div>
 </div>

 <div className="card"><h2>Training Blocks</h2>{trainingBlocks.length===0?<p>No training blocks created yet.</p>:trainingBlocks.map(b=><div className="blockRow" key={b.id}><div><span className="tag">{b.focus}</span><b>{b.name}</b><small>{b.startDate} → {b.endDate}{b.target?" · "+b.target:""}</small></div><div><button onClick={()=>setTrainingBlocks(x=>x.map(a=>a.id===b.id?{...a,completed:!a.completed}:a))}>{b.completed?"✓ Complete":"Mark Complete"}</button><button onClick={()=>setTrainingBlocks(x=>x.filter(a=>a.id!==b.id))}>Delete</button></div></div>)}</div>

 <div className="card"><h2>Training Load Guidance</h2><div className="coachChecklist"><span>✓ RPE is how hard the workout felt on a 1–10 scale.</span><span>✓ Session load = minutes × RPE.</span><span>✓ Large load spikes plus low readiness are a signal to reduce volume.</span><span>✓ Keep hard days hard and easy days truly easy.</span></div></div>
</div></details>
 </>;
}

function WorkoutLogCard({workout,onComplete,onReopen}:{workout:Workout;onComplete:(id:number,rpe:number,notes:string)=>void;onReopen:(id:number)=>void}){
 const [rpe,setRpe]=useState(String(workout.rpe||6)),[notes,setNotes]=useState(workout.notes||"");
 const load=workout.completed?workout.minutes*(workout.rpe||6):0;
 return <div className={"workoutLogCard "+(workout.completed?"done":"")}><div className="workoutLogTop"><div><span className="tag">{workout.category}</span><h2>{workout.name}</h2><small>{workout.date} · {workout.minutes} min · {workout.intensity||"Moderate"}{workout.focus?" · "+workout.focus:""}</small></div>{workout.completed&&<div className="loadBadge"><b>{load}</b><small>load</small></div>}</div>
 {workout.completed?<div className="completedWorkout"><span>RPE {workout.rpe||"—"}/10</span>{workout.notes&&<p>{workout.notes}</p>}<button onClick={()=>onReopen(workout.id)}>Reopen</button></div>:<div className="completeWorkoutForm"><label>Session RPE<select value={rpe} onChange={e=>setRpe(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}/10</option>)}</select></label><label>Session Notes<input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What went well? Any soreness or changes?"/></label><button className="primary" onClick={()=>onComplete(workout.id,Number(rpe),notes.trim())}>Complete Workout</button></div>}</div>
}

function Testing({sport,library,custom,setCustom,results,setResults,testTargets,setTestTargets}:{sport:Sport;library:TestDef[];custom:CustomTest[];setCustom:any;results:Result[];setResults:any;testTargets:TestTarget[];setTestTargets:React.Dispatch<React.SetStateAction<TestTarget[]>>}){
 const [id,setId]=useState(library[0]?.id||""),[category,setCategory]=useState(""),[unit,setUnit]=useState(""),[value,setValue]=useState(""),[open,setOpen]=useState(false);
 const [name,setName]=useState(""),[newCat,setNewCat]=useState("Speed"),[newUnit,setNewUnit]=useState("sec"),[lower,setLower]=useState(true);
 const [target,setTarget]=useState(""),[retestDate,setRetestDate]=useState(""),[targetNotes,setTargetNotes]=useState("");

 useEffect(()=>{if(!library.some(x=>x.id===id))setId(library[0]?.id||"")},[sport,custom]);
 const t=library.find(x=>x.id===id), rows=results.filter(x=>x.sport===sport);
 useEffect(()=>{if(t){setCategory(t.category);setUnit(t.unit);const saved=testTargets.find(x=>x.testId===t.id&&x.sport===sport);setTarget(saved?.target||"");setRetestDate(saved?.retestDate||"");setTargetNotes(saved?.notes||"")}},[id,sport,testTargets.length]);

 const sameTest=t?rows.filter(r=>r.testId===t.id).sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id):[];
 const baseline=sameTest[0]?.value;
 const current=sameTest[sameTest.length-1]?.value;
 const best=t&&sameTest.length?sameTest.reduce((best,r)=>t.lowerBetter?Math.min(best,r.value):Math.max(best,r.value),sameTest[0].value):undefined;
 const imp=t&&sameTest.length>1&&baseline!==undefined&&current!==undefined?improvement(baseline,current,t.lowerBetter):0;
 const isPR=t&&current!==undefined&&best!==undefined&&current===best;
 const protocol=t?testProtocols[t.name]:undefined;

 const save=()=>{
  if(t&&value.trim()&&!isNaN(Number(value))){
   const n=Number(value);
   setResults((r:Result[])=>[{id:Date.now(),testId:t.id,name:t.name,category,unit,value:n,date:today(),sport},...r]);
   setValue("");
  }
 };

 const saveTarget=()=>{
  if(!t)return;
  const item:TestTarget={id:`${sport}-${t.id}`,testId:t.id,sport,target:target.trim(),retestDate,notes:targetNotes.trim()};
  setTestTargets(x=>[item,...x.filter(a=>!(a.testId===t.id&&a.sport===sport))]);
 };

 
 const sportHistory=results.filter(r=>r.sport===sport);
 const currentTarget=t?testTargets.find(x=>x.testId===t.id&&x.sport===sport):undefined;
 const numericTarget=currentTarget?.target&&!isNaN(Number(currentTarget.target))?Number(currentTarget.target):undefined;
 const targetProgress=(()=>{
   if(!t||numericTarget===undefined||current===undefined||baseline===undefined)return 0;
   const total=t.lowerBetter?baseline-numericTarget:numericTarget-baseline;
   const moved=t.lowerBetter?baseline-current:current-baseline;
   if(total===0)return current===numericTarget?100:0;
   return Math.max(0,Math.min(100,Math.round(moved/total*100)));
 })();
 const benchmarkBands:BenchmarkBand[]=[
  {label:"Baseline",min:baseline,max:baseline},
  {label:"Current",min:current,max:current},
  {label:"Target",min:numericTarget,max:numericTarget}
 ].filter(x=>x.min!==undefined);

 const prRows=[...new Map(sportHistory.map(r=>[r.testId,r])).values()].map(g=>{
  const rows=sportHistory.filter(r=>r.testId===g.testId).sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id);
  const def=definitions(sport).find(x=>x.id===g.testId)||({lowerBetter:g.unit==="sec"} as TestDef);
  const best=rows.reduce((best,r)=>def.lowerBetter?Math.min(best,r.value):Math.max(best,r.value),rows[0]?.value||0);
  const latest=rows[rows.length-1];
  const baseline=rows[0];
  const imp=rows.length>1?improvement(baseline.value,latest.value,def.lowerBetter):0;
  return {id:g.testId,name:g.name,unit:g.unit,best,latest:latest?.value||0,lastDate:latest?.date||"",count:rows.length,imp};
 }).sort((a,b)=>b.count-a.count);
 const retestDue=prRows.filter(x=>x.lastDate&&new Date(x.lastDate).getTime()<Date.now()-30*86400000).length;
 const prs=prRows.filter(x=>x.count>1&&x.latest===x.best).length;
return <><div className="hero"><small>PHASE 51 · TESTING TARGETS 2.0</small><h1>Performance Testing</h1><p>{sport} · Standardized testing, targets, PRs, and retest planning.</p></div>
 <div className="grid three">
  <div className="stat"><small>Personal Bests</small><b>{prs}</b></div>
  <div className="stat"><small>Tests Tracked</small><b>{prRows.length}</b></div>
  <div className="stat"><small>Retest Due</small><b>{retestDue}</b></div>
 </div>
 <div className="card"><div className="sectionHead"><h2>Personal Best Board</h2><span className="tag">Testing Intelligence</span></div>{prRows.length===0?<p>Log test results to build your personal-best board.</p>:<div className="prBoard">{prRows.slice(0,8).map(x=><div className="prRow" key={x.id}><div><b>{x.name}</b><small>{x.count} result{x.count===1?"":"s"} · Last {x.lastDate}</small></div><strong>{x.best} <small>{x.unit}</small></strong><span className={x.imp>=0?"good":"bad"}>{x.count>1?(x.imp>=0?"+":"")+x.imp+"%":"New"}</span></div>)}</div>}</div>
 

 <div className="card setupAnchor" id="setup-testing" tabIndex={-1}>
 <label>Test Name<select value={id} onChange={e=>e.target.value==="__custom__"?setOpen(true):setId(e.target.value)}>{library.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}<option value="__custom__">＋ Create Custom Test</option></select></label>
 <div className="two"><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label>Unit of Measure<select value={unit} onChange={e=>setUnit(e.target.value)}>{units.map(x=><option key={x}>{x}</option>)}</select></label></div>

 {t&&<div className="testSummary">
   <div><small>Baseline</small><b>{baseline!==undefined?`${baseline} ${unit}`:"—"}</b></div>
   <div><small>Current</small><b>{current!==undefined?`${current} ${unit}`:"—"}</b></div>
   <div><small>Best</small><b>{best!==undefined?`${best} ${unit}`:"—"}</b></div>
   <div><small>Improvement</small><b className={imp>=0?"good":"bad"}>{sameTest.length>1?(imp>=0?"+":"")+imp+"%":"—"}</b></div>
 </div>}
 {isPR&&<div className="prBanner">★ Personal Record — latest result matches your best.</div>}

 {protocol&&<div className="protocolCard"><div className="sectionHead"><h2>Test Protocol</h2><span className="tag">Standardize It</span></div><p><b>Setup:</b> {protocol.setup}</p><p><b>How:</b> {protocol.instructions}</p><p><b>Consistency:</b> {protocol.quality}</p></div>}

 {t&&<p>{t.lowerBetter?"Lower is better":"Higher is better"}</p>}
 <label>Result<input inputMode="decimal" value={value} onChange={e=>setValue(e.target.value)} placeholder={unit?`Enter result in ${unit}`:"Enter result"}/></label><button className="primary" disabled={!t} onClick={save}>Save Result</button></div>

 <div className="card"><h2>Target & Retest Plan</h2><div className="two"><label>Target Result<input value={target} onChange={e=>setTarget(e.target.value)} placeholder={unit?`e.g. ${unit}`:"Target result"}/></label><label>Next Retest<input type="date" value={retestDate} onChange={e=>setRetestDate(e.target.value)}/></label></div><label>Notes<input value={targetNotes} onChange={e=>setTargetNotes(e.target.value)} placeholder="Testing conditions, goal, or coaching note"/></label><button onClick={saveTarget}>Save Test Plan</button>{retestDate&&<p className="retestCallout">Next retest: <b>{retestDate}</b>{target?` · Target ${target} ${unit}`:""}</p>}</div>

 
 <details className="simpleDisclosure advancedTools"><summary><div><b>Testing Details</b><small>Target progress and full test history</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="card"><div className="sectionHead"><h2>Target Progress</h2><span className="tag">{numericTarget!==undefined?`${targetProgress}% complete`:"Set a target"}</span></div>
 {numericTarget===undefined?<p>Save a numeric target to see progress from baseline to target.</p>:<><div className="targetProgressHero"><strong>{targetProgress}%</strong><div><small>BASELINE</small><b>{baseline??"—"} {unit}</b></div><div><small>CURRENT</small><b>{current??"—"} {unit}</b></div><div><small>TARGET</small><b>{numericTarget} {unit}</b></div></div><div className="progress"><i style={{width:`${targetProgress}%`}}/></div></>}
 </div>
 <div className="card"><h2>Test History</h2>{sameTest.length===0?<p>No results for this test yet.</p>:sameTest.slice().reverse().map((r,i)=><div className="testHistoryRow" key={r.id}><div><b>{r.value} {r.unit}</b><small>{r.date} · {r.category}</small></div><span className={best===r.value?"prChip":""}>{best===r.value?"PR":"Result"}</span></div>)}</div>

 </div></details>
 {open&&<div className="overlay"><div className="modal"><div className="sectionHead"><h2>Create Custom Test</h2><button onClick={()=>setOpen(false)}>×</button></div><label>Test name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Shot speed"/></label><label>Category<select value={newCat} onChange={e=>setNewCat(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label>Unit of Measure<select value={newUnit} onChange={e=>setNewUnit(e.target.value)}>{units.map(x=><option key={x}>{x}</option>)}</select></label><label>Better result<select value={lower?"lower":"higher"} onChange={e=>setLower(e.target.value==="lower")}><option value="lower">Lower is better</option><option value="higher">Higher is better</option></select></label><button className="primary" onClick={()=>{if(name.trim()){const x={id:`custom-${Date.now()}`,name:name.trim(),category:newCat,unit:newUnit,lowerBetter:lower,sport};setCustom((c:CustomTest[])=>[...c,x]);setId(x.id);setOpen(false);setName("")}}}>Save Custom Test</button></div></div>}</>
}

function Analytics({sport,results,goals,workouts,readiness,competitions}:{sport:Sport;results:Result[];goals:Goal[];workouts:Workout[];readiness:ReadinessLog[];competitions:CompetitionLog[]}){
 const [range,setRange]=useState("All"),[categoryFilter,setCategoryFilter]=useState("All");
 const cutoff=range==="30 Days"?Date.now()-30*86400000:range==="90 Days"?Date.now()-90*86400000:range==="1 Year"?Date.now()-365*86400000:0;
 const rows=results.filter(r=>r.sport===sport&&new Date(r.date).getTime()>=cutoff).filter(r=>categoryFilter==="All"||r.category===categoryFilter).sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id);
 const groups=[...new Map(rows.map(r=>[r.testId,r])).values()];
 const categoriesAvailable=["All",...new Set(results.filter(r=>r.sport===sport).map(r=>r.category))];

 const summaries=groups.map(g=>{
  const r=rows.filter(x=>x.testId===g.testId).sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id);
  const def=definitions(sport).find(x=>x.id===g.testId)||({lowerBetter:g.unit==="sec"} as TestDef);
  const baseline=r[0]?.value??0,current=r[r.length-1]?.value??0;
  const best=r.length?r.reduce((a,b)=>def.lowerBetter?Math.min(a,b.value):Math.max(a,b.value),baseline):0;
  const imp=r.length>1?improvement(baseline,current,def.lowerBetter):0;
  return {g,r,def,baseline,current,best,imp};
 });

 const improving=summaries.filter(x=>x.r.length>1&&x.imp>0).sort((a,b)=>b.imp-a.imp);
 const declining=summaries.filter(x=>x.r.length>1&&x.imp<0).sort((a,b)=>a.imp-b.imp);
 const avgImprovement=improving.length?Math.round(improving.reduce((a,x)=>a+x.imp,0)/improving.length*10)/10:0;

 const sportWorkouts=workouts.filter(w=>w.sport===sport);
 const completed=sportWorkouts.filter(w=>w.completed).length;
 const consistency=sportWorkouts.length?Math.round(completed/sportWorkouts.length*100):0;
 const goalProgress=goals.length?Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length):0;

 const recentReadiness=readiness.slice(0,7);
 const readinessScore=recentReadiness.length?Math.round(recentReadiness.reduce((a,r)=>a+Math.max(0,Math.min(100,Math.round(Math.min(10,r.sleep/8*10)*2.5+(10-Math.min(10,r.soreness))*2.5+Math.min(10,r.energy)*2.5+(10-Math.min(10,r.stress))*2.5))),0)/recentReadiness.length):0;
 const sportComps=competitions.filter(c=>c.sport===sport);
 const competitionScore=sportComps.length?Math.round(sportComps.reduce((a,c)=>a+c.rating,0)/sportComps.length*10):0;
 const testingScore=Math.min(100,summaries.length*15+(improving.length?25:0));
 const scorecard=[
   {label:"Testing",value:testingScore},
   {label:"Training",value:consistency},
   {label:"Goals",value:goalProgress},
   {label:"Readiness",value:readinessScore||0},
   {label:"Competition",value:competitionScore}
 ];
 const overallScore=Math.round(scorecard.reduce((a,x)=>a+x.value,0)/scorecard.length);
 const seasonMetrics:SeasonMetric[]=[
  {label:"Goal Progress",value:goalProgress,display:`${goalProgress}%`},
  {label:"Training Consistency",value:consistency,display:`${consistency}%`},
  {label:"Readiness",value:readinessScore||0,display:readinessScore?`${readinessScore}`:"—"},
  {label:"Competition",value:competitionScore,display:sportComps.length?`${competitionScore}`:"—"}
 ];
 const seasonMomentum=Math.round(seasonMetrics.reduce((a,m)=>a+m.value,0)/seasonMetrics.length);


 return <><div className="hero"><small>PHASE 44 · SEASON PROGRESS</small><h1>Analytics</h1><p>{sport} · Trends, scorecard, improvement, consistency, and attention areas in one performance view.</p></div>

 <div className="performanceScorecard">
  <div className="scorecardOverall"><small>OVERALL PERFORMANCE</small><strong>{overallScore}</strong><span>/100</span></div>
  <div className="scorecardBars">{scorecard.map(x=><div key={x.label}><div className="row"><small>{x.label}</small><b>{x.value}</b></div><div className="progress"><i style={{width:`${x.value}%`}}/></div></div>)}</div>
 </div>
 <div className="card seasonProgress"><div className="sectionHead"><h2>Season Progress</h2><span className="tag">{seasonMomentum>=75?"Strong Momentum":seasonMomentum>=55?"Building":"Foundation"}</span></div><div className="seasonMetricGrid">{seasonMetrics.map(m=><div key={m.label}><div className="row"><small>{m.label}</small><b>{m.display}</b></div><div className="progress"><i style={{width:`${Math.max(0,Math.min(100,m.value))}%`}}/></div></div>)}</div></div>

 <div className="analyticsToolbar">
  <div className="filters">{["All","30 Days","90 Days","1 Year"].map(x=><button className={range===x?"sel":""} key={x} onClick={()=>setRange(x)}>{x}</button>)}</div>
  <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>{categoriesAvailable.map(x=><option key={x}>{x}</option>)}</select>
 </div>

 <div className="grid three">
  <div className="stat"><small>Tests Tracked</small><b>{summaries.length}</b></div>
  <div className="stat"><small>Avg Positive Trend</small><b>{avgImprovement?`+${avgImprovement}%`:"—"}</b></div>
  <div className="stat"><small>Training Consistency</small><b>{consistency}%</b></div>
 </div>

 <div className="grid twoCards">
  <div className="card insightPanel"><h2>Top Improvement</h2>{improving[0]?<><b className="big good">+{improving[0].imp}%</b><p>{improving[0].g.name}</p><small>Baseline {improving[0].baseline} {improving[0].g.unit} → Current {improving[0].current} {improving[0].g.unit}</small></>:<p>No positive repeated-test trend yet.</p>}</div>
  <div className="card insightPanel"><h2>Needs Attention</h2>{declining[0]?<><b className="big bad">{declining[0].imp}%</b><p>{declining[0].g.name}</p><small>Baseline {declining[0].baseline} {declining[0].g.unit} → Current {declining[0].current} {declining[0].g.unit}</small></>:<p>No declining repeated-test trend detected.</p>}</div>
 </div>

 <div className="card"><div className="sectionHead"><h2>Performance Trends</h2><button onClick={()=>exportResults(rows)}>Export Results CSV</button></div>
 {summaries.length===0?<p>No matching test results.</p>:summaries.map(({g,r,def,baseline,current,best,imp})=><div className="trend" key={g.testId}>
   <div className="row"><span><b>{g.name}</b><small>{g.category} · {r.length} results</small></span><strong className={imp>=0?"good":"bad"}>{r.length>1?(imp>=0?"+":"")+imp+"%":"New"}</strong></div>
   <TrendChart values={r.map(x=>x.value)} lower={def.lowerBetter}/>
   <div className="trendAxis"><span>Baseline · {r[0]?.date}</span><span>Current · {r[r.length-1]?.date}</span></div>
   <div className="analyticsMetrics"><span><small>Baseline</small><b>{baseline} {g.unit}</b></span><span><small>Current</small><b>{current} {g.unit}</b></span><span><small>Best</small><b>{best} {g.unit}</b></span></div>
 </div>)}</div>

 <CompareTests sport={sport} results={rows}/>

 <div className="grid twoCards">
  <div className="card"><h2>Goal Progress</h2><div className="big">{goalProgress}%</div><div className="progress"><i style={{width:`${goalProgress}%`}}/></div><p>{goals.length} goals tracked.</p></div>
  <div className="card"><h2>Training Consistency</h2><div className="big">{consistency}%</div><div className="progress"><i style={{width:`${consistency}%`}}/></div><p>{completed}/{sportWorkouts.length} workouts complete.</p></div>
 </div>
 </>;
}

function CompareTests({sport,results}:{sport:Sport;results:Result[]}){
 const tests=[...new Map(results.map(r=>[r.testId,r])).values()];
 const [a,setA]=useState(tests[0]?.testId||""),[b,setB]=useState(tests[1]?.testId||"");
 useEffect(()=>{if(!tests.some(x=>x.testId===a))setA(tests[0]?.testId||"");if(!tests.some(x=>x.testId===b))setB(tests[1]?.testId||"")},[results.length]);
 const series=(id:string)=>results.filter(r=>r.testId===id).sort((x,y)=>x.date.localeCompare(y.date)||x.id-y.id);
 const render=(id:string)=>{const r=series(id),t=r[r.length-1];if(!t)return <p>No result.</p>;const first=r[0],def=definitions(sport).find(x=>x.id===id)||({lowerBetter:t.unit==="sec"} as TestDef),imp=r.length>1?improvement(first.value,t.value,def.lowerBetter):0;return <div className="compareValue"><b>{t.name}</b><strong>{t.value} {t.unit}</strong><small>{r.length>1?`${imp>=0?"+":""}${imp}% from baseline`:"One result logged"}</small></div>};
 return <div className="card"><h2>Compare Tests</h2><div className="two"><label>Test A<select value={a} onChange={e=>setA(e.target.value)}>{tests.map(t=><option key={t.testId} value={t.testId}>{t.name}</option>)}</select></label><label>Test B<select value={b} onChange={e=>setB(e.target.value)}>{tests.map(t=><option key={t.testId} value={t.testId}>{t.name}</option>)}</select></label></div><div className="compareGrid">{render(a)}{render(b)}</div></div>
}
function exportResults(rows:Result[]){
 const header="Date,Test,Category,Unit,Value,Sport";
 const body=rows.map(r=>[r.date,r.name,r.category,r.unit,r.value,r.sport].map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
 const blob=new Blob([header+"\n"+body],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="athlete-performance-results.csv";a.click();URL.revokeObjectURL(url);
}
function Development({sport,profile,dev,setDev,results,goals,workouts,program,readiness,competitions,milestones,setMilestones}:{sport:Sport;profile:Profile;dev:DevelopmentItem[];setDev:React.Dispatch<React.SetStateAction<DevelopmentItem[]>>;results:Result[];goals:Goal[];workouts:Workout[];program:TrainingProgram|null;readiness:ReadinessLog[];competitions:CompetitionLog[];milestones:Milestone[];setMilestones:React.Dispatch<React.SetStateAction<Milestone[]>>}){
 const [title,setTitle]=useState(""),[category,setCategory]=useState("Skill"),[target,setTarget]=useState(""),[dueDate,setDueDate]=useState(""),[priority,setPriority]=useState<"High"|"Medium"|"Low">("Medium"),[linkedGoalId,setLinkedGoalId]=useState(""),[devNotes,setDevNotes]=useState("");
 const [milestoneTitle,setMilestoneTitle]=useState(""),[milestoneDetail,setMilestoneDetail]=useState(""),[milestoneCategory,setMilestoneCategory]=useState("Personal");

 const add=()=>{if(!title.trim())return;setDev(x=>[...x,{id:Date.now(),title:title.trim(),category,target,dueDate,status:"Not Started",priority,progress:0,linkedGoalId:linkedGoalId?Number(linkedGoalId):undefined,notes:devNotes.trim()}]);setTitle("");setTarget("");setDueDate("");setLinkedGoalId("");setDevNotes("")};
 const update=(id:number,patch:Partial<DevelopmentItem>)=>setDev(x=>x.map(i=>i.id===id?{...i,...patch}:i));
 const remove=(id:number)=>setDev(x=>x.filter(i=>i.id!==id));
 const complete=dev.filter(i=>i.status==="Complete").length;

 const sportResults=results.filter(r=>r.sport===sport);
 const sportWorkouts=workouts.filter(w=>w.sport===sport);
 const sportComps=competitions.filter(c=>c.sport===sport);
 const completedGoals=goals.filter(g=>g.progress>=100).length;
 const completedWorkouts=sportWorkouts.filter(w=>w.completed).length;
 const repeatedTests=[...new Map(sportResults.map(r=>[r.testId,r])).keys()].filter(id=>sportResults.filter(r=>r.testId===id).length>=2).length;
 const readinessStreak=readiness.slice(0,7).length;
 const programComplete=program?.sessions.filter(s=>s.completed).length||0;
 const avgProgress=dev.length?Math.round(dev.reduce((a,d)=>a+(d.status==="Complete"?100:(d.progress||0)),0)/dev.length):0;
 const highPriorityOpen=dev.filter(d=>d.status!=="Complete"&&(d.priority||"Medium")==="High").length;

 const achievements:Achievement[]=[
  {id:"first-test",title:"First Test Logged",description:"Record your first performance test.",category:"Testing",earned:sportResults.length>=1,progress:Math.min(100,sportResults.length*100)},
  {id:"five-tests",title:"Testing Habit",description:"Log 5 performance test results.",category:"Testing",earned:sportResults.length>=5,progress:Math.min(100,sportResults.length/5*100)},
  {id:"trend-maker",title:"Trend Builder",description:"Create 3 repeated-test trends.",category:"Analytics",earned:repeatedTests>=3,progress:Math.min(100,repeatedTests/3*100)},
  {id:"five-workouts",title:"Training Streak",description:"Complete 5 workouts.",category:"Training",earned:completedWorkouts>=5,progress:Math.min(100,completedWorkouts/5*100)},
  {id:"ten-workouts",title:"Consistency Builder",description:"Complete 10 workouts.",category:"Training",earned:completedWorkouts>=10,progress:Math.min(100,completedWorkouts/10*100)},
  {id:"goal-complete",title:"Goal Getter",description:"Complete your first goal.",category:"Goals",earned:completedGoals>=1,progress:Math.min(100,completedGoals*100)},
  {id:"dev-complete",title:"Development Win",description:"Complete a development objective.",category:"Development",earned:complete>=1,progress:Math.min(100,complete*100)},
  {id:"program-five",title:"Program Progress",description:"Complete 5 weekly-program sessions.",category:"Program",earned:programComplete>=5,progress:Math.min(100,programComplete/5*100)},
  {id:"readiness-week",title:"Recovery Awareness",description:"Log readiness 7 times.",category:"Readiness",earned:readinessStreak>=7,progress:Math.min(100,readinessStreak/7*100)},
  {id:"first-competition",title:"Competition Logged",description:"Log your first game or competition.",category:"Competition",earned:sportComps.length>=1,progress:Math.min(100,sportComps.length*100)},
  {id:"five-competitions",title:"Season Builder",description:"Log 5 competitions.",category:"Competition",earned:sportComps.length>=5,progress:Math.min(100,sportComps.length/5*100)}
 ];
 const earned=achievements.filter(a=>a.earned).length;

 const addMilestone=()=>{
  if(!milestoneTitle.trim())return;
  setMilestones(x=>[{id:Date.now(),date:today(),title:milestoneTitle.trim(),detail:milestoneDetail.trim(),category:milestoneCategory},...x]);
  setMilestoneTitle("");setMilestoneDetail("");
 };

 return <><div className="hero"><small>PHASE 27 · DEVELOPMENT 2.0</small><h1>Development</h1><p>{sport} · Prioritized objectives, measurable progress, achievements, and training program.</p></div>

 <div className="grid three">
  <div className="stat"><small>Plan Progress</small><b>{avgProgress}%</b></div>
  <div className="stat"><small>Open Objectives</small><b>{dev.filter(d=>d.status!=="Complete").length}</b></div>
  <div className="stat"><small>High Priority</small><b>{highPriorityOpen}</b></div>
 </div>

 <div className="card"><h2>Add Development Objective</h2><div className="two">
  <label>Objective<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Improve first-step quickness"/></label>
  <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option>Skill</option><option>Strength</option><option>Speed</option><option>Conditioning</option><option>Technique</option><option>Game Performance</option></select></label>
  <label>Target<input value={target} onChange={e=>setTarget(e.target.value)} placeholder="e.g. 5% improvement"/></label>
  <label>Target Date<input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}/></label>
  <label>Priority<select value={priority} onChange={e=>setPriority(e.target.value as "High"|"Medium"|"Low")}><option>High</option><option>Medium</option><option>Low</option></select></label>
  <label>Linked Goal<select value={linkedGoalId} onChange={e=>setLinkedGoalId(e.target.value)}><option value="">No linked goal</option>{goals.filter(g=>(g.status||"Active")!=="Complete").map(g=><option value={g.id} key={g.id}>{g.title}</option>)}</select></label>
 </div><label>Development Notes<input value={devNotes} onChange={e=>setDevNotes(e.target.value)} placeholder="Coaching cues, technique notes, or plan"/></label><button onClick={add}>Add Objective</button></div>

 <div className="card"><h2>Objectives</h2>{dev.length===0?<p>No development objectives yet.</p>:dev.map(i=>{const linked=goals.find(g=>g.id===i.linkedGoalId);const progress=i.status==="Complete"?100:(i.progress||0);return <div className={"developmentCard "+(i.priority||"Medium").toLowerCase()} key={i.id}>
  <div className="sectionHead"><div><span className="tag">{i.priority||"Medium"} Priority</span><h2>{i.title}</h2><small>{i.category}{i.target?" · "+i.target:""}{i.dueDate?" · Due "+i.dueDate:""}</small></div><strong>{progress}%</strong></div>
  {linked&&<p className="linkedGoal">Linked goal: <b>{linked.title}</b></p>}
  {i.notes&&<p>{i.notes}</p>}
  <input type="range" min="0" max="100" value={progress} disabled={i.status==="Complete"} onChange={e=>update(i.id,{progress:+e.target.value,status:+e.target.value>0?"In Progress":"Not Started"})}/>
  <div className="progress"><i style={{width:`${progress}%`}}/></div>
  <div className="goalActions"><button onClick={()=>update(i.id,{status:"In Progress"})}>In Progress</button><button className="primary" onClick={()=>update(i.id,{status:"Complete",progress:100})}>Complete</button><button onClick={()=>remove(i.id)}>Delete</button></div>
 </div>})}</div>

 <details className="simpleDisclosure advancedTools"><summary><div><b>More Development Tools</b><small>Achievements, milestones, and performance snapshot</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="card"><div className="sectionHead"><h2>Achievements</h2><span>{earned}/{achievements.length} earned</span></div><div className="achievementGrid">{achievements.map(a=><div className={"achievement "+(a.earned?"earned":"")} key={a.id}><div className="achievementIcon">{a.earned?"✓":"○"}</div><div><b>{a.title}</b><small>{a.category} · {a.description}</small><div className="progress"><i style={{width:`${Math.round(a.progress)}%`}}/></div><small>{Math.round(a.progress)}%</small></div></div>)}</div></div>

 <div className="card"><h2>Add Personal Milestone</h2><div className="two"><label>Milestone<input value={milestoneTitle} onChange={e=>setMilestoneTitle(e.target.value)} placeholder="e.g. Made varsity roster"/></label><label>Category<select value={milestoneCategory} onChange={e=>setMilestoneCategory(e.target.value)}><option>Personal</option><option>Team</option><option>Testing</option><option>Training</option><option>Competition</option><option>Development</option></select></label></div><label>Details<input value={milestoneDetail} onChange={e=>setMilestoneDetail(e.target.value)} placeholder="Why this matters"/></label><button className="primary" onClick={addMilestone}>Save Milestone</button></div>

 <div className="card"><h2>Milestone Timeline</h2>{milestones.length===0?<p>No personal milestones saved yet.</p>:milestones.map(m=><div className="timelineRow" key={m.id}><div className="timelineDot"/><div><span className="tag">{m.category}</span><b>{m.title}</b><small>{m.date}{m.detail?" · "+m.detail:""}</small></div><button onClick={()=>setMilestones(x=>x.filter(a=>a.id!==m.id))}>Delete</button></div>)}</div>

 <div className="card"><h2>Performance Snapshot</h2><div className="quickStats"><span><b>{results.length}</b><small>Results logged</small></span><span><b>{new Set(results.map(r=>r.testId)).size}</b><small>Tests tracked</small></span><span><b>{avgProgress}%</b><small>Plan completion</small></span></div></div></div></details></>
}

const sportProgramTemplates:Record<Sport,{speed:string[];strength:string[];skill:string[];conditioning:string[]}>={
 Baseball:{speed:["Acceleration sprints","Lateral reaction starts","Base-running burst work"],strength:["Rotational medicine-ball power","Single-leg strength","Upper-body push/pull"],skill:["Throwing mechanics","Fielding footwork","Bat-speed drill"],conditioning:["Tempo runs","Bike intervals","Mobility recovery"]},
 Football:{speed:["10-yard acceleration","Flying sprint mechanics","Change-of-direction starts"],strength:["Lower-body strength","Upper-body power","Posterior-chain training"],skill:["Position footwork","Reaction drill","Route/coverage technique"],conditioning:["Repeated sprint intervals","Tempo conditioning","Mobility recovery"]},
 "Ice Hockey":{speed:["First-step acceleration","Lateral power bounds","Short sprint intervals"],strength:["Single-leg strength","Posterior-chain strength","Core anti-rotation"],skill:["Edge-control footwork","Stickhandling tempo","Reaction and hand-speed"],conditioning:["Bike shift intervals","Repeated sprint conditioning","Hip mobility recovery"]},
 Basketball:{speed:["First-step acceleration","Closeout-to-sprint","Lateral change of direction"],strength:["Jump strength","Single-leg strength","Upper-body strength"],skill:["Ball-handling pace","Finishing footwork","Shooting movement"],conditioning:["Court intervals","Tempo runs","Mobility recovery"]},
 Lacrosse:{speed:["20-yard acceleration","Reactive cuts","Crossover sprint mechanics"],strength:["Rotational power","Single-leg strength","Upper-body push/pull"],skill:["Stick-skill tempo","Dodging footwork","Passing on the move"],conditioning:["Field intervals","Repeated sprint conditioning","Mobility recovery"]},
 Wrestling:{speed:["Short acceleration","Sprawl reaction","Lateral movement"],strength:["Total-body strength","Grip strength","Posterior-chain strength"],skill:["Stance and motion","Shot-entry technique","Hand-fighting drill"],conditioning:["Match intervals","Bike intervals","Mobility recovery"]},
 Soccer:{speed:["10-meter acceleration","Flying sprint","Change-of-direction sprint"],strength:["Single-leg strength","Hamstring strength","Core stability"],skill:["First-touch drill","Passing on the move","Dribbling change of direction"],conditioning:["Repeated sprint intervals","Aerobic tempo work","Mobility recovery"]}
};



function simpleExerciseInstruction(name:string){
 const n=name.toLowerCase();
 if(n.includes("goblet squat"))return "Hold one weight at your chest, sit your hips down between your feet, then stand tall while keeping your chest up.";
 if(n.includes("tempo bodyweight squat"))return "Stand with feet about shoulder-width, lower slowly for 3 seconds, pause briefly, then stand back up.";
 if(n.includes("romanian deadlift"))return "Keep a soft bend in your knees, push your hips backward until you feel your hamstrings, then squeeze your glutes to stand.";
 if(n.includes("rear-foot elevated split squat"))return "Put your back foot on a low bench, lower your back knee toward the floor, then push through your front foot to stand.";
 if(n.includes("reverse lunge"))return "Step one foot backward, lower both knees under control, then push through the front foot to return to standing.";
 if(n.includes("single-leg hip bridge"))return "Lie on your back with one foot planted, lift your hips by squeezing that glute, pause at the top, then lower slowly.";
 if(n.includes("push-up"))return "Keep your body straight, lower your chest toward the floor, then push the floor away until your arms are straight.";
 if(n.includes("side plank"))return "Support yourself on one forearm and the side of one foot, lift your hips, and hold your body in a straight line.";
 if(n.includes("cable")&&n.includes("row")||n.includes("band row"))return "Pull the handle or band toward your lower ribs, squeeze your shoulder blades together, then return slowly.";
 if(n.includes("pallof"))return "Stand sideways to the band or cable, press your hands straight out, and resist letting your body twist.";
 if(n.includes("wall acceleration"))return "Lean into a wall, keep your body in a straight line, drive one knee up, then switch legs quickly without losing your angle.";
 if(n.includes("short acceleration")||n.includes("10-yard acceleration")||n.includes("20-yard acceleration"))return "Start in an athletic stance, push hard through the first few steps, and sprint through the finish line.";
 if(n.includes("flying sprint"))return "Build speed gradually, then run your fastest relaxed sprint through the marked flying zone.";
 if(n.includes("lateral bound"))return "Jump sideways from one leg to the other, land softly, hold your balance for a moment, then repeat.";
 if(n.includes("farmer carry"))return "Hold weights at your sides, stand tall, brace your core, and walk with slow controlled steps.";
 if(n.includes("bear crawl"))return "Start on hands and feet with knees just off the floor, then move opposite hand and foot forward while keeping hips low.";
 if(n.includes("bike")||n.includes("rower"))return "Work hard for the listed interval, then move very easily during recovery and repeat for all rounds.";
 if(n.includes("shuttle"))return "Sprint between two marked points, change direction under control, and repeat for the listed work interval.";
 if(n.includes("tempo conditioning")||n.includes("tempo runs"))return "Move at a steady moderate pace during each work interval and use the easy interval to recover.";
 if(n.includes("reaction"))return "Start ready, react immediately to a visual or verbal cue, move quickly in that direction, then reset.";
 if(n.includes("footwork"))return "Move through the pattern with clean, quick steps while staying balanced and keeping your body in an athletic position.";
 if(n.includes("decision"))return "Begin without knowing which option is coming, react to the cue, choose the correct movement, and perform it at game speed.";
 if(n.includes("mobility")||n.includes("recovery"))return "Move slowly through the listed joints and stretches without forcing range of motion or bouncing.";
 if(n.includes("stickhandling"))return "Keep your hands relaxed, move the puck or ball smoothly from side to side, and gradually increase speed without losing control.";
 if(n.includes("throwing"))return "Use a controlled athletic stance, move through your normal throwing motion smoothly, and stop if mechanics become sloppy.";
 if(n.includes("fielding"))return "Stay low and balanced, move your feet to get your body behind the ball, then secure it before transitioning.";
 if(n.includes("bat-speed"))return "Use controlled swings with full intent, stay balanced, and stop the set when swing quality or speed drops.";
 if(n.includes("route")||n.includes("coverage"))return "Practice the exact footwork and body position for your position, then add speed only after the pattern is clean.";
 if(n.includes("edge-control"))return "Use controlled inside- and outside-edge movements, keep knees bent, and maintain balance before increasing speed.";
 if(n.includes("stick-skill"))return "Handle the stick with relaxed hands, keep your head up when possible, and repeat the skill cleanly before adding speed.";
 if(n.includes("dodging"))return "Approach under control, sell the first direction with your body, then plant and accelerate into the new direction.";
 if(n.includes("stance and motion"))return "Stay in a strong athletic stance and move without crossing your feet or letting your posture rise.";
 if(n.includes("shot-entry"))return "Start from your stance, lower your level, step between the opponent's feet, and drive through with control.";
 if(n.includes("hand-fighting"))return "Keep a strong stance, use short controlled hand contacts, and immediately return your hands to a protected position.";
 if(n.includes("first-touch"))return "Receive the ball softly into space where your next action can happen quickly.";
 if(n.includes("passing"))return "Plant beside the ball, point your hips toward the target, and pass with a controlled follow-through.";
 if(n.includes("dribbling"))return "Keep touches close enough to stay in control, then use a deliberate change of direction and accelerate away.";
 if(n.includes("closeout"))return "Sprint most of the distance, shorten your final steps, lower your hips, and arrive balanced with hands active.";
 if(n.includes("ball-handling"))return "Keep the ball low and controlled, use both hands, and maintain athletic posture while changing pace.";
 if(n.includes("finishing"))return "Approach under control, use balanced footwork, and complete the finish with the same technique each rep.";
 if(n.includes("shooting"))return "Get your feet set or into the planned movement, keep your eyes on the target, and finish every rep with balanced mechanics.";
 if(n.includes("sprawl"))return "Drop your hips quickly, throw your legs back, keep your chest over the opponent's attack line, then recover to stance.";
 if(n.includes("grip"))return "Use a firm but controlled grip, keep wrists neutral, and hold or move the resistance without losing posture.";
 if(n.includes("core stability"))return "Brace your midsection, keep your ribs stacked over your hips, and resist unwanted movement while breathing normally.";
 if(n.includes("movement preparation"))return "Perform each warm-up movement slowly first, then increase speed while keeping every rep controlled.";
 if(n.includes("easy movement"))return "Start with easy continuous movement, then complete the listed mobility drills to warm the major joints.";
 return "Perform the movement slowly enough to understand the pattern first, then increase speed only while you can keep clean, controlled technique.";
}


type ExerciseStepGuide={name:string;dose:string;instruction:string};

function exerciseStepGuides(name:string):ExerciseStepGuide[]{
 const n=name.toLowerCase();
 if(n.includes("easy movement")&&n.includes("dynamic mobility"))return [
  {name:"Easy jog or bike",dose:"2 minutes",instruction:"Move at an easy pace that raises your body temperature without making you tired."},
  {name:"Ankle rocks",dose:"10 each side",instruction:"Keep your heel flat and gently drive your knee forward over your toes, then return to the start."},
  {name:"Walking lunges",dose:"8 each side",instruction:"Step forward, lower both knees under control, push through the front foot, then step into the next lunge."},
  {name:"Hip openers",dose:"8 each side",instruction:"Lift one knee toward your chest, rotate it outward from the hip, place the foot down, then switch sides."},
  {name:"Arm circles",dose:"10 each direction",instruction:"Hold your arms out to the sides and make smooth controlled circles forward, then backward."}
 ];
 if(n.includes("movement preparation"))return [
  {name:"A-skips",dose:"10–15 yd",instruction:"Skip forward while driving one knee up and striking the ground underneath your body with the opposite foot."},
  {name:"Lateral shuffles",dose:"10–15 yd each way",instruction:"Stay low, keep your feet apart, and push sideways without crossing your feet."},
  {name:"Walking lunges",dose:"10–15 yd",instruction:"Step forward into a controlled lunge, push through the front foot, and continue into the next step."},
  {name:"Progressive accelerations",dose:"2 reps",instruction:"Start smoothly and build speed through the distance instead of sprinting at maximum speed immediately."}
 ];
 if(n.includes("core stability circuit"))return [
  {name:"Front plank",dose:"30 seconds",instruction:"Brace your stomach and hold a straight line from shoulders through heels while breathing normally."},
  {name:"Dead bug",dose:"30 seconds",instruction:"Lie on your back, brace your core, and slowly lower opposite arm and leg without letting your lower back lift."},
  {name:"Side plank",dose:"30 seconds each side",instruction:"Support yourself on one forearm, lift your hips, and keep your body in a straight line."}
 ];
 if(n.includes("bear crawl")&&n.includes("plank"))return [
  {name:"Bear crawl",dose:"20 seconds",instruction:"Keep your knees just off the floor and move opposite hand and foot together while keeping your hips low."},
  {name:"Front plank",dose:"30 seconds",instruction:"Brace your core and hold your body in one straight line while continuing to breathe."}
 ];
 return [];
}

function ExerciseStepResources({steps}:{steps:ExerciseStepGuide[]}){
 if(!steps.length)return null;
 return <div className="exerciseStepGuides">
  <div className="exerciseStepTitle"><b>Do these movements in order</b><small>Each movement has its own instructions and demonstration links.</small></div>
  {steps.map((step,i)=>{
   const q=encodeURIComponent(`${step.name} exercise demonstration`);
   return <div className="exerciseStepCard" key={`${step.name}-${i}`}>
    <div className="exerciseStepNumber">{i+1}</div>
    <div className="exerciseStepBody"><div className="exerciseStepHead"><b>{step.name}</b><span>{step.dose}</span></div><p>{step.instruction}</p>
     <div className="exerciseStepLinks"><a href={`https://www.youtube.com/results?search_query=${q}`} target="_blank" rel="noreferrer">▶ Video</a><a href={`https://www.google.com/search?tbm=isch&q=${q}`} target="_blank" rel="noreferrer">▧ Photos</a></div>
    </div>
   </div>;
  })}
 </div>;
}

function ExerciseResourceLinks({name}:{name:string}){
 const q=encodeURIComponent(`${name} exercise demonstration`);
 const video=`https://www.youtube.com/results?search_query=${q}`;
 const photos=`https://www.google.com/search?tbm=isch&q=${q}`;
 return <div className="exerciseResources">
  <a href={video} target="_blank" rel="noreferrer">▶ Watch Video Demo</a>
  <a href={photos} target="_blank" rel="noreferrer">▧ View Photos</a>
 </div>;
}

function Program({sport,profile,dev,results,program,setProgram,setWorkouts}:{sport:Sport;profile:Profile;dev:DevelopmentItem[];results:Result[];program:TrainingProgram|null;setProgram:React.Dispatch<React.SetStateAction<TrainingProgram|null>>;setWorkouts:any}){
 const [focus,setFocus]=useState("Balanced"),[days,setDays]=useState("4"),[equipment,setEquipment]=useState<"Gym Access"|"Body Weight Only">("Gym Access");
 const templates=sportProgramTemplates[sport];

 const ex=(phase:ProgramExercise["phase"],name:string,sets:string,reps:string,rest:string,notes:string,instructions?:string):ProgramExercise=>({phase,name,sets,reps,rest,notes,instructions});

 const buildExercises=(category:"speed"|"strength"|"skill"|"conditioning",sessionName:string):ProgramExercise[]=>{
  const gym=equipment==="Gym Access";
  const commonWarmup=[
   ex("Warm-up","Easy movement + dynamic mobility","1","5–7 min","—","Raise body temperature, then move through ankles, hips, thoracic spine, and shoulders.","2 min easy jog/bike → 10 ankle rocks/side → 8 walking lunges/side → 8 hip openers/side → 10 arm circles each direction."),
   ex("Warm-up","Movement preparation","2","10–15 yd each","20 sec","Use skips, shuffles, lunges, and controlled acceleration mechanics.","Perform A-skips, lateral shuffles, walking lunges, and 2 progressive accelerations. Keep posture tall and movements crisp.")
  ];

  const sportDrill=ex("Sport",sessionName,"3","4–6 quality reps","45–60 sec",`Perform with ${sport} technique. Stop the set when movement quality drops.`);

  const strengthGym=[
   ex("Main","Goblet squat","3","6–10 reps","75–90 sec","Controlled lowering, strong posture, smooth acceleration up.","Hold one dumbbell/kettlebell at chest. Lower for 3 seconds until thighs are near parallel, pause briefly, then stand forcefully. Leave 2–3 good reps in reserve."),
   ex("Main","Romanian deadlift","3","6–10 reps","75–90 sec","Hinge at the hips and keep the spine neutral. Use a manageable load.","Hold weights close to the legs. Push hips backward with soft knees until hamstrings are loaded, then squeeze glutes to stand. Do not round the lower back."),
   ex("Main","Rear-foot elevated split squat","3","6–8 / side","60–75 sec","Keep the front foot planted and control the full range.","Place rear foot on a low bench. Lower straight down under control, keep front knee tracking over toes, then drive through the front foot to stand."),
   ex("Main","Cable or band row","3","8–12 reps","60 sec","Pull shoulder blades back without shrugging.","Start with arms long. Pull handles toward lower ribs, pause 1 second with shoulder blades together, then return slowly without leaning back."),
   ex("Main","Pallof press","2–3","8–10 / side","45 sec","Resist rotation and keep ribs stacked over hips.","Stand sideways to cable/band at chest height. Press hands straight out, hold 1–2 seconds without twisting, then return. Repeat both sides.")
  ];
  const strengthBody=[
   ex("Main","Tempo bodyweight squat","3","10–15 reps","45–60 sec","Use a 3-second lowering phase and maintain knee alignment.","Feet about shoulder-width. Lower for 3 seconds, pause 1 second near the bottom, then stand in 1 second. Knees track in line with toes."),
   ex("Main","Reverse lunge","3","8–12 / side","45–60 sec","Stay tall and push through the whole front foot.","Step one foot backward, lower until both knees are comfortably bent, then drive through the front foot to return. Alternate or complete one side at a time."),
   ex("Main","Single-leg hip bridge","3","8–12 / side","45 sec","Finish with the hips level; do not overarch the back.","Lie on back, one foot planted and opposite leg raised. Drive through the planted heel, squeeze glute at the top for 1 second, lower under control."),
   ex("Main","Push-up","3","6–15 reps","45–60 sec","Keep a straight body line. Elevate hands if needed for quality reps.","Hands slightly wider than shoulders. Lower chest toward the floor while keeping ribs and hips together, then press back up. Stop 1–2 reps before form breaks."),
   ex("Main","Side plank","2–3","20–40 sec / side","30 sec","Keep shoulder, hip, and ankle aligned.","Elbow directly under shoulder. Lift hips until body forms a straight line. Keep top hip stacked and breathe normally throughout the hold.")
  ];

  const speedGym=[
   ex("Main","Wall acceleration drill","3","5 switches / side","30 sec","Drive the knee while keeping a strong body angle.","Lean into a wall at roughly 45°. Hold one knee up, then switch legs quickly without losing body angle. Finish each rep with toe pulled up and heel under hip."),
   ex("Main","Short acceleration sprint","5","10–20 yd","60–90 sec","Full-quality acceleration; walk back and recover between reps.","Start from a consistent athletic stance. Push hard for the first 3–5 steps, keep a forward lean early, and sprint through the finish. Every rep should be fast, not fatigued."),
   ex("Main","Lateral bound to stick","3","5 / side","45 sec","Land quietly and hold balance before the next rep.","Jump sideways off one leg, land on the opposite leg, and hold the landing for 2 seconds. Keep knee aligned over foot before the next bound."),
   ex("Main",gym?"Sled push / light resisted acceleration":"Falling-start acceleration","4",gym?"10–15 yd":"10 yd","60–90 sec",gym?"Use light resistance that does not change sprint mechanics.":"Fall forward under control, then accelerate through the line.")
  ];

  const skillWork=[
   sportDrill,
   ex("Main","Reaction drill","3","20–30 sec","45 sec","React to a visual or verbal cue and move with game-like posture.","Have a partner call left/right/forward/back or use a random visual cue. React immediately, move 2–4 steps with sport posture, reset, and repeat."),
   ex("Main","Footwork pattern","3","20–30 sec","45 sec","Prioritize clean movement over speed, then gradually increase pace.","Choose a sport-specific pattern. Begin at 70% speed for clean technique, then increase to 85–90% only if posture and foot placement stay controlled."),
   ex("Main","Decision-speed reps","3","4–6 reps","45 sec","Add a simple choice or reaction so the drill is not fully pre-planned.","Start each rep without knowing the direction or action. Use a partner cue, numbered cones, or two possible skills. Make the decision first, then execute at game speed.")
  ];

  const conditioningGym=[
   ex("Main",gym?"Bike / rower intervals":"Shuttle intervals","6",gym?"20 sec hard / 70 sec easy":"20 sec work / 70 sec walk","—","Keep output consistent across all rounds rather than sprinting the first rep."),
   ex("Main","Tempo conditioning","4","45 sec moderate / 45 sec easy","—","Stay smooth and controlled; breathing should recover during the easy period."),
   ex("Finisher","Core stability circuit","2","3 exercises × 30 sec","30 sec","Use plank, dead bug, and side plank variations.")
  ];

  const selected =
   category==="strength" ? (gym?strengthGym:strengthBody) :
   category==="speed" ? speedGym :
   category==="skill" ? skillWork :
   conditioningGym;

  const finisher=category==="conditioning"
   ? []
   : [ex("Finisher",gym?"Farmer carry":"Bear crawl + plank combo","2–3",gym?"20–30 yd":"20 sec + 30 sec","45 sec",gym?"Walk tall with controlled steps and even loading.":"Stay controlled; stop before posture breaks down.")];

  const cooldown=[
   ex("Cooldown","Easy recovery + mobility","1","5 min","—","Lower breathing gradually and use comfortable hip, calf, and upper-body mobility.","Walk or pedal easily for 2 minutes, then hold comfortable calf, hip-flexor, hamstring, and chest stretches for about 20–30 seconds each.")
  ];

  return [...commonWarmup,...selected,...finisher,...cooldown];
 };

 const generate=()=>{
  const n=Math.max(2,Math.min(6,Number(days)||4)),week=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const cycle=focus==="Balanced"?["speed","strength","skill","conditioning"]:Array(n).fill(focus.toLowerCase());
  const sessions:ProgramSession[]=Array.from({length:n},(_,i)=>{
   const category=cycle[i%cycle.length] as "speed"|"strength"|"skill"|"conditioning";
   const objective=dev.filter(d=>d.status!=="Complete").sort((a,b)=>({High:0,Medium:1,Low:2}[a.priority||"Medium"])-({High:0,Medium:1,Low:2}[b.priority||"Medium"]))[0]?.title;
   const sessionName=templates[category][i%templates[category].length];
   const exercises=buildExercises(category,sessionName);
   const minutes=category==="conditioning"?45:55;
   return {id:Date.now()+i,day:week[i],name:sessionName,category:category[0].toUpperCase()+category.slice(1),minutes,focus:objective||`${sport} ${category} development`,completed:false,exercises};
  });
  setProgram({id:Date.now(),created:today(),sport,position:profile.position||"",focus,daysPerWeek:n,sessions,equipment});
 };

 const toggle=(id:number)=>setProgram(x=>x?{...x,sessions:x.sessions.map(s=>s.id===id?{...s,completed:!s.completed}:s)}:x);

 const addToCalendar=()=>{
  if(!program)return;
  const start=new Date(),dayIndex:Record<string,number>={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6},current=start.getDay();
  setWorkouts((existing:Workout[])=>[...program.sessions.map((session,i)=>{let offset=(dayIndex[session.day]-current+7)%7;if(offset===0&&i>0)offset=7;const d=new Date(start);d.setDate(start.getDate()+offset);return {id:Date.now()+i,date:d.toISOString().slice(0,10),name:session.name,category:session.category,minutes:session.minutes,completed:false,sport,intensity:session.category==="Conditioning"?"Hard":"Moderate",focus:`${session.focus} · ${session.exercises?.length||0} exercises`};}),...existing]);
 };

 const completion=program?.sessions.length?Math.round(program.sessions.filter(s=>s.completed).length/program.sessions.length*100):0;
 const remaining=program?.sessions.filter(s=>!s.completed).length||0;

 return <><div className="sectionDivider"><span><i/>Training Program</span></div><div className="hero phase35Hero"><small>PHASE 70.7 · COMPLETE PROGRAM GENERATOR</small><h1>Weekly Program Builder</h1><p>{sport}{profile.position?" · "+profile.position:""} · Generate complete daily sessions with exercises, volume, rest, and coaching cues.</p></div>

 <div className="card"><h2>Generate Program</h2><div className="two">
  <label>Primary Focus<select value={focus} onChange={e=>setFocus(e.target.value)}>{["Balanced","Speed","Strength","Skill","Conditioning"].map(x=><option key={x}>{x}</option>)}</select></label>
  <label>Training Days / Week<select value={days} onChange={e=>setDays(e.target.value)}>{["2","3","4","5","6"].map(x=><option key={x}>{x}</option>)}</select></label>
  <label>Exercise Access<select value={equipment} onChange={e=>setEquipment(e.target.value as "Gym Access"|"Body Weight Only")}><option value="Gym Access">Gym Access</option><option value="Body Weight Only">Body Weight Only</option></select></label>
 </div><p className="programAccessNote">{equipment==="Gym Access"?"Programs may use dumbbells, cables/bands, cardio equipment, and other standard gym tools.":"Programs use body weight, running space, and simple no-gym movements."}</p><button className="primary" onClick={generate}>Build Complete Program</button></div>

 {program&&<><div className="programOverview"><div><small>FOCUS</small><b>{program.focus}</b></div><div><small>WEEKLY DAYS</small><b>{program.daysPerWeek}</b></div><div><small>ACCESS</small><b>{program.equipment||"Legacy"}</b></div><div><small>COMPLETE</small><b>{completion}%</b></div></div>

 <div className="card"><div className="sectionHead"><h2>Current Program</h2><span>{completion}% complete</span></div><div className="progress"><i style={{width:`${completion}%`}}/></div><p>{program.focus} · {program.daysPerWeek} days/week · {program.equipment||"Previous program"} · Created {program.created}</p><button className="primary" onClick={addToCalendar}>Add Program to Calendar</button></div>

 {program.sessions.map((session,sessionIndex)=><div className={"card programSession completeSession "+(session.completed?"sessionDone":"")} key={session.id}>
  <div className="programDayHeader"><div><span className="tag">DAY {sessionIndex+1} · {session.day} · {session.category}</span><h2>{session.name}</h2><p>{session.minutes} min · Focus: {session.focus}</p><small className="sessionInstruction">Complete exercises in the order shown. Use controlled technique, stop any painful movement, and keep enough quality in reserve to maintain form.</small></div><button className={session.completed?"completedAction":"featureAction"} onClick={()=>toggle(session.id)}>{session.completed?"✓ Complete":"Mark Day Complete"}</button></div>
  <div className="mentalPrepWorkoutReminder"><div className="mentalPrepReminderIcon">◎</div><div><b>Start with Mental Preparation & Breathing</b><p>Before this workout, complete your mental preparation routine: settle your attention, then do 6–10 rounds of Reilly Rescue Breathing followed by 6–10 rounds of Box Breathing.</p></div></div>
  {session.exercises?.length?<div className="exerciseTable">
   <div className="exerciseTableHead"><span>Exercise & How To</span><span>Sets</span><span>Reps / Time</span><span>Rest</span></div>
   {session.exercises.map((exercise,i)=><div className="exerciseRow" key={`${session.id}-${i}`}>
    <div><span className={"exercisePhase "+exercise.phase.toLowerCase().replace("-","")}>{exercise.phase}</span><b>{exercise.name}</b><div className="exercisePrescription"><strong>{exercise.sets} sets · {exercise.reps} · Rest {exercise.rest}</strong></div><small className="exercisePurpose">{exercise.notes}</small>{exerciseStepGuides(exercise.name).length?<ExerciseStepResources steps={exerciseStepGuides(exercise.name)}/>:<><div className="simpleInstruction"><b>Simple instruction:</b> {simpleExerciseInstruction(exercise.name)}</div>{exercise.instructions&&<small className="exerciseHow"><b>More detail:</b> {exercise.instructions}</small>}<ExerciseResourceLinks name={exercise.name}/></>}</div>
    <span data-label="Sets">{exercise.sets}</span><span data-label="Reps / Time">{exercise.reps}</span><span data-label="Rest">{exercise.rest}</span>
   </div>)}
  </div>:<div className="legacyProgramNote"><b>Previous program session</b><p>Regenerate the program to add the complete exercise prescription.</p></div>}
 </div>)}

 <div className="card"><h2>Program Inputs</h2><div className="quickStats"><span><b>{dev.filter(x=>x.status!=="Complete").length}</b><small>Open development objectives</small></span><span><b>{results.filter(x=>x.sport===sport).length}</b><small>Sport test results</small></span><span><b>{profile.position||"—"}</b><small>Position</small></span></div></div></>}
 </>;
}
function Readiness({sport,readiness,setReadiness,coachNotes,setCoachNotes,program,workouts,accountRole="Coach"}:{sport:Sport;readiness:ReadinessLog[];setReadiness:React.Dispatch<React.SetStateAction<ReadinessLog[]>>;coachNotes:CoachNote[];setCoachNotes:React.Dispatch<React.SetStateAction<CoachNote[]>>;program:TrainingProgram|null;workouts:Workout[];accountRole?:AccountRole}){
 const [sleep,setSleep]=useState("8"),[soreness,setSoreness]=useState("3"),[energy,setEnergy]=useState("7"),[stress,setStress]=useState("3"),[notes,setNotes]=useState("");
 const [noteTitle,setNoteTitle]=useState(""),[noteText,setNoteText]=useState(""),[noteCategory,setNoteCategory]=useState("Coach");
 const saveReadiness=()=>{
  const item:ReadinessLog={id:Date.now(),date:today(),sleep:Number(sleep)||0,soreness:Number(soreness)||0,energy:Number(energy)||0,stress:Number(stress)||0,notes};
  setReadiness(x=>[item,...x.filter(r=>r.date!==item.date)]);
  setNotes("");
 };
 const saveCoachNote=()=>{
  if(!noteTitle.trim()&&!noteText.trim())return;
  setCoachNotes(x=>[{id:Date.now(),date:today(),title:noteTitle.trim()||"Note",note:noteText.trim(),category:noteCategory},...x]);
  setNoteTitle("");setNoteText("");
 };
 const calc=(r:ReadinessLog)=>Math.max(0,Math.min(100,Math.round(Math.min(10,r.sleep/8*10)*2.5+(10-Math.min(10,r.soreness))*2.5+Math.min(10,r.energy)*2.5+(10-Math.min(10,r.stress))*2.5)));
 const todayLog=readiness.find(r=>r.date===today());
 const score=todayLog?calc(todayLog):0;
 const recent=readiness.slice(0,7);
 const avg7=recent.length?Math.round(recent.reduce((a,r)=>a+calc(r),0)/recent.length):0;
 const yesterday=readiness.find(r=>r.date<today());
 const delta=todayLog&&yesterday?score-calc(yesterday):0;
 const status=score>=80?"Ready to Train":score>=60?"Train with Moderation":score>0?"Recovery Focus":"Log Today";
 const nextWorkout=workouts.filter(w=>w.sport===sport&&!w.completed&&w.date>=today()).sort((a,b)=>a.date.localeCompare(b.date))[0];
 const flags:RecoveryFlag[]=[
  {label:"Sleep",value:todayLog?`${todayLog.sleep}h`:"—",status:!todayLog?"Watch":todayLog.sleep>=8?"Good":todayLog.sleep>=7?"Watch":"Low"},
  {label:"Energy",value:todayLog?`${todayLog.energy}/10`:"—",status:!todayLog?"Watch":todayLog.energy>=7?"Good":todayLog.energy>=5?"Watch":"Low"},
  {label:"Soreness",value:todayLog?`${todayLog.soreness}/10`:"—",status:!todayLog?"Watch":todayLog.soreness<=3?"Good":todayLog.soreness<=5?"Watch":"Low"},
  {label:"Stress",value:todayLog?`${todayLog.stress}/10`:"—",status:!todayLog?"Watch":todayLog.stress<=3?"Good":todayLog.stress<=5?"Watch":"Low"}
 ];
 return <><div className="sectionDivider"><span><i/>Readiness</span></div><div className="hero phase34Hero"><small>PHASE 34 · READINESS 2.0</small><h1>Daily Readiness</h1><p>{sport} · Recovery signals, trends, and training guidance.</p></div>
 <div className="readinessHero"><div><small>READINESS SCORE</small><strong>{score}</strong><span>/100</span></div><div><b>{status}</b><p>{score>=80?"Good day for normal training intensity.":score>=60?"Keep quality high but watch fatigue.":score>0?"Prioritize recovery, mobility, and lower intensity.":"Complete today's check-in to get a score."}</p>{todayLog&&<small>{delta>=0?"+":""}{delta} vs previous log · 7-day avg {avg7}</small>}</div></div>
 <div className="recoveryFlags">{flags.map(f=><div className={"recoveryFlag "+f.status.toLowerCase()} key={f.label}><small>{f.label}</small><b>{f.value}</b><span>{f.status}</span></div>)}</div>
 <div className="card setupAnchor" id="setup-readiness" tabIndex={-1}><h2>Daily Check-In</h2><div className="two">
  <label>Sleep (hours)<select value={sleep} onChange={e=>setSleep(e.target.value)}>{["4","5","6","7","8","9","10"].map(x=><option key={x}>{x}</option>)}</select></label>
  <label>Energy (1–10)<select value={energy} onChange={e=>setEnergy(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}</option>)}</select></label>
  <label>Soreness (1–10)<select value={soreness} onChange={e=>setSoreness(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}</option>)}</select></label>
  <label>Stress (1–10)<select value={stress} onChange={e=>setStress(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}</option>)}</select></label>
 </div><label>Notes<input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Sleep quality, soreness location, school stress, etc."/></label><button className="primary" onClick={saveReadiness}>Save Today's Readiness</button></div>
 <div className="card"><h2>7-Day Readiness Trend</h2>{recent.length?<div className="readinessBars">{recent.slice().reverse().map(r=>{const v=calc(r);return <div key={r.id}><i style={{height:`${v}%`}}/><small>{r.date.slice(5)}</small><b>{v}</b></div>})}</div>:<p>Log readiness each day to build a recovery trend.</p>}</div>
 <div className="grid twoCards"><div className="card"><h2>Training Recommendation</h2><p>{score>=80?"Proceed with the planned session.":score>=60?"Complete the session, but reduce volume if performance drops.":score>0?"Use recovery, mobility, technique, or an easier conditioning session.":"Log readiness first."}</p>{nextWorkout&&<p><b>Next:</b> {nextWorkout.name} · {nextWorkout.date}</p>}</div><div className="card"><h2>Program Status</h2><p>{program?`${program.focus} · ${program.daysPerWeek} days/week`:"No active training program yet."}</p></div></div>
 {accountRole==="Coach"&&<><div className="card privateCoachCard"><div className="sectionHead"><h2>Private Coach Notes</h2><span className="tag">COACH ONLY</span></div><div className="two"><label>Category<select value={noteCategory} onChange={e=>setNoteCategory(e.target.value)}><option>Coach</option><option>Parent</option><option>Athlete</option><option>Medical / Recovery</option><option>Game Review</option></select></label><label>Title<input value={noteTitle} onChange={e=>setNoteTitle(e.target.value)} placeholder="e.g. Practice feedback"/></label></div><label>Note<input value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Private coaching observation"/></label><button className="featureAction" onClick={saveCoachNote}>Save Private Note</button></div>
 {coachNotes.slice(0,8).map(n=><div className="card row privateCoachNote" key={n.id}><div><span className="tag">{n.category}</span><h2>{n.title}</h2><p>{n.note}</p></div><small>{n.date}</small></div>)}</>}
 </>;
}
function Competition({sport,competitions,setCompetitions,profile}:{sport:Sport;competitions:CompetitionLog[];setCompetitions:React.Dispatch<React.SetStateAction<CompetitionLog[]>>;profile:Profile}){
 const [date,setDate]=useState(today()),[opponent,setOpponent]=useState(""),[eventType,setEventType]=useState("Game"),[result,setResult]=useState(""),[minutes,setMinutes]=useState(""),[rating,setRating]=useState("7"),[notes,setNotes]=useState("");
 const [location,setLocation]=useState(""),[role,setRole]=useState(profile.position||""),[keyWin,setKeyWin]=useState(""),[improveNext,setImproveNext]=useState(""),[confidence,setConfidence]=useState("7");
 const emptyStats=()=>competitionStats[sport].map(label=>({label,value:""}));
 const [stats,setStats]=useState<StatEntry[]>(emptyStats());
 useEffect(()=>{setStats(emptyStats());setRole(profile.position||"")},[sport,profile.position]);

 const save=()=>{
  if(!opponent.trim()&&!result.trim()&&!notes.trim())return;
  const item:CompetitionLog={
   id:Date.now(),date,opponent:opponent.trim()||"Competition",eventType,result:result.trim(),minutes,
   rating:Number(rating)||0,notes:notes.trim(),sport,stats,location:location.trim(),role:role.trim(),
   keyWin:keyWin.trim(),improveNext:improveNext.trim(),confidence:Number(confidence)||0
  };
  setCompetitions(x=>[item,...x]);
  setOpponent("");setResult("");setMinutes("");setNotes("");setRating("7");setLocation("");setKeyWin("");setImproveNext("");setConfidence("7");setStats(emptyStats());
 };

 const mine=competitions.filter(x=>x.sport===sport).sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
 const games=mine.length;
 const avgRating=games?Math.round(mine.reduce((a,x)=>a+x.rating,0)/games*10)/10:0;
 const avgConfidence=games?Math.round(mine.reduce((a,x)=>a+(x.confidence||0),0)/games*10)/10:0;
 const totalMinutes=mine.reduce((a,x)=>a+(Number(x.minutes)||0),0);
 const wins=mine.filter(x=>/^w/i.test(x.result.trim())).length;
 const winPct=games?Math.round(wins/games*100):0;

 const statTotals=competitionStats[sport].map(label=>{
  const vals=mine.map(g=>Number(g.stats.find(s=>s.label===label)?.value||0)).filter(v=>!Number.isNaN(v));
  return {label,total:Math.round(vals.reduce((a,b)=>a+b,0)*100)/100};
 }).filter(x=>x.total!==0).slice(0,8);

 const recentRatings=mine.slice(0,8).reverse();
 const bestRating=mine.length?Math.max(...mine.map(x=>x.rating)):0;
 const lastThree=mine.slice(0,3);
 const recentAvg=lastThree.length?Math.round(lastThree.reduce((a,x)=>a+x.rating,0)/lastThree.length*10)/10:0;

 
 const sportCompetitionHistory=competitions.filter(c=>c.sport===sport).sort((a,b)=>b.date.localeCompare(a.date));
 const lastFive=sportCompetitionHistory.slice(0,5);
 const formAvg=lastFive.length?Math.round(lastFive.reduce((a,c)=>a+c.rating,0)/lastFive.length*10)/10:0;
 const confidenceAvg=lastFive.length?Math.round(lastFive.reduce((a,c)=>a+(c.confidence||0),0)/lastFive.length*10)/10:0;
 const recentWins=lastFive.filter(c=>(c.result||"").toLowerCase().startsWith("w")).length;
 const bestGame=lastFive.slice().sort((a,b)=>b.rating-a.rating)[0];
return <><div className="hero"><small>PHASE 43 · COMPETITION 3.0</small><h1>Competition</h1><p>{profile.name} · {sport}{profile.position?" · "+profile.position:""} · Track game performance, confidence, and post-event learning.</p></div>
 <div className="competitionForm">
  <div><small>LAST 5 RATING</small><b>{formAvg||"—"}</b><span>/10</span></div>
  <div><small>CONFIDENCE</small><b>{confidenceAvg||"—"}</b><span>/10</span></div>
  <div><small>WINS</small><b>{recentWins}</b><span>last 5</span></div>
  <div><small>BEST RECENT</small><b>{bestGame?bestGame.rating:"—"}</b><span>{bestGame?.opponent||bestGame?.eventType||"No games"}</span></div>
 </div>
 

 <div className="grid three">
  <div className="stat"><small>Events Logged</small><b>{games}</b></div>
  <div className="stat"><small>Average Rating</small><b>{avgRating||"—"}</b><span>/10</span></div>
  <div className="stat"><small>Win Rate</small><b>{winPct}%</b></div>
 </div>

 <div className="card"><h2>Log Competition</h2>
  <div className="two">
   <label>Date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
   <label>Type<select value={eventType} onChange={e=>setEventType(e.target.value)}><option>Game</option><option>Match</option><option>Tournament</option><option>Scrimmage</option><option>Meet</option><option>Showcase</option></select></label>
   <label>Opponent / Event<input value={opponent} onChange={e=>setOpponent(e.target.value)} placeholder="Team or event name"/></label>
   <label>Result<input value={result} onChange={e=>setResult(e.target.value)} placeholder="e.g. W 4-2, 2nd place"/></label>
   <label>Location<input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Home, away, venue"/></label>
   <label>Role / Position<input value={role} onChange={e=>setRole(e.target.value)} placeholder="Position or role"/></label>
   <label>Minutes / Time<input value={minutes} onChange={e=>setMinutes(e.target.value)} inputMode="decimal" placeholder="e.g. 32"/></label>
   <label>Performance Rating<select value={rating} onChange={e=>setRating(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}/10</option>)}</select></label>
   <label>Confidence<select value={confidence} onChange={e=>setConfidence(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}/10</option>)}</select></label>
  </div>

  <h2>Sport Stats</h2>
  <div className="statInputs">{stats.map((st,i)=><label key={st.label}>{st.label}<input inputMode="decimal" value={st.value} onChange={e=>setStats(x=>x.map((a,j)=>j===i?{...a,value:e.target.value}:a))}/></label>)}</div>

  <div className="two">
   <label>Biggest Win<input value={keyWin} onChange={e=>setKeyWin(e.target.value)} placeholder="What worked best?"/></label>
   <label>Improve Next<input value={improveNext} onChange={e=>setImproveNext(e.target.value)} placeholder="One thing to improve next time"/></label>
  </div>
  <label>Post-Game Notes<input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What happened and what did you learn?"/></label>
  <button className="primary" onClick={save}>Save Competition</button>
 </div>

 <details className="simpleDisclosure advancedTools"><summary><div><b>Competition Insights</b><small>Performance trend, confidence, and season snapshot</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="grid twoCards">
  <div className="card"><h2>Performance Trend</h2>{recentRatings.length<2?<p>Log at least 2 competitions to see a trend.</p>:<div className="competitionTrend">{recentRatings.map(g=><div key={g.id}><i style={{height:`${Math.max(10,g.rating*10)}%`}}/><small>{g.date.slice(5)}</small><b>{g.rating}</b></div>)}</div>}<p>Recent average: <b>{recentAvg||"—"}</b>/10 · Best: <b>{bestRating||"—"}</b>/10</p></div>
  <div className="card"><h2>Confidence</h2><div className="big">{avgConfidence||"—"}<small>/10 avg</small></div><p>Compare confidence with performance rating to spot preparation and mindset patterns.</p></div>
 </div>

 <div className="card"><h2>Season Snapshot</h2>
  <div className="quickStats">
   <span><b>{games}</b><small>Events</small></span>
   <span><b>{wins}</b><small>Wins logged</small></span>
   <span><b>{totalMinutes}</b><small>Total minutes</small></span>
  </div>
  {statTotals.length>0&&<div className="seasonStats">{statTotals.map(x=><div key={x.label}><small>{x.label}</small><b>{x.total}</b></div>)}</div>}
 </div>

 </div></details>
 <h2>Competition History</h2>
 {mine.length===0?<div className="card"><p>No competitions logged yet.</p></div>:mine.map(g=><div className="card competitionCard" key={g.id}>
  <div className="row"><div><span className="tag">{g.eventType}</span><h2>{g.opponent}</h2><p>{g.date}{g.result?" · "+g.result:""}{g.location?" · "+g.location:""}{g.minutes?" · "+g.minutes+" min":""}</p></div><div className="ratingBadge">{g.rating}<small>/10</small></div></div>
  <div className="miniStats">{g.stats.filter(x=>x.value!=="").map(x=><span key={x.label}><small>{x.label}</small><b>{x.value}</b></span>)}</div>
  {(g.keyWin||g.improveNext)&&<div className="gameReflection">{g.keyWin&&<p><b>Win:</b> {g.keyWin}</p>}{g.improveNext&&<p><b>Next:</b> {g.improveNext}</p>}</div>}
  {g.notes&&<p><b>Review:</b> {g.notes}</p>}
  <button onClick={()=>setCompetitions(x=>x.filter(c=>c.id!==g.id))}>Delete</button>
 </div>)}
 </>;
}

function Reports({sport,profile,goals,workouts,results,dev,program,readiness,competitions,reportNotes,setReportNotes}:{sport:Sport;profile:Profile;goals:Goal[];workouts:Workout[];results:Result[];dev:DevelopmentItem[];program:TrainingProgram|null;readiness:ReadinessLog[];competitions:CompetitionLog[];reportNotes:ReportNote[];setReportNotes:React.Dispatch<React.SetStateAction<ReportNote[]>>}){
 const [title,setTitle]=useState("Weekly Review"),[body,setBody]=useState("");
 const sportResults=results.filter(r=>r.sport===sport);
 const sportWorkouts=workouts.filter(w=>w.sport===sport);
 const completedWorkouts=sportWorkouts.filter(w=>w.completed).length;
 const trainingConsistency=sportWorkouts.length?Math.round(completedWorkouts/sportWorkouts.length*100):0;
 const goalProgress=goals.length?Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length):0;
 const openDev=dev.filter(d=>d.status!=="Complete").length;
 const sportCompetitions=competitions.filter(c=>c.sport===sport);
 const avgRating=sportCompetitions.length?Math.round(sportCompetitions.reduce((a,c)=>a+c.rating,0)/sportCompetitions.length*10)/10:0;
 const recentReadiness=readiness.slice(0,7);
 const avgReadiness=recentReadiness.length?Math.round(recentReadiness.reduce((a,r)=>a+Math.max(0,Math.min(100,Math.round(Math.min(10,r.sleep/8*10)*2.5+(10-Math.min(10,r.soreness))*2.5+Math.min(10,r.energy)*2.5+(10-Math.min(10,r.stress))*2.5))),0)/recentReadiness.length):0;

 const grouped=[...new Map(sportResults.map(r=>[r.testId,r])).values()].map(g=>{
  const rows=sportResults.filter(r=>r.testId===g.testId).sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id);
  const def=definitions(sport).find(x=>x.id===g.testId)||({lowerBetter:g.unit==="sec"} as TestDef);
  const first=rows[0]?.value??0,last=rows[rows.length-1]?.value??0;
  const imp=rows.length>1?improvement(first,last,def.lowerBetter):0;
  return {name:g.name,unit:g.unit,first,last,imp,count:rows.length};
 }).sort((a,b)=>b.imp-a.imp);

 const overall=Math.round(goalProgress*.25+trainingConsistency*.25+avgReadiness*.2+(avgRating?avgRating*10*.2:0)+(grouped.length?10:0));
 const reportGrade=overall>=90?"A":overall>=80?"B":overall>=70?"C":overall>=60?"D":"Developing";
 const reportStatus=overall>=85?"Excellent trajectory":overall>=70?"Positive progress":overall>=55?"Building foundation":"Needs focused support";


 const saveNote=()=>{
  if(!title.trim()&&!body.trim())return;
  setReportNotes(x=>[{id:Date.now(),date:today(),title:title.trim()||"Review",body:body.trim()},...x]);
  setBody("");
 };

 const exportSummary=()=>{
  const rows=[
   ["Athlete",profile.name],
   ["Sport",sport],
   ["Position",profile.position],
   ["Season",profile.season],
   ["Overall Score",String(overall)],
   ["Goal Progress",goalProgress+"%"],
   ["Training Consistency",trainingConsistency+"%"],
   ["7-Day Readiness",avgReadiness+"%"],
   ["Competition Rating",avgRating?String(avgRating):"N/A"],
   ["Open Development Objectives",String(openDev)],
   ["Test Results Logged",String(sportResults.length)],
   ["Competitions Logged",String(sportCompetitions.length)]
  ];
  const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="athlete-performance-summary.csv";a.click();URL.revokeObjectURL(url);
 };
 const copySummary=async()=>{
  const text=`${profile.name} · ${sport}\nOverall ${overall}/100 (${reportGrade})\nGoals ${goalProgress}%\nTraining ${trainingConsistency}%\nReadiness ${avgReadiness||"—"}\nCompetition ${avgRating||"—"}`;
  try{await navigator.clipboard.writeText(text)}catch{}
 };
 const snapshot:ShareSnapshot={
  athlete:profile.name,
  sport,
  position:profile.position,
  score:overall,
  goalProgress,
  readiness:avgReadiness||0,
  tests:results.filter(r=>r.sport===sport).length,
  competitions:competitions.filter(c=>c.sport===sport).length,
  generated:new Date().toISOString()
 };
 const downloadSnapshot=()=>{
  const blob=new Blob([JSON.stringify(snapshot,null,2)],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=`${profile.name.replace(/\s+/g,"-").toLowerCase()}-athlete-snapshot.json`;a.click();URL.revokeObjectURL(url);
 };



 return <><div className="sectionDivider"><span><i/>Performance Report</span></div><div className="hero phase32Hero"><small>PHASE 63 · SHAREABLE SNAPSHOT</small><h1>Performance Report</h1><p>{profile.name} · {sport}{profile.position?" · "+profile.position:""} · {profile.season}</p></div>

 <div className="snapshotCard"><div><small>SHAREABLE ATHLETE SNAPSHOT</small><h2>{profile.name}</h2><p>{sport}{profile.position?" · "+profile.position:""} · Performance {overall}/100</p></div><span className="tag">Phase 63</span></div>
 <div className="reportGrade"><div><small>ATHLETE REPORT GRADE</small><strong>{reportGrade}</strong></div><div><b>{reportStatus}</b><p>Use this report as a development snapshot—not a permanent athlete rating.</p></div></div>
 <div className="reportScore"><div><small>OVERALL PERFORMANCE INDEX</small><strong>{overall}</strong><span>/100</span></div><div><b>{overall>=80?"Strong Progress":overall>=60?"Building Momentum":"Needs Attention"}</b><p>Combined from goals, training, readiness, competition, and testing activity.</p></div></div>
 <div className="executiveSummary">
  <div><small>PRIMARY STRENGTH</small><b>{grouped[0]?.name||"Build more testing data"}</b><span>{grouped[0]?.imp?`${grouped[0].imp}% trend`:""}</span></div>
  <div><small>CURRENT PRIORITY</small><b>{dev.find(d=>d.status!=="Complete")?.title||"Maintain consistency"}</b><span>{dev.find(d=>d.status!=="Complete")?.category||"Development"}</span></div>
  <div><small>TRAINING STATUS</small><b>{trainingConsistency>=80?"Consistent":trainingConsistency>=60?"Building":"Needs consistency"}</b><span>{trainingConsistency}% complete</span></div>
 </div>

 <div className="grid reportGrid">
  <div className="stat"><small>Goal Progress</small><b>{goalProgress}%</b></div>
  <div className="stat"><small>Training Consistency</small><b>{trainingConsistency}%</b></div>
  <div className="stat"><small>7-Day Readiness</small><b>{avgReadiness}%</b></div>
  <div className="stat"><small>Competition Rating</small><b>{avgRating||"—"}</b></div>
  <div className="stat"><small>Open Dev Goals</small><b>{openDev}</b></div>
  <div className="stat"><small>Tests Logged</small><b>{sportResults.length}</b></div>
 </div>

 <div className="card"><div className="sectionHead"><h2>Performance Insights</h2><div className="reportActions"><button onClick={exportSummary}>Export Summary CSV</button><button onClick={copySummary}>Copy Summary</button><button onClick={downloadSnapshot}>Download Snapshot</button><button onClick={()=>window.print()}>Print Report</button></div></div>
  {grouped.length===0?<p>Log repeated performance tests to generate improvement insights.</p>:grouped.slice(0,6).map(g=><div className="insightRow" key={g.name}><div><b>{g.name}</b><small>{g.count} results · Baseline {g.first} {g.unit} → Current {g.last} {g.unit}</small></div><strong className={g.imp>=0?"good":"bad"}>{g.count>1?(g.imp>=0?"+":"")+g.imp+"%":"New"}</strong></div>)}
 </div>

 <div className="grid twoCards">
  <div className="card"><h2>Development</h2><p>{dev.filter(d=>d.status==="Complete").length} complete · {openDev} open</p>{dev.filter(d=>d.status!=="Complete").slice(0,4).map(d=><div className="line" key={d.id}><b>{d.title}</b><small>{d.category}{d.target?" · "+d.target:""}</small></div>)}</div>
  <div className="card"><h2>Current Program</h2>{program?<><p>{program.focus} · {program.daysPerWeek} days/week</p><p>{program.sessions.filter(s=>s.completed).length}/{program.sessions.length} sessions complete</p></>:<p>No active weekly program.</p>}</div>
 </div>

 <div className="card"><h2>Review Notes</h2><div className="two"><label>Title<input value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Review<input value={body} onChange={e=>setBody(e.target.value)} placeholder="Key wins, concerns, and next priorities"/></label></div><button onClick={saveNote}>Save Review</button></div>
 {reportNotes.slice(0,8).map(n=><div className="card" key={n.id}><div className="row"><b>{n.title}</b><small>{n.date}</small></div><p>{n.body}</p><button onClick={()=>setReportNotes(x=>x.filter(r=>r.id!==n.id))}>Delete</button></div>)}
 </>;
}

function Roster({sport,profile,roster,setRoster,activeAthleteId,switchAthlete,setTab,setEditProfileRequest}:{sport:Sport;profile:Profile;roster:AthleteRecord[];setRoster:React.Dispatch<React.SetStateAction<AthleteRecord[]>>;activeAthleteId:string;switchAthlete:(a:AthleteRecord)=>void;setTab:React.Dispatch<React.SetStateAction<Tab>>;setEditProfileRequest:React.Dispatch<React.SetStateAction<number>>}){
 const [name,setName]=useState(""),[newSport,setNewSport]=useState<Sport>(sport),[position,setPosition]=useState(""),[team,setTeam]=useState(""),[season,setSeason]=useState(profile.season||"2026-27"),[height,setHeight]=useState(""),[weight,setWeight]=useState(""),[handedness,setHandedness]=useState<"Right"|"Left">("Right");
 const [compareA,setCompareA]=useState(activeAthleteId),[compareB,setCompareB]=useState("");
 const [teamFilter,setTeamFilter]=useState("All");
 const [showRosterTools,setShowRosterTools]=useState(false);
 const scrollToAddAthlete=()=>{
   window.setTimeout(()=>{
     const el=document.getElementById("roster-add-athlete");
     if(el){el.scrollIntoView({behavior:"smooth",block:"start"});(el as HTMLElement).focus({preventScroll:true});}
   },40);
 };

 const currentRecord:AthleteRecord={id:"primary",name:profile.name,sport,position:profile.position,team:profile.team,season:profile.season,height:profile.height,weight:profile.weight,handedness:profile.handedness};

 const add=()=>{
  if(!name.trim())return;
  const item:AthleteRecord={id:"athlete-"+Date.now(),name:name.trim(),sport:newSport,position,team,season,height,weight,handedness};
  setRoster(x=>[...x,item]);
  setName("");setPosition("");setTeam("");setHeight("");setWeight("");
 };

 const activate=(a:AthleteRecord)=>switchAthlete(a);
 const editAthlete=(a:AthleteRecord)=>{
  switchAthlete(a);
  setTab("Home");
  window.setTimeout(()=>setEditProfileRequest(x=>x+1),80);
 };
 const all=[currentRecord,...roster.filter(x=>x.id!=="primary")];

 const readinessScore=(rows:ReadinessLog[])=>{
  const recent=rows.slice(0,7);
  if(!recent.length)return 0;
  return Math.round(recent.reduce((a,r)=>a+Math.max(0,Math.min(100,Math.round(Math.min(10,r.sleep/8*10)*2.5+(10-Math.min(10,r.soreness))*2.5+Math.min(10,r.energy)*2.5+(10-Math.min(10,r.stress))*2.5))),0)/recent.length);
 };

 const readSummary=(a:AthleteRecord):RosterSummary=>{
  let snap:AthleteSnapshot|undefined;
  try{
   const raw=localStorage.getItem(`athleteData:${a.id}`);
   if(raw)snap=JSON.parse(raw);
  }catch{}
  const goals=snap?.goals||[],workouts=snap?.workouts||[],tests=snap?.results||[],comps=snap?.competitions||[],ready=snap?.readiness||[];
  const goalProgress=goals.length?Math.round(goals.reduce((sum,g)=>sum+g.progress,0)/goals.length):0;
  const done=workouts.filter(w=>w.completed).length;
  const consistency=workouts.length?Math.round(done/workouts.length*100):0;
  const readiness=readinessScore(ready);
  const score=Math.round(goalProgress*.3+consistency*.3+(readiness||70)*.2+(tests.length?10:0)+(comps.length?10:0));
  return {id:a.id,name:a.name,sport:a.sport,position:a.position,team:a.team,goals:goals.length,workouts:done,tests:tests.length,competitions:comps.length,readiness,score:Math.max(0,Math.min(100,score))};
 };

 const summaries=all.map(readSummary);
 const teams=[...new Set(all.map(a=>a.team).filter(Boolean))];
 const avgScore=summaries.length?Math.round(summaries.reduce((a,x)=>a+x.score,0)/summaries.length):0;
 const totalTests=summaries.reduce((a,x)=>a+x.tests,0);
 const totalCompetitions=summaries.reduce((a,x)=>a+x.competitions,0);
 const rankedRoster=summaries.slice().sort((a,b)=>b.score-a.score);
 const rosterLeader=rankedRoster[0];
 const rosterNeedsAttention=rankedRoster.filter(x=>x.score<60).length;
 const rosterReady=rankedRoster.filter(x=>x.readiness>=75).length;
 const teamNames=["All",...new Set(all.map(a=>a.team).filter(Boolean))];
 const filteredRoster=teamFilter==="All"?summaries:summaries.filter(x=>x.team===teamFilter);
 const teamSummaries:TeamSummary[]=teamNames.filter(x=>x!=="All").map(team=>{
   const members=summaries.filter(x=>x.team===team);
   return {
     team,
     athletes:members.length,
     avgScore:members.length?Math.round(members.reduce((a,x)=>a+x.score,0)/members.length):0,
     ready:members.filter(x=>x.readiness>=75).length,
     tests:members.reduce((a,x)=>a+x.tests,0),
     competitions:members.reduce((a,x)=>a+x.competitions,0)
   };
 });



 const aSummary=summaries.find(x=>x.id===compareA);
 const bSummary=summaries.find(x=>x.id===compareB);

 useEffect(()=>{if(!summaries.some(x=>x.id===compareA))setCompareA(activeAthleteId);if(compareB&&!summaries.some(x=>x.id===compareB))setCompareB("")},[roster.length,activeAthleteId]);

 return <><div className="hero"><small>PHASE 62 · TEAM DASHBOARD</small><h1>Roster</h1><p>Coach and parent overview for multiple athletes, quick switching, and side-by-side comparison.</p></div>
 
 
 <div className="rosterCoachStrip">
  <div><small>TOP MOMENTUM</small><b>{rosterLeader?.name||"—"}</b><span>{rosterLeader?rosterLeader.score+" score":"No data"}</span></div>
  <div><small>READY TO TRAIN</small><b>{rosterReady}</b><span>75+ readiness</span></div>
  <div><small>NEEDS ATTENTION</small><b>{rosterNeedsAttention}</b><span>under 60 score</span></div>
  <div><small>ROSTER SIZE</small><b>{summaries.length}</b><span>athletes</span></div>
 </div>
 

 <div className="grid three">
  <div className="stat"><small>Athletes</small><b>{all.length}</b></div>
  <div className="stat"><small>Roster Avg Score</small><b>{avgScore}</b></div>
  <div className="stat"><small>Teams</small><b>{teams.length}</b></div>
 </div>

 
 <div className="card compactTools"><div className="sectionHead"><div><h2>Team & Comparison Tools</h2><small>Optional roster analysis</small></div><button className="featureAction" onClick={()=>setShowRosterTools(x=>!x)}>{showRosterTools?"Hide":"Show"}</button></div></div>
 {showRosterTools&&<><div className="card"><div className="sectionHead"><h2>Team Overview</h2><label className="inlineFilter">Team<select value={teamFilter} onChange={e=>setTeamFilter(e.target.value)}>{teamNames.map(x=><option key={x}>{x}</option>)}</select></label></div>
 {teamSummaries.length===0?<p>Add team names to athlete profiles to build team summaries.</p>:<div className="teamSummaryGrid">{teamSummaries.map(t=><div className="teamSummaryCard" key={t.team}><small>TEAM</small><h2>{t.team}</h2><div className="miniTeamStats"><span><b>{t.athletes}</b><small>Athletes</small></span><span><b>{t.avgScore}</b><small>Avg Score</small></span><span><b>{t.ready}</b><small>Ready</small></span><span><b>{t.tests}</b><small>Tests</small></span></div></div>)}</div>}
 </div>
 <div className="card"><div className="sectionHead"><h2>Roster Overview</h2><span className="tag">{filteredRoster.length} shown</span></div><div className="rosterOverviewGrid">{filteredRoster.map(a=><div className={"rosterSummaryCard "+(activeAthleteId===a.id?"activeRoster":"")} key={a.id}>
  <div className="rosterSummaryTop"><div className="rosterAvatar">{a.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()||"A"}</div><div><b>{a.name}</b><small>{a.sport}{a.position?" · "+a.position:""}{a.team?" · "+a.team:""}</small></div><strong>{a.score}</strong></div>
  <div className="rosterMetrics"><span><small>Tests</small><b>{a.tests}</b></span><span><small>Workouts</small><b>{a.workouts}</b></span><span><small>Games</small><b>{a.competitions}</b></span><span><small>Readiness</small><b>{a.readiness||"—"}</b></span></div>
  <button className={activeAthleteId===a.id?"primary":""} onClick={()=>{const record=all.find(x=>x.id===a.id);if(record)activate(record)}}>{activeAthleteId===a.id?"Active Athlete":"Switch Athlete"}</button>
 </div>)}</div></div>

 <div className="card"><h2>Compare Athletes</h2><div className="two"><label>Athlete A<select value={compareA} onChange={e=>setCompareA(e.target.value)}>{summaries.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></label><label>Athlete B<select value={compareB} onChange={e=>setCompareB(e.target.value)}><option value="">Select athlete</option>{summaries.filter(x=>x.id!==compareA).map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></label></div>
 {aSummary&&bSummary?<div className="athleteCompare">
  <div><b>{aSummary.name}</b><span><small>Score</small><strong>{aSummary.score}</strong></span><span><small>Tests</small><strong>{aSummary.tests}</strong></span><span><small>Workouts</small><strong>{aSummary.workouts}</strong></span><span><small>Competitions</small><strong>{aSummary.competitions}</strong></span><span><small>Readiness</small><strong>{aSummary.readiness||"—"}</strong></span></div>
  <div><b>{bSummary.name}</b><span><small>Score</small><strong>{bSummary.score}</strong></span><span><small>Tests</small><strong>{bSummary.tests}</strong></span><span><small>Workouts</small><strong>{bSummary.workouts}</strong></span><span><small>Competitions</small><strong>{bSummary.competitions}</strong></span><span><small>Readiness</small><strong>{bSummary.readiness||"—"}</strong></span></div>
 </div>:<p>Select a second athlete to compare performance activity.</p>}</div>

 </>}
 <div className="card rosterAddCard setupAnchor" id="roster-add-athlete" tabIndex={-1}><div className="sectionHead"><h2>Add Player</h2><span className="tag">New Athlete</span></div><p className="rosterAddIntro">Create a separate athlete profile with sport-specific position, team, measurements, and handedness.</p>
  <div className="two">
   <label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Athlete name"/></label>
   <label>Sport<select value={newSport} onChange={e=>{const v=e.target.value as Sport;setNewSport(v);setPosition("")}}>{["Baseball","Football","Ice Hockey","Basketball","Lacrosse","Wrestling","Soccer"].map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Position<select value={positions[newSport].includes(position)?position:""} onChange={e=>setPosition(e.target.value)}><option value="">Select position</option>{positions[newSport].map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Team<input value={team} onChange={e=>setTeam(e.target.value)} placeholder="Team"/></label>
   <label>Season<input value={season} onChange={e=>setSeason(e.target.value)}/></label>
   <label>Height<input value={height} onChange={e=>setHeight(e.target.value)} placeholder="e.g. 5'10&quot;"/></label>
   <label>Weight<input value={weight} onChange={e=>setWeight(e.target.value)} placeholder="e.g. 165 lb"/></label>
   <label>Handedness<select value={handedness} onChange={e=>setHandedness(e.target.value as "Right"|"Left")}><option>Right</option><option>Left</option></select></label>
  </div>
  <button className="primary" onClick={add}>Create Player Profile</button>
 </div>

 <div className="card rosterManagementCard"><div className="sectionHead rosterManagementHead"><h2>Roster Management</h2><button className="featureAction rosterManagementAdd" onClick={scrollToAddAthlete}>＋ Add Player</button></div>
  <div className="rosterGrid">{all.map(a=><div className={"rosterCard "+(activeAthleteId===a.id?"activeRoster":"")} key={a.id}>
   <div className="rosterAvatar">{a.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()||"A"}</div>
   <div><b>{a.name}</b><small>{a.sport}{a.position?" · "+a.position:""}{a.team?" · "+a.team:""}</small><small>{a.height||"—"} · {a.weight||"—"} · {a.handedness}</small></div>
   <div className="rosterCardActions"><button onClick={()=>activate(a)}>{activeAthleteId===a.id?"Active":"Switch"}</button><button className="rosterEditButton" onClick={()=>editAthlete(a)}>Edit</button>{a.id!=="primary"&&<button onClick={()=>setRoster(x=>x.filter(r=>r.id!==a.id))}>Remove</button>}</div>
  </div>)}</div>
 </div>

 <div className="grid three">
  <div className="stat"><small>Total Tests</small><b>{totalTests}</b></div>
  <div className="stat"><small>Total Competitions</small><b>{totalCompetitions}</b></div>
  <div className="stat"><small>Active Athlete</small><b>{profile.name}</b></div>
 </div>

 <div className="card"><h2>Athlete Data Isolation</h2><p>Each athlete keeps independent goals, workouts, testing history, development plans, readiness logs, competitions, reports, test targets, and weekly reviews.</p></div>
 </>;
}

function DataCenter({profile,sport,roster,activeAthleteId,goals,workouts,results,dev,program,readiness,coachNotes,competitions,reportNotes,setProfile,setGoals,setWorkouts,setResults,setDev,setProgram,setReadiness,setCoachNotes,setCompetitions,setReportNotes,setRoster,setActiveAthleteId,setSport}:{profile:Profile;sport:Sport;roster:AthleteRecord[];activeAthleteId:string;goals:Goal[];workouts:Workout[];results:Result[];dev:DevelopmentItem[];program:TrainingProgram|null;readiness:ReadinessLog[];coachNotes:CoachNote[];competitions:CompetitionLog[];reportNotes:ReportNote[];setProfile:React.Dispatch<React.SetStateAction<Profile>>;setGoals:any;setWorkouts:any;setResults:any;setDev:any;setProgram:any;setReadiness:any;setCoachNotes:any;setCompetitions:any;setReportNotes:any;setRoster:any;setActiveAthleteId:any;setSport:any}){
 const [message,setMessage]=useState("");
 const dataSchemaVersion="1.0";
 const migrateLegacyData=()=>{
  try{
   const legacyRaw=localStorage.getItem("athleteData");
   if(legacyRaw&&!localStorage.getItem(`athleteData:${activeAthleteId}`)){
    localStorage.setItem(`athleteData:${activeAthleteId}`,legacyRaw);
    setMessage("Legacy athlete data migrated into the active athlete workspace.");
   }else{
    setMessage("No legacy migration is needed.");
   }
  }catch{setMessage("Legacy data migration could not be completed.");}
 };
 const repairActiveIndex=()=>{
  try{
   localStorage.setItem("activeAthleteId",activeAthleteId);
   setMessage("Active athlete index repaired.");
  }catch{setMessage("Could not repair active athlete index.");}
 };

 const lastSavedLabel="Automatic local save active";
 const currentSnapshot:AthleteSnapshot={profile:{...profile},goals:[...goals],workouts:[...workouts],results:[...results],development:[...dev],program,readiness:[...readiness],coachNotes:[...coachNotes],competitions:[...competitions],reportNotes:[...reportNotes]};

 const athleteRecords:AthleteRecord[]=[
  {id:"primary",name:profile.name,sport,position:profile.position,team:profile.team,season:profile.season,height:profile.height,weight:profile.weight,handedness:profile.handedness},
  ...roster.filter(r=>r.id!=="primary")
 ];

 const download=(name:string,data:any)=>{
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
 };

 const exportCurrent=()=>{
  download(`athlete-${profile.name.replace(/\s+/g,"-").toLowerCase()}-backup.json`,{version:"14.0",created:new Date().toISOString(),athleteId:activeAthleteId,sport,snapshot:currentSnapshot});
  setMessage("Current athlete backup created.");
 };

 const exportAll=()=>{
  const athletes:Record<string,AthleteSnapshot>={};
  athleteRecords.forEach(a=>{
    try{
      const raw=localStorage.getItem(`athleteData:${a.id}`);
      athletes[a.id]=raw?JSON.parse(raw):a.id===activeAthleteId?currentSnapshot:{profile:{name:a.name,position:a.position,team:a.team,season:a.season,height:a.height,weight:a.weight,handedness:a.handedness},goals:[],workouts:[],results:[],development:[],program:null,readiness:[],coachNotes:[],competitions:[],reportNotes:[]};
    }catch{
      athletes[a.id]=currentSnapshot;
    }
  });
  const envelope:BackupEnvelope={version:"14.0",created:new Date().toISOString(),activeAthleteId,roster:athleteRecords,athletes};
  download("athlete-performance-full-backup.json",envelope);
  setMessage("Full roster backup created.");
 };

 const applySnapshot=(snap:AthleteSnapshot)=>{
  const safe=snap||({} as AthleteSnapshot);
  setProfile({name:safe.profile?.name??"Athlete",position:safe.profile?.position??"",team:safe.profile?.team??"",season:safe.profile?.season??"2026-27",height:safe.profile?.height??"",weight:safe.profile?.weight??"",handedness:safe.profile?.handedness==="Left"?"Left":"Right"});
  setGoals(Array.isArray(safe.goals)?safe.goals:[]);
  setWorkouts(Array.isArray(safe.workouts)?safe.workouts:[]);
  setResults(Array.isArray(safe.results)?safe.results:[]);
  setDev(Array.isArray(safe.development)?safe.development:[]);
  setProgram(safe.program??null);
  setReadiness(Array.isArray(safe.readiness)?safe.readiness:[]);
  setCoachNotes(Array.isArray(safe.coachNotes)?safe.coachNotes:[]);
  setCompetitions(Array.isArray(safe.competitions)?safe.competitions:[]);
  setReportNotes(Array.isArray(safe.reportNotes)?safe.reportNotes:[]);
 };

 const importBackup=(file:File)=>{
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(String(reader.result||"{}"));
      if(data?.athletes&&data?.roster){
        const env=data as BackupEnvelope;
        Object.entries(env.athletes).forEach(([id,snap])=>localStorage.setItem(`athleteData:${id}`,JSON.stringify(snap)));
        const restoredRoster=(env.roster||[]).filter(r=>r.id!=="primary");
        setRoster(restoredRoster);
        const nextId=env.activeAthleteId||"primary";
        setActiveAthleteId(nextId);
        const snap=env.athletes[nextId]||env.athletes["primary"];
        if(snap){applySnapshot(snap);const rec=(env.roster||[]).find(r=>r.id===nextId);if(rec)setSport(rec.sport);}
        setMessage("Full backup restored.");
      }else if(data?.snapshot){
        applySnapshot(data.snapshot);
        localStorage.setItem(`athleteData:${activeAthleteId}`,JSON.stringify(data.snapshot));
        if(data.sport)setSport(data.sport);
        setMessage("Athlete backup restored.");
      }else{
        setMessage("That file is not a valid Athlete Performance backup.");
      }
    }catch{
      setMessage("Could not read the backup file.");
    }
  };
  reader.readAsText(file);
 };

 const clearCurrent=()=>{
  if(!confirm(`Clear all saved performance data for ${profile.name}? This cannot be undone unless you have a backup.`))return;
  const blank:AthleteSnapshot={profile:{...profile},goals:[],workouts:[],results:[],development:[],program:null,readiness:[],coachNotes:[],competitions:[],reportNotes:[]};
  applySnapshot(blank);
  localStorage.setItem(`athleteData:${activeAthleteId}`,JSON.stringify(blank));
  setMessage("Current athlete performance data cleared.");
 };

 const totalItems=goals.length+workouts.length+results.length+dev.length+readiness.length+coachNotes.length+competitions.length+reportNotes.length+(program?.sessions.length||0);
 const healthLabel=totalItems>50?"Rich history":totalItems>15?"Growing":"Getting started";
 const healthChecks:DataHealthCheck[]=[
  {label:"Athlete profile",ok:Boolean(profile.name),detail:profile.name?"Profile is readable.":"Athlete name is missing."},
  {label:"Goals data",ok:Array.isArray(goals),detail:`${goals.length} goals available.`},
  {label:"Workout data",ok:Array.isArray(workouts),detail:`${workouts.length} workouts available.`},
  {label:"Testing data",ok:Array.isArray(results),detail:`${results.length} results available.`},
  {label:"Competition data",ok:Array.isArray(competitions),detail:`${competitions.length} competitions available.`},
  {label:"Roster data",ok:Array.isArray(roster),detail:`${roster.length+1} athlete workspace${roster.length?"s":""}.`}
 ];
 const healthyChecks=healthChecks.filter(x=>x.ok).length;


 return <><div className="sectionDivider"><span><i/>Data & Backup</span></div><div className="hero phase38Hero"><small>PHASE 68 · DATA RECOVERY</small><h1>Backup & Restore</h1><p>Protect athlete data before changing devices, browsers, or future app versions.</p></div>

 <div className="saveStatus"><span className="saveDot"/><div><b>{lastSavedLabel}</b><small>Schema v{dataSchemaVersion} · Per-athlete storage enabled</small></div></div>
 <div className="grid three">
  <div className="stat"><small>Active Athlete</small><b>{profile.name}</b></div>
  <div className="stat"><small>Saved Data Items</small><b>{totalItems}</b><span>{healthLabel}</span></div>
  <div className="stat"><small>Roster Athletes</small><b>{athleteRecords.length}</b></div>
 </div>

 
 <div className="card"><div className="sectionHead"><h2>Recovery Tools</h2><span className="tag">PHASE 68</span></div><p>Use these tools if upgrading from an older local build or if the app opens the wrong athlete workspace.</p><div className="dataActions"><button onClick={migrateLegacyData}>Migrate Legacy Data</button><button onClick={repairActiveIndex}>Repair Active Athlete</button></div></div>
 <div className="card"><h2>Backup</h2><p>Download a portable JSON backup before major upgrades or switching devices.</p><div className="dataActions"><button className="primary" onClick={exportCurrent}>Backup Current Athlete</button><button onClick={exportAll}>Backup Entire Roster</button></div></div>

 <div className="card"><h2>Restore</h2><p>Restore a Phase 14 athlete or full-roster backup. Existing data for restored athletes will be replaced.</p><label className="filePicker">Choose Backup File<input type="file" accept=".json,application/json" onChange={e=>{const f=e.target.files?.[0];if(f)importBackup(f);e.currentTarget.value=""}}/></label></div>

 
 <div className="card"><div className="sectionHead"><h2>Integrity Check</h2><span className="tag">{healthyChecks}/{healthChecks.length} healthy</span></div><div className="healthChecks">{healthChecks.map(x=><div className={"healthCheck "+(x.ok?"ok":"bad")} key={x.label}><span>{x.ok?"✓":"!"}</span><div><b>{x.label}</b><small>{x.detail}</small></div></div>)}</div></div>
 <div className="card"><h2>Data Health</h2><div className="dataHealth">
  <span><b>{goals.length}</b><small>Goals</small></span>
  <span><b>{workouts.length}</b><small>Workouts</small></span>
  <span><b>{results.length}</b><small>Tests</small></span>
  <span><b>{competitions.length}</b><small>Competitions</small></span>
  <span><b>{readiness.length}</b><small>Readiness Logs</small></span>
  <span><b>{reportNotes.length}</b><small>Report Notes</small></span>
 </div></div>

 <div className="card dangerZone"><h2>Reset Current Athlete Data</h2><p>This keeps the athlete profile but clears performance history for the active athlete only.</p><button onClick={clearCurrent}>Clear Performance Data</button></div>

 {message&&<div className="dataMessage" role="status">{message}</div>}
 </>;
}


function SmartCoach({sport,profile,goals,workouts,results,dev,program,readiness,competitions}:{sport:Sport;profile:Profile;goals:Goal[];workouts:Workout[];results:Result[];dev:DevelopmentItem[];program:TrainingProgram|null;readiness:ReadinessLog[];competitions:CompetitionLog[]}){
 const sr=results.filter(r=>r.sport===sport),sw=workouts.filter(w=>w.sport===sport),sc=competitions.filter(c=>c.sport===sport);
 const done=sw.filter(w=>w.completed).length,consistency=sw.length?Math.round(done/sw.length*100):0;
 const goalProgress=goals.length?Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length):0;
 const recent=readiness.slice(0,7),avgReadiness=recent.length?Math.round(recent.reduce((a,r)=>a+Math.max(0,Math.min(100,Math.round(Math.min(10,r.sleep/8*10)*2.5+(10-Math.min(10,r.soreness))*2.5+Math.min(10,r.energy)*2.5+(10-Math.min(10,r.stress))*2.5))),0)/recent.length):0;
 const last7=sw.filter(w=>w.completed&&new Date(w.date).getTime()>=Date.now()-7*86400000);
 const prev7=sw.filter(w=>w.completed&&new Date(w.date).getTime()<Date.now()-7*86400000&&new Date(w.date).getTime()>=Date.now()-14*86400000);
 const load=(rows:Workout[])=>rows.reduce((a,w)=>a+w.minutes*(w.rpe||({Easy:4,Moderate:6,Hard:8}[w.intensity||"Moderate"])),0);
 const currentLoad=Math.round(load(last7)),previousLoad=Math.round(load(prev7));
 const loadChange=previousLoad?Math.round((currentLoad-previousLoad)/previousLoad*100):0;
 const highRisk=(avgReadiness>0&&avgReadiness<55)||(previousLoad>0&&loadChange>35);
 const moderateRisk=!highRisk&&((avgReadiness>0&&avgReadiness<70)||(previousLoad>0&&loadChange>20));
 const risk=highRisk?"High":moderateRisk?"Moderate":"Low";

 const grouped=[...new Map(sr.map(r=>[r.testId,r])).values()].map(g=>{const rows=sr.filter(r=>r.testId===g.testId).sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id),def=definitions(sport).find(x=>x.id===g.testId)||({lowerBetter:g.unit==="sec"} as TestDef),first=rows[0]?.value??0,last=rows[rows.length-1]?.value??0;return {name:g.name,imp:rows.length>1?improvement(first,last,def.lowerBetter):0,count:rows.length}});
 const recs:Recommendation[]=[];
 if(avgReadiness>0&&avgReadiness<60)recs.push({id:"recovery",title:"Prioritize Recovery",reason:`7-day readiness is ${avgReadiness}%.`,action:"Reduce volume and emphasize sleep, mobility, and low-intensity technique work.",priority:"High",category:"Recovery"});
 if(previousLoad>0&&loadChange>30)recs.push({id:"load",title:"Reduce Load Spike",reason:`7-day training load is ${loadChange}% higher than the prior week.`,action:"Hold intensity on key sessions but cut extra volume until readiness stabilizes.",priority:"High",category:"Training Load"});
 if(consistency<60&&sw.length>=3)recs.push({id:"training",title:"Improve Training Consistency",reason:`You completed ${done} of ${sw.length} planned workouts.`,action:"Simplify the week and prioritize 3 quality sessions.",priority:"High",category:"Training"});
 if(goalProgress<50&&goals.length)recs.push({id:"goals",title:"Refocus Your Goals",reason:`Average goal progress is ${goalProgress}%.`,action:"Pick one short-term goal and connect the next 2–3 workouts to it.",priority:"Medium",category:"Goals"});
 const openDev=dev.filter(d=>d.status!=="Complete").sort((a,b)=>({High:0,Medium:1,Low:2}[a.priority||"Medium"])-({High:0,Medium:1,Low:2}[b.priority||"Medium"]));
 if(openDev.length)recs.push({id:"dev",title:"Target Development Priority",reason:`${openDev.length} objective${openDev.length===1?"":"s"} remain open.`,action:`Make "${openDev[0].title}" the primary technical focus this week.`,priority:"Medium",category:"Development"});
 const declining=grouped.filter(g=>g.count>=2&&g.imp<0).sort((a,b)=>a.imp-b.imp)[0];if(declining)recs.push({id:"decline",title:`Address ${declining.name}`,reason:`This test is ${Math.abs(declining.imp)}% below baseline.`,action:"Review recent training load and add one focused session for this quality.",priority:"High",category:"Testing"});
 const improving=grouped.filter(g=>g.count>=2&&g.imp>0).sort((a,b)=>b.imp-a.imp)[0];if(improving)recs.push({id:"improve",title:`Keep Building ${improving.name}`,reason:`You are ${improving.imp}% better than baseline.`,action:"Keep the methods that are working and retest on the same schedule.",priority:"Low",category:"Testing"});
 if(program&&program.sessions.length&&program.sessions.filter(x=>x.completed).length/program.sessions.length<0.5)recs.push({id:"program",title:"Finish Your Weekly Program",reason:"Less than half of the current program is complete.",action:"Complete the next scheduled session before adding more volume.",priority:"Medium",category:"Program"});
 if(sc.length>=3){const rating=Math.round(sc.reduce((a,c)=>a+c.rating,0)/sc.length*10)/10;if(rating<6.5)recs.push({id:"comp",title:"Review Competition Performance",reason:`Average competition rating is ${rating}/10.`,action:"Review the last 3 competition notes and turn one repeat issue into a development objective.",priority:"Medium",category:"Competition"})}
 if(!recs.length)recs.push({id:"steady",title:"Stay the Course",reason:"No major warning area appears in the current data.",action:"Continue the program, keep logging readiness, and retest key measures regularly.",priority:"Low",category:"Overall"});
 const order={High:0,Medium:1,Low:2};recs.sort((a,b)=>order[a.priority]-order[b.priority]);

 const score=Math.max(0,Math.min(100,Math.round(goalProgress*.25+consistency*.25+(avgReadiness||70)*.25+(grouped.length?25:12))));
 const todayPlan=risk==="High"
   ?["Recovery / mobility","Low-intensity skill work","No extra conditioning"]
   :risk==="Moderate"
   ?["Keep planned quality work","Reduce optional volume","Recheck readiness tomorrow"]
   :["Proceed with planned training","Push quality on priority objective","Recover well after session"];

 
 const topPriority=openDev[0]?.title||"General athletic development";
 const weeklyPlan:WeeklyPlanItem[]=[
  {day:"Day 1",focus:"Quality",action:risk==="High"?"Recovery + technical work":`Primary session: ${topPriority}`,priority:risk==="High"?"Low":"High"},
  {day:"Day 2",focus:"Recovery",action:"Mobility, sleep, hydration, easy skill work",priority:"Medium"},
  {day:"Day 3",focus:"Development",action:declining?`Address ${declining.name}`:`Continue ${topPriority}`,priority:"High"},
  {day:"Day 4",focus:"Recovery",action:"Low load or complete rest based on readiness",priority:"Medium"},
  {day:"Day 5",focus:"Competition Prep",action:sc.length?"Review recent competition notes":"Skill quality + confidence work",priority:"Medium"}
 ];
return <><div className="sectionDivider"><span><i/>Coach Recommendations</span></div><div className="hero"><small>PHASE 53 · COACH WEEKLY PLAN</small><h1>Smart Coach</h1><p>{profile.name} · {sport}{profile.position?" · "+profile.position:""} · Readiness, training load, goals, testing, and competition in one coaching view.</p></div>

 <div className="coachHero"><div><small>COACHING SCORE</small><strong>{score}</strong><span>/100</span></div><div><b>{score>=80?"Strong Momentum":score>=60?"Good Base — Keep Building":"Focus Needed"}</b><p>Based on goals, training consistency, readiness, and testing activity.</p></div></div>

 <div className="grid three">
  <div className="stat"><small>7-Day Load</small><b>{currentLoad}</b><span>AU</span></div>
  <div className="stat"><small>Load Change</small><b className={loadChange>25?"bad":"good"}>{previousLoad?(loadChange>=0?"+":"")+loadChange+"%":"—"}</b></div>
  <div className="stat"><small>Training Risk</small><b className={risk==="High"?"bad":risk==="Low"?"good":""}>{risk}</b></div>
 </div>

 <div className="card coachPrescription"><div className="sectionHead"><h2>Today's Training Prescription</h2><span className={"tag "+risk.toLowerCase()}>{risk} Risk</span></div>{todayPlan.map(x=><div className="prescriptionRow" key={x}>✓ {x}</div>)}</div>

 <div className="grid three"><div className="stat"><small>Goal Progress</small><b>{goalProgress}%</b></div><div className="stat"><small>Training Consistency</small><b>{consistency}%</b></div><div className="stat"><small>7-Day Readiness</small><b>{avgReadiness||"—"}</b></div></div>

 
 <div className="card"><div className="sectionHead"><h2>Weekly Coaching Plan</h2><span className="tag">{risk} Risk</span></div><div className="weeklyPlan">{weeklyPlan.map(x=><div className="weeklyPlanRow" key={x.day}><span>{x.day}</span><div><b>{x.focus}</b><small>{x.action}</small></div><em className={x.priority.toLowerCase()}>{x.priority}</em></div>)}</div></div>
 <div className="card"><h2>Recommended Next Actions</h2><div className="recommendationList">{recs.map(r=><div className={"recommendation "+r.priority.toLowerCase()} key={r.id}><div className="recPriority">{r.priority}</div><div><span className="tag">{r.category}</span><h2>{r.title}</h2><p><b>Why:</b> {r.reason}</p><p><b>Next step:</b> {r.action}</p></div></div>)}</div></div>

 <div className="grid twoCards"><div className="card"><h2>What Is Improving</h2>{improving?<><b>{improving.name}</b><p>{improving.imp}% improvement from baseline.</p></>:<p>Log repeated tests to identify your strongest trend.</p>}</div><div className="card"><h2>What Needs Attention</h2>{declining?<><b>{declining.name}</b><p>{Math.abs(declining.imp)}% below baseline.</p></>:<p>No declining repeated-test trend detected.</p>}</div></div>

 <div className="card"><h2>Coach Checklist</h2><div className="coachChecklist"><span>✓ Keep tests consistent.</span><span>✓ Use readiness before high-intensity training.</span><span>✓ Watch week-to-week training-load spikes.</span><span>✓ Link workouts to the highest-priority development objective.</span><span>✓ Review competition notes before changing the plan.</span></div></div></>;
}

function TrendChart({values,lower}:{values:number[];lower:boolean}){const w=520,h=150,p=24,min=Math.min(...values),max=Math.max(...values),span=max-min||1;const pts=values.map((v,i)=>`${p+i*((w-2*p)/Math.max(1,values.length-1))},${h-p-((v-min)/span)*(h-2*p)}`).join(" ");return <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Performance trend"><line x1={p} y1={h-p} x2={w-p} y2={h-p} stroke="currentColor" opacity=".2"/><polyline points={pts} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>{values.map((v,i)=>{const x=p+i*((w-2*p)/Math.max(1,values.length-1)),y=h-p-((v-min)/span)*(h-2*p);return <circle key={i} cx={x} cy={y} r="5" fill="currentColor"/>})}</svg>}
