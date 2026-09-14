import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const app=fs.readFileSync(path.join(root,"components","AthleteApp.tsx"),"utf8");
const css=fs.readFileSync(path.join(root,"app","globals.css"),"utf8");
const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
const checks=[
  ["version is 72.3.89",pkg.version==="72.3.90"],
  ["TextSize supports 180% maximum",app.includes('"maximum"')&&app.includes('"180%"')],
  ["TextSize supports 150% accessibility step",app.includes('"xxlarge"')&&app.includes('"150%"')],
  ["saved maximum text size is accepted",app.includes('"xxlarge","maximum"')],
  ["maximum maps to 1.80 scale",css.includes('[data-text-size="maximum"]{--ui-text-scale:1.80}')],
  ["parent foreground fills hero",css.includes('[data-role="Parent"] .eliteRoleHeroForeground')&&css.includes('object-fit:cover!important')],
  ["coach foreground fills hero",css.includes('[data-role="Coach"] .eliteRoleHeroForeground')&&css.includes('object-fit:cover!important')],
  ["parent hero has full-height fill",css.includes('[data-role="Parent"] .rc34RoleHero')&&css.includes('min-height:360px!important')],
  ["coach hero has full-height fill",css.includes('[data-role="Coach"] .rc34RoleHero')&&css.includes('min-height:360px!important')],
  ["coach role asset remains dedicated",app.includes('/commercial-scenes/ice-hockey-coach-role.webp')],
  ["parent role asset remains dedicated",app.includes('/commercial-scenes/ice-hockey-parent.webp')],
  ["maximum text nav remains readable",css.includes('.app[data-text-size="maximum"] .simpleBottomNav')],
];
let pass=0;
for(const [name,ok] of checks){console.log(`${ok?"PASS":"FAIL"}: ${name}`);if(ok)pass++;}
console.log(`\n${pass}/${checks.length} RC38 text/role hero checks passed.`);
if(pass!==checks.length)process.exit(1);
