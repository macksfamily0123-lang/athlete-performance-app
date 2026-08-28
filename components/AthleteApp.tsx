
"use client";
import {useEffect,useMemo,useRef,useState} from "react";

type Sport="Baseball"|"Football"|"Ice Hockey"|"Basketball"|"Lacrosse"|"Wrestling"|"Soccer"|"Figure Skating";
type TestDef={id:string;name:string;category:string;unit:string;lowerBetter:boolean};
type CustomTest=TestDef&{sport:Sport};
type Result={id:number;testId:string;name:string;category:string;unit:string;value:number;date:string;sport:Sport};
type Goal={id:number;title:string;progress:number;type:"Short-term"|"Mid-term"|"Long-term";category?:string;deadline?:string;target?:string;linkedTestId?:string;status?:"Active"|"Complete"|"Paused";notes?:string};
type RoutineReference={title:string;url:string;source:string;section?:string;matchNote:string;sport:Sport;positions:string[];ageMin:number;ageMax:number;offIce:boolean;exerciseNames:string[];durationMinutes?:number;durationLabel?:string;thumbnailUrl?:string};
type Workout={id:number;date:string;name:string;category:string;minutes:number;completed:boolean;sport:Sport;intensity?:"Easy"|"Moderate"|"Hard";rpe?:number;notes?:string;focus?:string;source?:"Generated"|"Verified Routine"|"Custom"|"Manual";exercises?:ProgramExercise[];referenceVideos?:RoutineReference[];supportVideos?:RoutineReference[];environment?:"Off-Ice";assignedByRole?:AccountRole};
type Profile={name:string;position:string;team:string;season:string;height:string;weight:string;handedness:"Right"|"Left";age?:string;sport?:Sport};
type DevelopmentItem={id:number,title:string,category:string,target:string,dueDate:string,status:"Not Started"|"In Progress"|"Complete";priority?:"High"|"Medium"|"Low";progress?:number;linkedGoalId?:number;notes?:string};
type ProgramExercise={phase:"Warm-up"|"Main"|"Sport"|"Finisher"|"Cooldown";name:string;sets:string;reps:string;rest:string;notes:string;instructions?:string};
type ProgramSession={id:number;day:string;name:string;category:string;minutes:number;focus:string;completed:boolean;exercises?:ProgramExercise[];referenceVideos?:RoutineReference[];supportVideos?:RoutineReference[];environment?:"Off-Ice"};

type TrainingProgram={id:number;created:string;sport:Sport;position:string;focus:string;daysPerWeek:number;sessions:ProgramSession[];equipment?:"Gym Access"|"Body Weight Only";age?:number;ageBand?:string;environment?:"Off-Ice";targetMinutes?:number;assignedByRole?:AccountRole};
type ReadinessLog={id:number;date:string;sleep:number;soreness:number;energy:number;stress:number;notes:string};
type CoachNote={id:number;date:string;title:string;note:string;category:string;authorType?:"Coach"|"Parent"|"Athlete"|"Medical Provider"|"Admin";authorName?:string;shared?:boolean};
type StatEntry={label:string;value:string};
type CompetitionLog={id:number;date:string;opponent:string;eventType:string;result:string;minutes:string;rating:number;notes:string;sport:Sport;stats:StatEntry[];location?:string;role?:string;keyWin?:string;improveNext?:string;confidence?:number};
type ReportNote={id:number;date:string;title:string;body:string};
type AthleteRecord={id:string;name:string;sport:Sport;position:string;team:string;season:string;height:string;weight:string;handedness:"Right"|"Left";age?:string};
type RosterSummary={id:string;name:string;sport:Sport;position:string;team:string;goals:number;workouts:number;tests:number;competitions:number;readiness:number;score:number};
type DailyLoad={date:string;label:string;load:number;workouts:number;events:number};
type QuickAction={id:string;label:string;tab:Tab;keywords:string[]};
type RecoveryFlag={label:string;value:string;status:"Good"|"Watch"|"Low"};
type PerformanceSignal={label:string;value:string;detail:string;tone:"good"|"watch"|"neutral"};
type SeasonMetric={label:string;value:number;display:string};
type BenchmarkBand={label:string;min?:number;max?:number};
type WeeklyPlanItem={day:string;focus:string;action:string;priority:"High"|"Medium"|"Low"};
type Tab="Home"|"Goals"|"Calendar"|"Testing"|"Analytics"|"Coach"|"Development"|"Competition"|"Roster";
type WorkspaceRole="Athlete"|"Coach"|"Parent";
type AccountRole="Player"|"Coach"|"Parent"|"Admin";
type TextSize="standard"|"comfortable"|"large"|"xlarge";
export type BetaRole=AccountRole;
type AccountSession={role:AccountRole;displayName:string;athleteId:string;linkedAthleteIds?:string[]};
export type CoachCloudAthleteState={
 athleteId:string;
 workspaceId:string;
 name:string;
 sport:string;
 position:string;
 team:string;
 data:Record<string,unknown>|null;
 updatedAt?:string;
};
export type BetaBridge={
 userId:string;
 email:string;
 workspaceId:string;
 session:AccountSession;
 loadState:()=>Promise<Record<string,unknown>|null>;
 saveState:(data:Record<string,unknown>)=>Promise<void>;
 loadCoachRosterStates?:()=>Promise<CoachCloudAthleteState[]>;
 selectCoachRosterAthlete?:(workspaceId:string)=>void;
 onSignOut:()=>Promise<void>|void;
 openFeedback?:()=>void;
 openParentPlayers?:()=>void;
 openPlayerJoinTeam?:()=>void;
 openCoachTeams?:()=>void;
 openBetaAdmin?:()=>void;
 returnToCoachWorkspace?:()=>void;
 selectedAthleteName?:string;
 selectedAthleteSport?:string;
 saveSharedNotes?:(notes:unknown[])=>Promise<void>;
 loadCoachWeeklyReviews?:()=>Promise<CoachWeeklyReview[]>;
 saveCoachWeeklyReview?:(review:CoachWeeklyReview)=>Promise<void>;
};

type ReminderItem={id:string;title:string;detail:string;date:string;kind:"Workout"|"Competition"|"Retest"|"Goal"|"Readiness";priority:"High"|"Normal"};
type DataHealthCheck={label:string;ok:boolean;detail:string};
type TeamSummary={team:string;athletes:number;avgScore:number;ready:number;tests:number;competitions:number};
type ShareSnapshot={athlete:string;sport:Sport;position:string;score:number;goalProgress:number;readiness:number;tests:number;competitions:number;generated:string};
type ActivityItem={id:string;date:string;kind:"Workout"|"Testing"|"Competition"|"Goal";title:string;detail:string};
type ReleaseCheck={label:string;done:boolean;detail:string};







type AthleteSnapshot={profile:Profile;goals:Goal[];workouts:Workout[];results:Result[];development:DevelopmentItem[];program:TrainingProgram|null;readiness:ReadinessLog[];coachNotes:CoachNote[];competitions:CompetitionLog[];reportNotes:ReportNote[];developmentSystem?:DevelopmentSystemState};
type BackupEnvelope={version:string;created:string;activeAthleteId:string;roster:AthleteRecord[];athletes:Record<string,AthleteSnapshot>};
type Achievement={id:string;title:string;description:string;category:string;earned:boolean;progress:number};
type Milestone={id:number;date:string;title:string;detail:string;category:string};
type Recommendation={id:string;title:string;reason:string;action:string;priority:"High"|"Medium"|"Low";category:string};
type WeeklyReview={id:number;weekStart:string;wins:string;challenges:string;focus:string;rating:number};
export type CoachWeeklyReview={
 id:string;
 weekStart:string;
 coachName:string;
 performance:number;
 effort:number;
 attitude:number;
 teamwork:number;
 coachability:number;
 leadership:number;
 strengths:string;
 developmentOpportunity:string;
 leadershipOpportunity:string;
 nextWeekFocus:string;
 coachMessage:string;
 shareWithPlayer:boolean;
 createdAt?:string;
 updatedAt?:string;
};
type TestTarget={id:string;testId:string;sport:Sport;target:string;retestDate:string;notes:string};
type TestProtocol={name:string;setup:string;instructions:string;quality:string};

type DevelopmentPillar="Movement"|"Sport Skill"|"Speed / Power"|"Strength"|"Conditioning"|"Decision-Making"|"Mental Performance"|"Recovery / Habits"|"Character / Leadership";
type SkillLevel="Needs Work"|"Developing"|"Consistent"|"Advanced";
type SeasonPhase="Off-season"|"Preseason"|"In-season"|"Championship"|"Transition / Recovery";
type SkillProgressEntry={level:SkillLevel;notes:string;videoUrl:string;updatedAt:string};
type TrainingReflection={id:number;date:string;workoutName:string;effort:number;quality:number;confidence:number;feltGood:string;needsWork:string};
type DevelopmentMeeting={id:number;date:string;progress:string;priority:string;playerVoice:string;coachPlan:string;parentSupport:string;nextGoal:string};
type PracticeObservation={id:number;date:string;coachName:string;context:"Practice"|"Game"|"Training";skill:string;level:SkillLevel;note:string;nextAction:string};
type DevelopmentSystemState={
 seasonPhase:SeasonPhase;
 pillarRatings:Partial<Record<DevelopmentPillar,number>>;
 skillProgress:Record<string,SkillProgressEntry>;
 foundationProgress:Record<string,boolean>;
 trainingReflections:TrainingReflection[];
 meetings:DevelopmentMeeting[];
 practiceObservations:PracticeObservation[];
};

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

type WorkoutDurationRule={min:number;max:number;step:number;label:string};
const workoutDurationRule=(age:number):WorkoutDurationRule=>{
 if(age<7)return {min:15,max:45,step:5,label:"Under 7 · 15–45 min · adult supervision"};
 if(age<=9)return {min:15,max:45,step:5,label:"Ages 7–9 · 15–45 min"};
 if(age<=12)return {min:30,max:75,step:5,label:"Ages 10–12 · 30–75 min"};
 return {min:30,max:120,step:5,label:"Ages 13+ · 30–120 min"};
};

const programmingAge=(chronologicalAge:number)=>chronologicalAge===9?10:chronologicalAge;
const programmingAgeGroup=(chronologicalAge:number)=>{
 if(chronologicalAge<=8)return "7–8 Fundamentals";
 if(chronologicalAge<=13)return chronologicalAge===9?"10–13 Development Group · age 9 included":"10–13 Development Group";
 if(chronologicalAge<=17)return "14–17 Advanced Youth";
 return "18+ Adult Performance";
};

const units=["sec","min","mph","km/h","in","ft","lb","kg","reps","yards","meters","points","%","Other"];
const competitionStatsFor=(sport:Sport,position:string):string[]=>{
 const p=(position||"").toLowerCase();
 if(sport==="Ice Hockey"){
  if(p.includes("goal"))return ["Shots Against","Saves","Goals Against","Shutouts","Penalty Minutes"];
  const common=["Goals","Assists","Shots","Hits","Blocked Shots","Takeaways","Penalty Minutes"];
  return p.includes("center")?[...common,"Faceoff Wins","Faceoff Attempts"]:common;
 }
 if(sport==="Baseball"){
  if(p.includes("pitcher"))return ["Innings Pitched","Pitches","Strikeouts","Walks Allowed","Hits Allowed","Runs Allowed","Earned Runs"];
  if(p.includes("catcher"))return ["Plate Appearances","Hits","Runs","RBI","Walks","Strikeouts","Caught Stealing","Passed Balls"];
  return ["Plate Appearances","Hits","Runs","RBI","Walks","Strikeouts","Stolen Bases","Putouts","Assists","Errors"];
 }
 if(sport==="Football"){
  if(p.includes("quarterback"))return ["Pass Attempts","Completions","Pass Yards","Pass TD","Interceptions","Rush Yards","Rush TD"];
  if(p.includes("running back")||p.includes("fullback"))return ["Carries","Rush Yards","Rush TD","Targets","Receptions","Receiving Yards","Receiving TD","Fumbles"];
  if(p.includes("wide receiver")||p.includes("tight end"))return ["Targets","Receptions","Receiving Yards","Receiving TD","Rush Yards","Rush TD","Fumbles"];
  if(p.includes("offensive line"))return ["Snaps","Pressures Allowed","Sacks Allowed","Penalties","Pancake Blocks"];
  if(p.includes("kicker"))return ["Field Goals Made","Field Goals Attempted","Extra Points Made","Extra Points Attempted","Kickoffs","Touchbacks"];
  if(p.includes("punter"))return ["Punts","Punt Yards","Inside 20","Touchbacks","Longest Punt"];
  if(p.includes("long snapper"))return ["Snaps","Accurate Snaps","Tackles","Penalties"];
  return ["Total Tackles","Solo Tackles","Tackles for Loss","Sacks","Pass Breakups","Interceptions","Forced Fumbles","Fumble Recoveries"];
 }
 if(sport==="Basketball"){
  if(p.includes("point guard")||p.includes("shooting guard"))return ["Points","Assists","Rebounds","Steals","Turnovers","3PT Made","3PT Attempts","Free Throws Made","Free Throws Attempted"];
  if(p.includes("center")||p.includes("power forward"))return ["Points","Rebounds","Offensive Rebounds","Assists","Blocks","Steals","Turnovers","Free Throws Made","Free Throws Attempted"];
  return ["Points","Rebounds","Assists","Steals","Blocks","Turnovers","3PT Made","3PT Attempts"];
 }
 if(sport==="Lacrosse"){
  if(p.includes("goalie"))return ["Shots Faced","Saves","Goals Allowed","Ground Balls","Clears Completed","Clears Attempted"];
  if(p.includes("faceoff"))return ["Faceoffs Won","Faceoffs Taken","Ground Balls","Goals","Assists","Shots"];
  if(p.includes("defense"))return ["Ground Balls","Caused Turnovers","Tackles / Checks","Takeaways","Turnovers","Clears Completed","Clears Attempted"];
  return ["Goals","Assists","Shots","Shots on Goal","Ground Balls","Caused Turnovers","Turnovers"];
 }
 if(sport==="Wrestling")return ["Takedowns","Takedown Attempts","Escapes","Reversals","Near Fall Points","Penalty Points","Match Points"];
 if(sport==="Soccer"){
  if(p.includes("goalkeeper"))return ["Shots Faced","Saves","Goals Allowed","Clean Sheets","Claims / Catches","Successful Distributions","Distribution Attempts"];
  if(p.includes("back")||p.includes("defensive"))return ["Tackles","Interceptions","Clearances","Blocks","Duels Won","Passes Completed","Passes Attempted","Assists"];
  if(p.includes("midfielder"))return ["Goals","Assists","Shots","Chances Created","Passes Completed","Passes Attempted","Tackles","Interceptions"];
  return ["Goals","Assists","Shots","Shots on Target","Chances Created","Duels Won","Passes Completed","Passes Attempted"];
 }
 if(sport==="Figure Skating"){
  if(p.includes("ice dance"))return ["Total Score","Technical Element Score","Program Component Score","Rhythm Dance Score","Free Dance Score","Deductions"];
  if(p.includes("pairs"))return ["Total Score","Technical Element Score","Program Component Score","Jumps Landed","Throws Landed","Lifts Completed","Deductions"];
  if(p.includes("synchronized"))return ["Total Score","Technical Element Score","Program Component Score","Elements Completed","Level 4 Elements","Deductions"];
  return ["Total Score","Technical Element Score","Program Component Score","Jumps Landed","Spins Completed","Step Sequences Completed","Deductions"];
 }
 return [];
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
 Soccer:[["10-yard sprint","Speed","sec","1"],["20-yard sprint","Speed","sec","1"],["5-10-5 shuttle","Agility","sec","1"],["Vertical jump","Power","in","0"],["Broad jump","Power","in","0"]],
 "Figure Skating":[["Single-leg balance","Skill","sec","0"],["Vertical jump","Power","in","0"],["Broad jump","Power","in","0"],["30-second jump count","Endurance","reps","0"],["Spin rotations","Skill","reps","0"],["Edge control course","Agility","sec","1"]]
};
const definitions=(sport:Sport):TestDef[]=>raw[sport].map((x,i)=>({id:`${sport}-${i}`,name:x[0],category:x[1],unit:x[2],lowerBetter:x[3]==="1"}));
const localDate=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const today=()=>localDate();
const daysAgo=(n:number)=>{const d=new Date();d.setDate(d.getDate()-n);return localDate(d)};
const mondayOfWeek=(d=new Date())=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return localDate(x)};
const friendlyDate=(iso:string)=>{const [y,m,d]=iso.split("-").map(Number);return new Date(y,m-1,d).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})};
const improvement=(first:number,last:number,lower:boolean)=>first===0?0:Math.round((lower?(first-last)/first:(last-first)/first*100)*10)/10;
const pct=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));

const readinessSleepTarget=(age:number)=>{
 if(Number.isFinite(age)&&age>=6&&age<=12)return {min:9,max:12,label:"9–12 hours"};
 if(Number.isFinite(age)&&age>=13&&age<=18)return {min:8,max:10,label:"8–10 hours"};
 return {min:7,max:9,label:"7–9 hours"};
};
const readinessReverseRating=(value:number)=>{
 if(!Number.isFinite(value)||value<=0)return 0;
 const v=Math.max(1,Math.min(10,value));
 return Math.max(0,Math.min(10,10-((v-1)*10/9)));
};
const readinessBreakdown=(r:ReadinessLog,age:number)=>{
 const target=readinessSleepTarget(age);
 const sleep=Math.max(0,Math.min(100,(Math.max(0,r.sleep)/target.min)*100));
 const energy=Math.max(0,Math.min(100,(Math.max(0,Math.min(10,r.energy))/10)*100));
 const soreness=readinessReverseRating(r.soreness)*10;
 const stress=readinessReverseRating(r.stress)*10;
 return {sleep:Math.round(sleep),energy:Math.round(energy),soreness:Math.round(soreness),stress:Math.round(stress),target};
};
const readinessScoreV2=(r:ReadinessLog,age:number)=>{
 const x=readinessBreakdown(r,age);
 return Math.max(0,Math.min(100,Math.round((x.sleep+x.energy+x.soreness+x.stress)/4)));
};
const readinessStatus=(score:number)=>score>=80?"Ready":score>=60?"Building":score>0?"Recovery Focus":"No Data";

const developmentPillars:DevelopmentPillar[]=[
 "Movement","Sport Skill","Speed / Power","Strength","Conditioning","Decision-Making","Mental Performance","Recovery / Habits","Character / Leadership"
];

const pillarWhy:Record<DevelopmentPillar,string>={
 "Movement":"Movement quality supports safer, more efficient sprinting, landing, stopping, changing direction, and sport technique.",
 "Sport Skill":"Sport-specific skill is the athlete's ability to execute the techniques their position and sport require.",
 "Speed / Power":"Speed and power help turn strength and technique into fast, explosive sport actions.",
 "Strength":"Strength supports force production, body control, repeated effort, and resilience across every sport.",
 "Conditioning":"Conditioning helps the athlete repeat quality efforts and recover between demanding sport actions.",
 "Decision-Making":"Reading situations and choosing the right action helps physical skill transfer into competition.",
 "Mental Performance":"Focus, confidence, emotional control, and preparation help athletes perform skills under pressure.",
 "Recovery / Habits":"Sleep, recovery habits, consistency, and communication affect how well athletes adapt to training.",
 "Character / Leadership":"Effort, responsibility, communication, coachability, and leadership shape long-term development."
};

const sportSkillTrees:Record<Sport,string[]>={
 Baseball:["Throwing Mechanics","Fielding Footwork","Hitting Contact","Bat Speed / Power","Base Running","Game Awareness","Position-Specific Skill","Communication"],
 Football:["Position Footwork","Acceleration","Change of Direction","Ball Skills","Play Recognition","Blocking / Tackling Technique","Communication","Competitive Execution"],
 "Ice Hockey":["Skating & Edge Control","First-Step Acceleration","Puck Control","Passing & Receiving","Shooting","Defensive Awareness","Transition Decisions","Position-Specific Execution"],
 Basketball:["Ball Handling","Passing","Shooting","Finishing","Footwork","On-Ball Defense","Rebounding","Decision-Making"],
 Lacrosse:["Stick Skills","Passing & Catching","Shooting","Dodging","Ground Balls","Defensive Footwork","Transition Play","Decision-Making"],
 Wrestling:["Stance & Motion","Hand Fighting","Takedown Entries","Takedown Finishes","Defense & Sprawl","Mat Returns","Escapes & Reversals","Match Management"],
 Soccer:["First Touch","Passing","Dribbling","Finishing","Defending","Off-Ball Movement","Transition Decisions","Position-Specific Play"],
 "Figure Skating":["Edge Control","Turns & Steps","Jump Technique","Landing Control","Spins","Balance & Posture","Program Execution","Performance Quality"]
};

type DevelopmentStage="Foundation"|"Build"|"Performance";
type ProgressionLevel="Learn"|"Developing"|"Consistent"|"Game Ready"|"Advanced";

const developmentStageForAge=(age:number):DevelopmentStage=>{
 if(Number.isFinite(age)&&age>0&&age<=12)return "Foundation";
 if(Number.isFinite(age)&&age<=15)return "Build";
 return "Performance";
};
const stageMessage:Record<DevelopmentStage,{goal:string;pressure:string;parent:string}>={
 Foundation:{
  goal:"Learn clean movement and sport-skill patterns, build confidence, and accumulate quality repetitions.",
  pressure:"Technique first. Add speed and light decision pressure only after the movement is controlled.",
  parent:"Praise effort, curiosity, and consistency. Keep the athlete excited to practice."
 },
 Build:{
  goal:"Make skills repeatable at useful speed, connect physical qualities to sport actions, and improve decisions.",
  pressure:"Progress from controlled repetitions to speed, light pressure, and realistic choices.",
  parent:"Support routines and recovery, and ask what the athlete is learning instead of coaching the technique."
 },
 Performance:{
  goal:"Execute reliable skills at competition speed under pressure, fatigue, and changing game situations.",
  pressure:"Use realistic constraints, decision-making, and competition-speed execution while protecting quality.",
  parent:"Help protect recovery and perspective. Let the athlete and Coach own technical and tactical decisions."
 }
};

const positionSkillPriorities=(sport:Sport,position:string):string[]=>{
 const p=(position||"").toLowerCase();
 const base=sportSkillTrees[sport];
 if(sport==="Ice Hockey"){
  if(p.includes("goal"))return ["Skating & Edge Control","Position-Specific Execution","Defensive Awareness","Transition Decisions","First-Step Acceleration"];
  if(p.includes("center"))return ["First-Step Acceleration","Passing & Receiving","Transition Decisions","Defensive Awareness","Puck Control"];
  if(p.includes("defense"))return ["Skating & Edge Control","Defensive Awareness","Passing & Receiving","Transition Decisions","Position-Specific Execution"];
  return ["First-Step Acceleration","Puck Control","Shooting","Passing & Receiving","Transition Decisions"];
 }
 if(sport==="Soccer"){
  if(p.includes("goalkeeper"))return ["Position-Specific Play","Defending","Passing","Decision-Making","Off-Ball Movement"];
  if(p.includes("back")||p.includes("defensive"))return ["Defending","Passing","First Touch","Off-Ball Movement","Transition Decisions"];
  if(p.includes("mid"))return ["First Touch","Passing","Off-Ball Movement","Transition Decisions","Dribbling"];
  return ["Finishing","Off-Ball Movement","First Touch","Dribbling","Transition Decisions"];
 }
 if(sport==="Basketball"){
  if(p.includes("guard"))return ["Ball Handling","Decision-Making","Passing","Shooting","On-Ball Defense"];
  if(p.includes("center")||p.includes("power"))return ["Rebounding","Finishing","Footwork","On-Ball Defense","Passing"];
  return ["Shooting","Finishing","Footwork","On-Ball Defense","Decision-Making"];
 }
 if(sport==="Football"){
  if(p.includes("quarterback"))return ["Play Recognition","Position Footwork","Ball Skills","Communication","Competitive Execution"];
  if(p.includes("receiver")||p.includes("tight"))return ["Position Footwork","Acceleration","Ball Skills","Play Recognition","Competitive Execution"];
  if(p.includes("line")||p.includes("tackle")||p.includes("guard"))return ["Position Footwork","Blocking / Tackling Technique","Play Recognition","Competitive Execution","Communication"];
  if(p.includes("defensive")||p.includes("linebacker")||p.includes("corner")||p.includes("safety"))return ["Play Recognition","Change of Direction","Blocking / Tackling Technique","Acceleration","Communication"];
  return ["Acceleration","Position Footwork","Play Recognition","Competitive Execution","Communication"];
 }
 if(sport==="Baseball"){
  if(p.includes("pitcher"))return ["Throwing Mechanics","Position-Specific Skill","Game Awareness","Fielding Footwork","Communication"];
  if(p.includes("catcher"))return ["Throwing Mechanics","Position-Specific Skill","Game Awareness","Fielding Footwork","Hitting Contact"];
  if(p.includes("field")||p.includes("base")||p.includes("short"))return ["Fielding Footwork","Throwing Mechanics","Game Awareness","Hitting Contact","Base Running"];
  return ["Hitting Contact","Bat Speed / Power","Fielding Footwork","Throwing Mechanics","Game Awareness"];
 }
 if(sport==="Lacrosse"){
  if(p.includes("goal"))return ["Position-Specific Execution","Decision-Making","Passing & Catching","Defensive Footwork","Transition Play"];
  if(p.includes("defense"))return ["Defensive Footwork","Ground Balls","Passing & Catching","Transition Play","Decision-Making"];
  if(p.includes("faceoff"))return ["Ground Balls","Position-Specific Execution","Decision-Making","Transition Play","Passing & Catching"];
  return ["Stick Skills","Dodging","Passing & Catching","Shooting","Decision-Making"];
 }
 if(sport==="Figure Skating"){
  if(p.includes("dance"))return ["Edge Control","Turns & Steps","Balance & Posture","Program Execution","Performance Quality"];
  if(p.includes("pair"))return ["Landing Control","Balance & Posture","Jump Technique","Program Execution","Performance Quality"];
  if(p.includes("synch"))return ["Edge Control","Turns & Steps","Program Execution","Balance & Posture","Performance Quality"];
  return ["Jump Technique","Landing Control","Spins","Edge Control","Program Execution"];
 }
 if(sport==="Wrestling")return ["Stance & Motion","Hand Fighting","Takedown Entries","Defense & Sprawl","Match Management"];
 return base.slice(0,5);
};

const progressionLevelFromSkill=(level:SkillLevel|undefined):ProgressionLevel=>{
 if(level==="Advanced")return "Advanced";
 if(level==="Consistent")return "Consistent";
 if(level==="Developing")return "Developing";
 return "Learn";
};
const nextProgressionLevel=(current:ProgressionLevel,stage:DevelopmentStage):ProgressionLevel=>{
 if(current==="Advanced")return "Advanced";
 if(current==="Learn")return "Developing";
 if(current==="Developing")return "Consistent";
 if(current==="Consistent")return stage==="Foundation"?"Game Ready":"Game Ready";
 return "Advanced";
};
const progressionExpectation=(stage:DevelopmentStage,next:ProgressionLevel)=>{
 if(next==="Developing")return "Show the skill with sound technique in controlled repetitions.";
 if(next==="Consistent")return "Repeat the skill with reliable quality at useful speed.";
 if(next==="Game Ready")return stage==="Foundation"?"Use the skill confidently in simple game-like situations.":"Execute the skill at realistic speed with pressure and decisions.";
 if(next==="Advanced")return "Adapt the skill under competition pressure, fatigue, and changing situations.";
 return "Maintain quality and help transfer the skill into competition.";
};

const testingEmphasisFor=(sport:Sport,position:string):string[]=>{
 const p=(position||"").toLowerCase();
 if(sport==="Ice Hockey")return p.includes("goal")?["Agility","Power","Strength"]:p.includes("center")?["Speed","Agility","Power"]:["Speed","Power","Agility"];
 if(sport==="Soccer")return p.includes("goalkeeper")?["Power","Agility","Speed"]:["Speed","Agility","Power"];
 if(sport==="Basketball")return ["Power","Agility","Speed"];
 if(sport==="Football")return p.includes("line")?["Strength","Power","Agility"]:["Speed","Power","Agility"];
 if(sport==="Baseball")return p.includes("pitcher")?["Power","Strength","Speed"]:["Speed","Power","Agility"];
 if(sport==="Lacrosse")return p.includes("goal")?["Agility","Power","Speed"]:["Speed","Agility","Power"];
 if(sport==="Wrestling")return ["Strength","Power","Speed"];
 return ["Power","Agility","Strength"];
};

const athleticFoundations=[
 "Sprint mechanics","Jump and produce force","Land under control","Decelerate safely",
 "Change direction","Balance and coordination","Basic strength patterns","Mobility and body control"
];

const createDefaultDevelopmentSystem=():DevelopmentSystemState=>({
 seasonPhase:"In-season",
 pillarRatings:{},
 skillProgress:{},
 foundationProgress:{},
 trainingReflections:[],
 meetings:[],
 practiceObservations:[]
});

const normalizeDevelopmentSystem=(raw:any):DevelopmentSystemState=>({
 seasonPhase:(["Off-season","Preseason","In-season","Championship","Transition / Recovery"] as SeasonPhase[]).includes(raw?.seasonPhase)?raw.seasonPhase:"In-season",
 pillarRatings:raw?.pillarRatings&&typeof raw.pillarRatings==="object"?raw.pillarRatings:{},
 skillProgress:raw?.skillProgress&&typeof raw.skillProgress==="object"?raw.skillProgress:{},
 foundationProgress:raw?.foundationProgress&&typeof raw.foundationProgress==="object"?raw.foundationProgress:{},
 trainingReflections:Array.isArray(raw?.trainingReflections)?raw.trainingReflections:[],
 meetings:Array.isArray(raw?.meetings)?raw.meetings:[],
 practiceObservations:Array.isArray(raw?.practiceObservations)?raw.practiceObservations:[]
});

const pillarAction=(pillar:DevelopmentPillar,sport:Sport)=>{
 const actions:Record<DevelopmentPillar,string>={
  "Movement":"Prioritize clean movement, landing, stopping, balance, and direction-change quality before adding more speed.",
  "Sport Skill":`Choose one ${sport} skill that matters most for the athlete's position and practice it with high-quality repetitions.`,
  "Speed / Power":"Use short, high-quality acceleration, jump, or power exposures with full recovery between efforts.",
  "Strength":"Build consistent full-body strength with age-appropriate technique and progressive resistance.",
  "Conditioning":"Match conditioning to the sport's work-to-rest demands and protect technical quality when fatigue rises.",
  "Decision-Making":"Use reactive drills, small-sided situations, or competition clips that require a choice instead of a memorized pattern.",
  "Mental Performance":"Use a short pre-performance routine, cue word, breathing, and realistic mental rehearsal.",
  "Recovery / Habits":"Start with the biggest controllable recovery limiter: sleep consistency, recovery routine, nutrition/hydration support, or communication.",
  "Character / Leadership":"Choose one behavior to demonstrate consistently: communication, responsibility, effort, helping teammates, or responding well to feedback."
 };
 return actions[pillar];
};

const levelScore=(level?:SkillLevel)=>level==="Advanced"?5:level==="Consistent"?4:level==="Developing"?3:level==="Needs Work"?2:3;

export default function AthleteApp({betaBridge}:{betaBridge?:BetaBridge}){
 const [sport,setSport]=useState<Sport>("Ice Hockey"),[tab,setTab]=useState<Tab>("Home");
 const [results,setResults]=useState<Result[]>([]),[custom,setCustom]=useState<CustomTest[]>([]),[goals,setGoals]=useState<Goal[]>([]),[workouts,setWorkouts]=useState<Workout[]>([]),[profile,setProfile]=useState<Profile>({name:"Athlete",position:"",team:"",season:"2026-27",height:"",weight:"",handedness:"Right",age:"",sport:"Ice Hockey"});
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
 const [coachWeeklyReviews,setCoachWeeklyReviews]=useState<CoachWeeklyReview[]>([]);
 const [developmentSystem,setDevelopmentSystem]=useState<DevelopmentSystemState>(createDefaultDevelopmentSystem());
 const [testTargets,setTestTargets]=useState<TestTarget[]>([]);
 const [commandOpen,setCommandOpen]=useState(false);
 const [commandQuery,setCommandQuery]=useState("");
 const [workspaceRole,setWorkspaceRole]=useState<WorkspaceRole>("Athlete");
 const [onboardingDismissed,setOnboardingDismissed]=useState(false);
 const [editProfileRequest,setEditProfileRequest]=useState(0);
 const [accountSession,setAccountSession]=useState<AccountSession|null>(null);
 const [adminView,setAdminView]=useState<"Admin"|"Coach"|"Player"|"Parent">("Admin");
 const [showGuide,setShowGuide]=useState(false);
 const [guideStep,setGuideStep]=useState(0);
 const [guideWaitingFor,setGuideWaitingFor]=useState<string|null>(null);
 const [showSkipSetupDisclaimer,setShowSkipSetupDisclaimer]=useState(false);
 const [showFeatureOverview,setShowFeatureOverview]=useState(false);
 const [featureOverviewSource,setFeatureOverviewSource]=useState<"setup"|"help">("help");
 const [showSettings,setShowSettings]=useState(false);
 const [textSize,setTextSize]=useState<TextSize>("comfortable");
 const [profileSavedForGuide,setProfileSavedForGuide]=useState(false);
 const [showReadinessPrompt,setShowReadinessPrompt]=useState(false);
 const [showWeeklyReviewPrompt,setShowWeeklyReviewPrompt]=useState(false);
 const [navSheet,setNavSheet]=useState<null|"Plan"|"Train"|"Progress"|"More">(null);
 const cloudLoadedRef=useRef(false);
 const cloudReadyWorkspaceRef=useRef<string|null>(null);
 const cloudSaveTimerRef=useRef<number|null>(null);
 const [cloudStatus,setCloudStatus]=useState<"local"|"loading"|"saved"|"error">(betaBridge?"loading":"local");
 const [cloudLastSavedAt,setCloudLastSavedAt]=useState("");
 const [cloudErrorMessage,setCloudErrorMessage]=useState("");
 const [pendingCloudSave,setPendingCloudSave]=useState(false);
 const [coachCloudRoster,setCoachCloudRoster]=useState<CoachCloudAthleteState[]>([]);
 const [coachRosterCloudStatus,setCoachRosterCloudStatus]=useState<"idle"|"loading"|"ready"|"error">("idle");



 const [mounted,setMounted]=useState(false);

 // Every section change starts at the top so navigation feels like opening a new page.
 useEffect(()=>{
  if(!mounted)return;
  const frame=window.requestAnimationFrame(()=>{
   window.scrollTo({top:0,left:0,behavior:"auto"});
   document.documentElement.scrollTop=0;
   document.body.scrollTop=0;
  });
  return()=>window.cancelAnimationFrame(frame);
 },[tab,mounted]);
 useEffect(()=>{for(const [key,setter] of [["results",setResults],["custom",setCustom],["goals",setGoals],["workouts",setWorkouts]] as any[]){try{const v=localStorage.getItem(key);if(v)setter(JSON.parse(v))}catch{}}},[]);
 useEffect(()=>localStorage.setItem("results",JSON.stringify(results)),[results]);
 useEffect(()=>localStorage.setItem("custom",JSON.stringify(custom)),[custom]);
 useEffect(()=>localStorage.setItem("goals",JSON.stringify(goals)),[goals]);
 useEffect(()=>localStorage.setItem("workouts",JSON.stringify(workouts)),[workouts]);
useEffect(()=>{try{const v=localStorage.getItem("profile");if(v){const x=JSON.parse(v);const savedSport=sports.includes(x?.sport as Sport)?x.sport as Sport:"Ice Hockey";setProfile({name:x?.name??"Athlete",position:x?.position??"",team:x?.team??"",season:x?.season??"2026-27",height:x?.height??"",weight:x?.weight??"",handedness:x?.handedness==="Left"?"Left":"Right",age:x?.age??"",sport:savedSport});setSport(savedSport)}}catch{}},[]);
useEffect(()=>localStorage.setItem("profile",JSON.stringify(profile)),[profile]);
useEffect(()=>{
 const locked=profile.sport;
 if(locked&&sports.includes(locked)&&locked!==sport){setSport(locked);return}
 if(!locked)setProfile(x=>({...x,sport}));
},[profile.sport,sport]);
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
 useEffect(()=>{
 if(betaBridge){setAccountSession(betaBridge.session);setWorkspaceRole(roleToWorkspace(betaBridge.session.role));return}
 try{const raw=localStorage.getItem("accountSession");if(raw){const x=JSON.parse(raw);if(["Player","Coach","Parent","Admin"].includes(x?.role))setAccountSession(x)}}catch{}
},[betaBridge?.userId]);
 useEffect(()=>{try{setShowGuide(localStorage.getItem("guidedTourComplete")!=="1")}catch{setShowGuide(true)}},[]);
 useEffect(()=>{
  try{
   const saved=localStorage.getItem("uiTextSize") as TextSize|null;
   if(saved&&(["standard","comfortable","large","xlarge"] as TextSize[]).includes(saved))setTextSize(saved);
  }catch{}
 },[]);
 const changeTextSize=(size:TextSize)=>{
  setTextSize(size);
  try{localStorage.setItem("uiTextSize",size)}catch{}
 };

 useEffect(()=>setMounted(true),[]);
 useEffect(()=>{try{localStorage.setItem(`athleteData:${activeAthleteId}`,JSON.stringify({profile,goals,workouts,results,development:dev,program,readiness,coachNotes,competitions,reportNotes,developmentSystem}))}catch{}},[activeAthleteId,profile,goals,workouts,results,dev,program,readiness,coachNotes,competitions,reportNotes,developmentSystem]);

 
 const storageKey=(id:string)=>`athleteData:${id}`;

 const buildSnapshot=():AthleteSnapshot=>({
   profile:{...profile},goals:[...goals],workouts:[...workouts],results:[...results],development:[...dev],program:program?{...program,sessions:program.sessions.map(x=>({...x}))}:null,readiness:[...readiness],coachNotes:[...coachNotes],competitions:[...competitions],reportNotes:[...reportNotes],developmentSystem:normalizeDevelopmentSystem(developmentSystem)
 });

 const saveActiveSnapshot=()=>{
   try{localStorage.setItem(storageKey(activeAthleteId),JSON.stringify(buildSnapshot()))}catch{}
 };
 useEffect(()=>{
   if(!mounted||!betaBridge)return;
   const workspaceId=betaBridge.workspaceId;
   cloudLoadedRef.current=false;
   cloudReadyWorkspaceRef.current=null;
   if(cloudSaveTimerRef.current)window.clearTimeout(cloudSaveTimerRef.current);
   setCloudStatus("loading");
   betaBridge.loadState().then((raw:any)=>{
     if(betaBridge.workspaceId!==workspaceId)return;
     if(raw){
      const cloudSport=(raw.profile?.sport&&sports.includes(raw.profile.sport as Sport)?raw.profile.sport:raw.sport&&sports.includes(raw.sport as Sport)?raw.sport:betaBridge?.selectedAthleteSport&&sports.includes(betaBridge.selectedAthleteSport as Sport)?betaBridge.selectedAthleteSport:sport) as Sport;
      if(raw.profile)setProfile({...raw.profile,sport:cloudSport});
      else setProfile(x=>({...x,sport:cloudSport}));
      setSport(cloudSport);
      if(Array.isArray(raw.goals))setGoals(raw.goals);
      if(Array.isArray(raw.workouts))setWorkouts(raw.workouts);
      if(Array.isArray(raw.results))setResults(raw.results);
      if(Array.isArray(raw.custom))setCustom(raw.custom);
      if(Array.isArray(raw.development))setDev(raw.development);
      setProgram(raw.program||null);
      if(Array.isArray(raw.readiness))setReadiness(raw.readiness);
      if(Array.isArray(raw.coachNotes))setCoachNotes(raw.coachNotes);
      if(Array.isArray(raw.competitions))setCompetitions(raw.competitions);
      if(Array.isArray(raw.reportNotes))setReportNotes(raw.reportNotes);
      if(Array.isArray(raw.roster))setRoster(raw.roster);
      if(Array.isArray(raw.milestones))setMilestones(raw.milestones);
      if(Array.isArray(raw.seasonEvents))setSeasonEvents(raw.seasonEvents);
      if(Array.isArray(raw.trainingBlocks))setTrainingBlocks(raw.trainingBlocks);
      if(Array.isArray(raw.weeklyReviews))setWeeklyReviews(raw.weeklyReviews);
      setDevelopmentSystem(raw.developmentSystem?normalizeDevelopmentSystem(raw.developmentSystem):createDefaultDevelopmentSystem());
      if(Array.isArray(raw.testTargets))setTestTargets(raw.testTargets);
      if(raw.activeAthleteId)setActiveAthleteId(String(raw.activeAthleteId));
     }else if(betaBridge?.selectedAthleteSport&&sports.includes(betaBridge.selectedAthleteSport as Sport)){
      const fallbackSport=betaBridge.selectedAthleteSport as Sport;
      setSport(fallbackSport);
      setProfile(x=>({...x,sport:fallbackSport}));
      setDevelopmentSystem(createDefaultDevelopmentSystem());
     }
     cloudLoadedRef.current=true;
     cloudReadyWorkspaceRef.current=workspaceId;
     setCloudErrorMessage("");
     setCloudStatus("saved");
   }).catch((err:any)=>{
     if(betaBridge.workspaceId===workspaceId){
      setCloudErrorMessage(err?.message||"Could not load cloud workspace.");
      setCloudStatus("error");
     }
   });
 },[mounted,betaBridge?.workspaceId]);

 useEffect(()=>{
   let cancelled=false;
   if(!betaBridge?.loadCoachWeeklyReviews){setCoachWeeklyReviews([]);return}
   betaBridge.loadCoachWeeklyReviews()
    .then(rows=>{if(!cancelled)setCoachWeeklyReviews(Array.isArray(rows)?rows:[])})
    .catch(()=>{if(!cancelled)setCoachWeeklyReviews([])});
   return()=>{cancelled=true};
 },[betaBridge?.workspaceId]);

 const cloudPayload=()=>({
   profile,goals,workouts,results,custom,development:dev,program,readiness,coachNotes,
   competitions,reportNotes,roster,milestones,seasonEvents,trainingBlocks,weeklyReviews,
   developmentSystem,testTargets,activeAthleteId,sport
 });
 const pendingCloudKey=()=>betaBridge?`pendingCloudSave:${betaBridge.workspaceId}`:"";
 const saveCloudPayload=async(payload:Record<string,unknown>)=>{
   if(!betaBridge)return;
   setCloudStatus("loading");
   try{
     await betaBridge.saveState(payload);
     setCloudStatus("saved");
     setCloudErrorMessage("");
     setCloudLastSavedAt(new Date().toISOString());
     setPendingCloudSave(false);
     try{localStorage.removeItem(pendingCloudKey())}catch{}
   }catch(err:any){
     setCloudStatus("error");
     setCloudErrorMessage(err?.message||"Cloud save failed. A local retry copy was kept.");
     setPendingCloudSave(true);
     try{localStorage.setItem(pendingCloudKey(),JSON.stringify(payload))}catch{}
   }
 };
 const retryPendingCloudSave=async()=>{
   if(!betaBridge)return;
   let payload:Record<string,unknown>=cloudPayload();
   try{
     const raw=localStorage.getItem(pendingCloudKey());
     if(raw)payload=JSON.parse(raw);
   }catch{}
   await saveCloudPayload(payload);
 };

 useEffect(()=>{
   if(!betaBridge||!cloudLoadedRef.current||cloudReadyWorkspaceRef.current!==betaBridge.workspaceId)return;
   if(cloudSaveTimerRef.current)window.clearTimeout(cloudSaveTimerRef.current);
   setCloudStatus("loading");
   cloudSaveTimerRef.current=window.setTimeout(()=>{void saveCloudPayload(cloudPayload())},900);
   return()=>{if(cloudSaveTimerRef.current)window.clearTimeout(cloudSaveTimerRef.current)}
 },[betaBridge?.workspaceId,profile,goals,workouts,results,custom,dev,program,readiness,coachNotes,competitions,reportNotes,roster,milestones,seasonEvents,trainingBlocks,weeklyReviews,developmentSystem,testTargets,activeAthleteId,sport]);

 useEffect(()=>{
   if(!betaBridge)return;
   try{setPendingCloudSave(Boolean(localStorage.getItem(pendingCloudKey())))}catch{}
   const retry=()=>{if(cloudLoadedRef.current&&cloudReadyWorkspaceRef.current===betaBridge.workspaceId)void retryPendingCloudSave()};
   window.addEventListener("online",retry);
   return()=>window.removeEventListener("online",retry);
 },[betaBridge?.workspaceId]);



 const loadAthleteSnapshot=(id:string,record?:AthleteRecord)=>{
   try{
     const raw=localStorage.getItem(storageKey(id));
     if(raw){
       const x=JSON.parse(raw);
       const lockedSport=(x?.profile?.sport&&sports.includes(x.profile.sport as Sport)?x.profile.sport:record?.sport||sport) as Sport;
       setProfile({name:x?.profile?.name??record?.name??"Athlete",position:x?.profile?.position??record?.position??"",team:x?.profile?.team??record?.team??"",season:x?.profile?.season??record?.season??"2026-27",height:x?.profile?.height??record?.height??"",weight:x?.profile?.weight??record?.weight??"",handedness:x?.profile?.handedness==="Left"?"Left":"Right",age:x?.profile?.age??record?.age??"",sport:lockedSport});
       setSport(lockedSport);
       setGoals(Array.isArray(x?.goals)?x.goals:[]);
       setWorkouts(Array.isArray(x?.workouts)?x.workouts:[]);
       setResults(Array.isArray(x?.results)?x.results:[]);
       setDev(Array.isArray(x?.development)?x.development:[]);
       setProgram(x?.program??null);
       setReadiness(Array.isArray(x?.readiness)?x.readiness:[]);
       setCoachNotes(Array.isArray(x?.coachNotes)?x.coachNotes:[]);
       setCompetitions(Array.isArray(x?.competitions)?x.competitions:[]);
       setReportNotes(Array.isArray(x?.reportNotes)?x.reportNotes:[]);
       setDevelopmentSystem(x?.developmentSystem?normalizeDevelopmentSystem(x.developmentSystem):createDefaultDevelopmentSystem());
     }else if(record){
       setProfile({name:record.name,position:record.position,team:record.team,season:record.season,height:record.height,weight:record.weight,handedness:record.handedness,age:record.age??"",sport:record.sport});
       setSport(record.sport);
       setGoals([]);setWorkouts([]);setResults([]);setDev([]);setProgram(null);setReadiness([]);setCoachNotes([]);setCompetitions([]);setReportNotes([]);setDevelopmentSystem(createDefaultDevelopmentSystem());
     }
   }catch{}
 };

 const switchAthlete=(record:AthleteRecord)=>{
   saveActiveSnapshot();
   setActiveAthleteId(record.id);
   loadAthleteSnapshot(record.id,record);
 };

 useEffect(()=>{
  if(activeAthleteId==="primary")return;
  setRoster(rows=>rows.map(r=>r.id===activeAthleteId?{
   ...r,name:profile.name,sport:profile.sport||sport,position:profile.position,team:profile.team,
   season:profile.season,height:profile.height,weight:profile.weight,handedness:profile.handedness,age:profile.age??""
  }:r));
 },[activeAthleteId,profile,sport]);

 const roleToWorkspace=(role:AccountRole):WorkspaceRole=>role==="Player"?"Athlete":role==="Admin"?"Coach":role;
 const completeRoleLogin=(role:AccountRole,displayName:string,linkedAthleteIds?:string[])=>{
   const session:AccountSession={role,displayName:displayName.trim()||role,athleteId:activeAthleteId,linkedAthleteIds:role==="Parent"?(linkedAthleteIds?.length?linkedAthleteIds:[activeAthleteId]):undefined};
   setAccountSession(session);
   setWorkspaceRole(roleToWorkspace(role));
   setTab("Home");
   setGuideStep(0);
   try{
    localStorage.setItem("accountSession",JSON.stringify(session));
    if(localStorage.getItem("guidedTourComplete")!=="1")setShowGuide(true);
   }catch{setShowGuide(true)}
 };
 const signOutRole=()=>{
   setAccountSession(null);
   setTab("Home");
   setCommandOpen(false);
   try{localStorage.removeItem("accountSession")}catch{}
   if(betaBridge){void betaBridge.onSignOut()}
 };
 const accountRole:AccountRole=accountSession?.role||"Player";
 const effectiveRole:AccountRole=accountRole==="Admin"?(adminView==="Admin"?"Admin":adminView):accountRole;
 const canEditPlayerProfile=effectiveRole==="Player"||effectiveRole==="Admin";

 useEffect(()=>{
  let cancelled=false;
  if(accountRole!=="Coach"||!betaBridge?.loadCoachRosterStates){
   setCoachCloudRoster([]);
   setCoachRosterCloudStatus("idle");
   return;
  }
  setCoachRosterCloudStatus("loading");
  betaBridge.loadCoachRosterStates()
   .then(rows=>{if(!cancelled){setCoachCloudRoster(Array.isArray(rows)?rows:[]);setCoachRosterCloudStatus("ready")}})
   .catch(()=>{if(!cancelled)setCoachRosterCloudStatus("error")});
  return()=>{cancelled=true};
 },[accountRole,betaBridge?.workspaceId,betaBridge?.loadCoachRosterStates]);

 const todayLocal=today();
 const thisWeekStart=mondayOfWeek();
 const hasReadinessToday=readiness.some(r=>r.date===todayLocal);
 const hasCurrentWeekReview=weeklyReviews.some(r=>r.weekStart===thisWeekStart);

 useEffect(()=>{
  if(!mounted||!accountSession||showGuide||showSkipSetupDisclaimer||showFeatureOverview)return;
  if(effectiveRole!=="Player"){setShowReadinessPrompt(false);return;}
  try{
   const dismissed=localStorage.getItem(`readinessPromptDismissed:${activeAthleteId}`);
   if(!hasReadinessToday&&dismissed!==todayLocal)setShowReadinessPrompt(true);
   else setShowReadinessPrompt(false);
  }catch{if(!hasReadinessToday)setShowReadinessPrompt(true)}
 },[mounted,accountSession,effectiveRole,hasReadinessToday,todayLocal,activeAthleteId,showGuide,showSkipSetupDisclaimer,showFeatureOverview]);

 useEffect(()=>{
  if(!mounted||!accountSession||showGuide||showSkipSetupDisclaimer||showFeatureOverview||showReadinessPrompt)return;
  if(effectiveRole!=="Player"){setShowWeeklyReviewPrompt(false);return;}
  const isEndOfWeek=new Date().getDay()===0;
  if(!isEndOfWeek||hasCurrentWeekReview){setShowWeeklyReviewPrompt(false);return;}
  try{
   const dismissed=localStorage.getItem(`weeklyReviewPromptDismissed:${activeAthleteId}`);
   if(dismissed!==thisWeekStart)setShowWeeklyReviewPrompt(true);
  }catch{setShowWeeklyReviewPrompt(true)}
 },[mounted,accountSession,effectiveRole,hasCurrentWeekReview,thisWeekStart,activeAthleteId,showGuide,showSkipSetupDisclaimer,showFeatureOverview,showReadinessPrompt]);

 const dismissReadinessPrompt=()=>{
  setShowReadinessPrompt(false);
  try{localStorage.setItem(`readinessPromptDismissed:${activeAthleteId}`,todayLocal)}catch{}
 };
 const openReadinessFromPrompt=()=>{
  setShowReadinessPrompt(false);
  setTab("Coach");
  window.setTimeout(()=>document.getElementById("setup-readiness")?.scrollIntoView({behavior:"smooth",block:"center"}),180);
 };
 const dismissWeeklyReviewPrompt=()=>{
  setShowWeeklyReviewPrompt(false);
  try{localStorage.setItem(`weeklyReviewPromptDismissed:${activeAthleteId}`,thisWeekStart)}catch{}
 };
 const openWeeklyReviewFromPrompt=()=>{
  setShowWeeklyReviewPrompt(false);
  setTab("Home");
  window.setTimeout(()=>document.getElementById("setup-weekly-review")?.scrollIntoView({behavior:"smooth",block:"center"}),220);
 };

 const allAthletes=useMemo<AthleteRecord[]>(()=>{
  const current:AthleteRecord={id:activeAthleteId,name:profile.name,sport:profile.sport||sport,position:profile.position,team:profile.team,season:profile.season,height:profile.height,weight:profile.weight,handedness:profile.handedness,age:profile.age??""};
  let primary:AthleteRecord|null=null;
  if(activeAthleteId==="primary"){
   primary={...current,id:"primary"};
  }else if(typeof window!=="undefined"){
   try{
    const raw=localStorage.getItem(storageKey("primary"));
    if(raw){
     const snap=JSON.parse(raw);
     const p=snap?.profile||{};
     const primarySport=(p.sport&&sports.includes(p.sport as Sport)?p.sport:"Ice Hockey") as Sport;
     primary={id:"primary",name:p.name||"Athlete",sport:primarySport,position:p.position||"",team:p.team||"",season:p.season||"2026-27",height:p.height||"",weight:p.weight||"",handedness:p.handedness==="Left"?"Left":"Right",age:p.age||""};
    }
   }catch{}
  }
  const merged=[...(primary?[primary]:[]),...roster.filter(r=>r.id!=="primary")];
  if(activeAthleteId!=="primary"&&!merged.some(r=>r.id===activeAthleteId))merged.push({...current,id:activeAthleteId});
  const seen=new Set<string>();
  return merged.filter(a=>!seen.has(a.id)&&(seen.add(a.id),true));
 },[profile,sport,roster,activeAthleteId]);

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

 const guideProfileChecks=[
  Boolean(profile.name&&profile.name!=="Athlete"),
  Boolean(profile.age&&Number(profile.age)>=6&&Number(profile.age)<=99),
  Boolean(profile.position),
  Boolean(profile.team),
  Boolean(profile.height),
  Boolean(profile.weight),
  Boolean(profile.handedness)
 ];
 const guideProfileComplete=guideProfileChecks.every(Boolean);

 type GuideStep={id:string;title:string;body:string;tab?:Tab;target?:string;button?:string;action?:"teams"|"players"|"joinTeam"|"admin";complete?:()=>boolean};
 const commonWelcome:GuideStep={id:"welcome",title:`Welcome to your ${effectiveRole} workspace`,body:effectiveRole==="Player"?"This setup only covers the things you need as a Player. You can ignore Coach and Parent tools—they are not part of your workflow.":effectiveRole==="Coach"?"This setup focuses on selecting athletes, reviewing readiness, development, observations, and Coach reviews. Player profile identity stays read-only.":effectiveRole==="Parent"?"This setup focuses on switching between your Players, schedule, recovery, progress, and how to support development without managing the training plan.":"This setup focuses on beta administration, role previews, diagnostics, and roster oversight."};
 const playerGuideSteps:GuideStep[]=[
  commonWelcome,
  {id:"profile",title:"Set up my Player Profile",body:"Add your name, sport, age, position, team, height, weight, and handedness. Sport and age help the app show the right training and development information.",tab:"Home",target:"profile",button:"Open My Profile",complete:()=>profileSavedForGuide&&guideProfileComplete},
  {id:"readiness",title:"Learn my Daily Check-In",body:"Your Daily Check-In is your quickest daily task. Log sleep, energy, soreness, and stress. The app uses it as training and recovery context—not as a medical diagnosis.",tab:"Coach",target:"readiness",button:"Open Daily Check-In",complete:()=>readiness.length>0},
  {id:"calendar",title:"Find my training",body:"Schedule shows what you are doing next. You can open workouts from here instead of searching through the whole app.",tab:"Calendar",target:"calendar",button:"Open My Schedule",complete:()=>workouts.some(w=>w.sport===sport)},
  {id:"goal",title:"Know my current goal",body:"Goals keeps your current short-, mid-, and long-term targets in one place. Start with one clear goal rather than trying to track everything.",tab:"Goals",target:"goals",button:"Open My Goals",complete:()=>goals.length>0},
  {id:"weekly",title:"Find my Weekly Review",body:"Once a week, record your biggest win, main challenge, next focus, and a simple rating. This is Player-entered and helps your support team understand your perspective.",tab:"Home",target:"weekly-review",button:"Open My Weekly Review"},
  {id:"progress",title:"See my progress",body:"My Progress summarizes testing, training, goals, readiness, and competition. You do not need to understand every number—start with the summary and open details only when you want them.",tab:"Analytics",button:"Open My Progress"},
  {id:"finish",title:"Player setup complete",body:"You are ready. Your normal Player experience starts with Today: check in, see your next training, review your current focus, and move on."}
 ];
 const coachGuideSteps:GuideStep[]=[
  commonWelcome,
  {id:"teams",title:"Open my Coach Teams",body:"Teams is where Coaches create/select teams, share Player invite codes, and open linked athlete workspaces. Coaches manage team membership, not Player identity information.",action:"teams",button:"Open Teams"},
  {id:"roster",title:"Scan my roster",body:"The Coach Command Center shows who may need attention, why, and the recommended next action. Player Profile information is view-only.",tab:"Roster",button:"Open Coach Roster"},
  {id:"readiness",title:"Review Player readiness",body:"Players enter their own Daily Check-In. Your role is to review recovery context and use it to inform training decisions.",tab:"Coach",button:"Review Readiness"},
  {id:"development",title:"Review Development",body:"Development combines the athlete's stage, position priorities, Skill Tree, training plan, and development timeline.",tab:"Development",button:"Open Development"},
  {id:"observations",title:"Add a Practice Observation",body:"Use Coach Practice Observations to record what actually happened in practice or competition and connect it to the Skill Tree.",tab:"Development",button:"Open Observations"},
  {id:"review",title:"Complete Coach Weekly Review",body:"The Coach Weekly Review is your perspective. It stays separate from the Player's own Weekly Review and can be shared with the Player when appropriate.",tab:"Coach",button:"Open Coach Review"},
  {id:"finish",title:"Coach setup complete",body:"Your normal workflow is: scan roster → review the Player → understand the signal → take one development action → move to the next Player."}
 ];
 const parentGuideSteps:GuideStep[]=[
  commonWelcome,
  {id:"players",title:"Open My Players",body:"Use My Players to switch between linked athletes. Each Player has their own schedule, recovery, progress, and development information.",action:"players",button:"Open My Players"},
  {id:"overview",title:"Use Parent Overview",body:"Parent Overview shows the most useful information without asking you to manage training. Start here when you are not sure where to go.",tab:"Home",button:"Open Parent Overview"},
  {id:"calendar",title:"Find the schedule",body:"Schedule shows workouts, competitions, and important dates so you can help with logistics and preparation.",tab:"Calendar",button:"Open Schedule"},
  {id:"recovery",title:"Review recovery",body:"Recovery lets you see Player-entered readiness, sleep, mindfulness tools, and shared support-team notes. Parents do not submit the Player's Daily Check-In.",tab:"Coach",button:"Open Recovery"},
  {id:"progress",title:"Review progress",body:"Progress gives a simpler view of testing and performance trends. Parent pages are view-focused.",tab:"Analytics",button:"Open Progress"},
  {id:"support",title:"Know how to support development",body:"Development Support translates the athlete's current stage and next step into practical Parent support. The Coach owns technical instruction.",tab:"Development",button:"Open Development Support"},
  {id:"finish",title:"Parent setup complete",body:"Your normal workflow is: choose a Player → check schedule/recovery/progress → support the plan without becoming a second Coach."}
 ];
 const adminGuideSteps:GuideStep[]=[
  commonWelcome,
  {id:"admin",title:"Open Beta Admin",body:"Beta Admin handles account access and feedback review.",action:"admin",button:"Open Beta Admin"},
  {id:"roster",title:"Review Roster + Diagnostics",body:"Admin Roster includes profile correction tools, athlete data controls, and Beta Health & Diagnostics.",tab:"Roster",button:"Open Admin Roster"},
  {id:"preview",title:"Use role previews",body:"Use Test View in the header to preview the Player, Coach, and Parent experiences without changing the underlying role rules.",tab:"Home",button:"Return to Admin Overview"},
  {id:"finish",title:"Admin setup complete",body:"Use Admin for beta oversight and role testing. Use role previews to verify the experience before each beta release."}
 ];
 const guideSteps:GuideStep[]=effectiveRole==="Player"?playerGuideSteps:effectiveRole==="Coach"?coachGuideSteps:effectiveRole==="Parent"?parentGuideSteps:adminGuideSteps;
 const finishGuide=()=>{
  setShowGuide(false);setGuideStep(0);setGuideWaitingFor(null);setShowSkipSetupDisclaimer(false);
  try{
   localStorage.setItem("guidedTourComplete","1");
   localStorage.removeItem("guidedTourSkipped");
   localStorage.removeItem("guidedTourResumeStep");
  }catch{}
  setFeatureOverviewSource("setup");
  setShowFeatureOverview(true);
 };
 const requestSkipSetup=()=>setShowSkipSetupDisclaimer(true);
 const confirmSkipSetup=()=>{
  setShowSkipSetupDisclaimer(false);
  setShowGuide(false);
  setGuideWaitingFor(null);
  try{
   localStorage.removeItem("guidedTourComplete");
   localStorage.setItem("guidedTourSkipped","1");
   localStorage.setItem("guidedTourResumeStep",String(guideStep));
  }catch{}
 };
 const resumeGuide=()=>{
  setShowSkipSetupDisclaimer(false);
  try{
   const complete=localStorage.getItem("guidedTourComplete")==="1";
   if(complete){
    setFeatureOverviewSource("help");
    setShowFeatureOverview(true);
    return;
   }
   const saved=Number(localStorage.getItem("guidedTourResumeStep"));
   if(Number.isFinite(saved)&&saved>=0&&saved<guideSteps.length)setGuideStep(saved);
  }catch{}
  setShowGuide(true);
 };
 const openGuideStep=(index:number)=>{
  const next=Math.max(0,Math.min(guideSteps.length-1,index));
  setGuideStep(next);
  setGuideWaitingFor(null);
  try{localStorage.setItem("guidedTourResumeStep",String(next))}catch{}
 };
 const jumpToGuideTarget=()=>{
  const step=guideSteps[guideStep];
  if(step?.action){
   setShowGuide(false);
   setGuideWaitingFor(step.id);
   if(step.action==="teams")betaBridge?.openCoachTeams?.();
   if(step.action==="players")betaBridge?.openParentPlayers?.();
   if(step.action==="joinTeam")betaBridge?.openPlayerJoinTeam?.();
   if(step.action==="admin")betaBridge?.openBetaAdmin?.();
   return;
  }
  if(!step?.tab)return;
  setShowGuide(false);
  if(step.id==="observations"){try{sessionStorage.setItem("developmentView","Observations")}catch{}}
  if(step.id==="review"){try{sessionStorage.setItem("coachHubMode","Review")}catch{}}
  setTab(step.tab);
  setGuideWaitingFor(step.id);
  try{localStorage.setItem("guidedTourResumeStep",String(guideStep))}catch{}
  if(step.id==="profile"&&canEditPlayerProfile){setProfileSavedForGuide(false);setEditProfileRequest(x=>x+1);}
  if(step.id==="weekly"){window.setTimeout(()=>document.getElementById("setup-weekly-review")?.scrollIntoView({behavior:"smooth",block:"center"}),240);}
  window.setTimeout(()=>{
    if(step.target){
      const el=document.getElementById(`setup-${step.target}`);
      if(el){el.scrollIntoView({behavior:"smooth",block:"center"});(el as HTMLElement).focus({preventScroll:true});}
    }
  },220);
 };
 const handleProfileSaved=()=>{
  if(guideWaitingFor==="profile")setProfileSavedForGuide(true);
 };
 const nextIncompleteGuideStep=()=>{
  const currentIndex=guideSteps.findIndex(x=>x.id===guideWaitingFor);
  if(currentIndex<0)return;
  const current=guideSteps[currentIndex];
  if(current.complete&&current.complete()){
    const next=Math.min(currentIndex+1,guideSteps.length-1);
    setGuideStep(next);
    setGuideWaitingFor(null);
    try{localStorage.setItem("guidedTourResumeStep",String(next))}catch{}
    setShowGuide(true);
  }
 };
 useEffect(()=>{nextIncompleteGuideStep()},[guideWaitingFor,profileSavedForGuide,guideProfileComplete,goals.length,results.length,workouts.length,readiness.length,sport]);

 const openFeatureFromHelp=(tab:Tab)=>{
  setShowFeatureOverview(false);
  setTab(tab);
 };
 const visibleTabs:Tab[]=accountRole==="Admin"&&adminView==="Admin"?["Home","Goals","Calendar","Testing","Analytics","Coach","Development","Competition","Roster"]:effectiveRole==="Coach"
  ?["Home","Goals","Calendar","Testing","Analytics","Coach","Development","Competition","Roster"]
  :effectiveRole==="Player"
  ?["Home","Goals","Calendar","Testing","Analytics","Coach","Development","Competition"]
  :["Home","Calendar","Coach","Analytics","Development","Competition"];
 const roleNavLabel=(x:string)=>{
  if(effectiveRole==="Player"){
   if(x==="Home")return "Today";
   if(x==="Coach")return "Daily Check-In";
   if(x==="Analytics")return "My Progress";
   if(x==="Development")return "My Development";
   if(x==="Goals")return "My Goals";
  }
  if(effectiveRole==="Parent"){
   if(x==="Home")return "Overview";
   if(x==="Coach")return "Recovery";
   if(x==="Analytics")return "Progress";
  }
  return x==="Coach"?(effectiveRole==="Coach"?"Readiness & Coach Tools":navMeta[x]?.label||x):navMeta[x]?.label||x;
 };
 const playerPageHelp:Partial<Record<Tab,{title:string;purpose:string;primary:string}>>={
  Home:{title:"Today",purpose:"See the few things that matter right now.",primary:"Do the first unfinished action"},
  Goals:{title:"My Goals",purpose:"Keep clear targets without tracking too many things at once.",primary:"Review one current goal"},
  Calendar:{title:"My Schedule",purpose:"See the next workout, practice, or competition.",primary:"Open what is next"},
  Coach:{title:"Daily Check-In",purpose:"Log how you feel and see a simple readiness result.",primary:"Complete today's check-in"},
  Development:{title:"My Development",purpose:"See your current focus and next skill progression.",primary:"Review what to work on next"},
  Testing:{title:"My Testing",purpose:"Record a result and compare it with earlier results.",primary:"Log or review one test"},
  Analytics:{title:"My Progress",purpose:"See the clearest signs of progress first.",primary:"Read the summary"},
  Competition:{title:"Competition",purpose:"Review or log a game, match, meet, or event.",primary:"Open the latest event"}
 };
 const parentPageHelp:Partial<Record<Tab,{title:string;purpose:string;primary:string}>>={
  Home:{title:"Parent Overview",purpose:"See what matters now and choose exactly what you want to review.",primary:"Choose a section below"},
  Calendar:{title:"Schedule",purpose:"See upcoming workouts, competitions, and important dates.",primary:"Filter the schedule"},
  Coach:{title:"Recovery & Notes",purpose:"Review recovery tools and communicate with the athlete support team.",primary:"Choose Recovery, Sleep, Mindfulness, or Notes"},
  Analytics:{title:"Progress",purpose:"See the clearest signs of progress without digging through raw data.",primary:"Choose Summary, Testing, or Competition"},
  Development:{title:"Development",purpose:"Review priorities, the current program, and milestones.",primary:"Choose what you want to review"},
  Competition:{title:"Competition",purpose:"Review recent events and open any event for more detail.",primary:"Tap a competition to expand"}
 };
 const navGroups:Record<"Plan"|"Train"|"Progress"|"More",Tab[]>={
  Plan:visibleTabs.filter(x=>x==="Goals"||x==="Calendar"),
  Train:visibleTabs.filter(x=>x==="Development"||x==="Coach"),
  Progress:visibleTabs.filter(x=>x==="Testing"||x==="Analytics"),
  More:visibleTabs.filter(x=>x==="Competition"||x==="Roster")
 };
 const activeGroupTabs=
  navGroups.Plan.includes(tab)?navGroups.Plan:
  navGroups.Train.includes(tab)?navGroups.Train:
  navGroups.Progress.includes(tab)?navGroups.Progress:
  navGroups.More.includes(tab)?navGroups.More:[];
 const groupActive=(group:keyof typeof navGroups)=>navGroups[group].includes(tab);
 const openNavGroup=(group:keyof typeof navGroups)=>{
  const items=navGroups[group];
  if(items.length===1){setTab(items[0]);return}
  setNavSheet(group);
 };


 const featureCatalog:{tab:Tab;group:"Overview"|"Plan"|"Train"|"Progress"|"More";title:string;description:string;how:string}[]=[
  {tab:"Home",group:"Overview",title:effectiveRole==="Player"?"Today":effectiveRole==="Parent"?"Parent Overview":"Overview",description:effectiveRole==="Player"?"Your simple starting point: Daily Check-In, next training, current focus, weekly status, and profile.":effectiveRole==="Parent"?"See the Player's schedule, recovery, progress, and support priorities in a view-focused dashboard.":"Current athlete status, priorities, and role-specific actions.",how:effectiveRole==="Player"?"Start here each day. Do the first unfinished action, then you are done.":effectiveRole==="Parent"?"Start here when you are not sure what to review.":"Use this as the starting point."},
  {tab:"Goals",group:"Plan",title:effectiveRole==="Player"?"My Goals":"Goals",description:effectiveRole==="Player"?"Keep one or a few clear targets and update progress over time.":"Create and review short-, mid-, and long-term development goals.",how:"Open Plan, then Goals."},
  {tab:"Calendar",group:"Plan",title:effectiveRole==="Player"?"My Schedule":"Schedule",description:effectiveRole==="Player"?"See what training or competition is next.":"Review workouts, competitions, and important dates.",how:"Open Plan, then Schedule."},
  {tab:"Development",group:"Train",title:effectiveRole==="Player"?"My Development":effectiveRole==="Parent"?"Development Support":"Development",description:effectiveRole==="Player"?"See what you are working on next, your development stage, training plan, and skill progress.":effectiveRole==="Parent"?"Understand the athlete's current development step and how to support it without taking over coaching.":"Manage development priorities, Skill Tree, observations, training plan, and athlete development timeline.",how:effectiveRole==="Parent"?"Open More, then Development.":"Open Train, then Development."},
  {tab:"Coach",group:"Train",title:effectiveRole==="Parent"?"Recovery & Notes":effectiveRole==="Player"?"Daily Check-In":"Readiness & Coach Tools",description:effectiveRole==="Parent"?"Review Player-entered readiness, recovery tools, and shared support-team notes.":effectiveRole==="Player"?"Log sleep, energy, soreness, and stress. Start with the simple readiness result; open the details only when you want them.":"Review Player readiness, complete Coach Weekly Reviews, and use Coach planning tools.",how:effectiveRole==="Parent"?"Tap Recovery at the bottom.":effectiveRole==="Player"?"Open Train, then Daily Check-In.":"Open Train, then Readiness & Coach Tools."},
  {tab:"Testing",group:"Progress",title:effectiveRole==="Player"?"My Testing":"Testing",description:effectiveRole==="Player"?"Record a test result and compare it with your earlier results.":"Log standard/custom tests, retest targets, and performance history.",how:"Open Progress, then Testing."},
  {tab:"Analytics",group:"Progress",title:effectiveRole==="Player"?"My Progress":effectiveRole==="Parent"?"Progress":"Analytics & Reports",description:effectiveRole==="Player"?"A simple summary of whether training, testing, goals, readiness, and competition are moving in the right direction.":effectiveRole==="Parent"?"Review the clearest progress trends without editing Player data.":"Review the shared Analytics Cockpit, trends, reports, and action recommendations.",how:effectiveRole==="Player"?"Open Progress, then My Progress.":effectiveRole==="Parent"?"Tap Progress at the bottom.":"Open Progress, then Analytics."},
  {tab:"Competition",group:"More",title:"Competition",description:effectiveRole==="Player"?"Log and review games, matches, meets, ratings, confidence, and sport-specific stats.":"Review competition results, notes, and sport-specific statistics.",how:"Open More, then Competition."},
  {tab:"Roster",group:"More",title:effectiveRole==="Coach"?"Coach Roster":"Roster",description:effectiveRole==="Coach"?"Scan linked Players, see analytics/status, review who needs attention, and open the next Coach action. Player Profile identity is view-only.":"Admin athlete management, profile correction, diagnostics, and athlete-data controls.",how:"Open More, then Roster."}
 ];
 type RoleHelpTask={title:string;detail:string;tab?:Tab;action?:"teams"|"players"|"joinTeam"|"admin";subView?:string};
 const roleHelpTasks:RoleHelpTask[]=effectiveRole==="Player"?[
  {title:"What should I do today?",detail:"Open the simple Today screen.",tab:"Home"},
  {title:"How do I log my Daily Check-In?",detail:"Enter sleep, energy, soreness, and stress.",tab:"Coach"},
  {title:"Where is my next workout?",detail:"Open My Schedule.",tab:"Calendar"},
  {title:"How do I update a goal?",detail:"Open My Goals.",tab:"Goals"},
  {title:"How do I enter a test result?",detail:"Open My Testing.",tab:"Testing"},
  {title:"How do I complete my Weekly Review?",detail:"Open Today and scroll to My Weekly Review.",tab:"Home",subView:"weekly"},
  {title:"How do I see my progress?",detail:"Open My Progress.",tab:"Analytics"},
  {title:"What should I work on next?",detail:"Open My Development.",tab:"Development"},
  ...(betaBridge?.openPlayerJoinTeam?[{title:"How do I join a Coach's team?",detail:"Open the team invite screen.",action:"joinTeam" as const}]:[])
 ]:effectiveRole==="Coach"?[
  ...(betaBridge?.openCoachTeams?[{title:"How do I manage my team?",detail:"Open Teams and Player invite codes.",action:"teams" as const}]:[]),
  {title:"How do I select a Player?",detail:"Open Coach Roster.",tab:"Roster"},
  {title:"Who needs my attention?",detail:"Open the Coach Command Center.",tab:"Roster"},
  {title:"How do I review readiness?",detail:"Open Player Readiness.",tab:"Coach"},
  {title:"How do I add a Practice Observation?",detail:"Open Development → Observations.",tab:"Development",subView:"Observations"},
  {title:"How do I complete a Coach Review?",detail:"Open Weekly Review.",tab:"Coach",subView:"Review"},
  {title:"How do I review Player analytics?",detail:"Open the shared Analytics Cockpit.",tab:"Analytics"},
  {title:"How do I review development priorities?",detail:"Open Development.",tab:"Development"}
 ]:effectiveRole==="Parent"?[
  ...(betaBridge?.openParentPlayers?[{title:"How do I switch between my Players?",detail:"Open My Players.",action:"players" as const}]:[]),
  {title:"Where is the schedule?",detail:"Open Schedule.",tab:"Calendar"},
  {title:"How do I check recovery?",detail:"Open Recovery & Notes.",tab:"Coach"},
  {title:"How do I see progress?",detail:"Open Progress.",tab:"Analytics"},
  {title:"How should I support development?",detail:"Open Development Support.",tab:"Development"},
  {title:"Where are competitions?",detail:"Open Competition.",tab:"Competition"},
  {title:"How do I communicate with the support team?",detail:"Open Recovery & Notes for Shared Notes.",tab:"Coach"}
 ]:[
  ...(betaBridge?.openBetaAdmin?[{title:"How do I manage beta accounts?",detail:"Open Beta Admin.",action:"admin" as const}]:[]),
  {title:"How do I test the Player experience?",detail:"Use Test View in the header, then choose Player.",tab:"Home"},
  {title:"Where are beta diagnostics?",detail:"Open Admin Roster.",tab:"Roster"},
  {title:"How do I manage athlete data?",detail:"Open Admin Roster.",tab:"Roster"}
 ];
 const openRoleHelpTask=(task:RoleHelpTask)=>{
  setShowFeatureOverview(false);
  if(task.action==="teams"){betaBridge?.openCoachTeams?.();return}
  if(task.action==="players"){betaBridge?.openParentPlayers?.();return}
  if(task.action==="joinTeam"){betaBridge?.openPlayerJoinTeam?.();return}
  if(task.action==="admin"){betaBridge?.openBetaAdmin?.();return}
  if(!task.tab)return;
  if(task.subView==="Review"){try{sessionStorage.setItem("coachHubMode","Review")}catch{}}
  if(task.subView==="Observations"){try{sessionStorage.setItem("developmentView","Observations")}catch{}}
  setTab(task.tab);
  if(task.subView==="weekly")window.setTimeout(()=>document.getElementById("setup-weekly-review")?.scrollIntoView({behavior:"smooth",block:"center"}),220);
 };
 const featureOverviewItems=featureCatalog.filter(item=>visibleTabs.includes(item.tab));
 const featureOverviewGroups=(["Overview","Plan","Train","Progress","More"] as const)
  .map(group=>({group,items:featureOverviewItems.filter(item=>item.group===group)}))
  .filter(group=>group.items.length>0);
 const roleToolsOverview=
  effectiveRole==="Parent"
   ?{title:"Parent account tools",description:"Use My Players to switch athletes or join a Coach team. Parent navigation now includes Recovery & Notes, where Parents can add shared support-team notes while training and performance editing remains protected."}
   :effectiveRole==="Coach"
   ?{title:"Coach team tools",description:"Use Teams to create/select teams, share Player Invite Codes, view joined athletes, and open athlete workspaces. Only Coach accounts manage team rosters."}
   :effectiveRole==="Player"
   ?{title:"Player account tools",description:"Use Join Team to enter a Coach's invite code. Your own training, testing, goals, readiness, development, and competition data stay in your athlete workspace."}
   :{title:"Admin beta tools",description:"Use Beta Admin to approve Coach/Admin access and the role-preview selector to review Player, Coach, and Parent experiences. Admin also has full in-app feature access."};



 
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
  const handler=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setCommandOpen(x=>!x)}if(e.key==="Escape"){setCommandOpen(false);setShowSettings(false)}};
  window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler)
 },[]);

 if(!mounted)return <div className="app hydrationShell"><header><div className="logo">AP</div><div><strong>Athlete Performance</strong><small>Loading athlete dashboard…</small></div></header><main id="main-content" tabIndex={-1}><div className="hydrationCard"><div className="hydrationPulse"/><div><b>Loading your performance data</b><small>Your saved athlete data will appear in a moment.</small></div></div></main></div>;
 if(!accountSession)return betaBridge?<div className="app hydrationShell"><main><div className="hydrationCard"><div className="hydrationPulse"/><div><b>Loading secure beta workspace</b><small>Verifying your account permissions…</small></div></div></main></div>:<RoleLogin profile={profile} activeAthleteId={activeAthleteId} roster={roster} onLogin={completeRoleLogin}/>;
 return <div className="app" data-text-size={textSize} data-role={effectiveRole}><a className="skipLink" href="#main-content">Skip to main content</a>
  <header className="appHeader"><div className="brandBlock"><div className="logo">AP</div><div><strong>Athlete Performance</strong><small>Train with purpose.</small></div>{betaBridge&&<button type="button" className={"cloudStatus cloudStatusButton "+cloudStatus} onClick={()=>{if(cloudStatus==="error"||pendingCloudSave)void retryPendingCloudSave()}} title={cloudErrorMessage||undefined}>{cloudStatus==="saved"?(cloudLastSavedAt?"Cloud saved":"Cloud ready"):cloudStatus==="loading"?"Saving…":cloudStatus==="error"?"Sync issue · Retry":"Local"}{pendingCloudSave&&<i>Retry copy saved</i>}</button>}</div><div className="headerActions"><span className="accountHeaderRole">{accountRole==="Admin"&&adminView!=="Admin"?`Admin · ${adminView}`:accountRole}</span>
   {betaBridge?.openParentPlayers&&accountRole==="Parent"&&<button className="headerUtilityButton" onClick={betaBridge.openParentPlayers}>My Players</button>}
   {betaBridge?.openPlayerJoinTeam&&accountRole==="Player"&&<button className="headerUtilityButton" onClick={betaBridge.openPlayerJoinTeam}>Join Team</button>}
   {betaBridge?.openCoachTeams&&accountRole==="Coach"&&<button className="headerUtilityButton" onClick={betaBridge.openCoachTeams}>Teams</button>}
   {betaBridge?.returnToCoachWorkspace&&accountRole==="Coach"&&betaBridge.selectedAthleteName&&<button className="headerUtilityButton coachReturnButton" onClick={betaBridge.returnToCoachWorkspace}>Coach Home</button>}
   {betaBridge?.openBetaAdmin&&accountRole==="Admin"&&<button className="headerUtilityButton" onClick={betaBridge.openBetaAdmin}>Beta Admin</button>}
   {betaBridge?.openFeedback&&<button className="headerUtilityButton reportProblemButton" onClick={betaBridge.openFeedback}>Report Problem</button>}
   <button className="settingsButton" onClick={()=>setShowSettings(true)} aria-label="Open settings">Settings</button><button className="helpButton" onClick={resumeGuide}>Help</button>
  </div></header>
  <div className="contextBar cleanContext"><div className="athleteContext"><small>ACTIVE ATHLETE</small><b>{profile.name}</b><span>{sport}{profile.position?` · ${profile.position}`:""}{profile.team?` · ${profile.team}`:""}</span></div><div className="contextControls">{accountRole!=="Player"&&allowedAthletes.length>0&&<label className="athleteSelector"><small>Viewing</small><select value={activeAthleteId} onChange={e=>selectAthleteById(e.target.value)}>{allowedAthletes.map(a=><option value={a.id} key={a.id}>{a.name} · {a.sport}{a.team?` · ${a.team}`:""}</option>)}</select></label>}{accountRole==="Admin"&&<label className="adminViewPicker"><small>Preview role</small><select value={adminView} onChange={e=>{setAdminView(e.target.value as "Admin"|"Coach"|"Player"|"Parent");setTab("Home")}}><option>Admin</option><option>Coach</option><option>Player</option><option>Parent</option></select></label>}<div className="sessionIdentity"><small>SIGNED IN</small><b>{accountSession.displayName}</b><span>{accountRole}</span></div><button className="signOutButton" onClick={signOutRole}>Sign out</button></div></div>
  <main>
   <div className="sportSelectorBlock lockedProfileSport"><div className="sportSelectorHead"><small>PROFILE SPORT</small><span>Locked to this athlete</span></div><div className="lockedSportDisplay"><button className="sel lockedSportButton" type="button" disabled aria-label={`${sport} is locked to this athlete profile`}>{sport}</button><span>Sport changes only through <b>Edit Profile</b>.</span></div></div>
   {guideWaitingFor&&<div className="setupWaitingBanner"><div><small>SETUP IN PROGRESS</small><b>{guideSteps.find(x=>x.id===guideWaitingFor)?.complete?"Complete this step and the guide will continue automatically.":"Explore this feature, then return to the guide when you're ready."}</b></div><button onClick={()=>{setGuideWaitingFor(null);resumeGuide()}}>Return to Guide</button></div>}
   <div className="workspaceGuide"><div><small>{effectiveRole.toUpperCase()} WORKSPACE</small><b>{effectiveRole==="Coach"?"Manage athletes and training decisions":effectiveRole==="Parent"?"Review, support, and communicate":effectiveRole==="Player"?"Keep today simple: check in, train, improve":"Full access and role testing"}</b></div><span>{roleNavLabel(tab)}</span></div><div className="pageGuide"><div><small>{effectiveRole==="Parent"?(parentPageHelp[tab]?.title||roleNavLabel(tab)):effectiveRole==="Player"?(playerPageHelp[tab]?.title||roleNavLabel(tab)):pageHelp[tab]?.title||tab}</small><b>{effectiveRole==="Parent"?(parentPageHelp[tab]?.purpose||""):effectiveRole==="Player"?(playerPageHelp[tab]?.purpose||""):pageHelp[tab]?.purpose||""}</b></div><span>{effectiveRole==="Parent"?(parentPageHelp[tab]?.primary||""):effectiveRole==="Player"?(playerPageHelp[tab]?.primary||""):pageHelp[tab]?.primary||""}</span></div>{activeGroupTabs.length>1&&<div className="sectionSubnav">{activeGroupTabs.map(x=><button key={x} className={tab===x?"active":""} onClick={()=>setTab(x)}>{roleNavLabel(x)}</button>)}</div>}
   {tab==="Home"&&(effectiveRole==="Parent"?<ParentHome profile={profile} sport={sport} goals={goals} workouts={workouts} readiness={readiness} weeklyReviews={weeklyReviews} coachWeeklyReviews={coachWeeklyReviews} developmentSystem={developmentSystem} competitions={competitions} dev={dev} program={program} setTab={setTab}/>:effectiveRole==="Admin"?<><AdminHome profile={profile} sport={sport} roster={roster}/><Home accountRole={effectiveRole} sport={sport} setSport={setSport} goals={goals} workouts={workouts} results={results} profile={profile} setProfile={setProfile} onProfileSaved={handleProfileSaved} readiness={readiness} competitions={competitions} dev={dev} program={program} weeklyReviews={weeklyReviews} setWeeklyReviews={setWeeklyReviews} coachWeeklyReviews={coachWeeklyReviews} developmentSystem={developmentSystem} testTargets={testTargets} workspaceRole={roleToWorkspace(effectiveRole)} onboardingDismissed={onboardingDismissed} setOnboardingDismissed={setOnboardingDismissed} setTab={setTab} editProfileRequest={editProfileRequest}/></>:<Home accountRole={effectiveRole} sport={sport} setSport={setSport} goals={goals} workouts={workouts} results={results} profile={profile} setProfile={setProfile} onProfileSaved={handleProfileSaved} readiness={readiness} competitions={competitions} dev={dev} program={program} weeklyReviews={weeklyReviews} setWeeklyReviews={setWeeklyReviews} coachWeeklyReviews={coachWeeklyReviews} developmentSystem={developmentSystem} testTargets={testTargets} workspaceRole={roleToWorkspace(effectiveRole)} onboardingDismissed={onboardingDismissed} setOnboardingDismissed={setOnboardingDismissed} setTab={setTab} editProfileRequest={editProfileRequest}/>)} 
   {tab==="Goals"&&<Goals goals={goals} setGoals={setGoals}/>}
   {tab==="Calendar"&&(effectiveRole==="Parent"?<ParentSchedule sport={sport} workouts={workouts} competitions={competitions} seasonEvents={seasonEvents} setTab={setTab}/>:<Calendar sport={sport} workouts={workouts} setWorkouts={setWorkouts} profile={profile} seasonEvents={seasonEvents} setSeasonEvents={setSeasonEvents} trainingBlocks={trainingBlocks} setTrainingBlocks={setTrainingBlocks} competitions={competitions}/>)} 
   {tab==="Testing"&&<Testing sport={sport} library={[...definitions(sport),...custom.filter(x=>x.sport===sport)]} custom={custom} setCustom={setCustom} results={results} setResults={setResults} testTargets={testTargets} setTestTargets={setTestTargets}/>} 
   {tab==="Analytics"&&(effectiveRole==="Parent"?<ParentProgress sport={sport} profile={profile} goals={goals} workouts={workouts} results={results} readiness={readiness} competitions={competitions} setTab={setTab}/>:<AnalyticsHub accountRole={effectiveRole} setTab={setTab} setDev={setDev} setGoals={setGoals} setWorkouts={setWorkouts} sport={sport} profile={profile} goals={goals} workouts={workouts} results={results} dev={dev} program={program} readiness={readiness} competitions={competitions} reportNotes={reportNotes} setReportNotes={setReportNotes}/>)} 
   {tab==="Coach"&&((effectiveRole==="Coach"||effectiveRole==="Admin")?<CoachHub athleteId={betaBridge?.workspaceId||activeAthleteId} accountRole={effectiveRole} authorName={accountSession.displayName} saveSharedNotes={betaBridge?.saveSharedNotes} coachWeeklyReviews={coachWeeklyReviews} setCoachWeeklyReviews={setCoachWeeklyReviews} saveCoachWeeklyReview={betaBridge?.saveCoachWeeklyReview} canWriteCoachReview={accountRole==="Coach"&&Boolean(betaBridge?.selectedAthleteName)} sport={sport} profile={profile} goals={goals} workouts={workouts} results={results} dev={dev} program={program} readiness={readiness} setReadiness={setReadiness} weeklyReviews={weeklyReviews} competitions={competitions} coachNotes={coachNotes} setCoachNotes={setCoachNotes}/>:effectiveRole==="Player"?<Readiness sport={sport} profile={profile} readiness={readiness} setReadiness={setReadiness} weeklyReviews={weeklyReviews} coachNotes={coachNotes} setCoachNotes={setCoachNotes} program={program} workouts={workouts} accountRole="Player" authorName={accountSession.displayName} saveSharedNotes={betaBridge?.saveSharedNotes}/>:effectiveRole==="Parent"?<Readiness sport={sport} profile={profile} readiness={readiness} setReadiness={setReadiness} weeklyReviews={weeklyReviews} coachNotes={coachNotes} setCoachNotes={setCoachNotes} program={program} workouts={workouts} accountRole="Parent" authorName={accountSession.displayName} saveSharedNotes={betaBridge?.saveSharedNotes}/>:null)} 
   
   {tab==="Development"&&(effectiveRole==="Parent"?<ParentDevelopment sport={sport} profile={profile} dev={dev} program={program} milestones={milestones} developmentSystem={developmentSystem} readiness={readiness} weeklyReviews={weeklyReviews} coachWeeklyReviews={coachWeeklyReviews} goals={goals} workouts={workouts} results={results} competitions={competitions} setTab={setTab}/>:<DevelopmentHub accountRole={effectiveRole} sport={sport} profile={profile} dev={dev} setDev={setDev} results={results} goals={goals} workouts={workouts} program={program} setProgram={setProgram} readiness={readiness} weeklyReviews={weeklyReviews} coachWeeklyReviews={coachWeeklyReviews} competitions={competitions} milestones={milestones} setMilestones={setMilestones} developmentSystem={developmentSystem} setDevelopmentSystem={setDevelopmentSystem} setWorkouts={setWorkouts}/>)} 
   
   
   {tab==="Competition"&&(effectiveRole==="Parent"?<ParentCompetition sport={sport} profile={profile} competitions={competitions} setTab={setTab}/>:<Competition sport={sport} competitions={competitions} setCompetitions={setCompetitions} profile={profile}/>)} 
   
   {tab==="Roster"&&(effectiveRole==="Coach"||effectiveRole==="Admin")&&<>{effectiveRole==="Admin"&&<AdminBetaHealth cloudStatus={cloudStatus} lastSaved={cloudLastSavedAt} error={cloudErrorMessage} pending={pendingCloudSave} workspaceId={betaBridge?.workspaceId||""} selectedAthlete={betaBridge?.selectedAthleteName||profile.name} cloudLoaded={!betaBridge||cloudReadyWorkspaceRef.current===betaBridge.workspaceId}/>}<Roster accountRole={effectiveRole} sport={sport} profile={profile} roster={roster} setRoster={setRoster} activeAthleteId={activeAthleteId} switchAthlete={switchAthlete} setTab={setTab} setEditProfileRequest={setEditProfileRequest} goals={goals} currentWorkouts={workouts} currentResults={results} currentDev={dev} currentReadiness={readiness} currentCompetitions={competitions} currentDevelopmentSystem={developmentSystem} currentTestTargets={testTargets} currentCoachWeeklyReviews={coachWeeklyReviews} cloudSelectedAthleteName={betaBridge?.selectedAthleteName} coachCloudRoster={coachCloudRoster} coachRosterCloudStatus={coachRosterCloudStatus} selectCoachRosterAthlete={betaBridge?.selectCoachRosterAthlete}/>{effectiveRole==="Admin"&&<DataCenter profile={profile} sport={sport} roster={roster} activeAthleteId={activeAthleteId} goals={goals} workouts={workouts} results={results} dev={dev} program={program} readiness={readiness} coachNotes={coachNotes} competitions={competitions} reportNotes={reportNotes} developmentSystem={developmentSystem} setProfile={setProfile} setGoals={setGoals} setWorkouts={setWorkouts} setResults={setResults} setDev={setDev} setProgram={setProgram} setReadiness={setReadiness} setCoachNotes={setCoachNotes} setCompetitions={setCompetitions} setReportNotes={setReportNotes} setDevelopmentSystem={setDevelopmentSystem} setRoster={setRoster} setActiveAthleteId={setActiveAthleteId} setSport={setSport}/>}</>} 
   
    
  </main>
  {showGuide&&accountSession&&<div className="guideOverlay" role="dialog" aria-modal="true" aria-label="Getting started guide"><div className="guideCard">
   <div className="guideTop"><div><small>{effectiveRole.toUpperCase()} SETUP</small><b>Step {guideStep+1} of {guideSteps.length}</b></div><button onClick={requestSkipSetup} aria-label="Skip setup">Skip setup</button></div>
   <div className="guideProgress"><i style={{width:`${Math.round((guideStep+1)/guideSteps.length*100)}%`}}/></div>
   <div className="guideBody"><span className="guideIcon">{guideStep===0?"◆":guideStep===guideSteps.length-1?"✓":guideStep+1}</span><h2>{guideSteps[guideStep]?.title}</h2><p>{guideSteps[guideStep]?.body}</p>{guideSteps[guideStep]?.button&&<button className="featureAction guideAction" onClick={jumpToGuideTarget}>{guideSteps[guideStep].button}</button>}</div>
   <div className="guideFooter"><button disabled={guideStep===0} onClick={()=>openGuideStep(guideStep-1)}>Back</button><button disabled={guideSteps[guideStep]?.id==="profile"&&canEditPlayerProfile&&!profileSavedForGuide} onClick={()=>guideStep===guideSteps.length-1?finishGuide():openGuideStep(guideStep+1)}>{guideStep===guideSteps.length-1?"Finish":"Continue"}</button></div>
   <small className="guideHint">{guideSteps[guideStep]?.button?"Use the main button to go do this step. When the required information is saved, setup continues automatically.":"Every step is optional."}</small>
  </div></div>}
  {showReadinessPrompt&&accountSession&&!showGuide&&!showFeatureOverview&&<div className="routinePromptOverlay" role="dialog" aria-modal="true" aria-label="Morning readiness check-in"><div className="routinePromptCard">
   <span className="routinePromptIcon">☀</span><small>GOOD MORNING</small><h2>Ready for your daily check-in?</h2><p>Take a minute to log sleep, energy, soreness, and stress so today's training can match how you feel.</p>
   <div className="routinePromptActions"><button onClick={dismissReadinessPrompt}>Not now</button><button className="featureAction" onClick={openReadinessFromPrompt}>Start Readiness Check-in</button></div>
  </div></div>}
  {showWeeklyReviewPrompt&&accountSession&&!showGuide&&!showFeatureOverview&&!showReadinessPrompt&&<div className="routinePromptOverlay" role="dialog" aria-modal="true" aria-label="Weekly review reminder"><div className="routinePromptCard">
   <span className="routinePromptIcon">✓</span><small>END OF WEEK</small><h2>Complete your weekly review</h2><p>Review the week of <b>{friendlyDate(thisWeekStart)}</b>: record the biggest win, main challenge, next week's focus, and an overall rating.</p>
   <div className="routinePromptActions"><button onClick={dismissWeeklyReviewPrompt}>Not now</button><button className="featureAction" onClick={openWeeklyReviewFromPrompt}>Fill Out Weekly Review</button></div>
  </div></div>}
  {showFeatureOverview&&accountSession&&<div className="featureHelpOverlay" role="dialog" aria-modal="true" aria-label="App feature overview"><div className="featureHelpCard">
   <div className="featureHelpHead"><div><small>{featureOverviewSource==="setup"?`${effectiveRole.toUpperCase()} SETUP COMPLETE`:`${effectiveRole.toUpperCase()} HELP`}</small><h2>{featureOverviewSource==="setup"?`Your ${effectiveRole} workspace is ready`:`How to use your ${effectiveRole} account`}</h2><p>{effectiveRole==="Player"?"This Help page only teaches the Player workflow. Start with Today and open more detail only when you want it.":effectiveRole==="Coach"?"This Help page focuses on selecting Players, scanning the roster, readiness, development, observations, and Coach reviews.":effectiveRole==="Parent"?"This Help page focuses on switching Players, schedule, recovery, progress, development support, and communication.":"This Help page focuses on beta administration, role testing, diagnostics, and athlete oversight."}</p></div><button onClick={()=>setShowFeatureOverview(false)} aria-label="Close help">×</button></div>

   <div className="roleHelpTaskSection">
    <div className="sectionHead"><div><small>QUICK HELP</small><h3>{effectiveRole==="Player"?"What do you want to do?":effectiveRole==="Coach"?"Coach tasks":effectiveRole==="Parent"?"Parent tasks":"Admin tasks"}</h3></div><span className="tag">{roleHelpTasks.length}</span></div>
    <div className="roleHelpTaskGrid">{roleHelpTasks.map(task=><button key={task.title} onClick={()=>openRoleHelpTask(task)}><b>{task.title}</b><span>{task.detail}</span><small>Open →</small></button>)}</div>
   </div>

   <div className="featureNavHowTo">
    <div><small>1</small><b>{effectiveRole==="Player"?"Start with Today":"Start with your Overview"}</b><span>{effectiveRole==="Player"?"Daily Check-In, next training, and current focus are placed first.":"Your role-specific overview points you to the next useful action."}</span></div>
    <div><small>2</small><b>Open only what you need</b><span>{effectiveRole==="Parent"?"Overview · Schedule · Recovery · Progress · More":"Plan · Train · Progress · More keep related tools together."}</span></div>
    <div><small>3</small><b>Use Help anytime</b><span>This page only shows tools and instructions for the account you are currently viewing.</span></div>
   </div>

   <div className="featureNavMap">
    {featureOverviewGroups.map(group=><div key={group.group}><b>{group.group}</b><span>{group.items.map(item=>item.title).join(" · ")}</span></div>)}
   </div>

   <div className="roleToolsOverview"><small>YOUR {effectiveRole.toUpperCase()} TOOLS</small><b>{roleToolsOverview.title}</b><p>{roleToolsOverview.description}</p></div>

   <div className="featureOverviewSections">{featureOverviewGroups.map(group=><section key={group.group}><div className="featureGroupTitle"><span>{group.group}</span><small>{group.items.length} feature{group.items.length===1?"":"s"}</small></div><div className="featureHelpGrid">{group.items.map(item=><button key={item.tab} className="featureHelpItem" onClick={()=>openFeatureFromHelp(item.tab)}><div><span className="featureHelpIcon">{navMeta[item.tab]?.icon||"•"}</span><b>{item.title}</b></div><p>{item.description}</p><span className="featureHow">{item.how}</span><small>Open {item.title} →</small></button>)}</div></section>)}</div>

   <div className="featureHelpFooter"><div><b>{featureOverviewSource==="setup"?"You’re ready to use the app":"Need setup help again?"}</b><span>{featureOverviewSource==="setup"?"Close this tour and start from Overview. You can reopen this guide anytime with Help.":"Restart the guided setup at any time without removing your saved data."}</span></div><div className="featureHelpFooterActions">{featureOverviewSource==="setup"&&<button className="featureAction" onClick={()=>{setShowFeatureOverview(false);setTab("Home")}}>Start Using App</button>}<button onClick={()=>{setShowFeatureOverview(false);setFeatureOverviewSource("help");setGuideStep(0);setShowGuide(true)}}>Restart Setup Guide</button></div></div>
  </div></div>}
  {showSkipSetupDisclaimer&&<div className="skipSetupOverlay" role="alertdialog" aria-modal="true" aria-label="Setup incomplete"><div className="skipSetupCard">
   <span className="skipSetupIcon">!</span>
   <small>SETUP INCOMPLETE</small>
   <h2>Your setup is not finished yet</h2>
   <p>You can skip the guided setup now, but some profile information or app features may still need to be completed. You can tap <b>Help</b> at any time to continue the setup guide from where you left off.</p>
   <div className="skipSetupActions"><button onClick={()=>setShowSkipSetupDisclaimer(false)}>Continue Setup</button><button className="skipAnywayButton" onClick={confirmSkipSetup}>Skip Setup Anyway</button></div>
  </div></div>}
  {showSettings&&<div className="settingsOverlay" role="dialog" aria-modal="true" aria-label="App settings" onClick={()=>setShowSettings(false)}><div className="settingsCard" onClick={e=>e.stopPropagation()}>
   <div className="settingsHead"><div><small>SETTINGS</small><h2>Display & Text</h2><p>Choose the text size that is easiest to read. Your choice is saved on this device.</p></div><button className="settingsClose" aria-label="Close settings" onClick={()=>setShowSettings(false)}>×</button></div>
   <div className="textSizeSetting">
    <div className="settingLabel"><b>Text size</b><span>Applies throughout the app, including workout instructions and navigation.</span></div>
    <div className="textSizeChoices">
     {([
       ["standard","Standard","100%"],
       ["comfortable","Comfortable","110%"],
       ["large","Large","120%"],
       ["xlarge","Extra Large","132%"]
      ] as [TextSize,string,string][]).map(([value,label,scale])=><button type="button" key={value} className={textSize===value?"active":""} onClick={()=>changeTextSize(value)}><span className="textSizeSample">Aa</span><div><b>{label}</b><small>{scale}</small></div>{textSize===value&&<strong>✓</strong>}</button>)}
    </div>
    <div className="textPreview"><small>PREVIEW</small><b>Training should be easy to read.</b><p>Exercise instructions, setup steps, coaching cues, and safety notes will use this text size.</p></div>
   </div>
   <div className="settingsFooter"><button onClick={()=>changeTextSize("comfortable")}>Use Recommended Size</button><button className="featureAction" onClick={()=>setShowSettings(false)}>Done</button></div>
  </div></div>}
  {commandOpen&&<div className="commandOverlay" role="dialog" aria-modal="true" aria-label="Quick navigation" onClick={()=>setCommandOpen(false)}><div className="commandPalette" onClick={e=>e.stopPropagation()}><div className="sectionHead"><h2>Go to a section</h2><button aria-label="Close quick navigation" onClick={()=>setCommandOpen(false)}>×</button></div><input autoFocus value={commandQuery} onChange={e=>setCommandQuery(e.target.value)} placeholder="Search Overview, Goals, Testing, Roster…"/><div className="commandResults">{filteredActions.map(a=><button key={a.id} onClick={()=>{setTab(a.tab);setCommandOpen(false);setCommandQuery("")}}><span>{navMeta[a.tab]?.icon||"•"}</span><b>{a.label}</b><small>{a.keywords.join(" · ")}</small></button>)}</div></div></div>}
 {navSheet&&<div className="simpleNavOverlay" onClick={()=>setNavSheet(null)}><div className="simpleNavSheet" onClick={e=>e.stopPropagation()}>
   <div className="sectionHead"><div><small>{navSheet.toUpperCase()}</small><h2>{navSheet==="More"?"More Features":navSheet}</h2></div><button onClick={()=>setNavSheet(null)}>×</button></div>
   <div className="simpleNavChoices">{(effectiveRole==="Parent"&&navSheet==="More"?(["Development","Competition"] as Tab[]):navGroups[navSheet]).map(x=><button key={x} onClick={()=>{setTab(x);setNavSheet(null)}}><span>{navMeta[x]?.icon||"•"}</span><div><b>{roleNavLabel(x)}</b><small>{effectiveRole==="Parent"?(parentPageHelp[x]?.purpose||pageHelp[x]?.purpose||""):pageHelp[x]?.purpose||""}</small></div><strong>Open →</strong></button>)}</div>
   {navSheet==="More"&&<button className="allFeaturesButton" onClick={()=>{setNavSheet(null);setCommandOpen(true)}}>Search All Features</button>}
  </div></div>}
 {effectiveRole==="Parent"?<div className="simpleBottomNav parentBottomNav">
  <button className={tab==="Home"?"active":""} onClick={()=>setTab("Home")}><span>⌂</span><b>Overview</b></button>
  <button className={tab==="Calendar"?"active":""} onClick={()=>setTab("Calendar")}><span>▦</span><b>Schedule</b></button>
  <button className={tab==="Coach"?"active":""} onClick={()=>setTab("Coach")}><span>♡</span><b>Recovery</b></button>
  <button className={tab==="Analytics"?"active":""} onClick={()=>setTab("Analytics")}><span>⌁</span><b>Progress</b></button>
  <button className={tab==="Development"||tab==="Competition"?"active":""} onClick={()=>setNavSheet("More")}><span>•••</span><b>More</b></button>
 </div>:<div className={"simpleBottomNav "+(effectiveRole==="Player"?"playerBottomNav":"")}>
  <button className={tab==="Home"?"active":""} onClick={()=>setTab("Home")}><span>⌂</span><b>{effectiveRole==="Player"?"Today":"Overview"}</b></button>
  <button className={groupActive("Plan")?"active":""} onClick={()=>openNavGroup("Plan")}><span>▦</span><b>Plan</b></button>
  <button className={groupActive("Train")?"active":""} onClick={()=>openNavGroup("Train")}><span>◇</span><b>Train</b></button>
  <button className={groupActive("Progress")?"active":""} onClick={()=>openNavGroup("Progress")}><span>⌁</span><b>Progress</b></button>
  <button className={groupActive("More")?"active":""} onClick={()=>openNavGroup("More")}><span>•••</span><b>More</b></button>
 </div>}
 </div>
}



function RoleLogin({profile,activeAthleteId,roster,onLogin}:{profile:Profile;activeAthleteId:string;roster:AthleteRecord[];onLogin:(role:AccountRole,name:string,linkedAthleteIds?:string[])=>void}){
 const [role,setRole]=useState<AccountRole>("Player");
 const [name,setName]=useState("");
 const [parentLinks,setParentLinks]=useState<string[]>([activeAthleteId]);
 const descriptions:Record<AccountRole,string>={
  Admin:"Full owner/developer access to every feature plus role-preview controls for testing Player, Coach, and Parent experiences.",
  Player:"My training, goals, testing, readiness, development, mental preparation, and competition tools.",
  Coach:"Athlete management, roster tools, program creation, shared support-team notes, testing oversight, and team analytics.",
  Parent:"A simplified view of schedule, recovery, progress, development, competition, and shared support-team notes."
 };
 const loginAthletes:AthleteRecord[]=[{id:"primary",name:profile.name,sport:profile.sport||"Ice Hockey",position:profile.position,team:profile.team,season:profile.season,height:profile.height,weight:profile.weight,handedness:profile.handedness},...roster.filter(r=>r.id!=="primary")];
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


function ParentSectionNav({tab,setTab}:{tab:Tab;setTab:React.Dispatch<React.SetStateAction<Tab>>}){
 const items:{tab:Tab;label:string;icon:string}[]=[
  {tab:"Home",label:"Overview",icon:"⌂"},
  {tab:"Calendar",label:"Schedule",icon:"▦"},
  {tab:"Coach",label:"Recovery",icon:"♡"},
  {tab:"Analytics",label:"Progress",icon:"⌁"},
  {tab:"Development",label:"Development",icon:"◇"},
  {tab:"Competition",label:"Competition",icon:"★"}
 ];
 return <nav className="parentSectionNav" aria-label="Parent sections">
  {items.map(x=><button key={x.tab} className={tab===x.tab?"active":""} onClick={()=>setTab(x.tab)}><span>{x.icon}</span><b>{x.label}</b></button>)}
 </nav>;
}

function ParentHome({profile,sport,goals,workouts,readiness,weeklyReviews,coachWeeklyReviews,developmentSystem,competitions,dev,program,setTab}:{profile:Profile;sport:Sport;goals:Goal[];workouts:Workout[];readiness:ReadinessLog[];weeklyReviews:WeeklyReview[];coachWeeklyReviews:CoachWeeklyReview[];developmentSystem:DevelopmentSystemState;competitions:CompetitionLog[];dev:DevelopmentItem[];program:TrainingProgram|null;setTab:React.Dispatch<React.SetStateAction<Tab>>}){
 const [showMore,setShowMore]=useState(false);
 const upcoming=workouts.filter(w=>w.sport===sport&&!w.completed&&w.date>=today()).sort((a,b)=>a.date.localeCompare(b.date));
 const nextComp=competitions.filter(c=>c.sport===sport&&c.date>=today()).sort((a,b)=>a.date.localeCompare(b.date))[0];
 const activeGoals=goals.filter(g=>(g.status||"Active")!=="Complete");
 const avgGoal=activeGoals.length?Math.round(activeGoals.reduce((a,g)=>a+g.progress,0)/activeGoals.length):0;
 const latest=readiness[0];
 const latestWeeklyReview=weeklyReviews.slice().sort((a,b)=>b.weekStart.localeCompare(a.weekStart))[0];
 const latestCoachReview=coachWeeklyReviews.slice().sort((a,b)=>b.weekStart.localeCompare(a.weekStart))[0];
 const latestReadinessScore=latest?readinessScoreV2(latest,Number(profile.age||0)):0;
 const parentSupportHeadline=latest&&latestReadinessScore<60
  ?"Protect recovery and keep the day simple"
  :nextComp&&new Date(nextComp.date).getTime()-Date.now()<=2*86400000
  ?"Keep competition support calm and athlete-led"
  :latestCoachReview?.nextWeekFocus
  ?"Reinforce the Coach's focus without adding extra coaching"
  :upcoming[0]
  ?"Help the athlete arrive ready for the next session"
  :"Ask what kind of support would be useful today";
 const parentSupportDetail=latest&&latestReadinessScore<60
  ?`Readiness is ${latestReadinessScore}/100. Help protect sleep, food, hydration, transportation, and downtime. Let the Player and Coach decide training changes.`
  :latestCoachReview?.nextWeekFocus
  ?`Coach focus: ${latestCoachReview.nextWeekFocus}`
  :upcoming[0]
  ?`${upcoming[0].name} is next. Help with the practical details so the athlete can focus on training.`
  :"A short check-in is often enough: listen first, then ask before giving advice.";
 const openDev=dev.filter(d=>d.status!=="Complete");
 const parentPillarRows=developmentPillars.map(p=>({pillar:p,score:developmentSystem.pillarRatings[p]||3})).sort((a,b)=>a.score-b.score);
 const parentTopDevelopment=parentPillarRows[0];
 const parentSkillNeeds=sportSkillTrees[sport].filter(name=>developmentSystem.skillProgress[name]?.level==="Needs Work");
 const nextWorkout=upcoming[0];
 const attention=[
  !latest?{label:"No recent recovery check-in",detail:"Open Recovery to review the recovery tools and shared notes.",tab:"Coach" as Tab}:null,
  activeGoals.length===0?{label:"No active goals",detail:"The athlete or coach can add a development goal.",tab:"Analytics" as Tab}:null,
  openDev.length?{label:"Development priority",detail:openDev[0].title,tab:"Development" as Tab}:null,
  nextComp?{label:"Next competition",detail:`${nextComp.date} · ${nextComp.opponent||nextComp.eventType}`,tab:"Competition" as Tab}:null
 ].filter(Boolean) as {label:string;detail:string;tab:Tab}[];
 const visibleUpcoming=upcoming.slice(0,showMore?8:3);

 return <>
  <ParentSectionNav tab="Home" setTab={setTab}/>
  <div className="hero parentHomeHero"><small>PARENT OVERVIEW</small><h1>{profile.name}</h1><p>{sport}{profile.position?" · "+profile.position:""} · Choose what you want to review. Parent pages are view-focused, with shared notes available in Recovery.</p></div>

  <div className="parentStartCard">
   <div><small>WHAT DO YOU WANT TO CHECK?</small><h2>Go directly where you need to go</h2></div>
   <div className="parentTaskGrid">
    <button onClick={()=>setTab("Calendar")}><span>▦</span><b>Schedule</b><small>Practices, workouts & events</small></button>
    <button onClick={()=>setTab("Coach")}><span>♡</span><b>Recovery</b><small>Sleep, mindfulness & notes</small></button>
    <button onClick={()=>setTab("Analytics")}><span>⌁</span><b>Progress</b><small>Testing & performance trends</small></button>
    <button onClick={()=>setTab("Development")}><span>◇</span><b>Development</b><small>Priorities, plan & milestones</small></button>
    <button onClick={()=>setTab("Competition")}><span>★</span><b>Competition</b><small>Results & event notes</small></button>
   </div>
  </div>

  <div className="parentSnapshotGrid">
   <button onClick={()=>setTab("Analytics")}><small>GOAL PROGRESS</small><b>{avgGoal}%</b><span>Open progress →</span></button>
   <button onClick={()=>setTab("Calendar")}><small>NEXT WORKOUT</small><b>{nextWorkout?friendlyDate(nextWorkout.date):"None"}</b><span>{nextWorkout?.name||"Schedule is clear"}</span></button>
   <button onClick={()=>setTab("Coach")}><small>RECOVERY</small><b>{latest?`${latest.energy}/10 energy`:"No check-in"}</b><span>{latest?`${latest.sleep}h sleep`:"Open recovery →"}</span></button>
  </div>

  <div className="card parentPlayerCheckinSummary">
   <div className="sectionHead"><div><small>PLAYER-ENTERED</small><h2>Check-Ins & Weekly Reviews</h2><p>Only {profile.name} can submit these. Linked Parents and Coaches can review the results.</p></div><button onClick={()=>setTab("Coach")}>Open Recovery</button></div>
   <div className="parentCheckinResultGrid">
    <button onClick={()=>setTab("Coach")}><small>LATEST DAILY CHECK-IN</small><b>{latest?friendlyDate(latest.date):"No entry yet"}</b><span>{latest?`${latest.sleep}h sleep · ${latest.energy}/10 energy · ${latest.soreness}/10 soreness · ${latest.stress}/10 stress`:"Waiting for the Player's first check-in."}</span></button>
    <div><small>LATEST WEEKLY REVIEW</small><b>{latestWeeklyReview?`Week of ${friendlyDate(latestWeeklyReview.weekStart)}`:"No review yet"}</b><span>{latestWeeklyReview?`${latestWeeklyReview.rating}/10${latestWeeklyReview.focus?` · Next: ${latestWeeklyReview.focus}`:""}`:"Waiting for the Player's first weekly review."}</span></div>
   </div>
  </div>

  <div className="card parentCoachReviewCard">
   <div className="sectionHead"><div><small>COACH PERSPECTIVE</small><h2>Coach Weekly Review</h2><p>Coach observations are automatically visible to linked Parents. The Coach decides whether each review is also shared with the Player.</p></div></div>
   {!latestCoachReview?<div className="parentEmptyState"><b>No Coach review yet</b><span>A linked Coach can add a weekly perspective from the Coach workspace.</span></div>:<>
    <div className="coachReviewMeta"><div><b>{latestCoachReview.coachName}</b><small>Week of {friendlyDate(latestCoachReview.weekStart)}</small></div><span className={latestCoachReview.shareWithPlayer?"shared":"parentOnly"}>{latestCoachReview.shareWithPlayer?"SHARED WITH PLAYER":"PARENT + COACH"}</span></div>
    <div className="coachReviewRatings compact">
     {[["Performance",latestCoachReview.performance],["Effort",latestCoachReview.effort],["Attitude",latestCoachReview.attitude],["Teamwork",latestCoachReview.teamwork],["Coachability",latestCoachReview.coachability],["Leadership",latestCoachReview.leadership]].map(([label,value])=><div key={String(label)}><small>{label}</small><b>{value}/5</b></div>)}
    </div>
    <div className="coachReviewParentNotes">
     {latestCoachReview.strengths&&<p><b>What stood out:</b> {latestCoachReview.strengths}</p>}
     {latestCoachReview.developmentOpportunity&&<p><b>Development opportunity:</b> {latestCoachReview.developmentOpportunity}</p>}
     {latestCoachReview.leadershipOpportunity&&<p><b>Leadership opportunity:</b> {latestCoachReview.leadershipOpportunity}</p>}
     {latestCoachReview.nextWeekFocus&&<p><b>Next-week focus:</b> {latestCoachReview.nextWeekFocus}</p>}
    </div>
   </>}
  </div>

  <div className="grid twoCards parentHomeTwo">
   <div className="card">
    <div className="sectionHead"><div><h2>Coming Up</h2><small>The next items that affect the athlete</small></div><button onClick={()=>setTab("Calendar")}>Full Schedule</button></div>
    {visibleUpcoming.length===0?<div className="parentEmptyState"><b>No upcoming workouts</b><span>There is nothing scheduled right now.</span></div>:visibleUpcoming.map(w=><button className="parentListButton" key={w.id} onClick={()=>setTab("Calendar")}><span className="dashDate">{w.date.slice(5)}</span><div><b>{w.name}</b><small>{w.category} · {w.minutes} min</small></div><strong>Open →</strong></button>)}
    {upcoming.length>3&&<button className="parentShowMore" onClick={()=>setShowMore(x=>!x)}>{showMore?"Show less":`Show ${Math.min(5,upcoming.length-3)} more`}</button>}
   </div>
   <div className="card">
    <div className="sectionHead"><div><h2>What Needs Attention?</h2><small>Tap an item to go directly to it</small></div></div>
    {attention.length===0?<div className="parentEmptyState good"><b>Nothing urgent</b><span>Keep supporting the current plan.</span></div>:attention.slice(0,4).map((x,i)=><button className="parentAttentionButton" key={i} onClick={()=>setTab(x.tab)}><div><b>{x.label}</b><small>{x.detail}</small></div><strong>Open →</strong></button>)}
   </div>
  </div>

  <div className="card parentSupportNowCard">
   <div className="sectionHead"><div><small>PARENT SUPPORT TOOL</small><h2>How can I support today?</h2><p>Support the athlete without becoming another Coach.</p></div><button onClick={()=>setTab("Development")}>Open Support Toolkit</button></div>
   <div className="parentSupportNowMain"><span>◎</span><div><small>BEST SUPPORT RIGHT NOW</small><b>{parentSupportHeadline}</b><p>{parentSupportDetail}</p></div></div>
   <div className="parentSupportMicroGrid">
    <div><small>ASK</small><b>"What would help you most today?"</b></div>
    <div><small>HELP</small><b>Remove practical stress: rides, food, gear, rest.</b></div>
    <div><small>AVOID</small><b>Last-minute coaching or replaying every mistake.</b></div>
   </div>
  </div>

  <div className="card parentDevelopmentSnapshot">
   <div className="sectionHead"><div><small>DEVELOPMENT BLUEPRINT</small><h2>What development needs most right now</h2></div><button onClick={()=>setTab("Development")}>Open Development</button></div>
   <div className="parentDevelopmentSnapshotGrid">
    <div><small>SEASON PHASE</small><b>{developmentSystem.seasonPhase}</b><span>Training priorities should match the time of year.</span></div>
    <div><small>CURRENT EMPHASIS</small><b>{parentTopDevelopment?.pillar||"Building baseline"}</b><span>{parentTopDevelopment?pillarAction(parentTopDevelopment.pillar,sport):"Complete the blueprint to identify priorities."}</span></div>
    <div><small>SKILLS NEEDING ATTENTION</small><b>{parentSkillNeeds.length}</b><span>{parentSkillNeeds.slice(0,2).join(" · ")||"No skills marked Needs Work"}</span></div>
   </div>
  </div>

  <div className="card parentSimpleStatus">
   <div className="sectionHead"><div><h2>Current Plan</h2><small>A quick summary—no digging required</small></div></div>
   <div>
    <button onClick={()=>setTab("Development")}><small>Training program</small><b>{program?`${program.focus} · ${program.daysPerWeek} days/week`:"No active program"}</b></button>
    <button onClick={()=>setTab("Development")}><small>Development priorities</small><b>{openDev.length}</b></button>
    <button onClick={()=>setTab("Competition")}><small>Next competition</small><b>{nextComp?`${friendlyDate(nextComp.date)} · ${nextComp.opponent||nextComp.eventType}`:"None scheduled"}</b></button>
   </div>
  </div>
 </>;
}

function ParentSchedule({sport,workouts,competitions,seasonEvents,setTab}:{sport:Sport;workouts:Workout[];competitions:CompetitionLog[];seasonEvents:SeasonEvent[];setTab:React.Dispatch<React.SetStateAction<Tab>>}){
 const [filter,setFilter]=useState<"All"|"Workout"|"Competition"|"Event">("All");
 const [range,setRange]=useState<"14"|"30"|"All">("30");
 const [expanded,setExpanded]=useState<string|null>(null);
 const maxDate=range==="All"?null:(()=>{const d=new Date();d.setDate(d.getDate()+Number(range));return localDate(d)})();
 const allItems=[
  ...workouts.filter(w=>w.sport===sport&&w.date>=today()).map(w=>({id:`w-${w.id}`,kind:"Workout" as const,date:w.date,title:w.name,detail:`${w.minutes} min · ${w.category}`,extra:w.focus||w.notes||`${w.intensity||"Planned"} training`})),
  ...competitions.filter(c=>c.sport===sport&&c.date>=today()).map(c=>({id:`c-${c.id}`,kind:"Competition" as const,date:c.date,title:c.opponent||c.eventType,detail:c.eventType,extra:[c.location,c.role].filter(Boolean).join(" · ")||"Upcoming competition"})),
  ...seasonEvents.filter(e=>e.date>=today()).map(e=>({id:`e-${e.id}`,kind:"Event" as const,date:e.date,title:e.title,detail:e.eventType,extra:e.notes||e.priority}))
 ].sort((a,b)=>a.date.localeCompare(b.date));
 const items=allItems.filter(x=>(filter==="All"||x.kind===filter)&&(!maxDate||x.date<=maxDate));
 return <>
  <ParentSectionNav tab="Calendar" setTab={setTab}/>
  <div className="hero"><small>PARENT · SCHEDULE</small><h1>What's Coming Up?</h1><p>Filter the schedule, then tap any item for a little more detail.</p></div>
  <div className="parentControlBar">
   <div><small>SHOW</small>{(["All","Workout","Competition","Event"] as const).map(x=><button className={filter===x?"active":""} key={x} onClick={()=>setFilter(x)}>{x==="Workout"?"Training":x}</button>)}</div>
   <div><small>TIME</small>{(["14","30","All"] as const).map(x=><button className={range===x?"active":""} key={x} onClick={()=>setRange(x)}>{x==="All"?"All":`${x} days`}</button>)}</div>
  </div>
  <div className="card parentScheduleCard">
   <div className="sectionHead"><div><h2>{items.length} upcoming item{items.length===1?"":"s"}</h2><small>Tap a row to expand</small></div></div>
   {items.length===0?<div className="parentEmptyState"><b>Nothing matches this filter</b><span>Try All or a longer time range.</span></div>:items.slice(0,30).map(x=><div className="parentExpandable" key={x.id}>
    <button onClick={()=>setExpanded(expanded===x.id?null:x.id)} aria-expanded={expanded===x.id}><span className="parentDateBadge">{x.date.slice(5)}</span><div><small>{x.kind.toUpperCase()}</small><b>{x.title}</b><span>{x.detail}</span></div><strong>{expanded===x.id?"−":"+"}</strong></button>
    {expanded===x.id&&<div className="parentExpandedDetail"><p>{x.extra}</p>{x.kind==="Competition"&&<button onClick={()=>setTab("Competition")}>Open Competition History</button>}{x.kind==="Workout"&&<button onClick={()=>setTab("Development")}>Open Development</button>}</div>}
   </div>)}
  </div>
 </>;
}

function ParentProgress({sport,profile,goals,workouts,results,readiness,competitions,setTab}:{sport:Sport;profile:Profile;goals:Goal[];workouts:Workout[];results:Result[];readiness:ReadinessLog[];competitions:CompetitionLog[];setTab:React.Dispatch<React.SetStateAction<Tab>>}){
 return <>
  <ParentSectionNav tab="Analytics" setTab={setTab}/>
  <div className="sharedAnalyticsRoleNotice"><span className="tag">SHARED ATHLETE ANALYTICS</span><div><b>Same athlete. Same numbers.</b><small>Player, Parent, and Coach views now use one analytics calculation for this athlete. Role changes can change available actions, but not the performance data or scores.</small></div></div>
  <Analytics sport={sport} profile={profile} results={results} goals={goals} workouts={workouts} readiness={readiness} competitions={competitions}/>
 </>;
}

function ParentDevelopment({sport,profile,dev,program,milestones,developmentSystem,readiness,weeklyReviews,coachWeeklyReviews,goals,workouts,results,competitions,setTab}:{sport:Sport;profile:Profile;dev:DevelopmentItem[];program:TrainingProgram|null;milestones:Milestone[];developmentSystem:DevelopmentSystemState;readiness:ReadinessLog[];weeklyReviews:WeeklyReview[];coachWeeklyReviews:CoachWeeklyReview[];goals:Goal[];workouts:Workout[];results:Result[];competitions:CompetitionLog[];setTab:React.Dispatch<React.SetStateAction<Tab>>}){
 const [view,setView]=useState<"Support"|"Blueprint"|"Skills"|"Priorities"|"Program"|"Activity"|"Milestones">("Support");
 const open=dev.filter(d=>d.status!=="Complete");
 const latestReadiness=readiness[0];
 const latestReadinessScore=latestReadiness?readinessScoreV2(latestReadiness,Number(profile.age||0)):0;
 const latestCoachReview=coachWeeklyReviews.slice().sort((a,b)=>b.weekStart.localeCompare(a.weekStart))[0];
 const latestPlayerReview=weeklyReviews.slice().sort((a,b)=>b.weekStart.localeCompare(a.weekStart))[0];
 const latestReflection=developmentSystem.trainingReflections.slice().sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id)[0];
 const latestMeeting=developmentSystem.meetings.slice().sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id)[0];
 const nextWorkout=workouts.filter(w=>w.sport===sport&&!w.completed&&w.date>=today()).sort((a,b)=>a.date.localeCompare(b.date))[0];
 const activeGoals=goals.filter(g=>(g.status||"Active")!=="Complete");
 const lowestPillar=developmentPillars.map(p=>({pillar:p,score:developmentSystem.pillarRatings[p]||3})).sort((a,b)=>a.score-b.score)[0];
 const needsWorkSkills=sportSkillTrees[sport].filter(name=>developmentSystem.skillProgress[name]?.level==="Needs Work");
 const parentStage=developmentStageForAge(Number(profile.age||0));
 const parentPositionPriorities=positionSkillPriorities(sport,profile.position).filter(name=>sportSkillTrees[sport].includes(name));
 const parentNextSkill=parentPositionPriorities.find(name=>developmentSystem.skillProgress[name]?.level!=="Advanced")||parentPositionPriorities[0]||sportSkillTrees[sport][0];
 const parentCurrentLevel=progressionLevelFromSkill(developmentSystem.skillProgress[parentNextSkill]?.level);
 const parentNextLevel=nextProgressionLevel(parentCurrentLevel,parentStage);

 const supportPriority=latestReadiness&&latestReadinessScore<60
  ?"Recovery support"
  :latestMeeting?.parentSupport
  ?"Follow the development-meeting support plan"
  :latestCoachReview?.nextWeekFocus
  ?"Support the Coach's next-week focus"
  :needsWorkSkills[0]
  ?`Encourage steady work on ${needsWorkSkills[0]}`
  :lowestPillar
  ?`Support ${lowestPillar.pillar.toLowerCase()} habits`
  :"Keep support simple and athlete-led";

 const supportAction=latestReadiness&&latestReadinessScore<60
  ?"Protect sleep opportunity, regular meals, hydration, transportation, and downtime. Do not diagnose fatigue or change the training plan yourself."
  :latestMeeting?.parentSupport
  ?latestMeeting.parentSupport
  :latestCoachReview?.nextWeekFocus
  ?`Ask what ${profile.name} is learning about "${latestCoachReview.nextWeekFocus}" and let the Coach own technical instruction.`
  :nextWorkout
  ?`Help make ${nextWorkout.name} easy to get to prepared, fed, hydrated, and on time.`
  :"Ask one open question, listen, and let the athlete decide whether they want encouragement, help, or space.";

 const supportConversation=latestPlayerReview?.challenges
  ?`"You mentioned ${latestPlayerReview.challenges}. Do you want me to listen, help solve something, or give you some space?"`
  :latestReflection?.needsWork
  ?`"You wrote that ${latestReflection.needsWork} needs work. What do you want to try next?"`
  :`"What felt good today, and what kind of support would help next?"`;

 const matchedPerspective=weeklyReviews.map(p=>({player:p,coach:coachWeeklyReviews.find(c=>c.weekStart===p.weekStart)})).find(x=>x.coach);
 const comparisonPlayer=matchedPerspective?.player||latestPlayerReview;
 const comparisonCoach=matchedPerspective?.coach||latestCoachReview;
 const supportActivity=[
  ...developmentSystem.practiceObservations.map(x=>({date:x.date,type:"Coach Practice Observation",title:`${x.skill} · ${x.level}`,detail:[x.note,x.nextAction&&`Next: ${x.nextAction}`].filter(Boolean).join(" · ")})),
  ...developmentSystem.trainingReflections.map(x=>({date:x.date,type:"Player Reflection",title:x.workoutName,detail:[x.feltGood&&`Felt good: ${x.feltGood}`,x.needsWork&&`Needs work: ${x.needsWork}`].filter(Boolean).join(" · ")||`Effort ${x.effort}/10 · Quality ${x.quality}/10`})),
  ...developmentSystem.meetings.map(x=>({date:x.date,type:"Development Meeting",title:x.priority||"Development review",detail:x.parentSupport?`Parent support: ${x.parentSupport}`:x.nextGoal||x.progress})),
  ...weeklyReviews.map(x=>({date:x.weekStart,type:"Player Weekly Review",title:x.wins||"Weekly reflection",detail:x.focus?`Next focus: ${x.focus}`:`Rating ${x.rating}/10`})),
  ...coachWeeklyReviews.map(x=>({date:x.weekStart,type:"Coach Weekly Review",title:x.strengths||"Coach perspective",detail:x.nextWeekFocus?`Next focus: ${x.nextWeekFocus}`:`Coach: ${x.coachName}`})),
  ...workouts.filter(x=>x.sport===sport&&x.completed).map(x=>({date:x.date,type:"Workout Completed",title:x.name,detail:`${x.minutes} min · ${x.category}`})),
  ...results.filter(x=>x.sport===sport).map(x=>({date:x.date,type:"Performance Test",title:x.name,detail:`${x.value} ${x.unit}`})),
  ...competitions.filter(x=>x.sport===sport).map(x=>({date:x.date,type:"Competition",title:x.opponent||x.eventType,detail:[x.result,x.rating?`Rating ${x.rating}/10`:""].filter(Boolean).join(" · ")})),
  ...milestones.map(x=>({date:x.date,type:"Milestone",title:x.title,detail:x.detail||x.category}))
 ].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,30);

 return <>
  <ParentSectionNav tab="Development" setTab={setTab}/>
  <div className="hero parentSupportHero"><small>PARENT · PLAYER SUPPORT</small><h1>Support {profile.name}'s Development</h1><p>{sport} · Know how to help without taking over the athlete's learning or the Coach's role.</p></div>

  <div className="parentSupportPrinciple">
   <div><span>1</span><b>Listen first</b><small>Understand what the athlete experienced before giving advice.</small></div>
   <div><span>2</span><b>Support the plan</b><small>Help with habits, logistics, encouragement, and consistency.</small></div>
   <div><span>3</span><b>Let Coaches coach</b><small>Keep technical instruction aligned with the athlete's Coach.</small></div>
  </div>

  <div className="parentViewTabs parentSupportTabs">{(["Support","Blueprint","Skills","Priorities","Program","Activity","Milestones"] as const).map(x=><button key={x} className={view===x?"active":""} onClick={()=>setView(x)}>{x}</button>)}</div>

  {view==="Support"&&<>
   <div className="card parentStageSupportCard">
    <div className="sectionHead"><div><small>AGE + POSITION DEVELOPMENT</small><h2>{profile.position||sport} · {parentStage} Stage</h2><p>{stageMessage[parentStage].parent}</p></div><span className="tag">AGE {profile.age||"—"}</span></div>
    <div className="parentStageSupportGrid">
     <div><small>NEXT DEVELOPMENT STEP</small><b>{parentNextSkill}</b><span>{parentCurrentLevel} → {parentNextLevel}</span></div>
     <div><small>WHAT THAT MEANS</small><p>{progressionExpectation(parentStage,parentNextLevel)}</p></div>
     <div><small>BEST PARENT SUPPORT</small><p>{stageMessage[parentStage].parent}</p></div>
    </div>
   </div>

   <div className="parentSupportPrimary">
    <div className="parentSupportPriorityCard">
     <small>BEST SUPPORT RIGHT NOW</small>
     <h2>{supportPriority}</h2>
     <p>{supportAction}</p>
     <div className="parentSupportContext">
      <span><small>READINESS</small><b>{latestReadiness?`${latestReadinessScore}/100`:"No check-in"}</b></span>
      <span><small>NEXT TRAINING</small><b>{nextWorkout?friendlyDate(nextWorkout.date):"None scheduled"}</b></span>
      <span><small>ACTIVE GOALS</small><b>{activeGoals.length}</b></span>
      <span><small>SKILLS NEEDING WORK</small><b>{needsWorkSkills.length}</b></span>
     </div>
    </div>
    <div className="card parentConversationCard">
     <small>TRY THIS CONVERSATION</small>
     <h2>Ask, then listen</h2>
     <blockquote>{supportConversation}</blockquote>
     <p>Follow with: <b>"Do you want me to listen, help, or give you space?"</b></p>
    </div>
   </div>

   <div className="parentSupportToolGrid">
    <div className="card"><span className="parentSupportIcon">→</span><small>BEFORE PRACTICE / TRAINING</small><h2>Make readiness easy</h2><ul><li>Confirm ride, time, and gear.</li><li>Make food and water easy to access.</li><li>Ask one question: "Anything you need from me?"</li><li>Avoid adding technical cues on the way in.</li></ul></div>
    <div className="card"><span className="parentSupportIcon">✓</span><small>AFTER PRACTICE / TRAINING</small><h2>Let the athlete process</h2><ul><li>Start with how it felt, not the result.</li><li>Recognize effort, learning, and ownership.</li><li>Ask permission before offering observations.</li><li>Use the Player reflection as a conversation starter.</li></ul></div>
    <div className="card"><span className="parentSupportIcon">★</span><small>COMPETITION DAY</small><h2>Lower unnecessary pressure</h2><ul><li>Keep pre-game support calm and predictable.</li><li>Avoid last-minute tactical coaching.</li><li>Afterward, ask what the athlete wants: food, quiet, celebration, or conversation.</li><li>Let the Coach handle technical review.</li></ul></div>
    <div className="card"><span className="parentSupportIcon">♡</span><small>RECOVERY SUPPORT</small><h2>Protect the basics</h2><ul><li>Create enough opportunity for sleep.</li><li>Support regular meals and hydration.</li><li>Protect downtime when the schedule is heavy.</li><li>Use medical professionals for injury or health concerns.</li></ul></div>
   </div>

   <div className="grid twoCards parentSupportAlignment">
    <div className="card"><div className="sectionHead"><div><small>COACH ALIGNMENT</small><h2>What the Coach is emphasizing</h2></div></div>{latestCoachReview?<><p><b>Next-week focus:</b> {latestCoachReview.nextWeekFocus||"No specific focus entered."}</p>{latestCoachReview.developmentOpportunity&&<p><b>Development opportunity:</b> {latestCoachReview.developmentOpportunity}</p>}</>:<div className="parentEmptyState"><b>No Coach weekly review yet</b><span>Support the current development plan until a Coach review is available.</span></div>}</div>
    <div className="card"><div className="sectionHead"><div><small>DEVELOPMENT MEETING</small><h2>How the Parent can help</h2></div></div>{latestMeeting?<><p>{latestMeeting.parentSupport||"No Parent support action was recorded in the latest meeting."}</p>{latestMeeting.nextGoal&&<p><b>Next measurable goal:</b> {latestMeeting.nextGoal}</p>}</>:<div className="parentEmptyState"><b>No development meeting yet</b><span>When a Coach records a meeting, the Parent support plan will appear here.</span></div>}</div>
   </div>

   <div className="card parentSupportBoundaries">
    <div className="sectionHead"><div><small>HEALTHY SUPPORT BOUNDARIES</small><h2>Parent = support system, not second Coach</h2></div></div>
    <div className="parentBoundaryGrid">
     <div className="good"><b>Helpful</b><span>Encourage effort and learning</span><span>Help with routines and logistics</span><span>Ask before giving feedback</span><span>Keep sport enjoyable and connected</span></div>
     <div><b>Avoid</b><span>Coaching from the stands</span><span>Comparing the athlete with teammates</span><span>Turning the ride home into a performance review</span><span>Using readiness as a medical diagnosis</span></div>
    </div>
   </div>
  </>}

  {view==="Blueprint"&&<div className="card"><div className="sectionHead"><div><h2>Development Blueprint</h2><small>{developmentSystem.seasonPhase} · 9 development pillars</small></div></div><div className="parentBlueprintGrid">{developmentPillars.map(p=><div key={p}><small>{p}</small><b>{developmentSystem.pillarRatings[p]||3}/5</b><div className="progress"><i style={{width:`${(developmentSystem.pillarRatings[p]||3)*20}%`}}/></div><span>{pillarWhy[p]}</span></div>)}</div></div>}

  {view==="Skills"&&<div className="card"><div className="sectionHead"><div><h2>{sport} Skill Tree</h2><small>{profile.position||"All positions"} · {parentStage} stage · development status selected in the athlete's plan</small></div></div><div className="parentSkillTree">{sportSkillTrees[sport].map(name=>{const entry=developmentSystem.skillProgress[name];const priorityIndex=parentPositionPriorities.indexOf(name);return <div key={name}><div><b>{name}</b><small>{priorityIndex>=0?`Position priority #${priorityIndex+1} · `:""}{entry?.notes||"No coaching note yet."}</small></div><span className={(entry?.level||"Developing").replaceAll(" ","-").toLowerCase()}>{entry?.level||"Developing"}</span></div>})}</div></div>}

  {view==="Priorities"&&<div className="card"><div className="sectionHead"><div><h2>Current Priorities</h2><small>What the athlete is trying to improve now</small></div></div>{open.length===0?<div className="parentEmptyState"><b>No open development priorities</b><span>The athlete or coach can add the next development focus.</span></div>:open.map(d=><div className="parentDevelopmentRow" key={d.id}><div><span className="tag">{d.priority||"Medium"}</span><b>{d.title}</b><small>{d.target||d.category}</small></div><div><strong>{d.progress||0}%</strong><div className="progress"><i style={{width:`${d.progress||0}%`}}/></div></div></div>)}</div>}

  {view==="Program"&&<div className="card"><div className="sectionHead"><div><h2>Training Program</h2><small>The current weekly plan</small></div></div>{program?<><div className="parentProgramSummary"><div><small>FOCUS</small><b>{program.focus}</b></div><div><small>DAYS / WEEK</small><b>{program.daysPerWeek}</b></div><div><small>COMPLETED</small><b>{program.sessions.filter(s=>s.completed).length}/{program.sessions.length}</b></div></div><p>Program sessions are managed by the athlete or coach. Parents can follow completion here.</p><button onClick={()=>setTab("Calendar")}>See Schedule</button></>:<div className="parentEmptyState"><b>No active training program</b><span>A generated or custom program will appear here.</span></div>}</div>}

  {view==="Activity"&&<>
   <div className="card parentPerspectiveCard"><div className="sectionHead"><div><small>PLAYER + COACH PERSPECTIVE</small><h2>Weekly Review Conversation</h2><p>Differences are useful conversation starters, not a score of who is right.</p></div></div>
    {comparisonPlayer&&comparisonCoach?<div className="parentPerspectiveGrid"><div><small>PLAYER</small><b>{comparisonPlayer.rating}/10 · {friendlyDate(comparisonPlayer.weekStart)}</b><p><strong>Challenge:</strong> {comparisonPlayer.challenges||"—"}</p><p><strong>Focus:</strong> {comparisonPlayer.focus||"—"}</p></div><div><small>COACH</small><b>{friendlyDate(comparisonCoach.weekStart)}</b><p><strong>Development:</strong> {comparisonCoach.developmentOpportunity||"—"}</p><p><strong>Focus:</strong> {comparisonCoach.nextWeekFocus||"—"}</p></div><div><small>PARENT ROLE</small><b>Help them talk, don't pick a winner</b><p>Ask: “What are you both noticing, and what is one next action everyone understands?”</p></div></div>:<div className="parentEmptyState"><b>Both perspectives are needed</b><span>This appears after both a Player Weekly Review and Coach Weekly Review are available.</span></div>}
   </div>
   <div className="card parentSupportActivity"><div className="sectionHead"><div><h2>Athlete Development Timeline</h2><small>Training, tests, competition, reflections, Coach observations, reviews, meetings, and milestones</small></div><span className="tag">{supportActivity.length}</span></div>{supportActivity.length===0?<div className="parentEmptyState"><b>No development activity yet</b><span>Athlete development events will appear here.</span></div>:supportActivity.map((x,i)=><div className="parentSupportActivityRow" key={`${x.type}-${x.date}-${i}`}><span className="parentActivityDot"/><div><small>{x.type.toUpperCase()}</small><b>{x.title}</b><p>{x.detail}</p></div><time>{friendlyDate(x.date)}</time></div>)}</div>
  </>}

  {view==="Milestones"&&<div className="card"><div className="sectionHead"><div><h2>Milestones</h2><small>Positive progress worth recognizing</small></div></div>{milestones.length===0?<div className="parentEmptyState"><b>No milestones recorded yet</b><span>Milestones will appear as development progress is recorded.</span></div>:milestones.slice(0,12).map(m=><div className="parentMilestone" key={m.id}><b>{m.title}</b><small>{friendlyDate(m.date)} · {m.category}</small><p>{m.detail}</p></div>)}</div>}
 </>;
}

function ParentCompetition({sport,profile,competitions,setTab}:{sport:Sport;profile:Profile;competitions:CompetitionLog[];setTab:React.Dispatch<React.SetStateAction<Tab>>}){
 const [expanded,setExpanded]=useState<number|null>(null);
 const [range,setRange]=useState<"5"|"10"|"All">("5");
 const mine=competitions.filter(c=>c.sport===sport).sort((a,b)=>b.date.localeCompare(a.date));
 const visible=range==="All"?mine:mine.slice(0,Number(range));
 return <>
  <ParentSectionNav tab="Competition" setTab={setTab}/>
  <div className="hero"><small>PARENT · COMPETITION</small><h1>Competition History</h1><p>{profile.name} · Tap an event to see the result, rating, learning notes, and next focus.</p></div>
  <div className="parentViewTabs compact">{(["5","10","All"] as const).map(x=><button key={x} className={range===x?"active":""} onClick={()=>setRange(x)}>{x==="All"?"All events":`Last ${x}`}</button>)}</div>
  <div className="card parentCompetitionCard">
   {visible.length===0?<div className="parentEmptyState"><b>No competitions logged yet</b><span>Competition history will appear after the athlete or coach logs an event.</span></div>:visible.map(c=><div className="parentExpandable" key={c.id}>
    <button onClick={()=>setExpanded(expanded===c.id?null:c.id)} aria-expanded={expanded===c.id}><span className="parentDateBadge">{c.date.slice(5)}</span><div><small>{c.eventType.toUpperCase()}</small><b>{c.opponent||"Competition"}</b><span>{c.result||"Result not entered"} · {c.rating}/10</span></div><strong>{expanded===c.id?"−":"+"}</strong></button>
    {expanded===c.id&&<div className="parentExpandedDetail competition">
     <div className="parentCompetitionDetails">
      {c.location&&<span><small>LOCATION</small><b>{c.location}</b></span>}
      {c.role&&<span><small>ROLE</small><b>{c.role}</b></span>}
      {c.confidence&&<span><small>CONFIDENCE</small><b>{c.confidence}/10</b></span>}
     </div>
     {c.keyWin&&<p><b>What went well:</b> {c.keyWin}</p>}
     {c.improveNext&&<p><b>Next focus:</b> {c.improveNext}</p>}
     {c.notes&&<p><b>Notes:</b> {c.notes}</p>}
     <button onClick={()=>setTab("Coach")}>Add / Review Shared Notes</button>
    </div>}
   </div>)}
  </div>
 </>;
}

function AnalyticsHub({accountRole,setTab,setDev,setGoals,setWorkouts,sport,profile,goals,workouts,results,dev,program,readiness,competitions,reportNotes,setReportNotes}:{accountRole:AccountRole;setTab:React.Dispatch<React.SetStateAction<Tab>>;setDev:React.Dispatch<React.SetStateAction<DevelopmentItem[]>>;setGoals:React.Dispatch<React.SetStateAction<Goal[]>>;setWorkouts:React.Dispatch<React.SetStateAction<Workout[]>>;sport:Sport;profile:Profile;goals:Goal[];workouts:Workout[];results:Result[];dev:DevelopmentItem[];program:TrainingProgram|null;readiness:ReadinessLog[];competitions:CompetitionLog[];reportNotes:ReportNote[];setReportNotes:React.Dispatch<React.SetStateAction<ReportNote[]>>}){
 const [showReport,setShowReport]=useState(false);
 return <><Analytics accountRole={accountRole} setTab={setTab} setDev={setDev} setGoals={setGoals} setWorkouts={setWorkouts} sport={sport} profile={profile} results={results} goals={goals} workouts={workouts} readiness={readiness} competitions={competitions}/>
 <div className="card compactTools"><div className="sectionHead"><div><h2>Performance Report</h2><small>Exports, print, grade, and share tools</small></div><button className="featureAction" onClick={()=>setShowReport(x=>!x)}>{showReport?"Hide Report":"Open Report"}</button></div></div>
 {showReport&&<Reports sport={sport} profile={profile} goals={goals} workouts={workouts} results={results} dev={dev} program={program} readiness={readiness} competitions={competitions} reportNotes={reportNotes} setReportNotes={setReportNotes}/>}</>;
}

function CoachHub({athleteId,accountRole,authorName,saveSharedNotes,coachWeeklyReviews,setCoachWeeklyReviews,saveCoachWeeklyReview,canWriteCoachReview,sport,profile,goals,workouts,results,dev,program,readiness,setReadiness,weeklyReviews,competitions,coachNotes,setCoachNotes}:{athleteId:string;accountRole:AccountRole;authorName:string;saveSharedNotes?:((notes:unknown[])=>Promise<void>);coachWeeklyReviews:CoachWeeklyReview[];setCoachWeeklyReviews:React.Dispatch<React.SetStateAction<CoachWeeklyReview[]>>;saveCoachWeeklyReview?:((review:CoachWeeklyReview)=>Promise<void>);canWriteCoachReview:boolean;sport:Sport;profile:Profile;goals:Goal[];workouts:Workout[];results:Result[];dev:DevelopmentItem[];program:TrainingProgram|null;readiness:ReadinessLog[];setReadiness:React.Dispatch<React.SetStateAction<ReadinessLog[]>>;weeklyReviews:WeeklyReview[];competitions:CompetitionLog[];coachNotes:CoachNote[];setCoachNotes:React.Dispatch<React.SetStateAction<CoachNote[]>>}){
 const requestedMode=typeof window!=="undefined"?sessionStorage.getItem("coachHubMode"):null;
 const [mode,setMode]=useState<"Readiness"|"Review"|"Plan">(requestedMode==="Review"||requestedMode==="Plan"?requestedMode:"Readiness");
 useEffect(()=>{try{sessionStorage.removeItem("coachHubMode")}catch{}},[]);
 return <><div className="simpleSectionNav"><button className={mode==="Readiness"?"active":""} onClick={()=>setMode("Readiness")}>Readiness</button><button className={mode==="Review"?"active":""} onClick={()=>setMode("Review")}>Weekly Review</button><button className={mode==="Plan"?"active":""} onClick={()=>setMode("Plan")}>Coach Plan</button></div>
 {mode==="Readiness"?<Readiness sport={sport} profile={profile} readiness={readiness} setReadiness={setReadiness} weeklyReviews={weeklyReviews} coachNotes={coachNotes} setCoachNotes={setCoachNotes} program={program} workouts={workouts} accountRole={accountRole} authorName={authorName} saveSharedNotes={saveSharedNotes}/>:mode==="Review"?<CoachWeeklyReviewPanel athleteId={athleteId} profile={profile} coachName={authorName} reviews={coachWeeklyReviews} setReviews={setCoachWeeklyReviews} saveReview={saveCoachWeeklyReview} canWrite={canWriteCoachReview}/>:<SmartCoach sport={sport} profile={profile} goals={goals} workouts={workouts} results={results} dev={dev} program={program} readiness={readiness} competitions={competitions}/>}</>;
}


function CoachWeeklyReviewPanel({athleteId,profile,coachName,reviews,setReviews,saveReview,canWrite}:{athleteId:string;profile:Profile;coachName:string;reviews:CoachWeeklyReview[];setReviews:React.Dispatch<React.SetStateAction<CoachWeeklyReview[]>>;saveReview?:((review:CoachWeeklyReview)=>Promise<void>);canWrite:boolean}){
 const weekStart=mondayOfWeek();
 const existing=reviews.find(r=>r.weekStart===weekStart);
 const [performance,setPerformance]=useState("3");
 const [effort,setEffort]=useState("4");
 const [attitude,setAttitude]=useState("4");
 const [teamwork,setTeamwork]=useState("4");
 const [coachability,setCoachability]=useState("4");
 const [leadership,setLeadership]=useState("3");
 const [strengths,setStrengths]=useState("");
 const [developmentOpportunity,setDevelopmentOpportunity]=useState("");
 const [leadershipOpportunity,setLeadershipOpportunity]=useState("");
 const [nextWeekFocus,setNextWeekFocus]=useState("");
 const [coachMessage,setCoachMessage]=useState("");
 const [shareWithPlayer,setShareWithPlayer]=useState(false);
 const [message,setMessage]=useState("");
 const [saving,setSaving]=useState(false);
 const [reviewOpen,setReviewOpen]=useState(true);
 const clearCoachReviewFields=()=>{
  setPerformance("3");setEffort("4");setAttitude("4");setTeamwork("4");setCoachability("4");setLeadership("3");
  setStrengths("");setDevelopmentOpportunity("");setLeadershipOpportunity("");setNextWeekFocus("");setCoachMessage("");setShareWithPlayer(false);
 };
 const openCoachReview=()=>{
  if(existing){
   setPerformance(String(existing.performance));setEffort(String(existing.effort));setAttitude(String(existing.attitude));
   setTeamwork(String(existing.teamwork));setCoachability(String(existing.coachability));setLeadership(String(existing.leadership));
   setStrengths(existing.strengths||"");setDevelopmentOpportunity(existing.developmentOpportunity||"");
   setLeadershipOpportunity(existing.leadershipOpportunity||"");setNextWeekFocus(existing.nextWeekFocus||"");
   setCoachMessage(existing.coachMessage||"");setShareWithPlayer(Boolean(existing.shareWithPlayer));
  }else clearCoachReviewFields();
  setMessage("");setReviewOpen(true);
 };
 useEffect(()=>{
  clearCoachReviewFields();
  setReviewOpen(!existing);
  if(existing){try{localStorage.setItem(`coachReviewWeek:${athleteId}`,weekStart)}catch{}}
 },[existing?.id,weekStart,athleteId]);

 const ratingInput=(label:string,value:string,setter:React.Dispatch<React.SetStateAction<string>>,hint:string)=><label className="coachReviewRatingInput"><span>{label}</span><select value={value} onChange={e=>setter(e.target.value)}>{["1","2","3","4","5"].map(x=><option key={x} value={x}>{x} / 5</option>)}</select><small>{hint}</small></label>;

 const submit=async()=>{
  if(!canWrite||!saveReview)return;
  const item:CoachWeeklyReview={
   id:existing?.id||`pending-${Date.now()}`,weekStart,coachName:coachName||"Coach",
   performance:Number(performance),effort:Number(effort),attitude:Number(attitude),teamwork:Number(teamwork),
   coachability:Number(coachability),leadership:Number(leadership),strengths:strengths.trim(),
   developmentOpportunity:developmentOpportunity.trim(),leadershipOpportunity:leadershipOpportunity.trim(),
   nextWeekFocus:nextWeekFocus.trim(),coachMessage:coachMessage.trim(),shareWithPlayer
  };
  setSaving(true);setMessage("");
  try{
   await saveReview(item);
   setReviews(rows=>[item,...rows.filter(r=>r.id!==item.id&&!(r.weekStart===item.weekStart&&r.coachName===item.coachName))]);
   try{localStorage.setItem(`coachReviewWeek:${athleteId}`,weekStart)}catch{}
   setMessage(shareWithPlayer?"Coach review saved and shared with the Player.":"Coach review saved. Parent can see it; it is not shared with the Player.");
   clearCoachReviewFields();
   setReviewOpen(false);
  }catch(err:any){
   setMessage(err?.message||"Could not save the Coach weekly review.");
  }finally{setSaving(false)}
 };

 const avg=(review:CoachWeeklyReview)=>Math.round((review.performance+review.effort+review.attitude+review.teamwork+review.coachability+review.leadership)/6*10)/10;

 return <div className="coachWeeklyReviewPage">
  <div className="hero coachWeeklyReviewHero"><small>COACH PERSPECTIVE</small><h1>Weekly Review</h1><p>{profile.name} · Reflect on the week from the Coach perspective without replacing the Player's own weekly review.</p></div>

  <div className="coachReviewVisibilityExplainer">
   <div><span>1</span><b>Coach writes the review</b><small>Performance, effort, attitude, teamwork, coachability, leadership, and development opportunities.</small></div>
   <div><span>2</span><b>Parent can always view it</b><small>Linked Parents receive the Coach perspective automatically.</small></div>
   <div><span>3</span><b>Coach chooses Player sharing</b><small>Turn on Share with Player when the review is appropriate for direct athlete feedback.</small></div>
  </div>

  {!canWrite&&<div className="card playerOnlyNotice"><span className="tag">READ-ONLY DEMO</span><h2>Select a linked athlete as a Coach</h2><p>The Coach review form becomes writable when a Coach opens an athlete from the Coach's team. Admin preview remains read-only.</p></div>}

  {reviewOpen?<div className="card coachWeeklyReviewForm">
   <div className="sectionHead"><div><small>WEEK OF {friendlyDate(weekStart).toUpperCase()}</small><h2>{existing?"Update Coach Review":"Create Coach Review"}</h2><p>Use the ratings as conversation starters, not permanent labels.</p></div><span className="tag">1–5 SCALE</span></div>

   <div className="coachReviewRatingGrid">
    {ratingInput("Performance",performance,setPerformance,"Execution and game/practice performance")}
    {ratingInput("Effort",effort,setEffort,"Work rate, competitiveness, and consistency")}
    {ratingInput("Attitude",attitude,setAttitude,"Response to adversity, teammates, and instruction")}
    {ratingInput("Teamwork",teamwork,setTeamwork,"Communication, support, and team-first behavior")}
    {ratingInput("Coachability",coachability,setCoachability,"Listens, applies feedback, asks useful questions")}
    {ratingInput("Leadership",leadership,setLeadership,"Positive influence, ownership, and example")}
   </div>

   <div className="coachReviewNarrativeGrid">
    <label>What stood out this week<textarea rows={3} value={strengths} onChange={e=>setStrengths(e.target.value)} placeholder="Specific strengths, improvement, or positive moments"/></label>
    <label>Development opportunity<textarea rows={3} value={developmentOpportunity} onChange={e=>setDevelopmentOpportunity(e.target.value)} placeholder="One area to develop without turning the review into a list of negatives"/></label>
    <label>Leadership opportunity<textarea rows={3} value={leadershipOpportunity} onChange={e=>setLeadershipOpportunity(e.target.value)} placeholder="A chance to communicate, help a teammate, take ownership, or lead by example"/></label>
    <label>Next-week focus<textarea rows={3} value={nextWeekFocus} onChange={e=>setNextWeekFocus(e.target.value)} placeholder="One or two clear behaviors for next week"/></label>
   </div>

   <label className="coachMessageField">Coach message to Player<textarea rows={3} value={coachMessage} onChange={e=>setCoachMessage(e.target.value)} placeholder="Optional direct message. This is only shown to the Player if Share with Player is enabled."/></label>

   <label className={"coachShareToggle "+(shareWithPlayer?"shared":"")}>
    <input type="checkbox" checked={shareWithPlayer} onChange={e=>setShareWithPlayer(e.target.checked)}/>
    <span><b>Share this Coach review with the Player</b><small>{shareWithPlayer?"Player will be able to see this review after it is saved.":"Parent can see the review, but the Player will not see it."}</small></span>
   </label>

   <div className="coachReviewPrivacySummary">
    <span><small>PARENT</small><b>Always visible</b></span>
    <span><small>PLAYER</small><b>{shareWithPlayer?"Visible after save":"Not shared"}</b></span>
   </div>

   {message&&<div className="betaMessage">{message}</div>}
   <div className="weeklyReviewActions">{existing&&<button onClick={()=>{clearCoachReviewFields();setReviewOpen(false)}}>Cancel</button>}<button className="featureAction coachReviewSaveButton" disabled={!canWrite||saving} onClick={()=>void submit()}>{saving?"Saving…":existing?"Update Coach Weekly Review":"Save Coach Weekly Review"}</button></div>
  </div>:<div className="card weeklyReviewCollapsed coachReviewCollapsed"><div><span className="weeklyReviewDoneIcon">✓</span><div><small>{existing?"COACH REVIEW COMPLETE":"COACH WEEKLY REVIEW"}</small><h2>Week of {friendlyDate(weekStart)}</h2><p>{existing?`Avg ${avg(existing)}/5 · ${existing.shareWithPlayer?"Shared with Player":"Parent + Coach"}`:"Ready to create this week's Coach perspective."}</p></div></div><button className="featureAction" disabled={!canWrite} onClick={openCoachReview}>{existing?"View / Edit Review":"Start Coach Review"}</button>{message&&<div className="betaMessage">{message}</div>}</div>}

  <div className="card coachReviewHistory">
   <div className="sectionHead"><div><h2>Coach Review History</h2><small>Recent reviews for this athlete</small></div><span className="tag">{reviews.length}</span></div>
   {reviews.length===0?<p>No Coach weekly reviews yet.</p>:reviews.slice(0,8).map(review=><div className="coachReviewHistoryItem" key={review.id}>
    <div className="coachReviewMeta"><div><b>{review.coachName}</b><small>Week of {friendlyDate(review.weekStart)} · Avg {avg(review)}/5</small></div><span className={review.shareWithPlayer?"shared":"parentOnly"}>{review.shareWithPlayer?"PLAYER SHARED":"PARENT + COACH"}</span></div>
    <div className="coachReviewRatings compact">{[["Performance",review.performance],["Effort",review.effort],["Attitude",review.attitude],["Teamwork",review.teamwork],["Coachability",review.coachability],["Leadership",review.leadership]].map(([label,value])=><div key={String(label)}><small>{label}</small><b>{value}/5</b></div>)}</div>
    {review.nextWeekFocus&&<p><b>Next focus:</b> {review.nextWeekFocus}</p>}
   </div>)}
  </div>
 </div>;
}


function UniversalDevelopmentSystem({accountRole,sport,profile,dev,goals,workouts,results,readiness,weeklyReviews,coachWeeklyReviews,competitions,milestones,developmentSystem,setDevelopmentSystem}:{accountRole:AccountRole;sport:Sport;profile:Profile;dev:DevelopmentItem[];goals:Goal[];workouts:Workout[];results:Result[];readiness:ReadinessLog[];weeklyReviews:WeeklyReview[];coachWeeklyReviews:CoachWeeklyReview[];competitions:CompetitionLog[];milestones:Milestone[];developmentSystem:DevelopmentSystemState;setDevelopmentSystem:React.Dispatch<React.SetStateAction<DevelopmentSystemState>>}){
 const requestedDevelopmentView=typeof window!=="undefined"?sessionStorage.getItem("developmentView"):null;
 const [view,setView]=useState<"Blueprint"|"Skills"|"Training"|"Observations"|"Meeting"|"Journal"|"Timeline">((["Blueprint","Skills","Training","Observations","Meeting","Journal","Timeline"] as string[]).includes(requestedDevelopmentView||"")?requestedDevelopmentView as "Blueprint"|"Skills"|"Training"|"Observations"|"Meeting"|"Journal"|"Timeline":"Blueprint");
 useEffect(()=>{try{sessionStorage.removeItem("developmentView")}catch{}},[]);
 const [reflectionEffort,setReflectionEffort]=useState("7");
 const [reflectionQuality,setReflectionQuality]=useState("7");
 const [reflectionConfidence,setReflectionConfidence]=useState("7");
 const [reflectionGood,setReflectionGood]=useState("");
 const [reflectionWork,setReflectionWork]=useState("");
 const [meetingProgress,setMeetingProgress]=useState("");
 const [meetingPriority,setMeetingPriority]=useState("");
 const [meetingPlayerVoice,setMeetingPlayerVoice]=useState("");
 const [meetingCoachPlan,setMeetingCoachPlan]=useState("");
 const [meetingParentSupport,setMeetingParentSupport]=useState("");
 const [meetingNextGoal,setMeetingNextGoal]=useState("");
 const [observationSkill,setObservationSkill]=useState(sportSkillTrees[sport][0]||"");
 const [observationLevel,setObservationLevel]=useState<SkillLevel>("Developing");
 const [observationContext,setObservationContext]=useState<"Practice"|"Game"|"Training">("Practice");
 const [observationNote,setObservationNote]=useState("");
 const [observationNext,setObservationNext]=useState("");
 const canPlan=accountRole==="Coach"||accountRole==="Admin";
 const canReflect=accountRole==="Player";
 const age=Number(profile.age||0);
 const ageMode=developmentStageForAge(age);
 const skillNames=sportSkillTrees[sport];
 useEffect(()=>{if(!sportSkillTrees[sport].includes(observationSkill))setObservationSkill(sportSkillTrees[sport][0]||"")},[sport]);
 const completedWorkout=workouts.filter(w=>w.sport===sport&&w.completed).sort((a,b)=>b.date.localeCompare(a.date))[0];

 const ratingRows=developmentPillars.map(p=>({pillar:p,score:developmentSystem.pillarRatings[p]||3})).sort((a,b)=>a.score-b.score);
 const lowest=ratingRows.slice(0,3);
 const skillRows=skillNames.map(name=>({name,entry:developmentSystem.skillProgress[name]}));
 const rawPositionPriorities=positionSkillPriorities(sport,profile.position).filter(name=>skillNames.includes(name));
 const positionPriorities=[...rawPositionPriorities,...skillNames.filter(name=>!rawPositionPriorities.includes(name))].slice(0,5);
 const nextPositionSkill=positionPriorities.find(name=>developmentSystem.skillProgress[name]?.level!=="Advanced")||positionPriorities[0]||skillNames[0];
 const currentProgressionLevel=progressionLevelFromSkill(developmentSystem.skillProgress[nextPositionSkill]?.level);
 const recommendedProgressionLevel=nextProgressionLevel(currentProgressionLevel,ageMode);
 const progressionExpectationText=progressionExpectation(ageMode,recommendedProgressionLevel);
 const testingEmphasis=testingEmphasisFor(sport,profile.position);
 const emphasizedTests=definitions(sport).filter(test=>testingEmphasis.includes(test.category)).slice(0,3);
 const needsWork=skillRows.filter(x=>(x.entry?.level||"Developing")==="Needs Work");
 const developing=skillRows.filter(x=>(x.entry?.level||"Developing")==="Developing");
 const avgBlueprint=Math.round(ratingRows.reduce((a,x)=>a+x.score,0)/ratingRows.length*20);
 const avgReadiness=readiness.slice(0,7).length?Math.round(readiness.slice(0,7).reduce((a,r)=>a+readinessScoreV2(r,Number(profile.age||0)),0)/readiness.slice(0,7).length):0;
 const openDev=dev.filter(x=>x.status!=="Complete").sort((a,b)=>({High:0,Medium:1,Low:2}[a.priority||"Medium"])-({High:0,Medium:1,Low:2}[b.priority||"Medium"]));
 const latestCoachReview=coachWeeklyReviews.slice().sort((a,b)=>b.weekStart.localeCompare(a.weekStart))[0];
 const latestPracticeObservation=developmentSystem.practiceObservations.slice().sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id)[0];
 const processScore=Math.min(100,
   Math.round((Math.min(7,readiness.filter(r=>new Date(r.date).getTime()>Date.now()-7*86400000).length)/7*30)+
   (Math.min(4,workouts.filter(w=>w.completed&&new Date(w.date).getTime()>Date.now()-14*86400000).length)/4*30)+
   (Math.min(2,developmentSystem.trainingReflections.filter(r=>new Date(r.date).getTime()>Date.now()-14*86400000).length)/2*20)+
   (weeklyReviews.length?20:0))
 );

 const updatePillar=(pillar:DevelopmentPillar,value:number)=>setDevelopmentSystem(x=>({...x,pillarRatings:{...x.pillarRatings,[pillar]:value}}));
 const updateSkill=(name:string,patch:Partial<SkillProgressEntry>)=>setDevelopmentSystem(x=>({
  ...x,skillProgress:{...x.skillProgress,[name]:{
   level:x.skillProgress[name]?.level||"Developing",
   notes:x.skillProgress[name]?.notes||"",
   videoUrl:x.skillProgress[name]?.videoUrl||"",
   updatedAt:new Date().toISOString(),
   ...patch
  }}
 }));
 const toggleFoundation=(name:string)=>setDevelopmentSystem(x=>({...x,foundationProgress:{...x.foundationProgress,[name]:!x.foundationProgress[name]}}));

 const saveReflection=()=>{
  if(!canReflect)return;
  const item:TrainingReflection={id:Date.now(),date:today(),workoutName:completedWorkout?.name||"Training / Practice",effort:Number(reflectionEffort),quality:Number(reflectionQuality),confidence:Number(reflectionConfidence),feltGood:reflectionGood.trim(),needsWork:reflectionWork.trim()};
  setDevelopmentSystem(x=>({...x,trainingReflections:[item,...x.trainingReflections]}));
  setReflectionGood("");setReflectionWork("");
 };

 const saveMeeting=()=>{
  if(!canPlan)return;
  const item:DevelopmentMeeting={id:Date.now(),date:today(),progress:meetingProgress.trim(),priority:meetingPriority.trim(),playerVoice:meetingPlayerVoice.trim(),coachPlan:meetingCoachPlan.trim(),parentSupport:meetingParentSupport.trim(),nextGoal:meetingNextGoal.trim()};
  setDevelopmentSystem(x=>({...x,meetings:[item,...x.meetings]}));
  setMeetingProgress("");setMeetingPriority("");setMeetingPlayerVoice("");setMeetingCoachPlan("");setMeetingParentSupport("");setMeetingNextGoal("");
 };
 const savePracticeObservation=()=>{
  if(!canPlan||!observationSkill)return;
  const item:PracticeObservation={id:Date.now(),date:today(),coachName:accountRole==="Admin"?"Admin / Coach":"Coach",context:observationContext,skill:observationSkill,level:observationLevel,note:observationNote.trim(),nextAction:observationNext.trim()};
  setDevelopmentSystem(x=>({
   ...x,
   practiceObservations:x.practiceObservations.some(o=>o.date===item.date&&o.context===item.context&&o.skill===item.skill&&o.note===item.note)?x.practiceObservations:[item,...x.practiceObservations],
   skillProgress:{...x.skillProgress,[observationSkill]:{
    level:observationLevel,
    notes:observationNote.trim()||x.skillProgress[observationSkill]?.notes||"",
    videoUrl:x.skillProgress[observationSkill]?.videoUrl||"",
    updatedAt:new Date().toISOString()
   }}
  }));
  setObservationNote("");setObservationNext("");
 };

 const adaptivePriorities=[
  needsWork[0]&&{title:needsWork[0].name,reason:`This ${sport} skill is marked Needs Work.`,action:`Use short, high-quality ${needsWork[0].name.toLowerCase()} practice and stop the set when technique breaks down.`},
  nextPositionSkill&&{title:nextPositionSkill,reason:`${profile.position||sport} · ${ageMode} stage makes this a position-relevant progression. Current progression: ${currentProgressionLevel}.`,action:`Build toward ${recommendedProgressionLevel}: ${progressionExpectationText}`},
  lowest[0]&&{title:lowest[0].pillar,reason:`Blueprint rating ${lowest[0].score}/5 makes this one of the clearest current development opportunities.`,action:pillarAction(lowest[0].pillar,sport)},
  avgReadiness>0&&avgReadiness<65?{title:"Recovery / Habits",reason:`7-day readiness is ${avgReadiness}/100, so recovery is currently limiting how much quality training can be absorbed.`,action:"Protect sleep, use planned recovery, and keep the next hard session flexible if fatigue remains high."}:null,
  openDev[0]&&{title:openDev[0].title,reason:`This is an open ${openDev[0].priority||"Medium"} priority development objective.`,action:openDev[0].target||openDev[0].notes||"Connect this objective to one or two specific weekly actions."},
  latestPracticeObservation&&latestPracticeObservation.level==="Needs Work"?{title:latestPracticeObservation.skill,reason:`Latest Coach observation (${latestPracticeObservation.context.toLowerCase()}) marked this skill Needs Work${latestPracticeObservation.note?`: ${latestPracticeObservation.note}`:""}.`,action:latestPracticeObservation.nextAction||`Use a short, focused ${latestPracticeObservation.skill.toLowerCase()} progression and reassess technique quality.`}:null,
  latestCoachReview?.developmentOpportunity&&{title:"Coach Weekly Review",reason:latestCoachReview.developmentOpportunity,action:latestCoachReview.nextWeekFocus||"Use the Coach review to define one controllable next-week behavior."}
 ].filter(Boolean).slice(0,3) as {title:string;reason:string;action:string}[];

 const matchedWeek=weeklyReviews.map(p=>({player:p,coach:coachWeeklyReviews.find(c=>c.weekStart===p.weekStart)})).find(x=>x.coach);
 const perspectivePlayer=matchedWeek?.player||weeklyReviews.slice().sort((a,b)=>b.weekStart.localeCompare(a.weekStart))[0];
 const perspectiveCoach=matchedWeek?.coach||coachWeeklyReviews.slice().sort((a,b)=>b.weekStart.localeCompare(a.weekStart))[0];
 const coachAvg=perspectiveCoach?Math.round((perspectiveCoach.performance+perspectiveCoach.effort+perspectiveCoach.attitude+perspectiveCoach.teamwork+perspectiveCoach.coachability+perspectiveCoach.leadership)/6*10)/10:0;
 const focusWords=(text:string)=>text.toLowerCase().split(/[^a-z0-9]+/).filter(w=>w.length>3&&!["this","that","with","from","next","week","work","focus"].includes(w));
 const playerFocusWords=perspectivePlayer?focusWords(perspectivePlayer.focus||perspectivePlayer.challenges||""):[];
 const coachFocusWords=perspectiveCoach?focusWords(perspectiveCoach.nextWeekFocus||perspectiveCoach.developmentOpportunity||""):[];
 const sharedFocus=playerFocusWords.filter(w=>coachFocusWords.includes(w));
 const perspectiveLabel=perspectivePlayer&&perspectiveCoach?(sharedFocus.length?"Similar focus language":"Different emphasis — conversation opportunity"):"Waiting for both perspectives";

 const journal=[
  ...developmentSystem.practiceObservations.map(x=>({date:x.date,type:"Coach Practice Observation",title:`${x.skill} · ${x.level}`,detail:[x.note,x.nextAction&&`Next: ${x.nextAction}`].filter(Boolean).join(" · ")})),
  ...developmentSystem.trainingReflections.map(x=>({date:x.date,type:"Player Reflection",title:x.workoutName,detail:`Effort ${x.effort}/10 · Quality ${x.quality}/10${x.needsWork?` · Next: ${x.needsWork}`:""}`})),
  ...developmentSystem.meetings.map(x=>({date:x.date,type:"Development Meeting",title:x.priority||"Development review",detail:x.nextGoal||x.progress})),
  ...milestones.map(x=>({date:x.date,type:"Milestone",title:x.title,detail:x.detail})),
  ...goals.filter(g=>g.progress>=100).map(g=>({date:g.deadline||today(),type:"Goal",title:g.title,detail:"Goal completed"})),
  ...weeklyReviews.map(r=>({date:r.weekStart,type:"Player Weekly Review",title:r.wins||"Weekly reflection",detail:r.focus?`Next: ${r.focus}`:`Rating ${r.rating}/10`})),
  ...coachWeeklyReviews.map(r=>({date:r.weekStart,type:"Coach Review",title:r.strengths||"Coach weekly review",detail:r.nextWeekFocus?`Next: ${r.nextWeekFocus}`:`Coach ${r.coachName}`}))
 ].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,30);

 const developmentTimeline=[
  ...journal,
  ...results.filter(r=>r.sport===sport).map(r=>({date:r.date,type:"Performance Test",title:r.name,detail:`${r.value} ${r.unit}`})),
  ...workouts.filter(w=>w.sport===sport&&w.completed).map(w=>({date:w.date,type:"Workout Completed",title:w.name,detail:`${w.minutes} min · ${w.category}`})),
  ...competitions.filter(c=>c.sport===sport).map(c=>({date:c.date,type:"Competition",title:c.opponent||c.eventType,detail:[c.result,c.rating?`Rating ${c.rating}/10`:""].filter(Boolean).join(" · ")}))
 ].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,50);

 return <div className="universalDevelopment">
  <div className="hero developmentBlueprintHero"><div><small>DEVELOPMENT BLUEPRINT · {ageMode.toUpperCase()} MODE</small><h1>Build the Athlete, Not Just the Stat Line</h1><p>{profile.name} · {sport}{profile.position?` · ${profile.position}`:""} · A shared system for what to develop next, why it matters, and whether the plan is working.</p></div><div className="developmentScoreOrb"><strong>{avgBlueprint}</strong><small>BLUEPRINT</small></div></div>

  <div className="developmentRoleRule">
   <div><small>PLAYER</small><b>Know what to do</b><span>Today, reflection, progress, and why it matters.</span></div>
   <div><small>PARENT</small><b>Know how to support</b><span>See priorities and support actions without managing training.</span></div>
   <div><small>COACH</small><b>Know how to develop</b><span>Set priorities, skill status, season phase, and development meetings.</span></div>
  </div>

  <div className="developmentModeTabs">{(["Blueprint","Skills","Training","Observations","Meeting","Journal","Timeline"] as const).map(x=><button key={x} className={view===x?"active":""} onClick={()=>setView(x)}>{x}</button>)}</div>

  {view==="Blueprint"&&<>
   <div className="card personalizedProgressionCard">
    <div className="sectionHead"><div><small>AGE + POSITION DEVELOPMENT</small><h2>{profile.position||sport} · {ageMode} Stage</h2><p>{stageMessage[ageMode].goal}</p></div><span className="tag">AGE {profile.age||"—"}</span></div>
    <div className="personalizedProgressionGrid">
     <div className="progressionPrimary"><small>NEXT SKILL PROGRESSION</small><h3>{nextPositionSkill}</h3><div className="progressionPath"><span>{currentProgressionLevel}</span><i>→</i><b>{recommendedProgressionLevel}</b></div><p>{progressionExpectationText}</p></div>
     <div><small>POSITION PRIORITIES</small>{positionPriorities.slice(0,4).map((name,index)=><span className={name===nextPositionSkill?"active":""} key={name}>{index+1}. {name}</span>)}</div>
     <div><small>TESTING EMPHASIS</small>{emphasizedTests.length?emphasizedTests.map(test=><span key={test.id}>{test.name} · {test.category}</span>):testingEmphasis.map(x=><span key={x}>{x}</span>)}</div>
     <div><small>HOW TO PROGRESS</small><p>{stageMessage[ageMode].pressure}</p></div>
    </div>
   </div>

   <div className="card adaptivePriorityCard">
    <div className="sectionHead"><div><small>ADAPTIVE DEVELOPMENT ENGINE</small><h2>What should we work on next?</h2><p>Priorities combine the blueprint, sport skills, recovery, active objectives, and Coach observations. Recommendations always show the reason.</p></div><span className="tag">{developmentSystem.seasonPhase}</span></div>
    <div className="adaptivePriorityGrid">{adaptivePriorities.length?adaptivePriorities.map((x,i)=><div key={i}><span>{i+1}</span><small>PRIORITY</small><h3>{x.title}</h3><p><b>Why:</b> {x.reason}</p><p><b>Do:</b> {x.action}</p></div>):<div><span>1</span><small>START HERE</small><h3>Complete the Blueprint</h3><p>Set a few pillar and skill statuses so the app can rank development opportunities.</p></div>}</div>
   </div>

   <div className="card">
    <div className="sectionHead"><div><h2>Development Blueprint</h2><small>Nine pillars used across every sport · 1 = needs major attention · 5 = current strength</small></div>{canPlan?<label className="seasonPhaseSelect">Season<select value={developmentSystem.seasonPhase} onChange={e=>setDevelopmentSystem(x=>({...x,seasonPhase:e.target.value as SeasonPhase}))}>{(["Off-season","Preseason","In-season","Championship","Transition / Recovery"] as SeasonPhase[]).map(x=><option key={x}>{x}</option>)}</select></label>:<span className="tag">{developmentSystem.seasonPhase}</span>}</div>
    <div className="blueprintPillarGrid">{developmentPillars.map(p=>{const value=developmentSystem.pillarRatings[p]||3;return <div key={p} className={value<=2?"needsAttention":value>=4?"strength":""}><div><b>{p}</b><span>{value}/5</span></div><div className="progress"><i style={{width:`${value*20}%`}}/></div><p>{pillarWhy[p]}</p>{canPlan&&<select value={value} onChange={e=>updatePillar(p,Number(e.target.value))}>{[1,2,3,4,5].map(n=><option value={n} key={n}>{n} / 5</option>)}</select>}</div>})}</div>
   </div>

   <div className="card foundationCard">
    <div className="sectionHead"><div><h2>Universal Athletic Foundations</h2><small>Every sport benefits from these movement foundations. Avoid specializing so narrowly that basic athleticism is left behind.</small></div><span className="tag">{athleticFoundations.filter(x=>developmentSystem.foundationProgress[x]).length}/{athleticFoundations.length}</span></div>
    <div className="foundationGrid">{athleticFoundations.map(name=><button disabled={!canPlan} className={developmentSystem.foundationProgress[name]?"complete":""} key={name} onClick={()=>toggleFoundation(name)}><span>{developmentSystem.foundationProgress[name]?"✓":"○"}</span><b>{name}</b><small>{developmentSystem.foundationProgress[name]?"Consistent foundation":"Build and assess"}</small></button>)}</div>
   </div>
  </>}

  {view==="Skills"&&<>
   <div className="card">
    <div className="sectionHead"><div><small>{sport.toUpperCase()} · {profile.position||"ALL POSITIONS"} · {ageMode.toUpperCase()}</small><h2>Sport Skill Tree</h2><p>Position priorities are ranked for this athlete. Skill status still belongs to the Coach/Player development process—the app suggests the next appropriate progression without auto-promoting a skill.</p></div><span className="tag">{needsWork.length} NEEDS WORK</span></div>
    <div className="skillTreeGrid">{skillRows.map(({name,entry})=>{const level=entry?.level||"Developing";const progression=progressionLevelFromSkill(entry?.level);const nextLevel=nextProgressionLevel(progression,ageMode);const priorityIndex=positionPriorities.indexOf(name);return <div className={"skillTreeCard "+level.replaceAll(" ","-").toLowerCase()+(priorityIndex>=0?" positionPriority":"")} key={name}>
     <div className="sectionHead"><div><h3>{name}</h3><small>{level}{priorityIndex>=0?` · Position priority #${priorityIndex+1}`:""}</small></div><span>{levelScore(level)}/5</span></div>
     {priorityIndex>=0&&<div className="skillNextProgression"><small>NEXT PROGRESSION</small><b>{progression} → {nextLevel}</b><span>{progressionExpectation(ageMode,nextLevel)}</span></div>}
     <p className="whySkill"><b>Why this matters:</b> {name.includes("Decision")||name.includes("Awareness")||name.includes("Recognition")?"It helps the athlete recognize situations sooner and choose an effective action under game pressure.":`Improving ${name.toLowerCase()} helps ${sport} technique become more reliable at higher speed and under competition pressure.`}</p>
     {canPlan?<><label>Status<select value={level} onChange={e=>updateSkill(name,{level:e.target.value as SkillLevel})}>{(["Needs Work","Developing","Consistent","Advanced"] as SkillLevel[]).map(x=><option key={x}>{x}</option>)}</select></label><label>Coach notes<textarea rows={2} value={entry?.notes||""} onChange={e=>updateSkill(name,{notes:e.target.value})} placeholder="Cue, observation, or next progression"/></label><label>Progress video URL<input value={entry?.videoUrl||""} onChange={e=>updateSkill(name,{videoUrl:e.target.value})} placeholder="Optional web-accessible video link"/></label></>:<>{entry?.notes&&<p><b>Coach note:</b> {entry.notes}</p>}</>}
     {entry?.videoUrl&&<a href={entry.videoUrl} target="_blank" rel="noreferrer">Open Progress Video ↗</a>}
    </div>})}</div>
   </div>
  </>}

  {view==="Training"&&<>
   <div className="grid three developmentProcessStats">
    <div className="stat"><small>PROCESS SCORE</small><b>{processScore}%</b><span>Behaviors, not wins and losses</span></div>
    <div className="stat"><small>RECENT REFLECTIONS</small><b>{developmentSystem.trainingReflections.length}</b><span>Player learning loop</span></div>
    <div className="stat"><small>7-DAY READINESS</small><b>{avgReadiness||"—"}</b><span>Recovery context</span></div>
   </div>
   {canReflect?<div className="card playerTrainingReflection">
    <div className="sectionHead"><div><small>POST-TRAINING REFLECTION</small><h2>What did I learn today?</h2><p>Use a 60-second reflection after practice or training. This connects the plan to the athlete's actual experience.</p></div><span className="tag">{completedWorkout?.name||"TRAINING"}</span></div>
    <div className="reflectionRatingGrid">
     <label>Effort<select value={reflectionEffort} onChange={e=>setReflectionEffort(e.target.value)}>{Array.from({length:10},(_,i)=>i+1).map(x=><option key={x}>{x}/10</option>)}</select></label>
     <label>Training quality<select value={reflectionQuality} onChange={e=>setReflectionQuality(e.target.value)}>{Array.from({length:10},(_,i)=>i+1).map(x=><option key={x}>{x}/10</option>)}</select></label>
     <label>Confidence<select value={reflectionConfidence} onChange={e=>setReflectionConfidence(e.target.value)}>{Array.from({length:10},(_,i)=>i+1).map(x=><option key={x}>{x}/10</option>)}</select></label>
    </div>
    <label>What felt good?<textarea rows={2} value={reflectionGood} onChange={e=>setReflectionGood(e.target.value)} placeholder="One thing that improved or felt strong"/></label>
    <label>What needs work?<textarea rows={2} value={reflectionWork} onChange={e=>setReflectionWork(e.target.value)} placeholder="One thing to focus on next time"/></label>
    <button className="featureAction" onClick={saveReflection}>Save My Reflection</button>
   </div>:<div className="card playerOnlyNotice"><span className="tag">PLAYER-ENTERED</span><h2>Post-Training Reflections</h2><p>Only the Player enters the reflection. Coaches and Parents can use the results to understand how training felt from the athlete's perspective.</p></div>}
   <div className="card"><h2>Recent Training Reflections</h2>{developmentSystem.trainingReflections.length===0?<p>No reflections yet.</p>:<div className="trainingReflectionList">{developmentSystem.trainingReflections.slice(0,8).map(r=><div key={r.id}><div><b>{r.workoutName}</b><small>{friendlyDate(r.date)}</small></div><div><span><small>Effort</small><b>{r.effort}/10</b></span><span><small>Quality</small><b>{r.quality}/10</b></span><span><small>Confidence</small><b>{r.confidence}/10</b></span></div>{r.feltGood&&<p><b>Good:</b> {r.feltGood}</p>}{r.needsWork&&<p><b>Next:</b> {r.needsWork}</p>}</div>)}</div>}</div>
  </>}

  {view==="Observations"&&<>
   {canPlan?<div className="card practiceObservationForm">
    <div className="sectionHead"><div><small>COACH PRACTICE OBSERVATION</small><h2>Capture what actually happened</h2><p>A quick observation updates the athlete's Skill Tree and feeds the Development Intelligence priorities.</p></div><span className="tag">COACH / ADMIN</span></div>
    <div className="two">
     <label>Context<select value={observationContext} onChange={e=>setObservationContext(e.target.value as "Practice"|"Game"|"Training")}><option>Practice</option><option>Game</option><option>Training</option></select></label>
     <label>Skill<select value={observationSkill} onChange={e=>setObservationSkill(e.target.value)}>{skillNames.map(x=><option key={x}>{x}</option>)}</select></label>
     <label>Observed level<select value={observationLevel} onChange={e=>setObservationLevel(e.target.value as SkillLevel)}>{(["Needs Work","Developing","Consistent","Advanced"] as SkillLevel[]).map(x=><option key={x}>{x}</option>)}</select></label>
     <label>Next action<input value={observationNext} onChange={e=>setObservationNext(e.target.value)} placeholder="One specific next progression or cue"/></label>
    </div>
    <label>Observation<textarea rows={3} value={observationNote} onChange={e=>setObservationNote(e.target.value)} placeholder="What did you see? Keep it specific and behavior-based."/></label>
    <button className="featureAction" onClick={savePracticeObservation}>Save Practice Observation</button>
   </div>:<div className="card"><div className="sectionHead"><div><small>COACH-ENTERED</small><h2>Practice Observations</h2><p>Coaches capture observations here. Players can review shared development evidence but do not edit Coach observations.</p></div></div></div>}
   <div className="card"><div className="sectionHead"><div><h2>Observation History</h2><small>Newest first · observations update the Skill Tree status</small></div><span className="tag">{developmentSystem.practiceObservations.length}</span></div>
    {developmentSystem.practiceObservations.length===0?<p>No Coach practice observations yet.</p>:developmentSystem.practiceObservations.slice(0,12).map(x=><div className="practiceObservationRow" key={x.id}><div><small>{x.context.toUpperCase()} · {friendlyDate(x.date)}</small><b>{x.skill}</b><span className={"practiceObservationLevel "+x.level.replaceAll(" ","-").toLowerCase()}>{x.level}</span></div>{x.note&&<p>{x.note}</p>}{x.nextAction&&<p><b>Next:</b> {x.nextAction}</p>}</div>)}
   </div>
  </>}

  {view==="Meeting"&&<>
   {canPlan?<div className="card developmentMeetingForm">
    <div className="sectionHead"><div><small>EVERY 4–8 WEEKS</small><h2>Development Meeting</h2><p>Align Player, Coach, and Parent around the same progress, priority, next goal, and support plan.</p></div></div>
    <div className="two">
     <label>What improved?<textarea rows={2} value={meetingProgress} onChange={e=>setMeetingProgress(e.target.value)} /></label>
     <label>Current development priority<textarea rows={2} value={meetingPriority} onChange={e=>setMeetingPriority(e.target.value)} /></label>
     <label>Player perspective<textarea rows={2} value={meetingPlayerVoice} onChange={e=>setMeetingPlayerVoice(e.target.value)} placeholder="What does the Player think is going well or needs work?"/></label>
     <label>Coach plan<textarea rows={2} value={meetingCoachPlan} onChange={e=>setMeetingCoachPlan(e.target.value)} placeholder="What will training emphasize?"/></label>
     <label>How Parent can help<textarea rows={2} value={meetingParentSupport} onChange={e=>setMeetingParentSupport(e.target.value)} placeholder="Transport, sleep routine, encouragement, scheduling, communication, etc."/></label>
     <label>Next measurable goal<textarea rows={2} value={meetingNextGoal} onChange={e=>setMeetingNextGoal(e.target.value)} /></label>
    </div>
    <button className="featureAction" onClick={saveMeeting}>Save Development Meeting</button>
   </div>:<div className="card"><h2>Development Meetings</h2><p>Coach-led development meetings align the athlete, Coach, and Parent. Saved meetings are visible here.</p></div>}
   <div className="card"><h2>Meeting History</h2>{developmentSystem.meetings.length===0?<p>No development meetings yet.</p>:developmentSystem.meetings.slice(0,8).map(m=><div className="developmentMeetingRow" key={m.id}><div><b>{friendlyDate(m.date)}</b><span className="tag">{m.priority||"Development Review"}</span></div>{m.progress&&<p><b>Progress:</b> {m.progress}</p>}{m.playerVoice&&<p><b>Player:</b> {m.playerVoice}</p>}{m.coachPlan&&<p><b>Coach:</b> {m.coachPlan}</p>}{m.parentSupport&&<p><b>Parent support:</b> {m.parentSupport}</p>}{m.nextGoal&&<p><b>Next goal:</b> {m.nextGoal}</p>}</div>)}</div>
  </>}

  {view==="Journal"&&<>
   <div className="card perspectiveComparisonCard">
    <div className="sectionHead"><div><small>PLAYER + COACH PERSPECTIVE</small><h2>Weekly Review Alignment</h2><p>This is a conversation tool—not a right/wrong score. Differences can reveal what the athlete and Coach are experiencing differently.</p></div><span className="tag">{perspectiveLabel}</span></div>
    {perspectivePlayer&&perspectiveCoach?<div className="perspectiveComparisonGrid">
     <div><small>PLAYER REVIEW · {friendlyDate(perspectivePlayer.weekStart)}</small><b>{perspectivePlayer.rating}/10 overall</b><p><strong>Win:</strong> {perspectivePlayer.wins||"—"}</p><p><strong>Challenge:</strong> {perspectivePlayer.challenges||"—"}</p><p><strong>Next focus:</strong> {perspectivePlayer.focus||"—"}</p></div>
     <div><small>COACH REVIEW · {friendlyDate(perspectiveCoach.weekStart)}</small><b>{coachAvg}/5 average</b><p><strong>Strength:</strong> {perspectiveCoach.strengths||"—"}</p><p><strong>Development:</strong> {perspectiveCoach.developmentOpportunity||"—"}</p><p><strong>Next focus:</strong> {perspectiveCoach.nextWeekFocus||"—"}</p></div>
     <div className="perspectivePrompt"><small>CONVERSATION PROMPT</small><b>{perspectiveLabel}</b><p>{sharedFocus.length?`Both perspectives mention ${sharedFocus.slice(0,3).join(", ")}. Ask what actions would make that focus measurable next week.`:"Ask: “What are we each noticing, and what is one priority we can agree to measure next week?”"}</p></div>
    </div>:<div className="parentEmptyState"><b>Both reviews are needed</b><span>The comparison appears when a Player Weekly Review and an available Coach Weekly Review exist.</span></div>}
   </div>
   <div className="card developmentJournal">
    <div className="sectionHead"><div><h2>Development Journal</h2><small>Reflections, reviews, observations, milestones, goals, and development meetings.</small></div><span className="tag">{journal.length} ITEMS</span></div>
    {journal.length===0?<p>Development evidence will appear here as the athlete trains, reflects, reaches milestones, and reviews progress.</p>:<div>{journal.map((item,i)=><div className="developmentJournalRow" key={`${item.type}-${item.date}-${i}`}><span className="journalDot"/><div><small>{item.type} · {friendlyDate(item.date)}</small><b>{item.title}</b><p>{item.detail}</p></div></div>)}</div>}
   </div>
  </>}

  {view==="Timeline"&&<div className="card athleteDevelopmentTimeline">
   <div className="sectionHead"><div><small>ONE ATHLETE RECORD</small><h2>Development Timeline</h2><p>Training, tests, competition, reflections, Coach observations, reviews, meetings, goals, and milestones in chronological order.</p></div><span className="tag">{developmentTimeline.length} EVENTS</span></div>
   {developmentTimeline.length===0?<p>No development events yet.</p>:developmentTimeline.map((item,i)=><div className="athleteTimelineRow" key={`${item.type}-${item.date}-${i}`}><time>{friendlyDate(item.date)}</time><span className="timelineDot"/><div><small>{item.type.toUpperCase()}</small><b>{item.title}</b><p>{item.detail}</p></div></div>)}
  </div>}
 </div>;
}

function DevelopmentHub({accountRole,sport,profile,dev,setDev,results,goals,workouts,program,setProgram,readiness,weeklyReviews,coachWeeklyReviews,competitions,milestones,setMilestones,developmentSystem,setDevelopmentSystem,setWorkouts}:{accountRole:AccountRole;sport:Sport;profile:Profile;dev:DevelopmentItem[];setDev:React.Dispatch<React.SetStateAction<DevelopmentItem[]>>;results:Result[];goals:Goal[];workouts:Workout[];program:TrainingProgram|null;setProgram:React.Dispatch<React.SetStateAction<TrainingProgram|null>>;readiness:ReadinessLog[];weeklyReviews:WeeklyReview[];coachWeeklyReviews:CoachWeeklyReview[];competitions:CompetitionLog[];milestones:Milestone[];setMilestones:React.Dispatch<React.SetStateAction<Milestone[]>>;developmentSystem:DevelopmentSystemState;setDevelopmentSystem:React.Dispatch<React.SetStateAction<DevelopmentSystemState>>;setWorkouts:any}){
 const [showProgram,setShowProgram]=useState(false);
 const [showMental,setShowMental]=useState(false);
 return <><UniversalDevelopmentSystem accountRole={accountRole} sport={sport} profile={profile} dev={dev} goals={goals} workouts={workouts} results={results} readiness={readiness} weeklyReviews={weeklyReviews} coachWeeklyReviews={coachWeeklyReviews} competitions={competitions} milestones={milestones} developmentSystem={developmentSystem} setDevelopmentSystem={setDevelopmentSystem}/>
 <Development sport={sport} profile={profile} dev={dev} setDev={setDev} results={results} goals={goals} workouts={workouts} program={program} readiness={readiness} competitions={competitions} milestones={milestones} setMilestones={setMilestones}/>
 <div className="card mentalTrainingLauncher"><div className="sectionHead"><div><span className="tag">MENTAL PERFORMANCE</span><h2>Mental Preparation & Rehearsal</h2><small>Breathing, visualization, cue words, and a simple pre-performance routine</small></div><button className="featureAction" onClick={()=>setShowMental(x=>!x)}>{showMental?"Close":"Start"}</button></div></div>
 {showMental&&<MentalTraining sport={sport} profile={profile}/>}
 <div className="card compactTools"><div className="sectionHead"><div><h2>Training Program</h2><small>Weekly program builder and sessions</small></div><button className="featureAction" onClick={()=>setShowProgram(x=>!x)}>{showProgram?"Hide Program":"Open Program"}</button></div></div>
 {showProgram&&<Program accountRole={accountRole} sport={sport} profile={profile} dev={dev} results={results} readiness={readiness} program={program} setProgram={setProgram} setWorkouts={setWorkouts}/>}</>;
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

function Home({accountRole,sport,setSport,goals,workouts,results,profile,setProfile,onProfileSaved,readiness,competitions,dev,program,weeklyReviews,setWeeklyReviews,coachWeeklyReviews,developmentSystem,testTargets,workspaceRole,onboardingDismissed,setOnboardingDismissed,setTab,editProfileRequest}:{accountRole:AccountRole;sport:Sport;setSport:React.Dispatch<React.SetStateAction<Sport>>;goals:Goal[];workouts:Workout[];results:Result[];profile:Profile;setProfile:React.Dispatch<React.SetStateAction<Profile>>;onProfileSaved?:()=>void;readiness:ReadinessLog[];competitions:CompetitionLog[];dev:DevelopmentItem[];program:TrainingProgram|null;weeklyReviews:WeeklyReview[];setWeeklyReviews:React.Dispatch<React.SetStateAction<WeeklyReview[]>>;coachWeeklyReviews:CoachWeeklyReview[];developmentSystem:DevelopmentSystemState;testTargets:TestTarget[];workspaceRole:WorkspaceRole;onboardingDismissed:boolean;setOnboardingDismissed:React.Dispatch<React.SetStateAction<boolean>>;setTab:React.Dispatch<React.SetStateAction<Tab>>;editProfileRequest:number}){
 const [editingProfile,setEditingProfile]=useState(false);
 const [profileDraft,setProfileDraft]=useState<Profile>({...profile});
 const [sportDraft,setSportDraft]=useState<Sport>(sport);
 const [profileSaveError,setProfileSaveError]=useState("");
 const canEditProfile=accountRole==="Player"||accountRole==="Admin";
 const beginProfileEdit=()=>{
  if(!canEditProfile)return;
  setProfileDraft({...profile});
  setSportDraft(sport);
  setProfileSaveError("");
  setEditingProfile(true);
 };
 const cancelProfileEdit=()=>{
  setProfileDraft({...profile});
  setSportDraft(sport);
  setProfileSaveError("");
  setEditingProfile(false);
 };
 const savePlayerProfile=()=>{
  if(!canEditProfile)return;
  const clean:Profile={
   ...profileDraft,
   sport:sportDraft,
   name:profileDraft.name.trim(),
   position:profileDraft.position.trim(),
   team:profileDraft.team.trim(),
   season:profileDraft.season.trim(),
   height:profileDraft.height.trim(),
   weight:profileDraft.weight.trim(),
   age:(profileDraft.age||"").trim()
  };
  const missing:string[]=[];
  if(!clean.name||clean.name==="Athlete")missing.push("name");
  const ageNumber=Number(clean.age);
  if(!clean.age||!Number.isFinite(ageNumber)||ageNumber<6||ageNumber>99)missing.push("valid age (6–99)");
  if(!clean.position)missing.push("position");
  if(!clean.team)missing.push("team");
  if(!clean.height)missing.push("height");
  if(!clean.weight)missing.push("weight");
  if(!clean.handedness)missing.push("handedness");
  if(missing.length){
   setProfileSaveError(`Complete ${missing.join(", ")} before saving the player.`);
   if(missing.includes("name"))window.setTimeout(()=>{
    const el=document.getElementById("player-profile-name") as HTMLInputElement|null;
    el?.scrollIntoView({behavior:"smooth",block:"center"});el?.focus();
   },40);
   return;
  }
  setSport(sportDraft);
  setProfile(clean);
  setProfileSaveError("");
  setEditingProfile(false);
  onProfileSaved?.();
 };
 const gs=goals.length?Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length):0;
 const ws=workouts.filter(x=>x.sport===sport),done=ws.filter(x=>x.completed).length;
 const rs=results.filter(x=>x.sport===sport);
 const baseScore=pct(gs*.4+(ws.length?done/ws.length*30:0)+(rs.length?30:0));

 const todayDate=today();
 const upcoming=ws.filter(w=>!w.completed&&w.date>=todayDate).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
 const sportComps=competitions.filter(c=>c.sport===sport&&c.date>=todayDate).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,2);
 const openDev=dev.filter(d=>d.status!=="Complete").sort((a,b)=>({High:0,Medium:1,Low:2}[a.priority||"Medium"])-({High:0,Medium:1,Low:2}[b.priority||"Medium"])).slice(0,2);

 const recentReadiness=readiness.slice(0,7);
 const avgReadiness=recentReadiness.length?Math.round(recentReadiness.reduce((a,r)=>a+readinessScoreV2(r,Number(profile.age||0)),0)/recentReadiness.length):0;

 const completedThisWeek=ws.filter(w=>w.completed&&new Date(w.date).getTime()>=Date.now()-7*86400000).length;
 const testingThisWeek=rs.filter(r=>new Date(r.date).getTime()>=Date.now()-7*86400000).length;
 const programPct=program?.sessions.length?Math.round(program.sessions.filter(s=>s.completed).length/program.sessions.length*100):0;
 const competitionAvg=competitions.filter(c=>c.sport===sport).length?Math.round(competitions.filter(c=>c.sport===sport).reduce((a,c)=>a+c.rating,0)/competitions.filter(c=>c.sport===sport).length*10):0;
 const score=Math.round((baseScore*.45)+(avgReadiness||70)*.2+(competitionAvg||70)*.15+(program?programPct*.2:70*.2));

 const [wins,setWins]=useState(""),[challenges,setChallenges]=useState(""),[focus,setFocus]=useState(""),[rating,setRating]=useState("8");
 const [weeklyReviewOpen,setWeeklyReviewOpen]=useState(true);
 const weekStart=mondayOfWeek();
 const currentReview=weeklyReviews.find(r=>r.weekStart===weekStart);
 const clearWeeklyReviewFields=()=>{setWins("");setChallenges("");setFocus("");setRating("8")};
 const openWeeklyReview=()=>{
  if(currentReview){setWins(currentReview.wins);setChallenges(currentReview.challenges);setFocus(currentReview.focus);setRating(String(currentReview.rating))}
  else clearWeeklyReviewFields();
  setWeeklyReviewOpen(true);
 };
 const saveReview=()=>{
  if(accountRole!=="Player")return;
  const item:WeeklyReview={id:currentReview?.id||Date.now(),weekStart,wins:wins.trim(),challenges:challenges.trim(),focus:focus.trim(),rating:Number(rating)||0};
  setWeeklyReviews(x=>[item,...x.filter(r=>r.weekStart!==weekStart)]);
  clearWeeklyReviewFields();
  setWeeklyReviewOpen(false);
 };

 useEffect(()=>{
  clearWeeklyReviewFields();
  setWeeklyReviewOpen(!currentReview);
 },[currentReview?.id,weekStart]);
 useEffect(()=>{if(!canEditProfile&&editingProfile)setEditingProfile(false)},[canEditProfile,editingProfile]);

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
 const blueprintRows=developmentPillars.map(p=>({pillar:p,score:developmentSystem.pillarRatings[p]||3})).sort((a,b)=>a.score-b.score);
 const blueprintPriority=blueprintRows[0];
 const prioritySkill=sportSkillTrees[sport].find(name=>developmentSystem.skillProgress[name]?.level==="Needs Work")||sportSkillTrees[sport].find(name=>developmentSystem.skillProgress[name]?.level==="Developing");
 const nextAction=openDev[0]?.title||prioritySkill||upcoming[0]?.name||"Build one quality development habit today.";
 const activeGoals=goals.filter(g=>(g.status||"Active")!=="Complete");
 const nearGoals=activeGoals.filter(g=>g.progress>=70).length;
 const recentResults=rs.filter(r=>new Date(r.date).getTime()>=Date.now()-30*86400000).length;
 const recentComps=competitions.filter(c=>c.sport===sport&&new Date(c.date).getTime()>=Date.now()-30*86400000);
 const avgRecentComp=recentComps.length?Math.round(recentComps.reduce((a,c)=>a+c.rating,0)/recentComps.length*10)/10:0;
 
 const profileChecks=[
  Boolean(profile.name&&profile.name!=="Athlete"),
  Boolean(profile.age&&Number(profile.age)>=6&&Number(profile.age)<=99),
  Boolean(profile.position),
  Boolean(profile.team),
  Boolean(profile.height),
  Boolean(profile.weight),
  Boolean(profile.handedness)
 ];
 const profileCompletion=Math.round(profileChecks.filter(Boolean).length/profileChecks.length*100);
 const setupSteps=[
  {label:canEditProfile?"Complete athlete profile":"Review athlete profile",done:canEditProfile?profileCompletion===100:true,tab:"Home" as Tab,target:"profile"},
  {label:"Create a goal",done:goals.length>0,tab:"Goals" as Tab,target:"goals"},
  {label:"Log a performance test",done:rs.length>0,tab:"Testing" as Tab,target:"testing"},
  {label:"Schedule a workout",done:ws.length>0,tab:"Calendar" as Tab,target:"calendar"},
  ...(accountRole==="Player"?[{label:"Complete readiness check-in",done:readiness.length>0,tab:"Coach" as Tab,target:"readiness"}]:[])
 ];
 const setupPct=Math.round(setupSteps.filter(x=>x.done).length/setupSteps.length*100);
 useEffect(()=>{
  if(editProfileRequest<=0||!canEditProfile)return;
  setProfileDraft({...profile});
  setSportDraft(sport);
  setProfileSaveError("");
  setEditingProfile(true);
  window.setTimeout(()=>{
   const el=document.getElementById("setup-profile");
   if(el){el.scrollIntoView({behavior:"smooth",block:"center"});(el as HTMLElement).focus({preventScroll:true});}
  },140);
 },[editProfileRequest]);

 const goToSetupItem=(tab:Tab,target:string)=>{
  setTab(tab);
  if(target==="profile"&&canEditProfile)beginProfileEdit();
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
  {label:"Profile complete",done:profileCompletion===100,detail:"Name, age, position, team, height, and weight"},
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
const roleActions:{title:string;detail:string;tab:Tab}[]=workspaceRole==="Coach"
  ?[
    {title:"Review readiness",detail:`${avgReadiness||"No"} readiness score`,tab:"Coach"},
    {title:"Set development priority",detail:openDev[0]?.title||"No open objective",tab:"Development"},
    {title:"Check competition form",detail:avgRecentComp?`${avgRecentComp}/10 recent rating`:"Log competition data",tab:"Competition"}
   ]
  :workspaceRole==="Parent"
  ?[
    {title:"Review schedule",detail:`${upcoming.length+sportComps.length} upcoming items`,tab:"Calendar"},
    {title:"Review progress",detail:nearGoals?`${nearGoals} goal${nearGoals===1?"":"s"} near completion`:"See current progress",tab:"Analytics"},
    {title:"Support recovery",detail:avgReadiness?`${avgReadiness}/100 readiness`:"Review recovery and notes",tab:"Coach"}
   ]
  :[
    {title:"Today's focus",detail:nextAction,tab:openDev[0]?"Development":"Calendar"},
    {title:"Training status",detail:avgReadiness>=75?"Ready for quality work":"Monitor recovery",tab:"Coach"},
    {title:"Next milestone",detail:nearGoals?`${nearGoals} goal${nearGoals===1?"":"s"} close`:"Build the next target",tab:"Goals"}
   ];

const requestProfileUpdate=()=>{
  setTab("Coach");
  window.setTimeout(()=>document.getElementById("shared-support-notes")?.scrollIntoView({behavior:"smooth",block:"start"}),220);
};

const signals:PerformanceSignal[]=[
  {label:"Readiness",value:avgReadiness?`${avgReadiness}/100`:"Need data",detail:avgReadiness>=75?"Recovery supports quality training.":avgReadiness?"Watch recovery before adding load.":accountRole==="Player"?"Complete your daily check-in.":"Waiting for the Player's check-in.",tone:avgReadiness>=75?"good":avgReadiness?"watch":"neutral"},
  {label:"Goal Momentum",value:nearGoals?`${nearGoals} close`:`${gs}% avg`,detail:nearGoals?"Goals are approaching completion.":"Keep weekly actions tied to goals.",tone:nearGoals?"good":"neutral"},
  {label:"Testing Activity",value:`${recentResults} / 30d`,detail:recentResults>=2?"Good recent testing coverage.":"Retest key measures to confirm trends.",tone:recentResults>=2?"good":"watch"},
  {label:"Competition Form",value:avgRecentComp?`${avgRecentComp}/10`:"Need data",detail:avgRecentComp>=7?"Recent competition form is strong.":avgRecentComp?"Use game notes to set the next focus.":"Log games to build competition trends.",tone:avgRecentComp>=7?"good":avgRecentComp?"watch":"neutral"}
 ];
 const todayReadiness=readiness.find(r=>r.date===todayDate);
 const todayReadinessScore=todayReadiness?readinessScoreV2(todayReadiness,Number(profile.age||0)):0;
 const playerStage=developmentStageForAge(Number(profile.age||0));
 const playerPositionPriorities=positionSkillPriorities(sport,profile.position).filter(name=>sportSkillTrees[sport].includes(name));
 const playerNextSkill=playerPositionPriorities.find(name=>developmentSystem.skillProgress[name]?.level!=="Advanced")||prioritySkill||playerPositionPriorities[0]||sportSkillTrees[sport][0];
 const playerCurrentProgression=progressionLevelFromSkill(developmentSystem.skillProgress[playerNextSkill]?.level);
 const playerNextProgression=nextProgressionLevel(playerCurrentProgression,playerStage);
 const checkInsThisWeek=readiness.filter(r=>new Date(r.date).getTime()>=Date.now()-7*86400000).length;
 const playerPrimaryAction=!todayReadiness
  ?{title:"Complete Daily Check-In",detail:"About 1 minute",tab:"Coach" as Tab}
  :upcoming[0]
  ?{title:upcoming[0].name,detail:`${friendlyDate(upcoming[0].date)} · ${upcoming[0].minutes} min`,tab:"Calendar" as Tab}
  :!currentReview
  ?{title:"Complete Weekly Review",detail:"Your reflection for this week",tab:"Home" as Tab}
  :{title:"See My Progress",detail:"Review what is improving",tab:"Analytics" as Tab};
 const playerGreeting=(()=>{const h=new Date().getHours();return h<12?"Good morning":h<17?"Good afternoon":"Good evening"})();


 return <><div className="activeAthleteBanner"><small>ACTIVE ATHLETE</small><b>{profile.name}</b><span>{sport}{profile.position?" · "+profile.position:""}</span></div>

 {accountRole==="Player"?<div className="hero homeHero playerSimpleHero"><div className="heroCopy"><small>PLAYER · TODAY</small><h1>{playerGreeting}, {profile.name||"Athlete"}</h1><p>{sport}{profile.position?" · "+profile.position:""}{profile.team?" · "+profile.team:""}</p></div><button className="playerHelpCue" onClick={()=>setTab("Analytics")}>See My Progress →</button></div>:<div className="hero homeHero phase30Hero"><div className="heroCopy"><small>ATHLETE OVERVIEW</small><h1>{profile.name}</h1><p>{sport}{profile.position?" · "+profile.position:""}{profile.team?" · "+profile.team:""} · {profile.season}</p><div className="heroBadges"><span>{score}/100 Performance</span><span>{avgReadiness||"—"} Readiness</span><span>{streak} Day Streak</span></div></div><div className="heroScoreOrb"><strong>{score}</strong><small>PERFORMANCE</small></div></div>}

 {accountRole==="Player"&&<section className="playerSimpleDashboard">
  <div className="playerPrimaryTask">
   <div><small>{!todayReadiness?"START HERE":"NEXT"}</small><h2>{playerPrimaryAction.title}</h2><p>{playerPrimaryAction.detail}</p></div>
   <button className="featureAction" onClick={()=>{setTab(playerPrimaryAction.tab);if(playerPrimaryAction.title==="Complete Weekly Review")window.setTimeout(()=>document.getElementById("setup-weekly-review")?.scrollIntoView({behavior:"smooth",block:"center"}),220)}}>{!todayReadiness?"Start":"Open"} →</button>
  </div>
  <div className="playerSimpleGrid">
   <button onClick={()=>setTab("Coach")}><small>HOW I FEEL TODAY</small><b>{todayReadiness?`${todayReadinessScore} · ${readinessStatus(todayReadinessScore)}`:"Check in"}</b><span>{todayReadiness?"Tap for the details":"Sleep · energy · soreness · stress"}</span></button>
   <button onClick={()=>setTab("Calendar")}><small>NEXT TRAINING</small><b>{upcoming[0]?.name||"Nothing scheduled"}</b><span>{upcoming[0]?`${friendlyDate(upcoming[0].date)} · ${upcoming[0].minutes} min`:"Open Schedule"}</span></button>
   <button onClick={()=>setTab("Development")}><small>CURRENT FOCUS</small><b>{playerNextSkill}</b><span>{playerCurrentProgression} → {playerNextProgression}</span></button>
  </div>
  <div className="playerWeekStrip">
   <div><small>THIS WEEK</small><b>{completedThisWeek}</b><span>workouts done</span></div>
   <div><small>CHECK-INS</small><b>{checkInsThisWeek}/7</b><span>last 7 days</span></div>
   <div><small>WEEKLY REVIEW</small><b>{currentReview?"Done":"Due"}</b><span>{currentReview?`Rating ${currentReview.rating}/10`:"Complete on Today"}</span></div>
   <div><small>MY STAGE</small><b>{playerStage}</b><span>{profile.position||sport}</span></div>
  </div>
  <div className="playerSimpleActions"><button onClick={()=>setTab("Goals")}>My Goals</button><button onClick={()=>setTab("Analytics")}>My Progress</button><button onClick={()=>setTab("Development")}>My Development</button></div>
 </section>}

 {!onboardingDismissed&&setupPct<100&&<div className="onboardingCard"><div className="sectionHead"><div><small>GETTING STARTED</small><h2>Finish Your Setup</h2></div><button aria-label="Dismiss onboarding" onClick={()=>setOnboardingDismissed(true)}>×</button></div><div className="setupMeter"><div className="progress"><i style={{width:`${setupPct}%`}}/></div><b>{setupPct}%</b></div><div className="setupSteps">{setupSteps.map(x=>x.done?<span className="done" key={x.label}>✓ {x.label}</span>:<button type="button" className="setupStepLink" key={x.label} onClick={()=>goToSetupItem(x.tab,x.target)}><span>○ {x.label}</span><b>Open →</b></button>)}</div></div>}

 


 <div className="roleBrief playerOptionalHome"><span className="tag">{workspaceRole.toUpperCase()} VIEW</span><p>{roleMessage}</p></div>
 <div className="roleActionGrid playerOptionalHome">{roleActions.map(x=><button key={x.title} onClick={()=>setTab(x.tab)}><small>{x.title}</small><b>{x.detail}</b><span>Open →</span></button>)}</div>

 <div className="commandGrid playerOptionalHome">
  <div className="commandCard accent"><small>READINESS</small><div className="ring" style={{"--ring":`${avgReadiness||0}%`} as React.CSSProperties}><b>{avgReadiness||"—"}</b></div><span>{readinessLabel}</span></div>
  <div className="commandCard"><small>GOALS</small><b>{gs}%</b><div className="progress"><i style={{width:`${gs}%`}}/></div><span>{goals.length} tracked</span></div>
  <div className="commandCard"><small>PROGRAM</small><b>{program?programPct+"%":"—"}</b><div className="progress"><i style={{width:`${programPct}%`}}/></div><span>{program?"weekly plan":"no active plan"}</span></div>
  <div className="commandCard"><small>NEXT FOCUS</small><b className="focusText">{nextAction}</b><span>{openDev[0]?"development priority":"next action"}</span></div>
 </div>

 <div className="card playerProfileCard setupAnchor" id="setup-profile" tabIndex={-1}>
  <div className="sectionHead playerProfileHead">
   <div><small>PLAYER PROFILE</small><h2>{editingProfile?(profileDraft.name||"Athlete"):(profile.name||"Athlete")}</h2><p>{editingProfile?sportDraft:sport}{(editingProfile?profileDraft.position:profile.position)?` · ${editingProfile?profileDraft.position:profile.position}`:""}{(editingProfile?profileDraft.team:profile.team)?` · ${editingProfile?profileDraft.team:profile.team}`:""}</p></div>
   <div className="profileHeadActions"><span className="tag">{profileCompletion}% complete</span>{canEditProfile?<button type="button" className={editingProfile?"profileDoneButton":"featureAction profileEditButton"} onClick={editingProfile?cancelProfileEdit:beginProfileEdit}>{editingProfile?"Cancel":"Edit Profile"}</button>:<span className="profileReadOnlyBadge">VIEW ONLY</span>}</div>
  </div>
  {!canEditProfile&&<div className="profileOwnershipNotice"><div><small>PLAYER PROFILE OWNERSHIP</small><b>Coach view is read-only</b><p>Coaches can use this information for development planning, but cannot change the Player's name, age, sport, position, team, season, height, weight, or handedness.</p></div><button type="button" onClick={requestProfileUpdate}>Request Profile Update</button></div>}
  {!editingProfile?
   <div className="profileSummaryGrid">
    <div><small>Sport</small><b>{sport}</b></div>
    <div><small>Age</small><b>{profile.age||"Not set"}</b></div>
    <div><small>Position</small><b>{profile.position||"Not set"}</b></div>
    <div><small>Team</small><b>{profile.team||"Not set"}</b></div>
    <div><small>Season</small><b>{profile.season||"Not set"}</b></div>
    <div><small>Height</small><b>{profile.height||"Not set"}</b></div>
    <div><small>Weight</small><b>{profile.weight||"Not set"}</b></div>
    <div><small>Handedness</small><b>{profile.handedness||"Not set"}</b></div>
   </div>
   :
   <div className="profileEditPanel">
    <div className="profileSetupNotice"><b>Choose sport and enter age first</b><span>The selected sport is saved to this athlete profile and stays locked until Edit Profile is used again. Sport updates the Position menu. Age adjusts workout volume, session length, and exercise progression.</span></div>
    <div className="profileGrid">
     <label className="playerNameField"><span>Player name <b>Required</b></span><input id="player-profile-name" autoComplete="name" value={profileDraft.name==="Athlete"?"":profileDraft.name||""} onChange={e=>{setProfileDraft((x:Profile)=>({...x,name:e.target.value}));setProfileSaveError("")}} placeholder="Enter player name"/></label>
     <label>Sport<select value={sportDraft} onChange={e=>{const next=e.target.value as Sport;setSportDraft(next);setProfileDraft((x:Profile)=>({...x,position:""}));setProfileSaveError("")}}>{sports.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
     <label>Age<input type="number" inputMode="numeric" min="6" max="99" value={profileDraft.age||""} onChange={e=>{setProfileDraft((x:Profile)=>({...x,age:e.target.value}));setProfileSaveError("")}} placeholder="e.g. 14"/></label>
     <label>Position<select value={positions[sportDraft].includes(profileDraft.position)?profileDraft.position:""} onChange={e=>{setProfileDraft((x:Profile)=>({...x,position:e.target.value}));setProfileSaveError("")}}><option value="">Select position</option>{positions[sportDraft].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
     <label>Team<input value={profileDraft.team||""} onChange={e=>{setProfileDraft((x:Profile)=>({...x,team:e.target.value}));setProfileSaveError("")}} placeholder="Enter team"/></label>
     <label>Season<input value={profileDraft.season||""} onChange={e=>setProfileDraft((x:Profile)=>({...x,season:e.target.value}))} placeholder="e.g. 2026-27"/></label>
     <label>Height<input value={profileDraft.height||""} onChange={e=>{setProfileDraft((x:Profile)=>({...x,height:e.target.value}));setProfileSaveError("")}} placeholder="e.g. 5'10&quot;"/></label>
     <label>Weight<input inputMode="decimal" value={profileDraft.weight||""} onChange={e=>{setProfileDraft((x:Profile)=>({...x,weight:e.target.value}));setProfileSaveError("")}} placeholder="e.g. 165 lb"/></label>
     <label>Handedness<select value={profileDraft.handedness||"Right"} onChange={e=>{setProfileDraft((x:Profile)=>({...x,handedness:e.target.value as "Right"|"Left"}));setProfileSaveError("")}}><option value="Right">Right</option><option value="Left">Left</option></select></label>
    </div>
    {profileSaveError&&<div className="profileSaveError" role="alert">{profileSaveError}</div>}
    <div className="profileEditFooter"><small>Nothing is saved until you tap <b>Save Player</b>.</small><button type="button" className="featureAction" onClick={savePlayerProfile}>Save Player</button></div>
   </div>
  }
 </div>
 
 <details className="simpleDisclosure advancedTools homeAdvancedDetail"><summary><div><b>V1 Readiness</b><small>Setup and release-readiness checklist</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="sectionDivider"><span><i/>V1 Readiness</span></div>
 <div className="card releaseReadiness"><div className="sectionHead"><h2>Tracking Setup</h2><span className="tag">SETUP</span></div><div className="releaseMeter"><strong>{releaseReadyPct}%</strong><div className="progress"><i style={{width:`${releaseReadyPct}%`}}/></div></div><div className="releaseChecks">{releaseChecks.map(x=><div className={x.done?"done":""} key={x.label}><span>{x.done?"✓":"○"}</span><div><b>{x.label}</b><small>{x.detail}</small></div></div>)}</div></div>
 </div></details>
 <details className="simpleDisclosure advancedTools homeAdvancedDetail"><summary><div><b>Performance Intelligence</b><small>Readiness, goals, testing, and competition signals</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="sectionDivider"><span><i/>Performance Intelligence</span></div>
 <div className="signalGrid">{signals.map(x=><div className={"signalCard "+x.tone} key={x.label}><small>{x.label}</small><b>{x.value}</b><p>{x.detail}</p></div>)}</div>
 </div></details>
 <div className="sectionDivider playerOptionalHome"><span><i/>This Week</span></div>
 <div className="grid three playerOptionalHome">
  <div className="stat"><small>Workouts Done</small><b>{completedThisWeek}</b></div>
  <div className="stat"><small>Tests Logged</small><b>{testingThisWeek}</b></div>
  <div className="stat"><small>Competition Score</small><b>{competitionAvg||"—"}</b></div>
 </div>

 <div className="grid twoCards playerOptionalHome">
  <div className="card"><div className="sectionHead"><h2>Coming Up</h2><span className="tag">Next 3</span></div>{upcoming.length===0&&sportComps.length===0?<p>No upcoming workouts or competitions.</p>:<>{upcoming.map(w=><div className="dashboardRow" key={w.id}><span className="dashDate">{w.date.slice(5)}</span><div><b>{w.name}</b><small>{w.category} · {w.minutes} min</small></div></div>)}{sportComps.map(c=><div className="dashboardRow" key={c.id}><span className="dashDate">{c.date.slice(5)}</span><div><b>{c.opponent||c.eventType}</b><small>Competition{c.result?" · "+c.result:""}</small></div></div>)}</>}</div>
  <div className="card"><div className="sectionHead"><h2>Development Focus</h2><span className="tag">{openDev.length} priority</span></div>{openDev.length?openDev.map(d=><div className="focusCard" key={d.id}><span className="tag">{d.priority||"Medium"} · {d.category}</span><b>{d.title}</b><small>{d.target||"Keep progressing this objective."}</small></div>):<p>No open development objectives.</p>}</div>
 </div>

 
 <div className="sectionDivider playerOptionalHome"><span><i/>Reminder Center</span></div>
 <div className="card playerOptionalHome"><div className="sectionHead"><h2>Upcoming Priorities</h2><span className="tag">UPCOMING</span></div>{reminderItems.length===0?<p>No upcoming reminders. Your schedule is clear.</p>:<div className="reminderList">{reminderItems.map(r=><div className={"reminderRow "+r.priority.toLowerCase()} key={r.id}><span className="reminderDate">{r.date.slice(5)}</span><div><b>{r.title}</b><small>{r.kind} · {r.detail}</small></div><em>{r.priority}</em></div>)}</div>}</div>

 
 <details className="simpleDisclosure advancedTools homeAdvancedDetail"><summary><div><b>Recent Activity</b><small>Workout, testing, competition, and goal timeline</small></div><span>Open</span></summary><div className="simpleDisclosureBody"><div className="sectionDivider"><span><i/>Recent Activity</span></div>
 <div className="card"><div className="sectionHead"><h2>Athlete Timeline</h2><span className="tag">RECENT</span></div>{activityItems.length===0?<p>Your recent workouts, tests, competitions, and completed goals will appear here.</p>:<div className="activityTimeline">{activityItems.map(a=><div className="activityItem" key={a.id}><span className={"activityDot "+a.kind.toLowerCase()}/><div><b>{a.title}</b><small>{a.kind} · {a.detail}</small></div><time>{a.date}</time></div>)}</div>}</div>

 </div></details>
 {accountRole==="Player"&&coachWeeklyReviews.length>0&&<div className="card playerCoachReviewCard">
  <div className="sectionHead"><div><small>SHARED BY COACH</small><h2>Coach Weekly Review</h2><p>Your Coach chose to share this review with you.</p></div><span className="tag">COACH FEEDBACK</span></div>
  {coachWeeklyReviews.slice(0,2).map(review=><div className="playerCoachReviewItem" key={review.id}>
   <div className="coachReviewMeta"><div><b>{review.coachName}</b><small>Week of {friendlyDate(review.weekStart)}</small></div><span className="shared">SHARED WITH YOU</span></div>
   <div className="coachReviewRatings compact">{[["Performance",review.performance],["Effort",review.effort],["Attitude",review.attitude],["Teamwork",review.teamwork],["Coachability",review.coachability],["Leadership",review.leadership]].map(([label,value])=><div key={String(label)}><small>{label}</small><b>{value}/5</b></div>)}</div>
   {review.strengths&&<p><b>What stood out:</b> {review.strengths}</p>}
   {review.developmentOpportunity&&<p><b>Development opportunity:</b> {review.developmentOpportunity}</p>}
   {review.leadershipOpportunity&&<p><b>Leadership opportunity:</b> {review.leadershipOpportunity}</p>}
   {review.nextWeekFocus&&<p><b>Next-week focus:</b> {review.nextWeekFocus}</p>}
   {review.coachMessage&&<p className="coachMessageToPlayer"><b>Coach message:</b> {review.coachMessage}</p>}
  </div>)}
 </div>}

 <div className="sectionDivider"><span><i/>Weekly Review</span></div>
 {accountRole==="Player"?(weeklyReviewOpen?<div className="card weeklyReview setupAnchor" id="setup-weekly-review" tabIndex={-1}><div className="sectionHead"><div><h2>My Weekly Review</h2><small>Player-only reflection · Parents and Coaches can see the saved result</small></div><span>Week of {friendlyDate(weekStart)}</span></div><div className="two"><label>Biggest Win<input value={wins} onChange={e=>setWins(e.target.value)} placeholder="What went well?"/></label><label>Main Challenge<input value={challenges} onChange={e=>setChallenges(e.target.value)} placeholder="What held you back?"/></label><label>Next Week Focus<input value={focus} onChange={e=>setFocus(e.target.value)} placeholder="One priority for next week"/></label><label>Week Rating<select value={rating} onChange={e=>setRating(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}/10</option>)}</select></label></div><div className="weeklyReviewActions">{currentReview&&<button onClick={()=>{clearWeeklyReviewFields();setWeeklyReviewOpen(false)}}>Cancel</button>}<button className="primary" onClick={saveReview}>{currentReview?"Update My Weekly Review":"Save My Weekly Review"}</button></div></div>:<div className="card weeklyReviewCollapsed setupAnchor" id="setup-weekly-review" tabIndex={-1}><div><span className="weeklyReviewDoneIcon">✓</span><div><small>{currentReview?"WEEKLY REVIEW COMPLETE":"WEEKLY REVIEW"}</small><h2>{currentReview?`Week of ${friendlyDate(currentReview.weekStart)}`:`Week of ${friendlyDate(weekStart)}`}</h2><p>{currentReview?`${currentReview.rating}/10${currentReview.focus?` · Next focus: ${currentReview.focus}`:""}`:"Ready when you are."}</p></div></div><button className="featureAction" onClick={openWeeklyReview}>{currentReview?"View / Edit Review":"Start Weekly Review"}</button></div>):<div className="card playerOnlyNotice"><span className="tag">PLAYER-ENTERED</span><h2>Weekly Review Results</h2><p>Only the Player can complete or change a weekly review. This view shows the Player's saved reflections to linked Coaches and Admin views.</p>{currentReview?<div className="supportWeeklyReview"><div className="reviewRating">{currentReview.rating}<small>/10</small></div><div><b>Week of {friendlyDate(currentReview.weekStart)}</b><span><strong>Biggest win:</strong> {currentReview.wins||"—"}</span><span><strong>Main challenge:</strong> {currentReview.challenges||"—"}</span><span><strong>Next focus:</strong> {currentReview.focus||"—"}</span></div></div>:<p className="muted">The Player has not completed this week's review yet.</p>}</div>}

 <div className="card"><h2>Recent Weekly Reviews</h2>{weeklyReviews.length===0?<p>No weekly reviews yet.</p>:weeklyReviews.slice(0,5).map(r=><div className="reviewRow" key={r.id}><div className="reviewRating">{r.rating}<small>/10</small></div><div><b>Week of {friendlyDate(r.weekStart)}</b><small>{r.wins?"Win: "+r.wins:""}{r.focus?" · Next: "+r.focus:""}</small></div></div>)}</div>
 </>;
}

const goalTypeLabel=(value:Goal["type"])=>value==="Short-term"?"Short-term (1–4 weeks)":value==="Mid-term"?"Mid-term (1–3 months)":"Long-term (3–12 months)";
const goalTypeWindow=(value:Goal["type"])=>value==="Short-term"?"A small change you can work on now.":value==="Mid-term"?"A larger development target for the next training block.":"A season-level or major development target.";

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
return <><div className="hero"><small>GOALS</small><h1>Goals</h1><p>Turn outcomes into measurable, time-bound development targets.</p></div>
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
 <div className="card setupAnchor createGoalCard" id="setup-goals" tabIndex={-1}>
  <div className="sectionHead"><div><h2>Create Goal</h2><small>Keep it clear, measurable, and tied to a timeframe.</small></div></div>
  <div className="goalQuickGuide">
   <div><span>1</span><b>Choose a timeframe</b><small>Short 1–4 weeks · Mid 1–3 months · Long 3–12 months</small></div>
   <div><span>2</span><b>Make it measurable</b><small>What exactly should improve or be completed?</small></div>
   <div><span>3</span><b>Set the finish line</b><small>Add a target and deadline so progress is easy to review.</small></div>
  </div>
  <div className="goalFormula"><small>SIMPLE FORMULA</small><b>Improve [skill or result] from [current level] to [target] by [date].</b><span>Example: Improve 10-yard sprint from 1.85 sec to 1.78 sec by Sept. 30.</span></div>
  <div className="two">
   <label>Goal name<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Improve 10-yard sprint"/></label>
   <label>Goal type<select value={type} onChange={e=>setType(e.target.value as Goal["type"])}><option value="Short-term">Short-term (1–4 weeks)</option><option value="Mid-term">Mid-term (1–3 months)</option><option value="Long-term">Long-term (3–12 months)</option></select><small className="goalTypeHint">{goalTypeWindow(type)}</small></label>
   <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option>Performance</option><option>Training</option><option>Skill</option><option>Strength</option><option>Speed</option><option>Conditioning</option><option>Competition</option><option>Recovery</option><option>Personal</option></select></label>
   <label>Deadline<input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}/></label>
  </div>
  <label>Target / success criteria<input value={target} onChange={e=>setTarget(e.target.value)} placeholder="e.g. Improve from 1.85 sec to 1.78 sec"/></label>
  <label>Notes<input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What actions will help achieve this goal?"/></label>
  <button className="primary" onClick={add}>Add Goal</button>
 </div>

 <div className="card"><h2>Active Goals</h2>{active.length===0?<p>No active goals.</p>:active.map(g=><div className="goalCard" key={g.id}>
  <div className="row"><div><span className="tag">{g.category||"Performance"}</span><h2>{g.title}</h2><small>{goalTypeLabel(g.type)}{g.deadline?" · Due "+g.deadline:""}{g.target?" · Target: "+g.target:""}</small></div><strong>{g.progress}%</strong></div>
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
   const item:Workout={id:Date.now(),date,name,category:cat,minutes:+minutes,completed:false,sport,intensity,focus:focusNote.trim(),source:"Manual"};
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

 return <><div className="hero phase31Hero"><small>TRAINING SCHEDULE</small><h1>Calendar</h1><p>{profile.name} · {sport} · Schedule, complete, and measure training load in one place.</p></div>

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
 return <div className={"workoutLogCard "+(workout.completed?"done":"")}><div className="workoutLogTop"><div><div className="workoutTagRow"><span className="tag">{workout.category}</span>{workout.source&&<span className="tag workoutSourceTag">{workout.source}</span>}</div><h2>{workout.name}</h2><small>{workout.date} · {workout.minutes} min · {workout.intensity||"Moderate"}{workout.environment?" · "+workout.environment:""}{workout.assignedByRole?` · ${workout.assignedByRole==="Coach"||workout.assignedByRole==="Admin"?"Assigned":"Selected"} by ${workout.assignedByRole}`:""}{workout.focus?" · "+workout.focus:""}</small></div>{workout.completed&&<div className="loadBadge"><b>{load}</b><small>load</small></div>}</div>
 {workout.supportVideos?.map((video,index)=><VerifiedSupportVideoCard video={video} compact key={`${workout.id}-support-${index}`}/>)}
 {workout.referenceVideos?.map((video,index)=><div className="scheduledRoutineReference" key={`${workout.id}-ref-${index}`}><div><small>MATCHING VIDEO {index+1}{video.section?` · ${video.section}`:""}</small><b>{video.title}</b><span>{video.durationMinutes?`${video.durationMinutes} min · `:""}{video.source}</span></div><a href={video.url} target="_blank" rel="noreferrer">▶ Watch Video</a></div>)}
 {workout.exercises?.length?<details className="scheduledWorkoutExercises"><summary>View {workout.exercises.length} exercise{workout.exercises.length===1?"":"s"}</summary><div>{workout.exercises.map((exercise,i)=><div className="scheduledExerciseRow" key={`${workout.id}-exercise-${i}`}><span className={"exercisePhase "+exercise.phase.toLowerCase().replace("-","")}>{exercise.phase}</span><div><b>{exercise.name}</b><small>{exercise.sets} sets · {exercise.reps} · Rest {exercise.rest}{exercise.notes?` · ${exercise.notes}`:""}</small>{exercise.instructions&&<p>{exercise.instructions}</p>}<DetailedExerciseGuide exercise={exercise} sport={workout.sport} position={workout.focus||""} age={0}/></div></div>)}</div></details>:null}
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
   const n=Number(value),date=today();
   setResults((r:Result[])=>{
    if(r.some(x=>x.sport===sport&&x.testId===t.id&&x.date===date&&x.value===n))return r;
    return [{id:Date.now(),testId:t.id,name:t.name,category,unit,value:n,date,sport},...r];
   });
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
return <><div className="hero"><small>PERFORMANCE TESTING</small><h1>Performance Testing</h1><p>{sport} · Standardized testing, targets, PRs, and retest planning.</p></div>
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

function Analytics({sport,profile,results,goals,workouts,readiness,competitions,accountRole="Parent",setTab,setDev,setGoals,setWorkouts}:{sport:Sport;profile:Profile;results:Result[];goals:Goal[];workouts:Workout[];readiness:ReadinessLog[];competitions:CompetitionLog[];accountRole?:AccountRole;setTab?:React.Dispatch<React.SetStateAction<Tab>>;setDev?:React.Dispatch<React.SetStateAction<DevelopmentItem[]>>;setGoals?:React.Dispatch<React.SetStateAction<Goal[]>>;setWorkouts?:React.Dispatch<React.SetStateAction<Workout[]>>}){
 const [range,setRange]=useState("All"),[categoryFilter,setCategoryFilter]=useState("All");
 const [intelligenceMessage,setIntelligenceMessage]=useState("");
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
 const readinessScore=recentReadiness.length?Math.round(recentReadiness.reduce((a,r)=>a+readinessScoreV2(r,Number(profile.age||0)),0)/recentReadiness.length):0;
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
 const scoreAvailability:Record<string,boolean>={
  Testing:summaries.length>0,
  Training:sportWorkouts.length>0,
  Goals:goals.length>0,
  Readiness:recentReadiness.length>0,
  Competition:sportComps.length>0
 };
 const dataCoverage=Object.values(scoreAvailability).filter(Boolean).length;
 const instrumentStatus=(value:number,available=true)=>!available?"No Data":value>=80?"Strong":value>=60?"Building":value>=40?"Watch":"Attention";
 const instrumentMeaning:Record<string,string>={
  Testing:"Testing activity plus evidence of positive repeated-test improvement.",
  Training:"Completed workouts compared with this athlete's planned workouts.",
  Goals:"Average progress across the athlete's saved goals.",
  Readiness:"Average of the most recent seven Player Daily Check-In readiness scores.",
  Competition:"Average saved competition performance rating, converted to a 0–100 scale."
 };
 const overallStatus=overallScore>=80?"Strong":overallScore>=60?"Building":overallScore>=40?"Watch":"Attention";
 const seasonMetrics:SeasonMetric[]=[
  {label:"Goal Progress",value:goalProgress,display:`${goalProgress}%`},
  {label:"Training Consistency",value:consistency,display:`${consistency}%`},
  {label:"Readiness",value:readinessScore||0,display:readinessScore?`${readinessScore}`:"—"},
  {label:"Competition",value:competitionScore,display:sportComps.length?`${competitionScore}`:"—"}
 ];
 const seasonMomentum=Math.round(seasonMetrics.reduce((a,m)=>a+m.value,0)/seasonMetrics.length);
 const canCreateActions=accountRole!=="Parent"&&Boolean(setDev&&setGoals&&setWorkouts);
 const prioritySignal=declining[0]
  ?{title:declining[0].g.name,category:"Testing",why:`${declining[0].g.name} is ${Math.abs(declining[0].imp)}% below its filtered baseline.`,action:`Use a focused ${declining[0].g.name.toLowerCase()} development block, keep technique quality high, then retest consistently.`,testId:declining[0].g.testId}
  :readinessScore>0&&readinessScore<60
  ?{title:"Recovery / Habits",category:"Recovery",why:`7-day readiness is ${readinessScore}/100.`,action:"Protect sleep, recovery routines, and training quality before adding optional volume.",testId:""}
  :goals.length&&goalProgress<50
  ?{title:"Goal Execution",category:"Goals",why:`Average goal progress is ${goalProgress}%.`,action:"Choose one measurable short-term target and connect the next few training sessions to it.",testId:""}
  :improving[0]
  ?{title:improving[0].g.name,category:"Testing",why:`${improving[0].g.name} is improving by ${improving[0].imp}% from baseline.`,action:"Keep the methods that are working and schedule a consistent retest.",testId:improving[0].g.testId}
  :{title:"Build a Baseline",category:"Development",why:"There is not enough repeated data yet to rank a specific performance priority.",action:"Keep logging training, readiness, and repeated tests so the development engine has stronger evidence.",testId:""};

 const createDevelopmentPriority=(signal=prioritySignal)=>{
  if(!setDev)return;
  const item:DevelopmentItem={id:Date.now(),title:signal.title,category:signal.category,target:signal.action,dueDate:"",status:"Not Started",priority:signal.category==="Recovery"?"High":"Medium",progress:0,notes:`Created from Analytics: ${signal.why}`};
  setDev(x=>x.some(d=>d.status!=="Complete"&&d.title===item.title&&d.notes===item.notes)?x:[item,...x]);
  setIntelligenceMessage(`Development priority ready: ${signal.title}`);
 };
 const createIntelligenceGoal=(signal=prioritySignal)=>{
  if(!setGoals)return;
  const d=new Date();d.setDate(d.getDate()+28);
  const deadline=localDate(d);
  const item:Goal={id:Date.now(),title:`Improve ${signal.title}`,progress:0,type:"Short-term",category:signal.category,deadline,target:signal.action,linkedTestId:signal.testId||undefined,status:"Active",notes:`Created from Analytics: ${signal.why}`};
  setGoals(x=>x.some(g=>(g.status||"Active")!=="Complete"&&g.title===item.title)?x:[item,...x]);
  setIntelligenceMessage(`Short-term goal ready: Improve ${signal.title}`);
 };
 const addIntelligenceWorkout=(signal=prioritySignal)=>{
  if(!setWorkouts)return;
  const d=new Date();d.setDate(d.getDate()+1);
  const item:Workout={id:Date.now(),date:localDate(d),name:`Development Focus · ${signal.title}`,category:"Development",minutes:30,completed:false,sport,intensity:"Moderate",notes:signal.action,focus:signal.title,source:"Manual",assignedByRole:accountRole};
  setWorkouts(x=>[item,...x]);
  setIntelligenceMessage(`Training focus added for ${friendlyDate(item.date)}.`);
 };


 return <><div className="hero analyticsCockpitHero">
  <div><small>ATHLETE PERFORMANCE · PRIMARY DISPLAY</small><h1>Analytics Cockpit</h1><p>{profile.name} · {sport}{profile.position?` · ${profile.position}`:""} · One shared dashboard for Player, Parent, and Coach.</p></div>
  <div className="cockpitLiveBadge"><i/><span><small>DATA SOURCE</small><b>Shared athlete profile</b></span></div>
 </div>

 <div className="sharedAnalyticsIdentity cockpitIdentityStrip">
  <div><small>ATHLETE</small><b>{profile.name}</b></div>
  <div><small>SPORT</small><b>{sport}</b></div>
  <div><small>POSITION</small><b>{profile.position||"Not set"}</b></div>
  <div><small>VIEW CONSISTENCY</small><b>Player = Parent = Coach</b></div>
 </div>

 <section className="cockpitPrimaryPanel" aria-label="Primary analytics instruments">
  <div className="cockpitOverallInstrument">
   <div className="cockpitScoreRing" style={{background:`conic-gradient(var(--forest-light) 0 ${overallScore*3.6}deg,rgba(184,191,188,.09) ${overallScore*3.6}deg 360deg)`}}>
    <div><small>PERFORMANCE</small><strong>{overallScore}</strong><span>/100</span></div>
   </div>
   <div className="cockpitOverallReadout">
    <small>SHARED PERFORMANCE SCORE</small>
    <h2>{overallStatus}</h2>
    <p>Equal-weight average of the five primary instruments below.</p>
    <div className="cockpitCoverage"><b>{dataCoverage}/5</b><span>data areas active</span></div>
   </div>
  </div>

  <div className="cockpitInstrumentGrid">
   {scorecard.map(x=>{const available=scoreAvailability[x.label];const status=instrumentStatus(x.value,available);return <div className={"cockpitInstrument "+status.replaceAll(" ","-").toLowerCase()} key={x.label}>
    <div className="cockpitInstrumentTop"><small>{x.label.toUpperCase()}</small><span className="cockpitStatusLamp"><i/><b>{status}</b></span></div>
    <div className="cockpitInstrumentValue"><strong>{available?x.value:"—"}</strong><span>{available?"/100":"NO DATA"}</span></div>
    <div className="cockpitGauge"><i style={{width:`${available?x.value:0}%`}}/></div>
    <p>{instrumentMeaning[x.label]}</p>
   </div>})}
  </div>

  <details className="cockpitFormula">
   <summary>How is the Performance Score calculated?</summary>
   <div><p><b>Testing + Training + Goals + Readiness + Competition</b>, each weighted equally at 20%.</p><p>When a category has no data yet, its current score is 0. The <b>Data Coverage</b> indicator shows how complete the dashboard is so the score is not viewed without context.</p></div>
  </details>
 </section>

 <section className="cockpitQuickScan" aria-label="Quick scan">
  <div className="cockpitSectionLabel"><small>QUICK SCAN</small><b>What matters right now</b><span>Read left to right like primary flight instruments.</span></div>
  <div className="cockpitQuickGrid">
   <div className="cockpitQuickCard positive"><small>TOP IMPROVEMENT</small>{improving[0]?<><strong>+{improving[0].imp}%</strong><b>{improving[0].g.name}</b><span>{improving[0].baseline} → {improving[0].current} {improving[0].g.unit}</span></>:<><strong>—</strong><b>Waiting for repeat tests</b><span>Log the same test again to establish a trend.</span></>}</div>
   <div className="cockpitQuickCard attention"><small>NEEDS ATTENTION</small>{declining[0]?<><strong>{declining[0].imp}%</strong><b>{declining[0].g.name}</b><span>{declining[0].baseline} → {declining[0].current} {declining[0].g.unit}</span></>:<><strong>✓</strong><b>No declining test trend</b><span>No repeated-test decline is currently detected.</span></>}</div>
   <div className="cockpitQuickCard"><small>7-DAY READINESS</small><strong>{readinessScore||"—"}</strong><b>{instrumentStatus(readinessScore||0,recentReadiness.length>0)}</b><span>{recentReadiness.length?`${recentReadiness.length} recent check-in${recentReadiness.length===1?"":"s"}`:"No check-ins yet"}</span></div>
   <div className="cockpitQuickCard"><small>SEASON MOMENTUM</small><strong>{seasonMomentum}</strong><b>{seasonMomentum>=75?"Strong Momentum":seasonMomentum>=55?"Building":"Foundation"}</b><span>Goals · Training · Readiness · Competition</span></div>
  </div>
 </section>

 <section className="developmentIntelligenceCard">
  <div className="developmentIntelHeader"><div><small>DEVELOPMENT INTELLIGENCE LOOP</small><h2>Data → Meaning → Action</h2><p>The app identifies the clearest current signal, explains why it matters, and connects it to the development plan.</p></div><span className="tag">{prioritySignal.category}</span></div>
  <div className="developmentIntelSignal">
   <div><small>CURRENT SIGNAL</small><strong>{prioritySignal.title}</strong></div>
   <div><small>WHY</small><p>{prioritySignal.why}</p></div>
   <div><small>RECOMMENDED NEXT STEP</small><p>{prioritySignal.action}</p></div>
  </div>
  {canCreateActions?<div className="developmentIntelActions">
   <button onClick={()=>{createDevelopmentPriority();setTab?.("Development")}}>Create Development Priority</button>
   <button onClick={()=>{createIntelligenceGoal();setTab?.("Goals")}}>Create Short-Term Goal</button>
   <button className="featureAction" onClick={()=>{addIntelligenceWorkout();setTab?.("Calendar")}}>Add Training Focus</button>
  </div>:<div className="developmentIntelReadOnly"><b>Read-only support view</b><span>Parents see the same signal and recommendation without changing the Player/Coach development plan.</span></div>}
  {intelligenceMessage&&<div className="developmentIntelMessage">{intelligenceMessage}</div>}
 </section>

 <section className="cockpitSecondaryPanel">
  <div className="cockpitSectionLabel"><small>SECONDARY INSTRUMENTS</small><b>Season and workload picture</b><span>Supporting information behind the primary display.</span></div>

  <div className="card seasonProgress cockpitSeasonCard"><div className="sectionHead"><div><h2>Season Progress</h2><small>Four key systems at a glance</small></div><span className="tag">{seasonMomentum>=75?"Strong Momentum":seasonMomentum>=55?"Building":"Foundation"}</span></div><div className="seasonMetricGrid cockpitSeasonMetrics">{seasonMetrics.map(m=><div key={m.label}><div className="row"><small>{m.label}</small><b>{m.display}</b></div><div className="progress"><i style={{width:`${Math.max(0,Math.min(100,m.value))}%`}}/></div></div>)}</div></div>

  <div className="analyticsToolbar cockpitToolbar">
   <div><small>DISPLAY RANGE</small><div className="filters">{["All","30 Days","90 Days","1 Year"].map(x=><button className={range===x?"sel":""} key={x} onClick={()=>setRange(x)}>{x}</button>)}</div></div>
   <label><small>TEST CATEGORY</small><select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>{categoriesAvailable.map(x=><option key={x}>{x}</option>)}</select></label>
  </div>

  <div className="cockpitDataStrip">
   <div><small>TESTS TRACKED</small><b>{summaries.length}</b><span>current filter</span></div>
   <div><small>AVG POSITIVE TREND</small><b>{avgImprovement?`+${avgImprovement}%`:"—"}</b><span>improving repeated tests</span></div>
   <div><small>TRAINING CONSISTENCY</small><b>{consistency}%</b><span>{completed}/{sportWorkouts.length} complete</span></div>
   <div><small>GOAL PROGRESS</small><b>{goalProgress}%</b><span>{goals.length} goal{goals.length===1?"":"s"} tracked</span></div>
  </div>
 </section>

 <section className="cockpitTrendSection">
  <div className="card cockpitTrendCard"><div className="sectionHead"><div><small>DETAILED INSTRUMENT HISTORY</small><h2>Performance Trends</h2><p>Baseline → current → best. Positive percentages mean improvement.</p></div><button onClick={()=>exportResults(rows)}>Download Test Results</button></div>
  {summaries.length===0?<div className="cockpitEmpty"><b>No matching test results</b><span>Change the range/category filters or log a test result.</span></div>:summaries.map(({g,r,def,baseline,current,best,imp})=><div className="trend cockpitTrend" key={g.testId}>
    <div className="cockpitTrendHeader"><div><small>{g.category.toUpperCase()} · {r.length} RESULT{r.length===1?"":"S"}</small><h3>{g.name}</h3></div><strong className={imp>=0?"good":"bad"}>{r.length>1?(imp>=0?"+":"")+imp+"%":"NEW"}</strong></div>
    <TrendChart values={r.map(x=>x.value)} lower={def.lowerBetter}/>
    <div className="trendAxis"><span>Baseline · {r[0]?.date}</span><span>Current · {r[r.length-1]?.date}</span></div>
    <div className="analyticsMetrics cockpitMetricReadouts intelligenceBenchmarkReadouts">
     <span><small>BASELINE</small><b>{baseline} {g.unit}</b></span>
     <span><small>CURRENT</small><b>{current} {g.unit}</b></span>
     <span><small>PERSONAL BEST</small><b>{best} {g.unit}</b></span>
     <span><small>FROM BASELINE</small><b className={imp>=0?"good":"bad"}>{r.length>1?`${imp>=0?"+":""}${imp}%`:"—"}</b></span>
     <span><small>DISTANCE FROM PB</small><b>{best!==0?`${Math.round((def.lowerBetter?Math.max(0,(current-best)/Math.abs(best)*100):Math.max(0,(best-current)/Math.abs(best)*100))*10)/10}%`:"—"}</b></span>
    </div>
  </div>)}</div>
 </section>

 <CompareTests sport={sport} results={rows}/>
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
 const blob=new Blob([header+"\n"+body],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="test-results.csv";a.click();URL.revokeObjectURL(url);
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

 return <><div className="hero"><small>DEVELOPMENT</small><h1>Development</h1><p>{sport} · Prioritized objectives, measurable progress, achievements, and training program.</p></div>

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
 Soccer:{speed:["10-meter acceleration","Flying sprint","Change-of-direction sprint"],strength:["Single-leg strength","Hamstring strength","Core stability"],skill:["First-touch drill","Passing on the move","Dribbling change of direction"],conditioning:["Repeated sprint intervals","Aerobic tempo work","Mobility recovery"]},
 "Figure Skating":{speed:["Quick-step acceleration","Lateral quickness","Rotation-speed drill"],strength:["Single-leg strength","Landing strength","Core stability"],skill:["Edge-control practice","Jump technique","Spin and balance practice"],conditioning:["Skating intervals","Jump endurance","Mobility recovery"]}
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
 if(n.includes("goalie")||n.includes("goalkeeper"))return "Start in the sport-specific ready position, make the listed footwork movement under control, recover to a balanced set position, then reset before the next rep.";
 if(n.includes("backward")&&n.includes("forward"))return "Move backward in a low athletic position, open the hips cleanly, then accelerate forward without standing up during the transition.";
 if(n.includes("crossover"))return "Push laterally, cross the trail leg only when the drill calls for it, stay balanced through the hips, then accelerate out of the pattern.";
 if(n.includes("pocket"))return "Keep a balanced throwing base, use short efficient steps through the pocket pattern, then reset the feet before the escape or throw position.";
 if(n.includes("faceoff"))return "Start from the normal faceoff-ready stance, react to the cue, exit with the first two steps low and powerful, then accelerate into support space.";
 if(n.includes("close-down")||n.includes("close down"))return "Accelerate toward the attacker under control, shorten the final steps, stay balanced, then turn and recover without crossing the feet too early.";
 if(n.includes("arc-step")||n.includes("arc step"))return "Stay in a balanced goalie stance and move along the arc with short controlled steps, keeping the chest square before resetting.";
 if(n.includes("jump-entry")||n.includes("jump entry"))return "Rehearse the exact entry steps at low speed, keep the takeoff alignment controlled, then stick the landing before increasing speed or rotation.";
 if(n.includes("level-change")||n.includes("level change"))return "Lower your level by bending the knees and hips while keeping your chest controlled, then return to stance without bringing the feet together.";
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

type DemoResource={label:string;url:string;source:string};

function curatedExerciseResource(name:string,sport:Sport,position:string):DemoResource|null{
 const n=name.toLowerCase();
 const pos=position.toLowerCase();
 // General exercises only link when an exact demonstration has been curated.
 if(n.includes("trap-bar deadlift")||n.includes("trap bar deadlift"))return {label:"Trap-bar deadlift demo",url:"https://www.youtube.com/watch?v=qxGEIr9N_Xo",source:"Dan John"};
 if(n.includes("copenhagen plank"))return {label:"Copenhagen plank demo",url:"https://www.youtube.com/watch?v=aDsaGBnvDQo",source:"E3 Rehab"};
 if(n.includes("nordic hamstring"))return {label:"Nordic hamstring demo",url:"https://www.youtube.com/watch?v=om97r0ZmO7g",source:"Exercise demonstration"};
 if((n.includes("medicine-ball")||n.includes("medicine ball"))&&n.includes("rotat"))return {label:"Rotational medicine-ball demo",url:"https://www.youtube.com/watch?v=p0qsNJKmzUE",source:"eHowSports"};

 // Sport / position resources are deliberately specific rather than generic YouTube searches.
 if(sport==="Wrestling"&&(n.includes("penetration")||n.includes("shot-entry")||n.includes("shot entry")))return {label:"Penetration-step curriculum",url:"https://www.usawmembership.com/usa_wrestling_core_curriculum/1",source:"USA Wrestling"};
 if(sport==="Basketball"&&(n.includes("lateral")||n.includes("closeout")||n.includes("change-of-direction")||n.includes("first-step")))return {label:"Basketball lateral quickness demo",url:"https://www.youtube.com/watch?v=Lq8Ccr6yv_4",source:"Breakthrough Basketball"};
 if(sport==="Baseball"&&(n.includes("fielding")||n.includes("drop-step")||n.includes("crossover")))return {label:"Baseball infield footwork demo",url:"https://www.youtube.com/watch?v=BYNm-AU-eBc",source:"LakePoint Sports"};
 if(sport==="Football"&&(pos.includes("receiver")||pos==="wr")&&(n.includes("footwork")||n.includes("route")||n.includes("release")))return {label:"Wide receiver footwork demo",url:"https://www.youtube.com/watch?v=csQiZnw99XU",source:"D3 WRU"};
 if(sport==="Soccer"&&pos.includes("goal")&&(n.includes("goalkeeper")||n.includes("keeper")||n.includes("lateral")||n.includes("footwork")))return {label:"Goalkeeper footwork demo",url:"https://www.youtube.com/watch?v=SEC5NAqzK3g",source:"MOJO"};
 if(sport==="Soccer"&&(n.includes("acceleration")||n.includes("sprint")))return {label:"Soccer acceleration drill",url:"https://www.youtube.com/watch?v=THfJ5TK-j-E",source:"FourFourTwo"};
 if(sport==="Figure Skating"&&(n.includes("jump")||n.includes("rotation")))return {label:"Off-ice jump rotation demo",url:"https://www.youtube.com/watch?v=J38PNEea82w",source:"Coach Mary Figure Skating"};
 if(sport==="Lacrosse"&&pos.includes("goal")&&(n.includes("goalie")||n.includes("reaction")||n.includes("footwork")))return {label:"Goalie drill resource",url:"https://www.usalacrosse.com/magazine/how-play-galloway",source:"USA Lacrosse"};
 if(sport==="Lacrosse"&&(pos.includes("defense")||n.includes("defensive"))&&(n.includes("footwork")||n.includes("approach")||n.includes("close")))return {label:"Defensive footwork resource",url:"https://www.usalacrosse.com/magazine/5-star-footwork-5-star-keys-wpll-commands-julia-braig",source:"USA Lacrosse"};
 if(sport==="Ice Hockey"){
  if(pos.includes("goal")&&(n.includes("goalie")||n.includes("crease")||n.includes("lateral push")||n.includes("post-to")||n.includes("ready-stance")))return {label:"Goaltender off-ice workout",url:"https://www.hockeycanada.ca/en-ca/videos?title=oly-w-campbells-favourite-workout",source:"Hockey Canada"};
  if(pos.includes("defense")&&(n.includes("backward")||n.includes("gap-control")||n.includes("crossover")||n.includes("retrieval")||n.includes("defense shift")))return {label:"Defenceman off-ice workout",url:"https://www.hockeycanada.ca/en-ca/videos?title=oly-w-thompsons-favourite-workout",source:"Hockey Canada"};
  if((pos.includes("wing")||pos.includes("center"))&&(n.includes("crossover")||n.includes("faceoff")||n.includes("puck")||n.includes("forecheck")||n.includes("support")||n.includes("shift interval")))return {label:"Forward off-ice workout",url:"https://www.hockeycanada.ca/en-ca/videos?title=oly-w-clarks-favourite-workout",source:"Hockey Canada"};
  if(n.includes("hockey")&&(n.includes("mobility")||n.includes("movement prep")))return {label:"Hockey off-ice training resource",url:"https://www.hockeycanada.ca/en-ca/hockey-programs/players/essentials/positions-skills/off-ice",source:"Hockey Canada"};
 }
 return null;
}

function ExerciseStepResources({steps,sport,position}:{steps:ExerciseStepGuide[];sport:Sport;position:string}){
 if(!steps.length)return null;
 return <div className="exerciseStepGuides">
  <div className="exerciseStepTitle"><b>Do these movements in order</b><small>Written cues are always shown. A demo link appears only when a specific curated resource is available.</small></div>
  {steps.map((step,i)=>{
   const resource=curatedExerciseResource(step.name,sport,position);
   return <div className="exerciseStepCard" key={`${step.name}-${i}`}>
    <div className="exerciseStepNumber">{i+1}</div>
    <div className="exerciseStepBody"><div className="exerciseStepHead"><b>{step.name}</b><span>{step.dose}</span></div><p>{step.instruction}</p>
     {resource&&<div className="exerciseStepLinks"><a href={resource.url} target="_blank" rel="noreferrer">▶ Verified Demo · {resource.source}</a></div>}
    </div>
   </div>;
  })}
 </div>;
}


type DetailedExerciseGuideData={setup:string;steps:string[];cues:string[];avoid:string[];safety:string};

function detailedExerciseGuide(name:string,sport:Sport,position:string,age:number,provided?:string):DetailedExerciseGuideData{
 const n=name.toLowerCase();
 const youth=age>0&&age<=13;
 const base=(setup:string,steps:string[],cues:string[],avoid:string[],safety?:string):DetailedExerciseGuideData=>({
  setup,steps,cues,avoid,
  safety:safety||(youth?"Use bodyweight or light resistance first. Stop the set when technique breaks down; use adult/coach supervision.":"Use an appropriate load and stop before technique deteriorates.")
 });

 if(n.includes("supine hip internal rotation"))return base("Lie on your back with knees bent and feet slightly wider than hips.",["Brace lightly so the pelvis stays still.","Let one knee travel inward only until a gentle hip stretch is felt.","Hold the prescribed time without forcing the range.","Return to center and alternate sides."],["Pelvis stays heavy","Move slowly","Gentle stretch only"],["Forcing the knee down","Twisting the pelvis","Hip or knee pain"],"Do not force mobility. Stop with pinching, joint pain, or discomfort.");
 if(n.includes("hamstring")&&n.includes("strap"))return base("Lie on your back with a strap around one foot; keep the opposite leg relaxed.",["Raise the strapped leg until a gentle hamstring stretch appears.","Keep the pelvis level and knee comfortably straight.","Move through the three prescribed leg angles without twisting.","Hold each position, lower, then switch sides."],["Relax shoulders","Hips stay square","Guide—don't pull"],["Yanking the strap","Pelvis lifting","Stretching into pain"],"Use only a light-to-medium stretch.");
 if(n.includes("hip flexor")&&n.includes("wall"))return base("Use padding. Rear knee is near a wall, rear foot up the wall, opposite foot in front.",["Squeeze the glute on the kneeling side.","Keep ribs stacked over pelvis.","Shift forward slightly until the front hip/thigh stretches.","Breathe normally, then switch sides."],["Tall torso","Glute squeezed","Small controlled shift"],["Low-back arch","Rear knee too close","Forcing range"],"Move the knee farther from the wall to make this easier.");
 if(n.includes("half-kneeling hip flexor"))return base("Kneel on one knee with the opposite foot flat in front.",["Squeeze the rear-side glute.","Keep torso tall and ribs down.","Shift the body forward a few centimeters.","Hold the gentle front-of-hip stretch and switch sides."],["Glute on","Ribs stacked","Small range"],["Arching low back","Leaning far forward","Painful stretch"]);
 if(n.includes("groin"))return base("From hands and knees, extend one leg straight to the side with that foot flat.",["Keep the spine long.","Sit hips backward slowly.","Stop at a gentle inner-thigh stretch.","Return under control."],["Neutral back","Foot planted","Slow range"],["Rounding back","Knee cave","Forcing depth"]);
 if(n.includes("kneeling lat"))return base("Kneel in front of a bench/chair with hands or elbows supported.",["Brace lightly.","Sit hips back as chest lowers.","Keep neck relaxed and ribs controlled.","Hold a comfortable upper-back/lat stretch."],["Long spine","Relaxed neck","Breathe"],["Shoulder pinching","Low-back arch","Forcing elbows down"]);
 if(n.includes("ankle dorsiflexion"))return base("Face a wall in split stance with the working foot flat.",["Keep heel and big-toe base down.","Drive knee toward wall over middle toes.","Pause at the furthest pain-free point.","Return slowly."],["Heel down","Knee tracks toes","Arch controlled"],["Heel lifting","Knee collapsing inward","Bouncing"]);
 if(n.includes("lateral push")||n.includes("lateral reaction")||n.includes("post-to-angle"))return base(`Mark a short dryland lane. Start in a balanced ${position||"sport"} ready stance.`,["Lower into an athletic stance.","Push the floor away with the outside leg to move laterally.","Land over the new support foot with knee and hip aligned.","Stop, regain the set position, and reset before the next cue."],["Push—don't reach","Quiet landing","Eyes up","Reset every rep"],["Feet clicking together","Knee cave","Stiff landing","Rushing the reset"],youth?"Keep distance short and technique-first on a dry, non-slip surface with supervision.":"Use a dry, non-slip surface and stop when control declines.");
 if(n.includes("lateral bound")||n.includes("skater bound"))return base("Stand on one leg with clear space to jump sideways.",["Load hip and knee slightly.","Push sideways to the opposite leg.","Land softly with hip, knee, and ankle aligned.","Hold 1–2 seconds before the next rep."],["Land quietly","Knee follows toes","Own the landing"],["Immediate rebound","Knee cave","Chasing distance"],youth?"Start with small bounds. Increase distance only after every landing is controlled.":"Stop when landing quality drops.");
 if(n.includes("reverse lunge"))return base("Stand tall with clear space behind you.",["Step one foot backward.","Lower both knees under control while front foot stays flat.","Keep front knee tracking over toes.","Push through the front foot to stand."],["Front foot planted","Tall torso","Smooth descent"],["Knee cave","Rear knee slamming","Pushing mainly from back foot"]);
 if(n.includes("split squat"))return base("Take a long split stance; use a low stable bench only if rear foot is elevated.",["Set pressure through the front foot.","Lower rear knee toward floor while front knee stays aligned.","Pause briefly near the bottom.","Drive through front foot to stand."],["Stable front foot","Knee tracks toes","Hips square"],["Wobbling","Knee cave","Too much rear-leg push"]);
 if(n.includes("romanian deadlift"))return base("Stand tall with light resistance if prescribed.",["Soften the knees.","Push hips backward with a long spine.","Stop when hamstrings are loaded without back rounding.","Drive the floor away and squeeze glutes to stand."],["Hips back","Weight close","Long spine"],["Rounding","Squatting","Chasing depth"]);
 if(n.includes("squat"))return base("Stand in a comfortable athletic stance with the whole foot on the floor.",["Brace lightly.","Sit hips down and slightly back while knees track over toes.","Descend only while posture and foot pressure stay controlled.","Push the floor away to stand."],["Tripod foot","Knees follow toes","Chest/pelvis together"],["Heels lifting","Knee cave","Dropping too fast"]);
 if(n.includes("push-up"))return base("Hands slightly wider than shoulders; use knees or an elevated surface if needed.",["Make a straight line head-to-hips.","Lower chest between hands with elbows angled slightly back.","Keep trunk stiff.","Push the floor away to full arm extension."],["Body moves together","Hands grip floor","Controlled elbows"],["Hips sagging","Head reaching","Elbows flaring"]);
 if(n.includes("side plank")||n.includes("copenhagen"))return base("Lie on your side with elbow under shoulder; start with bent-knee variation.",["Stack shoulders and hips.","Lift hips into a straight line.","Brace lightly and breathe.","Hold only while alignment stays clean."],["Elbow under shoulder","Hips tall","Breathe"],["Rolling back","Shrugging","Holding after posture fails"],youth?"Use a short-lever/bent-knee version unless a coach confirms the harder version is controlled.":"Choose the variation that stays pain-free and aligned.");
 if(n.includes("pallof")||n.includes("anti-rotation"))return base("Anchor a light band at chest height and stand sideways to it.",["Set an athletic stance.","Press hands straight away from chest.","Resist rotation through shoulders and hips.","Pause, return, repeat."],["Ribs over hips","Hips square","Slow press"],["Rotating","Leaning","Band too heavy"]);
 if(n.includes("acceleration")||n.includes("sprint"))return base("Mark the exact sprint distance on a dry, clear surface.",["Start in the prescribed stance.","Push the ground backward with short powerful first steps.","Let stride length build naturally.","Sprint through the finish, then use full rest."],["Push, don't reach","Strong arm drive","Full recovery"],["Standing tall too early","Overstriding","Turning speed into conditioning"],youth?"Keep sprints short and fully rested. Stop if mechanics become sloppy.":"Stop speed work when quality clearly drops.");
 if(n.includes("reaction")||n.includes("decision"))return base(`Use a partner, coach, colored cone, ball, or verbal cue relevant to ${sport} ${position}.`,["Begin balanced without knowing the direction.","Wait for the cue.","Make the first movement quickly but under control.","Finish, regain balance, fully reset."],["React after cue","Clean first step","Eyes engaged"],["Guessing","Unplanned foot crossing","Adding speed too early"]);
 if(n.includes("footwork")||n.includes("crossover")||n.includes("shuffle"))return base(`Mark a small dryland pattern representing ${sport} ${position} movement.`,["Start in a position-ready stance.","Walk through the pattern once.","Increase speed while feet stay under the body.","Finish balanced before resetting."],["Quick feet","Eyes up","Balanced direction change"],["Feet tangling","Standing upright","Speed destroying pattern"]);
 if(n.includes("hip bridge"))return base("Lie on your back with the working foot planted.",["Brace lightly.","Drive through the planted foot and squeeze the glute.","Raise hips without arching the low back.","Pause, then lower slowly."],["Glute does work","Pelvis level","Slow lowering"],["Pushing through toes","Back arch","Pelvis rotation"]);
 if(n.includes("row"))return base("Use a light band/cable or supported row and keep shoulders away from ears.",["Start with arm long.","Pull hand toward lower ribs.","Pause and squeeze shoulder blade gently.","Return slowly without rounding."],["Elbow toward back pocket","Neck relaxed","Slow return"],["Shrugging","Jerking","Trunk twisting"]);

 const quick=provided||simpleExerciseInstruction(name);
 return base(`Set up the space and equipment for “${name}”. Rehearse it slowly once before the working set.`,[`Start from a stable position appropriate to ${sport} ${position}.`,quick,"Reset between repetitions so each rep starts correctly.","Increase speed or resistance only while technique remains clean."],["Controlled start","Clean rep before speed","Finish balanced"],["Rushing setup","Too much load/speed","Continuing after form breaks"]);
}

function DetailedExerciseGuide({exercise,sport,position,age}:{exercise:ProgramExercise;sport:Sport;position:string;age:number}){
 const guide=detailedExerciseGuide(exercise.name,sport,position,age,exercise.instructions);
 return <details className="detailedExerciseGuide">
  <summary><span>How to do this exercise</span><small>Setup · steps · cues · mistakes</small></summary>
  <div className="exerciseGuideBody">
   <div><small>SETUP</small><p>{guide.setup}</p></div>
   <div className="exerciseGuideSteps"><small>STEP BY STEP</small><ol>{guide.steps.map((step,i)=><li key={i}>{step}</li>)}</ol></div>
   <div className="exerciseGuideColumns"><div><small>KEY CUES</small>{guide.cues.map((cue,i)=><span key={i}>✓ {cue}</span>)}</div><div><small>AVOID</small>{guide.avoid.map((mistake,i)=><span key={i}>× {mistake}</span>)}</div></div>
   <div className="exerciseGuideSafety"><small>AGE / SAFETY</small><p>{guide.safety}</p></div>
  </div>
 </details>;
}

function VerifiedSupportVideoCard({video,compact=false}:{video:RoutineReference;compact?:boolean}){
 return <div className={"verifiedSupportVideo "+(compact?"compact":"")}>
  {video.thumbnailUrl&&<a className="verifiedVideoThumb" href={video.url} target="_blank" rel="noreferrer"><img src={video.thumbnailUrl} alt={`${video.title} video reference`}/><span>▶</span></a>}
  <div className="verifiedVideoBody"><small>VERIFIED EXERCISE-BLOCK VIDEO · {video.section||"REFERENCE"}</small><b>{video.title}</b><p>{video.matchNote}</p><div className="verifiedVideoMeta"><span>{video.source}</span>{video.durationLabel&&<span>{video.durationLabel}</span>}</div><a href={video.url} target="_blank" rel="noreferrer">Watch matching video →</a></div>
 </div>;
}

function ExerciseResourceLinks({name,sport,position}:{name:string;sport:Sport;position:string}){
 const resource=curatedExerciseResource(name,sport,position);
 if(!resource)return <div className="exerciseResourceNote">Written coaching cues only · no verified demo linked for this exact exercise.</div>;
 return <div className="exerciseResources">
  <a href={resource.url} target="_blank" rel="noreferrer">▶ Verified Demo · {resource.source}</a>
 </div>;
}


type PositionTrainingProfile={
 role:string;
 priorities:string[];
 speed:string;
 power:string;
 gymStrength:string[];
 bodyStrength:string[];
 robustness:string;
 conditioning:string;
 skill:string;
};

function positionTrainingProfile(sport:Sport,position:string):PositionTrainingProfile{
 const p=position.toLowerCase();
 const base:PositionTrainingProfile={
  role:position||"General athlete",
  priorities:["Acceleration","Unilateral strength","Power","Movement quality"],
  speed:"10–20 yard acceleration with full recovery",
  power:"Countermovement jump to controlled landing",
  gymStrength:["Goblet squat","Romanian deadlift","Rear-foot elevated split squat","Cable or band row"],
  bodyStrength:["Tempo bodyweight squat","Reverse lunge","Single-leg hip bridge","Push-up"],
  robustness:"Pallof press + side plank",
  conditioning:"6 rounds · 20 sec strong / 70 sec easy",
  skill:"Reactive sport-position footwork"
 };

 if(sport==="Ice Hockey"){
  if(p.includes("goal")){
   return {...base,role:"Goaltender",priorities:["Lateral power","Deceleration","Hip/adductor robustness","Reaction"],speed:"Dryland lateral push + recover",power:"Lateral bound to stick",gymStrength:["Rear-foot elevated split squat","Romanian deadlift","Cable lateral lunge","Cable or band row"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Lateral squat","Push-up"],robustness:"Copenhagen plank + Pallof press",conditioning:"8 rounds · 10 sec explosive / 50 sec easy",skill:"Off-ice goalie lateral reaction + recovery pattern"};
  }
  if(p.includes("defense")){
   return {...base,role:"Defense",priorities:["Backward-to-forward acceleration","Lateral crossover power","Lower-body strength","Repeated shift capacity"],speed:"Backward crossover → forward acceleration",power:"Lateral bound → crossover start",gymStrength:["Trap-bar deadlift","Rear-foot elevated split squat","Single-arm cable row","Landmine press"],bodyStrength:["Split squat","Single-leg hip bridge","Push-up","Band row"],robustness:"Adductor side plank + anti-rotation hold",conditioning:"6 rounds · 30 sec hard / 90 sec easy",skill:"Gap-control transition footwork"};
  }
  if(p.includes("center")){
   return {...base,role:"Center",priorities:["First-step acceleration","Multi-directional power","Total-body strength","Repeated shift capacity"],speed:"Faceoff-exit 10-yard acceleration",power:"Lateral bound → short sprint",gymStrength:["Front squat","Romanian deadlift","Single-arm row","Half-kneeling cable press"],bodyStrength:["Tempo squat","Reverse lunge","Push-up","Band row"],robustness:"Pallof press + Copenhagen plank",conditioning:"7 rounds · 30 sec hard / 90 sec easy",skill:"Faceoff-exit reaction + puck-support footwork"};
  }
  return {...base,role:"Wing",priorities:["Acceleration","Crossover speed","Unilateral power","Repeated sprint capacity"],speed:"Crossover start → 15-yard acceleration",power:"Skater bound to stick",gymStrength:["Rear-foot elevated split squat","Romanian deadlift","Cable row","Dumbbell bench press"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Push-up","Band row"],robustness:"Side plank + anti-rotation hold",conditioning:"7 rounds · 25 sec hard / 75 sec easy",skill:"Puck-protection change-of-direction footwork"};
 }

 if(sport==="Baseball"){
  if(p.includes("pitch")){
   return {...base,role:"Pitcher",priorities:["Lower-body force","Single-leg control","Rotational power","Scapular control"],speed:"10-yard first-step acceleration",power:"Medicine-ball step-behind rotational throw",gymStrength:["Rear-foot elevated split squat","Single-leg Romanian deadlift","Chest-supported row","Half-kneeling cable press"],bodyStrength:["Split squat","Single-leg hip bridge","Push-up plus","Prone Y-T raise"],robustness:"Pallof press + scapular wall slide",conditioning:"6 rounds · 10 sec fast / 50 sec easy",skill:"Pitcher fielding + first-step reaction"};
  }
  if(p.includes("catch")){
   return {...base,role:"Catcher",priorities:["Lateral quickness","Squat strength","Hip mobility","Short-burst power"],speed:"Catcher lateral start → 10-yard sprint",power:"Lateral bound to stick",gymStrength:["Goblet squat","Romanian deadlift","Split squat","Cable row"],bodyStrength:["Tempo squat","Reverse lunge","Single-leg hip bridge","Push-up"],robustness:"Adductor side plank + ankle mobility",conditioning:"8 rounds · 10 sec hard / 50 sec easy",skill:"Block → recover → throw-footwork pattern"};
  }
  if(p.includes("field")||p.includes("short")||p.includes("second")||p.includes("third")){
   return {...base,role:"Fielder",priorities:["First-step speed","Change of direction","Unilateral strength","Reactive power"],speed:"Drop-step / crossover → 15-yard acceleration",power:"Broad jump to controlled landing",gymStrength:["Split squat","Romanian deadlift","Cable row","Dumbbell press"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Push-up","Side plank"],robustness:"Pallof press + calf raise",conditioning:"6 rounds · 15 sec fast / 60 sec easy",skill:"Reactive fielding first-step drill"};
  }
  return {...base,role:"Infielder / Utility",priorities:["First-step speed","Lateral quickness","Rotational power","Strength"],speed:"Lateral shuffle → 10-yard acceleration",power:"Medicine-ball rotational scoop toss",skill:"First-step fielding reaction"};
 }

 if(sport==="Football"){
  if(p.includes("quarter")){
   return {...base,role:"Quarterback",priorities:["Pocket footwork","Rotational power","Acceleration","Trunk control"],speed:"Pocket escape → 10-yard acceleration",power:"Medicine-ball rotational throw",gymStrength:["Split squat","Romanian deadlift","Single-arm row","Landmine press"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Push-up","Band row"],robustness:"Pallof press + dead bug",conditioning:"6 rounds · 12 sec fast / 60 sec easy",skill:"Pocket reaction + reset footwork"};
  }
  if(p.includes("offensive line")||p.includes("defensive line")||p.includes("long snap")){
   return {...base,role:p.includes("offensive")?"Offensive Line":p.includes("defensive")?"Defensive Line":"Long Snapper",priorities:["Short acceleration","Force production","Total-body strength","Trunk stiffness"],speed:"5–10 yard stance-start acceleration",power:"Broad jump to stick",gymStrength:["Trap-bar deadlift","Front squat","Dumbbell bench press","Chest-supported row"],bodyStrength:["Tempo squat","Split squat","Push-up","Band row"],robustness:"Farmer carry + Pallof press",conditioning:"8 rounds · 8 sec hard / 52 sec easy",skill:"Stance → first-two-steps reaction"};
  }
  if(p.includes("receiver")||p.includes("corner")||p.includes("safety")||p.includes("running")){
   return {...base,role:"Speed / Skill Position",priorities:["Acceleration","Max-speed mechanics","Change of direction","Elastic power"],speed:"10-yard acceleration + flying sprint exposure",power:"Bounds + countermovement jump",gymStrength:["Rear-foot elevated split squat","Romanian deadlift","Hip thrust","Cable row"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Single-leg squat to box","Push-up"],robustness:"Nordic progression + side plank",conditioning:"6 rounds · 20 sec fast / 80 sec easy",skill:"Reactive route / pursuit change-of-direction"};
  }
  if(p.includes("kicker")||p.includes("punter")){
   return {...base,role:"Kicker / Punter",priorities:["Single-leg power","Hip control","Approach speed","Landing control"],speed:"Approach acceleration mechanics",power:"Single-leg jump to stick",gymStrength:["Rear-foot elevated split squat","Single-leg Romanian deadlift","Cable hip flexion","Cable row"],bodyStrength:["Split squat","Single-leg hip bridge","Step-up","Push-up"],robustness:"Adductor plank + calf isometric",conditioning:"5 rounds · 15 sec moderate-hard / 75 sec easy",skill:"Approach-step rhythm and balance"};
  }
  return {...base,role:"Hybrid Football Position",priorities:["Acceleration","Change of direction","Strength","Power"],speed:"10-yard acceleration → reactive cut",power:"Broad jump + lateral bound",gymStrength:["Front squat","Romanian deadlift","Split squat","Cable row"],conditioning:"7 rounds · 15 sec hard / 60 sec easy",skill:"Position reaction footwork"};
 }

 if(sport==="Basketball"){
  if(p.includes("point")||p.includes("shooting")){
   return {...base,role:"Guard",priorities:["First-step speed","Lateral change of direction","Deceleration","Repeat-effort power"],speed:"First-step acceleration → reactive cut",power:"Lateral bound + vertical jump",gymStrength:["Split squat","Romanian deadlift","Dumbbell bench press","Cable row"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Push-up","Side plank"],robustness:"Calf isometric + adductor side plank",conditioning:"8 rounds · 15 sec court work / 45 sec easy",skill:"Ball-handling reaction + finish footwork"};
  }
  if(p.includes("center")||p.includes("power")){
   return {...base,role:"Interior",priorities:["Jump/landing power","Short acceleration","Lower-body strength","Contact robustness"],speed:"5–10 yard acceleration + closeout",power:"Repeated jump → controlled landing",gymStrength:["Front squat","Romanian deadlift","Split squat","Cable row"],bodyStrength:["Tempo squat","Reverse lunge","Single-leg hip bridge","Push-up"],robustness:"Isometric split squat + Pallof press",conditioning:"7 rounds · 15 sec hard / 45 sec easy",skill:"Rebound landing → outlet footwork"};
  }
  return {...base,role:"Wing",priorities:["Multi-directional power","Acceleration","Deceleration","Strength"],speed:"Closeout → crossover acceleration",power:"Lateral bound → vertical jump",conditioning:"8 rounds · 15 sec court work / 45 sec easy",skill:"Catch → attack-space reaction"};
 }

 if(sport==="Lacrosse"){
  if(p.includes("goal")){
   return {...base,role:"Goalie",priorities:["Lateral reaction","Deceleration","Hip/adductor strength","Short-burst power"],speed:"Goalie step → lateral reaction",power:"Lateral bound to stick",gymStrength:["Split squat","Romanian deadlift","Cable lateral lunge","Cable row"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Lateral squat","Push-up"],robustness:"Copenhagen plank + Pallof press",conditioning:"8 rounds · 10 sec explosive / 50 sec easy",skill:"Save-step reaction + reset"};
  }
  if(p.includes("midfield")){
   return {...base,role:"Midfield",priorities:["Repeated sprint ability","Acceleration","Change of direction","Aerobic support"],speed:"20-yard acceleration → reactive cut",power:"Bounds + broad jump",gymStrength:["Split squat","Romanian deadlift","Cable row","Dumbbell press"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Push-up","Band row"],robustness:"Calf raise + anti-rotation hold",conditioning:"8 rounds · 20 sec fast / 60 sec easy",skill:"Transition run → catch/pass footwork"};
  }
  if(p.includes("defense")){
   return {...base,role:"Defense",priorities:["Lateral movement","Backpedal-to-sprint","Strength","Deceleration"],speed:"Backpedal → crossover sprint",power:"Lateral bound to stick",gymStrength:["Front squat","Romanian deadlift","Cable row","Landmine press"],bodyStrength:["Tempo squat","Reverse lunge","Band row","Push-up"],robustness:"Adductor plank + Pallof press",conditioning:"7 rounds · 20 sec hard / 70 sec easy",skill:"Approach → breakdown → recover footwork"};
  }
  if(p.includes("faceoff")){
   return {...base,role:"Faceoff Specialist",priorities:["First-step power","Isometric strength","Grip","Hip/trunk force"],speed:"Faceoff exit → 10-yard acceleration",power:"Broad jump to sprint",gymStrength:["Trap-bar deadlift","Split squat","Cable row","Farmer carry"],bodyStrength:["Tempo squat","Reverse lunge","Towel row","Bear crawl"],robustness:"Grip isometric + Pallof press",conditioning:"8 rounds · 8 sec hard / 52 sec easy",skill:"Faceoff exit reaction"};
  }
  return {...base,role:"Attack",priorities:["Acceleration","Change of direction","Rotational power","Decision speed"],speed:"Dodge start → 15-yard acceleration",power:"Medicine-ball rotational throw",conditioning:"7 rounds · 15 sec hard / 60 sec easy",skill:"Reactive dodge + pass/shoot footwork"};
 }

 if(sport==="Soccer"){
  if(p.includes("goalkeeper")){
   return {...base,role:"Goalkeeper",priorities:["Lateral reaction","Jump/landing","Short acceleration","Hip/adductor robustness"],speed:"Goalkeeper lateral shuffle → 5-yard burst",power:"Lateral bound + vertical jump",gymStrength:["Split squat","Romanian deadlift","Cable lateral lunge","Cable row"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Lateral squat","Push-up"],robustness:"Copenhagen plank + calf isometric",conditioning:"6 rounds · 10 sec explosive / 60 sec easy",skill:"Set-position → dive-step reaction"};
  }
  if(p.includes("center back")){
   return {...base,role:"Center Back",priorities:["Acceleration","Deceleration","Aerial power","Strength"],speed:"Backpedal → 15 m acceleration",power:"Vertical jump → controlled landing",gymStrength:["Front squat","Romanian deadlift","Split squat","Cable row"],bodyStrength:["Tempo squat","Reverse lunge","Single-leg hip bridge","Push-up"],robustness:"Copenhagen plank + Pallof press",conditioning:"6 rounds · 20 sec hard / 80 sec easy",skill:"Drop-step → close-space reaction"};
  }
  if(p.includes("wing")||p.includes("left back")||p.includes("right back")){
   return {...base,role:p.includes("wing")?"Wide Player":"Fullback",priorities:["Repeated high-speed running","Acceleration","Change of direction","Hamstring strength"],speed:"10–20 m acceleration + flying sprint exposure",power:"Bounds + lateral jump",gymStrength:["Rear-foot elevated split squat","Romanian deadlift","Nordic hamstring progression","Cable row"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Hamstring walkout","Push-up"],robustness:"Calf raise + Copenhagen plank",conditioning:"6 rounds · 25 sec fast / 75 sec easy",skill:"Overlap / 1v1 reactive movement"};
  }
  if(p.includes("midfielder")){
   return {...base,role:"Midfielder",priorities:["Repeated efforts","Aerobic power","Acceleration","Change of direction"],speed:"10 m acceleration → reactive turn",power:"Lateral bound to acceleration",gymStrength:["Split squat","Romanian deadlift","Cable row","Dumbbell press"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Push-up","Side plank"],robustness:"Calf raise + adductor plank",conditioning:"4 rounds · 3 min strong / 2 min easy",skill:"Scan → receive → turn footwork"};
  }
  if(p.includes("striker")||p.includes("forward")){
   return {...base,role:"Striker / Forward",priorities:["Acceleration","Max-speed exposure","Explosive power","Deceleration"],speed:"10–20 m acceleration + flying sprint exposure",power:"Broad jump → short sprint",gymStrength:["Split squat","Romanian deadlift","Hip thrust","Cable row"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Single-leg squat to box","Push-up"],robustness:"Hamstring walkout + calf isometric",conditioning:"7 rounds · 20 sec fast / 70 sec easy",skill:"Check-away → attack-space reaction"};
  }
  return {...base,role:"Central / Attacking Midfielder",priorities:["Acceleration","Change of direction","Repeated efforts","Decision speed"],speed:"10 m acceleration → reactive turn",power:"Lateral bound → short acceleration",gymStrength:["Split squat","Romanian deadlift","Cable row","Dumbbell press"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Push-up","Side plank"],robustness:"Calf raise + anti-rotation hold",conditioning:"5 rounds · 2 min strong / 2 min easy",skill:"Scan → receive → turn → accelerate"};
 }

 if(sport==="Figure Skating"){
  if(p.includes("ice dance")){
   return {...base,role:"Ice Dance",priorities:["Edge control","Single-leg strength","Rotation control","Aerobic repeatability"],speed:"Quick-step edge transition drill",power:"Lateral bound to balanced landing",gymStrength:["Split squat","Single-leg Romanian deadlift","Cable row","Pallof press"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Side plank","Push-up"],robustness:"Ankle/calf isometric + hip stability",conditioning:"4 rounds · 2 min strong / 2 min easy",skill:"Edge-transition + rotation-control sequence"};
  }
  if(p.includes("synch")){
   return {...base,role:"Synchronized Skating",priorities:["Repeat movement quality","Alignment","Single-leg strength","Conditioning"],speed:"Quick-step synchronization pattern",power:"Snap jump to controlled landing",gymStrength:["Split squat","Romanian deadlift","Cable row","Dumbbell press"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Push-up","Side plank"],robustness:"Calf isometric + Pallof press",conditioning:"5 rounds · 90 sec strong / 90 sec easy",skill:"Pattern timing + edge-control sequence"};
  }
  if(p.includes("pair")){
   return {...base,role:"Pairs",priorities:["Landing strength","Total-body force","Single-leg control","Trunk stability"],speed:"Quick-step entry acceleration",power:"Countermovement jump to stick",gymStrength:["Front squat","Romanian deadlift","Split squat","Cable row"],bodyStrength:["Tempo squat","Reverse lunge","Single-leg hip bridge","Push-up"],robustness:"Pallof press + shoulder stability",conditioning:"6 rounds · 30 sec strong / 90 sec easy",skill:"Entry → jump/landing-control sequence"};
  }
  return {...base,role:"Singles",priorities:["Jump power","Landing control","Single-leg strength","Rotation speed"],speed:"Quick-step jump-entry drill",power:"Countermovement jump + rotational landing control",gymStrength:["Split squat","Romanian deadlift","Cable row","Pallof press"],bodyStrength:["Reverse lunge","Single-leg hip bridge","Side plank","Push-up"],robustness:"Calf isometric + hip stability",conditioning:"6 rounds · 30 sec strong / 90 sec easy",skill:"Jump-entry + spin-balance sequence"};
 }

 if(sport==="Wrestling"){
  return {...base,role:"Wrestler",priorities:["Explosive entry","Total-body strength","Grip","Repeated high-intensity efforts"],speed:"Stance reaction → penetration step",power:"Broad jump → sprawl reaction",gymStrength:["Trap-bar deadlift","Front squat","Pull-up / lat pulldown","Farmer carry"],bodyStrength:["Tempo squat","Reverse lunge","Towel row","Bear crawl"],robustness:"Grip isometric + anti-rotation hold",conditioning:"3 rounds · 2 min hard / 1 min easy",skill:"Shot-entry → sprawl → re-attack reaction"};
 }

 return base;
}

type AgeTrainingProfile={
 label:string;
 maxDays:number;
 sessionMinutes:number;
 maxStrengthSets:number;
 strengthReps:string;
 powerReps:string;
 speedReps:string;
 conditioningRounds:number;
 lightLoadsOnly:boolean;
 emphasis:string;
 coachingNote:string;
};


type VerifiedRoutineBlock={
 title:string;
 category:string;
 minutes:number;
 focus:string;
 section:string;
 exercises:ProgramExercise[];
};

const strictRoutineVideoCatalog:RoutineReference[]=[
 // Full-workout videos go here only after every exercise and selected duration are verified.
];

const verifiedExerciseBlockCatalog:RoutineReference[]=[
 {
  title:"Safe Stretches For Young Goalies",
  url:"https://youtu.be/_sqm-VmIlqk",
  source:"Goalie Training Pro · Maria Mountain",
  section:"Young Goalie Stretch Series",
  matchNote:"This source is explicitly a video for young hockey goalies. Athlete Performance uses it for the 9–13 development group only for the seven mobility exercises demonstrated in the source. It is not presented as a demo for strength, speed, or reaction exercises that may follow.",
  sport:"Ice Hockey",
  positions:["Goaltender"],
  ageMin:9,
  ageMax:13,
  offIce:true,
  exerciseNames:["Supine Hip Internal Rotation","3-Way Hamstring With Strap","Half-Kneeling Hip Flexor","Hip Flexor With Foot on Wall","Half-Kneeling Groin","Kneeling Lat Stretch","Active Ankle Dorsiflexion"],
  durationLabel:"about 10–15 min",
  thumbnailUrl:"https://img.youtube.com/vi/_sqm-VmIlqk/hqdefault.jpg"
 }
];

const youthGoalieMobilityExercises=():ProgramExercise[]=>[
 {phase:"Warm-up",name:"Supine Hip Internal Rotation",sets:"1",reps:"10 reps · 5-sec hold",rest:"15 sec",notes:"Verified young-goalie mobility block · hip internal rotation.",instructions:"Lie on your back with knees bent and feet wider than hips. Let one knee move inward only until you feel a gentle hip stretch. Keep the pelvis heavy on the floor. Hold 5 seconds, return to center, then alternate sides. Do not force the knee toward the floor."},
 {phase:"Warm-up",name:"3-Way Hamstring With Strap",sets:"1",reps:"30 sec each position / side",rest:"15 sec",notes:"Verified young-goalie mobility block · hamstrings from three angles.",instructions:"Lie on your back with a strap around one foot. Raise the strapped leg until you feel a gentle hamstring stretch, then use the three demonstrated leg angles. Keep the pelvis still and the knee comfortably straight. Never pull into pain."},
 {phase:"Warm-up",name:"Half-Kneeling Hip Flexor",sets:"1",reps:"30 sec / side",rest:"15 sec",notes:"Verified young-goalie mobility block · front-of-hip mobility.",instructions:"Kneel on one knee with the other foot in front. Squeeze the glute on the kneeling side, keep ribs stacked over the pelvis, and shift forward slightly until you feel a gentle stretch at the front of the hip. Do not arch the low back."},
 {phase:"Warm-up",name:"Hip Flexor With Foot on Wall",sets:"1",reps:"30 sec / side",rest:"20 sec",notes:"Verified young-goalie mobility block · hip flexor/quadriceps mobility.",instructions:"Use padding under the knee. Put the rear foot on a wall and the opposite foot in front. Stay tall, squeeze the rear-side glute, and move only far enough to feel a gentle front-thigh/front-hip stretch. Move farther from the wall if it feels too intense."},
 {phase:"Warm-up",name:"Half-Kneeling Groin",sets:"1",reps:"30 sec / side",rest:"15 sec",notes:"Verified young-goalie mobility block · adductor/groin mobility.",instructions:"Start on hands and knees and extend one leg straight to the side with that foot flat. Keep the back neutral and gently sit the hips backward. Stop at a light-to-medium inner-thigh stretch; do not force the range."},
 {phase:"Cooldown",name:"Kneeling Lat Stretch",sets:"1",reps:"30 sec each position",rest:"15 sec",notes:"Verified young-goalie mobility block · shoulder/lat mobility.",instructions:"Kneel in front of a bench or chair and place hands or elbows on it. Keep the ribs controlled and sit the hips back while the chest lowers. Feel the stretch along the sides of the upper back, not pinching in the shoulders."},
 {phase:"Cooldown",name:"Active Ankle Dorsiflexion",sets:"1",reps:"15 reps / side",rest:"15 sec",notes:"Verified young-goalie mobility block · ankle range used in a balanced goalie stance.",instructions:"Face a wall in a split stance with the front foot flat. Drive the front knee slowly toward the wall over the middle toes while keeping the heel down. Return under control. Move the foot closer if the heel lifts."}
];

const normalizeMatchText=(value:string)=>value.trim().toLowerCase().replace(/\s+/g," ");

const verifiedVideosForSession=(sport:Sport,position:string,age:number,exercises:ProgramExercise[],targetMinutes:number)=>{
 const matchAge=programmingAge(age);
 const exactPosition=normalizeMatchText(position);
 const workoutNames=[...new Set(exercises.map(x=>normalizeMatchText(x.name)).filter(Boolean))];

 const candidates=strictRoutineVideoCatalog.filter(video=>{
  const exactPositionMatch=video.positions.some(p=>normalizeMatchText(p)===exactPosition);
  const environmentMatch=sport==="Ice Hockey"?video.offIce===true:true;
  const videoExercises=[...new Set(video.exerciseNames.map(normalizeMatchText).filter(Boolean))];
  const noExtraExercises=videoExercises.length>0&&videoExercises.every(name=>workoutNames.includes(name));
  const durationKnown=Number(video.durationMinutes)>0;
  return video.sport===sport
   &&exactPositionMatch
   &&matchAge>=video.ageMin
   &&matchAge<=video.ageMax
   &&environmentMatch
   &&noExtraExercises
   &&durationKnown;
 });

 const maxBundle=Math.min(6,candidates.length);
 let best:RoutineReference[]=[];

 const search=(index:number,chosen:RoutineReference[],minutes:number,covered:Set<string>)=>{
  if(best.length)return;
  if(minutes>targetMinutes||chosen.length>maxBundle)return;
  if(minutes===targetMinutes&&workoutNames.every(name=>covered.has(name))){
   best=chosen;
   return;
  }
  for(let i=index;i<candidates.length;i++){
   const video=candidates[i];
   const nextCovered=new Set(covered);
   video.exerciseNames.map(normalizeMatchText).forEach(name=>nextCovered.add(name));
   search(i+1,[...chosen,video],minutes+(video.durationMinutes||0),nextCovered);
   if(best.length)return;
  }
 };

 search(0,[],0,new Set<string>());
 return best;
};

function youthGoalieVerifiedBlocks(age:number):VerifiedRoutineBlock[]{
 const young=age<=10;
 const gentle=young?"Use a comfortable range only. Never force a stretch.":"Use controlled range without forcing end positions.";
 return [
  {
   title:"Goalie Mobility 4 · Off-Ice",
   category:"Mobility",
   minutes:young?8:10,
   focus:"Hip mobility + controlled range",
   section:"Mobility 4",
   exercises:[
    {phase:"Warm-up",name:"90/90 Stretch",sets:"1",reps:young?"20 sec each position / side":"30 sec each position / side",rest:"20 sec",notes:"Off-ice hip rotation mobility for goalie movement.",instructions:`Sit tall and move only through a comfortable hip range. ${gentle}`},
    {phase:"Warm-up",name:"FRC Kneeling Groin",sets:"1",reps:young?"20 sec easy hold + 10 sec gentle press / release":"30 sec hold + controlled press / pull sequence",rest:"30 sec",notes:"Off-ice adductor mobility and control.",instructions:`Keep the movement gentle and controlled. ${gentle} An adult or coach should supervise younger athletes.`}
   ]
  },
  {
   title:"Goalie Strength 4 · Off-Ice",
   category:"Strength",
   minutes:young?10:12,
   focus:"Bodyweight strength + hip/core stability",
   section:"Strength 4",
   exercises:[
    {phase:"Main",name:"Squat Lateral",sets:young?"1":"2",reps:young?"20 sec each side":"30 sec each side",rest:"30–45 sec",notes:"Off-ice lateral leg strength and adductor control.",instructions:"Shift into one hip while keeping the pelvis level, chest controlled, and working foot flat."},
    {phase:"Main",name:"Push Up + Reach",sets:young?"1":"2",reps:young?"20–30 sec":"60 sec",rest:"45 sec",notes:"Off-ice upper-body strength plus shoulder and trunk stability.",instructions:"Use regular or knee push-ups as needed. Reach only as far as you can without twisting the trunk."},
    {phase:"Main",name:"Iso Row",sets:young?"1":"2",reps:young?"5 sec holds for 20–30 sec":"5 sec holds for 60 sec",rest:"45 sec",notes:"Off-ice upper-back strength without heavy loading.",instructions:"Drive the elbows into the floor, gently squeeze the shoulder blades together, and keep the neck relaxed."},
    {phase:"Main",name:"Standing Lateral Hip Circles",sets:"1",reps:young?"10 sec each direction / leg":"15 sec each direction / leg",rest:"30 sec",notes:"Off-ice single-leg hip stability for goalie movement.",instructions:"Stand tall, keep the pelvis level, and make small controlled circles rather than large swinging motions."}
   ]
  },
  {
   title:"Goalie Stamina 4 · Off-Ice",
   category:"Conditioning",
   minutes:young?10:12,
   focus:"Lateral movement + trunk stability + controlled goalie stamina",
   section:"Stamina 4",
   exercises:[
    {phase:"Sport",name:"Lateral Shuffle & Hold",sets:"1",reps:young?"30 sec":"60 sec",rest:"30 sec",notes:"Dryland lateral movement and hold; no ice required.",instructions:"Stay low, shuffle a short distance, stop under control, hold briefly, then move the other way."},
    {phase:"Sport",name:"Side Plank + Box Pattern",sets:"1",reps:young?"20 sec first side":"30 sec first side",rest:"20 sec",notes:"Off-ice trunk and hip stability.",instructions:"Use a knee-supported side plank if needed. Keep the hips stacked and move only as far as posture stays clean."},
    {phase:"Sport",name:"Quick Step Lateral Hop",sets:"1",reps:young?"15–20 sec":"30 sec",rest:"40 sec",notes:"Low-volume off-ice lateral power.",instructions:"Use small hops, land quietly, and stop immediately if landing control is lost."},
    {phase:"Sport",name:"Side Plank + Box Pattern",sets:"1",reps:young?"20 sec second side":"30 sec second side",rest:"20 sec",notes:"Repeat the same trunk-stability pattern on the opposite side.",instructions:"Keep shoulders and hips stacked; use the easier knee-supported version when needed."},
    {phase:"Sport",name:"Knee Recovery + Lateral Push",sets:"1",reps:young?"3 controlled reps each side":"30 sec",rest:"45 sec",notes:"Dryland goalie recovery pattern. No pads, crease, or ice required.",instructions:"Use a padded floor. Move from one knee to a balanced athletic stance, then make a small lateral push and fully reset."},
    {phase:"Sport",name:"Bear Position + Superman",sets:"1",reps:young?"3–4 controlled reaches / side":"5 sec each for 30 sec",rest:"30 sec",notes:"Off-ice trunk stability and cross-body control.",instructions:"Keep knees just off the floor and reach slowly without letting the hips twist."},
    {phase:"Sport",name:"V-Drill",sets:"1",reps:young?"3–4 controlled patterns":"30 sec",rest:"45 sec",notes:"Dryland deceleration and visual-leading footwork.",instructions:"Mark a small V on the floor. Move to each point, stop balanced, keep eyes up, and reset before the next pattern."},
    {phase:"Finisher",name:"Lateral Shuffle & Hold",sets:"1",reps:young?"30 sec":"60 sec",rest:"—",notes:"Finish with the same off-ice lateral control pattern shown in the reference routine.",instructions:"Keep the final effort controlled. Quality movement matters more than speed."}
   ]
  }
 ];
}

function ageTrainingProfile(age:number):AgeTrainingProfile{
 if(age<=8)return {label:"7–8 Fundamentals",maxDays:3,sessionMinutes:30,maxStrengthSets:2,strengthReps:"8–12 controlled reps",powerReps:"3–5 easy quality reps",speedReps:"2–3 short reps",conditioningRounds:4,lightLoadsOnly:true,emphasis:"Coordination · landing · balance · playful speed",coachingNote:"Keep training varied and technique-first. Use bodyweight, bands, light medicine balls, and games rather than heavy loading."};
 if(age<=13)return {label:"10–13 Development",maxDays:4,sessionMinutes:45,maxStrengthSets:3,strengthReps:"6–12 controlled reps",powerReps:"3–5 quality reps",speedReps:"3–5 short quality reps",conditioningRounds:5,lightLoadsOnly:false,emphasis:"Movement skill · foundational strength · speed mechanics · sport-specific coordination",coachingNote:"Use age-appropriate resistance, technically clean repetitions, and progressive sport-specific movement. Age 9 is intentionally included in this training group."};
 if(age<=17)return {label:"14–17 Advanced Youth",maxDays:6,sessionMinutes:60,maxStrengthSets:4,strengthReps:"5–10 reps",powerReps:"3–5 explosive reps",speedReps:"3–5 quality reps",conditioningRounds:7,lightLoadsOnly:false,emphasis:"Progressive strength · power · high-quality speed · sport transfer",coachingNote:"Progress load gradually and account for growth, training history, soreness, readiness, and changing coordination."};
 return {label:"18+ Adult Performance",maxDays:6,sessionMinutes:60,maxStrengthSets:4,strengthReps:"5–10 reps",powerReps:"3–5 explosive reps",speedReps:"3–5 quality reps",conditioningRounds:8,lightLoadsOnly:false,emphasis:"Individual performance · strength/power · sport transfer",coachingNote:"Progress load and volume according to training history, readiness, season demands, and technical quality."};
}

type SportSessionProfile={warmup:string;prep:string;speedSecondary:string;reactive:string;skillSecondary:string;conditioningSecondary:string;cooldown:string};

function sportSessionProfile(sport:Sport,position:string):SportSessionProfile{
 const p=position.toLowerCase();
 if(sport==="Ice Hockey"){
  if(p.includes("goal"))return {warmup:"Goalie hip + ankle movement prep",prep:"Dryland ready-stance shuffle + lateral push pattern",speedSecondary:"Dryland lateral push → recover to stance",reactive:"Off-ice goalie visual-cue lateral reaction",skillSecondary:"Dryland post-to-angle recovery footwork",conditioningSecondary:"Off-ice short lateral repeat-effort circuit",cooldown:"Adductor + hip recovery mobility"};
  if(p.includes("defense"))return {warmup:"Off-ice hockey hip + ankle movement prep",prep:"Backward shuffle → hip turn → crossover",speedSecondary:"Backward-to-forward transition acceleration",reactive:"Gap-control mirror reaction",skillSecondary:"Lateral crossover + retrieval transition",conditioningSecondary:"Defense shift-repeat interval",cooldown:"Hip flexor + adductor recovery mobility"};
  if(p.includes("center"))return {warmup:"Off-ice hockey hip + ankle movement prep",prep:"Dryland crossover start + faceoff-exit footwork",speedSecondary:"Crossover → 10–15 yd acceleration",reactive:"Dryland center support-lane reaction",skillSecondary:"Faceoff-exit + support-route footwork",conditioningSecondary:"Center repeated-shift interval",cooldown:"Hip + groin recovery mobility"};
  return {warmup:"Off-ice hockey hip + ankle movement prep",prep:"Dryland crossover start + stop-start footwork",speedSecondary:"Crossover → 15 yd acceleration",reactive:"Dryland wing reaction cut",skillSecondary:"Dryland support-lane change-of-direction footwork",conditioningSecondary:"Wing repeated-sprint shift interval",cooldown:"Hip + adductor recovery mobility"};
 }
 if(sport==="Baseball"){
  if(p.includes("pitch"))return {warmup:"Pitcher thoracic + hip movement prep",prep:"Lead-leg balance + fielding footwork",speedSecondary:"Pitcher first-step fielding acceleration",reactive:"Bunt/come-backer first-step reaction",skillSecondary:"Pick-up → set-feet fielding pattern",conditioningSecondary:"Short alactic sprint + walk recovery",cooldown:"Thoracic + hip recovery mobility"};
  if(p.includes("catch"))return {warmup:"Catcher ankle + hip movement prep",prep:"Catcher stance → lateral block step",speedSecondary:"Crouch release → 10 yd acceleration",reactive:"Block-direction reaction",skillSecondary:"Block → recover → throw-footwork pattern",conditioningSecondary:"Catcher short-burst repeat circuit",cooldown:"Ankle + hip recovery mobility"};
  if(p.includes("field")||p.includes("short")||p.includes("base"))return {warmup:"Baseball fielding movement prep",prep:"Prep hop → drop step → crossover",speedSecondary:"Drop-step → 15 yd acceleration",reactive:"Ball-direction first-step reaction",skillSecondary:"Field → transfer → movement footwork",conditioningSecondary:"Base-running burst + full walk recovery",cooldown:"Hip + calf recovery mobility"};
  return {warmup:"Baseball movement + shoulder prep",prep:"Lateral prep hop + crossover start",speedSecondary:"Lateral shuffle → 10 yd acceleration",reactive:"Ball-direction first-step reaction",skillSecondary:"Fielding approach + transfer footwork",conditioningSecondary:"Base-running burst + walk recovery",cooldown:"Hip + shoulder recovery mobility"};
 }
 if(sport==="Football"){
  if(p.includes("quarter"))return {warmup:"Quarterback hip + trunk movement prep",prep:"Three-step pocket rhythm + reset",speedSecondary:"Pocket escape → 10 yd acceleration",reactive:"Pressure-cue pocket escape",skillSecondary:"Reset feet → throw-position footwork",conditioningSecondary:"Short scramble repeat with full recovery",cooldown:"Hip + thoracic recovery mobility"};
  if(["wr","wide receiver","cornerback","cb","safety","running back","rb"].some(x=>p===x||p.includes(x)))return {warmup:"Football sprint + ankle movement prep",prep:"Stance release + projection-step mechanics",speedSecondary:"Position start → 10–20 yd acceleration",reactive:"Route/coverage cue change-of-direction",skillSecondary:"Release or pursuit-angle footwork",conditioningSecondary:"Play-length repeated sprint interval",cooldown:"Hamstring + calf recovery mobility"};
  if(p.includes("line")||p==="ol"||p==="dl")return {warmup:"Line stance + hip movement prep",prep:"Stance → first two power steps",speedSecondary:"Three-point start → 5–10 yd acceleration",reactive:"Block-direction reaction step",skillSecondary:"Short-space mirror + leverage footwork",conditioningSecondary:"6–8 second play effort + long recovery",cooldown:"Hip + ankle recovery mobility"};
  if(p.includes("lineback"))return {warmup:"Linebacker hip + ankle movement prep",prep:"Read-step → shuffle → downhill step",speedSecondary:"Read step → 10 yd acceleration",reactive:"Run/pass key reaction",skillSecondary:"Pursuit-angle + redirect footwork",conditioningSecondary:"Play-length repeat interval",cooldown:"Hip + calf recovery mobility"};
  return {warmup:"Football sprint movement prep",prep:"Position stance + first-step mechanics",speedSecondary:"Position start → acceleration",reactive:"Visual-cue redirect",skillSecondary:"Position-specific footwork pattern",conditioningSecondary:"Play-length repeat interval",cooldown:"Lower-body recovery mobility"};
 }
 if(sport==="Basketball"){
  if(p.includes("guard"))return {warmup:"Basketball ankle + hip movement prep",prep:"First-step + crossover footwork",speedSecondary:"First-step → 10 yd acceleration",reactive:"Ball-handler mirror reaction",skillSecondary:"Drive → decelerate → re-accelerate footwork",conditioningSecondary:"Court sprint + defensive slide repeat",cooldown:"Ankle + hip recovery mobility"};
  if(p.includes("center")||p.includes("power"))return {warmup:"Basketball landing + ankle movement prep",prep:"Closeout → drop step → rebound stance",speedSecondary:"Short first-step acceleration",reactive:"Paint help/recover reaction",skillSecondary:"Rebound landing → outlet footwork",conditioningSecondary:"Paint-to-paint repeat interval",cooldown:"Calf + hip recovery mobility"};
  return {warmup:"Basketball landing + hip movement prep",prep:"Closeout → lateral slide → sprint",speedSecondary:"First-step → court acceleration",reactive:"Closeout-direction reaction",skillSecondary:"Catch → attack → decelerate footwork",conditioningSecondary:"Court sprint + slide repeat interval",cooldown:"Ankle + hip recovery mobility"};
 }
 if(sport==="Lacrosse"){
  if(p.includes("goal"))return {warmup:"Goalie hip + hand-eye movement prep",prep:"Goalie stance → arc-step footwork",speedSecondary:"Arc step → outlet acceleration",reactive:"Shot-location step reaction",skillSecondary:"Save-step → recover → outlet footwork",conditioningSecondary:"Short goalie reaction repeat circuit",cooldown:"Hip + groin recovery mobility"};
  if(p.includes("faceoff"))return {warmup:"Faceoff hip + wrist movement prep",prep:"Faceoff stance → clamp-exit footwork",speedSecondary:"Clamp exit → 5–10 yd acceleration",reactive:"Loose-ball direction reaction",skillSecondary:"Clamp → exit → ground-ball footwork",conditioningSecondary:"Faceoff-bout repeat interval",cooldown:"Hip + forearm recovery mobility"};
  if(p.includes("defense"))return {warmup:"Lacrosse hip + ankle movement prep",prep:"Approach → breakdown → drop step",speedSecondary:"Crossover pursuit acceleration",reactive:"Dodger mirror reaction",skillSecondary:"Approach + recover defensive footwork",conditioningSecondary:"Defensive possession repeat interval",cooldown:"Hip + calf recovery mobility"};
  return {warmup:"Lacrosse sprint + rotation movement prep",prep:"Split-dodge + crossover footwork",speedSecondary:"Dodging exit → 15 yd acceleration",reactive:"Defender-cue change-of-direction",skillSecondary:"Dodge → pass-on-the-move footwork",conditioningSecondary:"Field repeated-sprint interval",cooldown:"Hip + thoracic recovery mobility"};
 }
 if(sport==="Soccer"){
  if(p.includes("goal"))return {warmup:"Goalkeeper ankle + hip movement prep",prep:"Set position → shuffle → crossover step",speedSecondary:"Goalkeeper lateral step → short acceleration",reactive:"Shot-direction goalkeeper reaction",skillSecondary:"Set → move → recover goalkeeper footwork",conditioningSecondary:"Goalkeeper explosive repeat circuit",cooldown:"Adductor + hip recovery mobility"};
  if(p.includes("center back"))return {warmup:"Center-back hamstring + ankle movement prep",prep:"Backpedal → open hips → close-space acceleration",speedSecondary:"Recovery run → decelerate → re-set",reactive:"Striker run / ball-flight reaction",skillSecondary:"Close-down → aerial landing → recovery footwork",conditioningSecondary:"Center-back repeat recovery-run interval",cooldown:"Hamstring + adductor recovery mobility"};
  if(p.includes("left back")||p.includes("right back"))return {warmup:"Fullback hamstring + ankle movement prep",prep:"Open-hip turn → overlap acceleration",speedSecondary:"Overlap sprint → recovery run",reactive:"Winger mirror + recovery reaction",skillSecondary:"Close-down → turn → overlap/recover footwork",conditioningSecondary:"Fullback repeated high-speed overlap interval",cooldown:"Hamstring + adductor recovery mobility"};
  if(p.includes("wing")||p.includes("striker")||p.includes("forward"))return {warmup:"Soccer hamstring + ankle movement prep",prep:"Curved run + first-step mechanics",speedSecondary:"10–20 m attacking acceleration",reactive:"Through-ball direction reaction",skillSecondary:"First touch → cut → acceleration",conditioningSecondary:"High-speed run + walk-back repeat",cooldown:"Hamstring + calf recovery mobility"};
  return {warmup:"Soccer hamstring + ankle movement prep",prep:"Scan-step → lateral move → acceleration",speedSecondary:"10–15 m multi-directional acceleration",reactive:"Pass-direction reaction cut",skillSecondary:"First touch → pass-on-the-move footwork",conditioningSecondary:"Midfield repeated-sprint + aerobic interval",cooldown:"Hamstring + adductor recovery mobility"};
 }
 if(sport==="Figure Skating"){
  if(p.includes("dance"))return {warmup:"Dance ankle + hip + trunk movement prep",prep:"Pattern-step rhythm + edge-position simulation",speedSecondary:"Quick-step pattern acceleration",reactive:"Music-cue direction reaction",skillSecondary:"Pattern timing + rotational control sequence",conditioningSecondary:"Program-pattern interval",cooldown:"Hip + calf recovery mobility"};
  if(p.includes("synch"))return {warmup:"Synchro ankle + hip movement prep",prep:"Quick-step timing + line-position drill",speedSecondary:"Formation-entry quick-step acceleration",reactive:"Count-cue position reaction",skillSecondary:"Timing + edge-position sequence",conditioningSecondary:"Formation repeat interval",cooldown:"Hip + calf recovery mobility"};
  if(p.includes("pair"))return {warmup:"Pairs landing + shoulder movement prep",prep:"Entry footwork + landing-position rehearsal",speedSecondary:"Quick-step lift/jump entry",reactive:"Partner-cue entry reaction",skillSecondary:"Entry → landing-control sequence",conditioningSecondary:"Program-element repeat interval",cooldown:"Hip + shoulder recovery mobility"};
  return {warmup:"Singles ankle + hip movement prep",prep:"Jump-entry steps + landing rehearsal",speedSecondary:"Quick-step jump-entry acceleration",reactive:"Entry-cue jump-footwork reaction",skillSecondary:"Jump entry → landing stick → balance",conditioningSecondary:"Jump-quality repeat interval",cooldown:"Calf + hip recovery mobility"};
 }
 return {warmup:"Wrestling hip + shoulder movement prep",prep:"Stance motion + level-change rehearsal",speedSecondary:"Stance reaction → penetration step",reactive:"Opponent-cue shot/sprawl reaction",skillSecondary:"Shot entry → sprawl → re-attack",conditioningSecondary:"Match-position repeat interval",cooldown:"Hip + shoulder recovery mobility"};
}

function Program({accountRole,sport,profile,dev,results,readiness,program,setProgram,setWorkouts}:{accountRole:AccountRole;sport:Sport;profile:Profile;dev:DevelopmentItem[];results:Result[];readiness:ReadinessLog[];program:TrainingProgram|null;setProgram:React.Dispatch<React.SetStateAction<TrainingProgram|null>>;setWorkouts:any}){
 const [focus,setFocus]=useState("Balanced");
 const [days,setDays]=useState("4");
 const [equipment,setEquipment]=useState<"Gym Access"|"Body Weight Only">("Gym Access");
 const [seasonPhase,setSeasonPhase]=useState<"Off-season"|"Pre-season"|"In-season">("Off-season");
 const [generationNote,setGenerationNote]=useState("");
 const [workoutMinutes,setWorkoutMinutes]=useState("30");
 const [customName,setCustomName]=useState("My Custom Workout");
 const [customDate,setCustomDate]=useState(today());
 const [customCategory,setCustomCategory]=useState("Skill");
 const [customMinutes,setCustomMinutes]=useState("45");
 const [customIntensity,setCustomIntensity]=useState<"Easy"|"Moderate"|"Hard">("Moderate");
 const [customFocus,setCustomFocus]=useState("");
 const blankCustomExercise=():ProgramExercise=>({phase:"Main",name:"",sets:"3",reps:"8 reps",rest:"60 sec",notes:"",instructions:""});
 const [customExercises,setCustomExercises]=useState<ProgramExercise[]>([blankCustomExercise()]);
 const [customMessage,setCustomMessage]=useState("");

 const demands=positionTrainingProfile(sport,profile.position);
 const sportPlan=sportSessionProfile(sport,profile.position);
 const ageNumber=Number(profile.age||0);
 const validAge=Number.isFinite(ageNumber)&&ageNumber>=6&&ageNumber<=99;
 const trainingAge=programmingAge(validAge?ageNumber:19);
 const trainingGroup=programmingAgeGroup(validAge?ageNumber:19);
 const agePlan=ageTrainingProfile(trainingAge);
 const durationRule=workoutDurationRule(validAge?ageNumber:13);
 const durationOptions=Array.from({length:Math.floor((durationRule.max-durationRule.min)/durationRule.step)+1},(_,i)=>durationRule.min+i*durationRule.step);
 const selectedWorkoutMinutes=Math.max(durationRule.min,Math.min(durationRule.max,Number(workoutMinutes)||durationRule.min));
 const durationRoleLabel=accountRole==="Coach"||accountRole==="Admin"?"Assigned Workout Length":"Workout Length";
 useEffect(()=>{
  const current=Number(workoutMinutes)||durationRule.min;
  if(current<durationRule.min||current>durationRule.max)setWorkoutMinutes(String(Math.max(durationRule.min,Math.min(durationRule.max,agePlan.sessionMinutes))));
  setCustomMinutes(x=>{
   const n=Number(x)||durationRule.min;
   return String(Math.max(durationRule.min,Math.min(durationRule.max,n)));
  });
 },[ageNumber,durationRule.min,durationRule.max]);

 const latestReadiness=readiness.find(r=>r.date===today())||readiness[0];
 const readinessScore=latestReadiness?readinessScoreV2(latestReadiness,Number(profile.age||0)):0;
 const reduceVolume=readinessScore>0&&readinessScore<60;
 const effectiveEquipment=agePlan.lightLoadsOnly?"Body Weight Only":equipment;
 const strengthList=effectiveEquipment==="Gym Access"?demands.gymStrength:demands.bodyStrength;

 const ageSets=(normal:number,min=1)=>{
  let count=Math.min(normal,agePlan.maxStrengthSets);
  if(seasonPhase==="In-season"&&count>2)count-=1;
  if(reduceVolume&&count>min)count-=1;
  return String(Math.max(min,count));
 };
 const speedSets=(normal:number)=>{
  let count=normal;
  if(trainingAge<=8)count=Math.min(count,3);
  else if(trainingAge<=13)count=Math.min(count,4);
  if(seasonPhase==="In-season"&&count>3)count-=1;
  if(reduceVolume&&count>2)count-=1;
  return String(Math.max(2,count));
 };
 const conditioningRounds=Math.max(3,agePlan.conditioningRounds-(seasonPhase==="In-season"?2:0)-(reduceVolume?1:0));
 const ex=(phase:ProgramExercise["phase"],name:string,sets:string,reps:string,rest:string,notes:string,instructions?:string):ProgramExercise=>({phase,name,sets,reps,rest,notes,instructions});

 const fitExercisesToDuration=(base:ProgramExercise[],target:number):ProgramExercise[]=>{
  if(!base.length)return base;
  let selected=[...base];
  if(target<=20&&base.length>4){
   const warm=base.filter(x=>x.phase==="Warm-up").slice(0,1);
   const work=base.filter(x=>x.phase!=="Warm-up"&&x.phase!=="Cooldown").slice(0,3);
   const cool=base.filter(x=>x.phase==="Cooldown").slice(-1);
   selected=[...warm,...work,...cool];
  }else if(target<=30&&base.length>6){
   selected=[...base.slice(0,5),...base.filter(x=>x.phase==="Cooldown").slice(-1)];
  }
  const baseMinutes=Math.max(15,agePlan.sessionMinutes);
  const factor=target/baseMinutes;
  return selected.map(item=>{
   const numeric=/^\d+$/.test(item.sets)?Number(item.sets):null;
   const sets=numeric?String(Math.max(1,Math.min(trainingAge<=13?4:6,Math.round(numeric*factor)))):item.sets;
   return {...item,sets,notes:`${item.notes} Target session length: ${target} minutes.`};
  });
 };

 const sportWarmup=[
  ex("Warm-up",sportPlan.warmup,"1","4–6 min","—",`Prepare the joints and movement ranges used most in ${sport}. Keep it easy and controlled.`),
  ex("Warm-up",sportPlan.prep,ageSets(2),trainingAge<=13?"2–3 controlled reps / direction":"3–4 reps / direction","20–40 sec",`${profile.position} movement preparation before faster work.`)
 ];

 const buildExercises=(category:"speed"|"strength"|"skill"|"conditioning"):ProgramExercise[]=>{
  const recoveryNote=reduceVolume?"Readiness is below 60 today: volume was reduced. Keep effort submaximal and stop if movement quality drops.":`${agePlan.coachingNote}`;
  const youthStrengthNote=trainingAge<=13?"Use bodyweight or light resistance and prioritize technique over load.":"Use a load that preserves technique and leaves quality repetitions in reserve.";

  if(category==="speed")return [
   ...sportWarmup,
   ex("Sport",demands.speed,speedSets(4),agePlan.speedReps,"75–120 sec",`${demands.role}: ${demands.priorities[0]} emphasis. Full recovery protects speed quality.`),
   ex("Sport",sportPlan.speedSecondary,speedSets(3),agePlan.speedReps,"75–120 sec",`A second ${sport}/${profile.position} speed pattern so the session is not built from generic sprint work.`),
   ex("Main",demands.power,ageSets(3),agePlan.powerReps,"75–90 sec",`Explosive intent with controlled landings. ${trainingAge<=13?"Keep jumps simple and low volume.":"Stop before jump height or distance drops."}`),
   ex("Sport",sportPlan.reactive,ageSets(3),"3–4 reactions / side","60–90 sec","React to an external cue instead of pre-planning every repetition."),
   ex("Cooldown",sportPlan.cooldown,"1","4–6 min","—",recoveryNote)
  ];

  if(category==="strength")return [
   ...sportWarmup,
   ex("Main",strengthList[0],ageSets(3),agePlan.strengthReps,"75–120 sec",`${demands.role} foundation strength. ${youthStrengthNote}`),
   ex("Main",strengthList[1]||"Reverse lunge",ageSets(3),agePlan.strengthReps,"75–90 sec",`Build lower-body or unilateral force that supports ${demands.priorities[0].toLowerCase()}. ${youthStrengthNote}`),
   ex("Main",strengthList[2]||"Band row",ageSets(3),agePlan.strengthReps,"60–90 sec","Build balanced total-body strength without sacrificing movement quality."),
   ex("Main",strengthList[3]||"Push-up",ageSets(2),agePlan.strengthReps,"60–90 sec",`Use the simplest variation that the athlete can perform well for every repetition.`),
   ex("Finisher",demands.robustness,ageSets(2),trainingAge<=13?"15–25 sec / side":"20–40 sec / side","45–60 sec",`${profile.position}-relevant trunk, hip, shoulder, or lower-leg robustness.`),
   ex("Cooldown",sportPlan.cooldown,"1","4–6 min","—",recoveryNote)
  ];

  if(category==="skill")return [
   ...sportWarmup,
   ex("Sport",demands.skill,speedSets(4),trainingAge<=13?"3–4 clean reps":"4–6 quality reps","45–75 sec",`Primary ${sport}/${profile.position} movement skill. Prioritize perception, decision, and clean execution.`),
   ex("Sport",sportPlan.skillSecondary,ageSets(3),trainingAge<=13?"3–4 clean reps":"4–6 quality reps","45–75 sec","A second position-specific pattern to create real transfer instead of repeating a generic reaction drill."),
   ex("Sport",sportPlan.reactive,ageSets(2),"3–4 reactions / side","60 sec","React to a visual, verbal, partner, ball, puck, or opponent cue appropriate to the sport."),
   ex("Main",demands.power,ageSets(2),agePlan.powerReps,"75 sec","Low-volume power supports sport skill without adding unnecessary fatigue."),
   ex("Finisher",demands.robustness,ageSets(2),trainingAge<=13?"15–25 sec / side":"20–30 sec / side","45 sec","Finish with controlled position-relevant robustness work."),
   ex("Cooldown",sportPlan.cooldown,"1","4–6 min","—",recoveryNote)
  ];

  return [
   ...sportWarmup,
   ex("Sport",demands.conditioning,String(conditioningRounds),"Work / rest as written","—",`${demands.role} conditioning matched to the sport's work-rest pattern. Maintain repeat quality rather than making every interval all-out.`),
   ex("Sport",sportPlan.conditioningSecondary,String(Math.max(3,conditioningRounds-1)),trainingAge<=13?"10–20 sec quality work":"15–30 sec quality work","45–120 sec","A second sport/position conditioning pattern using the movement demands of the athlete's role."),
   ex("Main",trainingAge<=13?"Easy aerobic movement game":"Low-intensity aerobic recovery","1",trainingAge<=13?"5–8 min":"6–10 min conversational pace","—","Build aerobic support without adding another hard interval block."),
   ex("Finisher",demands.robustness,ageSets(2),trainingAge<=13?"15–25 sec / side":"20–30 sec / side","45 sec","Finish with controlled robustness work."),
   ex("Cooldown",sportPlan.cooldown,"1","4–6 min","—",recoveryNote)
  ];
 };

 const generate=()=>{
  if(!profile.position){alert("Choose the athlete's position in Player Profile first so the program can be position-specific.");return;}
  if(!validAge){alert("Enter the player's age in Player Profile first so the program can be age-appropriate.");return;}
  const requested=Math.max(2,Math.min(6,Number(days)||4));
  const n=Math.min(requested,agePlan.maxDays);
  setGenerationNote(requested>n?`Age ${ageNumber} uses ${trainingGroup}. This plan was limited to ${n} structured training days per week. The training group emphasizes ${agePlan.emphasis.toLowerCase()}.`:agePlan.lightLoadsOnly&&equipment==="Gym Access"?`Age ${ageNumber} uses ${trainingGroup}. Gym access noted, but this training group uses bodyweight, bands, and light implements first.`:`Age ${ageNumber} · ${trainingGroup}: ${agePlan.emphasis}. Workout length still follows ${durationRule.label}.`);
  const week=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  if(sport==="Ice Hockey"&&profile.position.toLowerCase().includes("goal")&&ageNumber>=7&&ageNumber<=8){
   const blocks=youthGoalieVerifiedBlocks(ageNumber);
   const requestedDays=Math.max(2,Math.min(3,n));
   const combinations=[[0,1],[1,2],[0,2]];
   const sessions:ProgramSession[]=Array.from({length:requestedDays},(_,i)=>{
    const chosen=combinations[i%combinations.length].flatMap(index=>blocks[index].exercises.map(x=>({...x})));
    const exercises=fitExercisesToDuration(chosen,selectedWorkoutMinutes);
    const refs=verifiedVideosForSession(sport,profile.position,ageNumber,exercises,selectedWorkoutMinutes);
    return {
     id:Date.now()+i,
     day:week[i],
     name:`${selectedWorkoutMinutes}-Min Youth Goalie Off-Ice`,
     category:i===0?"Mobility + Strength":i===1?"Strength + Conditioning":"Mobility + Movement",
     minutes:selectedWorkoutMinutes,
     focus:i===0?"Hip mobility + bodyweight strength":i===1?"Goalie strength + lateral stamina":"Mobility + dryland goalie movement",
     completed:false,
     exercises,
     referenceVideos:refs,
     environment:"Off-Ice"
    };
   });
   const videoNote=sessions.some(x=>x.referenceVideos?.length)
    ?"Every attached video passed sport + training-age group + exact position + environment + exercise + duration checks."
    :"No exact-match video bundle is verified for this routine yet, so written instructions are shown without a video.";
   setGenerationNote(`Age ${ageNumber} · Training group: ${trainingGroup} · ${durationRule.label} · ${durationRoleLabel}: ${selectedWorkoutMinutes} minutes. ${videoNote}`);
   setProgram({id:Date.now(),created:today(),sport,position:profile.position,focus:`Youth Goalie Off-Ice · ${seasonPhase}`,daysPerWeek:requestedDays,sessions,equipment:"Body Weight Only",age:ageNumber,ageBand:agePlan.label,environment:"Off-Ice",targetMinutes:selectedWorkoutMinutes,assignedByRole:accountRole});
   return;
  }

  const balancedByDays:Record<number,("speed"|"strength"|"skill"|"conditioning")[]>={
   2:["speed","strength"],3:["speed","strength","skill"],4:["speed","strength","skill","conditioning"],5:["speed","strength","skill","strength","conditioning"],6:["speed","strength","skill","speed","strength","conditioning"]
  };
  let cycle=focus==="Balanced"?balancedByDays[n]:Array(n).fill(focus.toLowerCase()) as ("speed"|"strength"|"skill"|"conditioning")[];
  if(seasonPhase==="In-season"&&focus==="Balanced")cycle=balancedByDays[n].map((x,i)=>i===n-1&&x==="conditioning"?"skill":x);
  const priorityObjective=dev.filter(d=>d.status!=="Complete").sort((a,b)=>({High:0,Medium:1,Low:2}[a.priority||"Medium"])-({High:0,Medium:1,Low:2}[b.priority||"Medium"]))[0]?.title;
  const sessions:ProgramSession[]=Array.from({length:n},(_,i)=>{
   const category=cycle[i%cycle.length];
   const title=category==="speed"?`${demands.role} Speed + Power`:category==="strength"?`${demands.role} Strength`:category==="skill"?`${demands.role} Movement + Skill`:`${demands.role} Conditioning`;
   const isYouthHockeyGoalie=sport==="Ice Hockey"&&profile.position==="Goaltender"&&ageNumber>=9&&ageNumber<=13;
   let exercises:ProgramExercise[];
   let supportVideos:RoutineReference[]|undefined;
   let sessionName=`${selectedWorkoutMinutes}-Min ${title}`;
   let sessionCategory=category==="speed"?"Speed + Power":category[0].toUpperCase()+category.slice(1);
   let sessionFocus=priorityObjective||demands.priorities[i%demands.priorities.length];

   if(isYouthHockeyGoalie&&i===0){
    const mobility=youthGoalieMobilityExercises();
    if(selectedWorkoutMinutes<=15){
     exercises=mobility;
     sessionName="15-Min Young Goalie Mobility · Off-Ice";
     sessionCategory="Mobility";
     sessionFocus="Safe hip, groin, hamstring, lat, and ankle mobility";
    }else{
     const extra=fitExercisesToDuration(buildExercises(category),Math.max(15,selectedWorkoutMinutes-12))
      .filter(x=>!x.name.toLowerCase().includes("mobility")&&x.phase!=="Cooldown")
      .slice(0,selectedWorkoutMinutes<=30?2:4);
     exercises=[...mobility,...extra];
     sessionName=`${selectedWorkoutMinutes}-Min Young Goalie ${title} · Off-Ice`;
     sessionFocus=`Verified youth-goalie mobility + ${sessionFocus}`;
    }
    supportVideos=[verifiedExerciseBlockCatalog[0]];
   }else{
    exercises=fitExercisesToDuration(buildExercises(category),selectedWorkoutMinutes);
   }

   const referenceVideos=verifiedVideosForSession(sport,profile.position,ageNumber,exercises,selectedWorkoutMinutes);
   return {id:Date.now()+i,day:week[i],name:sessionName,category:sessionCategory,minutes:selectedWorkoutMinutes,focus:sessionFocus,completed:false,exercises,referenceVideos,supportVideos,environment:sport==="Ice Hockey"?"Off-Ice":undefined};
  });
  setProgram({id:Date.now(),created:today(),sport,position:profile.position,focus:`${focus} · ${seasonPhase}`,daysPerWeek:n,sessions:sessions.map(session=>({...session,environment:sport==="Ice Hockey"?"Off-Ice":session.environment})),equipment:effectiveEquipment,age:ageNumber,ageBand:agePlan.label,environment:sport==="Ice Hockey"?"Off-Ice":undefined,targetMinutes:selectedWorkoutMinutes,assignedByRole:accountRole});
 };

 const toggle=(id:number)=>setProgram(x=>x?{...x,sessions:x.sessions.map(session=>session.id===id?{...session,completed:!session.completed}:session)}:x);
 const addToCalendar=()=>{
  if(!program)return;
  const start=new Date();
  const dayIndex:Record<string,number>={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};
  const current=start.getDay();
  setWorkouts((existing:Workout[])=>[
   ...program.sessions.map((session,i)=>{
    let offset=(dayIndex[session.day]-current+7)%7;if(offset===0&&i>0)offset=7;
    const d=new Date(start);d.setDate(start.getDate()+offset);
    return {id:Date.now()+i,date:localDate(d),name:session.name,category:session.category,minutes:session.minutes,completed:false,sport,intensity:session.category.includes("Conditioning")?"Hard" as const:"Moderate" as const,focus:`${session.focus} · ${profile.position} · age ${program.age||profile.age||"—"}`,source:(session.referenceVideos?.length?"Verified Routine":"Generated") as Workout["source"],exercises:session.exercises?.map(x=>({...x})),referenceVideos:session.referenceVideos?.map(x=>({...x})),supportVideos:session.supportVideos?.map(x=>({...x})),environment:session.environment,assignedByRole:program.assignedByRole};
   }),...existing
  ]);
 };

 const updateCustomExercise=(index:number,patch:Partial<ProgramExercise>)=>setCustomExercises(x=>x.map((exercise,i)=>i===index?{...exercise,...patch}:exercise));
 const removeCustomExercise=(index:number)=>setCustomExercises(x=>x.filter((_,i)=>i!==index));
 const addCustomExercise=()=>setCustomExercises(x=>[...x,blankCustomExercise()]);
 const saveCustomWorkout=()=>{
  const usable=customExercises.filter(x=>x.name.trim()).map(x=>({...x,name:x.name.trim(),notes:x.notes.trim(),instructions:x.instructions?.trim()}));
  if(!customName.trim()){setCustomMessage("Give the custom workout a name first.");return;}
  if(!usable.length){setCustomMessage("Add at least one named exercise before saving.");return;}
  const item:Workout={id:Date.now(),date:customDate,name:customName.trim(),category:customCategory,minutes:Number(customMinutes)||45,completed:false,sport,intensity:customIntensity,focus:customFocus.trim(),source:"Custom",exercises:usable,environment:sport==="Ice Hockey"?"Off-Ice":undefined,assignedByRole:accountRole};
  setWorkouts((existing:Workout[])=>[item,...existing]);
  setCustomMessage(`Saved “${item.name}” to Schedule for ${item.date}.`);
 };

 const completion=program?.sessions.length?Math.round(program.sessions.filter(x=>x.completed).length/program.sessions.length*100):0;

 return <><div className="sectionDivider"><span><i/>Training Program</span></div>
 <div className="hero scienceProgramHero"><small>EVIDENCE-INFORMED · AGE-AWARE</small><h1>Sport + Position + Age Workout Builder</h1><p>{sport}{profile.position?" · "+profile.position:" · Select a position in Player Profile"}{profile.age?` · age ${profile.age}`:" · age required"} · Recommendations combine sport demands, exact position, chronological age, season phase, readiness, and available equipment.{sport==="Ice Hockey"?" Hockey recommendations in this builder are OFF-ICE / dryland only.":""}</p></div>

 <div className="scienceBasisCard">
  <div><small>POSITION DEMANDS</small><b>{demands.role}</b><span>{demands.priorities.join(" · ")}</span></div>
  <div><small>AGE / TRAINING GROUP</small><b>{validAge?`Age ${ageNumber} · ${trainingGroup}`:"Age needed"}</b><span>{validAge?`${agePlan.emphasis}. ${ageNumber===9?"Age 9 intentionally uses the 10–13 training and exercise standards.":""}`:"Add age in Player Profile before generating a plan."}</span></div>
  <div><small>READINESS</small><b>{readinessScore?`${readinessScore}/100`:"No check-in today"}</b><span>{reduceVolume?"Volume automatically reduced for this generated plan.":"Normal quality-focused volume."}</span></div>
 </div>

 <div className="card programBuilderSimple">
  <div className="sectionHead"><div><h2>Generate Recommended Program</h2><small>Sport, exact position, and training age group come from Player Profile. The same rules apply to every sport and every position. Age 9 uses the 10–13 training/exercise group while keeping the age 7–9 workout-length limits.</small></div><span className="tag">{sport} · {profile.position||"Position needed"} · {profile.age?`age ${profile.age}`:"Age needed"}</span></div>
  <div className="programSimpleInputs">
   <label>Primary Focus<select value={focus} onChange={e=>setFocus(e.target.value)}>{["Balanced","Speed","Strength","Skill","Conditioning"].map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Season Phase<select value={seasonPhase} onChange={e=>setSeasonPhase(e.target.value as "Off-season"|"Pre-season"|"In-season")}><option>Off-season</option><option>Pre-season</option><option>In-season</option></select></label>
   <label>Requested Days / Week<select value={days} onChange={e=>setDays(e.target.value)}>{["2","3","4","5","6"].map(x=><option key={x}>{x}</option>)}</select></label>
   <label>{durationRoleLabel}<select value={String(selectedWorkoutMinutes)} onChange={e=>setWorkoutMinutes(e.target.value)}>{durationOptions.map(x=><option key={x} value={x}>{x} minutes</option>)}</select><small>{durationRule.label}</small></label>
   <label>Equipment<select value={equipment} onChange={e=>setEquipment(e.target.value as "Gym Access"|"Body Weight Only")}><option>Gym Access</option><option>Body Weight Only</option></select></label>
  </div>
  <div className="scienceRules"><span>✓ Universal rules across every sport and position</span><span>✓ Exact sport + exact position exercise selection</span><span>✓ Training group: {trainingGroup}</span><span>✓ Age 9 joins the 10–13 training/exercise group</span><span>✓ {durationRule.label}</span><span>✓ {accountRole==="Coach"||accountRole==="Admin"?"Coach/Admin assigns session length":"Player selects session length"}</span><span>✓ Readiness + season adjustments</span>{sport==="Ice Hockey"&&<span>✓ Hockey workouts are off-ice / dryland only</span>}<span>✓ Video must match sport + training age group + exact position + exercises + selected duration</span><span>✓ Multiple verified short videos may be combined only when they cover the full exercise list and exactly fill the selected time</span></div>
  <button className="primary" onClick={generate}>Generate {profile.position||sport} Workouts</button>
  {generationNote&&<div className="ageGenerationNote"><b>Age-aware adjustment</b><span>{generationNote}</span></div>}
  <small className="programSafetyNote">Chronological age is one programming input, not a measurement of biological maturity or training experience. Youth athletes need appropriate supervision and technically sound progression. Stop painful movements and use qualified coaching or medical guidance when needed.</small>
 </div>

 <div className="card customWorkoutBuilder">
  <div className="sectionHead"><div><h2>Create Your Own Custom Workout</h2><small>Players can build a complete workout exercise-by-exercise and save it directly to Schedule.</small></div><span className="tag">CUSTOM · {sport}</span></div>
  <div className="programSimpleInputs">
   <label>Workout Name<input value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="e.g. Tuesday Skills + Strength"/></label>
   <label>Date<input type="date" value={customDate} onChange={e=>setCustomDate(e.target.value)}/></label>
   <label>Category<select value={customCategory} onChange={e=>setCustomCategory(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></label>
   <label>{accountRole==="Coach"||accountRole==="Admin"?"Assigned Duration":"Duration"}<select value={customMinutes} onChange={e=>setCustomMinutes(e.target.value)}>{durationOptions.map(x=><option key={x} value={x}>{x} min</option>)}</select><small>{durationRule.label}</small></label>
   <label>Intensity<select value={customIntensity} onChange={e=>setCustomIntensity(e.target.value as "Easy"|"Moderate"|"Hard")}><option>Easy</option><option>Moderate</option><option>Hard</option></select></label>
   <label>Session Focus<input value={customFocus} onChange={e=>setCustomFocus(e.target.value)} placeholder="What do you want to improve?"/></label>
  </div>
  <div className="customExerciseList">{customExercises.map((exercise,index)=><div className="customExerciseEditor" key={index}>
   <div className="customExerciseHead"><b>Exercise {index+1}</b>{customExercises.length>1&&<button onClick={()=>removeCustomExercise(index)}>Remove</button>}</div>
   <div className="customExerciseInputs">
    <label>Phase<select value={exercise.phase} onChange={e=>updateCustomExercise(index,{phase:e.target.value as ProgramExercise["phase"]})}>{["Warm-up","Main","Sport","Finisher","Cooldown"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Exercise<input value={exercise.name} onChange={e=>updateCustomExercise(index,{name:e.target.value})} placeholder="Exercise or drill name"/></label>
    <label>Sets<input value={exercise.sets} onChange={e=>updateCustomExercise(index,{sets:e.target.value})} placeholder="e.g. 3"/></label>
    <label>Reps / Time<input value={exercise.reps} onChange={e=>updateCustomExercise(index,{reps:e.target.value})} placeholder="e.g. 8 reps or 20 sec"/></label>
    <label>Rest<input value={exercise.rest} onChange={e=>updateCustomExercise(index,{rest:e.target.value})} placeholder="e.g. 60 sec"/></label>
    <label>Purpose / Notes<input value={exercise.notes} onChange={e=>updateCustomExercise(index,{notes:e.target.value})} placeholder="Why this is in the workout"/></label>
   </div>
   <label>Instructions<input value={exercise.instructions||""} onChange={e=>updateCustomExercise(index,{instructions:e.target.value})} placeholder="Optional coaching cues or personal instructions"/></label>
  </div>)}</div>
  <div className="customWorkoutActions"><button onClick={addCustomExercise}>+ Add Exercise</button><button className="primary" onClick={saveCustomWorkout}>Save Custom Workout to Schedule</button></div>
  {customMessage&&<div className="customWorkoutMessage" role="status">{customMessage}</div>}
 </div>

 <div className="verifiedDemoPolicy"><b>Universal strict video rule</b><span>This applies to every athlete, sport, position, and age. A workout may use one full video or several short videos—for example, three verified 5-minute videos for a 15-minute session. The bundle is shown only when sport, training age group, exact position, required environment, exercises, and total video time all match the generated workout. Otherwise the app shows written instructions and no video.</span></div>

 {program&&<><div className="programOverview">
  <div><small>SPORT / POSITION</small><b>{program.sport} · {program.position||"General"}</b></div>
  <div><small>AGE / TRAINING GROUP</small><b>{program.age?`Age ${program.age} · ${programmingAgeGroup(program.age)}`:"Legacy program"}</b></div>
  <div><small>PROGRAM</small><b>{program.focus}</b></div>
  <div><small>ACCESS</small><b>{program.equipment||"Legacy"}</b></div>
  <div><small>ENVIRONMENT</small><b>{program.environment||"Training area"}</b></div>
  <div><small>WORKOUT LENGTH</small><b>{program.targetMinutes||program.sessions[0]?.minutes||"—"} min</b></div>
  <div><small>{program.assignedByRole==="Coach"||program.assignedByRole==="Admin"?"ASSIGNED BY":"SELECTED BY"}</small><b>{program.assignedByRole||accountRole}</b></div>
  <div><small>COMPLETE</small><b>{completion}%</b></div>
 </div>

 <div className="card"><div className="sectionHead"><div><h2>Current Program</h2><small>{demands.priorities.join(" · ")}</small></div><span>{completion}% complete</span></div><div className="progress"><i style={{width:`${completion}%`}}/></div><button className="primary" onClick={addToCalendar}>Add Program to Schedule</button></div>

 {program.sessions.map((session,sessionIndex)=><div className={"card programSession completeSession "+(session.completed?"sessionDone":"")} key={session.id}>
  <div className="programDayHeader"><div><span className="tag">DAY {sessionIndex+1} · {session.day} · {session.category}</span><h2>{session.name}</h2><p>{session.minutes} min · Focus: {session.focus}{session.environment?` · ${session.environment}`:""}</p><small className="sessionInstruction">{session.referenceVideos?.length?`${session.referenceVideos.length} verified matching video${session.referenceVideos.length===1?"":"s"} support this workout. Every linked video passed sport, age, position, environment, and exercise checks.`:"No video is shown because no exact sport + training-age group + position + exercise + duration match has been verified for this workout yet."}</small></div><button className={session.completed?"completedAction":"featureAction"} onClick={()=>toggle(session.id)}>{session.completed?"✓ Complete":"Mark Day Complete"}</button></div>
  {session.supportVideos?.map((video,index)=><VerifiedSupportVideoCard video={video} key={`${session.id}-support-${index}`}/>)}
  {session.referenceVideos?.length?<div className="routineReferenceBundle"><div className="routineBundleHead"><small>VERIFIED VIDEO BUNDLE</small><b>{session.referenceVideos.length} matching reference video{session.referenceVideos.length===1?"":"s"}</b><span>Use the videos in order with the exercise list below.</span></div>{session.referenceVideos.map((video,index)=><div className="routineReferenceCard" key={`${session.id}-video-${index}`}><div><small>VIDEO {index+1}{video.section?` · ${video.section}`:""}</small><b>{video.title}</b><p>{video.matchNote}</p><span>{video.durationMinutes?`${video.durationMinutes} min · `:""}Source: {video.source}</span></div><a href={video.url} target="_blank" rel="noreferrer">▶ Watch Matching Video</a></div>)}</div>:<div className="noVerifiedVideo"><b>No exact-match video attached</b><span>No full-workout video is shown unless sport + training age + position + exercises + duration all match. Verified exercise-block videos may still appear above.</span></div>}
  <div className="mentalPrepWorkoutReminder"><div className="mentalPrepReminderIcon">◎</div><div><b>Start with Mental Preparation & Breathing</b><p>Settle attention, then complete 6–10 rounds of Reilly Rescue Breathing followed by 6–10 rounds of Box Breathing.</p></div></div>
  {session.exercises?.length?<div className="exerciseTable">
   <div className="exerciseTableHead"><span>Exercise & How To</span><span>Sets</span><span>Reps / Time</span><span>Rest</span></div>
   {session.exercises.map((exercise,i)=><div className="exerciseRow" key={`${session.id}-${i}`}>
    <div><span className={"exercisePhase "+exercise.phase.toLowerCase().replace("-","")}>{exercise.phase}</span><b>{exercise.name}</b><div className="exercisePrescription"><strong>{exercise.sets} sets · {exercise.reps} · Rest {exercise.rest}</strong></div><small className="exercisePurpose">{exercise.notes}</small><div className="simpleInstruction"><b>Quick cue:</b> {exercise.instructions||simpleExerciseInstruction(exercise.name)}</div><DetailedExerciseGuide exercise={exercise} sport={sport} position={profile.position} age={ageNumber}/></div>
    <span data-label="Sets">{exercise.sets}</span><span data-label="Reps / Time">{exercise.reps}</span><span data-label="Rest">{exercise.rest}</span>
   </div>)}
  </div>:null}
 </div>)}

 <div className="card scienceSourceNote"><small>SPORTS SCIENCE BASIS</small><p>This generator individualizes sport and position demands, then uses age to scale session duration, weekly frequency, strength volume, power volume, and exercise progression. Readiness and season phase further adjust volume. Because growth and maturation vary between athletes, age is treated as a guardrail rather than a complete maturity assessment.</p></div>
 </>}
 </>;
}

function Readiness({sport,profile,readiness,setReadiness,weeklyReviews,coachNotes,setCoachNotes,program,workouts,accountRole="Coach",authorName="",saveSharedNotes}:{sport:Sport;profile:Profile;readiness:ReadinessLog[];setReadiness:React.Dispatch<React.SetStateAction<ReadinessLog[]>>;weeklyReviews:WeeklyReview[];coachNotes:CoachNote[];setCoachNotes:React.Dispatch<React.SetStateAction<CoachNote[]>>;program:TrainingProgram|null;workouts:Workout[];accountRole?:AccountRole;authorName?:string;saveSharedNotes?:((notes:unknown[])=>Promise<void>)}){
 const [sleep,setSleep]=useState("8"),[soreness,setSoreness]=useState("3"),[energy,setEnergy]=useState("7"),[stress,setStress]=useState("3"),[notes,setNotes]=useState("");
 const [noteTitle,setNoteTitle]=useState(""),[noteText,setNoteText]=useState(""),[noteCategory,setNoteCategory]=useState("General");
 const defaultNoteAuthor=accountRole==="Player"?"Athlete":accountRole==="Parent"?"Parent":accountRole==="Admin"?"Admin":"Coach";
 const [noteAuthorType,setNoteAuthorType]=useState<"Coach"|"Parent"|"Athlete"|"Medical Provider"|"Admin">(defaultNoteAuthor);
 const [noteAuthorName,setNoteAuthorName]=useState(authorName||defaultNoteAuthor);
 const [sharedNoteMessage,setSharedNoteMessage]=useState("");
 const [wakeTime,setWakeTime]=useState("07:00");
 const [sleepGuideOpen,setSleepGuideOpen]=useState(accountRole!=="Parent");
 const [mindfulnessOpen,setMindfulnessOpen]=useState(accountRole!=="Parent");
 const [meditationLength,setMeditationLength]=useState<"3"|"5"|"10">("5");
 const [meditationStep,setMeditationStep]=useState(0);
 const saveReadiness=()=>{
  if(accountRole!=="Player")return;
  const item:ReadinessLog={id:Date.now(),date:today(),sleep:Number(sleep)||0,soreness:Number(soreness)||0,energy:Number(energy)||0,stress:Number(stress)||0,notes};
  setReadiness(x=>[item,...x.filter(r=>r.date!==item.date)]);
  setNotes("");
 };
 useEffect(()=>{
  const next=accountRole==="Player"?"Athlete":accountRole==="Parent"?"Parent":accountRole==="Admin"?"Admin":"Coach";
  setNoteAuthorType(next);
  setNoteAuthorName(authorName||next);
 },[accountRole,authorName]);

 const saveSharedSupportNote=async()=>{
  if(!noteTitle.trim()&&!noteText.trim())return;
  const item:CoachNote={id:Date.now(),date:today(),title:noteTitle.trim()||"Shared Note",note:noteText.trim(),category:noteCategory,authorType:noteAuthorType,authorName:noteAuthorName.trim()||noteAuthorType,shared:true};
  const next=[item,...coachNotes];
  setCoachNotes(next);
  setSharedNoteMessage("Shared note saved.");
  try{if(saveSharedNotes)await saveSharedNotes(next)}catch(err:any){setSharedNoteMessage(err?.message||"The note is saved on this device, but cloud sharing failed.");}
  setNoteTitle("");setNoteText("");
 };
 const calc=(r:ReadinessLog)=>readinessScoreV2(r,Number(profile.age||0));
 const todayLog=readiness.find(r=>r.date===today());
 const score=todayLog?calc(todayLog):0;
 const recent=readiness.slice(0,7);
 const avg7=recent.length?Math.round(recent.reduce((a,r)=>a+calc(r),0)/recent.length):0;
 const yesterday=readiness.find(r=>r.date<today());
 const delta=todayLog&&yesterday?score-calc(yesterday):0;
 const status=score>=80?"Ready to Train":score>=60?"Train with Moderation":score>0?"Recovery Focus":"Log Today";
 const nextWorkout=workouts.filter(w=>w.sport===sport&&!w.completed&&w.date>=today()).sort((a,b)=>a.date.localeCompare(b.date))[0];
 const athleteAge=Number(profile.age||0);
 const sleepTarget=readinessSleepTarget(athleteAge);
 const todayBreakdown=todayLog?readinessBreakdown(todayLog,athleteAge):null;
 const recentThree=readiness.slice(0,3);
 const avg3=recentThree.length?Math.round(recentThree.reduce((a,r)=>a+calc(r),0)/recentThree.length):0;
 const priorThree=readiness.slice(3,6);
 const priorAvg3=priorThree.length?Math.round(priorThree.reduce((a,r)=>a+calc(r),0)/priorThree.length):0;
 const trend3=priorAvg3?avg3-priorAvg3:0;
 const readinessLimiter=todayBreakdown?[["Sleep",todayBreakdown.sleep],["Energy",todayBreakdown.energy],["Soreness",todayBreakdown.soreness],["Stress",todayBreakdown.stress]].sort((a,b)=>Number(a[1])-Number(b[1]))[0]:null;
 const bedtimeForHours=(hours:number)=>{
  const [hh,mm]=wakeTime.split(":").map(Number);
  if(!Number.isFinite(hh)||!Number.isFinite(mm))return "—";
  const total=((hh*60+mm)-hours*60+24*60)%(24*60);
  const h=Math.floor(total/60),m=total%60;
  const hour12=h%12||12;
  return `${hour12}:${String(m).padStart(2,"0")} ${h<12?"AM":"PM"}`;
 };
 const targetBedtimeWindow=`${bedtimeForHours(sleepTarget.max)} – ${bedtimeForHours(sleepTarget.min)}`;
 const sleepStatus=!todayLog?"Start logging sleep":todayLog.sleep>=sleepTarget.min?"On target":todayLog.sleep>=sleepTarget.min-1?"Close to target":"Below target";
 const meditationMinutes=Number(meditationLength);
 const meditationSteps=meditationLength==="3"?[
  {title:"Arrive",time:"30 sec",body:"Sit or lie down comfortably. Let the shoulders drop, unclench the jaw, and notice where the body is supported. Eyes can be open with a soft gaze or closed."},
  {title:"Follow the breath",time:"90 sec",body:"Notice one full inhale and one full exhale at a time. Do not make the breath bigger than comfortable. When attention wanders, quietly notice it and return to the next breath."},
  {title:"Body reset",time:"45 sec",body:"Notice the forehead, jaw, shoulders, hands, stomach, hips, and legs. Let each area soften as much as it comfortably can."},
  {title:"Return",time:"15 sec",body:"Notice the room again. Choose one simple cue for what comes next, such as “calm and ready” or “recover now,” then open the eyes and move normally."}
 ]:meditationLength==="5"?[
  {title:"Settle",time:"45 sec",body:"Find a comfortable supported position. Feel the feet, seat, or back touching the surface. Let the shoulders lower and allow the face to relax."},
  {title:"Breath awareness",time:"90 sec",body:"Pay attention to where breathing is easiest to feel—nose, chest, or belly. Let breathing stay natural. Count 1 on the inhale and 2 on the exhale up to 10, then begin again."},
  {title:"Body scan",time:"90 sec",body:"Move attention slowly from face to shoulders, arms, hands, chest, stomach, hips, legs, and feet. Notice tension without judging it. On each exhale, allow one area to soften."},
  {title:"Notice thoughts",time:"45 sec",body:"If a thought about school, practice, a game, or tomorrow appears, label it simply as “thinking.” You do not need to solve it now. Return attention to one easy breath."},
  {title:"Finish with intention",time:"30 sec",body:"Take one comfortable breath. Choose a short recovery cue such as “rest,” “reset,” or “next good choice.” Notice the room and finish without rushing."}
 ]:[
  {title:"Arrive and settle",time:"1 min",body:"Get comfortable and supported. Feel the surface beneath you. Relax the jaw, shoulders, hands, stomach, and legs without trying to force relaxation."},
  {title:"Breathing anchor",time:"2 min",body:"Follow each inhale and exhale as it naturally happens. If helpful, count breaths from 1 to 10. Each time attention wanders, gently return to the next breath instead of criticizing yourself."},
  {title:"Full body scan",time:"3 min",body:"Move attention slowly through the forehead, eyes, jaw, neck, shoulders, arms, hands, chest, back, stomach, hips, thighs, knees, calves, ankles, and feet. Notice warmth, pressure, tightness, or ease. Let every area be as it is."},
  {title:"Let thoughts pass",time:"2 min",body:"Imagine thoughts as messages passing across a screen. Notice the thought, name it “thinking” or “planning,” and let it move on without following it. Return to the breath or body."},
  {title:"Recovery intention",time:"1 min",body:"Think of one controllable recovery action for today: sleep routine, hydration, easy mobility, nutrition, or asking for help. Keep it simple."},
  {title:"Return gradually",time:"1 min",body:"Notice sounds and the room around you. Move fingers and toes, take one normal breath, and sit or stand slowly when ready."}
 ];
 const resetMeditation=()=>setMeditationStep(0);
 const changeMeditationLength=(value:"3"|"5"|"10")=>{setMeditationLength(value);setMeditationStep(0)};
 const flags:RecoveryFlag[]=[
  {label:"Sleep",value:todayLog?`${todayLog.sleep}h`:"—",status:!todayLog?"Watch":todayLog.sleep>=sleepTarget.min?"Good":todayLog.sleep>=sleepTarget.min-1?"Watch":"Low"},
  {label:"Energy",value:todayLog?`${todayLog.energy}/10`:"—",status:!todayLog?"Watch":todayLog.energy>=7?"Good":todayLog.energy>=5?"Watch":"Low"},
  {label:"Soreness",value:todayLog?`${todayLog.soreness}/10`:"—",status:!todayLog?"Watch":todayLog.soreness<=3?"Good":todayLog.soreness<=5?"Watch":"Low"},
  {label:"Stress",value:todayLog?`${todayLog.stress}/10`:"—",status:!todayLog?"Watch":todayLog.stress<=3?"Good":todayLog.stress<=5?"Watch":"Low"}
 ];
 return <><div className="sectionDivider"><span><i/>Readiness</span></div><div className="hero phase34Hero"><small>RECOVERY & READINESS</small><h1>Daily Readiness</h1><p>{sport} · Recovery signals, trends, and training guidance.</p></div>
 {accountRole==="Parent"&&<div className="parentRecoveryChooser">
  <div><small>RECOVERY & NOTES</small><h2>Choose what you want to review</h2><p>Recovery tools are separated so this page stays easy to scan.</p></div>
  <div>
   <button onClick={()=>{setSleepGuideOpen(false);setMindfulnessOpen(false);document.getElementById("parent-recovery-summary")?.scrollIntoView({behavior:"smooth",block:"start"})}}>Recovery Summary</button>
   <button onClick={()=>{setSleepGuideOpen(true);setMindfulnessOpen(false);window.setTimeout(()=>document.getElementById("sleep-guide")?.scrollIntoView({behavior:"smooth",block:"start"}),40)}}>Sleep Guide</button>
   <button onClick={()=>{setMindfulnessOpen(true);setSleepGuideOpen(false);window.setTimeout(()=>document.getElementById("mindfulness-guide")?.scrollIntoView({behavior:"smooth",block:"start"}),40)}}>Mindfulness</button>
   <button onClick={()=>document.getElementById("shared-support-notes")?.scrollIntoView({behavior:"smooth",block:"start"})}>Shared Notes</button>
  </div>
 </div>}
 <div id={accountRole==="Parent"?"parent-recovery-summary":undefined} className="readinessHero"><div><small>READINESS SCORE</small><strong>{score}</strong><span>/100</span></div><div><b>{status}</b><p>{score>=80?"Good day for normal training intensity.":score>=60?"Keep quality high but watch fatigue.":score>0?"Prioritize recovery, mobility, and lower intensity.":"Complete today's check-in to get a score."}</p>{todayLog&&<small>{delta>=0?"+":""}{delta} vs previous log · 7-day avg {avg7}</small>}</div></div>
 <div className="recoveryFlags">{flags.map(f=><div className={"recoveryFlag "+f.status.toLowerCase()} key={f.label}><small>{f.label}</small><b>{f.value}</b><span>{f.status}</span></div>)}</div>

 <div className="card readinessV2Panel">
  <div className="sectionHead"><div><small>READINESS 2.0</small><h2>Why is the score {score||"—"}?</h2><p>Four equal 25% inputs, normalized to 0–100. Sleep uses the athlete's age-based target; low soreness and low stress score higher.</p></div><span className="tag">{readinessStatus(score)}</span></div>
  {todayBreakdown?<div className="readinessV2Grid">
   {[["Sleep",todayBreakdown.sleep,`${todayLog?.sleep||0}h · target ${todayBreakdown.target.label}`],["Energy",todayBreakdown.energy,`${todayLog?.energy||0}/10`],["Soreness",todayBreakdown.soreness,`${todayLog?.soreness||0}/10 · lower is better`],["Stress",todayBreakdown.stress,`${todayLog?.stress||0}/10 · lower is better`]].map(([label,value,detail])=><div key={String(label)}><div className="row"><small>{label}</small><b>{value}/100</b></div><div className="progress"><i style={{width:`${value}%`}}/></div><span>{detail}</span></div>)}
  </div>:<div className="parentEmptyState"><b>No score yet</b><span>The Player's Daily Check-In creates the readiness breakdown.</span></div>}
  {todayLog&&<div className="readinessV2Summary">
   <div><small>MAIN LIMITER</small><b>{readinessLimiter?.[0]||"—"}</b><span>{readinessLimiter?`${readinessLimiter[1]}/100 component score`:""}</span></div>
   <div><small>3-ENTRY TREND</small><b>{priorAvg3?(trend3>0?"+":"")+trend3:"—"}</b><span>{priorAvg3?`${avg3} recent vs ${priorAvg3} prior`:"More history needed"}</span></div>
   <div><small>7-DAY AVERAGE</small><b>{avg7||"—"}</b><span>same formula across the app</span></div>
  </div>}
  <details className="readinessFormulaDisclosure"><summary>Readiness formula</summary><p><b>Sleep 25% + Energy 25% + Soreness 25% + Stress 25%.</b> A soreness or stress rating of 1/10 maps to the best component score and 10/10 maps to 0. The score is a training/recovery decision aid, not a medical diagnosis.</p></details>
 </div>

 <div className="card sleepRecoveryGuide" id="sleep-guide">
  <div className="sectionHead"><div><span className="tag">RECOVERY · SLEEP</span><h2>Sleep Improvement Guide</h2><small>{profile.name||"Athlete"}{athleteAge?` · age ${athleteAge}`:""} · practical habits for better recovery</small></div><button className="featureAction" onClick={()=>setSleepGuideOpen(x=>!x)}>{sleepGuideOpen?"Hide Guide":"Open Guide"}</button></div>
  <div className="sleepGuideSummary">
   <div><small>AGE-BASED TARGET</small><b>{sleepTarget.label}</b><span>per 24 hours</span></div>
   <div><small>TODAY'S SLEEP</small><b>{todayLog?`${todayLog.sleep} h`:"—"}</b><span>{sleepStatus}</span></div>
   <div><small>CONSISTENCY GOAL</small><b>Same wake time</b><span>keep most days within ~1 hour</span></div>
  </div>

  {sleepGuideOpen&&<div className="sleepGuideBody">
   <div className="sleepPlanner">
    <div><small>BEDTIME PLANNER</small><h2>Plan tonight from wake-up time</h2><p>Set the time the athlete needs to wake up. The app works backward using the age-based sleep target.</p></div>
    <label>Tomorrow's wake-up time<input type="time" value={wakeTime} onChange={e=>setWakeTime(e.target.value)}/></label>
    <div className="bedtimeResult"><small>TARGET SLEEP WINDOW</small><b>{targetBedtimeWindow}</b><span>Try to be asleep during this window, not just getting into bed.</span></div>
   </div>

   <div className="sleepRoutineTimeline">
    <div className="sleepRoutineStep"><span>60</span><div><small>60 MIN BEFORE BED</small><b>Start the landing routine</b><p>Finish hard training when possible, dim lights, lower the noise level, and switch from competitive/high-energy activities to calmer ones. Pack gear and prepare for tomorrow now so bedtime is not rushed.</p></div></div>
    <div className="sleepRoutineStep"><span>30</span><div><small>30 MIN BEFORE BED</small><b>Make the environment sleep-friendly</b><p>Put the phone/tablet on charge away from the bed, reduce bright screens, keep the room cool, dark, and quiet, use the bathroom, and complete normal hygiene.</p></div></div>
    <div className="sleepRoutineStep"><span>10</span><div><small>10 MIN BEFORE BED</small><b>Settle the body and mind</b><p>Use quiet reading, gentle breathing, or a brief body scan. Write down tomorrow's first task or any worry that is looping so the brain does not have to keep rehearsing it.</p></div></div>
    <div className="sleepRoutineStep"><span>0</span><div><small>LIGHTS OUT</small><b>Protect the sleep window</b><p>Bed is for sleep. Keep the room dark and avoid checking messages, scores, games, or social media after lights out.</p></div></div>
   </div>

   <div className="sleepGuideGrid">
    <div className="sleepAdviceCard"><span>☀</span><div><b>Morning</b><p>Get outdoor light soon after waking, eat breakfast when appropriate, and move the body. Morning light helps anchor the body clock for the following night.</p></div></div>
    <div className="sleepAdviceCard"><span>⌚</span><div><b>Schedule</b><p>Keep wake time and bedtime reasonably consistent across school, practice, and weekend days. Sleeping very late on weekends can make Sunday night harder.</p></div></div>
    <div className="sleepAdviceCard"><span>⚡</span><div><b>Caffeine</b><p>Children should avoid caffeine unless a healthcare professional says otherwise. Teens and adults should avoid caffeine late in the day because it can delay sleep even when they feel tired.</p></div></div>
    <div className="sleepAdviceCard"><span>◌</span><div><b>Late practice</b><p>After a late practice: cool down, hydrate normally, have the planned recovery snack/meal, shower, dim lights, and move directly into the wind-down routine rather than adding more screen time.</p></div></div>
    <div className="sleepAdviceCard"><span>▭</span><div><b>Naps</b><p>If a nap is needed, use it to support—not replace—night sleep. Earlier, shorter naps are less likely to interfere with bedtime than long evening naps.</p></div></div>
    <div className="sleepAdviceCard"><span>✓</span><div><b>Track patterns</b><p>Use the Daily Check-In to compare sleep with energy, soreness, stress, readiness, training quality, and competition performance over time.</p></div></div>
   </div>

   <details className="sleepTroubleGuide">
    <summary><div><b>What if I can't fall asleep?</b><small>A simple reset instead of fighting with sleep</small></div><span>Open</span></summary>
    <div>
     <p>If you have been lying awake and getting frustrated, stop watching the clock. Keep lights dim and do a quiet, non-screen activity for a short period, then return to bed when sleepy. Keep breathing comfortable and avoid turning the night into extra practice, homework, gaming, or scrolling time.</p>
     <p><b>Ask for help</b> if sleep problems keep happening, the athlete is very sleepy during the day, or there is loud snoring, choking/gasping, unusual breathing, or other concerning symptoms. For a child or teen, involve a parent/guardian and healthcare professional.</p>
    </div>
   </details>

   <div className="sleepGuideNote"><b>Recovery reminder</b><span>Sleep needs vary between people. This guide supports healthy habits; it does not diagnose or treat a sleep disorder.</span></div>
  </div>}
 </div>

 <div className="card mindfulnessRecoveryGuide" id="mindfulness-guide">
  <div className="sectionHead"><div><span className="tag">RECOVERY · MINDFULNESS</span><h2>Mindful Recovery & Meditation</h2><small>Short guided resets for recovery, stress, focus, and winding down</small></div><button className="featureAction" onClick={()=>setMindfulnessOpen(x=>!x)}>{mindfulnessOpen?"Hide Guide":"Open Guide"}</button></div>

  {mindfulnessOpen&&<div className="mindfulnessBody">
   <div className="mindfulnessIntro">
    <div><small>HOW TO USE IT</small><h2>Choose a length and follow one step at a time</h2><p>Mindfulness is not about emptying the mind. The goal is to notice what is happening, return attention gently, and give the body a quieter recovery period.</p></div>
    <div className="mindfulnessLengthChoices">{(["3","5","10"] as const).map(value=><button key={value} className={meditationLength===value?"active":""} onClick={()=>changeMeditationLength(value)}><b>{value} min</b><span>{value==="3"?"Quick reset":value==="5"?"Recovery meditation":"Longer body scan"}</span></button>)}</div>
   </div>

   <div className="mindfulnessProgress"><div><small>{meditationMinutes}-MINUTE GUIDED MEDITATION</small><b>Step {meditationStep+1} of {meditationSteps.length}</b></div><span>{meditationSteps[meditationStep].time}</span></div>
   <div className="mindfulnessBar"><i style={{width:`${Math.round((meditationStep+1)/meditationSteps.length*100)}%`}}/></div>

   <div className="mindfulnessStepCard">
    <span className="mindfulnessStepIcon">{meditationStep+1}</span>
    <div><small>{meditationSteps[meditationStep].time}</small><h2>{meditationSteps[meditationStep].title}</h2><p>{meditationSteps[meditationStep].body}</p></div>
   </div>

   <div className="mindfulnessActions">
    <button disabled={meditationStep===0} onClick={()=>setMeditationStep(x=>Math.max(0,x-1))}>Back</button>
    {meditationStep<meditationSteps.length-1?<button className="featureAction" onClick={()=>setMeditationStep(x=>Math.min(meditationSteps.length-1,x+1))}>Next Step</button>:<button className="featureAction" onClick={resetMeditation}>Start Again</button>}
   </div>

   <div className="mindfulnessUseCases">
    <div><b>After practice</b><span>Use 3–5 minutes after showering or stretching to shift from competition mode into recovery mode.</span></div>
    <div><b>Before sleep</b><span>Use the 5- or 10-minute version during the wind-down routine with low lights and no phone notifications.</span></div>
    <div><b>Stressful day</b><span>Use the 3-minute reset before homework, travel, testing, or when the athlete feels mentally overloaded.</span></div>
    <div><b>Before competition</b><span>Use only the short reset if it helps the athlete feel present. The goal is calm attention, not making the athlete sleepy.</span></div>
   </div>

   <details className="mindfulnessTips">
    <summary><div><b>Mindfulness tips for young athletes</b><small>Keep it simple, comfortable, and pressure-free</small></div><span>Open</span></summary>
    <div>
     <p><b>There is no perfect meditation.</b> Wandering attention is normal. Each return to the breath or body is the practice.</p>
     <p><b>Do not force breathing.</b> Normal, comfortable breathing is enough. Stop if the athlete feels dizzy, uncomfortable, panicky, or unwell.</p>
     <p><b>Eyes can stay open.</b> A soft gaze at the floor or a fixed object works well for athletes who do not like closing their eyes.</p>
     <p><b>Short is useful.</b> A consistent 3-minute reset can be more practical than expecting a young athlete to sit still for a long session.</p>
    </div>
   </details>

   <div className="mindfulnessNote"><b>Recovery tool, not a requirement</b><span>Mindfulness should feel optional and supportive. It is not a substitute for professional mental-health care, medical care, sleep, food, hydration, or appropriate recovery.</span></div>
  </div>}
 </div>

 {accountRole==="Player"?<div className="card setupAnchor" id="setup-readiness" tabIndex={-1}><div className="sectionHead"><div><span className="tag">PLAYER ONLY</span><h2>My Daily Check-In</h2><small>Your answers are shared with linked Parents and Coaches after you save.</small></div></div><div className="two">
  <label>Sleep (hours)<select value={sleep} onChange={e=>setSleep(e.target.value)}>{["4","5","6","7","8","9","10","11","12"].map(x=><option key={x}>{x}</option>)}</select></label>
  <label>Energy (1–10)<select value={energy} onChange={e=>setEnergy(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}</option>)}</select></label>
  <label>Soreness (1–10)<select value={soreness} onChange={e=>setSoreness(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}</option>)}</select></label>
  <label>Stress (1–10)<select value={stress} onChange={e=>setStress(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}</option>)}</select></label>
 </div><label>Notes<input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Sleep quality, soreness location, school stress, etc."/></label><button className="primary" onClick={saveReadiness}>Save My Daily Check-In</button></div>:<div className="card playerOnlyNotice" id="setup-readiness" tabIndex={-1}><span className="tag">PLAYER-ENTERED</span><h2>Daily Check-In Results</h2><p>Only {profile.name||"the Player"} can submit or change sleep, energy, soreness, stress, and check-in notes. Linked Parents and Coaches can review the saved results here.</p>{todayLog?<div className="supportDailyResult"><div><small>DATE</small><b>{friendlyDate(todayLog.date)}</b></div><div><small>SLEEP</small><b>{todayLog.sleep} h</b></div><div><small>ENERGY</small><b>{todayLog.energy}/10</b></div><div><small>SORENESS</small><b>{todayLog.soreness}/10</b></div><div><small>STRESS</small><b>{todayLog.stress}/10</b></div></div>:<p className="muted">No Player check-in has been submitted for today.</p>}{todayLog?.notes&&<div className="supportCheckinNote"><small>PLAYER NOTE</small><p>{todayLog.notes}</p></div>}</div>}
 <div className="card"><h2>7-Day Readiness Trend</h2>{recent.length?<div className="readinessBars">{recent.slice().reverse().map(r=>{const v=calc(r);return <div key={r.id}><i style={{height:`${v}%`}}/><small>{r.date.slice(5)}</small><b>{v}</b></div>})}</div>:<p>{accountRole==="Player"?"Complete your daily check-ins to build a recovery trend.":"Player check-ins will build the recovery trend here."}</p>}</div>
 <div className="card playerCheckinHistory"><div className="sectionHead"><div><h2>Recent Player Check-Ins</h2><small>Read-only history for Parents, Coaches, and support views</small></div><span className="tag">{recent.length} RECENT</span></div>{recent.length===0?<p>No Player check-ins yet.</p>:<div className="playerCheckinRows">{recent.map(r=><div key={r.id}><div><b>{friendlyDate(r.date)}</b><small>Readiness {calc(r)}/100</small></div><span><small>Sleep</small><b>{r.sleep}h</b></span><span><small>Energy</small><b>{r.energy}/10</b></span><span><small>Soreness</small><b>{r.soreness}/10</b></span><span><small>Stress</small><b>{r.stress}/10</b></span>{r.notes&&<p>{r.notes}</p>}</div>)}</div>}</div>
 <div className="card playerWeeklyReviewResults"><div className="sectionHead"><div><h2>Player Weekly Reviews</h2><small>Player-entered reflection · visible to linked Parents and Coaches</small></div><span className="tag">{weeklyReviews.length} REVIEW{weeklyReviews.length===1?"":"S"}</span></div>{weeklyReviews.length===0?<p>No Player weekly reviews yet.</p>:<div className="supportWeeklyReviewList">{weeklyReviews.slice(0,5).map(r=><div key={r.id}><div className="reviewRating">{r.rating}<small>/10</small></div><div><b>Week of {friendlyDate(r.weekStart)}</b><span><strong>Win:</strong> {r.wins||"—"}</span><span><strong>Challenge:</strong> {r.challenges||"—"}</span><span><strong>Next focus:</strong> {r.focus||"—"}</span></div></div>)}</div>}</div>
 {accountRole==="Parent"?<div className="card parentRecoverySummaryCard"><h2>What this means</h2><p>{score>=80?"Recovery looks supportive of normal training.":score>=60?"Recovery is moderate. Watch fatigue and communication.":score>0?"Recovery signals suggest an easier recovery-focused day may be useful.":"There is no readiness score for today yet."}</p>{nextWorkout&&<p><b>Next scheduled workout:</b> {nextWorkout.name} · {friendlyDate(nextWorkout.date)}</p>}<p className="muted">Daily and weekly check-ins remain Player-entered. Parents and Coaches can use Shared Notes for context or support communication.</p></div>:<div className="grid twoCards"><div className="card"><h2>Training Recommendation</h2><p>{score>=80?"Proceed with the planned session.":score>=60?"Complete the session, but reduce volume if performance drops.":score>0?"Use recovery, mobility, technique, or an easier conditioning session.":accountRole==="Player"?"Complete your daily check-in first.":"Waiting for the Player's daily check-in."}</p>{nextWorkout&&<p><b>Next:</b> {nextWorkout.name} · {nextWorkout.date}</p>}</div><div className="card"><h2>Program Status</h2><p>{program?`${program.focus} · ${program.daysPerWeek} days/week`:"No active training program yet."}</p></div></div>}
 <div className="card sharedNotesCard" id="shared-support-notes"><div className="sectionHead"><div><span className="tag">SHARED SUPPORT TEAM</span><h2>Coach / Parent Notes</h2><small>Coach, Parent, Athlete, or Medical Provider notes · visible to everyone supporting this athlete</small></div><span className="sharedVisibilityBadge">VISIBLE TO ALL</span></div>
  <div className="sharedNoteInfo"><b>Use shared notes for communication—not private messaging.</b><span>Examples: recovery observations, training feedback, scheduling context, return-to-play instructions supplied by a provider, or something the athlete wants the support team to know.</span></div>
  <div className="sharedNoteForm">
   <label>Note source<select value={noteAuthorType} onChange={e=>setNoteAuthorType(e.target.value as "Coach"|"Parent"|"Athlete"|"Medical Provider"|"Admin")}><option>Coach</option><option>Parent</option><option>Athlete</option><option>Medical Provider</option>{accountRole==="Admin"&&<option>Admin</option>}</select></label>
   <label>Author name<input value={noteAuthorName} onChange={e=>setNoteAuthorName(e.target.value)} placeholder={noteAuthorType==="Medical Provider"?"Provider name":"Name"}/></label>
   <label>Topic<select value={noteCategory} onChange={e=>setNoteCategory(e.target.value)}><option>General</option><option>Recovery</option><option>Training</option><option>Medical / Return to Play</option><option>Competition</option><option>Schedule</option></select></label>
   <label>Title<input value={noteTitle} onChange={e=>setNoteTitle(e.target.value)} placeholder="Short note title"/></label>
  </div>
  <label>Shared note<textarea rows={4} value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Write the information the athlete's support team should see."/></label>
  {noteAuthorType==="Medical Provider"&&<div className="providerNoteReminder"><b>Medical-provider note</b><span>Enter only information you are authorized to share. This app does not verify clinical credentials and is not a medical record system.</span></div>}
  {sharedNoteMessage&&<div className="sharedNoteMessage">{sharedNoteMessage}</div>}
  <button className="featureAction" onClick={()=>void saveSharedSupportNote()}>Save Shared Note</button>
 </div>
 <div className="sharedNoteHistory"><div className="sectionHead"><div><h2>Shared Note History</h2><small>Newest first · legacy Coach notes are also shown here</small></div><span className="tag">{coachNotes.length} NOTE{coachNotes.length===1?"":"S"}</span></div>
  {coachNotes.length===0?<div className="card"><p>No shared notes yet.</p></div>:coachNotes.slice(0,20).map(n=><div className="card sharedNoteItem" key={n.id}><div className="sharedNoteTop"><div><span className="tag">{n.authorType||n.category||"Coach"}</span><b>{n.authorName||"Support Team"}{n.category&&n.category!==(n.authorType||"")?` · ${n.category}`:""}</b></div><small>{n.date}</small></div><h2>{n.title}</h2><p>{n.note}</p></div>)}
 </div>
 </>;
}
function Competition({sport,competitions,setCompetitions,profile}:{sport:Sport;competitions:CompetitionLog[];setCompetitions:React.Dispatch<React.SetStateAction<CompetitionLog[]>>;profile:Profile}){
 const [date,setDate]=useState(today()),[opponent,setOpponent]=useState(""),[eventType,setEventType]=useState("Game"),[result,setResult]=useState(""),[minutes,setMinutes]=useState(""),[rating,setRating]=useState("7"),[notes,setNotes]=useState("");
 const [location,setLocation]=useState(""),[role,setRole]=useState(profile.position||""),[keyWin,setKeyWin]=useState(""),[improveNext,setImproveNext]=useState(""),[confidence,setConfidence]=useState("7");
 const [customStatName,setCustomStatName]=useState("");
 const standardStatLabels=competitionStatsFor(sport,role||profile.position);
 const emptyStats=(nextRole=role||profile.position)=>competitionStatsFor(sport,nextRole).map(label=>({label,value:""}));
 const [stats,setStats]=useState<StatEntry[]>(()=>competitionStatsFor(sport,profile.position).map(label=>({label,value:""})));
 useEffect(()=>{
  const nextRole=profile.position||"";
  setRole(nextRole);
  setStats(emptyStats(nextRole));
  setCustomStatName("");
 },[sport,profile.position]);
 const changeCompetitionRole=(nextRole:string)=>{
  setRole(nextRole);
  setStats(emptyStats(nextRole));
  setCustomStatName("");
 };
 const addCustomStat=()=>{
  const label=customStatName.trim();
  if(!label||stats.some(x=>x.label.toLowerCase()===label.toLowerCase()))return;
  setStats(x=>[...x,{label,value:""}]);
  setCustomStatName("");
 };
 const removeCustomStat=(label:string)=>setStats(x=>x.filter(st=>st.label!==label));

 const save=()=>{
  if(!opponent.trim()&&!result.trim()&&!notes.trim())return;
  const item:CompetitionLog={
   id:Date.now(),date,opponent:opponent.trim()||"Competition",eventType,result:result.trim(),minutes,
   rating:Number(rating)||0,notes:notes.trim(),sport,stats,location:location.trim(),role:role.trim(),
   keyWin:keyWin.trim(),improveNext:improveNext.trim(),confidence:Number(confidence)||0
  };
  setCompetitions(x=>{
   if(x.some(c=>c.sport===item.sport&&c.date===item.date&&c.opponent===item.opponent&&c.result===item.result&&c.rating===item.rating))return x;
   return [item,...x];
  });
  setOpponent("");setResult("");setMinutes("");setNotes("");setRating("7");setLocation("");setKeyWin("");setImproveNext("");setConfidence("7");setStats(emptyStats(role));setCustomStatName("");
 };

 const mine=competitions.filter(x=>x.sport===sport).sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
 const games=mine.length;
 const avgRating=games?Math.round(mine.reduce((a,x)=>a+x.rating,0)/games*10)/10:0;
 const avgConfidence=games?Math.round(mine.reduce((a,x)=>a+(x.confidence||0),0)/games*10)/10:0;
 const totalMinutes=mine.reduce((a,x)=>a+(Number(x.minutes)||0),0);
 const wins=mine.filter(x=>/^w/i.test(x.result.trim())).length;
 const winPct=games?Math.round(wins/games*100):0;

 const statTotals=[...new Set(mine.flatMap(g=>g.stats.map(st=>st.label)))].map(label=>{
  const vals=mine.map(g=>Number(g.stats.find(st=>st.label===label)?.value||0)).filter(v=>!Number.isNaN(v));
  return {label,total:Math.round(vals.reduce((a,b)=>a+b,0)*100)/100};
 }).filter(x=>x.total!==0).slice(0,10);

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
return <><div className="hero"><small>COMPETITION</small><h1>Competition</h1><p>{profile.name} · {sport}{profile.position?" · "+profile.position:""} · Track game performance, confidence, and post-event learning.</p></div>
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
   <label>Role / Position<select value={positions[sport].includes(role)?role:""} onChange={e=>changeCompetitionRole(e.target.value)}><option value="">Select position / role</option>{positions[sport].map(x=><option key={x} value={x}>{x}</option>)}</select><small className="competitionRoleHint">Defaults to the Player Profile. Change only if the athlete played a different role in this event.</small></label>
   <label>Minutes / Time<input value={minutes} onChange={e=>setMinutes(e.target.value)} inputMode="decimal" placeholder="e.g. 32"/></label>
   <label>Performance Rating<select value={rating} onChange={e=>setRating(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}/10</option>)}</select></label>
   <label>Confidence<select value={confidence} onChange={e=>setConfidence(e.target.value)}>{Array.from({length:10},(_,i)=>String(i+1)).map(x=><option key={x}>{x}/10</option>)}</select></label>
  </div>

  <div className="competitionStatsHead"><div><h2>Sport Stats</h2><p>{sport}{role?` · ${role}`:""} · Only stats relevant to this sport and position are shown.</p></div><span className="tag">{standardStatLabels.length} STANDARD</span></div>
  {stats.length===0?<div className="competitionStatsEmpty"><b>Select a position / role</b><span>The app will show the most useful competition statistics for that athlete.</span></div>:<div className="statInputs positionStatInputs">{stats.map((st,i)=>{const custom=!standardStatLabels.includes(st.label);return <label className={custom?"customCompetitionStat":""} key={`${st.label}-${i}`}><span>{st.label}{custom&&<button type="button" aria-label={`Remove ${st.label}`} onClick={()=>removeCustomStat(st.label)}>×</button>}</span><input inputMode="decimal" value={st.value} placeholder="0" onChange={e=>setStats(x=>x.map((a,j)=>j===i?{...a,value:e.target.value}:a))}/></label>})}</div>}
  <div className="customCompetitionStatBuilder"><div><small>OPTIONAL</small><b>Add Custom Stat</b><span>Track one extra metric your team or Coach uses.</span></div><div><input value={customStatName} onChange={e=>setCustomStatName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addCustomStat()}}} placeholder="e.g. Zone Entries"/><button type="button" onClick={addCustomStat}>Add</button></div></div>

  {sport==="Ice Hockey"&&role==="Goaltender"&&<div className="competitionDerivedNote"><b>Goalie note</b><span>Save % can be calculated from Saves ÷ Shots Against. Enter the raw totals here so the app keeps the underlying game data accurate.</span></div>}
  {sport==="Ice Hockey"&&role==="Center"&&<div className="competitionDerivedNote"><b>Center note</b><span>Faceoff % can be calculated from Faceoff Wins ÷ Faceoff Attempts, so the form stores the raw totals instead of asking for a percentage.</span></div>}

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
 const avgReadiness=recentReadiness.length?Math.round(recentReadiness.reduce((a,r)=>a+readinessScoreV2(r,Number(profile.age||0)),0)/recentReadiness.length):0;

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



 return <><div className="sectionDivider"><span><i/>Performance Report</span></div><div className="hero phase32Hero"><small>PERFORMANCE REPORT</small><h1>Performance Report</h1><p>{profile.name} · {sport}{profile.position?" · "+profile.position:""} · {profile.season}</p></div>

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

function AdminBetaHealth({cloudStatus,lastSaved,error,pending,workspaceId,selectedAthlete,cloudLoaded}:{cloudStatus:"local"|"loading"|"saved"|"error";lastSaved:string;error:string;pending:boolean;workspaceId:string;selectedAthlete:string;cloudLoaded:boolean}){
 const rows=[
  ["App Version","72.3.40","good"],
  ["Supabase / Cloud",cloudStatus==="saved"?"Connected":cloudStatus==="loading"?"Working":cloudStatus==="error"?"Issue":"Local only",cloudStatus==="error"?"bad":cloudStatus==="saved"?"good":"watch"],
  ["Cloud State",cloudLoaded?"Loaded":"Waiting",cloudLoaded?"good":"watch"],
  ["Selected Athlete",selectedAthlete||"No cloud athlete selected",selectedAthlete?"good":"watch"],
  ["Workspace",workspaceId?workspaceId.slice(0,8)+"…":"—",workspaceId?"good":"watch"],
  ["Last Successful Save",lastSaved?new Date(lastSaved).toLocaleString():"Not recorded this session",lastSaved?"good":"watch"],
  ["Retry Copy",pending?"Saved locally":"Clear",pending?"watch":"good"]
 ];
 return <div className="card adminBetaHealth">
  <div className="sectionHead"><div><small>BETA HARDENING</small><h2>Beta Health & Diagnostics</h2><p>Fast troubleshooting information for the current secure workspace. This panel does not expose private credentials.</p></div><span className={"tag "+(cloudStatus==="error"?"bad":"")}>{cloudStatus.toUpperCase()}</span></div>
  <div className="adminHealthGrid">{rows.map(([label,value,tone])=><div className={String(tone)} key={String(label)}><small>{label}</small><b>{value}</b></div>)}</div>
  {error&&<div className="adminHealthError"><b>Latest sync issue</b><span>{error}</span></div>}
  <div className="adminHealthChecklist"><span>✓ Role-aware Player/Parent/Coach/Admin navigation</span><span>✓ Coach Player Profile remains view-only</span><span>✓ Player Daily + Player Weekly remain Player-entered</span><span>✓ Cloud retry copy protects failed saves</span><span>✓ Coach roster can preload linked athlete cloud snapshots</span></div>
 </div>;
}

function Roster({accountRole,sport,profile,roster,setRoster,activeAthleteId,switchAthlete,setTab,setEditProfileRequest,goals,currentWorkouts,currentResults,currentDev,currentReadiness,currentCompetitions,currentDevelopmentSystem,currentTestTargets,currentCoachWeeklyReviews,cloudSelectedAthleteName,coachCloudRoster,coachRosterCloudStatus,selectCoachRosterAthlete}:{accountRole:AccountRole;sport:Sport;profile:Profile;roster:AthleteRecord[];setRoster:React.Dispatch<React.SetStateAction<AthleteRecord[]>>;activeAthleteId:string;switchAthlete:(a:AthleteRecord)=>void;setTab:React.Dispatch<React.SetStateAction<Tab>>;setEditProfileRequest:React.Dispatch<React.SetStateAction<number>>;goals:Goal[];currentWorkouts:Workout[];currentResults:Result[];currentDev:DevelopmentItem[];currentReadiness:ReadinessLog[];currentCompetitions:CompetitionLog[];currentDevelopmentSystem:DevelopmentSystemState;currentTestTargets:TestTarget[];currentCoachWeeklyReviews:CoachWeeklyReview[];cloudSelectedAthleteName?:string;coachCloudRoster:CoachCloudAthleteState[];coachRosterCloudStatus:"idle"|"loading"|"ready"|"error";selectCoachRosterAthlete?:((workspaceId:string)=>void)}){
 const [name,setName]=useState(""),[newSport,setNewSport]=useState<Sport>(sport),[age,setAge]=useState(""),[position,setPosition]=useState(""),[team,setTeam]=useState(""),[season,setSeason]=useState(profile.season||"2026-27"),[height,setHeight]=useState(""),[weight,setWeight]=useState(""),[handedness,setHandedness]=useState<"Right"|"Left">("Right");
 const [compareA,setCompareA]=useState(activeAthleteId),[compareB,setCompareB]=useState("");
 const [teamFilter,setTeamFilter]=useState("All");
 const [showRosterTools,setShowRosterTools]=useState(false);
 const [coachRosterSort,setCoachRosterSort]=useState<"Attention"|"Performance"|"Readiness"|"Name">("Attention");
 const [reviewPlayerId,setReviewPlayerId]=useState<string>("");
 const canManageProfiles=accountRole==="Admin";
 const scrollToAddAthlete=()=>{
   window.setTimeout(()=>{
     const el=document.getElementById("roster-add-athlete");
     if(el){el.scrollIntoView({behavior:"smooth",block:"start"});(el as HTMLElement).focus({preventScroll:true});}
   },40);
 };

 const currentRecord:AthleteRecord={id:"primary",name:profile.name,sport:profile.sport||sport,position:profile.position,team:profile.team,season:profile.season,height:profile.height,weight:profile.weight,handedness:profile.handedness,age:profile.age??""};

 const add=()=>{
  if(!canManageProfiles||!name.trim())return;
  const item:AthleteRecord={id:"athlete-"+Date.now(),name:name.trim(),sport:newSport,age:age.trim(),position,team,season,height,weight,handedness};
  setRoster(x=>[...x,item]);
  setName("");setAge("");setPosition("");setTeam("");setHeight("");setWeight("");
 };

 const activate=(a:AthleteRecord)=>switchAthlete(a);
 const editAthlete=(a:AthleteRecord)=>{
  if(!canManageProfiles)return;
  switchAthlete(a);
  setTab("Home");
  window.setTimeout(()=>setEditProfileRequest(x=>x+1),80);
 };
 const cloudRecords:AthleteRecord[]=coachCloudRoster.map(c=>{
  const rawProfile=(c.data?.profile||{}) as Partial<Profile>;
  const cloudSport=(rawProfile.sport&&sports.includes(rawProfile.sport as Sport)?rawProfile.sport:c.sport||sport) as Sport;
  return {
   id:`cloud:${c.workspaceId}`,
   name:rawProfile.name||c.name,
   sport:cloudSport,
   position:rawProfile.position||c.position||"",
   team:rawProfile.team||c.team||"",
   season:rawProfile.season||"2026-27",
   height:rawProfile.height||"",
   weight:rawProfile.weight||"",
   handedness:rawProfile.handedness==="Left"?"Left":"Right",
   age:rawProfile.age||""
  };
 });
 const localAll=[currentRecord,...roster.filter(x=>x.id!=="primary")];
 const all=accountRole==="Coach"&&cloudRecords.length?cloudRecords:localAll;
 const isSelectedCoachRecord=(a:{id:string;name:string})=>accountRole==="Coach"&&cloudRecords.length?Boolean(cloudSelectedAthleteName&&a.name===cloudSelectedAthleteName):a.id===activeAthleteId;

 type CoachRosterAnalytics={
  id:string;name:string;sport:Sport;position:string;team:string;
  score:number;status:"Strong"|"Building"|"Watch"|"Attention";coverage:number;
  testing:number;training:number;goals:number;readiness:number;competition:number;
  testingAvailable:boolean;trainingAvailable:boolean;goalsAvailable:boolean;readinessAvailable:boolean;competitionAvailable:boolean;
  testsCount:number;workoutsDone:number;competitionsCount:number;
  topTrend:string;topTrendValue:number|null;attention:string;focus:string;
  reviewStatus:"Complete"|"Due"|"Check";observationStatus:"Current"|"Due";lastObservation:string;
  retestName:string;retestReason:string;nextCompetition:string;nextCompetitionDate:string;
  nextAction:string;nextActionTab:Tab;nextActionSubView?:string;attentionPoints:number;
  developmentStage:DevelopmentStage;nextProgression:string;
 };

 const athleteSnapshot=(a:AthleteRecord):AthleteSnapshot=>{
  if(a.id.startsWith("cloud:")){
   const workspaceId=a.id.slice(6);
   const cloud=coachCloudRoster.find(x=>x.workspaceId===workspaceId);
   const raw=(cloud?.data||{}) as any;
   return {
    profile:{name:raw?.profile?.name??a.name,position:raw?.profile?.position??a.position,team:raw?.profile?.team??a.team,season:raw?.profile?.season??a.season,height:raw?.profile?.height??a.height,weight:raw?.profile?.weight??a.weight,handedness:raw?.profile?.handedness==="Left"?"Left":"Right",age:raw?.profile?.age??a.age??"",sport:(raw?.profile?.sport&&sports.includes(raw.profile.sport as Sport)?raw.profile.sport:a.sport) as Sport},
    goals:Array.isArray(raw?.goals)?raw.goals:[],workouts:Array.isArray(raw?.workouts)?raw.workouts:[],results:Array.isArray(raw?.results)?raw.results:[],
    development:Array.isArray(raw?.development)?raw.development:[],program:raw?.program??null,readiness:Array.isArray(raw?.readiness)?raw.readiness:[],
    coachNotes:Array.isArray(raw?.coachNotes)?raw.coachNotes:[],competitions:Array.isArray(raw?.competitions)?raw.competitions:[],
    reportNotes:Array.isArray(raw?.reportNotes)?raw.reportNotes:[],developmentSystem:raw?.developmentSystem?normalizeDevelopmentSystem(raw.developmentSystem):createDefaultDevelopmentSystem()
   };
  }
  if(a.id===activeAthleteId){
   return {
    profile:{...profile,sport:profile.sport||sport},
    goals:[...goals],workouts:[...currentWorkouts],results:[...currentResults],development:[...currentDev],
    program:null,readiness:[...currentReadiness],coachNotes:[],competitions:[...currentCompetitions],reportNotes:[],
    developmentSystem:normalizeDevelopmentSystem(currentDevelopmentSystem)
   };
  }
  try{
   const raw=localStorage.getItem(`athleteData:${a.id}`);
   if(raw){
    const snap=JSON.parse(raw) as AthleteSnapshot;
    return {...snap,developmentSystem:normalizeDevelopmentSystem(snap.developmentSystem)};
   }
  }catch{}
  return {
   profile:{name:a.name,position:a.position,team:a.team,season:a.season,height:a.height,weight:a.weight,handedness:a.handedness,age:a.age||"",sport:a.sport},
   goals:[],workouts:[],results:[],development:[],program:null,readiness:[],coachNotes:[],competitions:[],reportNotes:[],
   developmentSystem:createDefaultDevelopmentSystem()
  };
 };

 const athleteTestTargets=(a:AthleteRecord):TestTarget[]=>{
  if(a.id.startsWith("cloud:")){
   const workspaceId=a.id.slice(6);
   const cloud=coachCloudRoster.find(x=>x.workspaceId===workspaceId);
   return Array.isArray((cloud?.data as any)?.testTargets)?(cloud?.data as any).testTargets:[];
  }
  if(a.id===activeAthleteId)return currentTestTargets;
  try{
   const raw=localStorage.getItem(`testTargets:${a.id}`);
   return raw?JSON.parse(raw):[];
  }catch{return []}
 };

 const coachAnalyticsFor=(a:AthleteRecord):CoachRosterAnalytics=>{
  const snap=athleteSnapshot(a);
  const athleteSport=(snap.profile?.sport||a.sport) as Sport;
  const athleteAge=Number(snap.profile?.age||a.age||0);

  const testRows=(snap.results||[]).filter(r=>r.sport===athleteSport);
  const groups=[...new Map(testRows.map(r=>[r.testId,r])).values()];
  const testSummaries=groups.map(g=>{
   const rows=testRows.filter(r=>r.testId===g.testId).sort((x,y)=>x.date.localeCompare(y.date)||x.id-y.id);
   const def=definitions(athleteSport).find(x=>x.id===g.testId)||({lowerBetter:g.unit==="sec"} as TestDef);
   const baseline=rows[0]?.value??0,current=rows[rows.length-1]?.value??0;
   const imp=rows.length>1?improvement(baseline,current,def.lowerBetter):0;
   return {testId:g.testId,name:g.name,count:rows.length,imp,lastDate:rows[rows.length-1]?.date||""};
  });
  const improving=testSummaries.filter(x=>x.count>1&&x.imp>0).sort((x,y)=>y.imp-x.imp);
  const declining=testSummaries.filter(x=>x.count>1&&x.imp<0).sort((x,y)=>x.imp-y.imp);

  const sportWorkouts=(snap.workouts||[]).filter(w=>w.sport===athleteSport);
  const workoutsDone=sportWorkouts.filter(w=>w.completed).length;
  const training=sportWorkouts.length?Math.round(workoutsDone/sportWorkouts.length*100):0;

  const athleteGoals=snap.goals||[];
  const goalScore=athleteGoals.length?Math.round(athleteGoals.reduce((sum,g)=>sum+g.progress,0)/athleteGoals.length):0;

  const recentReadiness=(snap.readiness||[]).slice(0,7);
  const readyScore=recentReadiness.length?Math.round(recentReadiness.reduce((sum,r)=>sum+readinessScoreV2(r,athleteAge),0)/recentReadiness.length):0;

  const comps=(snap.competitions||[]).filter(c=>c.sport===athleteSport);
  const competition=comps.length?Math.round(comps.reduce((sum,c)=>sum+c.rating,0)/comps.length*10):0;

  const testing=Math.min(100,testSummaries.length*15+(improving.length?25:0));
  const available=[testSummaries.length>0,sportWorkouts.length>0,athleteGoals.length>0,recentReadiness.length>0,comps.length>0];
  const coverage=available.filter(Boolean).length;

  // Matches the shared Analytics Cockpit: five equal instruments, missing data contributes 0.
  const score=Math.round((testing+training+goalScore+readyScore+competition)/5);
  const status:CoachRosterAnalytics["status"]=score>=80?"Strong":score>=60?"Building":score>=40?"Watch":"Attention";

  const openDev=(snap.development||[]).filter(d=>d.status!=="Complete").sort((x,y)=>({High:0,Medium:1,Low:2}[x.priority||"Medium"])-({High:0,Medium:1,Low:2}[y.priority||"Medium"]));
  const normalizedDevelopment=normalizeDevelopmentSystem(snap.developmentSystem);
  const athleteStage=developmentStageForAge(athleteAge);
  const coachPositionPriorities=positionSkillPriorities(athleteSport,a.position).filter(name=>sportSkillTrees[athleteSport].includes(name));
  const nextStageSkill=coachPositionPriorities.find(name=>normalizedDevelopment.skillProgress[name]?.level!=="Advanced")||coachPositionPriorities[0]||sportSkillTrees[athleteSport][0];
  const stageCurrent=progressionLevelFromSkill(normalizedDevelopment.skillProgress[nextStageSkill]?.level);
  const stageNext=nextProgressionLevel(stageCurrent,athleteStage);
  const nextProgression=`${nextStageSkill}: ${stageCurrent} → ${stageNext}`;
  const skillNeed=Object.entries(normalizedDevelopment.skillProgress).find(([,entry])=>entry?.level==="Needs Work")?.[0];

  const attention=declining[0]
   ?`${declining[0].name} ↓ ${Math.abs(declining[0].imp)}%`
   :readyScore>0&&readyScore<60
   ?`Readiness ${readyScore}/100`
   :sportWorkouts.length>=3&&training<60
   ?`Training ${training}%`
   :athleteGoals.length>0&&goalScore<50
   ?`Goals ${goalScore}%`
   :coverage<3
   ?`Data coverage ${coverage}/5`
   :"No major flag";

  const focus=openDev[0]?.title||skillNeed||declining[0]?.name||(readyScore>0&&readyScore<60?"Recovery / Habits":"Continue current plan");
  const topTrend=improving[0]?.name||"Waiting for repeat tests";
  const topTrendValue=improving[0]?.imp??null;

  const currentWeek=mondayOfWeek();
  let storedReviewWeek="";
  const reviewMarkerId=a.id.startsWith("cloud:")?a.id.slice(6):a.id;
  try{storedReviewWeek=localStorage.getItem(`coachReviewWeek:${reviewMarkerId}`)||""}catch{}
  const liveReviewComplete=Boolean(cloudSelectedAthleteName&&cloudSelectedAthleteName===a.name&&currentCoachWeeklyReviews.some(r=>r.weekStart===currentWeek));
  const reviewComplete=liveReviewComplete||storedReviewWeek===currentWeek;
  const reviewStatus:CoachRosterAnalytics["reviewStatus"]=reviewComplete?"Complete":storedReviewWeek&&storedReviewWeek<currentWeek?"Due":"Check";

  const latestObservation=normalizedDevelopment.practiceObservations.slice().sort((x,y)=>y.date.localeCompare(x.date)||y.id-x.id)[0];
  const observationStatus:CoachRosterAnalytics["observationStatus"]=latestObservation&&latestObservation.date>=currentWeek?"Current":"Due";
  const lastObservation=latestObservation?`${latestObservation.skill} · ${friendlyDate(latestObservation.date)}`:"No observation this week";

  const targets=athleteTestTargets(a).filter(t=>t.sport===athleteSport);
  const dueTarget=targets.filter(t=>t.retestDate&&t.retestDate<=today()).sort((x,y)=>x.retestDate.localeCompare(y.retestDate))[0];
  const singleResult=testSummaries.find(x=>x.count===1);
  const staleResult=testSummaries.filter(x=>x.lastDate&&new Date(x.lastDate).getTime()<Date.now()-30*86400000).sort((x,y)=>x.lastDate.localeCompare(y.lastDate))[0];
  const targetDef=dueTarget?definitions(athleteSport).find(x=>x.id===dueTarget.testId):undefined;
  const retestName=dueTarget?(targetDef?.name||dueTarget.testId):singleResult?.name||staleResult?.name||"";
  const retestReason=dueTarget?`Scheduled ${friendlyDate(dueTarget.retestDate)}`:singleResult?"Only one result recorded":staleResult?`Last tested ${friendlyDate(staleResult.lastDate)}`:"";

  const upcomingCompetition=comps.filter(c=>c.date>=today()).sort((x,y)=>x.date.localeCompare(y.date))[0];
  const nextCompetition=upcomingCompetition?(upcomingCompetition.opponent||upcomingCompetition.eventType):"";
  const nextCompetitionDate=upcomingCompetition?.date||"";
  const competitionSoon=Boolean(nextCompetitionDate&&new Date(nextCompetitionDate).getTime()-Date.now()<=7*86400000);

  let nextAction="Continue current plan";
  let nextActionTab:Tab="Development";
  let nextActionSubView:string|undefined;
  if(readyScore>0&&readyScore<60){nextAction="Review recovery before the next hard session";nextActionTab="Coach";nextActionSubView="Readiness"}
  else if(declining[0]){nextAction=`Review ${declining[0].name} trend`;nextActionTab="Analytics"}
  else if(reviewStatus==="Due"){nextAction="Complete this week's Coach Review";nextActionTab="Coach";nextActionSubView="Review"}
  else if(observationStatus==="Due"){nextAction="Add a Practice Observation";nextActionTab="Development";nextActionSubView="Observations"}
  else if(retestName){nextAction=`Retest ${retestName}`;nextActionTab="Testing"}
  else if(competitionSoon){nextAction=`Prepare for ${nextCompetition}`;nextActionTab="Competition"}

  const attentionPoints=
   (status==="Attention"?5:status==="Watch"?3:0)+
   (readyScore>0&&readyScore<60?5:readyScore>0&&readyScore<70?2:0)+
   (declining[0]?4:0)+
   (reviewStatus==="Due"?2:0)+
   (observationStatus==="Due"?1:0)+
   (retestName?2:0)+
   (competitionSoon?1:0);

  return {
   id:a.id,name:a.name,sport:athleteSport,position:a.position,team:a.team,
   score,status,coverage,testing,training,goals:goalScore,readiness:readyScore,competition,
   testingAvailable:testSummaries.length>0,trainingAvailable:sportWorkouts.length>0,goalsAvailable:athleteGoals.length>0,
   readinessAvailable:recentReadiness.length>0,competitionAvailable:comps.length>0,
   testsCount:testRows.length,workoutsDone,competitionsCount:comps.length,
   topTrend,topTrendValue,attention,focus,reviewStatus,observationStatus,lastObservation,
   retestName,retestReason,nextCompetition,nextCompetitionDate,nextAction,nextActionTab,nextActionSubView,attentionPoints,
   developmentStage:athleteStage,nextProgression
  };
 };

 const coachRosterAnalytics=all.map(coachAnalyticsFor);
 const coachRosterSorted=coachRosterAnalytics.slice().sort((a,b)=>{
  if(coachRosterSort==="Performance")return b.score-a.score;
  if(coachRosterSort==="Readiness")return (b.readiness||-1)-(a.readiness||-1);
  if(coachRosterSort==="Name")return a.name.localeCompare(b.name);
  const rank={Attention:0,Watch:1,Building:2,Strong:3};
  return rank[a.status]-rank[b.status]||a.score-b.score;
 });
 const coachAttentionCount=coachRosterAnalytics.filter(x=>x.status==="Attention"||x.status==="Watch").length;
 const coachStrongCount=coachRosterAnalytics.filter(x=>x.status==="Strong").length;
 const coachAvgSharedScore=coachRosterAnalytics.length?Math.round(coachRosterAnalytics.reduce((sum,x)=>sum+x.score,0)/coachRosterAnalytics.length):0;
 const coachLowReadiness=coachRosterAnalytics.filter(x=>x.readinessAvailable&&x.readiness<60).length;
 const coachReviewChecks=coachRosterAnalytics.filter(x=>x.reviewStatus!=="Complete").length;
 const coachObservationDue=coachRosterAnalytics.filter(x=>x.observationStatus==="Due").length;
 const coachRetestQueue=coachRosterAnalytics.filter(x=>Boolean(x.retestName)).sort((a,b)=>(a.retestReason.startsWith("Scheduled")?0:1)-(b.retestReason.startsWith("Scheduled")?0:1));
 const coachUpcomingCompetitions=coachRosterAnalytics.filter(x=>x.nextCompetitionDate&&new Date(x.nextCompetitionDate).getTime()-Date.now()<=7*86400000).length;
 const coachAttentionQueue=coachRosterAnalytics.filter(x=>x.attentionPoints>0).sort((a,b)=>b.attentionPoints-a.attentionPoints||a.score-b.score).slice(0,5);
 const reviewPlayer=coachRosterAnalytics.find(x=>x.id===reviewPlayerId);

 const openCoachAthlete=(id:string,target:Tab="Home",subView?:string)=>{
  const record=all.find(x=>x.id===id);
  if(!record)return;
  if(target==="Coach"&&subView){try{sessionStorage.setItem("coachHubMode",subView)}catch{}}
  if(target==="Development"&&subView){try{sessionStorage.setItem("developmentView",subView)}catch{}}
  if(id.startsWith("cloud:")&&selectCoachRosterAthlete){
   selectCoachRosterAthlete(id.slice(6));
   window.setTimeout(()=>setTab(target),120);
   return;
  }
  activate(record);
  window.setTimeout(()=>setTab(target),40);
 };
 const openReviewWorkflow=(id:string)=>{
  setReviewPlayerId(id);
  window.setTimeout(()=>document.getElementById("coach-player-workflow")?.scrollIntoView({behavior:"smooth",block:"start"}),60);
 };

 const summaries:RosterSummary[]=coachRosterAnalytics.map(a=>({
  id:a.id,name:a.name,sport:a.sport,position:a.position,team:a.team,
  goals:a.goals,workouts:a.workoutsDone,tests:a.testsCount,competitions:a.competitionsCount,
  readiness:a.readiness,score:a.score
 }));
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

 return <><div className="hero"><small>ROSTER</small><h1>Roster</h1><p>{canManageProfiles?"Admin athlete management, quick switching, and side-by-side comparison.":"Coach athlete view, quick switching, and side-by-side comparison. Player profile information is read-only."}</p></div>
 {!canManageProfiles&&<div className="coachRosterReadOnlyNotice"><span>🔒</span><div><small>PROFILE OWNERSHIP</small><b>Coaches cannot edit Player profiles</b><p>Use the roster to select athletes and review development data. Profile corrections must be made by the Player or Admin.</p></div></div>}
 
 

 {!canManageProfiles&&<section className="coachCommandCenter">
  <div className="coachCommandHead">
   <div><small>COACH COMMAND CENTER</small><h2>This Week</h2><p>Scan the roster, handle the highest-priority athletes first, then move through reviews, observations, retests, and competition prep.</p></div>
   <div className="coachCommandCloudStatus"><span className="tag">{friendlyDate(mondayOfWeek())} WEEK</span><span className={"coachCloudRosterState "+coachRosterCloudStatus}>{coachRosterCloudStatus==="ready"?`Cloud roster · ${coachCloudRoster.length}`:coachRosterCloudStatus==="loading"?"Loading cloud roster…":coachRosterCloudStatus==="error"?"Cloud roster issue":"Local roster"}</span></div>
  </div>

  <div className="coachWeeklyDashboard">
   <div><small>PLAYERS</small><b>{coachRosterAnalytics.length}</b><span>managed roster</span></div>
   <div><small>NEED ATTENTION</small><b>{coachAttentionCount}</b><span>Watch / Attention</span></div>
   <div><small>REVIEW CHECKS</small><b>{coachReviewChecks}</b><span>due or verify</span></div>
   <div><small>RETESTS</small><b>{coachRetestQueue.length}</b><span>testing follow-up</span></div>
   <div><small>LOW READINESS</small><b>{coachLowReadiness}</b><span>under 60</span></div>
   <div><small>COMPETITIONS</small><b>{coachUpcomingCompetitions}</b><span>next 7 days</span></div>
  </div>

  <div className="coachCommandColumns">
   <div className="coachAttentionQueue">
    <div className="sectionHead"><div><small>PRIORITY ORDER</small><h2>Coach Attention Queue</h2></div><span className="tag">{coachAttentionQueue.length}</span></div>
    {coachAttentionQueue.length===0?<div className="coachQueueEmpty"><b>No urgent flags</b><span>Continue the current plan and keep observations, reviews, and retesting current.</span></div>:coachAttentionQueue.map((a,index)=><div className="coachAttentionRow" key={a.id}>
     <span className="coachQueueNumber">{index+1}</span>
     <div className="coachQueueIdentity"><b>{a.name}</b><small>{a.sport}{a.position?` · ${a.position}`:""}</small></div>
     <div className="coachQueueReason"><small>WHY</small><b>{a.attention!=="No major flag"?a.attention:a.nextAction}</b></div>
     <div className="coachQueueAction"><small>NEXT</small><b>{a.nextAction}</b></div>
     <button onClick={()=>openReviewWorkflow(a.id)}>Review Player</button>
    </div>)}
   </div>

   <div className="coachRetestQueue">
    <div className="sectionHead"><div><small>TEST → DEVELOP → RETEST</small><h2>Retest Queue</h2></div><span className="tag">{coachRetestQueue.length}</span></div>
    {coachRetestQueue.length===0?<div className="coachQueueEmpty"><b>No retests flagged</b><span>Repeat tests on a consistent schedule to keep trends useful.</span></div>:coachRetestQueue.slice(0,6).map(a=><div className="coachRetestRow" key={a.id}><div><b>{a.name}</b><small>{a.retestName} · {a.retestReason}</small></div><button onClick={()=>openCoachAthlete(a.id,"Testing")}>Open Testing</button></div>)}
   </div>
  </div>

  {reviewPlayer&&<div className="coachPlayerWorkflow" id="coach-player-workflow">
   <div className="coachWorkflowHead"><div><small>2-MINUTE PLAYER REVIEW</small><h2>{reviewPlayer.name}</h2><p>{reviewPlayer.sport}{reviewPlayer.position?` · ${reviewPlayer.position}`:""} · Performance {reviewPlayer.score}/100 · {reviewPlayer.status}</p></div><button onClick={()=>setReviewPlayerId("")}>Close</button></div>
   <div className="coachWorkflowSteps">
    <button onClick={()=>openCoachAthlete(reviewPlayer.id,"Coach","Readiness")}><span>1</span><small>READINESS</small><b>{reviewPlayer.readinessAvailable?`${reviewPlayer.readiness}/100`:"No data"}</b><em>Review recovery</em></button>
    <button onClick={()=>openCoachAthlete(reviewPlayer.id,"Analytics")}><span>2</span><small>ANALYTICS</small><b>{reviewPlayer.score}/100</b><em>{reviewPlayer.attention}</em></button>
    <button onClick={()=>openCoachAthlete(reviewPlayer.id,"Development")}><span>3</span><small>DEVELOPMENT</small><b>{reviewPlayer.focus}</b><em>Review priority</em></button>
    <button onClick={()=>openCoachAthlete(reviewPlayer.id,"Coach","Review")}><span>4</span><small>COACH REVIEW</small><b>{reviewPlayer.reviewStatus}</b><em>Weekly perspective</em></button>
    <button onClick={()=>openCoachAthlete(reviewPlayer.id,"Development","Observations")}><span>5</span><small>OBSERVATION</small><b>{reviewPlayer.observationStatus}</b><em>{reviewPlayer.lastObservation}</em></button>
    <button className="nextAction" onClick={()=>openCoachAthlete(reviewPlayer.id,reviewPlayer.nextActionTab,reviewPlayer.nextActionSubView)}><span>6</span><small>NEXT ACTION</small><b>{reviewPlayer.nextAction}</b><em>Act on the clearest signal</em></button>
   </div>
  </div>}
 </section>}

 {!canManageProfiles&&<section className="coachRosterQuickScan">
  <div className="coachRosterQuickHead">
   <div><small>COACH QUICK SCAN</small><h2>Player Analytics Overview</h2><p>One glance per athlete. The five numbers use the same core Analytics Cockpit calculations.</p></div>
   <label>Sort<select value={coachRosterSort} onChange={e=>setCoachRosterSort(e.target.value as typeof coachRosterSort)}><option>Attention</option><option>Performance</option><option>Readiness</option><option>Name</option></select></label>
  </div>

  <div className="coachRosterQuickSummary">
   <div><small>ROSTER</small><b>{coachRosterAnalytics.length}</b><span>players</span></div>
   <div><small>AVG PERFORMANCE</small><b>{coachAvgSharedScore}</b><span>/100</span></div>
   <div><small>WATCH / ATTENTION</small><b>{coachAttentionCount}</b><span>review first</span></div>
   <div><small>STRONG</small><b>{coachStrongCount}</b><span>80+ score</span></div>
  </div>

  <div className="coachRosterAnalyticsGrid">
   {coachRosterSorted.map(a=><article className={"coachPlayerAnalyticsCard "+a.status.toLowerCase()+(isSelectedCoachRecord(a)?" active":"")} key={a.id}>
    <div className="coachPlayerAnalyticsTop">
     <div className="rosterAvatar">{a.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()||"A"}</div>
     <div className="coachPlayerIdentity"><b>{a.name}</b><small>{a.sport}{a.position?" · "+a.position:""}{a.team?" · "+a.team:""}</small><span>{isSelectedCoachRecord(a)?"ACTIVE ATHLETE":"PLAYER"}</span></div>
     <div className="coachPlayerScore"><small>PERFORMANCE</small><strong>{a.score}</strong><span>/100</span></div>
    </div>

    <div className="coachPlayerStatusLine">
     <span className={"coachStatusPill "+a.status.toLowerCase()}>{a.status}</span>
     <span>Data {a.coverage}/5</span>
    </div>

    <div className="coachPlayerInstrumentRow">
     {[
      {label:"Testing",value:a.testing,available:a.testingAvailable},
      {label:"Training",value:a.training,available:a.trainingAvailable},
      {label:"Goals",value:a.goals,available:a.goalsAvailable},
      {label:"Readiness",value:a.readiness,available:a.readinessAvailable},
      {label:"Competition",value:a.competition,available:a.competitionAvailable}
     ].map(x=><div className={!x.available?"noData":""} key={x.label}><small>{x.label}</small><b>{x.available?x.value:"—"}</b></div>)}
    </div>

    <div className="coachPlayerFastRead">
     <div className="positive"><small>TOP TREND</small><b>{a.topTrend}</b><span>{a.topTrendValue!==null?`+${a.topTrendValue}% from baseline`:"Repeat the same test to build a trend."}</span></div>
     <div className={a.attention==="No major flag"?"positive":"watch"}><small>CHECK FIRST</small><b>{a.attention}</b><span>{a.attention==="No major flag"?"No major warning in the current overview.":"Open the athlete before changing the plan."}</span></div>
    </div>

    <div className="coachPlayerFocus"><small>CURRENT DEVELOPMENT FOCUS</small><b>{a.focus}</b></div>

    <div className="coachWorkflowMiniStrip">
     <span className={a.reviewStatus==="Complete"?"done":a.reviewStatus==="Due"?"due":"check"}><small>COACH REVIEW</small><b>{a.reviewStatus}</b></span>
     <span className={a.observationStatus==="Current"?"done":"due"}><small>OBSERVATION</small><b>{a.observationStatus}</b></span>
     <span className={a.retestName?"due":"done"}><small>RETEST</small><b>{a.retestName||"Current"}</b></span>
     <span><small>NEXT COMP</small><b>{a.nextCompetitionDate?friendlyDate(a.nextCompetitionDate):"—"}</b></span>
    </div>

    <div className="coachStageLine"><small>{a.developmentStage.toUpperCase()} STAGE</small><b>{a.nextProgression}</b></div>
    <div className="coachNextAction"><small>NEXT COACH ACTION</small><b>{a.nextAction}</b></div>

    <div className="coachPlayerActions">
     <button onClick={()=>openReviewWorkflow(a.id)}>Review Player</button>
     <button className="featureAction" onClick={()=>openCoachAthlete(a.id,"Analytics")}>Open Analytics</button>
    </div>
   </article>)}
  </div>
 </section>}

 {canManageProfiles&&<><div className="rosterCoachStrip">
  <div><small>TOP MOMENTUM</small><b>{rosterLeader?.name||"—"}</b><span>{rosterLeader?rosterLeader.score+" score":"No data"}</span></div>
  <div><small>READY TO TRAIN</small><b>{rosterReady}</b><span>75+ readiness</span></div>
  <div><small>NEEDS ATTENTION</small><b>{rosterNeedsAttention}</b><span>under 60 score</span></div>
  <div><small>ROSTER SIZE</small><b>{summaries.length}</b><span>athletes</span></div>
 </div>
 

 <div className="grid three">
  <div className="stat"><small>Athletes</small><b>{all.length}</b></div>
  <div className="stat"><small>Roster Avg Score</small><b>{avgScore}</b></div>
  <div className="stat"><small>Teams</small><b>{teams.length}</b></div>
 </div></>}

 <div className="card compactTools"><div className="sectionHead"><div><h2>Team & Comparison Tools</h2><small>Optional roster analysis</small></div><button className="featureAction" onClick={()=>setShowRosterTools(x=>!x)}>{showRosterTools?"Hide":"Show"}</button></div></div>
 {showRosterTools&&<><div className="card"><div className="sectionHead"><h2>Team Overview</h2><label className="inlineFilter">Team<select value={teamFilter} onChange={e=>setTeamFilter(e.target.value)}>{teamNames.map(x=><option key={x}>{x}</option>)}</select></label></div>
 {teamSummaries.length===0?<p>Add team names to athlete profiles to build team summaries.</p>:<div className="teamSummaryGrid">{teamSummaries.map(t=><div className="teamSummaryCard" key={t.team}><small>TEAM</small><h2>{t.team}</h2><div className="miniTeamStats"><span><b>{t.athletes}</b><small>Athletes</small></span><span><b>{t.avgScore}</b><small>Avg Score</small></span><span><b>{t.ready}</b><small>Ready</small></span><span><b>{t.tests}</b><small>Tests</small></span></div></div>)}</div>}
 </div>
 {canManageProfiles&&<><div className="card"><div className="sectionHead"><h2>Roster Overview</h2><span className="tag">{filteredRoster.length} shown</span></div><div className="rosterOverviewGrid">{filteredRoster.map(a=><div className={"rosterSummaryCard "+(activeAthleteId===a.id?"activeRoster":"")} key={a.id}>
  <div className="rosterSummaryTop"><div className="rosterAvatar">{a.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()||"A"}</div><div><b>{a.name}</b><small>{a.sport}{a.position?" · "+a.position:""}{a.team?" · "+a.team:""}</small></div><strong>{a.score}</strong></div>
  <div className="rosterMetrics"><span><small>Tests</small><b>{a.tests}</b></span><span><small>Workouts</small><b>{a.workouts}</b></span><span><small>Games</small><b>{a.competitions}</b></span><span><small>Readiness</small><b>{a.readiness||"—"}</b></span></div>
  <button className={activeAthleteId===a.id?"primary":""} onClick={()=>{const record=all.find(x=>x.id===a.id);if(record)activate(record)}}>{activeAthleteId===a.id?"Active Athlete":"Switch Athlete"}</button>
 </div>)}</div></div></>}
 <div className="card"><h2>Compare Athletes</h2><div className="two"><label>Athlete A<select value={compareA} onChange={e=>setCompareA(e.target.value)}>{summaries.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></label><label>Athlete B<select value={compareB} onChange={e=>setCompareB(e.target.value)}><option value="">Select athlete</option>{summaries.filter(x=>x.id!==compareA).map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></label></div>
 {aSummary&&bSummary?<div className="athleteCompare">
  <div><b>{aSummary.name}</b><span><small>Score</small><strong>{aSummary.score}</strong></span><span><small>Tests</small><strong>{aSummary.tests}</strong></span><span><small>Workouts</small><strong>{aSummary.workouts}</strong></span><span><small>Competitions</small><strong>{aSummary.competitions}</strong></span><span><small>Readiness</small><strong>{aSummary.readiness||"—"}</strong></span></div>
  <div><b>{bSummary.name}</b><span><small>Score</small><strong>{bSummary.score}</strong></span><span><small>Tests</small><strong>{bSummary.tests}</strong></span><span><small>Workouts</small><strong>{bSummary.workouts}</strong></span><span><small>Competitions</small><strong>{bSummary.competitions}</strong></span><span><small>Readiness</small><strong>{bSummary.readiness||"—"}</strong></span></div>
 </div>:<p>Select a second athlete to compare performance activity.</p>}</div>

 </>}
 {canManageProfiles&&<><div className="card rosterAddCard setupAnchor" id="roster-add-athlete" tabIndex={-1}><div className="sectionHead"><h2>Add Player</h2><span className="tag">New Athlete</span></div><p className="rosterAddIntro">Create a separate athlete profile with sport-specific position, team, measurements, and handedness.</p>
  <div className="two">
   <label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Athlete name"/></label>
   <label>Sport<select value={newSport} onChange={e=>{const v=e.target.value as Sport;setNewSport(v);setPosition("")}}>{sports.map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Age<input type="number" min="6" max="99" value={age} onChange={e=>setAge(e.target.value)} placeholder="e.g. 14"/></label>
   <label>Position<select value={positions[newSport].includes(position)?position:""} onChange={e=>setPosition(e.target.value)}><option value="">Select position</option>{positions[newSport].map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Team<input value={team} onChange={e=>setTeam(e.target.value)} placeholder="Team"/></label>
   <label>Season<input value={season} onChange={e=>setSeason(e.target.value)}/></label>
   <label>Height<input value={height} onChange={e=>setHeight(e.target.value)} placeholder="e.g. 5'10&quot;"/></label>
   <label>Weight<input value={weight} onChange={e=>setWeight(e.target.value)} placeholder="e.g. 165 lb"/></label>
   <label>Handedness<select value={handedness} onChange={e=>setHandedness(e.target.value as "Right"|"Left")}><option>Right</option><option>Left</option></select></label>
  </div>
  <button className="primary" onClick={add}>Create Player Profile</button>
 </div></>}

 {canManageProfiles&&<><div className="card rosterManagementCard"><div className="sectionHead rosterManagementHead"><div><h2>{canManageProfiles?"Roster Management":"Coach Roster"}</h2><small>{canManageProfiles?"Admin profile controls":"Select an athlete to review. Profile identity is read-only."}</small></div>{canManageProfiles&&<button className="featureAction rosterManagementAdd" onClick={scrollToAddAthlete}>＋ Add Player</button>}</div>
  <div className="rosterGrid">{all.map(a=><div className={"rosterCard "+(activeAthleteId===a.id?"activeRoster":"")} key={a.id}>
   <div className="rosterAvatar">{a.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()||"A"}</div>
   <div><b>{a.name}</b><small>{a.sport}{a.position?" · "+a.position:""}{a.team?" · "+a.team:""}</small><small>{a.height||"—"} · {a.weight||"—"} · {a.handedness}</small></div>
   <div className="rosterCardActions"><button onClick={()=>activate(a)}>{activeAthleteId===a.id?"Active":"Switch"}</button>{canManageProfiles&&<button className="rosterEditButton" onClick={()=>editAthlete(a)}>Edit Profile</button>}{canManageProfiles&&a.id!=="primary"&&<button onClick={()=>setRoster(x=>x.filter(r=>r.id!==a.id))}>Remove</button>}</div>
  </div>)}</div>
 </div></>}

 {canManageProfiles&&<><div className="grid three">
  <div className="stat"><small>Total Tests</small><b>{totalTests}</b></div>
  <div className="stat"><small>Total Competitions</small><b>{totalCompetitions}</b></div>
  <div className="stat"><small>Active Athlete</small><b>{profile.name}</b></div>
 </div>

 <div className="card"><h2>Athlete Data Isolation</h2><p>Each athlete keeps independent goals, workouts, testing history, development plans, readiness logs, competitions, reports, test targets, and weekly reviews.</p></div></>}

 </>;
}

function DataCenter({profile,sport,roster,activeAthleteId,goals,workouts,results,dev,program,readiness,coachNotes,competitions,reportNotes,developmentSystem,setProfile,setGoals,setWorkouts,setResults,setDev,setProgram,setReadiness,setCoachNotes,setCompetitions,setReportNotes,setDevelopmentSystem,setRoster,setActiveAthleteId,setSport}:{profile:Profile;sport:Sport;roster:AthleteRecord[];activeAthleteId:string;goals:Goal[];workouts:Workout[];results:Result[];dev:DevelopmentItem[];program:TrainingProgram|null;readiness:ReadinessLog[];coachNotes:CoachNote[];competitions:CompetitionLog[];reportNotes:ReportNote[];developmentSystem:DevelopmentSystemState;setProfile:React.Dispatch<React.SetStateAction<Profile>>;setGoals:any;setWorkouts:any;setResults:any;setDev:any;setProgram:any;setReadiness:any;setCoachNotes:any;setCompetitions:any;setReportNotes:any;setDevelopmentSystem:React.Dispatch<React.SetStateAction<DevelopmentSystemState>>;setRoster:any;setActiveAthleteId:any;setSport:any}){
 const [message,setMessage]=useState("");
 const dataSchemaVersion="1.3";
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
 const currentSnapshot:AthleteSnapshot={profile:{...profile},goals:[...goals],workouts:[...workouts],results:[...results],development:[...dev],program,readiness:[...readiness],coachNotes:[...coachNotes],competitions:[...competitions],reportNotes:[...reportNotes],developmentSystem:normalizeDevelopmentSystem(developmentSystem)};

 const athleteRecords:AthleteRecord[]=[
  {id:"primary",name:profile.name,sport:profile.sport||sport,position:profile.position,team:profile.team,season:profile.season,height:profile.height,weight:profile.weight,handedness:profile.handedness,age:profile.age??""},
  ...roster.filter(r=>r.id!=="primary")
 ];

 const download=(name:string,data:any)=>{
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
 };

 const exportCurrent=()=>{
  download(`athlete-${profile.name.replace(/\s+/g,"-").toLowerCase()}-backup.json`,{version:"17.0",created:new Date().toISOString(),athleteId:activeAthleteId,sport,snapshot:currentSnapshot});
  setMessage("Current athlete backup created.");
 };

 const exportAll=()=>{
  const athletes:Record<string,AthleteSnapshot>={};
  athleteRecords.forEach(a=>{
    try{
      const raw=localStorage.getItem(`athleteData:${a.id}`);
      athletes[a.id]=raw?JSON.parse(raw):a.id===activeAthleteId?currentSnapshot:{profile:{name:a.name,position:a.position,team:a.team,season:a.season,height:a.height,weight:a.weight,handedness:a.handedness,age:a.age??"",sport:a.sport},goals:[],workouts:[],results:[],development:[],program:null,readiness:[],coachNotes:[],competitions:[],reportNotes:[],developmentSystem:createDefaultDevelopmentSystem()};
    }catch{
      athletes[a.id]=currentSnapshot;
    }
  });
  const envelope:BackupEnvelope={version:"17.0",created:new Date().toISOString(),activeAthleteId,roster:athleteRecords,athletes};
  download("athlete-performance-full-backup.json",envelope);
  setMessage("Full roster backup created.");
 };

 const applySnapshot=(snap:AthleteSnapshot)=>{
  const safe=snap||({} as AthleteSnapshot);
  const restoredSport=(safe.profile?.sport&&sports.includes(safe.profile.sport)?safe.profile.sport:sport) as Sport;
  setSport(restoredSport);
  setProfile({name:safe.profile?.name??"Athlete",position:safe.profile?.position??"",team:safe.profile?.team??"",season:safe.profile?.season??"2026-27",height:safe.profile?.height??"",weight:safe.profile?.weight??"",handedness:safe.profile?.handedness==="Left"?"Left":"Right",age:safe.profile?.age??"",sport:restoredSport});
  setGoals(Array.isArray(safe.goals)?safe.goals:[]);
  setWorkouts(Array.isArray(safe.workouts)?safe.workouts:[]);
  setResults(Array.isArray(safe.results)?safe.results:[]);
  setDev(Array.isArray(safe.development)?safe.development:[]);
  setProgram(safe.program??null);
  setReadiness(Array.isArray(safe.readiness)?safe.readiness:[]);
  setCoachNotes(Array.isArray(safe.coachNotes)?safe.coachNotes:[]);
  setCompetitions(Array.isArray(safe.competitions)?safe.competitions:[]);
  setReportNotes(Array.isArray(safe.reportNotes)?safe.reportNotes:[]);
  setDevelopmentSystem(safe.developmentSystem?normalizeDevelopmentSystem(safe.developmentSystem):createDefaultDevelopmentSystem());
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
  const blank:AthleteSnapshot={profile:{...profile},goals:[],workouts:[],results:[],development:[],program:null,readiness:[],coachNotes:[],competitions:[],reportNotes:[],developmentSystem:createDefaultDevelopmentSystem()};
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


 return <><div className="sectionDivider"><span><i/>Data & Backup</span></div><div className="hero phase38Hero"><small>DATA & BACKUP</small><h1>Backup & Restore</h1><p>Protect athlete data before changing devices, browsers, or future app versions.</p></div>

 <div className="saveStatus"><span className="saveDot"/><div><b>{lastSavedLabel}</b><small>Schema v{dataSchemaVersion} · Per-athlete storage enabled</small></div></div>
 <div className="grid three">
  <div className="stat"><small>Active Athlete</small><b>{profile.name}</b></div>
  <div className="stat"><small>Saved Data Items</small><b>{totalItems}</b><span>{healthLabel}</span></div>
  <div className="stat"><small>Roster Athletes</small><b>{athleteRecords.length}</b></div>
 </div>

 
 <div className="card"><div className="sectionHead"><h2>Recovery Tools</h2><span className="tag">RECOVERY</span></div><p>Use these tools if upgrading from an older local build or if the app opens the wrong athlete workspace.</p><div className="dataActions"><button onClick={migrateLegacyData}>Migrate Legacy Data</button><button onClick={repairActiveIndex}>Repair Active Athlete</button></div></div>
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
 const recent=readiness.slice(0,7),avgReadiness=recent.length?Math.round(recent.reduce((a,r)=>a+readinessScoreV2(r,Number(profile.age||0)),0)/recent.length):0;
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
return <><div className="sectionDivider"><span><i/>Coach Recommendations</span></div><div className="hero"><small>COACHING PLAN</small><h1>Smart Coach</h1><p>{profile.name} · {sport}{profile.position?" · "+profile.position:""} · Readiness, training load, goals, testing, and competition in one coaching view.</p></div>

 <div className="coachHero"><div><small>COACH PLAN INDICATOR</small><strong>{score}</strong><span>/100</span></div><div><b>{score>=80?"Strong Momentum":score>=60?"Good Base — Keep Building":"Focus Needed"}</b><p>This is a Coach planning indicator based on goals, training consistency, readiness, and testing activity. It is separate from the shared Analytics Performance Score.</p></div></div>

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
