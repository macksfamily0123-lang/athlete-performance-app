import fs from "node:fs";

const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const boundary=fs.readFileSync("components/BetaErrorBoundary.tsx","utf8");
const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");

const checks=[
 ["Runtime error boundary exists", boundary.includes("getDerivedStateFromError")&&boundary.includes("componentDidCatch")],
 ["Athlete app is wrapped", beta.includes("<BetaErrorBoundary")&&beta.includes("<AthleteApp betaBridge={bridge!}/>")],
 ["Crash recovery reload exists", boundary.includes("window.location.reload()")],
 ["Crash report path exists", boundary.includes("Report This Error")&&beta.includes("openFeedbackWithContext(details)")],
 ["Offline state listener", beta.includes('window.addEventListener("offline",sync)')&&beta.includes('window.addEventListener("online",sync)')],
 ["Offline banner", beta.includes("betaOfflineBanner")],
 ["Feedback diagnostic context", beta.includes("Beta diagnostic context")&&beta.includes("Version: 72.3.51 RC2")],
 ["No passwords in diagnostics", !/feedbackContext[\s\S]{0,2000}password/i.test(beta)],
 ["No auth tokens in diagnostics", !/feedbackContext[\s\S]{0,2000}(access_token|refresh_token|session\\.access_token)/i.test(beta)],
 ["Feedback app version", beta.includes('app_version:"72.3.51"')],
 ["Feedback diagnostic transparency", beta.includes("No password or authentication token is included.")],
 ["RC2 ribbon", beta.includes("BETA · RC2 · v72.3.51")],
 ["Cloud retry retained", athlete.includes("retryPendingCloudSave")],
 ["Pending cloud save retained", athlete.includes("pendingCloudSave")],
 ["Migration 004 retained", fs.existsSync("supabase/migrations/004_admin_full_access.sql")]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} reliability checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} reliability checks.`);
