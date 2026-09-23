-- Athlete Performance · Phase 72.3.111 RC61
-- Multi-sport Player profiles, sport-specific team selection, and preserved
-- many-to-many Parent relationships.

create table if not exists public.athlete_sport_profiles (
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  sport text not null,
  position text not null default '',
  is_primary boolean not null default false,
  primary_team_id uuid references public.teams(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (athlete_id,sport),
  check (sport in ('Baseball','Football','Ice Hockey','Basketball','Lacrosse','Wrestling','Soccer','Figure Skating'))
);

create unique index if not exists athlete_one_primary_sport
  on public.athlete_sport_profiles(athlete_id)
  where is_primary;

insert into public.athlete_sport_profiles(athlete_id,sport,position,is_primary)
select a.id,a.sport,a.position,true
from public.athletes a
on conflict(athlete_id,sport) do update
set position=case
  when trim(public.athlete_sport_profiles.position)='' then excluded.position
  else public.athlete_sport_profiles.position
end;

update public.athlete_sport_profiles asp
set primary_team_id=(
      select tm.team_id
      from public.team_members tm
      join public.teams t on t.id=tm.team_id
      join public.athletes a on a.id=asp.athlete_id
      where tm.athlete_id=asp.athlete_id and t.sport=asp.sport
      order by case when t.name=a.team_name then 0 else 1 end,tm.created_at
      limit 1
    ),
    updated_at=now()
where asp.primary_team_id is null
  and exists(
    select 1 from public.team_members tm
    join public.teams t on t.id=tm.team_id
    where tm.athlete_id=asp.athlete_id and t.sport=asp.sport
  );

alter table public.athlete_sport_profiles enable row level security;

drop policy if exists "authorized users read athlete sport profiles" on public.athlete_sport_profiles;
create policy "authorized users read athlete sport profiles"
on public.athlete_sport_profiles for select to authenticated
using (
  public.current_beta_role()='Admin'
  or exists(select 1 from public.athletes a where a.id=athlete_id and a.linked_user_id=auth.uid())
  or public.can_parent_view_athlete(athlete_id)
  or public.can_coach_view_athlete(athlete_id)
);

revoke all on public.athlete_sport_profiles from public,anon;
grant select on public.athlete_sport_profiles to authenticated;

create or replace function public.can_manage_athlete_sports(p_athlete_id uuid)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select public.current_beta_role()='Admin'
    or exists(
      select 1 from public.athletes a
      where a.id=p_athlete_id and a.linked_user_id=auth.uid()
    )
    or (
      public.current_beta_role()='Parent'
      and public.can_parent_view_athlete(p_athlete_id)
    );
$$;

create or replace function public.athlete_sport_profile_list(p_athlete_id uuid)
returns table(
  sport text,
  athlete_position text,
  is_primary boolean,
  primary_team_id uuid,
  primary_team_name text,
  teams jsonb
)
language plpgsql
stable
security definer
set search_path=public
as $$
begin
  if not (
    public.current_beta_role()='Admin'
    or exists(select 1 from public.athletes a where a.id=p_athlete_id and a.linked_user_id=auth.uid())
    or public.can_parent_view_athlete(p_athlete_id)
    or public.can_coach_view_athlete(p_athlete_id)
  ) then
    raise exception 'You do not have permission to view this Player';
  end if;

  return query
  select asp.sport,
         asp.position,
         asp.is_primary,
         asp.primary_team_id,
         pt.name,
         coalesce((
           select jsonb_agg(jsonb_build_object(
             'team_id',t.id,
             'team_name',t.name,
             'sport',t.sport,
             'coach_name',coalesce(c.display_name,c.email,'Coach'),
             'joined_at',tm.created_at,
             'is_primary',tm.team_id=asp.primary_team_id
           ) order by (tm.team_id=asp.primary_team_id) desc,t.name)
           from public.team_members tm
           join public.teams t on t.id=tm.team_id
           join public.beta_users c on c.user_id=t.coach_user_id
           where tm.athlete_id=asp.athlete_id and t.sport=asp.sport
         ),'[]'::jsonb)
  from public.athlete_sport_profiles asp
  left join public.teams pt on pt.id=asp.primary_team_id
  where asp.athlete_id=p_athlete_id
  order by asp.is_primary desc,asp.created_at,asp.sport;
end;
$$;

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
  if normalized_sport not in ('Baseball','Football','Ice Hockey','Basketball','Lacrosse','Wrestling','Soccer','Figure Skating') then
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

create or replace function public.athlete_set_primary_sport(
  p_athlete_id uuid,
  p_sport text
)
returns text
language plpgsql
security definer
set search_path=public
as $$
declare
  selected public.athlete_sport_profiles%rowtype;
  team_name_value text:='';
begin
  if not public.can_manage_athlete_sports(p_athlete_id) then
    raise exception 'You do not have permission to manage this Player';
  end if;
  select * into selected from public.athlete_sport_profiles
  where athlete_id=p_athlete_id and sport=trim(p_sport);
  if selected.athlete_id is null then raise exception 'Sport profile not found'; end if;
  if selected.primary_team_id is not null then
    select name into team_name_value from public.teams where id=selected.primary_team_id;
  end if;
  update public.athlete_sport_profiles set is_primary=(sport=selected.sport),updated_at=now()
  where athlete_id=p_athlete_id;
  update public.athletes
  set sport=selected.sport,position=selected.position,team_name=coalesce(team_name_value,'')
  where id=p_athlete_id;
  return selected.sport;
end;
$$;

create or replace function public.athlete_set_primary_team(
  p_athlete_id uuid,
  p_team_id uuid
)
returns text
language plpgsql
security definer
set search_path=public
as $$
declare
  selected_team public.teams%rowtype;
  sport_is_primary boolean;
begin
  if not public.can_manage_athlete_sports(p_athlete_id) then
    raise exception 'You do not have permission to manage this Player';
  end if;
  select t.* into selected_team
  from public.teams t
  join public.team_members tm on tm.team_id=t.id
  where tm.athlete_id=p_athlete_id and t.id=p_team_id;
  if selected_team.id is null then raise exception 'Player is not connected to this team'; end if;

  insert into public.athlete_sport_profiles(athlete_id,sport,is_primary,primary_team_id)
  values(p_athlete_id,selected_team.sport,false,selected_team.id)
  on conflict(athlete_id,sport) do update
  set primary_team_id=excluded.primary_team_id,updated_at=now();

  select is_primary into sport_is_primary from public.athlete_sport_profiles
  where athlete_id=p_athlete_id and sport=selected_team.sport;
  if sport_is_primary then
    update public.athletes set team_name=selected_team.name where id=p_athlete_id;
  end if;
  return selected_team.name;
end;
$$;

create or replace function public.athlete_leave_team(
  p_athlete_id uuid,
  p_team_id uuid
)
returns boolean
language plpgsql
security definer
set search_path=public
as $$
declare
  was_primary boolean;
  team_sport text;
  membership_removed boolean:=false;
begin
  if not public.can_manage_athlete_sports(p_athlete_id) then
    raise exception 'You do not have permission to manage this Player';
  end if;
  select asp.primary_team_id=p_team_id,t.sport into was_primary,team_sport
  from public.teams t
  left join public.athlete_sport_profiles asp
    on asp.athlete_id=p_athlete_id and asp.sport=t.sport
  where t.id=p_team_id;
  delete from public.team_members where athlete_id=p_athlete_id and team_id=p_team_id;
  membership_removed:=found;
  if was_primary then
    update public.athlete_sport_profiles set primary_team_id=null,updated_at=now()
    where athlete_id=p_athlete_id and sport=team_sport;
    update public.athletes a set team_name=''
    where a.id=p_athlete_id and a.sport=team_sport;
  end if;
  return membership_removed;
end;
$$;

-- Preserve the privacy consent added in migration 013 while making every team
-- join sport-aware. Joining another team no longer replaces an unrelated
-- sport's primary team.
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
  selected_team public.teams%rowtype;
  allowed boolean:=false;
  profile_exists boolean;
begin
  select t.* into selected_team
  from public.teams t
  join public.beta_users c on c.user_id=t.coach_user_id
  where upper(t.invite_code)=upper(trim(p_invite_code))
    and c.role='Coach' and c.active=true
  limit 1;
  if selected_team.id is null then raise exception 'Invalid team invite code'; end if;

  if public.current_beta_role()='Player' then
    allowed:=exists(select 1 from public.athletes a where a.id=p_athlete_id and a.linked_user_id=auth.uid());
  elsif public.current_beta_role()='Parent' then
    allowed:=public.can_parent_view_athlete(p_athlete_id);
  end if;
  if not allowed then raise exception 'You do not have permission to join this player to a team'; end if;

  insert into public.team_members(team_id,athlete_id)
  values(selected_team.id,p_athlete_id)
  on conflict(team_id,athlete_id) do nothing;

  select exists(select 1 from public.athlete_sport_profiles where athlete_id=p_athlete_id)
  into profile_exists;
  insert into public.athlete_sport_profiles(athlete_id,sport,is_primary,primary_team_id)
  values(p_athlete_id,selected_team.sport,not profile_exists,selected_team.id)
  on conflict(athlete_id,sport) do update
  set primary_team_id=coalesce(public.athlete_sport_profiles.primary_team_id,excluded.primary_team_id),
      updated_at=now();

  update public.athletes a
  set sport=selected_team.sport,
      team_name=selected_team.name
  where a.id=p_athlete_id and not profile_exists;

  update public.athletes a
  set team_name=selected_team.name
  where a.id=p_athlete_id
    and a.sport=selected_team.sport
    and exists(
      select 1 from public.athlete_sport_profiles asp
      where asp.athlete_id=a.id and asp.sport=a.sport and asp.primary_team_id=selected_team.id
    );

  insert into public.privacy_consents(
    user_id,athlete_id,team_id,consent_type,policy_version,granted,relationship
  ) values(
    auth.uid(),p_athlete_id,selected_team.id,'coach_access','2026-09-23',true,
    case when public.current_beta_role()='Parent' then 'Parent or legal guardian' else 'Player' end
  );
  return selected_team.name;
end;
$$;

revoke all on function public.can_manage_athlete_sports(uuid) from public,anon;
revoke all on function public.athlete_sport_profile_list(uuid) from public,anon;
revoke all on function public.athlete_upsert_sport_profile(uuid,text,text,boolean) from public,anon;
revoke all on function public.athlete_set_primary_sport(uuid,text) from public,anon;
revoke all on function public.athlete_set_primary_team(uuid,uuid) from public,anon;
revoke all on function public.athlete_leave_team(uuid,uuid) from public,anon;

grant execute on function public.can_manage_athlete_sports(uuid) to authenticated;
grant execute on function public.athlete_sport_profile_list(uuid) to authenticated;
grant execute on function public.athlete_upsert_sport_profile(uuid,text,text,boolean) to authenticated;
grant execute on function public.athlete_set_primary_sport(uuid,text) to authenticated;
grant execute on function public.athlete_set_primary_team(uuid,uuid) to authenticated;
grant execute on function public.athlete_leave_team(uuid,uuid) to authenticated;
