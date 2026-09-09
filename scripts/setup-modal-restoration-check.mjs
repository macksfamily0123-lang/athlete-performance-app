import fs from 'node:fs';
const app=fs.readFileSync(new URL('../components/AthleteApp.tsx', import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../app/globals.css', import.meta.url),'utf8');
const checks=[
 ['setup modal overlay exists',app.includes('className="roleSetupModalOverlay"')],
 ['setup modal is accessible dialog',app.includes('role="dialog" aria-modal="true"')&&app.includes('aria-labelledby="role-setup-title"')],
 ['setup card has modal class',app.includes('roleHomeSetupCard roleSetupModalCard')],
 ['setup only appears when incomplete',app.includes('setupPct<100')],
 ['temporary hide state prevents blocking setup destination',app.includes('roleSetupTemporarilyHidden')&&app.includes('setRoleSetupTemporarilyHidden(true)')],
 ['temporary hide resets as progress changes',app.includes('setRoleSetupTemporarilyHidden(false)},[setupPct,accountRole]')],
 ['overlay is viewport-fixed',css.includes('.roleSetupModalOverlay')&&css.includes('position:fixed!important;inset:0!important')],
 ['overlay centers modal',css.includes('display:grid!important;place-items:center!important')],
 ['modal is above app navigation',css.includes('z-index:9800!important')],
 ['modal is mobile constrained',css.includes('max-height:86vh!important')&&css.includes('.roleSetupModalCard .setupSteps{grid-template-columns:1fr!important}')],
 ['setup open actions remain wired',app.includes('onClick={()=>goToSetupItem(x)}')],
 ['dismiss behavior remains wired',app.includes('onClick={dismissRoleSetup}')],
];
let pass=0;
for(const [label,ok] of checks){if(ok){pass++; console.log(`PASS ${label}`)}else console.error(`FAIL ${label}`)}
if(pass!==checks.length){console.error(`FAILED: ${pass}/${checks.length}`);process.exit(1)}
console.log(`PASS: ${pass}/${checks.length} setup modal restoration checks.`)
