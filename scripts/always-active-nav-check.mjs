import fs from 'node:fs';

const app=fs.readFileSync('components/AthleteApp.tsx','utf8');
const css=fs.readFileSync('app/globals.css','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const checks=[
 ['version is 72.3.83',pkg.version==='72.3.107'],
 ['primary navigation is portaled',app.includes('<ViewportPortal>{juniorPlayerMode?')],
 ['viewport nav class is present',app.includes('viewportBottomNav')],
 ['nav sheet is portaled',app.includes('{navSheet&&<ViewportPortal><div className="simpleNavOverlay viewportNavOverlay"')],
 ['train sheet copy wrapper exists',app.includes('className="simpleNavChoiceCopy"')],
 ['viewport nav has high z-index',css.includes('z-index:12000!important')],
 ['viewport nav explicitly accepts pointer events',css.includes('.viewportBottomNav{')&&css.includes('pointer-events:auto!important')],
 ['viewport nav buttons explicitly accept pointer events',css.includes('.viewportBottomNav button{')],
 ['nav sheet is above nav dock',css.includes('z-index:12050!important')],
 ['mobile nav sheet uses two-column grid',css.includes('grid-template-columns:32px minmax(0,1fr)!important')],
 ['mobile nav sheet separates action row',css.includes('grid-template-areas:"icon copy" "icon action"!important')],
 ['nav copy can wrap safely',css.includes('overflow-wrap:anywhere!important')],
 ['Development remains a Train destination',app.includes('{tab:"Development",group:"Train"')],
 ['bottom nav retains five primary controls',app.includes('openNavGroup("Train")')&&app.includes('openNavGroup("Progress")')&&app.includes('openNavGroup("More")')],
];
let pass=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(ok)pass++;}
console.log(`\n${pass}/${checks.length} checks passed.`);
if(pass!==checks.length)process.exit(1);
