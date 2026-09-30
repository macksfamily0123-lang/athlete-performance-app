# Elite Performance RC67 · Supabase

## Existing RC66 installation

RC67 changes presentation and navigation. **Migrations 001–016 are byte-for-byte preserved. No new migration is required.** Keep your current project, accounts, data, role approvals, team connections, and parent/player relationships. Do not rerun previously applied migrations.

The included `supabase/migrations.sha256` records the preserved migration hashes. Verify them with:

```bash
npm run test:migrations
```

Keep these values in the existing Codespaces `.env.local` and Vercel environments:

```text
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
```

```text
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Only if `.env.local` does not already exist, create it from the example and replace the placeholders in the editor:

```bash
cp .env.example .env.local
```

Use the public anon key expected by the existing integration. Do not put a Supabase service-role key into a `NEXT_PUBLIC_` variable or commit credentials. No tracker-provider or billing credentials are needed.

In Supabase Authentication URL configuration, keep your production Site URL and allow the callback URLs used by your Codespaces/Preview/production testing. Email confirmation and password reset links need an allowed redirect URL. Use the exact preview hostname you are testing rather than granting unrelated hosts access.

## New Supabase project only

If you are keeping the RC66 project, skip this section. For a fresh project, run the included SQL migrations in numeric order in the SQL Editor:

| Order | File in `supabase/migrations/` |
|---|---|
| 001 | `001_beta_foundation.sql` |
| 002 | `002_shared_support_notes.sql` |
| 003 | `003_coach_weekly_reviews.sql` |
| 004 | `004_admin_full_access.sql` |
| 005 | `005_family_accounts_junior_player.sql` |
| 006 | `006_parent_support_scheduling_results.sql` |
| 007 | `007_family_reliability_admin_diagnostics.sql` |
| 008 | `008_connection_setup_reliability.sql` |
| 009 | `009_player_more_cloud_test_athletes.sql` |
| 010 | `010_connected_trackers_player_parent_only.sql` |
| 011 | `011_google_health_fitbit_migration.sql` |
| 012 | `012_kinexon_opt_in_coach_sharing.sql` |
| 013 | `013_youth_privacy_closed_beta.sql` |
| 014 | `014_parent_player_claim_code_repair.sql` |
| 015 | `015_multi_sport_team_family_profiles.sql` |
| 016 | `016_combat_tennis_volleyball_sports.sql` |

Follow the initial admin setup in migration 001 and `supabase/README.md`, then approve Coach/Admin access using the existing account flow. Installing tables 010–012 does not enable tracker connectivity: the application gate remains disabled.
