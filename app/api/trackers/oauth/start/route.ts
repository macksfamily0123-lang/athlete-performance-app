import {NextResponse} from "next/server";
import {assertTrackerAccess,authenticateTrackerRequest,authorizationUrl,createOAuthState,isCloudProvider,providerConfigured} from "../../../../../lib/serverTracker";
export const runtime="nodejs";
export async function GET(request:Request){
 try{const url=new URL(request.url);const provider=url.searchParams.get("provider")||"";const athleteId=url.searchParams.get("athleteId")||"";if(!isCloudProvider(provider))return NextResponse.json({error:"This tracker does not use the cloud OAuth connector."},{status:400});if(!providerConfigured(provider))return NextResponse.json({error:`${provider} developer credentials have not been added to this deployment yet.`},{status:503});const ctx=await authenticateTrackerRequest(request);await assertTrackerAccess(ctx,athleteId);const state=await createOAuthState({userId:ctx.userId,athleteId,provider});return NextResponse.json({url:authorizationUrl(request,provider,state)});}catch(error:any){return NextResponse.json({error:error?.message||"Tracker connection could not start."},{status:403})}
}
