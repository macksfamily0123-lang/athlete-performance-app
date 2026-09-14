import "server-only";
import crypto from "node:crypto";
import {createClient} from "@supabase/supabase-js";
import {trackerCatalog,type TrackerProviderId} from "./trackerCatalog";

type BetaRole="Player"|"Coach"|"Parent"|"Admin";
type AuthContext={userId:string;role:BetaRole};
type CloudProviderId="google-health"|"oura"|"whoop"|"strava";

type ProviderConfig={
 id:CloudProviderId;clientId:string;clientSecret:string;authUrl:string;tokenUrl:string;scopes:string[];
};

const env=(key:string)=>String(process.env[key]||"").trim();
const configs:Record<CloudProviderId,ProviderConfig>={
 "google-health":{
  id:"google-health",
  clientId:env("GOOGLE_HEALTH_CLIENT_ID"),
  clientSecret:env("GOOGLE_HEALTH_CLIENT_SECRET"),
  authUrl:"https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl:"https://oauth2.googleapis.com/token",
  scopes:[
   "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
   "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
   "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
   "https://www.googleapis.com/auth/googlehealth.profile.readonly"
  ]
 },
 oura:{id:"oura",clientId:env("OURA_CLIENT_ID"),clientSecret:env("OURA_CLIENT_SECRET"),authUrl:"https://cloud.ouraring.com/oauth/authorize",tokenUrl:"https://api.ouraring.com/oauth/token",scopes:["daily","heartrate","workout","personal"]},
 whoop:{id:"whoop",clientId:env("WHOOP_CLIENT_ID"),clientSecret:env("WHOOP_CLIENT_SECRET"),authUrl:"https://api.prod.whoop.com/oauth/oauth2/auth",tokenUrl:"https://api.prod.whoop.com/oauth/oauth2/token",scopes:["offline","read:recovery","read:cycles","read:workout","read:sleep","read:profile"]},
 strava:{id:"strava",clientId:env("STRAVA_CLIENT_ID"),clientSecret:env("STRAVA_CLIENT_SECRET"),authUrl:"https://www.strava.com/oauth/authorize",tokenUrl:"https://www.strava.com/oauth/token",scopes:["read","activity:read_all"]}
};

