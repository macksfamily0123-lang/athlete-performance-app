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


## Phase 72.3.53 — Family accounts

Apply:
`migrations/005_family_accounts_junior_player.sql`

### Parent-managed minor
A Parent can create a Player without creating a child login.
The athlete is marked `account_management = 'Parent'`.

The Parent can explicitly open a Parent-managed Player session. The application uses
`parent_save_managed_player_state(...)`, which only merges Player-owned data and preserves Coach-owned development information.

### Player Access Code
A Parent may generate/rotate a Player Access Code with:
`parent_rotate_player_claim_code(...)`.

A new Player signup can include that code. The signup trigger links the auth user to the existing athlete workspace instead of creating a duplicate.

A fresh existing Player account can use:
`player_claim_parent_managed_athlete(...)`.

If that Player account already has connected or meaningful athlete data, the RPC refuses an automatic merge so Admin can resolve the records safely.

### Junior Player Mode
Junior Player Mode is an application presentation layer for age 10 and under.
It does not create a separate database record or separate development history.


## Phase 72.3.54 — Parent support scheduling/results

Apply after migration 005:

`migrations/006_parent_support_scheduling_results.sql`

This adds `parent_save_support_data(uuid,jsonb)`.

The function is `security definer` and validates the authenticated Parent ↔ Player relationship before writing.

It merges only:
- Parent-tagged `workouts`
- Parent-tagged `competitions` where `entryKind = "Score"`

It preserves non-Parent workout/competition entries and does not alter normal workspace RLS policies.


## Phase 72.3.57 — Family reliability

Apply `migrations/007_family_reliability_admin_diagnostics.sql` as the only new migration for this combined release. It also installs/retains the Parent support scheduling/results RPC from migration 006, so migration 006 does not need to be rerun.

Adds:
- `athletes.parent_link_code`
- `player_rotate_parent_link_code()`
- `parent_link_existing_player(text)`
- `admin_family_diagnostics()`
- `admin_repair_family_account(uuid,text)`

Parent Connection Codes allow a Player-owned athlete to add a Parent later without creating a duplicate athlete.

Admin repair operations are deliberately conservative and do not merge/delete athlete records.


## Phase 72.3.58 live-test correction

No migration 008 is required.

The packaged migration 007 now contains the qualified diagnostics query used during live testing:

`select athlete_row.*`
`from public.athletes athlete_row`
`order by lower(athlete_row.display_name),athlete_row.created_at`

If the corrected migration 007 has already been applied to the live Supabase project, no database action is required for v72.3.58.


## Phase 72.3.60 + 72.3.61 — migration 008

New migration:

`supabase/migrations/008_connection_setup_reliability.sql`

Adds:
- `parent_connection_status()`
- `player_connection_status()`
- `coach_team_connection_status(uuid)`
- same-Parent duplicate protection in `parent_create_managed_athlete(...)`

The status functions return relationship counts/status only. They do not expose Player Access Codes, Parent Connection Codes, Coach invite codes, or Parent identities to Coach accounts.

Migration 008 is idempotent for repeated schema deployment, but an already-working beta database only needs to run it once.


## Phase 72.3.62

Install after migration 008:

`009_player_more_cloud_test_athletes.sql`

It adds:
- `athletes.beta_test`
- `admin_create_test_athlete(...)`
- Admin test-aware Family diagnostics
- schema-cache reload notification

Admin test athletes are cloud-persistent sandbox athletes. They do not automatically create or impersonate a real Player login, Parent, or Coach relationship.
