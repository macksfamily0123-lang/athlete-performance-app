-- Elite Performance RC68: explicit guardian authority, immediate withdrawal,
-- verified deletion and database-enforced privacy. 001–016 remain unchanged.
begin;
create table public.guardian_verifications (
 user_id uuid primary key references auth.users(id) on delete cascade,
 method text not null check(method in ('signed_form','video_call','approved_provider')),
 evidence_reference text not null check(length(trim(evidence_reference)) between 3 and 200),
 verified_by uuid references auth.users(id) on delete set null,
 policy_version text not null default '2026-10-02',
 verified_at timestamptz not null default now()
);
alter table public.guardian_verifications enable row level security;
create policy "guardian verification visibility" on public.guardian_verifications for select to authenticated
 using(user_id=auth.uid() or public.current_beta_role()='Admin');
create table public.athlete_privacy_controls (
 athlete_id uuid primary key references public.athletes(id) on delete cascade,
 paused boolean not null default false,
 requires_guardian boolean not null default true,
 updated_by uuid references auth.users(id) on delete set null,
 updated_at timestamptz not null default now()
);
alter table public.athlete_privacy_controls enable row level security;
create policy "privacy controllers read status" on public.athlete_privacy_controls for select to authenticated
 using(public.current_beta_role()='Admin' or public.can_parent_view_athlete(athlete_id)
 or exists(select 1 from public.athletes a where a.id=athlete_id and a.linked_user_id=auth.uid()));
insert into public.athlete_privacy_controls(athlete_id,requires_guardian)
 select id,age is null or age<18 from public.athletes;

create function public.privacy_verified_parent(p_user uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.guardian_verifications v join public.beta_users b on b.user_id=v.user_id
 where v.user_id=p_user and v.policy_version='2026-10-02' and b.active and b.role='Parent')
