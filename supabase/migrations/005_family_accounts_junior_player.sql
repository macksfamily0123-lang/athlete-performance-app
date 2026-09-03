-- Athlete Performance App — Phase 72.3.53
-- Family Accounts + Junior Player Experience
--
-- Purpose:
-- 1) A Parent may create and account-manage a minor Player without requiring
--    the child to own a login.
-- 2) A Parent-managed Player can use a restricted Player experience while the
--    Parent remains authenticated.
-- 3) A Player may later claim the SAME athlete workspace with a Player login.
-- 4) Parent, Player, and Coach relationships continue to point to one athlete.
--
-- This migration does not change Coach ownership rules for formal development
-- plans, observations, or Coach Weekly Reviews.

alter table public.athletes
  add column if not exists age smallint;

alter table public.athletes
  add column if not exists account_management text not null default 'Player';

alter table public.athletes
  add column if not exists player_claim_code text;

do $$
begin
  if not exists(
    select 1 from pg_constraint
    where conname='athletes_account_management_check'
      and conrelid='public.athletes'::regclass
  ) then
    alter table public.athletes
      add constraint athletes_account_management_check
      check (account_management in ('Player','Parent'));
  end if;
end $$;

create unique index if not exists athletes_player_claim_code_unique
  on public.athletes(player_claim_code)
  where player_claim_code is not null;

-- Backfill age when older workspace_state already contains profile.age.
update public.athletes a
set age=(ws.data->'profile'->>'age')::smallint
from public.workspace_state ws
where ws.workspace_id=a.workspace_id
  and a.age is null
  and coalesce(ws.data->'profile'->>'age','') ~ '^[0-9]{1,2}$'
  and (ws.data->'profile'->>'age')::int between 6 and 99;

-- Older Parent-created athletes have no linked Player login. Mark them as
-- Parent-managed so they can use the new managed-Junior workflow.
update public.athletes a
set account_management='Parent'
where a.linked_user_id is null
  and exists(select 1 from public.parent_athletes pa where pa.athlete_id=a.id);

-- -------------------------------------------------------------------
-- Shared helper: generate a unique Player Access Code.
-- -------------------------------------------------------------------
create or replace function public.new_player_claim_code()
returns text
language plpgsql
security definer
set search_path=public
as $$
declare code text;
begin
  loop
    code:=upper(substr(encode(gen_random_bytes(8),'hex'),1,10));
    exit when not exists(select 1 from public.athletes where player_claim_code=code);
  end loop;
  return code;
end;
$$;

revoke all on function public.new_player_claim_code() from public,anon,authenticated;

-- -------------------------------------------------------------------
-- Parent creates a Player that remains Parent-managed.
-- -------------------------------------------------------------------
create or replace function public.parent_create_managed_athlete(
  p_name text,
  p_sport text,
  p_age integer,
  p_position text default '',
  p_team_name text default ''
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
  if p_age is null or p_age<6 or p_age>99 then
    raise exception 'Enter a valid Player age from 6 to 99';
  end if;

  insert into public.beta_workspaces(name)
  values(trim(p_name)||' athlete workspace')
  returning beta_workspaces.id into wid;

  insert into public.athletes(
    workspace_id,display_name,sport,position,team_name,age,
    account_management,player_claim_code,created_by
  )
  values(
    wid,trim(p_name),coalesce(nullif(trim(p_sport),''),'Ice Hockey'),
    coalesce(p_position,''),coalesce(p_team_name,''),p_age,
    'Parent',public.new_player_claim_code(),auth.uid()
  )
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
        'handedness','Right',
        'age',p_age::text,
        'sport',coalesce(nullif(trim(p_sport),''),'Ice Hockey')
      ),
      'sport',coalesce(nullif(trim(p_sport),''),'Ice Hockey')
    ),
    auth.uid()
  );

  return query
  select a.id,a.workspace_id,a.display_name,a.sport,a.position,a.team_name,
         a.age,a.account_management
  from public.athletes a where a.id=aid;
end;
$$;

-- -------------------------------------------------------------------
-- Parent requests/rotates the code used to give this same athlete a
-- Player login later.
-- -------------------------------------------------------------------
create or replace function public.parent_rotate_player_claim_code(
  p_athlete_id uuid
)
returns text
language plpgsql
security definer
set search_path=public
as $$
declare code text;
begin
  if public.current_beta_role()<>'Parent' then
    raise exception 'Parent account required';
  end if;
  if not public.can_parent_view_athlete(p_athlete_id) then
    raise exception 'This Player is not linked to your Parent account';
  end if;
  if exists(
    select 1 from public.athletes
    where id=p_athlete_id and linked_user_id is not null
  ) then
    raise exception 'This Player already has a Player login';
  end if;

  code:=public.new_player_claim_code();
  update public.athletes
  set player_claim_code=code,account_management='Parent'
  where id=p_athlete_id;
  return code;
end;
$$;

