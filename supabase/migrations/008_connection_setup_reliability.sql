-- Athlete Performance App — Phase 72.3.60 + 72.3.61
-- Connection & Account Setup Cleanup + Beta Reliability Hardening
--
-- Goals:
-- 1) Give Player, Parent, and Coach screens a safe relationship summary without
--    exposing private connection codes or another user's profile details.
-- 2) Prevent a Parent from accidentally creating the same managed Player twice.
-- 3) Preserve one canonical athlete/workspace. No automatic athlete merge.

-- -------------------------------------------------------------------
-- Parent duplicate guard.
-- Replaces the existing function with the same signature/return type and adds
-- a conservative same-Parent match check before creating a new athlete.
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
  normalized_sport text;
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

  normalized_sport:=coalesce(nullif(trim(p_sport),''),'Ice Hockey');

  -- Conservative duplicate protection only inside this Parent's own family.
  -- This does not search or reveal unrelated athletes.
  if exists(
    select 1
    from public.parent_athletes pa
    join public.athletes a on a.id=pa.athlete_id
    where pa.parent_user_id=auth.uid()
      and lower(regexp_replace(trim(a.display_name),'\s+',' ','g'))=
          lower(regexp_replace(trim(p_name),'\s+',' ','g'))
      and coalesce(a.age,-1)=p_age
      and lower(trim(coalesce(a.sport,'')))=lower(normalized_sport)
  ) then
    raise exception 'A matching Player is already connected to this Parent account. Open that Player instead of creating another record.';
  end if;

  insert into public.beta_workspaces(name)
  values(trim(p_name)||' athlete workspace')
  returning beta_workspaces.id into wid;

  insert into public.athletes(
    workspace_id,display_name,sport,position,team_name,age,
    account_management,player_claim_code,created_by
  )
  values(
    wid,trim(p_name),normalized_sport,
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
        'sport',normalized_sport
      ),
      'sport',normalized_sport
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
-- Parent connection summary for all Players linked to the signed-in Parent.
-- Counts only relationships; it does not expose another user's email/name or
-- any access/invite code.
-- -------------------------------------------------------------------
drop function if exists public.parent_connection_status();
create function public.parent_connection_status()
returns table(
  athlete_id uuid,
  display_name text,
  sport text,
  account_management text,
  player_login_connected boolean,
  parent_count bigint,
  coach_count bigint,
  team_count bigint
)
language plpgsql
security definer
set search_path=public
as $$
begin
  if public.current_beta_role()<>'Parent' then
    raise exception 'Parent account required';
  end if;

  return query
  select
    a.id,
    a.display_name,
    a.sport,
    a.account_management,
    (a.linked_user_id is not null),
    (select count(*) from public.parent_athletes pa2 where pa2.athlete_id=a.id),
    (select count(distinct t.coach_user_id)
       from public.team_members tm
       join public.teams t on t.id=tm.team_id
      where tm.athlete_id=a.id),
    (select count(distinct tm2.team_id)
       from public.team_members tm2
      where tm2.athlete_id=a.id)
  from public.athletes a
  join public.parent_athletes pa on pa.athlete_id=a.id
  where pa.parent_user_id=auth.uid()
  order by lower(a.display_name),a.created_at;
end;
$$;

-- -------------------------------------------------------------------
-- Player connection summary for the signed-in Player's canonical athlete.
-- -------------------------------------------------------------------
drop function if exists public.player_connection_status();
create function public.player_connection_status()
returns table(
  athlete_id uuid,
  display_name text,
  sport text,
  account_management text,
  player_login_connected boolean,
  parent_count bigint,
  coach_count bigint,
  team_count bigint
)
language plpgsql
security definer
set search_path=public
as $$
begin
  if public.current_beta_role()<>'Player' then
    raise exception 'Player account required';
  end if;

  return query
  select
    a.id,
    a.display_name,
    a.sport,
    a.account_management,
    true,
    (select count(*) from public.parent_athletes pa where pa.athlete_id=a.id),
    (select count(distinct t.coach_user_id)
       from public.team_members tm
       join public.teams t on t.id=tm.team_id
      where tm.athlete_id=a.id),
    (select count(distinct tm2.team_id)
       from public.team_members tm2
      where tm2.athlete_id=a.id)
  from public.athletes a
  where a.linked_user_id=auth.uid()
  limit 1;
end;
$$;

-- -------------------------------------------------------------------
-- Coach roster connection summary for one Team owned by the signed-in Coach.
-- This intentionally returns relationship counts, not Parent identities.
-- -------------------------------------------------------------------
drop function if exists public.coach_team_connection_status(uuid);
create function public.coach_team_connection_status(p_team_id uuid)
returns table(
  athlete_id uuid,
  display_name text,
  sport text,
  account_management text,
  player_login_connected boolean,
  parent_count bigint,
  coach_count bigint,
  team_count bigint
)
language plpgsql
security definer
set search_path=public
as $$
begin
  if public.current_beta_role()<>'Coach' then
    raise exception 'Coach account required';
  end if;
  if not exists(
    select 1 from public.teams t
    where t.id=p_team_id and t.coach_user_id=auth.uid()
  ) then
    raise exception 'You do not manage this team';
  end if;

  return query
  select
    a.id,
    a.display_name,
    a.sport,
    a.account_management,
    (a.linked_user_id is not null),
    (select count(*) from public.parent_athletes pa where pa.athlete_id=a.id),
    (select count(distinct t2.coach_user_id)
       from public.team_members tm2
       join public.teams t2 on t2.id=tm2.team_id
      where tm2.athlete_id=a.id),
    (select count(distinct tm3.team_id)
       from public.team_members tm3
      where tm3.athlete_id=a.id)
  from public.team_members tm
  join public.athletes a on a.id=tm.athlete_id
  where tm.team_id=p_team_id
  order by lower(a.display_name),a.created_at;
end;
$$;

revoke all on function public.parent_connection_status() from public,anon;
revoke all on function public.player_connection_status() from public,anon;
revoke all on function public.coach_team_connection_status(uuid) from public,anon;
revoke all on function public.parent_create_managed_athlete(text,text,integer,text,text) from public,anon;

grant execute on function public.parent_connection_status() to authenticated;
grant execute on function public.player_connection_status() to authenticated;
grant execute on function public.coach_team_connection_status(uuid) to authenticated;
grant execute on function public.parent_create_managed_athlete(text,text,integer,text,text) to authenticated;

notify pgrst,'reload schema';
