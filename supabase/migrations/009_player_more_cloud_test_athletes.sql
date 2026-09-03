-- Athlete Performance App — Phase 72.3.62
-- Player More Navigation + Cloud-Persistent Admin Test Athletes
--
-- Purpose:
-- 1) Admin-created beta test athletes persist in Supabase across Codespaces,
--    browsers, devices, and app updates.
-- 2) Test athletes are explicitly marked so Family diagnostics do not treat
--    the intentional absence of a Player login as an account error.
--
-- This does not merge or convert existing local-only test profiles.
-- Existing local browser data remains local to the browser/Codespace origin.

alter table public.athletes
  add column if not exists beta_test boolean not null default false;

-- -------------------------------------------------------------------
-- Admin creates a cloud-persistent test athlete.
-- No Player login, Parent, or Coach is automatically connected.
-- -------------------------------------------------------------------
create or replace function public.admin_create_test_athlete(
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
  athlete_age smallint
)
language plpgsql
security definer
set search_path=public
as $$
declare
  wid uuid;
  aid uuid;
  clean_name text;
  clean_sport text;
begin
  if public.current_beta_role()<>'Admin' then
    raise exception 'Admin account required';
  end if;

  clean_name:=trim(coalesce(p_name,''));
  clean_sport:=coalesce(nullif(trim(coalesce(p_sport,'')),''),'Ice Hockey');

  if length(clean_name)<1 then
    raise exception 'Player name is required';
  end if;

  if p_age is null or p_age<6 or p_age>99 then
    raise exception 'Enter a valid Player age from 6 to 99';
  end if;

  if exists(
    select 1
    from public.athletes a
    where coalesce(a.beta_test,false)=true
      and lower(trim(a.display_name))=lower(clean_name)
      and coalesce(a.age,0)=p_age
      and a.sport=clean_sport
  ) then
    raise exception 'Admin test athlete already exists';
  end if;

  insert into public.beta_workspaces(name)
  values(clean_name||' admin test workspace')
  returning beta_workspaces.id into wid;

  insert into public.athletes(
    workspace_id,display_name,sport,position,team_name,age,
    account_management,player_claim_code,parent_link_code,
    linked_user_id,created_by,beta_test
  )
  values(
    wid,clean_name,clean_sport,
    coalesce(p_position,''),coalesce(p_team_name,''),p_age,
    'Player',null,null,
    null,auth.uid(),true
  )
  returning athletes.id into aid;

  insert into public.workspace_state(workspace_id,data,updated_by)
  values(
    wid,
    jsonb_build_object(
      'profile',jsonb_build_object(
        'name',clean_name,
        'position',coalesce(p_position,''),
        'team',coalesce(p_team_name,''),
        'season','2026-27',
        'height','',
        'weight','',
        'handedness','Right',
        'age',p_age::text,
        'sport',clean_sport
      ),
      'sport',clean_sport
    ),
    auth.uid()
  );

  return query
  select a.id,a.workspace_id,a.display_name,a.sport,a.position,a.team_name,a.age
  from public.athletes a
  where a.id=aid;
end;
$$;

revoke all on function public.admin_create_test_athlete(text,text,integer,text,text) from public,anon;
grant execute on function public.admin_create_test_athlete(text,text,integer,text,text) to authenticated;

-- -------------------------------------------------------------------
-- Family diagnostics: Admin test athletes are intentional cloud records.
-- They are healthy without a Player login, Parent, or Coach connection.
-- -------------------------------------------------------------------
create or replace function public.admin_family_diagnostics()
returns table(
  athlete_id uuid,
  workspace_id uuid,
  display_name text,
  sport text,
  athlete_age smallint,
  account_management text,
  linked_user_id uuid,
  player_email text,
  player_display_name text,
  parent_count bigint,
  coach_count bigint,
  team_count bigint,
  has_workspace_state boolean,
  player_workspace_matches boolean,
  player_claim_code_active boolean,
  parent_link_code_active boolean,
  issue_count integer,
  issues text[]
)
language plpgsql
security definer
set search_path=public
as $$
declare
  a public.athletes%rowtype;
  bu public.beta_users%rowtype;
  parents bigint;
  coaches bigint;
  teams bigint;
  has_state boolean;
  ws_match boolean;
  issue_list text[];
  athlete_workspace_count bigint;
