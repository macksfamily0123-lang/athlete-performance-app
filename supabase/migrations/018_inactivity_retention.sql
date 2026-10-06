-- RC69: opt-in scheduled retention. Existing records start a fresh clock.
begin;
create table public.retention_settings(id boolean primary key default true check(id),enabled boolean not null default false,started_at timestamptz not null default now());
insert into public.retention_settings(id) values(true);
create table public.retention_activity(user_id uuid primary key references auth.users(id) on delete cascade,last_active_at timestamptz not null default now());
insert into public.retention_activity(user_id) select user_id from public.beta_users;
alter table public.retention_settings enable row level security;
alter table public.retention_activity enable row level security;
create policy "own activity" on public.retention_activity for select to authenticated using(user_id=auth.uid());
create policy "retention settings visible" on public.retention_settings for select to authenticated using(true);
create function public.retention_touch() returns boolean language plpgsql security definer set search_path=public as $$
begin
 if not exists(select 1 from public.beta_users where user_id=auth.uid() and active) then raise exception 'Active account required';end if;
 insert into public.retention_activity(user_id,last_active_at) values(auth.uid(),clock_timestamp()) on conflict(user_id) do update set last_active_at=excluded.last_active_at;return true;
end $$;
revoke all on function public.retention_touch() from public,anon;
grant execute on function public.retention_touch() to authenticated;
-- Auth last-sign-in remains authoritative even when app tracking fails.
create function public.retention_user_activity(p_user uuid) returns timestamptz language sql stable security definer set search_path=public as $$
 select greatest((select started_at from public.retention_settings),(select last_active_at from public.retention_activity where user_id=p_user),(select greatest(created_at,last_sign_in_at) from auth.users where id=p_user))
$$;
create function public.retention_subject_activity(p_kind text,p_id uuid) returns timestamptz language sql stable security definer set search_path=public as $$
 select case when p_kind='account' then public.retention_user_activity(p_id) else greatest(
 (select started_at from public.retention_settings),
 (select created_at from public.athletes where id=p_id),
 (select public.retention_user_activity(linked_user_id) from public.athletes where id=p_id),
 (select max(public.retention_user_activity(parent_user_id)) from public.parent_athletes where athlete_id=p_id)) end
$$;
-- Recipient identity is stored privately; no photos, names or training data in emails.
create table public.retention_notices(id uuid primary key default gen_random_uuid(),kind text not null check(kind in ('player','account')),subject_id uuid not null,cycle timestamptz not null,recipient uuid not null references auth.users(id) on delete cascade,stage text not null check(stage in ('six_month','final')),provider_id text,accepted_at timestamptz,delivered_at timestamptz,failed boolean not null default false,unique(kind,subject_id,cycle,recipient,stage));
alter table public.retention_notices enable row level security;
create table public.retention_runs(id bigint generated always as identity primary key,ran_at timestamptz not null default now(),deleted_players integer not null,deleted_accounts integer not null);
alter table public.retention_runs enable row level security;
create policy "admin retention runs" on public.retention_runs for select to authenticated using(public.current_beta_role()='Admin');
create function public.retention_recipients(p_kind text,p_id uuid) returns table(user_id uuid,email text) language sql stable security definer set search_path=public as $$
 select u.id,u.email from auth.users u where u.email is not null and (
 (p_kind='account' and u.id=p_id) or
 (p_kind='player' and (exists(select 1 from public.parent_athletes pa where pa.athlete_id=p_id and pa.parent_user_id=u.id) or exists(select 1 from public.athletes a join public.athlete_privacy_controls pc on pc.athlete_id=a.id where a.id=p_id and a.linked_user_id=u.id and not pc.requires_guardian))))
$$;
create function public.retention_subjects() returns table(kind text,subject_id uuid,cycle timestamptz) language sql stable security definer set search_path=public as $$
 select 'player',a.id,public.retention_subject_activity('player',a.id) from public.athletes a where a.account_management<>'Admin Test'
 union all select 'account',b.user_id,public.retention_subject_activity('account',b.user_id) from public.beta_users b where b.role<>'Admin' and not exists(select 1 from public.athletes a where a.linked_user_id=b.user_id or a.workspace_id=b.workspace_id)
