import fs from "node:fs";
const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const checks=[
 ["version 72.3.92",pkg.version==="72.3.92"],
 ["fallback tracker catalog",app.includes("fallbackTrackerProviders")&&app.includes("trackerCatalog.map")],
 ["primary Google Health heading",app.includes("Connect Google Health")],
 ["primary Google Health CTA",app.includes("trackerPrimaryConnect")&&app.includes('connectTracker("google-health")')],
 ["clear OAuth explanation",app.includes("You will be sent to Google to approve read-only access")],
 ["provider buttons remain visible",app.includes("trackerProviders.map")],
 ["provider button names service",app.includes("Connect ${provider.name}")],
 ["preview privacy explanation",app.includes("PLAYER / PARENT SIGN-IN REQUIRED")],
 ["parent choose player action",app.includes("Choose Player")&&app.includes("openParentPlayers")],
 ["status-load fallback copy",app.includes("You can still use the Google Health button above")],
 ["hero styling",css.includes(".trackerConnectHero")&&css.includes(".trackerPrimaryConnect")],
 ["mobile full-width connect",css.includes(".trackerPrimaryConnect{width:100%")],
 ["new npm test script",pkg.scripts["test:tracker-connect-ux"]?.includes("rc42-tracker-connect-ux-check.mjs")],
];
const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks) console.log(`${ok?"PASS":"FAIL"}: ${name}`);
if(failed.length){console.error(`FAIL: ${checks.length-failed.length}/${checks.length} RC42 tracker connection UX checks.`);process.exit(1)}
console.log(`PASS: ${checks.length}/${checks.length} RC42 Tracker Connection UX checks.`);
