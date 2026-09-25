-- Elite Performance · Phase 72.3.116 RC66
-- Adds Combat Sports (with discipline stored in the existing position field),
-- Tennis, and Volleyball without changing athlete/team/family relationships.

alter table public.athlete_sport_profiles
  drop constraint if exists athlete_sport_profiles_sport_check;

alter table public.athlete_sport_profiles
  add constraint athlete_sport_profiles_sport_check
  check (sport in (
    'Baseball','Football','Ice Hockey','Basketball','Lacrosse','Wrestling',
    'Soccer','Figure Skating','Combat Sports','Tennis','Volleyball'
  ));

create or replace function public.athlete_upsert_sport_profile(
  p_athlete_id uuid,
  p_sport text,
  p_position text default '',
  p_make_primary boolean default false
)
returns text
language plpgsql
security definer
set search_path=public
as $$
declare
  normalized_sport text:=trim(coalesce(p_sport,''));
  should_be_primary boolean;
begin
  if not public.can_manage_athlete_sports(p_athlete_id) then
    raise exception 'You do not have permission to manage this Player';
  end if;
  if normalized_sport not in (
    'Baseball','Football','Ice Hockey','Basketball','Lacrosse','Wrestling',
    'Soccer','Figure Skating','Combat Sports','Tennis','Volleyball'
  ) then
    raise exception 'Choose a supported sport';
  end if;

  should_be_primary:=p_make_primary or not exists(
    select 1 from public.athlete_sport_profiles where athlete_id=p_athlete_id
  );
  if should_be_primary then
    update public.athlete_sport_profiles set is_primary=false,updated_at=now()
    where athlete_id=p_athlete_id;
  end if;

  insert into public.athlete_sport_profiles(athlete_id,sport,position,is_primary)
  values(p_athlete_id,normalized_sport,trim(coalesce(p_position,'')),should_be_primary)
  on conflict(athlete_id,sport) do update
  set position=excluded.position,
      is_primary=case when should_be_primary then true else public.athlete_sport_profiles.is_primary end,
      updated_at=now();

  if should_be_primary then
    update public.athletes a
    set sport=normalized_sport,
        position=trim(coalesce(p_position,'')),
        team_name=coalesce((
          select t.name from public.athlete_sport_profiles asp
          join public.teams t on t.id=asp.primary_team_id
          where asp.athlete_id=p_athlete_id and asp.sport=normalized_sport
        ),'')
    where a.id=p_athlete_id;
  end if;
  return normalized_sport;
end;
$$;

revoke all on function public.athlete_upsert_sport_profile(uuid,text,text,boolean) from public,anon;
grant execute on function public.athlete_upsert_sport_profile(uuid,text,text,boolean) to authenticated;
