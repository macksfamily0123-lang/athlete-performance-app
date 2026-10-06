# Supabase: install first, activate last

Your project reference is `tldbvdkqzowcntmyhkvj`.

1. In Supabase SQL Editor, open a new query. Copy the complete contents of `supabase/migrations/018_inactivity_retention.sql` from Codespaces. Run it once. Do not rerun migrations 001–017. If migration 017 is not installed, install that first. Automation starts disabled and existing records get a fresh clock.
2. Deploy the server worker from Codespaces:

```bash
npx supabase functions deploy retention-worker --project-ref tldbvdkqzowcntmyhkvj
```

3. Create a Resend account, add a domain you control and verify its DNS. A Gmail address cannot serve as your verified sending domain. Create an API key with sending AND email retrieval permissions. Do not use a send-only key; delivery verification requires retrieval.
4. In Supabase → Edge Functions → Secrets, add these values. All are server-only:

| Name | Value |
| --- | --- |
| RESEND_API_KEY | Your private Resend key |
| RETENTION_FROM_EMAIL | Elite Performance <privacy@YOUR_VERIFIED_DOMAIN> |
| RETENTION_REPLY_TO | Eliteperformanceath@gmail.com |
| RETENTION_APP_URL | Your stable production app URL, beginning https:// |
| RETENTION_CRON_SECRET | A newly generated random secret, at least 32 characters |

Generate the secret in your private terminal; keep it out of screenshots and Git:

```bash
openssl rand -hex 32
```

5. Supabase → Database → Vault: create a secret named `elite_retention_cron_secret`, with the EXACT same value as RETENTION_CRON_SECRET. If Vault or Cron is unavailable on your project, enable the Supabase-supported extensions before continuing.
6. Test without sending or deleting. Paste this into the private Codespaces terminal, then type the cron secret at the hidden prompt:

```bash
read -s -p "Cron secret: " EP_RETENTION_SECRET
```

```bash
curl --fail-with-body https://tldbvdkqzowcntmyhkvj.supabase.co/functions/v1/retention-worker -H "Content-Type: application/json" -H "x-retention-secret: $EP_RETENTION_SECRET" --data '{"dryRun":true}'
```

Expect `dryRun:true`. This checks access and subject counting; it is not a delivery test.
7. Send a generic test email to your own address using Resend's dashboard. Confirm delivery and successful retrieval through the provider before enabling automation. Do not change real user activity timestamps to manufacture a test. Use a separate staging Supabase project for end-to-end deletion tests with disposable accounts.
8. Verify your actual Supabase backup/PITR lifetime and restoration procedure. Publish that exact backup period in NEXT_PUBLIC_PRIVACY_RETENTION_NOTE on Vercel and .env.local. State that active records are deleted after 12 months inactivity with six-month and 30-day warnings, and explain the reviewed exceptions. Do not promise immediate backup erasure or invent the backup duration.
9. Deploy RC69 and verify /privacy, /terms, the agreement prompt and Player/Parent Privacy Center. Existing users must accept version 2026-10-03. Confirm that all linked parent emails are current.
10. Only then run the complete `supabase/retention_schedule.sql` in SQL Editor. It schedules a daily 03:00 UTC job and enables retention. Your computer does not need to remain on.

## Monitor and pause

Check Edge Function logs and Supabase Cron history after activation and regularly thereafter. Cron success only proves the HTTP request was scheduled; check the HTTP/function response too. Resend reports delivery to a server, not proof that a person read the message.

SQL Editor, monitoring:

```sql
select * from public.retention_runs order by ran_at desc limit 20;
select stage,failed,count(*) from public.retention_notices group by stage,failed;
select count(*) as waiting_for_delivery from public.retention_notices where delivered_at is null;
```

Pause immediately without deleting the schedule:

```sql
update public.retention_settings set enabled=false where id=true;
```

Failed notices stay held. Investigate with the user and provider, correct verified contact details, then retry the appropriate notice after review. Never mark an undelivered message as delivered manually. Do not discard review exceptions just to meet the 12-month date. Up to 25 pending notices are processed daily; a large backlog delays deletion safely.

Before any database restoration, preserve/export the current private retention_tombstones and reconcile deleted IDs before reopening restored data. Include manual privacy erasures in your operational restore procedure too. The app cannot expire provider backups itself.

References: https://supabase.com/docs/guides/functions/schedule-functions · https://resend.com/docs/api-reference/emails/retrieve-email · https://resend.com/docs/dashboard/domains/introduction
