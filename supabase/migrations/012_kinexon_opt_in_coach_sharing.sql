-- Athlete Performance App — Phase 72.3.94 RC44
-- KINEXON partner connectivity + granular Player/Parent-to-Coach sharing.
--
-- Migrations 010 and 011 remain the tracker data foundation. This migration:
--   * adds KINEXON as a provider without changing existing provider values;
--   * adds normalized movement/load fields used by KINEXON sessions;
--   * adds explicit, revocable, per-Coach category grants;
--   * keeps OAuth tokens and connection secrets server-only;
--   * keeps direct tracker-table reads Player/Parent-only. Coach reads are
--     category-filtered by the server API so unshared columns never leave it.

alter table public.tracker_connections
  drop constraint if exists tracker_connections_provider_check;

alter table public.tracker_connections
  add constraint tracker_connections_provider_check
  check (provider in ('fitbit','google-health','oura','whoop','strava','kinexon'));

alter table public.tracker_oauth_states
  drop constraint if exists tracker_oauth_states_provider_check;

alter table public.tracker_oauth_states
  add constraint tracker_oauth_states_provider_check
  check (provider in ('fitbit','google-health','oura','whoop','strava'));

alter table public.tracker_workouts
  add column if not exists high_speed_distance_meters numeric,
  add column if not exists sprint_distance_meters numeric,
  add column if not exists max_speed_mps numeric,
  add column if not exists accelerations integer,
  add column if not exists decelerations integer,
  add column if not exists player_load numeric;

create table if not exists public.tracker_coach_shares (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  coach_user_id uuid not null references public.beta_users(user_id) on delete cascade,
  granted_by uuid not null references auth.users(id) on delete cascade,
  granted_by_role text not null check (granted_by_role in ('Player','Parent')),
  active boolean not null default false,
  share_sleep boolean not null default false,
  share_recovery boolean not null default false,
  share_workouts boolean not null default false,
  share_heart_rate boolean not null default false,
  share_movement_load boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(athlete_id,coach_user_id)
);

alter table public.tracker_coach_shares enable row level security;

-- Owners may inspect current consent. A Coach may inspect only their own grant.
-- Writes go through the authenticated server endpoint after relationship checks.
drop policy if exists "tracker owners read sharing choices" on public.tracker_coach_shares;
create policy "tracker owners read sharing choices"
on public.tracker_coach_shares for select to authenticated
using (
  public.can_view_private_tracker_data(athlete_id)
  or (
    public.current_beta_role()='Coach'
    and coach_user_id=auth.uid()
    and public.can_coach_manage_athlete(athlete_id)
  )
);

revoke all on public.tracker_coach_shares from anon,authenticated;
grant select on public.tracker_coach_shares to authenticated;

create index if not exists tracker_coach_shares_athlete_idx
  on public.tracker_coach_shares(athlete_id,active);
create index if not exists tracker_coach_shares_coach_idx
  on public.tracker_coach_shares(coach_user_id,active);

comment on table public.tracker_coach_shares is
  'Explicit revocable category-level tracker consent from a Player or linked Parent to one current Coach.';

comment on column public.tracker_connections.provider_user_id is
  'Provider account/athlete identifier. For KINEXON this is the KINEXON-issued athlete ID; organization API credentials remain server-only.';

notify pgrst,'reload schema';