begin
  if public.current_beta_role()<>'Admin' then
    raise exception 'Admin account required';
  end if;

  for a in
    select athlete_row.*
    from public.athletes athlete_row
    order by lower(athlete_row.display_name),athlete_row.created_at
  loop
    bu:=null;

    if a.linked_user_id is not null then
      select * into bu
      from public.beta_users
      where user_id=a.linked_user_id
      limit 1;
    end if;

    select count(*) into parents
    from public.parent_athletes pa
    where pa.athlete_id=a.id;

    select count(distinct t.coach_user_id),count(distinct tm.team_id)
      into coaches,teams
    from public.team_members tm
    join public.teams t on t.id=tm.team_id
    where tm.athlete_id=a.id;

    select exists(
      select 1 from public.workspace_state ws
      where ws.workspace_id=a.workspace_id
    ) into has_state;

    select count(*) into athlete_workspace_count
    from public.athletes x
    where x.workspace_id=a.workspace_id;

    ws_match:=(
      a.linked_user_id is not null
      and bu.user_id is not null
      and bu.workspace_id=a.workspace_id
    );

    issue_list:=array[]::text[];

    if a.account_management='Parent' and a.linked_user_id is not null then
      issue_list:=array_append(issue_list,'Parent-managed athlete has a linked Player login');
    end if;

    if not coalesce(a.beta_test,false) and a.account_management='Player' and a.linked_user_id is null then
      issue_list:=array_append(issue_list,'Player-managed athlete has no linked Player login');
    end if;

    if a.account_management='Parent' and parents=0 then
      issue_list:=array_append(issue_list,'Parent-managed athlete has no linked Parent');
    end if;

    if a.linked_user_id is not null and bu.user_id is null then
      issue_list:=array_append(issue_list,'Linked Player login is missing from beta_users');
    elsif bu.user_id is not null and bu.role<>'Player' then
      issue_list:=array_append(issue_list,'Linked user is not a Player account');
    end if;

    if a.linked_user_id is not null and bu.user_id is not null and not ws_match then
      issue_list:=array_append(issue_list,'Player login points to a different workspace');
    end if;

    if a.linked_user_id is not null and a.player_claim_code is not null then
      issue_list:=array_append(issue_list,'Stale Player Access Code remains after login link');
    end if;

    if a.linked_user_id is null and a.parent_link_code is not null then
      issue_list:=array_append(issue_list,'Parent Connection Code exists without a Player login');
    end if;

    if not has_state then
      issue_list:=array_append(issue_list,'Athlete workspace has no workspace_state row');
    end if;

    if athlete_workspace_count>1 then
      issue_list:=array_append(issue_list,'Multiple athlete records share this workspace — manual review required');
    end if;

    athlete_id:=a.id;
    workspace_id:=a.workspace_id;
    display_name:=a.display_name;
    sport:=a.sport;
    athlete_age:=a.age;
    account_management:=case when coalesce(a.beta_test,false) then 'Admin Test' else a.account_management end;
    linked_user_id:=a.linked_user_id;
    player_email:=case when bu.user_id is null then null else bu.email end;
    player_display_name:=case when bu.user_id is null then null else bu.display_name end;
    parent_count:=parents;
    coach_count:=coaches;
    team_count:=teams;
    has_workspace_state:=has_state;
    player_workspace_matches:=ws_match;
    player_claim_code_active:=a.player_claim_code is not null;
    parent_link_code_active:=a.parent_link_code is not null;
    issue_count:=coalesce(array_length(issue_list,1),0);
    issues:=issue_list;

    return next;
  end loop;
end;
$$;

revoke all on function public.admin_family_diagnostics() from public,anon;
grant execute on function public.admin_family_diagnostics() to authenticated;

notify pgrst,'reload schema';
