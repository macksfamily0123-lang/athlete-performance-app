-- Athlete Performance App — Phase 72.3.90 RC40
-- Google Health / Fitbit migration.
-- Keeps legacy 'fitbit' values readable while allowing all new connections to use 'google-health'.

alter table public.tracker_connections
  drop constraint if exists tracker_connections_provider_check;

alter table public.tracker_connections
  add constraint tracker_connections_provider_check
  check (provider in ('fitbit','google-health','oura','whoop','strava'));

alter table public.tracker_oauth_states
  drop constraint if exists tracker_oauth_states_provider_check;

alter table public.tracker_oauth_states
  add constraint tracker_oauth_states_provider_check
  check (provider in ('fitbit','google-health','oura','whoop','strava'));

comment on table public.tracker_connections is
  'Private Player/Parent tracker connections. New Fitbit/Pixel Watch connections use google-health; legacy fitbit rows remain valid for migration safety.';
