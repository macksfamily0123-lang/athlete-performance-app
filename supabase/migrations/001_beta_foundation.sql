-- Athlete Performance Beta Foundation — Phase 72.3.5 migration fix
--
-- Player: self-signup, owns one athlete workspace.
-- Parent: self-signup, may create/link multiple players and view their Parent portions.
-- Coach: Admin-approved only, creates Teams and Player Invite Codes.
-- Admin: approval-only.
-- Only Coaches manage Teams and team rosters.

create extension if not exists pgcrypto;

create table if not exists public.beta_workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.beta_invites (
  email text primary key,
  display_name text not null default '',
  role text not null check (role in ('Player','Coach','Parent','Admin')),
  workspace_id uuid references public.beta_workspaces(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.beta_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null default '',
  role text not null check (role in ('Player','Coach','Parent','Admin')),
  workspace_id uuid not null references public.beta_workspaces(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.athletes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references public.beta_workspaces(id) on delete cascade,
  display_name text not null,
  sport text not null default 'Ice Hockey',
  position text not null default '',
  team_name text not null default '',
  linked_user_id uuid unique references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.parent_athletes (
  parent_user_id uuid not null references public.beta_users(user_id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(parent_user_id,athlete_id)
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  coach_user_id uuid not null references public.beta_users(user_id) on delete cascade,
  name text not null,
  sport text not null default 'Ice Hockey',
  invite_code text not null unique default upper(substr(md5(gen_random_uuid()::text),1,8)),
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(team_id,athlete_id)
);

create table if not exists public.workspace_state (
  workspace_id uuid primary key references public.beta_workspaces(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.beta_feedback (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.beta_workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null default 'Bug',
  message text not null,
  app_version text,
  page_url text,
  created_at timestamptz not null default now()
);

alter table public.beta_workspaces enable row level security;
alter table public.beta_invites enable row level security;
alter table public.beta_users enable row level security;
alter table public.athletes enable row level security;
alter table public.parent_athletes enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.workspace_state enable row level security;
alter table public.beta_feedback enable row level security;

create or replace function public.current_beta_workspace()
returns uuid
language sql stable security definer set search_path=public
as $$
  select workspace_id from public.beta_users
  where user_id=auth.uid() and active=true
  limit 1
$$;

create or replace function public.current_beta_role()
returns text
language sql stable security definer set search_path=public
as $$
  select role from public.beta_users
  where user_id=auth.uid() and active=true
  limit 1
$$;

create or replace function public.can_parent_view_athlete(p_athlete uuid)
returns boolean
language sql stable security definer set search_path=public
as $$
  select exists(
    select 1 from public.parent_athletes pa
    join public.beta_users p on p.user_id=pa.parent_user_id
    where pa.parent_user_id=auth.uid()
      and pa.athlete_id=p_athlete
      and p.role='Parent'
      and p.active=true
  )
$$;

create or replace function public.can_coach_manage_athlete(p_athlete uuid)
returns boolean
language sql stable security definer set search_path=public
as $$
  select exists(
    select 1
    from public.teams t
    join public.team_members tm on tm.team_id=t.id
    join public.beta_users c on c.user_id=t.coach_user_id
    where t.coach_user_id=auth.uid()
      and tm.athlete_id=p_athlete
      and c.role='Coach'
      and c.active=true
  )
$$;

create or replace function public.can_access_workspace(p_workspace uuid)
returns boolean
language sql stable security definer set search_path=public
as $$
  select
    p_workspace=public.current_beta_workspace()
    or exists(
      select 1 from public.athletes a
      where a.workspace_id=p_workspace
      and (
        a.linked_user_id=auth.uid()
        or public.can_parent_view_athlete(a.id)
        or public.can_coach_manage_athlete(a.id)
      )
    )
$$;

revoke all on function public.current_beta_workspace() from public;
revoke all on function public.current_beta_role() from public;
revoke all on function public.can_parent_view_athlete(uuid) from public;
revoke all on function public.can_coach_manage_athlete(uuid) from public;
revoke all on function public.can_access_workspace(uuid) from public;
grant execute on function public.current_beta_workspace() to authenticated;
grant execute on function public.current_beta_role() to authenticated;
grant execute on function public.can_parent_view_athlete(uuid) to authenticated;
grant execute on function public.can_coach_manage_athlete(uuid) to authenticated;
grant execute on function public.can_access_workspace(uuid) to authenticated;

-- Account access
drop policy if exists "beta users read allowed accounts" on public.beta_users;
create policy "beta users read allowed accounts" on public.beta_users
for select to authenticated
using (
  user_id=auth.uid()
  or public.current_beta_role()='Admin'
);

-- Workspaces
drop policy if exists "workspace access" on public.beta_workspaces;
create policy "workspace access" on public.beta_workspaces
for select to authenticated
using (public.can_access_workspace(id));

-- Athletes
drop policy if exists "athlete access" on public.athletes;
create policy "athlete access" on public.athletes
for select to authenticated
using (
  linked_user_id=auth.uid()
  or public.can_parent_view_athlete(id)
  or public.can_coach_manage_athlete(id)
  or public.current_beta_role()='Admin'
);

-- Parent links are visible only to the linked Parent.
drop policy if exists "parent reads own athlete links" on public.parent_athletes;
create policy "parent reads own athlete links" on public.parent_athletes
for select to authenticated
using (parent_user_id=auth.uid() and public.current_beta_role()='Parent');

-- Coach owns Teams. Only Coach can create/update/delete Teams.
drop policy if exists "coach manages own teams" on public.teams;
create policy "coach manages own teams" on public.teams
for all to authenticated
using (coach_user_id=auth.uid() and public.current_beta_role()='Coach')
with check (coach_user_id=auth.uid() and public.current_beta_role()='Coach');

-- Team roster is managed only by that Team's Coach.
-- A Player/Parent does not directly edit this table; joining is via secure RPC.
drop policy if exists "coach manages team roster" on public.team_members;
create policy "coach manages team roster" on public.team_members
for all to authenticated
using (
  public.current_beta_role()='Coach'
  and exists(select 1 from public.teams t where t.id=team_id and t.coach_user_id=auth.uid())
)
with check (
  public.current_beta_role()='Coach'
  and exists(select 1 from public.teams t where t.id=team_id and t.coach_user_id=auth.uid())
);

-- Cloud state
drop policy if exists "read accessible workspace state" on public.workspace_state;
create policy "read accessible workspace state" on public.workspace_state
for select to authenticated
using (public.can_access_workspace(workspace_id));

drop policy if exists "write accessible workspace state" on public.workspace_state;
create policy "write accessible workspace state" on public.workspace_state
for insert to authenticated
with check (
  (
    workspace_id=public.current_beta_workspace()
    and public.current_beta_role() in ('Player','Coach','Admin')
  )
  or exists(
    select 1 from public.athletes a
    where a.workspace_id=workspace_id
      and (
        a.linked_user_id=auth.uid()
        or public.can_coach_manage_athlete(a.id)
      )
  )
);

drop policy if exists "update accessible workspace state" on public.workspace_state;
create policy "update accessible workspace state" on public.workspace_state
for update to authenticated
using (
  (
    workspace_id=public.current_beta_workspace()
    and public.current_beta_role() in ('Player','Coach','Admin')
  )
  or exists(
    select 1 from public.athletes a
    where a.workspace_id=workspace_id
      and (
        a.linked_user_id=auth.uid()
        or public.can_coach_manage_athlete(a.id)
      )
  )
)
with check (
  (
    workspace_id=public.current_beta_workspace()
    and public.current_beta_role() in ('Player','Coach','Admin')
  )
  or exists(
    select 1 from public.athletes a
    where a.workspace_id=workspace_id
      and (
        a.linked_user_id=auth.uid()
        or public.can_coach_manage_athlete(a.id)
      )
  )
);

-- Feedback
drop policy if exists "members submit feedback" on public.beta_feedback;
create policy "members submit feedback" on public.beta_feedback
for insert to authenticated
with check (user_id=auth.uid() and public.can_access_workspace(workspace_id));

drop policy if exists "admins read feedback" on public.beta_feedback;
create policy "admins read feedback" on public.beta_feedback
for select to authenticated
using (public.current_beta_role()='Admin');

-- ----------------------------------------------------------------
-- Signup trigger
-- ----------------------------------------------------------------
create or replace function public.handle_beta_signup()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  inv public.beta_invites%rowtype;
  requested text;
  new_workspace uuid;
  chosen_role text;
  chosen_name text;
begin
  requested:=coalesce(new.raw_user_meta_data->>'requested_role','');
  chosen_name:=coalesce(nullif(new.raw_user_meta_data->>'display_name',''),split_part(new.email,'@',1));

  select * into inv from public.beta_invites
  where lower(email)=lower(new.email) and active=true
  limit 1;

  if inv.email is not null then
    chosen_role:=inv.role;
    if inv.workspace_id is null then
      insert into public.beta_workspaces(name)
      values(chosen_name||' workspace')
      returning id into new_workspace;
    else
      new_workspace:=inv.workspace_id;
    end if;
  elsif requested in ('Player','Parent') then
    chosen_role:=requested;
    insert into public.beta_workspaces(name)
    values(chosen_name||' workspace')
    returning id into new_workspace;
  else
    return new;
  end if;

  insert into public.beta_users(user_id,email,display_name,role,workspace_id,active)
  values(new.id,lower(new.email),chosen_name,chosen_role,new_workspace,true)
  on conflict(user_id) do update set
    email=excluded.email,
    display_name=excluded.display_name,
    role=excluded.role,
    workspace_id=excluded.workspace_id,
    active=true;

  if chosen_role='Player' then
    insert into public.athletes(workspace_id,display_name,linked_user_id,created_by)
    values(new_workspace,chosen_name,new.id,new.id)
    on conflict(linked_user_id) do nothing;

    insert into public.workspace_state(workspace_id,data,updated_by)
    values(
      new_workspace,
      jsonb_build_object(
        'profile',jsonb_build_object(
          'name',chosen_name,
          'position','',
          'team','',
          'season','2026-27',
          'height','',
          'weight','',
          'handedness','Right'
        )
      ),
      new.id
    )
    on conflict(workspace_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_beta_auth_user_created on auth.users;
create trigger on_beta_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_beta_signup();

-- ----------------------------------------------------------------
-- Parent creates multiple players.
-- Creates a private athlete workspace and links it to that Parent.
-- ----------------------------------------------------------------
create or replace function public.parent_create_athlete(
  p_name text,
  p_sport text,
  p_position text default '',
  p_team_name text default ''
)
returns table(
  id uuid,
  workspace_id uuid,
  display_name text,
  sport text,
  athlete_position text,
  team_name text
)
language plpgsql
security definer
set search_path=public
as $$
declare
  wid uuid;
  aid uuid;
begin
  if public.current_beta_role()<>'Parent' then
    raise exception 'Parent account required';
  end if;
  if length(trim(p_name))<1 then
    raise exception 'Player name is required';
  end if;

  insert into public.beta_workspaces(name)
  values(trim(p_name)||' athlete workspace')
  returning beta_workspaces.id into wid;

  insert into public.athletes(workspace_id,display_name,sport,position,team_name,created_by)
  values(wid,trim(p_name),coalesce(nullif(trim(p_sport),''),'Ice Hockey'),coalesce(p_position,''),coalesce(p_team_name,''),auth.uid())
  returning athletes.id into aid;

  insert into public.parent_athletes(parent_user_id,athlete_id)
  values(auth.uid(),aid);

  insert into public.workspace_state(workspace_id,data,updated_by)
  values(
    wid,
    jsonb_build_object(
      'profile',jsonb_build_object(
        'name',trim(p_name),
        'position',coalesce(p_position,''),
        'team',coalesce(p_team_name,''),
        'season','2026-27',
        'height','',
        'weight','',
        'handedness','Right'
      ),
      'sport',coalesce(nullif(trim(p_sport),''),'Ice Hockey')
    ),
    auth.uid()
  );

  return query
  select a.id,a.workspace_id,a.display_name,a.sport,a.position,a.team_name
  from public.athletes a where a.id=aid;
end;
$$;

-- ----------------------------------------------------------------
-- Player/Parent joins a Coach's Team using Player Invite Code.
-- Player joins their own athlete.
-- Parent may join only a player linked to that Parent.
-- ----------------------------------------------------------------
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
  allowed boolean;
begin
  select t.id,t.name into tid,tname
  from public.teams t
  join public.beta_users c on c.user_id=t.coach_user_id
  where upper(t.invite_code)=upper(trim(p_invite_code))
    and c.role='Coach'
    and c.active=true
  limit 1;

  if tid is null then raise exception 'Invalid team invite code'; end if;

  allowed:=false;

  if public.current_beta_role()='Player' then
    allowed:=exists(
      select 1 from public.athletes a
      where a.id=p_athlete_id and a.linked_user_id=auth.uid()
    );
  elsif public.current_beta_role()='Parent' then
    allowed:=public.can_parent_view_athlete(p_athlete_id);
  end if;

  if not allowed then raise exception 'You do not have permission to join this player to a team'; end if;

  insert into public.team_members(team_id,athlete_id)
  values(tid,p_athlete_id)
  on conflict(team_id,athlete_id) do nothing;

  update public.athletes
  set team_name=tname
  where id=p_athlete_id;

  return tname;
end;
$$;

-- Coach rotates an invite code for a selected Team.
create or replace function public.coach_regenerate_team_invite(p_team_id uuid)
returns text
language plpgsql
security definer
set search_path=public
as $$
declare code text;
begin
  if public.current_beta_role()<>'Coach' then raise exception 'Coach account required'; end if;
  if not exists(select 1 from public.teams where id=p_team_id and coach_user_id=auth.uid()) then
    raise exception 'You do not manage this team';
  end if;

  loop
    code:=upper(substr(md5(gen_random_uuid()::text),1,8));
    exit when not exists(select 1 from public.teams where invite_code=code);
  end loop;

  update public.teams set invite_code=code where id=p_team_id;
  return code;
end;
$$;

-- ----------------------------------------------------------------
-- Admin account approvals for privileged roles.
-- ----------------------------------------------------------------
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
  existing_id uuid;
begin
  if public.current_beta_role()<>'Admin' then raise exception 'Admin access required'; end if;
  if p_role not in ('Coach','Admin','Player','Parent') then raise exception 'Invalid role'; end if;

  insert into public.beta_workspaces(name)
  values(coalesce(nullif(p_display_name,''),split_part(p_email,'@',1))||' workspace')
  returning id into wid;

  insert into public.beta_invites(email,display_name,role,workspace_id,active)
  values(lower(p_email),coalesce(p_display_name,''),p_role,wid,true)
  on conflict(email) do update set
    display_name=excluded.display_name,
    role=excluded.role,
    workspace_id=excluded.workspace_id,
    active=true;

  select id into existing_id from auth.users where lower(email)=lower(p_email) limit 1;
  if existing_id is not null then
    insert into public.beta_users(user_id,email,display_name,role,workspace_id,active)
    values(existing_id,lower(p_email),coalesce(nullif(p_display_name,''),split_part(p_email,'@',1)),p_role,wid,true)
    on conflict(user_id) do update set
      email=excluded.email,
      display_name=excluded.display_name,
      role=excluded.role,
      workspace_id=excluded.workspace_id,
      active=true;
  end if;
end;
$$;

create or replace function public.admin_set_beta_user_active(
  p_user_id uuid,
  p_active boolean
)
returns void
language plpgsql
security definer
set search_path=public
as $$
begin
  if public.current_beta_role()<>'Admin' then raise exception 'Admin access required'; end if;
  update public.beta_users set active=p_active where user_id=p_user_id;
end;
$$;

revoke all on function public.parent_create_athlete(text,text,text,text) from public,anon;
revoke all on function public.join_team_with_code(uuid,text) from public,anon;
revoke all on function public.coach_regenerate_team_invite(uuid) from public,anon;
revoke all on function public.admin_create_beta_invite(text,text,text) from public,anon;
revoke all on function public.admin_set_beta_user_active(uuid,boolean) from public,anon;

grant execute on function public.parent_create_athlete(text,text,text,text) to authenticated;
grant execute on function public.join_team_with_code(uuid,text) to authenticated;
grant execute on function public.coach_regenerate_team_invite(uuid) to authenticated;
grant execute on function public.admin_create_beta_invite(text,text,text) to authenticated;
grant execute on function public.admin_set_beta_user_active(uuid,boolean) to authenticated;

-- INITIAL ADMIN SETUP
--
-- 1) Create one Admin workspace:
-- insert into public.beta_workspaces(name) values ('Athlete Performance Admin') returning id;
--
-- 2) Approve your Admin email with that workspace id:
-- insert into public.beta_invites(email,display_name,role,workspace_id)
-- values ('YOUR_EMAIL@example.com','Admin','Admin','WORKSPACE_UUID_FROM_ABOVE');
--
-- 3) Create/sign in with that same email.
--
-- Normal beta workflow:
-- * Player signs up directly.
-- * Parent signs up directly and can add multiple players.
-- * Admin approves Coach accounts.
-- * Coach creates/selects Teams and shares Player Invite Codes.
-- * A Player enters the invite code, or a Parent selects one of their players and enters it.
-- * Parent always retains Parent-view access to every player linked to that Parent account.


-- Phase 72.3.6 API grants
grant usage on schema public to authenticated;

grant select on
  public.beta_users,
  public.beta_workspaces,
  public.athletes,
  public.parent_athletes,
  public.teams,
  public.team_members,
  public.workspace_state,
  public.beta_feedback
to authenticated;

grant insert,update on public.workspace_state to authenticated;
grant insert,update,delete on public.teams,public.team_members to authenticated;
grant insert on public.beta_feedback to authenticated;
grant usage,select on all sequences in schema public to authenticated;
