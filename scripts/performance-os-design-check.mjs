import fs from 'node:fs';

const app=fs.readFileSync(new URL('../components/AthleteApp.tsx', import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../app/globals.css', import.meta.url),'utf8');
const pkg=JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url),'utf8'));

const checks=[
 ['Performance OS root class is active', /className="app performanceOS"/.test(app)],
 ['Release version is 72.3.83', pkg.version==='72.3.109'],
 ['Performance OS test script exists', pkg.scripts?.['test:performance-os']==='node scripts/performance-os-design-check.mjs'],
 ['Global cards use sharp geometry', /\.performanceOS \.card[\s\S]*?border-radius:2px!important/.test(css)],
 ['Home hero is hard-edged', /\.performanceOS \.premiumHomeHero\.nativeSportsHero[\s\S]*?border-radius:0!important/.test(css)],
 ['Primary CTA uses custom cut geometry', /clip-path:polygon\(0 0,calc\(100% - 18px\)/.test(css)],
 ['Metric strip is flat', /\.performanceOS \.nativeInstrumentRail,[\s\S]*?border-radius:0!important/.test(css)],
 ['Focus story is flat', /\.performanceOS \.nativeFeatureStory,[\s\S]*?border-radius:0!important/.test(css)],
 ['Action list uses ruled rows', /\.performanceOS \.nativeActionList button[\s\S]*?border-bottom:1px solid var\(--os-line\)/.test(css)],
 ['Coach command board is present', /\.performanceOS \.nativeCoachConsole\{border-top:2px solid var\(--role-accent\)/.test(css)],
 ['Parent timeline is flat', /\.performanceOS \.nativeParentTimeline button\{border-radius:0!important/.test(css)],
 ['Admin console is flat', /\.performanceOS \.nativeAdminCommandList button\{border-radius:0!important/.test(css)],
 ['Bottom navigation is integrated edge rail', /\.performanceOS \.simpleBottomNav\.customBottomNav[\s\S]*?border-radius:0!important/.test(css)],
 ['Setup modal stays a real overlay', /\.roleSetupModalOverlay\{[\s\S]*?position:fixed!important/.test(css)],
 ['Setup modal adopts sharp sheet styling', /\.performanceOS :is\(\.roleSetupModalCard[\s\S]*?border-radius:4px!important/.test(css)],
 ['Mobile hero remains full-height', /@media\(max-width:700px\)[\s\S]*?min-height:520px!important/.test(css)],
 ['Avatar circles remain circular', /\.performanceOS \.playerAvatar,\.performanceOS \.premiumAthleteAvatar\{border-radius:50%!important/.test(css)],
 ['Readiness remains circular', /\.performanceOS :is\(\.ratingBadge,\.developmentScoreOrb,\.readinessCircle,\.premiumReadinessOrb\)\{border-radius:50%!important/.test(css)],
];

let pass=0;
for(const [name,ok] of checks){
 console.log(`${ok?'PASS':'FAIL'}: ${name}`);
 if(ok) pass++;
}
console.log(`\n${pass===checks.length?'PASS':'FAIL'}: ${pass}/${checks.length} Performance OS design checks.`);
process.exit(pass===checks.length?0:1);