$$;
create function public.retention_prepare() returns integer language plpgsql security definer set search_path=public as $$
declare n integer;
begin
 if not (select enabled from public.retention_settings) then return 0;end if;
 insert into public.retention_notices(kind,subject_id,cycle,recipient,stage)
 select s.kind,s.subject_id,s.cycle,r.user_id,stage from public.retention_subjects() s cross join lateral public.retention_recipients(s.kind,s.subject_id) r cross join (values('six_month'),('final')) stages(stage)
 where (stage='six_month' and now()>=s.cycle+interval '6 months') or (stage='final' and now()>=s.cycle+interval '12 months'-interval '30 days') on conflict do nothing;
 get diagnostics n=row_count;return n;
end $$;
create function public.retention_pending() returns table(id uuid,email text,stage text,cycle timestamptz,provider_id text,accepted_at timestamptz) language sql stable security definer set search_path=public as $$
 select n.id,u.email,n.stage,n.cycle,n.provider_id,n.accepted_at from public.retention_notices n join auth.users u on u.id=n.recipient where (select enabled from public.retention_settings) and not n.failed and n.delivered_at is null and n.cycle=public.retention_subject_activity(n.kind,n.subject_id) and exists(select 1 from public.retention_subjects() s where s.kind=n.kind and s.subject_id=n.subject_id) order by n.cycle,n.stage desc limit 25
$$;
create function public.retention_notice_result(p_notice uuid,p_provider_id text,p_result text) returns boolean language plpgsql security definer set search_path=public as $$
begin
 if p_provider_id is null or length(p_provider_id)=0 or p_result not in ('accepted','delivered','failed') or length(p_provider_id)>200 then raise exception 'Invalid mail result';end if;
 update public.retention_notices set provider_id=coalesce(provider_id,p_provider_id),accepted_at=case when p_result='accepted' then coalesce(accepted_at,now()) else accepted_at end,delivered_at=case when p_result='delivered' then coalesce(delivered_at,now()) else delivered_at end,failed=p_result='failed' where id=p_notice and (provider_id is null or provider_id=p_provider_id);return found;
end $$;
create function public.retention_ready(p_kind text,p_id uuid) returns boolean language sql stable security definer set search_path=public as $$
 select (select enabled from public.retention_settings) and now()>=public.retention_subject_activity(p_kind,p_id)+interval '12 months'
 and exists(select 1 from public.retention_recipients(p_kind,p_id))
 and not exists(select 1 from public.parent_athletes pa join auth.users u on u.id=pa.parent_user_id where p_kind='player' and pa.athlete_id=p_id and (u.email is null or u.email=''))
 and not exists(select 1 from public.retention_recipients(p_kind,p_id) r cross join (values('six_month'),('final')) stages(stage) where not exists(
 select 1 from public.retention_notices n where n.kind=p_kind and n.subject_id=p_id and n.recipient=r.user_id and n.cycle=public.retention_subject_activity(p_kind,p_id) and n.stage=stages.stage and n.delivered_at is not null and not n.failed and (stages.stage<>'final' or now()>=n.delivered_at+interval '30 days')))
