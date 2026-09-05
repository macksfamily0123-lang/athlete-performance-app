"use client";

import {useCallback,useEffect,useMemo,useState} from "react";
import type {User} from "@supabase/supabase-js";
import AthleteApp,{type BetaBridge,type BetaRole,type CoachWeeklyReview} from "./AthleteApp";
import BetaErrorBoundary from "./BetaErrorBoundary";
import {betaConfigured,getSupabase} from "../lib/supabase";

type AccessRow={
  user_id:string;
  email:string;
  display_name:string;
  role:BetaRole;
  workspace_id:string;
  active:boolean;
};

type BetaMember={
  user_id:string;
  email:string;
  display_name:string;
  role:BetaRole;
  active:boolean;
};

type BetaFeedbackRow={
  id:number;
  workspace_id:string;
  user_id:string;
  category:string;
  message:string;
  app_version:string|null;
  page_url:string|null;
  created_at:string;
};

type FamilyDiagnosticRow={
  athlete_id:string;
  workspace_id:string;
  display_name:string;
  sport:string;
  athlete_age:number|null;
  account_management:"Player"|"Parent"|"Admin Test";
  linked_user_id:string|null;
  player_email:string|null;
  player_display_name:string|null;
  parent_count:number;
  coach_count:number;
  team_count:number;
  has_workspace_state:boolean;
  player_workspace_matches:boolean;
  player_claim_code_active:boolean;
  parent_link_code_active:boolean;
  issue_count:number;
  issues:string[];
};

type AthleteRow={
  id:string;
  workspace_id:string;
  display_name:string;
  sport:string;
  position:string;
  team_name:string;
  linked_user_id:string|null;
  age:number|null;
  account_management:"Player"|"Parent";
};

type ParentAthleteLink={
  athlete_id:string;
  athlete:AthleteRow|null;
};

type TeamRow={
  id:string;
  coach_user_id:string;
  name:string;
  sport:string;
  invite_code:string;
  created_at:string;
};

type TeamMemberRow={
  id:string;
  team_id:string;
  athlete_id:string;
  athlete:AthleteRow|null;
};

type ConnectionStatusRow={
  athlete_id:string;
  display_name:string;
  sport:string;
  account_management:"Player"|"Parent";
  player_login_connected:boolean;
  parent_count:number;
  coach_count:number;
  team_count:number;
};

const roles:BetaRole[]=["Player","Coach","Parent","Admin"];
const sports=["Baseball","Football","Ice Hockey","Basketball","Lacrosse","Wrestling","Soccer","Figure Skating"];

const cleanConnectionError=(raw:string)=>{
  const message=String(raw||"");
  const lower=message.toLowerCase();
  if(lower.includes("matching player is already connected"))return "A matching Player is already in My Players. Open that Player instead of creating another record.";
  if(lower.includes("invalid or expired parent connection code"))return "That Parent Connection Code is invalid or expired. Ask the Player to create a new code from Connections.";
  if(lower.includes("invalid team invite code"))return "That Team Invite Code is not valid. Ask the Coach for the current code and try again.";
  if(lower.includes("player access code")&&(lower.includes("invalid")||lower.includes("expired")))return "That Player Access Code is invalid or expired. Ask the Parent to generate a new Player Login Access message.";
  if(lower.includes("permission"))return "This account does not have permission for that connection. Make sure you are using the intended Player, Parent, or Coach account.";
  if(lower.includes("failed to fetch")||lower.includes("network"))return "The connection could not reach the server. Check your internet connection and try again.";
  if(lower.includes("admin test athlete already exists"))return "That cloud test Player already exists. Open the existing athlete instead of creating another one.";
  if(lower.includes("schema cache")||lower.includes("could not find the function"))return "Connection setup is not ready in the database yet. Install the latest migration, then refresh the app.";
  return message;
};

const familyConnectionGuidance=(row:FamilyDiagnosticRow)=>{
  if(row.account_management==="Admin Test")return "Cloud-saved Admin test athlete. A Player login, Parent, or Coach is not required unless you intentionally connect one for testing.";
  if(row.issue_count>0)return "Resolve the diagnostic issue first. Repair actions do not merge or delete athlete records.";
  if(!row.linked_user_id&&row.parent_count>0&&row.coach_count===0)return "Healthy Parent-managed Player. A Player login is optional; connect a Coach later with a Team Invite Code.";
  if(!row.linked_user_id&&row.parent_count>0)return "Healthy Parent-managed Player. The Parent can give Player Login Access later without creating another athlete.";
  if(row.linked_user_id&&row.parent_count===0&&row.coach_count===0)return "Player login is healthy. The Player can invite a Parent and join a Coach team from Connections.";
  if(row.linked_user_id&&row.parent_count===0)return "Player login is healthy. A Parent can be added from Player → Connections → Invite a Parent.";
  if(row.coach_count===0)return "Family connection is healthy. A Coach can connect by sending a Team Invite Code.";
  return "Core account relationships are connected to this same athlete workspace.";
};

