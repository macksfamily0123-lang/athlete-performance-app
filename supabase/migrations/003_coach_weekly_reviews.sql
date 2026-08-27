-- Athlete Performance App — Phase 72.3.26
-- Secure Coach Weekly Reviews
--
-- Parent: sees all Coach reviews for linked athletes.
-- Player: sees only reviews where share_with_player=true.
-- Coach: sees and manages only their own reviews for athletes they coach.
-- Admin: read-only access to all Coach reviews.

create table if not exists public.coach_weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.beta_workspaces(id) on delete cascade,
  coach_user_id uuid not null references auth.users(id) on delete cascade,
  coach_name text not null default 'Coach',
  week_start date not null,
  performance smallint not null default 3 check (performance between 1 and 5),
  effort smallint not null default 3 check (effort between 1 and 5),
  attitude smallint not null default 3 check (attitude between 1 and 5),
  teamwork smallint not null default 3 check (teamwork between 1 and 5),
  coachability smallint not null default 3 check (coachability between 1 and 5),
  leadership smallint not null default 3 check (leadership between 1 and 5),
  strengths text not null default '',
  development_opportunity text not null default '',
  leadership_opportunity text not null default '',
  next_week_focus text not null default '',
  coach_message text not null default '',
  share_with_player boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id,coach_user_id,week_start)
);

alter table public.coach_weekly_reviews enable row level security;

drop policy if exists "coach weekly reviews secure read" on public.coach_weekly_reviews;
create policy "coach weekly reviews secure read"
on public.coach_weekly_reviews
for select to authenticated
using (
  public.current_beta_role()='Admin'
  or (
    public.current_beta_role()='Coach'
    and coach_user_id=auth.uid()
    and exists(
      select 1 from public.athletes a
      where a.workspace_id=coach_weekly_reviews.workspace_id
        and public.can_coach_manage_athlete(a.id)
    )
  )
  or (
    public.current_beta_role()='Parent'
    and exists(
      select 1 from public.athletes a
      where a.workspace_id=coach_weekly_reviews.workspace_id
        and public.can_parent_view_athlete(a.id)
    )
  )
  or (
    public.current_beta_role()='Player'
    and share_with_player=true
    and exists(
      select 1 from public.athletes a
      where a.workspace_id=coach_weekly_reviews.workspace_id
        and a.linked_user_id=auth.uid()
    )
  )
);

drop policy if exists "coach creates weekly reviews" on public.coach_weekly_reviews;
create policy "coach creates weekly reviews"
on public.coach_weekly_reviews
for insert to authenticated
with check (
  public.current_beta_role()='Coach'
  and coach_user_id=auth.uid()
  and exists(
    select 1 from public.athletes a
    where a.workspace_id=coach_weekly_reviews.workspace_id
      and public.can_coach_manage_athlete(a.id)
  )
);

drop policy if exists "coach updates own weekly reviews" on public.coach_weekly_reviews;
create policy "coach updates own weekly reviews"
on public.coach_weekly_reviews
for update to authenticated
using (
  public.current_beta_role()='Coach'
  and coach_user_id=auth.uid()
  and exists(
    select 1 from public.athletes a
    where a.workspace_id=coach_weekly_reviews.workspace_id
      and public.can_coach_manage_athlete(a.id)
  )
)
with check (
  public.current_beta_role()='Coach'
  and coach_user_id=auth.uid()
  and exists(
    select 1 from public.athletes a
    where a.workspace_id=coach_weekly_reviews.workspace_id
      and public.can_coach_manage_athlete(a.id)
  )
);

drop policy if exists "coach deletes own weekly reviews" on public.coach_weekly_reviews;
create policy "coach deletes own weekly reviews"
on public.coach_weekly_reviews
for delete to authenticated
using (
  public.current_beta_role()='Coach'
  and coach_user_id=auth.uid()
  and exists(
    select 1 from public.athletes a
    where a.workspace_id=coach_weekly_reviews.workspace_id
      and public.can_coach_manage_athlete(a.id)
  )
);

grant select on public.coach_weekly_reviews to authenticated;
grant insert,update,delete on public.coach_weekly_reviews to authenticated;

notify pgrst, 'reload schema';
