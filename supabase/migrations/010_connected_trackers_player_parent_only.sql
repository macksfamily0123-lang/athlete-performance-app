-- Athlete Performance App — Phase 72.3.89 RC39
-- Connected Trackers: Player/Parent-only workout + sleep data.
-- IMPORTANT: Coach and Admin are intentionally excluded from tracker-data access.

create table if not exists public.tracker_connections (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('fitbit','oura','whoop','strava')),
  provider_user_id text,
  status text not null default 'connected' check (status in ('connected','error','revoked')),
  scopes text[] not null default '{}'::text[],
  access_token_enc text not null,
  refresh_token_enc text,
  token_expires_at timestamptz,
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(athlete_id,user_id,provider)
);

create table if not exists public.tracker_oauth_states (
  state_hash text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  provider text not null check (provider in ('fitbit','oura','whoop','strava')),
  redirect_to text not null default '/',
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tracker_daily_metrics (
  id bigint generated always as identity primary key,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  provider text not null,
  metric_date date not null,
  sleep_minutes integer,
  sleep_score numeric,
  readiness_score numeric,
  resting_hr numeric,
  hrv_ms numeric,
  steps integer,
  active_minutes integer,
  calories numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(athlete_id,provider,metric_date)
);

create table if not exists public.tracker_workouts (
  id bigint generated always as identity primary key,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  provider text not null,
  provider_workout_id text not null,
  workout_date timestamptz not null,
  workout_type text not null default 'Workout',
  duration_minutes numeric,
  avg_hr numeric,
  max_hr numeric,
  calories numeric,
  distance_meters numeric,
  strain numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(athlete_id,provider,provider_workout_id)
);

alter table public.tracker_connections enable row level security;
alter table public.tracker_oauth_states enable row level security;
alter table public.tracker_daily_metrics enable row level security;
alter table public.tracker_workouts enable row level security;

create or replace function public.can_view_private_tracker_data(p_athlete uuid)
returns boolean
language sql stable security definer set search_path=public
as $$
  select case public.current_beta_role()
    when 'Player' then exists(
      select 1 from public.athletes a
      where a.id=p_athlete and a.linked_user_id=auth.uid()
    )
    when 'Parent' then exists(
      select 1 from public.parent_athletes pa
      where pa.athlete_id=p_athlete and pa.parent_user_id=auth.uid()
    )
    else false
  end
$$;

revoke all on function public.can_view_private_tracker_data(uuid) from public,anon;
grant execute on function public.can_view_private_tracker_data(uuid) to authenticated;

-- Connections and OAuth tokens are server-only. No authenticated client policy is created.
-- The service-role-backed API returns only safe connection metadata.

drop policy if exists "player parent read tracker daily metrics" on public.tracker_daily_metrics;
create policy "player parent read tracker daily metrics"
on public.tracker_daily_metrics for select to authenticated
using (public.can_view_private_tracker_data(athlete_id));

drop policy if exists "player parent read tracker workouts" on public.tracker_workouts;
create policy "player parent read tracker workouts"
on public.tracker_workouts for select to authenticated
using (public.can_view_private_tracker_data(athlete_id));

revoke all on public.tracker_connections from anon,authenticated;
revoke all on public.tracker_oauth_states from anon,authenticated;
revoke insert,update,delete on public.tracker_daily_metrics from anon,authenticated;
revoke insert,update,delete on public.tracker_workouts from anon,authenticated;
grant select on public.tracker_daily_metrics to authenticated;
grant select on public.tracker_workouts to authenticated;

create index if not exists tracker_daily_metrics_athlete_date_idx on public.tracker_daily_metrics(athlete_id,metric_date desc);
create index if not exists tracker_workouts_athlete_date_idx on public.tracker_workouts(athlete_id,workout_date desc);
create index if not exists tracker_connections_athlete_idx on public.tracker_connections(athlete_id,user_id);
