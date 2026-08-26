-- Athlete Performance App — Phase 72.3.21
-- Shared support-team notes.
--
-- Parents remain unable to write the general workspace_state document.
-- This RPC allows an authorized Player, Coach, Parent, or Admin to update
-- ONLY the coachNotes/shared-support-notes array for a workspace they can access.

create or replace function public.save_shared_notes(
  p_workspace_id uuid,
  p_notes jsonb
)
returns void
language plpgsql
security definer
set search_path=public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if public.current_beta_role() not in ('Player','Coach','Parent','Admin') then
    raise exception 'Active beta account required';
  end if;

  if not public.can_access_workspace(p_workspace_id) then
    raise exception 'You do not have access to this athlete workspace';
  end if;

  if jsonb_typeof(p_notes) <> 'array' then
    raise exception 'Shared notes must be an array';
  end if;

  if jsonb_array_length(p_notes) > 500 then
    raise exception 'Shared note limit exceeded';
  end if;

  update public.workspace_state
  set
    data=jsonb_set(coalesce(data,'{}'::jsonb),'{coachNotes}',p_notes,true),
    updated_by=auth.uid(),
    updated_at=now()
  where workspace_id=p_workspace_id;

  if not found then
    raise exception 'Athlete workspace state was not found';
  end if;
end;
$$;

revoke all on function public.save_shared_notes(uuid,jsonb) from public;
grant execute on function public.save_shared_notes(uuid,jsonb) to authenticated;
