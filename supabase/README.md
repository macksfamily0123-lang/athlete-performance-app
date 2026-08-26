# Phase 72.2 Supabase setup

## Account behavior

### Player
- Can sign up directly.
- Gets one Player account and one athlete workspace.
- Can enter a Coach's Team Invite Code to join a team.

### Parent
- Can sign up directly.
- Uses one Parent login.
- Can add multiple players under that one Parent account.
- Can switch between those players.
- Sees the Parent portion of the app for every linked player.
- Can enter a Coach's Team Invite Code for any linked player.

### Coach
- Cannot self-assign Coach access.
- Admin approves the Coach account.
- Only Coaches can create Teams and manage team rosters.
- A Coach selects a Team and gets a Player Invite Code.
- Coach can copy the invite, rotate the code, see joined players, and open a player's athlete workspace.

### Admin
- Approval-only.
- Controls account access.
- Admin does not replace the Coach's team-management role.

## Initial setup

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `migrations/001_beta_foundation.sql`.
4. Run the INITIAL ADMIN SETUP statements at the bottom with your email.
5. In Authentication settings, choose whether email confirmation is required.
6. Copy the Supabase Project URL and anon/public key.
7. Add these in Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
8. Redeploy.
9. Sign in as Admin.
10. Approve Coach emails from **Beta Admin**.

## Team invite workflow

Coach:
1. Open **Teams**.
2. Create/select a Team.
3. Tap **Copy Player Invite**.
4. Send the Team Invite Code to a Player or Parent.

Player:
1. Tap **Join Team**.
2. Enter the Team Invite Code.

Parent:
1. Open **My Players**.
2. Add as many players as needed.
3. Select the child/player.
4. Enter the Team Invite Code.

Only the Coach manages the Team roster. Parent accounts retain Parent-view access to their linked players.

## Security model

- Browser signup can only request Player or Parent.
- Database trigger ignores attempts to self-assign Coach/Admin.
- Parent-created players are separate athlete records with separate cloud workspaces.
- Parent access is granted only through `parent_athletes`.
- Team creation/update/deletion is Coach-only under Row Level Security.
- Team Invite Codes can only link a Player's own athlete or a Parent-linked athlete.
- Coaches can access athlete cloud data only for players who joined one of their Teams.
- Parents can read linked athlete cloud data, but the Parent app remains read-only.
