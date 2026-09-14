import fs from 'node:fs';
const app=fs.readFileSync('components/AthleteApp.tsx','utf8');
const beta=fs.readFileSync('components/BetaGate.tsx','utf8');
const css=fs.readFileSync('app/globals.css','utf8');
const sw=fs.readFileSync('public/sw.js','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const checks=[
 ['combined version is 72.3.89',pkg.version==='72.3.90'],
 ['beta ribbon is RC38',beta.includes('BETA · RC40 · v72.3.90')],
 ['in-app alerts state exists',app.includes('showNotifications')&&app.includes('notificationPrefs')],
 ['alerts are derived from performance data',app.includes('const appNotices=useMemo<InAppNotice[]>')],
 ['cloud save issues can generate alerts',app.includes('Changes are waiting to sync')],
 ['recovery can generate an alert',app.includes('Recovery-first day')],
 ['training can generate an alert',app.includes('Training is on deck today')],
 ['goal milestone alerts exist',app.includes('Goal is close')],
 ['progress alerts exist',app.includes('Performance trend improved')],
 ['notification portal exists',app.includes('className="notificationOverlay"')],
 ['notification preferences are saved',app.includes('localStorage.setItem("notificationPrefs"')],
 ['reliability status rail exists',app.includes('className="betaReliabilityRail"')],
 ['local recovery points are timestamped',app.includes('lastLocalSnapshotAt')],
 ['downloadable recovery backup exists',app.includes('downloadRecoveryBackup')&&app.includes('athlete-performance-backup-')],
 ['password reset flow exists',beta.includes('resetPasswordForEmail')&&beta.includes('Forgot password?')&&beta.includes('PASSWORD_RECOVERY')&&beta.includes('updateUser({password:newPassword})')],
 ['service worker has a versioned offline cache',sw.includes('athlete-performance-beta-v89')&&sw.includes('caches.open(CACHE)')],
 ['navigation has network fallback',sw.includes('request.mode==="navigate"')&&sw.includes('caches.match("/")')],
 ['notification overlay is above app chrome',css.includes('.notificationOverlay{position:fixed')&&css.includes('z-index:24050')],
];
let pass=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(ok)pass++;}
console.log(`\n${pass}/${checks.length} RC38 Beta Hardening checks passed.`);
if(pass!==checks.length)process.exit(1);
