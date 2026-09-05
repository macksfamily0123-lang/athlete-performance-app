import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");

const checks=[
 ["Junior Goal mode has explicit owner fallback", athlete.includes('const juniorGoalOwner=juniorMode&&viewRole==="Player"')],
 ["Junior Goal owner can create goals", athlete.includes('const canOwnGoals=juniorGoalOwner||')],
 ["Junior goal card is immediately available", athlete.includes('juniorGoalCard juniorGoalEntryCard')],
 ["Junior goal card uses setup anchor", athlete.includes('id="setup-goals"')],
 ["Junior goal has visible text input", athlete.includes('placeholder="Type your goal here..."')],
 ["Junior goal input has accessible label", athlete.includes('aria-label="My goal"')],
 ["Junior goal has category selector", athlete.includes('What kind of goal?<select')],
 ["Junior goal has success criteria input", athlete.includes('How will you know you did it?<input')],
 ["Junior goal has optional note", athlete.includes('Anything you want to remember?<input')],
 ["Junior goal has Save My Goal action", athlete.includes('juniorSaveGoalButton')&&athlete.includes('Save My Goal')],
 ["Junior save disabled until goal text exists", athlete.includes('disabled={!title.trim()}')],
 ["Junior goal saves as short-term", athlete.includes('onClick={()=>add("Short-term")}')],
 ["Standard goal button uses safe zero-argument wrapper", athlete.includes('onClick={()=>add()}>{viewRole==="Admin"?"Create Goal · Admin Override":"Create My Goal"}')&&!athlete.includes('onClick={add}>{viewRole==="Admin"?"Create Goal · Admin Override":"Create My Goal"}')],
 ["Goal add accepts explicit type", athlete.includes('const add=(forcedType?:Goal["type"])=>')],
 ["Goal add still requires ownership and title", athlete.includes('if(!canOwnGoals||!title.trim())return')],
 ["Junior normal goal form is not duplicated", athlete.includes('{canOwnGoals&&!juniorMode?<div className="card setupAnchor createGoalCard"')],
 ["Junior mode does not show read-only warning", athlete.includes(':!juniorMode?<div className="card goalReadOnlyOwnership"')],
 ["Junior goal fields forced visible", css.includes('.juniorGoalInputArea input')&&css.includes('visibility:visible!important')],
 ["Junior goal fields are touch-enabled", css.includes('pointer-events:auto!important')],
 ["Junior Save button is forest-green primary", css.includes('.juniorSaveGoalButton')&&css.includes('var(--forest-soft),var(--forest-deep)')],
 ["Junior mobile layout retained", css.includes('@media(max-width:700px)')&&css.includes('.juniorGoalInputArea{grid-template-columns:1fr!important}')],
 ["Managed Parent session still presents Player role", beta.includes('role:access.role==="Parent"&&parentPlayerMode?"Player":access.role')],
 ["Managed Parent goal save RPC retained", beta.includes('parent_save_managed_player_state')],
 ["Normal Parent role still cannot create goal", /Parent:\{[\s\S]*?createPlayerGoal:false/.test(athlete)],
 ["Coach still cannot create goal", /Coach:\{[\s\S]*?createPlayerGoal:false/.test(athlete)],
 ["Player still can create goal", /Player:\{[\s\S]*?createPlayerGoal:true/.test(athlete)],
 ["RC19 ribbon", beta.includes("BETA · RC19 · v72.3.69")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} Junior Goal checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} Junior Goal checks.`);
