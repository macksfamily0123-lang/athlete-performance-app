-- Phase 72.3.99 RC49
-- Repair Parent-managed Player creation on projects where pgcrypto functions
-- are installed outside the public schema. gen_random_uuid() is available in
-- PostgreSQL and avoids the unavailable random-byte helper.

create or replace function public.new_player_claim_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  code text;
begin
  loop
    code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

    exit when not exists (
      select 1
      from public.athletes
      where player_claim_code = code
    );
  end loop;

  return code;
end;
$$;

revoke all
on function public.new_player_claim_code()
from public, anon, authenticated;

notify pgrst, 'reload schema';
