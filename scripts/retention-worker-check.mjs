import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';import assert from 'node:assert/strict';
const code=ts.transpileModule(fs.readFileSync('supabase/functions/retention-worker/index.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
let checks=0;
async function run({secret='s'.repeat(64),dryRun=false,missing=false,providerFail=false,event='delivered',accepted=false}={}){
 let handler;const calls=[];const values={RETENTION_CRON_SECRET:'s'.repeat(64),SUPABASE_URL:'https://db.test',SUPABASE_SERVICE_ROLE_KEY:'private',RESEND_API_KEY:missing?'':'mail-private',RETENTION_FROM_EMAIL:'App <app@example.test>',RETENTION_REPLY_TO:'help@example.test',RETENTION_APP_URL:'https://app.test'};
 const fetch=async(url,opts={})=>{calls.push({url,body:opts.body});if(url.includes('api.resend.com')){if(providerFail)return new Response('{}',{status:503});return Response.json(opts.method==='POST'?{id:'mail-id'}:{last_event:event})}const name=url.split('/').at(-1);return Response.json(name==='retention_pending'?[{id:'notice-id',email:'parent@example.test',stage:'final',provider_id:accepted?'mail-id':null}]:name==='retention_subjects'?[]:name==='retention_sweep'?{players:0,accounts:0}:true)};
 vm.runInNewContext(code,{exports:{},Deno:{env:{get:k=>values[k]},serve:h=>handler=h},fetch,Response,Request,console,setTimeout:fn=>fn()});
 const r=await handler(new Request('https://edge.test',{method:'POST',headers:{'x-retention-secret':secret},body:JSON.stringify({dryRun})}));return {r,calls};
}
const check=(x,label)=>{assert.ok(x,label);checks++;console.log('PASS:',label)};
let x=await run({secret:'bad'});check(x.r.status===401&&x.calls.length===0,'Wrong cron secret cannot reach database or email');
x=await run({dryRun:true});check(!x.calls.some(c=>/resend|sweep|prepare/.test(c.url)),'Dry run never sends or deletes');
x=await run({missing:true});check(x.r.status===503&&x.calls.length===0,'Missing mail configuration stops automation');
x=await run({providerFail:true});check(x.r.status===502&&!x.calls.some(c=>c.url.endsWith('retention_sweep')),'Mail outage stops deletion');
x=await run();check(x.calls.some(c=>c.body?.includes('"p_result":"delivered"')),'Provider delivery is recorded');check(x.calls.some(c=>c.url.endsWith('retention_sweep')),'Verified pipeline reaches protected database sweep');
x=await run({accepted:true});check(!x.calls.some(c=>c.url.includes('resend.com')&&c.body),'Stored receipt is polled without sending twice');
x=await run({event:'bounced'});check(x.calls.some(c=>c.body?.includes('"p_result":"failed"')),'Bounce holds affected records');
console.log(`Retention worker checks passed (${checks}/${checks}).`);
