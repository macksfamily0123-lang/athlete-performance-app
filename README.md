# Athlete Performance App — Phase 72.3.88 RC38

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
