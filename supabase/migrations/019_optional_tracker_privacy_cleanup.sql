-- Optional tracker tables must not prevent consent withdrawal or Coach revocation.
-- Tracker connectivity remains disabled. Existing permissions stay unchanged.
begin;
DO $repair$
DECLARE
  function_sql text;
  signature text;
  old_statement text;
  replacement text;
BEGIN
  FOR signature,old_statement,replacement IN
    SELECT * FROM (VALUES
      ('public.privacy_pause_player(uuid,boolean)',
       'delete from public.tracker_coach_shares where athlete_id=p_athlete;',
       'IF to_regclass(''public.tracker_coach_shares'') IS NOT NULL THEN EXECUTE ''DELETE FROM public.tracker_coach_shares WHERE athlete_id = $1'' USING p_athlete; END IF;'),
      ('public.privacy_revoke_coach(uuid,uuid)',
       'delete from public.tracker_coach_shares where athlete_id=p_athlete and coach_user_id=(select coach_user_id from public.teams where id=p_team);',
       'IF to_regclass(''public.tracker_coach_shares'') IS NOT NULL THEN EXECUTE ''DELETE FROM public.tracker_coach_shares WHERE athlete_id = $1 AND coach_user_id = (SELECT coach_user_id FROM public.teams WHERE id = $2)'' USING p_athlete,p_team; END IF;')
    ) AS repairs(signature,old_statement,replacement)
  LOOP
    function_sql := pg_get_functiondef(signature::regprocedure);
    IF strpos(function_sql,old_statement)>0 THEN
      EXECUTE replace(function_sql,old_statement,replacement);
    ELSIF strpos(function_sql,'to_regclass(''public.tracker_coach_shares'')')=0 THEN
      RAISE EXCEPTION 'Unexpected definition for %. No repair applied.',signature;
    END IF;
  END LOOP;
END;
$repair$;
commit;
