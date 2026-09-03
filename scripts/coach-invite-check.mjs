import fs from "node:fs";

const athlete=fs.readFileSync("components/AthleteApp.tsx","utf8");
const beta=fs.readFileSync("components/BetaGate.tsx","utf8");

const checks=[
 ["Coach Roster has Invite Player button", athlete.includes("＋ Invite Player")&&athlete.includes("coachRosterPrimaryActions")],
 ["Coach Roster has Manage Teams button", athlete.includes("Manage Teams")],
 ["Roster explains Player ownership", athlete.includes("The Player still creates and owns their own account and profile.")],
 ["Invite callback exists in bridge", athlete.includes("openCoachInvitePlayer?:()=>void;")],
 ["Roster receives invite callback", athlete.includes("openCoachInvitePlayer={betaBridge?.openCoachInvitePlayer}")],
 ["Beta bridge exposes invite mode", beta.includes('openCoachInvitePlayer:access.role==="Coach"?()=>{setCoachTeamsMode("invite");setShowTeams(true)}:undefined')],
 ["Teams callback opens manage mode", beta.includes('openCoachTeams:access.role==="Coach"?()=>{setCoachTeamsMode("manage");setShowTeams(true)}:undefined')],
 ["Invite modal has explicit tabs", beta.includes("＋ Invite Player")&&beta.includes("Teams & Membership")],
 ["Invite modal selects team", beta.includes("<label>Team<select value={selectedTeamId}")],
 ["Invite code is visible", beta.includes("PLAYER INVITE CODE")],
 ["Copy Invite Message exists", beta.includes("Copy Invite Message")],
 ["Copy Code Only exists", beta.includes("Copy Code Only")],
 ["Invite message uses beta origin", beta.includes("Open ${window.location.origin}")],
 ["Invite explains Join Team", beta.includes("Choose Join Team and enter code")],
 ["Invite preserves Player ownership", beta.includes("The Player keeps ownership of their own account, profile, goals, and check-ins.")],
 ["No fake email send button", !beta.includes(">Send Invite Email<")],
 ["Joined roster is visible", beta.includes("ALREADY JOINED")],
 ["Manage mode can regenerate code", beta.includes("Generate New Code")],
 ["Coach Help contains invite guidance", athlete.includes("How do I invite a Player?")],
 ["Coach setup points to Roster", athlete.includes("Invite Players & manage teams")&&athlete.includes('tab:"Roster"')]
];

const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log(`${ok?"PASS":"FAIL"}  ${name}`);
if(failed.length){
 console.error(`\n${failed.length}/${checks.length} Coach invite checks failed.`);
 process.exit(1);
}
console.log(`\nPASS: ${checks.length}/${checks.length} Coach invite checks.`);
