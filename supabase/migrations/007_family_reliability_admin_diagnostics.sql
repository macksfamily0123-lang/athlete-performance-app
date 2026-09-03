-- Athlete Performance App — Phase 72.3.57
-- Family Account Reliability + Admin Diagnostics
--
-- Goals:
-- 1) Parent-created Player -> later Player login stays on the SAME athlete record.
--    (The v72.3.53 Player Access Code flow remains intact.)
-- 2) Player-created Player -> later Parent connection can also link to the SAME
--    athlete record, without duplicating the athlete.
-- 3) Admin can inspect family/account connections and use only conservative,
--    non-merging repair actions.
--
-- This migration deliberately does NOT implement an automatic athlete-data merge.
-- Any athlete with meaningful duplicate data still requires explicit Admin review.

alter table public.athletes
  add column if not exists parent_link_code text;

create unique index if not exists athletes_parent_link_code_unique
  on public.athletes(parent_link_code)
  where parent_link_code is not null;

-- -------------------------------------------------------------------
-- Compatibility: retain/install the Phase 72.3.54 Parent support save RPC.
-- This makes migration 007 safe to use as the only NEW migration for the
-- combined 72.3.57 download even if migration 006 was not applied earlier.
-- It still requires the Phase 72.3.53 family foundation (migration 005),
-- which is already required for Junior Player / Parent-managed accounts.
-- -------------------------------------------------------------------
create or replace function public.parent_save_support_data(
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
  current_workouts jsonb;
  incoming_parent_workouts jsonb;
  preserved_non_parent_workouts jsonb;
  current_competitions jsonb;
  incoming_parent_competitions jsonb;
  preserved_non_parent_competitions jsonb;
begin
  if public.current_beta_role()<>'Parent' then
    raise exception 'Parent account required';
  end if;

  if not public.can_parent_view_athlete(p_athlete_id) then
    raise exception 'This Player is not linked to your Parent account';
  end if;

  select workspace_id into wid
  from public.athletes
  where id=p_athlete_id;

  if wid is null then
    raise exception 'Player workspace not found';
  end if;

  select coalesce(data,'{}'::jsonb) into current_data
  from public.workspace_state
  where workspace_id=wid;

  current_data:=coalesce(current_data,'{}'::jsonb);
  merged:=current_data;

  if p_data ? 'workouts' then
    current_workouts:=coalesce(current_data->'workouts','[]'::jsonb);

    select coalesce(jsonb_agg(value),'[]'::jsonb)
      into preserved_non_parent_workouts
    from jsonb_array_elements(current_workouts)
    where coalesce(value->>'assignedByRole','')<>'Parent';

    select coalesce(jsonb_agg(value),'[]'::jsonb)
      into incoming_parent_workouts
    from jsonb_array_elements(coalesce(p_data->'workouts','[]'::jsonb))
    where value->>'assignedByRole'='Parent';

    merged:=jsonb_set(
      merged,
      '{workouts}',
      preserved_non_parent_workouts || incoming_parent_workouts,
      true
    );
  end if;

  if p_data ? 'competitions' then
    current_competitions:=coalesce(current_data->'competitions','[]'::jsonb);

    select coalesce(jsonb_agg(value),'[]'::jsonb)
      into preserved_non_parent_competitions
    from jsonb_array_elements(current_competitions)
    where coalesce(value->>'enteredByRole','')<>'Parent';

    select coalesce(jsonb_agg(value),'[]'::jsonb)
      into incoming_parent_competitions
    from jsonb_array_elements(coalesce(p_data->'competitions','[]'::jsonb))
    where value->>'enteredByRole'='Parent'
      and coalesce(value->>'entryKind','')='Score';

    merged:=jsonb_set(
      merged,
      '{competitions}',
      preserved_non_parent_competitions || incoming_parent_competitions,
      true
    );
  end if;

  insert into public.workspace_state(workspace_id,data,updated_by,updated_at)
  values(wid,merged,auth.uid(),now())
  on conflict(workspace_id) do update set
    data=excluded.data,
    updated_by=excluded.updated_by,
    updated_at=excluded.updated_at;
end;
$$;

revoke all on function public.parent_save_support_data(uuid,jsonb) from public,anon;
grant execute on function public.parent_save_support_data(uuid,jsonb) to authenticated;

-- -------------------------------------------------------------------
-- Private helper for Parent Connection Codes.
-- -------------------------------------------------------------------
create or replace function public.new_parent_link_code()
returns text
language plpgsql
security definer
set search_path=public
as $$
declare code text;
begin
  loop
    code:=upper(substr(encode(gen_random_bytes(8),'hex'),1,10));
    exit when not exists(select 1 from public.athletes where parent_link_code=code);
  end loop;
  return code;
end;
$$;

revoke all on function public.new_parent_link_code() from public,anon,authenticated;

-- -------------------------------------------------------------------
-- Player creates / rotates a Parent Connection Code.
-- This does not change Player ownership.
-- -------------------------------------------------------------------
create or replace function public.player_rotate_parent_link_code()
returns text
language plpgsql
security definer
set search_path=public
as $$
declare
  aid uuid;
  code text;
begin
  if public.current_beta_role()<>'Player' then
    raise exception 'Player account required';
  end if;

  select id into aid
  from public.athletes
  where linked_user_id=auth.uid()
  limit 1;

  if aid is null then
    raise exception 'Player athlete record not found';
  end if;

  code:=public.new_parent_link_code();

  update public.athletes
  set parent_link_code=code
  where id=aid;

  return code;
end;
$$;

-- -------------------------------------------------------------------
-- Parent links to an existing Player-owned athlete using the Player's code.
-- This creates ONLY the Parent relationship. It never changes Player ownership,
-- workspace identity, Coach/team relationships, or development data.
-- -------------------------------------------------------------------
create or replace function public.parent_link_existing_player(
  p_parent_link_code text
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
begin
  if public.current_beta_role()<>'Parent' then
    raise exception 'Parent account required';
  end if;

  select * into target
  from public.athletes
  where upper(parent_link_code)=upper(trim(p_parent_link_code))
    and linked_user_id is not null
    and account_management='Player'
  limit 1;

  if target.id is null then
    raise exception 'Invalid or expired Parent Connection Code';
  end if;

  insert into public.parent_athletes(parent_user_id,athlete_id)
  values(auth.uid(),target.id)
  on conflict do nothing;

  -- Rotate/expire the one-time code after a successful family link.
  update public.athletes
  set parent_link_code=null
  where id=target.id;

  return query
  select target.id,target.workspace_id,target.display_name;
end;
$$;

-- -------------------------------------------------------------------
-- Admin family/account diagnostic report.
-- One row per athlete. It reports relationship/account consistency but never
-- exposes Player Access Codes or Parent Connection Codes themselves.
-- -------------------------------------------------------------------
drop function if exists public.admin_family_diagnostics();

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

    if a.account_management='Player' and a.linked_user_id is null then
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
    account_management:=a.account_management;
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

-- -------------------------------------------------------------------
-- Conservative Admin repair operations.
--
-- No action here attaches an arbitrary user, removes a Parent, removes a Coach,
-- deletes an athlete, or merges two athlete records.
-- -------------------------------------------------------------------
create or replace function public.admin_repair_family_account(
  p_athlete_id uuid,
  p_action text
)
returns text
language plpgsql
security definer
set search_path=public
as $$
declare
  a public.athletes%rowtype;
  bu public.beta_users%rowtype;
  new_code text;
begin
  if public.current_beta_role()<>'Admin' then
    raise exception 'Admin account required';
  end if;

  select * into a
  from public.athletes
  where id=p_athlete_id;

  if a.id is null then
    raise exception 'Athlete not found';
  end if;

  if p_action='clear_stale_player_code' then
    if a.linked_user_id is null then
      raise exception 'No linked Player login; code was not cleared';
    end if;
    update public.athletes set player_claim_code=null where id=a.id;
    return 'Stale Player Access Code cleared';

  elsif p_action='sync_player_workspace' then
    if a.linked_user_id is null then
      raise exception 'No linked Player login to synchronize';
    end if;

    select * into bu
    from public.beta_users
    where user_id=a.linked_user_id
    limit 1;

    if bu.user_id is null or bu.role<>'Player' then
      raise exception 'Linked user is not a valid Player account';
    end if;

    update public.beta_users
    set workspace_id=a.workspace_id,
        display_name=a.display_name
    where user_id=a.linked_user_id;

    update public.athletes
    set account_management='Player',
        player_claim_code=null
    where id=a.id;

    return 'Player login synchronized to the athlete workspace';

  elsif p_action='set_parent_managed' then
    if a.linked_user_id is not null then
      raise exception 'Cannot mark Parent-managed while a Player login is linked';
    end if;

    if not exists(
      select 1 from public.parent_athletes pa
      where pa.athlete_id=a.id
    ) then
      raise exception 'No Parent relationship exists for this athlete';
    end if;

    new_code:=coalesce(a.player_claim_code,public.new_player_claim_code());

    update public.athletes
    set account_management='Parent',
        player_claim_code=new_code,
        parent_link_code=null
    where id=a.id;

    return 'Athlete marked Parent-managed and Player Access is ready';

  elsif p_action='set_player_managed' then
    if a.linked_user_id is null then
      raise exception 'No Player login is linked';
    end if;

    select * into bu
    from public.beta_users
    where user_id=a.linked_user_id
    limit 1;

    if bu.user_id is null or bu.role<>'Player' then
      raise exception 'Linked user is not a valid Player account';
    end if;

    update public.athletes
    set account_management='Player',
        player_claim_code=null
    where id=a.id;

    return 'Athlete marked Player-managed';

  elsif p_action='regenerate_player_access' then
    if a.linked_user_id is not null then
      raise exception 'Player already has a login; Player Access Code is not needed';
    end if;

    if not exists(
      select 1 from public.parent_athletes pa
      where pa.athlete_id=a.id
    ) then
      raise exception 'A linked Parent is required before generating Player Access';
    end if;

    new_code:=public.new_player_claim_code();

    update public.athletes
    set account_management='Parent',
        player_claim_code=new_code
    where id=a.id;

    return 'New Player Access Code generated. The linked Parent can retrieve/rotate it from My Players';

  elsif p_action='ensure_workspace_state' then
    insert into public.workspace_state(workspace_id,data,updated_by,updated_at)
    values(
      a.workspace_id,
      jsonb_build_object(
        'profile',jsonb_build_object(
          'name',a.display_name,
          'position',coalesce(a.position,''),
          'team',coalesce(a.team_name,''),
          'season','2026-27',
          'height','',
          'weight','',
          'handedness','Right',
          'age',coalesce(a.age::text,''),
          'sport',coalesce(nullif(a.sport,''),'Ice Hockey')
        ),
        'sport',coalesce(nullif(a.sport,''),'Ice Hockey')
      ),
      auth.uid(),
      now()
    )
    on conflict(workspace_id) do nothing;

    return 'Workspace state exists';

  else
    raise exception 'Unsupported repair action';
  end if;
end;
$$;

revoke all on function public.player_rotate_parent_link_code() from public,anon;
revoke all on function public.parent_link_existing_player(text) from public,anon;
revoke all on function public.admin_family_diagnostics() from public,anon;
revoke all on function public.admin_repair_family_account(uuid,text) from public,anon;

grant execute on function public.player_rotate_parent_link_code() to authenticated;
grant execute on function public.parent_link_existing_player(text) to authenticated;
grant execute on function public.admin_family_diagnostics() to authenticated;
grant execute on function public.admin_repair_family_account(uuid,text) to authenticated;

notify pgrst,'reload schema';
