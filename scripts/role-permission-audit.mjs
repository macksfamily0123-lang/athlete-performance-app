import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");

const checks=[
 ["central permission matrix", athlete.includes("const rolePermissions:Record<AccountRole,Record<RolePermissionKey,boolean>>")],
 ["Player owns profile", /Player:\{[\s\S]*?editPlayerProfile:true/.test(athlete)],
 ["Coach cannot edit profile", /Coach:\{[\s\S]*?editPlayerProfile:false/.test(athlete)],
 ["Parent cannot edit profile", /Parent:\{[\s\S]*?editPlayerProfile:false/.test(athlete)],
 ["Admin profile override", /Admin:\{[\s\S]*?editPlayerProfile:true/.test(athlete)],

 ["Player can create goal", /Player:\{[\s\S]*?createPlayerGoal:true/.test(athlete)],
 ["Coach cannot create goal", /Coach:\{[\s\S]*?createPlayerGoal:false/.test(athlete)],
 ["Parent cannot create goal", /Parent:\{[\s\S]*?createPlayerGoal:false/.test(athlete)],
 ["Coach goal feedback allowed", /Coach:\{[\s\S]*?goalFeedback:true/.test(athlete)],
 ["Admin goal override allowed", /Admin:\{[\s\S]*?createPlayerGoal:true/.test(athlete)],
 ["Goals page uses actual-role guard plus Junior Player path", athlete.includes("const juniorGoalOwner=juniorMode&&viewRole===\"Player\"") && athlete.includes("(viewRole===actualRole)&&canRole(actualRole,\"createPlayerGoal\")")],
 ["Coach goal create UI removed", !athlete.includes(">Create Short-Term Goal</button>")],
 ["Coach goal feedback UI present", athlete.includes("Add Coach Feedback")],

 ["Player Daily Check-In allowed", /Player:\{[\s\S]*?playerDailyCheckIn:true/.test(athlete)],
 ["Coach Daily Check-In denied", /Coach:\{[\s\S]*?playerDailyCheckIn:false/.test(athlete)],
 ["Parent Daily Check-In denied", /Parent:\{[\s\S]*?playerDailyCheckIn:false/.test(athlete)],
 ["Daily save uses permission guard", athlete.includes('if(!canRole(accountRole,"playerDailyCheckIn"))return;')],

 ["Player Weekly Review allowed", /Player:\{[\s\S]*?playerWeeklyReview:true/.test(athlete)],
 ["Coach Player Weekly denied", /Coach:\{[\s\S]*?playerWeeklyReview:false/.test(athlete)],
 ["Parent Player Weekly denied", /Parent:\{[\s\S]*?playerWeeklyReview:false/.test(athlete)],

 ["Coach Weekly Review permission", /Coach:\{[\s\S]*?coachWeeklyReview:true/.test(athlete)],
 ["Player Coach Review denied", /Player:\{[\s\S]*?coachWeeklyReview:false/.test(athlete)],
 ["Parent Coach Review denied", /Parent:\{[\s\S]*?coachWeeklyReview:false/.test(athlete)],

 ["Coach manages Development Plan", /Coach:\{[\s\S]*?manageDevelopmentPlan:true/.test(athlete)],
 ["Player cannot manage Development Plan", /Player:\{[\s\S]*?manageDevelopmentPlan:false/.test(athlete)],
 ["Parent cannot manage Development Plan", /Parent:\{[\s\S]*?manageDevelopmentPlan:false/.test(athlete)],
 ["Development objectives use role guard", athlete.includes('const canManageObjectives=canRole(accountRole,"manageDevelopmentPlan");')],
 ["Player gets read-only development objective notice", athlete.includes("Development priorities are managed by the Coach")],

 ["Parent cloud write restricted to managed-Player or support RPCs", beta.includes('if(access.role==="Parent"){') && beta.includes('parent_save_managed_player_state') && beta.includes('parent_save_support_data')],
 ["Coach cloud save preserves Player readiness/reviews", beta.includes('if(access.role==="Coach"){') && beta.includes("weeklyReviews:Array.isArray(current.weeklyReviews)?current.weeklyReviews:[]")],
 ["Admin full cloud access retained", beta.includes('if(!supabase||!access||![\"Coach\",\"Admin\"].includes(access.role))return [];')],
 ["Admin Coach review save retained", beta.includes('if(![\"Coach\",\"Admin\"].includes(access.role))throw new Error("Coach or Admin account required.");')],

 ["Analytics writes require current real role", athlete.includes("const writeAsCurrentRole=accountRole===actualAccountRole;")],
 ["Analytics formal development action Coach/Admin only", athlete.includes('canRole(actualAccountRole,"manageDevelopmentPlan")')],
 ["Testing write permission centralized", athlete.includes('const canWriteTesting=canRole(accountRole,"writeTesting");')],
 ["Parent may schedule workout support", /Parent:\{[\s\S]*?scheduleWorkout:true/.test(athlete)],
 ["Parent may enter competition result support", /Parent:\{[\s\S]*?enterCompetitionResult:true/.test(athlete)],
 ["Parent still cannot broadly write training", /Parent:\{[\s\S]*?writeTraining:false/.test(athlete)],
 ["Parent still cannot broadly write competition", /Parent:\{[\s\S]*?writeCompetition:false/.test(athlete)],
 ["Training write permission centralized", athlete.includes('const canWriteTraining=canRole(accountRole,"writeTraining");')],
 ["Competition write permission centralized", athlete.includes('const canWriteCompetition=canRole(accountRole,"writeCompetition");')]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} permission checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} role & permission checks.`);