$$;
create table public.retention_tombstones(kind text not null,subject_id uuid not null,deleted_at timestamptz not null default now(),primary key(kind,subject_id));
alter table public.retention_tombstones enable row level security;
create function public.retention_sweep() returns jsonb language plpgsql security definer set search_path=public as $$
declare s record;wid uuid;login_id uuid;photo text;np integer:=0;na integer:=0;
begin
 if not (select enabled from public.retention_settings) then return jsonb_build_object('enabled',false,'players',0,'accounts',0);end if;
 -- Serialize sweep and app activity. Fresh Auth sign-ins are rechecked below.
 perform pg_advisory_xact_lock(7269118);
 perform 1 from public.retention_activity for update;
 for s in select * from public.retention_subjects() where kind='player' loop
 perform 1 from public.athletes where id=s.subject_id for update;
 perform 1 from public.parent_athletes where athlete_id=s.subject_id for update;
 perform 1 from auth.users where id in(select parent_user_id from public.parent_athletes where athlete_id=s.subject_id union select linked_user_id from public.athletes where id=s.subject_id) for update;
 if not public.retention_ready('player',s.subject_id) then continue;end if;
 -- A guardian's explicit withdrawal dispute stays in the human review queue.
 if exists(select 1 from public.athlete_privacy_controls where athlete_id=s.subject_id and paused) then continue;end if;
 select workspace_id,linked_user_id into wid,login_id from public.athletes where id=s.subject_id;
 perform set_config('elite.privacy_operation','on',true);
 for photo in select distinct public.privacy_photo_values(data) from public.workspace_state where workspace_id=wid loop
 insert into public.privacy_removed_photo_hashes(hash) values(md5(photo)) on conflict do nothing;
 update public.workspace_state set data=public.privacy_redact_value(data,to_jsonb(photo)) where position(photo in data::text)>0;
 end loop;
 insert into public.retention_tombstones(kind,subject_id) values('player',s.subject_id) on conflict do nothing;
 delete from public.beta_workspaces where id=wid;
 if login_id is not null then delete from public.beta_invites where email=(select email from auth.users where id=login_id);delete from auth.users where id=login_id;end if;
 delete from public.retention_notices where kind='player' and subject_id=s.subject_id;
 np:=np+1;
 end loop;
 for s in select * from public.retention_subjects() where kind='account' loop
 perform 1 from auth.users where id=s.subject_id for update;
 if not public.retention_ready('account',s.subject_id) then continue;end if;
 -- Do not orphan solely managed Players or remove a Coach team with Players.
 if exists(select 1 from public.parent_athletes pa where parent_user_id=s.subject_id and not exists(select 1 from public.parent_athletes other where other.athlete_id=pa.athlete_id and other.parent_user_id<>s.subject_id)) then continue;end if;
 if exists(select 1 from public.teams t join public.team_members m on m.team_id=t.id where t.coach_user_id=s.subject_id) then continue;end if;
 perform public.privacy_delete_account_verified(s.subject_id);
 insert into public.retention_tombstones(kind,subject_id) values('account',s.subject_id) on conflict do nothing;
 delete from public.retention_notices where kind='account' and subject_id=s.subject_id;
 na:=na+1;
 end loop;
 -- Purge obsolete warning metadata when activity restarts the clock.
 delete from public.retention_notices where cycle<>public.retention_subject_activity(kind,subject_id);
 insert into public.retention_runs(deleted_players,deleted_accounts) values(np,na);
 delete from public.retention_runs where ran_at<now()-interval '90 days';
 return jsonb_build_object('enabled',true,'players',np,'accounts',na);
end $$;
create function public.retention_status(p_athlete uuid) returns jsonb language plpgsql stable security definer set search_path=public as $$
begin
 perform public.privacy_status(p_athlete);
 return jsonb_build_object('enabled',(select enabled from public.retention_settings),'lastActivity',public.retention_subject_activity('player',p_athlete));
end $$;
revoke all on function public.retention_status(uuid) from public,anon;
grant execute on function public.retention_status(uuid) to authenticated;
-- No caller-supplied time or subject ID can force a deletion.
revoke all on function public.retention_user_activity(uuid),public.retention_subject_activity(text,uuid),public.retention_recipients(text,uuid),public.retention_subjects(),public.retention_prepare(),public.retention_pending(),public.retention_notice_result(uuid,text,text),public.retention_ready(text,uuid),public.retention_sweep() from public,anon,authenticated;
grant execute on function public.retention_prepare(),public.retention_pending(),public.retention_notice_result(uuid,text,text),public.retention_sweep(),public.retention_subjects() to service_role;
create or replace function public.privacy_terms_accepted() returns boolean language sql stable security definer set search_path=public as $$
 select coalesce((select granted from public.privacy_consents where user_id=auth.uid() and consent_type='account_privacy' and policy_version='2026-10-03' order by id desc limit 1),false)
$$;
commit;
