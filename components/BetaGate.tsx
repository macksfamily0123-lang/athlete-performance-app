"use client";

import {useCallback,useEffect,useMemo,useState} from "react";
import type {User} from "@supabase/supabase-js";
import AthleteApp,{type BetaBridge,type BetaRole} from "./AthleteApp";
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

type AthleteRow={
  id:string;
  workspace_id:string;
  display_name:string;
  sport:string;
  position:string;
  team_name:string;
  linked_user_id:string|null;
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

const roles:BetaRole[]=["Player","Coach","Parent","Admin"];
const sports=["Baseball","Football","Ice Hockey","Basketball","Lacrosse","Wrestling","Soccer","Figure Skating"];

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
  const [message,setMessage]=useState("");

  const [showDisclaimer,setShowDisclaimer]=useState(false);
  const [showFeedback,setShowFeedback]=useState(false);
  const [feedbackType,setFeedbackType]=useState("Bug");
  const [feedbackBody,setFeedbackBody]=useState("");
  const [feedbackMessage,setFeedbackMessage]=useState("");

  const [showAdmin,setShowAdmin]=useState(false);
  const [members,setMembers]=useState<BetaMember[]>([]);
  const [inviteEmail,setInviteEmail]=useState("");
  const [inviteName,setInviteName]=useState("");
  const [inviteRole,setInviteRole]=useState<BetaRole>("Coach");
  const [adminMessage,setAdminMessage]=useState("");

  const [selectedCloudWorkspaceId,setSelectedCloudWorkspaceId]=useState("");
  const [selectedAthleteName,setSelectedAthleteName]=useState("");

  // Parent-managed players
  const [showParentPlayers,setShowParentPlayers]=useState(false);
  const [parentPlayers,setParentPlayers]=useState<AthleteRow[]>([]);
  const [childName,setChildName]=useState("");
  const [childSport,setChildSport]=useState("Ice Hockey");
  const [childPosition,setChildPosition]=useState("");
  const [childTeam,setChildTeam]=useState("");
  const [parentMessage,setParentMessage]=useState("");
  const [parentJoinAthleteId,setParentJoinAthleteId]=useState("");
  const [parentJoinCode,setParentJoinCode]=useState("");

  // Player team invite
  const [showPlayerJoinTeam,setShowPlayerJoinTeam]=useState(false);
  const [playerJoinCode,setPlayerJoinCode]=useState("");
  const [playerJoinMessage,setPlayerJoinMessage]=useState("");
  const [selfAthlete,setSelfAthlete]=useState<AthleteRow|null>(null);

  // Coach teams
  const [showTeams,setShowTeams]=useState(false);
  const [teams,setTeams]=useState<TeamRow[]>([]);
  const [selectedTeamId,setSelectedTeamId]=useState("");
  const [teamMembers,setTeamMembers]=useState<TeamMemberRow[]>([]);
  const [newTeamName,setNewTeamName]=useState("");
  const [newTeamSport,setNewTeamSport]=useState("Ice Hockey");
  const [teamMessage,setTeamMessage]=useState("");

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

  const submitAuth=async()=>{
    if(!supabase)return;
    setMessage("");
    if(!email.trim()||!password){setMessage("Enter your email and password.");return}
    if(authMode==="signin"){
      const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
      if(error)setMessage(error.message);
      return;
    }
    const {error}=await supabase.auth.signUp({
      email:email.trim(),
      password,
      options:{data:{display_name:displayName.trim(),requested_role:signupRole}}
    });
    setMessage(error?error.message:"Account created. Check your email if confirmation is enabled, then sign in. Players and Parents are activated automatically. Coach and Admin accounts require approval.");
  };

  const signOut=async()=>{
    if(supabase)await supabase.auth.signOut();
    setAccess(null);
    setUser(null);
    setSelectedAthleteName("");
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
    if(access.role==="Parent")return;
    const workspaceId=selectedCloudWorkspaceId||access.workspace_id;
    const {error}=await supabase.from("workspace_state").upsert({
      workspace_id:workspaceId,
      data,
      updated_by:access.user_id,
      updated_at:new Date().toISOString()
    },{onConflict:"workspace_id"});
    if(error)throw error;
  };

  // ------------------------------------------------------------
  // Parent: multiple players
  // ------------------------------------------------------------
  const loadParentPlayers=async()=>{
    if(!supabase||access?.role!=="Parent")return;
    setParentMessage("");
    const {data,error}=await supabase
      .from("parent_athletes")
      .select("athlete_id,athlete:athletes!parent_athletes_athlete_id_fkey(id,workspace_id,display_name,sport,position,team_name,linked_user_id)")
      .eq("parent_user_id",access.user_id)
      .order("created_at");
    if(error){setParentMessage(error.message);return}
    const rows=(data||[]) as unknown as ParentAthleteLink[];
    const athletes=rows.map(x=>x.athlete).filter(Boolean) as AthleteRow[];
    setParentPlayers(athletes);
    if(!parentJoinAthleteId&&athletes[0])setParentJoinAthleteId(athletes[0].id);
    if(!selectedAthleteName&&athletes[0]){
      setSelectedCloudWorkspaceId(athletes[0].workspace_id);
      setSelectedAthleteName(athletes[0].display_name);
    }
  };

  const createParentPlayer=async()=>{
    if(!supabase||access?.role!=="Parent"||!childName.trim())return;
    setParentMessage("");
    const {data,error}=await supabase.rpc("parent_create_athlete",{
      p_name:childName.trim(),
      p_sport:childSport,
      p_position:childPosition.trim(),
      p_team_name:childTeam.trim()
    });
    if(error){setParentMessage(error.message);return}
    setChildName("");setChildPosition("");setChildTeam("");
    setParentMessage("Player added to your Parent account.");
    await loadParentPlayers();
    const created=Array.isArray(data)?data[0]:data;
    if(created?.workspace_id){
      setSelectedCloudWorkspaceId(created.workspace_id);
      setSelectedAthleteName(created.display_name||"Player");
    }
  };

  const openParentPlayer=(athlete:AthleteRow)=>{
    if(access?.role!=="Parent")return;
    setSelectedCloudWorkspaceId(athlete.workspace_id);
    setSelectedAthleteName(athlete.display_name);
    setShowParentPlayers(false);
  };

  const parentJoinTeam=async()=>{
    if(!supabase||access?.role!=="Parent"||!parentJoinAthleteId||!parentJoinCode.trim())return;
    setParentMessage("");
    const {data,error}=await supabase.rpc("join_team_with_code",{
      p_athlete_id:parentJoinAthleteId,
      p_invite_code:parentJoinCode.trim().toUpperCase()
    });
    if(error){setParentMessage(error.message);return}
    setParentJoinCode("");
    setParentMessage(`Player joined ${data||"the team"}.`);
  };

  useEffect(()=>{
    if(access?.role==="Parent")void loadParentPlayers();
  },[access?.user_id,access?.role]);

  // ------------------------------------------------------------
  // Player: join team by coach invite
  // ------------------------------------------------------------
  const loadSelfAthlete=async()=>{
    if(!supabase||access?.role!=="Player")return;
    const {data}=await supabase.from("athletes")
      .select("id,workspace_id,display_name,sport,position,team_name,linked_user_id")
      .eq("linked_user_id",access.user_id)
      .maybeSingle();
    const row=(data as AthleteRow|null)||null;
    setSelfAthlete(row);
    if(row){
      setSelectedCloudWorkspaceId(row.workspace_id);
      setSelectedAthleteName(row.display_name);
    }
  };

  const playerJoinTeam=async()=>{
    if(!supabase||access?.role!=="Player"||!selfAthlete||!playerJoinCode.trim())return;
    setPlayerJoinMessage("");
    const {data,error}=await supabase.rpc("join_team_with_code",{
      p_athlete_id:selfAthlete.id,
      p_invite_code:playerJoinCode.trim().toUpperCase()
    });
    if(error){setPlayerJoinMessage(error.message);return}
    setPlayerJoinCode("");
    setPlayerJoinMessage(`Joined ${data||"the team"}.`);
  };

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
    else setTeamMembers([]);
  };

  const loadTeamMembers=async(teamId:string)=>{
    if(!supabase||access?.role!=="Coach"||!teamId){setTeamMembers([]);return}
    setSelectedTeamId(teamId);
    const {data,error}=await supabase
      .from("team_members")
      .select("id,team_id,athlete_id,athlete:athletes!team_members_athlete_id_fkey(id,workspace_id,display_name,sport,position,team_name,linked_user_id)")
      .eq("team_id",teamId)
      .order("created_at");
    if(error){setTeamMessage(error.message);return}
    setTeamMembers((data||[]) as unknown as TeamMemberRow[]);
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
    const text=`Join ${selectedTeam.name} in Athlete Performance. Team invite code: ${selectedTeam.invite_code}`;
    try{
      await navigator.clipboard.writeText(text);
      setTeamMessage("Player invite copied.");
    }catch{
      setTeamMessage(`Share this team invite code: ${selectedTeam.invite_code}`);
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
  const submitFeedback=async()=>{
    if(!supabase||!access||!feedbackBody.trim())return;
    setFeedbackMessage("");
    const {error}=await supabase.from("beta_feedback").insert({
      workspace_id:selectedCloudWorkspaceId||access.workspace_id,
      user_id:access.user_id,
      category:feedbackType,
      message:feedbackBody.trim(),
      app_version:"72.3.19",
      page_url:window.location.href
    });
    if(error){setFeedbackMessage(error.message);return}
    setFeedbackBody("");
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

  useEffect(()=>{if(showAdmin)void loadMembers()},[showAdmin]);

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

  const bridge:BetaBridge|null=useMemo(()=>access&&user?{
    session:{
      role:access.role,
      displayName:access.display_name||access.email,
      athleteId:access.role==="Parent"&&parentPlayers.length
        ?(parentPlayers.find(x=>x.workspace_id===selectedCloudWorkspaceId)?.id||parentPlayers[0].id)
        :"primary"
    },
    userId:user.id,
    email:access.email,
    workspaceId:selectedCloudWorkspaceId||access.workspace_id,
    loadState:loadCloudState,
    saveState:saveCloudState,
    onSignOut:signOut
  }:null,[access,user,selectedCloudWorkspaceId,parentPlayers]);

  if(!betaConfigured())return <div className="betaSetupShell"><div className="betaSetupCard">
    <div className="betaMark">BETA</div><h1>Beta backend needs configuration</h1>
    <p>This build is ready for secure Supabase accounts and cloud sync, but the Vercel environment variables have not been added yet.</p>
    <code>NEXT_PUBLIC_SUPABASE_URL</code><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
    <p>Run the included Supabase migration first, then add those two values in Vercel.</p>
  </div></div>;

  if(loading)return <div className="betaSetupShell"><div className="betaSetupCard"><div className="betaMark">BETA</div><h1>Loading beta access…</h1></div></div>;

  if(!user)return <div className="betaAuthShell"><div className="betaAuthCard">
    <div className="betaAuthBrand"><span>AP</span><div><small>ATHLETE PERFORMANCE</small><h1>{authMode==="signin"?"Beta sign in":"Create beta account"}</h1><p>Secure accounts with cloud-backed athlete data.</p></div></div>
    <div className="betaModeSwitch"><button className={authMode==="signin"?"active":""} onClick={()=>{setAuthMode("signin");setMessage("")}}>Sign In</button><button className={authMode==="signup"?"active":""} onClick={()=>{setAuthMode("signup");setMessage("")}}>Create Account</button></div>

    {authMode==="signup"&&<><div className="selfSignupRole"><small>ACCOUNT TYPE</small><div>{(["Player","Parent"] as const).map(r=><button key={r} className={signupRole===r?"active":""} onClick={()=>setSignupRole(r)}><b>{r}</b><span>{r==="Player"?"Create my own athlete account":"Create one Parent account and add multiple players"}</span></button>)}</div><p>Players and Parents can sign up directly. Coach accounts require approval. Only Coaches manage teams and team rosters.</p></div><label>Display name<input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Name"/></label></>}

    <label>Email<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
    <label>Password<input type="password" autoComplete={authMode==="signin"?"current-password":"new-password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/></label>
    {message&&<div className="betaMessage">{message}</div>}
    <button className="betaPrimary" onClick={submitAuth}>{authMode==="signin"?"Sign In":"Create Account"}</button>
    <small className="betaFinePrint">Parents can add multiple players after signing in. Coaches can create teams and send player invite codes.</small>
  </div></div>;

  if(!access||!access.active)return <div className="betaAuthShell"><div className="betaAuthCard">
    <div className="betaMark">ACCESS</div><h1>Account is not active</h1>
    <p>You are signed in as <b>{user.email}</b>, but this account is not active.</p>
    <p>Players and Parents self-register. Coach and Admin accounts require approval.</p>
    <button className="betaPrimary" onClick={signOut}>Sign Out</button>
  </div></div>;

  return <div className="betaAppShell">
    <div className="betaRibbon">BETA · v72.3.19</div>

    <AthleteApp betaBridge={bridge!}/>

    <div className="betaUtilityBar">
      {access.role==="Parent"&&<button onClick={()=>setShowParentPlayers(true)}>My Players</button>}
      {access.role==="Player"&&<button onClick={()=>setShowPlayerJoinTeam(true)}>Join Team</button>}
      {access.role==="Coach"&&<button onClick={()=>setShowTeams(true)}>Teams</button>}
      {access.role==="Coach"&&selectedAthleteName&&<button onClick={returnToCoachWorkspace}>Return to Coach Workspace</button>}
      {access.role==="Admin"&&<button onClick={()=>setShowAdmin(true)}>Beta Admin</button>}
      <button onClick={()=>setShowFeedback(true)}>Report a Problem</button>
    </div>

    {access.role==="Parent"&&selectedAthleteName&&<div className="parentViewingBanner"><small>PARENT VIEWING</small><b>{selectedAthleteName}</b><span>Parent tools for this player.</span></div>}
    {access.role==="Coach"&&selectedAthleteName&&<div className="coachViewingBanner"><small>COACH VIEWING</small><b>{selectedAthleteName}</b><span>Changes are saving to this player's cloud workspace.</span></div>}

    {showDisclaimer&&<div className="betaModalOverlay"><div className="betaModalCard">
      <div className="betaMark">BETA NOTICE</div><h2>Testing version</h2>
      <p>This is pre-release software. Features may change and occasional bugs or data issues may occur. Only enter athlete information you are authorized to share.</p>
      <p>Use the Report a Problem button whenever something does not work as expected.</p>
      <button className="betaPrimary" onClick={()=>{try{localStorage.setItem(`betaDisclaimerAccepted:${access.user_id}`,"1")}catch{}setShowDisclaimer(false)}}>I Understand</button>
    </div></div>}

    {showParentPlayers&&access.role==="Parent"&&<div className="betaModalOverlay"><div className="betaAdminCard">
      <div className="sectionHead"><div><small>PARENT ACCOUNT</small><h2>My Players</h2></div><button onClick={()=>setShowParentPlayers(false)}>×</button></div>
      <p className="coachGroupIntro">One Parent account can manage the signup connection for multiple players. Select a player to open that player's Parent view.</p>

      <div className="parentPlayerCreate">
        <label>Player name<input value={childName} onChange={e=>setChildName(e.target.value)} placeholder="Player name"/></label>
        <label>Sport<select value={childSport} onChange={e=>setChildSport(e.target.value)}>{sports.map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Position<input value={childPosition} onChange={e=>setChildPosition(e.target.value)} placeholder="Optional"/></label>
        <label>Team<input value={childTeam} onChange={e=>setChildTeam(e.target.value)} placeholder="Optional"/></label>
        <button className="betaPrimary" onClick={createParentPlayer}>Add Player</button>
      </div>

      <div className="parentPlayerList">
        {parentPlayers.length===0?<p>No players added yet.</p>:parentPlayers.map(player=><button key={player.id} className={player.workspace_id===selectedCloudWorkspaceId?"active":""} onClick={()=>openParentPlayer(player)}><div><b>{player.display_name}</b><small>{player.sport}{player.position?" · "+player.position:""}{player.team_name?" · "+player.team_name:""}</small></div><span>Open Parent View →</span></button>)}
      </div>

      {parentPlayers.length>0&&<div className="parentJoinTeam">
        <h3>Join a Coach's Team</h3>
        <p>Choose one of your players and enter the invite code sent by the Coach.</p>
        <label>Player<select value={parentJoinAthleteId} onChange={e=>setParentJoinAthleteId(e.target.value)}>{parentPlayers.map(x=><option key={x.id} value={x.id}>{x.display_name}</option>)}</select></label>
        <label>Team invite code<input value={parentJoinCode} onChange={e=>setParentJoinCode(e.target.value.toUpperCase())} placeholder="ABCDEFGH"/></label>
        <button className="betaPrimary" onClick={parentJoinTeam}>Join Team</button>
      </div>}

      {parentMessage&&<div className="betaMessage">{parentMessage}</div>}
    </div></div>}

    {showPlayerJoinTeam&&access.role==="Player"&&<div className="betaModalOverlay"><div className="betaModalCard">
      <div className="sectionHead"><div><small>PLAYER</small><h2>Join a Team</h2></div><button onClick={()=>setShowPlayerJoinTeam(false)}>×</button></div>
      <p>Enter the team invite code your Coach sent you.</p>
      <label>Team invite code<input value={playerJoinCode} onChange={e=>setPlayerJoinCode(e.target.value.toUpperCase())} placeholder="ABCDEFGH"/></label>
      {playerJoinMessage&&<div className="betaMessage">{playerJoinMessage}</div>}
      <button className="betaPrimary" onClick={playerJoinTeam}>Join Team</button>
    </div></div>}

    {showTeams&&access.role==="Coach"&&<div className="betaModalOverlay"><div className="betaAdminCard">
      <div className="sectionHead"><div><small>COACH ONLY</small><h2>Teams</h2></div><button onClick={()=>setShowTeams(false)}>×</button></div>
      <p className="coachGroupIntro">Create a team, select it, then share its Player Invite Code. Players can join themselves, or a Parent can join one of their players.</p>

      <div className="teamCreateGrid">
        <label>Team name<input value={newTeamName} onChange={e=>setNewTeamName(e.target.value)} placeholder="e.g. 14U Select"/></label>
        <label>Sport<select value={newTeamSport} onChange={e=>setNewTeamSport(e.target.value)}>{sports.map(x=><option key={x}>{x}</option>)}</select></label>
        <button className="betaPrimary" onClick={createTeam}>Create Team</button>
      </div>

      {teams.length>0&&<label>Selected Team<select value={selectedTeamId} onChange={e=>void loadTeamMembers(e.target.value)}>{teams.map(team=><option key={team.id} value={team.id}>{team.name} · {team.sport}</option>)}</select></label>}

      {selectedTeam&&<div className="teamInviteCard">
        <div><small>PLAYER INVITE CODE</small><strong>{selectedTeam.invite_code}</strong><span>Send this code to a Player or Parent.</span></div>
        <div><button onClick={copyTeamInvite}>Copy Player Invite</button><button onClick={regenerateTeamInvite}>Generate New Code</button></div>
      </div>}

      {teamMessage&&<div className="betaMessage">{teamMessage}</div>}

      <div className="teamRosterList">
        {selectedTeam&&!teamMembers.length?<p>No players have joined this team yet.</p>:teamMembers.map(member=><div className="coachGroupMember" key={member.id}><div><b>{member.athlete?.display_name||"Player"}</b><small>{member.athlete?.sport}{member.athlete?.position?" · "+member.athlete.position:""}</small></div><div><button onClick={()=>openTeamAthlete(member)}>Open Athlete</button><button onClick={()=>void removeTeamAthlete(member)}>Remove</button></div></div>)}
      </div>
    </div></div>}

    {showFeedback&&<div className="betaModalOverlay"><div className="betaModalCard">
      <div className="sectionHead"><div><small>BETA FEEDBACK</small><h2>Report a problem</h2></div><button onClick={()=>setShowFeedback(false)}>×</button></div>
      <label>Type<select value={feedbackType} onChange={e=>setFeedbackType(e.target.value)}><option>Bug</option><option>Confusing</option><option>Feature Request</option><option>Other</option></select></label>
      <label>What happened?<textarea rows={5} value={feedbackBody} onChange={e=>setFeedbackBody(e.target.value)} placeholder="Tell us what you expected and what happened instead."/></label>
      {feedbackMessage&&<div className="betaMessage">{feedbackMessage}</div>}
      <button className="betaPrimary" onClick={submitFeedback}>Send Feedback</button>
    </div></div>}

    {showAdmin&&access.role==="Admin"&&<div className="betaModalOverlay"><div className="betaAdminCard">
      <div className="sectionHead"><div><small>BETA ADMIN</small><h2>Account Access</h2></div><button onClick={()=>setShowAdmin(false)}>×</button></div>
      <p className="coachGroupIntro">Players and Parents self-register. Use Admin approval primarily for Coach and Admin accounts.</p>
      <div className="betaInviteGrid">
        <label>Email<input type="email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="coach@example.com"/></label>
        <label>Name<input value={inviteName} onChange={e=>setInviteName(e.target.value)} placeholder="Name"/></label>
        <label>Role<select value={inviteRole} onChange={e=>setInviteRole(e.target.value as BetaRole)}>{roles.map(r=><option key={r}>{r}</option>)}</select></label>
        <button className="betaPrimary" onClick={createInvite}>Approve / Invite</button>
      </div>
      {adminMessage&&<div className="betaMessage">{adminMessage}</div>}
      <div className="betaMemberList">{members.map(m=><div key={m.user_id} className="betaMemberRow"><div><b>{m.display_name||m.email}</b><small>{m.email} · {m.role}</small></div><button onClick={()=>void setMemberActive(m,!m.active)}>{m.active?"Disable":"Enable"}</button></div>)}</div>
    </div></div>}
  </div>;
}
