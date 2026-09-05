import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");

const checks=[
 ["Junior More still lists core secondary features", athlete.includes('(["Coach","Development","Testing","Competition"] as Tab[])')],
 ["Junior All Features button exists", athlete.includes("See All My Features")],
 ["Junior button opens command palette", athlete.includes('setNavSheet(null);setCommandOpen(true)')],
 ["Junior command overlay has dedicated class", athlete.includes("juniorFeatureOverlay")],
 ["Junior command palette has dedicated class", athlete.includes("juniorFeaturePalette")],
 ["Junior palette has child-friendly title", athlete.includes("All My Features")],
 ["Junior palette has child-friendly search", athlete.includes("Search my features…")],
 ["Junior empty-search state exists", athlete.includes("No matching feature. Try a different word.")],

 ["Junior quick action Today label", athlete.includes('juniorPlayerMode?"Today"')],
 ["Junior quick action My Goal label", athlete.includes('juniorPlayerMode?"My Goal"')],
 ["Junior quick action Training label", athlete.includes('juniorPlayerMode?"Training"')],
 ["Junior quick action My Tests label", athlete.includes('juniorPlayerMode?"My Tests"')],
 ["Junior quick action How I'm Doing label", athlete.includes('juniorPlayerMode?"How I\'m Doing"')],
 ["Junior quick action How I Feel label", athlete.includes('juniorPlayerMode?"How I Feel"')],
 ["Junior quick action My Skills label", athlete.includes('juniorPlayerMode?"My Skills"')],
 ["Junior quick action Games label", athlete.includes('juniorPlayerMode?"Games"')],

 ["Junior palette is no longer hidden", !css.includes('.app[data-junior="true"] .commandPalette,\n.app[data-junior="true"] .advancedTools{display:none!important}')],
 ["Advanced Junior tools remain hidden", css.includes('.app[data-junior="true"] .advancedTools{display:none!important}')],
 ["Junior palette explicitly visible", css.includes('.app[data-junior="true"] .juniorFeaturePalette')&&css.includes('display:block!important')],
 ["Junior overlay explicitly visible", css.includes('.app[data-junior="true"] .juniorFeatureOverlay')&&css.includes('display:grid!important')],
 ["Junior feature rows use large touch target", css.includes("min-height:64px!important")],
 ["Junior search uses 16px text", css.includes("font-size:16px!important")],
 ["Junior all-features button is green", css.includes(".juniorAllFeaturesButton")&&css.includes("var(--forest-soft)")],

 ["Persistent Admin Preview retained", athlete.includes('className="adminPreviewBar"')],
 ["Junior Goal Entry retained", athlete.includes("juniorGoalEntryCard")&&athlete.includes("Save My Goal")],
 ["Junior How Am I Doing retained", athlete.includes("juniorProgressButton")],
 ["Junior Back to Today retained", athlete.includes("juniorReturnBar")],
 ["Parent scheduling retained", athlete.includes("parentScheduleWorkoutCard")],
 ["Parent competition result retained", athlete.includes("parentCompetitionResultCard")],
 ["Family diagnostics retained", beta.includes("Family & Account Diagnostics")],
 ["No practice-plan generator", !athlete.includes("Generate Practice Plan")&&!athlete.includes("Practice Plan Generator")],
 ["RC19 ribbon", beta.includes("BETA · RC19 · v72.3.69")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} Junior More checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} Junior More / All Features checks.`);
