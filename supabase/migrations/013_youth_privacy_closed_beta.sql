-- Athlete Performance App — Phase 72.3.97 RC47
-- RC46 Youth Privacy & Account Controls + RC47 Closed Beta Launch
--
-- This migration intentionally leaves historical tracker migrations 010–012
-- untouched. Tracker connectivity remains disabled in the application.

create table if not exists public.privacy_consents (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  athlete_id uuid references public.athletes(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  consent_type text not null check (consent_type in ('account_privacy','guardian_account','coach_access')),
  policy_version text not null,
  granted boolean not null default true,
  relationship text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.privacy_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  athlete_id uuid references public.athletes(id) on delete set null,
  request_type text not null check (request_type in ('export','delete_account','delete_athlete','revoke_coach_access')),
  status text not null default 'submitted' check (status in ('submitted','in_review','completed','declined')),
  details text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.beta_feedback add column if not exists severity text not null default 'Normal';
alter table public.beta_feedback add column if not exists status text not null default 'Open';

alter table public.privacy_consents enable row level security;
alter table public.privacy_requests enable row level security;

drop policy if exists "members read own privacy consents" on public.privacy_consents;
create policy "members read own privacy consents" on public.privacy_consents
for select to authenticated
using (user_id=auth.uid() or public.current_beta_role()='Admin');

drop policy if exists "members read own privacy requests" on public.privacy_requests;
create policy "members read own privacy requests" on public.privacy_requests
for select to authenticated
using (user_id=auth.uid() or public.current_beta_role()='Admin');

drop policy if exists "admins update privacy requests" on public.privacy_requests;
create policy "admins update privacy requests" on public.privacy_requests
for update to authenticated
using (public.current_beta_role()='Admin')
with check (public.current_beta_role()='Admin');

-- All consent writes pass through this role-aware audit function.
create or replace function public.record_privacy_consent(
  p_consent_type text,
  p_policy_version text,
  p_athlete_id uuid default null,
  p_team_id uuid default null,
  p_granted boolean default true,
  p_relationship text default ''
)
returns bigint
language plpgsql
security definer
set search_path=public
as $$
declare
  allowed boolean:=false;
  inserted_id bigint;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_consent_type not in ('account_privacy','guardian_account','coach_access') then
    raise exception 'Invalid consent type';
  end if;
  if length(trim(coalesce(p_policy_version,'')))<1 then raise exception 'Policy version is required'; end if;

  if p_consent_type='account_privacy' and p_athlete_id is null then
    allowed:=true;
  elsif p_consent_type='guardian_account' then
    allowed:=public.current_beta_role()='Parent'
      and p_athlete_id is not null
      and public.can_parent_view_athlete(p_athlete_id);
  elsif p_consent_type='coach_access' then
    allowed:=p_athlete_id is not null and (
      exists(select 1 from public.athletes a where a.id=p_athlete_id and a.linked_user_id=auth.uid())
      or public.can_parent_view_athlete(p_athlete_id)
    );
    if p_team_id is not null and not exists(select 1 from public.teams t where t.id=p_team_id) then
      allowed:=false;
    end if;
  end if;

  if not allowed then raise exception 'You do not have permission to record this privacy choice'; end if;

  insert into public.privacy_consents(
    user_id,athlete_id,team_id,consent_type,policy_version,granted,relationship
  ) values(
    auth.uid(),p_athlete_id,p_team_id,p_consent_type,trim(p_policy_version),p_granted,coalesce(p_relationship,'')
  ) returning id into inserted_id;
  return inserted_id;
end;
$$;

create or replace function public.submit_privacy_request(
  p_request_type text,
  p_athlete_id uuid default null,
  p_details text default ''
)
returns bigint
language plpgsql
security definer
set search_path=public
as $$
declare
  allowed boolean:=false;
  inserted_id bigint;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_request_type not in ('export','delete_account','delete_athlete','revoke_coach_access') then
    raise exception 'Invalid privacy request type';
  end if;

  if p_athlete_id is null then
    allowed:=p_request_type in ('export','delete_account');
  else
    allowed:=exists(select 1 from public.athletes a where a.id=p_athlete_id and a.linked_user_id=auth.uid())
      or public.can_parent_view_athlete(p_athlete_id);
  end if;
  if not allowed then raise exception 'You do not have permission for this privacy request'; end if;

  insert into public.privacy_requests(user_id,athlete_id,request_type,details)
  values(auth.uid(),p_athlete_id,p_request_type,left(coalesce(p_details,''),2000))
  returning id into inserted_id;
  return inserted_id;
end;
$$;

-- One safe summary used by the Privacy Center. Parent identities are never
-- disclosed to a Coach; the response contains counts plus Coach/team names.
create or replace function public.privacy_access_summary(p_athlete_id uuid)
returns table(
  athlete_id uuid,
  display_name text,
  athlete_age smallint,
  account_management text,
  parent_count bigint,
  coach_count bigint,
  coach_access jsonb
)
language plpgsql
security definer
set search_path=public
as $$
begin
  if not (
    exists(select 1 from public.athletes a where a.id=p_athlete_id and a.linked_user_id=auth.uid())
    or public.can_parent_view_athlete(p_athlete_id)
    or public.can_coach_manage_athlete(p_athlete_id)
    or public.current_beta_role()='Admin'
  ) then raise exception 'You do not have permission to view this privacy summary'; end if;

  return query
  select
    a.id,a.display_name,a.age,a.account_management,
    (select count(*) from public.parent_athletes pa where pa.athlete_id=a.id),
    (select count(distinct t.coach_user_id) from public.team_members tm join public.teams t on t.id=tm.team_id where tm.athlete_id=a.id),
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'team_id',t.id,
        'team_name',t.name,
        'coach_name',coalesce(nullif(bu.display_name,''),bu.email),
        'joined_at',tm.created_at
      ) order by lower(t.name))
      from public.team_members tm
      join public.teams t on t.id=tm.team_id
      join public.beta_users bu on bu.user_id=t.coach_user_id
      where tm.athlete_id=a.id
    ),'[]'::jsonb)
  from public.athletes a
  where a.id=p_athlete_id;
