import {NextResponse} from "next/server";
import {consumeOAuthState,exchangeAuthorizationCode,isCloudProvider,storeConnection} from "../../../../../../lib/serverTracker";
export const runtime="nodejs";
export async function GET(request:Request,context:{params:Promise<{provider:string}>}){
 const {provider}=await context.params;const url=new URL(request.url);const state=url.searchParams.get("state")||"";const code=url.searchParams.get("code")||"";const errorParam=url.searchParams.get("error");
 try{if(!isCloudProvider(provider))throw new Error("Unknown tracker provider.");if(errorParam)throw new Error("Tracker permission was not granted.");if(!state||!code)throw new Error("Tracker callback is missing authorization data.");const saved=await consumeOAuthState(state,provider);const token=await exchangeAuthorizationCode(request,provider,code);await storeConnection({userId:saved.user_id,athleteId:saved.athlete_id,provider,token});const target=new URL(saved.redirect_to||"/",request.url);target.searchParams.set("tracker","connected");target.searchParams.set("provider",provider);return NextResponse.redirect(target);}catch(error:any){const target=new URL("/",request.url);target.searchParams.set("tracker","error");target.searchParams.set("message",String(error?.message||"Tracker connection failed").slice(0,180));return NextResponse.redirect(target)}
}
