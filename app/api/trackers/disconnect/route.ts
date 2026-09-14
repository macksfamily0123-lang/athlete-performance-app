import {NextResponse} from "next/server";
import {assertTrackerAccess,authenticateTrackerRequest,serviceSupabase} from "../../../../lib/serverTracker";
export const runtime="nodejs";
export async function POST(request:Request){
 try{const body=await request.json();const athleteId=String(body?.athleteId||"");const provider=String(body?.provider||"");const ctx=await authenticateTrackerRequest(request);await assertTrackerAccess(ctx,athleteId);const db=serviceSupabase();const {error}=await db.from("tracker_connections").delete().eq("athlete_id",athleteId).eq("user_id",ctx.userId).eq("provider",provider);if(error)throw error;return NextResponse.json({ok:true});}catch(error:any){return NextResponse.json({error:error?.message||"Tracker could not be disconnected."},{status:400})}
}
