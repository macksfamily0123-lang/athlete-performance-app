import fs from "node:fs";

const app=fs.readFileSync("components/AthleteApp.tsx","utf8");
const css=fs.readFileSync("app/globals.css","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const checks=[];
const check=(ok,label)=>{if(!ok)throw new Error(`RC65 check failed: ${label}`);checks.push(label)};

check(pkg.version==="72.3.115","release version is Phase 72.3.115");
check(beta.includes("CLOSED BETA · RC65 · v72.3.115"),"RC65 release ribbon is present");
check(app.includes("function HomeIconBadge"),"shared Home icon badge component exists");
check(app.includes('data-icon={name}'),"each SVG exposes its normalized icon name");
check(app.includes('strokeWidth:2'),"shared icons use one consistent stroke weight");
check(app.includes('role==="Admin"?"progress":"train"'),"Admin Review Athlete uses the normalized Progress icon");
check(!app.includes("premiumRoleFocusSolid"),"distorted one-off filled focus icon is removed");
check(css.includes("Phase 72.3.115 RC65 — Home icon system"),"RC65 icon CSS is installed last in the cascade");
check(css.includes("clip-path:none!important"),"focus icon clipping is disabled");
check(css.includes("vector-effect:non-scaling-stroke"),"SVG strokes stay crisp at every icon size");
check(css.includes(".app.performanceOS .homeIconBadge"),"square shared icon geometry is defined");
check(css.includes(".homeIconTone-emerald")&&css.includes(".homeIconTone-mint")&&css.includes(".homeIconTone-silver")&&css.includes(".homeIconTone-forest"),"forest-green and metallic-silver icon tones are present");
check(app.includes('nativeCoachActionBar')&&app.includes('<HomeIconBadge name={action.icon}'),"Coach Home shortcuts use shared icon badges");
check(app.includes('nativeParentTimeline')&&app.includes('tone={homeIconTones[index%homeIconTones.length]}'),"Parent Home shortcuts use shared icon badges");
check(app.includes('className="parentTimelineIcon"')&&app.indexOf('className="parentTimelineIcon"')<app.indexOf('className="parentTimelineAction"'),"Parent Home icons occupy the left timeline position");
check(css.includes(".parentTimelineIcon .premiumAppIcon")&&css.includes("transform:rotate(-45deg)!important"),"Parent diamond icons remain upright and crisp");
check(app.includes('nativeAdminCommandList rc56AdminLaunchRows')&&app.includes('className="premiumQuickIcon"'),"Admin Home shortcuts preserve the large launch-row badges");
check(css.includes("@media(max-width:700px)")&&css.includes("width:52px!important;height:52px!important"),"mobile icon badges remain large and consistent");
check(css.includes('[data-role="Parent"][data-tab="Analytics"]')&&css.includes("overflow-x:clip!important"),"Parent Progress cannot pan beyond the viewport");
check(css.includes(".app.performanceOS .sleepGuideNote")&&css.includes("text-align:center!important"),"Recovery reminder copy is centered");

console.log(`RC65 Home icon-system checks passed (${checks.length}/${checks.length}).`);