-- -------------------------------------------------------------------
-- Restricted save used only while a Parent is explicitly in a
-- Parent-managed Player session.
--
-- It can update Player-owned data. It deliberately preserves:
--   development (formal Coach Development Plan/Objectives)
--   coachNotes (Shared Notes use their own secure RPC)
--   Coach Weekly Reviews (separate secure table)
--   testTargets and other Coach-managed direction
--   Practice Observations / other Coach developmentSystem fields
-- -------------------------------------------------------------------
create or replace function public.parent_save_managed_player_state(
  p_athlete_id uuid,
  p_data jsonb
)
returns void
language plpgsql
security definer
set search_path=public
as $$
declare
  wid uuid;
  current_data jsonb;
  merged jsonb;
  incoming_dev jsonb;
  current_dev jsonb;
  incoming_profile jsonb;
  age_value integer;
begin
  if public.current_beta_role()<>'Parent' then
    raise exception 'Parent account required';
  end if;
  if not public.can_parent_view_athlete(p_athlete_id) then
    raise exception 'This Player is not linked to your Parent account';
  end if;

  select workspace_id into wid
  from public.athletes
  where id=p_athlete_id
    and account_management='Parent'
    and linked_user_id is null;

  if wid is null then
    raise exception 'This Player is no longer Parent-managed';
  end if;

  select coalesce(data,'{}'::jsonb) into current_data
  from public.workspace_state
  where workspace_id=wid;

  current_data:=coalesce(current_data,'{}'::jsonb);
  merged:=current_data;

  -- Player-owned top-level keys.
  if p_data ? 'profile' then merged:=jsonb_set(merged,'{profile}',p_data->'profile',true); end if;
  if p_data ? 'sport' then merged:=jsonb_set(merged,'{sport}',p_data->'sport',true); end if;
  if p_data ? 'goals' then merged:=jsonb_set(merged,'{goals}',p_data->'goals',true); end if;
  if p_data ? 'workouts' then merged:=jsonb_set(merged,'{workouts}',p_data->'workouts',true); end if;
  if p_data ? 'results' then merged:=jsonb_set(merged,'{results}',p_data->'results',true); end if;
  if p_data ? 'custom' then merged:=jsonb_set(merged,'{custom}',p_data->'custom',true); end if;
  if p_data ? 'readiness' then merged:=jsonb_set(merged,'{readiness}',p_data->'readiness',true); end if;
  if p_data ? 'competitions' then merged:=jsonb_set(merged,'{competitions}',p_data->'competitions',true); end if;
  if p_data ? 'weeklyReviews' then merged:=jsonb_set(merged,'{weeklyReviews}',p_data->'weeklyReviews',true); end if;
  if p_data ? 'reportNotes' then merged:=jsonb_set(merged,'{reportNotes}',p_data->'reportNotes',true); end if;
  if p_data ? 'milestones' then merged:=jsonb_set(merged,'{milestones}',p_data->'milestones',true); end if;
  if p_data ? 'seasonEvents' then merged:=jsonb_set(merged,'{seasonEvents}',p_data->'seasonEvents',true); end if;

  -- The Player owns reflections, but not Coach Practice Observations or
  -- formal development direction inside developmentSystem.
  if p_data ? 'developmentSystem' then
    incoming_dev:=coalesce(p_data->'developmentSystem','{}'::jsonb);
    current_dev:=coalesce(current_data->'developmentSystem','{}'::jsonb);
    if incoming_dev ? 'trainingReflections' then
      current_dev:=jsonb_set(
        current_dev,'{trainingReflections}',
        incoming_dev->'trainingReflections',true
      );
    end if;
    merged:=jsonb_set(merged,'{developmentSystem}',current_dev,true);
  end if;

  insert into public.workspace_state(workspace_id,data,updated_by,updated_at)
  values(wid,merged,auth.uid(),now())
  on conflict(workspace_id) do update set
    data=excluded.data,
    updated_by=excluded.updated_by,
    updated_at=excluded.updated_at;

  -- Keep athlete-directory identity fields synchronized when the Parent is
  -- managing the account. This does not grant the Parent Coach permissions.
  incoming_profile:=coalesce(p_data->'profile','{}'::jsonb);
  begin
    age_value:=nullif(incoming_profile->>'age','')::integer;
  exception when others then
    age_value:=null;
  end;

  update public.athletes
  set
    display_name=coalesce(nullif(trim(incoming_profile->>'name'),''),display_name),
    sport=coalesce(nullif(trim(coalesce(incoming_profile->>'sport',p_data->>'sport')),''),sport),
    position=coalesce(incoming_profile->>'position',position),
    team_name=coalesce(incoming_profile->>'team',team_name),
    age=case when age_value between 6 and 99 then age_value::smallint else age end
  where id=p_athlete_id;
end;
$$;

