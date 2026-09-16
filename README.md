# Athlete Performance App — Phase 72.3.95 RC45

## RC45 — Tracker connectivity removed for now

This safety release removes all tracker connection, sync, imported-data display, and Coach tracker-sharing entry points from Player, Parent, Coach, and Admin experiences. The tracker API routes and provider connection/sync modules are removed.

No tracker provider credentials are required. Historical migrations 010, 011, and 012 remain in the package only to preserve databases where they were already applied; do not roll them back or delete existing rows manually. Manual testing, readiness, workouts, goals, analytics, Supabase, roles, Junior mode, photos, cloud test athletes, and all unrelated functionality remain available.


## RC42 — Clear Tracker Connection Center
Player and Parent experiences now expose Connected Trackers in three clear places: Home, Settings, and Recovery & Readiness. Coach/Admin preview modes can see where the feature lives but cannot connect or view private tracker data. No new database migration is required for RC41.

## Combined RC36 + RC37 + RC38 release

This is one full installable app package that includes the RC36 accessibility/role-hero baseline, the RC37 Performance Intelligence and interaction work, and the RC38 reliability/notifications/beta-hardening work.

### RC36 preserved
- Text sizing up to 180%.
- Full-fill Parent and Coach heroes.
- Wide Player game hero.
- Working Settings portal.
- Persistent navigation, setup modal, roles/permissions, Junior mode, Player More, cloud test athletes, player photos and Supabase integration.

### RC37 — Performance Intelligence & Interaction
- Player Home now has a Performance Intelligence recommendation built from readiness, goals, training consistency and recent testing momentum.
- More decisive next-action guidance: recovery-first, train with intent, build on testing momentum, finish a goal step, or build a cleaner data signal.
- Subtle hero/signal/chart motion with full `prefers-reduced-motion` support.
- Additional front-to-back visual consistency rules to keep non-Junior screens flatter and more performance-instrument-like.

### RC38 — Reliability, Alerts & Beta Hardening
- New in-app Alerts center for recovery, training, goal milestones, progress trends and cloud-sync issues.
- Alert preferences are stored locally in Settings.
- New always-visible beta reliability rail for online/offline, cloud status and local recovery-point status.
- Athlete snapshots now timestamp a local recovery point whenever data changes.
- Settings can download a JSON recovery backup of the active athlete.
- Sign-in now includes a Forgot password flow through Supabase.
- Service worker upgraded with versioned app-shell/static-asset caching and navigation fallback.
- Existing cloud retry/local queue behavior remains preserved.

### Database
No new Supabase migration is required. Migration 009 is unchanged byte-for-byte.

### Connected Trackers — RC39
Connected Trackers is intentionally private to Player and authorized Parent accounts. Coach and Admin roles cannot query tracker metrics.

Before enabling live providers, run `supabase/migrations/010_connected_trackers_player_parent_only.sql`, add the server-only Supabase service-role key and tracker encryption key in Vercel, then add OAuth credentials for any providers you want to enable. Provider redirect URLs use `/api/trackers/oauth/callback/<provider>` on the deployed beta domain.

### Google Health / Fitbit — RC40
RC40 migrates new Fitbit/Pixel Watch connections from the legacy Fitbit Web API to Google Health OAuth 2.0. Player and authorized Parent accounts can connect Google Health in Settings, then import recent workouts, sleep duration/efficiency, daily resting heart rate and HRV. Coach and Admin remain denied access to tracker data. Run migration 011 after migration 010 before testing the connection.