$$;
create function public.privacy_controller(p_athlete uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select public.current_beta_role() is not null and (
 (public.can_parent_view_athlete(p_athlete) and public.privacy_verified_parent(auth.uid()))
 or exists(select 1 from public.athletes a join public.athlete_privacy_controls c on c.athlete_id=a.id
 where a.id=p_athlete and a.linked_user_id=auth.uid() and not c.requires_guardian))
$$;
create function public.privacy_collection_allowed(p_athlete uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.athlete_privacy_controls c where c.athlete_id=p_athlete and not c.paused
 and (not c.requires_guardian or exists(
 select 1 from public.parent_athletes pa where pa.athlete_id=p_athlete and public.privacy_verified_parent(pa.parent_user_id)
 and coalesce((select pc.granted from public.privacy_consents pc where pc.athlete_id=p_athlete
 and pc.user_id=pa.parent_user_id and pc.consent_type='guardian_account' and pc.policy_version='2026-10-02'
 order by pc.id desc limit 1),false))))
$$;
-- Missing/unknown age stays protected. Once recorded as a minor, editing age
-- cannot bypass guardian controls; adulthood transitions require Admin review.
create function public.privacy_initialize_athlete() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 if tg_op='INSERT' and public.current_beta_role()='Parent' and not public.privacy_verified_parent(auth.uid()) then
 raise exception 'Complete guardian verification before creating a Player'; end if;
 insert into public.athlete_privacy_controls(athlete_id,requires_guardian) values(new.id,case when new.account_management='Admin Test' then false when tg_op='INSERT' and new.linked_user_id is not null and exists(select 1 from auth.users u where u.id=new.linked_user_id and u.raw_user_meta_data->>'privacy_age_band'='adult') then false else new.age is null or new.age<18 end)
 on conflict(athlete_id) do update set requires_guardian=athlete_privacy_controls.requires_guardian or excluded.requires_guardian;
 return new;
end $$;
create trigger privacy_athlete_initialized after insert or update of age on public.athletes
 for each row execute function public.privacy_initialize_athlete();

create function public.privacy_admin_verified() returns boolean
language sql stable security definer set search_path=public as $$
 select public.current_beta_role()='Admin' and coalesce(auth.jwt()->>'aal','')='aal2'
$$;
create function public.privacy_verify_guardian(p_user uuid,p_method text,p_reference text) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 if not coalesce(public.privacy_admin_verified(),false) then raise exception 'Admin authenticator verification required';end if;
 if not exists(select 1 from public.beta_users where user_id=p_user and role='Parent' and active) then raise exception 'Active Parent required'; end if;
 insert into public.guardian_verifications(user_id,method,evidence_reference,verified_by)
 values(p_user,p_method,trim(p_reference),auth.uid()) on conflict(user_id) do update
 set method=excluded.method,evidence_reference=excluded.evidence_reference,verified_by=excluded.verified_by,
 policy_version='2026-10-02',verified_at=now();
 return true;
end $$;
create function public.privacy_authorize_player(p_athlete uuid) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 if not public.can_parent_view_athlete(p_athlete) or not public.privacy_verified_parent(auth.uid()) then
 raise exception 'Verified linked guardian required'; end if;
 insert into public.privacy_consents(user_id,athlete_id,consent_type,policy_version,granted,relationship)
 values(auth.uid(),p_athlete,'guardian_account','2026-10-02',true,'Parent or legal guardian');
 return true;
end $$;
create function public.privacy_status(p_athlete uuid) returns jsonb
language plpgsql stable security definer set search_path=public as $$
declare c public.athlete_privacy_controls%rowtype;
begin
 if public.current_beta_role() is null or not (public.current_beta_role()='Admin' or public.can_parent_view_athlete(p_athlete)
 or exists(select 1 from public.athletes where id=p_athlete and linked_user_id=auth.uid())) then raise exception 'Player privacy access denied'; end if;
 select * into c from public.athlete_privacy_controls where athlete_id=p_athlete;
 return jsonb_build_object('paused',c.paused,'requiresGuardian',c.requires_guardian,'collectionAllowed',public.privacy_collection_allowed(p_athlete),
 'canControl',public.privacy_controller(p_athlete),'guardianVerified',public.privacy_verified_parent(auth.uid()),
 'withdrawalByAnotherGuardian',c.paused and c.updated_by is distinct from auth.uid(),'revision',c.updated_at,
 'parentCount',(select count(*) from public.parent_athletes where athlete_id=p_athlete));
end $$;

create function public.privacy_terms_accepted() returns boolean
language sql stable security definer set search_path=public as $$
 select coalesce((select granted from public.privacy_consents where user_id=auth.uid() and consent_type='account_privacy'
 and policy_version='2026-10-02' order by id desc limit 1),false)
$$;
create function public.privacy_guard_signup() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 if coalesce((select role from public.beta_invites where lower(email)=lower(new.email)),new.raw_user_meta_data->>'requested_role')='Player' and new.raw_user_meta_data->>'privacy_age_band' is distinct from 'adult'
 and not exists(select 1 from public.athletes a where upper(a.player_claim_code)=upper(new.raw_user_meta_data->>'player_claim_code')
 and public.privacy_collection_allowed(a.id)) then raise exception 'A verified guardian must create and authorize a minor Player first'; end if;
 return new;
end $$;
create trigger privacy_signup_guard before insert on auth.users for each row execute function public.privacy_guard_signup();

-- Active account check applies to every workspace, including the linked-user path.
create or replace function public.can_access_workspace(p_workspace uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select public.current_beta_role() is not null and public.privacy_terms_accepted() and (
 public.current_beta_role()='Admin' or p_workspace=public.current_beta_workspace()
 or exists(select 1 from public.athletes a where a.workspace_id=p_workspace and (
 a.linked_user_id=auth.uid() or public.can_parent_view_athlete(a.id) or public.can_coach_manage_athlete(a.id))))
 and not exists(select 1 from public.athletes a where a.workspace_id=p_workspace and not public.privacy_collection_allowed(a.id))
$$;
create function public.privacy_workspace_writable(p_workspace uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select public.can_access_workspace(p_workspace) and (public.current_beta_role()='Admin'
 or (p_workspace=public.current_beta_workspace() and public.current_beta_role() in ('Player','Coach'))
 or exists(select 1 from public.athletes a where a.workspace_id=p_workspace and (
 a.linked_user_id=auth.uid() or public.can_coach_manage_athlete(a.id)
 or (public.can_parent_view_athlete(a.id) and a.account_management='Parent'))))
$$;
-- Qualify columns explicitly: the historical correlated workspace expression
-- could otherwise resolve both sides to the inner table.
drop policy "write accessible workspace state" on public.workspace_state;
drop policy "update accessible workspace state" on public.workspace_state;
create policy "write accessible workspace state" on public.workspace_state for insert to authenticated
 with check(public.privacy_workspace_writable(workspace_state.workspace_id));
create policy "update accessible workspace state" on public.workspace_state for update to authenticated
 using(public.privacy_workspace_writable(workspace_state.workspace_id)) with check(public.privacy_workspace_writable(workspace_state.workspace_id));
create policy "privacy restricts workspace reads" on public.workspace_state as restrictive for select to authenticated
 using(public.can_access_workspace(workspace_state.workspace_id));
-- Definer RPCs can bypass RLS; enforce collection at the actual write boundary.
create function public.privacy_guard_workspace_write() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 if current_setting('elite.privacy_operation',true)='on' then return new; end if;
 if auth.uid() is not null and public.current_beta_role() is not null and not public.privacy_terms_accepted() then raise exception 'Accept the current Terms and Privacy Notice before collecting Player data';end if;
 if tg_op='INSERT' and (auth.uid() is null or public.current_beta_role()='Admin' or public.privacy_verified_parent(auth.uid())) then return new; end if;
 if exists(select 1 from public.athletes a where a.workspace_id=new.workspace_id and not public.privacy_collection_allowed(a.id)) then
 raise exception 'Player collection is paused or guardian authorization is required'; end if;
 return new;
end $$;
create trigger privacy_workspace_guard before insert or update on public.workspace_state
 for each row execute function public.privacy_guard_workspace_write();
create function public.privacy_guard_team_join() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 if not public.privacy_terms_accepted() then raise exception 'Current agreement required before Coach sharing';end if;
 if not public.privacy_collection_allowed(new.athlete_id) then raise exception 'Guardian authorization required or collection paused'; end if;
 if (select requires_guardian from public.athlete_privacy_controls where athlete_id=new.athlete_id)
 and not (public.can_parent_view_athlete(new.athlete_id) and public.privacy_verified_parent(auth.uid())) then
 raise exception 'A verified guardian must authorize Coach sharing for a minor'; end if;
 return new;
end $$;
create trigger privacy_team_guard before insert on public.team_members for each row execute function public.privacy_guard_team_join();
create policy "privacy restricts review reads" on public.coach_weekly_reviews as restrictive for select to authenticated
 using(public.can_access_workspace(coach_weekly_reviews.workspace_id));
create trigger privacy_review_guard before insert or update on public.coach_weekly_reviews
 for each row execute function public.privacy_guard_workspace_write();

create function public.privacy_pause_player(p_athlete uuid,p_paused boolean) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 if not public.privacy_controller(p_athlete) then raise exception 'Verified guardian or adult Player required'; end if;
 perform 1 from public.athletes where id=p_athlete for update;
 perform set_config('elite.privacy_operation','on',true);
 if not p_paused and exists(select 1 from public.athlete_privacy_controls where athlete_id=p_athlete and paused and updated_by is distinct from auth.uid()) then
 raise exception 'Another guardian withdrew consent. Operator authority review is required before resuming';end if;
 if not p_paused and (select requires_guardian from public.athlete_privacy_controls where athlete_id=p_athlete)
 and not exists(select 1 from public.privacy_consents where user_id=auth.uid() and athlete_id=p_athlete
 and consent_type='guardian_account' and policy_version='2026-10-02' and granted) then raise exception 'Authorize this Player before resuming'; end if;
 update public.athlete_privacy_controls set paused=p_paused,updated_by=auth.uid(),updated_at=now() where athlete_id=p_athlete;
 if p_paused then
 delete from public.team_members where athlete_id=p_athlete;
 update public.athlete_sport_profiles set primary_team_id=null where athlete_id=p_athlete;
 update public.athletes set team_name='' where id=p_athlete;
 delete from public.tracker_coach_shares where athlete_id=p_athlete;
 insert into public.privacy_consents(user_id,athlete_id,consent_type,policy_version,granted,relationship)
 values(auth.uid(),p_athlete,'guardian_account','2026-10-02',false,'Consent withdrawn; collection paused');
 end if;
 return true;
end $$;
create function public.privacy_revoke_coach(p_athlete uuid,p_team uuid) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 if not public.privacy_controller(p_athlete) then raise exception 'Verified guardian or adult Player required'; end if;
 perform set_config('elite.privacy_operation','on',true);
 delete from public.team_members where athlete_id=p_athlete and team_id=p_team;
 update public.athlete_sport_profiles set primary_team_id=null where athlete_id=p_athlete and primary_team_id=p_team;
 update public.athletes set team_name='' where id=p_athlete and not exists(select 1 from public.team_members where athlete_id=p_athlete);
 delete from public.tracker_coach_shares where athlete_id=p_athlete and coach_user_id=(select coach_user_id from public.teams where id=p_team);
 insert into public.privacy_consents(user_id,athlete_id,team_id,consent_type,policy_version,granted,relationship)
 values(auth.uid(),p_athlete,p_team,'coach_access','2026-10-02',false,'Sharing revoked');
 return true;
end $$;
-- Redact every matching embedded photo, including stored roster copies.
create function public.privacy_redact_value(p_data jsonb,p_value jsonb) returns jsonb
language plpgsql immutable set search_path=public as $$
declare result jsonb;
begin
 if p_data=p_value then return '""'::jsonb; end if;
 if jsonb_typeof(p_data)='object' then
 select coalesce(jsonb_object_agg(key,public.privacy_redact_value(value,p_value)),'{}'::jsonb) into result from jsonb_each(p_data); return result;
 elsif jsonb_typeof(p_data)='array' then
 select coalesce(jsonb_agg(public.privacy_redact_value(value,p_value) order by ord),'[]'::jsonb) into result from jsonb_array_elements(p_data) with ordinality as e(value,ord);return result;
 end if;return p_data;
end $$;
create function public.privacy_remove_photo(p_athlete uuid) returns boolean
language plpgsql security definer set search_path=public as $$
declare photo jsonb;
begin
 if not public.privacy_controller(p_athlete) then raise exception 'Verified guardian or adult Player required'; end if;
 select s.data#>'{profile,photoUrl}' into photo from public.workspace_state s join public.athletes a on a.workspace_id=s.workspace_id where a.id=p_athlete;
 perform set_config('elite.privacy_operation','on',true);
 if photo is not null and photo<>'""'::jsonb then
 update public.workspace_state set data=public.privacy_redact_value(data,photo) where data::text like '%'||trim(both '"' from photo::text)||'%';
 end if;return true;
end $$;
create function public.privacy_export_player(p_athlete uuid) returns jsonb
language plpgsql stable security definer set search_path=public as $$
begin
 if not public.privacy_controller(p_athlete) then raise exception 'Verified guardian or adult Player required'; end if;
 return jsonb_build_object('player',(select to_jsonb(a)-'created_by'-'linked_user_id' from public.athletes a where id=p_athlete),
 'workspace',(select data from public.workspace_state where workspace_id=(select workspace_id from public.athletes where id=p_athlete)),
 'sportProfiles',(select coalesce(jsonb_agg(to_jsonb(s)),'[]') from public.athlete_sport_profiles s where athlete_id=p_athlete),
 'reviews',(select coalesce(jsonb_agg(to_jsonb(r)-'coach_user_id'),'[]') from public.coach_weekly_reviews r where workspace_id=(select workspace_id from public.athletes where id=p_athlete)),
 'consents',(select coalesce(jsonb_agg(to_jsonb(c)-'user_id'),'[]') from public.privacy_consents c where athlete_id=p_athlete and user_id=auth.uid()));
end $$;
create function public.privacy_delete_player(p_athlete uuid,p_confirmation text) returns boolean
language plpgsql security definer set search_path=public as $$
declare wid uuid;login_id uuid;
begin
 if p_confirmation<>'DELETE PLAYER' then raise exception 'Type DELETE PLAYER to confirm'; end if;
 if not public.privacy_controller(p_athlete) then raise exception 'Verified guardian or adult Player required'; end if;
 perform 1 from public.athletes where id=p_athlete for update;
 if (select count(*) from public.parent_athletes where athlete_id=p_athlete)>1 then
 raise exception 'Shared guardian record: collection can be paused now; deletion requires a reviewed request'; end if;
 select workspace_id,linked_user_id into wid,login_id from public.athletes where id=p_athlete;
 perform public.privacy_remove_photo(p_athlete);
 -- Remove athlete data and cascaded sports, links, trackers, team memberships,
 -- reviews, feedback and embedded photo copies before removing login identity.
 delete from public.beta_workspaces where id=wid;
 if login_id is not null then
 delete from public.beta_invites where email=(select email from auth.users where id=login_id);
 delete from auth.users where id=login_id;
 end if;
 return true;
end $$;
-- Only the password-verified Edge Function may invoke account erasure.
create function public.privacy_delete_account_verified(p_user uuid) returns boolean
language plpgsql security definer set search_path=public as $$
declare wid uuid;mail text;
begin
 select workspace_id,email into wid,mail from public.beta_users where user_id=p_user;
 if wid is null then raise exception 'Account not found'; end if;
 if exists(select 1 from public.athletes a where a.linked_user_id=p_user or (a.workspace_id=wid)) then
 raise exception 'Delete the linked Player first, or use a reviewed request for a shared guardian record'; end if;
 if exists(select 1 from public.parent_athletes pa where pa.parent_user_id=p_user and not exists(
 select 1 from public.parent_athletes other where other.athlete_id=pa.athlete_id and other.parent_user_id<>p_user)) then
 raise exception 'Delete or transfer each solely managed Player before deleting this Parent account'; end if;
 if exists(select 1 from public.beta_users where user_id=p_user and role='Admin') and
 (select count(*) from public.beta_users where role='Admin' and active)<=1 then raise exception 'Transfer administration before deleting the last Admin'; end if;
 delete from public.beta_invites where email=mail;
 delete from auth.users where id=p_user;
 delete from public.beta_workspaces where id=wid;
 return true;
end $$;
revoke all on function public.privacy_delete_account_verified(uuid) from public,anon,authenticated;
grant execute on function public.privacy_delete_account_verified(uuid) to service_role;
-- Explicitly close default PUBLIC execution on all privacy helpers and actions.
do $$declare r record;begin
 for r in select oid::regprocedure as signature,proname from pg_proc where pronamespace='public'::regnamespace and proname like 'privacy_%'
 loop execute format('revoke all on function %s from public,anon',r.signature);
 if r.proname<>'privacy_delete_account_verified' then execute format('grant execute on function %s to authenticated',r.signature);end if;
 end loop;
end $$;

-- A deleted photo cannot be restored by a stale open client. Store only hashes,
-- never the removed image. These blocks contain no account/athlete identifiers.
create table public.privacy_removed_photo_hashes(hash text primary key,created_at timestamptz not null default now());
alter table public.privacy_removed_photo_hashes enable row level security;
create function public.privacy_photo_values(p_data jsonb) returns setof text
language plpgsql immutable set search_path=public as $$
declare entry record;begin
 if jsonb_typeof(p_data)='object' then
 for entry in select key,value from jsonb_each(p_data) loop
 if entry.key='photoUrl' and jsonb_typeof(entry.value)='string' and entry.value<>'""'::jsonb then return next entry.value#>>'{}';
 else return query select public.privacy_photo_values(entry.value);end if;end loop;
 elsif jsonb_typeof(p_data)='array' then
 for entry in select value from jsonb_array_elements(p_data) loop return query select public.privacy_photo_values(entry.value);end loop;
 end if;return;
end $$;
create or replace function public.privacy_remove_photo(p_athlete uuid) returns boolean
language plpgsql security definer set search_path=public as $$
declare photo text;begin
 if not public.privacy_controller(p_athlete) then raise exception 'Verified guardian or adult Player required'; end if;
 perform set_config('elite.privacy_operation','on',true);
 for photo in select distinct public.privacy_photo_values(s.data) from public.workspace_state s join public.athletes a on a.workspace_id=s.workspace_id where a.id=p_athlete loop
 insert into public.privacy_removed_photo_hashes(hash) values(md5(photo)) on conflict do nothing;
 update public.workspace_state set data=public.privacy_redact_value(data,to_jsonb(photo)) where position(photo in data::text)>0;
 end loop;
 update public.athlete_privacy_controls set updated_at=clock_timestamp(),updated_by=auth.uid() where athlete_id=p_athlete;
 return true;
end $$;
create function public.privacy_guard_photos() returns trigger
language plpgsql security definer set search_path=public as $$
declare photo text;begin
 if current_setting('elite.privacy_operation',true)='on' then return new;end if;
 for photo in select public.privacy_photo_values(new.data) loop
 if photo !~ '^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$' or length(photo)>1600000 then raise exception 'Use a resized photo upload; remote profile images are not permitted';end if;
 if exists(select 1 from public.privacy_removed_photo_hashes where hash=md5(photo)) then raise exception 'This photo was removed. Refresh the app before saving';end if;
 end loop;return new;
end $$;
create trigger privacy_photo_guard before insert or update on public.workspace_state for each row execute function public.privacy_guard_photos();
-- Cascade links alone does not authorize reviewed shared-guardian erasure.
-- Operator review needs a separately recorded authority decision.
create table public.privacy_erasure_audit(id bigint generated always as identity primary key,reference text not null,completed_at timestamptz not null default now());
alter table public.privacy_erasure_audit enable row level security;
create policy "admin erasure audit" on public.privacy_erasure_audit for select to authenticated using(public.current_beta_role()='Admin');
create function public.privacy_reviewed_player_delete(p_athlete uuid,p_reference text,p_confirmation text) returns boolean
language plpgsql security definer set search_path=public as $$
declare wid uuid;login_id uuid;photo text;
begin
 if not coalesce(public.privacy_admin_verified(),false) then raise exception 'Admin authenticator verification required';end if;
 if p_confirmation<>'DELETE PLAYER' or length(trim(p_reference))<10 or length(p_reference)>200 then raise exception 'Reviewed authority reference and DELETE PLAYER required';end if;
 perform 1 from public.athletes where id=p_athlete for update;
 select workspace_id,linked_user_id into wid,login_id from public.athletes where id=p_athlete;
 if wid is null then raise exception 'Player not found';end if;
 perform set_config('elite.privacy_operation','on',true);
 for photo in select distinct public.privacy_photo_values(data) from public.workspace_state where workspace_id=wid loop
 insert into public.privacy_removed_photo_hashes(hash) values(md5(photo)) on conflict do nothing;
 update public.workspace_state set data=public.privacy_redact_value(data,to_jsonb(photo)) where position(photo in data::text)>0;
 end loop;
 delete from public.beta_workspaces where id=wid;
 if login_id is not null then delete from public.beta_invites where email=(select email from auth.users where id=login_id);delete from auth.users where id=login_id;end if;
 insert into public.privacy_erasure_audit(reference) values(trim(p_reference));
 return true;
end $$;
revoke all on function public.privacy_photo_values(jsonb) from public,anon,authenticated;
revoke all on function public.privacy_guard_photos() from public,anon,authenticated;
revoke all on function public.privacy_remove_photo(uuid) from public,anon;
revoke all on function public.privacy_reviewed_player_delete(uuid,text,text) from public,anon;
grant execute on function public.privacy_remove_photo(uuid) to authenticated;
grant execute on function public.privacy_reviewed_player_delete(uuid,text,text) to authenticated;
create function public.privacy_review_resume(p_athlete uuid,p_reference text) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 if not coalesce(public.privacy_admin_verified(),false) or length(trim(p_reference))<10 or length(p_reference)>200 then raise exception 'Admin and authority review reference required';end if;
 update public.athlete_privacy_controls set paused=false,updated_by=auth.uid(),updated_at=now() where athlete_id=p_athlete;
 if not public.privacy_collection_allowed(p_athlete) then raise exception 'Current verified guardian authorization is required';end if;
 insert into public.privacy_erasure_audit(reference) values('Pause resolution: '||trim(p_reference));return true;
end $$;
create function public.privacy_review_adult(p_athlete uuid,p_age integer,p_reference text) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 if not coalesce(public.privacy_admin_verified(),false) or length(trim(p_reference))<10 or length(p_reference)>200 then raise exception 'Admin and adulthood review reference required';end if;
 if p_age<18 or p_age>100 then raise exception 'Verified adult age required';end if;
 perform set_config('elite.privacy_operation','on',true);
 update public.athletes set age=p_age where id=p_athlete;
 update public.athlete_privacy_controls set requires_guardian=false,updated_at=now(),updated_by=auth.uid() where athlete_id=p_athlete;
 insert into public.privacy_erasure_audit(reference) values('Adulthood review: '||trim(p_reference));return true;
end $$;
revoke all on function public.privacy_review_resume(uuid,text) from public,anon;
revoke all on function public.privacy_review_adult(uuid,integer,text) from public,anon;
grant execute on function public.privacy_review_resume(uuid,text) to authenticated;
grant execute on function public.privacy_review_adult(uuid,integer,text) to authenticated;
-- Privacy hashes and opaque review references are minimal operational records.
-- The operator's scheduled retention job removes them after the published period.

-- Stop metadata and sport-profile writes as well as the main workspace.
create function public.privacy_guard_player_metadata() returns trigger
language plpgsql security definer set search_path=public as $$
declare aid uuid;begin
 if current_setting('elite.privacy_operation',true)='on' then return new;end if;
 if tg_table_name='athletes' then
 aid:=new.id;
 if new.display_name=old.display_name and new.sport=old.sport and new.position=old.position and new.team_name=old.team_name and new.age is not distinct from old.age then return new;end if;
 else aid:=new.athlete_id;end if;
 if not public.privacy_collection_allowed(aid) then
 if tg_op='INSERT' and exists(select 1 from public.athletes a where a.id=aid and a.created_at>=transaction_timestamp())
 and (auth.uid() is null or public.privacy_verified_parent(auth.uid()) or public.current_beta_role()='Admin') then return new;end if;
 raise exception 'Player collection is paused or guardian authorization is required';end if;
 return new;
end $$;
create trigger privacy_athlete_metadata_guard before update on public.athletes for each row execute function public.privacy_guard_player_metadata();
create trigger privacy_sport_metadata_guard before insert or update on public.athlete_sport_profiles for each row execute function public.privacy_guard_player_metadata();
revoke all on function public.privacy_guard_player_metadata() from public,anon,authenticated;
commit;