const supabaseUrl=()=>{const v=env("NEXT_PUBLIC_SUPABASE_URL");if(!v)throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");return v};
const anonKey=()=>{const v=env("NEXT_PUBLIC_SUPABASE_ANON_KEY");if(!v)throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");return v};
const serviceKey=()=>{const v=env("SUPABASE_SERVICE_ROLE_KEY");if(!v)throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for tracker sync");return v};
export const serviceSupabase=()=>createClient(supabaseUrl(),serviceKey(),{auth:{persistSession:false,autoRefreshToken:false}});
const publicSupabase=()=>createClient(supabaseUrl(),anonKey(),{auth:{persistSession:false,autoRefreshToken:false}});

export async function authenticateTrackerRequest(request:Request):Promise<AuthContext>{
 const header=request.headers.get("authorization")||"";
 const token=header.startsWith("Bearer ")?header.slice(7).trim():"";
 if(!token)throw new Error("Sign in again to manage trackers.");
 const {data,error}=await publicSupabase().auth.getUser(token);
 if(error||!data.user)throw new Error("Your secure session could not be verified.");
 const db=serviceSupabase();
 const {data:account,error:accountError}=await db.from("beta_users").select("role,active").eq("user_id",data.user.id).maybeSingle();
 if(accountError||!account?.active)throw new Error("This beta account is not active.");
 return {userId:data.user.id,role:account.role as BetaRole};
}

export async function assertTrackerAccess(ctx:AuthContext,athleteId:string){
 if(!athleteId)throw new Error("Select a Player before opening tracker data.");
 const db=serviceSupabase();
 if(ctx.role==="Player"){
  const {data}=await db.from("athletes").select("id").eq("id",athleteId).eq("linked_user_id",ctx.userId).maybeSingle();
  if(!data)throw new Error("Tracker data is limited to the signed-in Player.");
  return;
 }
 if(ctx.role==="Parent"){
  const {data}=await db.from("parent_athletes").select("athlete_id").eq("parent_user_id",ctx.userId).eq("athlete_id",athleteId).maybeSingle();
  if(!data)throw new Error("This Parent is not connected to that Player.");
  return;
 }
 throw new Error("Tracker data is private to Player and Parent accounts.");
}

const tokenKey=()=>crypto.createHash("sha256").update(env("TRACKER_TOKEN_ENCRYPTION_KEY")||serviceKey()).digest();
export function encryptSecret(value:string|null|undefined){
 if(!value)return null;
 const iv=crypto.randomBytes(12);const cipher=crypto.createCipheriv("aes-256-gcm",tokenKey(),iv);
 const encrypted=Buffer.concat([cipher.update(value,"utf8"),cipher.final()]);const tag=cipher.getAuthTag();
 return [iv,tag,encrypted].map(x=>x.toString("base64url")).join(".");
}
export function decryptSecret(value:string|null|undefined){
 if(!value)return "";const [ivRaw,tagRaw,dataRaw]=value.split(".");
 const decipher=crypto.createDecipheriv("aes-256-gcm",tokenKey(),Buffer.from(ivRaw,"base64url"));
 decipher.setAuthTag(Buffer.from(tagRaw,"base64url"));
 return Buffer.concat([decipher.update(Buffer.from(dataRaw,"base64url")),decipher.final()]).toString("utf8");
}

const sha=(value:string)=>crypto.createHash("sha256").update(value).digest("hex");
export function isCloudProvider(value:string):value is CloudProviderId{return value in configs}
export function providerConfig(id:CloudProviderId){return configs[id]}
export function providerConfigured(id:TrackerProviderId){return isCloudProvider(id)&&Boolean(configs[id].clientId&&configs[id].clientSecret&&env("SUPABASE_SERVICE_ROLE_KEY"))}
export function providerCatalogStatus(){return trackerCatalog.map(item=>({...item,configured:providerConfigured(item.id)}))}
export function appBaseUrl(request:Request){return env("TRACKER_APP_URL")||env("NEXT_PUBLIC_APP_URL")||new URL(request.url).origin}
export function callbackUrl(request:Request,provider:CloudProviderId){return `${appBaseUrl(request)}/api/trackers/oauth/callback/${provider}`}

export async function createOAuthState(input:{userId:string;athleteId:string;provider:CloudProviderId;redirectTo?:string}){
 const raw=crypto.randomBytes(32).toString("base64url");
 const db=serviceSupabase();
 const {error}=await db.from("tracker_oauth_states").insert({state_hash:sha(raw),user_id:input.userId,athlete_id:input.athleteId,provider:input.provider,redirect_to:input.redirectTo||"/",expires_at:new Date(Date.now()+10*60_000).toISOString()});
 if(error)throw error;return raw;
}
export async function consumeOAuthState(raw:string,provider:CloudProviderId){
 const db=serviceSupabase();const hash=sha(raw);
 const {data,error}=await db.from("tracker_oauth_states").select("user_id,athlete_id,provider,redirect_to,expires_at").eq("state_hash",hash).maybeSingle();
 await db.from("tracker_oauth_states").delete().eq("state_hash",hash);
 if(error||!data||data.provider!==provider||new Date(data.expires_at).getTime()<Date.now())throw new Error("Tracker connection request expired. Start the connection again.");
 return data as {user_id:string;athlete_id:string;provider:CloudProviderId;redirect_to:string};
}

export function authorizationUrl(request:Request,provider:CloudProviderId,state:string){
 const cfg=configs[provider];if(!providerConfigured(provider))throw new Error(`${provider} developer credentials are not configured yet.`);
 const url=new URL(cfg.authUrl);url.searchParams.set("client_id",cfg.clientId);url.searchParams.set("redirect_uri",callbackUrl(request,provider));url.searchParams.set("response_type","code");url.searchParams.set("state",state);
 if(provider==="strava")url.searchParams.set("scope",cfg.scopes.join(","));else url.searchParams.set("scope",cfg.scopes.join(" "));
 if(provider==="google-health"){
  url.searchParams.set("access_type","offline");
  url.searchParams.set("prompt","consent");
  url.searchParams.set("include_granted_scopes","true");
 }
 return url.toString();
}

const basic=(id:string,secret:string)=>`Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
export async function exchangeAuthorizationCode(request:Request,provider:CloudProviderId,code:string){
 const cfg=configs[provider];const redirect=callbackUrl(request,provider);let response:Response;
 if(provider==="oura"){
  response=await fetch(cfg.tokenUrl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","Authorization":basic(cfg.clientId,cfg.clientSecret)},body:new URLSearchParams({grant_type:"authorization_code",code,redirect_uri:redirect}).toString(),cache:"no-store"});
 }else if(provider==="whoop"){
  response=await fetch(cfg.tokenUrl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"authorization_code",code,redirect_uri:redirect,client_id:cfg.clientId,client_secret:cfg.clientSecret}).toString(),cache:"no-store"});
 }else if(provider==="google-health"){
  response=await fetch(cfg.tokenUrl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({code,client_id:cfg.clientId,client_secret:cfg.clientSecret,redirect_uri:redirect,grant_type:"authorization_code"}).toString(),cache:"no-store"});
 }else{
  response=await fetch(cfg.tokenUrl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:cfg.clientId,client_secret:cfg.clientSecret,code,grant_type:"authorization_code"}).toString(),cache:"no-store"});
 }
 const json=await response.json().catch(()=>({}));if(!response.ok||!json.access_token)throw new Error(json?.errors?.[0]?.message||json?.message||json?.error_description||`Could not connect ${provider}.`);
 return json as any;
}

async function googleHealthIdentity(accessToken:string){
 try{const response=await fetch("https://health.googleapis.com/v4/users/me/identity",{headers:{Authorization:`Bearer ${accessToken}`,Accept:"application/json"},cache:"no-store"});if(!response.ok)return null;const json=await response.json();return String(json?.healthUserId||json?.name||"")||null}catch{return null}
}

export async function storeConnection(input:{userId:string;athleteId:string;provider:CloudProviderId;token:any}){
 const expiresIn=Number(input.token.expires_in||0);const expiresAt=input.token.expires_at?new Date(Number(input.token.expires_at)*1000).toISOString():expiresIn?new Date(Date.now()+expiresIn*1000).toISOString():null;
 let providerUserId=String(input.token.user_id||input.token.athlete?.id||input.token.user?.id||"")||null;
 if(input.provider==="google-health"&&input.token.access_token)providerUserId=await googleHealthIdentity(String(input.token.access_token))||providerUserId;
 const db=serviceSupabase();const {error}=await db.from("tracker_connections").upsert({athlete_id:input.athleteId,user_id:input.userId,provider:input.provider,provider_user_id:providerUserId,status:"connected",scopes:String(input.token.scope||"").split(/[ ,]+/).filter(Boolean),access_token_enc:encryptSecret(input.token.access_token),refresh_token_enc:encryptSecret(input.token.refresh_token),token_expires_at:expiresAt,last_error:null,updated_at:new Date().toISOString()},{onConflict:"athlete_id,user_id,provider"});if(error)throw error;
}

async function refreshConnection(connection:any){
 const provider=connection.provider as CloudProviderId;const cfg=configs[provider];const refresh=decryptSecret(connection.refresh_token_enc);if(!refresh)throw new Error("Reconnect this tracker to refresh access.");let response:Response;
 if(provider==="oura")response=await fetch(cfg.tokenUrl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","Authorization":basic(cfg.clientId,cfg.clientSecret)},body:new URLSearchParams({grant_type:"refresh_token",refresh_token:refresh}).toString(),cache:"no-store"});
 else if(provider==="whoop")response=await fetch(cfg.tokenUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({grant_type:"refresh_token",refresh_token:refresh,client_id:cfg.clientId,client_secret:cfg.clientSecret,scope:"offline"}),cache:"no-store"});
 else if(provider==="google-health")response=await fetch(cfg.tokenUrl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:cfg.clientId,client_secret:cfg.clientSecret,grant_type:"refresh_token",refresh_token:refresh}).toString(),cache:"no-store"});
 else response=await fetch(cfg.tokenUrl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:cfg.clientId,client_secret:cfg.clientSecret,grant_type:"refresh_token",refresh_token:refresh}).toString(),cache:"no-store"});
 const json=await response.json().catch(()=>({}));if(!response.ok||!json.access_token)throw new Error(json?.message||json?.error_description||"Tracker token refresh failed.");
 const expiresIn=Number(json.expires_in||0);const expiresAt=json.expires_at?new Date(Number(json.expires_at)*1000).toISOString():expiresIn?new Date(Date.now()+expiresIn*1000).toISOString():null;
 const accessEnc=encryptSecret(json.access_token);const refreshEnc=encryptSecret(json.refresh_token||refresh);
 const db=serviceSupabase();await db.from("tracker_connections").update({access_token_enc:accessEnc,refresh_token_enc:refreshEnc,token_expires_at:expiresAt,updated_at:new Date().toISOString()}).eq("id",connection.id);
 return {...connection,access_token_enc:accessEnc,refresh_token_enc:refreshEnc,token_expires_at:expiresAt,_accessToken:json.access_token};
}

async function connectionAccessToken(connection:any){
 const expires=connection.token_expires_at?new Date(connection.token_expires_at).getTime():Infinity;
 if(expires<Date.now()+120_000){const refreshed=await refreshConnection(connection);return refreshed._accessToken as string}
 return decryptSecret(connection.access_token_enc);
}
const isoDate=(d:Date)=>d.toISOString().slice(0,10);
const minutes=(msOrSec:number,kind:"ms"|"sec"="ms")=>Math.round(Number(msOrSec||0)/(kind==="ms"?60000:60));
const apiJson=async(url:string,token:string)=>{const r=await fetch(url,{headers:{Authorization:`Bearer ${token}`,Accept:"application/json"},cache:"no-store"});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j?.error?.message||j?.message||j?.error_description||`Tracker API returned ${r.status}`);return j};

type DailyMetric={metric_date:string;sleep_minutes?:number|null;sleep_score?:number|null;readiness_score?:number|null;resting_hr?:number|null;hrv_ms?:number|null;steps?:number|null;active_minutes?:number|null;calories?:number|null};
type WorkoutMetric={provider_workout_id:string;workout_date:string;workout_type:string;duration_minutes?:number|null;avg_hr?:number|null;max_hr?:number|null;calories?:number|null;distance_meters?:number|null;strain?:number|null};

const googleDate=(value:any)=>{
 if(!value)return "";
 if(typeof value==="string")return value.slice(0,10);
 const year=Number(value.year||0),month=Number(value.month||0),day=Number(value.day||0);
 if(!year||!month||!day)return "";
 return `${String(year).padStart(4,"0")}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
};
const durationSeconds=(value:any)=>{
 if(value==null)return 0;if(typeof value==="number")return value;
 const match=String(value).match(/^(-?\d+(?:\.\d+)?)s$/);return match?Number(match[1]):Number(value)||0;
};
const googlePointId=(point:any,fallback:string)=>String(point?.name||point?.dataPointName||fallback).split("/").pop()||fallback;

async function googleHealthList(dataType:string,token:string,filter?:string){
 const all:any[]=[];let pageToken="";let pages=0;
 do{
  const url=new URL(`https://health.googleapis.com/v4/users/me/dataTypes/${dataType}/dataPoints`);url.searchParams.set("pageSize",dataType==="exercise"||dataType==="sleep"?"25":"100");if(filter)url.searchParams.set("filter",filter);if(pageToken)url.searchParams.set("pageToken",pageToken);
  const json=await apiJson(url.toString(),token);all.push(...(json.dataPoints||[]));pageToken=String(json.nextPageToken||"");pages++;
 }while(pageToken&&pages<4);
 return all;
}

async function pullGoogleHealth(token:string,start:Date,end:Date){
 const daily=new Map<string,DailyMetric>();const workouts:WorkoutMetric[]=[];
 const day=(date:string)=>{const key=date.slice(0,10);const row=daily.get(key)||{metric_date:key};daily.set(key,row);return row};
 const startIso=start.toISOString(),endIso=end.toISOString(),startDate=isoDate(start),endDate=isoDate(end);
 const [exercisePoints,sleepPoints,restingPoints,hrvPoints]=await Promise.all([
  googleHealthList("exercise",token,`exercise.interval.start_time >= "${startIso}" AND exercise.interval.start_time < "${endIso}"`),
  googleHealthList("sleep",token,`sleep.interval.end_time >= "${startIso}" AND sleep.interval.end_time < "${endIso}"`),
  googleHealthList("daily-resting-heart-rate",token,`daily_resting_heart_rate.date >= "${startDate}" AND daily_resting_heart_rate.date < "${endDate}"`),
  googleHealthList("daily-heart-rate-variability",token,`daily_heart_rate_variability.date >= "${startDate}" AND daily_heart_rate_variability.date < "${endDate}"`)
 ]);
 for(const point of sleepPoints){
  const sleep=point.sleep||{};const interval=sleep.interval||{};const date=String(interval.endTime||interval.civilEndTime||interval.startTime||"").slice(0,10);if(!date)continue;
  const summary=sleep.summary||{};const asleep=Number(summary.minutesAsleep??0)||null;const inPeriod=Number(summary.minutesInSleepPeriod??0)||null;const r=day(date);r.sleep_minutes=asleep;
  if(asleep!=null&&inPeriod!=null&&inPeriod>0)r.sleep_score=Math.max(0,Math.min(100,Math.round((asleep/inPeriod)*100)));
 }
 for(const point of restingPoints){const metric=point.dailyRestingHeartRate||{};const date=googleDate(metric.date);if(date)day(date).resting_hr=metric.beatsPerMinute!=null?Number(metric.beatsPerMinute):null}
 for(const point of hrvPoints){const metric=point.dailyHeartRateVariability||{};const date=googleDate(metric.date);if(date)day(date).hrv_ms=metric.averageHeartRateVariabilityMilliseconds??metric.deepSleepRootMeanSquareOfSuccessiveDifferencesMilliseconds??null}
 for(const point of exercisePoints){
  const exercise=point.exercise||{};const interval=exercise.interval||{};const startTime=String(interval.startTime||interval.civilStartTime||new Date().toISOString());const endTime=String(interval.endTime||interval.civilEndTime||"");const summary=exercise.metricsSummary||{};
  let duration=durationSeconds(exercise.activeDuration)/60;if(!duration&&startTime&&endTime){const diff=new Date(endTime).getTime()-new Date(startTime).getTime();if(Number.isFinite(diff)&&diff>0)duration=diff/60000}
  workouts.push({provider_workout_id:googlePointId(point,`${startTime}-${exercise.exerciseType||"exercise"}`),workout_date:startTime,workout_type:exercise.displayName||String(exercise.exerciseType||"Workout").replaceAll("_"," "),duration_minutes:duration||null,avg_hr:summary.averageHeartRateBeatsPerMinute!=null?Number(summary.averageHeartRateBeatsPerMinute):null,max_hr:null,calories:summary.caloriesKcal!=null?Number(summary.caloriesKcal):null,distance_meters:summary.distanceMillimeters!=null?Number(summary.distanceMillimeters)/1000:null,strain:null});
 }
 return {daily:[...daily.values()],workouts};
}

async function pullProvider(provider:CloudProviderId,token:string){
 const end=new Date(Date.now()+86400_000);const start=new Date(Date.now()-14*86400_000);const startDate=isoDate(start),endDate=isoDate(end);const daily=new Map<string,DailyMetric>();const workouts:WorkoutMetric[]=[];
 const day=(date:string)=>{const key=date.slice(0,10);const row=daily.get(key)||{metric_date:key};daily.set(key,row);return row};
 if(provider==="google-health")return pullGoogleHealth(token,start,end);
 if(provider==="oura"){
  const [sleep,readiness,workout]=await Promise.all([
   apiJson(`https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${startDate}&end_date=${endDate}`,token),
   apiJson(`https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=${startDate}&end_date=${endDate}`,token),
   apiJson(`https://api.ouraring.com/v2/usercollection/workout?start_date=${startDate}&end_date=${endDate}`,token)
  ]);
  for(const x of sleep.data||[]){const r=day(x.day);r.sleep_score=x.score??null}
  for(const x of readiness.data||[]){const r=day(x.day);r.readiness_score=x.score??null}
  for(const x of workout.data||[])workouts.push({provider_workout_id:String(x.id||`${x.start_datetime}-${x.activity}`),workout_date:x.start_datetime||`${x.day}T12:00:00Z`,workout_type:x.activity||"Workout",duration_minutes:Number(x.duration||0)/60,calories:x.calories??null,distance_meters:x.distance??null});
 }else if(provider==="whoop"){
  const [recovery,sleep,workout]=await Promise.all([
   apiJson("https://api.prod.whoop.com/developer/v2/recovery?limit=25",token),
   apiJson("https://api.prod.whoop.com/developer/v2/activity/sleep?limit=25",token),
   apiJson("https://api.prod.whoop.com/developer/v2/activity/workout?limit=25",token)
  ]);
  for(const x of recovery.records||[]){const r=day(x.created_at||x.updated_at||new Date().toISOString());r.readiness_score=x.score?.recovery_score??null;r.resting_hr=x.score?.resting_heart_rate??null;r.hrv_ms=x.score?.hrv_rmssd_milli??null}
  for(const x of sleep.records||[]){const r=day(x.start||x.created_at||new Date().toISOString());r.sleep_score=x.score?.sleep_performance_percentage??null;r.sleep_minutes=minutes(x.score?.stage_summary?.total_in_bed_time_milli||0)}
  for(const x of workout.records||[])workouts.push({provider_workout_id:String(x.id),workout_date:x.start||x.created_at,workout_type:String(x.sport_name||x.sport_id||"Workout"),duration_minutes:x.start&&x.end?Math.round((new Date(x.end).getTime()-new Date(x.start).getTime())/60000):null,avg_hr:x.score?.average_heart_rate??null,max_hr:x.score?.max_heart_rate??null,calories:x.score?.kilojoule?Math.round(Number(x.score.kilojoule)/4.184):null,strain:x.score?.strain??null});
 }else if(provider==="strava"){
  const after=Math.floor(start.getTime()/1000);const activity=await apiJson(`https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=50`,token);
  for(const x of Array.isArray(activity)?activity:[])workouts.push({provider_workout_id:String(x.id),workout_date:x.start_date||x.start_date_local,workout_type:x.sport_type||x.type||"Workout",duration_minutes:Number(x.moving_time||x.elapsed_time||0)/60,avg_hr:x.average_heartrate??null,max_hr:x.max_heartrate??null,calories:x.calories??null,distance_meters:x.distance??null});
 }
 return {daily:[...daily.values()],workouts};
}

export async function syncConnection(connection:any){
 const provider=connection.provider as CloudProviderId;if(!isCloudProvider(provider))throw new Error("This legacy tracker connection must be reconnected using Google Health.");
 const token=await connectionAccessToken(connection);const pulled=await pullProvider(provider,token);const db=serviceSupabase();
 if(pulled.daily.length){const rows=pulled.daily.map(x=>({...x,athlete_id:connection.athlete_id,provider}));const {error}=await db.from("tracker_daily_metrics").upsert(rows,{onConflict:"athlete_id,provider,metric_date"});if(error)throw error}
 if(pulled.workouts.length){const rows=pulled.workouts.map(x=>({...x,athlete_id:connection.athlete_id,provider}));const {error}=await db.from("tracker_workouts").upsert(rows,{onConflict:"athlete_id,provider,provider_workout_id"});if(error)throw error}
 const now=new Date().toISOString();await db.from("tracker_connections").update({last_synced_at:now,last_error:null,status:"connected",updated_at:now}).eq("id",connection.id);return {daily:pulled.daily.length,workouts:pulled.workouts.length,lastSyncedAt:now};
}
