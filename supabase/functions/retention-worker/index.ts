export {};
declare const Deno:{env:{get:(name:string)=>string|undefined};serve:(handler:(req:Request)=>Promise<Response>)=>void};
const env=(key:string)=>Deno.env.get(key)||'';
Deno.serve(async(req:Request)=>{
 const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
 if(req.method!=='POST')return reply({error:'POST required'},405);
 const secret=env('RETENTION_CRON_SECRET');
 if(secret.length<32||req.headers.get('x-retention-secret')!==secret)return reply({error:'Unauthorized'},401);
 try{
 const body=await req.json();
 const rpc=async(name:string,args:unknown={})=>{const r=await fetch(env('SUPABASE_URL')+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:env('SUPABASE_SERVICE_ROLE_KEY'),Authorization:'Bearer '+env('SUPABASE_SERVICE_ROLE_KEY'),'Content-Type':'application/json'},body:JSON.stringify(args)});if(!r.ok)throw Error('Database operation failed');return r.json()};
 if(body.dryRun!==false)return reply({dryRun:true,subjects:(await rpc('retention_subjects')).length});
 if(!env('RESEND_API_KEY')||!env('RETENTION_FROM_EMAIL')||!env('RETENTION_REPLY_TO')||!/^https:\/\//.test(env('RETENTION_APP_URL')))return reply({error:'Email setup incomplete; deletion not run'},503);
 await rpc('retention_prepare');
 const notices=await rpc('retention_pending');let accepted=0,delivered=0,failed=0;
 for(const n of notices){
 let providerId=n.provider_id;
 if(!providerId){
 const final=n.stage==='final';
 await new Promise(resolve=>setTimeout(resolve,600));
 const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env('RESEND_API_KEY'),'Content-Type':'application/json','Idempotency-Key':n.id},body:JSON.stringify({from:env('RETENTION_FROM_EMAIL'),to:[n.email],reply_to:env('RETENTION_REPLY_TO'),subject:final?'Elite Performance: inactivity deletion warning':'Elite Performance: six months without activity',text:final?`An account or player record you manage has been inactive. It is scheduled for deletion after 12 months of inactivity, and no earlier than 30 days after this warning is delivered. Sign in to keep it active: ${env('RETENTION_APP_URL')}\nQuestions or a deletion request: ${env('RETENTION_REPLY_TO')}`:`An account or player record you manage has had six months without activity. We delete eligible records after 12 months of inactivity, following a final warning at least 30 days before deletion. Sign in to keep it active: ${env('RETENTION_APP_URL')}\nQuestions: ${env('RETENTION_REPLY_TO')}`})});
 if(!r.ok)throw Error('Email provider unavailable; deletion not run');providerId=(await r.json()).id;
 if(typeof providerId!=='string'||!providerId)throw Error('Missing email receipt');
 if(!await rpc('retention_notice_result',{p_notice:n.id,p_provider_id:providerId,p_result:'accepted'}))throw Error('Receipt not saved');accepted++;
 }
 await new Promise(resolve=>setTimeout(resolve,600));
 const r=await fetch('https://api.resend.com/emails/'+encodeURIComponent(providerId),{headers:{Authorization:'Bearer '+env('RESEND_API_KEY')}});
 if(!r.ok)throw Error('Delivery verification unavailable; deletion not run');
 const event=(await r.json()).last_event;
 const result=event==='delivered'?'delivered':['bounced','complained','failed','suppressed'].includes(event)?'failed':null;
 if(result){if(!await rpc('retention_notice_result',{p_notice:n.id,p_provider_id:providerId,p_result:result}))throw Error('Delivery result not saved');if(result==='delivered')delivered++;else failed++;}
 }
 const erased=await rpc('retention_sweep');
 return reply({accepted,delivered,failed,...erased});
 }catch{return reply({error:'Retention stopped. Check email delivery and database configuration before retrying.'},502)}
});