end;
$$;

-- Parent creation with an explicit, versioned guardian attestation. The
-- athlete and consent audit row are committed in the same transaction.
create or replace function public.parent_create_managed_athlete_private(
  p_name text,
  p_sport text,
  p_age integer,
  p_position text default '',
  p_team_name text default '',
  p_guardian_attestation boolean default false,
  p_policy_version text default '2026-09-16'
)
returns table(
  id uuid,
  workspace_id uuid,
  display_name text,
  sport text,
  athlete_position text,
  team_name text,
  athlete_age smallint,
  account_management text
)
language plpgsql
security definer
set search_path=public
as $$
declare created record;
begin
  if public.current_beta_role()<>'Parent' then raise exception 'Parent account required'; end if;
  if not p_guardian_attestation then raise exception 'Parent or guardian consent is required'; end if;

  select * into created
  from public.parent_create_managed_athlete(p_name,p_sport,p_age,p_position,p_team_name);

  insert into public.privacy_consents(
    user_id,athlete_id,consent_type,policy_version,granted,relationship
  ) values(
    auth.uid(),created.id,'guardian_account',p_policy_version,true,'Parent or legal guardian'
  );

  return query select
    created.id::uuid,created.workspace_id::uuid,created.display_name::text,
    created.sport::text,created.athlete_position::text,created.team_name::text,
    created.athlete_age::smallint,created.account_management::text;
end;
$$;

-- Team membership is the Coach-data opt-in. The audit row records who used
-- the team code; deleting team membership still removes Coach access under
-- the existing row-level-security rules.
create or replace function public.join_team_with_code(
  p_athlete_id uuid,
  p_invite_code text
)
returns text
language plpgsql
security definer
set search_path=public
as $$
declare
  tid uuid;
  tname text;
  allowed boolean:=false;