-- -------------------------------------------------------------------
-- Existing Player account can claim a Parent-created athlete only when
-- its automatically-created provisional athlete is still unused.
-- New signups should normally use the access code during signup instead.
-- -------------------------------------------------------------------
create or replace function public.player_claim_parent_managed_athlete(
  p_claim_code text
)
returns table(
  athlete_id uuid,
  workspace_id uuid,
  display_name text
)
language plpgsql
security definer
set search_path=public
as $$
declare
  target public.athletes%rowtype;
  provisional public.athletes%rowtype;
  provisional_data jsonb;
begin
  if public.current_beta_role()<>'Player' then
    raise exception 'Player account required';
  end if;

  select * into target
  from public.athletes
  where upper(player_claim_code)=upper(trim(p_claim_code))
    and account_management='Parent'
    and linked_user_id is null
  limit 1;

  if target.id is null then
    raise exception 'Invalid or expired Player Access Code';
  end if;

  select * into provisional
  from public.athletes
  where linked_user_id=auth.uid()
  limit 1;

  if provisional.id is not null and provisional.id<>target.id then
    if exists(select 1 from public.team_members where athlete_id=provisional.id)
       or exists(select 1 from public.parent_athletes where athlete_id=provisional.id) then
      raise exception 'This Player account already has connected athlete data. Ask Admin to merge the records.';
    end if;

    select coalesce(data,'{}'::jsonb) into provisional_data
    from public.workspace_state
    where workspace_id=provisional.workspace_id;

    -- A fresh self-signup contains only its initial profile.
    if provisional_data is not null
       and (provisional_data - 'profile' - 'sport') <> '{}'::jsonb then
      raise exception 'This Player account already contains development data. Ask Admin to merge the records.';
    end if;
  end if;

  update public.athletes
  set linked_user_id=auth.uid(),
      account_management='Player',
      player_claim_code=null
  where id=target.id;

  update public.beta_users
  set workspace_id=target.workspace_id,
      display_name=target.display_name
  where user_id=auth.uid();

  if provisional.id is not null and provisional.id<>target.id then
    delete from public.beta_workspaces where id=provisional.workspace_id;
  end if;

  return query select target.id,target.workspace_id,target.display_name;
end;
$$;

-- -------------------------------------------------------------------
-- Signup trigger v72.3.53
-- Optional Player Access Code claims a Parent-created athlete during
-- account creation, preventing a duplicate athlete workspace.
-- -------------------------------------------------------------------
create or replace function public.handle_beta_signup()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  inv public.beta_invites%rowtype;
  requested text;
  requested_claim text;
  claim_target public.athletes%rowtype;
  new_workspace uuid;
  chosen_role text;
  chosen_name text;
begin
  requested:=coalesce(new.raw_user_meta_data->>'requested_role','');
  requested_claim:=upper(trim(coalesce(new.raw_user_meta_data->>'player_claim_code','')));
  chosen_name:=coalesce(nullif(new.raw_user_meta_data->>'display_name',''),split_part(new.email,'@',1));

  if requested='Player' and requested_claim<>'' then
    select * into claim_target
    from public.athletes
    where upper(player_claim_code)=requested_claim
      and account_management='Parent'
      and linked_user_id is null
    limit 1;

    if claim_target.id is null then
      raise exception 'Invalid or expired Player Access Code';
    end if;
  end if;

  select * into inv from public.beta_invites
  where lower(email)=lower(new.email) and active=true
  limit 1;

  -- Privileged Coach/Admin invitations always win over self-signup metadata.
  if inv.email is not null and inv.role in ('Coach','Admin') then
    chosen_role:=inv.role;
    if inv.workspace_id is null then
      insert into public.beta_workspaces(name)
      values(chosen_name||' workspace')
      returning id into new_workspace;
    else
      new_workspace:=inv.workspace_id;
    end if;
  elsif claim_target.id is not null then
    chosen_role:='Player';
    chosen_name:=claim_target.display_name;
    new_workspace:=claim_target.workspace_id;
  elsif inv.email is not null then
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

  if chosen_role='Player' and claim_target.id is not null then
    update public.athletes
    set linked_user_id=new.id,
        account_management='Player',
        player_claim_code=null
    where id=claim_target.id;

  elsif chosen_role='Player' then
    insert into public.athletes(
      workspace_id,display_name,linked_user_id,account_management,created_by
    )
    values(new_workspace,chosen_name,new.id,'Player',new.id)
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

-- Grants.
revoke all on function public.parent_create_managed_athlete(text,text,integer,text,text) from public,anon;
revoke all on function public.parent_rotate_player_claim_code(uuid) from public,anon;
revoke all on function public.parent_save_managed_player_state(uuid,jsonb) from public,anon;
revoke all on function public.player_claim_parent_managed_athlete(text) from public,anon;

grant execute on function public.parent_create_managed_athlete(text,text,integer,text,text) to authenticated;
grant execute on function public.parent_rotate_player_claim_code(uuid) to authenticated;
grant execute on function public.parent_save_managed_player_state(uuid,jsonb) to authenticated;
grant execute on function public.player_claim_parent_managed_athlete(text) to authenticated;

notify pgrst,'reload schema';
