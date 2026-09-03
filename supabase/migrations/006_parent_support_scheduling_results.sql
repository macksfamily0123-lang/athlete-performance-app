-- Athlete Performance App — Phase 72.3.54
-- Parent Support: Workout Scheduling + Competition Results
--
-- Parent remains a support role. This RPC permits only two support-owned
-- top-level data areas for a linked athlete:
--   * workouts
--   * competitions
--
-- It does NOT grant Parent access to:
--   * Player goals / goal progress ownership
--   * Player Daily Check-In / Weekly Review ownership
--   * formal Coach Development Plan/Objectives
--   * Practice Observations
--   * Coach Weekly Reviews
--   * testing targets / Coach direction
--   * unrestricted workspace_state writes

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

  -- Parent may schedule workouts, but cannot rewrite Coach/Player/Admin
  -- workout records. Only incoming entries explicitly tagged Parent are merged.
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

  -- Parent may enter factual competition scores/results, but cannot rewrite
  -- Player/Coach/Admin competition records. Only Parent-tagged result entries
  -- are merged.
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

notify pgrst,'reload schema';