begin
  select t.id,t.name into tid,tname
  from public.teams t
  join public.beta_users c on c.user_id=t.coach_user_id
  where upper(t.invite_code)=upper(trim(p_invite_code))
    and c.role='Coach' and c.active=true
  limit 1;
  if tid is null then raise exception 'Invalid team invite code'; end if;

  if public.current_beta_role()='Player' then
    allowed:=exists(select 1 from public.athletes a where a.id=p_athlete_id and a.linked_user_id=auth.uid());
  elsif public.current_beta_role()='Parent' then
    allowed:=public.can_parent_view_athlete(p_athlete_id);
  end if;
  if not allowed then raise exception 'You do not have permission to join this player to a team'; end if;

  insert into public.team_members(team_id,athlete_id)
  values(tid,p_athlete_id)
  on conflict(team_id,athlete_id) do nothing;

  update public.athletes set team_name=tname where id=p_athlete_id;

  insert into public.privacy_consents(
    user_id,athlete_id,team_id,consent_type,policy_version,granted,relationship
  ) values(
    auth.uid(),p_athlete_id,tid,'coach_access','2026-09-16',true,
    case when public.current_beta_role()='Parent' then 'Parent or legal guardian' else 'Player' end
  );
  return tname;
end;
$$;

-- RC47 is email-approved. Existing active accounts are unchanged. New users
-- receive a beta workspace only when an Admin has approved their email.
create or replace function public.handle_beta_signup()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  inv public.beta_invites%rowtype;
  requested_claim text;
  claim_target public.athletes%rowtype;
  new_workspace uuid;
  chosen_role text;
  chosen_name text;
begin
  chosen_name:=coalesce(nullif(new.raw_user_meta_data->>'display_name',''),split_part(new.email,'@',1));
  requested_claim:=upper(trim(coalesce(new.raw_user_meta_data->>'player_claim_code','')));

  select * into inv from public.beta_invites
  where lower(email)=lower(new.email) and active=true limit 1;
  if inv.email is null then return new; end if;

  chosen_role:=inv.role;
  if chosen_role='Player' and requested_claim<>'' then
    select * into claim_target from public.athletes
    where upper(player_claim_code)=requested_claim
      and account_management='Parent' and linked_user_id is null limit 1;
    if claim_target.id is null then raise exception 'Invalid or expired Player Access Code'; end if;
    chosen_name:=claim_target.display_name;
    new_workspace:=claim_target.workspace_id;
  elsif inv.workspace_id is not null then
    new_workspace:=inv.workspace_id;
  else
    insert into public.beta_workspaces(name) values(chosen_name||' workspace') returning id into new_workspace;
  end if;

  insert into public.beta_users(user_id,email,display_name,role,workspace_id,active)
  values(new.id,lower(new.email),chosen_name,chosen_role,new_workspace,true)
  on conflict(user_id) do update set
    email=excluded.email,display_name=excluded.display_name,role=excluded.role,
    workspace_id=excluded.workspace_id,active=true;

  if chosen_role='Player' and claim_target.id is not null then
    update public.athletes set linked_user_id=new.id,account_management='Player',player_claim_code=null
    where id=claim_target.id;
  elsif chosen_role='Player' then
    insert into public.athletes(workspace_id,display_name,linked_user_id,account_management,created_by)
    values(new_workspace,chosen_name,new.id,'Player',new.id)
    on conflict(linked_user_id) do nothing;
    insert into public.workspace_state(workspace_id,data,updated_by)
    values(new_workspace,jsonb_build_object('profile',jsonb_build_object(
      'name',chosen_name,'position','','team','','season','2026-27','height','','weight','','handedness','Right'
    )),new.id)
    on conflict(workspace_id) do nothing;
  end if;

  if coalesce((new.raw_user_meta_data->>'privacy_consent')::boolean,false) then
    insert into public.privacy_consents(user_id,consent_type,policy_version,granted,relationship)
    values(new.id,'account_privacy',coalesce(nullif(new.raw_user_meta_data->>'privacy_policy_version',''),'2026-09-16'),true,chosen_role);
  end if;
  return new;
end;
$$;

