-- Run only after migration 018, verified sender, dry-run and mail test.
-- Add the same RETENTION_CRON_SECRET in Vault named elite_retention_cron_secret.
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.schedule('elite-retention-daily','0 3 * * *',$job$
 select net.http_post(
 url := 'https://tldbvdkqzowcntmyhkvj.supabase.co/functions/v1/retention-worker',
 headers := jsonb_build_object('Content-Type','application/json','x-retention-secret',(select decrypted_secret from vault.decrypted_secrets where name='elite_retention_cron_secret')),
 body := '{"dryRun":false}'::jsonb,
 timeout_milliseconds := 120000
 );
$job$);
-- Enable last, after verifying deployment and delivery.
update public.retention_settings set enabled=true where id=true;
