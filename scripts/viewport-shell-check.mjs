import fs from 'node:fs';
const app=fs.readFileSync(new URL('../components/AthleteApp.tsx', import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../app/globals.css', import.meta.url),'utf8');
const pkg=JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url),'utf8'));
const checks=[
 ['RC31 version',pkg.version==='72.3.116'],
 ['React portal is imported',app.includes('import {createPortal} from "react-dom";')],
 ['ViewportPortal helper exists',app.includes('function ViewportPortal')&&app.includes('createPortal(children,document.body)')],
 ['guided setup is portaled',app.includes('{showGuide&&accountSession&&<ViewportPortal><div className="guideOverlay"')],
 ['skip setup warning is portaled',app.includes('{showSkipSetupDisclaimer&&<ViewportPortal><div className="skipSetupOverlay"')],
 ['role setup is portaled',app.includes('setupPct<100&&<ViewportPortal><div className="roleSetupModalOverlay"')],
 ['setup overlays are fixed to viewport',/\.roleSetupModalOverlay,\s*\.guideOverlay,\s*\.skipSetupOverlay\{[\s\S]*?position:fixed!important/.test(css)],
 ['setup overlays are centered',/\.roleSetupModalOverlay,\s*\.guideOverlay,\s*\.skipSetupOverlay\{[\s\S]*?place-items:center!important/.test(css)],
 ['bottom nav is fixed',/\.performanceOS \.simpleBottomNav\.customBottomNav,[\s\S]*?position:fixed!important/.test(css)],
 ['bottom nav clears old translate transform',/\.performanceOS \.simpleBottomNav\.customBottomNav,[\s\S]*?transform:none!important/.test(css)],
 ['bottom nav uses five equal columns',/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)!important/.test(css)],
 ['bottom nav spans viewport safely',/width:min\(100vw,760px\)!important/.test(css)],
 ['bottom nav sits below setup modal',css.includes('z-index:9000!important')&&css.includes('z-index:10020!important')],
 ['main reserves persistent nav space',/padding-bottom:calc\(92px \+ env\(safe-area-inset-bottom\)\)!important/.test(css)],
 ['small-screen dock remains full width',/@media\(max-width:430px\)[\s\S]*?width:100vw!important/.test(css)],
];
let pass=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(ok)pass++;}
console.log(`\n${pass===checks.length?'PASS':'FAIL'}: ${pass}/${checks.length} viewport shell checks.`);
process.exit(pass===checks.length?0:1);