-- Approving an email after that person already created an unapproved Auth
-- account must still provision a complete Player workspace when applicable.
create or replace function public.admin_create_beta_invite(
  p_email text,
  p_role text,
  p_display_name text
)
returns void
language plpgsql
security definer
set search_path=public,auth
as $$
declare
  wid uuid;
  existing_workspace uuid;
  athlete_workspace uuid;
  existing_user auth.users%rowtype;
  chosen_name text;
begin
  if public.current_beta_role()<>'Admin' then raise exception 'Admin access required'; end if;
  if p_role not in ('Coach','Admin','Player','Parent') then raise exception 'Invalid role'; end if;
  chosen_name:=coalesce(nullif(trim(p_display_name),''),split_part(lower(trim(p_email)),'@',1));

  select * into existing_user from auth.users where lower(email)=lower(trim(p_email)) limit 1;
  if existing_user.id is not null then
    select bu.workspace_id into existing_workspace from public.beta_users bu where bu.user_id=existing_user.id;
    if p_role='Player' then
      select a.workspace_id into athlete_workspace from public.athletes a where a.linked_user_id=existing_user.id limit 1;
    end if;
  end if;

  wid:=coalesce(athlete_workspace,existing_workspace);
  if wid is null then
    insert into public.beta_workspaces(name) values(chosen_name||' workspace') returning id into wid;
  end if;
  insert into public.beta_invites(email,display_name,role,workspace_id,active)
  values(lower(trim(p_email)),chosen_name,p_role,wid,true)
  on conflict(email) do update set
    display_name=excluded.display_name,role=excluded.role,workspace_id=excluded.workspace_id,active=true;

  if existing_user.id is null then return; end if;

  insert into public.beta_users(user_id,email,display_name,role,workspace_id,active)
  values(existing_user.id,lower(trim(p_email)),chosen_name,p_role,wid,true)
  on conflict(user_id) do update set
    email=excluded.email,display_name=excluded.display_name,role=excluded.role,
    workspace_id=excluded.workspace_id,active=true;

  if p_role='Player' then
    insert into public.athletes(workspace_id,display_name,linked_user_id,account_management,created_by)
    values(wid,chosen_name,existing_user.id,'Player',existing_user.id)
    on conflict(linked_user_id) do nothing;
    insert into public.workspace_state(workspace_id,data,updated_by)
    values(wid,jsonb_build_object('profile',jsonb_build_object(
      'name',chosen_name,'position','','team','','season','2026-27','height','','weight','','handedness','Right'
    )),existing_user.id)
    on conflict(workspace_id) do nothing;
  end if;

  if coalesce((existing_user.raw_user_meta_data->>'privacy_consent')::boolean,false) then
    insert into public.privacy_consents(user_id,consent_type,policy_version,granted,relationship)
    values(existing_user.id,'account_privacy',coalesce(nullif(existing_user.raw_user_meta_data->>'privacy_policy_version',''),'2026-09-16'),true,p_role);
  end if;
end;
$$;

revoke all on function public.record_privacy_consent(text,text,uuid,uuid,boolean,text) from public,anon;
revoke all on function public.submit_privacy_request(text,uuid,text) from public,anon;
revoke all on function public.privacy_access_summary(uuid) from public,anon;
revoke all on function public.parent_create_managed_athlete_private(text,text,integer,text,text,boolean,text) from public,anon;
revoke all on function public.admin_create_beta_invite(text,text,text) from public,anon;
grant execute on function public.record_privacy_consent(text,text,uuid,uuid,boolean,text) to authenticated;
grant execute on function public.submit_privacy_request(text,uuid,text) to authenticated;
grant execute on function public.privacy_access_summary(uuid) to authenticated;
grant execute on function public.parent_create_managed_athlete_private(text,text,integer,text,text,boolean,text) to authenticated;
grant execute on function public.admin_create_beta_invite(text,text,text) to authenticated;

grant select on public.privacy_consents,public.privacy_requests to authenticated;
grant update(status,updated_at) on public.privacy_requests to authenticated;
grant select on all sequences in schema public to authenticated;

notify pgrst,'reload schema';