export default function BetaGate(){
  const supabase=getSupabase();

  const [user,setUser]=useState<User|null>(null);
  const [access,setAccess]=useState<AccessRow|null>(null);
  const [loading,setLoading]=useState(true);

  const [authMode,setAuthMode]=useState<"signin"|"signup">("signin");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [displayName,setDisplayName]=useState("");
  const [signupRole,setSignupRole]=useState<"Player"|"Parent">("Player");
  const [playerAccessCode,setPlayerAccessCode]=useState("");
  const [message,setMessage]=useState("");
  const [signupComplete,setSignupComplete]=useState<{email:string;role:"Player"|"Parent"}|null>(null);

  const [showDisclaimer,setShowDisclaimer]=useState(false);
  const [showFeedback,setShowFeedback]=useState(false);
  const [feedbackType,setFeedbackType]=useState("Bug");
  const [feedbackBody,setFeedbackBody]=useState("");
  const [feedbackMessage,setFeedbackMessage]=useState("");
  const [feedbackSeed,setFeedbackSeed]=useState("");
  const [isOnline,setIsOnline]=useState(true);

  const [showAdmin,setShowAdmin]=useState(false);
  const [adminSection,setAdminSection]=useState<"accounts"|"family"|"feedback">("accounts");
  const [members,setMembers]=useState<BetaMember[]>([]);
  const [familyDiagnostics,setFamilyDiagnostics]=useState<FamilyDiagnosticRow[]>([]);
  const [familyDiagnosticFilter,setFamilyDiagnosticFilter]=useState<"Needs Attention"|"All">("Needs Attention");
  const [familyDiagnosticMessage,setFamilyDiagnosticMessage]=useState("");
  const [familyDiagnosticLoading,setFamilyDiagnosticLoading]=useState(false);
  const [familyRepairingId,setFamilyRepairingId]=useState("");
  const [feedbackInbox,setFeedbackInbox]=useState<BetaFeedbackRow[]>([]);
  const [feedbackFilter,setFeedbackFilter]=useState("All");
  const [feedbackInboxMessage,setFeedbackInboxMessage]=useState("");
  const [inviteEmail,setInviteEmail]=useState("");
  const [inviteName,setInviteName]=useState("");
  const [inviteRole,setInviteRole]=useState<BetaRole>("Coach");
  const [adminMessage,setAdminMessage]=useState("");

  const [selectedCloudWorkspaceId,setSelectedCloudWorkspaceId]=useState("");
  const [selectedAthleteName,setSelectedAthleteName]=useState("");

  // Parent-managed players
  const [showParentPlayers,setShowParentPlayers]=useState(false);
  const [parentPlayers,setParentPlayers]=useState<AthleteRow[]>([]);
  const [parentPlayerPhotos,setParentPlayerPhotos]=useState<Record<string,string>>({});
  const [parentPlayerMode,setParentPlayerMode]=useState(false);
  const [parentManagedAthleteId,setParentManagedAthleteId]=useState("");
  const [childName,setChildName]=useState("");
  const [childAge,setChildAge]=useState("");
  const [childSport,setChildSport]=useState("Ice Hockey");
  const [childPosition,setChildPosition]=useState("");
  const [childTeam,setChildTeam]=useState("");
  const [parentMessage,setParentMessage]=useState("");
  const [parentJoinAthleteId,setParentJoinAthleteId]=useState("");
  const [parentJoinCode,setParentJoinCode]=useState("");
  const [parentConnectionCode,setParentConnectionCode]=useState("");
  const [parentSetupMode,setParentSetupMode]=useState<"choose"|"new"|"existing">("choose");
  const [parentConnectionStatuses,setParentConnectionStatuses]=useState<ConnectionStatusRow[]>([]);

  // Player team invite
  const [showPlayerJoinTeam,setShowPlayerJoinTeam]=useState(false);
  const [playerJoinCode,setPlayerJoinCode]=useState("");
  const [playerJoinMessage,setPlayerJoinMessage]=useState("");
  const [existingPlayerAccessCode,setExistingPlayerAccessCode]=useState("");
  const [playerAccessMessage,setPlayerAccessMessage]=useState("");
  const [parentInviteMessage,setParentInviteMessage]=useState("");
  const [selfAthlete,setSelfAthlete]=useState<AthleteRow|null>(null);
  const [playerConnectionStatus,setPlayerConnectionStatus]=useState<ConnectionStatusRow|null>(null);

  // Coach teams
  const [showTeams,setShowTeams]=useState(false);
  const [coachTeamsMode,setCoachTeamsMode]=useState<"invite"|"manage">("manage");
  const [teams,setTeams]=useState<TeamRow[]>([]);
  const [selectedTeamId,setSelectedTeamId]=useState("");
  const [teamMembers,setTeamMembers]=useState<TeamMemberRow[]>([]);
  const [newTeamName,setNewTeamName]=useState("");
  const [newTeamSport,setNewTeamSport]=useState("Ice Hockey");
  const [teamMessage,setTeamMessage]=useState("");
  const [coachConnectionStatuses,setCoachConnectionStatuses]=useState<ConnectionStatusRow[]>([]);
  const [connectionAction,setConnectionAction]=useState("");

  const runConnectionAction=async(key:string,action:()=>Promise<void>)=>{
    if(connectionAction)return;
    setConnectionAction(key);
    try{await action()}finally{setConnectionAction("")}
  };

  const loadAccess=useCallback(async(currentUser:User|null)=>{
    if(!supabase||!currentUser){setAccess(null);return}
    const {data,error}=await supabase
      .from("beta_users")
      .select("user_id,email,display_name,role,workspace_id,active")
      .eq("user_id",currentUser.id)
      .maybeSingle();
    if(error){setMessage(error.message);setAccess(null);return}
    const row=(data as AccessRow|null)||null;
    setAccess(row);
    if(row?.workspace_id)setSelectedCloudWorkspaceId(row.workspace_id);
  },[supabase]);

  useEffect(()=>{
    if(!supabase){setLoading(false);return}
    let alive=true;
    supabase.auth.getSession().then(async({data})=>{
      if(!alive)return;
      const u=data.session?.user||null;
      setUser(u);
      await loadAccess(u);
      if(alive)setLoading(false);
    });
    const {data:listener}=supabase.auth.onAuthStateChange(async(_event,session)=>{
      const u=session?.user||null;
      setUser(u);
      await loadAccess(u);
      setLoading(false);
    });
    return()=>{alive=false;listener.subscription.unsubscribe()};
  },[supabase,loadAccess]);

  useEffect(()=>{
    if(!access?.user_id)return;
    try{
      if(localStorage.getItem(`betaDisclaimerAccepted:${access.user_id}`)!=="1")setShowDisclaimer(true);
    }catch{setShowDisclaimer(true)}
  },[access?.user_id]);

  useEffect(()=>{
    if(!("serviceWorker" in navigator))return;
    navigator.serviceWorker.register("/sw.js").catch(()=>{});
  },[]);

  useEffect(()=>{
    const sync=()=>setIsOnline(navigator.onLine);
    sync();
    window.addEventListener("online",sync);
    window.addEventListener("offline",sync);
    return()=>{window.removeEventListener("online",sync);window.removeEventListener("offline",sync)};
  },[]);

  const submitAuth=async()=>{
    if(!supabase)return;
    setMessage("");
    if(!email.trim()||!password){setMessage("Enter your email and password.");return}
    if(authMode==="signin"){
      const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
      if(error)setMessage(error.message);
      return;
    }
    const signupEmail=email.trim();
    const {data,error}=await supabase.auth.signUp({
      email:signupEmail,
      password,
      options:{data:{
        display_name:displayName.trim(),
        requested_role:signupRole,
        player_claim_code:signupRole==="Player"?playerAccessCode.trim().toUpperCase():""
      }}
    });
    if(error){
      setMessage(error.message.toLowerCase().includes("rate limit")?"Too many verification emails were requested in a short period. Wait for the email limit to reset, then try again once.":error.message);
      return;
    }
    if(!data.session){
      setSignupComplete({email:signupEmail,role:signupRole});
      setPassword("");
      setPlayerAccessCode("");
      setMessage("");
      return;
    }
    setPlayerAccessCode("");
    setMessage("Account created and signed in.");
  };

  const signOut=async()=>{
    if(supabase)await supabase.auth.signOut();
    setAccess(null);
    setUser(null);
    setSelectedAthleteName("");
    setParentPlayerMode(false);
    setParentManagedAthleteId("");
  };

  // ------------------------------------------------------------
  // Cloud workspace bridge
  // ------------------------------------------------------------
  const loadCloudState=async()=>{
    if(!supabase||!access)return null;
    const workspaceId=selectedCloudWorkspaceId||access.workspace_id;
    const {data,error}=await supabase.from("workspace_state").select("data").eq("workspace_id",workspaceId).maybeSingle();
    if(error)throw error;
    return data?.data||null;
  };

  const saveCloudState=async(data:Record<string,unknown>)=>{
    if(!supabase||!access)return;
    if(access.role==="Parent"){
      if(parentPlayerMode&&parentManagedAthleteId){
        const {error}=await supabase.rpc("parent_save_managed_player_state",{
          p_athlete_id:parentManagedAthleteId,
          p_data:data
        });
        if(error)throw error;
        return;
      }
      const selectedParentAthlete=parentPlayers.find(x=>x.workspace_id===(selectedCloudWorkspaceId||access.workspace_id));
      if(!selectedParentAthlete)return;
      const {error}=await supabase.rpc("parent_save_support_data",{
        p_athlete_id:selectedParentAthlete.id,
        p_data:data
      });
      if(error)throw error;
      return;
    }
    const workspaceId=selectedCloudWorkspaceId||access.workspace_id;
    let nextData={...data};
    if(access.role==="Coach"){
      const {data:existing,error:readError}=await supabase.from("workspace_state").select("data").eq("workspace_id",workspaceId).maybeSingle();
      if(readError)throw readError;
      const current=(existing?.data||{}) as Record<string,unknown>;
      nextData={...nextData,readiness:Array.isArray(current.readiness)?current.readiness:[],weeklyReviews:Array.isArray(current.weeklyReviews)?current.weeklyReviews:[]};
    }
    const {error}=await supabase.from("workspace_state").upsert({
      workspace_id:workspaceId,
      data:nextData,
      updated_by:access.user_id,
      updated_at:new Date().toISOString()
    },{onConflict:"workspace_id"});
    if(error)throw error;
  };


  const saveSharedNotes=async(notes:unknown[])=>{
    if(!supabase||!access)return;
    const workspaceId=selectedCloudWorkspaceId||access.workspace_id;
    const {error}=await supabase.rpc("save_shared_notes",{
      p_workspace_id:workspaceId,
      p_notes:notes
    });
    if(error)throw error;
  };


  const loadCoachWeeklyReviews=async():Promise<CoachWeeklyReview[]>=>{
    if(!supabase||!access)return [];
    const workspaceId=selectedCloudWorkspaceId||access.workspace_id;
    const {data,error}=await supabase.from("coach_weekly_reviews")
      .select("id,week_start,coach_name,performance,effort,attitude,teamwork,coachability,leadership,strengths,development_opportunity,leadership_opportunity,next_week_focus,coach_message,share_with_player,created_at,updated_at")
      .eq("workspace_id",workspaceId)
      .order("week_start",{ascending:false})
      .order("updated_at",{ascending:false});
    if(error)throw error;
    return (data||[]).map((row:any)=>({
      id:String(row.id),weekStart:String(row.week_start),coachName:String(row.coach_name||"Coach"),
      performance:Number(row.performance||0),effort:Number(row.effort||0),attitude:Number(row.attitude||0),
      teamwork:Number(row.teamwork||0),coachability:Number(row.coachability||0),leadership:Number(row.leadership||0),
      strengths:String(row.strengths||""),developmentOpportunity:String(row.development_opportunity||""),
      leadershipOpportunity:String(row.leadership_opportunity||""),nextWeekFocus:String(row.next_week_focus||""),
      coachMessage:String(row.coach_message||""),shareWithPlayer:Boolean(row.share_with_player),
      createdAt:row.created_at||undefined,updatedAt:row.updated_at||undefined
    }));
  };

  const saveCoachWeeklyReview=async(review:CoachWeeklyReview)=>{
    if(!supabase||!access)throw new Error("Sign in required.");
    if(!["Coach","Admin"].includes(access.role))throw new Error("Coach or Admin account required.");
    if(access.role==="Coach"&&!selectedAthleteName)throw new Error("Open a linked athlete from Teams before creating a Coach review.");
    if(access.role==="Admin"&&!selectedCloudWorkspaceId)throw new Error("Select an athlete from Admin Roster before creating or correcting a Coach review.");
    const workspaceId=selectedCloudWorkspaceId||access.workspace_id;
    const {error}=await supabase.from("coach_weekly_reviews").upsert({
      workspace_id:workspaceId,
      coach_user_id:access.user_id,
      coach_name:access.display_name||access.email,
      week_start:review.weekStart,
      performance:review.performance,
      effort:review.effort,
      attitude:review.attitude,
      teamwork:review.teamwork,
      coachability:review.coachability,
      leadership:review.leadership,
      strengths:review.strengths,
      development_opportunity:review.developmentOpportunity,
      leadership_opportunity:review.leadershipOpportunity,
      next_week_focus:review.nextWeekFocus,
      coach_message:review.coachMessage,
      share_with_player:review.shareWithPlayer,
      updated_at:new Date().toISOString()
    },{onConflict:"workspace_id,coach_user_id,week_start"});
    if(error)throw error;
  };

  const loadCoachRosterStates=async()=>{
    if(!supabase||!access||!["Coach","Admin"].includes(access.role))return [];

    let uniqueAthletes:any[]=[];
    if(access.role==="Admin"){
      const {data:athletes,error:athleteError}=await supabase
        .from("athletes")
        .select("id,workspace_id,display_name,sport,position,team_name,linked_user_id,age,account_management")
        .order("display_name");
      if(athleteError)throw athleteError;
      uniqueAthletes=Array.from(new Map((athletes||[]).map((a:any)=>[String(a.workspace_id),a])).values()) as any[];
    }else{
      const {data:coachTeams,error:teamError}=await supabase
        .from("teams")
        .select("id")
        .eq("coach_user_id",access.user_id);
      if(teamError)throw teamError;
      const teamIds=(coachTeams||[]).map((x:any)=>String(x.id));
      if(!teamIds.length)return [];

      const {data:members,error:memberError}=await supabase
        .from("team_members")
        .select("athlete_id,athlete:athletes!team_members_athlete_id_fkey(id,workspace_id,display_name,sport,position,team_name,linked_user_id)")
        .in("team_id",teamIds);
      if(memberError)throw memberError;

      const athleteRows=(members||[]).map((row:any)=>row.athlete).filter(Boolean);
      uniqueAthletes=Array.from(new Map(athleteRows.map((a:any)=>[String(a.workspace_id),a])).values()) as any[];
    }

    const workspaceIds=uniqueAthletes.map((a:any)=>String(a.workspace_id)).filter(Boolean);
    if(!workspaceIds.length)return [];

    const {data:states,error:stateError}=await supabase
      .from("workspace_state")
      .select("workspace_id,data,updated_at")
      .in("workspace_id",workspaceIds);
    if(stateError)throw stateError;
    const stateMap=new Map((states||[]).map((row:any)=>[String(row.workspace_id),row]));

    return uniqueAthletes.map((athlete:any)=>{
      const row:any=stateMap.get(String(athlete.workspace_id));
      return {
        athleteId:String(athlete.id),
        workspaceId:String(athlete.workspace_id),
        name:String(athlete.display_name||"Player"),
        sport:String(athlete.sport||"Ice Hockey"),
        position:String(athlete.position||""),
        team:String(athlete.team_name||""),
        data:(row?.data||null) as Record<string,unknown>|null,
        updatedAt:row?.updated_at||undefined
      };
    });
  };

  const selectCoachRosterAthlete=(workspaceId:string)=>{
    if(!access||!["Coach","Admin"].includes(access.role))return;
    const athlete=access.role==="Coach"?teamMembers.find(x=>x.athlete?.workspace_id===workspaceId)?.athlete:null;
    setSelectedCloudWorkspaceId(workspaceId);
    if(athlete?.display_name)setSelectedAthleteName(athlete.display_name);
    else{
      void loadCoachRosterStates().then(rows=>{
        const found=rows.find((x:any)=>x.workspaceId===workspaceId);
        if(found?.name)setSelectedAthleteName(found.name);
      }).catch(()=>{});
    }
  };

  // ------------------------------------------------------------
  // Connection status summaries (migration 008)
  // ------------------------------------------------------------
  const loadParentConnectionStatuses=async()=>{
    if(!supabase||access?.role!=="Parent")return;
    const {data,error}=await supabase.rpc("parent_connection_status");
    if(error){setParentConnectionStatuses([]);setParentMessage(cleanConnectionError(error.message));return}
    setParentConnectionStatuses(((data||[]) as ConnectionStatusRow[]).map(x=>({...x,parent_count:Number(x.parent_count||0),coach_count:Number(x.coach_count||0),team_count:Number(x.team_count||0)})));
  };

  const loadPlayerConnectionStatus=async()=>{
    if(!supabase||access?.role!=="Player")return;
    const {data,error}=await supabase.rpc("player_connection_status");
    if(error){setPlayerConnectionStatus(null);setPlayerJoinMessage(cleanConnectionError(error.message));return}
    const row=Array.isArray(data)?data[0]:data;
    setPlayerConnectionStatus(row?{...row,parent_count:Number(row.parent_count||0),coach_count:Number(row.coach_count||0),team_count:Number(row.team_count||0)} as ConnectionStatusRow:null);
  };

  const loadCoachConnectionStatuses=async(teamId:string)=>{
    if(!supabase||access?.role!=="Coach"||!teamId){setCoachConnectionStatuses([]);return}
    const {data,error}=await supabase.rpc("coach_team_connection_status",{p_team_id:teamId});
    if(error){setCoachConnectionStatuses([]);setTeamMessage(cleanConnectionError(error.message));return}
    setCoachConnectionStatuses(((data||[]) as ConnectionStatusRow[]).map(x=>({...x,parent_count:Number(x.parent_count||0),coach_count:Number(x.coach_count||0),team_count:Number(x.team_count||0)})));
  };

  // ------------------------------------------------------------
  // Parent: multiple players
  // ------------------------------------------------------------
  const loadParentPlayers=async()=>{
    if(!supabase||access?.role!=="Parent")return;
    setParentMessage("");
    const {data,error}=await supabase
      .from("parent_athletes")
      .select("athlete_id,athlete:athletes!parent_athletes_athlete_id_fkey(id,workspace_id,display_name,sport,position,team_name,linked_user_id,age,account_management)")
      .eq("parent_user_id",access.user_id)
      .order("created_at");
    if(error){setParentMessage(error.message);return}
    const rows=(data||[]) as unknown as ParentAthleteLink[];
    const athletes=rows.map(x=>x.athlete).filter(Boolean) as AthleteRow[];
    setParentPlayers(athletes);
    if(athletes.length){
      const workspaceIds=athletes.map(x=>x.workspace_id);
      const {data:photoRows}=await supabase.from("workspace_state").select("workspace_id,data").in("workspace_id",workspaceIds);
      const photos:Record<string,string>={};
      for(const row of photoRows||[]){
        const value=(row as any)?.data?.profile?.photoUrl;
        if(typeof value==="string"&&value)photos[String((row as any).workspace_id)]=value;
      }
      setParentPlayerPhotos(photos);
    }else setParentPlayerPhotos({});
    await loadParentConnectionStatuses();
    if(!parentJoinAthleteId&&athletes[0])setParentJoinAthleteId(athletes[0].id);
    if(!selectedAthleteName&&athletes[0]){
      setSelectedCloudWorkspaceId(athletes[0].workspace_id);
      setSelectedAthleteName(athletes[0].display_name);
    }
  };

  const createParentPlayer=async()=>runConnectionAction("parent-create",async()=>{
    if(!supabase||access?.role!=="Parent"||!childName.trim())return;
    const age=Number(childAge);
    if(!Number.isFinite(age)||age<6||age>99){setParentMessage("Enter a valid Player age from 6 to 99.");return}
    const normalizedName=childName.trim().replace(/\s+/g," ").toLowerCase();
    const duplicate=parentPlayers.find(x=>x.display_name.trim().replace(/\s+/g," ").toLowerCase()===normalizedName&&Number(x.age||0)===age&&x.sport===childSport);
    if(duplicate){
      setParentMessage(`${duplicate.display_name} already appears in My Players with the same age and sport. Open that Player instead of creating another athlete.`);
      setParentSetupMode("choose");
      return;
    }
    setParentMessage("");
    const {data,error}=await supabase.rpc("parent_create_managed_athlete",{
      p_name:childName.trim(),
      p_sport:childSport,
      p_age:age,
      p_position:childPosition.trim(),
      p_team_name:childTeam.trim()
    });
    if(error){setParentMessage(cleanConnectionError(error.message));return}
    setChildName("");setChildAge("");setChildPosition("");setChildTeam("");
    setParentSetupMode("choose");
    setParentMessage("Player added. This is one Parent-managed athlete record. A Player login or Coach can be connected later without creating another Player.");
    await loadParentPlayers();
    const created=Array.isArray(data)?data[0]:data;
    if(created?.workspace_id){
      setSelectedCloudWorkspaceId(created.workspace_id);
      setSelectedAthleteName(created.display_name||"Player");
      setParentPlayerMode(false);
      setParentManagedAthleteId("");
    }
  });

  const openParentPlayer=(athlete:AthleteRow)=>{
    if(access?.role!=="Parent")return;
    setSelectedCloudWorkspaceId(athlete.workspace_id);
    setSelectedAthleteName(athlete.display_name);
    setParentPlayerMode(false);
    setParentManagedAthleteId("");
    setShowParentPlayers(false);
  };

  const openManagedPlayer=(athlete:AthleteRow)=>{
    if(access?.role!=="Parent"||athlete.account_management!=="Parent")return;
    setSelectedCloudWorkspaceId(athlete.workspace_id);
    setSelectedAthleteName(athlete.display_name);
    setParentManagedAthleteId(athlete.id);
    setParentPlayerMode(true);
    setShowParentPlayers(false);
  };

  const returnToParentWorkspace=()=>{
    setParentPlayerMode(false);
    setParentManagedAthleteId("");
  };

  const copyPlayerLoginAccess=async(athlete:AthleteRow)=>runConnectionAction("player-access",async()=>{
    if(!supabase||access?.role!=="Parent")return;
    setParentMessage("");
    const {data,error}=await supabase.rpc("parent_rotate_player_claim_code",{p_athlete_id:athlete.id});
    if(error){setParentMessage(cleanConnectionError(error.message));return}
    const code=String(data||"");
    const text=[
      `${athlete.display_name} already has an Athlete Performance Player record managed by a Parent.`,
      `Open ${window.location.origin}`,
      `Create a Player account and enter this Player Access Code during signup: ${code}`,
      `This links the login to the existing Player record so development history is not duplicated.`
    ].join("\n");
    try{
      await navigator.clipboard.writeText(text);
      setParentMessage("Player Login Access message copied. This will link a login to the existing athlete—not create a new one.");
    }catch{
      setParentMessage(`Player Access Code: ${code}`);
    }
    await loadParentConnectionStatuses();
  });

  const parentJoinTeam=async()=>runConnectionAction("parent-team",async()=>{
    if(!supabase||access?.role!=="Parent"||!parentJoinAthleteId||!parentJoinCode.trim())return;
    setParentMessage("");
    const {data,error}=await supabase.rpc("join_team_with_code",{
      p_athlete_id:parentJoinAthleteId,
      p_invite_code:parentJoinCode.trim().toUpperCase()
    });
    if(error){setParentMessage(cleanConnectionError(error.message));return}
    setParentJoinCode("");
    setParentMessage(`Player connected to ${data||"the Coach team"}. The Coach now sees this same athlete workspace.`);
    await loadParentConnectionStatuses();
  });

  const parentConnectExistingPlayer=async()=>runConnectionAction("parent-existing",async()=>{
    if(!supabase||access?.role!=="Parent"||!parentConnectionCode.trim())return;
    setParentMessage("");
    const {data,error}=await supabase.rpc("parent_link_existing_player",{
      p_parent_link_code:parentConnectionCode.trim().toUpperCase()
    });
    if(error){setParentMessage(cleanConnectionError(error.message));return}
    setParentConnectionCode("");
    setParentSetupMode("choose");
    const linked=Array.isArray(data)?data[0]:data;
    await loadParentPlayers();
    if(linked?.workspace_id){
      setSelectedCloudWorkspaceId(String(linked.workspace_id));
      setSelectedAthleteName(String(linked.display_name||"Player"));
    }
    setParentMessage("Existing Player connected. This Parent now points to the Player's original athlete record and history—no duplicate was created.");
  });

  useEffect(()=>{
    if(access?.role==="Parent")void loadParentPlayers();
  },[access?.user_id,access?.role]);

  // ------------------------------------------------------------
  // Player: join team by coach invite
  // ------------------------------------------------------------
  const loadSelfAthlete=async()=>{
    if(!supabase||access?.role!=="Player")return;
    const {data}=await supabase.from("athletes")
      .select("id,workspace_id,display_name,sport,position,team_name,linked_user_id,age,account_management")
      .eq("linked_user_id",access.user_id)
      .maybeSingle();
    const row=(data as AthleteRow|null)||null;
    setSelfAthlete(row);
    if(row){
      setSelectedCloudWorkspaceId(row.workspace_id);
      setSelectedAthleteName(row.display_name);
    }
    await loadPlayerConnectionStatus();
  };

  const claimExistingParentPlayer=async()=>runConnectionAction("player-claim",async()=>{
    if(!supabase||access?.role!=="Player"||!existingPlayerAccessCode.trim())return;
    setPlayerAccessMessage("");
    const {data,error}=await supabase.rpc("player_claim_parent_managed_athlete",{
      p_claim_code:existingPlayerAccessCode.trim().toUpperCase()
    });
    if(error){setPlayerAccessMessage(cleanConnectionError(error.message));return}
    setExistingPlayerAccessCode("");
    const claimed=Array.isArray(data)?data[0]:data;
    await loadAccess(user);
    if(claimed?.workspace_id){
      setSelectedCloudWorkspaceId(claimed.workspace_id);
      setSelectedAthleteName(claimed.display_name||"Player");
    }
    await loadSelfAthlete();
    setPlayerAccessMessage("Player record linked. Your login now uses the same athlete your Parent created; the Parent relationship and history stay connected.");
  });

  const playerJoinTeam=async()=>runConnectionAction("player-team",async()=>{
    if(!supabase||access?.role!=="Player"||!selfAthlete||!playerJoinCode.trim())return;
    setPlayerJoinMessage("");
    const {data,error}=await supabase.rpc("join_team_with_code",{
      p_athlete_id:selfAthlete.id,
      p_invite_code:playerJoinCode.trim().toUpperCase()
    });
    if(error){setPlayerJoinMessage(cleanConnectionError(error.message));return}
    setPlayerJoinCode("");
    setPlayerJoinMessage(`Connected to ${data||"the Coach team"}. Your Coach now sees this same athlete workspace.`);
    await loadPlayerConnectionStatus();
  });

  const copyParentConnectionInvite=async()=>runConnectionAction("player-parent",async()=>{
    if(!supabase||access?.role!=="Player"||!selfAthlete)return;
    setParentInviteMessage("");
    const {data,error}=await supabase.rpc("player_rotate_parent_link_code");
    if(error){setParentInviteMessage(cleanConnectionError(error.message));return}
    const code=String(data||"");
    const text=[
      `${selfAthlete.display_name} invited you to connect as a Parent in Athlete Performance.`,
      `Open ${window.location.origin}`,
      `Sign in or create a Parent account.`,
      `Open My Players → Connect Existing Player and enter code: ${code}`,
      `This connects you to the same Player record. It does not create a duplicate athlete.`
    ].join("\n");
    try{
      await navigator.clipboard.writeText(text);
      setParentInviteMessage("Parent Connection Invite copied. The Parent should choose Connect Existing Player—not Create New Player.");
    }catch{
      setParentInviteMessage(`Parent Connection Code: ${code}`);
    }
    await loadPlayerConnectionStatus();
  });

  useEffect(()=>{
    if(access?.role==="Player")void loadSelfAthlete();
  },[access?.user_id,access?.role]);

  // ------------------------------------------------------------
  // Coach: Teams + invite codes + roster
  // ------------------------------------------------------------
  const loadTeams=async()=>{
    if(!supabase||access?.role!=="Coach")return;
    setTeamMessage("");
    const {data,error}=await supabase
      .from("teams")
      .select("id,coach_user_id,name,sport,invite_code,created_at")
      .eq("coach_user_id",access.user_id)
      .order("created_at");
    if(error){setTeamMessage(error.message);return}
    const rows=(data||[]) as TeamRow[];
    setTeams(rows);
    const chosen=selectedTeamId&&rows.some(x=>x.id===selectedTeamId)?selectedTeamId:(rows[0]?.id||"");
    setSelectedTeamId(chosen);
    if(chosen)await loadTeamMembers(chosen);
    else{setTeamMembers([]);setCoachConnectionStatuses([])}
  };

  const loadTeamMembers=async(teamId:string)=>{
    if(!supabase||access?.role!=="Coach"||!teamId){setTeamMembers([]);return}
    setSelectedTeamId(teamId);
    const {data,error}=await supabase
      .from("team_members")
      .select("id,team_id,athlete_id,athlete:athletes!team_members_athlete_id_fkey(id,workspace_id,display_name,sport,position,team_name,linked_user_id)")
      .eq("team_id",teamId)
      .order("created_at");
    if(error){setTeamMessage(cleanConnectionError(error.message));return}
    setTeamMembers((data||[]) as unknown as TeamMemberRow[]);
    await loadCoachConnectionStatuses(teamId);
  };

  const createTeam=async()=>{
    if(!supabase||access?.role!=="Coach"||!newTeamName.trim())return;
    setTeamMessage("");
    const {data,error}=await supabase.from("teams")
      .insert({coach_user_id:access.user_id,name:newTeamName.trim(),sport:newTeamSport})
      .select("id,coach_user_id,name,sport,invite_code,created_at")
      .single();
    if(error){setTeamMessage(error.message);return}
    setNewTeamName("");
    setSelectedTeamId(data.id);
    setTeamMessage("Team created. Share the invite code with players or parents.");
    await loadTeams();
  };

  const selectedTeam=teams.find(x=>x.id===selectedTeamId)||null;

  const copyTeamInvite=async()=>{
    if(!selectedTeam)return;
    const text=[
      `You've been invited to join ${selectedTeam.name} in Athlete Performance.`,
      `Open ${window.location.origin}`,
      `Create or sign in to your Player or Parent account.`,
      `Choose Join Team and enter code: ${selectedTeam.invite_code}`,
      `The Player keeps ownership of their own account, profile, goals, and check-ins.`
    ].join("\n");
    try{
      await navigator.clipboard.writeText(text);
      setTeamMessage("Player invite message copied. Send it to the Player or Parent.");
    }catch{
      setTeamMessage(`Share this team invite code: ${selectedTeam.invite_code}`);
    }
  };

  const copyTeamInviteCode=async()=>{
    if(!selectedTeam)return;
    try{
      await navigator.clipboard.writeText(selectedTeam.invite_code);
      setTeamMessage("Invite code copied.");
    }catch{
      setTeamMessage(`Invite code: ${selectedTeam.invite_code}`);
    }
  };

  const regenerateTeamInvite=async()=>{
    if(!supabase||access?.role!=="Coach"||!selectedTeamId)return;
    setTeamMessage("");
    const {data,error}=await supabase.rpc("coach_regenerate_team_invite",{p_team_id:selectedTeamId});
    if(error){setTeamMessage(error.message);return}
    setTeamMessage(`New invite code: ${data}`);
    await loadTeams();
  };

  const openTeamAthlete=(member:TeamMemberRow)=>{
    if(access?.role!=="Coach"||!member.athlete)return;
    setSelectedCloudWorkspaceId(member.athlete.workspace_id);
    setSelectedAthleteName(member.athlete.display_name);
    setShowTeams(false);
  };

  const removeTeamAthlete=async(member:TeamMemberRow)=>{
    if(!supabase||access?.role!=="Coach")return;
    const {error}=await supabase.from("team_members").delete().eq("id",member.id);
    if(error){setTeamMessage(error.message);return}
    if(member.athlete?.workspace_id===selectedCloudWorkspaceId){
      setSelectedCloudWorkspaceId(access.workspace_id);
      setSelectedAthleteName("");
    }
    await loadTeamMembers(selectedTeamId);
  };

  const returnToCoachWorkspace=()=>{
    if(!access)return;
    setSelectedCloudWorkspaceId(access.workspace_id);
    setSelectedAthleteName("");
  };

  useEffect(()=>{
    if(showTeams&&access?.role==="Coach")void loadTeams();
  },[showTeams,access?.user_id,access?.role]);

  // ------------------------------------------------------------
  // Feedback / Admin
  // ------------------------------------------------------------
  const feedbackContext=()=>{
    const athlete=selectedAthleteName||selfAthlete?.display_name||"Not selected";
    const sport=selectedAthleteSport||selfAthlete?.sport||"Unknown";
    return [
      "Beta diagnostic context",
      "Version: 72.3.69 RC19",
      `Role: ${access?.role||"Unknown"}`,
      `Athlete: ${athlete}`,
      `Sport: ${sport}`,
      `Network: ${navigator.onLine?"Online":"Offline"}`,
      `Page: ${window.location.pathname}`
    ].join("\n");
  };

  const openFeedbackWithContext=(seed="")=>{
    setFeedbackSeed(seed);
    if(seed&&!feedbackBody.trim())setFeedbackBody(seed);
    setFeedbackMessage("");
    setShowFeedback(true);
  };

  const submitFeedback=async()=>{
    if(!supabase||!access||!feedbackBody.trim())return;
    setFeedbackMessage("");
    const diagnostic=feedbackContext();
    const message=[feedbackBody.trim(),diagnostic].filter(Boolean).join("\n\n---\n");
    const {error}=await supabase.from("beta_feedback").insert({
      workspace_id:selectedCloudWorkspaceId||access.workspace_id,
      user_id:access.user_id,
      category:feedbackType,
      message,
      app_version:"72.3.69",
      page_url:window.location.href
    });
    if(error){setFeedbackMessage(error.message);return}
    setFeedbackBody("");
    setFeedbackSeed("");
    setFeedbackMessage("Feedback sent. Thank you.");
  };

  const loadMembers=async()=>{
    if(!supabase||access?.role!=="Admin")return;
    const {data,error}=await supabase.from("beta_users")
      .select("user_id,email,display_name,role,active")
      .order("display_name");
    if(error){setAdminMessage(error.message);return}
    setMembers((data||[]) as BetaMember[]);
  };

  const loadFeedbackInbox=async()=>{
    if(!supabase||access?.role!=="Admin")return;
    setFeedbackInboxMessage("");
    const {data,error}=await supabase.from("beta_feedback")
      .select("id,workspace_id,user_id,category,message,app_version,page_url,created_at")
      .order("created_at",{ascending:false})
      .limit(200);
    if(error){setFeedbackInboxMessage(error.message);return}
    setFeedbackInbox((data||[]) as BetaFeedbackRow[]);
  };

  const loadFamilyDiagnostics=async()=>{
    if(!supabase||access?.role!=="Admin")return;
    setFamilyDiagnosticLoading(true);
    setFamilyDiagnosticMessage("");
    const {data,error}=await supabase.rpc("admin_family_diagnostics");
    setFamilyDiagnosticLoading(false);
    if(error){setFamilyDiagnosticMessage(cleanConnectionError(error.message));return}
    setFamilyDiagnostics(((data||[]) as FamilyDiagnosticRow[]).map(row=>({
      ...row,
      parent_count:Number(row.parent_count||0),
      coach_count:Number(row.coach_count||0),
      team_count:Number(row.team_count||0),
      issue_count:Number(row.issue_count||0),
      issues:Array.isArray(row.issues)?row.issues:[]
    })));
  };

  const repairFamilyAccount=async(row:FamilyDiagnosticRow,action:string)=>{
    if(!supabase||access?.role!=="Admin")return;
    setFamilyRepairingId(row.athlete_id);
    setFamilyDiagnosticMessage("");
    const {data,error}=await supabase.rpc("admin_repair_family_account",{
      p_athlete_id:row.athlete_id,
      p_action:action
    });
    setFamilyRepairingId("");
    if(error){setFamilyDiagnosticMessage(cleanConnectionError(error.message));return}
    setFamilyDiagnosticMessage(String(data||"Repair completed."));
    await loadFamilyDiagnostics();
  };

  useEffect(()=>{
    if(!showAdmin)return;
    void loadMembers();
    void loadFeedbackInbox();
    void loadFamilyDiagnostics();
  },[showAdmin]);

  useEffect(()=>{
    if(showAdmin&&adminSection==="family")void loadFamilyDiagnostics();
  },[adminSection]);

  const filteredFamilyDiagnostics=familyDiagnosticFilter==="Needs Attention"
    ?familyDiagnostics.filter(x=>x.issue_count>0)
    :familyDiagnostics;
  const familyIssueTotal=familyDiagnostics.reduce((sum,x)=>sum+x.issue_count,0);
  const familyHealthyTotal=familyDiagnostics.filter(x=>x.issue_count===0).length;

  const filteredFeedback=feedbackFilter==="All"?feedbackInbox:feedbackInbox.filter(x=>x.category===feedbackFilter);
  const feedbackCategories=["All",...Array.from(new Set(feedbackInbox.map(x=>x.category)))];
  const feedbackReporter=(userId:string)=>members.find(x=>x.user_id===userId);
  const formatFeedbackDate=(value:string)=>new Date(value).toLocaleString(undefined,{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"});

  const createInvite=async()=>{
    if(!supabase||access?.role!=="Admin"||!inviteEmail.trim())return;
    setAdminMessage("");
    const {error}=await supabase.rpc("admin_create_beta_invite",{
      p_email:inviteEmail.trim().toLowerCase(),
      p_role:inviteRole,
      p_display_name:inviteName.trim()||inviteEmail.trim().split("@")[0]
    });
    if(error){setAdminMessage(error.message);return}
    setAdminMessage("Invitation approved. If that email already has an account, access is active now.");
    setInviteEmail("");setInviteName("");
    await loadMembers();
  };

  const setMemberActive=async(member:BetaMember,active:boolean)=>{
    if(!supabase||access?.role!=="Admin")return;
    const {error}=await supabase.rpc("admin_set_beta_user_active",{p_user_id:member.user_id,p_active:active});
    if(error){setAdminMessage(error.message);return}
    await loadMembers();
  };

  const createAdminTestAthlete=async(input:{name:string;sport:string;age:number;position:string;team:string})=>{
    if(!supabase||access?.role!=="Admin")throw new Error("Admin account required");
    const {data,error}=await supabase.rpc("admin_create_test_athlete",{
      p_name:input.name,
      p_sport:input.sport,
      p_age:input.age,
      p_position:input.position,
      p_team_name:input.team
    });
    if(error)throw new Error(cleanConnectionError(error.message));
    const row=Array.isArray(data)?data[0]:data;
    if(!row?.workspace_id||!row?.id)throw new Error("Cloud test Player was not returned by the server.");
    setSelectedCloudWorkspaceId(String(row.workspace_id));
    setSelectedAthleteName(String(row.display_name||input.name));
    return {athleteId:String(row.id),workspaceId:String(row.workspace_id),name:String(row.display_name||input.name)};
  };

  const selectedAthleteSport=
    access?.role==="Parent"
      ?parentPlayers.find(x=>x.workspace_id===selectedCloudWorkspaceId)?.sport
      :access?.role==="Player"
      ?selfAthlete?.sport
      :access?.role==="Coach"
      ?teamMembers.find(x=>x.athlete?.workspace_id===selectedCloudWorkspaceId)?.athlete?.sport
      :undefined;

  const bridge:BetaBridge|null=useMemo(()=>access&&user?{
    session:{
      role:access.role==="Parent"&&parentPlayerMode?"Player":access.role,
      displayName:access.role==="Parent"&&parentPlayerMode
        ?(parentPlayers.find(x=>x.id===parentManagedAthleteId)?.display_name||selectedAthleteName||"Player")
        :(access.display_name||access.email),
      athleteId:access.role==="Parent"&&parentPlayers.length
        ?(parentPlayers.find(x=>x.workspace_id===selectedCloudWorkspaceId)?.id||parentPlayers[0].id)
        :"primary"
    },
    userId:user.id,
    email:access.email,
    workspaceId:selectedCloudWorkspaceId||access.workspace_id,
    loginSessionKey:user.last_sign_in_at||user.id,
    loadState:loadCloudState,
    saveState:saveCloudState,
    loadCoachRosterStates:["Coach","Admin"].includes(access.role)?loadCoachRosterStates:undefined,
    selectCoachRosterAthlete:["Coach","Admin"].includes(access.role)?selectCoachRosterAthlete:undefined,
    onSignOut:signOut,
    openFeedback:()=>openFeedbackWithContext(),
    openParentPlayers:access.role==="Parent"?()=>{void loadParentPlayers();setParentSetupMode("choose");setShowParentPlayers(true)}:undefined,
    openPlayerJoinTeam:access.role==="Player"?()=>{void loadPlayerConnectionStatus();setShowPlayerJoinTeam(true)}:undefined,
    openCoachTeams:access.role==="Coach"?()=>{setCoachTeamsMode("manage");setShowTeams(true)}:undefined,
    openCoachInvitePlayer:access.role==="Coach"?()=>{setCoachTeamsMode("invite");setShowTeams(true)}:undefined,
    createAdminTestAthlete:access.role==="Admin"?createAdminTestAthlete:undefined,
    openBetaAdmin:access.role==="Admin"?()=>setShowAdmin(true):undefined,
    returnToCoachWorkspace:access.role==="Coach"&&selectedAthleteName?returnToCoachWorkspace:undefined,
    managedByParent:access.role==="Parent"&&parentPlayerMode,
    juniorPlayerMode:access.role==="Parent"&&parentPlayerMode&&Number(parentPlayers.find(x=>x.id===parentManagedAthleteId)?.age||0)<=10,
    returnToParentWorkspace:access.role==="Parent"&&parentPlayerMode?returnToParentWorkspace:undefined,
    selectedAthleteName,
    selectedAthleteSport,
    saveSharedNotes,
    loadCoachWeeklyReviews,
    saveCoachWeeklyReview:["Coach","Admin"].includes(access.role)?saveCoachWeeklyReview:undefined
  }:null,[access,user,selectedCloudWorkspaceId,parentPlayers,parentPlayerMode,parentManagedAthleteId,selectedAthleteName,selectedAthleteSport,selfAthlete,teamMembers]);

  if(!betaConfigured())return <div className="betaSetupShell"><div className="betaSetupCard">
    <div className="betaMark">BETA</div><h1>Beta backend needs configuration</h1>
    <p>This build is ready for secure Supabase accounts and cloud sync, but the Vercel environment variables have not been added yet.</p>
    <code>NEXT_PUBLIC_SUPABASE_URL</code><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
    <p>Run the included Supabase migration first, then add those two values in Vercel.</p>
  </div></div>;

  if(loading)return <div className="betaSetupShell"><div className="betaSetupCard"><div className="betaMark">BETA</div><h1>Loading beta access…</h1></div></div>;

  if(signupComplete&&!user)return <div className="betaAuthShell"><div className="betaAuthCard signupConfirmationCard">
    <div className="signupMailIcon">✉</div>
    <small className="signupConfirmationEyebrow">ONE MORE STEP</small>
    <h1>Check your email</h1>
    <p>We sent a verification email to <b>{signupComplete.email}</b>.</p>
    <div className="signupConfirmationSteps">
      <div><span>1</span><p>Open the verification email from Athlete Performance / Supabase.</p></div>
      <div><span>2</span><p>Tap the <b>verification / confirmation link</b> in that email.</p></div>
      <div><span>3</span><p>Return to the beta website and sign in with the email and password you just created.</p></div>
    </div>
    <div className="signupApprovalNote"><b>If your account also requires approval</b><span>Email verification confirms your email address. Coach or Admin access can still remain pending until it is approved.</span></div>
    <p className="signupSpamTip">No email yet? Check Spam/Junk and give delivery a few minutes. Avoid repeatedly creating the account because verification-email rate limits can temporarily block new messages.</p>
    <button className="betaPrimary" onClick={()=>{setSignupComplete(null);setAuthMode("signin");setEmail(signupComplete.email);setMessage("")}}>I Verified My Email · Go to Sign In</button>
    <button className="signupSecondary" onClick={()=>{setSignupComplete(null);setAuthMode("signup");setMessage("")}}>Use a Different Email</button>
  </div></div>;

  if(!user)return <div className="betaAuthShell"><div className="betaAuthCard">
    <div className="betaAuthBrand"><span>AP</span><div><small>ATHLETE PERFORMANCE</small><h1>{authMode==="signin"?"Beta sign in":"Create beta account"}</h1><p>Secure accounts with cloud-backed athlete data.</p></div></div>
    <div className="betaModeSwitch"><button className={authMode==="signin"?"active":""} onClick={()=>{setAuthMode("signin");setMessage("")}}>Sign In</button><button className={authMode==="signup"?"active":""} onClick={()=>{setAuthMode("signup");setMessage("")}}>Create Account</button></div>

    {authMode==="signup"&&<><div className="selfSignupRole"><small>ACCOUNT TYPE</small><div>{(["Player","Parent"] as const).map(r=><button key={r} className={signupRole===r?"active":""} onClick={()=>setSignupRole(r)}><b>{r}</b><span>{r==="Player"?"Create my own athlete account":"Create one Parent account and add multiple players"}</span></button>)}</div><p>Players and Parents can sign up directly. Coach accounts require approval. Only Coaches manage teams and team rosters.</p></div><label>Display name<input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Name"/></label></>}

    {authMode==="signup"&&signupRole==="Player"&&<div className="playerAccessSignup"><small>ALREADY ADDED BY A PARENT?</small><b>Link to your existing Player record</b><p>If a Parent already created your Player profile, enter the Player Access Code they gave you. Leave this blank if you are creating a brand-new Player.</p><label>Player Access Code <span>Optional</span><input value={playerAccessCode} onChange={e=>setPlayerAccessCode(e.target.value.toUpperCase())} placeholder="e.g. A1B2C3D4E5"/></label></div>}
    <label>Email<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
    <label>Password<input type="password" autoComplete={authMode==="signin"?"current-password":"new-password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/></label>
    {message&&<div className="betaMessage">{message}</div>}
    <button className="betaPrimary" onClick={submitAuth}>{authMode==="signin"?"Sign In":"Create Account"}</button>
    <small className="betaFinePrint">Parents can add multiple players after signing in. Coaches can create teams and send player invite codes.</small>
  </div></div>;

  if(!access||!access.active)return <div className="betaAuthShell"><div className="betaAuthCard">
    <div className="betaMark">ACCESS</div><h1>Account approval is pending</h1>
    <p>You are signed in as <b>{user.email}</b>, but this account is not active yet.</p>
    <p>If you just verified your email, that step is complete. Coach and Admin access may still require approval before the beta workspace opens.</p>
    <button className="betaPrimary" onClick={signOut}>Sign Out</button>
  </div></div>;

  return <div className="betaAppShell">
    <div className="betaRibbon">BETA · RC19 · v72.3.69</div>
    {!isOnline&&<div className="betaOfflineBanner"><b>Offline</b><span>You can keep reviewing local data. Cloud saves will retry after your connection returns.</span></div>}

    <BetaErrorBoundary onReport={(details)=>openFeedbackWithContext(details)}>
      <AthleteApp betaBridge={bridge!}/>
    </BetaErrorBoundary>

    {access.role==="Parent"&&selectedAthleteName&&!parentPlayerMode&&<div className="parentViewingBanner"><small>PARENT VIEWING</small><b>{selectedAthleteName}</b><span>Parent support tools for this Player.</span></div>}
    {access.role==="Parent"&&selectedAthleteName&&parentPlayerMode&&<div className="parentManagedPlayerBanner"><small>{Number(parentPlayers.find(x=>x.id===parentManagedAthleteId)?.age||0)<=10?"JUNIOR PLAYER MODE":"PARENT-MANAGED PLAYER"}</small><b>{selectedAthleteName}</b><span>The Parent manages account access. Entries here are saved as the Player's own check-ins, goals, training, testing, competition, and reflections.</span></div>}
    {access.role==="Coach"&&selectedAthleteName&&<div className="coachViewingBanner"><small>COACH VIEWING</small><b>{selectedAthleteName}</b><span>Changes are saving to this player's cloud workspace.</span></div>}

    {showDisclaimer&&<div className="betaModalOverlay"><div className="betaModalCard">
      <div className="betaMark">BETA NOTICE</div><h2>Testing version</h2>
      <p>This is pre-release software. Features may change and occasional bugs or data issues may occur. Only enter athlete information you are authorized to share.</p>
      <p>Use the Report a Problem button whenever something does not work as expected.</p>
      <button className="betaPrimary" onClick={()=>{try{localStorage.setItem(`betaDisclaimerAccepted:${access.user_id}`,"1")}catch{}setShowDisclaimer(false)}}>I Understand</button>
    </div></div>}

    {showParentPlayers&&access.role==="Parent"&&<div className="betaModalOverlay"><div className="betaAdminCard parentFamilyCard connectionSetupCard">
      <div className="sectionHead"><div><small>FAMILY ACCOUNT</small><h2>My Players</h2></div><button onClick={()=>setShowParentPlayers(false)}>×</button></div>
      <p className="coachGroupIntro">One Parent account can support multiple Players. Every Parent, Player login, and Coach connection should point to one athlete record and one development history.</p>

      <div className="connectionRuleNotice">
        <span>1 ATHLETE</span>
        <div><b>Choose the correct way to add a Player</b><p>If the Player already has an Athlete Performance account, use <strong>Connect Existing Player</strong>. Only use <strong>Create New Player</strong> when no Player record exists yet.</p></div>
      </div>

      <div className="familySetupChooser">
        <button className={parentSetupMode==="new"?"active":""} onClick={()=>{setParentSetupMode(parentSetupMode==="new"?"choose":"new");setParentMessage("")}}>
          <small>NO PLAYER RECORD YET</small><b>Create New Player</b><span>Best for a younger child or Player who has never used this app.</span>
        </button>
        <button className={parentSetupMode==="existing"?"active":""} onClick={()=>{setParentSetupMode(parentSetupMode==="existing"?"choose":"existing");setParentMessage("")}}>
          <small>PLAYER ALREADY HAS AN ACCOUNT</small><b>Connect Existing Player</b><span>Use the Parent Connection Code from the Player. No duplicate athlete is created.</span>
        </button>
      </div>

      {parentSetupMode==="new"&&<div className="parentPlayerCreate connectionCreatePanel">
        <div className="connectionPanelIntro"><small>CREATE ONE NEW ATHLETE</small><b>Parent-managed Player</b><p>The Parent manages login access now. A Player login can be connected later to this same athlete.</p></div>
        <label>Player name<input value={childName} onChange={e=>setChildName(e.target.value)} placeholder="Player name"/></label>
        <label>Age<input type="number" min="6" max="99" inputMode="numeric" value={childAge} onChange={e=>setChildAge(e.target.value)} placeholder="e.g. 10"/></label>
        <label>Sport<select value={childSport} onChange={e=>setChildSport(e.target.value)}>{sports.map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Position<input value={childPosition} onChange={e=>setChildPosition(e.target.value)} placeholder="Optional"/></label>
        <label>Team<input value={childTeam} onChange={e=>setChildTeam(e.target.value)} placeholder="Optional"/></label>
        <button className="betaPrimary" disabled={!!connectionAction||!childName.trim()} onClick={createParentPlayer}>{connectionAction==="parent-create"?"Creating…":"Create Parent-Managed Player"}</button>
      </div>}

      {parentSetupMode==="existing"&&<div className="familyConnectExisting connectionExistingPanel">
        <div><small>CONNECT — DO NOT RECREATE</small><h3>Connect Existing Player</h3><p>Ask the Player to open <b>Connections → Invite a Parent</b>. Enter that one-time Parent Connection Code here.</p></div>
        <label>Parent Connection Code<input value={parentConnectionCode} onChange={e=>setParentConnectionCode(e.target.value.toUpperCase())} placeholder="A1B2C3D4E5"/></label>
        <button className="betaPrimary" disabled={!!connectionAction||!parentConnectionCode.trim()} onClick={parentConnectExistingPlayer}>{connectionAction==="parent-existing"?"Connecting…":"Connect Existing Player"}</button>
      </div>}

      {parentMessage&&<div className="betaMessage connectionMessage">{parentMessage}</div>}

      <div className="familyOwnershipGuide">
        <div><span>1</span><b>One athlete record</b><small>Goals, testing, and history stay together.</small></div>
        <div><span>2</span><b>Parent supports</b><small>Junior Mode can work without a child login.</small></div>
        <div><span>3</span><b>Player login can link later</b><small>No new athlete is needed.</small></div>
        <div><span>4</span><b>Coach joins by team</b><small>The Coach never owns the Player account.</small></div>
      </div>

      <div className="familyPlayerSectionHead"><div><small>CONNECTED TO THIS PARENT</small><h3>Players</h3></div><span>{parentPlayers.length}</span></div>
      <div className="parentPlayerList familyPlayerList">
        {parentPlayers.length===0?<div className="connectionEmptyState"><b>No Players connected yet</b><span>Choose Create New Player or Connect Existing Player above.</span></div>:parentPlayers.map(player=>{const status=parentConnectionStatuses.find(x=>x.athlete_id===player.id);return <article key={player.id} className={player.workspace_id===selectedCloudWorkspaceId?"active":""}>
          <div className="familyPlayerIdentity"><div className={`betaPlayerAvatar ${parentPlayerPhotos[player.workspace_id]?"hasPhoto":"fallback"}`}>{parentPlayerPhotos[player.workspace_id]?<img src={parentPlayerPhotos[player.workspace_id]} alt={`${player.display_name} profile`}/>:<><b>{player.display_name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()||"P"}</b><i aria-hidden="true">🏒</i></>}</div><div className="familyPlayerNameBlock"><b>{player.display_name}</b><small>{player.sport}{player.position?" · "+player.position:""}{player.team_name?" · "+player.team_name:""} · Age {player.age||"—"}</small></div><span className={"familyManagementBadge "+player.account_management.toLowerCase()}>{player.account_management==="Parent"?"Parent Managed":"Player Managed"}</span></div>
          <div className="connectionBadges">
            <span className={status?.player_login_connected?"connected":"ready"}>{status?.player_login_connected?"✓ Player Login Connected":"Player Login Optional"}</span>
            <span className="connected">✓ Parent Connected{status&&status.parent_count>1?` · ${status.parent_count}`:""}</span>
            <span className={status&&status.coach_count>0?"connected":"ready"}>{status&&status.coach_count>0?`✓ Coach Connected · ${status.coach_count}`:"Coach Not Connected Yet"}</span>
          </div>
          <div className="familyPlayerActions">
            <button onClick={()=>openParentPlayer(player)}>Open Parent View</button>
            {player.account_management==="Parent"&&<button className="betaPrimary" onClick={()=>openManagedPlayer(player)}>{Number(player.age||0)<=10?"Open Junior Player":"Open Player View"}</button>}
            {player.account_management==="Parent"&&<button disabled={!!connectionAction} onClick={()=>void copyPlayerLoginAccess(player)}>{connectionAction==="player-access"?"Preparing…":Number(player.age||0)<=10?"Give Player Login Later":"Give Player Login Access"}</button>}
          </div>
        </article>})}
      </div>

      {parentPlayers.length>0&&<div className="parentJoinTeam connectionTeamPanel">
        <div><small>COACH CONNECTION</small><h3>Connect a Player to a Coach's Team</h3><p>The Coach sends a Team Invite Code. Select the existing Player below so the Coach is linked to that same athlete record.</p></div>
        <label>Player<select value={parentJoinAthleteId} onChange={e=>setParentJoinAthleteId(e.target.value)}>{parentPlayers.map(x=><option key={x.id} value={x.id}>{x.display_name}</option>)}</select></label>
        <label>Team Invite Code<input value={parentJoinCode} onChange={e=>setParentJoinCode(e.target.value.toUpperCase())} placeholder="ABCDEFGH"/></label>
        <button className="betaPrimary" disabled={!!connectionAction||!parentJoinAthleteId||!parentJoinCode.trim()} onClick={parentJoinTeam}>{connectionAction==="parent-team"?"Connecting…":"Connect to Coach Team"}</button>
      </div>}
    </div></div>}

    {showPlayerJoinTeam&&access.role==="Player"&&<div className="betaModalOverlay"><div className="betaModalCard playerConnectionsCard connectionSetupCard">
      <div className="sectionHead"><div><small>PLAYER CONNECTIONS</small><h2>My Connections</h2></div><button onClick={()=>setShowPlayerJoinTeam(false)}>×</button></div>

      <div className="playerConnectionSummary">
        <div className="connectionSummaryHead"><div><small>ONE ATHLETE · SHARED SUPPORT</small><h3>{playerConnectionStatus?.display_name||selfAthlete?.display_name||"My Player Record"}</h3></div><button onClick={()=>void loadPlayerConnectionStatus()}>Refresh</button></div>
        <div className="connectionSummaryGrid">
          <div className="connected"><small>PLAYER LOGIN</small><b>✓ Connected</b><span>This login owns the Player account.</span></div>
          <div className={playerConnectionStatus&&playerConnectionStatus.parent_count>0?"connected":"ready"}><small>PARENT</small><b>{playerConnectionStatus&&playerConnectionStatus.parent_count>0?`${playerConnectionStatus.parent_count} Connected`:"Not Connected Yet"}</b><span>{playerConnectionStatus&&playerConnectionStatus.parent_count>0?"Family support is linked.":"Invite a Parent when you want family support."}</span></div>
          <div className={playerConnectionStatus&&playerConnectionStatus.coach_count>0?"connected":"ready"}><small>COACH</small><b>{playerConnectionStatus&&playerConnectionStatus.coach_count>0?`${playerConnectionStatus.coach_count} Connected`:"Not Connected Yet"}</b><span>{playerConnectionStatus&&playerConnectionStatus.coach_count>0?`${playerConnectionStatus.team_count} team connection${playerConnectionStatus.team_count===1?"":"s"}.`:"Join a Coach team with its invite code."}</span></div>
        </div>
        <div className="connectionNextStep"><b>{!playerConnectionStatus?"Checking connection status…":playerConnectionStatus.parent_count===0?"Next: Invite a Parent":playerConnectionStatus.coach_count===0?"Next: Join a Coach Team":"Core connections are set up"}</b><span>{!playerConnectionStatus?"Refresh after migration 008 is installed.":playerConnectionStatus.parent_count===0?"Your Parent connects to this same athlete—do not create another Player.":playerConnectionStatus.coach_count===0?"Your Coach will see this same athlete after you join their team.":"Player, family, and Coach support all point to the same athlete record."}</span></div>
      </div>

      <div className="playerConnectionPrimaryGrid">
        <div className="playerParentConnect connectionPrimaryCard">
          <small>FAMILY</small><h3>Invite a Parent</h3><p>Create a one-time Parent Connection Code. Your Parent signs in, opens <b>My Players → Connect Existing Player</b>, and uses the code.</p>
          {parentInviteMessage&&<div className="betaMessage">{parentInviteMessage}</div>}
          <button className="betaPrimary" disabled={!!connectionAction} onClick={copyParentConnectionInvite}>{connectionAction==="player-parent"?"Preparing Invite…":"Copy Parent Connection Invite"}</button>
        </div>

        <div className="playerTeamConnect connectionPrimaryCard">
          <small>COACH TEAM</small><h3>Join a Coach's Team</h3><p>Enter the Team Invite Code your Coach sent you. This connects the Coach to your existing Player record.</p>
          <label>Team Invite Code<input value={playerJoinCode} onChange={e=>setPlayerJoinCode(e.target.value.toUpperCase())} placeholder="ABCDEFGH"/></label>
          {playerJoinMessage&&<div className="betaMessage">{playerJoinMessage}</div>}
          <button className="betaPrimary" disabled={!!connectionAction||!playerJoinCode.trim()} onClick={playerJoinTeam}>{connectionAction==="player-team"?"Connecting…":"Join Coach Team"}</button>
        </div>
      </div>

      <details className="connectionRecovery">
        <summary>Did a Parent create my Player before I made this login?</summary>
        <div className="playerFamilyClaim">
          <small>PLAYER ACCESS RECOVERY</small><h3>Link the Parent-created Player record</h3><p>Only use this when a Parent already created your Player in this app. Enter the Player Access Code from the Parent so this login replaces the temporary signup record and keeps the original history.</p>
          <label>Player Access Code<input value={existingPlayerAccessCode} onChange={e=>setExistingPlayerAccessCode(e.target.value.toUpperCase())} placeholder="A1B2C3D4E5"/></label>
          {playerAccessMessage&&<div className="betaMessage">{playerAccessMessage}</div>}
          <button disabled={!!connectionAction||!existingPlayerAccessCode.trim()} onClick={claimExistingParentPlayer}>{connectionAction==="player-claim"?"Linking…":"Link Existing Player Record"}</button>
        </div>
      </details>
    </div></div>}

    {showTeams&&access.role==="Coach"&&<div className="betaModalOverlay"><div className="betaAdminCard coachTeamsRosterModal">
      <div className="sectionHead"><div><small>COACH ROSTER</small><h2>{coachTeamsMode==="invite"?"Invite / Connect Player":"Teams & Membership"}</h2></div><button onClick={()=>setShowTeams(false)}>×</button></div>
      <div className="coachTeamModeTabs">
        <button className={coachTeamsMode==="invite"?"active":""} onClick={()=>setCoachTeamsMode("invite")}>＋ Invite Player</button>
        <button className={coachTeamsMode==="manage"?"active":""} onClick={()=>setCoachTeamsMode("manage")}>Manage Teams</button>
      </div>

      {coachTeamsMode==="invite"?<>
        <div className="connectionRuleNotice coachConnectionRule"><span>1 ATHLETE</span><div><b>The Coach connects to an existing Player</b><p>Send the Team Invite Code to the Player or Parent. Do not create a second Player record for the Coach.</p></div></div>
        <div className="coachInviteExplanation"><span>1</span><div><b>Select a team</b><p>The Player or Parent receives the invite. They sign in to their own account and join the existing athlete with the code.</p></div></div>

        {teams.length===0?<div className="coachInviteNoTeam">
          <span className="tag">FIRST STEP</span><h3>Create a team before inviting Players</h3><p>An invite code belongs to a Coach-managed team.</p>
          <div className="teamCreateGrid">
            <label>Team name<input value={newTeamName} onChange={e=>setNewTeamName(e.target.value)} placeholder="e.g. 14U Select"/></label>
            <label>Sport<select value={newTeamSport} onChange={e=>setNewTeamSport(e.target.value)}>{sports.map(x=><option key={x}>{x}</option>)}</select></label>
            <button className="betaPrimary" onClick={createTeam}>Create Team</button>
          </div>
        </div>:<>
          <label>Team<select value={selectedTeamId} onChange={e=>void loadTeamMembers(e.target.value)}>{teams.map(team=><option key={team.id} value={team.id}>{team.name} · {team.sport}</option>)}</select></label>

          {selectedTeam&&<div className="coachInvitePrimaryCard">
            <small>PLAYER INVITE CODE</small>
            <strong>{selectedTeam.invite_code}</strong>
            <p>Send this to the Player or Parent. The Coach does not create the Player account.</p>
            <div className="coachInviteButtons">
              <button className="betaPrimary" onClick={copyTeamInvite}>Copy Invite Message</button>
              <button onClick={copyTeamInviteCode}>Copy Code Only</button>
            </div>
          </div>}

          <div className="coachInviteSteps">
            <div><span>1</span><b>Coach sends invite</b><small>Copy the message or code above.</small></div>
            <div><span>2</span><b>Player / Parent signs in</b><small>They own the account and Player profile.</small></div>
            <div><span>3</span><b>They choose Join Team</b><small>Enter the Coach's team code.</small></div>
            <div><span>4</span><b>Player appears in Roster</b><small>Coach can then review development information.</small></div>
          </div>

          <div className="teamRosterList coachInviteJoinedList">
            <div className="sectionHead"><div><small>ALREADY JOINED</small><h3>{selectedTeam?.name||"Team"} Roster</h3></div><span className="tag">{teamMembers.length}</span></div>
            {teamMembers.length===0?<p>No Players have joined this team yet.</p>:teamMembers.map(member=>{const status=coachConnectionStatuses.find(x=>x.athlete_id===member.athlete_id);return <div className="coachGroupMember connectionRosterMember" key={member.id}><div><b>{member.athlete?.display_name||"Player"}</b><small>{member.athlete?.sport}{member.athlete?.position?" · "+member.athlete.position:""}</small><div className="connectionBadges compact"><span className={status?.player_login_connected?"connected":"ready"}>{status?.player_login_connected?"Player Login":"Parent Managed"}</span><span className={status&&status.parent_count>0?"connected":"ready"}>{status&&status.parent_count>0?`Parent · ${status.parent_count}`:"No Parent"}</span></div></div><button onClick={()=>openTeamAthlete(member)}>Open Athlete</button></div>})}
          </div>
        </>}
      </>:<>
        <p className="coachGroupIntro">Create teams, select the active team, manage membership, and regenerate invite codes. Player identity/profile ownership remains with the Player or Admin.</p>

        <div className="teamCreateGrid">
          <label>Team name<input value={newTeamName} onChange={e=>setNewTeamName(e.target.value)} placeholder="e.g. 14U Select"/></label>
          <label>Sport<select value={newTeamSport} onChange={e=>setNewTeamSport(e.target.value)}>{sports.map(x=><option key={x}>{x}</option>)}</select></label>
          <button className="betaPrimary" onClick={createTeam}>Create Team</button>
        </div>

        {teams.length>0&&<label>Selected Team<select value={selectedTeamId} onChange={e=>void loadTeamMembers(e.target.value)}>{teams.map(team=><option key={team.id} value={team.id}>{team.name} · {team.sport}</option>)}</select></label>}

        {selectedTeam&&<div className="teamInviteCard">
          <div><small>PLAYER INVITE CODE</small><strong>{selectedTeam.invite_code}</strong><span>Use Invite Player for the guided sharing flow.</span></div>
          <div><button onClick={()=>setCoachTeamsMode("invite")}>Invite Player</button><button onClick={regenerateTeamInvite}>Generate New Code</button></div>
        </div>}

        <div className="teamRosterList">
          {selectedTeam&&!teamMembers.length?<p>No Players have joined this team yet.</p>:teamMembers.map(member=>{const status=coachConnectionStatuses.find(x=>x.athlete_id===member.athlete_id);return <div className="coachGroupMember connectionRosterMember" key={member.id}><div><b>{member.athlete?.display_name||"Player"}</b><small>{member.athlete?.sport}{member.athlete?.position?" · "+member.athlete.position:""}</small><div className="connectionBadges compact"><span className={status?.player_login_connected?"connected":"ready"}>{status?.player_login_connected?"Player Login Connected":"Parent Managed"}</span><span className={status&&status.parent_count>0?"connected":"ready"}>{status&&status.parent_count>0?`Parent Connected · ${status.parent_count}`:"No Parent Connected"}</span></div></div><div><button onClick={()=>openTeamAthlete(member)}>Open Athlete</button><button onClick={()=>void removeTeamAthlete(member)}>Remove</button></div></div>})}
        </div>
      </>}

      {teamMessage&&<div className="betaMessage">{teamMessage}</div>}
    </div></div>}

    {showFeedback&&<div className="betaModalOverlay"><div className="betaModalCard">
      <div className="sectionHead"><div><small>BETA FEEDBACK</small><h2>Report a problem</h2></div><button onClick={()=>setShowFeedback(false)}>×</button></div>
      <label>Type<select value={feedbackType} onChange={e=>setFeedbackType(e.target.value)}><option>Bug</option><option>Confusing</option><option>Feature Request</option><option>Other</option></select></label>
      <label>What happened?<textarea rows={5} value={feedbackBody} onChange={e=>setFeedbackBody(e.target.value)} placeholder="Tell us what you expected and what happened instead."/></label>
      <div className="betaDiagnosticNotice"><b>Automatic beta context will be included</b><span>Version, account role, selected athlete, sport, online/offline status, and page path. No password or authentication token is included.</span></div>
      {feedbackSeed&&<details className="betaFeedbackSeed"><summary>Captured error details</summary><pre>{feedbackSeed}</pre></details>}
      {feedbackMessage&&<div className="betaMessage">{feedbackMessage}</div>}
      <button className="betaPrimary" onClick={submitFeedback}>Send Feedback</button>
    </div></div>}

    {showAdmin&&access.role==="Admin"&&<div className="betaModalOverlay"><div className="betaAdminCard betaAdminInboxCard">
      <div className="sectionHead"><div><small>BETA ADMIN</small><h2>{adminSection==="accounts"?"Account Access":adminSection==="family"?"Family & Account Diagnostics":"Beta Feedback Inbox"}</h2></div><button onClick={()=>setShowAdmin(false)}>×</button></div>
      <div className="betaAdminTabs">
        <button className={adminSection==="accounts"?"active":""} onClick={()=>setAdminSection("accounts")}>Accounts</button>
        <button className={adminSection==="family"?"active":""} onClick={()=>setAdminSection("family")}>Family <span>{familyIssueTotal}</span></button>
        <button className={adminSection==="feedback"?"active":""} onClick={()=>{setAdminSection("feedback");void loadFeedbackInbox()}}>Feedback <span>{feedbackInbox.length}</span></button>
      </div>

      {adminSection==="accounts"?<>
        <p className="coachGroupIntro">Players and Parents self-register. Use Admin approval primarily for Coach and Admin accounts.</p>
        <div className="accountVsAthleteNotice"><span>ACCOUNT ≠ ATHLETE</span><div><b>Accounts shows logins, not every Player record.</b><p>A Parent-managed Junior Player appears in <strong>Family</strong> as an athlete but does not appear in <strong>Accounts</strong> until that Player has their own login. This is expected and does not mean the athlete is missing.</p></div></div>
        <div className="betaInviteGrid">
          <label>Email<input type="email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="coach@example.com"/></label>
          <label>Name<input value={inviteName} onChange={e=>setInviteName(e.target.value)} placeholder="Name"/></label>
          <label>Role<select value={inviteRole} onChange={e=>setInviteRole(e.target.value as BetaRole)}>{roles.map(r=><option key={r}>{r}</option>)}</select></label>
          <button className="betaPrimary" onClick={createInvite}>Approve / Invite</button>
        </div>
        {adminMessage&&<div className="betaMessage">{adminMessage}</div>}
        <div className="betaMemberList">{members.map(m=><div key={m.user_id} className="betaMemberRow"><div><b>{m.display_name||m.email}</b><small>{m.email} · {m.role}</small></div><button onClick={()=>void setMemberActive(m,!m.active)}>{m.active?"Disable":"Enable"}</button></div>)}</div>
      </>:adminSection==="family"?<div className="familyDiagnostics">
        <div className="familyDiagnosticsIntro">
          <div><small>ONE ATHLETE RECORD</small><h3>Family & Account Health</h3><p>Inspect Player login, Parent, Coach/team, workspace, and management relationships. Repair buttons are intentionally conservative: they do not merge or delete athlete records.</p></div>
          <button onClick={()=>void loadFamilyDiagnostics()} disabled={familyDiagnosticLoading}>{familyDiagnosticLoading?"Checking…":"Refresh Diagnostics"}</button>
        </div>
        <div className="familyDiagnosticMetrics">
          <div><small>ATHLETES</small><b>{familyDiagnostics.length}</b></div>
          <div><small>HEALTHY</small><b>{familyHealthyTotal}</b></div>
          <div><small>ISSUES</small><b>{familyIssueTotal}</b></div>
        </div>
        <div className="familyConnectionLegend"><b>Healthy does not require every role.</b><span>A Parent-managed Junior can be healthy with no Player login. A Player can be healthy before a Parent or Coach connects. Diagnostics checks whether existing relationships point to the correct athlete/workspace.</span></div>
        <div className="familyDiagnosticToolbar">
          <label>Show<select value={familyDiagnosticFilter} onChange={e=>setFamilyDiagnosticFilter(e.target.value as "Needs Attention"|"All")}><option>Needs Attention</option><option>All</option></select></label>
          <span>{filteredFamilyDiagnostics.length} shown</span>
        </div>
        {familyDiagnosticMessage&&<div className="betaMessage">{familyDiagnosticMessage}</div>}
        {familyDiagnosticLoading&&familyDiagnostics.length===0?<div className="feedbackEmpty"><b>Checking family relationships…</b><span>Reviewing Player, Parent, Coach/team, and workspace links.</span></div>:
        filteredFamilyDiagnostics.length===0?<div className="familyHealthyState"><span>✓</span><b>No family/account issues found</b><small>All currently loaded athlete relationships passed the diagnostic checks.</small></div>:
        <div className="familyDiagnosticList">{filteredFamilyDiagnostics.map(row=><article className={"familyDiagnosticRow "+(row.issue_count>0?"needsAttention":"healthy")} key={row.athlete_id}>
          <div className="familyDiagnosticTop">
            <div><b>{row.display_name}</b><small>{row.sport}{row.athlete_age?` · Age ${row.athlete_age}`:""} · {row.account_management==="Admin Test"?"Admin Test":row.account_management==="Parent"?"Parent Managed":"Player Managed"}</small></div>
            <span className={row.issue_count>0?"familyIssueBadge":"familyHealthyBadge"}>{row.issue_count>0?`${row.issue_count} issue${row.issue_count===1?"":"s"}`:"Healthy"}</span>
          </div>
          <div className="familyRelationshipGrid">
            <div><small>PLAYER LOGIN</small><b>{row.account_management==="Admin Test"?"Not required":row.linked_user_id?"Connected":"Not connected"}</b><span>{row.account_management==="Admin Test"?"Cloud test athlete":row.player_email||"—"}</span></div>
            <div><small>PARENTS</small><b>{row.parent_count}</b><span>{row.parent_count===1?"linked Parent":"linked Parents"}</span></div>
            <div><small>COACHES</small><b>{row.coach_count}</b><span>{row.team_count} team{row.team_count===1?"":"s"}</span></div>
            <div><small>WORKSPACE</small><b>{row.has_workspace_state?"Ready":"Missing data row"}</b><span>{row.account_management==="Admin Test"?"Cloud test workspace":row.linked_user_id?(row.player_workspace_matches?"Login aligned":"Login mismatch"):"No Player login"}</span></div>
          </div>
          <div className="familyConnectionGuidance"><b>Connection guidance</b><span>{familyConnectionGuidance(row)}</span></div>
          {row.issues.length>0&&<div className="familyIssueList">{row.issues.map(issue=><div key={issue}><span>!</span><p>{issue}</p></div>)}</div>}
          <div className="familyRepairActions">
            <button className="familyViewAthlete" disabled={!row.has_workspace_state} onClick={()=>{selectCoachRosterAthlete(row.workspace_id);setShowAdmin(false)}}>{row.has_workspace_state?"View Athlete":"Create Workspace State First"}</button>
            {row.linked_user_id&&!row.player_workspace_matches&&<button disabled={familyRepairingId===row.athlete_id} onClick={()=>void repairFamilyAccount(row,"sync_player_workspace")}>Sync Player Workspace</button>}
            {row.account_management==="Parent"&&row.linked_user_id&&<button disabled={familyRepairingId===row.athlete_id} onClick={()=>void repairFamilyAccount(row,"set_player_managed")}>Set Player Managed</button>}
            {row.account_management==="Player"&&!row.linked_user_id&&row.parent_count>0&&<button disabled={familyRepairingId===row.athlete_id} onClick={()=>void repairFamilyAccount(row,"set_parent_managed")}>Set Parent Managed</button>}
            {row.linked_user_id&&row.player_claim_code_active&&<button disabled={familyRepairingId===row.athlete_id} onClick={()=>void repairFamilyAccount(row,"clear_stale_player_code")}>Clear Stale Access Code</button>}
            {!row.has_workspace_state&&<button disabled={familyRepairingId===row.athlete_id} onClick={()=>void repairFamilyAccount(row,"ensure_workspace_state")}>Create Missing Workspace State</button>}
            {!row.linked_user_id&&row.parent_count>0&&!row.player_claim_code_active&&<button disabled={familyRepairingId===row.athlete_id} onClick={()=>void repairFamilyAccount(row,"regenerate_player_access")}>Restore Player Access</button>}
            {row.issue_count>0&&row.issues.some(issue=>issue.includes("manual review"))&&<span className="familyManualReview">Manual review required — no automatic merge is performed.</span>}
          </div>
        </article>)}</div>}
      </div>:<div className="feedbackInbox">
        <div className="feedbackInboxToolbar"><div><small>REPORTS</small><b>{filteredFeedback.length} shown · {feedbackInbox.length} total</b></div><div><select aria-label="Filter feedback" value={feedbackFilter} onChange={e=>setFeedbackFilter(e.target.value)}>{feedbackCategories.map(x=><option key={x}>{x}</option>)}</select><button onClick={()=>void loadFeedbackInbox()}>Refresh</button></div></div>
        {feedbackInboxMessage&&<div className="betaMessage">{feedbackInboxMessage}</div>}
        {filteredFeedback.length===0?<div className="feedbackEmpty"><b>No feedback reports yet</b><span>Reports submitted with Report Problem will appear here.</span></div>:<div className="feedbackInboxList">{filteredFeedback.map(item=>{const reporter=feedbackReporter(item.user_id);return <article className="feedbackInboxItem" key={item.id}>
          <div className="feedbackInboxTop"><div><span className="tag">{item.category}</span><b>{reporter?.display_name||reporter?.email||"Beta tester"}</b></div><time>{formatFeedbackDate(item.created_at)}</time></div>
          <p>{item.message}</p>
          <div className="feedbackInboxMeta"><span>{reporter?.email||"User ID: "+item.user_id.slice(0,8)+"…"}</span>{item.app_version&&<span>v{item.app_version}</span>}</div>
          {item.page_url&&<a href={item.page_url} target="_blank" rel="noreferrer">Open reported page ↗</a>}
        </article>})}</div>}
      </div>}
    </div></div>}
  </div>;
}
