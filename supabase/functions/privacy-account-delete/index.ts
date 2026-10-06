export {};
declare const Deno: {env:{get:(name:string)=>string|undefined};serve:(handler:(req:Request)=>Promise<Response>)=>void};
// Server-only: credentials never appear in client bundles. JWT + fresh password
// verification binds erasure to the requesting account, never a client user id.
const base = Deno.env.get('SUPABASE_URL')!;
const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const allowedOrigins = new Set((Deno.env.get('PRIVACY_ALLOWED_ORIGINS')||'').split(',').map(x=>x.trim()).filter(Boolean));
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get('Origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(allowedOrigins.has(origin)?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS'}:{})};
 const respond=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(!allowedOrigins.has(origin))return respond({error:'Origin not allowed'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return respond({error:'POST required'},405);
 try{
 const authorization=req.headers.get('Authorization')||'';
 const userResponse=await fetch(base+'/auth/v1/user',{headers:{apikey:anon,Authorization:authorization}});
 if(!userResponse.ok)return respond({error:'Sign in required'},401);
 const user=await userResponse.json();
 const body=await req.json();
 if(body.confirmation!=='DELETE ACCOUNT'||typeof body.password!=='string'||body.password.length>256)return respond({error:'Password and DELETE ACCOUNT confirmation required'},400);
 const check=await fetch(base+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:anon,'Content-Type':'application/json'},body:JSON.stringify({email:user.email,password:body.password})});
 if(!check.ok)return respond({error:'Password verification failed'},403);
 const verified=await check.json();
 if(verified.user?.id!==user.id)return respond({error:'Account verification failed'},403);
 // Do not leave a second password-verification session behind.
 if(verified.access_token)await fetch(base+'/auth/v1/logout?scope=local',{method:'POST',headers:{apikey:anon,Authorization:'Bearer '+verified.access_token}});
 const erase=await fetch(base+'/rest/v1/rpc/privacy_delete_account_verified',{method:'POST',headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'},body:JSON.stringify({p_user:user.id})});
 if(!erase.ok){const error=await erase.json();return respond({error:error.message||'Deletion blocked. Review linked Players first.'},409)}
 return respond({deleted:true});
 }catch{return respond({error:'Unable to complete deletion. No confirmation of deletion was issued.'},500)}
});
